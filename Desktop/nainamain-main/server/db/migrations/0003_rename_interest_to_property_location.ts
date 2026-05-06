import { sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "../../db.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export async function up() {
  await sql`
    ALTER TABLE messages 
    RENAME COLUMN interest TO property_location;
  `;
}

export async function down() {
  await sql`
    ALTER TABLE messages 
    RENAME COLUMN property_location TO interest;
  `;
}

// Run migration if this file is executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
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