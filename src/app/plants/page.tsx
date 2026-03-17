'use client';

import { DashboardLayout } from '@/components/layout';
import { PlantCard } from '@/components/garden';
import { mockPlants, mockGardens } from '@/data/mock-data';
import { useState } from 'react';
import { Search, LayoutGrid, List as ListIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function PlantsPage() {
  const [selectedGarden, setSelectedGarden] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredPlants = mockPlants.filter((plant) => {
    const matchesGarden = selectedGarden === 'all' || plant.gardenId === selectedGarden;
    const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          plant.species.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGarden && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plants</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor your entire botanical collection.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-1">
          <div className="flex flex-1 gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search plants..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedGarden} onValueChange={setSelectedGarden}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Garden" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Gardens</SelectItem>
                {mockGardens.map((garden) => (
                  <SelectItem key={garden.id} value={garden.id}>
                    {garden.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as 'grid' | 'list')}>
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view">
                <ListIcon className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        <Separator />

        {filteredPlants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No plants found</h3>
            <p className="text-muted-foreground max-w-sm mt-2">
              We couldn&apos;t find any plants matching your filters. Try adjusting your search or selected garden.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSelectedGarden('all');
                setSearchQuery('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
            {filteredPlants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
