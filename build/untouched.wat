(module
 (type $FUNCSIG$iii (func (param i32 i32) (result i32)))
 (type $FUNCSIG$ii (func (param i32) (result i32)))
 (type $FUNCSIG$vi (func (param i32)))
 (type $FUNCSIG$v (func))
 (type $FUNCSIG$viiii (func (param i32 i32 i32 i32)))
 (type $FUNCSIG$viii (func (param i32 i32 i32)))
 (type $FUNCSIG$vii (func (param i32 i32)))
 (type $FUNCSIG$iiiiii (func (param i32 i32 i32 i32 i32) (result i32)))
 (type $FUNCSIG$iiii (func (param i32 i32 i32) (result i32)))
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
 (memory $0 1)
 (data (i32.const 8) "\00\01\00\00\01\00\00\00\00\00\00\00\00\01\00\00B\8a/\98q7D\91\b5\c0\fb\cf\e9\b5\db\a59V\c2[Y\f1\11\f1\92?\82\a4\ab\1c^\d5\d8\07\aa\98\12\83[\01$1\85\beU\0c}\c3r\be]t\80\de\b1\fe\9b\dc\06\a7\c1\9b\f1t\e4\9bi\c1\ef\beG\86\0f\c1\9d\c6$\0c\a1\cc-\e9,oJt\84\aa\\\b0\a9\dcv\f9\88\da\98>QR\a81\c6m\b0\03\'\c8\bfY\7f\c7\c6\e0\0b\f3\d5\a7\91G\06\cacQ\14))g\'\b7\n\85.\1b!8M,m\fcS8\0d\13e\nsTvj\n\bb\81\c2\c9.\92r,\85\a2\bf\e8\a1\a8\1afK\c2K\8bp\c7lQ\a3\d1\92\e8\19\d6\99\06$\f4\0e5\85\10j\a0p\19\a4\c1\16\1e7l\08\'HwL4\b0\bc\b59\1c\0c\b3N\d8\aaJ[\9c\caOh.o\f3t\8f\82\eex\a5co\84\c8x\14\8c\c7\02\08\90\be\ff\fa\a4Pl\eb\be\f9\a3\f7\c6qx\f2")
 (data (i32.const 280) "\10\00\00\00\01\00\00\00\04\00\00\00\10\00\00\00\18\00\00\00\18\00\00\00\00\01\00\00\00\01\00\00")
 (data (i32.const 312) " \00\00\00\01\00\00\00\00\00\00\00 \00\00\00j\t\e6g\bbg\ae\85<n\f3r\a5O\f5:Q\0eR\7f\9b\05h\8c\1f\83\d9\ab[\e0\cd\19")
 (data (i32.const 360) "\10\00\00\00\01\00\00\00\04\00\00\00\10\00\00\00H\01\00\00H\01\00\00 \00\00\00 \00\00\00")
 (data (i32.const 392) "\1c\00\00\00\01\00\00\00\01\00\00\00\1c\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00l\00e\00n\00g\00t\00h\00")
 (data (i32.const 440) "&\00\00\00\01\00\00\00\01\00\00\00&\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00b\00u\00f\00f\00e\00r\00.\00t\00s\00")
 (data (i32.const 496) "$\00\00\00\01\00\00\00\01\00\00\00$\00\00\00I\00n\00d\00e\00x\00 \00o\00u\00t\00 \00o\00f\00 \00r\00a\00n\00g\00e\00")
 (data (i32.const 552) "\1a\00\00\00\01\00\00\00\01\00\00\00\1a\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00.\00t\00s\00")
 (data (i32.const 600) "^\00\00\00\01\00\00\00\01\00\00\00^\00\00\00S\00H\00A\002\005\006\00:\00 \00c\00a\00n\00\'\00t\00 \00u\00p\00d\00a\00t\00e\00 \00b\00e\00c\00a\00u\00s\00e\00 \00h\00a\00s\00h\00 \00w\00a\00s\00 \00f\00i\00n\00i\00s\00h\00e\00d\00.\00")
 (data (i32.const 712) "\"\00\00\00\01\00\00\00\01\00\00\00\"\00\00\00a\00s\00s\00e\00m\00b\00l\00y\00/\00i\00n\00d\00e\00x\00.\00t\00s\00")
 (data (i32.const 768) "$\00\00\00\01\00\00\00\01\00\00\00$\00\00\00~\00l\00i\00b\00/\00t\00y\00p\00e\00d\00a\00r\00r\00a\00y\00.\00t\00s\00")
 (data (i32.const 824) "\05\00\00\00\10\00\00\00\00\00\00\00\10\00\00\00\00\00\00\00\10\00\00\00\00\00\00\001\00\00\00\02\00\00\003\00\00\00\02\00\00\00")
 (table $0 1 funcref)
 (elem (i32.const 0) $null)
 (global $~lib/rt/stub/startOffset (mut i32) (i32.const 0))
 (global $~lib/rt/stub/offset (mut i32) (i32.const 0))
 (global $assembly/index/UINT8ARRAY_ID i32 (i32.const 3))
 (global $assembly/index/digestLength i32 (i32.const 32))
 (global $assembly/index/k i32 (i32.const 296))
 (global $assembly/index/iv (mut i32) (i32.const 376))
 (global $~lib/ASC_SHRINK_LEVEL i32 (i32.const 0))
 (global $assembly/index/state (mut i32) (i32.const 0))
 (global $assembly/index/temp (mut i32) (i32.const 0))
 (global $assembly/index/buffer (mut i32) (i32.const 0))
 (global $assembly/index/bufferLength (mut i32) (i32.const 0))
 (global $assembly/index/bytesHashed (mut i32) (i32.const 0))
 (global $assembly/index/finished (mut i32) (i32.const 0))
 (global $assembly/index/out (mut i32) (i32.const 0))
 (global $assembly/index/K (mut i32) (i32.const 0))
 (global $~lib/rt/__rtti_base i32 (i32.const 824))
 (global $~lib/heap/__heap_base i32 (i32.const 868))
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
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
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
  local.get $2
  local.get $0
  local.tee $3
  i32.const 1
  local.tee $4
  local.get $3
  local.get $4
  i32.gt_u
  select
  i32.add
  i32.const 15
  i32.add
  i32.const 15
  i32.const -1
  i32.xor
  i32.and
  local.set $5
  memory.size
  local.set $6
  local.get $5
  local.get $6
  i32.const 16
  i32.shl
  i32.gt_u
  if
   local.get $5
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
   local.get $6
   local.tee $4
   local.get $3
   local.tee $7
   local.get $4
   local.get $7
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
  local.get $5
  global.set $~lib/rt/stub/offset
  local.get $2
  i32.const 16
  i32.sub
  local.set $8
  local.get $8
  local.get $1
  i32.store offset=8
  local.get $8
  local.get $0
  i32.store offset=12
  local.get $2
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
 (func $~lib/memory/memory.fill (; 5 ;) (type $FUNCSIG$viii) (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i64)
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
   block $break|0
    loop $continue|0
     local.get $3
     i32.const 32
     i32.ge_u
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
      br $continue|0
     end
    end
   end
  end
 )
 (func $~lib/arraybuffer/ArrayBuffer#constructor (; 6 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  local.get $1
  i32.const 1073741808
  i32.gt_u
  if
   i32.const 408
   i32.const 456
   i32.const 56
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
 (func $~lib/array/Array<u8>#get:length (; 7 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  local.get $0
  i32.load offset=12
 )
 (func $~lib/array/Array<u8>#__unchecked_get (; 8 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  i32.load offset=4
  local.get $1
  i32.const 0
  i32.shl
  i32.add
  i32.load8_u
 )
 (func $~lib/array/Array<u8>#__get (; 9 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  local.get $1
  local.get $0
  i32.load offset=8
  i32.const 0
  i32.shr_u
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
  local.get $1
  call $~lib/array/Array<u8>#__unchecked_get
 )
 (func $~lib/polyfills/bswap<u8> (; 10 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  local.get $0
  return
 )
 (func $start:assembly/index (; 11 ;) (type $FUNCSIG$v)
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  i32.const 0
  i32.const 32
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/index/state
  i32.const 0
  i32.const 256
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/index/temp
  i32.const 0
  i32.const 128
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/index/buffer
  i32.const 0
  global.get $assembly/index/digestLength
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/index/out
  i32.const 0
  i32.const 256
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/index/K
  block $break|0
   i32.const 0
   local.set $0
   loop $repeat|0
    local.get $0
    i32.const 296
    call $~lib/array/Array<u8>#get:length
    i32.lt_s
    i32.eqz
    br_if $break|0
    block $assembly/index/store8_be|inlined.0
     global.get $assembly/index/K
     call $~lib/rt/stub/__retain
     local.set $3
     local.get $0
     local.set $2
     global.get $assembly/index/k
     local.get $0
     call $~lib/array/Array<u8>#__get
     local.set $1
     local.get $3
     local.get $2
     i32.add
     local.get $1
     call $~lib/polyfills/bswap<u8>
     i32.store8
     local.get $3
     call $~lib/rt/stub/__release
    end
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $repeat|0
    unreachable
   end
   unreachable
  end
 )
 (func $~lib/typedarray/Uint8Array#__get (; 12 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  local.get $1
  local.get $0
  i32.load offset=8
  i32.ge_u
  if
   i32.const 512
   i32.const 784
   i32.const 109
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
 (func $~lib/polyfills/bswap<u32> (; 13 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  local.get $0
  i32.const -16711936
  i32.and
  i32.const 8
  i32.rotl
  local.get $0
  i32.const 16711935
  i32.and
  i32.const 8
  i32.rotr
  i32.or
  return
 )
 (func $assembly/index/hashBlocks (; 14 ;) (type $FUNCSIG$iiiiii) (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (result i32)
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
  local.get $0
  call $~lib/rt/stub/__retain
  drop
  local.get $1
  call $~lib/rt/stub/__retain
  drop
  local.get $2
  call $~lib/rt/stub/__retain
  drop
  block $break|0
   loop $continue|0
    local.get $4
    i32.const 64
    i32.ge_u
    if
     block $assembly/index/load32_be|inlined.0 (result i32)
      local.get $1
      call $~lib/rt/stub/__retain
      local.set $19
      i32.const 0
      local.set $18
      local.get $19
      local.get $18
      i32.const 2
      i32.shl
      i32.add
      i32.load
      call $~lib/polyfills/bswap<u32>
      local.set $20
      local.get $19
      call $~lib/rt/stub/__release
      local.get $20
     end
     local.set $5
     block $assembly/index/load32_be|inlined.1 (result i32)
      local.get $1
      call $~lib/rt/stub/__retain
      local.set $18
      i32.const 1
      local.set $20
      local.get $18
      local.get $20
      i32.const 2
      i32.shl
      i32.add
      i32.load
      call $~lib/polyfills/bswap<u32>
      local.set $19
      local.get $18
      call $~lib/rt/stub/__release
      local.get $19
     end
     local.set $6
     block $assembly/index/load32_be|inlined.2 (result i32)
      local.get $1
      call $~lib/rt/stub/__retain
      local.set $20
      i32.const 2
      local.set $19
      local.get $20
      local.get $19
      i32.const 2
      i32.shl
      i32.add
      i32.load
      call $~lib/polyfills/bswap<u32>
      local.set $18
      local.get $20
      call $~lib/rt/stub/__release
      local.get $18
     end
     local.set $7
     block $assembly/index/load32_be|inlined.3 (result i32)
      local.get $1
      call $~lib/rt/stub/__retain
      local.set $19
      i32.const 3
      local.set $18
      local.get $19
      local.get $18
      i32.const 2
      i32.shl
      i32.add
      i32.load
      call $~lib/polyfills/bswap<u32>
      local.set $20
      local.get $19
      call $~lib/rt/stub/__release
      local.get $20
     end
     local.set $8
     block $assembly/index/load32_be|inlined.4 (result i32)
      local.get $1
      call $~lib/rt/stub/__retain
      local.set $18
      i32.const 4
      local.set $20
      local.get $18
      local.get $20
      i32.const 2
      i32.shl
      i32.add
      i32.load
      call $~lib/polyfills/bswap<u32>
      local.set $19
      local.get $18
      call $~lib/rt/stub/__release
      local.get $19
     end
     local.set $9
     block $assembly/index/load32_be|inlined.5 (result i32)
      local.get $1
      call $~lib/rt/stub/__retain
      local.set $20
      i32.const 5
      local.set $19
      local.get $20
      local.get $19
      i32.const 2
      i32.shl
      i32.add
      i32.load
      call $~lib/polyfills/bswap<u32>
      local.set $18
      local.get $20
      call $~lib/rt/stub/__release
      local.get $18
     end
     local.set $10
     block $assembly/index/load32_be|inlined.6 (result i32)
      local.get $1
      call $~lib/rt/stub/__retain
      local.set $19
      i32.const 6
      local.set $18
      local.get $19
      local.get $18
      i32.const 2
      i32.shl
      i32.add
      i32.load
      call $~lib/polyfills/bswap<u32>
      local.set $20
      local.get $19
      call $~lib/rt/stub/__release
      local.get $20
     end
     local.set $11
     block $assembly/index/load32_be|inlined.7 (result i32)
      local.get $1
      call $~lib/rt/stub/__retain
      local.set $18
      i32.const 7
      local.set $20
      local.get $18
      local.get $20
      i32.const 2
      i32.shl
      i32.add
      i32.load
      call $~lib/polyfills/bswap<u32>
      local.set $19
      local.get $18
      call $~lib/rt/stub/__release
      local.get $19
     end
     local.set $12
     block $break|1
      i32.const 0
      local.set $14
      loop $repeat|1
       local.get $14
       i32.const 16
       i32.lt_u
       i32.eqz
       br_if $break|1
       local.get $3
       local.get $14
       i32.const 4
       i32.mul
       i32.add
       local.set $15
       block $assembly/index/store32_be|inlined.0
        local.get $0
        call $~lib/rt/stub/__retain
        local.set $22
        local.get $14
        local.set $21
        block $assembly/index/load8_be|inlined.1 (result i32)
         local.get $2
         call $~lib/rt/stub/__retain
         local.set $20
         local.get $15
         local.set $19
         local.get $20
         local.get $19
         i32.add
         i32.load8_u
         call $~lib/polyfills/bswap<u8>
         local.set $18
         local.get $20
         call $~lib/rt/stub/__release
         local.get $18
        end
        i32.const 255
        i32.and
        i32.const 255
        i32.and
        i32.const 24
        i32.shl
        block $assembly/index/load8_be|inlined.2 (result i32)
         local.get $2
         call $~lib/rt/stub/__retain
         local.set $19
         local.get $15
         i32.const 1
         i32.add
         local.set $18
         local.get $19
         local.get $18
         i32.add
         i32.load8_u
         call $~lib/polyfills/bswap<u8>
         local.set $20
         local.get $19
         call $~lib/rt/stub/__release
         local.get $20
        end
        i32.const 255
        i32.and
        i32.const 255
        i32.and
        i32.const 16
        i32.shl
        i32.or
        block $assembly/index/load8_be|inlined.3 (result i32)
         local.get $2
         call $~lib/rt/stub/__retain
         local.set $18
         local.get $15
         i32.const 2
         i32.add
         local.set $20
         local.get $18
         local.get $20
         i32.add
         i32.load8_u
         call $~lib/polyfills/bswap<u8>
         local.set $19
         local.get $18
         call $~lib/rt/stub/__release
         local.get $19
        end
        i32.const 255
        i32.and
        i32.const 255
        i32.and
        i32.const 8
        i32.shl
        i32.or
        block $assembly/index/load8_be|inlined.4 (result i32)
         local.get $2
         call $~lib/rt/stub/__retain
         local.set $20
         local.get $15
         i32.const 3
         i32.add
         local.set $19
         local.get $20
         local.get $19
         i32.add
         i32.load8_u
         call $~lib/polyfills/bswap<u8>
         local.set $18
         local.get $20
         call $~lib/rt/stub/__release
         local.get $18
        end
        i32.const 255
        i32.and
        i32.const 255
        i32.and
        i32.or
        local.set $18
        local.get $22
        local.get $21
        i32.const 2
        i32.shl
        i32.add
        local.get $18
        call $~lib/polyfills/bswap<u32>
        i32.store
        local.get $22
        call $~lib/rt/stub/__release
       end
       local.get $14
       i32.const 1
       i32.add
       local.set $14
       br $repeat|1
       unreachable
      end
      unreachable
     end
     block $break|2
      i32.const 16
      local.set $14
      loop $repeat|2
       local.get $14
       i32.const 64
       i32.lt_u
       i32.eqz
       br_if $break|2
       block $assembly/index/load32_be|inlined.8 (result i32)
        local.get $0
        call $~lib/rt/stub/__retain
        local.set $20
        local.get $14
        i32.const 2
        i32.sub
        local.set $19
        local.get $20
        local.get $19
        i32.const 2
        i32.shl
        i32.add
        i32.load
        call $~lib/polyfills/bswap<u32>
        local.set $22
        local.get $20
        call $~lib/rt/stub/__release
        local.get $22
       end
       local.set $13
       local.get $13
       i32.const 17
       i32.shr_u
       local.get $13
       i32.const 32
       i32.const 17
       i32.sub
       i32.shl
       i32.or
       local.get $13
       i32.const 19
       i32.shr_u
       local.get $13
       i32.const 32
       i32.const 19
       i32.sub
       i32.shl
       i32.or
       i32.xor
       local.get $13
       i32.const 10
       i32.shr_u
       i32.xor
       local.set $16
       block $assembly/index/load32_be|inlined.9 (result i32)
        local.get $0
        call $~lib/rt/stub/__retain
        local.set $21
        local.get $14
        i32.const 15
        i32.sub
        local.set $18
        local.get $21
        local.get $18
        i32.const 2
        i32.shl
        i32.add
        i32.load
        call $~lib/polyfills/bswap<u32>
        local.set $20
        local.get $21
        call $~lib/rt/stub/__release
        local.get $20
       end
       local.set $13
       local.get $13
       i32.const 7
       i32.shr_u
       local.get $13
       i32.const 32
       i32.const 7
       i32.sub
       i32.shl
       i32.or
       local.get $13
       i32.const 18
       i32.shr_u
       local.get $13
       i32.const 32
       i32.const 18
       i32.sub
       i32.shl
       i32.or
       i32.xor
       local.get $13
       i32.const 3
       i32.shr_u
       i32.xor
       local.set $17
       block $assembly/index/store32_be|inlined.1
        local.get $0
        call $~lib/rt/stub/__retain
        local.set $24
        local.get $14
        local.set $23
        local.get $16
        block $assembly/index/load32_be|inlined.10 (result i32)
         local.get $0
         call $~lib/rt/stub/__retain
         local.set $19
         local.get $14
         i32.const 7
         i32.sub
         local.set $22
         local.get $19
         local.get $22
         i32.const 2
         i32.shl
         i32.add
         i32.load
         call $~lib/polyfills/bswap<u32>
         local.set $21
         local.get $19
         call $~lib/rt/stub/__release
         local.get $21
        end
        i32.add
        i32.const 0
        i32.or
        local.get $17
        block $assembly/index/load32_be|inlined.11 (result i32)
         local.get $0
         call $~lib/rt/stub/__retain
         local.set $18
         local.get $14
         i32.const 16
         i32.sub
         local.set $20
         local.get $18
         local.get $20
         i32.const 2
         i32.shl
         i32.add
         i32.load
         call $~lib/polyfills/bswap<u32>
         local.set $19
         local.get $18
         call $~lib/rt/stub/__release
         local.get $19
        end
        i32.add
        i32.add
        i32.const 0
        i32.or
        local.set $21
        local.get $24
        local.get $23
        i32.const 2
        i32.shl
        i32.add
        local.get $21
        call $~lib/polyfills/bswap<u32>
        i32.store
        local.get $24
        call $~lib/rt/stub/__release
       end
       local.get $14
       i32.const 1
       i32.add
       local.set $14
       br $repeat|2
       unreachable
      end
      unreachable
     end
     block $break|3
      i32.const 0
      local.set $14
      loop $repeat|3
       local.get $14
       i32.const 64
       i32.lt_u
       i32.eqz
       br_if $break|3
       local.get $9
       i32.const 6
       i32.shr_u
       local.get $9
       i32.const 32
       i32.const 6
       i32.sub
       i32.shl
       i32.or
       local.get $9
       i32.const 11
       i32.shr_u
       local.get $9
       i32.const 32
       i32.const 11
       i32.sub
       i32.shl
       i32.or
       i32.xor
       local.get $9
       i32.const 25
       i32.shr_u
       local.get $9
       i32.const 32
       i32.const 25
       i32.sub
       i32.shl
       i32.or
       i32.xor
       local.get $9
       local.get $10
       i32.and
       local.get $9
       i32.const -1
       i32.xor
       local.get $11
       i32.and
       i32.xor
       i32.add
       i32.const 0
       i32.or
       local.get $12
       block $assembly/index/load32_be|inlined.12 (result i32)
        global.get $assembly/index/K
        call $~lib/rt/stub/__retain
        local.set $19
        local.get $14
        local.set $22
        local.get $19
        local.get $22
        i32.const 2
        i32.shl
        i32.add
        i32.load
        call $~lib/polyfills/bswap<u32>
        local.set $24
        local.get $19
        call $~lib/rt/stub/__release
        local.get $24
       end
       block $assembly/index/load32_be|inlined.13 (result i32)
        local.get $0
        call $~lib/rt/stub/__retain
        local.set $18
        local.get $14
        local.set $20
        local.get $18
        local.get $20
        i32.const 2
        i32.shl
        i32.add
        i32.load
        call $~lib/polyfills/bswap<u32>
        local.set $19
        local.get $18
        call $~lib/rt/stub/__release
        local.get $19
       end
       i32.add
       i32.const 0
       i32.or
       i32.add
       i32.const 0
       i32.or
       i32.add
       i32.const 0
       i32.or
       local.set $16
       local.get $5
       i32.const 2
       i32.shr_u
       local.get $5
       i32.const 32
       i32.const 2
       i32.sub
       i32.shl
       i32.or
       local.get $5
       i32.const 13
       i32.shr_u
       local.get $5
       i32.const 32
       i32.const 13
       i32.sub
       i32.shl
       i32.or
       i32.xor
       local.get $5
       i32.const 22
       i32.shr_u
       local.get $5
       i32.const 32
       i32.const 22
       i32.sub
       i32.shl
       i32.or
       i32.xor
       local.get $5
       local.get $6
       i32.and
       local.get $5
       local.get $7
       i32.and
       i32.xor
       local.get $6
       local.get $7
       i32.and
       i32.xor
       i32.add
       i32.const 0
       i32.or
       local.set $17
       local.get $11
       local.set $12
       local.get $10
       local.set $11
       local.get $9
       local.set $10
       local.get $8
       local.get $16
       i32.add
       i32.const 0
       i32.or
       local.set $9
       local.get $7
       local.set $8
       local.get $6
       local.set $7
       local.get $5
       local.set $6
       local.get $16
       local.get $17
       i32.add
       i32.const 0
       i32.or
       local.set $5
       local.get $14
       i32.const 1
       i32.add
       local.set $14
       br $repeat|3
       unreachable
      end
      unreachable
     end
     block $assembly/index/load32_be|inlined.14 (result i32)
      local.get $1
      call $~lib/rt/stub/__retain
      local.set $23
      i32.const 0
      local.set $21
      local.get $23
      local.get $21
      i32.const 2
      i32.shl
      i32.add
      i32.load
      call $~lib/polyfills/bswap<u32>
      local.set $18
      local.get $23
      call $~lib/rt/stub/__release
      local.get $18
     end
     drop
     block $assembly/index/store32_be|inlined.2
      local.get $1
      call $~lib/rt/stub/__retain
      local.set $18
      i32.const 0
      local.set $20
      block $assembly/index/load32_be|inlined.15 (result i32)
       local.get $1
       call $~lib/rt/stub/__retain
       local.set $22
       i32.const 0
       local.set $24
       local.get $22
       local.get $24
       i32.const 2
       i32.shl
       i32.add
       i32.load
       call $~lib/polyfills/bswap<u32>
       local.set $23
       local.get $22
       call $~lib/rt/stub/__release
       local.get $23
      end
      local.get $5
      i32.add
      local.set $19
      local.get $18
      local.get $20
      i32.const 2
      i32.shl
      i32.add
      local.get $19
      call $~lib/polyfills/bswap<u32>
      i32.store
      local.get $18
      call $~lib/rt/stub/__release
     end
     block $assembly/index/store32_be|inlined.3
      local.get $1
      call $~lib/rt/stub/__retain
      local.set $19
      i32.const 1
      local.set $22
      block $assembly/index/load32_be|inlined.16 (result i32)
       local.get $1
       call $~lib/rt/stub/__retain
       local.set $23
       i32.const 1
       local.set $21
       local.get $23
       local.get $21
       i32.const 2
       i32.shl
       i32.add
       i32.load
       call $~lib/polyfills/bswap<u32>
       local.set $18
       local.get $23
       call $~lib/rt/stub/__release
       local.get $18
      end
      local.get $6
      i32.add
      local.set $24
      local.get $19
      local.get $22
      i32.const 2
      i32.shl
      i32.add
      local.get $24
      call $~lib/polyfills/bswap<u32>
      i32.store
      local.get $19
      call $~lib/rt/stub/__release
     end
     block $assembly/index/store32_be|inlined.4
      local.get $1
      call $~lib/rt/stub/__retain
      local.set $24
      i32.const 2
      local.set $23
      block $assembly/index/load32_be|inlined.17 (result i32)
       local.get $1
       call $~lib/rt/stub/__retain
       local.set $18
       i32.const 2
       local.set $20
       local.get $18
       local.get $20
       i32.const 2
       i32.shl
       i32.add
       i32.load
       call $~lib/polyfills/bswap<u32>
       local.set $19
       local.get $18
       call $~lib/rt/stub/__release
       local.get $19
      end
      local.get $7
      i32.add
      local.set $21
      local.get $24
      local.get $23
      i32.const 2
      i32.shl
      i32.add
      local.get $21
      call $~lib/polyfills/bswap<u32>
      i32.store
      local.get $24
      call $~lib/rt/stub/__release
     end
     block $assembly/index/store32_be|inlined.5
      local.get $1
      call $~lib/rt/stub/__retain
      local.set $21
      i32.const 3
      local.set $18
      block $assembly/index/load32_be|inlined.18 (result i32)
       local.get $1
       call $~lib/rt/stub/__retain
       local.set $19
       i32.const 3
       local.set $22
       local.get $19
       local.get $22
       i32.const 2
       i32.shl
       i32.add
       i32.load
       call $~lib/polyfills/bswap<u32>
       local.set $24
       local.get $19
       call $~lib/rt/stub/__release
       local.get $24
      end
      local.get $8
      i32.add
      local.set $20
      local.get $21
      local.get $18
      i32.const 2
      i32.shl
      i32.add
      local.get $20
      call $~lib/polyfills/bswap<u32>
      i32.store
      local.get $21
      call $~lib/rt/stub/__release
     end
     block $assembly/index/store32_be|inlined.6
      local.get $1
      call $~lib/rt/stub/__retain
      local.set $20
      i32.const 4
      local.set $19
      block $assembly/index/load32_be|inlined.19 (result i32)
       local.get $1
       call $~lib/rt/stub/__retain
       local.set $24
       i32.const 4
       local.set $23
       local.get $24
       local.get $23
       i32.const 2
       i32.shl
       i32.add
       i32.load
       call $~lib/polyfills/bswap<u32>
       local.set $21
       local.get $24
       call $~lib/rt/stub/__release
       local.get $21
      end
      local.get $9
      i32.add
      local.set $22
      local.get $20
      local.get $19
      i32.const 2
      i32.shl
      i32.add
      local.get $22
      call $~lib/polyfills/bswap<u32>
      i32.store
      local.get $20
      call $~lib/rt/stub/__release
     end
     block $assembly/index/store32_be|inlined.7
      local.get $1
      call $~lib/rt/stub/__retain
      local.set $22
      i32.const 5
      local.set $24
      block $assembly/index/load32_be|inlined.20 (result i32)
       local.get $1
       call $~lib/rt/stub/__retain
       local.set $21
       i32.const 5
       local.set $18
       local.get $21
       local.get $18
       i32.const 2
       i32.shl
       i32.add
       i32.load
       call $~lib/polyfills/bswap<u32>
       local.set $20
       local.get $21
       call $~lib/rt/stub/__release
       local.get $20
      end
      local.get $10
      i32.add
      local.set $23
      local.get $22
      local.get $24
      i32.const 2
      i32.shl
      i32.add
      local.get $23
      call $~lib/polyfills/bswap<u32>
      i32.store
      local.get $22
      call $~lib/rt/stub/__release
     end
     block $assembly/index/store32_be|inlined.8
      local.get $1
      call $~lib/rt/stub/__retain
      local.set $23
      i32.const 6
      local.set $21
      block $assembly/index/load32_be|inlined.21 (result i32)
       local.get $1
       call $~lib/rt/stub/__retain
       local.set $20
       i32.const 6
       local.set $19
       local.get $20
       local.get $19
       i32.const 2
       i32.shl
       i32.add
       i32.load
       call $~lib/polyfills/bswap<u32>
       local.set $22
       local.get $20
       call $~lib/rt/stub/__release
       local.get $22
      end
      local.get $11
      i32.add
      local.set $18
      local.get $23
      local.get $21
      i32.const 2
      i32.shl
      i32.add
      local.get $18
      call $~lib/polyfills/bswap<u32>
      i32.store
      local.get $23
      call $~lib/rt/stub/__release
     end
     block $assembly/index/store32_be|inlined.9
      local.get $1
      call $~lib/rt/stub/__retain
      local.set $18
      i32.const 7
      local.set $20
      block $assembly/index/load32_be|inlined.22 (result i32)
       local.get $1
       call $~lib/rt/stub/__retain
       local.set $22
       i32.const 7
       local.set $24
       local.get $22
       local.get $24
       i32.const 2
       i32.shl
       i32.add
       i32.load
       call $~lib/polyfills/bswap<u32>
       local.set $23
       local.get $22
       call $~lib/rt/stub/__release
       local.get $23
      end
      local.get $12
      i32.add
      local.set $19
      local.get $18
      local.get $20
      i32.const 2
      i32.shl
      i32.add
      local.get $19
      call $~lib/polyfills/bswap<u32>
      i32.store
      local.get $18
      call $~lib/rt/stub/__release
     end
     local.get $3
     i32.const 64
     i32.add
     local.set $3
     local.get $4
     i32.const 64
     i32.sub
     local.set $4
     br $continue|0
    end
   end
  end
  local.get $3
  local.set $18
  local.get $0
  call $~lib/rt/stub/__release
  local.get $1
  call $~lib/rt/stub/__release
  local.get $2
  call $~lib/rt/stub/__release
  local.get $18
 )
 (func $assembly/index/update (; 15 ;) (type $FUNCSIG$vii) (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  local.get $0
  call $~lib/rt/stub/__retain
  drop
  global.get $assembly/index/finished
  if
   local.get $0
   call $~lib/rt/stub/__release
   block
    i32.const 616
    i32.const 728
    i32.const 149
    i32.const 4
    call $~lib/builtins/abort
    unreachable
    unreachable
   end
   unreachable
  end
  i32.const 0
  local.get $1
  call $~lib/arraybuffer/ArrayBuffer#constructor
  local.set $2
  block $break|0
   i32.const 0
   local.set $3
   loop $repeat|0
    local.get $3
    local.get $1
    i32.lt_u
    i32.eqz
    br_if $break|0
    block $assembly/index/store8_be|inlined.1
     local.get $2
     call $~lib/rt/stub/__retain
     local.set $6
     local.get $3
     local.set $5
     local.get $0
     local.get $3
     call $~lib/typedarray/Uint8Array#__get
     local.set $4
     local.get $6
     local.get $5
     i32.add
     local.get $4
     call $~lib/polyfills/bswap<u8>
     i32.store8
     local.get $6
     call $~lib/rt/stub/__release
    end
    local.get $3
    i32.const 1
    i32.add
    local.set $3
    br $repeat|0
    unreachable
   end
   unreachable
  end
  i32.const 0
  local.set $3
  global.get $assembly/index/bytesHashed
  local.get $1
  i32.add
  global.set $assembly/index/bytesHashed
  global.get $assembly/index/bufferLength
  i32.const 0
  i32.gt_u
  if
   block $break|1
    loop $continue|1
     global.get $assembly/index/bufferLength
     i32.const 64
     i32.lt_u
     if (result i32)
      local.get $1
      i32.const 0
      i32.gt_u
     else      
      i32.const 0
     end
     if
      block $assembly/index/store8_be|inlined.2
       global.get $assembly/index/buffer
       call $~lib/rt/stub/__retain
       local.set $8
       block (result i32)
        global.get $assembly/index/bufferLength
        local.tee $6
        i32.const 1
        i32.add
        global.set $assembly/index/bufferLength
        local.get $6
       end
       local.set $7
       block $assembly/index/load8_be|inlined.0 (result i32)
        local.get $2
        call $~lib/rt/stub/__retain
        local.set $5
        block (result i32)
         local.get $3
         local.tee $6
         i32.const 1
         i32.add
         local.set $3
         local.get $6
        end
        local.set $4
        local.get $5
        local.get $4
        i32.add
        i32.load8_u
        call $~lib/polyfills/bswap<u8>
        local.set $6
        local.get $5
        call $~lib/rt/stub/__release
        local.get $6
       end
       local.set $6
       local.get $8
       local.get $7
       i32.add
       local.get $6
       call $~lib/polyfills/bswap<u8>
       i32.store8
       local.get $8
       call $~lib/rt/stub/__release
      end
      local.get $1
      i32.const 1
      i32.sub
      local.set $1
      br $continue|1
     end
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
   local.get $2
   local.get $3
   local.get $1
   call $assembly/index/hashBlocks
   local.set $3
   local.get $1
   i32.const 64
   i32.rem_u
   local.set $1
  end
  block $break|2
   loop $continue|2
    local.get $1
    i32.const 0
    i32.gt_u
    if
     block $assembly/index/store8_be|inlined.3
      global.get $assembly/index/buffer
      call $~lib/rt/stub/__retain
      local.set $9
      block (result i32)
       global.get $assembly/index/bufferLength
       local.tee $8
       i32.const 1
       i32.add
       global.set $assembly/index/bufferLength
       local.get $8
      end
      local.set $7
      block $assembly/index/load8_be|inlined.5 (result i32)
       local.get $2
       call $~lib/rt/stub/__retain
       local.set $5
       block (result i32)
        local.get $3
        local.tee $8
        i32.const 1
        i32.add
        local.set $3
        local.get $8
       end
       local.set $4
       local.get $5
       local.get $4
       i32.add
       i32.load8_u
       call $~lib/polyfills/bswap<u8>
       local.set $8
       local.get $5
       call $~lib/rt/stub/__release
       local.get $8
      end
      local.set $6
      local.get $9
      local.get $7
      i32.add
      local.get $6
      call $~lib/polyfills/bswap<u8>
      i32.store8
      local.get $9
      call $~lib/rt/stub/__release
     end
     local.get $1
     i32.const 1
     i32.sub
     local.set $1
     br $continue|2
    end
   end
  end
  local.get $2
  call $~lib/rt/stub/__release
  local.get $0
  call $~lib/rt/stub/__release
 )
 (func $assembly/index/finish (; 16 ;) (type $FUNCSIG$vi) (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  local.get $0
  call $~lib/rt/stub/__retain
  drop
  global.get $assembly/index/finished
  i32.eqz
  if
   global.get $assembly/index/bytesHashed
   local.set $1
   global.get $assembly/index/bufferLength
   local.set $2
   local.get $1
   i32.const 536870912
   i32.div_u
   i32.const 0
   i32.or
   local.set $3
   local.get $1
   i32.const 3
   i32.shl
   local.set $4
   local.get $1
   i32.const 64
   i32.rem_u
   i32.const 56
   i32.lt_u
   if (result i32)
    i32.const 64
   else    
    i32.const 128
   end
   local.set $5
   block $assembly/index/store8_be|inlined.4
    global.get $assembly/index/buffer
    call $~lib/rt/stub/__retain
    local.set $8
    local.get $2
    local.set $7
    i32.const 128
    local.set $6
    local.get $8
    local.get $7
    i32.add
    local.get $6
    call $~lib/polyfills/bswap<u8>
    i32.store8
    local.get $8
    call $~lib/rt/stub/__release
   end
   block $break|0
    local.get $2
    i32.const 1
    i32.add
    local.set $8
    loop $repeat|0
     local.get $8
     local.get $5
     i32.const 8
     i32.sub
     i32.lt_s
     i32.eqz
     br_if $break|0
     block $assembly/index/store8_be|inlined.5
      global.get $assembly/index/buffer
      call $~lib/rt/stub/__retain
      local.set $9
      local.get $8
      local.set $7
      i32.const 0
      local.set $6
      local.get $9
      local.get $7
      i32.add
      local.get $6
      call $~lib/polyfills/bswap<u8>
      i32.store8
      local.get $9
      call $~lib/rt/stub/__release
     end
     local.get $8
     i32.const 1
     i32.add
     local.set $8
     br $repeat|0
     unreachable
    end
    unreachable
   end
   block $assembly/index/store32_be|inlined.10
    global.get $assembly/index/buffer
    call $~lib/rt/stub/__retain
    local.set $9
    local.get $5
    i32.const 8
    i32.sub
    i32.const 2
    i32.shr_s
    local.set $7
    local.get $3
    local.set $6
    local.get $9
    local.get $7
    i32.const 2
    i32.shl
    i32.add
    local.get $6
    call $~lib/polyfills/bswap<u32>
    i32.store
    local.get $9
    call $~lib/rt/stub/__release
   end
   block $assembly/index/store32_be|inlined.11
    global.get $assembly/index/buffer
    call $~lib/rt/stub/__retain
    local.set $7
    local.get $5
    i32.const 4
    i32.sub
    i32.const 2
    i32.shr_s
    local.set $6
    local.get $4
    local.set $8
    local.get $7
    local.get $6
    i32.const 2
    i32.shl
    i32.add
    local.get $8
    call $~lib/polyfills/bswap<u32>
    i32.store
    local.get $7
    call $~lib/rt/stub/__release
   end
   global.get $assembly/index/temp
   global.get $assembly/index/state
   global.get $assembly/index/buffer
   i32.const 0
   local.get $5
   call $assembly/index/hashBlocks
   drop
   i32.const 1
   global.set $assembly/index/finished
  end
  block $break|1
   i32.const 0
   local.set $5
   loop $repeat|1
    local.get $5
    i32.const 8
    i32.lt_s
    i32.eqz
    br_if $break|1
    block $assembly/index/load32_be|inlined.23 (result i32)
     global.get $assembly/index/state
     call $~lib/rt/stub/__retain
     local.set $8
     local.get $5
     local.set $9
     local.get $8
     local.get $9
     i32.const 2
     i32.shl
     i32.add
     i32.load
     call $~lib/polyfills/bswap<u32>
     local.set $4
     local.get $8
     call $~lib/rt/stub/__release
     local.get $4
    end
    local.set $8
    block $assembly/index/store32_be|inlined.12
     local.get $0
     call $~lib/rt/stub/__retain
     local.set $1
     local.get $5
     local.set $7
     local.get $8
     local.set $6
     local.get $1
     local.get $7
     i32.const 2
     i32.shl
     i32.add
     local.get $6
     call $~lib/polyfills/bswap<u32>
     i32.store
     local.get $1
     call $~lib/rt/stub/__release
    end
    local.get $5
    i32.const 1
    i32.add
    local.set $5
    br $repeat|1
    unreachable
   end
   unreachable
  end
  local.get $0
  call $~lib/rt/stub/__release
 )
 (func $assembly/index/reset (; 17 ;) (type $FUNCSIG$v)
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  block $break|0
   i32.const 0
   local.set $0
   loop $repeat|0
    local.get $0
    i32.const 32
    i32.lt_s
    i32.eqz
    br_if $break|0
    block $assembly/index/store8_be|inlined.6
     global.get $assembly/index/state
     call $~lib/rt/stub/__retain
     local.set $3
     local.get $0
     local.set $2
     global.get $assembly/index/iv
     local.get $0
     call $~lib/array/Array<u8>#__get
     local.set $1
     local.get $3
     local.get $2
     i32.add
     local.get $1
     call $~lib/polyfills/bswap<u8>
     i32.store8
     local.get $3
     call $~lib/rt/stub/__release
    end
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $repeat|0
    unreachable
   end
   unreachable
  end
  i32.const 0
  global.set $assembly/index/bufferLength
  i32.const 0
  global.set $assembly/index/bytesHashed
  i32.const 0
  global.set $assembly/index/finished
 )
 (func $~lib/arraybuffer/ArrayBufferView#get:byteLength (; 18 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  local.get $0
  i32.load offset=8
 )
 (func $~lib/typedarray/Uint8Array#get:length (; 19 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  local.get $0
  call $~lib/arraybuffer/ArrayBufferView#get:byteLength
 )
 (func $~lib/arraybuffer/ArrayBufferView#constructor (; 20 ;) (type $FUNCSIG$iiii) (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  local.get $1
  i32.const 1073741808
  local.get $2
  i32.shr_u
  i32.gt_u
  if
   i32.const 408
   i32.const 456
   i32.const 14
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
  block (result i32)
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
  end
  local.tee $4
  block (result i32)
   local.get $3
   local.tee $5
   local.get $4
   i32.load
   local.tee $4
   i32.ne
   if
    local.get $5
    call $~lib/rt/stub/__retain
    drop
    local.get $4
    call $~lib/rt/stub/__release
   end
   local.get $5
  end
  i32.store
  local.get $0
  local.get $3
  i32.store offset=4
  local.get $0
  local.get $1
  i32.store offset=8
  local.get $0
 )
 (func $~lib/typedarray/Uint8Array#constructor (; 21 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
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
 (func $~lib/typedarray/Uint8Array#__set (; 22 ;) (type $FUNCSIG$viii) (param $0 i32) (param $1 i32) (param $2 i32)
  local.get $1
  local.get $0
  i32.load offset=8
  i32.ge_u
  if
   i32.const 512
   i32.const 784
   i32.const 115
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
 (func $assembly/index/hashMe (; 23 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  local.get $0
  call $~lib/rt/stub/__retain
  drop
  call $assembly/index/reset
  local.get $0
  local.get $0
  call $~lib/typedarray/Uint8Array#get:length
  call $assembly/index/update
  global.get $assembly/index/out
  call $assembly/index/finish
  i32.const 0
  global.get $assembly/index/digestLength
  call $~lib/typedarray/Uint8Array#constructor
  local.set $1
  block $break|0
   i32.const 0
   local.set $2
   loop $repeat|0
    local.get $2
    i32.const 32
    i32.lt_u
    i32.eqz
    br_if $break|0
    local.get $1
    local.get $2
    block $assembly/index/load8_be|inlined.6 (result i32)
     global.get $assembly/index/out
     call $~lib/rt/stub/__retain
     local.set $4
     local.get $2
     local.set $3
     local.get $4
     local.get $3
     i32.add
     i32.load8_u
     call $~lib/polyfills/bswap<u8>
     local.set $5
     local.get $4
     call $~lib/rt/stub/__release
     local.get $5
    end
    i32.const 255
    i32.and
    call $~lib/typedarray/Uint8Array#__set
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $repeat|0
    unreachable
   end
   unreachable
  end
  local.get $1
  local.set $2
  local.get $0
  call $~lib/rt/stub/__release
  local.get $2
 )
 (func $start (; 24 ;) (type $FUNCSIG$v)
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
  call $start:assembly/index
 )
 (func $null (; 25 ;) (type $FUNCSIG$v)
 )
)
