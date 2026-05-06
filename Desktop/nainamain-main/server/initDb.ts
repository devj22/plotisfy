import { db } from './db.js';
import { users } from '../shared/schema.js';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

async function initializeDatabase() {
  try {
    // Check if admin user exists
    const existingAdmin = await db.select().from(users).where(eq(users.username, 'admin'));
    
    if (existingAdmin.length === 0) {
      // Create admin user if it doesn't exist
      const hashedPassword = await bcrypt.hash('Naina@32145', 10);
      await db.insert(users).values({
        username: 'admin',
        password: hashedPassword
      });
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase(); 