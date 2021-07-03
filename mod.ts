import type { Notification, Notifier } from "./notifiers/notifier.ts";
import { normalizeNotification } from "./notifiers/util.ts";
import { OsascriptNotifier } from "./notifiers/osascript.ts";
import { NotifySendNotifier } from "./notifiers/notify_send.ts";

export type { Notification, Notifier };

export function notify(title: string, message: string): Promise<void>;
export function notify(notification: Notification): Promise<void>;
export async function notify(
  titleOrNotification: string | Notification,
  maybeMessage?: string,
): Promise<void> {
  const notifier = createNotifier();
  const notification = normalizeNotification(
    titleOrNotification,
    maybeMessage,
  );
  await notifier.notify(notification);
}

export function createNotifier(): Notifier {
  // TODO: Add support for windows (Snarl, Windows 10 Toast Notifications)
  switch (Deno.build.os) {
    case "linux":
      return new NotifySendNotifier();
    case "darwin":
      // TODO: Add support for `terminal-notifier` (https://github.com/julienXX/terminal-notifier)
      return new OsascriptNotifier();
    default:
      throw new Error("Not supported: " + Deno.build.os);
  }
}
