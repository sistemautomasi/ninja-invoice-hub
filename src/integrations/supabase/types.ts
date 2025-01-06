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
      activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_metrics: {
        Row: {
          ad_spend: number
          campaign_name: string
          clicks: number
          conversions: number
          created_at: string
          date: string
          id: string
          impressions: number
          platform: string
          revenue: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          ad_spend?: number
          campaign_name: string
          clicks?: number
          conversions?: number
          created_at?: string
          date?: string
          id?: string
          impressions?: number
          platform: string
          revenue?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          ad_spend?: number
          campaign_name?: string
          clicks?: number
          conversions?: number
          created_at?: string
          date?: string
          id?: string
          impressions?: number
          platform?: string
          revenue?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      business_costs: {
        Row: {
          amount: number
          cost_type: string
          created_at: string
          date: string
          description: string | null
          id: string
          platform: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number
          cost_type: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          platform?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          cost_type?: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          platform?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      customer_metrics: {
        Row: {
          created_at: string
          first_purchase_date: string | null
          id: string
          last_purchase_date: string | null
          lifetime_value: number | null
          total_orders: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          first_purchase_date?: string | null
          id?: string
          last_purchase_date?: string | null
          lifetime_value?: number | null
          total_orders?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          first_purchase_date?: string | null
          id?: string
          last_purchase_date?: string | null
          lifetime_value?: number | null
          total_orders?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      inventory_alerts: {
        Row: {
          alert_type: string
          created_at: string
          id: string
          product_id: string | null
          threshold: number | null
        }
        Insert: {
          alert_type: string
          created_at?: string
          id?: string
          product_id?: string | null
          threshold?: number | null
        }
        Update: {
          alert_type?: string
          created_at?: string
          id?: string
          product_id?: string | null
          threshold?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_alerts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      login_history: {
        Row: {
          browser: string
          created_at: string
          device_name: string
          id: string
          ip_address: string | null
          is_active: boolean | null
          last_accessed: string
          user_id: string
        }
        Insert: {
          browser: string
          created_at?: string
          device_name: string
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_accessed?: string
          user_id: string
        }
        Update: {
          browser?: string
          created_at?: string
          device_name?: string
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_accessed?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean | null
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string | null
          price_at_time: number
          product_id: string | null
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id?: string | null
          price_at_time: number
          product_id?: string | null
          quantity: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string | null
          price_at_time?: number
          product_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string | null
          browser: string | null
          city: string | null
          created_at: string
          customer_name: string | null
          customer_rating: number | null
          delivery_status: string | null
          district: string | null
          email: string | null
          feedback_text: string | null
          id: string
          order_number: string | null
          phone: string | null
          platform: string | null
          postcode: string | null
          processing_time: unknown | null
          region: string | null
          return_reason: string | null
          state: string | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          browser?: string | null
          city?: string | null
          created_at?: string
          customer_name?: string | null
          customer_rating?: number | null
          delivery_status?: string | null
          district?: string | null
          email?: string | null
          feedback_text?: string | null
          id?: string
          order_number?: string | null
          phone?: string | null
          platform?: string | null
          postcode?: string | null
          processing_time?: unknown | null
          region?: string | null
          return_reason?: string | null
          state?: string | null
          status?: string
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          browser?: string | null
          city?: string | null
          created_at?: string
          customer_name?: string | null
          customer_rating?: number | null
          delivery_status?: string | null
          district?: string | null
          email?: string | null
          feedback_text?: string | null
          id?: string
          order_number?: string | null
          phone?: string | null
          platform?: string | null
          postcode?: string | null
          processing_time?: unknown | null
          region?: string | null
          return_reason?: string | null
          state?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          cost: number
          created_at: string
          description: string | null
          id: string
          name: string
          price: number
          stock_quantity: number
          updated_at: string
        }
        Insert: {
          cost?: number
          created_at?: string
          description?: string | null
          id?: string
          name: string
          price: number
          stock_quantity?: number
          updated_at?: string
        }
        Update: {
          cost?: number
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          price?: number
          stock_quantity?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          company: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          job_title: string | null
          location: string | null
          phone: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          job_title?: string | null
          location?: string | null
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          job_title?: string | null
          location?: string | null
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_type: string
          setting_value: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_type?: string
          setting_value?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_type?: string
          setting_value?: string | null
          updated_at?: string
          user_id?: string | null
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
      supported_currency: "MYR" | "USD" | "SGD" | "EUR"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
