import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useBookmarks } from '@/contexts/bookmarks-provider';
import { format, isPast } from 'date-fns';

interface Notification {
  id: number;
  title: string;
  url: string;
  dueDate: string;
  type: 'reminder';
}

export function NotificationCenter() {
  const { bookmarks } = useBookmarks();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Check for due reminders every minute
    const checkReminders = () => {
      const dueReminders = bookmarks.filter(bookmark => 
        bookmark.reminder_enabled && 
        bookmark.reminder_date && 
        !bookmark.reminder_sent &&
        isPast(new Date(bookmark.reminder_date))
      );

      setNotifications(dueReminders.map(bookmark => ({
        id: bookmark.id,
        title: bookmark.title,
        url: bookmark.url,
        dueDate: bookmark.reminder_date!,
        type: 'reminder' as const
      })));
    };

    checkReminders();
    const interval = setInterval(checkReminders, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [bookmarks]);

  const dismissNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const visitBookmark = (url: string, id: number) => {
    window.open(url, '_blank');
    dismissNotification(id);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {notifications.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {notifications.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-2">
          <h4 className="font-semibold">Notifications</h4>
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No new notifications</p>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-start gap-2 p-2 border rounded-md">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Reminder was due {format(new Date(notification.dueDate), 'PPp')}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => visitBookmark(notification.url, notification.id)}
                    >
                      Visit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => dismissNotification(notification.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
