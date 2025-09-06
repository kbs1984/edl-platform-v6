'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Star, 
  Sparkles,
  X,
  Crown,
  Award,
  Gem,
  PartyPopper,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface UnlockedBadge {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon_url?: string;
  emcoin_reward: number;
  category: string;
}

interface UnlockCelebrationProps {
  badge?: UnlockedBadge | null;
  isOpen?: boolean;
  onClose?: () => void;
  onShare?: (badge: UnlockedBadge) => void;
  autoDismiss?: boolean;
  dismissDelay?: number;
}

const rarityConfigs = {
  common: {
    gradient: 'from-gray-400 to-gray-600',
    particles: '⭐',
    icon: Award,
    message: 'Nice work!',
    color: 'text-gray-600'
  },
  rare: {
    gradient: 'from-blue-400 to-blue-600',
    particles: '✨',
    icon: Star,
    message: 'Impressive!',
    color: 'text-blue-600'
  },
  epic: {
    gradient: 'from-purple-400 to-purple-600',
    particles: '💎',
    icon: Gem,
    message: 'Outstanding!',
    color: 'text-purple-600'
  },
  legendary: {
    gradient: 'from-yellow-400 via-amber-500 to-orange-500',
    particles: '🎆',
    icon: Crown,
    message: 'LEGENDARY!',
    color: 'text-amber-600'
  }
};

// Confetti particle component
function Particle({ 
  emoji, 
  index 
}: { 
  emoji: string; 
  index: number; 
}) {
  const randomX = (Math.random() - 0.5) * 200;
  const randomY = -Math.random() * 200 - 50;
  const randomRotate = Math.random() * 360;
  const randomDuration = 1 + Math.random();

  return (
    <motion.div
      className="absolute text-2xl pointer-events-none select-none"
      initial={{ 
        x: 0, 
        y: 0, 
        rotate: 0,
        opacity: 1,
        scale: 0 
      }}
      animate={{ 
        x: randomX, 
        y: randomY, 
        rotate: randomRotate,
        opacity: 0,
        scale: 1.5
      }}
      transition={{ 
        duration: randomDuration,
        ease: "easeOut",
        delay: index * 0.05
      }}
      style={{
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      {emoji}
    </motion.div>
  );
}

export function UnlockCelebration({
  badge,
  isOpen = false,
  onClose,
  onShare,
  autoDismiss = true,
  dismissDelay = 5000
}: UnlockCelebrationProps) {
  const [showCelebration, setShowCelebration] = useState(isOpen);
  const [particles, setParticles] = useState<string[]>([]);

  useEffect(() => {
    setShowCelebration(isOpen && badge !== null);
  }, [isOpen, badge]);

  useEffect(() => {
    if (showCelebration && badge && autoDismiss) {
      const timer = setTimeout(() => {
        handleClose();
      }, dismissDelay);

      return () => clearTimeout(timer);
    }
  }, [showCelebration, badge, autoDismiss, dismissDelay]);

  useEffect(() => {
    if (showCelebration && badge) {
      // Generate particles for animation
      const config = rarityConfigs[badge.rarity];
      const particleArray = Array(20).fill(config.particles);
      setParticles(particleArray);
    }
  }, [showCelebration, badge]);

  const handleClose = useCallback(() => {
    setShowCelebration(false);
    setTimeout(() => {
      onClose?.();
    }, 300); // Wait for animation to complete
  }, [onClose]);

  const handleShare = useCallback(() => {
    if (badge) {
      onShare?.(badge);
      handleClose();
    }
  }, [badge, onShare, handleClose]);

  if (!badge) return null;

  const config = rarityConfigs[badge.rarity];
  const RarityIcon = config.icon;

  return (
    <AnimatePresence>
      {showCelebration && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Celebration Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ 
              type: "spring",
              damping: 15,
              stiffness: 300
            }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <Card className={cn(
              "relative overflow-hidden border-2",
              `bg-gradient-to-br ${config.gradient}`,
              "shadow-2xl"
            )}>
              {/* Particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((emoji, i) => (
                  <Particle key={i} emoji={emoji} index={i} />
                ))}
              </div>

              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 text-white/80 hover:text-white hover:bg-white/20 z-10"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>

              <CardContent className="relative p-6 text-center text-white">
                {/* Celebration Icon */}
                <motion.div
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ 
                    delay: 0.2,
                    type: "spring",
                    damping: 10
                  }}
                  className="mb-4"
                >
                  <PartyPopper className="h-16 w-16 mx-auto text-white/90" />
                </motion.div>

                {/* Message */}
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold mb-2"
                >
                  {config.message}
                </motion.h2>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg mb-4 text-white/90"
                >
                  You unlocked a new achievement!
                </motion.p>

                {/* Badge Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -360 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: 0.5,
                    type: "spring",
                    damping: 10
                  }}
                  className="relative h-24 w-24 mx-auto mb-4"
                >
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
                  <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                    {badge.icon_url ? (
                      <img 
                        src={badge.icon_url}
                        alt={badge.name}
                        className="h-16 w-16 rounded-full"
                      />
                    ) : (
                      <RarityIcon className={cn("h-12 w-12", config.color)} />
                    )}
                  </div>
                </motion.div>

                {/* Badge Info */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2 mb-6"
                >
                  <h3 className="text-xl font-bold">
                    {badge.name}
                  </h3>
                  <p className="text-sm text-white/80">
                    {badge.description}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {badge.category.replace(/_/g, ' ')}
                    </Badge>
                    {badge.emcoin_reward > 0 && (
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        +{badge.emcoin_reward} 🪙
                      </Badge>
                    )}
                  </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex gap-2"
                >
                  <Button
                    variant="secondary"
                    className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/20"
                    onClick={handleClose}
                  >
                    <Trophy className="h-4 w-4 mr-1" />
                    Continue
                  </Button>
                  {onShare && (
                    <Button
                      variant="secondary"
                      className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/20"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  )}
                </motion.div>

                {/* Auto-dismiss indicator */}
                {autoDismiss && (
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ 
                      duration: dismissDelay / 1000,
                      ease: "linear"
                    }}
                    className="absolute bottom-0 left-0 h-1 bg-white/30"
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}