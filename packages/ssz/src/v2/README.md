Basic types:

- uintN
- boolean

Composite types:

- container
- vector
- list
- bitvector
- bitlist
- union

Specialized types

- arrayBasic
- arrayComposite
- listAbstract
- vectorAbstract
- listBasic = listAbstract + arrayBasic
- listComposite = listAbstract + arrayComposite
- vectorBasic = vectorAbstract + arrayBasic
- vectorComposite = = vectorAbstract + arrayComposite

**Goals**

- Fast epoch and block transitions require very fast manipulation of a TreeBacked BeaconState.
- Attester objects from gossip must be deserialized fast to struct and serialized at ok speeds for broadcasting

```
 ___      ___  _______
|\  \    /  /|/  ___  \
\ \  \  /  / /__/|_/  /|
 \ \  \/  / /|__|//  / /
  \ \    / /     /  /_/__
   \ \__/ /     |\________\
    \|__|/       \|_______|

```

# Goals:

- Correctness:
  - Pas
- Performance:
  - Fast deserialization: State to tree, else to struct
  - Fast merkleization
  - Root caching
  - Fast tree-views, reads, edits, navigation
- Memory efficiency:
  - State to tree, else to struct
- Good abstractions:
  - Don't leak internal details (hash objects) to consumers
- Type safety

# Tree view behaviour

```ts
const container1 = toTreeView({a: [0, 0]});
const container2 = toTreeView({a: [1, 1]});

container1.a = container2.a;

// Should this statement mutate container2 data?
container1.a[0] = 2;
// Should this statement mutate container1 data?
container2.a[0] = 2;
```

**Case 2**

```ts
const container1 = toTreeView({a: [0, 0]});
const container2 = toTreeView({a: [1, 1]});

const a = container2.a;
container1.a = a;

// Should this statement mutate container1, container2 or none?
a[0] = 2;
```

- mutate container2 only
- f one want to modify container1: `container1.a[0] = 2`
