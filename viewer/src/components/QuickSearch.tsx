import { useEffect, useMemo } from "react";
import { Search, Delete, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useBidStore } from "@/store/bidStore";
import { cn } from "@/lib/utils";
import type { Bidder } from "@/types/bid";

const LEVELS = ["1", "2", "3", "4", "5", "6", "7"];
const SUITS = [
  { key: "C", label: "♣", className: "text-green-600 dark:text-green-400" },
  { key: "D", label: "♦", className: "text-orange-500 dark:text-orange-400" },
  { key: "H", label: "♥", className: "text-red-600 dark:text-red-400" },
  { key: "S", label: "♠", className: "text-blue-600 dark:text-blue-400" },
  { key: "N", label: "NT", className: "" },
];
const SPECIAL = [
  { key: "P", label: "Pass" },
  { key: "X", label: "X" },
  { key: "XX", label: "XX" },
];

// Bidder colors matching BidNode
const bidderTextClass: Record<Bidder, string> = {
  N: "text-blue-700 dark:text-blue-300",
  S: "text-foreground",
  E: "text-amber-700 dark:text-amber-300",
  W: "text-rose-700 dark:text-rose-300",
};

interface BidInfo {
  bid: string;
  by: Bidder;
}

// Normalize bid format: 2NT -> 2N, 1NT -> 1N, etc.
function normalizeBid(bid: string): string {
  return bid.toUpperCase().replace(/NT/g, "N").replace(/\s+/g, "");
}

// Get sequence from bid path with bidder info
function getBidSequence(
  bidId: number,
  bids: readonly { id: number; bid: string; by: Bidder; ancestors: number[] }[],
): BidInfo[] {
  const bid = bids[bidId];
  if (!bid) return [];
  const sequence = bid.ancestors.map((id) => ({
    bid: normalizeBid(bids[id].bid),
    by: bids[id].by,
  }));
  sequence.push({ bid: normalizeBid(bid.bid), by: bid.by });
  return sequence;
}

