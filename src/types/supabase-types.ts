export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      announcements: {
        Row: {
          created_at: string;
          id: string;
          is_active: boolean;
          link: string | null;
          message: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          link?: string | null;
          message: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          link?: string | null;
          message?: string;
        };
        Relationships: [];
      };
      brew_methods: {
        Row: {
          id: string;
          key: string;
          label: string;
        };
        Insert: {
          id?: string;
          key: string;
          label: string;
        };
        Update: {
          id?: string;
          key?: string;
          label?: string;
        };
        Relationships: [];
      };
      coffee_brew_methods: {
        Row: {
          brew_method_id: string;
          coffee_id: string;
        };
        Insert: {
          brew_method_id: string;
          coffee_id: string;
        };
        Update: {
          brew_method_id?: string;
          coffee_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "coffee_brew_methods_brew_method_id_fkey";
            columns: ["brew_method_id"];
            isOneToOne: false;
            referencedRelation: "brew_methods";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "coffee_brew_methods_coffee_id_fkey";
            columns: ["coffee_id"];
            isOneToOne: false;
            referencedRelation: "coffee_summary";
            referencedColumns: ["coffee_id"];
          },
          {
            foreignKeyName: "coffee_brew_methods_coffee_id_fkey";
            columns: ["coffee_id"];
            isOneToOne: false;
            referencedRelation: "coffees";
            referencedColumns: ["id"];
          },
        ];
      };
      coffee_estates: {
        Row: {
          coffee_id: string;
          estate_id: string;
          pct: number | null;
        };
        Insert: {
          coffee_id: string;
          estate_id: string;
          pct?: number | null;
        };
        Update: {
          coffee_id?: string;
          estate_id?: string;
          pct?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "coffee_estates_coffee_id_fkey";
            columns: ["coffee_id"];
            isOneToOne: false;
            referencedRelation: "coffee_summary";
            referencedColumns: ["coffee_id"];
          },
          {
            foreignKeyName: "coffee_estates_coffee_id_fkey";
            columns: ["coffee_id"];
            isOneToOne: false;
            referencedRelation: "coffees";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "coffee_estates_estate_id_fkey";
            columns: ["estate_id"];
            isOneToOne: false;
            referencedRelation: "estates";
            referencedColumns: ["id"];
          },
        ];
      };
      coffee_flavor_notes: {
        Row: {
          coffee_id: string;
          flavor_note_id: string;
        };
        Insert: {
          coffee_id: string;
          flavor_note_id: string;
        };
        Update: {
          coffee_id?: string;
          flavor_note_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "coffee_flavor_notes_coffee_id_fkey";
            columns: ["coffee_id"];
            isOneToOne: false;
            referencedRelation: "coffee_summary";
            referencedColumns: ["coffee_id"];
          },
          {
            foreignKeyName: "coffee_flavor_notes_coffee_id_fkey";
            columns: ["coffee_id"];
            isOneToOne: false;
            referencedRelation: "coffees";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "coffee_flavor_notes_flavor_note_id_fkey";
            columns: ["flavor_note_id"];
            isOneToOne: false;
            referencedRelation: "flavor_notes";
            referencedColumns: ["id"];
          },
        ];
      };
      coffee_images: {
        Row: {
          alt: string | null;
          coffee_id: string;
          content_hash: string | null;
          height: number | null;
          id: string;
          imagekit_url: string | null;
          sort_order: number;
          source_raw: Json;
          updated_at: string | null;
          url: string;
          width: number | null;
        };
        Insert: {
          alt?: string | null;
          coffee_id: string;
          content_hash?: string | null;
          height?: number | null;
          id?: string;
          imagekit_url?: string | null;
          sort_order?: number;
          source_raw?: Json;
          updated_at?: string | null;
          url: string;
          width?: number | null;
        };
        Update: {
          alt?: string | null;
          coffee_id?: string;
          content_hash?: string | null;
          height?: number | null;
          id?: string;
          imagekit_url?: string | null;
          sort_order?: number;
          source_raw?: Json;
          updated_at?: string | null;
          url?: string;
          width?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "coffee_images_coffee_id_fkey";
            columns: ["coffee_id"];
            isOneToOne: false;
            referencedRelation: "coffee_summary";
            referencedColumns: ["coffee_id"];
          },
          {
            foreignKeyName: "coffee_images_coffee_id_fkey";
            columns: ["coffee_id"];
            isOneToOne: false;
            referencedRelation: "coffees";
            referencedColumns: ["id"];
          },
        ];
      };
      coffee_regions: {
        Row: {
          coffee_id: string;
          pct: number | null;
          region_id: string;
        };
        Insert: {
          coffee_id: string;
          pct?: number | null;
          region_id: string;
        };
        Update: {
          coffee_id?: string;
          pct?: number | null;
          region_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "coffee_regions_coffee_id_fkey";
            columns: ["coffee_id"];
            isOneToOne: false;
            referencedRelation: "coffee_summary";
            referencedColumns: ["coffee_id"];
          },
          {
            foreignKeyName: "coffee_regions_coffee_id_fkey";
            columns: ["coffee_id"];
            isOneToOne: false;
            referencedRelation: "coffees";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "coffee_regions_region_id_fkey";
            columns: ["region_id"];
            isOneToOne: false;
            referencedRelation: "regions";
            referencedColumns: ["id"];
          },
        ];
      };
      coffees: {
        Row: {
          bean_species: Database["public"]["Enums"]["species_enum"] | null;
          created_at: string;
          crop_year: number | null;
          decaf: boolean;
          default_grind: Database["public"]["Enums"]["grind_enum"] | null;
          description_md: string | null;
          direct_buy_url: string | null;
          first_seen_at: string | null;
          harvest_window: string | null;
          id: string;
          is_coffee: boolean | null;
          is_limited: boolean;
          is_single_origin: boolean;
          name: string;
          needs_review: boolean | null;
          notes_lang: string | null;
          notes_raw: Json;
          platform_product_id: string | null;
          process: Database["public"]["Enums"]["process_enum"] | null;
          process_raw: string | null;
          rating_avg: number | null;
          rating_count: number;
          roast_level: Database["public"]["Enums"]["roast_level_enum"] | null;
          roast_level_raw: string | null;
          roast_style_raw: string | null;
          roaster_id: string;
          seo_desc: string | null;
          seo_title: string | null;
          slug: string;
          source_raw: Json;
          status: Database["public"]["Enums"]["coffee_status_enum"];
          tags: string[] | null;
          updated_at: string;
          varieties: string[] | null;
          vendor_sku: string | null;
        };
        Insert: {
          bean_species?: Database["public"]["Enums"]["species_enum"] | null;
          created_at?: string;
          crop_year?: number | null;
          decaf?: boolean;
          default_grind?: Database["public"]["Enums"]["grind_enum"] | null;
          description_md?: string | null;
          direct_buy_url?: string | null;
          first_seen_at?: string | null;
          harvest_window?: string | null;
          id?: string;
          is_coffee?: boolean | null;
          is_limited?: boolean;
          is_single_origin?: boolean;
          name: string;
          needs_review?: boolean | null;
          notes_lang?: string | null;
          notes_raw?: Json;
          platform_product_id?: string | null;
          process?: Database["public"]["Enums"]["process_enum"] | null;
          process_raw?: string | null;
          rating_avg?: number | null;
          rating_count?: number;
          roast_level?: Database["public"]["Enums"]["roast_level_enum"] | null;
          roast_level_raw?: string | null;
          roast_style_raw?: string | null;
          roaster_id: string;
          seo_desc?: string | null;
          seo_title?: string | null;
          slug: string;
          source_raw?: Json;
          status?: Database["public"]["Enums"]["coffee_status_enum"];
          tags?: string[] | null;
          updated_at: string;
          varieties?: string[] | null;
          vendor_sku?: string | null;
        };
        Update: {
          bean_species?: Database["public"]["Enums"]["species_enum"] | null;
          created_at?: string;
          crop_year?: number | null;
          decaf?: boolean;
          default_grind?: Database["public"]["Enums"]["grind_enum"] | null;
          description_md?: string | null;
          direct_buy_url?: string | null;
          first_seen_at?: string | null;
          harvest_window?: string | null;
          id?: string;
          is_coffee?: boolean | null;
          is_limited?: boolean;
          is_single_origin?: boolean;
          name?: string;
          needs_review?: boolean | null;
          notes_lang?: string | null;
          notes_raw?: Json;
          platform_product_id?: string | null;
          process?: Database["public"]["Enums"]["process_enum"] | null;
          process_raw?: string | null;
          rating_avg?: number | null;
          rating_count?: number;
          roast_level?: Database["public"]["Enums"]["roast_level_enum"] | null;
          roast_level_raw?: string | null;
          roast_style_raw?: string | null;
          roaster_id?: string;
          seo_desc?: string | null;
          seo_title?: string | null;
          slug?: string;
          source_raw?: Json;
          status?: Database["public"]["Enums"]["coffee_status_enum"];
          tags?: string[] | null;
          updated_at?: string;
          varieties?: string[] | null;
          vendor_sku?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "coffees_roaster_id_fkey";
            columns: ["roaster_id"];
            isOneToOne: false;
            referencedRelation: "roasters";
            referencedColumns: ["id"];
          },
        ];
      };
      enrichments: {
        Row: {
          applied: boolean;
          artifact_id: string;
          confidence_score: number;
          created_at: string | null;
          enrichment_id: string;
          field: string;
          id: string;
          llm_result: Json;
        };
        Insert: {
          applied?: boolean;
          artifact_id: string;
          confidence_score: number;
          created_at?: string | null;
          enrichment_id: string;
          field: string;
          id?: string;
          llm_result: Json;
        };
        Update: {
          applied?: boolean;
          artifact_id?: string;
          confidence_score?: number;
          created_at?: string | null;
          enrichment_id?: string;
          field?: string;
          id?: string;
          llm_result?: Json;
        };
        Relationships: [];
      };
      estates: {
        Row: {
          altitude_max_m: number | null;
          altitude_min_m: number | null;
          estate_key: string;
          id: string;
          name: string;
          notes: string | null;
          region_id: string | null;
        };
        Insert: {
          altitude_max_m?: number | null;
          altitude_min_m?: number | null;
          estate_key: string;
          id?: string;
          name: string;
          notes?: string | null;
          region_id?: string | null;
        };
        Update: {
          altitude_max_m?: number | null;
          altitude_min_m?: number | null;
          estate_key?: string;
          id?: string;
          name?: string;
          notes?: string | null;
          region_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "estates_region_id_fkey";
            columns: ["region_id"];
            isOneToOne: false;
            referencedRelation: "regions";
            referencedColumns: ["id"];
          },
        ];
      };
      flavor_notes: {
        Row: {
          group_key: string | null;
          id: string;
          key: string;
          label: string;
        };
        Insert: {
          group_key?: string | null;
          id?: string;
          key: string;
          label: string;
        };
        Update: {
          group_key?: string | null;
          id?: string;
          key?: string;
          label?: string;
        };
        Relationships: [];
      };
      form_submissions: {
        Row: {
          created_at: string;
          data: Json;
          email: string | null;
          form_type: string;
          id: string;
          ip_address: unknown;
          status: string | null;
          updated_at: string;
          user_agent: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          data?: Json;
          email?: string | null;
          form_type: string;
          id?: string;
          ip_address?: unknown;
          status?: string | null;
          updated_at?: string;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          data?: Json;
          email?: string | null;
          form_type?: string;
          id?: string;
          ip_address?: unknown;
          status?: string | null;
          updated_at?: string;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      llm_cache: {
        Row: {
          created_at: string | null;
          expires_at: string | null;
          id: string;
          key: string;
          updated_at: string | null;
          value: string;
        };
        Insert: {
          created_at?: string | null;
          expires_at?: string | null;
          id?: string;
          key: string;
          updated_at?: string | null;
          value: string;
        };
        Update: {
          created_at?: string | null;
          expires_at?: string | null;
          id?: string;
          key?: string;
          updated_at?: string | null;
          value?: string;
        };
        Relationships: [];
      };
      prices: {
        Row: {
          currency: string;
          id: string;
          is_sale: boolean;
          price: number;
          scraped_at: string;
          source_raw: Json;
          source_url: string | null;
          variant_id: string;
        };
        Insert: {
          currency?: string;
          id?: string;
          is_sale?: boolean;
          price: number;
          scraped_at?: string;
          source_raw?: Json;
          source_url?: string | null;
          variant_id: string;
        };
        Update: {
          currency?: string;
          id?: string;
          is_sale?: boolean;
          price?: number;
          scraped_at?: string;
          source_raw?: Json;
          source_url?: string | null;
          variant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "prices_variant_id_fkey";
            columns: ["variant_id"];
            isOneToOne: false;
            referencedRelation: "variant_computed";
            referencedColumns: ["variant_id"];
          },
          {
            foreignKeyName: "prices_variant_id_fkey";
            columns: ["variant_id"];
            isOneToOne: false;
            referencedRelation: "variant_latest_price";
            referencedColumns: ["variant_id"];
          },
          {
            foreignKeyName: "prices_variant_id_fkey";
            columns: ["variant_id"];
            isOneToOne: false;
            referencedRelation: "variants";
            referencedColumns: ["id"];
          },
        ];
      };
      product_sources: {
        Row: {
          base_url: string;
          id: string;
          last_ok_ping: string | null;
          platform: Database["public"]["Enums"]["platform_enum"] | null;
          products_endpoint: string | null;
          roaster_id: string;
          robots_ok: boolean | null;
          sitemap_url: string | null;
        };
        Insert: {
          base_url: string;
          id?: string;
          last_ok_ping?: string | null;
          platform?: Database["public"]["Enums"]["platform_enum"] | null;
          products_endpoint?: string | null;
          roaster_id: string;
          robots_ok?: boolean | null;
          sitemap_url?: string | null;
        };
        Update: {
          base_url?: string;
          id?: string;
          last_ok_ping?: string | null;
          platform?: Database["public"]["Enums"]["platform_enum"] | null;
          products_endpoint?: string | null;
          roaster_id?: string;
          robots_ok?: boolean | null;
          sitemap_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "product_sources_roaster_id_fkey";
            columns: ["roaster_id"];
            isOneToOne: false;
            referencedRelation: "roasters";
            referencedColumns: ["id"];
          },
        ];
      };
      rating_migrations: {
        Row: {
          coffee_ratings_migrated: number | null;
          id: string;
          ip_address: unknown;
          migration_date: string | null;
          migration_type: string | null;
          roaster_ratings_migrated: number | null;
          user_id: string | null;
        };
        Insert: {
          coffee_ratings_migrated?: number | null;
          id?: string;
          ip_address?: unknown;
          migration_date?: string | null;
          migration_type?: string | null;
          roaster_ratings_migrated?: number | null;
          user_id?: string | null;
        };
        Update: {
          coffee_ratings_migrated?: number | null;
          id?: string;
          ip_address?: unknown;
          migration_date?: string | null;
          migration_type?: string | null;
          roaster_ratings_migrated?: number | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "rating_migrations_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      regions: {
        Row: {
          country: string | null;
          display_name: string | null;
          id: string;
          state: string | null;
          subregion: string;
        };
        Insert: {
          country?: string | null;
          display_name?: string | null;
          id?: string;
          state?: string | null;
          subregion: string;
        };
        Update: {
          country?: string | null;
          display_name?: string | null;
          id?: string;
          state?: string | null;
          subregion?: string;
        };
        Relationships: [];
      };
      roasters: {
        Row: {
          alert_price_delta_pct: number | null;
          avg_customer_support: number | null;
          avg_delivery_experience: number | null;
          avg_packaging: number | null;
          avg_rating: number | null;
          avg_value_for_money: number | null;
          created_at: string;
          default_concurrency: number | null;
          description: string | null;
          firecrawl_budget_limit: number | null;
          first_time_count: number | null;
          founded_year: number | null;
          full_cadence: string | null;
          has_physical_store: boolean | null;
          has_subscription: boolean | null;
          hq_city: string | null;
          hq_country: string | null;
          hq_state: string | null;
          id: string;
          image_url: string | null;
          instagram_handle: string | null;
          is_active: boolean;
          is_editors_pick: boolean | null;
          is_featured: boolean | null;
          last_etag: string | null;
          last_modified: string | null;
          lat: number | null;
          logo_url: string | null;
          lon: number | null;
          name: string;
          phone: string | null;
          platform: Database["public"]["Enums"]["platform_enum"] | null;
          price_cadence: string | null;
          ratings_updated_at: string | null;
          recommend_percentage: number | null;
          regular_count: number | null;
          repeat_count: number | null;
          robots_allow: boolean | null;
          robots_checked_at: string | null;
          slug: string;
          social_json: Json;
          support_email: string | null;
          total_ratings_count: number | null;
          updated_at: string;
          use_firecrawl_fallback: boolean | null;
          use_llm: boolean | null;
          website: string | null;
        };
        Insert: {
          alert_price_delta_pct?: number | null;
          avg_customer_support?: number | null;
          avg_delivery_experience?: number | null;
          avg_packaging?: number | null;
          avg_rating?: number | null;
          avg_value_for_money?: number | null;
          created_at?: string;
          default_concurrency?: number | null;
          description?: string | null;
          firecrawl_budget_limit?: number | null;
          first_time_count?: number | null;
          founded_year?: number | null;
          full_cadence?: string | null;
          has_physical_store?: boolean | null;
          has_subscription?: boolean | null;
          hq_city?: string | null;
          hq_country?: string | null;
          hq_state?: string | null;
          id?: string;
          image_url?: string | null;
          instagram_handle?: string | null;
          is_active?: boolean;
          is_editors_pick?: boolean | null;
          is_featured?: boolean | null;
          last_etag?: string | null;
          last_modified?: string | null;
          lat?: number | null;
          logo_url?: string | null;
          lon?: number | null;
          name: string;
          phone?: string | null;
          platform?: Database["public"]["Enums"]["platform_enum"] | null;
          price_cadence?: string | null;
          ratings_updated_at?: string | null;
          recommend_percentage?: number | null;
          regular_count?: number | null;
          repeat_count?: number | null;
          robots_allow?: boolean | null;
          robots_checked_at?: string | null;
          slug: string;
          social_json?: Json;
          support_email?: string | null;
          total_ratings_count?: number | null;
          updated_at?: string;
          use_firecrawl_fallback?: boolean | null;
          use_llm?: boolean | null;
          website?: string | null;
        };
        Update: {
          alert_price_delta_pct?: number | null;
          avg_customer_support?: number | null;
          avg_delivery_experience?: number | null;
          avg_packaging?: number | null;
          avg_rating?: number | null;
          avg_value_for_money?: number | null;
          created_at?: string;
          default_concurrency?: number | null;
          description?: string | null;
          firecrawl_budget_limit?: number | null;
          first_time_count?: number | null;
          founded_year?: number | null;
          full_cadence?: string | null;
          has_physical_store?: boolean | null;
          has_subscription?: boolean | null;
          hq_city?: string | null;
          hq_country?: string | null;
          hq_state?: string | null;
          id?: string;
          image_url?: string | null;
          instagram_handle?: string | null;
          is_active?: boolean;
          is_editors_pick?: boolean | null;
          is_featured?: boolean | null;
          last_etag?: string | null;
          last_modified?: string | null;
          lat?: number | null;
          logo_url?: string | null;
          lon?: number | null;
          name?: string;
          phone?: string | null;
          platform?: Database["public"]["Enums"]["platform_enum"] | null;
          price_cadence?: string | null;
          ratings_updated_at?: string | null;
          recommend_percentage?: number | null;
          regular_count?: number | null;
          repeat_count?: number | null;
          robots_allow?: boolean | null;
          robots_checked_at?: string | null;
          slug?: string;
          social_json?: Json;
          support_email?: string | null;
          total_ratings_count?: number | null;
          updated_at?: string;
          use_firecrawl_fallback?: boolean | null;
          use_llm?: boolean | null;
          website?: string | null;
        };
        Relationships: [];
      };
      role_audit_log: {
        Row: {
          changed_at: string | null;
          changed_by: string | null;
          id: string;
          new_role: Database["public"]["Enums"]["user_role_enum"];
          old_role: Database["public"]["Enums"]["user_role_enum"] | null;
          reason: string | null;
          user_id: string;
        };
        Insert: {
          changed_at?: string | null;
          changed_by?: string | null;
          id?: string;
          new_role: Database["public"]["Enums"]["user_role_enum"];
          old_role?: Database["public"]["Enums"]["user_role_enum"] | null;
          reason?: string | null;
          user_id: string;
        };
        Update: {
          changed_at?: string | null;
          changed_by?: string | null;
          id?: string;
          new_role?: Database["public"]["Enums"]["user_role_enum"];
          old_role?: Database["public"]["Enums"]["user_role_enum"] | null;
          reason?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      scrape_artifacts: {
        Row: {
          artifact_data: Json | null;
          body_len: number | null;
          created_at: string;
          http_status: number | null;
          id: string;
          processed_at: string | null;
          saved_html_path: string | null;
          scrape_run_id: string | null;
          url: string | null;
          validation_errors: Json | null;
          validation_status: string | null;
          validation_warnings: Json | null;
        };
        Insert: {
          artifact_data?: Json | null;
          body_len?: number | null;
          created_at?: string;
          http_status?: number | null;
          id?: string;
          processed_at?: string | null;
          saved_html_path?: string | null;
          scrape_run_id?: string | null;
          url?: string | null;
          validation_errors?: Json | null;
          validation_status?: string | null;
          validation_warnings?: Json | null;
        };
        Update: {
          artifact_data?: Json | null;
          body_len?: number | null;
          created_at?: string;
          http_status?: number | null;
          id?: string;
          processed_at?: string | null;
          saved_html_path?: string | null;
          scrape_run_id?: string | null;
          url?: string | null;
          validation_errors?: Json | null;
          validation_status?: string | null;
          validation_warnings?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "scrape_artifacts_run_id_fkey";
            columns: ["scrape_run_id"];
            isOneToOne: false;
            referencedRelation: "scrape_runs";
            referencedColumns: ["id"];
          },
        ];
      };
      scrape_runs: {
        Row: {
          finished_at: string | null;
          id: string;
          run_type: Database["public"]["Enums"]["run_type_enum"] | null;
          source_id: string | null;
          started_at: string;
          stats_json: Json;
          status: Database["public"]["Enums"]["run_status_enum"] | null;
        };
        Insert: {
          finished_at?: string | null;
          id?: string;
          run_type?: Database["public"]["Enums"]["run_type_enum"] | null;
          source_id?: string | null;
          started_at?: string;
          stats_json?: Json;
          status?: Database["public"]["Enums"]["run_status_enum"] | null;
        };
        Update: {
          finished_at?: string | null;
          id?: string;
          run_type?: Database["public"]["Enums"]["run_type_enum"] | null;
          source_id?: string | null;
          started_at?: string;
          stats_json?: Json;
          status?: Database["public"]["Enums"]["run_status_enum"] | null;
        };
        Relationships: [
          {
            foreignKeyName: "scrape_runs_source_id_fkey";
            columns: ["source_id"];
            isOneToOne: false;
            referencedRelation: "product_sources";
            referencedColumns: ["id"];
          },
        ];
      };
      sensory_params: {
        Row: {
          acidity: number | null;
          aftertaste: number | null;
          bitterness: number | null;
          body: number | null;
          clarity: number | null;
          coffee_id: string;
          confidence:
            | Database["public"]["Enums"]["sensory_confidence_enum"]
            | null;
          created_at: string;
          notes: string | null;
          source: Database["public"]["Enums"]["sensory_source_enum"] | null;
          sweetness: number | null;
          updated_at: string;
        };
        Insert: {
          acidity?: number | null;
          aftertaste?: number | null;
          bitterness?: number | null;
          body?: number | null;
          clarity?: number | null;
          coffee_id: string;
          confidence?:
            | Database["public"]["Enums"]["sensory_confidence_enum"]
            | null;
          created_at?: string;
          notes?: string | null;
          source?: Database["public"]["Enums"]["sensory_source_enum"] | null;
          sweetness?: number | null;
          updated_at?: string;
        };
        Update: {
          acidity?: number | null;
          aftertaste?: number | null;
          bitterness?: number | null;
          body?: number | null;
          clarity?: number | null;
          coffee_id?: string;
          confidence?:
            | Database["public"]["Enums"]["sensory_confidence_enum"]
            | null;
          created_at?: string;
          notes?: string | null;
          source?: Database["public"]["Enums"]["sensory_source_enum"] | null;
          sweetness?: number | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sensory_params_coffee_id_fkey";
            columns: ["coffee_id"];
            isOneToOne: true;
            referencedRelation: "coffee_summary";
            referencedColumns: ["coffee_id"];
          },
          {
            foreignKeyName: "sensory_params_coffee_id_fkey";
            columns: ["coffee_id"];
            isOneToOne: true;
            referencedRelation: "coffees";
            referencedColumns: ["id"];
          },
        ];
      };
      user_coffee_preferences: {
        Row: {
          decaf_only: boolean | null;
          flavor_profiles: string[] | null;
          id: string;
          organic_only: boolean | null;
          processing_methods: string[] | null;
          regions: string[] | null;
          roast_levels: string[] | null;
          updated_at: string | null;
          user_id: string | null;
          with_milk_preference: boolean | null;
        };
        Insert: {
          decaf_only?: boolean | null;
          flavor_profiles?: string[] | null;
          id?: string;
          organic_only?: boolean | null;
          processing_methods?: string[] | null;
          regions?: string[] | null;
          roast_levels?: string[] | null;
          updated_at?: string | null;
          user_id?: string | null;
          with_milk_preference?: boolean | null;
        };
        Update: {
          decaf_only?: boolean | null;
          flavor_profiles?: string[] | null;
          id?: string;
          organic_only?: boolean | null;
          processing_methods?: string[] | null;
          regions?: string[] | null;
          roast_levels?: string[] | null;
          updated_at?: string | null;
          user_id?: string | null;
          with_milk_preference?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_coffee_preferences_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      user_notification_preferences: {
        Row: {
          coffee_updates: boolean | null;
          email_frequency: string | null;
          id: string;
          new_roasters: boolean | null;
          newsletter: boolean | null;
          platform_updates: boolean | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          coffee_updates?: boolean | null;
          email_frequency?: string | null;
          id?: string;
          new_roasters?: boolean | null;
          newsletter?: boolean | null;
          platform_updates?: boolean | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          coffee_updates?: boolean | null;
          email_frequency?: string | null;
          id?: string;
          new_roasters?: boolean | null;
          newsletter?: boolean | null;
          platform_updates?: boolean | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_notification_preferences_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      user_profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          city: string | null;
          country: string | null;
          created_at: string | null;
          email_verified: boolean | null;
          experience_level: string | null;
          full_name: string;
          gender: string | null;
          id: string;
          is_public_profile: boolean | null;
          newsletter_subscribed: boolean | null;
          onboarding_completed: boolean | null;
          preferred_brewing_methods: string[] | null;
          show_location: boolean | null;
          state: string | null;
          updated_at: string | null;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string | null;
          email_verified?: boolean | null;
          experience_level?: string | null;
          full_name: string;
          gender?: string | null;
          id: string;
          is_public_profile?: boolean | null;
          newsletter_subscribed?: boolean | null;
          onboarding_completed?: boolean | null;
          preferred_brewing_methods?: string[] | null;
          show_location?: boolean | null;
          state?: string | null;
          updated_at?: string | null;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string | null;
          email_verified?: boolean | null;
          experience_level?: string | null;
          full_name?: string;
          gender?: string | null;
          id?: string;
          is_public_profile?: boolean | null;
          newsletter_subscribed?: boolean | null;
          onboarding_completed?: boolean | null;
          preferred_brewing_methods?: string[] | null;
          show_location?: boolean | null;
          state?: string | null;
          updated_at?: string | null;
          username?: string | null;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          id: string;
          role: Database["public"]["Enums"]["user_role_enum"];
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          id?: string;
          role?: Database["public"]["Enums"]["user_role_enum"];
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          id?: string;
          role?: Database["public"]["Enums"]["user_role_enum"];
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      variants: {
        Row: {
          barcode: string | null;
          coffee_id: string;
          compare_at_price: number | null;
          created_at: string;
          currency: string;
          grind: Database["public"]["Enums"]["grind_enum"] | null;
          id: string;
          in_stock: boolean;
          last_seen_at: string | null;
          pack_count: number;
          platform_variant_id: string | null;
          price_current: number | null;
          price_last_checked_at: string | null;
          sku: string | null;
          source_raw: Json;
          status: string | null;
          stock_qty: number | null;
          subscription_available: boolean;
          updated_at: string;
          weight_g: number;
        };
        Insert: {
          barcode?: string | null;
          coffee_id: string;
          compare_at_price?: number | null;
          created_at?: string;
          currency?: string;
          grind?: Database["public"]["Enums"]["grind_enum"] | null;
          id?: string;
          in_stock?: boolean;
          last_seen_at?: string | null;
          pack_count?: number;
          platform_variant_id?: string | null;
          price_current?: number | null;
          price_last_checked_at?: string | null;
          sku?: string | null;
          source_raw?: Json;
          status?: string | null;
          stock_qty?: number | null;
          subscription_available?: boolean;
          updated_at?: string;
          weight_g: number;
        };
        Update: {
          barcode?: string | null;
          coffee_id?: string;
          compare_at_price?: number | null;
          created_at?: string;
          currency?: string;
          grind?: Database["public"]["Enums"]["grind_enum"] | null;
          id?: string;
          in_stock?: boolean;
          last_seen_at?: string | null;
          pack_count?: number;
          platform_variant_id?: string | null;
          price_current?: number | null;
          price_last_checked_at?: string | null;
          sku?: string | null;
          source_raw?: Json;
          status?: string | null;
          stock_qty?: number | null;
          subscription_available?: boolean;
          updated_at?: string;
          weight_g?: number;
        };
        Relationships: [
          {
            foreignKeyName: "variants_coffee_id_fkey";
            columns: ["coffee_id"];
            isOneToOne: false;
            referencedRelation: "coffee_summary";
            referencedColumns: ["coffee_id"];
          },
          {
            foreignKeyName: "variants_coffee_id_fkey";
            columns: ["coffee_id"];
            isOneToOne: false;
            referencedRelation: "coffees";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      coffee_summary: {
        Row: {
          best_normalized_250g: number | null;
          best_variant_id: string | null;
          coffee_id: string | null;
          direct_buy_url: string | null;
          has_250g_bool: boolean | null;
          has_sensory: boolean | null;
          in_stock_count: number | null;
          min_price_in_stock: number | null;
          name: string | null;
          process: Database["public"]["Enums"]["process_enum"] | null;
          process_raw: string | null;
          roast_level: Database["public"]["Enums"]["roast_level_enum"] | null;
          roast_level_raw: string | null;
          roast_style_raw: string | null;
          roaster_id: string | null;
          sensory_public: Json | null;
          sensory_updated_at: string | null;
          slug: string | null;
          status: Database["public"]["Enums"]["coffee_status_enum"] | null;
          weights_available: number[] | null;
        };
        Relationships: [
          {
            foreignKeyName: "coffees_roaster_id_fkey";
            columns: ["roaster_id"];
            isOneToOne: false;
            referencedRelation: "roasters";
            referencedColumns: ["id"];
          },
        ];
      };
      firecrawl_usage_tracking: {
        Row: {
          active_firecrawl_roasters: number | null;
          avg_budget_limit: number | null;
          firecrawl_enabled_count: number | null;
          firecrawl_enabled_percentage: number | null;
          max_budget_limit: number | null;
          min_budget_limit: number | null;
          platform: Database["public"]["Enums"]["platform_enum"] | null;
          total_budget_allocated: number | null;
          total_roasters: number | null;
        };
        Relationships: [];
      };
      platform_distribution: {
        Row: {
          active_roasters: number | null;
          avg_firecrawl_budget: number | null;
          firecrawl_enabled: number | null;
          first_roaster_created: string | null;
          inactive_roasters: number | null;
          last_roaster_updated: string | null;
          percentage: number | null;
          platform: Database["public"]["Enums"]["platform_enum"] | null;
          roaster_count: number | null;
        };
        Relationships: [];
      };
      platform_health_dashboard: {
        Row: {
          active_coffees: number | null;
          active_percentage: number | null;
          active_roasters: number | null;
          activity_status: string | null;
          avg_budget_limit: number | null;
          avg_rating: number | null;
          firecrawl_enabled: number | null;
          firecrawl_percentage: number | null;
          inactive_roasters: number | null;
          last_activity: string | null;
          platform: Database["public"]["Enums"]["platform_enum"] | null;
          rated_coffees: number | null;
          total_coffees: number | null;
          total_roasters: number | null;
        };
        Relationships: [];
      };
      platform_performance_metrics: {
        Row: {
          avg_coffees_per_roaster: number | null;
          avg_prices_per_variant: number | null;
          avg_rating: number | null;
          avg_variants_per_coffee: number | null;
          coffee_count: number | null;
          platform: Database["public"]["Enums"]["platform_enum"] | null;
          price_count: number | null;
          rated_coffees: number | null;
          rating_coverage_percentage: number | null;
          roaster_count: number | null;
          variant_count: number | null;
        };
        Relationships: [];
      };
      platform_usage_stats: {
        Row: {
          active_coffees: number | null;
          avg_coffee_rating: number | null;
          avg_price: number | null;
          earliest_price: string | null;
          in_stock_variants: number | null;
          latest_price: string | null;
          out_of_stock_variants: number | null;
          platform: Database["public"]["Enums"]["platform_enum"] | null;
          total_coffees: number | null;
          total_prices: number | null;
          total_roasters: number | null;
          total_variants: number | null;
        };
        Relationships: [];
      };
      recent_platform_activity: {
        Row: {
          created_last_30_days: number | null;
          created_last_7_days: number | null;
          currently_active: number | null;
          currently_inactive: number | null;
          last_roaster_creation: string | null;
          last_roaster_update: string | null;
          platform: Database["public"]["Enums"]["platform_enum"] | null;
          total_roasters: number | null;
          updated_last_30_days: number | null;
          updated_last_7_days: number | null;
        };
        Relationships: [];
      };
      variant_computed: {
        Row: {
          coffee_id: string | null;
          compare_at_price: number | null;
          currency: string | null;
          grind: Database["public"]["Enums"]["grind_enum"] | null;
          in_stock: boolean | null;
          normalized_250g: number | null;
          pack_count: number | null;
          price_one_time: number | null;
          scraped_at_latest: string | null;
          valid_for_best_value: boolean | null;
          variant_id: string | null;
          weight_g: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "variants_coffee_id_fkey";
            columns: ["coffee_id"];
            isOneToOne: false;
            referencedRelation: "coffee_summary";
            referencedColumns: ["coffee_id"];
          },
          {
            foreignKeyName: "variants_coffee_id_fkey";
            columns: ["coffee_id"];
            isOneToOne: false;
            referencedRelation: "coffees";
            referencedColumns: ["id"];
          },
        ];
      };
      variant_latest_price: {
        Row: {
          coffee_id: string | null;
          compare_at_price: number | null;
          currency: string | null;
          grind: Database["public"]["Enums"]["grind_enum"] | null;
          in_stock: boolean | null;
          is_sale: boolean | null;
          pack_count: number | null;
          price_one_time: number | null;
          scraped_at_latest: string | null;
          variant_id: string | null;
          weight_g: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "variants_coffee_id_fkey";
            columns: ["coffee_id"];
            isOneToOne: false;
            referencedRelation: "coffee_summary";
            referencedColumns: ["coffee_id"];
          },
          {
            foreignKeyName: "variants_coffee_id_fkey";
            columns: ["coffee_id"];
            isOneToOne: false;
            referencedRelation: "coffees";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Functions: {
      assign_user_role: {
        Args: {
          assigned_by?: string;
          new_role: Database["public"]["Enums"]["user_role_enum"];
          target_user_id: string;
        };
        Returns: boolean;
      };
      cleanup_expired_llm_cache: { Args: never; Returns: number };
      coffee_editor_save: {
        Args: {
          p_brew_method_ids?: string[];
          p_coffee?: Json;
          p_coffee_id: string;
          p_estate_ids?: string[];
          p_flavor_note_ids?: string[];
          p_region_ids?: string[];
          p_sensory?: Json;
        };
        Returns: undefined;
      };
      format_brew_method_label: {
        Args: { grind_key: string };
        Returns: string;
      };
      get_epic_c_parameters: { Args: { p_coffee_id: string }; Returns: Json };
      get_or_create_estate: {
        Args: {
          p_altitude_max_m?: number;
          p_altitude_min_m?: number;
          p_name: string;
          p_notes?: string;
          p_region_id: string;
        };
        Returns: string;
      };
      get_or_create_region: {
        Args: { p_country: string; p_state?: string; p_subregion?: string };
        Returns: string;
      };
      get_price_trend_4w: {
        Args: never;
        Returns: {
          avg_price: number;
          date: string;
          price_updates: number;
        }[];
      };
      get_roaster_performance_30d: {
        Args: never;
        Returns: {
          avg_duration_seconds: number;
          roaster_id: string;
          roaster_name: string;
          success_rate: number;
          successful_runs: number;
          total_runs: number;
        }[];
      };
      get_run_statistics_30d: {
        Args: never;
        Returns: {
          avg_duration_minutes: number;
          date: string;
          failed_runs: number;
          successful_runs: number;
          total_runs: number;
        }[];
      };
      get_user_role: {
        Args: { user_uuid?: string };
        Returns: Database["public"]["Enums"]["user_role_enum"];
      };
      get_users_with_roles: {
        Args: never;
        Returns: {
          created_at: string;
          email: string;
          last_sign_in: string;
          role: Database["public"]["Enums"]["user_role_enum"];
          user_id: string;
        }[];
      };
      has_permission: {
        Args: { required_role: Database["public"]["Enums"]["user_role_enum"] };
        Returns: boolean;
      };
      map_roast_legacy: {
        Args: { raw: string };
        Returns: Database["public"]["Enums"]["roast_level_enum"];
      };
      rpc_check_content_hash: {
        Args: { p_content_hash: string };
        Returns: string;
      };
      rpc_check_duplicate_image_hash: {
        Args: { p_content_hash: string };
        Returns: string;
      };
      rpc_insert_price: {
        Args: {
          p_currency?: string;
          p_is_sale?: boolean;
          p_price: number;
          p_scraped_at?: string;
          p_source_raw?: Json;
          p_source_url?: string;
          p_variant_id: string;
        };
        Returns: string;
      };
      rpc_record_artifact: {
        Args: {
          p_body_len: number;
          p_http_status: number;
          p_run_id: string;
          p_saved_html_path?: string;
          p_saved_json?: Json;
          p_url: string;
        };
        Returns: string;
      };
      rpc_scrape_run_finish: {
        Args: {
          p_run_id: string;
          p_stats: Json;
          p_status: Database["public"]["Enums"]["run_status_enum"];
        };
        Returns: undefined;
      };
      rpc_scrape_run_start: { Args: { p_source_id: string }; Returns: string };
      rpc_upsert_coffee: {
        Args: {
          p_acidity?: number;
          p_aftertaste?: number;
          p_altitude?: number;
          p_bean_species: Database["public"]["Enums"]["species_enum"];
          p_bitterness?: number;
          p_body?: number;
          p_clarity?: number;
          p_content_hash?: string;
          p_country?: string;
          p_decaf?: boolean;
          p_default_grind?: Database["public"]["Enums"]["grind_enum"];
          p_description_cleaned?: string;
          p_description_md: string;
          p_direct_buy_url: string;
          p_flavors?: string[];
          p_is_coffee?: boolean;
          p_is_limited?: boolean;
          p_name: string;
          p_notes_raw?: Json;
          p_platform_product_id: string;
          p_process: Database["public"]["Enums"]["process_enum"];
          p_process_raw: string;
          p_raw_hash?: string;
          p_region?: string;
          p_roast_level: Database["public"]["Enums"]["roast_level_enum"];
          p_roast_level_raw: string;
          p_roast_style_raw: string;
          p_roaster_id: string;
          p_slug: string;
          p_source_raw?: Json;
          p_status?: Database["public"]["Enums"]["coffee_status_enum"];
          p_sweetness?: number;
          p_tags?: string[];
          p_title_cleaned?: string;
          p_varieties?: string[];
          p_vendor_sku?: string;
        };
        Returns: string;
      };
      rpc_upsert_coffee_flavor_note: {
        Args: { p_coffee_id: string; p_flavor_note_id: string };
        Returns: boolean;
      };
      rpc_upsert_coffee_image: {
        Args: {
          p_alt?: string;
          p_coffee_id: string;
          p_content_hash?: string;
          p_height?: number;
          p_imagekit_url?: string;
          p_sort_order?: number;
          p_source_raw?: Json;
          p_url: string;
          p_width?: number;
        };
        Returns: string;
      };
      rpc_upsert_flavor_note: {
        Args: { p_group_key?: string; p_key: string; p_label: string };
        Returns: string;
      };
      rpc_upsert_roaster: {
        Args: {
          p_instagram_handle?: string;
          p_name: string;
          p_platform: Database["public"]["Enums"]["platform_enum"];
          p_slug: string;
          p_social_json?: Json;
          p_support_email?: string;
          p_website: string;
        };
        Returns: string;
      };
      rpc_upsert_variant: {
        Args: {
          p_coffee_id: string;
          p_compare_at_price?: number;
          p_currency?: string;
          p_grind?: Database["public"]["Enums"]["grind_enum"];
          p_in_stock?: boolean;
          p_pack_count?: number;
          p_platform_variant_id?: string;
          p_sku: string;
          p_source_raw?: Json;
          p_stock_qty?: number;
          p_subscription_available?: boolean;
          p_weight_g: number;
        };
        Returns: string;
      };
      upsert_coffee_preferences: {
        Args: {
          p_decaf_only?: boolean;
          p_flavor_profiles?: string[];
          p_organic_only?: boolean;
          p_processing_methods?: string[];
          p_regions?: string[];
          p_roast_levels?: string[];
          p_user_id: string;
          p_with_milk_preference?: boolean;
        };
        Returns: undefined;
      };
      upsert_notification_preferences: {
        Args: {
          p_coffee_updates?: boolean;
          p_email_frequency?: string;
          p_new_roasters?: boolean;
          p_platform_updates?: boolean;
          p_user_id: string;
        };
        Returns: undefined;
      };
      upsert_user_profile: {
        Args: {
          p_city?: string;
          p_country?: string;
          p_experience_level?: string;
          p_full_name: string;
          p_gender?: string;
          p_newsletter_subscribed?: boolean;
          p_onboarding_completed?: boolean;
          p_preferred_brewing_methods?: string[];
          p_state?: string;
          p_user_id: string;
        };
        Returns: {
          avatar_url: string;
          bio: string;
          city: string;
          country: string;
          created_at: string;
          email_verified: boolean;
          experience_level: string;
          full_name: string;
          gender: string;
          is_public_profile: boolean;
          newsletter_subscribed: boolean;
          onboarding_completed: boolean;
          preferred_brewing_methods: string[];
          profile_id: string;
          show_location: boolean;
          state: string;
          updated_at: string;
          username: string;
        }[];
      };
    };
    Enums: {
      coffee_status_enum:
        | "active"
        | "seasonal"
        | "discontinued"
        | "draft"
        | "hidden"
        | "coming_soon"
        | "archived";
      grind_enum:
        | "whole"
        | "filter"
        | "espresso"
        | "omni"
        | "other"
        | "turkish"
        | "moka_pot"
        | "cold_brew"
        | "aeropress"
        | "channi"
        | "coffee_filter"
        | "french_press"
        | "south_indian_filter"
        | "pour_over"
        | "syphon";
      platform_enum: "shopify" | "woocommerce" | "custom" | "other";
      process_enum:
        | "washed"
        | "natural"
        | "honey"
        | "pulped_natural"
        | "monsooned"
        | "wet_hulled"
        | "anaerobic"
        | "carbonic_maceration"
        | "double_fermented"
        | "experimental"
        | "other"
        | "washed_natural";
      roast_level_enum:
        | "light"
        | "light_medium"
        | "medium"
        | "medium_dark"
        | "dark";
      run_status_enum: "ok" | "partial" | "fail";
      run_type_enum:
        | "full_cadence"
        | "price_cadence"
        | "manual"
        | "single_roaster";
      sensory_confidence_enum: "high" | "medium" | "low";
      sensory_source_enum: "roaster" | "icb_inferred" | "icb_manual";
      species_enum:
        | "arabica"
        | "robusta"
        | "liberica"
        | "blend"
        | "arabica_80_robusta_20"
        | "arabica_70_robusta_30"
        | "arabica_60_robusta_40"
        | "arabica_50_robusta_50"
        | "robusta_80_arabica_20"
        | "arabica_chicory"
        | "robusta_chicory"
        | "blend_chicory"
        | "filter_coffee_mix"
        | "excelsa";
      user_role_enum:
        | "admin"
        | "operator"
        | "user"
        | "viewer"
        | "contributor"
        | "roaster";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      coffee_status_enum: [
        "active",
        "seasonal",
        "discontinued",
        "draft",
        "hidden",
        "coming_soon",
        "archived",
      ],
      grind_enum: [
        "whole",
        "filter",
        "espresso",
        "omni",
        "other",
        "turkish",
        "moka_pot",
        "cold_brew",
        "aeropress",
        "channi",
        "coffee_filter",
        "french_press",
        "south_indian_filter",
        "pour_over",
        "syphon",
      ],
      platform_enum: ["shopify", "woocommerce", "custom", "other"],
      process_enum: [
        "washed",
        "natural",
        "honey",
        "pulped_natural",
        "monsooned",
        "wet_hulled",
        "anaerobic",
        "carbonic_maceration",
        "double_fermented",
        "experimental",
        "other",
        "washed_natural",
      ],
      roast_level_enum: [
        "light",
        "light_medium",
        "medium",
        "medium_dark",
        "dark",
      ],
      run_status_enum: ["ok", "partial", "fail"],
      run_type_enum: [
        "full_cadence",
        "price_cadence",
        "manual",
        "single_roaster",
      ],
      sensory_confidence_enum: ["high", "medium", "low"],
      sensory_source_enum: ["roaster", "icb_inferred", "icb_manual"],
      species_enum: [
        "arabica",
        "robusta",
        "liberica",
        "blend",
        "arabica_80_robusta_20",
        "arabica_70_robusta_30",
        "arabica_60_robusta_40",
        "arabica_50_robusta_50",
        "robusta_80_arabica_20",
        "arabica_chicory",
        "robusta_chicory",
        "blend_chicory",
        "filter_coffee_mix",
        "excelsa",
      ],
      user_role_enum: [
        "admin",
        "operator",
        "user",
        "viewer",
        "contributor",
        "roaster",
      ],
    },
  },
} as const;
