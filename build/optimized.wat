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
 (data (i32.const 21) "\01\00\00\98/\8aB\91D7q\cf\fb\c0\b5\a5\db\b5\e9[\c2V9\f1\11\f1Y\a4\82?\92\d5^\1c\ab\98\aa\07\d8\01[\83\12\be\851$\c3}\0cUt]\ber\fe\b1\de\80\a7\06\dc\9bt\f1\9b\c1\c1i\9b\e4\86G\be\ef\c6\9d\c1\0f\cc\a1\0c$o,\e9-\aa\84tJ\dc\a9\b0\\\da\88\f9vRQ>\98m\c61\a8\c8\'\03\b0\c7\7fY\bf\f3\0b\e0\c6G\91\a7\d5Qc\ca\06g))\14\85\n\b7\'8!\1b.\fcm,M\13\0d8STs\ne\bb\njv.\c9\c2\81\85,r\92\a1\e8\bf\a2Kf\1a\a8p\8bK\c2\a3Ql\c7\19\e8\92\d1$\06\99\d6\855\0e\f4p\a0j\10\16\c1\a4\19\08l7\1eLwH\'\b5\bc\b04\b3\0c\1c9J\aa\d8NO\ca\9c[\f3o.h\ee\82\8ftoc\a5x\14x\c8\84\08\02\c7\8c\fa\ff\be\90\eblP\a4\f7\a3\f9\be\f2xq\c6")
 (data (i32.const 280) "\10\00\00\00\01\00\00\00\04\00\00\00\10\00\00\00\18\00\00\00\18\00\00\00\00\01\00\00@")
 (data (i32.const 312) "\1c\00\00\00\01\00\00\00\01\00\00\00\1c\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00l\00e\00n\00g\00t\00h")
 (data (i32.const 360) "&\00\00\00\01\00\00\00\01\00\00\00&\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00b\00u\00f\00f\00e\00r\00.\00t\00s")
 (data (i32.const 416) "^\00\00\00\01\00\00\00\01\00\00\00^\00\00\00S\00H\00A\002\005\006\00:\00 \00c\00a\00n\00\'\00t\00 \00u\00p\00d\00a\00t\00e\00 \00b\00e\00c\00a\00u\00s\00e\00 \00h\00a\00s\00h\00 \00w\00a\00s\00 \00f\00i\00n\00i\00s\00h\00e\00d\00.")
 (data (i32.const 528) "\"\00\00\00\01\00\00\00\01\00\00\00\"\00\00\00a\00s\00s\00e\00m\00b\00l\00y\00/\00i\00n\00d\00e\00x\00.\00t\00s")
 (data (i32.const 584) "\05\00\00\00\10\00\00\00\00\00\00\00\10\00\00\00\00\00\00\00\10\00\00\00\00\00\00\001\00\00\00\02\00\00\00\93\00\00\00\02")
 (global $~lib/rt/stub/startOffset (mut i32) (i32.const 0))
 (global $~lib/rt/stub/offset (mut i32) (i32.const 0))
 (global $assembly/index/UINT8ARRAY_ID i32 (i32.const 3))
 (global $assembly/index/state (mut i32) (i32.const 0))
 (global $assembly/index/temp (mut i32) (i32.const 0))
 (global $assembly/index/buffer (mut i32) (i32.const 0))
 (global $assembly/index/bufferLength (mut i32) (i32.const 0))
 (global $assembly/index/bytesHashed (mut i32) (i32.const 0))
 (global $assembly/index/finished (mut i32) (i32.const 0))
 (global $assembly/index/out (mut i32) (i32.const 0))
 (global $~lib/rt/__rtti_base i32 (i32.const 584))
 (export "memory" (memory $0))
 (export "__alloc" (func $~lib/rt/stub/__alloc))
 (export "__retain" (func $~lib/rt/stub/__retain))
 (export "__release" (func $~lib/rt/stub/__release))
 (export "__collect" (func $~lib/rt/stub/__collect))
 (export "__rtti_base" (global $~lib/rt/__rtti_base))
 (export "UINT8ARRAY_ID" (global $assembly/index/UINT8ARRAY_ID))
 (export "clean" (func $assembly/index/clean))
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
   i32.const 328
   i32.const 376
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
 (func $assembly/index/reset (; 7 ;) (type $FUNCSIG$v)
  global.get $assembly/index/state
  i32.const 1779033703
  i32.store
  global.get $assembly/index/state
  i32.const 4
  i32.add
  i32.const -1150833019
  i32.store
  global.get $assembly/index/state
  i32.const 8
  i32.add
  i32.const 1013904242
  i32.store
  global.get $assembly/index/state
  i32.const 12
  i32.add
  i32.const -1521486534
  i32.store
  global.get $assembly/index/state
  i32.const 16
  i32.add
  i32.const 1359893119
  i32.store
  global.get $assembly/index/state
  i32.const 20
  i32.add
  i32.const -1694144372
  i32.store
  global.get $assembly/index/state
  i32.const 24
  i32.add
  i32.const 528734635
  i32.store
  global.get $assembly/index/state
  i32.const 28
  i32.add
  i32.const 1541459225
  i32.store
  i32.const 0
  global.set $assembly/index/bufferLength
  i32.const 0
  global.set $assembly/index/bytesHashed
  i32.const 0
  global.set $assembly/index/finished
 )
 (func $assembly/index/clean (; 8 ;) (type $FUNCSIG$v)
  (local $0 i32)
  (local $1 i32)
  global.get $assembly/index/buffer
  local.tee $0
  i32.const 16
  i32.sub
  i32.load offset=12
  local.set $1
  local.get $0
  local.get $1
  call $~lib/memory/memory.fill
  global.get $assembly/index/temp
  local.tee $0
  i32.const 16
  i32.sub
  i32.load offset=12
  local.set $1
  local.get $0
  local.get $1
  call $~lib/memory/memory.fill
  call $assembly/index/reset
 )
 (func $assembly/index/hashBlocks (; 9 ;) (type $FUNCSIG$iiiiii) (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (result i32)
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
  i32.const 296
  i32.load
  local.set $16
  loop $continue|0
   local.get $4
   i32.const 64
   i32.ge_u
   if
    local.get $1
    i32.load
    local.set $8
    local.get $1
    i32.const 4
    i32.add
    i32.load
    local.set $6
    local.get $1
    i32.const 8
    i32.add
    i32.load
    local.set $10
    local.get $1
    i32.const 12
    i32.add
    i32.load
    local.set $13
    local.get $1
    i32.const 16
    i32.add
    i32.load
    local.set $9
    local.get $1
    i32.const 20
    i32.add
    i32.load
    local.set $11
    local.get $1
    i32.const 24
    i32.add
    i32.load
    local.set $12
    local.get $1
    i32.const 28
    i32.add
    i32.load
    local.set $14
    i32.const 0
    local.set $5
    loop $loop|1
     local.get $5
     i32.const 16
     i32.lt_u
     if
      local.get $5
      i32.const 2
      i32.shl
      local.tee $15
      local.get $3
      i32.add
      local.set $7
      local.get $0
      local.get $15
      i32.add
      local.get $7
      i32.const 3
      i32.add
      local.get $2
      i32.add
      i32.load8_u
      local.get $2
      local.get $7
      i32.add
      i32.load8_u
      i32.const 24
      i32.shl
      local.get $7
      i32.const 1
      i32.add
      local.get $2
      i32.add
      i32.load8_u
      i32.const 16
      i32.shl
      i32.or
      local.get $7
      i32.const 2
      i32.add
      local.get $2
      i32.add
      i32.load8_u
      i32.const 8
      i32.shl
      i32.or
      i32.or
      i32.store
      local.get $5
      i32.const 1
      i32.add
      local.set $5
      br $loop|1
     end
    end
    i32.const 16
    local.set $5
    loop $loop|2
     local.get $5
     i32.const 64
     i32.lt_u
     if
      local.get $5
      i32.const 2
      i32.shl
      local.get $0
      i32.add
      local.get $5
      i32.const 16
      i32.sub
      i32.const 2
      i32.shl
      local.get $0
      i32.add
      i32.load
      local.get $5
      i32.const 15
      i32.sub
      i32.const 2
      i32.shl
      local.get $0
      i32.add
      i32.load
      local.tee $7
      i32.const 7
      i32.rotr
      local.get $7
      i32.const 18
      i32.rotr
      i32.xor
      local.get $7
      i32.const 3
      i32.shr_u
      i32.xor
      local.get $5
      i32.const 7
      i32.sub
      i32.const 2
      i32.shl
      local.get $0
      i32.add
      i32.load
      local.get $5
      i32.const 2
      i32.sub
      i32.const 2
      i32.shl
      local.get $0
      i32.add
      i32.load
      local.tee $7
      i32.const 17
      i32.rotr
      local.get $7
      i32.const 19
      i32.rotr
      i32.xor
      local.get $7
      i32.const 10
      i32.shr_u
      i32.xor
      i32.add
      i32.add
      i32.add
      i32.store
      local.get $5
      i32.const 1
      i32.add
      local.set $5
      br $loop|2
     end
    end
    i32.const 0
    local.set $5
    loop $loop|3
     local.get $5
     i32.const 64
     i32.lt_u
     if
      local.get $5
      i32.const 2
      i32.shl
      local.tee $7
      local.get $0
      i32.add
      i32.load
      local.get $7
      local.get $16
      i32.add
      i32.load
      local.get $9
      i32.const 6
      i32.rotr
      local.get $9
      i32.const 11
      i32.rotr
      i32.xor
      local.get $9
      i32.const 25
      i32.rotr
      i32.xor
      local.get $9
      local.get $11
      i32.and
      local.get $9
      i32.const -1
      i32.xor
      local.get $12
      i32.and
      i32.xor
      i32.add
      local.get $14
      i32.add
      i32.add
      i32.add
      local.set $7
      local.get $8
      i32.const 2
      i32.rotr
      local.get $8
      i32.const 13
      i32.rotr
      i32.xor
      local.get $8
      i32.const 22
      i32.rotr
      i32.xor
      local.get $6
      local.get $10
      i32.and
      local.get $6
      local.get $8
      i32.and
      local.get $8
      local.get $10
      i32.and
      i32.xor
      i32.xor
      i32.add
      local.set $15
      local.get $12
      local.set $14
      local.get $11
      local.set $12
      local.get $9
      local.set $11
      local.get $7
      local.get $13
      i32.add
      local.set $9
      local.get $10
      local.set $13
      local.get $6
      local.set $10
      local.get $8
      local.set $6
      local.get $7
      local.get $15
      i32.add
      local.set $8
      local.get $5
      i32.const 1
      i32.add
      local.set $5
      br $loop|3
     end
    end
    local.get $1
    local.get $1
    i32.load
    local.get $8
    i32.add
    i32.store
    local.get $1
    i32.const 4
    i32.add
    local.tee $8
    local.get $8
    i32.load
    local.get $6
    i32.add
    i32.store
    local.get $1
    i32.const 8
    i32.add
    local.tee $6
    local.get $6
    i32.load
    local.get $10
    i32.add
    i32.store
    local.get $1
    i32.const 12
    i32.add
    local.tee $6
    local.get $6
    i32.load
    local.get $13
    i32.add
    i32.store
    local.get $1
    i32.const 16
    i32.add
    local.tee $6
    local.get $6
    i32.load
    local.get $9
    i32.add
    i32.store
    local.get $1
    i32.const 20
    i32.add
    local.tee $6
    local.get $6
    i32.load
    local.get $11
    i32.add
    i32.store
    local.get $1
    i32.const 24
    i32.add
    local.tee $6
    local.get $6
    i32.load
    local.get $12
    i32.add
    i32.store
    local.get $1
    i32.const 28
    i32.add
    local.tee $6
    local.get $6
    i32.load
    local.get $14
    i32.add
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
 (func $~lib/util/memory/memcpy (; 10 ;) (type $FUNCSIG$viii) (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  loop $continue|0
   local.get $1
   i32.const 3
   i32.and
   i32.const 0
   local.get $2
   select
   if
    local.get $0
    local.tee $3
    i32.const 1
    i32.add
    local.set $0
    local.get $1
    local.tee $4
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    local.get $4
    i32.load8_u
    i32.store8
    local.get $2
    i32.const 1
    i32.sub
    local.set $2
    br $continue|0
   end
  end
  local.get $0
  i32.const 3
  i32.and
  i32.eqz
  if
   loop $continue|1
    local.get $2
    i32.const 16
    i32.lt_u
    i32.eqz
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
     br $continue|1
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
    local.get $1
    i32.const 8
    i32.add
    local.set $1
    local.get $0
    i32.const 8
    i32.add
    local.set $0
   end
   local.get $2
   i32.const 4
   i32.and
   if
    local.get $0
    local.get $1
    i32.load
    i32.store
    local.get $1
    i32.const 4
    i32.add
    local.set $1
    local.get $0
    i32.const 4
    i32.add
    local.set $0
   end
   local.get $2
   i32.const 2
   i32.and
   if
    local.get $0
    local.get $1
    i32.load16_u
    i32.store16
    local.get $1
    i32.const 2
    i32.add
    local.set $1
    local.get $0
    i32.const 2
    i32.add
    local.set $0
   end
   local.get $2
   i32.const 1
   i32.and
   if
    local.get $0
    local.get $1
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
      local.get $0
      i32.const 3
      i32.and
      local.tee $3
      i32.const 1
      i32.ne
      if
       local.get $3
       i32.const 2
       i32.eq
       br_if $case1|2
       local.get $3
       i32.const 3
       i32.eq
       br_if $case2|2
       br $break|2
      end
      local.get $1
      i32.load
      local.set $5
      local.get $0
      local.get $1
      i32.load8_u
      i32.store8
      local.get $0
      i32.const 1
      i32.add
      local.tee $0
      local.get $1
      i32.const 1
      i32.add
      local.tee $1
      i32.load8_u
      i32.store8
      local.get $0
      i32.const 1
      i32.add
      local.tee $3
      i32.const 1
      i32.add
      local.set $0
      local.get $1
      i32.const 1
      i32.add
      local.tee $4
      i32.const 1
      i32.add
      local.set $1
      local.get $3
      local.get $4
      i32.load8_u
      i32.store8
      local.get $2
      i32.const 3
      i32.sub
      local.set $2
      loop $continue|3
       local.get $2
       i32.const 17
       i32.lt_u
       i32.eqz
       if
        local.get $0
        local.get $1
        i32.const 1
        i32.add
        i32.load
        local.tee $3
        i32.const 8
        i32.shl
        local.get $5
        i32.const 24
        i32.shr_u
        i32.or
        i32.store
        local.get $0
        i32.const 4
        i32.add
        local.get $3
        i32.const 24
        i32.shr_u
        local.get $1
        i32.const 5
        i32.add
        i32.load
        local.tee $3
        i32.const 8
        i32.shl
        i32.or
        i32.store
        local.get $0
        i32.const 8
        i32.add
        local.get $3
        i32.const 24
        i32.shr_u
        local.get $1
        i32.const 9
        i32.add
        i32.load
        local.tee $3
        i32.const 8
        i32.shl
        i32.or
        i32.store
        local.get $0
        i32.const 12
        i32.add
        local.get $1
        i32.const 13
        i32.add
        i32.load
        local.tee $5
        i32.const 8
        i32.shl
        local.get $3
        i32.const 24
        i32.shr_u
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
        br $continue|3
       end
      end
      br $break|2
     end
     local.get $1
     i32.load
     local.set $5
     local.get $0
     local.get $1
     i32.load8_u
     i32.store8
     local.get $0
     i32.const 1
     i32.add
     local.tee $3
     i32.const 1
     i32.add
     local.set $0
     local.get $1
     i32.const 1
     i32.add
     local.tee $4
     i32.const 1
     i32.add
     local.set $1
     local.get $3
     local.get $4
     i32.load8_u
     i32.store8
     local.get $2
     i32.const 2
     i32.sub
     local.set $2
     loop $continue|4
      local.get $2
      i32.const 18
      i32.lt_u
      i32.eqz
      if
       local.get $0
       local.get $1
       i32.const 2
       i32.add
       i32.load
       local.tee $3
       i32.const 16
       i32.shl
       local.get $5
       i32.const 16
       i32.shr_u
       i32.or
       i32.store
       local.get $0
       i32.const 4
       i32.add
       local.get $3
       i32.const 16
       i32.shr_u
       local.get $1
       i32.const 6
       i32.add
       i32.load
       local.tee $3
       i32.const 16
       i32.shl
       i32.or
       i32.store
       local.get $0
       i32.const 8
       i32.add
       local.get $3
       i32.const 16
       i32.shr_u
       local.get $1
       i32.const 10
       i32.add
       i32.load
       local.tee $3
       i32.const 16
       i32.shl
       i32.or
       i32.store
       local.get $0
       i32.const 12
       i32.add
       local.get $1
       i32.const 14
       i32.add
       i32.load
       local.tee $5
       i32.const 16
       i32.shl
       local.get $3
       i32.const 16
       i32.shr_u
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
       br $continue|4
      end
     end
     br $break|2
    end
    local.get $1
    i32.load
    local.set $5
    local.get $0
    local.tee $3
    i32.const 1
    i32.add
    local.set $0
    local.get $1
    local.tee $4
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    local.get $4
    i32.load8_u
    i32.store8
    local.get $2
    i32.const 1
    i32.sub
    local.set $2
    loop $continue|5
     local.get $2
     i32.const 19
     i32.lt_u
     i32.eqz
     if
      local.get $0
      local.get $1
      i32.const 3
      i32.add
      i32.load
      local.tee $3
      i32.const 24
      i32.shl
      local.get $5
      i32.const 8
      i32.shr_u
      i32.or
      i32.store
      local.get $0
      i32.const 4
      i32.add
      local.get $3
      i32.const 8
      i32.shr_u
      local.get $1
      i32.const 7
      i32.add
      i32.load
      local.tee $3
      i32.const 24
      i32.shl
      i32.or
      i32.store
      local.get $0
      i32.const 8
      i32.add
      local.get $3
      i32.const 8
      i32.shr_u
      local.get $1
      i32.const 11
      i32.add
      i32.load
      local.tee $3
      i32.const 24
      i32.shl
      i32.or
      i32.store
      local.get $0
      i32.const 12
      i32.add
      local.get $1
      i32.const 15
      i32.add
      i32.load
      local.tee $5
      i32.const 24
      i32.shl
      local.get $3
      i32.const 8
      i32.shr_u
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
      br $continue|5
     end
    end
   end
  end
  local.get $2
  i32.const 16
  i32.and
  if
   local.get $0
   local.get $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $3
   i32.const 1
   i32.add
   local.set $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $4
   i32.const 1
   i32.add
   local.set $1
   local.get $3
   local.get $4
   i32.load8_u
   i32.store8
  end
  local.get $2
  i32.const 8
  i32.and
  if
   local.get $0
   local.get $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $3
   i32.const 1
   i32.add
   local.set $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $4
   i32.const 1
   i32.add
   local.set $1
   local.get $3
   local.get $4
   i32.load8_u
   i32.store8
  end
  local.get $2
  i32.const 4
  i32.and
  if
   local.get $0
   local.get $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $3
   i32.const 1
   i32.add
   local.set $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $4
   i32.const 1
   i32.add
   local.set $1
   local.get $3
   local.get $4
   i32.load8_u
   i32.store8
  end
  local.get $2
  i32.const 2
  i32.and
  if
   local.get $0
   local.get $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $3
   i32.const 1
   i32.add
   local.set $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $4
   i32.const 1
   i32.add
   local.set $1
   local.get $3
   local.get $4
   i32.load8_u
   i32.store8
  end
  local.get $2
  i32.const 1
  i32.and
  if
   local.get $0
   local.get $1
   i32.load8_u
   i32.store8
  end
 )
 (func $~lib/memory/memory.copy (; 11 ;) (type $FUNCSIG$viii) (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  block $~lib/util/memory/memmove|inlined.0
   local.get $2
   local.set $3
   local.get $0
   local.get $1
   i32.eq
   br_if $~lib/util/memory/memmove|inlined.0
   i32.const 1
   local.get $0
   local.get $3
   i32.add
   local.get $1
   i32.le_u
   local.get $1
   local.get $3
   i32.add
   local.get $0
   i32.le_u
   select
   if
    local.get $0
    local.get $1
    local.get $3
    call $~lib/util/memory/memcpy
    br $~lib/util/memory/memmove|inlined.0
   end
   local.get $0
   local.get $1
   i32.lt_u
   if
    local.get $1
    i32.const 7
    i32.and
    local.get $0
    i32.const 7
    i32.and
    i32.eq
    if
     loop $continue|0
      local.get $0
      i32.const 7
      i32.and
      if
       local.get $3
       i32.eqz
       br_if $~lib/util/memory/memmove|inlined.0
       local.get $3
       i32.const 1
       i32.sub
       local.set $3
       local.get $0
       local.tee $2
       i32.const 1
       i32.add
       local.set $0
       local.get $1
       local.tee $4
       i32.const 1
       i32.add
       local.set $1
       local.get $2
       local.get $4
       i32.load8_u
       i32.store8
       br $continue|0
      end
     end
     loop $continue|1
      local.get $3
      i32.const 8
      i32.lt_u
      i32.eqz
      if
       local.get $0
       local.get $1
       i64.load
       i64.store
       local.get $3
       i32.const 8
       i32.sub
       local.set $3
       local.get $0
       i32.const 8
       i32.add
       local.set $0
       local.get $1
       i32.const 8
       i32.add
       local.set $1
       br $continue|1
      end
     end
    end
    loop $continue|2
     local.get $3
     if
      local.get $0
      local.tee $2
      i32.const 1
      i32.add
      local.set $0
      local.get $1
      local.tee $4
      i32.const 1
      i32.add
      local.set $1
      local.get $2
      local.get $4
      i32.load8_u
      i32.store8
      local.get $3
      i32.const 1
      i32.sub
      local.set $3
      br $continue|2
     end
    end
   else    
    local.get $1
    i32.const 7
    i32.and
    local.get $0
    i32.const 7
    i32.and
    i32.eq
    if
     loop $continue|3
      local.get $0
      local.get $3
      i32.add
      i32.const 7
      i32.and
      if
       local.get $3
       i32.eqz
       br_if $~lib/util/memory/memmove|inlined.0
       local.get $0
       local.get $3
       i32.const 1
       i32.sub
       local.tee $3
       i32.add
       local.get $1
       local.get $3
       i32.add
       i32.load8_u
       i32.store8
       br $continue|3
      end
     end
     loop $continue|4
      local.get $3
      i32.const 8
      i32.lt_u
      i32.eqz
      if
       local.get $0
       local.get $3
       i32.const 8
       i32.sub
       local.tee $3
       i32.add
       local.get $1
       local.get $3
       i32.add
       i64.load
       i64.store
       br $continue|4
      end
     end
    end
    loop $continue|5
     local.get $3
     if
      local.get $0
      local.get $3
      i32.const 1
      i32.sub
      local.tee $3
      i32.add
      local.get $1
      local.get $3
      i32.add
      i32.load8_u
      i32.store8
      br $continue|5
     end
    end
   end
  end
 )
 (func $assembly/index/update (; 12 ;) (type $FUNCSIG$vii) (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  global.get $assembly/index/finished
  if
   i32.const 432
   i32.const 544
   i32.const 138
   i32.const 4
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.load
  local.set $3
  global.get $assembly/index/bytesHashed
  local.get $1
  i32.add
  global.set $assembly/index/bytesHashed
  global.get $assembly/index/bufferLength
  i32.const 0
  i32.gt_s
  if
   loop $continue|0
    local.get $1
    i32.const 0
    i32.gt_s
    i32.const 0
    global.get $assembly/index/bufferLength
    i32.const 64
    i32.lt_s
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
     global.get $assembly/index/buffer
     local.get $4
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
     br $continue|0
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
  i32.ge_s
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
  global.get $assembly/index/buffer
  local.get $2
  local.get $3
  i32.add
  local.get $1
  call $~lib/memory/memory.copy
  global.get $assembly/index/bufferLength
  local.get $1
  i32.add
  global.set $assembly/index/bufferLength
 )
 (func $assembly/index/finish (; 13 ;) (type $FUNCSIG$vi) (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  global.get $assembly/index/finished
  i32.eqz
  if
   global.get $assembly/index/bytesHashed
   local.tee $2
   i32.const 536870912
   i32.div_s
   local.set $3
   local.get $2
   i32.const 3
   i32.shl
   local.set $4
   global.get $assembly/index/bufferLength
   local.tee $1
   global.get $assembly/index/buffer
   i32.add
   i32.const 128
   i32.store8
   local.get $1
   i32.const 1
   i32.add
   local.set $1
   i32.const 64
   local.get $2
   i32.const 63
   i32.and
   i32.const 56
   i32.ge_s
   i32.shl
   local.tee $2
   i32.const 8
   i32.sub
   local.set $5
   loop $loop|0
    local.get $1
    local.get $5
    i32.lt_s
    if
     global.get $assembly/index/buffer
     local.get $1
     i32.add
     i32.const 0
     i32.store8
     local.get $1
     i32.const 1
     i32.add
     local.set $1
     br $loop|0
    end
   end
   global.get $assembly/index/buffer
   local.get $2
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
   local.get $2
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
   local.get $2
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
    i32.store
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $loop|1
   end
  end
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
 (func $assembly/index/hashMe (; 15 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
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
  local.tee $0
  i32.load offset=4
  global.get $assembly/index/out
  i32.const 32
  call $~lib/memory/memory.copy
  local.get $0
 )
 (func $start (; 16 ;) (type $FUNCSIG$v)
  i32.const 640
  global.set $~lib/rt/stub/startOffset
  global.get $~lib/rt/stub/startOffset
  global.set $~lib/rt/stub/offset
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
 )
)
