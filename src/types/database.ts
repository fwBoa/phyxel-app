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
          brand_name: string | null
          website:    string | null
          bio:        string | null
          has_completed_onboarding: boolean | null
          created_at: string
        }
        Insert: {
          id:         string
          full_name?: string | null
          avatar_url?: string | null
          brand_name?: string | null
          website?:   string | null
          bio?:        string | null
          has_completed_onboarding?: boolean | null
          created_at?: string
        }
        Update: {
          id?:         string
          full_name?:  string | null
          avatar_url?: string | null
          brand_name?: string | null
          website?:    string | null
          bio?:        string | null
          has_completed_onboarding?: boolean | null
          created_at?: string
        }
        Relationships: []
      }
      admins: {
        Row: {
          id:            string
          email:         string
          password_hash: string
          full_name:     string | null
          is_active:     boolean
          last_login_at: string | null
          created_at:    string
          updated_at:    string
        }
        Insert: {
          id?:            string
          email:          string
          password_hash:  string
          full_name?:     string | null
          is_active?:     boolean
          last_login_at?: string | null
          created_at?:    string
          updated_at?:    string
        }
        Update: {
          id?:            string
          email?:         string
          password_hash?: string
          full_name?:     string | null
          is_active?:     boolean
          last_login_at?: string | null
          created_at?:    string
          updated_at?:    string
        }
        Relationships: []
      }
      hosts: {
        Row: {
          id:           string
          email:        string
          full_name:    string | null
          company_name: string | null
          phone:        string | null
          is_active:    boolean
          created_at:   string
          updated_at:   string
        }
        Insert: {
          id?:           string
          email:         string
          full_name?:    string | null
          company_name?: string | null
          phone?:        string | null
          is_active?:    boolean
          created_at?:   string
          updated_at?:   string
        }
        Update: {
          id?:           string
          email?:        string
          full_name?:    string | null
          company_name?: string | null
          phone?:        string | null
          is_active?:    boolean
          created_at?:   string
          updated_at?:   string
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
      favorites: {
        Row: {
          id:         string
          user_id:    string
          space_id:   string
          created_at: string
        }
        Insert: {
          id?:         string
          user_id:     string
          space_id:    string
          created_at?: string
        }
        Update: {
          id?:         string
          user_id?:    string
          space_id?:   string
          created_at?: string
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
      brand_preferences: {
        Row: {
          id:                  string
          profile_id:          string
          sector:              string | null
          product_types:       string[] | null
          main_city:           string | null
          company_size:        string | null
          approx_budget:       string | null
          physical_objectives: Json | null
          target_city:         string | null
          desired_duration:    string | null
          space_types:         Json | null
          desired_area:        string | null
          needed_services:     Json | null
          max_budget:          string | null
          preferred_districts: Json | null
          desired_ambiance:    Json | null
          ideal_dates:         string | null
          created_at:          string
          updated_at:          string
        }
        Insert: {
          id?:                  string
          profile_id:           string
          sector?:              string | null
          product_types?:       string[] | null
          main_city?:           string | null
          company_size?:        string | null
          approx_budget?:       string | null
          physical_objectives?: Json | null
          target_city?:         string | null
          desired_duration?:    string | null
          space_types?:         Json | null
          desired_area?:        string | null
          needed_services?:     Json | null
          max_budget?:          string | null
          preferred_districts?: Json | null
          desired_ambiance?:    Json | null
          ideal_dates?:         string | null
          created_at?:          string
          updated_at?:          string
        }
        Update: {
          id?:                  string
          profile_id?:          string
          sector?:              string | null
          product_types?:       string[] | null
          main_city?:           string | null
          company_size?:        string | null
          approx_budget?:       string | null
          physical_objectives?: Json | null
          target_city?:          string | null
          desired_duration?:     string | null
          space_types?:          Json | null
          desired_area?:         string | null
          needed_services?:      Json | null
          max_budget?:           string | null
          preferred_districts?:  Json | null
          desired_ambiance?:     Json | null
          ideal_dates?:          string | null
          created_at?:           string
          updated_at?:           string
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

export type FavoriteRow       = Database['public']['Tables']['favorites']['Row']
export type FavoriteInsertRow = Database['public']['Tables']['favorites']['Insert']

export type BookingRow        = Database['public']['Tables']['bookings']['Row']
export type BookingInsertRow  = Database['public']['Tables']['bookings']['Insert']
export type BookingUpdateRow  = Database['public']['Tables']['bookings']['Update']

export type BrandPreferenceRow       = Database['public']['Tables']['brand_preferences']['Row']
export type BrandPreferenceInsertRow = Database['public']['Tables']['brand_preferences']['Insert']
export type BrandPreferenceUpdateRow = Database['public']['Tables']['brand_preferences']['Update']

export type AdminRow       = Database['public']['Tables']['admins']['Row']
export type AdminInsertRow = Database['public']['Tables']['admins']['Insert']
export type AdminUpdateRow = Database['public']['Tables']['admins']['Update']

export type HostRow       = Database['public']['Tables']['hosts']['Row']
export type HostInsertRow = Database['public']['Tables']['hosts']['Insert']
export type HostUpdateRow = Database['public']['Tables']['hosts']['Update']
