import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { Ollama } from 'ollama';
import { tavily } from '@tavily/core';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const upload = multer({ dest: uploadDir });

// Initialize native Ollama client
const ollama = new Ollama({
  host: process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434',
});

// 1. /find - Accepts an image and outputs a single sentence about the disease
app.post('/find', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = imageBuffer.toString('base64');

    const response = await ollama.chat({
      model: process.env.VISION_MODEL || 'qwen-vl',
      messages: [
        {
          role: 'user',
          content: 'Identify the plant species and describe any visible signs of disease, pests, or nutrient deficiency. Keep your answer strictly to a single, concise sentence.',
          images: [base64Image]
        }
      ]
    });

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    // native ollama returns text directly in message.content
    res.json({ description: response.message.content });
  } catch (error: any) {
    console.error('Error in /find endpoint:', error);
    res.status(500).json({ error: 'Failed to analyze image', details: error.message, stack: error.stack });
  }
});

// 2. /chat - Accepts chat history and streams response
app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Valid messages array is required' });
    }

    // 1. Tavily Search for context (if API key provided)
    let searchContext = '';
    if (process.env.TAVILY_API_KEY) {
      try {
        const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
        const lastUserMessage = messages[messages.length - 1].content;
        
        // Search web for agricultural advice matching user query
        const searchResponse = await tvly.search(`${lastUserMessage} agriculture plant disease care`, {
          searchDepth: 'basic',
          maxResults: 3,
        });

        if (searchResponse.results && searchResponse.results.length > 0) {
          searchContext = '\n\n**Factual Context from Web Search**\n' + searchResponse.results.map((r: any) => `- ${r.title}: ${r.content}`).join('\n');
        }
      } catch (err) {
        console.error('Tavily search failed (falling back to LLM knowledge):', err);
      }
    }

    // Set HTTP headers for text stream
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    const stream = await ollama.chat({
      model: process.env.CHAT_MODEL || 'qwen:0.5b',
      messages: [
        { role: 'system', content: `You are an expert plant pathologist and agronomist named GreenGuard. You base your advice off the diagnostic findings provided by the user. Keep your answers concise, practical, and factual.${searchContext}` },
        ...messages
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      res.write(chunk.message.content);
    }
    
    res.end();
  } catch (error: any) {
    console.error('Error in /chat endpoint:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to generate chat response', details: error.message });
    } else {
      res.end(`\n\n[Error Stream Terminated: ${error.message}]`);
    }
  }
});

app.listen(port, () => {
  console.log(`GreenGuard Native Ollama Microservice running on port ${port}`);
});
