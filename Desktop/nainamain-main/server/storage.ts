import { 
  users, properties, blogPosts, messages, testimonials,
  type User, type InsertUser, 
  type Property, type InsertProperty,
  type BlogPost, type InsertBlogPost,
  type Message, type InsertMessage,
  type Testimonial, type InsertTestimonial
} from "../shared/schema.js";
import bcrypt from 'bcrypt';
import { db, safeParseBoolean, safeParseDate } from './db.js';
import { eq } from 'drizzle-orm';

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Property methods
  getAllProperties(): Promise<Property[]>;
  getPropertyById(id: number): Promise<Property | undefined>;
  getPropertiesByType(type: string): Promise<Property[]>;
  getFeaturedProperties(): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  
  // Blog methods
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  
  // Message methods
  getAllMessages(): Promise<Message[]>;
  getMessageById(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessageReadStatus(id: number, isRead: boolean): Promise<Message | undefined>;
  deleteMessage(id: number): Promise<boolean>;
  
  // Testimonial methods
  getAllTestimonials(): Promise<Testimonial[]>;
  getTestimonialById(id: number): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;
}

export class PostgresStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const result = await db.insert(users).values({
      ...insertUser,
      password: hashedPassword,
    }).returning();
    return result[0];
  }

  // Property methods
  async getAllProperties(): Promise<Property[]> {
    const result = await db.select().from(properties);
    return result.map(prop => ({
      ...prop,
      features: prop.features || [],
      images: prop.images || [],
      videoUrl: prop.videoUrl || null,
      isFeatured: prop.isFeatured || false,
      createdAt: prop.createdAt || new Date()
    }));
  }

  async getPropertyById(id: number): Promise<Property | undefined> {
    const result = await db.select().from(properties).where(eq(properties.id, id));
    if (!result[0]) return undefined;
    
    const prop = result[0];
    return {
      ...prop,
      features: prop.features || [],
      images: prop.images || [],
      videoUrl: prop.videoUrl || null,
      isFeatured: prop.isFeatured || false,
      createdAt: prop.createdAt || new Date()
    };
  }

  async getPropertiesByType(type: string): Promise<Property[]> {
    const result = await db.select().from(properties).where(eq(properties.propertyType, type));
    return result.map(prop => ({
      ...prop,
      features: prop.features || [],
      images: prop.images || [],
      videoUrl: prop.videoUrl || null,
      isFeatured: prop.isFeatured || false,
      createdAt: prop.createdAt || new Date()
    }));
  }

  async getFeaturedProperties(): Promise<Property[]> {
    const result = await db.select().from(properties).where(eq(properties.isFeatured, true));
    return result.map(prop => ({
      ...prop,
      features: prop.features || [],
      images: prop.images || [],
      videoUrl: prop.videoUrl || null,
      isFeatured: prop.isFeatured || false,
      createdAt: prop.createdAt || new Date()
    }));
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const propertyData = {
      ...insertProperty,
      features: insertProperty.features || [],
      images: insertProperty.images || [],
      videoUrl: insertProperty.videoUrl || null,
      isFeatured: insertProperty.isFeatured || false,
      sizeUnit: insertProperty.sizeUnit || "Guntha",
      price: typeof insertProperty.price === 'number' ? insertProperty.price.toString() : insertProperty.price
    };

    const result = await db.insert(properties).values(propertyData).returning();
    
    const prop = result[0];
    return {
      ...prop,
      features: prop.features || [],
      images: prop.images || [],
      videoUrl: prop.videoUrl || null,
      isFeatured: prop.isFeatured || false,
      createdAt: prop.createdAt || new Date()
    };
  }

  async updateProperty(id: number, updateData: Partial<InsertProperty>): Promise<Property | undefined> {
    const propertyData = {
      ...updateData,
      features: updateData.features || undefined,
      images: updateData.images || undefined,
      videoUrl: updateData.videoUrl || null,
      isFeatured: updateData.isFeatured || undefined,
      sizeUnit: updateData.sizeUnit || undefined,
      price: updateData.price !== undefined ? (typeof updateData.price === 'number' ? updateData.price.toString() : updateData.price) : undefined
    };

    const result = await db.update(properties)
      .set(propertyData)
      .where(eq(properties.id, id))
      .returning();
      
    if (!result[0]) return undefined;
    
    const prop = result[0];
    return {
      ...prop,
      features: prop.features || [],
      images: prop.images || [],
      videoUrl: prop.videoUrl || null,
      isFeatured: prop.isFeatured || false,
      createdAt: prop.createdAt || new Date()
    };
  }

  async deleteProperty(id: number): Promise<boolean> {
    const result = await db.delete(properties)
      .where(eq(properties.id, id))
      .returning();
    return result.length > 0;
  }

  // Blog methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    try {
      console.log('Storage: Getting all blog posts...');
      const result = await db.select().from(blogPosts);
      console.log(`Storage: Found ${result.length} blog posts`);
      
      // Transform the result to ensure correct types
      return result.map(blog => ({
        id: blog.id,
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt,
        author: blog.author,
        image: blog.image,
        createdAt: blog.createdAt || new Date()
      }));
    } catch (error) {
      console.error('Storage: Error getting all blog posts:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      throw new Error('Failed to fetch blog posts');
    }
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    try {
      console.log(`Storage: Getting blog post with id ${id}...`);
      const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
      
      if (!result[0]) {
        console.log(`Storage: No blog post found with id ${id}`);
        return undefined;
      }
      
      const blog = result[0];
      console.log(`Storage: Found blog post with id ${id}`);
      
      return {
        id: blog.id,
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt,
        author: blog.author,
        image: blog.image,
        createdAt: blog.createdAt || new Date()
      };
    } catch (error) {
      console.error(`Storage: Error getting blog post with id ${id}:`, {
        error,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      throw new Error('Failed to fetch blog post');
    }
  }

  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    try {
      console.log('Storage: Creating new blog post...');
      const result = await db.insert(blogPosts).values(insertBlogPost).returning();
      
      if (!result[0]) {
        throw new Error('Failed to create blog post - no result returned');
      }
      
      const blog = result[0];
      console.log(`Storage: Created blog post with id ${blog.id}`);
      
      return {
        id: blog.id,
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt,
        author: blog.author,
        image: blog.image,
        createdAt: blog.createdAt || new Date()
      };
    } catch (error) {
      console.error('Storage: Error creating blog post:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        insertBlogPost
      });
      throw new Error('Failed to create blog post');
    }
  }

  async updateBlogPost(id: number, updateData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    try {
      console.log(`Storage: Updating blog post with id ${id}...`);
      const result = await db.update(blogPosts)
        .set(updateData)
        .where(eq(blogPosts.id, id))
        .returning();
        
      if (!result[0]) {
        console.log(`Storage: No blog post found with id ${id}`);
        return undefined;
      }
      
      const blog = result[0];
      console.log(`Storage: Updated blog post with id ${id}`);
      
      return {
        id: blog.id,
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt,
        author: blog.author,
        image: blog.image,
        createdAt: blog.createdAt || new Date()
      };
    } catch (error) {
      console.error(`Storage: Error updating blog post with id ${id}:`, {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        updateData
      });
      throw new Error('Failed to update blog post');
    }
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    try {
      console.log(`Storage: Deleting blog post with id ${id}...`);
      const result = await db.delete(blogPosts)
        .where(eq(blogPosts.id, id))
        .returning();
      
      const deleted = result.length > 0;
      console.log(`Storage: Blog post with id ${id} ${deleted ? 'deleted' : 'not found'}`);
      
      return deleted;
    } catch (error) {
      console.error(`Storage: Error deleting blog post with id ${id}:`, {
        error,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      throw new Error('Failed to delete blog post');
    }
  }

  // Message methods
  async getAllMessages(): Promise<Message[]> {
    try {
      console.log('Getting all messages...');
      const result = await db.select().from(messages);
      console.log(`Found ${result.length} messages`);
      
      // Transform the result to ensure correct types
      return result.map(msg => ({
        id: msg.id,
        name: msg.name,
        email: msg.email,
        phone: msg.phone,
        location: msg.location,
        message: msg.message,
        interest: msg.interest || 'other',
        isRead: safeParseBoolean(msg.isRead),
        createdAt: safeParseDate(msg.createdAt)
      }));
    } catch (error) {
      console.error('Error getting all messages:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      throw new Error('Failed to fetch messages');
    }
  }

  async getMessageById(id: number): Promise<Message | undefined> {
    try {
      const result = await db.select().from(messages).where(eq(messages.id, id));
      if (!result[0]) return undefined;
      
      const msg = result[0];
      return {
        ...msg,
        interest: msg.interest || 'other',
        isRead: safeParseBoolean(msg.isRead),
        createdAt: safeParseDate(msg.createdAt)
      };
    } catch (error) {
      console.error('Error getting message by id:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      throw new Error('Failed to fetch message');
    }
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    try {
      const result = await db.insert(messages).values({
        ...insertMessage,
        interest: insertMessage.interest || 'other',
        isRead: false
      }).returning();
      
      if (!result[0]) {
        throw new Error('Failed to create message - no result returned');
      }
      
      const msg = result[0];
      return {
        ...msg,
        interest: msg.interest || 'other',
        isRead: safeParseBoolean(msg.isRead),
        createdAt: safeParseDate(msg.createdAt)
      };
    } catch (error) {
      console.error('Error creating message:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        insertMessage
      });
      throw new Error('Failed to create message');
    }
  }

  async updateMessageReadStatus(id: number, isRead: boolean): Promise<Message | undefined> {
    try {
      const result = await db.update(messages)
        .set({ isRead })
        .where(eq(messages.id, id))
        .returning();
        
      if (!result[0]) return undefined;
    
      const msg = result[0];
      return {
        ...msg,
        interest: msg.interest || 'other',
        isRead: safeParseBoolean(msg.isRead),
        createdAt: safeParseDate(msg.createdAt)
      };
    } catch (error) {
      console.error('Error updating message read status:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      throw new Error('Failed to update message status');
    }
  }

  async deleteMessage(id: number): Promise<boolean> {
    try {
      const result = await db.delete(messages)
        .where(eq(messages.id, id))
        .returning();
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting message:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      throw new Error('Failed to delete message');
    }
  }

  // Testimonial methods
  async getAllTestimonials(): Promise<Testimonial[]> {
    const result = await db.select().from(testimonials);
    return result.map(testimonial => ({
      ...testimonial,
      image: testimonial.image || '/images/default-avatar.png'
    }));
  }

  async getTestimonialById(id: number): Promise<Testimonial | undefined> {
    const result = await db.select().from(testimonials).where(eq(testimonials.id, id));
    if (!result[0]) return undefined;
    
    return {
      ...result[0],
      image: result[0].image || '/images/default-avatar.png'
    };
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const result = await db.insert(testimonials).values({
      ...insertTestimonial,
      image: insertTestimonial.image || '/images/default-avatar.png'
    }).returning();
    
    return {
      ...result[0],
      image: result[0].image || '/images/default-avatar.png'
    };
  }

  async updateTestimonial(id: number, updateData: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const result = await db.update(testimonials)
      .set({
        ...updateData,
        image: updateData.image || undefined
      })
      .where(eq(testimonials.id, id))
      .returning();
    
    if (!result[0]) return undefined;
    
    return {
      ...result[0],
      image: result[0].image || '/images/default-avatar.png'
    };
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    const result = await db.delete(testimonials)
      .where(eq(testimonials.id, id))
      .returning();
    return result.length > 0;
  }
}

// Export a singleton instance
export const storage = new PostgresStorage();
