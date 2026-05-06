import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table for admin authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Property table for real estate listings
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(),
  priceUnit: text("price_unit"),
  location: text("location").notNull(),
  size: doublePrecision("size").notNull(),
  sizeUnit: text("size_unit").notNull().default("Guntha"),
  features: text("features").array(),
  images: text("images").array(),
  videoUrl: text("video_url"),
  isFeatured: boolean("is_featured").default(false),
  propertyType: text("property_type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPropertySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.union([z.number(), z.string()]).transform(val => typeof val === 'number' ? val.toString() : val),
  priceUnit: z.string().nullable().default(null),
  location: z.string().min(1),
  size: z.number().positive(),
  sizeUnit: z.string().default("Guntha"),
  features: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  videoUrl: z.string().nullable().default(null),
  isFeatured: z.boolean().default(false),
  propertyType: z.string().min(1),
  createdAt: z.date().optional()
});

export type Property = {
  id: number;
  title: string;
  description: string;
  price: number | string;
  priceUnit: string | null;
  location: string;
  size: number;
  sizeUnit: string;
  features: string[];
  images: string[];
  videoUrl: string | null;
  isFeatured: boolean;
  propertyType: string;
  createdAt: Date;
};

export type InsertProperty = Omit<Property, 'id' | 'createdAt'>;

// Blog post table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  author: text("author").notNull(),
  image: text("image").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
});

// Contact messages table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  location: text("location").notNull(),
  message: text("message").notNull(),
  interest: text("interest").notNull().default("other"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Message = {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  message: string;
  interest: string;
  isRead: boolean;
  createdAt: Date;
};

export type InsertMessage = Omit<Message, 'id' | 'isRead' | 'createdAt'>;

export const insertMessageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  location: z.string().min(1, 'Location is required'),
  message: z.string().min(1, 'Message is required'),
  interest: z.string().default('other')
});

// Testimonials table
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  message: text("message").notNull(),
  rating: integer("rating").notNull(),
  image: text("image").default('/images/default-avatar.png'),
});

export const insertTestimonialSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  location: z.string().min(1, 'Location is required'),
  message: z.string().min(1, 'Message is required'),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  image: z.string().optional().default('/images/default-avatar.png')
});

export type Testimonial = {
  id: number;
  name: string;
  location: string;
  message: string;
  rating: number;
  image: string;
};

export type InsertTestimonial = Omit<Testimonial, 'id'>;

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
