import type { Bid, BiddingSystem, Bidder } from "@/types/bid";

export interface SystemInfo {
  id: string;
  name: string;
  path: string;
}

export const availableSystems: SystemInfo[] = [
  { id: "2over1", name: "二蓋一進局體系", path: "/systems/2over1.json" },
  { id: "fantunes", name: "Fantoni-Nunes", path: "/systems/fantunes.json" },
];

export const defaultSystemId = "2over1";

interface RawBid {
  bid: string;
  by: string;
  meaning: string;
  explanation?: string;
  nextBids?: RawBid[];
}

interface RawSystem {
  name: string;
  author: string;
  description: string;
  nextBids: RawBid[];
}

function formatPreviousBids(bids: Bid[], ancestors: number[]): string {
  return ancestors
    .map((id) => {
      const bid = bids[id];
      return bid.by === "E" || bid.by === "W" ? `(${bid.bid})` : bid.bid;
    })
    .join(" - ");
}

function convertBids(rawSystem: RawSystem): { bids: Bid[]; rootIds: number[] } {
  const bids: Bid[] = [];
  let bidId = 0;

  function processBid(raw: RawBid, ancestors: number[]): number {
    const currentId = bidId++;
    const bid: Bid = {
      id: currentId,
      bid: raw.bid,
      by: raw.by as Bidder,
      meaning: raw.meaning,
      explanation: raw.explanation ?? "",
      ancestors,
      previousBids: formatPreviousBids(bids, ancestors),
      nextBids: [],
      isRoot: ancestors.length === 0,
      treeEnd: 0,
    };
    bids.push(bid);

    if (raw.nextBids && raw.nextBids.length > 0) {
      bid.nextBids = raw.nextBids.map((child) =>
        processBid(child, [...ancestors, currentId]),
      );
    }

    bid.treeEnd = bidId;
    return currentId;
  }

  const rootIds = rawSystem.nextBids.map((raw) => processBid(raw, []));

  return { bids, rootIds };
}

function createSystem(rawSystem: RawSystem): BiddingSystem {
  const { bids, rootIds } = convertBids(rawSystem);

  return {
    name: rawSystem.name,
    author: rawSystem.author,
    description: rawSystem.description,
    bids: Object.freeze(bids),
    rootIds,
  };
}

/**
 * Load the bidding system from /systems/{systemId}.json
 */
export async function loadSystem(systemId?: string): Promise<BiddingSystem> {
  const id = systemId ?? defaultSystemId;
  const systemInfo = availableSystems.find((s) => s.id === id);
  if (!systemInfo) {
    throw new Error(`Unknown system: ${id}`);
  }
  const response = await fetch(systemInfo.path);
  const rawSystem = (await response.json()) as RawSystem;
  return createSystem(rawSystem);
}
