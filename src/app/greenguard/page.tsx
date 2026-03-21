'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { GreenGuardService, ChatMessage } from '@/services/greenguard.service';
import { Upload, Loader2, CheckCircle2, ScanLine, X, ImageIcon, Send, User, Bot } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const greenGuardClient = new GreenGuardService();

export default function GreenGuardPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Load existing chat history on mount
  useEffect(() => {
    const history = greenGuardClient.getChatHistory();
    if (history.length > 0) {
      setChatHistory(history);
      // We can optionally set the analysisResult to the first assistant message
      if (history[0] && history[0].role === 'assistant') {
        setAnalysisResult(history[0].content);
      }
    }
  }, []);

  // Auto scroll chat to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setAnalysisResult(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    greenGuardClient.clearHistory();
    setChatHistory([]);
    try {
      const result = await greenGuardClient.analyzeImage(selectedFile);
      setAnalysisResult(result.description);
      setChatHistory(greenGuardClient.getChatHistory());
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to connect to GreenGuard Microservice.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatting) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setIsChatting(true);

    // Optimistically update UI
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      let currentResponse = '';
      
      // We append a temporary empty assistant message
      setChatHistory(prev => [...prev, { role: 'assistant', content: '' }]);

      await greenGuardClient.chat(userMessage, (chunk) => {
        currentResponse += chunk;
        setChatHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].content = currentResponse;
          return newHistory;
        });
      });
    } catch (error) {
      console.error('Chat failed:', error);
    } finally {
      setIsChatting(false);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    greenGuardClient.clearHistory();
    setChatHistory([]);
  };

  return (
    <DashboardLayout variant="greenguard">
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">GreenGuard AI</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Advanced plant disease detection powered by Multimodal AI. Upload a photo to identify issues and ask follow-up questions for treatment.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Upload Area */}
          <div className="space-y-4">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !previewUrl && fileInputRef.current?.click()}
              className={cn(
                "relative flex flex-col items-center justify-center w-full h-80 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden bg-card hover:bg-muted/50",
                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                previewUrl ? "cursor-default border-none" : ""
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
              />
              
              {previewUrl ? (
                <div className="relative w-full h-full group">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 z-10">
                    <Button 
                      size="icon" 
                      variant="destructive" 
                      className="h-8 w-8 rounded-full shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        resetUpload();
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-20">
                      <div className="relative">
                        <ScanLine className="h-12 w-12 text-primary animate-pulse" />
                        <div className="absolute inset-0 border-4 border-primary/30 rounded-lg animate-ping" />
                      </div>
                      <p className="font-medium text-foreground animate-pulse">Analyzing with Qwen-VL...</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-6 space-y-4">
                  <div className="p-4 bg-muted/50 rounded-full inline-block group-hover:bg-primary/10 transition-colors">
                    <ImageIcon className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <p className="font-medium text-lg text-foreground">Drop photo here</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      or click to browse
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground/60">
                    Supports JPG, PNG up to 10MB
                  </p>
                </div>
              )}
            </div>

            <Button
              size="lg"
              className="w-full"
              disabled={!selectedFile || isAnalyzing || !!analysisResult}
              onClick={handleUpload}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Image...
                </>
              ) : (
                <>
                  <ScanLine className="mr-2 h-4 w-4" />
                  Analyze Plant Health
                </>
              )}
            </Button>
          </div>

          {/* Results Area */}
          <div className="space-y-4 flex flex-col h-full max-h-[600px]">
            {chatHistory.length > 0 ? (
              <Card className="flex flex-col h-full border-l-4 border-l-primary shadow-lg animate-in fade-in flex-grow overflow-hidden">
                <CardHeader className="bg-muted/10 pb-4 shrink-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        GreenGuard Chat
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </CardTitle>
                      <CardDescription>
                        Ask follow-up questions about the diagnosed disease
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                {/* Chat Messages */}
                <CardContent className="flex flex-col flex-grow overflow-hidden p-0">
                  <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                    {chatHistory.map((msg, i) => (
                      <div key={i} className={cn("flex gap-3", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                        {msg.role === 'assistant' && (
                          <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Bot className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <div className={cn(
                          "px-4 py-2 rounded-lg text-sm max-w-[85%]",
                          msg.role === 'user' 
                            ? "bg-primary text-primary-foreground rounded-tr-none" 
                            : "bg-muted border rounded-tl-none whitespace-pre-wrap"
                        )}>
                          {msg.content}
                        </div>
                        {msg.role === 'user' && (
                          <div className="h-8 w-8 shrink-0 rounded-full bg-primary flex items-center justify-center">
                            <User className="h-4 w-4 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    ))}
                    {isChatting && (
                      <div className="flex justify-start gap-3">
                        <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <div className="px-4 py-2 rounded-lg text-sm bg-muted border rounded-tl-none flex items-center gap-2">
                          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                          <span className="text-muted-foreground">Thinking...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chat Input form */}
                  <form onSubmit={handleChatSubmit} className="p-4 bg-muted/20 border-t flex gap-2 shrink-0">
                    <Input 
                      placeholder="Ask about organic treatments..." 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      disabled={isChatting}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!chatInput.trim() || isChatting} size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center bg-muted/10 border-dashed hover:bg-muted/20 transition-colors min-h-[400px]">
                <CardContent className="text-center py-12">
                  <div className="mx-auto w-16 h-16 rounded-full bg-background flex items-center justify-center mb-4 shadow-sm border">
                    <ScanLine className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground">Awaiting Analysis</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto mt-2 text-sm">
                    Upload an image first to begin the diagnostic chat.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
