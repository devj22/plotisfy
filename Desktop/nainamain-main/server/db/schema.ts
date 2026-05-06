import { sql } from "drizzle-orm";
import {
  text,
  pgTable,
  serial,
  doublePrecision,
  boolean,
  timestamp
} from "drizzle-orm/pg-core";

// Properties table
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(), // Changed to text to support both numeric and text values
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