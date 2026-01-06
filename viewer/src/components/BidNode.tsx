import { useMemo, useCallback, type ReactNode } from "react";
import { marked } from "marked";
import { ChevronDown, ChevronUp, Info, List, ChevronsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { useBidStore } from "@/store/bidStore";
import { cn } from "@/lib/utils";
import type { Bidder } from "@/types/bid";

// Convention names to highlight with red badge
// Longer names first to avoid partial matches (e.g. "Minor Suit Stayman" before "Stayman")
const CONVENTION_NAMES = [
  "Jacoby轉換叫",
  "Texas轉換叫",
  "Inverted Minors",
  "Minor Suit Stayman",
  "Puppet Stayman",
  "低花Stayman",
  "迫叫性無王",
  "反常低花加叫",
  "轉換叫",
  "RKCBlackwood",
  "RKC Blackwood",
  "Schreiber跳叫",
  "Splinter跳叫",
  "Mathe問叫",
  "Ogust問叫",
  "反常加叫",
  "選擇定約",
  "Stayman",
  "Jacoby",
  "Texas",
  "Lebensohl",
  "Feldman",
  "Walsh",
  "Schreiber",
  "Blackwood",
  "Swiss",
  "Michaels",
  "Namyats",
  "問低花",
  "問高花",
  "Ogust",
  "Gerber",
  "RKC",
  "Drury",
  "Unusual",
  "DONT",
];

// Key terms to highlight with different styling (not conventions)
// Use regex patterns for more precise matching
const KEY_TERM_PATTERNS = [
  /(?<!形同)倒叫(?!但不需)/g, // "倒叫" but not "形同倒叫" or "倒叫但不需"
];

// Create regex pattern for convention names
const sortedConventionNames = [...CONVENTION_NAMES].sort(
  (a, b) => b.length - a.length,
);
const conventionPattern = new RegExp(
  `(${sortedConventionNames.join("|")})`,
  "gi",
);

// Valid bid pattern - anything else is a remark
// Includes M (major), m (minor), any (any suit) as generic patterns
const validBidPattern = /^(Pass|P|X|XX|\d[CDHSNMm]T?|\dany)$/i;

// Format meaning text with highlighted terms
function formatMeaning(meaning: string): ReactNode {
  // First, handle key terms with special patterns
  let processed = meaning;
  const keyTermMatches: { start: number; end: number; text: string }[] = [];

  for (const pattern of KEY_TERM_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;
    while ((match = regex.exec(meaning)) !== null) {
      keyTermMatches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
      });
    }
  }

  // Split by convention pattern
  const parts = processed.split(conventionPattern);
  if (parts.length === 1 && keyTermMatches.length === 0) return meaning;

  // Build result with both convention and key term highlighting
  const result: ReactNode[] = [];
  let currentIndex = 0;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const isConvention = sortedConventionNames.some(
      (name) => name.toLowerCase() === part.toLowerCase(),
    );

    if (isConvention) {
      result.push(
        <span
          key={`conv-${i}`}
          className="mx-0.5 inline-block rounded-full bg-red-500 px-2 py-0.5 font-bold text-white"
        >
          {part}
        </span>,
      );
    } else {
      // Check for key terms within this part
      const partStart = meaning.indexOf(part, currentIndex);
      const partEnd = partStart + part.length;
      const relevantKeyTerms = keyTermMatches.filter(
        (m) => m.start >= partStart && m.end <= partEnd,
      );

      if (relevantKeyTerms.length === 0) {
        result.push(part);
      } else {
        // Split this part by key terms
        let lastEnd = 0;
        const localStart = partStart;
        for (const match of relevantKeyTerms) {
          const relStart = match.start - localStart;
          const relEnd = match.end - localStart;
          if (relStart > lastEnd) {
            result.push(part.slice(lastEnd, relStart));
          }
          result.push(
            <span
              key={`key-${match.start}`}
              className="mx-0.5 inline-block rounded-full bg-blue-500 px-2 py-0.5 font-bold text-white"
            >
              {match.text}
            </span>,
          );
          lastEnd = relEnd;
        }
        if (lastEnd < part.length) {
          result.push(part.slice(lastEnd));
        }
      }
    }
    currentIndex += part.length;
  }

  return result;
}

const bidderBgClass: Record<Bidder, string> = {
  N: "bg-[--color-bidder-north]",
  S: "bg-[--color-bidder-south]",
  E: "bg-[--color-bidder-east]",
  W: "bg-[--color-bidder-west]",
};

interface BidNodeProps {
  bidId: number;
  depth: number;
}

