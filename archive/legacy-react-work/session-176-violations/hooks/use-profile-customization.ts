"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ProfileTheme {
  id: string;
  name: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_pattern: string;
  emcoin_cost: number;
  preview_url?: string;
}

export interface ProfileCustomization {
  id: string;
  user_id: string;
  theme_id: string | null;
  custom_css: string | null;
  background_image: string | null;
  status_message: string | null;
  status_emoji: string | null;
  profile_song_url: string | null;
  is_public: boolean;
  theme?: ProfileTheme;
}

export function useProfileCustomization(userId?: string) {
  const [customization, setCustomization] = useState<ProfileCustomization | null>(null);
  const [themes, setThemes] = useState<ProfileTheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [emcoinBalance, setEmcoinBalance] = useState(0);
  const { toast } = useToast();
  const supabase = createClient();

  // Fetch user's current customization
  useEffect(() => {
    if (!userId) return;

    const fetchCustomization = async () => {
      try {
        // Get customization with theme details
        const { data: customData, error: customError } = await supabase
          .from("profile_customization")
          .select(`
            *,
            theme:profile_themes(*)
          `)
          .eq("user_id", userId)
          .single();

        if (customError && customError.code !== "PGRST116") {
          throw customError;
        }

        setCustomization(customData);

        // Get available themes
        const { data: themeData, error: themeError } = await supabase
          .from("profile_themes")
          .select("*")
          .order("emcoin_cost", { ascending: true });

        if (themeError) throw themeError;
        setThemes(themeData || []);

        // Get user's EmCoin balance
        const { data: walletData, error: walletError } = await supabase
          .from("emcoin_wallets")
          .select("balance")
          .eq("user_id", userId)
          .single();

        if (walletData) {
          setEmcoinBalance(walletData.balance);
        }

      } catch (error) {
        console.error("Error fetching customization:", error);
        toast({
          title: "Error",
          description: "Failed to load profile customization",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCustomization();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`profile-custom-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profile_customization",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setCustomization(payload.new as ProfileCustomization);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, supabase, toast]);

  // Update status message
  const updateStatus = async (message: string, emoji?: string) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from("profile_customization")
        .update({
          status_message: message,
          status_emoji: emoji || null,
        })
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;

      setCustomization(data);
      toast({
        title: "Status Updated",
        description: "Your status has been updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  // Purchase and apply theme
  const purchaseTheme = async (themeId: string) => {
    if (!userId) return;

    const theme = themes.find((t) => t.id === themeId);
    if (!theme) return;

    if (emcoinBalance < theme.emcoin_cost) {
      toast({
        title: "Insufficient EmCoins",
        description: `You need ${theme.emcoin_cost} EmCoins to purchase this theme`,
        variant: "destructive",
      });
      return;
    }

    try {
      // Create EmCoin transaction for theme purchase
      const { error: transactionError } = await supabase
        .from("emcoin_transactions")
        .insert({
          from_user_id: userId,
          to_user_id: null, // System transaction
          amount: theme.emcoin_cost,
          transaction_type: "theme_purchase",
          description: `Purchased ${theme.name} theme`,
        });

      if (transactionError) throw transactionError;

      // Apply the theme
      const { data, error } = await supabase
        .from("profile_customization")
        .update({ theme_id: themeId })
        .eq("user_id", userId)
        .select(`
          *,
          theme:profile_themes(*)
        `)
        .single();

      if (error) throw error;

      setCustomization(data);
      setEmcoinBalance((prev) => prev - theme.emcoin_cost);

      toast({
        title: "Theme Purchased!",
        description: `You've unlocked the ${theme.name} theme`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to purchase theme",
        variant: "destructive",
      });
    }
  };

  // Toggle profile visibility
  const toggleVisibility = async () => {
    if (!userId || !customization) return;

    try {
      const { data, error } = await supabase
        .from("profile_customization")
        .update({ is_public: !customization.is_public })
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;

      setCustomization(data);
      toast({
        title: "Visibility Updated",
        description: `Your profile is now ${data.is_public ? "public" : "private"}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update visibility",
        variant: "destructive",
      });
    }
  };

  // Update custom CSS
  const updateCustomCSS = async (css: string) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from("profile_customization")
        .update({ custom_css: css })
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;

      setCustomization(data);
      toast({
        title: "Style Updated",
        description: "Your custom styles have been applied",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update styles",
        variant: "destructive",
      });
    }
  };

  return {
    customization,
    themes,
    loading,
    emcoinBalance,
    updateStatus,
    purchaseTheme,
    toggleVisibility,
    updateCustomCSS,
  };
}