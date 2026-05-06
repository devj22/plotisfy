import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcrypt';

const sql = neon('postgresql://neondb_owner:npg_ASLcolZjzh70@ep-white-unit-a872j29f-pooler.eastus2.azure.neon.tech/neondb?sslmode=require');

async function migrate() {
  try {
    // Create users table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
    `;

    // Check if admin user exists
    const existingAdmin = await sql`
      SELECT * FROM users WHERE username = 'admin'
    `;

    if (existingAdmin.length === 0) {
      // Create admin user
      const hashedPassword = await bcrypt.hash('Naina@32145', 10);
      await sql`
        INSERT INTO users (username, password)
        VALUES ('admin', ${hashedPassword})
      `;
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }

    // Create other necessary tables
    await sql`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        price INTEGER NOT NULL,
        location TEXT NOT NULL,
        size DOUBLE PRECISION NOT NULL,
        size_unit TEXT NOT NULL DEFAULT 'Guntha',
        features TEXT[],
        images TEXT[],
        video_url TEXT DEFAULT '',
        is_featured BOOLEAN DEFAULT false,
        property_type TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        author TEXT NOT NULL,
        image TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        location TEXT NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Rename interest column to location if it exists
    await sql`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'messages'
          AND column_name = 'interest'
        ) THEN
          ALTER TABLE messages RENAME COLUMN interest TO location;
        END IF;
      END $$;
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        message TEXT NOT NULL,
        rating INTEGER NOT NULL,
        image TEXT
      )
    `;

    console.log('Database migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate(); 