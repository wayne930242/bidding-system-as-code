import { useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import { QuickSearch } from "@/components/QuickSearch";
import { SystemDescription } from "@/components/SystemDescription";
import { BidTree } from "@/components/BidTree";
import { FullSequenceDialog } from "@/components/FullSequenceDialog";
import { useBidStore } from "@/store/bidStore";
import { loadSystem } from "@/data/system";

function AppContent() {
  const setSystem = useBidStore((state) => state.setSystem);

  useEffect(() => {
    loadSystem().then(setSystem);
  }, [setSystem]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <QuickSearch />
      <main className="pb-8">
        <SystemDescription />
        <BidTree />
      </main>
      <FullSequenceDialog />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="bridge-viewer-theme">
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </ThemeProvider>
  );
}
