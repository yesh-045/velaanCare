'use client';

import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout';
import { PlantCard } from '@/components/garden';
import { mockGardens, getPlantsByGarden } from '@/data/mock-data';
import { Leaf, Plus } from 'lucide-react';
import Link from 'next/link';

export default function GardenDetailPage() {
  const params = useParams();
  const gardenId = params.id as string;
  
  const garden = mockGardens.find(g => g.id === gardenId);
  const plants = getPlantsByGarden(gardenId);

  if (!garden) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Garden not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
              <Leaf className="h-7 w-7 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{garden.name}</h1>
              <p className="text-gray-500">{plants.length} plants in this garden</p>
            </div>
          </div>
          <Link
            href="/plants"
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Plant
          </Link>
        </div>

        {plants.length > 0 ? (
          <div className="grid grid-cols-4 gap-4">
            {plants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Leaf className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No plants yet</h3>
            <p className="text-gray-500 mb-4">Start adding plants to your garden.</p>
            <Link
              href="/plants"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Your First Plant
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
