'use client';

import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface QuickAddPlantProps {
  onAdd: (name: string, species: string) => void;
}

export function QuickAddPlant({ onAdd }: QuickAddPlantProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !species) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onAdd(name, species);
    setName('');
    setSpecies('');
    setIsLoading(false);
    setOpen(false);
    toast.success(`Added ${name} to your garden`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
          <Plus className="h-4 w-4" />
          Add Plant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Plant</DialogTitle>
          <DialogDescription>
            Enter the details of your new plant below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Plant Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., My Tomato"
                className="col-span-3"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="species">Species</Label>
              <Input
                id="species"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                placeholder="e.g., Solanum lycopersicum"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Plant
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
