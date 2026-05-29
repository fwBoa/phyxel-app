// Stub manuel — à régénérer avec :
// npx supabase gen types typescript --project-id <id> > src/types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id:         string
          full_name:  string | null
          avatar_url: string | null
          role:       'brand' | 'host'
          brand_name: string | null
          website:    string | null
          bio:        string | null
          is_admin:   boolean | null
          created_at: string
        }
        Insert: {
          id:         string
          full_name?: string | null
          avatar_url?: string | null
          role:       'brand' | 'host'
          brand_name?: string | null
          website?:   string | null
          bio?:       string | null
          is_admin?:  boolean | null
          created_at?: string
        }
        Update: {
          id?:         string
          full_name?:  string | null
          avatar_url?: string | null
          role?:       'brand' | 'host'
          brand_name?: string | null
          website?:    string | null
          bio?:        string | null
          is_admin?:   boolean | null
          created_at?: string
        }
        Relationships: []
      }
      spaces: {
        Row: {
          id:           string
          host_id:      string
          title:        string
          type:         'showroom' | 'popup' | 'corner' | 'gallery' | 'boutique'
          city:         string
          district:     string | null
          address:      string | null
          area_sqm:     number | null
          price_day:    number | null
          description:  string | null
          is_available: boolean
          created_at:   string
        }
        Insert: {
          id?:          string
          host_id:      string
          title:        string
          type:         'showroom' | 'popup' | 'corner' | 'gallery' | 'boutique'
          city:         string
          district?:    string | null
          address?:     string | null
          area_sqm?:    number | null
          price_day?:   number | null
          description?: string | null
          is_available?: boolean
          created_at?:  string
        }
        Update: {
          id?:           string
          host_id?:      string
          title?:        string
          type?:         'showroom' | 'popup' | 'corner' | 'gallery' | 'boutique'
          city?:         string
          district?:     string | null
          address?:      string | null
          area_sqm?:     number | null
          price_day?:    number | null
          description?:  string | null
          is_available?: boolean
          created_at?:   string
        }
        Relationships: []
      }
      space_photos: {
        Row: {
          id:        string
          space_id:  string
          url:       string
          is_cover:  boolean
          order_idx: number
        }
        Insert: {
          id?:        string
          space_id:   string
          url:        string
          is_cover?:  boolean
          order_idx?: number
        }
        Update: {
          id?:        string
          space_id?:  string
          url?:       string
          is_cover?:  boolean
          order_idx?: number
        }
        Relationships: []
      }
      bookings: {
        Row: {
          id:          string
          space_id:    string
          brand_id:    string
          start_date:  string
          end_date:    string
          status:      'pending' | 'confirmed' | 'cancelled'
          total_price: number | null
          created_at:  string
        }
        Insert: {
          id?:          string
          space_id:     string
          brand_id:     string
          start_date:   string
          end_date:     string
          status?:      'pending' | 'confirmed' | 'cancelled'
          total_price?: number | null
          created_at?:  string
        }
        Update: {
          id?:          string
          space_id?:    string
          brand_id?:    string
          start_date?:  string
          end_date?:    string
          status?:      'pending' | 'confirmed' | 'cancelled'
          total_price?: number | null
          created_at?:  string
        }
        Relationships: []
      }
    }
    Views:          Record<string, never>
    Functions:      Record<string, never>
    Enums:          Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// Aliases pratiques extraits du schéma
export type ProfileRow        = Database['public']['Tables']['profiles']['Row']
export type ProfileInsertRow  = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdateRow  = Database['public']['Tables']['profiles']['Update']

export type SpaceRow          = Database['public']['Tables']['spaces']['Row']
export type SpaceInsertRow    = Database['public']['Tables']['spaces']['Insert']
export type SpaceUpdateRow    = Database['public']['Tables']['spaces']['Update']

export type SpacePhotoRow        = Database['public']['Tables']['space_photos']['Row']
export type SpacePhotoInsertRow  = Database['public']['Tables']['space_photos']['Insert']
export type SpacePhotoUpdateRow  = Database['public']['Tables']['space_photos']['Update']

export type BookingRow        = Database['public']['Tables']['bookings']['Row']
export type BookingInsertRow  = Database['public']['Tables']['bookings']['Insert']
export type BookingUpdateRow  = Database['public']['Tables']['bookings']['Update']
