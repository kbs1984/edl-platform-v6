export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  chat: {
    Tables: {
      message: {
        Row: {
          content: string
          created_at: string
          id: string
          is_system: boolean
          room_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_system?: boolean
          room_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_system?: boolean
          room_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room"
            referencedColumns: ["id"]
          },
        ]
      }
      participant: {
        Row: {
          id: string
          joined_at: string
          last_read_at: string
          room_id: string
          student_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          last_read_at?: string
          room_id: string
          student_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          last_read_at?: string
          room_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "participant_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room"
            referencedColumns: ["id"]
          },
        ]
      }
      room: {
        Row: {
          created_at: string
          guild_id: string | null
          id: string
          team_id: string | null
          title: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          guild_id?: string | null
          id?: string
          team_id?: string | null
          title?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          guild_id?: string | null
          id?: string
          team_id?: string | null
          title?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_friendship: {
        Args: { p_friendship_id: string }
        Returns: string
      }
      get_friend_room: {
        Args: { p_user: string; p_friend: string }
        Returns: {
          created_at: string
          guild_id: string | null
          id: string
          team_id: string | null
          title: string | null
          type: string
          updated_at: string
        }
      }
      get_room_messages: {
        Args: { p_room_id: string }
        Returns: {
          id: string
          room_id: string
          sender_id: string
          content: string
          is_system: boolean
          created_at: string
          updated_at: string
          sender_name: string
          image_path: string
        }[]
      }
      is_room_member: {
        Args: { p_room_id: string; p_user_id: string }
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
  debate: {
    Tables: {
      ballots: {
        Row: {
          created_at: string | null
          debate_id: string
          format_id: string
          id: string
          judge_id: string
          status:
            | Database["public"]["Enums"]["debate_ballot_status_enum"]
            | null
          submitted_at: string | null
          updated_at: string | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          debate_id: string
          format_id: string
          id?: string
          judge_id: string
          status?:
            | Database["public"]["Enums"]["debate_ballot_status_enum"]
            | null
          submitted_at?: string | null
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string | null
          debate_id?: string
          format_id?: string
          id?: string
          judge_id?: string
          status?:
            | Database["public"]["Enums"]["debate_ballot_status_enum"]
            | null
          submitted_at?: string | null
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ballots_debate_id_fkey"
            columns: ["debate_id"]
            isOneToOne: false
            referencedRelation: "debates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ballots_format_id_fkey"
            columns: ["format_id"]
            isOneToOne: false
            referencedRelation: "debate_formats"
            referencedColumns: ["id"]
          },
        ]
      }
      criteria: {
        Row: {
          criteria: string
          format_id: string | null
          group: Database["debate"]["Enums"]["criteria_group"]
          id: string
          label: string
          name: string
        }
        Insert: {
          criteria: string
          format_id?: string | null
          group: Database["debate"]["Enums"]["criteria_group"]
          id?: string
          label: string
          name: string
        }
        Update: {
          criteria?: string
          format_id?: string | null
          group?: Database["debate"]["Enums"]["criteria_group"]
          id?: string
          label?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "criteria_format_id_fkey"
            columns: ["format_id"]
            isOneToOne: false
            referencedRelation: "debate_formats"
            referencedColumns: ["id"]
          },
        ]
      }
      debate_formats: {
        Row: {
          description: string | null
          id: string
          name: string
          type: Database["debate"]["Enums"]["speech_mode"]
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          type?: Database["debate"]["Enums"]["speech_mode"]
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          type?: Database["debate"]["Enums"]["speech_mode"]
        }
        Relationships: []
      }
      debate_participants: {
        Row: {
          debate_team_id: string
          id: string
          invite_status: Database["public"]["Enums"]["status"] | null
          speaker_position: number
          user_id: string
        }
        Insert: {
          debate_team_id: string
          id?: string
          invite_status?: Database["public"]["Enums"]["status"] | null
          speaker_position: number
          user_id: string
        }
        Update: {
          debate_team_id?: string
          id?: string
          invite_status?: Database["public"]["Enums"]["status"] | null
          speaker_position?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "debate_participants_debate_team_id_fkey"
            columns: ["debate_team_id"]
            isOneToOne: false
            referencedRelation: "debate_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      debate_teams: {
        Row: {
          debate_id: string
          id: string
          side_id: string
        }
        Insert: {
          debate_id: string
          id?: string
          side_id: string
        }
        Update: {
          debate_id?: string
          id?: string
          side_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "debate_teams_debate_id_fkey"
            columns: ["debate_id"]
            isOneToOne: false
            referencedRelation: "debates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "debate_teams_side_id_fkey"
            columns: ["side_id"]
            isOneToOne: false
            referencedRelation: "sides"
            referencedColumns: ["id"]
          },
        ]
      }
      debates: {
        Row: {
          created_at: string
          debate_format_id: string
          id: string
          mode: Database["debate"]["Enums"]["speech_mode"]
          motion_id: string
          scheduled_at: string | null
        }
        Insert: {
          created_at?: string
          debate_format_id: string
          id?: string
          mode: Database["debate"]["Enums"]["speech_mode"]
          motion_id: string
          scheduled_at?: string | null
        }
        Update: {
          created_at?: string
          debate_format_id?: string
          id?: string
          mode?: Database["debate"]["Enums"]["speech_mode"]
          motion_id?: string
          scheduled_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "debates_debate_format_id_fkey"
            columns: ["debate_format_id"]
            isOneToOne: false
            referencedRelation: "debate_formats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "debates_motion_id_fkey"
            columns: ["motion_id"]
            isOneToOne: false
            referencedRelation: "motions"
            referencedColumns: ["id"]
          },
        ]
      }
      format_rounds: {
        Row: {
          debate_format_id: string
          id: string
          number_of_speakers: number
          round_template_id: string
          sequence: number
          side_id: string
          speaker_positions: number[]
        }
        Insert: {
          debate_format_id: string
          id?: string
          number_of_speakers: number
          round_template_id: string
          sequence: number
          side_id: string
          speaker_positions: number[]
        }
        Update: {
          debate_format_id?: string
          id?: string
          number_of_speakers?: number
          round_template_id?: string
          sequence?: number
          side_id?: string
          speaker_positions?: number[]
        }
        Relationships: [
          {
            foreignKeyName: "format_rounds_debate_format_id_fkey"
            columns: ["debate_format_id"]
            isOneToOne: false
            referencedRelation: "debate_formats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "format_rounds_round_template_id_fkey"
            columns: ["round_template_id"]
            isOneToOne: false
            referencedRelation: "round_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "format_rounds_side_id_fkey"
            columns: ["side_id"]
            isOneToOne: false
            referencedRelation: "sides"
            referencedColumns: ["id"]
          },
        ]
      }
      genres: {
        Row: {
          created_at: string
          description: string | null
          id: string
          proposer_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          proposer_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          proposer_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      judge_comments: {
        Row: {
          at_seconds: number
          comment: string
          created_at: string
          criteria_id: string
          id: string
          judge_id: string
          video_id: string
        }
        Insert: {
          at_seconds: number
          comment: string
          created_at?: string
          criteria_id: string
          id?: string
          judge_id: string
          video_id: string
        }
        Update: {
          at_seconds?: number
          comment?: string
          created_at?: string
          criteria_id?: string
          id?: string
          judge_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "judge_comments_criteria_id_fkey"
            columns: ["criteria_id"]
            isOneToOne: false
            referencedRelation: "criteria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "judge_comments_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      judge_scores: {
        Row: {
          created_at: string
          criteria_id: string
          debate_id: string
          id: string
          judge_id: string
          score: number
        }
        Insert: {
          created_at?: string
          criteria_id: string
          debate_id: string
          id?: string
          judge_id: string
          score: number
        }
        Update: {
          created_at?: string
          criteria_id?: string
          debate_id?: string
          id?: string
          judge_id?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "judge_scores_criteria_id_fkey"
            columns: ["criteria_id"]
            isOneToOne: false
            referencedRelation: "criteria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "judge_scores_debate_id_fkey"
            columns: ["debate_id"]
            isOneToOne: false
            referencedRelation: "debates"
            referencedColumns: ["id"]
          },
        ]
      }
      matchmaking_queue_entries: {
        Row: {
          challenge_mode_active: boolean
          debate_format_id: string
          debate_id: string | null
          id: string
          league_id: Database["public"]["Enums"]["division"]
          opponent_id: string | null
          queued_at: string
          status: Database["public"]["Enums"]["debate_session_status"]
          team_id: string
          team_rank: number
        }
        Insert: {
          challenge_mode_active?: boolean
          debate_format_id: string
          debate_id?: string | null
          id?: string
          league_id: Database["public"]["Enums"]["division"]
          opponent_id?: string | null
          queued_at?: string
          status: Database["public"]["Enums"]["debate_session_status"]
          team_id: string
          team_rank: number
        }
        Update: {
          challenge_mode_active?: boolean
          debate_format_id?: string
          debate_id?: string | null
          id?: string
          league_id?: Database["public"]["Enums"]["division"]
          opponent_id?: string | null
          queued_at?: string
          status?: Database["public"]["Enums"]["debate_session_status"]
          team_id?: string
          team_rank?: number
        }
        Relationships: [
          {
            foreignKeyName: "matchmaking_queue_entries_debate_format_id_fkey"
            columns: ["debate_format_id"]
            isOneToOne: false
            referencedRelation: "debate_formats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matchmaking_queue_entries_debate_id_fkey"
            columns: ["debate_id"]
            isOneToOne: false
            referencedRelation: "debates"
            referencedColumns: ["id"]
          },
        ]
      }
      motions: {
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
          updated_at?: string
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
            foreignKeyName: "motions_genre_id_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["id"]
          },
        ]
      }
      round_templates: {
        Row: {
          code: string
          default_time: number | null
          description: string
          id: string
          name: string
        }
        Insert: {
          code: string
          default_time?: number | null
          description: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          default_time?: number | null
          description?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      sides: {
        Row: {
          id: string
          title: string
        }
        Insert: {
          id?: string
          title: string
        }
        Update: {
          id?: string
          title?: string
        }
        Relationships: []
      }
      speeches: {
        Row: {
          content: string | null
          debate_id: string
          delivered_at: string | null
          duration_seconds: number | null
          format_round_id: string
          id: string
          participant_id: string
        }
        Insert: {
          content?: string | null
          debate_id: string
          delivered_at?: string | null
          duration_seconds?: number | null
          format_round_id: string
          id?: string
          participant_id: string
        }
        Update: {
          content?: string | null
          debate_id?: string
          delivered_at?: string | null
          duration_seconds?: number | null
          format_round_id?: string
          id?: string
          participant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "speeches_debate_id_fkey"
            columns: ["debate_id"]
            isOneToOne: false
            referencedRelation: "debates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "speeches_format_round_id_fkey"
            columns: ["format_round_id"]
            isOneToOne: false
            referencedRelation: "format_rounds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "speeches_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "debate_participants"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          debate_id: string
          id: string
          storage_path: string
          uploaded_at: string
          uploaded_by: string
          url: string
        }
        Insert: {
          debate_id: string
          id?: string
          storage_path: string
          uploaded_at?: string
          uploaded_by: string
          url: string
        }
        Update: {
          debate_id?: string
          id?: string
          storage_path?: string
          uploaded_at?: string
          uploaded_by?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "videos_debate_id_fkey"
            columns: ["debate_id"]
            isOneToOne: false
            referencedRelation: "debates"
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
      criteria_group: "STYLE" | "RESPECT" | "ANALYSIS"
      speech_mode: "SYNC" | "ASYNC"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admin: {
        Row: {
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
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
      friendship: {
        Row: {
          accpted_at: string | null
          created_at: string
          friend_id: string
          id: string
          status: Database["public"]["Enums"]["status"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accpted_at?: string | null
          created_at?: string
          friend_id: string
          id?: string
          status?: Database["public"]["Enums"]["status"]
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          accpted_at?: string | null
          created_at?: string
          friend_id?: string
          id?: string
          status?: Database["public"]["Enums"]["status"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "friendship_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "student"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "friendship_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "student"
            referencedColumns: ["user_id"]
          },
        ]
      }
      guardian: {
        Row: {
          billing_address: string | null
          id: string
          payment_method: string | null
          user_id: string
        }
        Insert: {
          billing_address?: string | null
          id?: string
          payment_method?: string | null
          user_id?: string
        }
        Update: {
          billing_address?: string | null
          id?: string
          payment_method?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Guardian_userId_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      guardian_request: {
        Row: {
          created_at: string
          id: string
          reciever: string | null
          sender: string | null
          status: Database["public"]["Enums"]["status"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          reciever?: string | null
          sender?: string | null
          status?: Database["public"]["Enums"]["status"] | null
          updated_at: string
        }
        Update: {
          created_at?: string
          id?: string
          reciever?: string | null
          sender?: string | null
          status?: Database["public"]["Enums"]["status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guardian_request_reciever_fkey"
            columns: ["reciever"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guardian_request_sender_fkey"
            columns: ["sender"]
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
          bank_account_info: string | null
          biography: string
          id: string
          job_title: string
          referral_user_id: string | null
          user_id: string
        }
        Insert: {
          bank_account_info?: string | null
          biography: string
          id?: string
          job_title: string
          referral_user_id?: string | null
          user_id?: string
        }
        Update: {
          bank_account_info?: string | null
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
          active: boolean
          date_of_birth: string | null
          email: string | null
          gender: Database["public"]["Enums"]["gender"] | null
          id: string
          image_path: string | null
          invited: boolean
          name: string | null
          term_agree_time: string | null
          user_role: Database["public"]["Enums"]["user_role_type"] | null
          username: string | null
        }
        Insert: {
          active?: boolean
          date_of_birth?: string | null
          email?: string | null
          gender?: Database["public"]["Enums"]["gender"] | null
          id?: string
          image_path?: string | null
          invited?: boolean
          name?: string | null
          term_agree_time?: string | null
          user_role?: Database["public"]["Enums"]["user_role_type"] | null
          username?: string | null
        }
        Update: {
          active?: boolean
          date_of_birth?: string | null
          email?: string | null
          gender?: Database["public"]["Enums"]["gender"] | null
          id?: string
          image_path?: string | null
          invited?: boolean
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
          created_by: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
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
          relationship_with_guardian: string | null
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
          relationship_with_guardian?: string | null
          school_id?: string | null
          user_id?: string
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
          relationship_with_guardian?: string | null
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
            foreignKeyName: "student_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      team: {
        Row: {
          created_at: string
          description: string
          division: Database["public"]["Enums"]["division"]
          id: string
          image_path: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          division: Database["public"]["Enums"]["division"]
          id?: string
          image_path: string
          name: string
          updated_at: string
        }
        Update: {
          created_at?: string
          description?: string
          division?: Database["public"]["Enums"]["division"]
          id?: string
          image_path?: string
          name?: string
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
            foreignKeyName: "team_member_student_id_fkey1"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profile"
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
      get_friend_list: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          friend_id: string
          created_at: string
          updated_at: string
          status: Database["public"]["Enums"]["status"]
        }[]
      }
      get_friend_profiles: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          friend_id: string
          image_path: string
          username: string
          exp: number
        }[]
      }
      get_profile_and_student: {
        Args: { _user_id: string }
        Returns: {
          id: string
          name: string
          username: string
          image_path: string
          date_of_birth: string
          gender: Database["public"]["Enums"]["gender"]
          user_role: Database["public"]["Enums"]["user_role_type"]
          active: boolean
          term_agree_time: string
          email: string
          invited: boolean
          student_id: string
          guardian_id: string
          school_id: string
          division: Database["public"]["Enums"]["division"]
          location: string
          exp: number
          ranking: number
          challenge_enabled: boolean
          graduation_year: number
          relationship_with_guardian: string
          level: number
        }[]
      }
      get_profile_uuid: {
        Args: { input: string }
        Returns: string
      }
      get_table_ddl: {
        Args: { p_schema_name: string; p_table_name: string }
        Returns: string
      }
      search_school: {
        Args: { search_query: string }
        Returns: {
          id: string
          name: string
        }[]
      }
      set_team_leader: {
        Args: { p_team_id: string; p_student_id: string }
        Returns: undefined
      }
    }
    Enums: {
      debate_ballot_status_enum: "PENDING" | "IN_PROGRESS" | "COMPLETE"
      debate_session_status: "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELLED"
      division: "VILLIGER" | "LOWER" | "UPPER" | "SENIOR" | "OPEN"
      gender: "MALE" | "FEMALE" | "do not wish to specify"
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
  chat: {
    Enums: {},
  },
  debate: {
    Enums: {
      criteria_group: ["STYLE", "RESPECT", "ANALYSIS"],
      speech_mode: ["SYNC", "ASYNC"],
    },
  },
  public: {
    Enums: {
      debate_ballot_status_enum: ["PENDING", "IN_PROGRESS", "COMPLETE"],
      debate_session_status: ["SCHEDULED", "ONGOING", "COMPLETED", "CANCELLED"],
      division: ["VILLIGER", "LOWER", "UPPER", "SENIOR", "OPEN"],
      gender: ["MALE", "FEMALE", "do not wish to specify"],
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
      user_role_type: ["STUDENT", "JUDGE", "GUARDIAN"],
    },
  },
} as const
