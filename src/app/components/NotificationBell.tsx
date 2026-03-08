import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    const { data, error } = await supabase
      .from("notifications")
      .select("id, title, message, is_read, created_at")
      .order("created_at", { ascending: false })
      .limit(30);

    if (!error) {
      setNotifications((data ?? []) as NotificationItem[]);
    }
  }

  async function markAllAsRead() {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", unreadIds);

    await loadNotifications();
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <Dialog
      open={open}
      onOpenChange={async (value) => {
        setOpen(value);
        if (value) {
          await loadNotifications();
          await markAllAsRead();
        }
      }}
    >
      <DialogTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Notificações</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">Sem notificações.</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-xl border p-4 ${
                  notification.is_read ? "bg-white" : "bg-blue-50"
                }`}
              >
                <div className="font-medium text-gray-900">
                  {notification.title}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {notification.message}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(notification.created_at).toLocaleString("pt-PT")}
                </div>
              </div>
            ))
          )}
        </div>

        <Button variant="outline" onClick={loadNotifications}>
          Atualizar
        </Button>
      </DialogContent>
    </Dialog>
  );
}