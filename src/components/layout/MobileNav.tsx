import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, BookMarked } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavContent } from "./NavContent";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col p-0">
        <div className="p-4 border-b flex-shrink-0">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 font-semibold text-primary"
            onClick={() => setOpen(false)}
          >
            <BookMarked className="h-6 w-6" />
            <span>Bookmarkly</span>
          </Link>
        </div>
        <NavContent onLinkClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
