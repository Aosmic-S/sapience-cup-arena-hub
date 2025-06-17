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
      announcements: {
        Row: {
          content: string
          created_at: string | null
          id: string
          priority: string | null
          title: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          priority?: string | null
          title: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          priority?: string | null
          title?: string
        }
        Relationships: []
      }
      banner_settings: {
        Row: {
          color: string | null
          id: number
          is_active: boolean | null
          is_blinking: boolean | null
          text: string | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          id?: number
          is_active?: boolean | null
          is_blinking?: boolean | null
          text?: string | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          id?: number
          is_active?: boolean | null
          is_blinking?: boolean | null
          text?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      games: {
        Row: {
          color: string
          created_at: string | null
          description: string | null
          display_name: string
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          color: string
          created_at?: string | null
          description?: string | null
          display_name: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string
          created_at?: string | null
          description?: string | null
          display_name?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      leaderboard: {
        Row: {
          created_at: string | null
          game: string
          id: string
          last_updated: string | null
          losses: number | null
          matches_played: number | null
          points: number | null
          rank_position: number | null
          team_number: string | null
          wins: number | null
        }
        Insert: {
          created_at?: string | null
          game: string
          id?: string
          last_updated?: string | null
          losses?: number | null
          matches_played?: number | null
          points?: number | null
          rank_position?: number | null
          team_number?: string | null
          wins?: number | null
        }
        Update: {
          created_at?: string | null
          game?: string
          id?: string
          last_updated?: string | null
          losses?: number | null
          matches_played?: number | null
          points?: number | null
          rank_position?: number | null
          team_number?: string | null
          wins?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_team_number_fkey"
            columns: ["team_number"]
            isOneToOne: false
            referencedRelation: "registrations"
            referencedColumns: ["team_number"]
          },
        ]
      }
      match_days: {
        Row: {
          created_at: string | null
          date: string
          description: string | null
          game: string
          id: string
          time: string
        }
        Insert: {
          created_at?: string | null
          date: string
          description?: string | null
          game: string
          id?: string
          time: string
        }
        Update: {
          created_at?: string | null
          date?: string
          description?: string | null
          game?: string
          id?: string
          time?: string
        }
        Relationships: []
      }
      match_results: {
        Row: {
          created_at: string | null
          game: string
          id: string
          match_date: string
          notes: string | null
          points_earned: number | null
          result: string | null
          team_number: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          game: string
          id?: string
          match_date: string
          notes?: string | null
          points_earned?: number | null
          result?: string | null
          team_number?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          game?: string
          id?: string
          match_date?: string
          notes?: string | null
          points_earned?: number | null
          result?: string | null
          team_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_results_team_number_fkey"
            columns: ["team_number"]
            isOneToOne: false
            referencedRelation: "registrations"
            referencedColumns: ["team_number"]
          },
        ]
      }
      registrations: {
        Row: {
          class_section: string
          created_at: string | null
          entry_type: string
          full_name: string
          game: string
          id: string
          in_game_id: string | null
          members: string[] | null
          password_hash: string | null
          phone_number: string
          team_name: string | null
          team_number: string | null
          uid: string | null
        }
        Insert: {
          class_section: string
          created_at?: string | null
          entry_type: string
          full_name: string
          game: string
          id?: string
          in_game_id?: string | null
          members?: string[] | null
          password_hash?: string | null
          phone_number: string
          team_name?: string | null
          team_number?: string | null
          uid?: string | null
        }
        Update: {
          class_section?: string
          created_at?: string | null
          entry_type?: string
          full_name?: string
          game?: string
          id?: string
          in_game_id?: string | null
          members?: string[] | null
          password_hash?: string | null
          phone_number?: string
          team_name?: string | null
          team_number?: string | null
          uid?: string | null
        }
        Relationships: []
      }
      rules_content: {
        Row: {
          codm: string | null
          conduct: string | null
          created_at: string | null
          fcmobile: string | null
          freefire: string | null
          general: string | null
          id: number
          tournament: string | null
          updated_at: string | null
        }
        Insert: {
          codm?: string | null
          conduct?: string | null
          created_at?: string | null
          fcmobile?: string | null
          freefire?: string | null
          general?: string | null
          id?: number
          tournament?: string | null
          updated_at?: string | null
        }
        Update: {
          codm?: string | null
          conduct?: string | null
          created_at?: string | null
          fcmobile?: string | null
          freefire?: string | null
          general?: string | null
          id?: number
          tournament?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          auto_approval: boolean | null
          email_notifications: boolean | null
          id: number
          max_participants: number | null
          registration_open: boolean | null
          updated_at: string | null
        }
        Insert: {
          auto_approval?: boolean | null
          email_notifications?: boolean | null
          id?: number
          max_participants?: number | null
          registration_open?: boolean | null
          updated_at?: string | null
        }
        Update: {
          auto_approval?: boolean | null
          email_notifications?: boolean | null
          id?: number
          max_participants?: number | null
          registration_open?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_team_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      update_leaderboard_rankings: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
