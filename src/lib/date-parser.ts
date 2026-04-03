// Smart date/time parser — like Apple Reminders
// Detects dates and times in natural language text

interface ParsedDate {
  text: string; // cleaned text without date/time words
  dueDate: string | null; // YYYY-MM-DD
  dueTime: string | null; // HH:MM (24h)
  highlights: { start: number; end: number }[]; // character ranges to highlight
}

const TIME_REGEX = /\b(\d{1,2})\s*:\s*(\d{2})\s*(am|pm)?\b|\b(\d{1,2})\s*(am|pm)\b/gi;

const DATE_KEYWORDS: Record<string, (now: Date) => Date> = {
  today: (now) => now,
  tonight: (now) => now,
  tomorrow: (now) => { const d = new Date(now); d.setDate(d.getDate() + 1); return d; },
  monday: (now) => getNextWeekday(now, 1),
  tuesday: (now) => getNextWeekday(now, 2),
  wednesday: (now) => getNextWeekday(now, 3),
  thursday: (now) => getNextWeekday(now, 4),
  friday: (now) => getNextWeekday(now, 5),
  saturday: (now) => getNextWeekday(now, 6),
  sunday: (now) => getNextWeekday(now, 0),
  mon: (now) => getNextWeekday(now, 1),
  tue: (now) => getNextWeekday(now, 2),
  wed: (now) => getNextWeekday(now, 3),
  thu: (now) => getNextWeekday(now, 4),
  fri: (now) => getNextWeekday(now, 5),
  sat: (now) => getNextWeekday(now, 6),
  sun: (now) => getNextWeekday(now, 0),
  'next week': (now) => { const d = new Date(now); d.setDate(d.getDate() + 7); return d; },
  'next monday': (now) => { const d = getNextWeekday(now, 1); if (d.getTime() - now.getTime() < 2 * 86400000) d.setDate(d.getDate() + 7); return d; },
};

function getNextWeekday(now: Date, day: number): Date {
  const d = new Date(now);
  const diff = (day - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + (diff === 0 ? 7 : diff));
  return d;
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

export function parseTaskText(input: string): ParsedDate {
  const now = new Date();
  let text = input;
  let dueDate: string | null = null;
  let dueTime: string | null = null;
  const highlights: { start: number; end: number }[] = [];

  // Check for date keywords (longer phrases first)
  const sortedKeywords = Object.keys(DATE_KEYWORDS).sort((a, b) => b.length - a.length);
  for (const keyword of sortedKeywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const match = regex.exec(text);
    if (match && !dueDate) {
      dueDate = formatDate(DATE_KEYWORDS[keyword](now));
      highlights.push({ start: match.index, end: match.index + match[0].length });
    }
  }

  // Check for time patterns: "10am", "3:30pm", "10:00 AM"
  const timeMatches = [...input.matchAll(TIME_REGEX)];
  for (const match of timeMatches) {
    if (dueTime) break; // only take first time
    let hour: number;
    let minute: number;
    let period: string | undefined;

    if (match[4] !== undefined) {
      // Format: "10am", "3pm"
      hour = parseInt(match[4]);
      minute = 0;
      period = match[5]?.toLowerCase();
    } else {
      // Format: "10:30am", "3:30 PM"
      hour = parseInt(match[1]);
      minute = parseInt(match[2]);
      period = match[3]?.toLowerCase();
    }

    if (period === 'pm' && hour !== 12) hour += 12;
    if (period === 'am' && hour === 12) hour = 0;
    if (!period && hour <= 12) {
      // Assume PM for hours 1-6 if no period specified
      if (hour >= 1 && hour <= 6) hour += 12;
    }

    dueTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    highlights.push({ start: match.index!, end: match.index! + match[0].length });

    // If we found a time but no date, assume today
    if (!dueDate) {
      dueDate = formatDate(now);
    }
  }

  // Check for "tonight" special case — set time to 8pm if no time specified
  if (/\btonight\b/i.test(input) && !dueTime) {
    dueTime = '20:00';
  }

  // Clean the text: remove date/time words but keep the rest
  let cleanedText = text;
  // Sort highlights by position descending to remove from end first
  const sortedHighlights = [...highlights].sort((a, b) => b.start - a.start);
  for (const h of sortedHighlights) {
    cleanedText = cleanedText.slice(0, h.start) + cleanedText.slice(h.end);
  }
  // Clean up extra spaces and "at" / "on" / "by" prepositions left over
  cleanedText = cleanedText.replace(/\b(at|on|by)\s*$/gi, '').replace(/\s+/g, ' ').trim();

  return {
    text: cleanedText,
    dueDate,
    dueTime,
    highlights,
  };
}
