"use client";

import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/hooks/use-user";

export function Header() {
  const { profile } = useUser();

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center">
        <Sheet>
          <SheetTrigger className="md:hidden mr-2 p-2 hover:bg-accent rounded-md">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="h-full bg-sidebar">
              <Sidebar />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarImage src={profile?.avatar_url || ""} />
          <AvatarFallback>{profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
