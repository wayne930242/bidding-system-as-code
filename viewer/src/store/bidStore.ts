import { create } from "zustand";
import type { BiddingSystem } from "@/types/bid";
import {
  loadSystem,
  availableSystems,
  defaultSystemId,
  type SystemInfo,
} from "@/data/system";

interface HiddenRange {
  parentId: number;
  beforeId: number;
}

interface BidState {
  // Data
  system: BiddingSystem | null;
  currentSystemId: string;
  availableSystems: SystemInfo[];
  isLoading: boolean;

  // UI State
  collapsedNodes: Set<number>;
  hiddenRanges: Map<number, HiddenRange>; // parentId -> { parentId, beforeId }
  showExplanations: Set<number>;
  dialogBidId: number | null;
  focusedBidId: number | null; // Currently focused bid for quick search sync

  // Actions
  setSystem: (system: BiddingSystem) => void;
  switchSystem: (systemId: string) => Promise<void>;
  toggleCollapse: (id: number) => void;
  toggleExplanation: (id: number) => void;
  hideNodesBefore: (parentId: number, beforeId: number) => void;
  showAllChildren: (parentId: number) => void;
  expandToNode: (bidId: number) => void;
  setFocusedBid: (bidId: number | null) => void;
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
  currentSystemId: defaultSystemId,
  availableSystems,
  isLoading: false,

  // UI State - start with all nodes collapsed (only roots visible)
  collapsedNodes: new Set<number>(),
  hiddenRanges: new Map<number, HiddenRange>(),
  showExplanations: new Set<number>(),
  dialogBidId: null,
  focusedBidId: null,

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

  switchSystem: async (systemId) => {
    if (systemId === get().currentSystemId) return;
    set({ isLoading: true });
    try {
      const system = await loadSystem(systemId);
      const collapsed = new Set<number>();
      system.bids.forEach((bid) => {
        if (bid.nextBids.length > 0) {
          collapsed.add(bid.id);
        }
      });
      set({
        system,
        currentSystemId: systemId,
        collapsedNodes: collapsed,
        hiddenRanges: new Map(),
        showExplanations: new Set(),
        dialogBidId: null,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to load system:", error);
      set({ isLoading: false });
    }
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

  expandToNode: (bidId) =>
    set((state) => {
      const bid = state.system?.bids[bidId];
      if (!bid) return {};

      // Expand all ancestors
      const newCollapsed = new Set(state.collapsedNodes);
      for (const ancestorId of bid.ancestors) {
        newCollapsed.delete(ancestorId);
      }

      // Clear hidden ranges that would hide this node
      const newRanges = new Map(state.hiddenRanges);
      if (bid.ancestors.length > 0) {
        const parentId = bid.ancestors[bid.ancestors.length - 1];
        const hiddenRange = newRanges.get(parentId);
        if (hiddenRange && bidId < hiddenRange.beforeId) {
          newRanges.delete(parentId);
        }
      }

      return {
        collapsedNodes: newCollapsed,
        hiddenRanges: newRanges,
        focusedBidId: bidId,
      };
    }),

  setFocusedBid: (bidId) => set({ focusedBidId: bidId }),

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
