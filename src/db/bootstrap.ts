import { seedDatabaseIfEmpty } from '@/db/seed';

type BootstrapCache = {
  initialized: boolean;
  promise: Promise<void> | null;
};

const globalWithBootstrap = global as typeof global & { __orchidsBootstrap?: BootstrapCache };

const cache =
  globalWithBootstrap.__orchidsBootstrap ||
  (globalWithBootstrap.__orchidsBootstrap = {
    initialized: false,
    promise: null,
  });

export async function ensureDatabaseBootstrap() {
  if (cache.initialized) {
    return;
  }

  if (!cache.promise) {
    cache.promise = seedDatabaseIfEmpty()
      .then(() => {
        cache.initialized = true;
      })
      .finally(() => {
        cache.promise = null;
      });
  }

  await cache.promise;
}
