import { sql } from "drizzle-orm";
import { db } from "../db.js";
import * as migration0004 from "./migrations/0004_add_price_unit.js";
import * as migration0005 from "./migrations/0005_update_properties_schema.js";

async function runMigrations() {
  try {
    console.log('Starting migrations...');
    
    // Run migrations in order
    await migration0004.up();
    await migration0005.up();
    
    console.log('All migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migrations if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations();
} 