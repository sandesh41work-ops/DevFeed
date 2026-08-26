import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

import {
  DAILY_REMINDER_MESSAGES,
  DEFAULT_REMINDER_HOUR,
  DEFAULT_REMINDER_MINUTE,
  REMINDER_STORAGE_KEY,
} from "./notificationConstant";

const DAILY_REMINDER_CHANNEL_ID = "daily-reminder";
const TARGET_QUEUE_SIZE = 7;

export type ReminderSettings = {
  enabled: boolean;
  hour: number;
  minute: number;
  notificationIds: string[];
};

async function getReminderSettings(): Promise<ReminderSettings | null> {
  const stored = await AsyncStorage.getItem(REMINDER_STORAGE_KEY);

  if (!stored) {
    return null;
  }

  const parsed = JSON.parse(stored);

  if (Array.isArray(parsed.notificationIds)) {
    return parsed;
  }

  if (parsed.notificationId) {
    return {
      enabled: parsed.enabled,
      hour: parsed.hour,
      minute: parsed.minute,
      notificationIds: [parsed.notificationId],
    };
  }

  return {
    enabled: parsed.enabled,
    hour: parsed.hour,
    minute: parsed.minute,
    notificationIds: [],
  };
}

async function saveReminderSettings(
  settings: ReminderSettings
): Promise<void> {
  await AsyncStorage.setItem(
    REMINDER_STORAGE_KEY,
    JSON.stringify(settings)
  );
}

async function requestNotificationPermission(): Promise<boolean> {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    if (existingStatus === "granted") {
      console.log("[Notifications] Permission already granted");
      return true;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    console.log("[Notifications] Permission request status:", status);

    return status === "granted";
  } catch (error) {
    console.error("[Notifications] Permission request failed:", error);
    return false;
  }
}

async function setupAndroidNotificationChannel(): Promise<void> {
  if (Platform.OS !== "android") {
    return;
  }

  try {
    await Notifications.setNotificationChannelAsync(
      DAILY_REMINDER_CHANNEL_ID,
      {
        name: "Daily Reading Reminder",
        importance: Notifications.AndroidImportance.HIGH,
      }
    );
    console.log("[Notifications] Android channel created/updated");
  } catch (error) {
    console.error("[Notifications] Failed to create Android channel:", error);
  }
}

