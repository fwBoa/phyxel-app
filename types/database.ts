export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          role: 'brand' | 'host'
          brand_name: string | null
          website: string | null
          bio: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          role: 'brand' | 'host'
          brand_name?: string | null
          website?: string | null
          bio?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'brand' | 'host'
          brand_name?: string | null
          website?: string | null
          bio?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      spaces: {
        Row: {
          id: string
          host_id: string
          title: string
          type: 'showroom' | 'popup' | 'corner' | 'gallery' | 'boutique'
          city: string
          district: string | null
          address: string | null
          area_sqm: number | null
          price_day: number
          description: string | null
          is_available: boolean
          created_at: string
        }
        Insert: {
          id?: string
          host_id: string
          title: string
          type: 'showroom' | 'popup' | 'corner' | 'gallery' | 'boutique'
          city: string
          district?: string | null
          address?: string | null
          area_sqm?: number | null
          price_day: number
          description?: string | null
          is_available?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          host_id?: string
          title?: string
          type?: 'showroom' | 'popup' | 'corner' | 'gallery' | 'boutique'
          city?: string
          district?: string | null
          address?: string | null
          area_sqm?: number | null
          price_day?: number
          description?: string | null
          is_available?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'spaces_host_id_fkey'
            columns: ['host_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      space_photos: {
        Row: {
          id: string
          space_id: string
          url: string
          is_cover: boolean
          order_idx: number
        }
        Insert: {
          id?: string
          space_id: string
          url: string
          is_cover?: boolean
          order_idx?: number
        }
        Update: {
          id?: string
          space_id?: string
          url?: string
          is_cover?: boolean
          order_idx?: number
        }
        Relationships: [
          {
            foreignKeyName: 'space_photos_space_id_fkey'
            columns: ['space_id']
            isOneToOne: false
            referencedRelation: 'spaces'
            referencedColumns: ['id']
          }
        ]
      }
      bookings: {
        Row: {
          id: string
          space_id: string
          brand_id: string
          start_date: string
          end_date: string
          status: 'pending' | 'confirmed' | 'cancelled'
          total_price: number | null
          created_at: string
        }
        Insert: {
          id?: string
          space_id: string
          brand_id: string
          start_date: string
          end_date: string
          status?: 'pending' | 'confirmed' | 'cancelled'
          total_price?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          space_id?: string
          brand_id?: string
          start_date?: string
          end_date?: string
          status?: 'pending' | 'confirmed' | 'cancelled'
          total_price?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'bookings_space_id_fkey'
            columns: ['space_id']
            isOneToOne: false
            referencedRelation: 'spaces'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'bookings_brand_id_fkey'
            columns: ['brand_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums = never
