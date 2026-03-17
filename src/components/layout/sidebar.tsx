'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Leaf,
  Droplets,
  Sun,
  Thermometer,
  Sprout,
  ShieldCheck,
  UtensilsCrossed,
  BookOpen,
} from 'lucide-react';
import { Garden } from '@/types';

interface SidebarProps {
  gardens: Garden[];
  variant?: 'dashboard' | 'irrigation' | 'greenguard' | 'freshbites';
}

export function Sidebar({ gardens, variant = 'dashboard' }: SidebarProps) {
  const pathname = usePathname();

  if (variant === 'irrigation') {
    return (
      <aside className="w-56 bg-white border-r border-gray-200 min-h-screen p-4">
        <div className="flex items-center gap-2 mb-8">
          <Leaf className="h-6 w-6 text-green-500" />
          <span className="font-semibold text-lg">VelaanCare</span>
        </div>

        <nav className="space-y-1">
          <Link
            href="/dashboard"
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm',
              pathname === '/dashboard'
                ? 'bg-green-50 text-green-700'
                : 'text-gray-600 hover:bg-gray-50'
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/plants"
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm',
              pathname === '/plants'
                ? 'bg-green-50 text-green-700'
                : 'text-gray-600 hover:bg-gray-50'
            )}
          >
            <Leaf className="h-4 w-4" />
            Plants
          </Link>
          <Link
            href="/irrigation"
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm',
              pathname === '/irrigation'
                ? 'bg-green-50 text-green-700'
                : 'text-gray-600 hover:bg-gray-50'
            )}
          >
            <Droplets className="h-4 w-4" />
            Irrigation
          </Link>
          <Link
            href="/lighting"
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm',
              pathname === '/lighting'
                ? 'bg-green-50 text-green-700'
                : 'text-gray-600 hover:bg-gray-50'
            )}
          >
            <Sun className="h-4 w-4" />
            Lighting
          </Link>
          <Link
            href="/climate"
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm',
              pathname === '/climate'
                ? 'bg-green-50 text-green-700'
                : 'text-gray-600 hover:bg-gray-50'
            )}
          >
            <Thermometer className="h-4 w-4" />
            Climate
          </Link>
        </nav>
      </aside>
    );
  }

  if (variant === 'greenguard' || variant === 'freshbites') {
    return (
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-500" />
            <span className="font-semibold text-lg">VelaanCare</span>
          </div>

          <nav className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className={cn(
                'text-sm',
                pathname === '/dashboard' ? 'text-green-600 font-medium' : 'text-gray-600 hover:text-gray-900'
              )}
            >
              My Garden
            </Link>
            {variant === 'freshbites' && (
              <Link
                href="/recipes"
                className={cn(
                  'text-sm',
                  pathname === '/recipes' ? 'text-green-600 font-medium' : 'text-gray-600 hover:text-gray-900'
                )}
              >
                Recipes
              </Link>
            )}
            {variant === 'greenguard' && (
              <Link
                href="/greenguard"
                className={cn(
                  'text-sm',
                  pathname === '/greenguard' ? 'text-green-600 font-medium' : 'text-gray-600 hover:text-gray-900'
                )}
              >
                GreenGuard
              </Link>
            )}
            <Link
              href="/community"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Community
            </Link>
            <Link
              href="/learn"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Learn
            </Link>
            <Link
              href="/shop"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Shop
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-700 text-sm font-medium">U</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <aside className="w-56 bg-white border-r border-gray-200 min-h-screen p-4">
      <div className="flex items-center gap-2 mb-8">
        <Leaf className="h-6 w-6 text-green-500" />
        <span className="font-semibold text-lg">VelaanCare</span>
      </div>

      <div className="mb-6">
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
          My Garden
        </h3>
        <nav className="space-y-1">
          {gardens.map((garden) => (
            <Link
              key={garden.id}
              href={`/garden/${garden.id}`}
              className={cn(
                'block px-3 py-2 rounded-lg text-sm',
                pathname === `/garden/${garden.id}`
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <div className="font-medium">{garden.name}</div>
              <div className="text-xs text-green-500">{garden.plantCount} plants</div>
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <nav className="space-y-1">
          <Link
            href="/dashboard"
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm',
              pathname === '/dashboard'
                ? 'bg-green-50 text-green-700'
                : 'text-gray-600 hover:bg-gray-50'
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/growguide"
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm',
              pathname === '/growguide'
                ? 'bg-green-50 text-green-700'
                : 'text-gray-600 hover:bg-gray-50'
            )}
          >
            <Sprout className="h-4 w-4" />
            GrowGuide
          </Link>
          <Link
            href="/greenguard"
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm',
              pathname === '/greenguard'
                ? 'bg-green-50 text-green-700'
                : 'text-gray-600 hover:bg-gray-50'
            )}
          >
            <ShieldCheck className="h-4 w-4" />
            GreenGuard
          </Link>
          <Link
            href="/irrigation"
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm',
              pathname === '/irrigation'
                ? 'bg-green-50 text-green-700'
                : 'text-gray-600 hover:bg-gray-50'
            )}
          >
            <Droplets className="h-4 w-4" />
            DripDrop
          </Link>
          <Link
            href="/feed-formula"
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm',
              pathname === '/feed-formula'
                ? 'bg-green-50 text-green-700'
                : 'text-gray-600 hover:bg-gray-50'
            )}
          >
            <BookOpen className="h-4 w-4" />
            FeedFormula
          </Link>
          <Link
            href="/recipes"
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm',
              pathname === '/recipes'
                ? 'bg-green-50 text-green-700'
                : 'text-gray-600 hover:bg-gray-50'
            )}
          >
            <UtensilsCrossed className="h-4 w-4" />
            FreshBites
          </Link>
        </nav>
      </div>
    </aside>
  );
}
