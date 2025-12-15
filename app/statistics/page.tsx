import { redirect } from "next/navigation";

export default function StatisticsPage() {
  redirect("/transactions?view=statistics");
}
