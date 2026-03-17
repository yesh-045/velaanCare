'use client';

import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout';
import { mockRecipes } from '@/data/mock-data';
import Link from 'next/link';
import { Clock, Users, Flame, ArrowLeft, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RecipeDetailPage() {
  const params = useParams();
  const recipeId = params.id as string;
  
  const recipe = mockRecipes.find(r => r.id === recipeId);

  if (!recipe) {
    return (
      <DashboardLayout variant="freshbites">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Recipe not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout variant="freshbites">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/recipes" 
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Recipes
        </Link>

        <div className="grid grid-cols-2 gap-8">
          <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
              <svg className="w-20 h-20 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
          </div>

          <div>
            <span className={cn(
              'text-xs font-medium uppercase',
              recipe.category === 'breakfast' && 'text-orange-500',
              recipe.category === 'lunch' && 'text-green-500',
              recipe.category === 'dinner' && 'text-blue-500',
              recipe.category === 'snack' && 'text-purple-500'
            )}>
              {recipe.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{recipe.title}</h1>
            <p className="text-gray-500 mt-2">{recipe.description}</p>

            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Prep: {recipe.prepTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Cook: {recipe.cookTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{recipe.servings} servings</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Garden Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {recipe.plantTags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full capitalize">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 mt-8">
          <div className="col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ingredients</h2>
              <ul className="space-y-3">
                {recipe.ingredients.map((ing, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className={cn(
                      'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0',
                      ing.fromGarden ? 'bg-green-100' : 'bg-gray-100'
                    )}>
                      {ing.fromGarden && <Check className="h-3 w-3 text-green-600" />}
                    </div>
                    <span className="text-sm text-gray-600">
                      <span className="font-medium">{ing.amount}</span> {ing.name}
                      {ing.fromGarden && <span className="text-green-500 text-xs ml-1">(from garden)</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Nutrition Facts</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Calories</span>
                  <span className="font-medium text-gray-900">{recipe.nutritionalInfo.calories}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Protein</span>
                  <span className="font-medium text-gray-900">{recipe.nutritionalInfo.protein}g</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Carbs</span>
                  <span className="font-medium text-gray-900">{recipe.nutritionalInfo.carbs}g</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Fat</span>
                  <span className="font-medium text-gray-900">{recipe.nutritionalInfo.fat}g</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Fiber</span>
                  <span className="font-medium text-gray-900">{recipe.nutritionalInfo.fiber}g</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h2>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-green-700">{index + 1}</span>
                    </div>
                    <p className="text-gray-600 pt-1">{instruction}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
