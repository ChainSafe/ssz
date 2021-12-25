import {Tree, zeroNode} from "@chainsafe/persistent-merkle-tree/lib";
import {ContainerType} from "./container";
import {ListBasicType} from "./listBasic";
import {UintNumberType} from "./uint";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function example(): void {
  const tree = new Tree(zeroNode(0));
  const uintType = new UintNumberType(1);
  const epochPartipationType = new ListBasicType(uintType, 1e8);
  const containerType = new ContainerType({
    epochPartipation: epochPartipationType,
    slot: uintType,
  });

  const epochPartipationView = epochPartipationType.getView(tree);
  const containerView = containerType.getView(tree, false);

  containerView.epochPartipation; // Typed as 'ListBasicTreeView<UintType>'
  containerView.slot; // Typed as 'number'

  // Warm-up the cache
  for (let i = 0, len = 250_000; i < len; i++) {
    epochPartipationView.get(i);
  }

  // Simulate attestation processing
  epochPartipationView.toMutable();
  for (let i = 0, max = 250_000 / 32; i < max; i++) {
    let flags = epochPartipationView.get(i);
    flags |= 3;
    epochPartipationView.set(i, flags);
  }
  epochPartipationView.commit();
}
