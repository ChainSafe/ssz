(module
 (type $i32_=>_none (func (param i32)))
 (type $none_=>_i32 (func (result i32)))
 (type $none_=>_none (func))
 (type $i32_=>_f64 (func (param i32) (result f64)))
 (memory $0 1)
 (data (i32.const 16) "\1c\00\00\00\01\00\00\00\01\00\00\00\1c\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00l\00e\00n\00g\00t\00h")
 (data (i32.const 64) "&\00\00\00\01\00\00\00\01\00\00\00&\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00b\00u\00f\00f\00e\00r\00.\00t\00s")
 (global $assembly/index/INPUT_LENGTH i32 (i32.const 512))
 (global $~lib/rt/stub/startOffset (mut i32) (i32.const 0))
 (global $~lib/rt/stub/offset (mut i32) (i32.const 0))
 (global $assembly/index/input (mut i32) (i32.const 0))
 (global $assembly/index/inputPtr (mut i32) (i32.const 0))
 (global $assembly/index/output (mut i32) (i32.const 0))
 (global $assembly/index/outputPtr (mut i32) (i32.const 0))
 (export "memory" (memory $0))
 (export "INPUT_LENGTH" (global $assembly/index/INPUT_LENGTH))
 (export "input" (global $assembly/index/input))
 (export "output" (global $assembly/index/output))
 (export "stream" (func $assembly/index/stream))
 (start $~start)
 (func $~lib/rt/stub/maybeGrowMemory (; 0 ;) (param $0 i32)
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
 (func $~lib/rt/stub/__alloc (; 1 ;) (result i32)
  (local $0 i32)
  (local $1 i32)
  global.get $~lib/rt/stub/offset
  i32.const 16
  i32.add
  local.tee $1
  i32.const 512
  i32.add
  call $~lib/rt/stub/maybeGrowMemory
  local.get $1
  i32.const 16
  i32.sub
  local.tee $0
  i32.const 512
  i32.store
  local.get $0
  i32.const 1
  i32.store offset=4
  local.get $0
  i32.const 0
  i32.store offset=8
  local.get $0
  i32.const 512
  i32.store offset=12
  local.get $1
 )
 (func $~lib/memory/memory.fill (; 2 ;) (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  i32.const 512
  local.set $1
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
 (func $~lib/arraybuffer/ArrayBuffer#constructor (; 3 ;) (result i32)
  (local $0 i32)
  call $~lib/rt/stub/__alloc
  local.tee $0
  call $~lib/memory/memory.fill
  local.get $0
 )
 (func $assembly/index/stream (; 4 ;) (param $0 i32) (result f64)
  (local $1 i32)
  loop $for-loop|0
   local.get $1
   local.get $0
   i32.lt_s
   if
    local.get $1
    global.get $assembly/index/outputPtr
    i32.add
    local.get $1
    global.get $assembly/index/inputPtr
    i32.add
    i32.load8_u
    i32.const 1
    i32.add
    i32.store8
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $for-loop|0
   end
  end
  local.get $0
  f64.convert_i32_s
 )
 (func $~start (; 5 ;)
  i32.const 128
  global.set $~lib/rt/stub/startOffset
  i32.const 128
  global.set $~lib/rt/stub/offset
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/index/input
  global.get $assembly/index/input
  global.set $assembly/index/inputPtr
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/index/output
  global.get $assembly/index/output
  global.set $assembly/index/outputPtr
 )
)
