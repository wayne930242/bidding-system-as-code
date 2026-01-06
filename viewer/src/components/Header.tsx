import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { useBidStore } from "@/store/bidStore";

export function Header() {
  const system = useBidStore((state) => state.system);
  const availableSystems = useBidStore((state) => state.availableSystems);
  const currentSystemId = useBidStore((state) => state.currentSystemId);
  const switchSystem = useBidStore((state) => state.switchSystem);
  const isLoading = useBidStore((state) => state.isLoading);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-xl font-semibold">
              {isLoading ? "Loading..." : system?.name ?? "Select System"}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {availableSystems.map((sys) => (
              <DropdownMenuItem
                key={sys.id}
                onClick={() => switchSystem(sys.id)}
                className={sys.id === currentSystemId ? "bg-accent" : ""}
              >
                {sys.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <ModeToggle />
      </div>
    </header>
  );
}
