import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBidStore } from "@/store/bidStore";
import { cn } from "@/lib/utils";
import type { Bidder } from "@/types/bid";

const bidderBgClass: Record<Bidder, string> = {
  N: "bg-[--color-bidder-north]",
  S: "bg-[--color-bidder-south]",
  E: "bg-[--color-bidder-east]",
  W: "bg-[--color-bidder-west]",
};

function formatBid(bid: string, by: Bidder): string {
  return by === "E" || by === "W" ? `(${bid})` : bid;
}

export function FullSequenceDialog() {
  const dialogBidId = useBidStore((state) => state.dialogBidId);
  const closeDialog = useBidStore((state) => state.closeDialog);
  const system = useBidStore((state) => state.system);

  if (dialogBidId === null || !system) return null;

  const currentBid = system.bids[dialogBidId];
  const bidIds = [...currentBid.ancestors, dialogBidId];

  return (
    <Dialog open={dialogBidId !== null} onOpenChange={() => closeDialog()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Full Sequence</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-1">
          {bidIds.map((id) => {
            const bid = system.bids[id];
            return (
              <div
                key={id}
                className={cn(
                  "rounded px-3 py-2 text-sm",
                  bidderBgClass[bid.by],
                )}
              >
                <span className="font-medium">
                  {formatBid(bid.bid, bid.by)}
                </span>
                {bid.meaning && (
                  <span className="text-muted-foreground">
                    {" "}
                    - {bid.meaning}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
