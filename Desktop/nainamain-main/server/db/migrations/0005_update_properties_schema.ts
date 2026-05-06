import { sql } from "drizzle-orm";
import { db } from "../../db.js";

export async function up() {
  try {
    console.log('Running migration: Updating properties table schema...');
    
    // Add array columns if they don't exist
    await db.execute(sql`
      DO $$ 
      BEGIN 
        -- Add features array column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'properties' AND column_name = 'features') THEN
          ALTER TABLE properties ADD COLUMN features TEXT[];
        END IF;

        -- Add images array column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'properties' AND column_name = 'images') THEN
          ALTER TABLE properties ADD COLUMN images TEXT[];
        END IF;

        -- Add video_url column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'properties' AND column_name = 'video_url') THEN
          ALTER TABLE properties ADD COLUMN video_url TEXT;
        END IF;

        -- Add is_featured column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'properties' AND column_name = 'is_featured') THEN
          ALTER TABLE properties ADD COLUMN is_featured BOOLEAN DEFAULT false;
        END IF;

        -- Add property_type column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'properties' AND column_name = 'property_type') THEN
          ALTER TABLE properties ADD COLUMN property_type TEXT NOT NULL DEFAULT 'Residential';
        END IF;

        -- Add created_at column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'properties' AND column_name = 'created_at') THEN
          ALTER TABLE properties ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        END IF;
      END $$;
    `);
    
    console.log('Successfully updated properties table schema');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

export async function down() {
  try {
    console.log('Running rollback: Reverting properties table schema changes...');
    await db.execute(sql`
      ALTER TABLE properties 
      DROP COLUMN IF EXISTS features,
      DROP COLUMN IF EXISTS images,
      DROP COLUMN IF EXISTS video_url,
      DROP COLUMN IF EXISTS is_featured,
      DROP COLUMN IF EXISTS property_type,
      DROP COLUMN IF EXISTS created_at;
    `);
    console.log('Successfully reverted properties table schema changes');
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