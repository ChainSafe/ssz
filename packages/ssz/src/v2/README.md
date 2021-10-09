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
