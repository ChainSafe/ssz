import {expect} from "chai";

describe("Dynamic constructor", () => {
  class ContainerTreeView {
    getNode(index: number): number {
      return index;
    }
  }

  function getCustomContainerTreeView(
    typeName: string,
    keys: string[]
  ): {
    new (): ContainerTreeView & Record<string, number>;
  } {
    // prototype inheritance from ContainerTreeView
    class CustomContainerTreeView extends ContainerTreeView {}

    // Dynamically define prototype methods
    for (let i = 0; i < keys.length; i++) {
      Object.defineProperty(CustomContainerTreeView.prototype, keys[i], {
        get: function () {
          return (this as ContainerTreeView).getNode(i);
        },
      });
    }

    // Change class name
    Object.defineProperty(CustomContainerTreeView, "name", {value: typeName, writable: false});

    return CustomContainerTreeView as {
      new (): ContainerTreeView & Record<string, number>;
    };
  }

  it("test", () => {
    const StateView = getCustomContainerTreeView("StateView", ["slot", "genesisTime"]);
    const stateView = new StateView();

    expect(stateView.slot).to.equal(0, "Wrong stateView.slot value");
    expect(stateView.genesisTime).to.equal(1, "Wrong stateView.genesisTime value");

    const ValidatorView = getCustomContainerTreeView("ValidatorView", ["slashed", "epoch"]);
    const validatorView = new ValidatorView();

    expect(validatorView.slashed).to.equal(0, "Wrong validatorView.slot value");
    expect(validatorView.epoch).to.equal(1, "Wrong validatorView.genesisTime value");
    // Should not be defined, part of StateTreeView prototype only
    expect(validatorView.slot).to.equal(undefined, "Wrong validatorView.slot value");
    expect(validatorView.genesisTime).to.equal(undefined, "Wrong validatorView.genesisTime value");
  });
});
