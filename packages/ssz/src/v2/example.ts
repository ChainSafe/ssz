import {Tree} from "@chainsafe/persistent-merkle-tree/lib";
import {ContainerType} from "./container";
import {ListBasicType} from "./list";
import {UintType} from "./uint";

function example(): void {
  const tree = new Tree({} as any);
  const uintType = new UintType(1);
  const epochPartipationType = new ListBasicType(uintType, 1e8);
  const containerType = new ContainerType({
    epochPartipation: epochPartipationType,
    slot: uintType,
  });

  const epochPartipationView = epochPartipationType.getView(tree);
  const containerView = containerType.getView(tree);

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
