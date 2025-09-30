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
      afls_assessments: {
        Row: {
          assessment_date: string
          assessment_type: string
          assessor_id: string | null
          created_at: string | null
          domain: string
          id: string
          max_score: number
          notes: string | null
          score: number
          skill: string
          status: string | null
          student_id: string | null
          updated_at: string | null
        }
        Insert: {
          assessment_date: string
          assessment_type: string
          assessor_id?: string | null
          created_at?: string | null
          domain: string
          id?: string
          max_score: number
          notes?: string | null
          score: number
          skill: string
          status?: string | null
          student_id?: string | null
          updated_at?: string | null
        }
        Update: {
          assessment_date?: string
          assessment_type?: string
          assessor_id?: string | null
          created_at?: string | null
          domain?: string
          id?: string
          max_score?: number
          notes?: string | null
          score?: number
          skill?: string
          status?: string | null
          student_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "afls_assessments_assessor_id_fkey"
            columns: ["assessor_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "afls_assessments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      data_collection_sessions: {
        Row: {
          assessment_type: string | null
          created_at: string | null
          id: string
          notes: string | null
          session_date: string
          session_type: string
          student_id: string | null
          teacher_id: string | null
          transcription: string | null
          updated_at: string | null
          voice_recording_url: string | null
        }
        Insert: {
          assessment_type?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          session_date: string
          session_type: string
          student_id?: string | null
          teacher_id?: string | null
          transcription?: string | null
          updated_at?: string | null
          voice_recording_url?: string | null
        }
        Update: {
          assessment_type?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          session_date?: string
          session_type?: string
          student_id?: string | null
          teacher_id?: string | null
          transcription?: string | null
          updated_at?: string | null
          voice_recording_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_collection_sessions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_collection_sessions_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      document_uploads: {
        Row: {
          created_at: string | null
          extracted_data: Json | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id: string
          processing_status: string | null
          student_id: string | null
          teacher_id: string | null
          updated_at: string | null
          upload_source: string
        }
        Insert: {
          created_at?: string | null
          extracted_data?: Json | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id?: string
          processing_status?: string | null
          student_id?: string | null
          teacher_id?: string | null
          updated_at?: string | null
          upload_source: string
        }
        Update: {
          created_at?: string | null
          extracted_data?: Json | null
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          processing_status?: string | null
          student_id?: string | null
          teacher_id?: string | null
          updated_at?: string | null
          upload_source?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_uploads_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_uploads_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      iep_goals: {
        Row: {
          accommodations: string
          created_at: string | null
          current_progress: number | null
          description: string
          domain: string
          id: string
          level: string
          measurement: string
          objectives: Json
          status: string | null
          student_id: string | null
          target_percentage: number
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          accommodations: string
          created_at?: string | null
          current_progress?: number | null
          description: string
          domain: string
          id?: string
          level: string
          measurement: string
          objectives?: Json
          status?: string | null
          student_id?: string | null
          target_percentage: number
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          accommodations?: string
          created_at?: string | null
          current_progress?: number | null
          description?: string
          domain?: string
          id?: string
          level?: string
          measurement?: string
          objectives?: Json
          status?: string | null
          student_id?: string | null
          target_percentage?: number
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "iep_goals_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      session_data_points: {
        Row: {
          created_at: string | null
          goal_id: string | null
          id: string
          max_score: number | null
          notes: string | null
          performance_level: string
          score: number | null
          session_id: string | null
        }
        Insert: {
          created_at?: string | null
          goal_id?: string | null
          id?: string
          max_score?: number | null
          notes?: string | null
          performance_level: string
          score?: number | null
          session_id?: string | null
        }
        Update: {
          created_at?: string | null
          goal_id?: string | null
          id?: string
          max_score?: number | null
          notes?: string | null
          performance_level?: string
          score?: number | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_data_points_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "iep_goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_data_points_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "data_collection_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          age: number
          created_at: string | null
          disability: string
          grade: string
          id: string
          name: string
          profile_picture_url: string | null
          school: string
          student_id: string
          teacher_id: string | null
          updated_at: string | null
        }
        Insert: {
          age: number
          created_at?: string | null
          disability: string
          grade: string
          id?: string
          name: string
          profile_picture_url?: string | null
          school: string
          student_id: string
          teacher_id?: string | null
          updated_at?: string | null
        }
        Update: {
          age?: number
          created_at?: string | null
          disability?: string
          grade?: string
          id?: string
          name?: string
          profile_picture_url?: string | null
          school?: string
          student_id?: string
          teacher_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          school: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          school: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          school?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      vb_mapp_milestones: {
        Row: {
          created_at: string | null
          document_upload_id: string | null
          domain: string
          id: string
          level: string
          max_score: number | null
          milestone_description: string | null
          milestone_number: number
          notes: string | null
          score: number | null
          session_id: string | null
          student_id: string
          test_date: string | null
          tester_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          document_upload_id?: string | null
          domain: string
          id?: string
          level: string
          max_score?: number | null
          milestone_description?: string | null
          milestone_number: number
          notes?: string | null
          score?: number | null
          session_id?: string | null
          student_id: string
          test_date?: string | null
          tester_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          document_upload_id?: string | null
          domain?: string
          id?: string
          level?: string
          max_score?: number | null
          milestone_description?: string | null
          milestone_number?: number
          notes?: string | null
          score?: number | null
          session_id?: string | null
          student_id?: string
          test_date?: string | null
          tester_name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vb_mapp_milestones_document_upload_id_fkey"
            columns: ["document_upload_id"]
            isOneToOne: false
            referencedRelation: "document_uploads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vb_mapp_milestones_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "data_collection_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vb_mapp_milestones_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_student_progress: {
        Args: { student_uuid: string }
        Returns: {
          current_progress: number
          goal_id: string
          goal_title: string
          last_session_date: string
          sessions_count: number
          target_percentage: number
        }[]
      }
      get_student_assessment_summary: {
        Args: { student_uuid: string }
        Returns: {
          avg_score: number
          domain: string
          last_assessment_date: string
          total_assessments: number
        }[]
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