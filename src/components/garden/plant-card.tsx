'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Plant } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Droplets } from 'lucide-react';

interface PlantCardProps {
  plant: Plant;
}

export function PlantCard({ plant }: PlantCardProps) {
  const statusConfig = {
    healthy: {
      label: 'Healthy',
      badge: 'default' as const,
      className: 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700',
    },
    'needs-attention': {
      label: 'Attention',
      badge: 'secondary' as const,
      className: 'bg-yellow-500 hover:bg-yellow-600 text-white dark:bg-yellow-600 dark:hover:bg-yellow-700',
    },
    critical: {
      label: 'Critical',
      badge: 'destructive' as const,
      className: 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700',
    },
  };

  const config = statusConfig[plant.healthStatus];

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg border-muted/60 dark:border-muted/40">
      <Link href={`/plants/${plant.id}`}>
        <div className="relative">
          <AspectRatio ratio={4 / 3}>
            <Image
              src={plant.image}
              alt={plant.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </AspectRatio>
          {/* Subtle gradient overlay for better text readability if we add text over image later */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute top-2 right-2">
            <Badge 
              variant={config.badge} 
              className={cn('shadow-sm transition-colors', config.className)}
            >
              {config.label}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                {plant.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 font-medium">
                {plant.species}
              </p>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
              <Droplets className="h-3.5 w-3.5 text-blue-500" />
              <span>{new Date(plant.lastWatered).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary font-medium">
              View Details →
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
