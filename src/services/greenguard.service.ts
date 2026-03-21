export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface DiseaseReport {
  description: string;
}

export class GreenGuardService {
  private readonly baseUrl = 'http://localhost:4000';
  private readonly STORAGE_KEY = 'greenguard_chat_history';

  /**
   * Hits the /find endpoint with the image and returns a single sentence description.
   * Initializes the chat history with this description.
   */
  async analyzeImage(file: File): Promise<DiseaseReport> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${this.baseUrl}/find`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to analyze image');
    }

    const data = await response.json();
    
    // Setup initial AI message context for the chat
    this.saveChatHistory([
      { role: 'assistant', content: `I have analyzed the image: ${data.description}` }
    ]);
    
    return { description: data.description };
  }

  /**
   * Sends the user's message to the /chat endpoint using existing history.
   * Streams the response text using the `onChunk` callback.
   */
  async chat(userMessage: string, onChunk?: (chunk: string) => void): Promise<string> {
    const history = this.getChatHistory();
    const newMessages: ChatMessage[] = [...history, { role: 'user', content: userMessage }];
    
    // Pre-save the user message to storage so it persists if the response fails
    this.saveChatHistory(newMessages);

    const response = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: newMessages }),
    });

    if (!response.ok || !response.body) {
      throw new Error('Failed to chat with GreenGuard');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunkStr = decoder.decode(value, { stream: true });
      fullResponse += chunkStr;
      if (onChunk) onChunk(chunkStr);
    }

    // Save final assistant response to history
    this.saveChatHistory([...newMessages, { role: 'assistant', content: fullResponse }]);
    
    return fullResponse;
  }

  /**
   * Retrieves the chat history from browser localStorage
   */
  getChatHistory(): ChatMessage[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Replaces chat history in localStorage
   */
  private saveChatHistory(messages: ChatMessage[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(messages));
  }

  /**
   * Clears the current chat session
   */
  clearHistory(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
