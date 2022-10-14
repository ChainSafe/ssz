(module
 (type $i32_i32_i32_=>_none (func (param i32 i32 i32)))
 (type $i32_=>_none (func (param i32)))
 (type $none_=>_none (func))
 (type $i32_i32_=>_i32 (func (param i32 i32) (result i32)))
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (type $i32_i32_=>_none (func (param i32 i32)))
 (type $i32_i32_i32_=>_i32 (func (param i32 i32 i32) (result i32)))
 (type $i32_i32_i32_i32_=>_none (func (param i32 i32 i32 i32)))
 (type $i32_i32_i32_i32_i32_=>_i32 (func (param i32 i32 i32 i32 i32) (result i32)))
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
 (memory $0 1)
 (data (i32.const 16) "\1c\00\00\00\01\00\00\00\01\00\00\00\1c\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00l\00e\00n\00g\00t\00h\00")
 (data (i32.const 64) "&\00\00\00\01\00\00\00\01\00\00\00&\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00b\00u\00f\00f\00e\00r\00.\00t\00s\00")
 (data (i32.const 128) "0\00\00\00\01\00\00\00\01\00\00\000\00\00\00C\00h\00a\00C\00h\00a\00:\00 \00c\00o\00u\00n\00t\00e\00r\00 \00o\00v\00e\00r\00f\00l\00o\00w\00")
 (data (i32.const 192) "(\00\00\00\01\00\00\00\01\00\00\00(\00\00\00a\00s\00s\00e\00m\00b\00l\00y\00/\00c\00h\00a\00c\00h\00a\002\000\00.\00t\00s\00")
 (data (i32.const 256) "$\00\00\00\01\00\00\00\01\00\00\00$\00\00\00I\00n\00d\00e\00x\00 \00o\00u\00t\00 \00o\00f\00 \00r\00a\00n\00g\00e\00")
 (data (i32.const 320) "$\00\00\00\01\00\00\00\01\00\00\00$\00\00\00~\00l\00i\00b\00/\00t\00y\00p\00e\00d\00a\00r\00r\00a\00y\00.\00t\00s\00")
 (data (i32.const 384) "*\00\00\00\01\00\00\00\01\00\00\00*\00\00\00P\00o\00l\00y\001\003\000\005\00 \00w\00a\00s\00 \00f\00i\00n\00i\00s\00h\00e\00d\00")
 (data (i32.const 448) "(\00\00\00\01\00\00\00\01\00\00\00(\00\00\00a\00s\00s\00e\00m\00b\00l\00y\00/\00p\00o\00l\00y\001\003\000\005\00.\00t\00s\00")
 (table $0 1 funcref)
 (global $assembly/chacha20/ROUNDS i32 (i32.const 20))
 (global $~lib/rt/stub/startOffset (mut i32) (i32.const 0))
 (global $~lib/rt/stub/offset (mut i32) (i32.const 0))
 (global $~lib/ASC_SHRINK_LEVEL i32 (i32.const 0))
 (global $assembly/chacha20/block (mut i32) (i32.const 0))
 (global $assembly/chacha20/blockPtr (mut i32) (i32.const 0))
 (global $assembly/poly1305/_buffer (mut i32) (i32.const 0))
 (global $assembly/poly1305/_r (mut i32) (i32.const 0))
 (global $assembly/poly1305/_h (mut i32) (i32.const 0))
 (global $assembly/poly1305/_pad (mut i32) (i32.const 0))
 (global $assembly/poly1305/_leftover (mut i32) (i32.const 0))
 (global $assembly/poly1305/_fin (mut i32) (i32.const 0))
 (global $assembly/poly1305/_finished (mut i32) (i32.const 0))
 (global $assembly/poly1305/polyArr (mut i32) (i32.const 0))
 (global $assembly/index/CHACHA20_INPUT_LENGTH i32 (i32.const 512))
 (global $assembly/index/CHACHA20_KEY_LENGTH i32 (i32.const 32))
 (global $assembly/index/CHACHA20_COUNTER_LENGTH i32 (i32.const 16))
 (global $assembly/index/POLY1305_KEY_LENGTH i32 (i32.const 32))
 (global $assembly/index/POLY1305_OUTPUT_LENGTH i32 (i32.const 16))
 (global $assembly/index/POLY1305_INPUT_LENGTH i32 (i32.const 512))
 (global $assembly/index/chacha20Input (mut i32) (i32.const 0))
 (global $assembly/index/chacha20InputPtr (mut i32) (i32.const 0))
 (global $assembly/index/chacha20Key (mut i32) (i32.const 0))
 (global $assembly/index/chacha20KeyPtr (mut i32) (i32.const 0))
 (global $assembly/index/chacha20Counter (mut i32) (i32.const 0))
 (global $assembly/index/chacha20CounterPtr (mut i32) (i32.const 0))
 (global $assembly/index/chacha20Output (mut i32) (i32.const 0))
 (global $assembly/index/chacha20OutputPtr (mut i32) (i32.const 0))
 (global $assembly/index/debugArr (mut i32) (i32.const 0))
 (global $assembly/index/debug (mut i32) (i32.const 0))
 (global $assembly/index/poly1305InputArr (mut i32) (i32.const 0))
 (global $assembly/index/poly1305Input (mut i32) (i32.const 0))
 (global $assembly/index/poly1305KeyArr (mut i32) (i32.const 0))
 (global $assembly/index/poly1305Key (mut i32) (i32.const 0))
 (global $assembly/index/poly1305OutputArr (mut i32) (i32.const 0))
 (global $assembly/index/poly1305Output (mut i32) (i32.const 0))
 (global $~lib/heap/__heap_base i32 (i32.const 504))
 (export "memory" (memory $0))
 (export "CHACHA20_INPUT_LENGTH" (global $assembly/index/CHACHA20_INPUT_LENGTH))
 (export "CHACHA20_KEY_LENGTH" (global $assembly/index/CHACHA20_KEY_LENGTH))
 (export "CHACHA20_COUNTER_LENGTH" (global $assembly/index/CHACHA20_COUNTER_LENGTH))
 (export "POLY1305_KEY_LENGTH" (global $assembly/index/POLY1305_KEY_LENGTH))
 (export "POLY1305_OUTPUT_LENGTH" (global $assembly/index/POLY1305_OUTPUT_LENGTH))
 (export "POLY1305_INPUT_LENGTH" (global $assembly/index/POLY1305_INPUT_LENGTH))
 (export "chacha20Input" (global $assembly/index/chacha20Input))
 (export "chacha20Key" (global $assembly/index/chacha20Key))
 (export "chacha20Counter" (global $assembly/index/chacha20Counter))
 (export "chacha20Output" (global $assembly/index/chacha20Output))
 (export "debug" (global $assembly/index/debug))
 (export "poly1305Input" (global $assembly/index/poly1305Input))
 (export "poly1305Key" (global $assembly/index/poly1305Key))
 (export "poly1305Output" (global $assembly/index/poly1305Output))
 (export "chacha20StreamXORUpdate" (func $assembly/index/chacha20StreamXORUpdate))
 (export "poly1305Init" (func $assembly/index/poly1305Init))
 (export "poly1305Update" (func $assembly/index/poly1305Update))
 (export "poly1305Digest" (func $assembly/index/poly1305Digest))
 (start $~start)
 (func $~lib/rt/stub/maybeGrowMemory (; 1 ;) (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  memory.size
  local.set $1
  local.get $1
  i32.const 16
  i32.shl
  local.set $2
  local.get $0
  local.get $2
  i32.gt_u
  if
   local.get $0
   local.get $2
   i32.sub
   i32.const 65535
   i32.add
   i32.const 65535
   i32.const -1
   i32.xor
   i32.and
   i32.const 16
   i32.shr_u
   local.set $3
   local.get $1
   local.tee $4
   local.get $3
   local.tee $5
   local.get $4
   local.get $5
   i32.gt_s
   select
   local.set $4
   local.get $4
   memory.grow
   i32.const 0
   i32.lt_s
   if
    local.get $3
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
  (local $5 i32)
  (local $6 i32)
  local.get $0
  i32.const 1073741808
  i32.gt_u
  if
   unreachable
  end
  global.get $~lib/rt/stub/offset
  i32.const 16
  i32.add
  local.set $2
  local.get $0
  i32.const 15
  i32.add
  i32.const 15
  i32.const -1
  i32.xor
  i32.and
  local.tee $3
  i32.const 16
  local.tee $4
  local.get $3
  local.get $4
  i32.gt_u
  select
  local.set $5
  local.get $2
  local.get $5
  i32.add
  call $~lib/rt/stub/maybeGrowMemory
  local.get $2
  i32.const 16
  i32.sub
  local.set $6
  local.get $6
  local.get $5
  i32.store
  local.get $6
  i32.const 1
  i32.store offset=4
  local.get $6
  local.get $1
  i32.store offset=8
  local.get $6
  local.get $0
  i32.store offset=12
  local.get $2
 )
 (func $~lib/memory/memory.fill (; 3 ;) (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i64)
  (local $9 i32)
  block $~lib/util/memory/memset|inlined.0
   local.get $0
   local.set $5
   local.get $1
   local.set $4
   local.get $2
   local.set $3
   local.get $3
   i32.eqz
   if
    br $~lib/util/memory/memset|inlined.0
   end
   local.get $5
   local.get $4
   i32.store8
   local.get $5
   local.get $3
   i32.add
   i32.const 1
   i32.sub
   local.get $4
   i32.store8
   local.get $3
   i32.const 2
   i32.le_u
   if
    br $~lib/util/memory/memset|inlined.0
   end
   local.get $5
   i32.const 1
   i32.add
   local.get $4
   i32.store8
   local.get $5
   i32.const 2
   i32.add
   local.get $4
   i32.store8
   local.get $5
   local.get $3
   i32.add
   i32.const 2
   i32.sub
   local.get $4
   i32.store8
   local.get $5
   local.get $3
   i32.add
   i32.const 3
   i32.sub
   local.get $4
   i32.store8
   local.get $3
   i32.const 6
   i32.le_u
   if
    br $~lib/util/memory/memset|inlined.0
   end
   local.get $5
   i32.const 3
   i32.add
   local.get $4
   i32.store8
   local.get $5
   local.get $3
   i32.add
   i32.const 4
   i32.sub
   local.get $4
   i32.store8
   local.get $3
   i32.const 8
   i32.le_u
   if
    br $~lib/util/memory/memset|inlined.0
   end
   i32.const 0
   local.get $5
   i32.sub
   i32.const 3
   i32.and
   local.set $6
   local.get $5
   local.get $6
   i32.add
   local.set $5
   local.get $3
   local.get $6
   i32.sub
   local.set $3
   local.get $3
   i32.const -4
   i32.and
   local.set $3
   i32.const -1
   i32.const 255
   i32.div_u
   local.get $4
   i32.const 255
   i32.and
   i32.mul
   local.set $7
   local.get $5
   local.get $7
   i32.store
   local.get $5
   local.get $3
   i32.add
   i32.const 4
   i32.sub
   local.get $7
   i32.store
   local.get $3
   i32.const 8
   i32.le_u
   if
    br $~lib/util/memory/memset|inlined.0
   end
   local.get $5
   i32.const 4
   i32.add
   local.get $7
   i32.store
   local.get $5
   i32.const 8
   i32.add
   local.get $7
   i32.store
   local.get $5
   local.get $3
   i32.add
   i32.const 12
   i32.sub
   local.get $7
   i32.store
   local.get $5
   local.get $3
   i32.add
   i32.const 8
   i32.sub
   local.get $7
   i32.store
   local.get $3
   i32.const 24
   i32.le_u
   if
    br $~lib/util/memory/memset|inlined.0
   end
   local.get $5
   i32.const 12
   i32.add
   local.get $7
   i32.store
   local.get $5
   i32.const 16
   i32.add
   local.get $7
   i32.store
   local.get $5
   i32.const 20
   i32.add
   local.get $7
   i32.store
   local.get $5
   i32.const 24
   i32.add
   local.get $7
   i32.store
   local.get $5
   local.get $3
   i32.add
   i32.const 28
   i32.sub
   local.get $7
   i32.store
   local.get $5
   local.get $3
   i32.add
   i32.const 24
   i32.sub
   local.get $7
   i32.store
   local.get $5
   local.get $3
   i32.add
   i32.const 20
   i32.sub
   local.get $7
   i32.store
   local.get $5
   local.get $3
   i32.add
   i32.const 16
   i32.sub
   local.get $7
   i32.store
   i32.const 24
   local.get $5
   i32.const 4
   i32.and
   i32.add
   local.set $6
   local.get $5
   local.get $6
   i32.add
   local.set $5
   local.get $3
   local.get $6
   i32.sub
   local.set $3
   local.get $7
   i64.extend_i32_u
   local.get $7
   i64.extend_i32_u
   i64.const 32
   i64.shl
   i64.or
   local.set $8
   loop $while-continue|0
    local.get $3
    i32.const 32
    i32.ge_u
    local.set $9
    local.get $9
    if
     local.get $5
     local.get $8
     i64.store
     local.get $5
     i32.const 8
     i32.add
     local.get $8
     i64.store
     local.get $5
     i32.const 16
     i32.add
     local.get $8
     i64.store
     local.get $5
     i32.const 24
     i32.add
     local.get $8
     i64.store
     local.get $3
     i32.const 32
     i32.sub
     local.set $3
     local.get $5
     i32.const 32
     i32.add
     local.set $5
     br $while-continue|0
    end
   end
  end
 )
 (func $~lib/rt/stub/__retain (; 4 ;) (param $0 i32) (result i32)
  local.get $0
 )
 (func $~lib/arraybuffer/ArrayBuffer#constructor (; 5 ;) (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  local.get $1
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
  local.get $1
  i32.const 0
  call $~lib/rt/stub/__alloc
  local.set $2
  local.get $2
  i32.const 0
  local.get $1
  call $~lib/memory/memory.fill
  local.get $2
  call $~lib/rt/stub/__retain
 )
 (func $start:assembly/chacha20 (; 6 ;)
  global.get $~lib/heap/__heap_base
  i32.const 15
  i32.add
  i32.const 15
  i32.const -1
  i32.xor
  i32.and
  global.set $~lib/rt/stub/startOffset
  global.get $~lib/rt/stub/startOffset
  global.set $~lib/rt/stub/offset
  i32.const 0
  i32.const 64
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/chacha20/block
  global.get $assembly/chacha20/block
  global.set $assembly/chacha20/blockPtr
 )
 (func $~lib/rt/stub/__release (; 7 ;) (param $0 i32)
  nop
 )
 (func $~lib/arraybuffer/ArrayBufferView#constructor (; 8 ;) (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
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
  local.tee $1
  i32.const 0
  call $~lib/rt/stub/__alloc
  local.set $3
  local.get $3
  i32.const 0
  local.get $1
  call $~lib/memory/memory.fill
  local.get $0
  i32.eqz
  if
   i32.const 12
   i32.const 2
   call $~lib/rt/stub/__alloc
   call $~lib/rt/stub/__retain
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
  local.tee $4
  local.get $3
  local.tee $5
  local.get $4
  i32.load
  local.tee $6
  i32.ne
  if
   local.get $5
   call $~lib/rt/stub/__retain
   local.set $5
   local.get $6
   call $~lib/rt/stub/__release
  end
  local.get $5
  i32.store
  local.get $0
  local.get $3
  i32.store offset=4
  local.get $0
  local.get $1
  i32.store offset=8
  local.get $0
 )
 (func $~lib/typedarray/Uint8Array#constructor (; 9 ;) (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  if (result i32)
   local.get $0
  else
   i32.const 12
   i32.const 3
   call $~lib/rt/stub/__alloc
   call $~lib/rt/stub/__retain
  end
  local.get $1
  i32.const 0
  call $~lib/arraybuffer/ArrayBufferView#constructor
  local.set $0
  local.get $0
 )
 (func $~lib/typedarray/Uint16Array#constructor (; 10 ;) (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  if (result i32)
   local.get $0
  else
   i32.const 12
   i32.const 4
   call $~lib/rt/stub/__alloc
   call $~lib/rt/stub/__retain
  end
  local.get $1
  i32.const 1
  call $~lib/arraybuffer/ArrayBufferView#constructor
  local.set $0
  local.get $0
 )
 (func $~lib/typedarray/Uint32Array#constructor (; 11 ;) (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  if (result i32)
   local.get $0
  else
   i32.const 12
   i32.const 5
   call $~lib/rt/stub/__alloc
   call $~lib/rt/stub/__retain
  end
  local.get $1
  i32.const 2
  call $~lib/arraybuffer/ArrayBufferView#constructor
  local.set $0
  local.get $0
 )
 (func $start:assembly/poly1305 (; 12 ;)
  i32.const 0
  i32.const 16
  call $~lib/typedarray/Uint8Array#constructor
  global.set $assembly/poly1305/_buffer
  i32.const 0
  i32.const 10
  call $~lib/typedarray/Uint16Array#constructor
  global.set $assembly/poly1305/_r
  i32.const 0
  i32.const 10
  call $~lib/typedarray/Uint16Array#constructor
  global.set $assembly/poly1305/_h
  i32.const 0
  i32.const 8
  call $~lib/typedarray/Uint16Array#constructor
  global.set $assembly/poly1305/_pad
  i32.const 0
  i32.const 64
  call $~lib/typedarray/Uint32Array#constructor
  global.set $assembly/poly1305/polyArr
 )
 (func $start:assembly/index (; 13 ;)
  call $start:assembly/chacha20
  call $start:assembly/poly1305
  i32.const 0
  i32.const 512
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/index/chacha20Input
  global.get $assembly/index/chacha20Input
  global.set $assembly/index/chacha20InputPtr
  i32.const 0
  i32.const 32
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/index/chacha20Key
  global.get $assembly/index/chacha20Key
  global.set $assembly/index/chacha20KeyPtr
  i32.const 0
  i32.const 16
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/index/chacha20Counter
  global.get $assembly/index/chacha20Counter
  global.set $assembly/index/chacha20CounterPtr
  i32.const 0
  i32.const 512
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/index/chacha20Output
  global.get $assembly/index/chacha20Output
  global.set $assembly/index/chacha20OutputPtr
  i32.const 0
  i32.const 64
  call $~lib/typedarray/Uint32Array#constructor
  global.set $assembly/index/debugArr
  global.get $assembly/index/debugArr
  i32.load
  call $~lib/rt/stub/__retain
  global.set $assembly/index/debug
  i32.const 0
  i32.const 512
  call $~lib/typedarray/Uint8Array#constructor
  global.set $assembly/index/poly1305InputArr
  global.get $assembly/index/poly1305InputArr
  i32.load
  call $~lib/rt/stub/__retain
  global.set $assembly/index/poly1305Input
  i32.const 0
  i32.const 32
  call $~lib/typedarray/Uint8Array#constructor
  global.set $assembly/index/poly1305KeyArr
  global.get $assembly/index/poly1305KeyArr
  i32.load
  call $~lib/rt/stub/__retain
  global.set $assembly/index/poly1305Key
  i32.const 0
  i32.const 16
  call $~lib/typedarray/Uint8Array#constructor
  global.set $assembly/index/poly1305OutputArr
  global.get $assembly/index/poly1305OutputArr
  i32.load
  call $~lib/rt/stub/__retain
  global.set $assembly/index/poly1305Output
 )
 (func $assembly/util/writeUint32LE (; 14 ;) (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  local.get $1
  local.set $5
  local.get $2
  i32.const 0
  i32.add
  i32.const 255
  i32.and
  local.set $4
  local.get $0
  i32.const 0
  i32.shr_u
  local.set $3
  local.get $5
  local.get $4
  i32.add
  local.get $3
  i32.store8
  local.get $1
  local.set $5
  local.get $2
  i32.const 1
  i32.add
  i32.const 255
  i32.and
  local.set $4
  local.get $0
  i32.const 8
  i32.shr_u
  local.set $3
  local.get $5
  local.get $4
  i32.add
  local.get $3
  i32.store8
  local.get $1
  local.set $5
  local.get $2
  i32.const 2
  i32.add
  i32.const 255
  i32.and
  local.set $4
  local.get $0
  i32.const 16
  i32.shr_u
  local.set $3
  local.get $5
  local.get $4
  i32.add
  local.get $3
  i32.store8
  local.get $1
  local.set $5
  local.get $2
  i32.const 3
  i32.add
  i32.const 255
  i32.and
  local.set $4
  local.get $0
  i32.const 24
  i32.shr_u
  local.set $3
  local.get $5
  local.get $4
  i32.add
  local.get $3
  i32.store8
 )
 (func $assembly/chacha20/core (; 15 ;) (param $0 i32) (param $1 i32) (param $2 i32)
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
  local.get $2
  local.set $4
  i32.const 3
  local.set $3
  local.get $4
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 24
  i32.shl
  local.get $2
  local.set $4
  i32.const 2
  local.set $3
  local.get $4
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 16
  i32.shl
  i32.or
  local.get $2
  local.set $4
  i32.const 1
  local.set $3
  local.get $4
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 8
  i32.shl
  i32.or
  local.get $2
  local.set $4
  i32.const 0
  local.set $3
  local.get $4
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.or
  local.set $4
  local.get $2
  local.set $5
  i32.const 7
  local.set $3
  local.get $5
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 24
  i32.shl
  local.get $2
  local.set $5
  i32.const 6
  local.set $3
  local.get $5
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 16
  i32.shl
  i32.or
  local.get $2
  local.set $5
  i32.const 5
  local.set $3
  local.get $5
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 8
  i32.shl
  i32.or
  local.get $2
  local.set $5
  i32.const 4
  local.set $3
  local.get $5
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.or
  local.set $5
  local.get $2
  local.set $6
  i32.const 11
  local.set $3
  local.get $6
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 24
  i32.shl
  local.get $2
  local.set $6
  i32.const 10
  local.set $3
  local.get $6
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 16
  i32.shl
  i32.or
  local.get $2
  local.set $6
  i32.const 9
  local.set $3
  local.get $6
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 8
  i32.shl
  i32.or
  local.get $2
  local.set $6
  i32.const 8
  local.set $3
  local.get $6
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.or
  local.set $6
  local.get $2
  local.set $7
  i32.const 15
  local.set $3
  local.get $7
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 24
  i32.shl
  local.get $2
  local.set $7
  i32.const 14
  local.set $3
  local.get $7
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 16
  i32.shl
  i32.or
  local.get $2
  local.set $7
  i32.const 13
  local.set $3
  local.get $7
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 8
  i32.shl
  i32.or
  local.get $2
  local.set $7
  i32.const 12
  local.set $3
  local.get $7
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.or
  local.set $7
  local.get $2
  local.set $8
  i32.const 19
  local.set $3
  local.get $8
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 24
  i32.shl
  local.get $2
  local.set $8
  i32.const 18
  local.set $3
  local.get $8
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 16
  i32.shl
  i32.or
  local.get $2
  local.set $8
  i32.const 17
  local.set $3
  local.get $8
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 8
  i32.shl
  i32.or
  local.get $2
  local.set $8
  i32.const 16
  local.set $3
  local.get $8
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.or
  local.set $8
  local.get $2
  local.set $9
  i32.const 23
  local.set $3
  local.get $9
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 24
  i32.shl
  local.get $2
  local.set $9
  i32.const 22
  local.set $3
  local.get $9
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 16
  i32.shl
  i32.or
  local.get $2
  local.set $9
  i32.const 21
  local.set $3
  local.get $9
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 8
  i32.shl
  i32.or
  local.get $2
  local.set $9
  i32.const 20
  local.set $3
  local.get $9
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.or
  local.set $9
  local.get $2
  local.set $10
  i32.const 27
  local.set $3
  local.get $10
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 24
  i32.shl
  local.get $2
  local.set $10
  i32.const 26
  local.set $3
  local.get $10
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 16
  i32.shl
  i32.or
  local.get $2
  local.set $10
  i32.const 25
  local.set $3
  local.get $10
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 8
  i32.shl
  i32.or
  local.get $2
  local.set $10
  i32.const 24
  local.set $3
  local.get $10
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.or
  local.set $10
  local.get $2
  local.set $11
  i32.const 31
  local.set $3
  local.get $11
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 24
  i32.shl
  local.get $2
  local.set $11
  i32.const 30
  local.set $3
  local.get $11
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 16
  i32.shl
  i32.or
  local.get $2
  local.set $11
  i32.const 29
  local.set $3
  local.get $11
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 8
  i32.shl
  i32.or
  local.get $2
  local.set $11
  i32.const 28
  local.set $3
  local.get $11
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.or
  local.set $11
  local.get $1
  local.set $12
  i32.const 3
  local.set $3
  local.get $12
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 24
  i32.shl
  local.get $1
  local.set $12
  i32.const 2
  local.set $3
  local.get $12
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 16
  i32.shl
  i32.or
  local.get $1
  local.set $12
  i32.const 1
  local.set $3
  local.get $12
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 8
  i32.shl
  i32.or
  local.get $1
  local.set $12
  i32.const 0
  local.set $3
  local.get $12
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.or
  local.set $12
  local.get $1
  local.set $13
  i32.const 7
  local.set $3
  local.get $13
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 24
  i32.shl
  local.get $1
  local.set $13
  i32.const 6
  local.set $3
  local.get $13
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 16
  i32.shl
  i32.or
  local.get $1
  local.set $13
  i32.const 5
  local.set $3
  local.get $13
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 8
  i32.shl
  i32.or
  local.get $1
  local.set $13
  i32.const 4
  local.set $3
  local.get $13
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.or
  local.set $13
  local.get $1
  local.set $14
  i32.const 11
  local.set $3
  local.get $14
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 24
  i32.shl
  local.get $1
  local.set $14
  i32.const 10
  local.set $3
  local.get $14
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 16
  i32.shl
  i32.or
  local.get $1
  local.set $14
  i32.const 9
  local.set $3
  local.get $14
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 8
  i32.shl
  i32.or
  local.get $1
  local.set $14
  i32.const 8
  local.set $3
  local.get $14
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.or
  local.set $14
  local.get $1
  local.set $15
  i32.const 15
  local.set $3
  local.get $15
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 24
  i32.shl
  local.get $1
  local.set $15
  i32.const 14
  local.set $3
  local.get $15
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 16
  i32.shl
  i32.or
  local.get $1
  local.set $15
  i32.const 13
  local.set $3
  local.get $15
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.const 8
  i32.shl
  i32.or
  local.get $1
  local.set $15
  i32.const 12
  local.set $3
  local.get $15
  local.get $3
  i32.add
  i32.load8_u
  i32.const 255
  i32.and
  i32.or
  local.set $15
  i32.const 1634760805
  local.set $3
  i32.const 857760878
  local.set $16
  i32.const 2036477234
  local.set $17
  i32.const 1797285236
  local.set $18
  local.get $4
  local.set $19
  local.get $5
  local.set $20
  local.get $6
  local.set $21
  local.get $7
  local.set $22
  local.get $8
  local.set $23
  local.get $9
  local.set $24
  local.get $10
  local.set $25
  local.get $11
  local.set $26
  local.get $12
  local.set $27
  local.get $13
  local.set $28
  local.get $14
  local.set $29
  local.get $15
  local.set $30
  i32.const 0
  local.set $31
  loop $for-loop|0
   local.get $31
   i32.const 20
   i32.lt_s
   local.set $32
   local.get $32
   if
    local.get $3
    local.get $19
    i32.add
    i32.const 0
    i32.or
    local.set $3
    local.get $27
    local.get $3
    i32.xor
    local.set $27
    local.get $27
    i32.const 32
    i32.const 16
    i32.sub
    i32.shr_u
    local.get $27
    i32.const 16
    i32.shl
    i32.or
    local.set $27
    local.get $23
    local.get $27
    i32.add
    i32.const 0
    i32.or
    local.set $23
    local.get $19
    local.get $23
    i32.xor
    local.set $19
    local.get $19
    i32.const 32
    i32.const 12
    i32.sub
    i32.shr_u
    local.get $19
    i32.const 12
    i32.shl
    i32.or
    local.set $19
    local.get $16
    local.get $20
    i32.add
    i32.const 0
    i32.or
    local.set $16
    local.get $28
    local.get $16
    i32.xor
    local.set $28
    local.get $28
    i32.const 32
    i32.const 16
    i32.sub
    i32.shr_u
    local.get $28
    i32.const 16
    i32.shl
    i32.or
    local.set $28
    local.get $24
    local.get $28
    i32.add
    i32.const 0
    i32.or
    local.set $24
    local.get $20
    local.get $24
    i32.xor
    local.set $20
    local.get $20
    i32.const 32
    i32.const 12
    i32.sub
    i32.shr_u
    local.get $20
    i32.const 12
    i32.shl
    i32.or
    local.set $20
    local.get $17
    local.get $21
    i32.add
    i32.const 0
    i32.or
    local.set $17
    local.get $29
    local.get $17
    i32.xor
    local.set $29
    local.get $29
    i32.const 32
    i32.const 16
    i32.sub
    i32.shr_u
    local.get $29
    i32.const 16
    i32.shl
    i32.or
    local.set $29
    local.get $25
    local.get $29
    i32.add
    i32.const 0
    i32.or
    local.set $25
    local.get $21
    local.get $25
    i32.xor
    local.set $21
    local.get $21
    i32.const 32
    i32.const 12
    i32.sub
    i32.shr_u
    local.get $21
    i32.const 12
    i32.shl
    i32.or
    local.set $21
    local.get $18
    local.get $22
    i32.add
    i32.const 0
    i32.or
    local.set $18
    local.get $30
    local.get $18
    i32.xor
    local.set $30
    local.get $30
    i32.const 32
    i32.const 16
    i32.sub
    i32.shr_u
    local.get $30
    i32.const 16
    i32.shl
    i32.or
    local.set $30
    local.get $26
    local.get $30
    i32.add
    i32.const 0
    i32.or
    local.set $26
    local.get $22
    local.get $26
    i32.xor
    local.set $22
    local.get $22
    i32.const 32
    i32.const 12
    i32.sub
    i32.shr_u
    local.get $22
    i32.const 12
    i32.shl
    i32.or
    local.set $22
    local.get $17
    local.get $21
    i32.add
    i32.const 0
    i32.or
    local.set $17
    local.get $29
    local.get $17
    i32.xor
    local.set $29
    local.get $29
    i32.const 32
    i32.const 8
    i32.sub
    i32.shr_u
    local.get $29
    i32.const 8
    i32.shl
    i32.or
    local.set $29
    local.get $25
    local.get $29
    i32.add
    i32.const 0
    i32.or
    local.set $25
    local.get $21
    local.get $25
    i32.xor
    local.set $21
    local.get $21
    i32.const 32
    i32.const 7
    i32.sub
    i32.shr_u
    local.get $21
    i32.const 7
    i32.shl
    i32.or
    local.set $21
    local.get $18
    local.get $22
    i32.add
    i32.const 0
    i32.or
    local.set $18
    local.get $30
    local.get $18
    i32.xor
    local.set $30
    local.get $30
    i32.const 32
    i32.const 8
    i32.sub
    i32.shr_u
    local.get $30
    i32.const 8
    i32.shl
    i32.or
    local.set $30
    local.get $26
    local.get $30
    i32.add
    i32.const 0
    i32.or
    local.set $26
    local.get $22
    local.get $26
    i32.xor
    local.set $22
    local.get $22
    i32.const 32
    i32.const 7
    i32.sub
    i32.shr_u
    local.get $22
    i32.const 7
    i32.shl
    i32.or
    local.set $22
    local.get $16
    local.get $20
    i32.add
    i32.const 0
    i32.or
    local.set $16
    local.get $28
    local.get $16
    i32.xor
    local.set $28
    local.get $28
    i32.const 32
    i32.const 8
    i32.sub
    i32.shr_u
    local.get $28
    i32.const 8
    i32.shl
    i32.or
    local.set $28
    local.get $24
    local.get $28
    i32.add
    i32.const 0
    i32.or
    local.set $24
    local.get $20
    local.get $24
    i32.xor
    local.set $20
    local.get $20
    i32.const 32
    i32.const 7
    i32.sub
    i32.shr_u
    local.get $20
    i32.const 7
    i32.shl
    i32.or
    local.set $20
    local.get $3
    local.get $19
    i32.add
    i32.const 0
    i32.or
    local.set $3
    local.get $27
    local.get $3
    i32.xor
    local.set $27
    local.get $27
    i32.const 32
    i32.const 8
    i32.sub
    i32.shr_u
    local.get $27
    i32.const 8
    i32.shl
    i32.or
    local.set $27
    local.get $23
    local.get $27
    i32.add
    i32.const 0
    i32.or
    local.set $23
    local.get $19
    local.get $23
    i32.xor
    local.set $19
    local.get $19
    i32.const 32
    i32.const 7
    i32.sub
    i32.shr_u
    local.get $19
    i32.const 7
    i32.shl
    i32.or
    local.set $19
    local.get $3
    local.get $20
    i32.add
    i32.const 0
    i32.or
    local.set $3
    local.get $30
    local.get $3
    i32.xor
    local.set $30
    local.get $30
    i32.const 32
    i32.const 16
    i32.sub
    i32.shr_u
    local.get $30
    i32.const 16
    i32.shl
    i32.or
    local.set $30
    local.get $25
    local.get $30
    i32.add
    i32.const 0
    i32.or
    local.set $25
    local.get $20
    local.get $25
    i32.xor
    local.set $20
    local.get $20
    i32.const 32
    i32.const 12
    i32.sub
    i32.shr_u
    local.get $20
    i32.const 12
    i32.shl
    i32.or
    local.set $20
    local.get $16
    local.get $21
    i32.add
    i32.const 0
    i32.or
    local.set $16
    local.get $27
    local.get $16
    i32.xor
    local.set $27
    local.get $27
    i32.const 32
    i32.const 16
    i32.sub
    i32.shr_u
    local.get $27
    i32.const 16
    i32.shl
    i32.or
    local.set $27
    local.get $26
    local.get $27
    i32.add
    i32.const 0
    i32.or
    local.set $26
    local.get $21
    local.get $26
    i32.xor
    local.set $21
    local.get $21
    i32.const 32
    i32.const 12
    i32.sub
    i32.shr_u
    local.get $21
    i32.const 12
    i32.shl
    i32.or
    local.set $21
    local.get $17
    local.get $22
    i32.add
    i32.const 0
    i32.or
    local.set $17
    local.get $28
    local.get $17
    i32.xor
    local.set $28
    local.get $28
    i32.const 32
    i32.const 16
    i32.sub
    i32.shr_u
    local.get $28
    i32.const 16
    i32.shl
    i32.or
    local.set $28
    local.get $23
    local.get $28
    i32.add
    i32.const 0
    i32.or
    local.set $23
    local.get $22
    local.get $23
    i32.xor
    local.set $22
    local.get $22
    i32.const 32
    i32.const 12
    i32.sub
    i32.shr_u
    local.get $22
    i32.const 12
    i32.shl
    i32.or
    local.set $22
    local.get $18
    local.get $19
    i32.add
    i32.const 0
    i32.or
    local.set $18
    local.get $29
    local.get $18
    i32.xor
    local.set $29
    local.get $29
    i32.const 32
    i32.const 16
    i32.sub
    i32.shr_u
    local.get $29
    i32.const 16
    i32.shl
    i32.or
    local.set $29
    local.get $24
    local.get $29
    i32.add
    i32.const 0
    i32.or
    local.set $24
    local.get $19
    local.get $24
    i32.xor
    local.set $19
    local.get $19
    i32.const 32
    i32.const 12
    i32.sub
    i32.shr_u
    local.get $19
    i32.const 12
    i32.shl
    i32.or
    local.set $19
    local.get $17
    local.get $22
    i32.add
    i32.const 0
    i32.or
    local.set $17
    local.get $28
    local.get $17
    i32.xor
    local.set $28
    local.get $28
    i32.const 32
    i32.const 8
    i32.sub
    i32.shr_u
    local.get $28
    i32.const 8
    i32.shl
    i32.or
    local.set $28
    local.get $23
    local.get $28
    i32.add
    i32.const 0
    i32.or
    local.set $23
    local.get $22
    local.get $23
    i32.xor
    local.set $22
    local.get $22
    i32.const 32
    i32.const 7
    i32.sub
    i32.shr_u
    local.get $22
    i32.const 7
    i32.shl
    i32.or
    local.set $22
    local.get $18
    local.get $19
    i32.add
    i32.const 0
    i32.or
    local.set $18
    local.get $29
    local.get $18
    i32.xor
    local.set $29
    local.get $29
    i32.const 32
    i32.const 8
    i32.sub
    i32.shr_u
    local.get $29
    i32.const 8
    i32.shl
    i32.or
    local.set $29
    local.get $24
    local.get $29
    i32.add
    i32.const 0
    i32.or
    local.set $24
    local.get $19
    local.get $24
    i32.xor
    local.set $19
    local.get $19
    i32.const 32
    i32.const 7
    i32.sub
    i32.shr_u
    local.get $19
    i32.const 7
    i32.shl
    i32.or
    local.set $19
    local.get $16
    local.get $21
    i32.add
    i32.const 0
    i32.or
    local.set $16
    local.get $27
    local.get $16
    i32.xor
    local.set $27
    local.get $27
    i32.const 32
    i32.const 8
    i32.sub
    i32.shr_u
    local.get $27
    i32.const 8
    i32.shl
    i32.or
    local.set $27
    local.get $26
    local.get $27
    i32.add
    i32.const 0
    i32.or
    local.set $26
    local.get $21
    local.get $26
    i32.xor
    local.set $21
    local.get $21
    i32.const 32
    i32.const 7
    i32.sub
    i32.shr_u
    local.get $21
    i32.const 7
    i32.shl
    i32.or
    local.set $21
    local.get $3
    local.get $20
    i32.add
    i32.const 0
    i32.or
    local.set $3
    local.get $30
    local.get $3
    i32.xor
    local.set $30
    local.get $30
    i32.const 32
    i32.const 8
    i32.sub
    i32.shr_u
    local.get $30
    i32.const 8
    i32.shl
    i32.or
    local.set $30
    local.get $25
    local.get $30
    i32.add
    i32.const 0
    i32.or
    local.set $25
    local.get $20
    local.get $25
    i32.xor
    local.set $20
    local.get $20
    i32.const 32
    i32.const 7
    i32.sub
    i32.shr_u
    local.get $20
    i32.const 7
    i32.shl
    i32.or
    local.set $20
    local.get $31
    i32.const 2
    i32.add
    local.set $31
    br $for-loop|0
   end
  end
  local.get $3
  i32.const 1634760805
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 0
  call $assembly/util/writeUint32LE
  local.get $16
  i32.const 857760878
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 4
  call $assembly/util/writeUint32LE
  local.get $17
  i32.const 2036477234
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 8
  call $assembly/util/writeUint32LE
  local.get $18
  i32.const 1797285236
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 12
  call $assembly/util/writeUint32LE
  local.get $19
  local.get $4
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 16
  call $assembly/util/writeUint32LE
  local.get $20
  local.get $5
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 20
  call $assembly/util/writeUint32LE
  local.get $21
  local.get $6
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 24
  call $assembly/util/writeUint32LE
  local.get $22
  local.get $7
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 28
  call $assembly/util/writeUint32LE
  local.get $23
  local.get $8
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 32
  call $assembly/util/writeUint32LE
  local.get $24
  local.get $9
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 36
  call $assembly/util/writeUint32LE
  local.get $25
  local.get $10
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 40
  call $assembly/util/writeUint32LE
  local.get $26
  local.get $11
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 44
  call $assembly/util/writeUint32LE
  local.get $27
  local.get $12
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 48
  call $assembly/util/writeUint32LE
  local.get $28
  local.get $13
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 52
  call $assembly/util/writeUint32LE
  local.get $29
  local.get $14
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 56
  call $assembly/util/writeUint32LE
  local.get $30
  local.get $15
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 60
  call $assembly/util/writeUint32LE
 )
 (func $assembly/chacha20/incrementCounter (; 16 ;) (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  i32.const 1
  local.set $3
  loop $while-continue|0
   local.get $2
   local.tee $4
   i32.const 1
   i32.sub
   local.set $2
   local.get $4
   i32.const 255
   i32.and
   local.set $4
   local.get $4
   if
    local.get $3
    local.get $0
    local.set $6
    local.get $1
    i32.const 255
    i32.and
    local.set $5
    local.get $6
    local.get $5
    i32.add
    i32.load8_u
    i32.const 255
    i32.and
    i32.add
    i32.const 0
    i32.or
    local.set $3
    local.get $0
    local.set $7
    local.get $1
    i32.const 255
    i32.and
    local.set $6
    local.get $3
    i32.const 255
    i32.and
    local.set $5
    local.get $7
    local.get $6
    i32.add
    local.get $5
    i32.store8
    local.get $3
    i32.const 8
    i32.shr_u
    local.set $3
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $while-continue|0
   end
  end
  local.get $3
  i32.const 0
  i32.gt_s
  if
   i32.const 144
   i32.const 208
   i32.const 216
   i32.const 4
   call $~lib/builtins/abort
   unreachable
  end
 )
 (func $assembly/util/wipe (; 17 ;) (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  i32.const 0
  local.set $2
  loop $for-loop|0
   local.get $2
   local.get $1
   i32.lt_u
   local.set $3
   local.get $3
   if
    local.get $0
    local.set $6
    local.get $2
    local.set $5
    i32.const 0
    local.set $4
    local.get $6
    local.get $5
    i32.add
    local.get $4
    i32.store8
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $for-loop|0
   end
  end
 )
 (func $assembly/chacha20/doStreamXORUpdate (; 18 ;) (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (result i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  i32.const 0
  local.set $5
  loop $for-loop|0
   local.get $5
   local.get $1
   i32.lt_u
   local.set $6
   local.get $6
   if
    global.get $assembly/chacha20/blockPtr
    local.get $3
    local.get $2
    call $assembly/chacha20/core
    local.get $5
    local.set $7
    loop $for-loop|1
     local.get $7
     local.get $5
     i32.const 64
     i32.add
     i32.lt_u
     if (result i32)
      local.get $7
      local.get $1
      i32.lt_u
     else
      i32.const 0
     end
     local.set $8
     local.get $8
     if
      local.get $4
      local.set $12
      local.get $7
      local.set $11
      local.get $0
      local.set $10
      local.get $7
      local.set $9
      local.get $10
      local.get $9
      i32.add
      i32.load8_u
      global.get $assembly/chacha20/blockPtr
      local.set $10
      local.get $7
      local.get $5
      i32.sub
      local.set $9
      local.get $10
      local.get $9
      i32.add
      i32.load8_u
      i32.xor
      local.set $9
      local.get $12
      local.get $11
      i32.add
      local.get $9
      i32.store8
      local.get $7
      i32.const 1
      i32.add
      local.set $7
      br $for-loop|1
     end
    end
    local.get $3
    i32.const 0
    i32.const 4
    call $assembly/chacha20/incrementCounter
    local.get $5
    i32.const 64
    i32.add
    local.set $5
    br $for-loop|0
   end
  end
  global.get $assembly/chacha20/blockPtr
  i32.const 64
  call $assembly/util/wipe
  local.get $1
 )
 (func $assembly/index/chacha20StreamXORUpdate (; 19 ;) (param $0 i32) (result i32)
  global.get $assembly/index/chacha20InputPtr
  local.get $0
  global.get $assembly/index/chacha20KeyPtr
  global.get $assembly/index/chacha20CounterPtr
  global.get $assembly/index/chacha20OutputPtr
  call $assembly/chacha20/doStreamXORUpdate
 )
 (func $~lib/typedarray/Uint8Array#__get (; 20 ;) (param $0 i32) (param $1 i32) (result i32)
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
  local.get $0
  i32.load offset=4
  local.get $1
  i32.add
  i32.load8_u
 )
 (func $~lib/typedarray/Uint16Array#__set (; 21 ;) (param $0 i32) (param $1 i32) (param $2 i32)
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
 (func $assembly/poly1305/init (; 22 ;) (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  local.get $0
  call $~lib/rt/stub/__retain
  local.set $0
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
  local.get $1
  i32.const 65535
  i32.and
  i32.const 13
  i32.shr_u
  local.get $2
  i32.const 3
  i32.shl
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
  local.set $3
  global.get $assembly/poly1305/_r
  i32.const 2
  local.get $2
  i32.const 65535
  i32.and
  i32.const 10
  i32.shr_u
  local.get $3
  i32.const 6
  i32.shl
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
  local.set $4
  global.get $assembly/poly1305/_r
  i32.const 3
  local.get $3
  i32.const 65535
  i32.and
  i32.const 7
  i32.shr_u
  local.get $4
  i32.const 9
  i32.shl
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
  local.set $5
  global.get $assembly/poly1305/_r
  i32.const 4
  local.get $4
  i32.const 65535
  i32.and
  i32.const 4
  i32.shr_u
  local.get $5
  i32.const 12
  i32.shl
  i32.or
  i32.const 255
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_r
  i32.const 5
  local.get $5
  i32.const 65535
  i32.and
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
  local.set $6
  global.get $assembly/poly1305/_r
  i32.const 6
  local.get $5
  i32.const 65535
  i32.and
  i32.const 14
  i32.shr_u
  local.get $6
  i32.const 2
  i32.shl
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
  local.set $7
  global.get $assembly/poly1305/_r
  i32.const 7
  local.get $6
  i32.const 65535
  i32.and
  i32.const 11
  i32.shr_u
  local.get $7
  i32.const 5
  i32.shl
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
  local.set $8
  global.get $assembly/poly1305/_r
  i32.const 8
  local.get $7
  i32.const 65535
  i32.and
  i32.const 8
  i32.shr_u
  local.get $8
  i32.const 8
  i32.shl
  i32.or
  i32.const 8191
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_r
  i32.const 9
  local.get $8
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
  local.get $0
  call $~lib/rt/stub/__release
 )
 (func $assembly/index/poly1305Init (; 23 ;)
  global.get $assembly/index/poly1305KeyArr
  call $assembly/poly1305/init
 )
 (func $~lib/typedarray/Uint8Array#get:length (; 24 ;) (param $0 i32) (result i32)
  local.get $0
  i32.load offset=8
 )
 (func $~lib/typedarray/Uint8Array#subarray (; 25 ;) (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  local.get $0
  call $~lib/rt/stub/__retain
  local.set $5
  local.get $1
  local.set $4
  local.get $2
  local.set $3
  local.get $5
  call $~lib/typedarray/Uint8Array#get:length
  local.set $6
  local.get $4
  i32.const 0
  i32.lt_s
  if (result i32)
   local.get $6
   local.get $4
   i32.add
   local.tee $7
   i32.const 0
   local.tee $8
   local.get $7
   local.get $8
   i32.gt_s
   select
  else
   local.get $4
   local.tee $7
   local.get $6
   local.tee $8
   local.get $7
   local.get $8
   i32.lt_s
   select
  end
  local.set $4
  local.get $3
  i32.const 0
  i32.lt_s
  if (result i32)
   local.get $6
   local.get $3
   i32.add
   local.tee $7
   i32.const 0
   local.tee $8
   local.get $7
   local.get $8
   i32.gt_s
   select
  else
   local.get $3
   local.tee $7
   local.get $6
   local.tee $8
   local.get $7
   local.get $8
   i32.lt_s
   select
  end
  local.set $3
  local.get $3
  local.tee $7
  local.get $4
  local.tee $8
  local.get $7
  local.get $8
  i32.gt_s
  select
  local.set $3
  i32.const 12
  i32.const 3
  call $~lib/rt/stub/__alloc
  local.set $7
  local.get $7
  local.get $5
  i32.load
  call $~lib/rt/stub/__retain
  i32.store
  local.get $7
  local.get $5
  i32.load offset=4
  local.get $4
  i32.const 0
  i32.shl
  i32.add
  i32.store offset=4
  local.get $7
  local.get $3
  local.get $4
  i32.sub
  i32.const 0
  i32.shl
  i32.store offset=8
  local.get $7
  call $~lib/rt/stub/__retain
  local.set $8
  local.get $5
  call $~lib/rt/stub/__release
  local.get $8
 )
 (func $~lib/typedarray/Uint8Array#__set (; 26 ;) (param $0 i32) (param $1 i32) (param $2 i32)
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
  local.get $0
  i32.load offset=4
  local.get $1
  i32.add
  local.get $2
  i32.store8
 )
 (func $~lib/typedarray/Uint16Array#__get (; 27 ;) (param $0 i32) (param $1 i32) (result i32)
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
 (func $assembly/poly1305/_blocks (; 28 ;) (param $0 i32) (param $1 i32) (param $2 i32)
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
  (local $35 i32)
  (local $36 i32)
  (local $37 i32)
  (local $38 i32)
  (local $39 i32)
  (local $40 i32)
  (local $41 i32)
  (local $42 i32)
  (local $43 i32)
  local.get $0
  call $~lib/rt/stub/__retain
  local.set $0
  global.get $assembly/poly1305/_fin
  if (result i32)
   i32.const 0
  else
   i32.const 2048
  end
  local.set $3
  global.get $assembly/poly1305/_h
  i32.const 0
  call $~lib/typedarray/Uint16Array#__get
  local.set $4
  global.get $assembly/poly1305/_h
  i32.const 1
  call $~lib/typedarray/Uint16Array#__get
  local.set $5
  global.get $assembly/poly1305/_h
  i32.const 2
  call $~lib/typedarray/Uint16Array#__get
  local.set $6
  global.get $assembly/poly1305/_h
  i32.const 3
  call $~lib/typedarray/Uint16Array#__get
  local.set $7
  global.get $assembly/poly1305/_h
  i32.const 4
  call $~lib/typedarray/Uint16Array#__get
  local.set $8
  global.get $assembly/poly1305/_h
  i32.const 5
  call $~lib/typedarray/Uint16Array#__get
  local.set $9
  global.get $assembly/poly1305/_h
  i32.const 6
  call $~lib/typedarray/Uint16Array#__get
  local.set $10
  global.get $assembly/poly1305/_h
  i32.const 7
  call $~lib/typedarray/Uint16Array#__get
  local.set $11
  global.get $assembly/poly1305/_h
  i32.const 8
  call $~lib/typedarray/Uint16Array#__get
  local.set $12
  global.get $assembly/poly1305/_h
  i32.const 9
  call $~lib/typedarray/Uint16Array#__get
  local.set $13
  global.get $assembly/poly1305/_r
  i32.const 0
  call $~lib/typedarray/Uint16Array#__get
  local.set $14
  global.get $assembly/poly1305/_r
  i32.const 1
  call $~lib/typedarray/Uint16Array#__get
  local.set $15
  global.get $assembly/poly1305/_r
  i32.const 2
  call $~lib/typedarray/Uint16Array#__get
  local.set $16
  global.get $assembly/poly1305/_r
  i32.const 3
  call $~lib/typedarray/Uint16Array#__get
  local.set $17
  global.get $assembly/poly1305/_r
  i32.const 4
  call $~lib/typedarray/Uint16Array#__get
  local.set $18
  global.get $assembly/poly1305/_r
  i32.const 5
  call $~lib/typedarray/Uint16Array#__get
  local.set $19
  global.get $assembly/poly1305/_r
  i32.const 6
  call $~lib/typedarray/Uint16Array#__get
  local.set $20
  global.get $assembly/poly1305/_r
  i32.const 7
  call $~lib/typedarray/Uint16Array#__get
  local.set $21
  global.get $assembly/poly1305/_r
  i32.const 8
  call $~lib/typedarray/Uint16Array#__get
  local.set $22
  global.get $assembly/poly1305/_r
  i32.const 9
  call $~lib/typedarray/Uint16Array#__get
  local.set $23
  loop $while-continue|0
   local.get $2
   i32.const 16
   i32.ge_u
   local.set $24
   local.get $24
   if
    local.get $0
    local.get $1
    i32.const 0
    i32.add
    call $~lib/typedarray/Uint8Array#__get
    local.get $0
    local.get $1
    i32.const 1
    i32.add
    call $~lib/typedarray/Uint8Array#__get
    i32.const 8
    i32.shl
    i32.or
    local.set $25
    local.get $4
    local.get $25
    i32.const 8191
    i32.and
    i32.add
    local.set $4
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
    local.set $26
    local.get $5
    local.get $25
    i32.const 65535
    i32.and
    i32.const 13
    i32.shr_u
    local.get $26
    i32.const 3
    i32.shl
    i32.or
    i32.const 8191
    i32.and
    i32.add
    local.set $5
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
    local.set $27
    local.get $6
    local.get $26
    i32.const 65535
    i32.and
    i32.const 10
    i32.shr_u
    local.get $27
    i32.const 6
    i32.shl
    i32.or
    i32.const 8191
    i32.and
    i32.add
    local.set $6
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
    local.set $28
    local.get $7
    local.get $27
    i32.const 65535
    i32.and
    i32.const 7
    i32.shr_u
    local.get $28
    i32.const 9
    i32.shl
    i32.or
    i32.const 8191
    i32.and
    i32.add
    local.set $7
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
    local.set $29
    local.get $8
    local.get $28
    i32.const 65535
    i32.and
    i32.const 4
    i32.shr_u
    local.get $29
    i32.const 12
    i32.shl
    i32.or
    i32.const 8191
    i32.and
    i32.add
    local.set $8
    local.get $9
    local.get $29
    i32.const 65535
    i32.and
    i32.const 1
    i32.shr_u
    i32.const 8191
    i32.and
    i32.add
    local.set $9
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
    local.set $30
    local.get $10
    local.get $29
    i32.const 65535
    i32.and
    i32.const 14
    i32.shr_u
    local.get $30
    i32.const 2
    i32.shl
    i32.or
    i32.const 8191
    i32.and
    i32.add
    local.set $10
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
    local.set $31
    local.get $11
    local.get $30
    i32.const 65535
    i32.and
    i32.const 11
    i32.shr_u
    local.get $31
    i32.const 5
    i32.shl
    i32.or
    i32.const 8191
    i32.and
    i32.add
    local.set $11
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
    local.set $32
    local.get $12
    local.get $31
    i32.const 65535
    i32.and
    i32.const 8
    i32.shr_u
    local.get $32
    i32.const 8
    i32.shl
    i32.or
    i32.const 8191
    i32.and
    i32.add
    local.set $12
    local.get $13
    local.get $32
    i32.const 65535
    i32.and
    i32.const 5
    i32.shr_u
    local.get $3
    i32.or
    i32.const 65535
    i32.and
    i32.add
    local.set $13
    i32.const 0
    local.set $33
    local.get $33
    local.set $34
    local.get $34
    local.get $4
    local.get $14
    i32.mul
    i32.add
    local.set $34
    local.get $34
    local.get $5
    i32.const 5
    local.get $23
    i32.mul
    i32.mul
    i32.add
    local.set $34
    local.get $34
    local.get $6
    i32.const 5
    local.get $22
    i32.mul
    i32.mul
    i32.add
    local.set $34
    local.get $34
    local.get $7
    i32.const 5
    local.get $21
    i32.mul
    i32.mul
    i32.add
    local.set $34
    local.get $34
    local.get $8
    i32.const 5
    local.get $20
    i32.mul
    i32.mul
    i32.add
    local.set $34
    local.get $34
    i32.const 13
    i32.shr_u
    local.set $33
    local.get $34
    i32.const 8191
    i32.and
    local.set $34
    local.get $34
    local.get $9
    i32.const 5
    local.get $19
    i32.mul
    i32.mul
    i32.add
    local.set $34
    local.get $34
    local.get $10
    i32.const 5
    local.get $18
    i32.mul
    i32.mul
    i32.add
    local.set $34
    local.get $34
    local.get $11
    i32.const 5
    local.get $17
    i32.mul
    i32.mul
    i32.add
    local.set $34
    local.get $34
    local.get $12
    i32.const 5
    local.get $16
    i32.mul
    i32.mul
    i32.add
    local.set $34
    local.get $34
    local.get $13
    i32.const 5
    local.get $15
    i32.mul
    i32.mul
    i32.add
    local.set $34
    local.get $33
    local.get $34
    i32.const 13
    i32.shr_u
    i32.add
    local.set $33
    local.get $34
    i32.const 8191
    i32.and
    local.set $34
    local.get $33
    local.set $35
    local.get $35
    local.get $4
    local.get $15
    i32.mul
    i32.add
    local.set $35
    local.get $35
    local.get $5
    local.get $14
    i32.mul
    i32.add
    local.set $35
    local.get $35
    local.get $6
    i32.const 5
    local.get $23
    i32.mul
    i32.mul
    i32.add
    local.set $35
    local.get $35
    local.get $7
    i32.const 5
    local.get $22
    i32.mul
    i32.mul
    i32.add
    local.set $35
    local.get $35
    local.get $8
    i32.const 5
    local.get $21
    i32.mul
    i32.mul
    i32.add
    local.set $35
    local.get $35
    i32.const 13
    i32.shr_u
    local.set $33
    local.get $35
    i32.const 8191
    i32.and
    local.set $35
    local.get $35
    local.get $9
    i32.const 5
    local.get $20
    i32.mul
    i32.mul
    i32.add
    local.set $35
    local.get $35
    local.get $10
    i32.const 5
    local.get $19
    i32.mul
    i32.mul
    i32.add
    local.set $35
    local.get $35
    local.get $11
    i32.const 5
    local.get $18
    i32.mul
    i32.mul
    i32.add
    local.set $35
    local.get $35
    local.get $12
    i32.const 5
    local.get $17
    i32.mul
    i32.mul
    i32.add
    local.set $35
    local.get $35
    local.get $13
    i32.const 5
    local.get $16
    i32.mul
    i32.mul
    i32.add
    local.set $35
    local.get $33
    local.get $35
    i32.const 13
    i32.shr_u
    i32.add
    local.set $33
    local.get $35
    i32.const 8191
    i32.and
    local.set $35
    local.get $33
    local.set $36
    local.get $36
    local.get $4
    local.get $16
    i32.mul
    i32.add
    local.set $36
    local.get $36
    local.get $5
    local.get $15
    i32.mul
    i32.add
    local.set $36
    local.get $36
    local.get $6
    local.get $14
    i32.mul
    i32.add
    local.set $36
    local.get $36
    local.get $7
    i32.const 5
    local.get $23
    i32.mul
    i32.mul
    i32.add
    local.set $36
    local.get $36
    local.get $8
    i32.const 5
    local.get $22
    i32.mul
    i32.mul
    i32.add
    local.set $36
    local.get $36
    i32.const 13
    i32.shr_u
    local.set $33
    local.get $36
    i32.const 8191
    i32.and
    local.set $36
    local.get $36
    local.get $9
    i32.const 5
    local.get $21
    i32.mul
    i32.mul
    i32.add
    local.set $36
    local.get $36
    local.get $10
    i32.const 5
    local.get $20
    i32.mul
    i32.mul
    i32.add
    local.set $36
    local.get $36
    local.get $11
    i32.const 5
    local.get $19
    i32.mul
    i32.mul
    i32.add
    local.set $36
    local.get $36
    local.get $12
    i32.const 5
    local.get $18
    i32.mul
    i32.mul
    i32.add
    local.set $36
    local.get $36
    local.get $13
    i32.const 5
    local.get $17
    i32.mul
    i32.mul
    i32.add
    local.set $36
    local.get $33
    local.get $36
    i32.const 13
    i32.shr_u
    i32.add
    local.set $33
    local.get $36
    i32.const 8191
    i32.and
    local.set $36
    local.get $33
    local.set $37
    local.get $37
    local.get $4
    local.get $17
    i32.mul
    i32.add
    local.set $37
    local.get $37
    local.get $5
    local.get $16
    i32.mul
    i32.add
    local.set $37
    local.get $37
    local.get $6
    local.get $15
    i32.mul
    i32.add
    local.set $37
    local.get $37
    local.get $7
    local.get $14
    i32.mul
    i32.add
    local.set $37
    local.get $37
    local.get $8
    i32.const 5
    local.get $23
    i32.mul
    i32.mul
    i32.add
    local.set $37
    local.get $37
    i32.const 13
    i32.shr_u
    local.set $33
    local.get $37
    i32.const 8191
    i32.and
    local.set $37
    local.get $37
    local.get $9
    i32.const 5
    local.get $22
    i32.mul
    i32.mul
    i32.add
    local.set $37
    local.get $37
    local.get $10
    i32.const 5
    local.get $21
    i32.mul
    i32.mul
    i32.add
    local.set $37
    local.get $37
    local.get $11
    i32.const 5
    local.get $20
    i32.mul
    i32.mul
    i32.add
    local.set $37
    local.get $37
    local.get $12
    i32.const 5
    local.get $19
    i32.mul
    i32.mul
    i32.add
    local.set $37
    local.get $37
    local.get $13
    i32.const 5
    local.get $18
    i32.mul
    i32.mul
    i32.add
    local.set $37
    local.get $33
    local.get $37
    i32.const 13
    i32.shr_u
    i32.add
    local.set $33
    local.get $37
    i32.const 8191
    i32.and
    local.set $37
    local.get $33
    local.set $38
    local.get $38
    local.get $4
    local.get $18
    i32.mul
    i32.add
    local.set $38
    local.get $38
    local.get $5
    local.get $17
    i32.mul
    i32.add
    local.set $38
    local.get $38
    local.get $6
    local.get $16
    i32.mul
    i32.add
    local.set $38
    local.get $38
    local.get $7
    local.get $15
    i32.mul
    i32.add
    local.set $38
    local.get $38
    local.get $8
    local.get $14
    i32.mul
    i32.add
    local.set $38
    local.get $38
    i32.const 13
    i32.shr_u
    local.set $33
    local.get $38
    i32.const 8191
    i32.and
    local.set $38
    local.get $38
    local.get $9
    i32.const 5
    local.get $23
    i32.mul
    i32.mul
    i32.add
    local.set $38
    local.get $38
    local.get $10
    i32.const 5
    local.get $22
    i32.mul
    i32.mul
    i32.add
    local.set $38
    local.get $38
    local.get $11
    i32.const 5
    local.get $21
    i32.mul
    i32.mul
    i32.add
    local.set $38
    local.get $38
    local.get $12
    i32.const 5
    local.get $20
    i32.mul
    i32.mul
    i32.add
    local.set $38
    local.get $38
    local.get $13
    i32.const 5
    local.get $19
    i32.mul
    i32.mul
    i32.add
    local.set $38
    local.get $33
    local.get $38
    i32.const 13
    i32.shr_u
    i32.add
    local.set $33
    local.get $38
    i32.const 8191
    i32.and
    local.set $38
    local.get $33
    local.set $39
    local.get $39
    local.get $4
    local.get $19
    i32.mul
    i32.add
    local.set $39
    local.get $39
    local.get $5
    local.get $18
    i32.mul
    i32.add
    local.set $39
    local.get $39
    local.get $6
    local.get $17
    i32.mul
    i32.add
    local.set $39
    local.get $39
    local.get $7
    local.get $16
    i32.mul
    i32.add
    local.set $39
    local.get $39
    local.get $8
    local.get $15
    i32.mul
    i32.add
    local.set $39
    local.get $39
    i32.const 13
    i32.shr_u
    local.set $33
    local.get $39
    i32.const 8191
    i32.and
    local.set $39
    local.get $39
    local.get $9
    local.get $14
    i32.mul
    i32.add
    local.set $39
    local.get $39
    local.get $10
    i32.const 5
    local.get $23
    i32.mul
    i32.mul
    i32.add
    local.set $39
    local.get $39
    local.get $11
    i32.const 5
    local.get $22
    i32.mul
    i32.mul
    i32.add
    local.set $39
    local.get $39
    local.get $12
    i32.const 5
    local.get $21
    i32.mul
    i32.mul
    i32.add
    local.set $39
    local.get $39
    local.get $13
    i32.const 5
    local.get $20
    i32.mul
    i32.mul
    i32.add
    local.set $39
    local.get $33
    local.get $39
    i32.const 13
    i32.shr_u
    i32.add
    local.set $33
    local.get $39
    i32.const 8191
    i32.and
    local.set $39
    local.get $33
    local.set $40
    local.get $40
    local.get $4
    local.get $20
    i32.mul
    i32.add
    local.set $40
    local.get $40
    local.get $5
    local.get $19
    i32.mul
    i32.add
    local.set $40
    local.get $40
    local.get $6
    local.get $18
    i32.mul
    i32.add
    local.set $40
    local.get $40
    local.get $7
    local.get $17
    i32.mul
    i32.add
    local.set $40
    local.get $40
    local.get $8
    local.get $16
    i32.mul
    i32.add
    local.set $40
    local.get $40
    i32.const 13
    i32.shr_u
    local.set $33
    local.get $40
    i32.const 8191
    i32.and
    local.set $40
    local.get $40
    local.get $9
    local.get $15
    i32.mul
    i32.add
    local.set $40
    local.get $40
    local.get $10
    local.get $14
    i32.mul
    i32.add
    local.set $40
    local.get $40
    local.get $11
    i32.const 5
    local.get $23
    i32.mul
    i32.mul
    i32.add
    local.set $40
    local.get $40
    local.get $12
    i32.const 5
    local.get $22
    i32.mul
    i32.mul
    i32.add
    local.set $40
    local.get $40
    local.get $13
    i32.const 5
    local.get $21
    i32.mul
    i32.mul
    i32.add
    local.set $40
    local.get $33
    local.get $40
    i32.const 13
    i32.shr_u
    i32.add
    local.set $33
    local.get $40
    i32.const 8191
    i32.and
    local.set $40
    local.get $33
    local.set $41
    local.get $41
    local.get $4
    local.get $21
    i32.mul
    i32.add
    local.set $41
    local.get $41
    local.get $5
    local.get $20
    i32.mul
    i32.add
    local.set $41
    local.get $41
    local.get $6
    local.get $19
    i32.mul
    i32.add
    local.set $41
    local.get $41
    local.get $7
    local.get $18
    i32.mul
    i32.add
    local.set $41
    local.get $41
    local.get $8
    local.get $17
    i32.mul
    i32.add
    local.set $41
    local.get $41
    i32.const 13
    i32.shr_u
    local.set $33
    local.get $41
    i32.const 8191
    i32.and
    local.set $41
    local.get $41
    local.get $9
    local.get $16
    i32.mul
    i32.add
    local.set $41
    local.get $41
    local.get $10
    local.get $15
    i32.mul
    i32.add
    local.set $41
    local.get $41
    local.get $11
    local.get $14
    i32.mul
    i32.add
    local.set $41
    local.get $41
    local.get $12
    i32.const 5
    local.get $23
    i32.mul
    i32.mul
    i32.add
    local.set $41
    local.get $41
    local.get $13
    i32.const 5
    local.get $22
    i32.mul
    i32.mul
    i32.add
    local.set $41
    local.get $33
    local.get $41
    i32.const 13
    i32.shr_u
    i32.add
    local.set $33
    local.get $41
    i32.const 8191
    i32.and
    local.set $41
    local.get $33
    local.set $42
    local.get $42
    local.get $4
    local.get $22
    i32.mul
    i32.add
    local.set $42
    local.get $42
    local.get $5
    local.get $21
    i32.mul
    i32.add
    local.set $42
    local.get $42
    local.get $6
    local.get $20
    i32.mul
    i32.add
    local.set $42
    local.get $42
    local.get $7
    local.get $19
    i32.mul
    i32.add
    local.set $42
    local.get $42
    local.get $8
    local.get $18
    i32.mul
    i32.add
    local.set $42
    local.get $42
    i32.const 13
    i32.shr_u
    local.set $33
    local.get $42
    i32.const 8191
    i32.and
    local.set $42
    local.get $42
    local.get $9
    local.get $17
    i32.mul
    i32.add
    local.set $42
    local.get $42
    local.get $10
    local.get $16
    i32.mul
    i32.add
    local.set $42
    local.get $42
    local.get $11
    local.get $15
    i32.mul
    i32.add
    local.set $42
    local.get $42
    local.get $12
    local.get $14
    i32.mul
    i32.add
    local.set $42
    local.get $42
    local.get $13
    i32.const 5
    local.get $23
    i32.mul
    i32.mul
    i32.add
    local.set $42
    local.get $33
    local.get $42
    i32.const 13
    i32.shr_u
    i32.add
    local.set $33
    local.get $42
    i32.const 8191
    i32.and
    local.set $42
    local.get $33
    local.set $43
    local.get $43
    local.get $4
    local.get $23
    i32.mul
    i32.add
    local.set $43
    local.get $43
    local.get $5
    local.get $22
    i32.mul
    i32.add
    local.set $43
    local.get $43
    local.get $6
    local.get $21
    i32.mul
    i32.add
    local.set $43
    local.get $43
    local.get $7
    local.get $20
    i32.mul
    i32.add
    local.set $43
    local.get $43
    local.get $8
    local.get $19
    i32.mul
    i32.add
    local.set $43
    local.get $43
    i32.const 13
    i32.shr_u
    local.set $33
    local.get $43
    i32.const 8191
    i32.and
    local.set $43
    local.get $43
    local.get $9
    local.get $18
    i32.mul
    i32.add
    local.set $43
    local.get $43
    local.get $10
    local.get $17
    i32.mul
    i32.add
    local.set $43
    local.get $43
    local.get $11
    local.get $16
    i32.mul
    i32.add
    local.set $43
    local.get $43
    local.get $12
    local.get $15
    i32.mul
    i32.add
    local.set $43
    local.get $43
    local.get $13
    local.get $14
    i32.mul
    i32.add
    local.set $43
    local.get $33
    local.get $43
    i32.const 13
    i32.shr_u
    i32.add
    local.set $33
    local.get $43
    i32.const 8191
    i32.and
    local.set $43
    local.get $33
    i32.const 2
    i32.shl
    local.get $33
    i32.add
    i32.const 0
    i32.or
    local.set $33
    local.get $33
    local.get $34
    i32.add
    i32.const 0
    i32.or
    local.set $33
    local.get $33
    i32.const 8191
    i32.and
    local.set $34
    local.get $33
    i32.const 13
    i32.shr_u
    local.set $33
    local.get $35
    local.get $33
    i32.add
    local.set $35
    local.get $34
    local.set $4
    local.get $35
    local.set $5
    local.get $36
    local.set $6
    local.get $37
    local.set $7
    local.get $38
    local.set $8
    local.get $39
    local.set $9
    local.get $40
    local.set $10
    local.get $41
    local.set $11
    local.get $42
    local.set $12
    local.get $43
    local.set $13
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
  local.get $4
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
  local.get $6
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_h
  i32.const 3
  local.get $7
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_h
  i32.const 4
  local.get $8
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_h
  i32.const 5
  local.get $9
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_h
  i32.const 6
  local.get $10
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_h
  i32.const 7
  local.get $11
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_h
  i32.const 8
  local.get $12
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_h
  i32.const 9
  local.get $13
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  local.get $0
  call $~lib/rt/stub/__release
 )
 (func $assembly/poly1305/update (; 29 ;) (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  local.get $0
  call $~lib/rt/stub/__retain
  local.set $0
  i32.const 0
  local.set $1
  local.get $0
  call $~lib/typedarray/Uint8Array#get:length
  local.set $2
  global.get $assembly/poly1305/_leftover
  if
   i32.const 16
   global.get $assembly/poly1305/_leftover
   i32.sub
   local.set $3
   local.get $3
   local.get $2
   i32.gt_u
   if
    local.get $2
    local.set $3
   end
   i32.const 0
   local.set $4
   loop $for-loop|0
    local.get $4
    local.get $3
    i32.lt_u
    local.set $5
    local.get $5
    if
     global.get $assembly/poly1305/_buffer
     global.get $assembly/poly1305/_leftover
     local.get $4
     i32.add
     local.get $0
     local.get $1
     local.get $4
     i32.add
     call $~lib/typedarray/Uint8Array#__get
     call $~lib/typedarray/Uint8Array#__set
     local.get $4
     i32.const 1
     i32.add
     local.set $4
     br $for-loop|0
    end
   end
   local.get $2
   local.get $3
   i32.sub
   local.set $2
   local.get $1
   local.get $3
   i32.add
   local.set $1
   global.get $assembly/poly1305/_leftover
   local.get $3
   i32.add
   global.set $assembly/poly1305/_leftover
   global.get $assembly/poly1305/_leftover
   i32.const 16
   i32.lt_u
   if
    local.get $0
    call $~lib/rt/stub/__release
    return
   end
   global.get $assembly/poly1305/_buffer
   i32.const 0
   i32.const 16
   call $assembly/poly1305/_blocks
   i32.const 0
   global.set $assembly/poly1305/_leftover
  end
  local.get $2
  i32.const 16
  i32.ge_u
  if
   local.get $2
   local.get $2
   i32.const 16
   i32.rem_u
   i32.sub
   local.set $3
   local.get $0
   local.get $1
   local.get $3
   call $assembly/poly1305/_blocks
   local.get $1
   local.get $3
   i32.add
   local.set $1
   local.get $2
   local.get $3
   i32.sub
   local.set $2
  end
  local.get $2
  if
   i32.const 0
   local.set $4
   loop $for-loop|1
    local.get $4
    local.get $2
    i32.lt_u
    local.set $5
    local.get $5
    if
     global.get $assembly/poly1305/_buffer
     global.get $assembly/poly1305/_leftover
     local.get $4
     i32.add
     local.get $0
     local.get $1
     local.get $4
     i32.add
     call $~lib/typedarray/Uint8Array#__get
     call $~lib/typedarray/Uint8Array#__set
     local.get $4
     i32.const 1
     i32.add
     local.set $4
     br $for-loop|1
    end
   end
   global.get $assembly/poly1305/_leftover
   local.get $2
   i32.add
   global.set $assembly/poly1305/_leftover
  end
  local.get $0
  call $~lib/rt/stub/__release
 )
 (func $assembly/index/poly1305Update (; 30 ;) (param $0 i32)
  (local $1 i32)
  global.get $assembly/index/poly1305InputArr
  i32.const 0
  local.get $0
  call $~lib/typedarray/Uint8Array#subarray
  local.tee $1
  call $assembly/poly1305/update
  local.get $1
  call $~lib/rt/stub/__release
 )
 (func $assembly/poly1305/finish (; 31 ;) (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  local.get $0
  call $~lib/rt/stub/__retain
  local.set $0
  i32.const 0
  i32.const 10
  call $~lib/typedarray/Uint16Array#constructor
  local.set $2
  global.get $assembly/poly1305/_leftover
  if
   global.get $assembly/poly1305/_leftover
   local.set $6
   global.get $assembly/poly1305/_buffer
   local.get $6
   local.tee $7
   i32.const 1
   i32.add
   local.set $6
   local.get $7
   i32.const 1
   call $~lib/typedarray/Uint8Array#__set
   loop $for-loop|0
    local.get $6
    i32.const 16
    i32.lt_u
    local.set $7
    local.get $7
    if
     global.get $assembly/poly1305/_buffer
     local.get $6
     i32.const 0
     call $~lib/typedarray/Uint8Array#__set
     local.get $6
     i32.const 1
     i32.add
     local.set $6
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
  local.set $3
  global.get $assembly/poly1305/_h
  i32.const 1
  global.get $assembly/poly1305/_h
  i32.const 1
  call $~lib/typedarray/Uint16Array#__get
  i32.const 8191
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  i32.const 2
  local.set $6
  loop $for-loop|1
   local.get $6
   i32.const 10
   i32.lt_u
   local.set $7
   local.get $7
   if
    global.get $assembly/poly1305/_h
    local.get $6
    global.get $assembly/poly1305/_h
    local.get $6
    call $~lib/typedarray/Uint16Array#__get
    local.get $3
    i32.add
    call $~lib/typedarray/Uint16Array#__set
    global.get $assembly/poly1305/_h
    local.get $6
    call $~lib/typedarray/Uint16Array#__get
    i32.const 13
    i32.shr_u
    local.set $3
    global.get $assembly/poly1305/_h
    local.get $6
    global.get $assembly/poly1305/_h
    local.get $6
    call $~lib/typedarray/Uint16Array#__get
    i32.const 8191
    i32.and
    call $~lib/typedarray/Uint16Array#__set
    local.get $6
    i32.const 1
    i32.add
    local.set $6
    br $for-loop|1
   end
  end
  global.get $assembly/poly1305/_h
  i32.const 0
  global.get $assembly/poly1305/_h
  i32.const 0
  call $~lib/typedarray/Uint16Array#__get
  local.get $3
  i32.const 5
  i32.mul
  i32.add
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_h
  i32.const 0
  call $~lib/typedarray/Uint16Array#__get
  i32.const 13
  i32.shr_u
  local.set $3
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
  local.get $3
  i32.add
  call $~lib/typedarray/Uint16Array#__set
  global.get $assembly/poly1305/_h
  i32.const 1
  call $~lib/typedarray/Uint16Array#__get
  i32.const 13
  i32.shr_u
  local.set $3
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
  local.get $3
  i32.add
  call $~lib/typedarray/Uint16Array#__set
  local.get $2
  i32.const 0
  global.get $assembly/poly1305/_h
  i32.const 0
  call $~lib/typedarray/Uint16Array#__get
  i32.const 5
  i32.add
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  local.get $2
  i32.const 0
  call $~lib/typedarray/Uint16Array#__get
  i32.const 13
  i32.shr_u
  local.set $3
  local.get $2
  i32.const 0
  local.get $2
  i32.const 0
  call $~lib/typedarray/Uint16Array#__get
  i32.const 8191
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  i32.const 1
  local.set $6
  loop $for-loop|2
   local.get $6
   i32.const 10
   i32.lt_u
   local.set $7
   local.get $7
   if
    local.get $2
    local.get $6
    global.get $assembly/poly1305/_h
    local.get $6
    call $~lib/typedarray/Uint16Array#__get
    local.get $3
    i32.add
    i32.const 65535
    i32.and
    call $~lib/typedarray/Uint16Array#__set
    local.get $2
    local.get $6
    call $~lib/typedarray/Uint16Array#__get
    i32.const 13
    i32.shr_u
    local.set $3
    local.get $2
    local.get $6
    local.get $2
    local.get $6
    call $~lib/typedarray/Uint16Array#__get
    i32.const 8191
    i32.and
    call $~lib/typedarray/Uint16Array#__set
    local.get $6
    i32.const 1
    i32.add
    local.set $6
    br $for-loop|2
   end
  end
  local.get $2
  i32.const 9
  local.get $2
  i32.const 9
  call $~lib/typedarray/Uint16Array#__get
  i32.const 1
  i32.const 13
  i32.shl
  i32.sub
  call $~lib/typedarray/Uint16Array#__set
  local.get $3
  i32.const 1
  i32.xor
  i32.const 1
  i32.sub
  local.set $4
  i32.const 0
  local.set $6
  loop $for-loop|3
   local.get $6
   i32.const 10
   i32.lt_u
   local.set $7
   local.get $7
   if
    local.get $2
    local.get $6
    local.get $2
    local.get $6
    call $~lib/typedarray/Uint16Array#__get
    local.get $4
    i32.and
    call $~lib/typedarray/Uint16Array#__set
    local.get $6
    i32.const 1
    i32.add
    local.set $6
    br $for-loop|3
   end
  end
  local.get $4
  i32.const -1
  i32.xor
  local.set $4
  i32.const 0
  local.set $6
  loop $for-loop|4
   local.get $6
   i32.const 10
   i32.lt_u
   local.set $7
   local.get $7
   if
    global.get $assembly/poly1305/_h
    local.get $6
    global.get $assembly/poly1305/_h
    local.get $6
    call $~lib/typedarray/Uint16Array#__get
    local.get $4
    i32.and
    local.get $2
    local.get $6
    call $~lib/typedarray/Uint16Array#__get
    i32.or
    i32.const 65535
    i32.and
    call $~lib/typedarray/Uint16Array#__set
    local.get $6
    i32.const 1
    i32.add
    local.set $6
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
  local.set $5
  global.get $assembly/poly1305/_h
  i32.const 0
  local.get $5
  i32.const 65535
  i32.and
  call $~lib/typedarray/Uint16Array#__set
  i32.const 1
  local.set $6
  loop $for-loop|5
   local.get $6
   i32.const 8
   i32.lt_u
   local.set $7
   local.get $7
   if
    global.get $assembly/poly1305/_h
    local.get $6
    call $~lib/typedarray/Uint16Array#__get
    global.get $assembly/poly1305/_pad
    local.get $6
    call $~lib/typedarray/Uint16Array#__get
    i32.add
    i32.const 0
    i32.or
    local.get $5
    i32.const 16
    i32.shr_u
    i32.add
    i32.const 0
    i32.or
    local.set $5
    global.get $assembly/poly1305/_h
    local.get $6
    local.get $5
    i32.const 65535
    i32.and
    call $~lib/typedarray/Uint16Array#__set
    local.get $6
    i32.const 1
    i32.add
    local.set $6
    br $for-loop|5
   end
  end
  local.get $0
  local.get $1
  i32.const 0
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 0
  call $~lib/typedarray/Uint16Array#__get
  i32.const 0
  i32.shr_u
  call $~lib/typedarray/Uint8Array#__set
  local.get $0
  local.get $1
  i32.const 1
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 0
  call $~lib/typedarray/Uint16Array#__get
  i32.const 8
  i32.shr_u
  call $~lib/typedarray/Uint8Array#__set
  local.get $0
  local.get $1
  i32.const 2
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 1
  call $~lib/typedarray/Uint16Array#__get
  i32.const 0
  i32.shr_u
  call $~lib/typedarray/Uint8Array#__set
  local.get $0
  local.get $1
  i32.const 3
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 1
  call $~lib/typedarray/Uint16Array#__get
  i32.const 8
  i32.shr_u
  call $~lib/typedarray/Uint8Array#__set
  local.get $0
  local.get $1
  i32.const 4
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 2
  call $~lib/typedarray/Uint16Array#__get
  i32.const 0
  i32.shr_u
  call $~lib/typedarray/Uint8Array#__set
  local.get $0
  local.get $1
  i32.const 5
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 2
  call $~lib/typedarray/Uint16Array#__get
  i32.const 8
  i32.shr_u
  call $~lib/typedarray/Uint8Array#__set
  local.get $0
  local.get $1
  i32.const 6
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 3
  call $~lib/typedarray/Uint16Array#__get
  i32.const 0
  i32.shr_u
  call $~lib/typedarray/Uint8Array#__set
  local.get $0
  local.get $1
  i32.const 7
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 3
  call $~lib/typedarray/Uint16Array#__get
  i32.const 8
  i32.shr_u
  call $~lib/typedarray/Uint8Array#__set
  local.get $0
  local.get $1
  i32.const 8
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 4
  call $~lib/typedarray/Uint16Array#__get
  i32.const 0
  i32.shr_u
  call $~lib/typedarray/Uint8Array#__set
  local.get $0
  local.get $1
  i32.const 9
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 4
  call $~lib/typedarray/Uint16Array#__get
  i32.const 8
  i32.shr_u
  call $~lib/typedarray/Uint8Array#__set
  local.get $0
  local.get $1
  i32.const 10
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 5
  call $~lib/typedarray/Uint16Array#__get
  i32.const 0
  i32.shr_u
  call $~lib/typedarray/Uint8Array#__set
  local.get $0
  local.get $1
  i32.const 11
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 5
  call $~lib/typedarray/Uint16Array#__get
  i32.const 8
  i32.shr_u
  call $~lib/typedarray/Uint8Array#__set
  local.get $0
  local.get $1
  i32.const 12
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 6
  call $~lib/typedarray/Uint16Array#__get
  i32.const 0
  i32.shr_u
  call $~lib/typedarray/Uint8Array#__set
  local.get $0
  local.get $1
  i32.const 13
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 6
  call $~lib/typedarray/Uint16Array#__get
  i32.const 8
  i32.shr_u
  call $~lib/typedarray/Uint8Array#__set
  local.get $0
  local.get $1
  i32.const 14
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 7
  call $~lib/typedarray/Uint16Array#__get
  i32.const 0
  i32.shr_u
  call $~lib/typedarray/Uint8Array#__set
  local.get $0
  local.get $1
  i32.const 15
  i32.add
  global.get $assembly/poly1305/_h
  i32.const 7
  call $~lib/typedarray/Uint16Array#__get
  i32.const 8
  i32.shr_u
  call $~lib/typedarray/Uint8Array#__set
  i32.const 1
  global.set $assembly/poly1305/_finished
  local.get $2
  call $~lib/rt/stub/__release
  local.get $0
  call $~lib/rt/stub/__release
 )
 (func $assembly/poly1305/digest (; 32 ;) (param $0 i32)
  local.get $0
  call $~lib/rt/stub/__retain
  local.set $0
  global.get $assembly/poly1305/_finished
  if
   local.get $0
   call $~lib/rt/stub/__release
   i32.const 400
   i32.const 464
   i32.const 413
   i32.const 4
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.const 0
  call $assembly/poly1305/finish
  local.get $0
  call $~lib/rt/stub/__release
 )
 (func $~lib/typedarray/Uint32Array#get:length (; 33 ;) (param $0 i32) (result i32)
  local.get $0
  i32.load offset=8
  i32.const 2
  i32.shr_u
 )
 (func $~lib/util/memory/memcpy (; 34 ;) (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  loop $while-continue|0
   local.get $2
   if (result i32)
    local.get $1
    i32.const 3
    i32.and
   else
    i32.const 0
   end
   local.set $5
   local.get $5
   if
    local.get $0
    local.tee $6
    i32.const 1
    i32.add
    local.set $0
    local.get $6
    local.get $1
    local.tee $6
    i32.const 1
    i32.add
    local.set $1
    local.get $6
    i32.load8_u
    i32.store8
    local.get $2
    i32.const 1
    i32.sub
    local.set $2
    br $while-continue|0
   end
  end
  local.get $0
  i32.const 3
  i32.and
  i32.const 0
  i32.eq
  if
   loop $while-continue|1
    local.get $2
    i32.const 16
    i32.ge_u
    local.set $5
    local.get $5
    if
     local.get $0
     local.get $1
     i32.load
     i32.store
     local.get $0
     i32.const 4
     i32.add
     local.get $1
     i32.const 4
     i32.add
     i32.load
     i32.store
     local.get $0
     i32.const 8
     i32.add
     local.get $1
     i32.const 8
     i32.add
     i32.load
     i32.store
     local.get $0
     i32.const 12
     i32.add
     local.get $1
     i32.const 12
     i32.add
     i32.load
     i32.store
     local.get $1
     i32.const 16
     i32.add
     local.set $1
     local.get $0
     i32.const 16
     i32.add
     local.set $0
     local.get $2
     i32.const 16
     i32.sub
     local.set $2
     br $while-continue|1
    end
   end
   local.get $2
   i32.const 8
   i32.and
   if
    local.get $0
    local.get $1
    i32.load
    i32.store
    local.get $0
    i32.const 4
    i32.add
    local.get $1
    i32.const 4
    i32.add
    i32.load
    i32.store
    local.get $0
    i32.const 8
    i32.add
    local.set $0
    local.get $1
    i32.const 8
    i32.add
    local.set $1
   end
   local.get $2
   i32.const 4
   i32.and
   if
    local.get $0
    local.get $1
    i32.load
    i32.store
    local.get $0
    i32.const 4
    i32.add
    local.set $0
    local.get $1
    i32.const 4
    i32.add
    local.set $1
   end
   local.get $2
   i32.const 2
   i32.and
   if
    local.get $0
    local.get $1
    i32.load16_u
    i32.store16
    local.get $0
    i32.const 2
    i32.add
    local.set $0
    local.get $1
    i32.const 2
    i32.add
    local.set $1
   end
   local.get $2
   i32.const 1
   i32.and
   if
    local.get $0
    local.tee $5
    i32.const 1
    i32.add
    local.set $0
    local.get $5
    local.get $1
    local.tee $5
    i32.const 1
    i32.add
    local.set $1
    local.get $5
    i32.load8_u
    i32.store8
   end
   return
  end
  local.get $2
  i32.const 32
  i32.ge_u
  if
   block $break|2
    block $case2|2
     block $case1|2
      block $case0|2
       local.get $0
       i32.const 3
       i32.and
       local.set $5
       local.get $5
       i32.const 1
       i32.eq
       br_if $case0|2
       local.get $5
       i32.const 2
       i32.eq
       br_if $case1|2
       local.get $5
       i32.const 3
       i32.eq
       br_if $case2|2
       br $break|2
      end
      local.get $1
      i32.load
      local.set $3
      local.get $0
      local.tee $5
      i32.const 1
      i32.add
      local.set $0
      local.get $5
      local.get $1
      local.tee $5
      i32.const 1
      i32.add
      local.set $1
      local.get $5
      i32.load8_u
      i32.store8
      local.get $0
      local.tee $5
      i32.const 1
      i32.add
      local.set $0
      local.get $5
      local.get $1
      local.tee $5
      i32.const 1
      i32.add
      local.set $1
      local.get $5
      i32.load8_u
      i32.store8
      local.get $0
      local.tee $5
      i32.const 1
      i32.add
      local.set $0
      local.get $5
      local.get $1
      local.tee $5
      i32.const 1
      i32.add
      local.set $1
      local.get $5
      i32.load8_u
      i32.store8
      local.get $2
      i32.const 3
      i32.sub
      local.set $2
      loop $while-continue|3
       local.get $2
       i32.const 17
       i32.ge_u
       local.set $5
       local.get $5
       if
        local.get $1
        i32.const 1
        i32.add
        i32.load
        local.set $4
        local.get $0
        local.get $3
        i32.const 24
        i32.shr_u
        local.get $4
        i32.const 8
        i32.shl
        i32.or
        i32.store
        local.get $1
        i32.const 5
        i32.add
        i32.load
        local.set $3
        local.get $0
        i32.const 4
        i32.add
        local.get $4
        i32.const 24
        i32.shr_u
        local.get $3
        i32.const 8
        i32.shl
        i32.or
        i32.store
        local.get $1
        i32.const 9
        i32.add
        i32.load
        local.set $4
        local.get $0
        i32.const 8
        i32.add
        local.get $3
        i32.const 24
        i32.shr_u
        local.get $4
        i32.const 8
        i32.shl
        i32.or
        i32.store
        local.get $1
        i32.const 13
        i32.add
        i32.load
        local.set $3
        local.get $0
        i32.const 12
        i32.add
        local.get $4
        i32.const 24
        i32.shr_u
        local.get $3
        i32.const 8
        i32.shl
        i32.or
        i32.store
        local.get $1
        i32.const 16
        i32.add
        local.set $1
        local.get $0
        i32.const 16
        i32.add
        local.set $0
        local.get $2
        i32.const 16
        i32.sub
        local.set $2
        br $while-continue|3
       end
      end
      br $break|2
     end
     local.get $1
     i32.load
     local.set $3
     local.get $0
     local.tee $5
     i32.const 1
     i32.add
     local.set $0
     local.get $5
     local.get $1
     local.tee $5
     i32.const 1
     i32.add
     local.set $1
     local.get $5
     i32.load8_u
     i32.store8
     local.get $0
     local.tee $5
     i32.const 1
     i32.add
     local.set $0
     local.get $5
     local.get $1
     local.tee $5
     i32.const 1
     i32.add
     local.set $1
     local.get $5
     i32.load8_u
     i32.store8
     local.get $2
     i32.const 2
     i32.sub
     local.set $2
     loop $while-continue|4
      local.get $2
      i32.const 18
      i32.ge_u
      local.set $5
      local.get $5
      if
       local.get $1
       i32.const 2
       i32.add
       i32.load
       local.set $4
       local.get $0
       local.get $3
       i32.const 16
       i32.shr_u
       local.get $4
       i32.const 16
       i32.shl
       i32.or
       i32.store
       local.get $1
       i32.const 6
       i32.add
       i32.load
       local.set $3
       local.get $0
       i32.const 4
       i32.add
       local.get $4
       i32.const 16
       i32.shr_u
       local.get $3
       i32.const 16
       i32.shl
       i32.or
       i32.store
       local.get $1
       i32.const 10
       i32.add
       i32.load
       local.set $4
       local.get $0
       i32.const 8
       i32.add
       local.get $3
       i32.const 16
       i32.shr_u
       local.get $4
       i32.const 16
       i32.shl
       i32.or
       i32.store
       local.get $1
       i32.const 14
       i32.add
       i32.load
       local.set $3
       local.get $0
       i32.const 12
       i32.add
       local.get $4
       i32.const 16
       i32.shr_u
       local.get $3
       i32.const 16
       i32.shl
       i32.or
       i32.store
       local.get $1
       i32.const 16
       i32.add
       local.set $1
       local.get $0
       i32.const 16
       i32.add
       local.set $0
       local.get $2
       i32.const 16
       i32.sub
       local.set $2
       br $while-continue|4
      end
     end
     br $break|2
    end
    local.get $1
    i32.load
    local.set $3
    local.get $0
    local.tee $5
    i32.const 1
    i32.add
    local.set $0
    local.get $5
    local.get $1
    local.tee $5
    i32.const 1
    i32.add
    local.set $1
    local.get $5
    i32.load8_u
    i32.store8
    local.get $2
    i32.const 1
    i32.sub
    local.set $2
    loop $while-continue|5
     local.get $2
     i32.const 19
     i32.ge_u
     local.set $5
     local.get $5
     if
      local.get $1
      i32.const 3
      i32.add
      i32.load
      local.set $4
      local.get $0
      local.get $3
      i32.const 8
      i32.shr_u
      local.get $4
      i32.const 24
      i32.shl
      i32.or
      i32.store
      local.get $1
      i32.const 7
      i32.add
      i32.load
      local.set $3
      local.get $0
      i32.const 4
      i32.add
      local.get $4
      i32.const 8
      i32.shr_u
      local.get $3
      i32.const 24
      i32.shl
      i32.or
      i32.store
      local.get $1
      i32.const 11
      i32.add
      i32.load
      local.set $4
      local.get $0
      i32.const 8
      i32.add
      local.get $3
      i32.const 8
      i32.shr_u
      local.get $4
      i32.const 24
      i32.shl
      i32.or
      i32.store
      local.get $1
      i32.const 15
      i32.add
      i32.load
      local.set $3
      local.get $0
      i32.const 12
      i32.add
      local.get $4
      i32.const 8
      i32.shr_u
      local.get $3
      i32.const 24
      i32.shl
      i32.or
      i32.store
      local.get $1
      i32.const 16
      i32.add
      local.set $1
      local.get $0
      i32.const 16
      i32.add
      local.set $0
      local.get $2
      i32.const 16
      i32.sub
      local.set $2
      br $while-continue|5
     end
    end
    br $break|2
   end
  end
  local.get $2
  i32.const 16
  i32.and
  if
   local.get $0
   local.tee $5
   i32.const 1
   i32.add
   local.set $0
   local.get $5
   local.get $1
   local.tee $5
   i32.const 1
   i32.add
   local.set $1
   local.get $5
   i32.load8_u
   i32.store8
   local.get $0
   local.tee $5
   i32.const 1
   i32.add
   local.set $0
   local.get $5
   local.get $1
   local.tee $5
   i32.const 1
   i32.add
   local.set $1
   local.get $5
   i32.load8_u
   i32.store8
   local.get $0
   local.tee $5
   i32.const 1
   i32.add
   local.set $0
   local.get $5
   local.get $1
   local.tee $5
   i32.const 1
   i32.add
   local.set $1
   local.get $5
   i32.load8_u
   i32.store8
   local.get $0
   local.tee $5
   i32.const 1
   i32.add
   local.set $0
   local.get $5
   local.get $1
   local.tee $5
   i32.const 1
   i32.add
   local.set $1
   local.get $5
   i32.load8_u
   i32.store8
   local.get $0
   local.tee $5
   i32.const 1
   i32.add
   local.set $0
   local.get $5
   local.get $1
   local.tee $5
   i32.const 1
   i32.add
   local.set $1
   local.get $5
   i32.load8_u
   i32.store8
   local.get $0
   local.tee $5
   i32.const 1
   i32.add
   local.set $0
   local.get $5
   local.get $1
   local.tee $5
   i32.const 1
   i32.add
   local.set $1
   local.get $5
   i32.load8_u
   i32.store8
   local.get $0
   local.tee $5
   i32.const 1
   i32.add
   local.set $0
   local.get $5
   local.get $1
   local.tee $5
   i32.const 1
   i32.add
   local.set $1
   local.get $5
   i32.load8_u
   i32.store8
   local.get $0
   local.tee $5
   i32.const 1
   i32.add
   local.set $0
   local.get $5
   local.get $1
   local.tee $5
   i32.const 1
   i32.add
   local.set $1
   local.get $5
   i32.load8_u
   i32.store8
   local.get $0
   local.tee $5
   i32.const 1
   i32.add
   local.set $0
   local.get $5
   local.get $1
   local.tee $5
   i32.const 1
   i32.add
   local.set $1
   local.get $5
   i32.load8_u
   i32.store8
   local.get $0
   local.tee $5
   i32.const 1
   i32.add
   local.set $0
   local.get $5
   local.get $1
   local.tee $5
   i32.const 1
   i32.add
   local.set $1
   local.get $5
   i32.load8_u
   i32.store8
   local.get $0
   local.tee $5
   i32.const 1
   i32.add
   local.set $0
   local.get $5
   local.get $1
   local.tee $5
   i32.const 1
   i32.add
   local.set $1
   local.get $5
   i32.load8_u
   i32.store8
   local.get $0
   local.tee $5
   i32.const 1
   i32.add
   local.set $0
   local.get $5
   local.get $1
   local.tee $5
   i32.const 1
   i32.add
   local.set $1
   local.get $5
   i32.load8_u
   i32.store8
   local.get $0
   local.tee $5
   i32.const 1
   i32.add
   local.set $0
   local.get $5
   local.get $1
   local.tee $5
   i32.const 1
   i32.add
   local.set $1
   local.get $5
   i32.load8_u
   i32.store8
   local.get $0
   local.tee $5
   i32.const 1
   i32.add
   local.set $0
   local.get $5
   local.get $1
   local.tee $5
   i32.const 1
   i32.add
   local.set $1
   local.get $5
   i32.load8_u
   i32.store8
   local.get $0
   local.tee $5
   i32.const 1
   i32.add
   local.set $0
   local.get $5
   local.get $1
   local.tee $5
   i32.const 1
   i32.add
   local.set $1
   local.get $5
   i32.load8_u
   i32.store8
   local.get $0
   local.tee $5
   i32.const 1
   i32.add
   local.set $0
   local.get $5
   local.get $1
   local.tee $5
   i32.const 1
   i32.add
   local.set $1
   local.get $5
   i32.load8_u
   i32.store8
  end
  local.get $2
  i32.const 8
  i32.and
  if
   local.get $0
   local.tee $5
   i32.const 1
   i32.add
   local.set $0
   local.get $5
   local.get $1
   local.tee $5
   i32.const 1
   i32.add
   local.set $1
   local.get $5
   i32.load8_u
   i32.store8
   local.get $0
   local.tee $5
   i32.const 1
   i32.add
   local.set $0
   local.get $5
   local.get $1
   local.tee $5
   i32.const 1
   i32.add
   local.set $1
   local.get $5
   i32.load8_u
   i32.store8
   local.get $0
   local.tee $5
   i32.const 1
   i32.add
   local.set $0
   local.get $5
   local.get $1
   local.tee $5
   i32.const 1
   i32.add
   local.set $1
   local.get $5
   i32.load8_u
   i32.store8
   local.get $0
   local.tee $5
   i32.const 1
   i32.add
   local.set $0
   local.get $5
   local.get $1
   local.tee $5
   i32.const 1
   i32.add
   local.set $1
   local.get $5
   i32.load8_u
   i32.store8
   local.get $0
   local.tee $5
   i32.const 1
   i32.add
   local.set $0
   local.get $5
   local.get $1
   local.tee $5
   i32.const 1
   i32.add
   local.set $1
   local.get $5
   i32.load8_u
   i32.store8
   local.get $0
   local.tee $5
   i32.const 1
   i32.add
   local.set $0
   local.get $5
   local.get $1
   local.tee $5
   i32.const 1
   i32.add
   local.set $1
   local.get $5
   i32.load8_u
   i32.store8
   local.get $0
   local.tee $5
   i32.const 1
   i32.add
   local.set $0
   local.get $5
   local.get $1
   local.tee $5
   i32.const 1
   i32.add
   local.set $1
   local.get $5
   i32.load8_u
   i32.store8
   local.get $0
   local.tee $5
   i32.const 1
   i32.add
   local.set $0
   local.get $5
   local.get $1
   local.tee $5
   i32.const 1
   i32.add
   local.set $1
   local.get $5
   i32.load8_u
   i32.store8
  end
  local.get $2
  i32.const 4
  i32.and
  if
   local.get $0
   local.tee $5
   i32.const 1
   i32.add
   local.set $0
   local.get $5
   local.get $1
   local.tee $5
   i32.const 1
   i32.add
   local.set $1
   local.get $5
   i32.load8_u
   i32.store8
   local.get $0
   local.tee $5
   i32.const 1
   i32.add
   local.set $0
   local.get $5
   local.get $1
   local.tee $5
   i32.const 1
   i32.add
   local.set $1
   local.get $5
   i32.load8_u
   i32.store8
   local.get $0
   local.tee $5
   i32.const 1
   i32.add
   local.set $0
   local.get $5
   local.get $1
   local.tee $5
   i32.const 1
   i32.add
   local.set $1
   local.get $5
   i32.load8_u
   i32.store8
   local.get $0
   local.tee $5
   i32.const 1
   i32.add
   local.set $0
   local.get $5
   local.get $1
   local.tee $5
   i32.const 1
   i32.add
   local.set $1
   local.get $5
   i32.load8_u
   i32.store8
  end
  local.get $2
  i32.const 2
  i32.and
  if
   local.get $0
   local.tee $5
   i32.const 1
   i32.add
   local.set $0
   local.get $5
   local.get $1
   local.tee $5
   i32.const 1
   i32.add
   local.set $1
   local.get $5
   i32.load8_u
   i32.store8
   local.get $0
   local.tee $5
   i32.const 1
   i32.add
   local.set $0
   local.get $5
   local.get $1
   local.tee $5
   i32.const 1
   i32.add
   local.set $1
   local.get $5
   i32.load8_u
   i32.store8
  end
  local.get $2
  i32.const 1
  i32.and
  if
   local.get $0
   local.tee $5
   i32.const 1
   i32.add
   local.set $0
   local.get $5
   local.get $1
   local.tee $5
   i32.const 1
   i32.add
   local.set $1
   local.get $5
   i32.load8_u
   i32.store8
  end
 )
 (func $~lib/memory/memory.copy (; 35 ;) (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  block $~lib/util/memory/memmove|inlined.0
   local.get $0
   local.set $5
   local.get $1
   local.set $4
   local.get $2
   local.set $3
   local.get $5
   local.get $4
   i32.eq
   if
    br $~lib/util/memory/memmove|inlined.0
   end
   local.get $4
   local.get $3
   i32.add
   local.get $5
   i32.le_u
   if (result i32)
    i32.const 1
   else
    local.get $5
    local.get $3
    i32.add
    local.get $4
    i32.le_u
   end
   if
    local.get $5
    local.get $4
    local.get $3
    call $~lib/util/memory/memcpy
    br $~lib/util/memory/memmove|inlined.0
   end
   local.get $5
   local.get $4
   i32.lt_u
   if
    local.get $4
    i32.const 7
    i32.and
    local.get $5
    i32.const 7
    i32.and
    i32.eq
    if
     loop $while-continue|0
      local.get $5
      i32.const 7
      i32.and
      local.set $6
      local.get $6
      if
       local.get $3
       i32.eqz
       if
        br $~lib/util/memory/memmove|inlined.0
       end
       local.get $3
       i32.const 1
       i32.sub
       local.set $3
       local.get $5
       local.tee $7
       i32.const 1
       i32.add
       local.set $5
       local.get $7
       local.get $4
       local.tee $7
       i32.const 1
       i32.add
       local.set $4
       local.get $7
       i32.load8_u
       i32.store8
       br $while-continue|0
      end
     end
     loop $while-continue|1
      local.get $3
      i32.const 8
      i32.ge_u
      local.set $6
      local.get $6
      if
       local.get $5
       local.get $4
       i64.load
       i64.store
       local.get $3
       i32.const 8
       i32.sub
       local.set $3
       local.get $5
       i32.const 8
       i32.add
       local.set $5
       local.get $4
       i32.const 8
       i32.add
       local.set $4
       br $while-continue|1
      end
     end
    end
    loop $while-continue|2
     local.get $3
     local.set $6
     local.get $6
     if
      local.get $5
      local.tee $7
      i32.const 1
      i32.add
      local.set $5
      local.get $7
      local.get $4
      local.tee $7
      i32.const 1
      i32.add
      local.set $4
      local.get $7
      i32.load8_u
      i32.store8
      local.get $3
      i32.const 1
      i32.sub
      local.set $3
      br $while-continue|2
     end
    end
   else
    local.get $4
    i32.const 7
    i32.and
    local.get $5
    i32.const 7
    i32.and
    i32.eq
    if
     loop $while-continue|3
      local.get $5
      local.get $3
      i32.add
      i32.const 7
      i32.and
      local.set $6
      local.get $6
      if
       local.get $3
       i32.eqz
       if
        br $~lib/util/memory/memmove|inlined.0
       end
       local.get $5
       local.get $3
       i32.const 1
       i32.sub
       local.tee $3
       i32.add
       local.get $4
       local.get $3
       i32.add
       i32.load8_u
       i32.store8
       br $while-continue|3
      end
     end
     loop $while-continue|4
      local.get $3
      i32.const 8
      i32.ge_u
      local.set $6
      local.get $6
      if
       local.get $3
       i32.const 8
       i32.sub
       local.set $3
       local.get $5
       local.get $3
       i32.add
       local.get $4
       local.get $3
       i32.add
       i64.load
       i64.store
       br $while-continue|4
      end
     end
    end
    loop $while-continue|5
     local.get $3
     local.set $6
     local.get $6
     if
      local.get $5
      local.get $3
      i32.const 1
      i32.sub
      local.tee $3
      i32.add
      local.get $4
      local.get $3
      i32.add
      i32.load8_u
      i32.store8
      br $while-continue|5
     end
    end
   end
  end
 )
 (func $~lib/typedarray/Uint32Array#set<~lib/typedarray/Uint32Array> (; 36 ;) (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  local.get $1
  call $~lib/rt/stub/__retain
  local.set $1
  local.get $0
  call $~lib/rt/stub/__retain
  local.set $5
  local.get $1
  call $~lib/rt/stub/__retain
  local.set $4
  local.get $2
  local.set $3
  local.get $3
  i32.const 0
  i32.lt_s
  if
   local.get $4
   call $~lib/rt/stub/__release
   local.get $5
   call $~lib/rt/stub/__release
   i32.const 272
   i32.const 336
   i32.const 1774
   i32.const 18
   call $~lib/builtins/abort
   unreachable
  end
  local.get $4
  call $~lib/typedarray/Uint32Array#get:length
  local.get $3
  i32.add
  local.get $5
  call $~lib/typedarray/Uint32Array#get:length
  i32.gt_s
  if
   local.get $4
   call $~lib/rt/stub/__release
   local.get $5
   call $~lib/rt/stub/__release
   i32.const 272
   i32.const 336
   i32.const 1775
   i32.const 46
   call $~lib/builtins/abort
   unreachable
  end
  local.get $5
  i32.load offset=4
  local.get $3
  i32.const 2
  i32.shl
  i32.add
  local.get $4
  i32.load offset=4
  local.get $4
  i32.load offset=8
  call $~lib/memory/memory.copy
  local.get $4
  call $~lib/rt/stub/__release
  local.get $5
  call $~lib/rt/stub/__release
  local.get $1
  call $~lib/rt/stub/__release
 )
 (func $assembly/poly1305/wipeUint8Arr (; 37 ;) (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  local.get $0
  call $~lib/rt/stub/__retain
  local.set $0
  i32.const 0
  local.set $1
  loop $for-loop|0
   local.get $1
   local.get $0
   call $~lib/typedarray/Uint8Array#get:length
   i32.lt_s
   local.set $2
   local.get $2
   if
    local.get $0
    local.get $1
    i32.const 0
    call $~lib/typedarray/Uint8Array#__set
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $for-loop|0
   end
  end
  local.get $0
  call $~lib/rt/stub/__release
 )
 (func $~lib/typedarray/Uint16Array#get:length (; 38 ;) (param $0 i32) (result i32)
  local.get $0
  i32.load offset=8
  i32.const 1
  i32.shr_u
 )
 (func $assembly/poly1305/wipeUint16Arr (; 39 ;) (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  local.get $0
  call $~lib/rt/stub/__retain
  local.set $0
  i32.const 0
  local.set $1
  loop $for-loop|0
   local.get $1
   local.get $0
   call $~lib/typedarray/Uint16Array#get:length
   i32.lt_s
   local.set $2
   local.get $2
   if
    local.get $0
    local.get $1
    i32.const 0
    call $~lib/typedarray/Uint16Array#__set
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $for-loop|0
   end
  end
  local.get $0
  call $~lib/rt/stub/__release
 )
 (func $assembly/poly1305/clean (; 40 ;)
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
 (func $assembly/index/poly1305Digest (; 41 ;)
  global.get $assembly/index/poly1305OutputArr
  call $assembly/poly1305/digest
  global.get $assembly/index/debugArr
  global.get $assembly/poly1305/polyArr
  i32.const 0
  call $~lib/typedarray/Uint32Array#set<~lib/typedarray/Uint32Array>
  call $assembly/poly1305/clean
 )
 (func $~start (; 42 ;)
  call $start:assembly/index
 )
)
