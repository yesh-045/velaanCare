import { reseedDatabase, seedDatabaseIfEmpty } from '@/db/seed';

async function main() {
	const force = process.argv.includes('--force');

	if (force) {
		await reseedDatabase();
		console.log('Database reseeded successfully.');
		return;
	}

	await seedDatabaseIfEmpty();
	console.log('Database seed check completed successfully.');
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error('Failed to seed database:', error);
		process.exit(1);
	});
