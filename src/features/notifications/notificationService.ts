import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  DAILY_REMINDER_BODY,
  DAILY_REMINDER_TITLE,
  DEFAULT_REMINDER_HOUR,
  DEFAULT_REMINDER_MINUTE,
  REMINDER_STORAGE_KEY,
} from "./notificationConstant"



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
  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  if (existingStatus === "granted") {
    return true;
  }

  const { status } = await Notifications.requestPermissionsAsync();

  return status === "granted";
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

  const existingSettings = await getReminderSettings();

  if (existingSettings?.notificationId) {
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
  }

  const notificationId =
    await Notifications.scheduleNotificationAsync({
      content: {
        title: DAILY_REMINDER_TITLE,
        body: DAILY_REMINDER_BODY,
        data: {
          type: "daily-reading-reminder",
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });

  await saveReminderSettings({
    enabled: true,
    hour,
    minute,
    notificationId,
  });

  console.log(
    `[Notifications] Daily reminder scheduled: ${hour}:${minute}`
  );

  return notificationId;
}

export async function cancelDailyReminder(): Promise<void> {
  const settings = await getReminderSettings();

  if (settings?.notificationId) {
    await Notifications.cancelScheduledNotificationAsync(
      settings.notificationId
    );
  }

  await AsyncStorage.removeItem(REMINDER_STORAGE_KEY);

  console.log("[Notifications] Daily reminder cancelled");
}

export async function getDailyReminderSettings(): Promise<ReminderSettings | null> {
  return getReminderSettings();
}