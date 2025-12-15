import { redirect } from "next/navigation";

export default function AccountsPage() {
  redirect('/wealth?tab=accounts');
}
