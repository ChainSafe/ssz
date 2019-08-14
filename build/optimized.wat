(module
 (type $FUNCSIG$v (func))
 (type $FUNCSIG$ii (func (param i32) (result i32)))
 (type $FUNCSIG$iii (func (param i32 i32) (result i32)))
 (type $FUNCSIG$viiii (func (param i32 i32 i32 i32)))
 (type $FUNCSIG$viii (func (param i32 i32 i32)))
 (type $FUNCSIG$vii (func (param i32 i32)))
 (type $FUNCSIG$iiiiii (func (param i32 i32 i32 i32 i32) (result i32)))
 (type $FUNCSIG$vi (func (param i32)))
 (type $FUNCSIG$iiii (func (param i32 i32 i32) (result i32)))
 (type $FUNCSIG$i (func (result i32)))
 (import "env" "abort" (func $~lib/env/abort (param i32 i32 i32 i32)))
 (memory $0 1)
 (data (i32.const 9) "\01\00\00\00\00\00\00\98/\8aB\91D7q\cf\fb\c0\b5\a5\db\b5\e9[\c2V9\f1\11\f1Y\a4\82?\92\d5^\1c\ab\98\aa\07\d8\01[\83\12\be\851$\c3}\0cUt]\ber\fe\b1\de\80\a7\06\dc\9bt\f1\9b\c1\c1i\9b\e4\86G\be\ef\c6\9d\c1\0f\cc\a1\0c$o,\e9-\aa\84tJ\dc\a9\b0\\\da\88\f9vRQ>\98m\c61\a8\c8\'\03\b0\c7\7fY\bf\f3\0b\e0\c6G\91\a7\d5Qc\ca\06g))\14\85\n\b7\'8!\1b.\fcm,M\13\0d8STs\ne\bb\njv.\c9\c2\81\85,r\92\a1\e8\bf\a2Kf\1a\a8p\8bK\c2\a3Ql\c7\19\e8\92\d1$\06\99\d6\855\0e\f4p\a0j\10\16\c1\a4\19\08l7\1eLwH\'\b5\bc\b04\b3\0c\1c9J\aa\d8NO\ca\9c[\f3o.h\ee\82\8ftoc\a5x\14x\c8\84\08\02\c7\8c\fa\ff\be\90\eblP\a4\f7\a3\f9\be\f2xq\c6")
 (data (i32.const 520) "\08\00\00\00@")
 (data (i32.const 528) "\1b\00\00\00~\00l\00i\00b\00/\00i\00n\00t\00e\00r\00n\00a\00l\00/\00t\00y\00p\00e\00d\00a\00r\00r\00a\00y\00.\00t\00s")
 (data (i32.const 592) "\1c\00\00\00~\00l\00i\00b\00/\00i\00n\00t\00e\00r\00n\00a\00l\00/\00a\00r\00r\00a\00y\00b\00u\00f\00f\00e\00r\00.\00t\00s")
 (data (i32.const 656) "\11\00\00\00a\00s\00s\00e\00m\00b\00l\00y\00/\00i\00n\00d\00e\00x\00.\00t\00s")
 (table $0 1 funcref)
 (elem (i32.const 0) $null)
 (global $~lib/allocator/arena/startOffset (mut i32) (i32.const 0))
 (global $~lib/allocator/arena/offset (mut i32) (i32.const 0))
 (global $assembly/index/ctx (mut i32) (i32.const 0))
 (export "memory" (memory $0))
 (export "table" (table $0))
 (export "update" (func $assembly/index/update))
 (export "finish" (func $assembly/index/finish))
 (export "hashMe" (func $assembly/index/hashMe))
 (export "reHash" (func $assembly/index/reHash))
 (export "memory.compare" (func $~lib/memory/memory.compare))
 (export "memory.allocate" (func $~lib/memory/memory.allocate))
 (export "memory.free" (func $~lib/memory/memory.free))
 (export "memory.reset" (func $~lib/memory/memory.reset))
 (start $start)
 (func $~lib/allocator/arena/__memory_allocate (; 1 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  local.get $0
  i32.const 1073741824
  i32.gt_u
  if
   unreachable
  end
  local.get $0
  i32.const 1
  local.tee $1
  local.get $0
  local.get $1
  i32.gt_u
  select
  global.get $~lib/allocator/arena/offset
  local.tee $0
  i32.add
  i32.const 7
  i32.add
  i32.const -8
  i32.and
  local.tee $1
  current_memory
  local.tee $2
  i32.const 16
  i32.shl
  i32.gt_u
  if
   local.get $2
   local.get $1
   local.get $0
   i32.sub
   i32.const 65535
   i32.add
   i32.const -65536
   i32.and
   i32.const 16
   i32.shr_u
   local.tee $3
   local.tee $4
   local.get $2
   local.get $4
   i32.gt_s
   select
   grow_memory
   i32.const 0
   i32.lt_s
   if
    local.get $3
    grow_memory
    i32.const 0
    i32.lt_s
    if
     unreachable
    end
   end
  end
  local.get $1
  global.set $~lib/allocator/arena/offset
  local.get $0
 )
 (func $~lib/internal/arraybuffer/allocateUnsafe (; 2 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  (local $1 i32)
  local.get $0
  i32.const 1073741816
  i32.gt_u
  if
   i32.const 0
   i32.const 592
   i32.const 26
   i32.const 2
   call $~lib/env/abort
   unreachable
  end
  i32.const 1
  i32.const 32
  local.get $0
  i32.const 7
  i32.add
  i32.clz
  i32.sub
  i32.shl
  call $~lib/allocator/arena/__memory_allocate
  local.tee $1
  local.get $0
  i32.store
  local.get $1
 )
 (func $~lib/internal/memory/memset (; 3 ;) (type $FUNCSIG$vii) (param $0 i32) (param $1 i32)
  (local $2 i32)
  local.get $1
  i32.eqz
  if
   return
  end
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
  if
   return
  end
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
  i32.const 2
  i32.sub
  i32.const 0
  i32.store8
  local.get $0
  local.get $1
  i32.add
  i32.const 3
  i32.sub
  i32.const 0
  i32.store8
  local.get $1
  i32.const 6
  i32.le_u
  if
   return
  end
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
  if
   return
  end
  i32.const 0
  local.get $0
  i32.sub
  i32.const 3
  i32.and
  local.tee $2
  local.get $0
  i32.add
  local.tee $0
  i32.const 0
  i32.store
  local.get $1
  local.get $2
  i32.sub
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
  if
   return
  end
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
  i32.const 12
  i32.sub
  i32.const 0
  i32.store
  local.get $0
  local.get $1
  i32.add
  i32.const 8
  i32.sub
  i32.const 0
  i32.store
  local.get $1
  i32.const 24
  i32.le_u
  if
   return
  end
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
  i32.const 28
  i32.sub
  i32.const 0
  i32.store
  local.get $0
  local.get $1
  i32.add
  i32.const 24
  i32.sub
  i32.const 0
  i32.store
  local.get $0
  local.get $1
  i32.add
  i32.const 20
  i32.sub
  i32.const 0
  i32.store
  local.get $0
  local.get $1
  i32.add
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
 )
 (func $~lib/memory/memory.allocate (; 4 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  local.get $0
  call $~lib/allocator/arena/__memory_allocate
 )
 (func $~lib/internal/typedarray/TypedArray<i32>#constructor (; 5 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  local.get $1
  i32.const 268435454
  i32.gt_u
  if
   i32.const 0
   i32.const 528
   i32.const 23
   i32.const 34
   call $~lib/env/abort
   unreachable
  end
  local.get $1
  i32.const 2
  i32.shl
  local.tee $1
  call $~lib/internal/arraybuffer/allocateUnsafe
  local.tee $2
  i32.const 8
  i32.add
  local.get $1
  call $~lib/internal/memory/memset
  local.get $0
  i32.eqz
  if
   i32.const 12
   call $~lib/allocator/arena/__memory_allocate
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
  local.get $2
  i32.store
  local.get $0
  i32.const 0
  i32.store offset=4
  local.get $0
  local.get $1
  i32.store offset=8
  local.get $0
 )
 (func $~lib/typedarray/Int32Array#constructor (; 6 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  i32.const 12
  call $~lib/allocator/arena/__memory_allocate
  local.get $0
  call $~lib/internal/typedarray/TypedArray<i32>#constructor
 )
 (func $~lib/internal/typedarray/TypedArray<u8>#constructor (; 7 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  local.get $1
  i32.const 1073741816
  i32.gt_u
  if
   i32.const 0
   i32.const 528
   i32.const 23
   i32.const 34
   call $~lib/env/abort
   unreachable
  end
  local.get $1
  local.tee $2
  call $~lib/internal/arraybuffer/allocateUnsafe
  local.tee $3
  i32.const 8
  i32.add
  local.get $1
  call $~lib/internal/memory/memset
  local.get $0
  i32.eqz
  if
   i32.const 12
   call $~lib/allocator/arena/__memory_allocate
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
  local.get $3
  i32.store
  local.get $0
  i32.const 0
  i32.store offset=4
  local.get $0
  local.get $2
  i32.store offset=8
  local.get $0
 )
 (func $~lib/typedarray/Uint8Array#constructor (; 8 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  i32.const 12
  call $~lib/allocator/arena/__memory_allocate
  local.get $0
  call $~lib/internal/typedarray/TypedArray<u8>#constructor
 )
 (func $assembly/index/CTX#constructor (; 9 ;) (type $FUNCSIG$i) (result i32)
  (local $0 i32)
  i32.const 21
  call $~lib/allocator/arena/__memory_allocate
  local.tee $0
  i32.const 0
  i32.store
  local.get $0
  i32.const 0
  i32.store offset=4
  local.get $0
  i32.const 0
  i32.store offset=8
  local.get $0
  i32.const 0
  i32.store offset=12
  local.get $0
  i32.const 0
  i32.store offset=16
  local.get $0
  i32.const 0
  i32.store8 offset=20
  local.get $0
  i32.const 8
  call $~lib/typedarray/Int32Array#constructor
  i32.store
  local.get $0
  i32.const 64
  call $~lib/typedarray/Int32Array#constructor
  i32.store offset=4
  local.get $0
  i32.const 128
  call $~lib/typedarray/Uint8Array#constructor
  i32.store offset=8
  local.get $0
 )
 (func $~lib/internal/typedarray/TypedArray<u8>#__get (; 10 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  local.get $1
  local.get $0
  i32.load offset=8
  i32.ge_u
  if
   i32.const 0
   i32.const 528
   i32.const 39
   i32.const 63
   call $~lib/env/abort
   unreachable
  end
  local.get $0
  i32.load offset=4
  local.get $1
  local.get $0
  i32.load
  i32.add
  i32.add
  i32.load8_u offset=8
 )
 (func $~lib/internal/typedarray/TypedArray<u8>#__set (; 11 ;) (type $FUNCSIG$viii) (param $0 i32) (param $1 i32) (param $2 i32)
  local.get $1
  local.get $0
  i32.load offset=8
  i32.ge_u
  if
   i32.const 0
   i32.const 528
   i32.const 50
   i32.const 63
   call $~lib/env/abort
   unreachable
  end
  local.get $0
  i32.load offset=4
  local.get $1
  local.get $0
  i32.load
  i32.add
  i32.add
  local.get $2
  i32.store8 offset=8
 )
 (func $~lib/internal/typedarray/TypedArray<i32>#__get (; 12 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  local.get $1
  local.get $0
  i32.load offset=8
  i32.const 2
  i32.shr_u
  i32.ge_u
  if
   i32.const 0
   i32.const 528
   i32.const 39
   i32.const 63
   call $~lib/env/abort
   unreachable
  end
  local.get $0
  i32.load offset=4
  local.get $0
  i32.load
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  i32.add
  i32.load offset=8
 )
 (func $~lib/internal/typedarray/TypedArray<i32>#__set (; 13 ;) (type $FUNCSIG$viii) (param $0 i32) (param $1 i32) (param $2 i32)
  local.get $1
  local.get $0
  i32.load offset=8
  i32.const 2
  i32.shr_u
  i32.ge_u
  if
   i32.const 0
   i32.const 528
   i32.const 50
   i32.const 63
   call $~lib/env/abort
   unreachable
  end
  local.get $0
  i32.load offset=4
  local.get $0
  i32.load
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  i32.add
  local.get $2
  i32.store offset=8
 )
 (func $~lib/array/Array<u32>#__get (; 14 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  (local $1 i32)
  local.get $0
  i32.const 520
  i32.load
  local.tee $1
  i32.load
  i32.const 2
  i32.shr_u
  i32.lt_u
  if (result i32)
   local.get $0
   i32.const 2
   i32.shl
   local.get $1
   i32.add
   i32.load offset=8
  else   
   unreachable
  end
 )
 (func $assembly/index/hashBlocks (; 15 ;) (type $FUNCSIG$iiiiii) (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (result i32)
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
   i32.ge_s
   if
    local.get $1
    i32.const 0
    call $~lib/internal/typedarray/TypedArray<i32>#__get
    local.set $7
    local.get $1
    i32.const 1
    call $~lib/internal/typedarray/TypedArray<i32>#__get
    local.set $10
    local.get $1
    i32.const 2
    call $~lib/internal/typedarray/TypedArray<i32>#__get
    local.set $11
    local.get $1
    i32.const 3
    call $~lib/internal/typedarray/TypedArray<i32>#__get
    local.set $14
    local.get $1
    i32.const 4
    call $~lib/internal/typedarray/TypedArray<i32>#__get
    local.set $8
    local.get $1
    i32.const 5
    call $~lib/internal/typedarray/TypedArray<i32>#__get
    local.set $12
    local.get $1
    i32.const 6
    call $~lib/internal/typedarray/TypedArray<i32>#__get
    local.set $13
    local.get $1
    i32.const 7
    call $~lib/internal/typedarray/TypedArray<i32>#__get
    local.set $15
    i32.const 0
    local.set $5
    loop $repeat|1
     block $break|1
      local.get $5
      i32.const 16
      i32.ge_s
      br_if $break|1
      local.get $0
      local.get $5
      local.get $2
      local.get $3
      local.get $5
      i32.const 2
      i32.shl
      i32.add
      local.tee $6
      call $~lib/internal/typedarray/TypedArray<u8>#__get
      i32.const 255
      i32.and
      i32.const 24
      i32.shl
      local.get $2
      local.get $6
      i32.const 1
      i32.add
      call $~lib/internal/typedarray/TypedArray<u8>#__get
      i32.const 255
      i32.and
      i32.const 16
      i32.shl
      i32.or
      local.get $2
      local.get $6
      i32.const 2
      i32.add
      call $~lib/internal/typedarray/TypedArray<u8>#__get
      i32.const 255
      i32.and
      i32.const 8
      i32.shl
      i32.or
      local.get $2
      local.get $6
      i32.const 3
      i32.add
      call $~lib/internal/typedarray/TypedArray<u8>#__get
      i32.const 255
      i32.and
      i32.or
      call $~lib/internal/typedarray/TypedArray<i32>#__set
      local.get $5
      i32.const 1
      i32.add
      local.set $5
      br $repeat|1
     end
    end
    i32.const 16
    local.set $5
    loop $repeat|2
     block $break|2
      local.get $5
      i32.const 64
      i32.ge_s
      br_if $break|2
      local.get $0
      local.get $5
      i32.const 2
      i32.sub
      call $~lib/internal/typedarray/TypedArray<i32>#__get
      local.set $6
      local.get $0
      local.get $5
      i32.const 15
      i32.sub
      call $~lib/internal/typedarray/TypedArray<i32>#__get
      local.set $9
      local.get $0
      local.get $5
      local.get $0
      local.get $5
      i32.const 7
      i32.sub
      call $~lib/internal/typedarray/TypedArray<i32>#__get
      local.get $6
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
      local.get $0
      local.get $5
      i32.const 16
      i32.sub
      call $~lib/internal/typedarray/TypedArray<i32>#__get
      local.get $9
      i32.const 25
      i32.shl
      local.get $9
      i32.const 7
      i32.shr_u
      i32.or
      local.get $9
      i32.const 14
      i32.shl
      local.get $9
      i32.const 18
      i32.shr_u
      i32.or
      i32.xor
      local.get $9
      i32.const 3
      i32.shr_u
      i32.xor
      i32.add
      i32.add
      call $~lib/internal/typedarray/TypedArray<i32>#__set
      local.get $5
      i32.const 1
      i32.add
      local.set $5
      br $repeat|2
     end
    end
    i32.const 0
    local.set $5
    loop $repeat|3
     block $break|3
      local.get $5
      i32.const 64
      i32.ge_s
      br_if $break|3
      local.get $8
      i32.const 7
      i32.shl
      local.get $8
      i32.const 25
      i32.shr_u
      i32.or
      local.get $8
      i32.const 26
      i32.shl
      local.get $8
      i32.const 6
      i32.shr_u
      i32.or
      local.get $8
      i32.const 21
      i32.shl
      local.get $8
      i32.const 11
      i32.shr_u
      i32.or
      i32.xor
      i32.xor
      local.get $8
      local.get $12
      i32.and
      local.get $8
      i32.const -1
      i32.xor
      local.get $13
      i32.and
      i32.xor
      i32.add
      local.get $5
      call $~lib/array/Array<u32>#__get
      local.get $0
      local.get $5
      call $~lib/internal/typedarray/TypedArray<i32>#__get
      i32.add
      local.get $15
      i32.add
      i32.add
      local.set $6
      local.get $7
      i32.const 10
      i32.shl
      local.get $7
      i32.const 22
      i32.shr_u
      i32.or
      local.get $7
      i32.const 30
      i32.shl
      local.get $7
      i32.const 2
      i32.shr_u
      i32.or
      local.get $7
      i32.const 19
      i32.shl
      local.get $7
      i32.const 13
      i32.shr_u
      i32.or
      i32.xor
      i32.xor
      local.get $10
      local.get $11
      i32.and
      local.get $7
      local.get $10
      i32.and
      local.get $7
      local.get $11
      i32.and
      i32.xor
      i32.xor
      i32.add
      local.set $9
      local.get $13
      local.set $15
      local.get $12
      local.set $13
      local.get $8
      local.set $12
      local.get $6
      local.get $14
      i32.add
      local.set $8
      local.get $11
      local.set $14
      local.get $10
      local.set $11
      local.get $7
      local.set $10
      local.get $6
      local.get $9
      i32.add
      local.set $7
      local.get $5
      i32.const 1
      i32.add
      local.set $5
      br $repeat|3
     end
    end
    local.get $1
    i32.const 0
    local.get $1
    i32.const 0
    call $~lib/internal/typedarray/TypedArray<i32>#__get
    local.get $7
    i32.add
    call $~lib/internal/typedarray/TypedArray<i32>#__set
    local.get $1
    i32.const 1
    local.get $1
    i32.const 1
    call $~lib/internal/typedarray/TypedArray<i32>#__get
    local.get $10
    i32.add
    call $~lib/internal/typedarray/TypedArray<i32>#__set
    local.get $1
    i32.const 2
    local.get $1
    i32.const 2
    call $~lib/internal/typedarray/TypedArray<i32>#__get
    local.get $11
    i32.add
    call $~lib/internal/typedarray/TypedArray<i32>#__set
    local.get $1
    i32.const 3
    local.get $1
    i32.const 3
    call $~lib/internal/typedarray/TypedArray<i32>#__get
    local.get $14
    i32.add
    call $~lib/internal/typedarray/TypedArray<i32>#__set
    local.get $1
    i32.const 4
    local.get $1
    i32.const 4
    call $~lib/internal/typedarray/TypedArray<i32>#__get
    local.get $8
    i32.add
    call $~lib/internal/typedarray/TypedArray<i32>#__set
    local.get $1
    i32.const 5
    local.get $1
    i32.const 5
    call $~lib/internal/typedarray/TypedArray<i32>#__get
    local.get $12
    i32.add
    call $~lib/internal/typedarray/TypedArray<i32>#__set
    local.get $1
    i32.const 6
    local.get $1
    i32.const 6
    call $~lib/internal/typedarray/TypedArray<i32>#__get
    local.get $13
    i32.add
    call $~lib/internal/typedarray/TypedArray<i32>#__set
    local.get $1
    i32.const 7
    local.get $1
    i32.const 7
    call $~lib/internal/typedarray/TypedArray<i32>#__get
    local.get $15
    i32.add
    call $~lib/internal/typedarray/TypedArray<i32>#__set
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
 (func $assembly/index/update (; 16 ;) (type $FUNCSIG$vii) (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  global.get $assembly/index/ctx
  i32.load8_u offset=20
  if
   i32.const 0
   i32.const 656
   i32.const 134
   i32.const 4
   call $~lib/env/abort
   unreachable
  end
  global.get $assembly/index/ctx
  global.get $assembly/index/ctx
  i32.load offset=16
  local.get $1
  i32.add
  i32.store offset=16
  global.get $assembly/index/ctx
  i32.load offset=12
  i32.const 0
  i32.gt_u
  if
   loop $continue|0
    global.get $assembly/index/ctx
    i32.load offset=12
    i32.const 64
    i32.lt_u
    local.tee $2
    if (result i32)
     local.get $1
     i32.const 0
     i32.gt_s
    else     
     local.get $2
    end
    if
     global.get $assembly/index/ctx
     i32.load offset=8
     block (result i32)
      global.get $assembly/index/ctx
      global.get $assembly/index/ctx
      i32.load offset=12
      local.tee $2
      i32.const 1
      i32.add
      i32.store offset=12
      local.get $2
     end
     local.get $0
     block (result i32)
      local.get $3
      local.tee $2
      i32.const 1
      i32.add
      local.set $3
      local.get $2
     end
     call $~lib/internal/typedarray/TypedArray<u8>#__get
     i32.const 255
     i32.and
     call $~lib/internal/typedarray/TypedArray<u8>#__set
     local.get $1
     i32.const 1
     i32.sub
     local.set $1
     br $continue|0
    end
   end
   global.get $assembly/index/ctx
   i32.load offset=12
   i32.const 64
   i32.eq
   if
    global.get $assembly/index/ctx
    i32.load offset=4
    global.get $assembly/index/ctx
    i32.load
    global.get $assembly/index/ctx
    i32.load offset=8
    i32.const 0
    i32.const 64
    call $assembly/index/hashBlocks
    drop
    global.get $assembly/index/ctx
    i32.const 0
    i32.store offset=12
   end
  end
  local.get $1
  i32.const 64
  i32.ge_s
  if
   global.get $assembly/index/ctx
   i32.load offset=4
   global.get $assembly/index/ctx
   i32.load
   local.get $0
   local.get $3
   local.get $1
   call $assembly/index/hashBlocks
   local.set $3
   local.get $1
   i32.const 64
   i32.rem_s
   local.set $1
  end
  loop $continue|1
   local.get $1
   i32.const 0
   i32.gt_s
   if
    global.get $assembly/index/ctx
    i32.load offset=8
    block (result i32)
     global.get $assembly/index/ctx
     global.get $assembly/index/ctx
     i32.load offset=12
     local.tee $2
     i32.const 1
     i32.add
     i32.store offset=12
     local.get $2
    end
    local.get $0
    block (result i32)
     local.get $3
     local.tee $2
     i32.const 1
     i32.add
     local.set $3
     local.get $2
    end
    call $~lib/internal/typedarray/TypedArray<u8>#__get
    i32.const 255
    i32.and
    call $~lib/internal/typedarray/TypedArray<u8>#__set
    local.get $1
    i32.const 1
    i32.sub
    local.set $1
    br $continue|1
   end
  end
 )
 (func $assembly/index/finish (; 17 ;) (type $FUNCSIG$vi) (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  global.get $assembly/index/ctx
  i32.load8_u offset=20
  i32.eqz
  if
   global.get $assembly/index/ctx
   i32.load offset=16
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
   global.get $assembly/index/ctx
   i32.load offset=8
   global.get $assembly/index/ctx
   i32.load offset=12
   local.tee $2
   i32.const 128
   call $~lib/internal/typedarray/TypedArray<u8>#__set
   local.get $2
   i32.const 1
   i32.add
   local.set $2
   loop $repeat|0
    block $break|0
     local.get $2
     local.get $1
     i32.const 8
     i32.sub
     i32.ge_s
     br_if $break|0
     global.get $assembly/index/ctx
     i32.load offset=8
     local.get $2
     i32.const 0
     call $~lib/internal/typedarray/TypedArray<u8>#__set
     local.get $2
     i32.const 1
     i32.add
     local.set $2
     br $repeat|0
    end
   end
   global.get $assembly/index/ctx
   i32.load offset=8
   local.get $1
   i32.const 8
   i32.sub
   local.get $3
   i32.const 24
   i32.shr_u
   call $~lib/internal/typedarray/TypedArray<u8>#__set
   global.get $assembly/index/ctx
   i32.load offset=8
   local.get $1
   i32.const 7
   i32.sub
   local.get $3
   i32.const 16
   i32.shr_u
   i32.const 255
   i32.and
   call $~lib/internal/typedarray/TypedArray<u8>#__set
   global.get $assembly/index/ctx
   i32.load offset=8
   local.get $1
   i32.const 6
   i32.sub
   local.get $3
   i32.const 8
   i32.shr_u
   i32.const 255
   i32.and
   call $~lib/internal/typedarray/TypedArray<u8>#__set
   global.get $assembly/index/ctx
   i32.load offset=8
   local.get $1
   i32.const 5
   i32.sub
   local.get $3
   i32.const 255
   i32.and
   call $~lib/internal/typedarray/TypedArray<u8>#__set
   global.get $assembly/index/ctx
   i32.load offset=8
   local.get $1
   i32.const 4
   i32.sub
   local.get $4
   i32.const 24
   i32.shr_u
   call $~lib/internal/typedarray/TypedArray<u8>#__set
   global.get $assembly/index/ctx
   i32.load offset=8
   local.get $1
   i32.const 3
   i32.sub
   local.get $4
   i32.const 16
   i32.shr_u
   i32.const 255
   i32.and
   call $~lib/internal/typedarray/TypedArray<u8>#__set
   global.get $assembly/index/ctx
   i32.load offset=8
   local.get $1
   i32.const 2
   i32.sub
   local.get $4
   i32.const 8
   i32.shr_u
   i32.const 255
   i32.and
   call $~lib/internal/typedarray/TypedArray<u8>#__set
   global.get $assembly/index/ctx
   i32.load offset=8
   local.get $1
   i32.const 1
   i32.sub
   local.get $4
   i32.const 255
   i32.and
   call $~lib/internal/typedarray/TypedArray<u8>#__set
   global.get $assembly/index/ctx
   i32.load offset=4
   global.get $assembly/index/ctx
   i32.load
   global.get $assembly/index/ctx
   i32.load offset=8
   i32.const 0
   local.get $1
   call $assembly/index/hashBlocks
   drop
   global.get $assembly/index/ctx
   i32.const 1
   i32.store8 offset=20
  end
  i32.const 0
  local.set $1
  loop $repeat|1
   block $break|1
    local.get $1
    i32.const 8
    i32.ge_s
    br_if $break|1
    local.get $0
    local.get $1
    i32.const 2
    i32.shl
    global.get $assembly/index/ctx
    i32.load
    local.get $1
    call $~lib/internal/typedarray/TypedArray<i32>#__get
    i32.const 24
    i32.shr_u
    call $~lib/internal/typedarray/TypedArray<u8>#__set
    local.get $0
    local.get $1
    i32.const 2
    i32.shl
    i32.const 1
    i32.add
    global.get $assembly/index/ctx
    i32.load
    local.get $1
    call $~lib/internal/typedarray/TypedArray<i32>#__get
    i32.const 16
    i32.shr_u
    i32.const 255
    i32.and
    call $~lib/internal/typedarray/TypedArray<u8>#__set
    local.get $0
    local.get $1
    i32.const 2
    i32.shl
    i32.const 2
    i32.add
    global.get $assembly/index/ctx
    i32.load
    local.get $1
    call $~lib/internal/typedarray/TypedArray<i32>#__get
    i32.const 8
    i32.shr_u
    i32.const 255
    i32.and
    call $~lib/internal/typedarray/TypedArray<u8>#__set
    local.get $0
    local.get $1
    i32.const 2
    i32.shl
    i32.const 3
    i32.add
    global.get $assembly/index/ctx
    i32.load
    local.get $1
    call $~lib/internal/typedarray/TypedArray<i32>#__get
    i32.const 255
    i32.and
    call $~lib/internal/typedarray/TypedArray<u8>#__set
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $repeat|1
   end
  end
 )
 (func $assembly/index/reset (; 18 ;) (type $FUNCSIG$v)
  global.get $assembly/index/ctx
  i32.load
  i32.const 0
  i32.const 1779033703
  call $~lib/internal/typedarray/TypedArray<i32>#__set
  global.get $assembly/index/ctx
  i32.load
  i32.const 1
  i32.const -1150833019
  call $~lib/internal/typedarray/TypedArray<i32>#__set
  global.get $assembly/index/ctx
  i32.load
  i32.const 2
  i32.const 1013904242
  call $~lib/internal/typedarray/TypedArray<i32>#__set
  global.get $assembly/index/ctx
  i32.load
  i32.const 3
  i32.const -1521486534
  call $~lib/internal/typedarray/TypedArray<i32>#__set
  global.get $assembly/index/ctx
  i32.load
  i32.const 4
  i32.const 1359893119
  call $~lib/internal/typedarray/TypedArray<i32>#__set
  global.get $assembly/index/ctx
  i32.load
  i32.const 5
  i32.const -1694144372
  call $~lib/internal/typedarray/TypedArray<i32>#__set
  global.get $assembly/index/ctx
  i32.load
  i32.const 6
  i32.const 528734635
  call $~lib/internal/typedarray/TypedArray<i32>#__set
  global.get $assembly/index/ctx
  i32.load
  i32.const 7
  i32.const 1541459225
  call $~lib/internal/typedarray/TypedArray<i32>#__set
  global.get $assembly/index/ctx
  i32.const 0
  i32.store offset=12
  global.get $assembly/index/ctx
  i32.const 0
  i32.store offset=16
  global.get $assembly/index/ctx
  i32.const 0
  i32.store8 offset=20
 )
 (func $assembly/index/hashMe (; 19 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  (local $1 i32)
  call $assembly/index/reset
  i32.const 32
  call $~lib/typedarray/Uint8Array#constructor
  local.set $1
  local.get $0
  local.get $0
  i32.load offset=8
  call $assembly/index/update
  local.get $1
  call $assembly/index/finish
  local.get $1
 )
 (func $assembly/index/clean (; 20 ;) (type $FUNCSIG$v)
  (local $0 i32)
  loop $repeat|0
   block $break|0
    local.get $0
    global.get $assembly/index/ctx
    i32.load offset=8
    i32.load offset=8
    i32.ge_s
    br_if $break|0
    global.get $assembly/index/ctx
    i32.load offset=8
    local.get $0
    i32.const 0
    call $~lib/internal/typedarray/TypedArray<u8>#__set
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $repeat|0
   end
  end
  i32.const 0
  local.set $0
  loop $repeat|1
   block $break|1
    local.get $0
    global.get $assembly/index/ctx
    i32.load offset=4
    i32.load offset=8
    i32.const 2
    i32.shr_u
    i32.ge_s
    br_if $break|1
    global.get $assembly/index/ctx
    i32.load offset=4
    local.get $0
    i32.const 0
    call $~lib/internal/typedarray/TypedArray<i32>#__set
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $repeat|1
   end
  end
  call $assembly/index/reset
 )
 (func $assembly/index/reHash (; 21 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  (local $1 i32)
  call $assembly/index/clean
  i32.const 32
  call $~lib/typedarray/Uint8Array#constructor
  local.set $1
  local.get $0
  local.get $0
  i32.load offset=8
  call $assembly/index/update
  local.get $1
  call $assembly/index/finish
  local.get $1
 )
 (func $~lib/internal/memory/memcmp (; 22 ;) (type $FUNCSIG$iiii) (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  local.get $0
  local.get $1
  i32.eq
  if
   i32.const 0
   return
  end
  loop $continue|0
   local.get $2
   i32.const 0
   i32.ne
   local.tee $3
   if (result i32)
    local.get $0
    i32.load8_u
    local.get $1
    i32.load8_u
    i32.eq
   else    
    local.get $3
   end
   if
    local.get $2
    i32.const 1
    i32.sub
    local.set $2
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $continue|0
   end
  end
  local.get $2
  if (result i32)
   local.get $0
   i32.load8_u
   local.get $1
   i32.load8_u
   i32.sub
  else   
   i32.const 0
  end
 )
 (func $~lib/memory/memory.compare (; 23 ;) (type $FUNCSIG$iiii) (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  local.get $0
  local.get $1
  local.get $2
  call $~lib/internal/memory/memcmp
 )
 (func $~lib/memory/memory.free (; 24 ;) (type $FUNCSIG$vi) (param $0 i32)
  nop
 )
 (func $~lib/memory/memory.reset (; 25 ;) (type $FUNCSIG$v)
  global.get $~lib/allocator/arena/startOffset
  global.set $~lib/allocator/arena/offset
 )
 (func $start (; 26 ;) (type $FUNCSIG$v)
  i32.const 696
  global.set $~lib/allocator/arena/startOffset
  global.get $~lib/allocator/arena/startOffset
  global.set $~lib/allocator/arena/offset
  call $assembly/index/CTX#constructor
  global.set $assembly/index/ctx
 )
 (func $null (; 27 ;) (type $FUNCSIG$v)
  nop
 )
)
