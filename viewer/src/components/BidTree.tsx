import { useBidStore } from "@/store/bidStore";
import { BidNode } from "@/components/BidNode";

export function BidTree() {
  const system = useBidStore((state) => state.system);

  if (!system) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading bidding system...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex flex-col">
        {system.rootIds.map((id) => (
          <BidNode key={id} bidId={id} depth={0} />
        ))}
      </div>
    </div>
  );
}
