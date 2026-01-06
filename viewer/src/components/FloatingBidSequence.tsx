import { useMemo } from "react";
import { useBidStore } from "@/store/bidStore";
import type { Bidder } from "@/types/bid";

const suitColors: Record<string, string> = {
  C: "text-green-600 dark:text-green-400",
  D: "text-orange-500 dark:text-orange-400",
  H: "text-red-600 dark:text-red-400",
  S: "text-blue-600 dark:text-blue-400",
};


function formatBidWithColor(bid: string) {
  // Handle Pass, X, XX
  if (bid === "Pass" || bid === "P")
    return <span className="text-muted-foreground">Pass</span>;
  if (bid === "X")
    return <span className="text-red-600 dark:text-red-400 font-bold">X</span>;
  if (bid === "XX")
    return (
      <span className="text-blue-600 dark:text-blue-400 font-bold">XX</span>
    );

  // Handle bids like 1C, 2H, 3NT
  const match = bid.match(/^(\d)([CDHS]|N|NT?)$/i);
  if (match) {
    const [, level, suit] = match;
    const suitUpper = suit.toUpperCase();
    const suitDisplay =
      suitUpper === "N" || suitUpper === "NT" ? "NT" : suitUpper;
    const colorClass = suitColors[suitUpper] || "";
    return (
      <span>
        {level}
        <span className={colorClass}>{suitDisplay}</span>
      </span>
    );
  }

  return <span>{bid}</span>;
}

export function FloatingBidSequence() {
  const system = useBidStore((state) => state.system);
  const focusedBidId = useBidStore((state) => state.focusedBidId);

  const sequence = useMemo(() => {
    if (!system || focusedBidId === null) return null;

    const currentBid = system.bids[focusedBidId];
    if (!currentBid) return null;

    const bidIds = [...currentBid.ancestors, focusedBidId];
    return bidIds.map((id) => system.bids[id]);
  }, [system, focusedBidId]);

  if (!sequence || sequence.length === 0) return null;

  // Group bids into rows of 4 (S, W, N, E pattern - South as dealer)
  // Fill in opponent passes between consecutive bids by our side
  const bidderOrder: Bidder[] = ["S", "W", "N", "E"];
  const firstBidder = sequence[0]?.by || "S";
  const firstBidderIndex = bidderOrder.indexOf(firstBidder);

  // Build the full bidding sequence with inferred passes
  type BidEntry =
    | (typeof sequence)[0]
    | { bid: string; by: Bidder; meaning: string; id: number };
  const fullSequence: BidEntry[] = [];

  // Fill in passes before the first bid if dealer is not the first bidder
  for (let i = 0; i < firstBidderIndex; i++) {
    const bidder = bidderOrder[i];
    fullSequence.push({
      bid: "Pass",
      by: bidder,
      meaning: "",
      id: -1,
    } as BidEntry);
  }

  // Fill in actual bids and infer passes between them
  let expectedBidderIndex = firstBidderIndex;
  for (const bid of sequence) {
    const actualBidderIndex = bidderOrder.indexOf(bid.by);

    // Fill in passes for skipped positions (opponent passes)
    while (expectedBidderIndex !== actualBidderIndex) {
      const skippedBidder = bidderOrder[expectedBidderIndex];
      fullSequence.push({
        bid: "Pass",
        by: skippedBidder,
        meaning: "",
        id: -1,
      } as BidEntry);
      expectedBidderIndex = (expectedBidderIndex + 1) % 4;
    }

    fullSequence.push(bid);
    expectedBidderIndex = (expectedBidderIndex + 1) % 4;
  }

  // Build the bidding table rows
  const rows: {
    S: BidEntry | null;
    W: BidEntry | null;
    N: BidEntry | null;
    E: BidEntry | null;
  }[] = [];
  let currentRow: (typeof rows)[0] = { S: null, W: null, N: null, E: null };

  for (const bid of fullSequence) {
    currentRow[bid.by] = bid;

    // Check if row is complete (E has been filled - last in S-W-N-E order)
    if (bid.by === "E") {
      rows.push(currentRow);
      currentRow = { S: null, W: null, N: null, E: null };
    }
  }

  // Push last incomplete row if exists
  if (currentRow.W || currentRow.N || currentRow.E || currentRow.S) {
    rows.push(currentRow);
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-xs rounded-lg border bg-background/95 p-2 shadow-lg backdrop-blur supports-backdrop-filter:bg-background/80">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b">
            <th className="px-2 py-1">S</th>
            <th className="px-2 py-1 text-amber-700 dark:text-amber-300">W</th>
            <th className="px-2 py-1 text-blue-700 dark:text-blue-300">N</th>
            <th className="px-2 py-1 text-amber-700 dark:text-amber-300">E</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {(["S", "W", "N", "E"] as Bidder[]).map((bidder) => {
                const bid = row[bidder];
                const isOpponent = bidder === "E" || bidder === "W";
                return (
                  <td
                    key={bidder}
                    className="px-2 py-1 text-center font-mono"
                  >
                    {bid ? (
                      isOpponent ? (
                        <span className="text-muted-foreground">
                          ({formatBidWithColor(bid.bid)})
                        </span>
                      ) : (
                        formatBidWithColor(bid.bid)
                      )
                    ) : (
                      ""
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
