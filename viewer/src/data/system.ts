// This import MUST be kept as a direct default import for Kotlin writeHtml compatibility.
// Kotlin looks for the exact string: {name:"dummy",author:"file",description:"to be replaced",nextBids:[]}
// The JSON is stringified and reparsed to prevent Vite from tree-shaking.
import inlineSystemRaw from "../../../dsl/build/system.json";
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

// Force the full JSON to be included in the bundle by stringifying it.
// This prevents tree-shaking and ensures Kotlin can find/replace the placeholder.
const inlineSystemJson = JSON.stringify(inlineSystemRaw);
const inlineSystem = JSON.parse(inlineSystemJson) as RawSystem;

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
 * Load the bidding system.
 * - If systemId is provided, fetch from /systems/{systemId}.json
 * - If the inline JSON is a placeholder (name="dummy"), fetch from /systems/{defaultSystemId}.json
 * - Otherwise, use the inline JSON (Kotlin writeHtml mode)
 */
export async function loadSystem(systemId?: string): Promise<BiddingSystem> {
  if (systemId) {
    const systemInfo = availableSystems.find((s) => s.id === systemId);
    if (!systemInfo) {
      throw new Error(`Unknown system: ${systemId}`);
    }
    const response = await fetch(systemInfo.path);
    const rawSystem = (await response.json()) as RawSystem;
    return createSystem(rawSystem);
  }

  if (inlineSystem.name === "dummy") {
    const systemInfo = availableSystems.find((s) => s.id === defaultSystemId);
    if (!systemInfo) {
      throw new Error(`Default system not found: ${defaultSystemId}`);
    }
    const response = await fetch(systemInfo.path);
    const rawSystem = (await response.json()) as RawSystem;
    return createSystem(rawSystem);
  }

  return createSystem(inlineSystem);
}
