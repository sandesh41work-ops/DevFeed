import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

import {
  DAILY_REMINDER_BODY,
  DAILY_REMINDER_TITLE,
  DEFAULT_REMINDER_HOUR,
  DEFAULT_REMINDER_MINUTE,
  REMINDER_STORAGE_KEY,
} from "./notificationConstant";

const DAILY_REMINDER_CHANNEL_ID = "daily-reminder";

export type ReminderSettings = {
  enabled: boolean;
  hour: number;
  minute: number;
  notificationId?: string;
};

async function getReminderSettings(): Promise<ReminderSettings | null> {
  const stored = await AsyncStorage.getItem(REMINDER_STORAGE_KEY);

  if (!stored) {
    return null;
  }

  return JSON.parse(stored);
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

export async function scheduleDailyReminder(
  hour = DEFAULT_REMINDER_HOUR,
  minute = DEFAULT_REMINDER_MINUTE
): Promise<string | null> {
  const permissionGranted = await requestNotificationPermission();

  if (!permissionGranted) {
    console.log("[Notifications] Permission not granted");
    return null;
  }

  await setupAndroidNotificationChannel();

  const existingSettings = await getReminderSettings();

  if (existingSettings?.notificationId) {
    try {
      const scheduledNotifications =
        await Notifications.getAllScheduledNotificationsAsync();

      const alreadyScheduled = scheduledNotifications.some(
        (notification) =>
          notification.identifier === existingSettings.notificationId
      );

      if (alreadyScheduled) {
        console.log(
          "[Notifications] Daily reminder already scheduled"
        );

        return existingSettings.notificationId;
      }
    } catch (error) {
      console.error("[Notifications] Failed to check scheduled notifications:", error);
    }
  }

  let notificationId: string | null = null;

  try {
    notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: DAILY_REMINDER_TITLE,
        body: DAILY_REMINDER_BODY,
        data: {
          type: "daily-reading-reminder",
        },
        ...(Platform.OS === "android" && {
          channelId: DAILY_REMINDER_CHANNEL_ID,
        }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });

    console.log(
      `[Notifications] Daily reminder scheduled: ${hour}:${minute}, id=${notificationId}`
    );
  } catch (error) {
    console.error("[Notifications] Failed to schedule daily reminder:", error);
    return null;
  }

  try {
    const scheduled =
      await Notifications.getAllScheduledNotificationsAsync();

    console.log(
      "[Notifications] Scheduled notifications after schedule:",
      JSON.stringify(scheduled, null, 2)
    );
  } catch (error) {
    console.error("[Notifications] Failed to verify scheduled notifications:", error);
  }

  await saveReminderSettings({
    enabled: true,
    hour,
    minute,
    notificationId,
  });

  return notificationId;
}

export async function cancelDailyReminder(): Promise<void> {
  const settings = await getReminderSettings();

  if (settings?.notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(
        settings.notificationId
      );
      console.log("[Notifications] Cancelled scheduled notification:", settings.notificationId);
    } catch (error) {
      console.error("[Notifications] Failed to cancel scheduled notification:", error);
    }
  }

  await AsyncStorage.removeItem(REMINDER_STORAGE_KEY);

  console.log("[Notifications] Daily reminder cancelled");
}

export async function getDailyReminderSettings(): Promise<ReminderSettings | null> {
  return getReminderSettings();
}
export async function testDailyReminder(): Promise<string | null> {
  console.log("[Notifications] ===== TEST START =====");

  // 1. Remove our existing reminder
  await cancelDailyReminder();

  // 2. Check permission
  const permissionGranted = await requestNotificationPermission();

  if (!permissionGranted) {
    console.log("[Notifications] Permission not granted");
    return null;
  }

  // 3. Android channel
  await setupAndroidNotificationChannel();

  // 4. Schedule 2 minutes from now
  const testDate = new Date(Date.now() + 2 * 60 * 1000);

  console.log(
    "[Notifications] Current time:",
    new Date().toLocaleString()
  );

  console.log(
    "[Notifications] Test notification time:",
    testDate.toLocaleString()
  );

  // 5. Schedule notification
  let notificationId: string | null = null;

  try {
    notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "📖 DevFeed Reminder",
        body: "This is a test daily reading reminder.",
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

  // 7. Save our state
  await saveReminderSettings({
    enabled: true,
    hour: testDate.getHours(),
    minute: testDate.getMinutes(),
    notificationId,
  });

  console.log("[Notifications] ===== TEST END =====");

  return notificationId;
}