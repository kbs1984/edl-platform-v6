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
      bank_account: {
        Row: {
          active: boolean
          guardian_id: string
          i_b_a_n: string
          id: string
          name: string
          routing: string
          swift_code: string
        }
        Insert: {
          active: boolean
          guardian_id: string
          i_b_a_n: string
          id?: string
          name: string
          routing: string
          swift_code: string
        }
        Update: {
          active?: boolean
          guardian_id?: string
          i_b_a_n?: string
          id?: string
          name?: string
          routing?: string
          swift_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "BankAccount_guardianId_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "guardian"
            referencedColumns: ["id"]
          },
        ]
      }
      debate_ballot: {
        Row: {
          created_at: string
          id: string
          judge_id: string
          speech_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          judge_id: string
          speech_id: string
          updated_at: string
        }
        Update: {
          created_at?: string
          id?: string
          judge_id?: string
          speech_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "DebateBallot_judgeId_fkey"
            columns: ["judge_id"]
            isOneToOne: false
            referencedRelation: "judge"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "DebateBallot_speechId_fkey"
            columns: ["speech_id"]
            isOneToOne: false
            referencedRelation: "debate_speech"
            referencedColumns: ["id"]
          },
        ]
      }
      debate_ballot_item: {
        Row: {
          ballot_id: string
          category: Database["public"]["Enums"]["ballot_category"]
          comment: string | null
          criterion_id: string
          id: string
          score: number
        }
        Insert: {
          ballot_id: string
          category: Database["public"]["Enums"]["ballot_category"]
          comment?: string | null
          criterion_id: string
          id?: string
          score: number
        }
        Update: {
          ballot_id?: string
          category?: Database["public"]["Enums"]["ballot_category"]
          comment?: string | null
          criterion_id?: string
          id?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "DebateBallotItem_ballotId_fkey"
            columns: ["ballot_id"]
            isOneToOne: false
            referencedRelation: "debate_ballot"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "DebateBallotItem_criterionId_fkey"
            columns: ["criterion_id"]
            isOneToOne: false
            referencedRelation: "debate_criterion"
            referencedColumns: ["id"]
          },
        ]
      }
      debate_criterion: {
        Row: {
          criteria: string
          group: Database["public"]["Enums"]["debate_criterion_group"]
          id: string
          name: string
        }
        Insert: {
          criteria: string
          group: Database["public"]["Enums"]["debate_criterion_group"]
          id?: string
          name: string
        }
        Update: {
          criteria?: string
          group?: Database["public"]["Enums"]["debate_criterion_group"]
          id?: string
          name?: string
        }
        Relationships: []
      }
      debate_motion: {
        Row: {
          created_at: string
          details: string | null
          genre_id: string
          id: string
          proposer_id: string
          topic: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          details?: string | null
          genre_id: string
          id?: string
          proposer_id: string
          topic: string
          updated_at: string
        }
        Update: {
          created_at?: string
          details?: string | null
          genre_id?: string
          id?: string
          proposer_id?: string
          topic?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "DebateMotion_genreId_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "motion_category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "DebateMotion_proposerId_fkey"
            columns: ["proposer_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      debate_participant: {
        Row: {
          accept_time: string | null
          created_at: string
          debate_session_id: string
          id: string
          side: Database["public"]["Enums"]["team_type"]
          status: Database["public"]["Enums"]["status"]
          team_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accept_time?: string | null
          created_at?: string
          debate_session_id: string
          id?: string
          side: Database["public"]["Enums"]["team_type"]
          status?: Database["public"]["Enums"]["status"]
          team_id?: string | null
          updated_at: string
          user_id: string
        }
        Update: {
          accept_time?: string | null
          created_at?: string
          debate_session_id?: string
          id?: string
          side?: Database["public"]["Enums"]["team_type"]
          status?: Database["public"]["Enums"]["status"]
          team_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "DebateParticipant_debateSessionId_fkey"
            columns: ["debate_session_id"]
            isOneToOne: false
            referencedRelation: "debate_session"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "DebateParticipant_teamId_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "DebateParticipant_userId_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      debate_session: {
        Row: {
          created_at: string
          debate_motion_id: string
          description: string
          end_time: string | null
          format: Database["public"]["Enums"]["debate_format"]
          id: string
          start_time: string
          status: Database["public"]["Enums"]["debate_session_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          debate_motion_id: string
          description: string
          end_time?: string | null
          format: Database["public"]["Enums"]["debate_format"]
          id?: string
          start_time: string
          status: Database["public"]["Enums"]["debate_session_status"]
          title: string
          updated_at: string
        }
        Update: {
          created_at?: string
          debate_motion_id?: string
          description?: string
          end_time?: string | null
          format?: Database["public"]["Enums"]["debate_format"]
          id?: string
          start_time?: string
          status?: Database["public"]["Enums"]["debate_session_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "DebateSession_debateMotionId_fkey"
            columns: ["debate_motion_id"]
            isOneToOne: false
            referencedRelation: "debate_motion"
            referencedColumns: ["id"]
          },
        ]
      }
      debate_speech: {
        Row: {
          end_time: string | null
          id: string
          mode: Database["public"]["Enums"]["debate_speech_mode"]
          role: Database["public"]["Enums"]["debate_role_type"]
          round: Database["public"]["Enums"]["debate_round_type"]
          session_id: string
          side: Database["public"]["Enums"]["team_type"]
          speaker_id: string
          start_time: string
          transcript: string | null
          video_link: string
        }
        Insert: {
          end_time?: string | null
          id?: string
          mode: Database["public"]["Enums"]["debate_speech_mode"]
          role: Database["public"]["Enums"]["debate_role_type"]
          round: Database["public"]["Enums"]["debate_round_type"]
          session_id: string
          side: Database["public"]["Enums"]["team_type"]
          speaker_id: string
          start_time: string
          transcript?: string | null
          video_link: string
        }
        Update: {
          end_time?: string | null
          id?: string
          mode?: Database["public"]["Enums"]["debate_speech_mode"]
          role?: Database["public"]["Enums"]["debate_role_type"]
          round?: Database["public"]["Enums"]["debate_round_type"]
          session_id?: string
          side?: Database["public"]["Enums"]["team_type"]
          speaker_id?: string
          start_time?: string
          transcript?: string | null
          video_link?: string
        }
        Relationships: [
          {
            foreignKeyName: "DebateSpeech_sessionId_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "debate_session"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "DebateSpeech_speakerId_fkey"
            columns: ["speaker_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      debate_video_comment: {
        Row: {
          comment: string
          created_at: string
          id: string
          judge_id: string
          round: Database["public"]["Enums"]["debate_round_type"]
          speech_id: string
          timestamp: number
          updated_at: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          judge_id: string
          round: Database["public"]["Enums"]["debate_round_type"]
          speech_id: string
          timestamp: number
          updated_at: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          judge_id?: string
          round?: Database["public"]["Enums"]["debate_round_type"]
          speech_id?: string
          timestamp?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "DebateVideoComment_judgeId_fkey"
            columns: ["judge_id"]
            isOneToOne: false
            referencedRelation: "judge"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "DebateVideoComment_speechId_fkey"
            columns: ["speech_id"]
            isOneToOne: false
            referencedRelation: "debate_speech"
            referencedColumns: ["id"]
          },
        ]
      }
      guardian: {
        Row: {
          billing_address: string
          id: string
          payment_method: string
          user_id: string
        }
        Insert: {
          billing_address: string
          id?: string
          payment_method: string
          user_id: string
        }
        Update: {
          billing_address?: string
          id?: string
          payment_method?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Guardian_userId_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      guild: {
        Row: {
          created_at: string
          description: string
          division: Database["public"]["Enums"]["division"]
          id: string
          image_path: string
          name: string
          requirement: string
          school_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          division: Database["public"]["Enums"]["division"]
          id?: string
          image_path: string
          name: string
          requirement: string
          school_id: string
          updated_at: string
        }
        Update: {
          created_at?: string
          description?: string
          division?: Database["public"]["Enums"]["division"]
          id?: string
          image_path?: string
          name?: string
          requirement?: string
          school_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "Guild_schoolId_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school"
            referencedColumns: ["id"]
          },
        ]
      }
      guild_member: {
        Row: {
          created_at: string
          guild_id: string
          id: string
          is_leader: boolean
          join_date: string | null
          status: Database["public"]["Enums"]["status"]
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          guild_id: string
          id?: string
          is_leader?: boolean
          join_date?: string | null
          status?: Database["public"]["Enums"]["status"]
          student_id: string
          updated_at: string
        }
        Update: {
          created_at?: string
          guild_id?: string
          id?: string
          is_leader?: boolean
          join_date?: string | null
          status?: Database["public"]["Enums"]["status"]
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "GuildMember_guildId_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guild"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "GuildMember_studentId_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student"
            referencedColumns: ["id"]
          },
        ]
      }
      invitation: {
        Row: {
          accepted_at: string | null
          created_at: string
          expires_at: string | null
          guild_id: string | null
          id: string
          invitee_id: string
          inviter_id: string
          status: Database["public"]["Enums"]["status"]
          team_id: string | null
          type: Database["public"]["Enums"]["group_type"]
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          expires_at?: string | null
          guild_id?: string | null
          id?: string
          invitee_id: string
          inviter_id: string
          status?: Database["public"]["Enums"]["status"]
          team_id?: string | null
          type: Database["public"]["Enums"]["group_type"]
          updated_at: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          expires_at?: string | null
          guild_id?: string | null
          id?: string
          invitee_id?: string
          inviter_id?: string
          status?: Database["public"]["Enums"]["status"]
          team_id?: string | null
          type?: Database["public"]["Enums"]["group_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "Invitation_guildId_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guild"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Invitation_inviteeId_fkey"
            columns: ["invitee_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Invitation_inviterId_fkey"
            columns: ["inviter_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Invitation_teamId_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["id"]
          },
        ]
      }
      judge: {
        Row: {
          bank_account_info: string
          biography: string
          id: string
          job_title: string
          referral_user_id: string | null
          user_id: string
        }
        Insert: {
          bank_account_info: string
          biography: string
          id?: string
          job_title: string
          referral_user_id?: string | null
          user_id: string
        }
        Update: {
          bank_account_info?: string
          biography?: string
          id?: string
          job_title?: string
          referral_user_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Judge_referralUserId_fkey"
            columns: ["referral_user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Judge_userId_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      log: {
        Row: {
          created_at: string
          description: string
          guild_id: string | null
          id: string
          log_type: Database["public"]["Enums"]["log_type"]
          student_id: string
          team_id: string | null
          type: Database["public"]["Enums"]["group_type"]
        }
        Insert: {
          created_at?: string
          description: string
          guild_id?: string | null
          id?: string
          log_type: Database["public"]["Enums"]["log_type"]
          student_id: string
          team_id?: string | null
          type: Database["public"]["Enums"]["group_type"]
        }
        Update: {
          created_at?: string
          description?: string
          guild_id?: string | null
          id?: string
          log_type?: Database["public"]["Enums"]["log_type"]
          student_id?: string
          team_id?: string | null
          type?: Database["public"]["Enums"]["group_type"]
        }
        Relationships: [
          {
            foreignKeyName: "Log_guildId_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guild"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Log_studentId_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Log_teamId_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["id"]
          },
        ]
      }
      motion_category: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_history: {
        Row: {
          amount: number
          currency_code: string
          guardian_id: string
          id: string
          payment_date: string
          payment_provider: Database["public"]["Enums"]["payment_provider"]
          payment_state: Database["public"]["Enums"]["payment_state"]
        }
        Insert: {
          amount: number
          currency_code: string
          guardian_id: string
          id?: string
          payment_date: string
          payment_provider: Database["public"]["Enums"]["payment_provider"]
          payment_state: Database["public"]["Enums"]["payment_state"]
        }
        Update: {
          amount?: number
          currency_code?: string
          guardian_id?: string
          id?: string
          payment_date?: string
          payment_provider?: Database["public"]["Enums"]["payment_provider"]
          payment_state?: Database["public"]["Enums"]["payment_state"]
        }
        Relationships: [
          {
            foreignKeyName: "PaymentHistory_guardianId_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "guardian"
            referencedColumns: ["id"]
          },
        ]
      }
      profile: {
        Row: {
          active: boolean | null
          date_of_birth: string | null
          gender: Database["public"]["Enums"]["gender"] | null
          id: string
          image_path: string | null
          name: string | null
          term_agree_time: string | null
          user_role: Database["public"]["Enums"]["user_role_type"] | null
          username: string | null
        }
        Insert: {
          active?: boolean | null
          date_of_birth?: string | null
          gender?: Database["public"]["Enums"]["gender"] | null
          id?: string
          image_path?: string | null
          name?: string | null
          term_agree_time?: string | null
          user_role?: Database["public"]["Enums"]["user_role_type"] | null
          username?: string | null
        }
        Update: {
          active?: boolean | null
          date_of_birth?: string | null
          gender?: Database["public"]["Enums"]["gender"] | null
          id?: string
          image_path?: string | null
          name?: string | null
          term_agree_time?: string | null
          user_role?: Database["public"]["Enums"]["user_role_type"] | null
          username?: string | null
        }
        Relationships: []
      }
      rating: {
        Row: {
          created_at: string
          id: string
          judge_id: string
          rate: number
          rater_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          judge_id: string
          rate: number
          rater_id: string
        }
        Update: {
          created_at?: string
          id?: string
          judge_id?: string
          rate?: number
          rater_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Rating_judgeId_fkey"
            columns: ["judge_id"]
            isOneToOne: false
            referencedRelation: "judge"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Rating_raterId_fkey"
            columns: ["rater_id"]
            isOneToOne: false
            referencedRelation: "student"
            referencedColumns: ["id"]
          },
        ]
      }
      school: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      student: {
        Row: {
          challenge_enabled: boolean
          division: Database["public"]["Enums"]["division"] | null
          exp: number
          graduation_year: number
          guardian_id: string | null
          id: string
          level: number
          location: string
          ranking: number
          school_id: string | null
          user_id: string
        }
        Insert: {
          challenge_enabled?: boolean
          division?: Database["public"]["Enums"]["division"] | null
          exp?: number
          graduation_year: number
          guardian_id?: string | null
          id?: string
          level?: number
          location: string
          ranking?: number
          school_id?: string | null
          user_id: string
        }
        Update: {
          challenge_enabled?: boolean
          division?: Database["public"]["Enums"]["division"] | null
          exp?: number
          graduation_year?: number
          guardian_id?: string | null
          id?: string
          level?: number
          location?: string
          ranking?: number
          school_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Student_guardianId_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "guardian"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Student_schoolId_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Student_userId_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      team: {
        Row: {
          created_at: string
          division: Database["public"]["Enums"]["division"]
          id: string
          image_path: string
          name: string
          requirement: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          division: Database["public"]["Enums"]["division"]
          id?: string
          image_path: string
          name: string
          requirement: string
          updated_at: string
        }
        Update: {
          created_at?: string
          division?: Database["public"]["Enums"]["division"]
          id?: string
          image_path?: string
          name?: string
          requirement?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_member: {
        Row: {
          created_at: string
          id: string
          is_leader: boolean
          join_date: string | null
          status: Database["public"]["Enums"]["status"]
          student_id: string
          team_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_leader?: boolean
          join_date?: string | null
          status?: Database["public"]["Enums"]["status"]
          student_id: string
          team_id: string
          updated_at: string
        }
        Update: {
          created_at?: string
          id?: string
          is_leader?: boolean
          join_date?: string | null
          status?: Database["public"]["Enums"]["status"]
          student_id?: string
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "TeamMember_studentId_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TeamMember_teamId_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team"
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
      ballot_category: "RESPECT" | "ANALYSIS" | "STYLE"
      debate_criterion_group: "RESPECT" | "ANALYSIS" | "STYLE"
      debate_format: "SOLO" | "FLEX"
      debate_role_type: "FRONT_END" | "BACK_END" | "QUARTERBACK"
      debate_round_type: "FRONT_END" | "CROSSFIRE" | "BACK_END" | "SUMMARY"
      debate_session_status: "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELLED"
      debate_speech_mode: "SYNC" | "ASYNC"
      division: "VILLIGER" | "LOWER" | "UPPER" | "SENIOR" | "OPEN"
      gender: "MALE" | "FEMALE"
      group_type: "GUILD" | "TEAM"
      log_type:
        | "REQUEST_JOIN"
        | "JOINED"
        | "LEFT"
        | "INVITED"
        | "KICKED"
        | "UPDATED"
        | "DELETED"
        | "CREATED"
      payment_provider: "TOSS" | "NAVER_PAY" | "KAKAO_PAY"
      payment_state:
        | "REQUESTED"
        | "PENDING"
        | "FAILED"
        | "COMPLETED"
        | "AUTHORIZED"
        | "ABANDONED"
        | "REFUNDED"
        | "PREAPPROVED"
      status: "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED" | "CANCELLED"
      team_type: "A" | "B"
      user_role_type: "STUDENT" | "JUDGE" | "GUARDIAN"
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
    Enums: {
      ballot_category: ["RESPECT", "ANALYSIS", "STYLE"],
      debate_criterion_group: ["RESPECT", "ANALYSIS", "STYLE"],
      debate_format: ["SOLO", "FLEX"],
      debate_role_type: ["FRONT_END", "BACK_END", "QUARTERBACK"],
      debate_round_type: ["FRONT_END", "CROSSFIRE", "BACK_END", "SUMMARY"],
      debate_session_status: ["SCHEDULED", "ONGOING", "COMPLETED", "CANCELLED"],
      debate_speech_mode: ["SYNC", "ASYNC"],
      division: ["VILLIGER", "LOWER", "UPPER", "SENIOR", "OPEN"],
      gender: ["MALE", "FEMALE"],
      group_type: ["GUILD", "TEAM"],
      log_type: [
        "REQUEST_JOIN",
        "JOINED",
        "LEFT",
        "INVITED",
        "KICKED",
        "UPDATED",
        "DELETED",
        "CREATED",
      ],
      payment_provider: ["TOSS", "NAVER_PAY", "KAKAO_PAY"],
      payment_state: [
        "REQUESTED",
        "PENDING",
        "FAILED",
        "COMPLETED",
        "AUTHORIZED",
        "ABANDONED",
        "REFUNDED",
        "PREAPPROVED",
      ],
      status: ["PENDING", "ACCEPTED", "REJECTED", "EXPIRED", "CANCELLED"],
      team_type: ["A", "B"],
      user_role_type: ["STUDENT", "JUDGE", "GUARDIAN"],
    },
  },
} as const
