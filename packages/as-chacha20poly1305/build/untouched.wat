(module
 (type $i32_i32_i32_=>_none (func (param i32 i32 i32)))
 (type $none_=>_none (func))
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (type $i32_i32_=>_i32 (func (param i32 i32) (result i32)))
 (type $i32_=>_none (func (param i32)))
 (type $i32_i32_=>_none (func (param i32 i32)))
 (type $i32_i32_i32_i32_=>_none (func (param i32 i32 i32 i32)))
 (type $i32_i32_i32_i32_i32_=>_i32 (func (param i32 i32 i32 i32 i32) (result i32)))
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
 (memory $0 1)
 (data (i32.const 16) "\1c\00\00\00\01\00\00\00\01\00\00\00\1c\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00l\00e\00n\00g\00t\00h\00")
 (data (i32.const 64) "&\00\00\00\01\00\00\00\01\00\00\00&\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00b\00u\00f\00f\00e\00r\00.\00t\00s\00")
 (data (i32.const 128) "0\00\00\00\01\00\00\00\01\00\00\000\00\00\00C\00h\00a\00C\00h\00a\00:\00 \00c\00o\00u\00n\00t\00e\00r\00 \00o\00v\00e\00r\00f\00l\00o\00w\00")
 (data (i32.const 192) "(\00\00\00\01\00\00\00\01\00\00\00(\00\00\00a\00s\00s\00e\00m\00b\00l\00y\00/\00c\00h\00a\00c\00h\00a\002\000\00.\00t\00s\00")
 (table $0 1 funcref)
 (global $assembly/chacha20/ROUNDS i32 (i32.const 20))
 (global $~lib/rt/stub/startOffset (mut i32) (i32.const 0))
 (global $~lib/rt/stub/offset (mut i32) (i32.const 0))
 (global $~lib/ASC_SHRINK_LEVEL i32 (i32.const 0))
 (global $assembly/chacha20/block (mut i32) (i32.const 0))
 (global $assembly/chacha20/blockPtr (mut i32) (i32.const 0))
 (global $assembly/index/INPUT_LENGTH i32 (i32.const 512))
 (global $assembly/index/KEY_LENGTH i32 (i32.const 32))
 (global $assembly/index/COUNTER_LENGTH i32 (i32.const 16))
 (global $assembly/index/input (mut i32) (i32.const 0))
 (global $assembly/index/inputPtr (mut i32) (i32.const 0))
 (global $assembly/index/key (mut i32) (i32.const 0))
 (global $assembly/index/keyPtr (mut i32) (i32.const 0))
 (global $assembly/index/counter (mut i32) (i32.const 0))
 (global $assembly/index/counterPtr (mut i32) (i32.const 0))
 (global $assembly/index/output (mut i32) (i32.const 0))
 (global $assembly/index/outputPtr (mut i32) (i32.const 0))
 (global $assembly/index/debug (mut i32) (i32.const 0))
 (global $assembly/index/debugPtr (mut i32) (i32.const 0))
 (global $~lib/heap/__heap_base i32 (i32.const 248))
 (export "memory" (memory $0))
 (export "INPUT_LENGTH" (global $assembly/index/INPUT_LENGTH))
 (export "KEY_LENGTH" (global $assembly/index/KEY_LENGTH))
 (export "COUNTER_LENGTH" (global $assembly/index/COUNTER_LENGTH))
 (export "input" (global $assembly/index/input))
 (export "key" (global $assembly/index/key))
 (export "counter" (global $assembly/index/counter))
 (export "output" (global $assembly/index/output))
 (export "debug" (global $assembly/index/debug))
 (export "streamXORUpdate" (func $assembly/index/streamXORUpdate))
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
 (func $start:assembly/index (; 7 ;)
  call $start:assembly/chacha20
  i32.const 0
  i32.const 512
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/index/input
  global.get $assembly/index/input
  global.set $assembly/index/inputPtr
  i32.const 0
  i32.const 32
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/index/key
  global.get $assembly/index/key
  global.set $assembly/index/keyPtr
  i32.const 0
  i32.const 16
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/index/counter
  global.get $assembly/index/counter
  global.set $assembly/index/counterPtr
  i32.const 0
  i32.const 512
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/index/output
  global.get $assembly/index/output
  global.set $assembly/index/outputPtr
  i32.const 0
  i32.const 64
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/index/debug
  global.get $assembly/index/debug
  global.set $assembly/index/debugPtr
 )
 (func $assembly/util/writeUint32LE (; 8 ;) (param $0 i32) (param $1 i32) (param $2 i32)
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
 (func $assembly/chacha20/core (; 9 ;) (param $0 i32) (param $1 i32) (param $2 i32)
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
 (func $assembly/chacha20/incrementCounter (; 10 ;) (param $0 i32) (param $1 i32) (param $2 i32)
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
 (func $assembly/util/wipe (; 11 ;) (param $0 i32) (param $1 i32)
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
 (func $assembly/chacha20/doStreamXORUpdate (; 12 ;) (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (result i32)
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
 (func $assembly/index/streamXORUpdate (; 13 ;) (param $0 i32) (result i32)
  global.get $assembly/index/inputPtr
  local.get $0
  global.get $assembly/index/keyPtr
  global.get $assembly/index/counterPtr
  global.get $assembly/index/outputPtr
  call $assembly/chacha20/doStreamXORUpdate
 )
 (func $~start (; 14 ;)
  call $start:assembly/index
 )
)
