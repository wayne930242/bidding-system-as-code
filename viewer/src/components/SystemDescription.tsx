import { useMemo } from "react";
import { marked } from "marked";
import { Card, CardContent } from "@/components/ui/card";
import { useBidStore } from "@/store/bidStore";

export function SystemDescription() {
  const description = useBidStore((state) => state.system?.description ?? "");

  const html = useMemo(() => {
    if (!description) return "";
    return marked.parse(description) as string;
  }, [description]);

  if (!description) return null;

  return (
    <Card className="mx-auto mt-4 w-[90%] max-w-4xl">
      <CardContent className="pt-6">
        <div
          className="prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </CardContent>
    </Card>
  );
}
