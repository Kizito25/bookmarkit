import { Routes, Route, Navigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { BookmarkList } from "@/components/BookmarkList";
import { ShareTargetHandler } from "@/components/ShareTargetHandler";
import { SettingsPage } from "./Settings";
import { DataRequestsPage } from "./DataRequests";

export function Dashboard() {
  return (
    <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="fixed left-0 top-0 z-10 h-screen w-[220px] lg:w-[280px] hidden md:block">
        <Sidebar />
      </div>
      <div className="md:col-start-2 flex flex-col h-screen">
        <Header />
        <main data-scroll-section className="flex-1 p-4 lg:p-6 h-screen">
          <div data-scroll className="flex flex-col gap-4 lg:gap-6h-screen">
            <Routes>
              <Route path="/" element={<BookmarkList />} />
              <Route path="/add" element={<ShareTargetHandler />} />
              <Route path="/pinned" element={<BookmarkList />} />
              <Route path="/archived" element={<BookmarkList />} />
              <Route path="/tag/:tagName" element={<BookmarkList />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/data-requests" element={<DataRequestsPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
