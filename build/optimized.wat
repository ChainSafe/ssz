(module
 (type $FUNCSIG$iii (func (param i32 i32) (result i32)))
 (type $FUNCSIG$ii (func (param i32) (result i32)))
 (type $FUNCSIG$vi (func (param i32)))
 (type $FUNCSIG$v (func))
 (type $FUNCSIG$viiii (func (param i32 i32 i32 i32)))
 (type $FUNCSIG$viii (func (param i32 i32 i32)))
 (type $FUNCSIG$vii (func (param i32 i32)))
 (type $FUNCSIG$iiiiii (func (param i32 i32 i32 i32 i32) (result i32)))
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
 (memory $0 1)
 (data (i32.const 9) "\01\00\00\01")
 (data (i32.const 21) "\01\00\00B\8a/\98q7D\91\b5\c0\fb\cf\e9\b5\db\a59V\c2[Y\f1\11\f1\92?\82\a4\ab\1c^\d5\d8\07\aa\98\12\83[\01$1\85\beU\0c}\c3r\be]t\80\de\b1\fe\9b\dc\06\a7\c1\9b\f1t\e4\9bi\c1\ef\beG\86\0f\c1\9d\c6$\0c\a1\cc-\e9,oJt\84\aa\\\b0\a9\dcv\f9\88\da\98>QR\a81\c6m\b0\03\'\c8\bfY\7f\c7\c6\e0\0b\f3\d5\a7\91G\06\cacQ\14))g\'\b7\n\85.\1b!8M,m\fcS8\0d\13e\nsTvj\n\bb\81\c2\c9.\92r,\85\a2\bf\e8\a1\a8\1afK\c2K\8bp\c7lQ\a3\d1\92\e8\19\d6\99\06$\f4\0e5\85\10j\a0p\19\a4\c1\16\1e7l\08\'HwL4\b0\bc\b59\1c\0c\b3N\d8\aaJ[\9c\caOh.o\f3t\8f\82\eex\a5co\84\c8x\14\8c\c7\02\08\90\be\ff\fa\a4Pl\eb\be\f9\a3\f7\c6qx\f2")
 (data (i32.const 280) "\10\00\00\00\01\00\00\00\04\00\00\00\10\00\00\00\18\00\00\00\18\00\00\00\00\01\00\00\00\01")
 (data (i32.const 312) " \00\00\00\01\00\00\00\00\00\00\00 \00\00\00j\t\e6g\bbg\ae\85<n\f3r\a5O\f5:Q\0eR\7f\9b\05h\8c\1f\83\d9\ab[\e0\cd\19")
 (data (i32.const 360) "\10\00\00\00\01\00\00\00\04\00\00\00\10\00\00\00H\01\00\00H\01\00\00 \00\00\00 ")
 (data (i32.const 392) "\1c\00\00\00\01\00\00\00\01\00\00\00\1c\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00l\00e\00n\00g\00t\00h")
 (data (i32.const 440) "&\00\00\00\01\00\00\00\01\00\00\00&\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00b\00u\00f\00f\00e\00r\00.\00t\00s")
 (data (i32.const 496) "$\00\00\00\01\00\00\00\01\00\00\00$\00\00\00I\00n\00d\00e\00x\00 \00o\00u\00t\00 \00o\00f\00 \00r\00a\00n\00g\00e")
 (data (i32.const 552) "\1a\00\00\00\01\00\00\00\01\00\00\00\1a\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00.\00t\00s")
 (data (i32.const 600) "^\00\00\00\01\00\00\00\01\00\00\00^\00\00\00S\00H\00A\002\005\006\00:\00 \00c\00a\00n\00\'\00t\00 \00u\00p\00d\00a\00t\00e\00 \00b\00e\00c\00a\00u\00s\00e\00 \00h\00a\00s\00h\00 \00w\00a\00s\00 \00f\00i\00n\00i\00s\00h\00e\00d\00.")
 (data (i32.const 712) "\"\00\00\00\01\00\00\00\01\00\00\00\"\00\00\00a\00s\00s\00e\00m\00b\00l\00y\00/\00i\00n\00d\00e\00x\00.\00t\00s")
 (data (i32.const 768) "$\00\00\00\01\00\00\00\01\00\00\00$\00\00\00~\00l\00i\00b\00/\00t\00y\00p\00e\00d\00a\00r\00r\00a\00y\00.\00t\00s")
 (data (i32.const 824) "\05\00\00\00\10\00\00\00\00\00\00\00\10\00\00\00\00\00\00\00\10\00\00\00\00\00\00\001\00\00\00\02\00\00\003\00\00\00\02")
 (global $~lib/rt/stub/startOffset (mut i32) (i32.const 0))
 (global $~lib/rt/stub/offset (mut i32) (i32.const 0))
 (global $assembly/index/UINT8ARRAY_ID i32 (i32.const 3))
 (global $assembly/index/iv i32 (i32.const 376))
 (global $assembly/index/state (mut i32) (i32.const 0))
 (global $assembly/index/temp (mut i32) (i32.const 0))
 (global $assembly/index/buffer (mut i32) (i32.const 0))
 (global $assembly/index/bufferLength (mut i32) (i32.const 0))
 (global $assembly/index/bytesHashed (mut i32) (i32.const 0))
 (global $assembly/index/finished (mut i32) (i32.const 0))
 (global $assembly/index/out (mut i32) (i32.const 0))
 (global $assembly/index/K (mut i32) (i32.const 0))
 (global $~lib/rt/__rtti_base i32 (i32.const 824))
 (export "memory" (memory $0))
 (export "__alloc" (func $~lib/rt/stub/__alloc))
 (export "__retain" (func $~lib/rt/stub/__retain))
 (export "__release" (func $~lib/rt/stub/__release))
 (export "__collect" (func $~lib/rt/stub/__collect))
 (export "__rtti_base" (global $~lib/rt/__rtti_base))
 (export "UINT8ARRAY_ID" (global $assembly/index/UINT8ARRAY_ID))
 (export "update" (func $assembly/index/update))
 (export "finish" (func $assembly/index/finish))
 (export "hashMe" (func $assembly/index/hashMe))
 (start $start)
 (func $~lib/rt/stub/__alloc (; 1 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
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
  i32.const 1
  local.get $0
  i32.const 1
  i32.gt_u
  select
  i32.add
  i32.const 15
  i32.add
  i32.const -16
  i32.and
  local.tee $2
  memory.size
  local.tee $4
  i32.const 16
  i32.shl
  i32.gt_u
  if
   local.get $4
   local.get $2
   local.get $3
   i32.sub
   i32.const 65535
   i32.add
   i32.const -65536
   i32.and
   i32.const 16
   i32.shr_u
   local.tee $5
   local.get $4
   local.get $5
   i32.gt_s
   select
   memory.grow
   i32.const 0
   i32.lt_s
   if
    local.get $5
    memory.grow
    i32.const 0
    i32.lt_s
    if
     unreachable
    end
   end
  end
  local.get $2
  global.set $~lib/rt/stub/offset
  local.get $3
  i32.const 16
  i32.sub
  local.tee $2
  local.get $1
  i32.store offset=8
  local.get $2
  local.get $0
  i32.store offset=12
  local.get $3
 )
 (func $~lib/rt/stub/__retain (; 2 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  local.get $0
 )
 (func $~lib/rt/stub/__release (; 3 ;) (type $FUNCSIG$vi) (param $0 i32)
  nop
 )
 (func $~lib/rt/stub/__collect (; 4 ;) (type $FUNCSIG$v)
  nop
 )
 (func $~lib/memory/memory.fill (; 5 ;) (type $FUNCSIG$vii) (param $0 i32) (param $1 i32)
  (local $2 i32)
  block $~lib/util/memory/memset|inlined.0
   local.get $1
   i32.eqz
   br_if $~lib/util/memory/memset|inlined.0
   local.get $0
   i32.const 0
   i32.store8
   local.get $0
   local.get $1
   i32.add
   i32.const 1
   i32.sub
   i32.const 0
   i32.store8
   local.get $1
   i32.const 2
   i32.le_u
   br_if $~lib/util/memory/memset|inlined.0
   local.get $0
   i32.const 1
   i32.add
   i32.const 0
   i32.store8
   local.get $0
   i32.const 2
   i32.add
   i32.const 0
   i32.store8
   local.get $0
   local.get $1
   i32.add
   local.tee $2
   i32.const 2
   i32.sub
   i32.const 0
   i32.store8
   local.get $2
   i32.const 3
   i32.sub
   i32.const 0
   i32.store8
   local.get $1
   i32.const 6
   i32.le_u
   br_if $~lib/util/memory/memset|inlined.0
   local.get $0
   i32.const 3
   i32.add
   i32.const 0
   i32.store8
   local.get $0
   local.get $1
   i32.add
   i32.const 4
   i32.sub
   i32.const 0
   i32.store8
   local.get $1
   i32.const 8
   i32.le_u
   br_if $~lib/util/memory/memset|inlined.0
   local.get $1
   i32.const 0
   local.get $0
   i32.sub
   i32.const 3
   i32.and
   local.tee $1
   i32.sub
   local.get $0
   local.get $1
   i32.add
   local.tee $0
   i32.const 0
   i32.store
   i32.const -4
   i32.and
   local.tee $1
   local.get $0
   i32.add
   i32.const 4
   i32.sub
   i32.const 0
   i32.store
   local.get $1
   i32.const 8
   i32.le_u
   br_if $~lib/util/memory/memset|inlined.0
   local.get $0
   i32.const 4
   i32.add
   i32.const 0
   i32.store
   local.get $0
   i32.const 8
   i32.add
   i32.const 0
   i32.store
   local.get $0
   local.get $1
   i32.add
   local.tee $2
   i32.const 12
   i32.sub
   i32.const 0
   i32.store
   local.get $2
   i32.const 8
   i32.sub
   i32.const 0
   i32.store
   local.get $1
   i32.const 24
   i32.le_u
   br_if $~lib/util/memory/memset|inlined.0
   local.get $0
   i32.const 12
   i32.add
   i32.const 0
   i32.store
   local.get $0
   i32.const 16
   i32.add
   i32.const 0
   i32.store
   local.get $0
   i32.const 20
   i32.add
   i32.const 0
   i32.store
   local.get $0
   i32.const 24
   i32.add
   i32.const 0
   i32.store
   local.get $0
   local.get $1
   i32.add
   local.tee $2
   i32.const 28
   i32.sub
   i32.const 0
   i32.store
   local.get $2
   i32.const 24
   i32.sub
   i32.const 0
   i32.store
   local.get $2
   i32.const 20
   i32.sub
   i32.const 0
   i32.store
   local.get $2
   i32.const 16
   i32.sub
   i32.const 0
   i32.store
   local.get $0
   i32.const 4
   i32.and
   i32.const 24
   i32.add
   local.tee $2
   local.get $0
   i32.add
   local.set $0
   local.get $1
   local.get $2
   i32.sub
   local.set $1
   loop $continue|0
    local.get $1
    i32.const 32
    i32.ge_u
    if
     local.get $0
     i64.const 0
     i64.store
     local.get $0
     i32.const 8
     i32.add
     i64.const 0
     i64.store
     local.get $0
     i32.const 16
     i32.add
     i64.const 0
     i64.store
     local.get $0
     i32.const 24
     i32.add
     i64.const 0
     i64.store
     local.get $1
     i32.const 32
     i32.sub
     local.set $1
     local.get $0
     i32.const 32
     i32.add
     local.set $0
     br $continue|0
    end
   end
  end
 )
 (func $~lib/arraybuffer/ArrayBuffer#constructor (; 6 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  (local $1 i32)
  local.get $0
  i32.const 1073741808
  i32.gt_u
  if
   i32.const 408
   i32.const 456
   i32.const 57
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
 (func $~lib/array/Array<u8>#__get (; 7 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  local.get $1
  local.get $0
  i32.load offset=8
  i32.ge_u
  if
   i32.const 512
   i32.const 568
   i32.const 109
   i32.const 61
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.load offset=4
  local.get $1
  i32.add
  i32.load8_u
 )
 (func $start:assembly/index (; 8 ;) (type $FUNCSIG$v)
  (local $0 i32)
  i32.const 32
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/index/state
  i32.const 256
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/index/temp
  i32.const 128
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/index/buffer
  i32.const 32
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/index/out
  i32.const 256
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/index/K
  loop $loop|0
   local.get $0
   i32.const 308
   i32.load
   i32.lt_s
   if
    global.get $assembly/index/K
    local.get $0
    i32.add
    i32.const 296
    local.get $0
    call $~lib/array/Array<u8>#__get
    i32.store8
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $loop|0
   end
  end
 )
 (func $~lib/typedarray/Uint8Array#__get (; 9 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  local.get $1
  local.get $0
  i32.load offset=8
  i32.ge_u
  if
   i32.const 512
   i32.const 784
   i32.const 135
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
 (func $assembly/index/hashBlocks (; 10 ;) (type $FUNCSIG$iiiiii) (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (result i32)
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
  loop $continue|0
   local.get $4
   i32.const 64
   i32.ge_u
   if
    local.get $1
    i32.load
    local.tee $5
    i32.const -16711936
    i32.and
    i32.const 8
    i32.rotl
    local.get $5
    i32.const 16711935
    i32.and
    i32.const 8
    i32.rotr
    i32.or
    local.set $8
    local.get $1
    i32.const 4
    i32.add
    i32.load
    local.tee $5
    i32.const -16711936
    i32.and
    i32.const 8
    i32.rotl
    local.get $5
    i32.const 16711935
    i32.and
    i32.const 8
    i32.rotr
    i32.or
    local.set $5
    local.get $1
    i32.const 8
    i32.add
    i32.load
    local.tee $12
    i32.const -16711936
    i32.and
    i32.const 8
    i32.rotl
    local.get $12
    i32.const 16711935
    i32.and
    i32.const 8
    i32.rotr
    i32.or
    local.set $12
    local.get $1
    i32.const 12
    i32.add
    i32.load
    local.tee $10
    i32.const -16711936
    i32.and
    i32.const 8
    i32.rotl
    local.get $10
    i32.const 16711935
    i32.and
    i32.const 8
    i32.rotr
    i32.or
    local.set $14
    local.get $1
    i32.const 16
    i32.add
    i32.load
    local.tee $10
    i32.const -16711936
    i32.and
    i32.const 8
    i32.rotl
    local.get $10
    i32.const 16711935
    i32.and
    i32.const 8
    i32.rotr
    i32.or
    local.set $9
    local.get $1
    i32.const 20
    i32.add
    i32.load
    local.tee $10
    i32.const -16711936
    i32.and
    i32.const 8
    i32.rotl
    local.get $10
    i32.const 16711935
    i32.and
    i32.const 8
    i32.rotr
    i32.or
    local.set $10
    local.get $1
    i32.const 24
    i32.add
    i32.load
    local.tee $13
    i32.const -16711936
    i32.and
    i32.const 8
    i32.rotl
    local.get $13
    i32.const 16711935
    i32.and
    i32.const 8
    i32.rotr
    i32.or
    local.set $13
    local.get $1
    i32.const 28
    i32.add
    i32.load
    local.tee $11
    i32.const -16711936
    i32.and
    i32.const 8
    i32.rotl
    local.get $11
    i32.const 16711935
    i32.and
    i32.const 8
    i32.rotr
    i32.or
    local.set $11
    i32.const 0
    local.set $7
    loop $loop|1
     local.get $7
     i32.const 16
     i32.lt_u
     if
      local.get $7
      i32.const 2
      i32.shl
      local.get $3
      i32.add
      local.tee $6
      local.get $2
      i32.add
      i32.load8_u
      local.set $15
      local.get $7
      i32.const 2
      i32.shl
      local.get $0
      i32.add
      local.get $6
      i32.const 3
      i32.add
      local.get $2
      i32.add
      i32.load8_u
      local.get $15
      i32.const 255
      i32.and
      i32.const 24
      i32.shl
      local.get $6
      i32.const 1
      i32.add
      local.get $2
      i32.add
      i32.load8_u
      i32.const 16
      i32.shl
      i32.or
      local.get $6
      i32.const 2
      i32.add
      local.get $2
      i32.add
      i32.load8_u
      i32.const 8
      i32.shl
      i32.or
      i32.or
      local.tee $6
      i32.const -16711936
      i32.and
      i32.const 8
      i32.rotl
      local.get $6
      i32.const 16711935
      i32.and
      i32.const 8
      i32.rotr
      i32.or
      i32.store
      local.get $7
      i32.const 1
      i32.add
      local.set $7
      br $loop|1
     end
    end
    i32.const 16
    local.set $7
    loop $loop|2
     local.get $7
     i32.const 64
     i32.lt_u
     if
      local.get $7
      i32.const 2
      i32.shl
      local.get $0
      i32.add
      local.get $7
      i32.const 7
      i32.sub
      i32.const 2
      i32.shl
      local.get $0
      i32.add
      i32.load
      local.tee $6
      i32.const -16711936
      i32.and
      i32.const 8
      i32.rotl
      local.get $6
      i32.const 16711935
      i32.and
      i32.const 8
      i32.rotr
      i32.or
      local.get $7
      i32.const 2
      i32.sub
      i32.const 2
      i32.shl
      local.get $0
      i32.add
      i32.load
      local.tee $6
      i32.const -16711936
      i32.and
      i32.const 8
      i32.rotl
      local.get $6
      i32.const 16711935
      i32.and
      i32.const 8
      i32.rotr
      i32.or
      local.tee $6
      i32.const 15
      i32.shl
      local.get $6
      i32.const 17
      i32.shr_u
      i32.or
      local.get $6
      i32.const 13
      i32.shl
      local.get $6
      i32.const 19
      i32.shr_u
      i32.or
      i32.xor
      local.get $6
      i32.const 10
      i32.shr_u
      i32.xor
      i32.add
      local.get $7
      i32.const 16
      i32.sub
      i32.const 2
      i32.shl
      local.get $0
      i32.add
      i32.load
      local.tee $6
      i32.const -16711936
      i32.and
      i32.const 8
      i32.rotl
      local.get $6
      i32.const 16711935
      i32.and
      i32.const 8
      i32.rotr
      i32.or
      local.get $7
      i32.const 15
      i32.sub
      i32.const 2
      i32.shl
      local.get $0
      i32.add
      i32.load
      local.tee $6
      i32.const -16711936
      i32.and
      i32.const 8
      i32.rotl
      local.get $6
      i32.const 16711935
      i32.and
      i32.const 8
      i32.rotr
      i32.or
      local.tee $6
      i32.const 7
      i32.shr_u
      local.get $6
      i32.const 25
      i32.shl
      i32.or
      local.get $6
      i32.const 14
      i32.shl
      local.get $6
      i32.const 18
      i32.shr_u
      i32.or
      i32.xor
      local.get $6
      i32.const 3
      i32.shr_u
      i32.xor
      i32.add
      i32.add
      local.tee $6
      i32.const -16711936
      i32.and
      i32.const 8
      i32.rotl
      local.get $6
      i32.const 16711935
      i32.and
      i32.const 8
      i32.rotr
      i32.or
      i32.store
      local.get $7
      i32.const 1
      i32.add
      local.set $7
      br $loop|2
     end
    end
    i32.const 0
    local.set $7
    loop $loop|3
     local.get $7
     i32.const 64
     i32.lt_u
     if
      local.get $9
      i32.const 7
      i32.shl
      local.get $9
      i32.const 25
      i32.shr_u
      i32.or
      local.get $9
      i32.const 26
      i32.shl
      local.get $9
      i32.const 6
      i32.shr_u
      i32.or
      local.get $9
      i32.const 21
      i32.shl
      local.get $9
      i32.const 11
      i32.shr_u
      i32.or
      i32.xor
      i32.xor
      local.get $9
      local.get $10
      i32.and
      local.get $9
      i32.const -1
      i32.xor
      local.get $13
      i32.and
      i32.xor
      i32.add
      local.get $11
      global.get $assembly/index/K
      local.get $7
      i32.const 2
      i32.shl
      i32.add
      i32.load
      local.tee $11
      i32.const -16711936
      i32.and
      i32.const 8
      i32.rotl
      local.get $11
      i32.const 16711935
      i32.and
      i32.const 8
      i32.rotr
      i32.or
      local.get $7
      i32.const 2
      i32.shl
      local.get $0
      i32.add
      i32.load
      local.tee $11
      i32.const -16711936
      i32.and
      i32.const 8
      i32.rotl
      local.get $11
      i32.const 16711935
      i32.and
      i32.const 8
      i32.rotr
      i32.or
      i32.add
      i32.add
      i32.add
      local.set $6
      local.get $8
      i32.const 10
      i32.shl
      local.get $8
      i32.const 22
      i32.shr_u
      i32.or
      local.get $8
      i32.const 30
      i32.shl
      local.get $8
      i32.const 2
      i32.shr_u
      i32.or
      local.get $8
      i32.const 19
      i32.shl
      local.get $8
      i32.const 13
      i32.shr_u
      i32.or
      i32.xor
      i32.xor
      local.get $5
      local.get $12
      i32.and
      local.get $5
      local.get $8
      i32.and
      local.get $8
      local.get $12
      i32.and
      i32.xor
      i32.xor
      i32.add
      local.set $15
      local.get $13
      local.set $11
      local.get $10
      local.set $13
      local.get $9
      local.set $10
      local.get $6
      local.get $14
      i32.add
      local.set $9
      local.get $12
      local.set $14
      local.get $5
      local.set $12
      local.get $8
      local.set $5
      local.get $6
      local.get $15
      i32.add
      local.set $8
      local.get $7
      i32.const 1
      i32.add
      local.set $7
      br $loop|3
     end
    end
    local.get $1
    i32.load
    drop
    local.get $1
    local.get $8
    local.get $1
    i32.load
    local.tee $8
    i32.const -16711936
    i32.and
    i32.const 8
    i32.rotl
    local.get $8
    i32.const 16711935
    i32.and
    i32.const 8
    i32.rotr
    i32.or
    i32.add
    local.tee $8
    i32.const -16711936
    i32.and
    i32.const 8
    i32.rotl
    local.get $8
    i32.const 16711935
    i32.and
    i32.const 8
    i32.rotr
    i32.or
    i32.store
    local.get $1
    i32.const 4
    i32.add
    local.get $5
    local.get $1
    i32.const 4
    i32.add
    i32.load
    local.tee $5
    i32.const -16711936
    i32.and
    i32.const 8
    i32.rotl
    local.get $5
    i32.const 16711935
    i32.and
    i32.const 8
    i32.rotr
    i32.or
    i32.add
    local.tee $5
    i32.const -16711936
    i32.and
    i32.const 8
    i32.rotl
    local.get $5
    i32.const 16711935
    i32.and
    i32.const 8
    i32.rotr
    i32.or
    i32.store
    local.get $1
    i32.const 8
    i32.add
    local.get $1
    i32.const 8
    i32.add
    i32.load
    local.tee $5
    i32.const -16711936
    i32.and
    i32.const 8
    i32.rotl
    local.get $5
    i32.const 16711935
    i32.and
    i32.const 8
    i32.rotr
    i32.or
    local.get $12
    i32.add
    local.tee $5
    i32.const -16711936
    i32.and
    i32.const 8
    i32.rotl
    local.get $5
    i32.const 16711935
    i32.and
    i32.const 8
    i32.rotr
    i32.or
    i32.store
    local.get $1
    i32.const 12
    i32.add
    local.get $1
    i32.const 12
    i32.add
    i32.load
    local.tee $5
    i32.const -16711936
    i32.and
    i32.const 8
    i32.rotl
    local.get $5
    i32.const 16711935
    i32.and
    i32.const 8
    i32.rotr
    i32.or
    local.get $14
    i32.add
    local.tee $5
    i32.const -16711936
    i32.and
    i32.const 8
    i32.rotl
    local.get $5
    i32.const 16711935
    i32.and
    i32.const 8
    i32.rotr
    i32.or
    i32.store
    local.get $1
    i32.const 16
    i32.add
    local.get $1
    i32.const 16
    i32.add
    i32.load
    local.tee $5
    i32.const -16711936
    i32.and
    i32.const 8
    i32.rotl
    local.get $5
    i32.const 16711935
    i32.and
    i32.const 8
    i32.rotr
    i32.or
    local.get $9
    i32.add
    local.tee $5
    i32.const -16711936
    i32.and
    i32.const 8
    i32.rotl
    local.get $5
    i32.const 16711935
    i32.and
    i32.const 8
    i32.rotr
    i32.or
    i32.store
    local.get $1
    i32.const 20
    i32.add
    local.get $1
    i32.const 20
    i32.add
    i32.load
    local.tee $5
    i32.const -16711936
    i32.and
    i32.const 8
    i32.rotl
    local.get $5
    i32.const 16711935
    i32.and
    i32.const 8
    i32.rotr
    i32.or
    local.get $10
    i32.add
    local.tee $5
    i32.const -16711936
    i32.and
    i32.const 8
    i32.rotl
    local.get $5
    i32.const 16711935
    i32.and
    i32.const 8
    i32.rotr
    i32.or
    i32.store
    local.get $1
    i32.const 24
    i32.add
    local.get $1
    i32.const 24
    i32.add
    i32.load
    local.tee $5
    i32.const -16711936
    i32.and
    i32.const 8
    i32.rotl
    local.get $5
    i32.const 16711935
    i32.and
    i32.const 8
    i32.rotr
    i32.or
    local.get $13
    i32.add
    local.tee $5
    i32.const -16711936
    i32.and
    i32.const 8
    i32.rotl
    local.get $5
    i32.const 16711935
    i32.and
    i32.const 8
    i32.rotr
    i32.or
    i32.store
    local.get $1
    i32.const 28
    i32.add
    local.get $1
    i32.const 28
    i32.add
    i32.load
    local.tee $5
    i32.const -16711936
    i32.and
    i32.const 8
    i32.rotl
    local.get $5
    i32.const 16711935
    i32.and
    i32.const 8
    i32.rotr
    i32.or
    local.get $11
    i32.add
    local.tee $5
    i32.const -16711936
    i32.and
    i32.const 8
    i32.rotl
    local.get $5
    i32.const 16711935
    i32.and
    i32.const 8
    i32.rotr
    i32.or
    i32.store
    local.get $3
    i32.const -64
    i32.sub
    local.set $3
    local.get $4
    i32.const -64
    i32.add
    local.set $4
    br $continue|0
   end
  end
  local.get $3
 )
 (func $assembly/index/update (; 11 ;) (type $FUNCSIG$vii) (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  global.get $assembly/index/finished
  if
   i32.const 616
   i32.const 728
   i32.const 150
   i32.const 4
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  call $~lib/arraybuffer/ArrayBuffer#constructor
  local.set $3
  loop $loop|0
   local.get $2
   local.get $1
   i32.lt_u
   if
    local.get $2
    local.get $3
    i32.add
    local.get $0
    local.get $2
    call $~lib/typedarray/Uint8Array#__get
    i32.store8
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $loop|0
   end
  end
  i32.const 0
  local.set $2
  global.get $assembly/index/bytesHashed
  local.get $1
  i32.add
  global.set $assembly/index/bytesHashed
  global.get $assembly/index/bufferLength
  i32.const 0
  i32.gt_u
  if
   loop $continue|1
    local.get $1
    i32.const 0
    i32.gt_u
    i32.const 0
    global.get $assembly/index/bufferLength
    i32.const 64
    i32.lt_u
    select
    if
     global.get $assembly/index/bufferLength
     local.tee $4
     i32.const 1
     i32.add
     global.set $assembly/index/bufferLength
     local.get $2
     local.tee $0
     i32.const 1
     i32.add
     local.set $2
     local.get $4
     global.get $assembly/index/buffer
     i32.add
     local.get $0
     local.get $3
     i32.add
     i32.load8_u
     i32.store8
     local.get $1
     i32.const 1
     i32.sub
     local.set $1
     br $continue|1
    end
   end
   global.get $assembly/index/bufferLength
   i32.const 64
   i32.eq
   if
    global.get $assembly/index/temp
    global.get $assembly/index/state
    global.get $assembly/index/buffer
    i32.const 0
    i32.const 64
    call $assembly/index/hashBlocks
    drop
    i32.const 0
    global.set $assembly/index/bufferLength
   end
  end
  local.get $1
  i32.const 64
  i32.ge_u
  if
   global.get $assembly/index/temp
   global.get $assembly/index/state
   local.get $3
   local.get $2
   local.get $1
   call $assembly/index/hashBlocks
   local.set $2
   local.get $1
   i32.const 63
   i32.and
   local.set $1
  end
  loop $continue|2
   local.get $1
   i32.const 0
   i32.gt_u
   if
    global.get $assembly/index/bufferLength
    local.tee $4
    i32.const 1
    i32.add
    global.set $assembly/index/bufferLength
    local.get $2
    local.tee $0
    i32.const 1
    i32.add
    local.set $2
    local.get $4
    global.get $assembly/index/buffer
    i32.add
    local.get $0
    local.get $3
    i32.add
    i32.load8_u
    i32.store8
    local.get $1
    i32.const 1
    i32.sub
    local.set $1
    br $continue|2
   end
  end
 )
 (func $assembly/index/finish (; 12 ;) (type $FUNCSIG$vi) (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  global.get $assembly/index/finished
  i32.eqz
  if
   global.get $assembly/index/bytesHashed
   local.tee $1
   i32.const 536870912
   i32.div_u
   local.set $3
   local.get $1
   i32.const 3
   i32.shl
   local.set $4
   i32.const 64
   i32.const 128
   local.get $1
   i32.const 63
   i32.and
   i32.const 56
   i32.lt_u
   select
   local.set $1
   global.get $assembly/index/bufferLength
   local.tee $2
   global.get $assembly/index/buffer
   i32.add
   i32.const 128
   i32.store8
   local.get $2
   i32.const 1
   i32.add
   local.set $2
   loop $loop|0
    local.get $2
    local.get $1
    i32.const 8
    i32.sub
    i32.lt_s
    if
     global.get $assembly/index/buffer
     local.get $2
     i32.add
     i32.const 0
     i32.store8
     local.get $2
     i32.const 1
     i32.add
     local.set $2
     br $loop|0
    end
   end
   global.get $assembly/index/buffer
   local.get $1
   i32.const 8
   i32.sub
   i32.const 2
   i32.shr_s
   i32.const 2
   i32.shl
   i32.add
   local.get $3
   i32.const -16711936
   i32.and
   i32.const 8
   i32.rotl
   local.get $3
   i32.const 16711935
   i32.and
   i32.const 8
   i32.rotr
   i32.or
   i32.store
   global.get $assembly/index/buffer
   local.get $1
   i32.const 4
   i32.sub
   i32.const 2
   i32.shr_s
   i32.const 2
   i32.shl
   i32.add
   local.get $4
   i32.const -16711936
   i32.and
   i32.const 8
   i32.rotl
   local.get $4
   i32.const 16711935
   i32.and
   i32.const 8
   i32.rotr
   i32.or
   i32.store
   global.get $assembly/index/temp
   global.get $assembly/index/state
   global.get $assembly/index/buffer
   i32.const 0
   local.get $1
   call $assembly/index/hashBlocks
   drop
   i32.const 1
   global.set $assembly/index/finished
  end
  i32.const 0
  local.set $1
  loop $loop|1
   local.get $1
   i32.const 8
   i32.lt_s
   if
    local.get $1
    i32.const 2
    i32.shl
    local.get $0
    i32.add
    global.get $assembly/index/state
    local.get $1
    i32.const 2
    i32.shl
    i32.add
    i32.load
    local.tee $2
    i32.const -16711936
    i32.and
    i32.const 8
    i32.rotl
    local.get $2
    i32.const 16711935
    i32.and
    i32.const 8
    i32.rotr
    i32.or
    local.tee $2
    i32.const -16711936
    i32.and
    i32.const 8
    i32.rotl
    local.get $2
    i32.const 16711935
    i32.and
    i32.const 8
    i32.rotr
    i32.or
    i32.store
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $loop|1
   end
  end
 )
 (func $assembly/index/reset (; 13 ;) (type $FUNCSIG$v)
  (local $0 i32)
  loop $loop|0
   local.get $0
   i32.const 32
   i32.lt_s
   if
    global.get $assembly/index/state
    local.get $0
    i32.add
    global.get $assembly/index/iv
    local.get $0
    call $~lib/array/Array<u8>#__get
    i32.store8
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $loop|0
   end
  end
  i32.const 0
  global.set $assembly/index/bufferLength
  i32.const 0
  global.set $assembly/index/bytesHashed
  i32.const 0
  global.set $assembly/index/finished
 )
 (func $~lib/arraybuffer/ArrayBufferView#constructor (; 14 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  (local $1 i32)
  i32.const 32
  i32.const 0
  call $~lib/rt/stub/__alloc
  local.tee $1
  i32.const 32
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
  i32.const 32
  i32.store offset=8
  local.get $0
 )
 (func $~lib/typedarray/Uint8Array#__set (; 15 ;) (type $FUNCSIG$viii) (param $0 i32) (param $1 i32) (param $2 i32)
  local.get $1
  local.get $0
  i32.load offset=8
  i32.ge_u
  if
   i32.const 512
   i32.const 784
   i32.const 146
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
 (func $assembly/index/hashMe (; 16 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  (local $1 i32)
  call $assembly/index/reset
  local.get $0
  local.get $0
  i32.load offset=8
  call $assembly/index/update
  global.get $assembly/index/out
  call $assembly/index/finish
  i32.const 12
  i32.const 3
  call $~lib/rt/stub/__alloc
  call $~lib/arraybuffer/ArrayBufferView#constructor
  local.set $0
  loop $loop|0
   local.get $1
   i32.const 32
   i32.lt_u
   if
    local.get $0
    local.get $1
    global.get $assembly/index/out
    local.get $1
    i32.add
    i32.load8_u
    call $~lib/typedarray/Uint8Array#__set
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $loop|0
   end
  end
  local.get $0
 )
 (func $start (; 17 ;) (type $FUNCSIG$v)
  i32.const 880
  global.set $~lib/rt/stub/startOffset
  global.get $~lib/rt/stub/startOffset
  global.set $~lib/rt/stub/offset
  call $start:assembly/index
 )
)
