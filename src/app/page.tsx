import { redirect } from "next/navigation";

/** The proxy normally handles this. Fallback for direct hits. */
export default function RootPage() {
  redirect("/en");
}
