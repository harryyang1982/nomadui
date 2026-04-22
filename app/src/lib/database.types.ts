export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          area: Database["public"]["Enums"]["area_region"]
          best_season: string[]
          budget: Database["public"]["Enums"]["budget_band"]
          created_at: string
          dislike_count: number
          environment: string[]
          id: string
          image_url: string
          internet_speed: number
          like_count: number
          monthly_cost: number
          name_en: string
          name_ko: string
          nomad_score: number
          rank: number | null
          region: string
          review_count: number
          safety_score: number
          tags: string[]
          updated_at: string
        }
        Insert: {
          area: Database["public"]["Enums"]["area_region"]
          best_season?: string[]
          budget: Database["public"]["Enums"]["budget_band"]
          created_at?: string
          dislike_count?: number
          environment?: string[]
          id?: string
          image_url: string
          internet_speed: number
          like_count?: number
          monthly_cost: number
          name_en: string
          name_ko: string
          nomad_score?: number
          rank?: number | null
          region: string
          review_count?: number
          safety_score?: number
          tags?: string[]
          updated_at?: string
        }
        Update: {
          area?: Database["public"]["Enums"]["area_region"]
          best_season?: string[]
          budget?: Database["public"]["Enums"]["budget_band"]
          created_at?: string
          dislike_count?: number
          environment?: string[]
          id?: string
          image_url?: string
          internet_speed?: number
          like_count?: number
          monthly_cost?: number
          name_en?: string
          name_ko?: string
          nomad_score?: number
          rank?: number | null
          region?: string
          review_count?: number
          safety_score?: number
          tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      city_votes: {
        Row: {
          city_id: string
          created_at: string
          user_id: string
          vote: number
        }
        Insert: {
          city_id: string
          created_at?: string
          user_id: string
          vote: number
        }
        Update: {
          city_id?: string
          created_at?: string
          user_id?: string
          vote?: number
        }
        Relationships: [
          {
            foreignKeyName: "city_votes_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      city_weather: {
        Row: {
          aqi: number | null
          city_id: string
          current_temp: number | null
          observed_at: string
          weather_emoji: string | null
        }
        Insert: {
          aqi?: number | null
          city_id: string
          current_temp?: number | null
          observed_at?: string
          weather_emoji?: string | null
        }
        Update: {
          aqi?: number | null
          city_id?: string
          current_temp?: number | null
          observed_at?: string
          weather_emoji?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "city_weather_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: true
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      meetup_attendees: {
        Row: {
          created_at: string
          meetup_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          meetup_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          meetup_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetup_attendees_meetup_id_fkey"
            columns: ["meetup_id"]
            isOneToOne: false
            referencedRelation: "meetups"
            referencedColumns: ["id"]
          },
        ]
      }
      meetups: {
        Row: {
          city_id: string
          created_at: string
          event_at: string
          id: string
          title: string | null
        }
        Insert: {
          city_id: string
          created_at?: string
          event_at: string
          id?: string
          title?: string | null
        }
        Update: {
          city_id?: string
          created_at?: string
          event_at?: string
          id?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meetups_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      press_quotes: {
        Row: {
          created_at: string
          display_order: number
          id: string
          quote: string
          source: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          quote: string
          source: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          quote?: string
          source?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          current_city_id: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          current_city_id?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          current_city_id?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_current_city_fk"
            columns: ["current_city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      review_likes: {
        Row: {
          created_at: string
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_likes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          city_id: string
          comment_count: number
          cons: string[]
          content: string
          created_at: string
          id: string
          like_count: number
          pros: string[]
          rating: number
          stay_duration: string
          updated_at: string
          user_id: string
        }
        Insert: {
          city_id: string
          comment_count?: number
          cons?: string[]
          content: string
          created_at?: string
          id?: string
          like_count?: number
          pros?: string[]
          rating: number
          stay_duration: string
          updated_at?: string
          user_id: string
        }
        Update: {
          city_id?: string
          comment_count?: number
          cons?: string[]
          content?: string
          created_at?: string
          id?: string
          like_count?: number
          pros?: string[]
          rating?: number
          stay_duration?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
      area_region:
        | "수도권"
        | "경상도"
        | "전라도"
        | "강원도"
        | "제주도"
        | "충청도"
      budget_band: "100만원 이하" | "100~200만원" | "200만원 이상"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// ------------------------------------------------------------
// Convenience aliases used across the app
// ------------------------------------------------------------

type PublicTables = Database["public"]["Tables"]

export type CityRow = PublicTables["cities"]["Row"]
export type CityWeatherRow = PublicTables["city_weather"]["Row"]
export type ProfileRow = PublicTables["profiles"]["Row"]
export type ReviewRow = PublicTables["reviews"]["Row"]
export type MeetupRow = PublicTables["meetups"]["Row"]
export type ChatMessageRow = PublicTables["chat_messages"]["Row"]
export type PressQuoteRow = PublicTables["press_quotes"]["Row"]

export type BudgetBand = Database["public"]["Enums"]["budget_band"]
export type AreaRegion = Database["public"]["Enums"]["area_region"]

export type CityWithWeather = CityRow & {
  city_weather: CityWeatherRow | null
}
