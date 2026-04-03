'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Timer } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Your future is created by what you do today.", author: "Robert Kiyosaki" },
  { text: "Small daily improvements lead to stunning results.", author: "Robin Sharma" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "What you do today can improve all your tomorrows.", author: "Ralph Marston" },
  { text: "It's not about having time, it's about making time.", author: "Unknown" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Progress, not perfection.", author: "Unknown" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "A year from now you'll wish you started today.", author: "Karen Lamb" },
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne" },
  { text: "Every day is a fresh start.", author: "Unknown" },
  { text: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
  { text: "Dream big. Start small. Act now.", author: "Robin Sharma" },
  { text: "Be the change you wish to see in the world.", author: "Mahatma Gandhi" },
  { text: "One day or day one. You decide.", author: "Unknown" },
  { text: "Difficult roads lead to beautiful destinations.", author: "Unknown" },
  { text: "You are enough just as you are.", author: "Meghan Markle" },
  { text: "Stay focused, stay positive, stay strong.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Make today so awesome that yesterday gets jealous.", author: "Unknown" },
  { text: "Inhale confidence, exhale doubt.", author: "Unknown" },
  { text: "You've survived 100% of your worst days. You're doing great.", author: "Unknown" },
];

const PHOTOS = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1518173946687-a0f60e208046?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&fit=crop',
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
  const [imageLoaded, setImageLoaded] = useState(false);

  const dayIndex = getDayOfYear();
  const quote = QUOTES[dayIndex % QUOTES.length];
  const photo = PHOTOS[dayIndex % PHOTOS.length];

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

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = photo;
  }, [photo]);

  const firstName = userName.split(' ')[0];

  if (!loaded) return null;

  return (
    <div className="relative h-[100dvh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background photo */}
      <div
        className={cn(
          'absolute inset-0 bg-cover bg-center transition-opacity duration-1000',
          imageLoaded ? 'opacity-100' : 'opacity-0'
        )}
        style={{ backgroundImage: `url(${photo})` }}
      />

      {/* Fallback background while image loads */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Content */}
      <div
        className={cn(
          'relative z-10 flex flex-col items-center text-center px-8 max-w-lg',
          'transition-all duration-700 ease-out',
          imageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        )}
      >
        {/* App icon */}
        <img
          src="/icon-192.png"
          alt="Pomodoro"
          className="h-16 w-16 rounded-2xl mb-6 shadow-lg"
        />

        {/* Date */}
        <p className="text-white/60 text-xs uppercase tracking-[0.2em] mb-3">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        {/* Greeting */}
        <h1
          className="text-3xl sm:text-4xl font-bold text-white mb-8"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {getGreeting()}, {firstName}
        </h1>

        {/* Quote */}
        <blockquote className="mb-10">
          <p className="text-lg sm:text-xl text-white/85 leading-relaxed italic mb-2">
            &ldquo;{quote.text}&rdquo;
          </p>
          <cite className="text-white/45 text-sm not-italic">
            &mdash; {quote.author}
          </cite>
        </blockquote>

        {/* CTA Button */}
        <button
          onClick={() => router.push('/inbox')}
          className={cn(
            'group flex items-center gap-3 rounded-full px-8 py-4',
            'bg-white/15 backdrop-blur-md text-white text-base font-semibold',
            'hover:bg-white/25 active:bg-white/30 transition-all duration-200',
            'border border-white/20 shadow-lg',
          )}
        >
          <Timer size={20} />
          Start Focusing
          <ArrowRight
            size={18}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </button>
      </div>
    </div>
  );
}
