export type Bidder = "N" | "S" | "E" | "W";

export interface Bid {
  id: number;
  bid: string;
  by: Bidder;
  meaning: string;
  explanation: string;
  ancestors: number[];
  previousBids: string;
  nextBids: number[];
  isRoot: boolean;
  treeEnd: number;
}

export interface BiddingSystem {
  name: string;
  author: string;
  description: string;
  bids: readonly Bid[];
  rootIds: number[];
}
