# ssz
[![Build Status](https://travis-ci.com/ChainSafe/lodestar.svg?branch=master)](https://travis-ci.com/ChainSafe/lodestar)

Simple Serialize (SSZ) - [An ETH2 standard implementation](https://github.com/ethereum/eth2.0-specs/blob/dev/ssz/simple-serialize.md) as a Js package for defining, serializating / deserializating object schemas.

## Summary
SSZ is a type system allows you to define object schemas which allow for efficient serialization / deserialization, stable merkleization with a default constructor for all types.

Additionally, schemas allow for:
* equality
* valid value assertion
* copy / clone
* serialized byte length (for serialization)
* chunk count (for merkleization)

## Install

`npm install @chainsafe/ssz`

## Usage

```TS
import {ContainerType, ByteVectorType} from "@chainsafe/ssz";

// Creates a Keypair SSZ data type (a private key of 32 bytes, a public key of 48 bytes)
const Keypair = new ContainerType({
  fields: {
    priv: new ByteVectorType({
      length: 32,
    }),
    pub: new ByteVectorType({
      length: 48,
    }),
  }
});

// You may want a corresponding typescript interface for Keypair
import {ByteVector} from "@chainsafe/ssz";
interface Keypair {
  priv: ByteVector;
  pub: ByteVector;
}

// Now you can perform different operations on Keypair objects

const kp = Keypair.defaultValue(); // Create a default Keypair

kp.priv; // => Uint8Array [0,0,0,...], length 32
kp.pub; // => Uint8Array [0,0,0, ...], length 48

const serialized: Uint8Array = Keypair.serialize(kp); // serialize the object to a byte array
const root: Uint8Array = Keypair.hashTreeRoot(kp); // get the merkle root of the object
const isEqual: boolean = Keypair.equals(kp, kp); // check equality between two keypairs
const kp2: Keypair = Keypair.clone(kp); // create a copy of the object
const kp3: Keypair = Keypair.deserialize(serialized); // deserialize a serialized object
const jsonKp = Keypair.toJson(kp); // convert the object to a json-serializable representation (binary data is converted to hex strings)
JSON.stringify(jsonKp);
Keypair.fromJson(jsonKp); // convert the json-serializable representation to the object
```

### ETH2 Objects

[Lodestar-types](https://www.npmjs.com/package/@chainsafe/lodestar-types) has a premade collection of ETH2 schemas (eg: BeaconBlock, DepositData, BeaconState, etc), simply add @chainsafe/lodestar-types to your project.

```TS
// we provide preset mainnet and minimal eth2 types
// This toggle-ability is because ssz types rely on the eth2 network parameters set in @chainsafe/lodestar-params
import {types as mainnetTypes} from "@chainsafe/lodestar-types/lib/ssz/presets/mainnet";

// `mainnetTypes` is of type IBeaconSSZTypes, an object of ssz types
import {IBeaconSSZTypes} from "@chainsafe/lodestar-types";

// Typescript interfaces can be imported as well
import {DepositData} from "@chainsafe/lodestar-types";

const d: DepositData = mainnetTypes.DepositData.defaultValue();
```

## Additional notes
### Backings
This library operates on values of several kinds of 'backings', or underlying representations of data. Each backing has runtime tradeoffs for the above operations that arise from the nature of the underlying representation. 

Effort has been made to minimize the differences between backings for the core API, which includes the above operations, property getter/setters, and iteration (value iteration for vectors/lists and enumerable key iteration for containers).

We support the following backings, which correspond to the core operations of serialization and merkleization:

* Structural - This backing has a native javascript type representation. 

Containers are constructed as js Objects, vectors and lists as Arrays (or TypedArrays) Within operations, property access is performed using js getter notation, with gets corresponding to the structure of the value's type. Because structural non-constructor operations do not assume the underlying representation of values, all backings can be operated on in this context.

* Tree - This backing has an immutable merkle tree representation. 

The data is always represented as a tree, and within operations, the tree structure is harnessed as much as possible. Property getters return subtrees except for basic types, when the native value corresponding th that type is returned. Values backed by a tree are wrapped in an ES6 Proxy object to provide a convenient, 'structural' interface for property getters/setters.

* ByteArray - This backing has a byte array representation.

The data is always represented as a Uint8Array, and within operations, the serialized structure is harnessed as much as possible. Property getters return sub-arrays except for basic types, when the native value corresponding to that type is returned. Values backed by an array are wrapped in an ES6 Proxy object to provide a convenient, 'structural' interface for property getters/setters.

## License

Apache 2.0
