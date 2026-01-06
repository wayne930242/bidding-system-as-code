import { useMemo, useState } from "react";
import { marked } from "marked";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useBidStore } from "@/store/bidStore";

export function SystemDescription() {
  const system = useBidStore((state) => state.system);
  const description = system?.description ?? "";
  const [isOpen, setIsOpen] = useState(false);

  const html = useMemo(() => {
    if (!description) return "";
    return marked.parse(description) as string;
  }, [description]);

  if (!description) return null;

  return (
    <div className="mx-auto mt-4 max-w-5xl px-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card to-muted/30">
          {/* Decorative corner */}
          <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5" />
          <div className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary/10" />

          {/* Header - clickable */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex w-full items-center justify-between px-5 py-3 text-left transition-colors hover:bg-accent/30"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <h2 className="font-medium text-foreground">系統說明</h2>
            </div>
            <Button variant="ghost" size="icon-sm" className="h-7 w-7" asChild>
              <span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </span>
            </Button>
          </button>

          {/* Content */}
          <CollapsibleContent>
            <div className="relative border-t border-border/50 px-5 py-4">
              <div
                className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-ul:text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
}
