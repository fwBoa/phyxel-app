export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
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
          created_at?: string
        }
        Update: {
          id?:        string
          full_name?: string | null
          avatar_url?: string | null
          role?:      'brand' | 'host'
          brand_name?: string | null
          website?:   string | null
          bio?:       string | null
          created_at?: string
        }
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
          id?:          string
          host_id?:     string
          title?:       string
          type?:        'showroom' | 'popup' | 'corner' | 'gallery' | 'boutique'
          city?:        string
          district?:    string | null
          address?:     string | null
          area_sqm?:    number | null
          price_day?:   number | null
          description?: string | null
          is_available?: boolean
          created_at?:  string
        }
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
          id?:       string
          space_id:  string
          url:       string
          is_cover?: boolean
          order_idx?: number
        }
        Update: {
          id?:       string
          space_id?: string
          url?:      string
          is_cover?: boolean
          order_idx?: number
        }
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
          id?:         string
          space_id:    string
          brand_id:    string
          start_date:  string
          end_date:    string
          status?:     'pending' | 'confirmed' | 'cancelled'
          total_price?: number | null
          created_at?: string
        }
        Update: {
          id?:         string
          space_id?:   string
          brand_id?:   string
          start_date?: string
          end_date?:   string
          status?:     'pending' | 'confirmed' | 'cancelled'
          total_price?: number | null
          created_at?: string
        }
      }
    }
  }
}
