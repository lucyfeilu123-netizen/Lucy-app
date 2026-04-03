'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Timer } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import AnimatedGradientBackground from '@/components/ui/animated-gradient-background';

const POSITIVE_MESSAGES = [
  "You're going to crush it today!",
  "Today is your day to shine!",
  "Every step counts — let's go!",
  "You've got the power to make today amazing.",
  "Believe in yourself — you're unstoppable!",
  "Small wins lead to big victories.",
  "Your effort today plants seeds for tomorrow.",
  "Stay curious, stay focused, stay awesome.",
  "The best is yet to come — start now!",
  "You're stronger than you think.",
  "Progress over perfection, always.",
  "One task at a time — you've got this!",
  "Today's focus builds tomorrow's freedom.",
  "Your dedication inspires those around you.",
  "Make today count — future you will be grateful.",
  "Keep going — great things take time.",
  "You're writing your success story, one day at a time.",
  "Breathe deep, focus hard, finish strong.",
  "The world needs what you're building.",
  "You showed up — that's already a win.",
];

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomePage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [loaded, setLoaded] = useState(false);

  const dayIndex = getDayOfYear();
  const message = POSITIVE_MESSAGES[dayIndex % POSITIVE_MESSAGES.length];

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const name = user.user_metadata?.display_name
          || user.user_metadata?.full_name
          || user.email?.split('@')[0]
          || 'Friend';
        setUserName(name);
      } else {
        setUserName('Friend');
      }
      setLoaded(true);
    });
  }, []);

  const firstName = userName.split(' ')[0];

  if (!loaded) return null;

  return (
    <div className="relative h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <AnimatedGradientBackground
        Breathing={true}
        animationSpeed={0.03}
        breathingRange={8}
        startingGap={110}
        topOffset={10}
        gradientColors={[
          '#0A0A0A',
          '#1a1a2e',
          '#16213e',
          '#0f3460',
          '#533483',
          '#e94560',
          '#0A0A0A',
        ]}
        gradientStops={[20, 35, 50, 60, 70, 85, 100]}
      />

      {/* Content */}
      <AnimatePresence>
        {loaded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-md mx-auto"
          >
            {/* Date pill */}
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-white/50 text-[11px] sm:text-xs uppercase tracking-[0.25em] mb-4 sm:mb-6"
            >
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </motion.p>

            {/* Cat Lottie animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.0, ease: 'easeOut' }}
              className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 mb-4 sm:mb-6"
            >
              <DotLottieReact
                src="https://lottie.host/8cf4ba71-e5fb-44f3-8134-178c4d389417/0CCsdcgNIP.json"
                loop
                autoplay
                style={{ width: '100%', height: '100%' }}
              />
            </motion.div>

            {/* Greeting */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.2 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {getGreeting()}, {firstName}
            </motion.h1>

            {/* Positive message */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.5 }}
              className="text-base sm:text-lg md:text-xl text-white/70 leading-relaxed mb-8 sm:mb-10 px-2"
            >
              {message}
            </motion.p>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.8 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/inbox')}
              className={cn(
                'group flex items-center gap-3 rounded-full px-7 py-3.5 sm:px-8 sm:py-4',
                'bg-white/12 backdrop-blur-md text-white text-sm sm:text-base font-semibold',
                'hover:bg-white/20 active:bg-white/25 transition-all duration-200',
                'border border-white/15 shadow-lg shadow-black/20',
              )}
            >
              <Timer size={18} className="sm:w-5 sm:h-5" />
              Start Focusing
              <ArrowRight
                size={16}
                className="sm:w-[18px] sm:h-[18px] transition-transform duration-200 group-hover:translate-x-1"
              />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
