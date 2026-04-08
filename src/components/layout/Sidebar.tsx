import { Link } from "react-router-dom";
// import { BookMarked } from "lucide-react";
import { NavContent } from "./NavContent";
import Logo from "@/assets/logo.svg"

export function Sidebar() {
  return (
    <div className="border-r bg-muted/40 h-full">
      <div className="flex h-full max-h-screen flex-col">
        <div className="flex h-16 items-center border-b px-6 flex-shrink-0">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 font-semibold text-primary"
          >
            {/* <BookMarked className="h-6 w-6  text-primary" /> */}
            <img src={Logo} alt="Logo" className="h-6 w-6" />
            <span>Bookmarkly</span>
          </Link>
        </div>
        <div className="flex flex-col flex-1 min-h-0">
          <NavContent />
        </div>
      </div>
    </div>
  );
}
