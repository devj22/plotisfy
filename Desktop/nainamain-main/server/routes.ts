import express, { type Express } from "express";
import type { Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { checkDatabaseConnection } from "./db.js";
import { 
  insertPropertySchema, 
  insertBlogPostSchema, 
  insertMessageSchema, 
  insertTestimonialSchema 
} from "../shared/schema.js";
import { z } from "zod";
import bcrypt from 'bcrypt';

// Simple JWT implementation for admin authentication
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'nainaland-secret-key';

function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
}

function verifyToken(token: string): { userId: number } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number };
  } catch (error) {
    return null;
  }
}

// Middleware to check admin authentication
function authMiddleware(req: Request, res: Response, next: Function) {
  console.log('Auth middleware - Headers:', req.headers);
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Auth middleware - No token provided');
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Auth middleware - Token received:', token.substring(0, 10) + '...');
  
  const decoded = verifyToken(token);
  console.log('Auth middleware - Token verification result:', decoded ? 'Valid' : 'Invalid');
  
  if (!decoded) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
  
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  const server = createServer(app);

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes (prefix with /api)
  const apiRouter = express.Router();

  // Auth routes
  apiRouter.post('/auth/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required' });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const token = generateToken(user.id);
      res.json({ token, user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(500).json({ message: 'Server error during login' });
    }
  });

  // Property routes
  apiRouter.get('/properties', async (req: Request, res: Response) => {
    try {
      console.log('GET /properties - Starting request');
      
      // Check database connection first
      const isConnected = await checkDatabaseConnection();
      if (!isConnected) {
        console.error('GET /properties - Database connection failed');
        return res.status(503).json({ 
          message: 'Database connection failed',
          details: 'Unable to establish database connection'
        });
      }
      
      console.log('GET /properties - Database connection successful, fetching properties...');
      const { type, featured } = req.query;
      
      let properties;
      if (type) {
        properties = await storage.getPropertiesByType(type as string);
      } else if (featured === 'true') {
        properties = await storage.getFeaturedProperties();
      } else {
        properties = await storage.getAllProperties();
      }
      
      console.log('GET /properties - Properties fetched:', properties ? properties.length : 0);
      res.json(properties);
    } catch (error) {
      console.error('GET /properties - Error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({ 
        message: 'Failed to fetch properties',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  apiRouter.get('/properties/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const property = await storage.getPropertyById(id);
      
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
      
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch property' });
    }
  });

  apiRouter.post('/properties', authMiddleware, async (req: Request, res: Response) => {
    try {
      const propertyData = insertPropertySchema.parse(req.body);
      const newProperty = await storage.createProperty(propertyData);
      res.status(201).json(newProperty);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid property data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create property' });
    }
  });

  apiRouter.put('/properties/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      const property = await storage.getPropertyById(id);
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
      
      const updatedProperty = await storage.updateProperty(id, updateData);
      res.json(updatedProperty);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update property' });
    }
  });

  apiRouter.delete('/properties/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProperty(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Property not found' });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete property' });
    }
  });

  // Blog post routes
  apiRouter.get('/blogs', async (req: Request, res: Response) => {
    try {
      console.log('GET /blogs - Starting request');
      
      // Check database connection first
      const isConnected = await checkDatabaseConnection();
      if (!isConnected) {
        console.error('GET /blogs - Database connection failed');
        return res.status(503).json({ 
          message: 'Database connection failed',
          details: 'Unable to establish database connection'
        });
      }
      
      console.log('GET /blogs - Database connection successful, fetching blogs...');
      const blogs = await storage.getAllBlogPosts();
      console.log('GET /blogs - Blogs fetched:', blogs ? blogs.length : 0);
      
      if (!blogs) {
        console.log('GET /blogs - No blogs found, returning empty array');
        return res.json([]);
      }
      
      console.log('GET /blogs - Successfully returning blogs');
      return res.json(blogs);
    } catch (error) {
      console.error('GET /blogs - Error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      return res.status(500).json({ 
        message: 'Failed to fetch blog posts',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      });
    }
  });

  apiRouter.get('/blogs/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const blog = await storage.getBlogPostById(id);
      
      if (!blog) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      
      res.json(blog);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch blog post' });
    }
  });

  apiRouter.post('/blogs', authMiddleware, async (req: Request, res: Response) => {
    try {
      const blogData = insertBlogPostSchema.parse(req.body);
      const newBlog = await storage.createBlogPost(blogData);
      res.status(201).json(newBlog);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid blog data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create blog post' });
    }
  });

  apiRouter.put('/blogs/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      const blog = await storage.getBlogPostById(id);
      if (!blog) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      
      const updatedBlog = await storage.updateBlogPost(id, updateData);
      res.json(updatedBlog);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update blog post' });
    }
  });

  apiRouter.delete('/blogs/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBlogPost(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete blog post' });
    }
  });

  // Message routes
  apiRouter.get('/messages', authMiddleware, async (req: Request, res: Response) => {
    try {
      console.log('GET /messages - Starting request');
      console.log('GET /messages - Auth header:', req.headers.authorization);
      
      // Check database connection first
      const isConnected = await checkDatabaseConnection();
      if (!isConnected) {
        console.error('GET /messages - Database connection failed');
        return res.status(503).json({ 
          message: 'Database connection failed',
          details: 'Unable to establish database connection'
        });
      }
      
      console.log('GET /messages - Database connection successful, fetching messages...');
      const messages = await storage.getAllMessages();
      console.log('GET /messages - Messages fetched:', messages ? messages.length : 0);
      
      if (!messages) {
        console.log('GET /messages - No messages found, returning empty array');
        return res.json([]);
      }
      
      console.log('GET /messages - Successfully returning messages');
      return res.json(messages);
    } catch (error) {
      console.error('GET /messages - Error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      // Send a more detailed error response
      return res.status(500).json({ 
        message: 'Failed to fetch messages',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      });
    }
  });

  apiRouter.post('/messages', async (req: Request, res: Response) => {
    try {
      console.log('Received message data:', req.body); // Debug log
      
      // Validate the request body
      if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ 
          message: 'Invalid request body',
          details: 'Request body must be a JSON object'
        });
      }

      // Parse and validate the message data
      const messageData = insertMessageSchema.parse(req.body);
      console.log('Validated message data:', messageData); // Debug log

      // Create the message
      const newMessage = await storage.createMessage(messageData);
      console.log('Created message:', newMessage); // Debug log

      // Send success response
      return res.status(201).json({
        message: 'Message created successfully',
        data: newMessage
      });
    } catch (error) {
      console.error('Error creating message:', error); // Debug log
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid message data',
          errors: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        });
      }

      return res.status(500).json({ 
        message: 'Failed to create message',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  apiRouter.put('/messages/:id/read', authMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { isRead } = req.body;
      
      if (typeof isRead !== 'boolean') {
        return res.status(400).json({ message: 'isRead field must be a boolean' });
      }
      
      const updatedMessage = await storage.updateMessageReadStatus(id, isRead);
      
      if (!updatedMessage) {
        return res.status(404).json({ message: 'Message not found' });
      }
      
      res.json(updatedMessage);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update message read status' });
    }
  });

  apiRouter.delete('/messages/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteMessage(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Message not found' });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete message' });
    }
  });

  // Testimonial routes
  apiRouter.get('/testimonials', async (req: Request, res: Response) => {
    try {
      console.log('GET /testimonials - Starting request');
      
      // Check database connection first
      const isConnected = await checkDatabaseConnection();
      if (!isConnected) {
        console.error('GET /testimonials - Database connection failed');
        return res.status(503).json({ 
          message: 'Database connection failed',
          details: 'Unable to establish database connection'
        });
      }
      
      console.log('GET /testimonials - Database connection successful, fetching testimonials...');
      const testimonials = await storage.getAllTestimonials();
      console.log('GET /testimonials - Testimonials fetched:', testimonials ? testimonials.length : 0);
      
      if (!testimonials) {
        console.log('GET /testimonials - No testimonials found, returning empty array');
        return res.json([]);
      }
      
      console.log('GET /testimonials - Successfully returning testimonials');
      return res.json(testimonials);
    } catch (error) {
      console.error('GET /testimonials - Error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      return res.status(500).json({ 
        message: 'Failed to fetch testimonials',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      });
    }
  });

  apiRouter.post('/testimonials', authMiddleware, async (req: Request, res: Response) => {
    try {
      console.log('POST /testimonials - Starting request');
      console.log('Received testimonial data:', req.body);
      
      // Validate the request body
      if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ 
          message: 'Invalid request body',
          details: 'Request body must be a JSON object'
        });
      }

      // Parse and validate the testimonial data
      const testimonialData = insertTestimonialSchema.parse(req.body);
      console.log('Validated testimonial data:', testimonialData);

      // Create the testimonial
      const newTestimonial = await storage.createTestimonial(testimonialData);
      console.log('Created testimonial:', newTestimonial);

      return res.status(201).json({
        message: 'Testimonial created successfully',
        data: newTestimonial
      });
    } catch (error) {
      console.error('POST /testimonials - Error:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid testimonial data',
          errors: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        });
      }

      return res.status(500).json({ 
        message: 'Failed to create testimonial',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.use('/api', apiRouter);

  return server;
}
