export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function scheduleNotification(title: string, body: string, delayMs: number): NodeJS.Timeout {
  return setTimeout(() => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: `pomodoro-${Date.now()}`,
      });
    }
  }, delayMs);
}

export function getTimeUntil(dateTimeStr: string): number {
  const target = new Date(dateTimeStr).getTime();
  const now = Date.now();
  return target - now;
}
