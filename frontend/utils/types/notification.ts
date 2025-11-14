export interface TicketUser {
  _id: string;
  name: string;
  email: string;
  role?: "admin" | "doctor" | "patient"; // patient object does not have role
}

export interface TicketMessage {
  _id: string;
  text: string;
  sentBy: {
    _id: string;
    name: string;
    email: string;
  };
  sentAt: string;
}

export interface NotificationItem {
  _id: string;
  title: string;
  
  userIds: TicketUser[];

  patient: {
    _id: string;
    name: string;
    email: string;
  };

  messages: TicketMessage[];

  referredDoctors: TicketUser[];

  status: "open" | "closed";

  createdAt: string;
  updatedAt: string;
  __v: number;
}
