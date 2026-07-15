import { useState, useEffect } from "react";

export type Severity = "urgent" | "hot" | "watch" | "info";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  symbol?: string;
  severity: Severity;
  timestamp: number;
  read: boolean;
}

export interface AlertRule {
  id: string;
  asset: string;
  condition: string;
  value?: string;
  enabled: boolean;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  { id: "n1", title: "Gold became Bullish", message: "Momentum indicator crossed threshold.", symbol: "xauusd", severity: "hot", timestamp: Date.now() - 1000 * 60 * 5, read: false },
  { id: "n2", title: "NASDAQ Confidence dropped", message: "Confidence level fell below 70%.", symbol: "ndx", severity: "watch", timestamp: Date.now() - 1000 * 60 * 45, read: false },
  { id: "n3", title: "Fed News Published", message: "Major impact expected across all USD pairs.", severity: "urgent", timestamp: Date.now() - 1000 * 60 * 60 * 2, read: true },
];

const INITIAL_RULES: AlertRule[] = [
  { id: "r1", asset: "Gold", condition: "turns", value: "Bullish", enabled: true },
  { id: "r2", asset: "BTC", condition: "Confidence >", value: "90%", enabled: false }
];

export function useAlerts() {
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [rules, setRules] = useState<AlertRule[]>(INITIAL_RULES);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedNotifs = localStorage.getItem("asmo_notifications");
    const savedRules = localStorage.getItem("asmo_alert_rules");
    
    if (savedNotifs) {
      try { setNotifications(JSON.parse(savedNotifs)); } catch (e) {}
    }
    if (savedRules) {
      try { setRules(JSON.parse(savedRules)); } catch (e) {}
    }
    
    setIsLoaded(true);
  }, []);

  const saveNotifs = (newNotifs: AppNotification[]) => {
    setNotifications(newNotifs);
    localStorage.setItem("asmo_notifications", JSON.stringify(newNotifs));
  };

  const saveRules = (newRules: AlertRule[]) => {
    setRules(newRules);
    localStorage.setItem("asmo_alert_rules", JSON.stringify(newRules));
  };

  // Notification Actions
  const markAsRead = (id: string) => {
    saveNotifs(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    saveNotifs(notifications.map(n => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    saveNotifs([]);
  };

  // Rule Actions
  const addRule = (rule: Omit<AlertRule, "id" | "enabled">) => {
    const newRule: AlertRule = {
      ...rule,
      id: `r_${Date.now()}`,
      enabled: true
    };
    saveRules([newRule, ...rules]);
  };

  const toggleRule = (id: string) => {
    saveRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const deleteRule = (id: string) => {
    saveRules(rules.filter(r => r.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    rules,
    isLoaded,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    addRule,
    toggleRule,
    deleteRule
  };
}
