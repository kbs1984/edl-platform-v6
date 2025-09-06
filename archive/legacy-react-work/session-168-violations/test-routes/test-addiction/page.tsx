'use client';

import { 
  AddictionBar, 
  StreakCounter, 
  DailyBonusButton, 
  AchievementCounter 
} from '@/components/addiction';

export default function TestAddictionPage() {
  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Addiction Mechanics Test Page</h1>
        <p className="text-muted-foreground">
          Session 167 - Testing all 4 addiction mechanics components
        </p>
      </div>

      {/* Main Addiction Bar */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">1. AddictionBar Component</h2>
        <p className="text-sm text-muted-foreground mb-4">
          The famous 👁️🔥🪙🏆 display showing all key metrics
        </p>
        <AddictionBar />
      </section>

      {/* Grid Layout for Other Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Streak Counter */}
        <section>
          <h2 className="text-xl font-semibold mb-4">2. StreakCounter</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Daily login tracking with fire effects
          </p>
          <StreakCounter />
        </section>

        {/* Daily Bonus Button */}
        <section>
          <h2 className="text-xl font-semibold mb-4">3. DailyBonusButton</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Claim your daily EmCoins with countdown
          </p>
          <DailyBonusButton />
        </section>

        {/* Achievement Counter */}
        <section>
          <h2 className="text-xl font-semibold mb-4">4. AchievementCounter</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Track your progress across all categories
          </p>
          <AchievementCounter />
        </section>
      </div>

      {/* Component Details */}
      <div className="mt-12 p-6 bg-muted/20 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Component Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">✅ AddictionBar</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Real-time WebSocket updates</li>
              <li>• 4 key metrics display</li>
              <li>• Hover animations</li>
              <li>• Loading & error states</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">✅ StreakCounter</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Fire level animations</li>
              <li>• Milestone tracking</li>
              <li>• Auto streak bonus</li>
              <li>• Celebration effects</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">✅ DailyBonusButton</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• 24-hour countdown</li>
              <li>• Streak bonus calculation</li>
              <li>• Claim animation</li>
              <li>• Transaction logging</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">✅ AchievementCounter</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Category breakdown</li>
              <li>• Progress bars</li>
              <li>• Recent unlocks</li>
              <li>• Real-time updates</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Session Info */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Session 167 - Addiction Mechanics Implementation</p>
        <p>Following the 8-Phase Definitive Build Workflow</p>
        <p>Velocity Target: 4-10 features/hour</p>
      </div>
    </div>
  );
}