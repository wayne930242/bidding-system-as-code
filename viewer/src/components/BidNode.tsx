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

// Convention names to highlight with red/circled styling
// Longer names first to avoid partial matches (e.g. "Minor Suit Stayman" before "Stayman")
const CONVENTION_NAMES = [
  "Minor Suit Stayman",
  "Puppet Stayman",
  "RKCBlackwood",
  "RKC Blackwood",
  "Splinter跳叫",
  "Mathe問叫",
  "反常加叫",
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
  "Ogust",
  "Gerber",
  "RKC",
  "Drury",
  "Unusual",
  "DONT",
];

// Create regex pattern for convention names (case insensitive)
// Sort by length (longest first) to ensure longer matches take precedence
const sortedConventionNames = [...CONVENTION_NAMES].sort(
  (a, b) => b.length - a.length,
);
const conventionPattern = new RegExp(
  `(${sortedConventionNames.join("|")})`,
  "gi",
);

// Valid bid pattern - anything else is a remark
const validBidPattern = /^(Pass|P|X|XX|\d[CDHSN]T?)$/i;

// Format meaning text with highlighted convention names
function formatMeaning(meaning: string): ReactNode {
  const parts = meaning.split(conventionPattern);
  if (parts.length === 1) return meaning;

  return parts.map((part, index) => {
    const isConvention = sortedConventionNames.some(
      (name) => name.toLowerCase() === part.toLowerCase(),
    );
    if (isConvention) {
      return (
        <span
          key={index}
          className="mx-0.5 inline-block rounded-full bg-red-500 px-2 py-0.5 font-bold text-white"
        >
          {part}
        </span>
      );
    }
    return part;
  });
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
