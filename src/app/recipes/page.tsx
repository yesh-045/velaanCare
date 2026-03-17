'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { mockRecipes, mockGardens } from '@/data/mock-data';
import { Recipe, RecipeCategory } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Utensils, ChefHat, Leaf, Flame, ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const categories: { value: RecipeCategory; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snacks' },
];

export default function RecipesPage() {
  const [activeCategory, setActiveCategory] = useState<RecipeCategory>('all');

  const filteredRecipes = activeCategory === 'all' 
    ? mockRecipes 
    : mockRecipes.filter(r => r.category === activeCategory);

  return (
    <DashboardLayout variant="freshbites">
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">FreshBites Kitchen</h1>
            <p className="text-muted-foreground mt-1">
              Delicious recipes featuring your homegrown harvest.
            </p>
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={(val) => setActiveCategory(val as RecipeCategory)} className="w-full">
          <TabsList className="grid w-full max-w-[600px] grid-cols-5 p-1 bg-muted/50">
            {categories.map((cat) => (
              <TabsTrigger 
                key={cat.value} 
                value={cat.value}
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
              >
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-muted/60 group hover:border-primary/20">
      <div className="relative h-52 w-full bg-muted overflow-hidden">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
        <div className="absolute top-3 right-3">
          <Badge className="capitalize shadow-md bg-background/80 hover:bg-background text-foreground backdrop-blur-sm border-none">
            {recipe.category}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 drop-shadow-md">
            {recipe.title}
          </h3>
        </div>
      </div>
      
      <CardContent className="flex-1 p-5 space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {recipe.description}
        </p>
        
        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg border border-border/50">
          <div className="flex flex-col items-center justify-center gap-1 p-1">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium">{parseInt(recipe.prepTime) + parseInt(recipe.cookTime)}m</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 p-1 border-l border-r border-border/50">
            <Utensils className="h-3.5 w-3.5 text-orange-500" />
            <span className="font-medium">{recipe.servings} ppl</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 p-1">
            <Flame className="h-3.5 w-3.5 text-red-500" />
            <span className="font-medium">{recipe.nutritionalInfo.calories}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {recipe.plantTags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px] bg-green-50 text-green-700 border-green-100 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-900/30 font-normal px-2">
              <Leaf className="h-2.5 w-2.5 mr-1" />
              {tag}
            </Badge>
          ))}
          {recipe.plantTags.length > 3 && (
            <Badge variant="secondary" className="text-[10px] px-1.5 font-normal">+{recipe.plantTags.length - 3}</Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" variant="outline">
              View Recipe <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-0 gap-0 rounded-xl">
            <div className="relative h-64 w-full">
              <Image
                src={recipe.image}
                alt={recipe.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <Badge className="mb-2 bg-primary text-primary-foreground hover:bg-primary border-none">{recipe.category}</Badge>
                <DialogTitle className="text-3xl font-bold mb-2 text-white drop-shadow-md">{recipe.title}</DialogTitle>
                <DialogDescription className="text-gray-200 line-clamp-2 max-w-xl">{recipe.description}</DialogDescription>
              </div>
              <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md rounded-lg p-2 flex gap-4 text-white text-xs font-medium border border-white/10">
                <div className="flex flex-col items-center">
                  <span className="opacity-70 text-[10px] uppercase">Time</span>
                  <span>{parseInt(recipe.prepTime) + parseInt(recipe.cookTime)} min</span>
                </div>
                <div className="w-px bg-white/20" />
                <div className="flex flex-col items-center">
                  <span className="opacity-70 text-[10px] uppercase">Calories</span>
                  <span>{recipe.nutritionalInfo.calories}</span>
                </div>
                <div className="w-px bg-white/20" />
                <div className="flex flex-col items-center">
                  <span className="opacity-70 text-[10px] uppercase">Protein</span>
                  <span>{recipe.nutritionalInfo.protein}g</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 md:p-8 grid md:grid-cols-[1fr_1.5fr] gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-primary">
                    <Utensils className="h-5 w-5" /> Ingredients
                  </h3>
                  <ScrollArea className="h-auto max-h-[400px] rounded-xl border bg-muted/20 p-1">
                    <ul className="divide-y divide-border/50">
                      {recipe.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-center justify-between py-3 px-3 hover:bg-muted/50 transition-colors rounded-lg">
                          <span className="font-medium text-sm">{ing.name}</span>
                          <Badge variant="outline" className="font-mono text-xs bg-background">{ing.amount}</Badge>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/30">
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2 flex items-center gap-2 text-sm">
                    <Leaf className="h-4 w-4" /> Garden Harvest
                  </h4>
                  <p className="text-xs text-green-700 dark:text-green-400">
                    This recipe uses fresh {recipe.plantTags.join(', ')} from your garden!
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
                  <ChefHat className="h-5 w-5" /> Instructions
                </h3>
                <div className="space-y-6">
                  {recipe.instructions.map((step, i) => (
                    <div key={i} className="flex gap-4 group">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {i + 1}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed pt-1.5 border-b border-border/40 pb-4 w-full group-last:border-none group-hover:text-foreground transition-colors">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
