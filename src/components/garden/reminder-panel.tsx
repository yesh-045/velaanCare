'use client';

import { Reminder } from '@/types/ui';
import { Droplets, Bug, Leaf, Scissors, Check, Bell, CalendarClock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ReminderPanelProps {
  reminders: Reminder[];
}

export function ReminderPanel({ reminders }: ReminderPanelProps) {
  const getIcon = (type: Reminder['type']) => {
    switch (type) {
      case 'watering':
        return <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full"><Droplets className="h-4 w-4 text-blue-600 dark:text-blue-400" /></div>;
      case 'pest-check':
        return <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full"><Bug className="h-4 w-4 text-orange-600 dark:text-orange-400" /></div>;
      case 'fertilizing':
        return <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full"><Leaf className="h-4 w-4 text-green-600 dark:text-green-400" /></div>;
      case 'harvest':
        return <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full"><Scissors className="h-4 w-4 text-purple-600 dark:text-purple-400" /></div>;
      default:
        return <div className="p-2 bg-muted rounded-full"><Bell className="h-4 w-4 text-muted-foreground" /></div>;
    }
  };

  const handleComplete = (id: string) => {
    toast.success('Task marked as complete!');
  };

  return (
    <Card className="flex flex-col h-auto max-h-[500px] border-muted/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-primary" />
              Garden Tasks
            </CardTitle>
            <CardDescription className="mt-1">
              You have {reminders.length} pending tasks today
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-[350px] px-6 pb-6">
          <div className="space-y-3 pt-2">
            {reminders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-muted m-2">
                <div className="p-4 bg-background rounded-full mb-3 shadow-sm">
                  <Check className="h-8 w-8 text-green-500" />
                </div>
                <p className="font-medium text-foreground">All caught up!</p>
                <p className="text-sm mt-1">Your garden is looking great.</p>
              </div>
            ) : (
              reminders.map((reminder) => (
                <div 
                  key={reminder.id} 
                  className="flex items-start justify-between group p-3.5 rounded-xl border bg-card hover:bg-muted/30 transition-all duration-200 hover:shadow-sm hover:border-primary/20"
                >
                  <div className="flex gap-4 items-center">
                    {getIcon(reminder.type)}
                    <div>
                      <p className="font-medium text-sm text-foreground">{reminder.plantName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 font-medium">{reminder.message}</p>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-all text-muted-foreground hover:text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 dark:hover:text-green-400"
                    onClick={() => handleComplete(reminder.id)}
                  >
                    <Check className="h-4 w-4" />
                    <span className="sr-only">Mark as done</span>
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
