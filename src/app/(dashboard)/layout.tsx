import { SidebarNav } from "@/components/organisms/sidebar-nav";
import { TopBar } from "@/components/organisms/top-bar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen">
      <SidebarNav />
      <div className="flex flex-1 flex-col lg:ml-64">
        <TopBar />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
