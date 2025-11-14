export interface NotificationItem {
  id: string;
  message: string;
  type: "appointment" | "alert" | "task";
  createdAt: string;
  status: "pending" | "accepted" | "declined";
}
