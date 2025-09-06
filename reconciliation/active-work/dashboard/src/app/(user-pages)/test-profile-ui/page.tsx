"use client";

import { EmCoinDisplay } from "@/components/emcoin/emcoin-display";
import { VisitorCounter } from "@/components/profile/visitor-counter";
import { ProfileCustomization } from "@/components/profile/profile-customization";
import { useProfileCustomization } from "@/hooks/use-profile-customization";
import { useVisitorTracking } from "@/hooks/use-visitor-tracking";
import { useEffect } from "react";

export default function TestProfileUIPage() {
  // Test the hooks
  const customization = useProfileCustomization();
  const visitorTracking = useVisitorTracking();

  useEffect(() => {
    console.log("Profile Customization Hook:", customization);
    console.log("Visitor Tracking Hook:", visitorTracking);
  }, [customization, visitorTracking]);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Session 144 UI Components Test</h1>
      
      <div className="grid gap-6">
        <section className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">EmCoin Display Component</h2>
          <EmCoinDisplay userId="test-user-id" />
        </section>

        <section className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Visitor Counter Component</h2>
          <VisitorCounter profileUserId="test-user-id" />
        </section>

        <section className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Profile Customization Component</h2>
          <ProfileCustomization userId="test-user-id" isOwnProfile={true} />
        </section>

        <section className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Hook Data (Check Console)</h2>
          <div className="space-y-2 text-sm">
            <p>Customization Loading: {customization.loading ? "Yes" : "No"}</p>
            <p>Visitor Stats Loading: {visitorTracking.loading ? "Yes" : "No"}</p>
            <p>Today Count: {visitorTracking.todayCount || 0}</p>
          </div>
        </section>
      </div>
    </div>
  );
}