export function BidNode({ bidId, depth }: BidNodeProps) {
  const system = useBidStore((state) => state.system);
  const isCollapsed = useBidStore((state) => state.isNodeCollapsed(bidId));
  const isExplanationVisible = useBidStore((state) =>
    state.isExplanationVisible(bidId),
  );
  const focusedBidId = useBidStore((state) => state.focusedBidId);
  const toggleCollapse = useBidStore((state) => state.toggleCollapse);
  const toggleExplanation = useBidStore((state) => state.toggleExplanation);
  const setFocusedBid = useBidStore((state) => state.setFocusedBid);
  const openDialog = useBidStore((state) => state.openDialog);
  const hideNodesBefore = useBidStore((state) => state.hideNodesBefore);
  const showAllChildren = useBidStore((state) => state.showAllChildren);
  const hiddenRanges = useBidStore((state) => state.hiddenRanges);
  const getHiddenChildrenText = useBidStore(
    (state) => state.getHiddenChildrenText,
  );

  const bid = system?.bids[bidId];

  const explanation = bid?.explanation ?? "";
  const explanationHtml = useMemo(() => {
    if (!explanation) return "";
    return marked.parse(explanation) as string;
  }, [explanation]);

  const handleToggleCollapse = useCallback(() => {
    // Always update focused bid when clicking on a row
    setFocusedBid(bidId);

    if (bid?.nextBids.length) {
      toggleCollapse(bidId);
    } else if (bid?.explanation) {
      toggleExplanation(bidId);
    }
  }, [bid, bidId, toggleCollapse, toggleExplanation, setFocusedBid]);

  const handleToggleSiblings = useCallback(() => {
    if (!bid || bid.ancestors.length === 0) return;
    const parentId = bid.ancestors[bid.ancestors.length - 1];
    const currentRange = hiddenRanges.get(parentId);
    if (currentRange && currentRange.beforeId === bidId) {
      // Already hidden at this point, so show all
      showAllChildren(parentId);
    } else {
      // Hide siblings before this bid
      hideNodesBefore(parentId, bidId);
    }
  }, [bid, bidId, hideNodesBefore, showAllChildren, hiddenRanges]);

  if (!bid) return null;

  const hasChildren = bid.nextBids.length > 0;
  const hasExplanation = !!bid.explanation;
  const isOpponent = bid.by === "E" || bid.by === "W";
  const isRemark = !validBidPattern.test(bid.bid);
  const displayBid = isOpponent ? `(${bid.bid})` : bid.bid;

  // Check if this node should show hidden children indicator
  const hiddenChildrenText = getHiddenChildrenText(bidId);

  // Check if this node has elder siblings (to show hide button)
  const hasElderSiblings =
    !bid.isRoot &&
    bid.ancestors.length > 0 &&
    (() => {
      const parentId = bid.ancestors[bid.ancestors.length - 1];
      const parent = system?.bids[parentId];
      return parent && parent.nextBids[0] !== bidId;
    })();

  // Check if this node is hidden due to parent's hidden range
  const parentId =
    bid.ancestors.length > 0
      ? bid.ancestors[bid.ancestors.length - 1]
      : undefined;
  const hiddenRange =
    parentId !== undefined ? hiddenRanges.get(parentId) : undefined;
  const isHiddenByParent = hiddenRange && bidId < hiddenRange.beforeId;

  if (isHiddenByParent) return null;

  const isFocused = focusedBidId === bidId;

  return (
    <div className="flex flex-col" data-bid-id={bidId}>
      {/* Main row */}
      <div
        className={cn(
          "group flex min-h-[40px] cursor-pointer items-center rounded-sm transition-colors hover:bg-accent/50",
          !isRemark && bidderBgClass[bid.by],
          isRemark && "bg-muted italic",
          isFocused && "ring-2 ring-primary ring-offset-1",
        )}
        style={{ paddingLeft: `${depth * 24 + 8}px` }}
        onClick={handleToggleCollapse}
      >
        {/* Toggle icon */}
        <div className="flex w-6 items-center justify-center">
          {hasChildren && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleCollapse();
              }}
            >
              {isCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        {/* Bid content */}
        <div className="flex flex-1 items-center gap-2 py-1">
          {bid.previousBids ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-medium">{displayBid}</span>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{bid.previousBids}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <span className="font-medium">{displayBid}</span>
          )}
          {bid.meaning && (
            <span className="text-muted-foreground">
              - {formatMeaning(bid.meaning)}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 pr-2 opacity-0 transition-opacity group-hover:opacity-100">
          {hasExplanation && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExplanation(bidId);
                  }}
                >
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Explanation</TooltipContent>
            </Tooltip>
          )}

          {hasElderSiblings && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleSiblings();
                  }}
                >
                  <ChevronsUp className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Lower Bids</TooltipContent>
            </Tooltip>
          )}

          {!bid.isRoot && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDialog(bidId);
                  }}
                >
                  <List className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Show Full Sequence</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Hidden children indicator */}
      {hiddenChildrenText && (
        <button
          className="mt-1 rounded bg-amber-100 px-2 py-1 text-left text-xs text-amber-800 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-100 dark:hover:bg-amber-800"
          style={{ marginLeft: `${depth * 24 + 32}px` }}
          onClick={(e) => {
            e.stopPropagation();
            showAllChildren(bidId);
          }}
        >
          ▸ 展開隱藏的叫品: {hiddenChildrenText}
        </button>
      )}

      {/* Explanation */}
      <Collapsible open={isExplanationVisible}>
        <CollapsibleContent>
          <div
            className="prose prose-sm dark:prose-invert ml-8 rounded border bg-card p-4"
            style={{ marginLeft: `${depth * 24 + 32}px` }}
            dangerouslySetInnerHTML={{ __html: explanationHtml }}
          />
        </CollapsibleContent>
      </Collapsible>

      {/* Children */}
      {hasChildren && !isCollapsed && (
        <div className="flex flex-col">
          {bid.nextBids.map((childId) => (
            <BidNode key={childId} bidId={childId} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
