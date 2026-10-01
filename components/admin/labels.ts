import type { BookingStatus } from "@/lib/db/schema";

export const statusLabels: Record<BookingStatus, string> = {
  new: "New enquiry",
  contacted: "Contacted",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const statusStyles: Record<BookingStatus, string> = {
  new: "bg-champagne/40 text-espresso",
  contacted: "bg-lavender text-espresso",
  confirmed: "bg-[#dfe8d9] text-[#2d4a26]",
  completed: "bg-sandstone/60 text-espresso",
  cancelled: "bg-[#efe1dd] text-[#7a2e22]",
};
