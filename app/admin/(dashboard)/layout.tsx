import { AdminNav } from "@/components/admin/admin-nav";

export const dynamic = "force-dynamic";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen md:flex">
      <AdminNav />
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
