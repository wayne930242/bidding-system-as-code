import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useBidStore } from "@/store/bidStore";

export function Header() {
  const system = useBidStore((state) => state.system);
  const expandAll = useBidStore((state) => state.expandAll);
  const collapseAll = useBidStore((state) => state.collapseAll);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <h1 className="text-xl font-semibold">
          {system?.name ?? "Loading..."}
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={collapseAll}>
            <ChevronsDownUp className="mr-2 h-4 w-4" />
            Collapse all
          </Button>
          <Button variant="outline" size="sm" onClick={expandAll}>
            <ChevronsUpDown className="mr-2 h-4 w-4" />
            Expand all
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
