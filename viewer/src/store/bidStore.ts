import { create } from "zustand";
import type { BiddingSystem } from "@/types/bid";

interface HiddenRange {
  parentId: number;
  beforeId: number;
}

interface BidState {
  // Data
  system: BiddingSystem | null;

  // UI State
  collapsedNodes: Set<number>;
  hiddenRanges: Map<number, HiddenRange>; // parentId -> { parentId, beforeId }
  showExplanations: Set<number>;
  dialogBidId: number | null;

  // Actions
  setSystem: (system: BiddingSystem) => void;
  toggleCollapse: (id: number) => void;
  toggleExplanation: (id: number) => void;
  expandAll: () => void;
  collapseAll: () => void;
  hideNodesBefore: (parentId: number, beforeId: number) => void;
  showAllChildren: (parentId: number) => void;
  openDialog: (bidId: number) => void;
  closeDialog: () => void;

  // Helpers
  isNodeVisible: (id: number) => boolean;
  isNodeCollapsed: (id: number) => boolean;
  isExplanationVisible: (id: number) => boolean;
  getHiddenChildrenText: (parentId: number) => string | null;
}

export const useBidStore = create<BidState>((set, get) => ({
  // Data
  system: null,

  // UI State - start with all nodes collapsed (only roots visible)
  collapsedNodes: new Set<number>(),
  hiddenRanges: new Map<number, HiddenRange>(),
  showExplanations: new Set<number>(),
  dialogBidId: null,

  // Actions
  setSystem: (system) => {
    // Initialize all non-root nodes as collapsed
    const collapsed = new Set<number>();
    system.bids.forEach((bid) => {
      if (bid.nextBids.length > 0) {
        collapsed.add(bid.id);
      }
    });
    set({ system, collapsedNodes: collapsed });
  },

  toggleCollapse: (id) =>
    set((state) => {
      const newSet = new Set(state.collapsedNodes);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return { collapsedNodes: newSet };
    }),

  toggleExplanation: (id) =>
    set((state) => {
      const newSet = new Set(state.showExplanations);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return { showExplanations: newSet };
    }),

  expandAll: () =>
    set({
      collapsedNodes: new Set<number>(),
      showExplanations: new Set(
        get()
          .system?.bids.filter((b) => b.explanation)
          .map((b) => b.id) ?? [],
      ),
      hiddenRanges: new Map(),
    }),

  collapseAll: () =>
    set((state) => {
      const collapsed = new Set<number>();
      state.system?.bids.forEach((bid) => {
        if (bid.nextBids.length > 0) {
          collapsed.add(bid.id);
        }
      });
      return {
        collapsedNodes: collapsed,
        showExplanations: new Set<number>(),
        hiddenRanges: new Map(),
      };
    }),

  hideNodesBefore: (parentId, beforeId) =>
    set((state) => {
      const newRanges = new Map(state.hiddenRanges);
      newRanges.set(parentId, { parentId, beforeId });
      return { hiddenRanges: newRanges };
    }),

  showAllChildren: (parentId) =>
    set((state) => {
      const newRanges = new Map(state.hiddenRanges);
      newRanges.delete(parentId);
      return { hiddenRanges: newRanges };
    }),

  openDialog: (bidId) => set({ dialogBidId: bidId }),
  closeDialog: () => set({ dialogBidId: null }),

  // Helpers
  isNodeVisible: (id) => {
    const state = get();
    const bid = state.system?.bids[id];
    if (!bid) return false;
    if (bid.isRoot) return true;

    // Check if any ancestor is collapsed
    for (const ancestorId of bid.ancestors) {
      if (state.collapsedNodes.has(ancestorId)) {
        return false;
      }
    }

    // Check if hidden by parent's hidden range
    if (bid.ancestors.length > 0) {
      const parentId = bid.ancestors[bid.ancestors.length - 1];
      const hiddenRange = state.hiddenRanges.get(parentId);
      if (hiddenRange && id < hiddenRange.beforeId) {
        return false;
      }
    }

    return true;
  },

  isNodeCollapsed: (id) => get().collapsedNodes.has(id),

  isExplanationVisible: (id) => get().showExplanations.has(id),

  getHiddenChildrenText: (parentId) => {
    const state = get();
    const hiddenRange = state.hiddenRanges.get(parentId);
    if (!hiddenRange) return null;

    const parent = state.system?.bids[parentId];
    if (!parent) return null;

    const hiddenBids = parent.nextBids
      .filter((childId) => childId < hiddenRange.beforeId)
      .map((childId) => {
        const bid = state.system?.bids[childId];
        if (!bid) return "";
        return bid.by === "E" || bid.by === "W" ? `(${bid.bid})` : bid.bid;
      });

    if (hiddenBids.length === 0) return null;

    const text = hiddenBids.join(", ");
    return text.length > 100 ? text.substring(0, 100) + "..." : text;
  },
}));
