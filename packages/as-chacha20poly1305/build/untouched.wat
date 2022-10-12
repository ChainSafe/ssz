(module
 (type $i32_i32_i32_=>_none (func (param i32 i32 i32)))
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (type $i32_i32_=>_i32 (func (param i32 i32) (result i32)))
 (type $i32_i32_i32_=>_i32 (func (param i32 i32 i32) (result i32)))
 (type $i32_=>_none (func (param i32)))
 (type $none_=>_none (func))
 (type $i32_i32_i32_i32_=>_none (func (param i32 i32 i32 i32)))
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
 (memory $0 1)
 (data (i32.const 16) "\1c\00\00\00\01\00\00\00\01\00\00\00\1c\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00l\00e\00n\00g\00t\00h\00")
 (data (i32.const 64) "&\00\00\00\01\00\00\00\01\00\00\00&\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00b\00u\00f\00f\00e\00r\00.\00t\00s\00")
 (data (i32.const 128) "$\00\00\00\01\00\00\00\01\00\00\00$\00\00\00I\00n\00d\00e\00x\00 \00o\00u\00t\00 \00o\00f\00 \00r\00a\00n\00g\00e\00")
 (data (i32.const 192) "$\00\00\00\01\00\00\00\01\00\00\00$\00\00\00~\00l\00i\00b\00/\00t\00y\00p\00e\00d\00a\00r\00r\00a\00y\00.\00t\00s\00")
 (data (i32.const 256) "0\00\00\00\01\00\00\00\01\00\00\000\00\00\00C\00h\00a\00C\00h\00a\00:\00 \00c\00o\00u\00n\00t\00e\00r\00 \00o\00v\00e\00r\00f\00l\00o\00w\00")
 (data (i32.const 320) "\"\00\00\00\01\00\00\00\01\00\00\00\"\00\00\00a\00s\00s\00e\00m\00b\00l\00y\00/\00i\00n\00d\00e\00x\00.\00t\00s\00")
 (table $0 1 funcref)
 (global $assembly/index/INPUT_LENGTH i32 (i32.const 512))
 (global $assembly/index/KEY_LENGTH i32 (i32.const 32))
 (global $assembly/index/COUNTER_LENGTH i32 (i32.const 16))
 (global $assembly/index/ROUNDS i32 (i32.const 20))
 (global $~lib/rt/stub/startOffset (mut i32) (i32.const 0))
 (global $~lib/rt/stub/offset (mut i32) (i32.const 0))
 (global $~lib/ASC_SHRINK_LEVEL i32 (i32.const 0))
 (global $assembly/index/inputArr (mut i32) (i32.const 0))
 (global $assembly/index/input (mut i32) (i32.const 0))
 (global $assembly/index/keyArr (mut i32) (i32.const 0))
 (global $assembly/index/key (mut i32) (i32.const 0))
 (global $assembly/index/counterArr (mut i32) (i32.const 0))
 (global $assembly/index/counter (mut i32) (i32.const 0))
 (global $assembly/index/outputArr (mut i32) (i32.const 0))
 (global $assembly/index/output (mut i32) (i32.const 0))
 (global $assembly/index/debugArr (mut i32) (i32.const 0))
 (global $assembly/index/debug (mut i32) (i32.const 0))
 (global $assembly/index/block (mut i32) (i32.const 0))
 (global $~lib/heap/__heap_base i32 (i32.const 372))
 (global $~argumentsLength (mut i32) (i32.const 0))
 (export "memory" (memory $0))
 (export "INPUT_LENGTH" (global $assembly/index/INPUT_LENGTH))
 (export "KEY_LENGTH" (global $assembly/index/KEY_LENGTH))
 (export "COUNTER_LENGTH" (global $assembly/index/COUNTER_LENGTH))
 (export "input" (global $assembly/index/input))
 (export "key" (global $assembly/index/key))
 (export "counter" (global $assembly/index/counter))
 (export "output" (global $assembly/index/output))
 (export "debug" (global $assembly/index/debug))
 (export "stream" (func $assembly/index/stream))
 (export "numberOperation" (func $assembly/index/numberOperation))
 (export "streamXOR" (func $assembly/index/streamXOR))
 (export "__setArgumentsLength" (func $~setArgumentsLength))
 (export "writeUint32LE" (func $assembly/index/writeUint32LE|trampoline))
 (export "wipe" (func $assembly/index/wipe))
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
 (func $~lib/rt/stub/__release (; 5 ;) (param $0 i32)
  nop
 )
 (func $~lib/arraybuffer/ArrayBufferView#constructor (; 6 ;) (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
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
 (func $~lib/typedarray/Uint8Array#constructor (; 7 ;) (param $0 i32) (param $1 i32) (result i32)
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
 (func $~lib/typedarray/Int32Array#constructor (; 8 ;) (param $0 i32) (param $1 i32) (result i32)
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
  i32.const 2
  call $~lib/arraybuffer/ArrayBufferView#constructor
  local.set $0
  local.get $0
 )
 (func $start:assembly/index (; 9 ;)
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
  i32.const 512
  call $~lib/typedarray/Uint8Array#constructor
  global.set $assembly/index/inputArr
  global.get $assembly/index/inputArr
  i32.load
  call $~lib/rt/stub/__retain
  global.set $assembly/index/input
  i32.const 0
  i32.const 32
  call $~lib/typedarray/Uint8Array#constructor
  global.set $assembly/index/keyArr
  global.get $assembly/index/keyArr
  i32.load
  call $~lib/rt/stub/__retain
  global.set $assembly/index/key
  i32.const 0
  i32.const 16
  call $~lib/typedarray/Uint8Array#constructor
  global.set $assembly/index/counterArr
  global.get $assembly/index/counterArr
  i32.load
  call $~lib/rt/stub/__retain
  global.set $assembly/index/counter
  i32.const 0
  i32.const 512
  call $~lib/typedarray/Uint8Array#constructor
  global.set $assembly/index/outputArr
  global.get $assembly/index/outputArr
  i32.load
  call $~lib/rt/stub/__retain
  global.set $assembly/index/output
  i32.const 0
  i32.const 64
  call $~lib/typedarray/Int32Array#constructor
  global.set $assembly/index/debugArr
  global.get $assembly/index/debugArr
  i32.load
  call $~lib/rt/stub/__retain
  global.set $assembly/index/debug
  i32.const 0
  i32.const 64
  call $~lib/typedarray/Uint8Array#constructor
  global.set $assembly/index/block
 )
 (func $~lib/typedarray/Uint8Array#__get (; 10 ;) (param $0 i32) (param $1 i32) (result i32)
  local.get $1
  local.get $0
  i32.load offset=8
  i32.ge_u
  if
   i32.const 144
   i32.const 208
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
 (func $~lib/typedarray/Uint8Array#__set (; 11 ;) (param $0 i32) (param $1 i32) (param $2 i32)
  local.get $1
  local.get $0
  i32.load offset=8
  i32.ge_u
  if
   i32.const 144
   i32.const 208
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
 (func $assembly/index/stream (; 12 ;) (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  i32.const 0
  local.set $1
  loop $for-loop|0
   local.get $1
   local.get $0
   i32.lt_u
   local.set $2
   local.get $2
   if
    global.get $assembly/index/inputArr
    local.get $1
    call $~lib/typedarray/Uint8Array#__get
    local.set $3
    global.get $assembly/index/outputArr
    local.get $1
    local.get $3
    i32.const 2
    i32.add
    i32.const 255
    i32.and
    call $~lib/typedarray/Uint8Array#__set
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $for-loop|0
   end
  end
  local.get $0
 )
 (func $assembly/index/numberOperation (; 13 ;) (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  local.get $0
  local.get $1
  i32.add
  i32.const 0
  i32.or
  local.set $0
  local.get $2
  local.get $0
  i32.xor
  local.set $2
  local.get $2
 )
 (func $~lib/typedarray/Int32Array#__set (; 14 ;) (param $0 i32) (param $1 i32) (param $2 i32)
  local.get $1
  local.get $0
  i32.load offset=8
  i32.const 2
  i32.shr_u
  i32.ge_u
  if
   i32.const 144
   i32.const 208
   i32.const 675
   i32.const 63
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.load offset=4
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  local.get $2
  i32.store
 )
 (func $assembly/index/writeUint32LE (; 15 ;) (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  local.get $1
  call $~lib/rt/stub/__retain
  local.set $1
  local.get $1
  local.get $2
  i32.const 0
  i32.add
  i32.const 255
  i32.and
  local.get $0
  i32.const 0
  i32.shr_u
  call $~lib/typedarray/Uint8Array#__set
  local.get $1
  local.get $2
  i32.const 1
  i32.add
  i32.const 255
  i32.and
  local.get $0
  i32.const 8
  i32.shr_u
  call $~lib/typedarray/Uint8Array#__set
  local.get $1
  local.get $2
  i32.const 2
  i32.add
  i32.const 255
  i32.and
  local.get $0
  i32.const 16
  i32.shr_u
  call $~lib/typedarray/Uint8Array#__set
  local.get $1
  local.get $2
  i32.const 3
  i32.add
  i32.const 255
  i32.and
  local.get $0
  i32.const 24
  i32.shr_u
  call $~lib/typedarray/Uint8Array#__set
  local.get $1
 )
 (func $assembly/index/core (; 16 ;) (param $0 i32) (param $1 i32) (param $2 i32)
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
  local.get $0
  call $~lib/rt/stub/__retain
  local.set $0
  local.get $1
  call $~lib/rt/stub/__retain
  local.set $1
  local.get $2
  call $~lib/rt/stub/__retain
  local.set $2
  local.get $2
  i32.const 3
  call $~lib/typedarray/Uint8Array#__get
  i32.const 24
  i32.shl
  local.get $2
  i32.const 2
  call $~lib/typedarray/Uint8Array#__get
  i32.const 16
  i32.shl
  i32.or
  local.get $2
  i32.const 1
  call $~lib/typedarray/Uint8Array#__get
  i32.const 8
  i32.shl
  i32.or
  local.get $2
  i32.const 0
  call $~lib/typedarray/Uint8Array#__get
  i32.or
  local.set $3
  local.get $2
  i32.const 7
  call $~lib/typedarray/Uint8Array#__get
  i32.const 24
  i32.shl
  local.get $2
  i32.const 6
  call $~lib/typedarray/Uint8Array#__get
  i32.const 16
  i32.shl
  i32.or
  local.get $2
  i32.const 5
  call $~lib/typedarray/Uint8Array#__get
  i32.const 8
  i32.shl
  i32.or
  local.get $2
  i32.const 4
  call $~lib/typedarray/Uint8Array#__get
  i32.or
  local.set $4
  local.get $2
  i32.const 11
  call $~lib/typedarray/Uint8Array#__get
  i32.const 24
  i32.shl
  local.get $2
  i32.const 10
  call $~lib/typedarray/Uint8Array#__get
  i32.const 16
  i32.shl
  i32.or
  local.get $2
  i32.const 9
  call $~lib/typedarray/Uint8Array#__get
  i32.const 8
  i32.shl
  i32.or
  local.get $2
  i32.const 8
  call $~lib/typedarray/Uint8Array#__get
  i32.or
  local.set $5
  local.get $2
  i32.const 15
  call $~lib/typedarray/Uint8Array#__get
  i32.const 24
  i32.shl
  local.get $2
  i32.const 14
  call $~lib/typedarray/Uint8Array#__get
  i32.const 16
  i32.shl
  i32.or
  local.get $2
  i32.const 13
  call $~lib/typedarray/Uint8Array#__get
  i32.const 8
  i32.shl
  i32.or
  local.get $2
  i32.const 12
  call $~lib/typedarray/Uint8Array#__get
  i32.or
  local.set $6
  local.get $2
  i32.const 19
  call $~lib/typedarray/Uint8Array#__get
  i32.const 24
  i32.shl
  local.get $2
  i32.const 18
  call $~lib/typedarray/Uint8Array#__get
  i32.const 16
  i32.shl
  i32.or
  local.get $2
  i32.const 17
  call $~lib/typedarray/Uint8Array#__get
  i32.const 8
  i32.shl
  i32.or
  local.get $2
  i32.const 16
  call $~lib/typedarray/Uint8Array#__get
  i32.or
  local.set $7
  local.get $2
  i32.const 23
  call $~lib/typedarray/Uint8Array#__get
  i32.const 24
  i32.shl
  local.get $2
  i32.const 22
  call $~lib/typedarray/Uint8Array#__get
  i32.const 16
  i32.shl
  i32.or
  local.get $2
  i32.const 21
  call $~lib/typedarray/Uint8Array#__get
  i32.const 8
  i32.shl
  i32.or
  local.get $2
  i32.const 20
  call $~lib/typedarray/Uint8Array#__get
  i32.or
  local.set $8
  local.get $2
  i32.const 27
  call $~lib/typedarray/Uint8Array#__get
  i32.const 24
  i32.shl
  local.get $2
  i32.const 26
  call $~lib/typedarray/Uint8Array#__get
  i32.const 16
  i32.shl
  i32.or
  local.get $2
  i32.const 25
  call $~lib/typedarray/Uint8Array#__get
  i32.const 8
  i32.shl
  i32.or
  local.get $2
  i32.const 24
  call $~lib/typedarray/Uint8Array#__get
  i32.or
  local.set $9
  local.get $2
  i32.const 31
  call $~lib/typedarray/Uint8Array#__get
  i32.const 24
  i32.shl
  local.get $2
  i32.const 30
  call $~lib/typedarray/Uint8Array#__get
  i32.const 16
  i32.shl
  i32.or
  local.get $2
  i32.const 29
  call $~lib/typedarray/Uint8Array#__get
  i32.const 8
  i32.shl
  i32.or
  local.get $2
  i32.const 28
  call $~lib/typedarray/Uint8Array#__get
  i32.or
  local.set $10
  local.get $1
  i32.const 3
  call $~lib/typedarray/Uint8Array#__get
  i32.const 24
  i32.shl
  local.get $1
  i32.const 2
  call $~lib/typedarray/Uint8Array#__get
  i32.const 16
  i32.shl
  i32.or
  local.get $1
  i32.const 1
  call $~lib/typedarray/Uint8Array#__get
  i32.const 8
  i32.shl
  i32.or
  local.get $1
  i32.const 0
  call $~lib/typedarray/Uint8Array#__get
  i32.or
  local.set $11
  local.get $1
  i32.const 7
  call $~lib/typedarray/Uint8Array#__get
  i32.const 24
  i32.shl
  local.get $1
  i32.const 6
  call $~lib/typedarray/Uint8Array#__get
  i32.const 16
  i32.shl
  i32.or
  local.get $1
  i32.const 5
  call $~lib/typedarray/Uint8Array#__get
  i32.const 8
  i32.shl
  i32.or
  local.get $1
  i32.const 4
  call $~lib/typedarray/Uint8Array#__get
  i32.or
  local.set $12
  local.get $1
  i32.const 11
  call $~lib/typedarray/Uint8Array#__get
  i32.const 24
  i32.shl
  local.get $1
  i32.const 10
  call $~lib/typedarray/Uint8Array#__get
  i32.const 16
  i32.shl
  i32.or
  local.get $1
  i32.const 9
  call $~lib/typedarray/Uint8Array#__get
  i32.const 8
  i32.shl
  i32.or
  local.get $1
  i32.const 8
  call $~lib/typedarray/Uint8Array#__get
  i32.or
  local.set $13
  local.get $1
  i32.const 15
  call $~lib/typedarray/Uint8Array#__get
  i32.const 24
  i32.shl
  local.get $1
  i32.const 14
  call $~lib/typedarray/Uint8Array#__get
  i32.const 16
  i32.shl
  i32.or
  local.get $1
  i32.const 13
  call $~lib/typedarray/Uint8Array#__get
  i32.const 8
  i32.shl
  i32.or
  local.get $1
  i32.const 12
  call $~lib/typedarray/Uint8Array#__get
  i32.or
  local.set $14
  i32.const 1634760805
  local.set $15
  i32.const 857760878
  local.set $16
  i32.const 2036477234
  local.set $17
  i32.const 1797285236
  local.set $18
  local.get $3
  local.set $19
  local.get $4
  local.set $20
  local.get $5
  local.set $21
  local.get $6
  local.set $22
  local.get $7
  local.set $23
  local.get $8
  local.set $24
  local.get $9
  local.set $25
  local.get $10
  local.set $26
  local.get $11
  local.set $27
  local.get $12
  local.set $28
  local.get $13
  local.set $29
  local.get $14
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
    local.get $15
    local.get $19
    i32.add
    i32.const 0
    i32.or
    local.set $15
    local.get $27
    local.get $15
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
    local.get $15
    local.get $19
    i32.add
    i32.const 0
    i32.or
    local.set $15
    local.get $27
    local.get $15
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
    local.get $15
    local.get $20
    i32.add
    i32.const 0
    i32.or
    local.set $15
    local.get $30
    local.get $15
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
    local.get $15
    local.get $20
    i32.add
    i32.const 0
    i32.or
    local.set $15
    local.get $30
    local.get $15
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
    i32.const 0
    i32.eq
    if
     global.get $assembly/index/debugArr
     i32.const 0
     local.get $15
     call $~lib/typedarray/Int32Array#__set
     global.get $assembly/index/debugArr
     i32.const 1
     local.get $16
     call $~lib/typedarray/Int32Array#__set
     global.get $assembly/index/debugArr
     i32.const 2
     local.get $17
     call $~lib/typedarray/Int32Array#__set
     global.get $assembly/index/debugArr
     i32.const 3
     local.get $18
     call $~lib/typedarray/Int32Array#__set
     global.get $assembly/index/debugArr
     i32.const 4
     local.get $19
     call $~lib/typedarray/Int32Array#__set
     global.get $assembly/index/debugArr
     i32.const 5
     local.get $20
     call $~lib/typedarray/Int32Array#__set
     global.get $assembly/index/debugArr
     i32.const 6
     local.get $21
     call $~lib/typedarray/Int32Array#__set
     global.get $assembly/index/debugArr
     i32.const 7
     local.get $22
     call $~lib/typedarray/Int32Array#__set
     global.get $assembly/index/debugArr
     i32.const 8
     local.get $23
     call $~lib/typedarray/Int32Array#__set
     global.get $assembly/index/debugArr
     i32.const 9
     local.get $24
     call $~lib/typedarray/Int32Array#__set
     global.get $assembly/index/debugArr
     i32.const 10
     local.get $25
     call $~lib/typedarray/Int32Array#__set
     global.get $assembly/index/debugArr
     i32.const 11
     local.get $26
     call $~lib/typedarray/Int32Array#__set
     global.get $assembly/index/debugArr
     i32.const 12
     local.get $27
     call $~lib/typedarray/Int32Array#__set
     global.get $assembly/index/debugArr
     i32.const 13
     local.get $28
     call $~lib/typedarray/Int32Array#__set
     global.get $assembly/index/debugArr
     i32.const 14
     local.get $29
     call $~lib/typedarray/Int32Array#__set
     global.get $assembly/index/debugArr
     i32.const 15
     local.get $30
     call $~lib/typedarray/Int32Array#__set
    end
    local.get $31
    i32.const 2
    i32.add
    local.set $31
    br $for-loop|0
   end
  end
  local.get $15
  i32.const 1634760805
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 0
  call $assembly/index/writeUint32LE
  call $~lib/rt/stub/__release
  local.get $16
  i32.const 857760878
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 4
  call $assembly/index/writeUint32LE
  call $~lib/rt/stub/__release
  local.get $17
  i32.const 2036477234
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 8
  call $assembly/index/writeUint32LE
  call $~lib/rt/stub/__release
  local.get $18
  i32.const 1797285236
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 12
  call $assembly/index/writeUint32LE
  call $~lib/rt/stub/__release
  local.get $19
  local.get $3
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 16
  call $assembly/index/writeUint32LE
  call $~lib/rt/stub/__release
  local.get $20
  local.get $4
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 20
  call $assembly/index/writeUint32LE
  call $~lib/rt/stub/__release
  local.get $21
  local.get $5
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 24
  call $assembly/index/writeUint32LE
  call $~lib/rt/stub/__release
  local.get $22
  local.get $6
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 28
  call $assembly/index/writeUint32LE
  call $~lib/rt/stub/__release
  local.get $23
  local.get $7
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 32
  call $assembly/index/writeUint32LE
  call $~lib/rt/stub/__release
  local.get $24
  local.get $8
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 36
  call $assembly/index/writeUint32LE
  call $~lib/rt/stub/__release
  local.get $25
  local.get $9
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 40
  call $assembly/index/writeUint32LE
  call $~lib/rt/stub/__release
  local.get $26
  local.get $10
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 44
  call $assembly/index/writeUint32LE
  call $~lib/rt/stub/__release
  local.get $27
  local.get $11
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 48
  call $assembly/index/writeUint32LE
  call $~lib/rt/stub/__release
  local.get $28
  local.get $12
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 52
  call $assembly/index/writeUint32LE
  call $~lib/rt/stub/__release
  local.get $29
  local.get $13
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 56
  call $assembly/index/writeUint32LE
  call $~lib/rt/stub/__release
  local.get $30
  local.get $14
  i32.add
  i32.const 0
  i32.or
  local.get $0
  i32.const 60
  call $assembly/index/writeUint32LE
  call $~lib/rt/stub/__release
  local.get $0
  call $~lib/rt/stub/__release
  local.get $1
  call $~lib/rt/stub/__release
  local.get $2
  call $~lib/rt/stub/__release
 )
 (func $assembly/index/incrementCounter (; 17 ;) (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  local.get $0
  call $~lib/rt/stub/__retain
  local.set $0
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
    local.get $1
    i32.const 255
    i32.and
    call $~lib/typedarray/Uint8Array#__get
    i32.const 255
    i32.and
    i32.add
    i32.const 0
    i32.or
    local.set $3
    local.get $0
    local.get $1
    i32.const 255
    i32.and
    local.get $3
    i32.const 255
    i32.and
    call $~lib/typedarray/Uint8Array#__set
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
   local.get $0
   call $~lib/rt/stub/__release
   i32.const 272
   i32.const 336
   i32.const 252
   i32.const 4
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/rt/stub/__release
 )
 (func $~lib/typedarray/Uint8Array#get:length (; 18 ;) (param $0 i32) (result i32)
  local.get $0
  i32.load offset=8
 )
 (func $assembly/index/wipe (; 19 ;) (param $0 i32) (result i32)
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
 )
 (func $assembly/index/streamXOR (; 20 ;) (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  i32.const 0
  local.set $1
  loop $for-loop|0
   local.get $1
   local.get $0
   i32.lt_u
   local.set $2
   local.get $2
   if
    global.get $assembly/index/block
    global.get $assembly/index/counterArr
    global.get $assembly/index/keyArr
    call $assembly/index/core
    local.get $1
    local.set $3
    loop $for-loop|1
     local.get $3
     local.get $1
     i32.const 64
     i32.add
     i32.lt_u
     if (result i32)
      local.get $3
      local.get $0
      i32.lt_u
     else
      i32.const 0
     end
     local.set $4
     local.get $4
     if
      global.get $assembly/index/outputArr
      local.get $3
      global.get $assembly/index/inputArr
      local.get $3
      call $~lib/typedarray/Uint8Array#__get
      global.get $assembly/index/block
      local.get $3
      local.get $1
      i32.sub
      call $~lib/typedarray/Uint8Array#__get
      i32.xor
      i32.const 255
      i32.and
      call $~lib/typedarray/Uint8Array#__set
      local.get $3
      i32.const 1
      i32.add
      local.set $3
      br $for-loop|1
     end
    end
    global.get $assembly/index/counterArr
    i32.const 0
    i32.const 4
    call $assembly/index/incrementCounter
    local.get $1
    i32.const 64
    i32.add
    local.set $1
    br $for-loop|0
   end
  end
  global.get $assembly/index/block
  call $assembly/index/wipe
  call $~lib/rt/stub/__release
  local.get $0
 )
 (func $~start (; 21 ;)
  call $start:assembly/index
 )
 (func $assembly/index/writeUint32LE|trampoline (; 22 ;) (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  block $1of1
   block $0of1
    block $outOfRange
     global.get $~argumentsLength
     i32.const 2
     i32.sub
     br_table $0of1 $1of1 $outOfRange
    end
    unreachable
   end
   i32.const 0
   local.set $2
  end
  local.get $0
  local.get $1
  local.get $2
  call $assembly/index/writeUint32LE
 )
 (func $~setArgumentsLength (; 23 ;) (param $0 i32)
  local.get $0
  global.set $~argumentsLength
 )
)
