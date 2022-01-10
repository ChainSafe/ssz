import {Tree, zeroNode} from "@chainsafe/persistent-merkle-tree/lib";
import {ContainerType} from "./container";
import {ListBasicType} from "./listBasic";
import {UintNumberType} from "./uint";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function exampleTreeView(): void {
  const tree = new Tree(zeroNode(0));
  const uintType = new UintNumberType(1);
  const epochPartipationType = new ListBasicType(uintType, 1e8);
  const containerType = new ContainerType({
    epochPartipation: epochPartipationType,
    slot: uintType,
  });

  const epochPartipationView = epochPartipationType.getView(tree);
  const containerView = containerType.getView(tree);

  containerView.epochPartipation; // Typed as 'ListBasicTreeView<UintType>'
  containerView.slot; // Typed as 'number'

  containerView.epochPartipation = epochPartipationType.toView([1, 2]);

  // Simulate attestation processing
  for (let i = 0, max = 250_000 / 32; i < max; i++) {
    let flags = epochPartipationView.get(i);
    flags |= 3;
    epochPartipationView.set(i, flags);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function exampleTreeViewDU(): void {
  const tree = new Tree(zeroNode(0));
  const uintType = new UintNumberType(1);
  const epochPartipationType = new ListBasicType(uintType, 1e8);
  const containerType = new ContainerType({
    epochPartipation: epochPartipationType,
    slot: uintType,
  });

  const containerView = containerType.getViewDU(tree.rootNode, undefined);
  const epochPartipationView = containerView.epochPartipation;

  containerView.epochPartipation; // Typed as 'ListBasicTreeViewDU<UintType>'
  containerView.slot; // Typed as 'number'

  containerView.epochPartipation = epochPartipationType.toViewDU([1, 2]);

  // Warm-up the cache
  epochPartipationView.getAll();

  // Simulate attestation processing
  for (let i = 0, max = 250_000 / 32; i < max; i++) {
    let flags = epochPartipationView.get(i);
    flags |= 3;
    epochPartipationView.set(i, flags);
  }

  containerView.commit();
}