export function QuickSearch() {
  const system = useBidStore((state) => state.system);
  const focusedBidId = useBidStore((state) => state.focusedBidId);
  const expandToNode = useBidStore((state) => state.expandToNode);
  const setFocusedBid = useBidStore((state) => state.setFocusedBid);

  // Sync input with focused bid
  const currentSequence = useMemo(() => {
    if (focusedBidId === null || !system) return [];
    return getBidSequence(focusedBidId, system.bids);
  }, [focusedBidId, system]);

  // Search results
  const searchResults = useMemo(() => {
    if (!system || currentSequence.length === 0) return [];

    const results: { id: number; sequence: BidInfo[]; meaning: string }[] = [];

    for (const bid of system.bids) {
      const bidSequence = getBidSequence(bid.id, system.bids);

      // Check if this bid's sequence starts with the search sequence
      if (bidSequence.length < currentSequence.length) continue;

      let matches = true;
      for (let i = 0; i < currentSequence.length; i++) {
        if (bidSequence[i].bid !== currentSequence[i].bid) {
          matches = false;
          break;
        }
      }

      if (matches) {
        results.push({
          id: bid.id,
          sequence: bidSequence,
          meaning: bid.meaning,
        });
      }
    }

    return results.slice(0, 20); // Limit results
  }, [system, currentSequence]);

  // Handle quick input button
  const handleInput = (value: string) => {
    const newSequenceBids = currentSequence.map((b) => b.bid);

    if (value === "CLEAR") {
      setFocusedBid(null);
      return;
    }

    if (value === "BACK") {
      newSequenceBids.pop();
      if (newSequenceBids.length === 0) {
        setFocusedBid(null);
        return;
      }
    } else {
      // Check if last item is just a level (1-7) and this is a suit
      const lastItem = newSequenceBids[newSequenceBids.length - 1];
      if (lastItem && /^[1-7]$/.test(lastItem) && /^[CDHSN]$/.test(value)) {
        newSequenceBids[newSequenceBids.length - 1] = lastItem + value;
      } else {
        newSequenceBids.push(value);
      }
    }

    // Find matching bid
    if (system && newSequenceBids.length > 0) {
      for (const bid of system.bids) {
        const bidSequence = getBidSequence(bid.id, system.bids);
        if (
          bidSequence.length === newSequenceBids.length &&
          bidSequence.every((b, i) => b.bid === newSequenceBids[i])
        ) {
          expandToNode(bid.id);
          return;
        }
      }
    }

    // No exact match found, try to find closest ancestor
    if (system && newSequenceBids.length > 0) {
      for (let len = newSequenceBids.length - 1; len > 0; len--) {
        const partial = newSequenceBids.slice(0, len);
        for (const bid of system.bids) {
          const bidSequence = getBidSequence(bid.id, system.bids);
          if (
            bidSequence.length === partial.length &&
            bidSequence.every((b, i) => b.bid === partial[i])
          ) {
            expandToNode(bid.id);
            return;
          }
        }
      }
    }
  };

  // Handle result click
  const handleResultClick = (bidId: number) => {
    expandToNode(bidId);
    // Scroll to node
    setTimeout(() => {
      const element = document.querySelector(`[data-bid-id="${bidId}"]`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  // Scroll to focused node when it changes externally
  useEffect(() => {
    if (focusedBidId !== null) {
      const element = document.querySelector(`[data-bid-id="${focusedBidId}"]`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [focusedBidId]);

  // Render colored sequence
  const renderSequence = (sequence: BidInfo[]) => {
    return sequence.map((b, i) => (
      <span key={i}>
        {i > 0 && <span className="text-muted-foreground">-</span>}
        <span className={bidderTextClass[b.by]}>{b.bid}</span>
      </span>
    ));
  };

  return (
    <Card className="sticky top-16 z-30 mx-auto mb-4 max-w-5xl p-3">
      {/* Current sequence display */}
      <div className="mb-3 flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <div className="flex-1 rounded border bg-muted/50 px-3 py-1.5 font-mono text-sm">
          {currentSequence.length > 0 ? (
            renderSequence(currentSequence)
          ) : (
            <span className="text-muted-foreground">輸入叫品序列...</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleInput("BACK")}
          disabled={currentSequence.length === 0}
        >
          <Delete className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleInput("CLEAR")}
          disabled={currentSequence.length === 0}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Quick input buttons */}
      <div className="space-y-2">
        {/* Level buttons */}
        <div className="flex gap-1">
          {LEVELS.map((level) => (
            <Button
              key={level}
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleInput(level)}
            >
              {level}
            </Button>
          ))}
        </div>

        {/* Suit buttons */}
        <div className="flex gap-1">
          {SUITS.map((suit) => (
            <Button
              key={suit.key}
              variant="outline"
              size="sm"
              className={cn("h-8 min-w-8 px-2", suit.className)}
              onClick={() => handleInput(suit.key)}
            >
              {suit.label}
            </Button>
          ))}
          <div className="w-2" />
          {SPECIAL.map((s) => (
            <Button
              key={s.key}
              variant="outline"
              size="sm"
              className="h-8 min-w-8 px-2"
              onClick={() => handleInput(s.key)}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Search results */}
      {searchResults.length > 0 && currentSequence.length > 0 && (
        <div className="mt-3 max-h-48 space-y-1 overflow-y-auto border-t pt-2">
          {searchResults.map((result) => (
            <button
              key={result.id}
              className={cn(
                "w-full rounded px-2 py-1 text-left text-sm hover:bg-accent",
                result.id === focusedBidId && "bg-accent",
              )}
              onClick={() => handleResultClick(result.id)}
            >
              <span className="font-mono text-xs">
                {renderSequence(result.sequence)}
              </span>
              <span className="ml-2 text-muted-foreground">
                {result.meaning}
              </span>
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}
