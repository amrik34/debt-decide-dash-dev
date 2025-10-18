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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      affiliates: {
        Row: {
          add_to_master_list: boolean | null
          affiliate_name: string | null
          assigned_to: string | null
          avatar_url: string | null
          city: string | null
          company: string | null
          company_website: string | null
          country: string | null
          created_at: string
          date_added: string
          email: string
          fax: string | null
          first_name: string | null
          id: string
          last_name: string | null
          mailing_address: string | null
          notes: string | null
          phone: string | null
          phone_ext: string | null
          phone_mobile: string | null
          portal_access: boolean | null
          state: string | null
          status: string
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          add_to_master_list?: boolean | null
          affiliate_name?: string | null
          assigned_to?: string | null
          avatar_url?: string | null
          city?: string | null
          company?: string | null
          company_website?: string | null
          country?: string | null
          created_at?: string
          date_added?: string
          email: string
          fax?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          mailing_address?: string | null
          notes?: string | null
          phone?: string | null
          phone_ext?: string | null
          phone_mobile?: string | null
          portal_access?: boolean | null
          state?: string | null
          status?: string
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          add_to_master_list?: boolean | null
          affiliate_name?: string | null
          assigned_to?: string | null
          avatar_url?: string | null
          city?: string | null
          company?: string | null
          company_website?: string | null
          country?: string | null
          created_at?: string
          date_added?: string
          email?: string
          fax?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          mailing_address?: string | null
          notes?: string | null
          phone?: string | null
          phone_ext?: string | null
          phone_mobile?: string | null
          portal_access?: boolean | null
          state?: string | null
          status?: string
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          created_at: string | null
          current_address: string | null
          date_of_birth: string | null
          email: string | null
          employer: string | null
          id: string
          name: string
          phone: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_address?: string | null
          date_of_birth?: string | null
          email?: string | null
          employer?: string | null
          id?: string
          name: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_address?: string | null
          date_of_birth?: string | null
          email?: string | null
          employer?: string | null
          id?: string
          name?: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      company_profile: {
        Row: {
          apt_suite_unit: string | null
          city: string | null
          company_name: string | null
          country: string | null
          created_at: string
          fax: string | null
          id: string
          invoice_company_name: string | null
          mailing_address: string | null
          phone: string | null
          sender_email: string | null
          sender_name: string | null
          state: string | null
          time_zone: string | null
          updated_at: string
          website: string | null
          zip_code: string | null
        }
        Insert: {
          apt_suite_unit?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          fax?: string | null
          id?: string
          invoice_company_name?: string | null
          mailing_address?: string | null
          phone?: string | null
          sender_email?: string | null
          sender_name?: string | null
          state?: string | null
          time_zone?: string | null
          updated_at?: string
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          apt_suite_unit?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          fax?: string | null
          id?: string
          invoice_company_name?: string | null
          mailing_address?: string | null
          phone?: string | null
          sender_email?: string | null
          sender_name?: string | null
          state?: string | null
          time_zone?: string | null
          updated_at?: string
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      credit_reports: {
        Row: {
          accounts: Json | null
          analysis_data: Json | null
          client_id: string | null
          created_at: string
          creditor_contacts: Json | null
          fico_scores: Json | null
          file_name: string
          file_path: string
          id: string
          inquiries: Json | null
          personal_info: Json | null
          personal_info_field_statuses: Json | null
          provider: string | null
          public_records: Json | null
          reference_number: string | null
          report_date: string | null
          saved_date: string
          status: string
          summary: Json | null
          updated_at: string
        }
        Insert: {
          accounts?: Json | null
          analysis_data?: Json | null
          client_id?: string | null
          created_at?: string
          creditor_contacts?: Json | null
          fico_scores?: Json | null
          file_name: string
          file_path: string
          id?: string
          inquiries?: Json | null
          personal_info?: Json | null
          personal_info_field_statuses?: Json | null
          provider?: string | null
          public_records?: Json | null
          reference_number?: string | null
          report_date?: string | null
          saved_date?: string
          status?: string
          summary?: Json | null
          updated_at?: string
        }
        Update: {
          accounts?: Json | null
          analysis_data?: Json | null
          client_id?: string | null
          created_at?: string
          creditor_contacts?: Json | null
          fico_scores?: Json | null
          file_name?: string
          file_path?: string
          id?: string
          inquiries?: Json | null
          personal_info?: Json | null
          personal_info_field_statuses?: Json | null
          provider?: string | null
          public_records?: Json | null
          reference_number?: string | null
          report_date?: string | null
          saved_date?: string
          status?: string
          summary?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_reports_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      dispute_items: {
        Row: {
          account_number: string | null
          account_type: string | null
          balance: number | null
          bureau: string
          created_at: string
          credit_report_id: string
          creditor_name: string | null
          date_opened: string | null
          dispute_reason: string | null
          equifax_status: string | null
          experian_status: string | null
          id: string
          instructions: string | null
          item_data: Json
          item_type: string
          last_reported: string | null
          payment_status: string | null
          reason: string | null
          status: string
          transunion_status: string | null
          updated_at: string
        }
        Insert: {
          account_number?: string | null
          account_type?: string | null
          balance?: number | null
          bureau: string
          created_at?: string
          credit_report_id: string
          creditor_name?: string | null
          date_opened?: string | null
          dispute_reason?: string | null
          equifax_status?: string | null
          experian_status?: string | null
          id?: string
          instructions?: string | null
          item_data: Json
          item_type: string
          last_reported?: string | null
          payment_status?: string | null
          reason?: string | null
          status?: string
          transunion_status?: string | null
          updated_at?: string
        }
        Update: {
          account_number?: string | null
          account_type?: string | null
          balance?: number | null
          bureau?: string
          created_at?: string
          credit_report_id?: string
          creditor_name?: string | null
          date_opened?: string | null
          dispute_reason?: string | null
          equifax_status?: string | null
          experian_status?: string | null
          id?: string
          instructions?: string | null
          item_data?: Json
          item_type?: string
          last_reported?: string | null
          payment_status?: string | null
          reason?: string | null
          status?: string
          transunion_status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dispute_items_credit_report_id_fkey"
            columns: ["credit_report_id"]
            isOneToOne: false
            referencedRelation: "credit_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      letters: {
        Row: {
          ai_eligible: boolean | null
          category: string
          content: string | null
          created_at: string
          id: string
          is_favorite: boolean | null
          letter_title: string
          status: string
          updated_at: string
        }
        Insert: {
          ai_eligible?: boolean | null
          category?: string
          content?: string | null
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          letter_title: string
          status?: string
          updated_at?: string
        }
        Update: {
          ai_eligible?: boolean | null
          category?: string
          content?: string | null
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          letter_title?: string
          status?: string
          updated_at?: string
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
