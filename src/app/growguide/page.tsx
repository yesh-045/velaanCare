'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { mockCropRecommendations } from '@/data/mock-data';
import { getRecommendedCrops } from '@/services/garden-service';
import { CropRecommendation, GrowGuideInput } from '@/types';
import { Star, Clock, Sun, Maximize2, Sprout, Filter, X, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export default function GrowGuidePage() {
  const [input, setInput] = useState<GrowGuideInput>({
    growingSpace: 'medium',
    sunlight: 'full',
    maintenancePreference: 'medium',
  });
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>(mockCropRecommendations);
  const [hasSearched, setHasSearched] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleGetRecommendations = () => {
    const results = getRecommendedCrops(input);
    setRecommendations(results);
    setHasSearched(true);
  };

  const clearFilters = () => {
    setInput({
      growingSpace: 'medium',
      sunlight: 'full',
      maintenancePreference: 'medium',
    });
    setRecommendations(mockCropRecommendations);
    setHasSearched(false);
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Growing Space</Label>
        <Select 
          value={input.growingSpace} 
          onValueChange={(val: any) => setInput({ ...input, growingSpace: val })}
        >
          <SelectTrigger className="w-full bg-background border-muted hover:border-primary/50 transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small (Balcony/Window)</SelectItem>
            <SelectItem value="medium">Medium (Patio)</SelectItem>
            <SelectItem value="large">Large (Backyard)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Sunlight</Label>
        <Select 
          value={input.sunlight} 
          onValueChange={(val: any) => setInput({ ...input, sunlight: val })}
        >
          <SelectTrigger className="w-full bg-background border-muted hover:border-primary/50 transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full">Full Sun (6+ hrs)</SelectItem>
            <SelectItem value="partial">Partial Sun (3-6 hrs)</SelectItem>
            <SelectItem value="shade">Shade ({'<'}3 hrs)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Maintenance</Label>
        <Select 
          value={input.maintenancePreference} 
          onValueChange={(val: any) => setInput({ ...input, maintenancePreference: val })}
        >
          <SelectTrigger className="w-full bg-background border-muted hover:border-primary/50 transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low Effort</SelectItem>
            <SelectItem value="medium">Weekly Care</SelectItem>
            <SelectItem value="high">Daily Care</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-3 pt-6 border-t">
        <Button onClick={handleGetRecommendations} className="flex-1 shadow-md hover:shadow-lg transition-all">
          Find Crops
        </Button>
        {hasSearched && (
          <Button variant="outline" size="icon" onClick={clearFilters} className="shrink-0">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 h-full flex flex-col max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">GrowGuide</h1>
            <p className="text-muted-foreground text-lg">
              Discover the perfect crops for your unique growing conditions.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as 'grid' | 'list')} className="bg-muted/50 p-1 rounded-lg border">
              <ToggleGroupItem value="grid" size="sm" aria-label="Grid view">
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" size="sm" aria-label="List view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden gap-2">
                  <Filter className="h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Garden Filters</SheetTitle>
                  <SheetDescription>Configure your growing environment.</SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <FilterPanel />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-8 flex-1 items-start">
          {/* Desktop Sidebar */}
          <div className="w-80 hidden md:block shrink-0 sticky top-4">
            <Card className="border-muted/60 shadow-md bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Your Environment</CardTitle>
                <CardDescription>Tell us about your space to get personalized suggestions</CardDescription>
              </CardHeader>
              <CardContent>
                <FilterPanel />
              </CardContent>
            </Card>
          </div>

          {/* Results Grid */}
          <div className="flex-1 w-full">
            {recommendations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-muted rounded-2xl bg-muted/5">
                <div className="rounded-full bg-muted/50 p-6 mb-6">
                  <Sprout className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No matching crops found</h3>
                <p className="text-muted-foreground max-w-sm mb-8 text-sm leading-relaxed">
                  Try adjusting your filters to find crops more suitable for your current conditions.
                </p>
                <Button variant="outline" onClick={clearFilters} className="min-w-[140px]">
                  Reset All Filters
                </Button>
              </div>
            ) : (
              <div className={cn(
                "grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500",
                viewMode === 'grid' ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1"
              )}>
                {recommendations.map((crop) => (
                  <Card key={crop.id} className={cn(
                    "overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/40 group bg-card border-muted/60",
                    viewMode === 'list' && "flex flex-row"
                  )}>
                    <div className={cn(
                      "relative bg-muted shrink-0 overflow-hidden",
                      viewMode === 'grid' ? "w-full h-48 sm:w-48 sm:h-auto" : "w-48 h-auto"
                    )}>
                      <Image
                        src={crop.image}
                        alt={crop.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:hidden" />
                      <Badge className={cn(
                        "absolute top-3 right-3 shadow-md border-none backdrop-blur-sm",
                        crop.difficulty === 'easy' ? "bg-green-500/90 text-white hover:bg-green-600" :
                        crop.difficulty === 'medium' ? "bg-yellow-500/90 text-white hover:bg-yellow-600" : "bg-red-500/90 text-white hover:bg-red-600"
                      )}>
                        {crop.difficulty}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-col flex-1 min-w-0">
                      <CardHeader className="pb-2 pt-5 px-5">
                        <div className="flex justify-between items-start gap-2">
                          <div className="space-y-1">
                            <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">{crop.name}</CardTitle>
                            <div className="flex items-center gap-1 text-yellow-500/90">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={cn(
                                    "h-3.5 w-3.5", 
                                    i < Math.floor(crop.rating) ? "fill-current" : "text-muted/20"
                                  )} 
                                />
                              ))}
                              <span className="text-xs font-semibold text-muted-foreground ml-2">({crop.rating})</span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="flex-1 pb-5 px-5 flex flex-col justify-between">
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-5 leading-relaxed">
                          {crop.description}
                        </p>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/40 p-2 rounded-md border border-border/50">
                              <Clock className="h-3.5 w-3.5 text-primary" />
                              <span>{crop.growTime}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/40 p-2 rounded-md border border-border/50">
                              <Sun className="h-3.5 w-3.5 text-orange-500" />
                              <span className="capitalize">{crop.sunlight}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/40 p-2 rounded-md border border-border/50 col-span-2">
                              <Maximize2 className="h-3.5 w-3.5 text-blue-500" />
                              <span className="capitalize">{crop.space} space required</span>
                            </div>
                          </div>
                          
                          <Button variant="ghost" className="w-full h-9 text-xs font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-all justify-between px-3 border border-transparent hover:border-primary/20">
                            View Planting Guide
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
