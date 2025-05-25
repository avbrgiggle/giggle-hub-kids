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
      activities: {
        Row: {
          age_range: string
          capacity: number
          category: string
          created_at: string
          description: string
          duration: unknown
          id: string
          image_url: string | null
          is_extracurricular: boolean | null
          location: string
          price: number
          provider_id: string | null
          provider_info: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          age_range: string
          capacity: number
          category: string
          created_at?: string
          description: string
          duration: unknown
          id?: string
          image_url?: string | null
          is_extracurricular?: boolean | null
          location: string
          price: number
          provider_id?: string | null
          provider_info?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          age_range?: string
          capacity?: number
          category?: string
          created_at?: string
          description?: string
          duration?: unknown
          id?: string
          image_url?: string | null
          is_extracurricular?: boolean | null
          location?: string
          price?: number
          provider_id?: string | null
          provider_info?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_dates: {
        Row: {
          activity_id: string
          created_at: string
          id: string
          spots_left: number
          start_time: string
          updated_at: string
        }
        Insert: {
          activity_id: string
          created_at?: string
          id?: string
          spots_left: number
          start_time: string
          updated_at?: string
        }
        Update: {
          activity_id?: string
          created_at?: string
          id?: string
          spots_left?: number
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_dates_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_images: {
        Row: {
          activity_id: string
          created_at: string
          id: string
          image_url: string
          updated_at: string
        }
        Insert: {
          activity_id: string
          created_at?: string
          id?: string
          image_url: string
          updated_at?: string
        }
        Update: {
          activity_id?: string
          created_at?: string
          id?: string
          image_url?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_images_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_records: {
        Row: {
          created_at: string
          date: string
          id: string
          notes: string | null
          status: string
          student_activity_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          notes?: string | null
          status: string
          student_activity_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          status?: string
          student_activity_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_student_activity_id_fkey"
            columns: ["student_activity_id"]
            isOneToOne: false
            referencedRelation: "student_activities"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          activity_date_id: string | null
          booking_date: string
          child_id: string
          created_at: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_date_id?: string | null
          booking_date: string
          child_id: string
          created_at?: string
          id?: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_date_id?: string | null
          booking_date?: string
          child_id?: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_activity_date_id_fkey"
            columns: ["activity_date_id"]
            isOneToOne: false
            referencedRelation: "activity_dates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      children: {
        Row: {
          allergies: string[] | null
          created_at: string
          date_of_birth: string
          first_name: string
          gender: string | null
          id: string
          interests: string[] | null
          last_name: string
          medical_conditions: string | null
          parent_id: string
          updated_at: string
        }
        Insert: {
          allergies?: string[] | null
          created_at?: string
          date_of_birth: string
          first_name: string
          gender?: string | null
          id?: string
          interests?: string[] | null
          last_name: string
          medical_conditions?: string | null
          parent_id: string
          updated_at?: string
        }
        Update: {
          allergies?: string[] | null
          created_at?: string
          date_of_birth?: string
          first_name?: string
          gender?: string | null
          id?: string
          interests?: string[] | null
          last_name?: string
          medical_conditions?: string | null
          parent_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "children_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          activity_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          activity_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          activity_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          booking_id: string | null
          content: string
          created_at: string
          id: string
          read: boolean
          receiver_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          booking_id?: string | null
          content: string
          created_at?: string
          id?: string
          read?: boolean
          receiver_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          booking_id?: string | null
          content?: string
          created_at?: string
          id?: string
          read?: boolean
          receiver_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          date: string
          id: string
          invoice_number: string | null
          method: string
          notes: string | null
          status: string
          student_activity_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          date?: string
          id?: string
          invoice_number?: string | null
          method: string
          notes?: string | null
          status: string
          student_activity_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          id?: string
          invoice_number?: string | null
          method?: string
          notes?: string | null
          status?: string
          student_activity_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_student_activity_id_fkey"
            columns: ["student_activity_id"]
            isOneToOne: false
            referencedRelation: "student_activities"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          location: string | null
          phone: string | null
          preferred_communication: string | null
          preferred_payment_method: string | null
          provider_info: Json | null
          referral_code: string | null
          role: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          location?: string | null
          phone?: string | null
          preferred_communication?: string | null
          preferred_payment_method?: string | null
          provider_info?: Json | null
          referral_code?: string | null
          role?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          preferred_communication?: string | null
          preferred_payment_method?: string | null
          provider_info?: Json | null
          referral_code?: string | null
          role?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      provider_signup_codes: {
        Row: {
          code: string
          created_at: string
          email: string
          expires_at: string
          id: string
          updated_at: string
          used: boolean
        }
        Insert: {
          code: string
          created_at?: string
          email: string
          expires_at: string
          id?: string
          updated_at?: string
          used?: boolean
        }
        Update: {
          code?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          updated_at?: string
          used?: boolean
        }
        Relationships: []
      }
      provider_signup_requests: {
        Row: {
          activity_types: string[]
          age_range: string
          created_at: string
          duration_types: string[]
          email: string
          facebook_url: string | null
          id: string
          instagram_url: string | null
          linkedin_url: string | null
          location: string
          name: string
          status: string
          tiktok_url: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          activity_types: string[]
          age_range: string
          created_at?: string
          duration_types: string[]
          email: string
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          location: string
          name: string
          status?: string
          tiktok_url?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          activity_types?: string[]
          age_range?: string
          created_at?: string
          duration_types?: string[]
          email?: string
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          location?: string
          name?: string
          status?: string
          tiktok_url?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      student_activities: {
        Row: {
          active: boolean
          activity_id: string
          attendance_days: string[] | null
          created_at: string
          end_date: string | null
          id: string
          last_payment_date: string | null
          payment_status: string
          start_date: string
          student_id: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          activity_id: string
          attendance_days?: string[] | null
          created_at?: string
          end_date?: string | null
          id?: string
          last_payment_date?: string | null
          payment_status?: string
          start_date: string
          student_id: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          activity_id?: string
          attendance_days?: string[] | null
          created_at?: string
          end_date?: string | null
          id?: string
          last_payment_date?: string | null
          payment_status?: string
          start_date?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_activities_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_activities_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          allergies: string[] | null
          created_at: string
          date_of_birth: string
          emergency_contact: string | null
          first_name: string
          id: string
          last_name: string
          medical_notes: string | null
          notes: string | null
          parent_email: string
          parent_name: string
          parent_phone: string
          provider_id: string
          updated_at: string
        }
        Insert: {
          allergies?: string[] | null
          created_at?: string
          date_of_birth: string
          emergency_contact?: string | null
          first_name: string
          id?: string
          last_name: string
          medical_notes?: string | null
          notes?: string | null
          parent_email: string
          parent_name: string
          parent_phone: string
          provider_id: string
          updated_at?: string
        }
        Update: {
          allergies?: string[] | null
          created_at?: string
          date_of_birth?: string
          emergency_contact?: string | null
          first_name?: string
          id?: string
          last_name?: string
          medical_notes?: string | null
          notes?: string | null
          parent_email?: string
          parent_name?: string
          parent_phone?: string
          provider_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_provider_id_fkey"
            columns: ["provider_id"]
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
      add_favorite: {
        Args: { p_user_id: string; p_activity_id: string }
        Returns: boolean
      }
      check_favorite_exists: {
        Args: { p_user_id: string; p_activity_id: string }
        Returns: boolean
      }
      remove_favorite: {
        Args: { p_user_id: string; p_activity_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