function getTriggerDate(trigger: Notifications.NotificationTrigger): Date | null {
  const anyTrigger = trigger as any;
  if (anyTrigger.date) {
    return new Date(anyTrigger.date);
  }
  if (typeof anyTrigger.milliseconds === "number") {
    return new Date(anyTrigger.milliseconds);
  }
  return null;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getNextAvailableDate(
  hour: number,
  minute: number,
  existingDates: Date[]
): Date {
  const now = new Date();
  let candidate = new Date(now);
  candidate.setHours(hour, minute, 0, 0);

  if (candidate <= now) {
    candidate.setDate(candidate.getDate() + 1);
  }

  if (existingDates.length > 0) {
    const latest = new Date(Math.max(...existingDates.map((d) => d.getTime())));
    const dayAfterLatest = new Date(latest);
    dayAfterLatest.setDate(dayAfterLatest.getDate() + 1);
    dayAfterLatest.setHours(hour, minute, 0, 0);

    if (dayAfterLatest > candidate) {
      candidate = dayAfterLatest;
    }
  }

  return candidate;
}

export async function scheduleDailyReminders(
  hour = DEFAULT_REMINDER_HOUR,
  minute = DEFAULT_REMINDER_MINUTE
): Promise<string[]> {
  const permissionGranted = await requestNotificationPermission();

  if (!permissionGranted) {
    console.log("[Notifications] Permission not granted");
    return [];
  }

  await setupAndroidNotificationChannel();

  const allScheduled = await Notifications.getAllScheduledNotificationsAsync();
  const devFeedNotifications = allScheduled.filter(
    (notification) => notification.content?.data?.type === "daily-reading-reminder"
  );

  const existingIds = new Set(devFeedNotifications.map((n) => n.identifier));
  const existingCount = devFeedNotifications.length;
  const toSchedule = Math.max(0, TARGET_QUEUE_SIZE - existingCount);

  console.log(
    `[Notifications] Existing DevFeed reminders: ${existingCount}, scheduling ${toSchedule} more`
  );

  if (toSchedule === 0) {
    devFeedNotifications.forEach((n) => {
      const date = getTriggerDate(n.trigger) || new Date(0);
      console.log(
        `[Notifications] Existing reminder ${n.identifier}: ${date.toLocaleString()}`
      );
    });
  }

  const existingSettings = await getReminderSettings();
  const storedIds = existingSettings?.notificationIds || [];
  const validStoredIds = storedIds.filter((id) => existingIds.has(id));

  const newIds: string[] = [];

  if (toSchedule > 0) {
    const existingDates = devFeedNotifications
      .map((n) => getTriggerDate(n.trigger))
      .filter((d): d is Date => d !== null);

    const startDate = getNextAvailableDate(hour, minute, existingDates);
    const messages = shuffleArray([...DAILY_REMINDER_MESSAGES]);
    let previousMessage: { title: string; body: string } | null = null;

    for (let i = 0; i < toSchedule; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      let messageIndex = i % messages.length;
      let message = messages[messageIndex];

      if (
        previousMessage &&
        message.title === previousMessage.title &&
        messages.length > 1
      ) {
        messageIndex = (messageIndex + 1) % messages.length;
        message = messages[messageIndex];
      }

      previousMessage = message;

      try {
        const notificationId =
          await Notifications.scheduleNotificationAsync({
            content: {
              title: message.title,
              body: message.body,
              data: {
                type: "daily-reading-reminder",
              },
              ...(Platform.OS === "android" && {
                channelId: DAILY_REMINDER_CHANNEL_ID,
              }),
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date,
            },
          });

        console.log(`[Notifications] Scheduled reminder ${i + 1}/${toSchedule}:`);
        console.log(`${date.toLocaleString()}`);
        console.log(`"${message.title}"`);
        console.log(`ID: ${notificationId}`);

        newIds.push(notificationId);
      } catch (error) {
        console.error(
          `[Notifications] Failed to schedule reminder ${i + 1}:`,
          error
        );
      }
    }
  }

  const allIds = [...validStoredIds, ...newIds];

  await saveReminderSettings({
    enabled: true,
    hour,
    minute,
    notificationIds: allIds,
  });

  try {
    const finalScheduled = await Notifications.getAllScheduledNotificationsAsync();
    const devFeedReminders = finalScheduled.filter(
      (n) => n.content?.data?.type === "daily-reading-reminder"
    );

    console.log(
      `[Notifications] Total DevFeed reminders scheduled: ${devFeedReminders.length}`
    );
    devFeedReminders.forEach((n) => {
      const date = getTriggerDate(n.trigger) || new Date(0);
      const title = n.content?.title || "No title";
      console.log(
        `[Notifications] ${n.identifier}: ${date.toLocaleString()} - "${title}"`
      );
    });
  } catch (error) {
    console.error(
      "[Notifications] Failed to verify scheduled notifications:",
      error
    );
  }

  return newIds;
}

export async function cancelDailyReminder(): Promise<void> {
  const settings = await getReminderSettings();

  if (settings?.notificationIds.length) {
    for (const id of settings.notificationIds) {
      try {
        await Notifications.cancelScheduledNotificationAsync(id);
        console.log("[Notifications] Cancelled scheduled notification:", id);
      } catch (error) {
        console.error(
          "[Notifications] Failed to cancel scheduled notification:",
          error
        );
      }
    }
  }

  await AsyncStorage.removeItem(REMINDER_STORAGE_KEY);

  console.log("[Notifications] Daily reminder cancelled");
}

export async function getDailyReminderSettings(): Promise<ReminderSettings | null> {
  return getReminderSettings();
}

export async function testDailyReminderQueue(): Promise<string[]> {
  console.log("[Notifications] ===== QUEUE TEST START =====");

  try {
    const allScheduled = await Notifications.getAllScheduledNotificationsAsync();
    const devFeedNotifications = allScheduled.filter(
      (notification) => notification.content?.data?.type === "daily-reading-reminder"
    );

    for (const notification of devFeedNotifications) {
      try {
        await Notifications.cancelScheduledNotificationAsync(
          notification.identifier
        );
        console.log(
          "[Notifications] Cancelled existing reminder:",
          notification.identifier
        );
      } catch (error) {
        console.error(
          "[Notifications] Failed to cancel existing reminder:",
          error
        );
      }
    }
  } catch (error) {
    console.error(
      "[Notifications] Failed to query existing reminders:",
      error
    );
  }

  await cancelDailyReminder();

  const permissionGranted = await requestNotificationPermission();

  if (!permissionGranted) {
    console.log("[Notifications] Permission not granted");
    return [];
  }

  await setupAndroidNotificationChannel();

  const messages = shuffleArray([...DAILY_REMINDER_MESSAGES]);
  const notificationIds: string[] = [];

  console.log("[Notifications] Scheduling 7 test reminders...");

  const now = new Date();
  const startDate = new Date(now.getTime() + 60 * 1000);
  let previousMessage: { title: string; body: string } | null = null;

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate.getTime() + i * 60 * 1000);
    let messageIndex = i % messages.length;
    let message = messages[messageIndex];

    if (
      previousMessage &&
      message.title === previousMessage.title &&
      messages.length > 1
    ) {
      messageIndex = (messageIndex + 1) % messages.length;
      message = messages[messageIndex];
    }

    previousMessage = message;

    try {
      const notificationId =
        await Notifications.scheduleNotificationAsync({
          content: {
            title: message.title,
            body: message.body,
            data: {
              type: "daily-reading-reminder",
              test: true,
            },
            ...(Platform.OS === "android" && {
              channelId: DAILY_REMINDER_CHANNEL_ID,
            }),
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date,
          },
        });

      console.log(`[Notifications] Test reminder ${i + 1}`);
      console.log(`  Time: ${date.toLocaleString()}`);
      console.log(`  ID: ${notificationId}`);
      console.log(`  Title: ${message.title}`);

      notificationIds.push(notificationId);
    } catch (error) {
      console.error(
        `[Notifications] Failed to schedule test reminder ${i + 1}:`,
        error
      );
    }
  }

  await saveReminderSettings({
    enabled: true,
    hour: startDate.getHours(),
    minute: startDate.getMinutes(),
    notificationIds,
  });

  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const devFeedReminders = scheduled.filter(
      (n) => n.content?.data?.type === "daily-reading-reminder"
    );

    console.log(
      `[Notifications] Test queue contains ${devFeedReminders.length} notifications`
    );
    devFeedReminders.forEach((n) => {
      const date = getTriggerDate(n.trigger) || new Date(0);
      const title = n.content?.title || "No title";
      console.log(
        `[Notifications] ${n.identifier}: ${date.toLocaleString()} - "${title}"`
      );
    });
  } catch (error) {
    console.error(
      "[Notifications] Failed to verify test queue:",
      error
    );
  }

  console.log("[Notifications] ===== QUEUE TEST END =====");

  return notificationIds;
}

