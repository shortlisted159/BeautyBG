import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import LoginDialog from "@/components/Auth/LoginDialog";
const Header = () => {
  const { user, signOut } = useAuth();
  const [open, setOpen] = React.useState(false);
  const initials = (user?.name || "G").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

  return <header className="py-6 border-b">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg w-8 h-8 flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <h1 className="text-xl font-bold">BeautyBG</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-sm text-muted-foreground">Create beautiful screenshot images</div>
          {user && !user.isAnonymous ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button aria-label="Account">
                  <Avatar>
                    {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="text-sm font-medium">{user.name}</div>
                  {user.email && <div className="text-xs text-muted-foreground">{user.email}</div>}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button size="sm" onClick={() => setOpen(true)}>Sign in</Button>
              <LoginDialog open={open} onOpenChange={setOpen} />
            </>
          )}
        </div>
      </div>
    </header>;
};
export default Header;