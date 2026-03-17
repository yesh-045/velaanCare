'use client';

import { useState, useRef, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout';
import { DiseaseAnalysisResult } from '@/types';
import { analyzePlantDisease } from '@/services/garden-service';
import { Upload, Loader2, CheckCircle2, AlertTriangle, ScanLine, X, ImageIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function GreenGuardPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiseaseAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
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
    try {
      const analysisResult = await analyzePlantDisease(selectedFile);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setResult(analysisResult);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
  };

  return (
    <DashboardLayout variant="greenguard">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">GreenGuard AI</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Advanced plant disease detection powered by computer vision. Upload a photo to identify issues and receive expert treatment recommendations.
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
                      <p className="font-medium text-foreground animate-pulse">Analyzing leaf patterns...</p>
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
              disabled={!selectedFile || isAnalyzing || !!result}
              onClick={handleUpload}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
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
          <div className="space-y-4 h-full">
            {result ? (
              <Card className="h-full border-l-4 border-l-primary shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
                <CardHeader className="bg-muted/10 pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        Analysis Complete
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </CardTitle>
                      <CardDescription>
                        Confidence Score: <span className="font-semibold text-foreground">{result.confidence}%</span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <Alert variant={result.diseaseName.toLowerCase().includes('healthy') ? 'default' : 'destructive'} className={cn(
                    "border transition-colors",
                    result.diseaseName.toLowerCase().includes('healthy') 
                      ? "border-green-500/50 bg-green-50/50 dark:bg-green-900/10 text-green-700 dark:text-green-400" 
                      : "border-red-500/50 bg-red-50/50 dark:bg-red-900/10 text-red-700 dark:text-red-400"
                  )}>
                    {result.diseaseName.toLowerCase().includes('healthy') ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                    <AlertTitle className="font-semibold">{result.diseaseName}</AlertTitle>
                    <AlertDescription>
                      {result.diseaseName.toLowerCase().includes('healthy') 
                        ? "Your plant shows no signs of disease."
                        : "Symptoms detected. Immediate action recommended."}
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      Recommended Treatment
                    </h3>
                    <div className="grid gap-3">
                      {result.recommendations.map((rec, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-lg bg-card border hover:border-primary/20 transition-colors">
                          <div className="mt-1">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                              <span className="font-bold text-xs text-primary">{i + 1}</span>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground text-sm">{rec.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                              {rec.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center bg-muted/10 border-dashed hover:bg-muted/20 transition-colors">
                <CardContent className="text-center py-12">
                  <div className="mx-auto w-16 h-16 rounded-full bg-background flex items-center justify-center mb-4 shadow-sm border">
                    <ScanLine className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground">Awaiting Analysis</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto mt-2 text-sm">
                    Upload an image to detect diseases, pests, or nutrient deficiencies.
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
