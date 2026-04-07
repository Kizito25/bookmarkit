import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export function AdminLayout() {
  return (
    <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="fixed left-0 top-0 z-10 h-screen w-[220px] lg:w-[280px] hidden md:block">
        <AdminSidebar />
      </div>
      <div className="md:col-start-2 flex flex-col h-screen">
        <AdminHeader />
        <main className="flex-1 p-4 lg:p-6">
          <div className="flex flex-col gap-4 lg:gap-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
