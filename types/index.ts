import { Database } from './database'

// Convenience types for working with the database
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Household = Database['public']['Tables']['households']['Row']
export type FeedingEvent = Database['public']['Tables']['feeding_events']['Row']
export type CustomEvent = Database['public']['Tables']['custom_events']['Row']
export type EventType = Database['public']['Tables']['event_types']['Row']

// Insert types
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type FeedingEventInsert = Database['public']['Tables']['feeding_events']['Insert']
export type CustomEventInsert = Database['public']['Tables']['custom_events']['Insert']

// Update types
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type FeedingEventUpdate = Database['public']['Tables']['feeding_events']['Update']
export type CustomEventUpdate = Database['public']['Tables']['custom_events']['Update']

// Combined event type for displaying history
export type AnyEvent = (FeedingEvent & { event_category: 'feeding' }) | (CustomEvent & { event_category: 'custom' })

// User role type
export type UserRole = 'admin' | 'user' | 'pending'
