(module
 (type $none_=>_none (func))
 (type $i32_i32_=>_none (func (param i32 i32)))
 (type $i32_=>_none (func (param i32)))
 (type $i32_i32_i32_=>_none (func (param i32 i32 i32)))
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (type $i32_i32_i32_i32_=>_none (func (param i32 i32 i32 i32)))
 (type $i32_i32_i32_i32_i32_=>_none (func (param i32 i32 i32 i32 i32)))
 (type $none_=>_i32 (func (result i32)))
 (type $i32_i32_=>_i32 (func (param i32 i32) (result i32)))
 (type $i32_i32_i32_i32_i32_=>_i32 (func (param i32 i32 i32 i32 i32) (result i32)))
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
 (memory $0 1)
 (data (i32.const 16) "\1c\00\00\00\01\00\00\00\01\00\00\00\1c\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00l\00e\00n\00g\00t\00h")
 (data (i32.const 64) "&\00\00\00\01\00\00\00\01\00\00\00&\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00b\00u\00f\00f\00e\00r\00.\00t\00s")
 (data (i32.const 128) "0\00\00\00\01\00\00\00\01\00\00\000\00\00\00C\00h\00a\00C\00h\00a\00:\00 \00c\00o\00u\00n\00t\00e\00r\00 \00o\00v\00e\00r\00f\00l\00o\00w")
 (data (i32.const 192) "(\00\00\00\01\00\00\00\01\00\00\00(\00\00\00a\00s\00s\00e\00m\00b\00l\00y\00/\00c\00h\00a\00c\00h\00a\002\000\00.\00t\00s")
 (data (i32.const 256) "*\00\00\00\01\00\00\00\01\00\00\00*\00\00\00P\00o\00l\00y\001\003\000\005\00 \00w\00a\00s\00 \00f\00i\00n\00i\00s\00h\00e\00d")
 (data (i32.const 320) "(\00\00\00\01\00\00\00\01\00\00\00(\00\00\00a\00s\00s\00e\00m\00b\00l\00y\00/\00p\00o\00l\00y\001\003\000\005\00.\00t\00s")
 (global $common/const/KEY_LENGTH i32 (i32.const 32))
 (global $common/const/TAG_LENGTH i32 (i32.const 16))
 (global $assembly/chacha20/CHACHA20_INPUT_LENGTH i32 (i32.const 65536))
 (global $assembly/chacha20/CHACHA20_COUNTER_LENGTH i32 (i32.const 16))
 (global $~lib/rt/stub/startOffset (mut i32) (i32.const 0))
 (global $~lib/rt/stub/offset (mut i32) (i32.const 0))
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
 (global $assembly/poly1305/debugArr (mut i32) (i32.const 0))
 (global $assembly/poly1305/debug (mut i32) (i32.const 0))
 (global $assembly/poly1305/poly1305Key (mut i32) (i32.const 0))
 (global $assembly/poly1305/poly1305Input (mut i32) (i32.const 0))
 (global $assembly/poly1305/poly1305Output (mut i32) (i32.const 0))
 (global $assembly/poly1305/poly1305KeyPtr (mut i32) (i32.const 0))
 (global $assembly/poly1305/poly1305InputPtr (mut i32) (i32.const 0))
 (global $assembly/poly1305/poly1305OutputPtr (mut i32) (i32.const 0))
 (global $assembly/poly1305/_bufferBuffer (mut i32) (i32.const 0))
 (global $assembly/poly1305/_buffer (mut i32) (i32.const 0))
 (global $assembly/poly1305/_rBuffer (mut i32) (i32.const 0))
 (global $assembly/poly1305/_r (mut i32) (i32.const 0))
 (global $assembly/poly1305/_hBuffer (mut i32) (i32.const 0))
 (global $assembly/poly1305/_h (mut i32) (i32.const 0))
 (global $assembly/poly1305/_padBuffer (mut i32) (i32.const 0))
 (global $assembly/poly1305/_pad (mut i32) (i32.const 0))
 (global $assembly/poly1305/_leftover (mut i32) (i32.const 0))
 (global $assembly/poly1305/_fin (mut i32) (i32.const 0))
 (global $assembly/poly1305/_finished (mut i32) (i32.const 0))
 (global $assembly/poly1305/tempGBuffer (mut i32) (i32.const 0))
 (global $assembly/poly1305/tempG (mut i32) (i32.const 0))
 (global $assembly/chacha20poly1305/cpKey (mut i32) (i32.const 0))
 (global $assembly/chacha20poly1305/cpKeyPtr (mut i32) (i32.const 0))
 (global $assembly/chacha20poly1305/cpNonce (mut i32) (i32.const 0))
 (global $assembly/chacha20poly1305/cpNoncePtr (mut i32) (i32.const 0))
 (global $assembly/chacha20poly1305/cpAssociatedData (mut i32) (i32.const 0))
 (global $assembly/chacha20poly1305/cpAssociatedDataPtr (mut i32) (i32.const 0))
 (global $assembly/chacha20poly1305/cpInput (mut i32) (i32.const 0))
 (global $assembly/chacha20poly1305/cpInputPtr (mut i32) (i32.const 0))
 (global $assembly/chacha20poly1305/debugArr (mut i32) (i32.const 0))
 (global $assembly/chacha20poly1305/debug (mut i32) (i32.const 0))
 (export "memory" (memory $0))
 (export "CHACHA20_INPUT_LENGTH" (global $assembly/chacha20/CHACHA20_INPUT_LENGTH))
 (export "CHACHA20_COUNTER_LENGTH" (global $assembly/chacha20/CHACHA20_COUNTER_LENGTH))
 (export "chacha20Input" (global $assembly/chacha20/chacha20Input))
 (export "chacha20Key" (global $assembly/chacha20/chacha20Key))
 (export "chacha20Counter" (global $assembly/chacha20/chacha20Counter))
 (export "chacha20Output" (global $assembly/chacha20/chacha20Output))
 (export "chacha20StreamXORUpdate" (func $assembly/chacha20/chacha20StreamXORUpdate))
 (export "KEY_LENGTH" (global $common/const/KEY_LENGTH))
 (export "TAG_LENGTH" (global $common/const/TAG_LENGTH))
 (export "poly1305Init" (func $assembly/poly1305/poly1305Init))
 (export "poly1305Update" (func $assembly/poly1305/poly1305Update))
 (export "poly1305Digest" (func $assembly/poly1305/poly1305Digest))
 (export "poly1305Input" (global $assembly/poly1305/poly1305Input))
 (export "poly1305Key" (global $assembly/poly1305/poly1305Key))
 (export "poly1305Output" (global $assembly/poly1305/poly1305Output))
 (export "openUpdate" (func $assembly/chacha20poly1305/openUpdate))
 (export "sealUpdate" (func $assembly/chacha20poly1305/sealUpdate))
 (export "cpKey" (global $assembly/chacha20poly1305/cpKey))
 (export "cpNonce" (global $assembly/chacha20poly1305/cpNonce))
 (export "cpInput" (global $assembly/chacha20poly1305/cpInput))
 (export "cpAssociatedData" (global $assembly/chacha20poly1305/cpAssociatedData))
 (export "debug" (global $assembly/chacha20poly1305/debug))
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
 (func $~lib/arraybuffer/ArrayBuffer#constructor (; 4 ;) (param $0 i32) (result i32)
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
 (func $start:assembly/chacha20 (; 5 ;)
  i32.const 384
  global.set $~lib/rt/stub/startOffset
  i32.const 384
  global.set $~lib/rt/stub/offset
  i32.const 65536
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
  i32.const 65536
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
 (func $~lib/arraybuffer/ArrayBufferView#constructor (; 6 ;) (param $0 i32) (result i32)
  (local $1 i32)
  i32.const 256
  i32.const 0
  call $~lib/rt/stub/__alloc
  local.tee $1
  i32.const 256
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
  i32.const 256
  i32.store offset=8
  local.get $0
 )
 (func $~lib/typedarray/Uint32Array#constructor (; 7 ;) (result i32)
  i32.const 12
  i32.const 3
  call $~lib/rt/stub/__alloc
  call $~lib/arraybuffer/ArrayBufferView#constructor
 )
 (func $start:assembly/poly1305 (; 8 ;)
  call $~lib/typedarray/Uint32Array#constructor
  global.set $assembly/poly1305/debugArr
  global.get $assembly/poly1305/debugArr
  i32.load
  global.set $assembly/poly1305/debug
  i32.const 32
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/poly1305/poly1305Key
  i32.const 65536
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/poly1305/poly1305Input
  i32.const 16
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/poly1305/poly1305Output
  global.get $assembly/poly1305/poly1305Key
  global.set $assembly/poly1305/poly1305KeyPtr
  global.get $assembly/poly1305/poly1305Input
  global.set $assembly/poly1305/poly1305InputPtr
  global.get $assembly/poly1305/poly1305Output
  global.set $assembly/poly1305/poly1305OutputPtr
  i32.const 16
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/poly1305/_bufferBuffer
  global.get $assembly/poly1305/_bufferBuffer
  global.set $assembly/poly1305/_buffer
  i32.const 20
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/poly1305/_rBuffer
  global.get $assembly/poly1305/_rBuffer
  global.set $assembly/poly1305/_r
  i32.const 20
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/poly1305/_hBuffer
  global.get $assembly/poly1305/_hBuffer
  global.set $assembly/poly1305/_h
  i32.const 16
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/poly1305/_padBuffer
  global.get $assembly/poly1305/_padBuffer
  global.set $assembly/poly1305/_pad
  i32.const 20
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/poly1305/tempGBuffer
  global.get $assembly/poly1305/tempGBuffer
  global.set $assembly/poly1305/tempG
 )
 (func $start:assembly/chacha20poly1305 (; 9 ;)
  i32.const 32
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/chacha20poly1305/cpKey
  global.get $assembly/chacha20poly1305/cpKey
  global.set $assembly/chacha20poly1305/cpKeyPtr
  i32.const 12
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/chacha20poly1305/cpNonce
  global.get $assembly/chacha20poly1305/cpNonce
  global.set $assembly/chacha20poly1305/cpNoncePtr
  i32.const 32
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/chacha20poly1305/cpAssociatedData
  global.get $assembly/chacha20poly1305/cpAssociatedData
  global.set $assembly/chacha20poly1305/cpAssociatedDataPtr
  i32.const 65536
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/chacha20poly1305/cpInput
  global.get $assembly/chacha20poly1305/cpInput
  global.set $assembly/chacha20poly1305/cpInputPtr
  call $~lib/typedarray/Uint32Array#constructor
  global.set $assembly/chacha20poly1305/debugArr
  global.get $assembly/chacha20poly1305/debugArr
  i32.load
  global.set $assembly/chacha20poly1305/debug
 )
 (func $assembly/util/writeUint32LE (; 10 ;) (param $0 i32) (param $1 i32) (param $2 i32)
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
 (func $assembly/chacha20/core (; 11 ;) (param $0 i32) (param $1 i32) (param $2 i32)
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
 (func $assembly/chacha20/incrementCounter (; 12 ;) (param $0 i32)
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
   i32.const 261
   i32.const 4
   call $~lib/builtins/abort
   unreachable
  end
 )
 (func $assembly/util/wipe8 (; 13 ;) (param $0 i32) (param $1 i32)
  (local $2 i32)
  loop $for-loop|0
   local.get $2
   local.get $1
   i32.lt_u
   if
    local.get $0
    local.get $2
    i32.add
    i32.const 0
    i32.store8
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $for-loop|0
   end
  end
 )
 (func $assembly/chacha20/doStreamXORUpdate (; 14 ;) (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (result i32)
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
  i32.const 64
  call $assembly/util/wipe8
  local.get $1
 )
 (func $assembly/chacha20/chacha20StreamXORUpdate (; 15 ;) (param $0 i32) (result i32)
  global.get $assembly/chacha20/chacha20InputPtr
  local.get $0
  global.get $assembly/chacha20/chacha20KeyPtr
  global.get $assembly/chacha20/chacha20CounterPtr
  global.get $assembly/chacha20/chacha20OutputPtr
  call $assembly/chacha20/doStreamXORUpdate
 )
 (func $assembly/poly1305/init (; 16 ;) (param $0 i32)
  (local $1 i32)
  global.get $assembly/poly1305/_r
  local.get $0
  i32.load8_u
  local.get $0
  i32.const 1
  i32.add
  i32.load8_u
  i32.const 8
  i32.shl
  i32.or
  local.tee $1
  i32.const 8191
  i32.and
  i32.store16
  global.get $assembly/poly1305/_r
  i32.const 2
  i32.add
  local.get $1
  i32.const 13
  i32.shr_u
  local.get $0
  i32.const 2
  i32.add
  i32.load8_u
  local.get $0
  i32.const 3
  i32.add
  i32.load8_u
  i32.const 8
  i32.shl
  i32.or
  local.tee $1
  i32.const 3
  i32.shl
  i32.or
  i32.const 8191
  i32.and
  i32.store16
  global.get $assembly/poly1305/_r
  i32.const 4
  i32.add
  local.get $1
  i32.const 10
  i32.shr_u
  local.get $0
  i32.const 4
  i32.add
  i32.load8_u
  local.get $0
  i32.const 5
  i32.add
  i32.load8_u
  i32.const 8
  i32.shl
  i32.or
  local.tee $1
  i32.const 6
  i32.shl
  i32.or
  i32.const 7939
  i32.and
  i32.store16
  global.get $assembly/poly1305/_r
  i32.const 6
  i32.add
  local.get $1
  i32.const 7
  i32.shr_u
  local.get $0
  i32.const 6
  i32.add
  i32.load8_u
  local.get $0
  i32.const 7
  i32.add
  i32.load8_u
  i32.const 8
  i32.shl
  i32.or
  local.tee $1
  i32.const 9
  i32.shl
  i32.or
  i32.const 8191
  i32.and
  i32.store16
  global.get $assembly/poly1305/_r
  i32.const 8
  i32.add
  local.get $1
  i32.const 4
  i32.shr_u
  local.get $0
  i32.const 8
  i32.add
  i32.load8_u
  local.get $0
  i32.const 9
  i32.add
  i32.load8_u
  i32.const 8
  i32.shl
  i32.or
  local.tee $1
  i32.const 12
  i32.shl
  i32.or
  i32.const 255
  i32.and
  i32.store16
  global.get $assembly/poly1305/_r
  i32.const 10
  i32.add
  local.get $1
  i32.const 1
  i32.shr_u
  i32.const 8190
  i32.and
  i32.store16
  global.get $assembly/poly1305/_r
  i32.const 12
  i32.add
  local.get $1
  i32.const 14
  i32.shr_u
  local.get $0
  i32.const 10
  i32.add
  i32.load8_u
  local.get $0
  i32.const 11
  i32.add
  i32.load8_u
  i32.const 8
  i32.shl
  i32.or
  local.tee $1
  i32.const 2
  i32.shl
  i32.or
  i32.const 8191
  i32.and
  i32.store16
  global.get $assembly/poly1305/_r
  i32.const 14
  i32.add
  local.get $1
  i32.const 11
  i32.shr_u
  local.get $0
  i32.const 12
  i32.add
  i32.load8_u
  local.get $0
  i32.const 13
  i32.add
  i32.load8_u
  i32.const 8
  i32.shl
  i32.or
  local.tee $1
  i32.const 5
  i32.shl
  i32.or
  i32.const 8065
  i32.and
  i32.store16
  global.get $assembly/poly1305/_r
  i32.const 16
  i32.add
  local.get $1
  i32.const 8
  i32.shr_u
  local.get $0
  i32.const 14
  i32.add
  i32.load8_u
  local.get $0
  i32.const 15
  i32.add
  i32.load8_u
  i32.const 8
  i32.shl
  i32.or
  local.tee $1
  i32.const 8
  i32.shl
  i32.or
  i32.const 8191
  i32.and
  i32.store16
  global.get $assembly/poly1305/_r
  i32.const 18
  i32.add
  local.get $1
  i32.const 5
  i32.shr_u
  i32.const 127
  i32.and
  i32.store16
  global.get $assembly/poly1305/_pad
  local.get $0
  i32.const 16
  i32.add
  i32.load8_u
  local.get $0
  i32.const 17
  i32.add
  i32.load8_u
  i32.const 8
  i32.shl
  i32.or
  i32.store16
  global.get $assembly/poly1305/_pad
  i32.const 2
  i32.add
  local.get $0
  i32.const 18
  i32.add
  i32.load8_u
  local.get $0
  i32.const 19
  i32.add
  i32.load8_u
  i32.const 8
  i32.shl
  i32.or
  i32.store16
  global.get $assembly/poly1305/_pad
  i32.const 4
  i32.add
  local.get $0
  i32.const 20
  i32.add
  i32.load8_u
  local.get $0
  i32.const 21
  i32.add
  i32.load8_u
  i32.const 8
  i32.shl
  i32.or
  i32.store16
  global.get $assembly/poly1305/_pad
  i32.const 6
  i32.add
  local.get $0
  i32.const 22
  i32.add
  i32.load8_u
  local.get $0
  i32.const 23
  i32.add
  i32.load8_u
  i32.const 8
  i32.shl
  i32.or
  i32.store16
  global.get $assembly/poly1305/_pad
  i32.const 8
  i32.add
  local.get $0
  i32.const 24
  i32.add
  i32.load8_u
  local.get $0
  i32.const 25
  i32.add
  i32.load8_u
  i32.const 8
  i32.shl
  i32.or
  i32.store16
  global.get $assembly/poly1305/_pad
  i32.const 10
  i32.add
  local.get $0
  i32.const 26
  i32.add
  i32.load8_u
  local.get $0
  i32.const 27
  i32.add
  i32.load8_u
  i32.const 8
  i32.shl
  i32.or
  i32.store16
  global.get $assembly/poly1305/_pad
  i32.const 12
  i32.add
  local.get $0
  i32.const 28
  i32.add
  i32.load8_u
  local.get $0
  i32.const 29
  i32.add
  i32.load8_u
  i32.const 8
  i32.shl
  i32.or
  i32.store16
  global.get $assembly/poly1305/_pad
  i32.const 14
  i32.add
  local.get $0
  i32.const 30
  i32.add
  i32.load8_u
  local.get $0
  i32.const 31
  i32.add
  i32.load8_u
  i32.const 8
  i32.shl
  i32.or
  i32.store16
 )
 (func $assembly/poly1305/poly1305Init (; 17 ;)
  global.get $assembly/poly1305/poly1305KeyPtr
  call $assembly/poly1305/init
 )
 (func $assembly/poly1305/_blocks (; 18 ;) (param $0 i32) (param $1 i32) (param $2 i32)
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
  local.set $34
  global.get $assembly/poly1305/_h
  i32.load16_u
  local.set $3
  global.get $assembly/poly1305/_h
  i32.const 2
  i32.add
  i32.load16_u
  local.set $4
  global.get $assembly/poly1305/_h
  i32.const 4
  i32.add
  i32.load16_u
  local.set $8
  global.get $assembly/poly1305/_h
  i32.const 6
  i32.add
  i32.load16_u
  local.set $9
  global.get $assembly/poly1305/_h
  i32.const 8
  i32.add
  i32.load16_u
  local.set $10
  global.get $assembly/poly1305/_h
  i32.const 10
  i32.add
  i32.load16_u
  local.set $11
  global.get $assembly/poly1305/_h
  i32.const 12
  i32.add
  i32.load16_u
  local.set $12
  global.get $assembly/poly1305/_h
  i32.const 14
  i32.add
  i32.load16_u
  local.set $13
  global.get $assembly/poly1305/_h
  i32.const 16
  i32.add
  i32.load16_u
  local.set $14
  global.get $assembly/poly1305/_h
  i32.const 18
  i32.add
  i32.load16_u
  local.set $6
  global.get $assembly/poly1305/_r
  i32.load16_u
  local.set $17
  global.get $assembly/poly1305/_r
  i32.const 2
  i32.add
  i32.load16_u
  local.set $18
  global.get $assembly/poly1305/_r
  i32.const 4
  i32.add
  i32.load16_u
  local.set $20
  global.get $assembly/poly1305/_r
  i32.const 6
  i32.add
  i32.load16_u
  local.set $22
  global.get $assembly/poly1305/_r
  i32.const 8
  i32.add
  i32.load16_u
  local.set $24
  global.get $assembly/poly1305/_r
  i32.const 10
  i32.add
  i32.load16_u
  local.set $26
  global.get $assembly/poly1305/_r
  i32.const 12
  i32.add
  i32.load16_u
  local.set $29
  global.get $assembly/poly1305/_r
  i32.const 14
  i32.add
  i32.load16_u
  local.set $30
  global.get $assembly/poly1305/_r
  i32.const 16
  i32.add
  i32.load16_u
  local.set $31
  global.get $assembly/poly1305/_r
  i32.const 18
  i32.add
  i32.load16_u
  local.set $33
  loop $while-continue|0
   local.get $2
   i32.const 16
   i32.ge_u
   if
    local.get $3
    local.get $0
    local.get $1
    i32.add
    i32.load8_u
    local.get $0
    local.get $1
    i32.const 1
    i32.add
    i32.add
    i32.load8_u
    i32.const 8
    i32.shl
    i32.or
    local.tee $15
    i32.const 8191
    i32.and
    i32.add
    local.tee $3
    local.get $17
    i32.mul
    local.get $4
    local.get $0
    local.get $1
    i32.const 2
    i32.add
    i32.add
    i32.load8_u
    local.get $0
    local.get $1
    i32.const 3
    i32.add
    i32.add
    i32.load8_u
    i32.const 8
    i32.shl
    i32.or
    local.tee $16
    i32.const 3
    i32.shl
    local.get $15
    i32.const 65535
    i32.and
    i32.const 13
    i32.shr_u
    i32.or
    i32.const 8191
    i32.and
    i32.add
    local.tee $4
    local.get $33
    i32.const 5
    i32.mul
    local.tee $15
    i32.mul
    i32.add
    local.get $8
    local.get $0
    local.get $1
    i32.const 4
    i32.add
    i32.add
    i32.load8_u
    local.get $0
    local.get $1
    i32.const 5
    i32.add
    i32.add
    i32.load8_u
    i32.const 8
    i32.shl
    i32.or
    local.tee $19
    i32.const 6
    i32.shl
    local.get $16
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
    local.tee $16
    i32.mul
    i32.add
    local.get $9
    local.get $0
    local.get $1
    i32.const 6
    i32.add
    i32.add
    i32.load8_u
    local.get $0
    local.get $1
    i32.const 7
    i32.add
    i32.add
    i32.load8_u
    i32.const 8
    i32.shl
    i32.or
    local.tee $21
    i32.const 9
    i32.shl
    local.get $19
    i32.const 65535
    i32.and
    i32.const 7
    i32.shr_u
    i32.or
    i32.const 8191
    i32.and
    i32.add
    local.tee $9
    local.get $30
    i32.const 5
    i32.mul
    local.tee $19
    i32.mul
    i32.add
    local.get $10
    local.get $0
    local.get $1
    i32.const 8
    i32.add
    i32.add
    i32.load8_u
    local.get $0
    local.get $1
    i32.const 9
    i32.add
    i32.add
    i32.load8_u
    i32.const 8
    i32.shl
    i32.or
    local.tee $23
    i32.const 12
    i32.shl
    local.get $21
    i32.const 65535
    i32.and
    i32.const 4
    i32.shr_u
    i32.or
    i32.const 8191
    i32.and
    i32.add
    local.tee $10
    local.get $29
    i32.const 5
    i32.mul
    local.tee $21
    i32.mul
    i32.add
    local.tee $32
    i32.const 8191
    i32.and
    local.get $11
    local.get $23
    i32.const 65535
    i32.and
    i32.const 1
    i32.shr_u
    i32.const 8191
    i32.and
    i32.add
    local.tee $11
    local.get $26
    i32.const 5
    i32.mul
    local.tee $27
    i32.mul
    i32.add
    local.get $12
    local.get $0
    local.get $1
    i32.const 10
    i32.add
    i32.add
    i32.load8_u
    local.get $0
    local.get $1
    i32.const 11
    i32.add
    i32.add
    i32.load8_u
    i32.const 8
    i32.shl
    i32.or
    local.tee $28
    i32.const 2
    i32.shl
    local.get $23
    i32.const 65535
    i32.and
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
    local.tee $23
    i32.mul
    i32.add
    local.get $13
    local.get $0
    local.get $1
    i32.const 12
    i32.add
    i32.add
    i32.load8_u
    local.get $0
    local.get $1
    i32.const 13
    i32.add
    i32.add
    i32.load8_u
    i32.const 8
    i32.shl
    i32.or
    local.tee $25
    i32.const 5
    i32.shl
    local.get $28
    i32.const 65535
    i32.and
    i32.const 11
    i32.shr_u
    i32.or
    i32.const 8191
    i32.and
    i32.add
    local.tee $13
    local.get $22
    i32.const 5
    i32.mul
    local.tee $28
    i32.mul
    i32.add
    local.get $14
    local.get $25
    i32.const 65535
    i32.and
    i32.const 8
    i32.shr_u
    local.get $0
    local.get $1
    i32.const 14
    i32.add
    i32.add
    i32.load8_u
    local.get $0
    local.get $1
    i32.const 15
    i32.add
    i32.add
    i32.load8_u
    i32.const 8
    i32.shl
    i32.or
    local.tee $25
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
    local.tee $7
    i32.mul
    i32.add
    local.set $5
    local.get $11
    local.get $21
    i32.mul
    local.get $32
    i32.const 13
    i32.shr_u
    local.get $5
    local.get $6
    local.get $34
    local.get $25
    i32.const 65535
    i32.and
    i32.const 5
    i32.shr_u
    i32.or
    i32.const 65535
    i32.and
    i32.add
    local.tee $6
    local.get $18
    i32.const 5
    i32.mul
    i32.mul
    i32.add
    local.tee $32
    i32.const 13
    i32.shr_u
    i32.add
    local.get $3
    local.get $18
    i32.mul
    i32.add
    local.get $4
    local.get $17
    i32.mul
    i32.add
    local.get $8
    local.get $15
    i32.mul
    i32.add
    local.get $9
    local.get $16
    i32.mul
    i32.add
    local.get $10
    local.get $19
    i32.mul
    i32.add
    local.tee $25
    i32.const 8191
    i32.and
    i32.add
    local.get $12
    local.get $27
    i32.mul
    i32.add
    local.get $13
    local.get $23
    i32.mul
    i32.add
    local.get $14
    local.get $28
    i32.mul
    i32.add
    local.set $5
    local.get $11
    local.get $19
    i32.mul
    local.get $25
    i32.const 13
    i32.shr_u
    local.get $5
    local.get $6
    local.get $7
    i32.mul
    i32.add
    local.tee $25
    i32.const 13
    i32.shr_u
    i32.add
    local.get $3
    local.get $20
    i32.mul
    i32.add
    local.get $4
    local.get $18
    i32.mul
    i32.add
    local.get $8
    local.get $17
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
    local.tee $7
    i32.const 8191
    i32.and
    i32.add
    local.get $12
    local.get $21
    i32.mul
    i32.add
    local.get $13
    local.get $27
    i32.mul
    i32.add
    local.get $14
    local.get $23
    i32.mul
    i32.add
    local.set $5
    local.get $11
    local.get $16
    i32.mul
    local.get $7
    i32.const 13
    i32.shr_u
    local.get $5
    local.get $6
    local.get $28
    i32.mul
    i32.add
    local.tee $28
    i32.const 13
    i32.shr_u
    i32.add
    local.get $3
    local.get $22
    i32.mul
    i32.add
    local.get $4
    local.get $20
    i32.mul
    i32.add
    local.get $8
    local.get $18
    i32.mul
    i32.add
    local.get $9
    local.get $17
    i32.mul
    i32.add
    local.get $10
    local.get $15
    i32.mul
    i32.add
    local.tee $7
    i32.const 8191
    i32.and
    i32.add
    local.get $12
    local.get $19
    i32.mul
    i32.add
    local.get $13
    local.get $21
    i32.mul
    i32.add
    local.get $14
    local.get $27
    i32.mul
    i32.add
    local.set $5
    local.get $11
    local.get $15
    i32.mul
    local.get $7
    i32.const 13
    i32.shr_u
    local.get $5
    local.get $6
    local.get $23
    i32.mul
    i32.add
    local.tee $23
    i32.const 13
    i32.shr_u
    i32.add
    local.get $3
    local.get $24
    i32.mul
    i32.add
    local.get $4
    local.get $22
    i32.mul
    i32.add
    local.get $8
    local.get $20
    i32.mul
    i32.add
    local.get $9
    local.get $18
    i32.mul
    i32.add
    local.get $10
    local.get $17
    i32.mul
    i32.add
    local.tee $7
    i32.const 8191
    i32.and
    i32.add
    local.get $12
    local.get $16
    i32.mul
    i32.add
    local.get $13
    local.get $19
    i32.mul
    i32.add
    local.get $14
    local.get $21
    i32.mul
    i32.add
    local.set $5
    local.get $11
    local.get $17
    i32.mul
    local.get $7
    i32.const 13
    i32.shr_u
    local.get $5
    local.get $6
    local.get $27
    i32.mul
    i32.add
    local.tee $27
    i32.const 13
    i32.shr_u
    i32.add
    local.get $3
    local.get $26
    i32.mul
    i32.add
    local.get $4
    local.get $24
    i32.mul
    i32.add
    local.get $8
    local.get $22
    i32.mul
    i32.add
    local.get $9
    local.get $20
    i32.mul
    i32.add
    local.get $10
    local.get $18
    i32.mul
    i32.add
    local.tee $7
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
    local.get $19
    i32.mul
    i32.add
    local.set $5
    local.get $11
    local.get $18
    i32.mul
    local.get $7
    i32.const 13
    i32.shr_u
    local.get $5
    local.get $6
    local.get $21
    i32.mul
    i32.add
    local.tee $21
    i32.const 13
    i32.shr_u
    i32.add
    local.get $3
    local.get $29
    i32.mul
    i32.add
    local.get $4
    local.get $26
    i32.mul
    i32.add
    local.get $8
    local.get $24
    i32.mul
    i32.add
    local.get $9
    local.get $22
    i32.mul
    i32.add
    local.get $10
    local.get $20
    i32.mul
    i32.add
    local.tee $7
    i32.const 8191
    i32.and
    i32.add
    local.get $12
    local.get $17
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
    local.set $5
    local.get $11
    local.get $20
    i32.mul
    local.get $7
    i32.const 13
    i32.shr_u
    local.get $5
    local.get $6
    local.get $19
    i32.mul
    i32.add
    local.tee $19
    i32.const 13
    i32.shr_u
    i32.add
    local.get $3
    local.get $30
    i32.mul
    i32.add
    local.get $4
    local.get $29
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
    local.get $22
    i32.mul
    i32.add
    local.tee $7
    i32.const 8191
    i32.and
    i32.add
    local.get $12
    local.get $18
    i32.mul
    i32.add
    local.get $13
    local.get $17
    i32.mul
    i32.add
    local.get $14
    local.get $15
    i32.mul
    i32.add
    local.set $5
    local.get $11
    local.get $22
    i32.mul
    local.get $7
    i32.const 13
    i32.shr_u
    local.get $5
    local.get $6
    local.get $16
    i32.mul
    i32.add
    local.tee $16
    i32.const 13
    i32.shr_u
    i32.add
    local.get $3
    local.get $31
    i32.mul
    i32.add
    local.get $4
    local.get $30
    i32.mul
    i32.add
    local.get $8
    local.get $29
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
    local.tee $7
    i32.const 8191
    i32.and
    i32.add
    local.get $12
    local.get $20
    i32.mul
    i32.add
    local.get $13
    local.get $18
    i32.mul
    i32.add
    local.get $14
    local.get $17
    i32.mul
    i32.add
    local.set $5
    local.get $11
    local.get $24
    i32.mul
    local.get $7
    i32.const 13
    i32.shr_u
    local.get $5
    local.get $6
    local.get $15
    i32.mul
    i32.add
    local.tee $15
    i32.const 13
    i32.shr_u
    i32.add
    local.get $3
    local.get $33
    i32.mul
    i32.add
    local.get $4
    local.get $31
    i32.mul
    i32.add
    local.get $8
    local.get $30
    i32.mul
    i32.add
    local.get $9
    local.get $29
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
    local.get $22
    i32.mul
    i32.add
    local.get $13
    local.get $20
    i32.mul
    i32.add
    local.get $14
    local.get $18
    i32.mul
    i32.add
    local.set $4
    local.get $3
    i32.const 13
    i32.shr_u
    local.get $4
    local.get $6
    local.get $17
    i32.mul
    i32.add
    local.tee $6
    i32.const 13
    i32.shr_u
    i32.add
    local.tee $3
    local.get $3
    i32.const 2
    i32.shl
    i32.add
    local.get $32
    i32.const 8191
    i32.and
    i32.add
    local.tee $3
    i32.const 13
    i32.shr_u
    local.set $4
    local.get $3
    i32.const 8191
    i32.and
    local.set $3
    local.get $25
    i32.const 8191
    i32.and
    local.get $4
    i32.add
    local.set $4
    local.get $28
    i32.const 8191
    i32.and
    local.set $8
    local.get $23
    i32.const 8191
    i32.and
    local.set $9
    local.get $27
    i32.const 8191
    i32.and
    local.set $10
    local.get $21
    i32.const 8191
    i32.and
    local.set $11
    local.get $19
    i32.const 8191
    i32.and
    local.set $12
    local.get $16
    i32.const 8191
    i32.and
    local.set $13
    local.get $15
    i32.const 8191
    i32.and
    local.set $14
    local.get $6
    i32.const 8191
    i32.and
    local.set $6
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
  local.get $3
  i32.store16
  global.get $assembly/poly1305/_h
  i32.const 2
  i32.add
  local.get $4
  i32.store16
  global.get $assembly/poly1305/_h
  i32.const 4
  i32.add
  local.get $8
  i32.store16
  global.get $assembly/poly1305/_h
  i32.const 6
  i32.add
  local.get $9
  i32.store16
  global.get $assembly/poly1305/_h
  i32.const 8
  i32.add
  local.get $10
  i32.store16
  global.get $assembly/poly1305/_h
  i32.const 10
  i32.add
  local.get $11
  i32.store16
  global.get $assembly/poly1305/_h
  i32.const 12
  i32.add
  local.get $12
  i32.store16
  global.get $assembly/poly1305/_h
  i32.const 14
  i32.add
  local.get $13
  i32.store16
  global.get $assembly/poly1305/_h
  i32.const 16
  i32.add
  local.get $14
  i32.store16
  global.get $assembly/poly1305/_h
  i32.const 18
  i32.add
  local.get $6
  i32.store16
 )
 (func $assembly/poly1305/update (; 19 ;) (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  global.get $assembly/poly1305/_leftover
  if
   i32.const 16
   global.get $assembly/poly1305/_leftover
   i32.sub
   local.tee $3
   local.get $1
   i32.gt_u
   if
    local.get $1
    local.set $3
   end
   loop $for-loop|0
    local.get $2
    local.get $3
    i32.lt_u
    if
     global.get $assembly/poly1305/_buffer
     local.get $2
     global.get $assembly/poly1305/_leftover
     i32.add
     i32.add
     local.get $0
     local.get $2
     i32.add
     i32.load8_u
     i32.store8
     local.get $2
     i32.const 1
     i32.add
     local.set $2
     br $for-loop|0
    end
   end
   local.get $1
   local.get $3
   i32.sub
   local.set $1
   local.get $3
   local.set $4
   local.get $3
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
  local.get $1
  i32.const 16
  i32.ge_u
  if
   local.get $0
   local.get $4
   local.get $1
   local.get $1
   i32.const 15
   i32.and
   i32.sub
   local.tee $3
   call $assembly/poly1305/_blocks
   local.get $3
   local.get $4
   i32.add
   local.set $4
   local.get $1
   local.get $3
   i32.sub
   local.set $1
  end
  local.get $1
  if
   i32.const 0
   local.set $2
   loop $for-loop|1
    local.get $2
    local.get $1
    i32.lt_u
    if
     global.get $assembly/poly1305/_buffer
     local.get $2
     global.get $assembly/poly1305/_leftover
     i32.add
     i32.add
     local.get $0
     local.get $2
     local.get $4
     i32.add
     i32.add
     i32.load8_u
     i32.store8
     local.get $2
     i32.const 1
     i32.add
     local.set $2
     br $for-loop|1
    end
   end
   local.get $1
   global.get $assembly/poly1305/_leftover
   i32.add
   global.set $assembly/poly1305/_leftover
  end
 )
 (func $assembly/poly1305/poly1305Update (; 20 ;) (param $0 i32)
  global.get $assembly/poly1305/poly1305InputPtr
  local.get $0
  call $assembly/poly1305/update
 )
 (func $assembly/poly1305/finish (; 21 ;) (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  global.get $assembly/poly1305/_leftover
  if
   global.get $assembly/poly1305/_leftover
   local.tee $1
   global.get $assembly/poly1305/_buffer
   i32.add
   i32.const 1
   i32.store8
   local.get $1
   i32.const 1
   i32.add
   local.set $1
   loop $for-loop|0
    local.get $1
    i32.const 16
    i32.lt_u
    if
     local.get $1
     global.get $assembly/poly1305/_buffer
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
   i32.const 1
   global.set $assembly/poly1305/_fin
   global.get $assembly/poly1305/_buffer
   i32.const 0
   i32.const 16
   call $assembly/poly1305/_blocks
  end
  global.get $assembly/poly1305/_h
  i32.const 2
  i32.add
  i32.load16_u
  i32.const 13
  i32.shr_u
  local.set $2
  global.get $assembly/poly1305/_h
  i32.const 2
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 2
  i32.add
  i32.load16_u
  i32.const 8191
  i32.and
  i32.store16
  i32.const 2
  local.set $1
  loop $for-loop|1
   local.get $1
   i32.const 10
   i32.lt_u
   if
    local.get $1
    i32.const 1
    i32.shl
    local.tee $3
    global.get $assembly/poly1305/_h
    i32.add
    local.get $2
    local.get $3
    global.get $assembly/poly1305/_h
    i32.add
    i32.load16_u
    i32.add
    i32.store16
    local.get $3
    global.get $assembly/poly1305/_h
    i32.add
    i32.load16_u
    i32.const 13
    i32.shr_u
    local.set $2
    local.get $3
    global.get $assembly/poly1305/_h
    i32.add
    local.get $3
    global.get $assembly/poly1305/_h
    i32.add
    i32.load16_u
    i32.const 8191
    i32.and
    i32.store16
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $for-loop|1
   end
  end
  global.get $assembly/poly1305/_h
  global.get $assembly/poly1305/_h
  i32.load16_u
  local.get $2
  i32.const 5
  i32.mul
  i32.add
  i32.store16
  global.get $assembly/poly1305/_h
  i32.load16_u
  local.set $1
  global.get $assembly/poly1305/_h
  global.get $assembly/poly1305/_h
  i32.load16_u
  i32.const 8191
  i32.and
  i32.store16
  global.get $assembly/poly1305/_h
  i32.const 2
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 2
  i32.add
  i32.load16_u
  local.get $1
  i32.const 65535
  i32.and
  i32.const 13
  i32.shr_u
  i32.add
  i32.store16
  global.get $assembly/poly1305/_h
  i32.const 2
  i32.add
  i32.load16_u
  local.set $1
  global.get $assembly/poly1305/_h
  i32.const 2
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 2
  i32.add
  i32.load16_u
  i32.const 8191
  i32.and
  i32.store16
  global.get $assembly/poly1305/_h
  i32.const 4
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 4
  i32.add
  i32.load16_u
  local.get $1
  i32.const 65535
  i32.and
  i32.const 13
  i32.shr_u
  i32.add
  i32.store16
  global.get $assembly/poly1305/tempG
  global.get $assembly/poly1305/_h
  i32.load16_u
  i32.const 5
  i32.add
  i32.store16
  global.get $assembly/poly1305/tempG
  i32.load16_u
  i32.const 13
  i32.shr_u
  local.set $2
  global.get $assembly/poly1305/tempG
  global.get $assembly/poly1305/tempG
  i32.load16_u
  i32.const 8191
  i32.and
  i32.store16
  i32.const 1
  local.set $1
  loop $for-loop|2
   local.get $1
   i32.const 10
   i32.lt_u
   if
    local.get $1
    i32.const 1
    i32.shl
    local.tee $3
    global.get $assembly/poly1305/tempG
    i32.add
    local.get $2
    local.get $3
    global.get $assembly/poly1305/_h
    i32.add
    i32.load16_u
    i32.add
    i32.store16
    local.get $3
    global.get $assembly/poly1305/tempG
    i32.add
    i32.load16_u
    i32.const 13
    i32.shr_u
    local.set $2
    local.get $3
    global.get $assembly/poly1305/tempG
    i32.add
    local.get $3
    global.get $assembly/poly1305/tempG
    i32.add
    i32.load16_u
    i32.const 8191
    i32.and
    i32.store16
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $for-loop|2
   end
  end
  global.get $assembly/poly1305/tempG
  i32.const 18
  i32.add
  global.get $assembly/poly1305/tempG
  i32.const 18
  i32.add
  i32.load16_u
  i32.const -8192
  i32.add
  i32.store16
  local.get $2
  i32.const 1
  i32.xor
  i32.const 1
  i32.sub
  local.set $2
  i32.const 0
  local.set $1
  loop $for-loop|3
   local.get $1
   i32.const 10
   i32.lt_u
   if
    local.get $1
    i32.const 1
    i32.shl
    local.tee $3
    global.get $assembly/poly1305/tempG
    i32.add
    local.get $2
    local.get $3
    global.get $assembly/poly1305/tempG
    i32.add
    i32.load16_u
    i32.and
    i32.store16
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $for-loop|3
   end
  end
  local.get $2
  i32.const -1
  i32.xor
  local.set $3
  i32.const 0
  local.set $1
  loop $for-loop|4
   local.get $1
   i32.const 10
   i32.lt_u
   if
    local.get $1
    i32.const 1
    i32.shl
    local.tee $2
    global.get $assembly/poly1305/_h
    i32.add
    local.get $2
    global.get $assembly/poly1305/tempG
    i32.add
    i32.load16_u
    local.get $3
    local.get $2
    global.get $assembly/poly1305/_h
    i32.add
    i32.load16_u
    i32.and
    i32.or
    i32.store16
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $for-loop|4
   end
  end
  global.get $assembly/poly1305/_h
  global.get $assembly/poly1305/_h
  i32.load16_u
  global.get $assembly/poly1305/_h
  i32.const 2
  i32.add
  i32.load16_u
  i32.const 13
  i32.shl
  i32.or
  i32.store16
  global.get $assembly/poly1305/_h
  i32.const 2
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 4
  i32.add
  i32.load16_u
  i32.const 10
  i32.shl
  global.get $assembly/poly1305/_h
  i32.const 2
  i32.add
  i32.load16_u
  i32.const 3
  i32.shr_u
  i32.or
  i32.store16
  global.get $assembly/poly1305/_h
  i32.const 4
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 6
  i32.add
  i32.load16_u
  i32.const 7
  i32.shl
  global.get $assembly/poly1305/_h
  i32.const 4
  i32.add
  i32.load16_u
  i32.const 6
  i32.shr_u
  i32.or
  i32.store16
  global.get $assembly/poly1305/_h
  i32.const 6
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 8
  i32.add
  i32.load16_u
  i32.const 4
  i32.shl
  global.get $assembly/poly1305/_h
  i32.const 6
  i32.add
  i32.load16_u
  i32.const 9
  i32.shr_u
  i32.or
  i32.store16
  global.get $assembly/poly1305/_h
  i32.const 8
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 10
  i32.add
  i32.load16_u
  i32.const 1
  i32.shl
  global.get $assembly/poly1305/_h
  i32.const 8
  i32.add
  i32.load16_u
  i32.const 12
  i32.shr_u
  i32.or
  global.get $assembly/poly1305/_h
  i32.const 12
  i32.add
  i32.load16_u
  i32.const 14
  i32.shl
  i32.or
  i32.store16
  global.get $assembly/poly1305/_h
  i32.const 10
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 14
  i32.add
  i32.load16_u
  i32.const 11
  i32.shl
  global.get $assembly/poly1305/_h
  i32.const 12
  i32.add
  i32.load16_u
  i32.const 2
  i32.shr_u
  i32.or
  i32.store16
  global.get $assembly/poly1305/_h
  i32.const 12
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 16
  i32.add
  i32.load16_u
  i32.const 8
  i32.shl
  global.get $assembly/poly1305/_h
  i32.const 14
  i32.add
  i32.load16_u
  i32.const 5
  i32.shr_u
  i32.or
  i32.store16
  global.get $assembly/poly1305/_h
  i32.const 14
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 18
  i32.add
  i32.load16_u
  i32.const 5
  i32.shl
  global.get $assembly/poly1305/_h
  i32.const 16
  i32.add
  i32.load16_u
  i32.const 8
  i32.shr_u
  i32.or
  i32.store16
  global.get $assembly/poly1305/_h
  global.get $assembly/poly1305/_h
  i32.load16_u
  global.get $assembly/poly1305/_pad
  i32.load16_u
  i32.add
  local.tee $2
  i32.store16
  i32.const 1
  local.set $1
  loop $for-loop|5
   local.get $1
   i32.const 8
   i32.lt_u
   if
    local.get $1
    i32.const 1
    i32.shl
    local.tee $3
    global.get $assembly/poly1305/_h
    i32.add
    i32.load16_u
    local.get $3
    global.get $assembly/poly1305/_pad
    i32.add
    i32.load16_u
    i32.add
    local.get $2
    i32.const 16
    i32.shr_u
    i32.add
    local.set $2
    global.get $assembly/poly1305/_h
    local.get $3
    i32.add
    local.get $2
    i32.store16
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $for-loop|5
   end
  end
  local.get $0
  global.get $assembly/poly1305/_h
  i32.load16_u
  i32.store8
  local.get $0
  i32.const 1
  i32.add
  global.get $assembly/poly1305/_h
  i32.load16_u
  i32.const 8
  i32.shr_u
  i32.store8
  local.get $0
  i32.const 2
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 2
  i32.add
  i32.load16_u
  i32.store8
  local.get $0
  i32.const 3
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 2
  i32.add
  i32.load16_u
  i32.const 8
  i32.shr_u
  i32.store8
  local.get $0
  i32.const 4
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 4
  i32.add
  i32.load16_u
  i32.store8
  local.get $0
  i32.const 5
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 4
  i32.add
  i32.load16_u
  i32.const 8
  i32.shr_u
  i32.store8
  local.get $0
  i32.const 6
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 6
  i32.add
  i32.load16_u
  i32.store8
  local.get $0
  i32.const 7
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 6
  i32.add
  i32.load16_u
  i32.const 8
  i32.shr_u
  i32.store8
  local.get $0
  i32.const 8
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 8
  i32.add
  i32.load16_u
  i32.store8
  local.get $0
  i32.const 9
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 8
  i32.add
  i32.load16_u
  i32.const 8
  i32.shr_u
  i32.store8
  local.get $0
  i32.const 10
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 10
  i32.add
  i32.load16_u
  i32.store8
  local.get $0
  i32.const 11
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 10
  i32.add
  i32.load16_u
  i32.const 8
  i32.shr_u
  i32.store8
  local.get $0
  i32.const 12
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 12
  i32.add
  i32.load16_u
  i32.store8
  local.get $0
  i32.const 13
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 12
  i32.add
  i32.load16_u
  i32.const 8
  i32.shr_u
  i32.store8
  local.get $0
  i32.const 14
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 14
  i32.add
  i32.load16_u
  i32.store8
  local.get $0
  i32.const 15
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 14
  i32.add
  i32.load16_u
  i32.const 8
  i32.shr_u
  i32.store8
  i32.const 1
  global.set $assembly/poly1305/_finished
 )
 (func $assembly/util/wipe16 (; 22 ;) (param $0 i32) (param $1 i32)
  (local $2 i32)
  loop $for-loop|0
   local.get $2
   local.get $1
   i32.lt_u
   if
    local.get $0
    local.get $2
    i32.const 1
    i32.shl
    i32.add
    i32.const 0
    i32.store16
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $for-loop|0
   end
  end
 )
 (func $assembly/poly1305/clean (; 23 ;)
  global.get $assembly/poly1305/_buffer
  i32.const 16
  call $assembly/util/wipe8
  global.get $assembly/poly1305/_r
  i32.const 10
  call $assembly/util/wipe16
  global.get $assembly/poly1305/_h
  i32.const 10
  call $assembly/util/wipe16
  global.get $assembly/poly1305/_pad
  i32.const 8
  call $assembly/util/wipe16
  i32.const 0
  global.set $assembly/poly1305/_leftover
  i32.const 0
  global.set $assembly/poly1305/_fin
  i32.const 0
  global.set $assembly/poly1305/_finished
 )
 (func $assembly/poly1305/poly1305Digest (; 24 ;)
  (local $0 i32)
  global.get $assembly/poly1305/poly1305OutputPtr
  global.get $assembly/poly1305/_finished
  if
   i32.const 272
   i32.const 336
   i32.const 482
   i32.const 4
   call $~lib/builtins/abort
   unreachable
  end
  call $assembly/poly1305/finish
  call $assembly/poly1305/clean
 )
 (func $assembly/chacha20/chacha20Stream (; 25 ;)
  (local $0 i32)
  loop $for-loop|0
   local.get $0
   i32.const 32
   i32.lt_u
   if
    local.get $0
    global.get $assembly/chacha20/chacha20InputPtr
    i32.add
    i32.const 0
    i32.store8
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|0
   end
  end
  i32.const 32
  call $assembly/chacha20/chacha20StreamXORUpdate
  drop
 )
 (func $assembly/chacha20poly1305/doInit (; 26 ;) (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32)
  (local $4 i32)
  loop $for-loop|0
   local.get $4
   i32.const 32
   i32.lt_s
   if
    local.get $4
    global.get $assembly/chacha20/chacha20KeyPtr
    i32.add
    local.get $0
    local.get $4
    i32.add
    i32.load8_u
    i32.store8
    local.get $4
    i32.const 1
    i32.add
    local.set $4
    br $for-loop|0
   end
  end
  i32.const 0
  local.set $4
  loop $for-loop|1
   local.get $4
   i32.const 4
   i32.lt_s
   if
    local.get $4
    global.get $assembly/chacha20/chacha20CounterPtr
    i32.add
    i32.const 0
    i32.store8
    local.get $4
    i32.const 1
    i32.add
    local.set $4
    br $for-loop|1
   end
  end
  i32.const 4
  local.set $4
  loop $for-loop|2
   local.get $4
   i32.const 16
   i32.lt_s
   if
    local.get $4
    global.get $assembly/chacha20/chacha20CounterPtr
    i32.add
    local.get $1
    local.get $4
    i32.const 4
    i32.sub
    i32.add
    i32.load8_u
    i32.store8
    local.get $4
    i32.const 1
    i32.add
    local.set $4
    br $for-loop|2
   end
  end
  call $assembly/chacha20/chacha20Stream
  i32.const 0
  local.set $4
  loop $for-loop|3
   local.get $4
   i32.const 32
   i32.lt_s
   if
    local.get $4
    global.get $assembly/poly1305/poly1305KeyPtr
    i32.add
    local.get $4
    global.get $assembly/chacha20/chacha20OutputPtr
    i32.add
    i32.load8_u
    i32.store8
    local.get $4
    i32.const 1
    i32.add
    local.set $4
    br $for-loop|3
   end
  end
  global.get $assembly/poly1305/poly1305KeyPtr
  call $assembly/poly1305/init
  local.get $3
  i32.const 0
  i32.gt_u
  if
   i32.const 0
   local.set $4
   loop $for-loop|4
    local.get $4
    local.get $3
    i32.lt_u
    if
     local.get $4
     global.get $assembly/poly1305/poly1305InputPtr
     i32.add
     local.get $2
     local.get $4
     i32.add
     i32.load8_u
     i32.store8
     local.get $4
     i32.const 1
     i32.add
     local.set $4
     br $for-loop|4
    end
   end
   local.get $3
   call $assembly/poly1305/poly1305Update
   local.get $3
   i32.const 15
   i32.and
   i32.const 0
   i32.gt_u
   if
    i32.const 16
    local.get $3
    i32.const 15
    i32.and
    i32.sub
    local.tee $1
    i32.const 0
    i32.gt_s
    if
     i32.const 0
     local.set $0
     loop $for-loop|5
      local.get $0
      local.get $1
      i32.lt_s
      if
       local.get $0
       global.get $assembly/poly1305/poly1305InputPtr
       i32.add
       i32.const 0
       i32.store8
       local.get $0
       i32.const 1
       i32.add
       local.set $0
       br $for-loop|5
      end
     end
     local.get $1
     call $assembly/poly1305/poly1305Update
    end
   end
  end
 )
 (func $assembly/chacha20poly1305/doOpenUpdate (; 27 ;) (param $0 i32) (param $1 i32)
  (local $2 i32)
  loop $for-loop|0
   local.get $2
   local.get $1
   i32.lt_u
   if
    global.get $assembly/poly1305/poly1305InputPtr
    local.get $2
    i32.add
    local.get $0
    local.get $2
    i32.add
    i32.load8_u
    i32.store8
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $for-loop|0
   end
  end
  local.get $1
  call $assembly/poly1305/poly1305Update
  i32.const 0
  local.set $2
  loop $for-loop|1
   local.get $2
   local.get $1
   i32.lt_u
   if
    global.get $assembly/chacha20/chacha20InputPtr
    local.get $2
    i32.add
    local.get $0
    local.get $2
    i32.add
    i32.load8_u
    i32.store8
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $for-loop|1
   end
  end
  local.get $1
  call $assembly/chacha20/chacha20StreamXORUpdate
  drop
 )
 (func $assembly/util/writeUint64LE (; 28 ;) (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.const 0
  call $assembly/util/writeUint32LE
  local.get $0
  i64.extend_i32_u
  i64.const 4294967296
  i64.div_s
  i32.wrap_i64
  local.get $1
  i32.const 4
  call $assembly/util/writeUint32LE
 )
 (func $assembly/chacha20poly1305/doDigest (; 29 ;) (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  i32.const 15
  i32.and
  i32.const 0
  i32.gt_u
  if
   i32.const 16
   local.get $0
   i32.const 15
   i32.and
   i32.sub
   local.tee $3
   i32.const 0
   i32.gt_s
   if
    loop $for-loop|0
     local.get $2
     local.get $3
     i32.lt_s
     if
      local.get $2
      global.get $assembly/poly1305/poly1305InputPtr
      i32.add
      i32.const 0
      i32.store8
      local.get $2
      i32.const 1
      i32.add
      local.set $2
      br $for-loop|0
     end
    end
    local.get $3
    call $assembly/poly1305/poly1305Update
   end
  end
  local.get $1
  global.get $assembly/poly1305/poly1305InputPtr
  call $assembly/util/writeUint64LE
  i32.const 8
  call $assembly/poly1305/poly1305Update
  local.get $0
  global.get $assembly/poly1305/poly1305InputPtr
  call $assembly/util/writeUint64LE
  i32.const 8
  call $assembly/poly1305/poly1305Update
  call $assembly/poly1305/poly1305Digest
 )
 (func $assembly/chacha20poly1305/openUpdate (; 30 ;) (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32)
  local.get $0
  if
   global.get $assembly/chacha20poly1305/cpKeyPtr
   global.get $assembly/chacha20poly1305/cpNoncePtr
   global.get $assembly/chacha20poly1305/cpAssociatedDataPtr
   local.get $4
   call $assembly/chacha20poly1305/doInit
  end
  global.get $assembly/chacha20poly1305/cpInputPtr
  local.get $2
  call $assembly/chacha20poly1305/doOpenUpdate
  local.get $1
  if
   local.get $3
   local.get $4
   call $assembly/chacha20poly1305/doDigest
  end
 )
 (func $assembly/chacha20poly1305/doSealUpdate (; 31 ;) (param $0 i32) (param $1 i32)
  (local $2 i32)
  loop $for-loop|0
   local.get $2
   local.get $1
   i32.lt_u
   if
    global.get $assembly/chacha20/chacha20InputPtr
    local.get $2
    i32.add
    local.get $0
    local.get $2
    i32.add
    i32.load8_u
    i32.store8
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $for-loop|0
   end
  end
  local.get $1
  call $assembly/chacha20/chacha20StreamXORUpdate
  drop
  i32.const 0
  local.set $2
  loop $for-loop|1
   local.get $2
   local.get $1
   i32.lt_u
   if
    global.get $assembly/poly1305/poly1305InputPtr
    local.get $2
    i32.add
    local.get $2
    global.get $assembly/chacha20/chacha20OutputPtr
    i32.add
    i32.load8_u
    i32.store8
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $for-loop|1
   end
  end
  local.get $1
  call $assembly/poly1305/poly1305Update
 )
 (func $assembly/chacha20poly1305/sealUpdate (; 32 ;) (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32)
  local.get $0
  if
   global.get $assembly/chacha20poly1305/cpKeyPtr
   global.get $assembly/chacha20poly1305/cpNoncePtr
   global.get $assembly/chacha20poly1305/cpAssociatedDataPtr
   local.get $4
   call $assembly/chacha20poly1305/doInit
  end
  global.get $assembly/chacha20poly1305/cpInputPtr
  local.get $2
  call $assembly/chacha20poly1305/doSealUpdate
  local.get $1
  if
   local.get $3
   local.get $4
   call $assembly/chacha20poly1305/doDigest
  end
 )
 (func $~start (; 33 ;)
  call $start:assembly/chacha20
  call $start:assembly/poly1305
  call $start:assembly/chacha20poly1305
 )
)