export async function testDailyReminder(): Promise<string | null> {
  console.log("[Notifications] ===== TEST START =====");

  const permissionGranted = await requestNotificationPermission();

  if (!permissionGranted) {
    console.log("[Notifications] Permission not granted");
    return null;
  }

  await setupAndroidNotificationChannel();

  const testDate = new Date(Date.now() + 2 * 60 * 1000);

  console.log(
    "[Notifications] Current time:",
    new Date().toLocaleString()
  );

  console.log(
    "[Notifications] Test notification time:",
    testDate.toLocaleString()
  );

  let notificationId: string | null = null;

  try {
    notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "📖 DevFeed Reminder",
        body: "This is a test daily reading reminder.",
        data: {
          type: "daily-reading-reminder-test",
        },
        ...(Platform.OS === "android" && {
          channelId: DAILY_REMINDER_CHANNEL_ID,
        }),
      },

      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: testDate,
      },
    });

    console.log(
      "[Notifications] Created test notification:",
      notificationId
    );
  } catch (error) {
    console.error("[Notifications] Failed to schedule test notification:", error);
    return null;
  }

  try {
    const scheduled =
      await Notifications.getAllScheduledNotificationsAsync();

    console.log(
      "[Notifications] Scheduled notifications after test:",
      JSON.stringify(scheduled, null, 2)
    );
  } catch (error) {
    console.error("[Notifications] Failed to verify test scheduled notifications:", error);
  }

  console.log("[Notifications] ===== TEST END =====");

  return notificationId;
}
