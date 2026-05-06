import { sql } from "drizzle-orm";
import { db } from "../../db.js";

export async function up() {
  try {
    console.log('Running migration: Adding price_unit column...');
    await db.execute(sql`
      ALTER TABLE properties 
      ADD COLUMN IF NOT EXISTS price_unit TEXT;
    `);
    console.log('Successfully added price_unit column');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

export async function down() {
  try {
    console.log('Running rollback: Removing price_unit column...');
    await db.execute(sql`
      ALTER TABLE properties 
      DROP COLUMN IF EXISTS price_unit;
    `);
    console.log('Successfully removed price_unit column');
  } catch (error) {
    console.error('Rollback failed:', error);
    throw error;
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  up()
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
} 