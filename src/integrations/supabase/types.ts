export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      alojamientos: {
        Row: {
          created_at: string
          habitacion: string
          id: string
          observaciones: string | null
          plazas: number
          propiedad: string
          tipo_cama: string | null
        }
        Insert: {
          created_at?: string
          habitacion: string
          id?: string
          observaciones?: string | null
          plazas?: number
          propiedad: string
          tipo_cama?: string | null
        }
        Update: {
          created_at?: string
          habitacion?: string
          id?: string
          observaciones?: string | null
          plazas?: number
          propiedad?: string
          tipo_cama?: string | null
        }
        Relationships: []
      }
      deleted_guests: {
        Row: {
          cancion_favorita: string | null
          comentario: string | null
          consentimiento_publicacion: boolean
          date: string
          deleted_at: string
          id: string
          menu: string
          menu_acompanante: string | null
          nombre: string
          plus_one: boolean
        }
        Insert: {
          cancion_favorita?: string | null
          comentario?: string | null
          consentimiento_publicacion?: boolean
          date: string
          deleted_at?: string
          id: string
          menu: string
          menu_acompanante?: string | null
          nombre: string
          plus_one: boolean
        }
        Update: {
          cancion_favorita?: string | null
          comentario?: string | null
          consentimiento_publicacion?: boolean
          date?: string
          deleted_at?: string
          id?: string
          menu?: string
          menu_acompanante?: string | null
          nombre?: string
          plus_one?: boolean
        }
        Relationships: []
      }
      guests: {
        Row: {
          cancion_favorita: string | null
          color: string | null
          color_acompanante: string | null
          comentario: string | null
          con_ninos: boolean
          consentimiento_publicacion: boolean
          date: string
          habitacion: string | null
          id: string
          menu: string
          menu_acompanante: string | null
          mesa: number | null
          nombre: string
          nombre_acompanante: string | null
          pernocta_sabado: boolean
          plus_one: boolean
        }
        Insert: {
          cancion_favorita?: string | null
          color?: string | null
          color_acompanante?: string | null
          comentario?: string | null
          con_ninos?: boolean
          consentimiento_publicacion?: boolean
          date?: string
          habitacion?: string | null
          id?: string
          menu: string
          menu_acompanante?: string | null
          mesa?: number | null
          nombre: string
          nombre_acompanante?: string | null
          pernocta_sabado?: boolean
          plus_one: boolean
        }
        Update: {
          cancion_favorita?: string | null
          color?: string | null
          color_acompanante?: string | null
          comentario?: string | null
          con_ninos?: boolean
          consentimiento_publicacion?: boolean
          date?: string
          habitacion?: string | null
          id?: string
          menu?: string
          menu_acompanante?: string | null
          mesa?: number | null
          nombre?: string
          nombre_acompanante?: string | null
          pernocta_sabado?: boolean
          plus_one?: boolean
        }
        Relationships: []
      }
      mesa_layout_config: {
        Row: {
          created_at: string
          id: string
          space_height: number
          space_width: number
        }
        Insert: {
          created_at?: string
          id?: string
          space_height?: number
          space_width?: number
        }
        Update: {
          created_at?: string
          id?: string
          space_height?: number
          space_width?: number
        }
        Relationships: []
      }
      mesa_positions: {
        Row: {
          created_at: string
          height: number
          id: string
          mesa_name: string
          width: number
          x: number
          y: number
        }
        Insert: {
          created_at?: string
          height?: number
          id?: string
          mesa_name: string
          width?: number
          x?: number
          y?: number
        }
        Update: {
          created_at?: string
          height?: number
          id?: string
          mesa_name?: string
          width?: number
          x?: number
          y?: number
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
