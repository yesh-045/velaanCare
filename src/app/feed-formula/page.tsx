'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { mockCompostGuides, mockNutrientInfo } from '@/data/mock-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, BookOpen, Leaf, Beaker, ArrowRight, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function FeedFormulaPage() {
  const [activeTab, setActiveTab] = useState('nutrients');

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">FeedFormula</h1>
            <p className="text-muted-foreground mt-1">
              Master the science of plant nutrition and composting.
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px] p-1 bg-muted/50">
            <TabsTrigger value="nutrients" className="gap-2 data-[state=active]:bg-background"><Beaker className="h-4 w-4" /> NPK</TabsTrigger>
            <TabsTrigger value="compost" className="gap-2 data-[state=active]:bg-background"><Leaf className="h-4 w-4" /> Compost</TabsTrigger>
            <TabsTrigger value="tips" className="gap-2 data-[state=active]:bg-background"><BookOpen className="h-4 w-4" /> Guides</TabsTrigger>
          </TabsList>

          <TabsContent value="nutrients" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid gap-6 md:grid-cols-3">
              {mockNutrientInfo.map((nutrient) => (
                <Card key={nutrient.symbol} className="overflow-hidden border-t-4 border-t-primary shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        'w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-inner',
                        nutrient.symbol === 'N' && 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
                        nutrient.symbol === 'P' && 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
                        nutrient.symbol === 'K' && 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                      )}>
                        {nutrient.symbol}
                      </div>
                      <div>
                        <CardTitle>{nutrient.name}</CardTitle>
                        <CardDescription>Primary Macronutrient</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-sm text-muted-foreground leading-relaxed">{nutrient.description}</p>
                    
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Check className="h-3 w-3" /> Key Benefits
                      </h4>
                      <ul className="space-y-2">
                        {nutrient.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="space-y-3 pt-2 border-t">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-3">Common Sources</h4>
                      <div className="flex flex-wrap gap-2">
                        {nutrient.sources.map((source, index) => (
                          <Badge key={index} variant="secondary" className="font-normal bg-muted/50 hover:bg-muted">
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-muted/30 border-none shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Understanding NPK Ratios
                </CardTitle>
                <CardDescription>
                  Fertilizer bags display three numbers (e.g., 10-10-10) representing the percentage of Nitrogen, Phosphorus, and Potassium.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="bg-background border-muted/60 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Leafy Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-blue-600 hover:bg-blue-700">High N</Badge>
                        <span className="text-sm text-muted-foreground font-mono">30-10-10</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Best for lettuce, spinach, and lawns.</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-background border-muted/60 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Flowering & Fruit</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-orange-600 hover:bg-orange-700">High P</Badge>
                        <span className="text-sm text-muted-foreground font-mono">10-30-10</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Ideal for tomatoes, peppers, and roses.</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-background border-muted/60 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Root Development</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-purple-600 hover:bg-purple-700">High K</Badge>
                        <span className="text-sm text-muted-foreground font-mono">10-10-30</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Perfect for carrots, potatoes, and beets.</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compost" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {mockCompostGuides.map((guide) => (
              <Card key={guide.id} className="border-l-4 border-l-green-500 shadow-sm">
                <CardHeader>
                  <CardTitle>{guide.title}</CardTitle>
                  <CardDescription>Step-by-step guide to creating black gold</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative border-l-2 border-muted ml-4 space-y-10 py-2">
                    {guide.steps.map((step, i) => (
                      <div key={step.stepNumber} className="relative pl-8 group">
                        <div className="absolute -left-[17px] top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-muted-foreground group-hover:bg-green-500 group-hover:text-white transition-colors shadow-sm">
                          <span className="text-sm font-bold">{step.stepNumber}</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <h3 className="font-semibold text-lg leading-none group-hover:text-green-600 transition-colors">{step.title}</h3>
                            {step.duration && (
                              <Badge variant="outline" className="w-fit text-xs font-normal">
                                {step.duration}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-green-200 bg-green-50/30 dark:bg-green-900/10 dark:border-green-900/30">
                <CardHeader>
                  <CardTitle className="text-green-700 dark:text-green-400 flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    Green Materials (Nitrogen)
                  </CardTitle>
                  <CardDescription>Moist, fresh organic matter. Add 1 part for every 2 parts brown.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-2 gap-3">
                    {['Grass clippings', 'Fruit scraps', 'Veggie peels', 'Coffee grounds', 'Tea bags', 'Fresh leaves', 'Plant trimmings', 'Eggshells'].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                        <Check className="h-3 w-3 text-green-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-amber-200 bg-amber-50/30 dark:bg-amber-900/10 dark:border-amber-900/30">
                <CardHeader>
                  <CardTitle className="text-amber-700 dark:text-amber-400 flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-amber-500" />
                    Brown Materials (Carbon)
                  </CardTitle>
                  <CardDescription>Dry, woody organic matter. Add 2 parts for every 1 part green.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-2 gap-3">
                    {['Dry leaves', 'Cardboard', 'Paper', 'Straw & hay', 'Wood chips', 'Sawdust', 'Pine needles', 'Twigs'].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                        <Check className="h-3 w-3 text-amber-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tips" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Fertilizing Schedule</CardTitle>
                  <CardDescription>When to feed your plants for best results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded-md w-fit">
                      <Check className="h-4 w-4" /> Best Times
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground ml-2">
                      <li className="flex items-start gap-2"><span className="text-green-500">•</span> Early morning or late afternoon</li>
                      <li className="flex items-start gap-2"><span className="text-green-500">•</span> During active growth periods (Spring/Summer)</li>
                      <li className="flex items-start gap-2"><span className="text-green-500">•</span> After watering (never on dry soil)</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-md w-fit">
                      <X className="h-4 w-4" /> Avoid
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground ml-2">
                      <li className="flex items-start gap-2"><span className="text-red-500">•</span> During dormancy (Winter)</li>
                      <li className="flex items-start gap-2"><span className="text-red-500">•</span> Immediately after transplanting</li>
                      <li className="flex items-start gap-2"><span className="text-red-500">•</span> During extreme heat waves</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Deficiency Identification</CardTitle>
                  <CardDescription>Visual signs of nutrient lack</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-xs shrink-0 dark:bg-blue-900 dark:text-blue-300">N</div>
                      <div>
                        <p className="font-medium text-sm text-foreground">Nitrogen Deficiency</p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Old leaves turn yellow starting from the tip. Overall stunted growth and pale foliage.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-50/50 border border-orange-100 dark:bg-orange-900/10 dark:border-orange-900/30 transition-colors hover:bg-orange-50 dark:hover:bg-orange-900/20">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600 text-xs shrink-0 dark:bg-orange-900 dark:text-orange-300">P</div>
                      <div>
                        <p className="font-medium text-sm text-foreground">Phosphorus Deficiency</p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Leaves turn dark green with purple or reddish tints. Poor flowering and weak roots.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-purple-50/50 border border-purple-100 dark:bg-purple-900/10 dark:border-purple-900/30 transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/20">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-600 text-xs shrink-0 dark:bg-purple-900 dark:text-purple-300">K</div>
                      <div>
                        <p className="font-medium text-sm text-foreground">Potassium Deficiency</p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Edges of older leaves turn brown and crispy ("scorched"). Weak stems and small fruit.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-sm border-muted/60">
              <CardHeader>
                <CardTitle>Fertilizer Types Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[200px]">Type</TableHead>
                      <TableHead>Release Speed</TableHead>
                      <TableHead>Recommended Use</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-muted/50">
                      <TableCell className="font-medium">Liquid Fertilizer</TableCell>
                      <TableCell><Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300">Fast</Badge></TableCell>
                      <TableCell className="text-muted-foreground">Quick nutrient boost, container plants</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-muted/50">
                      <TableCell className="font-medium">Granular Fertilizer</TableCell>
                      <TableCell><Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300">Medium</Badge></TableCell>
                      <TableCell className="text-muted-foreground">Garden beds, lawns, general purpose</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-muted/50">
                      <TableCell className="font-medium">Slow-Release Spikes</TableCell>
                      <TableCell><Badge variant="outline" className="border-blue-200 text-blue-700 dark:text-blue-300 dark:border-blue-800">Slow</Badge></TableCell>
                      <TableCell className="text-muted-foreground">Long-term feeding, houseplants</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-muted/50">
                      <TableCell className="font-medium">Organic Compost</TableCell>
                      <TableCell><Badge variant="outline" className="border-muted text-muted-foreground">Very Slow</Badge></TableCell>
                      <TableCell className="text-muted-foreground">Soil health improvement, mulching</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
