(module
 (type $i32_=>_none (func (param i32)))
 (type $none_=>_none (func))
 (type $i32_i32_i32_=>_none (func (param i32 i32 i32)))
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (type $i32_i32_=>_i32 (func (param i32 i32) (result i32)))
 (type $i32_i32_=>_none (func (param i32 i32)))
 (type $i32_i32_i32_i32_=>_none (func (param i32 i32 i32 i32)))
 (type $none_=>_i32 (func (result i32)))
 (type $i32_i32_i32_=>_i32 (func (param i32 i32 i32) (result i32)))
 (type $i32_i32_i32_i32_i32_=>_i32 (func (param i32 i32 i32 i32 i32) (result i32)))
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
 (memory $0 1)
 (data (i32.const 16) "\1c\00\00\00\01\00\00\00\01\00\00\00\1c\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00l\00e\00n\00g\00t\00h")
 (data (i32.const 64) "&\00\00\00\01\00\00\00\01\00\00\00&\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00b\00u\00f\00f\00e\00r\00.\00t\00s")
 (data (i32.const 128) "0\00\00\00\01\00\00\00\01\00\00\000\00\00\00C\00h\00a\00C\00h\00a\00:\00 \00c\00o\00u\00n\00t\00e\00r\00 \00o\00v\00e\00r\00f\00l\00o\00w")
 (data (i32.const 192) "(\00\00\00\01\00\00\00\01\00\00\00(\00\00\00a\00s\00s\00e\00m\00b\00l\00y\00/\00c\00h\00a\00c\00h\00a\002\000\00.\00t\00s")
 (data (i32.const 256) "$\00\00\00\01\00\00\00\01\00\00\00$\00\00\00I\00n\00d\00e\00x\00 \00o\00u\00t\00 \00o\00f\00 \00r\00a\00n\00g\00e")
 (data (i32.const 320) "$\00\00\00\01\00\00\00\01\00\00\00$\00\00\00~\00l\00i\00b\00/\00t\00y\00p\00e\00d\00a\00r\00r\00a\00y\00.\00t\00s")
 (data (i32.const 384) "*\00\00\00\01\00\00\00\01\00\00\00*\00\00\00P\00o\00l\00y\001\003\000\005\00 \00w\00a\00s\00 \00f\00i\00n\00i\00s\00h\00e\00d")
 (data (i32.const 448) "(\00\00\00\01\00\00\00\01\00\00\00(\00\00\00a\00s\00s\00e\00m\00b\00l\00y\00/\00p\00o\00l\00y\001\003\000\005\00.\00t\00s")
 (global $~lib/rt/stub/startOffset (mut i32) (i32.const 0))
 (global $~lib/rt/stub/offset (mut i32) (i32.const 0))
 (global $assembly/poly1305/polyArr (mut i32) (i32.const 0))
 (global $assembly/poly1305/keyArr (mut i32) (i32.const 0))
 (global $assembly/poly1305/inputArr (mut i32) (i32.const 0))
 (global $assembly/poly1305/outputArr (mut i32) (i32.const 0))
 (global $assembly/poly1305/debugArr (mut i32) (i32.const 0))
 (global $assembly/poly1305/debug (mut i32) (i32.const 0))
 (global $assembly/poly1305/_buffer (mut i32) (i32.const 0))
 (global $assembly/poly1305/_r (mut i32) (i32.const 0))
 (global $assembly/poly1305/_h (mut i32) (i32.const 0))
 (global $assembly/poly1305/_pad (mut i32) (i32.const 0))
 (global $assembly/poly1305/_leftover (mut i32) (i32.const 0))
 (global $assembly/poly1305/_fin (mut i32) (i32.const 0))
 (global $assembly/poly1305/_finished (mut i32) (i32.const 0))
 (global $assembly/chacha20/CHACHA20_INPUT_LENGTH i32 (i32.const 512))
 (global $assembly/chacha20/CHACHA20_KEY_LENGTH i32 (i32.const 32))
 (global $assembly/chacha20/CHACHA20_COUNTER_LENGTH i32 (i32.const 16))
 (global $assembly/chacha20/chacha20Input (mut i32) (i32.const 0))
 (global $assembly/chacha20/chacha20InputPtr (mut i32) (i32.const 0))
 (global $assembly/chacha20/chacha20Key (mut i32) (i32.const 0))
 (global $assembly/chacha20/chacha20KeyPtr (mut i32) (i32.const 0))
 (global $assembly/chacha20/chacha20Counter (mut i32) (i32.const 0))
 (global $assembly/chacha20/chacha20CounterPtr (mut i32) (i32.const 0))
 (global $assembly/chacha20/chacha20Output (mut i32) (i32.const 0))
 (global $assembly/chacha20/chacha20OutputPtr (mut i32) (i32.const 0))
 (global $assembly/chacha20/block (mut i32) (i32.const 0))
 (global $assembly/chacha20/blockPtr (mut i32) (i32.const 0))
 (global $assembly/index/poly1305Input (mut i32) (i32.const 0))
 (global $assembly/index/poly1305Key (mut i32) (i32.const 0))
 (global $assembly/index/poly1305Output (mut i32) (i32.const 0))
 (export "memory" (memory $0))
 (export "poly1305Input" (global $assembly/index/poly1305Input))
 (export "poly1305Key" (global $assembly/index/poly1305Key))
 (export "poly1305Output" (global $assembly/index/poly1305Output))
 (export "CHACHA20_INPUT_LENGTH" (global $assembly/chacha20/CHACHA20_INPUT_LENGTH))
 (export "CHACHA20_KEY_LENGTH" (global $assembly/chacha20/CHACHA20_KEY_LENGTH))
 (export "CHACHA20_COUNTER_LENGTH" (global $assembly/chacha20/CHACHA20_COUNTER_LENGTH))
 (export "chacha20Input" (global $assembly/chacha20/chacha20Input))
 (export "chacha20Key" (global $assembly/chacha20/chacha20Key))
 (export "chacha20Counter" (global $assembly/chacha20/chacha20Counter))
 (export "chacha20Output" (global $assembly/chacha20/chacha20Output))
 (export "chacha20StreamXORUpdate" (func $assembly/chacha20/chacha20StreamXORUpdate))
 (export "poly1305Init" (func $assembly/poly1305/poly1305Init))
 (export "poly1305Update" (func $assembly/poly1305/poly1305Update))
 (export "poly1305Digest" (func $assembly/poly1305/poly1305Digest))
 (start $~start)
 (func $~lib/rt/stub/maybeGrowMemory (; 1 ;) (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  local.get $0
  memory.size
  local.tee $2
  i32.const 16
  i32.shl
  local.tee $1
  i32.gt_u
  if
   local.get $2
   local.get $0
   local.get $1
   i32.sub
   i32.const 65535
   i32.add
   i32.const -65536
   i32.and
   i32.const 16
   i32.shr_u
   local.tee $1
   local.get $2
   local.get $1
   i32.gt_s
   select
   memory.grow
   i32.const 0
   i32.lt_s
   if
    local.get $1
    memory.grow
    i32.const 0
    i32.lt_s
    if
     unreachable
    end
   end
  end
  local.get $0
  global.set $~lib/rt/stub/offset
 )
 (func $~lib/rt/stub/__alloc (; 2 ;) (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  local.get $0
  i32.const 1073741808
  i32.gt_u
  if
   unreachable
  end
  global.get $~lib/rt/stub/offset
  i32.const 16
  i32.add
  local.tee $3
  local.get $0
  i32.const 15
  i32.add
  i32.const -16
  i32.and
  local.tee $2
  i32.const 16
  local.get $2
  i32.const 16
  i32.gt_u
  select
  local.tee $4
  i32.add
  call $~lib/rt/stub/maybeGrowMemory
  local.get $3
  i32.const 16
  i32.sub
  local.tee $2
  local.get $4
  i32.store
  local.get $2
  i32.const 1
  i32.store offset=4
  local.get $2
  local.get $1
  i32.store offset=8
  local.get $2
  local.get $0
  i32.store offset=12
  local.get $3
 )
 (func $~lib/memory/memory.fill (; 3 ;) (param $0 i32) (param $1 i32)
  (local $2 i32)
  loop $while-continue|0
   local.get $1
   if
    local.get $0
    local.tee $2
    i32.const 1
    i32.add
    local.set $0
    local.get $2
    i32.const 0
    i32.store8
    local.get $1
    i32.const 1
    i32.sub
    local.set $1
    br $while-continue|0
   end
  end
 )
 (func $~lib/arraybuffer/ArrayBufferView#constructor (; 4 ;) (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  local.get $1
  i32.const 1073741808
  local.get $2
  i32.shr_u
  i32.gt_u
  if
   i32.const 32
   i32.const 80
   i32.const 23
   i32.const 56
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  local.get $2
  i32.shl
  local.tee $2
  i32.const 0
  call $~lib/rt/stub/__alloc
  local.tee $1
  local.get $2
  call $~lib/memory/memory.fill
  local.get $0
  i32.eqz
  if
   i32.const 12
   i32.const 2
   call $~lib/rt/stub/__alloc
   local.set $0
  end
  local.get $0
  i32.const 0
  i32.store
  local.get $0
  i32.const 0
  i32.store offset=4
  local.get $0
  i32.const 0
  i32.store offset=8
  local.get $0
  i32.load
  drop
  local.get $0
  local.get $1
  i32.store
  local.get $0
  local.get $1
  i32.store offset=4
  local.get $0
  local.get $2
  i32.store offset=8
  local.get $0
 )
 (func $~lib/typedarray/Uint32Array#constructor (; 5 ;) (result i32)
  i32.const 12
  i32.const 3
  call $~lib/rt/stub/__alloc
  i32.const 64
  i32.const 2
  call $~lib/arraybuffer/ArrayBufferView#constructor
 )
 (func $~lib/typedarray/Uint8Array#constructor (; 6 ;) (param $0 i32) (result i32)
  i32.const 12
  i32.const 4
  call $~lib/rt/stub/__alloc
  local.get $0
  i32.const 0
  call $~lib/arraybuffer/ArrayBufferView#constructor
 )
 (func $~lib/typedarray/Uint16Array#constructor (; 7 ;) (param $0 i32) (result i32)
  i32.const 12
  i32.const 5
  call $~lib/rt/stub/__alloc
  local.get $0
  i32.const 1
  call $~lib/arraybuffer/ArrayBufferView#constructor
 )
 (func $start:assembly/poly1305 (; 8 ;)
  i32.const 512
  global.set $~lib/rt/stub/startOffset
  i32.const 512
  global.set $~lib/rt/stub/offset
  call $~lib/typedarray/Uint32Array#constructor
  global.set $assembly/poly1305/polyArr
  i32.const 32
  call $~lib/typedarray/Uint8Array#constructor
  global.set $assembly/poly1305/keyArr
  i32.const 512
  call $~lib/typedarray/Uint8Array#constructor
  global.set $assembly/poly1305/inputArr
  i32.const 16
  call $~lib/typedarray/Uint8Array#constructor
  global.set $assembly/poly1305/outputArr
  call $~lib/typedarray/Uint32Array#constructor
  global.set $assembly/poly1305/debugArr
  global.get $assembly/poly1305/debugArr
  i32.load
  global.set $assembly/poly1305/debug
  i32.const 16
  call $~lib/typedarray/Uint8Array#constructor
  global.set $assembly/poly1305/_buffer
  i32.const 10
  call $~lib/typedarray/Uint16Array#constructor
  global.set $assembly/poly1305/_r
  i32.const 10
  call $~lib/typedarray/Uint16Array#constructor
  global.set $assembly/poly1305/_h
  i32.const 8
  call $~lib/typedarray/Uint16Array#constructor
  global.set $assembly/poly1305/_pad
 )
 (func $~lib/arraybuffer/ArrayBuffer#constructor (; 9 ;) (param $0 i32) (result i32)
  (local $1 i32)
  local.get $0
  i32.const 1073741808
  i32.gt_u
  if
   i32.const 32
   i32.const 80
   i32.const 54
   i32.const 42
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.const 0
  call $~lib/rt/stub/__alloc
  local.tee $1
  local.get $0
  call $~lib/memory/memory.fill
  local.get $1
 )
 (func $start:assembly/chacha20 (; 10 ;)
  i32.const 512
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/chacha20/chacha20Input
  global.get $assembly/chacha20/chacha20Input
  global.set $assembly/chacha20/chacha20InputPtr
  i32.const 32
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/chacha20/chacha20Key
  global.get $assembly/chacha20/chacha20Key
  global.set $assembly/chacha20/chacha20KeyPtr
  i32.const 16
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/chacha20/chacha20Counter
  global.get $assembly/chacha20/chacha20Counter
  global.set $assembly/chacha20/chacha20CounterPtr
  i32.const 512
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/chacha20/chacha20Output
  global.get $assembly/chacha20/chacha20Output
  global.set $assembly/chacha20/chacha20OutputPtr
  i32.const 64
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/chacha20/block
  global.get $assembly/chacha20/block
  global.set $assembly/chacha20/blockPtr
 )
 (func $assembly/util/writeUint32LE (; 11 ;) (param $0 i32) (param $1 i32) (param $2 i32)
  local.get $1
  local.get $2
  i32.const 255
  i32.and
  i32.add
  local.get $0
  i32.store8
  local.get $1
  local.get $2
  i32.const 1
  i32.add
  i32.const 255
  i32.and
  i32.add
  local.get $0
  i32.const 8
  i32.shr_u
  i32.store8
  local.get $1
  local.get $2
  i32.const 2
  i32.add
  i32.const 255
  i32.and
  i32.add
  local.get $0
  i32.const 16
  i32.shr_u
  i32.store8
  local.get $1
  local.get $2
  i32.const 3
  i32.add
  i32.const 255
  i32.and
  i32.add
  local.get $0
  i32.const 24
  i32.shr_u
  i32.store8
 )
 (func $assembly/chacha20/core (; 12 ;) (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  (local $14 i32)
  (local $15 i32)
  (local $16 i32)
  (local $17 i32)
  (local $18 i32)
  (local $19 i32)
  (local $20 i32)
  (local $21 i32)
  (local $22 i32)
  (local $23 i32)
  (local $24 i32)
  (local $25 i32)
  (local $26 i32)
  (local $27 i32)
  (local $28 i32)
  (local $29 i32)
  (local $30 i32)
  (local $31 i32)
  (local $32 i32)
  (local $33 i32)
  i32.const 1634760805
  local.set $12
  i32.const 857760878
  local.set $7
  i32.const 2036477234
  local.set $8
  i32.const 1797285236
  local.set $4
  local.get $2
  i32.load8_u
  local.get $2
  i32.const 3
  i32.add
  i32.load8_u
  i32.const 24
  i32.shl
  local.get $2
  i32.const 2
  i32.add
  i32.load8_u
  i32.const 16
  i32.shl
  i32.or
  local.get $2
  i32.const 1
  i32.add
  i32.load8_u
  i32.const 8
  i32.shl
  i32.or
  i32.or
  local.tee $19
  local.set $3
  local.get $2
  i32.const 4
  i32.add
  i32.load8_u
  local.get $2
  i32.const 7
  i32.add
  i32.load8_u
  i32.const 24
  i32.shl
  local.get $2
  i32.const 6
  i32.add
  i32.load8_u
  i32.const 16
  i32.shl
  i32.or
  local.get $2
  i32.const 5
  i32.add
  i32.load8_u
  i32.const 8
  i32.shl
  i32.or
  i32.or
  local.tee $20
  local.set $5
  local.get $2
  i32.const 8
  i32.add
  i32.load8_u
  local.get $2
  i32.const 11
  i32.add
  i32.load8_u
  i32.const 24
  i32.shl
  local.get $2
  i32.const 10
  i32.add
  i32.load8_u
  i32.const 16
  i32.shl
  i32.or
  local.get $2
  i32.const 9
  i32.add
  i32.load8_u
  i32.const 8
  i32.shl
  i32.or
  i32.or
  local.tee $21
  local.set $6
  local.get $2
  i32.const 12
  i32.add
  i32.load8_u
  local.get $2
  i32.const 15
  i32.add
  i32.load8_u
  i32.const 24
  i32.shl
  local.get $2
  i32.const 14
  i32.add
  i32.load8_u
  i32.const 16
  i32.shl
  i32.or
  local.get $2
  i32.const 13
  i32.add
  i32.load8_u
  i32.const 8
  i32.shl
  i32.or
  i32.or
  local.tee $22
  local.set $11
  local.get $2
  i32.const 16
  i32.add
  i32.load8_u
  local.get $2
  i32.const 19
  i32.add
  i32.load8_u
  i32.const 24
  i32.shl
  local.get $2
  i32.const 18
  i32.add
  i32.load8_u
  i32.const 16
  i32.shl
  i32.or
  local.get $2
  i32.const 17
  i32.add
  i32.load8_u
  i32.const 8
  i32.shl
  i32.or
  i32.or
  local.tee $23
  local.set $13
  local.get $2
  i32.const 20
  i32.add
  i32.load8_u
  local.get $2
  i32.const 23
  i32.add
  i32.load8_u
  i32.const 24
  i32.shl
  local.get $2
  i32.const 22
  i32.add
  i32.load8_u
  i32.const 16
  i32.shl
  i32.or
  local.get $2
  i32.const 21
  i32.add
  i32.load8_u
  i32.const 8
  i32.shl
  i32.or
  i32.or
  local.tee $24
  local.set $9
  local.get $2
  i32.const 24
  i32.add
  i32.load8_u
  local.get $2
  i32.const 27
  i32.add
  i32.load8_u
  i32.const 24
  i32.shl
  local.get $2
  i32.const 26
  i32.add
  i32.load8_u
  i32.const 16
  i32.shl
  i32.or
  local.get $2
  i32.const 25
  i32.add
  i32.load8_u
  i32.const 8
  i32.shl
  i32.or
  i32.or
  local.tee $25
  local.set $14
  local.get $2
  i32.const 28
  i32.add
  i32.load8_u
  local.get $2
  i32.const 31
  i32.add
  i32.load8_u
  i32.const 24
  i32.shl
  local.get $2
  i32.const 30
  i32.add
  i32.load8_u
  i32.const 16
  i32.shl
  i32.or
  local.get $2
  i32.const 29
  i32.add
  i32.load8_u
  i32.const 8
  i32.shl
  i32.or
  i32.or
  local.tee $26
  local.set $2
  local.get $1
  i32.load8_u
  local.get $1
  i32.const 3
  i32.add
  i32.load8_u
  i32.const 24
  i32.shl
  local.get $1
  i32.const 2
  i32.add
  i32.load8_u
  i32.const 16
  i32.shl
  i32.or
  local.get $1
  i32.const 1
  i32.add
  i32.load8_u
  i32.const 8
  i32.shl
  i32.or
  i32.or
  local.tee $27
  local.set $15
  local.get $1
  i32.const 4
  i32.add
  i32.load8_u
  local.get $1
  i32.const 7
  i32.add
  i32.load8_u
  i32.const 24
  i32.shl
  local.get $1
  i32.const 6
  i32.add
  i32.load8_u
  i32.const 16
  i32.shl
  i32.or
  local.get $1
  i32.const 5
  i32.add
  i32.load8_u
  i32.const 8
  i32.shl
  i32.or
  i32.or
  local.tee $28
  local.set $16
  local.get $1
  i32.const 8
  i32.add
  i32.load8_u
  local.get $1
  i32.const 11
  i32.add
  i32.load8_u
  i32.const 24
  i32.shl
  local.get $1
  i32.const 10
  i32.add
  i32.load8_u
  i32.const 16
  i32.shl
  i32.or
  local.get $1
  i32.const 9
  i32.add
  i32.load8_u
  i32.const 8
  i32.shl
  i32.or
  i32.or
  local.tee $29
  local.set $10
  local.get $1
  i32.const 12
  i32.add
  i32.load8_u
  local.get $1
  i32.const 15
  i32.add
  i32.load8_u
  i32.const 24
  i32.shl
  local.get $1
  i32.const 14
  i32.add
  i32.load8_u
  i32.const 16
  i32.shl
  i32.or
  local.get $1
  i32.const 13
  i32.add
  i32.load8_u
  i32.const 8
  i32.shl
  i32.or
  i32.or
  local.tee $30
  local.set $1
  loop $for-loop|0
   local.get $18
   i32.const 20
   i32.lt_s
   if
    local.get $6
    local.get $14
    local.get $10
    local.get $6
    local.get $8
    i32.add
    local.tee $6
    i32.xor
    local.tee $8
    i32.const 16
    i32.shr_u
    local.get $8
    i32.const 16
    i32.shl
    i32.or
    local.tee $8
    i32.add
    local.tee $14
    i32.xor
    local.tee $10
    i32.const 20
    i32.shr_u
    local.get $10
    i32.const 12
    i32.shl
    i32.or
    local.tee $10
    local.get $14
    local.get $8
    local.get $6
    local.get $10
    i32.add
    local.tee $8
    i32.xor
    local.tee $6
    i32.const 24
    i32.shr_u
    local.get $6
    i32.const 8
    i32.shl
    i32.or
    local.tee $14
    i32.add
    local.tee $10
    i32.xor
    local.set $6
    local.get $11
    local.get $2
    local.get $1
    local.get $4
    local.get $11
    i32.add
    local.tee $1
    i32.xor
    local.tee $2
    i32.const 16
    i32.shr_u
    local.get $2
    i32.const 16
    i32.shl
    i32.or
    local.tee $2
    i32.add
    local.tee $11
    i32.xor
    local.tee $4
    i32.const 20
    i32.shr_u
    local.get $4
    i32.const 12
    i32.shl
    i32.or
    local.tee $4
    local.get $11
    local.get $2
    local.get $1
    local.get $4
    i32.add
    local.tee $11
    i32.xor
    local.tee $1
    i32.const 24
    i32.shr_u
    local.get $1
    i32.const 8
    i32.shl
    i32.or
    local.tee $4
    i32.add
    local.tee $17
    i32.xor
    local.set $1
    local.get $3
    local.get $13
    local.get $15
    local.get $3
    local.get $12
    i32.add
    local.tee $2
    i32.xor
    local.tee $3
    i32.const 16
    i32.shr_u
    local.get $3
    i32.const 16
    i32.shl
    i32.or
    local.tee $3
    i32.add
    local.tee $12
    i32.xor
    local.tee $13
    i32.const 20
    i32.shr_u
    local.get $13
    i32.const 12
    i32.shl
    i32.or
    local.tee $13
    local.get $12
    local.get $3
    local.get $2
    local.get $13
    i32.add
    local.tee $3
    i32.xor
    local.tee $2
    i32.const 24
    i32.shr_u
    local.get $2
    i32.const 8
    i32.shl
    i32.or
    local.tee $12
    i32.add
    local.tee $13
    i32.xor
    local.set $2
    local.get $10
    local.get $4
    local.get $5
    local.get $9
    local.get $16
    local.get $5
    local.get $7
    i32.add
    local.tee $5
    i32.xor
    local.tee $7
    i32.const 16
    i32.shr_u
    local.get $7
    i32.const 16
    i32.shl
    i32.or
    local.tee $7
    i32.add
    local.tee $4
    i32.xor
    local.tee $9
    i32.const 20
    i32.shr_u
    local.get $9
    i32.const 12
    i32.shl
    i32.or
    local.tee $9
    local.get $4
    local.get $7
    local.get $5
    local.get $9
    i32.add
    local.tee $7
    i32.xor
    local.tee $5
    i32.const 24
    i32.shr_u
    local.get $5
    i32.const 8
    i32.shl
    i32.or
    local.tee $4
    i32.add
    local.tee $9
    i32.xor
    local.tee $5
    i32.const 25
    i32.shr_u
    local.get $5
    i32.const 7
    i32.shl
    i32.or
    local.tee $31
    local.get $3
    i32.add
    local.tee $32
    i32.xor
    local.tee $3
    i32.const 16
    i32.shr_u
    local.get $3
    i32.const 16
    i32.shl
    i32.or
    local.tee $33
    i32.add
    local.set $5
    local.get $17
    local.get $12
    local.get $6
    i32.const 7
    i32.shl
    local.get $6
    i32.const 25
    i32.shr_u
    i32.or
    local.tee $12
    local.get $7
    i32.add
    local.tee $7
    i32.xor
    local.tee $3
    i32.const 16
    i32.shr_u
    local.get $3
    i32.const 16
    i32.shl
    i32.or
    local.tee $15
    i32.add
    local.set $6
    local.get $9
    local.get $14
    local.get $11
    local.get $2
    i32.const 7
    i32.shl
    local.get $2
    i32.const 25
    i32.shr_u
    i32.or
    local.tee $9
    i32.add
    local.tee $14
    i32.xor
    local.tee $2
    i32.const 16
    i32.shr_u
    local.get $2
    i32.const 16
    i32.shl
    i32.or
    local.tee $10
    i32.add
    local.set $2
    local.get $13
    local.get $4
    local.get $8
    local.get $1
    i32.const 7
    i32.shl
    local.get $1
    i32.const 25
    i32.shr_u
    i32.or
    local.tee $3
    i32.add
    local.tee $8
    i32.xor
    local.tee $1
    i32.const 16
    i32.shr_u
    local.get $1
    i32.const 16
    i32.shl
    i32.or
    local.tee $4
    i32.add
    local.tee $1
    local.get $8
    local.get $1
    local.get $3
    i32.xor
    local.tee $3
    i32.const 20
    i32.shr_u
    local.get $3
    i32.const 12
    i32.shl
    i32.or
    local.tee $3
    i32.add
    local.tee $8
    local.get $4
    i32.xor
    local.tee $11
    i32.const 24
    i32.shr_u
    local.get $11
    i32.const 8
    i32.shl
    i32.or
    local.tee $16
    i32.add
    local.tee $13
    local.get $3
    i32.xor
    local.tee $1
    i32.const 25
    i32.shr_u
    local.get $1
    i32.const 7
    i32.shl
    i32.or
    local.set $11
    local.get $14
    local.get $2
    local.get $9
    i32.xor
    local.tee $1
    i32.const 20
    i32.shr_u
    local.get $1
    i32.const 12
    i32.shl
    i32.or
    local.tee $1
    i32.add
    local.tee $4
    local.get $10
    i32.xor
    local.tee $3
    i32.const 24
    i32.shr_u
    local.get $3
    i32.const 8
    i32.shl
    i32.or
    local.tee $10
    local.get $2
    i32.add
    local.tee $9
    local.get $1
    i32.xor
    local.tee $1
    i32.const 25
    i32.shr_u
    local.get $1
    i32.const 7
    i32.shl
    i32.or
    local.set $3
    local.get $7
    local.get $6
    local.get $12
    i32.xor
    local.tee $1
    i32.const 20
    i32.shr_u
    local.get $1
    i32.const 12
    i32.shl
    i32.or
    local.tee $1
    i32.add
    local.tee $7
    local.get $15
    i32.xor
    local.tee $2
    i32.const 24
    i32.shr_u
    local.get $2
    i32.const 8
    i32.shl
    i32.or
    local.tee $15
    local.get $6
    i32.add
    local.tee $2
    local.get $1
    i32.xor
    local.tee $1
    i32.const 25
    i32.shr_u
    local.get $1
    i32.const 7
    i32.shl
    i32.or
    local.set $6
    local.get $32
    local.get $5
    local.get $31
    i32.xor
    local.tee $1
    i32.const 20
    i32.shr_u
    local.get $1
    i32.const 12
    i32.shl
    i32.or
    local.tee $17
    i32.add
    local.tee $12
    local.get $33
    i32.xor
    local.tee $1
    i32.const 24
    i32.shr_u
    local.get $1
    i32.const 8
    i32.shl
    i32.or
    local.tee $1
    local.get $5
    i32.add
    local.tee $14
    local.get $17
    i32.xor
    local.tee $5
    i32.const 25
    i32.shr_u
    local.get $5
    i32.const 7
    i32.shl
    i32.or
    local.set $5
    local.get $18
    i32.const 2
    i32.add
    local.set $18
    br $for-loop|0
   end
  end
  local.get $12
  i32.const 1634760805
  i32.add
  local.get $0
  i32.const 0
  call $assembly/util/writeUint32LE
  local.get $7
  i32.const 857760878
  i32.add
  local.get $0
  i32.const 4
  call $assembly/util/writeUint32LE
  local.get $8
  i32.const 2036477234
  i32.add
  local.get $0
  i32.const 8
  call $assembly/util/writeUint32LE
  local.get $4
  i32.const 1797285236
  i32.add
  local.get $0
  i32.const 12
  call $assembly/util/writeUint32LE
  local.get $3
  local.get $19
  i32.add
  local.get $0
  i32.const 16
  call $assembly/util/writeUint32LE
  local.get $5
  local.get $20
  i32.add
  local.get $0
  i32.const 20
  call $assembly/util/writeUint32LE
  local.get $6
  local.get $21
  i32.add
  local.get $0
  i32.const 24
  call $assembly/util/writeUint32LE
  local.get $11
  local.get $22
  i32.add
  local.get $0
  i32.const 28
  call $assembly/util/writeUint32LE
  local.get $13
  local.get $23
  i32.add
  local.get $0
  i32.const 32
  call $assembly/util/writeUint32LE
  local.get $9
  local.get $24
  i32.add
  local.get $0
  i32.const 36
  call $assembly/util/writeUint32LE
  local.get $14
  local.get $25
  i32.add
  local.get $0
  i32.const 40
  call $assembly/util/writeUint32LE
  local.get $2
  local.get $26
  i32.add
  local.get $0
  i32.const 44
  call $assembly/util/writeUint32LE
  local.get $15
  local.get $27
  i32.add
  local.get $0
  i32.const 48
  call $assembly/util/writeUint32LE
  local.get $16
  local.get $28
  i32.add
  local.get $0
  i32.const 52
  call $assembly/util/writeUint32LE
  local.get $10
  local.get $29
  i32.add
  local.get $0
  i32.const 56
  call $assembly/util/writeUint32LE
  local.get $1
  local.get $30
  i32.add
  local.get $0
  i32.const 60
  call $assembly/util/writeUint32LE
 )
 (func $assembly/chacha20/incrementCounter (; 13 ;) (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  i32.const 4
  local.set $3
  i32.const 1
  local.set $1
  loop $while-continue|0
   local.get $3
   local.tee $2
   i32.const 1
   i32.sub
   local.set $3
   local.get $2
   i32.const 255
   i32.and
   if
    local.get $1
    local.get $0
    local.get $4
    i32.const 255
    i32.and
    i32.add
    local.tee $2
    i32.load8_u
    i32.add
    local.set $1
    local.get $2
    local.get $1
    i32.store8
    local.get $1
    i32.const 8
    i32.shr_u
    local.set $1
    local.get $4
    i32.const 1
    i32.add
    local.set $4
    br $while-continue|0
   end
  end
  local.get $1
  i32.const 0
  i32.gt_s
  if
   i32.const 144
   i32.const 208
   i32.const 240
   i32.const 4
   call $~lib/builtins/abort
   unreachable
  end
 )
 (func $assembly/util/wipe (; 14 ;) (param $0 i32)
  (local $1 i32)
  loop $for-loop|0
   local.get $1
   i32.const 64
   i32.lt_u
   if
    local.get $0
    local.get $1
    i32.add
    i32.const 0
    i32.store8
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $for-loop|0
   end
  end
 )
 (func $assembly/chacha20/doStreamXORUpdate (; 15 ;) (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (result i32)
  (local $5 i32)
  (local $6 i32)
  loop $for-loop|0
   local.get $6
   local.get $1
   i32.lt_u
   if
    global.get $assembly/chacha20/blockPtr
    local.get $3
    local.get $2
    call $assembly/chacha20/core
    local.get $6
    local.set $5
    loop $for-loop|1
     local.get $5
     local.get $1
     i32.lt_u
     i32.const 0
     local.get $5
     local.get $6
     i32.const -64
     i32.sub
     i32.lt_u
     select
     if
      local.get $4
      local.get $5
      i32.add
      local.get $0
      local.get $5
      i32.add
      i32.load8_u
      global.get $assembly/chacha20/blockPtr
      local.get $5
      local.get $6
      i32.sub
      i32.add
      i32.load8_u
      i32.xor
      i32.store8
      local.get $5
      i32.const 1
      i32.add
      local.set $5
      br $for-loop|1
     end
    end
    local.get $3
    call $assembly/chacha20/incrementCounter
    local.get $6
    i32.const -64
    i32.sub
    local.set $6
    br $for-loop|0
   end
  end
  global.get $assembly/chacha20/blockPtr
  call $assembly/util/wipe
  local.get $1
 )
 (func $assembly/chacha20/chacha20StreamXORUpdate (; 16 ;) (param $0 i32) (result i32)
  global.get $assembly/chacha20/chacha20InputPtr
  local.get $0
  global.get $assembly/chacha20/chacha20KeyPtr
  global.get $assembly/chacha20/chacha20CounterPtr
  global.get $assembly/chacha20/chacha20OutputPtr
  call $assembly/chacha20/doStreamXORUpdate
 )
 (func $~lib/typedarray/Uint8Array#__get (; 17 ;) (param $0 i32) (param $1 i32) (result i32)
  local.get $1
  local.get $0
  i32.load offset=8
  i32.ge_u
  if
   i32.const 272
   i32.const 336
   i32.const 152
   i32.const 44
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  local.get $0
  i32.load offset=4
  i32.add
  i32.load8_u
 )
 (func $~lib/typedarray/Uint16Array#__set (; 18 ;) (param $0 i32) (param $1 i32) (param $2 i32)
  local.get $1
  local.get $0
  i32.load offset=8
  i32.const 1
  i32.shr_u
  i32.ge_u
  if
   i32.const 272
   i32.const 336
   i32.const 547
   i32.const 63
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.load offset=4
  local.get $1
  i32.const 1
  i32.shl
  i32.add
  local.get $2
  i32.store16
 )
 (func $assembly/poly1305/init (; 19 ;) (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  local.get $0
  i32.const 0
  call $~lib/typedarray/Uint8Array#__get
  local.get $0
  i32.const 1
  call $~lib/typedarray/Uint8Array#__get
  i32.const 8
  i32.shl
  i32.or
  local.set $1
  global.get $assembly/poly1305/_r
  i32.const 0
  local.get $1
  i32.const 8191
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  local.get $0
  i32.const 2
  call $~lib/typedarray/Uint8Array#__get
  local.get $0
  i32.const 3
  call $~lib/typedarray/Uint8Array#__get
  i32.const 8
  i32.shl
  i32.or
  local.set $2
  global.get $assembly/poly1305/_r
  i32.const 1
  local.get $2
  i32.const 3
  i32.shl
  local.get $1
  i32.const 65535
  i32.and
  i32.const 13
  i32.shr_u
  i32.or
  i32.const 8191
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  local.get $0
  i32.const 4
  call $~lib/typedarray/Uint8Array#__get
  local.get $0
  i32.const 5
  call $~lib/typedarray/Uint8Array#__get
  i32.const 8
  i32.shl
  i32.or
  local.set $1
  global.get $assembly/poly1305/_r
  i32.const 2
  local.get $1
  i32.const 6
  i32.shl
  local.get $2
  i32.const 65535
  i32.and
  i32.const 10
  i32.shr_u
  i32.or
  i32.const 7939
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  local.get $0
  i32.const 6
  call $~lib/typedarray/Uint8Array#__get
  local.get $0
  i32.const 7
  call $~lib/typedarray/Uint8Array#__get
  i32.const 8
  i32.shl
  i32.or
  local.set $2
  global.get $assembly/poly1305/_r
  i32.const 3
  local.get $2
  i32.const 9
  i32.shl
  local.get $1
  i32.const 65535
  i32.and
  i32.const 7
  i32.shr_u
  i32.or
  i32.const 8191
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  local.get $0
  i32.const 8
  call $~lib/typedarray/Uint8Array#__get
  local.get $0
  i32.const 9
  call $~lib/typedarray/Uint8Array#__get
  i32.const 8
  i32.shl
  i32.or
  local.set $1
  global.get $assembly/poly1305/_r
  i32.const 4
  local.get $1
  i32.const 12
  i32.shl
  local.get $2
  i32.const 65535
  i32.and
  i32.const 4
  i32.shr_u
  i32.or
  i32.const 255
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_r
  i32.const 5
  local.get $1
  i32.const 65535
  i32.and
  local.tee $2
  i32.const 1
  i32.shr_u
  i32.const 8190
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  local.get $0
  i32.const 10
  call $~lib/typedarray/Uint8Array#__get
  local.get $0
  i32.const 11
  call $~lib/typedarray/Uint8Array#__get
  i32.const 8
  i32.shl
  i32.or
  local.set $1
  global.get $assembly/poly1305/_r
  i32.const 6
  local.get $1
  i32.const 2
  i32.shl
  local.get $2
  i32.const 14
  i32.shr_u
  i32.or
  i32.const 8191
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  local.get $0
  i32.const 12
  call $~lib/typedarray/Uint8Array#__get
  local.get $0
  i32.const 13
  call $~lib/typedarray/Uint8Array#__get
  i32.const 8
  i32.shl
  i32.or
  local.set $2
  global.get $assembly/poly1305/_r
  i32.const 7
  local.get $2
  i32.const 5
  i32.shl
  local.get $1
  i32.const 65535
  i32.and
  i32.const 11
  i32.shr_u
  i32.or
  i32.const 8065
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  local.get $0
  i32.const 14
  call $~lib/typedarray/Uint8Array#__get
  local.get $0
  i32.const 15
  call $~lib/typedarray/Uint8Array#__get
  i32.const 8
  i32.shl
  i32.or
  local.set $1
  global.get $assembly/poly1305/_r
  i32.const 8
  local.get $1
  i32.const 8
  i32.shl
  local.get $2
  i32.const 65535
  i32.and
  i32.const 8
  i32.shr_u
  i32.or
  i32.const 8191
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_r
  i32.const 9
  local.get $1
  i32.const 65535
  i32.and
  i32.const 5
  i32.shr_u
  i32.const 127
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_pad
  i32.const 0
  local.get $0
  i32.const 16
  call $~lib/typedarray/Uint8Array#__get
  local.get $0
  i32.const 17
  call $~lib/typedarray/Uint8Array#__get
  i32.const 8
  i32.shl
  i32.or
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_pad
  i32.const 1
  local.get $0
  i32.const 18
  call $~lib/typedarray/Uint8Array#__get
  local.get $0
  i32.const 19
  call $~lib/typedarray/Uint8Array#__get
  i32.const 8
  i32.shl
  i32.or
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_pad
  i32.const 2
  local.get $0
  i32.const 20
  call $~lib/typedarray/Uint8Array#__get
  local.get $0
  i32.const 21
  call $~lib/typedarray/Uint8Array#__get
  i32.const 8
  i32.shl
  i32.or
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_pad
  i32.const 3
  local.get $0
  i32.const 22
  call $~lib/typedarray/Uint8Array#__get
  local.get $0
  i32.const 23
  call $~lib/typedarray/Uint8Array#__get
  i32.const 8
  i32.shl
  i32.or
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_pad
  i32.const 4
  local.get $0
  i32.const 24
  call $~lib/typedarray/Uint8Array#__get
  local.get $0
  i32.const 25
  call $~lib/typedarray/Uint8Array#__get
  i32.const 8
  i32.shl
  i32.or
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_pad
  i32.const 5
  local.get $0
  i32.const 26
  call $~lib/typedarray/Uint8Array#__get
  local.get $0
  i32.const 27
  call $~lib/typedarray/Uint8Array#__get
  i32.const 8
  i32.shl
  i32.or
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_pad
  i32.const 6
  local.get $0
  i32.const 28
  call $~lib/typedarray/Uint8Array#__get
  local.get $0
  i32.const 29
  call $~lib/typedarray/Uint8Array#__get
  i32.const 8
  i32.shl
  i32.or
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_pad
  i32.const 7
  local.get $0
  i32.const 30
  call $~lib/typedarray/Uint8Array#__get
  local.get $0
  i32.const 31
  call $~lib/typedarray/Uint8Array#__get
  i32.const 8
  i32.shl
  i32.or
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
 )
 (func $assembly/poly1305/poly1305Init (; 20 ;)
  global.get $assembly/poly1305/keyArr
  call $assembly/poly1305/init
 )
 (func $~lib/typedarray/Uint8Array#subarray (; 21 ;) (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  i32.const 0
  local.get $0
  i32.load offset=8
  local.tee $2
  i32.const 0
  local.get $2
  i32.lt_s
  select
  local.set $3
  local.get $1
  i32.const 0
  i32.lt_s
  if (result i32)
   local.get $1
   local.get $2
   i32.add
   local.tee $1
   i32.const 0
   local.get $1
   i32.const 0
   i32.gt_s
   select
  else
   local.get $1
   local.get $2
   local.get $1
   local.get $2
   i32.lt_s
   select
  end
  local.set $1
  i32.const 12
  i32.const 4
  call $~lib/rt/stub/__alloc
  local.tee $2
  local.get $0
  i32.load
  i32.store
  local.get $2
  local.get $3
  local.get $0
  i32.load offset=4
  i32.add
  i32.store offset=4
  local.get $2
  local.get $1
  local.get $3
  local.get $1
  local.get $3
  i32.gt_s
  select
  local.get $3
  i32.sub
  i32.store offset=8
  local.get $2
 )
 (func $~lib/typedarray/Uint8Array#__set (; 22 ;) (param $0 i32) (param $1 i32) (param $2 i32)
  local.get $1
  local.get $0
  i32.load offset=8
  i32.ge_u
  if
   i32.const 272
   i32.const 336
   i32.const 163
   i32.const 44
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  local.get $0
  i32.load offset=4
  i32.add
  local.get $2
  i32.store8
 )
 (func $~lib/typedarray/Uint16Array#__get (; 23 ;) (param $0 i32) (param $1 i32) (result i32)
  local.get $1
  local.get $0
  i32.load offset=8
  i32.const 1
  i32.shr_u
  i32.ge_u
  if
   i32.const 272
   i32.const 336
   i32.const 536
   i32.const 63
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.load offset=4
  local.get $1
  i32.const 1
  i32.shl
  i32.add
  i32.load16_u
 )
 (func $assembly/poly1305/_blocks (; 24 ;) (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  (local $14 i32)
  (local $15 i32)
  (local $16 i32)
  (local $17 i32)
  (local $18 i32)
  (local $19 i32)
  (local $20 i32)
  (local $21 i32)
  (local $22 i32)
  (local $23 i32)
  (local $24 i32)
  (local $25 i32)
  (local $26 i32)
  (local $27 i32)
  (local $28 i32)
  (local $29 i32)
  (local $30 i32)
  (local $31 i32)
  (local $32 i32)
  (local $33 i32)
  (local $34 i32)
  i32.const 0
  i32.const 2048
  global.get $assembly/poly1305/_fin
  select
  local.set $33
  global.get $assembly/poly1305/_h
  i32.const 0
  call $~lib/typedarray/Uint16Array#__get
  local.set $3
  global.get $assembly/poly1305/_h
  i32.const 1
  call $~lib/typedarray/Uint16Array#__get
  local.set $5
  global.get $assembly/poly1305/_h
  i32.const 2
  call $~lib/typedarray/Uint16Array#__get
  local.set $8
  global.get $assembly/poly1305/_h
  i32.const 3
  call $~lib/typedarray/Uint16Array#__get
  local.set $9
  global.get $assembly/poly1305/_h
  i32.const 4
  call $~lib/typedarray/Uint16Array#__get
  local.set $10
  global.get $assembly/poly1305/_h
  i32.const 5
  call $~lib/typedarray/Uint16Array#__get
  local.set $11
  global.get $assembly/poly1305/_h
  i32.const 6
  call $~lib/typedarray/Uint16Array#__get
  local.set $12
  global.get $assembly/poly1305/_h
  i32.const 7
  call $~lib/typedarray/Uint16Array#__get
  local.set $13
  global.get $assembly/poly1305/_h
  i32.const 8
  call $~lib/typedarray/Uint16Array#__get
  local.set $14
  global.get $assembly/poly1305/_h
  i32.const 9
  call $~lib/typedarray/Uint16Array#__get
  local.set $4
  global.get $assembly/poly1305/_r
  i32.const 0
  call $~lib/typedarray/Uint16Array#__get
  local.set $18
  global.get $assembly/poly1305/_r
  i32.const 1
  call $~lib/typedarray/Uint16Array#__get
  local.set $19
  global.get $assembly/poly1305/_r
  i32.const 2
  call $~lib/typedarray/Uint16Array#__get
  local.set $20
  global.get $assembly/poly1305/_r
  i32.const 3
  call $~lib/typedarray/Uint16Array#__get
  local.set $23
  global.get $assembly/poly1305/_r
  i32.const 4
  call $~lib/typedarray/Uint16Array#__get
  local.set $24
  global.get $assembly/poly1305/_r
  i32.const 5
  call $~lib/typedarray/Uint16Array#__get
  local.set $26
  global.get $assembly/poly1305/_r
  i32.const 6
  call $~lib/typedarray/Uint16Array#__get
  local.set $28
  global.get $assembly/poly1305/_r
  i32.const 7
  call $~lib/typedarray/Uint16Array#__get
  local.set $29
  global.get $assembly/poly1305/_r
  i32.const 8
  call $~lib/typedarray/Uint16Array#__get
  local.set $31
  global.get $assembly/poly1305/_r
  i32.const 9
  call $~lib/typedarray/Uint16Array#__get
  local.set $32
  loop $while-continue|0
   local.get $2
   i32.const 16
   i32.ge_u
   if
    local.get $0
    local.get $1
    call $~lib/typedarray/Uint8Array#__get
    local.get $0
    local.get $1
    i32.const 1
    i32.add
    call $~lib/typedarray/Uint8Array#__get
    i32.const 8
    i32.shl
    i32.or
    local.set $7
    local.get $0
    local.get $1
    i32.const 2
    i32.add
    call $~lib/typedarray/Uint8Array#__get
    local.get $0
    local.get $1
    i32.const 3
    i32.add
    call $~lib/typedarray/Uint8Array#__get
    i32.const 8
    i32.shl
    i32.or
    local.set $15
    local.get $0
    local.get $1
    i32.const 4
    i32.add
    call $~lib/typedarray/Uint8Array#__get
    local.get $0
    local.get $1
    i32.const 5
    i32.add
    call $~lib/typedarray/Uint8Array#__get
    i32.const 8
    i32.shl
    i32.or
    local.set $16
    local.get $0
    local.get $1
    i32.const 6
    i32.add
    call $~lib/typedarray/Uint8Array#__get
    local.get $0
    local.get $1
    i32.const 7
    i32.add
    call $~lib/typedarray/Uint8Array#__get
    i32.const 8
    i32.shl
    i32.or
    local.set $17
    local.get $0
    local.get $1
    i32.const 8
    i32.add
    call $~lib/typedarray/Uint8Array#__get
    local.get $0
    local.get $1
    i32.const 9
    i32.add
    call $~lib/typedarray/Uint8Array#__get
    i32.const 8
    i32.shl
    i32.or
    local.tee $21
    i32.const 65535
    i32.and
    local.set $22
    local.get $18
    local.get $3
    local.get $7
    i32.const 8191
    i32.and
    i32.add
    local.tee $3
    i32.mul
    local.get $5
    local.get $15
    i32.const 3
    i32.shl
    local.get $7
    i32.const 65535
    i32.and
    i32.const 13
    i32.shr_u
    i32.or
    i32.const 8191
    i32.and
    i32.add
    local.tee $5
    local.get $32
    i32.const 5
    i32.mul
    local.tee $7
    i32.mul
    i32.add
    local.get $8
    local.get $16
    i32.const 6
    i32.shl
    local.get $15
    i32.const 65535
    i32.and
    i32.const 10
    i32.shr_u
    i32.or
    i32.const 8191
    i32.and
    i32.add
    local.tee $8
    local.get $31
    i32.const 5
    i32.mul
    local.tee $15
    i32.mul
    i32.add
    local.get $9
    local.get $17
    i32.const 9
    i32.shl
    local.get $16
    i32.const 65535
    i32.and
    i32.const 7
    i32.shr_u
    i32.or
    i32.const 8191
    i32.and
    i32.add
    local.tee $9
    local.get $29
    i32.const 5
    i32.mul
    local.tee $16
    i32.mul
    i32.add
    local.get $10
    local.get $21
    i32.const 12
    i32.shl
    local.get $17
    i32.const 65535
    i32.and
    i32.const 4
    i32.shr_u
    i32.or
    i32.const 8191
    i32.and
    i32.add
    local.tee $10
    local.get $28
    i32.const 5
    i32.mul
    local.tee $17
    i32.mul
    i32.add
    local.tee $30
    i32.const 8191
    i32.and
    local.get $11
    local.get $22
    i32.const 1
    i32.shr_u
    i32.const 8191
    i32.and
    i32.add
    local.tee $11
    local.get $26
    i32.const 5
    i32.mul
    local.tee $21
    i32.mul
    i32.add
    local.get $12
    local.get $0
    local.get $1
    i32.const 10
    i32.add
    call $~lib/typedarray/Uint8Array#__get
    local.get $0
    local.get $1
    i32.const 11
    i32.add
    call $~lib/typedarray/Uint8Array#__get
    i32.const 8
    i32.shl
    i32.or
    local.tee $25
    i32.const 2
    i32.shl
    local.get $22
    i32.const 14
    i32.shr_u
    i32.or
    i32.const 8191
    i32.and
    i32.add
    local.tee $12
    local.get $24
    i32.const 5
    i32.mul
    local.tee $22
    i32.mul
    i32.add
    local.get $13
    local.get $0
    local.get $1
    i32.const 12
    i32.add
    call $~lib/typedarray/Uint8Array#__get
    local.get $0
    local.get $1
    i32.const 13
    i32.add
    call $~lib/typedarray/Uint8Array#__get
    i32.const 8
    i32.shl
    i32.or
    local.tee $27
    i32.const 5
    i32.shl
    local.get $25
    i32.const 65535
    i32.and
    i32.const 11
    i32.shr_u
    i32.or
    i32.const 8191
    i32.and
    i32.add
    local.tee $13
    local.get $23
    i32.const 5
    i32.mul
    local.tee $25
    i32.mul
    i32.add
    local.get $14
    local.get $27
    i32.const 65535
    i32.and
    i32.const 8
    i32.shr_u
    local.get $0
    local.get $1
    i32.const 14
    i32.add
    call $~lib/typedarray/Uint8Array#__get
    local.get $0
    local.get $1
    i32.const 15
    i32.add
    call $~lib/typedarray/Uint8Array#__get
    i32.const 8
    i32.shl
    i32.or
    local.tee $27
    i32.const 8
    i32.shl
    i32.or
    i32.const 8191
    i32.and
    i32.add
    local.tee $14
    local.get $20
    i32.const 5
    i32.mul
    local.tee $6
    i32.mul
    i32.add
    local.get $4
    local.get $33
    local.get $27
    i32.const 65535
    i32.and
    i32.const 5
    i32.shr_u
    i32.or
    i32.const 65535
    i32.and
    i32.add
    local.tee $4
    local.get $19
    i32.const 5
    i32.mul
    i32.mul
    i32.add
    local.set $27
    local.get $11
    local.get $17
    i32.mul
    local.get $30
    i32.const 13
    i32.shr_u
    local.get $27
    i32.const 13
    i32.shr_u
    i32.add
    local.get $3
    local.get $19
    i32.mul
    i32.add
    local.get $5
    local.get $18
    i32.mul
    i32.add
    local.get $7
    local.get $8
    i32.mul
    i32.add
    local.get $9
    local.get $15
    i32.mul
    i32.add
    local.get $10
    local.get $16
    i32.mul
    i32.add
    local.tee $34
    i32.const 8191
    i32.and
    i32.add
    local.get $12
    local.get $21
    i32.mul
    i32.add
    local.get $13
    local.get $22
    i32.mul
    i32.add
    local.get $14
    local.get $25
    i32.mul
    i32.add
    local.get $4
    local.get $6
    i32.mul
    i32.add
    local.set $30
    local.get $11
    local.get $16
    i32.mul
    local.get $34
    i32.const 13
    i32.shr_u
    local.get $30
    i32.const 13
    i32.shr_u
    i32.add
    local.get $3
    local.get $20
    i32.mul
    i32.add
    local.get $5
    local.get $19
    i32.mul
    i32.add
    local.get $8
    local.get $18
    i32.mul
    i32.add
    local.get $7
    local.get $9
    i32.mul
    i32.add
    local.get $10
    local.get $15
    i32.mul
    i32.add
    local.tee $6
    i32.const 8191
    i32.and
    i32.add
    local.get $12
    local.get $17
    i32.mul
    i32.add
    local.get $13
    local.get $21
    i32.mul
    i32.add
    local.get $14
    local.get $22
    i32.mul
    i32.add
    local.get $4
    local.get $25
    i32.mul
    i32.add
    local.set $25
    local.get $11
    local.get $15
    i32.mul
    local.get $6
    i32.const 13
    i32.shr_u
    local.get $25
    i32.const 13
    i32.shr_u
    i32.add
    local.get $3
    local.get $23
    i32.mul
    i32.add
    local.get $5
    local.get $20
    i32.mul
    i32.add
    local.get $8
    local.get $19
    i32.mul
    i32.add
    local.get $9
    local.get $18
    i32.mul
    i32.add
    local.get $7
    local.get $10
    i32.mul
    i32.add
    local.tee $6
    i32.const 8191
    i32.and
    i32.add
    local.get $12
    local.get $16
    i32.mul
    i32.add
    local.get $13
    local.get $17
    i32.mul
    i32.add
    local.get $14
    local.get $21
    i32.mul
    i32.add
    local.get $4
    local.get $22
    i32.mul
    i32.add
    local.set $22
    local.get $7
    local.get $11
    i32.mul
    local.get $6
    i32.const 13
    i32.shr_u
    local.get $22
    i32.const 13
    i32.shr_u
    i32.add
    local.get $3
    local.get $24
    i32.mul
    i32.add
    local.get $5
    local.get $23
    i32.mul
    i32.add
    local.get $8
    local.get $20
    i32.mul
    i32.add
    local.get $9
    local.get $19
    i32.mul
    i32.add
    local.get $10
    local.get $18
    i32.mul
    i32.add
    local.tee $6
    i32.const 8191
    i32.and
    i32.add
    local.get $12
    local.get $15
    i32.mul
    i32.add
    local.get $13
    local.get $16
    i32.mul
    i32.add
    local.get $14
    local.get $17
    i32.mul
    i32.add
    local.get $4
    local.get $21
    i32.mul
    i32.add
    local.set $21
    local.get $11
    local.get $18
    i32.mul
    local.get $6
    i32.const 13
    i32.shr_u
    local.get $21
    i32.const 13
    i32.shr_u
    i32.add
    local.get $3
    local.get $26
    i32.mul
    i32.add
    local.get $5
    local.get $24
    i32.mul
    i32.add
    local.get $8
    local.get $23
    i32.mul
    i32.add
    local.get $9
    local.get $20
    i32.mul
    i32.add
    local.get $10
    local.get $19
    i32.mul
    i32.add
    local.tee $6
    i32.const 8191
    i32.and
    i32.add
    local.get $7
    local.get $12
    i32.mul
    i32.add
    local.get $13
    local.get $15
    i32.mul
    i32.add
    local.get $14
    local.get $16
    i32.mul
    i32.add
    local.get $4
    local.get $17
    i32.mul
    i32.add
    local.set $17
    local.get $11
    local.get $19
    i32.mul
    local.get $6
    i32.const 13
    i32.shr_u
    local.get $17
    i32.const 13
    i32.shr_u
    i32.add
    local.get $3
    local.get $28
    i32.mul
    i32.add
    local.get $5
    local.get $26
    i32.mul
    i32.add
    local.get $8
    local.get $24
    i32.mul
    i32.add
    local.get $9
    local.get $23
    i32.mul
    i32.add
    local.get $10
    local.get $20
    i32.mul
    i32.add
    local.tee $6
    i32.const 8191
    i32.and
    i32.add
    local.get $12
    local.get $18
    i32.mul
    i32.add
    local.get $7
    local.get $13
    i32.mul
    i32.add
    local.get $14
    local.get $15
    i32.mul
    i32.add
    local.get $4
    local.get $16
    i32.mul
    i32.add
    local.set $16
    local.get $11
    local.get $20
    i32.mul
    local.get $6
    i32.const 13
    i32.shr_u
    local.get $16
    i32.const 13
    i32.shr_u
    i32.add
    local.get $3
    local.get $29
    i32.mul
    i32.add
    local.get $5
    local.get $28
    i32.mul
    i32.add
    local.get $8
    local.get $26
    i32.mul
    i32.add
    local.get $9
    local.get $24
    i32.mul
    i32.add
    local.get $10
    local.get $23
    i32.mul
    i32.add
    local.tee $6
    i32.const 8191
    i32.and
    i32.add
    local.get $12
    local.get $19
    i32.mul
    i32.add
    local.get $13
    local.get $18
    i32.mul
    i32.add
    local.get $7
    local.get $14
    i32.mul
    i32.add
    local.get $4
    local.get $15
    i32.mul
    i32.add
    local.set $15
    local.get $11
    local.get $23
    i32.mul
    local.get $6
    i32.const 13
    i32.shr_u
    local.get $15
    i32.const 13
    i32.shr_u
    i32.add
    local.get $3
    local.get $31
    i32.mul
    i32.add
    local.get $5
    local.get $29
    i32.mul
    i32.add
    local.get $8
    local.get $28
    i32.mul
    i32.add
    local.get $9
    local.get $26
    i32.mul
    i32.add
    local.get $10
    local.get $24
    i32.mul
    i32.add
    local.tee $6
    i32.const 8191
    i32.and
    i32.add
    local.get $12
    local.get $20
    i32.mul
    i32.add
    local.get $13
    local.get $19
    i32.mul
    i32.add
    local.get $14
    local.get $18
    i32.mul
    i32.add
    local.get $4
    local.get $7
    i32.mul
    i32.add
    local.set $7
    local.get $11
    local.get $24
    i32.mul
    local.get $6
    i32.const 13
    i32.shr_u
    local.get $7
    i32.const 13
    i32.shr_u
    i32.add
    local.get $3
    local.get $32
    i32.mul
    i32.add
    local.get $5
    local.get $31
    i32.mul
    i32.add
    local.get $8
    local.get $29
    i32.mul
    i32.add
    local.get $9
    local.get $28
    i32.mul
    i32.add
    local.get $10
    local.get $26
    i32.mul
    i32.add
    local.tee $3
    i32.const 8191
    i32.and
    i32.add
    local.get $12
    local.get $23
    i32.mul
    i32.add
    local.get $13
    local.get $20
    i32.mul
    i32.add
    local.get $14
    local.get $19
    i32.mul
    i32.add
    local.get $4
    local.get $18
    i32.mul
    i32.add
    local.set $4
    local.get $3
    i32.const 13
    i32.shr_u
    local.get $4
    i32.const 13
    i32.shr_u
    i32.add
    local.tee $3
    local.get $3
    i32.const 2
    i32.shl
    i32.add
    local.get $27
    i32.const 8191
    i32.and
    i32.add
    local.tee $5
    i32.const 8191
    i32.and
    local.set $3
    local.get $30
    i32.const 8191
    i32.and
    local.get $5
    i32.const 13
    i32.shr_u
    i32.add
    local.set $5
    local.get $25
    i32.const 8191
    i32.and
    local.set $8
    local.get $22
    i32.const 8191
    i32.and
    local.set $9
    local.get $21
    i32.const 8191
    i32.and
    local.set $10
    local.get $17
    i32.const 8191
    i32.and
    local.set $11
    local.get $16
    i32.const 8191
    i32.and
    local.set $12
    local.get $15
    i32.const 8191
    i32.and
    local.set $13
    local.get $7
    i32.const 8191
    i32.and
    local.set $14
    local.get $4
    i32.const 8191
    i32.and
    local.set $4
    local.get $1
    i32.const 16
    i32.add
    local.set $1
    local.get $2
    i32.const 16
    i32.sub
    local.set $2
    br $while-continue|0
   end
  end
  global.get $assembly/poly1305/_h
  i32.const 0
  local.get $3
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_h
  i32.const 1
  local.get $5
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_h
  i32.const 2
  local.get $8
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_h
  i32.const 3
  local.get $9
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_h
  i32.const 4
  local.get $10
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_h
  i32.const 5
  local.get $11
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_h
  i32.const 6
  local.get $12
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_h
  i32.const 7
  local.get $13
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_h
  i32.const 8
  local.get $14
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_h
  i32.const 9
  local.get $4
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
 )
 (func $assembly/poly1305/update (; 25 ;) (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  local.tee $3
  i32.load offset=8
  local.set $0
  global.get $assembly/poly1305/_leftover
  if
   i32.const 16
   global.get $assembly/poly1305/_leftover
   i32.sub
   local.tee $2
   local.get $0
   i32.gt_u
   if
    local.get $0
    local.set $2
   end
   loop $for-loop|0
    local.get $1
    local.get $2
    i32.lt_u
    if
     global.get $assembly/poly1305/_buffer
     local.get $1
     global.get $assembly/poly1305/_leftover
     i32.add
     local.get $3
     local.get $1
     call $~lib/typedarray/Uint8Array#__get
     call $~lib/typedarray/Uint8Array#__set
     local.get $1
     i32.const 1
     i32.add
     local.set $1
     br $for-loop|0
    end
   end
   local.get $0
   local.get $2
   i32.sub
   local.set $0
   local.get $2
   global.get $assembly/poly1305/_leftover
   i32.add
   global.set $assembly/poly1305/_leftover
   global.get $assembly/poly1305/_leftover
   i32.const 16
   i32.lt_u
   if
    return
   end
   global.get $assembly/poly1305/_buffer
   i32.const 0
   i32.const 16
   call $assembly/poly1305/_blocks
   i32.const 0
   global.set $assembly/poly1305/_leftover
  end
  local.get $0
  i32.const 16
  i32.ge_u
  if
   local.get $3
   local.get $2
   local.get $0
   local.get $0
   i32.const 15
   i32.and
   i32.sub
   local.tee $1
   call $assembly/poly1305/_blocks
   local.get $1
   local.get $2
   i32.add
   local.set $2
   local.get $0
   local.get $1
   i32.sub
   local.set $0
  end
  local.get $0
  if
   i32.const 0
   local.set $1
   loop $for-loop|1
    local.get $1
    local.get $0
    i32.lt_u
    if
     global.get $assembly/poly1305/_buffer
     local.get $1
     global.get $assembly/poly1305/_leftover
     i32.add
     local.get $3
     local.get $1
     local.get $2
     i32.add
     call $~lib/typedarray/Uint8Array#__get
     call $~lib/typedarray/Uint8Array#__set
     local.get $1
     i32.const 1
     i32.add
     local.set $1
     br $for-loop|1
    end
   end
   local.get $0
   global.get $assembly/poly1305/_leftover
   i32.add
   global.set $assembly/poly1305/_leftover
  end
 )
 (func $assembly/poly1305/poly1305Update (; 26 ;) (param $0 i32)
  global.get $assembly/poly1305/inputArr
  local.get $0
  call $~lib/typedarray/Uint8Array#subarray
  call $assembly/poly1305/update
 )
 (func $assembly/poly1305/finish (; 27 ;) (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  local.set $2
  i32.const 10
  call $~lib/typedarray/Uint16Array#constructor
  local.set $3
  global.get $assembly/poly1305/_leftover
  if
   global.get $assembly/poly1305/_leftover
   local.tee $1
   i32.const 1
   i32.add
   local.set $0
   global.get $assembly/poly1305/_buffer
   local.get $1
   i32.const 1
   call $~lib/typedarray/Uint8Array#__set
   loop $for-loop|0
    local.get $0
    i32.const 16
    i32.lt_u
    if
     global.get $assembly/poly1305/_buffer
     local.get $0
     i32.const 0
     call $~lib/typedarray/Uint8Array#__set
     local.get $0
     i32.const 1
     i32.add
     local.set $0
     br $for-loop|0
    end
   end
   i32.const 1
   global.set $assembly/poly1305/_fin
   global.get $assembly/poly1305/_buffer
   i32.const 0
   i32.const 16
   call $assembly/poly1305/_blocks
  end
  global.get $assembly/poly1305/_h
  i32.const 1
  call $~lib/typedarray/Uint16Array#__get
  i32.const 13
  i32.shr_u
  local.set $1
  global.get $assembly/poly1305/_h
  i32.const 1
  global.get $assembly/poly1305/_h
  i32.const 1
  call $~lib/typedarray/Uint16Array#__get
  i32.const 8191
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  i32.const 2
  local.set $0
  loop $for-loop|1
   local.get $0
   i32.const 10
   i32.lt_u
   if
    global.get $assembly/poly1305/_h
    local.get $0
    global.get $assembly/poly1305/_h
    local.get $0
    call $~lib/typedarray/Uint16Array#__get
    local.get $1
    i32.add
    call $~lib/typedarray/Uint16Array#__set
    global.get $assembly/poly1305/_h
    local.get $0
    call $~lib/typedarray/Uint16Array#__get
    i32.const 13
    i32.shr_u
    local.set $1
    global.get $assembly/poly1305/_h
    local.get $0
    global.get $assembly/poly1305/_h
    local.get $0
    call $~lib/typedarray/Uint16Array#__get
    i32.const 8191
    i32.and
    call $~lib/typedarray/Uint16Array#__set
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|1
   end
  end
  global.get $assembly/poly1305/_h
  i32.const 0
  global.get $assembly/poly1305/_h
  i32.const 0
  call $~lib/typedarray/Uint16Array#__get
  local.get $1
  i32.const 5
  i32.mul
  i32.add
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_h
  i32.const 0
  call $~lib/typedarray/Uint16Array#__get
  i32.const 13
  i32.shr_u
  local.set $0
  global.get $assembly/poly1305/_h
  i32.const 0
  global.get $assembly/poly1305/_h
  i32.const 0
  call $~lib/typedarray/Uint16Array#__get
  i32.const 8191
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_h
  i32.const 1
  global.get $assembly/poly1305/_h
  i32.const 1
  call $~lib/typedarray/Uint16Array#__get
  local.get $0
  i32.add
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_h
  i32.const 1
  call $~lib/typedarray/Uint16Array#__get
  i32.const 13
  i32.shr_u
  local.set $0
  global.get $assembly/poly1305/_h
  i32.const 1
  global.get $assembly/poly1305/_h
  i32.const 1
  call $~lib/typedarray/Uint16Array#__get
  i32.const 8191
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_h
  i32.const 2
  global.get $assembly/poly1305/_h
  i32.const 2
  call $~lib/typedarray/Uint16Array#__get
  local.get $0
  i32.add
  call $~lib/typedarray/Uint16Array#__set
  local.get $3
  i32.const 0
  global.get $assembly/poly1305/_h
  i32.const 0
  call $~lib/typedarray/Uint16Array#__get
  i32.const 5
  i32.add
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  local.get $3
  i32.const 0
  call $~lib/typedarray/Uint16Array#__get
  i32.const 13
  i32.shr_u
  local.set $1
  local.get $3
  i32.const 0
  local.get $3
  i32.const 0
  call $~lib/typedarray/Uint16Array#__get
  i32.const 8191
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  i32.const 1
  local.set $0
  loop $for-loop|2
   local.get $0
   i32.const 10
   i32.lt_u
   if
    local.get $3
    local.get $0
    global.get $assembly/poly1305/_h
    local.get $0
    call $~lib/typedarray/Uint16Array#__get
    local.get $1
    i32.add
    i32.const 65535
    i32.and
    call $~lib/typedarray/Uint16Array#__set
    local.get $3
    local.get $0
    call $~lib/typedarray/Uint16Array#__get
    i32.const 13
    i32.shr_u
    local.set $1
    local.get $3
    local.get $0
    local.get $3
    local.get $0
    call $~lib/typedarray/Uint16Array#__get
    i32.const 8191
    i32.and
    call $~lib/typedarray/Uint16Array#__set
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|2
   end
  end
  local.get $3
  i32.const 9
  local.get $3
  i32.const 9
  call $~lib/typedarray/Uint16Array#__get
  i32.const -8192
  i32.add
  call $~lib/typedarray/Uint16Array#__set
  local.get $1
  i32.const 1
  i32.xor
  i32.const 1
  i32.sub
  local.set $1
  i32.const 0
  local.set $0
  loop $for-loop|3
   local.get $0
   i32.const 10
   i32.lt_u
   if
    local.get $3
    local.get $0
    local.get $3
    local.get $0
    call $~lib/typedarray/Uint16Array#__get
    local.get $1
    i32.and
    call $~lib/typedarray/Uint16Array#__set
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|3
   end
  end
  local.get $1
  i32.const -1
  i32.xor
  local.set $1
  i32.const 0
  local.set $0
  loop $for-loop|4
   local.get $0
   i32.const 10
   i32.lt_u
   if
    global.get $assembly/poly1305/_h
    local.get $0
    global.get $assembly/poly1305/_h
    local.get $0
    call $~lib/typedarray/Uint16Array#__get
    local.get $1
    i32.and
    local.get $3
    local.get $0
    call $~lib/typedarray/Uint16Array#__get
    i32.or
    i32.const 65535
    i32.and
    call $~lib/typedarray/Uint16Array#__set
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|4
   end
  end
  global.get $assembly/poly1305/_h
  i32.const 0
  global.get $assembly/poly1305/_h
  i32.const 0
  call $~lib/typedarray/Uint16Array#__get
  global.get $assembly/poly1305/_h
  i32.const 1
  call $~lib/typedarray/Uint16Array#__get
  i32.const 13
  i32.shl
  i32.or
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_h
  i32.const 1
  global.get $assembly/poly1305/_h
  i32.const 1
  call $~lib/typedarray/Uint16Array#__get
  i32.const 3
  i32.shr_u
  global.get $assembly/poly1305/_h
  i32.const 2
  call $~lib/typedarray/Uint16Array#__get
  i32.const 10
  i32.shl
  i32.or
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_h
  i32.const 2
  global.get $assembly/poly1305/_h
  i32.const 2
  call $~lib/typedarray/Uint16Array#__get
  i32.const 6
  i32.shr_u
  global.get $assembly/poly1305/_h
  i32.const 3
  call $~lib/typedarray/Uint16Array#__get
  i32.const 7
  i32.shl
  i32.or
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_h
  i32.const 3
  global.get $assembly/poly1305/_h
  i32.const 3
  call $~lib/typedarray/Uint16Array#__get
  i32.const 9
  i32.shr_u
  global.get $assembly/poly1305/_h
  i32.const 4
  call $~lib/typedarray/Uint16Array#__get
  i32.const 4
  i32.shl
  i32.or
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_h
  i32.const 4
  global.get $assembly/poly1305/_h
  i32.const 4
  call $~lib/typedarray/Uint16Array#__get
  i32.const 12
  i32.shr_u
  global.get $assembly/poly1305/_h
  i32.const 5
  call $~lib/typedarray/Uint16Array#__get
  i32.const 1
  i32.shl
  i32.or
  global.get $assembly/poly1305/_h
  i32.const 6
  call $~lib/typedarray/Uint16Array#__get
  i32.const 14
  i32.shl
  i32.or
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_h
  i32.const 5
  global.get $assembly/poly1305/_h
  i32.const 6
  call $~lib/typedarray/Uint16Array#__get
  i32.const 2
  i32.shr_u
  global.get $assembly/poly1305/_h
  i32.const 7
  call $~lib/typedarray/Uint16Array#__get
  i32.const 11
  i32.shl
  i32.or
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_h
  i32.const 6
  global.get $assembly/poly1305/_h
  i32.const 7
  call $~lib/typedarray/Uint16Array#__get
  i32.const 5
  i32.shr_u
  global.get $assembly/poly1305/_h
  i32.const 8
  call $~lib/typedarray/Uint16Array#__get
  i32.const 8
  i32.shl
  i32.or
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_h
  i32.const 7
  global.get $assembly/poly1305/_h
  i32.const 8
  call $~lib/typedarray/Uint16Array#__get
  i32.const 8
  i32.shr_u
  global.get $assembly/poly1305/_h
  i32.const 9
  call $~lib/typedarray/Uint16Array#__get
  i32.const 5
  i32.shl
  i32.or
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_h
  i32.const 0
  call $~lib/typedarray/Uint16Array#__get
  global.get $assembly/poly1305/_pad
  i32.const 0
  call $~lib/typedarray/Uint16Array#__get
  i32.add
  local.set $1
  global.get $assembly/poly1305/_h
  i32.const 0
  local.get $1
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  i32.const 1
  local.set $0
  loop $for-loop|5
   local.get $0
   i32.const 8
   i32.lt_u
   if
    global.get $assembly/poly1305/_h
    local.get $0
    call $~lib/typedarray/Uint16Array#__get
    global.get $assembly/poly1305/_pad
    local.get $0
    call $~lib/typedarray/Uint16Array#__get
    i32.add
    local.get $1
    i32.const 16
    i32.shr_u
    i32.add
    local.set $1
    global.get $assembly/poly1305/_h
    local.get $0
    local.get $1
    i32.const 65535
    i32.and
    call $~lib/typedarray/Uint16Array#__set
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|5
   end
  end
  local.get $2
  i32.const 0
  global.get $assembly/poly1305/_h
  i32.const 0
  call $~lib/typedarray/Uint16Array#__get
  call $~lib/typedarray/Uint8Array#__set
  local.get $2
  i32.const 1
  global.get $assembly/poly1305/_h
  i32.const 0
  call $~lib/typedarray/Uint16Array#__get
  i32.const 8
  i32.shr_u
  call $~lib/typedarray/Uint8Array#__set
  local.get $2
  i32.const 2
  global.get $assembly/poly1305/_h
  i32.const 1
  call $~lib/typedarray/Uint16Array#__get
  call $~lib/typedarray/Uint8Array#__set
  local.get $2
  i32.const 3
  global.get $assembly/poly1305/_h
  i32.const 1
  call $~lib/typedarray/Uint16Array#__get
  i32.const 8
  i32.shr_u
  call $~lib/typedarray/Uint8Array#__set
  local.get $2
  i32.const 4
  global.get $assembly/poly1305/_h
  i32.const 2
  call $~lib/typedarray/Uint16Array#__get
  call $~lib/typedarray/Uint8Array#__set
  local.get $2
  i32.const 5
  global.get $assembly/poly1305/_h
  i32.const 2
  call $~lib/typedarray/Uint16Array#__get
  i32.const 8
  i32.shr_u
  call $~lib/typedarray/Uint8Array#__set
  local.get $2
  i32.const 6
  global.get $assembly/poly1305/_h
  i32.const 3
  call $~lib/typedarray/Uint16Array#__get
  call $~lib/typedarray/Uint8Array#__set
  local.get $2
  i32.const 7
  global.get $assembly/poly1305/_h
  i32.const 3
  call $~lib/typedarray/Uint16Array#__get
  i32.const 8
  i32.shr_u
  call $~lib/typedarray/Uint8Array#__set
  local.get $2
  i32.const 8
  global.get $assembly/poly1305/_h
  i32.const 4
  call $~lib/typedarray/Uint16Array#__get
  call $~lib/typedarray/Uint8Array#__set
  local.get $2
  i32.const 9
  global.get $assembly/poly1305/_h
  i32.const 4
  call $~lib/typedarray/Uint16Array#__get
  i32.const 8
  i32.shr_u
  call $~lib/typedarray/Uint8Array#__set
  local.get $2
  i32.const 10
  global.get $assembly/poly1305/_h
  i32.const 5
  call $~lib/typedarray/Uint16Array#__get
  call $~lib/typedarray/Uint8Array#__set
  local.get $2
  i32.const 11
  global.get $assembly/poly1305/_h
  i32.const 5
  call $~lib/typedarray/Uint16Array#__get
  i32.const 8
  i32.shr_u
  call $~lib/typedarray/Uint8Array#__set
  local.get $2
  i32.const 12
  global.get $assembly/poly1305/_h
  i32.const 6
  call $~lib/typedarray/Uint16Array#__get
  call $~lib/typedarray/Uint8Array#__set
  local.get $2
  i32.const 13
  global.get $assembly/poly1305/_h
  i32.const 6
  call $~lib/typedarray/Uint16Array#__get
  i32.const 8
  i32.shr_u
  call $~lib/typedarray/Uint8Array#__set
  local.get $2
  i32.const 14
  global.get $assembly/poly1305/_h
  i32.const 7
  call $~lib/typedarray/Uint16Array#__get
  call $~lib/typedarray/Uint8Array#__set
  local.get $2
  i32.const 15
  global.get $assembly/poly1305/_h
  i32.const 7
  call $~lib/typedarray/Uint16Array#__get
  i32.const 8
  i32.shr_u
  call $~lib/typedarray/Uint8Array#__set
  i32.const 1
  global.set $assembly/poly1305/_finished
 )
 (func $assembly/poly1305/wipeUint8Arr (; 28 ;) (param $0 i32)
  (local $1 i32)
  local.get $0
  local.set $1
  i32.const 0
  local.set $0
  loop $for-loop|0
   local.get $0
   local.get $1
   i32.load offset=8
   i32.lt_s
   if
    local.get $1
    local.get $0
    i32.const 0
    call $~lib/typedarray/Uint8Array#__set
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|0
   end
  end
 )
 (func $assembly/poly1305/wipeUint16Arr (; 29 ;) (param $0 i32)
  (local $1 i32)
  local.get $0
  local.set $1
  i32.const 0
  local.set $0
  loop $for-loop|0
   local.get $0
   local.get $1
   i32.load offset=8
   i32.const 1
   i32.shr_u
   i32.lt_s
   if
    local.get $1
    local.get $0
    i32.const 0
    call $~lib/typedarray/Uint16Array#__set
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|0
   end
  end
 )
 (func $assembly/poly1305/poly1305Digest (; 30 ;)
  (local $0 i32)
  global.get $assembly/poly1305/outputArr
  global.get $assembly/poly1305/_finished
  if
   i32.const 400
   i32.const 464
   i32.const 438
   i32.const 4
   call $~lib/builtins/abort
   unreachable
  end
  call $assembly/poly1305/finish
  global.get $assembly/poly1305/_buffer
  call $assembly/poly1305/wipeUint8Arr
  global.get $assembly/poly1305/_r
  call $assembly/poly1305/wipeUint16Arr
  global.get $assembly/poly1305/_h
  call $assembly/poly1305/wipeUint16Arr
  global.get $assembly/poly1305/_pad
  call $assembly/poly1305/wipeUint16Arr
  i32.const 0
  global.set $assembly/poly1305/_leftover
  i32.const 0
  global.set $assembly/poly1305/_fin
  i32.const 0
  global.set $assembly/poly1305/_finished
 )
 (func $~start (; 31 ;)
  call $start:assembly/poly1305
  call $start:assembly/chacha20
  global.get $assembly/poly1305/inputArr
  i32.load
  global.set $assembly/index/poly1305Input
  global.get $assembly/poly1305/keyArr
  i32.load
  global.set $assembly/index/poly1305Key
  global.get $assembly/poly1305/outputArr
  i32.load
  global.set $assembly/index/poly1305Output
 )
)
