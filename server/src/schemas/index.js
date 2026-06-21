import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
});

export const registerSchema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const eventSchema = z.object({
  title: z.string().min(1, 'Title required'),
  date: z.string().nullable().optional(),
  time: z.string().nullable().optional(),
  days: z.string().nullable().optional(),
  location: z.string().min(1, 'Location required'),
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  spots: z.number().int().nullable().optional(),
  status: z.enum(['published', 'draft']).optional(),
});

export const sermonSchema = z.object({
  title: z.string().min(1, 'Title required'),
  speaker: z.string().min(1, 'Speaker required'),
  date: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  audio_url: z.string().nullable().optional(),
  video_url: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  status: z.enum(['published', 'draft']).optional(),
});

export const blogSchema = z.object({
  title: z.string().min(1, 'Title required'),
  author: z.string().min(1, 'Author required'),
  date: z.string().nullable().optional(),
  category: z.string().min(1, 'Category required'),
  image: z.string().nullable().optional(),
  excerpt: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  slug: z.string().nullable().optional(),
  meta_description: z.string().nullable().optional(),
  status: z.enum(['published', 'draft']).optional(),
});

export const gallerySchema = z.object({
  title: z.string().min(1, 'Title required'),
  description: z.string().nullable().optional(),
  src: z.string().min(1, 'Image URL required'),
  category: z.string().optional(),
  type: z.enum(['image', 'video']).optional(),
  thumbnail: z.string().nullable().optional(),
});

export const streamSchema = z.object({
  title: z.string().min(1, 'Title required'),
  youtube_url: z.string().nullable().optional(),
  scheduled_date: z.string().nullable().optional(),
  scheduled_time: z.string().nullable().optional(),
  end_time: z.string().nullable().optional(),
  recurring: z.string().nullable().optional(),
  is_live: z.boolean().optional(),
});

export const profileSchema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Valid email required'),
});

export const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Valid email required'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const userUpdateSchema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Valid email required'),
  role: z.enum(['admin', 'editor', 'viewer']).optional(),
  avatar_url: z.string().nullable().optional(),
});

export const donationSchema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().nullable().optional(),
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['one-time', 'monthly', 'tithe']).optional(),
  cause: z.string().optional(),
  message: z.string().nullable().optional(),
});

export const subscriberSchema = z.object({
  email: z.string().email('Valid email required'),
});

export const contactMessageSchema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().nullable().optional(),
  subject: z.string().min(1, 'Subject required'),
  message: z.string().min(1, 'Message required'),
});

export const bibleVerseSchema = z.object({
  verse_text: z.string().min(1, 'Verse text required'),
  reference: z.string().min(1, 'Reference required'),
  version: z.string().optional(),
  scheduled_date: z.string().nullable().optional(),
  is_published: z.boolean().optional(),
});

export const contactStatusSchema = z.object({
  status: z.enum(['unread', 'read', 'replied']),
});
