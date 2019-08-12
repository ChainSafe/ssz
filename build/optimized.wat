(module
 (type $FUNCSIG$v (func))
 (type $FUNCSIG$ii (func (param i32) (result i32)))
 (type $FUNCSIG$iii (func (param i32 i32) (result i32)))
 (type $FUNCSIG$viiii (func (param i32 i32 i32 i32)))
 (type $FUNCSIG$viii (func (param i32 i32 i32)))
 (type $FUNCSIG$vi (func (param i32)))
 (type $FUNCSIG$iiii (func (param i32 i32 i32) (result i32)))
 (type $FUNCSIG$vii (func (param i32 i32)))
 (type $FUNCSIG$i (func (result i32)))
 (import "env" "abort" (func $~lib/env/abort (param i32 i32 i32 i32)))
 (memory $0 1)
 (data (i32.const 8) "\0d\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00.\00t\00s")
 (data (i32.const 40) "\1c\00\00\00~\00l\00i\00b\00/\00i\00n\00t\00e\00r\00n\00a\00l\00/\00a\00r\00r\00a\00y\00b\00u\00f\00f\00e\00r\00.\00t\00s")
 (data (i32.const 104) "\1b\00\00\00~\00l\00i\00b\00/\00i\00n\00t\00e\00r\00n\00a\00l\00/\00t\00y\00p\00e\00d\00a\00r\00r\00a\00y\00.\00t\00s")
 (data (i32.const 169) "\01\00\00\00\00\00\00\98/\8aB\91D7q\cf\fb\c0\b5\a5\db\b5\e9[\c2V9\f1\11\f1Y\a4\82?\92\d5^\1c\ab\98\aa\07\d8\01[\83\12\be\851$\c3}\0cUt]\ber\fe\b1\de\80\a7\06\dc\9bt\f1\9b\c1\c1i\9b\e4\86G\be\ef\c6\9d\c1\0f\cc\a1\0c$o,\e9-\aa\84tJ\dc\a9\b0\\\da\88\f9vRQ>\98m\c61\a8\c8\'\03\b0\c7\7fY\bf\f3\0b\e0\c6G\91\a7\d5Qc\ca\06g))\14\85\n\b7\'8!\1b.\fcm,M\13\0d8STs\ne\bb\njv.\c9\c2\81\85,r\92\a1\e8\bf\a2Kf\1a\a8p\8bK\c2\a3Ql\c7\19\e8\92\d1$\06\99\d6\855\0e\f4p\a0j\10\16\c1\a4\19\08l7\1eLwH\'\b5\bc\b04\b3\0c\1c9J\aa\d8NO\ca\9c[\f3o.h\ee\82\8ftoc\a5x\14x\c8\84\08\02\c7\8c\fa\ff\be\90\eblP\a4\f7\a3\f9\be\f2xq\c6")
 (data (i32.const 680) "\a8\00\00\00@")
 (table $0 1 funcref)
 (elem (i32.const 0) $null)
 (global $~lib/allocator/arena/startOffset (mut i32) (i32.const 0))
 (global $~lib/allocator/arena/offset (mut i32) (i32.const 0))
 (export "memory" (memory $0))
 (export "table" (table $0))
 (export "jsSHA256#dummy" (func $assembly/index/jsSHA256#dummy))
 (export "jsSHA256#constructor" (func $assembly/index/jsSHA256#constructor))
 (export "jsSHA256#sha256_update" (func $assembly/index/jsSHA256#sha256_update))
 (export "jsSHA256#sha256_final" (func $assembly/index/jsSHA256#sha256_final))
 (export "jsSHA256#digest" (func $assembly/index/jsSHA256#digest))
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
 (func $~lib/memory/memory.allocate (; 2 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  local.get $0
  call $~lib/allocator/arena/__memory_allocate
 )
 (func $~lib/internal/arraybuffer/computeSize (; 3 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  i32.const 1
  i32.const 32
  local.get $0
  i32.const 7
  i32.add
  i32.clz
  i32.sub
  i32.shl
 )
 (func $~lib/internal/arraybuffer/allocateUnsafe (; 4 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  (local $1 i32)
  local.get $0
  i32.const 1073741816
  i32.gt_u
  if
   i32.const 0
   i32.const 40
   i32.const 26
   i32.const 2
   call $~lib/env/abort
   unreachable
  end
  local.get $0
  call $~lib/internal/arraybuffer/computeSize
  call $~lib/allocator/arena/__memory_allocate
  local.tee $1
  local.get $0
  i32.store
  local.get $1
 )
 (func $~lib/internal/memory/memset (; 5 ;) (type $FUNCSIG$vii) (param $0 i32) (param $1 i32)
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
 (func $~lib/array/Array<u8>#constructor (; 6 ;) (type $FUNCSIG$i) (result i32)
  (local $0 i32)
  (local $1 i32)
  i32.const 64
  call $~lib/internal/arraybuffer/allocateUnsafe
  local.set $1
  i32.const 8
  call $~lib/allocator/arena/__memory_allocate
  local.tee $0
  i32.const 0
  i32.store
  local.get $0
  i32.const 0
  i32.store offset=4
  local.get $0
  local.get $1
  i32.store
  local.get $0
  i32.const 64
  i32.store offset=4
  local.get $1
  i32.const 8
  i32.add
  i32.const 64
  call $~lib/internal/memory/memset
  local.get $0
 )
 (func $~lib/internal/typedarray/TypedArray<u8>#constructor (; 7 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  (local $1 i32)
  i32.const 32
  call $~lib/internal/arraybuffer/allocateUnsafe
  local.tee $1
  i32.const 8
  i32.add
  i32.const 32
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
  local.get $1
  i32.store
  local.get $0
  i32.const 0
  i32.store offset=4
  local.get $0
  i32.const 32
  i32.store offset=8
  local.get $0
 )
 (func $~lib/array/Array<u32>#constructor (; 8 ;) (type $FUNCSIG$i) (result i32)
  (local $0 i32)
  (local $1 i32)
  i32.const 32
  call $~lib/internal/arraybuffer/allocateUnsafe
  local.set $1
  i32.const 8
  call $~lib/allocator/arena/__memory_allocate
  local.tee $0
  i32.const 0
  i32.store
  local.get $0
  i32.const 0
  i32.store offset=4
  local.get $0
  local.get $1
  i32.store
  local.get $0
  i32.const 8
  i32.store offset=4
  local.get $1
  i32.const 8
  i32.add
  i32.const 32
  call $~lib/internal/memory/memset
  local.get $0
 )
 (func $~lib/internal/memory/memcpy (; 9 ;) (type $FUNCSIG$viii) (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  loop $continue|0
   local.get $1
   i32.const 3
   i32.and
   local.get $2
   local.get $2
   select
   if
    local.get $0
    local.tee $3
    i32.const 1
    i32.add
    local.set $0
    local.get $3
    block (result i32)
     local.get $1
     local.tee $3
     i32.const 1
     i32.add
     local.set $1
     local.get $3
     i32.load8_u
    end
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
    i32.ge_u
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
      block $case0|2
       local.get $0
       i32.const 3
       i32.and
       i32.const 1
       i32.sub
       br_table $case0|2 $case1|2 $case2|2 $break|2
      end
      local.get $1
      i32.load
      local.set $4
      local.get $0
      local.get $1
      i32.load8_u
      i32.store8
      local.get $0
      i32.const 1
      i32.add
      local.tee $0
      i32.const 1
      i32.add
      local.set $3
      local.get $0
      block (result i32)
       local.get $1
       i32.const 1
       i32.add
       local.tee $0
       i32.const 1
       i32.add
       local.set $5
       local.get $0
       i32.load8_u
      end
      i32.store8
      local.get $3
      i32.const 1
      i32.add
      local.set $0
      local.get $5
      i32.const 1
      i32.add
      local.set $1
      local.get $3
      local.get $5
      i32.load8_u
      i32.store8
      local.get $2
      i32.const 3
      i32.sub
      local.set $2
      loop $continue|3
       local.get $2
       i32.const 17
       i32.ge_u
       if
        local.get $0
        local.get $1
        i32.const 1
        i32.add
        i32.load
        local.tee $3
        i32.const 8
        i32.shl
        local.get $4
        i32.const 24
        i32.shr_u
        i32.or
        i32.store
        local.get $0
        i32.const 4
        i32.add
        local.get $1
        i32.const 5
        i32.add
        i32.load
        local.tee $4
        i32.const 8
        i32.shl
        local.get $3
        i32.const 24
        i32.shr_u
        i32.or
        i32.store
        local.get $0
        i32.const 8
        i32.add
        local.get $1
        i32.const 9
        i32.add
        i32.load
        local.tee $3
        i32.const 8
        i32.shl
        local.get $4
        i32.const 24
        i32.shr_u
        i32.or
        i32.store
        local.get $0
        i32.const 12
        i32.add
        local.get $1
        i32.const 13
        i32.add
        i32.load
        local.tee $4
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
     local.set $4
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
     local.get $3
     block (result i32)
      local.get $1
      i32.const 1
      i32.add
      local.tee $3
      i32.const 1
      i32.add
      local.set $1
      local.get $3
      i32.load8_u
     end
     i32.store8
     local.get $2
     i32.const 2
     i32.sub
     local.set $2
     loop $continue|4
      local.get $2
      i32.const 18
      i32.ge_u
      if
       local.get $0
       local.get $1
       i32.const 2
       i32.add
       i32.load
       local.tee $3
       i32.const 16
       i32.shl
       local.get $4
       i32.const 16
       i32.shr_u
       i32.or
       i32.store
       local.get $0
       i32.const 4
       i32.add
       local.get $1
       i32.const 6
       i32.add
       i32.load
       local.tee $4
       i32.const 16
       i32.shl
       local.get $3
       i32.const 16
       i32.shr_u
       i32.or
       i32.store
       local.get $0
       i32.const 8
       i32.add
       local.get $1
       i32.const 10
       i32.add
       i32.load
       local.tee $3
       i32.const 16
       i32.shl
       local.get $4
       i32.const 16
       i32.shr_u
       i32.or
       i32.store
       local.get $0
       i32.const 12
       i32.add
       local.get $1
       i32.const 14
       i32.add
       i32.load
       local.tee $4
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
    local.set $4
    local.get $0
    local.tee $3
    i32.const 1
    i32.add
    local.set $0
    local.get $3
    block (result i32)
     local.get $1
     local.tee $3
     i32.const 1
     i32.add
     local.set $1
     local.get $3
     i32.load8_u
    end
    i32.store8
    local.get $2
    i32.const 1
    i32.sub
    local.set $2
    loop $continue|5
     local.get $2
     i32.const 19
     i32.ge_u
     if
      local.get $0
      local.get $1
      i32.const 3
      i32.add
      i32.load
      local.tee $3
      i32.const 24
      i32.shl
      local.get $4
      i32.const 8
      i32.shr_u
      i32.or
      i32.store
      local.get $0
      i32.const 4
      i32.add
      local.get $1
      i32.const 7
      i32.add
      i32.load
      local.tee $4
      i32.const 24
      i32.shl
      local.get $3
      i32.const 8
      i32.shr_u
      i32.or
      i32.store
      local.get $0
      i32.const 8
      i32.add
      local.get $1
      i32.const 11
      i32.add
      i32.load
      local.tee $3
      i32.const 24
      i32.shl
      local.get $4
      i32.const 8
      i32.shr_u
      i32.or
      i32.store
      local.get $0
      i32.const 12
      i32.add
      local.get $1
      i32.const 15
      i32.add
      i32.load
      local.tee $4
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
   local.tee $3
   i32.const 1
   i32.add
   local.set $0
   local.get $3
   block (result i32)
    local.get $1
    i32.const 1
    i32.add
    local.tee $3
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    i32.load8_u
   end
   i32.store8
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
   local.get $3
   block (result i32)
    local.get $1
    i32.const 1
    i32.add
    local.tee $3
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    i32.load8_u
   end
   i32.store8
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
   local.get $3
   block (result i32)
    local.get $1
    i32.const 1
    i32.add
    local.tee $3
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    i32.load8_u
   end
   i32.store8
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
   local.get $3
   block (result i32)
    local.get $1
    i32.const 1
    i32.add
    local.tee $3
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    i32.load8_u
   end
   i32.store8
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
   local.get $3
   block (result i32)
    local.get $1
    i32.const 1
    i32.add
    local.tee $3
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    i32.load8_u
   end
   i32.store8
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
   local.get $3
   block (result i32)
    local.get $1
    i32.const 1
    i32.add
    local.tee $3
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    i32.load8_u
   end
   i32.store8
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
   local.get $3
   block (result i32)
    local.get $1
    i32.const 1
    i32.add
    local.tee $3
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    i32.load8_u
   end
   i32.store8
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
   local.get $3
   block (result i32)
    local.get $1
    i32.const 1
    i32.add
    local.tee $3
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    i32.load8_u
   end
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
   local.tee $3
   i32.const 1
   i32.add
   local.set $0
   local.get $3
   block (result i32)
    local.get $1
    i32.const 1
    i32.add
    local.tee $3
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    i32.load8_u
   end
   i32.store8
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
   local.get $3
   block (result i32)
    local.get $1
    i32.const 1
    i32.add
    local.tee $3
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    i32.load8_u
   end
   i32.store8
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
   local.get $3
   block (result i32)
    local.get $1
    i32.const 1
    i32.add
    local.tee $3
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    i32.load8_u
   end
   i32.store8
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
   local.get $3
   block (result i32)
    local.get $1
    i32.const 1
    i32.add
    local.tee $3
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    i32.load8_u
   end
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
   local.tee $3
   i32.const 1
   i32.add
   local.set $0
   local.get $3
   block (result i32)
    local.get $1
    i32.const 1
    i32.add
    local.tee $3
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    i32.load8_u
   end
   i32.store8
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
   local.get $3
   block (result i32)
    local.get $1
    i32.const 1
    i32.add
    local.tee $3
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    i32.load8_u
   end
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
   local.get $3
   block (result i32)
    local.get $1
    i32.const 1
    i32.add
    local.tee $3
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    i32.load8_u
   end
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
 (func $~lib/internal/memory/memmove (; 10 ;) (type $FUNCSIG$viii) (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  local.get $0
  local.get $1
  i32.eq
  if
   return
  end
  local.get $1
  local.get $2
  i32.add
  local.get $0
  i32.le_u
  local.tee $3
  if (result i32)
   local.get $3
  else   
   local.get $0
   local.get $2
   i32.add
   local.get $1
   i32.le_u
  end
  if
   local.get $0
   local.get $1
   local.get $2
   call $~lib/internal/memory/memcpy
   return
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
      local.get $2
      i32.eqz
      if
       return
      end
      local.get $2
      i32.const 1
      i32.sub
      local.set $2
      local.get $0
      local.tee $3
      i32.const 1
      i32.add
      local.set $0
      local.get $3
      block (result i32)
       local.get $1
       local.tee $3
       i32.const 1
       i32.add
       local.set $1
       local.get $3
       i32.load8_u
      end
      i32.store8
      br $continue|0
     end
    end
    loop $continue|1
     local.get $2
     i32.const 8
     i32.ge_u
     if
      local.get $0
      local.get $1
      i64.load
      i64.store
      local.get $2
      i32.const 8
      i32.sub
      local.set $2
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
    local.get $2
    if
     local.get $0
     local.tee $3
     i32.const 1
     i32.add
     local.set $0
     local.get $3
     block (result i32)
      local.get $1
      local.tee $3
      i32.const 1
      i32.add
      local.set $1
      local.get $3
      i32.load8_u
     end
     i32.store8
     local.get $2
     i32.const 1
     i32.sub
     local.set $2
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
     local.get $2
     i32.add
     i32.const 7
     i32.and
     if
      local.get $2
      i32.eqz
      if
       return
      end
      local.get $0
      local.get $2
      i32.const 1
      i32.sub
      local.tee $2
      i32.add
      local.get $1
      local.get $2
      i32.add
      i32.load8_u
      i32.store8
      br $continue|3
     end
    end
    loop $continue|4
     local.get $2
     i32.const 8
     i32.ge_u
     if
      local.get $2
      i32.const 8
      i32.sub
      local.tee $2
      local.get $0
      i32.add
      local.get $1
      local.get $2
      i32.add
      i64.load
      i64.store
      br $continue|4
     end
    end
   end
   loop $continue|5
    local.get $2
    if
     local.get $0
     local.get $2
     i32.const 1
     i32.sub
     local.tee $2
     i32.add
     local.get $1
     local.get $2
     i32.add
     i32.load8_u
     i32.store8
     br $continue|5
    end
   end
  end
 )
 (func $~lib/internal/arraybuffer/reallocateUnsafe (; 11 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  local.get $1
  local.get $0
  i32.load
  local.tee $2
  i32.gt_s
  if
   local.get $1
   i32.const 1073741816
   i32.gt_s
   if
    i32.const 0
    i32.const 40
    i32.const 40
    i32.const 4
    call $~lib/env/abort
    unreachable
   end
   local.get $1
   local.get $2
   call $~lib/internal/arraybuffer/computeSize
   i32.const 8
   i32.sub
   i32.le_s
   if
    local.get $0
    local.get $1
    i32.store
   else    
    local.get $1
    call $~lib/internal/arraybuffer/allocateUnsafe
    local.tee $3
    i32.const 8
    i32.add
    local.get $0
    i32.const 8
    i32.add
    local.get $2
    call $~lib/internal/memory/memmove
    local.get $3
    local.set $0
   end
   local.get $0
   i32.const 8
   i32.add
   local.get $2
   i32.add
   local.get $1
   local.get $2
   i32.sub
   call $~lib/internal/memory/memset
  else   
   local.get $1
   local.get $2
   i32.lt_s
   if
    local.get $1
    i32.const 0
    i32.lt_s
    if
     i32.const 0
     i32.const 40
     i32.const 62
     i32.const 4
     call $~lib/env/abort
     unreachable
    end
    local.get $0
    local.get $1
    i32.store
   end
  end
  local.get $0
 )
 (func $~lib/array/Array<u32>#__set (; 12 ;) (type $FUNCSIG$viii) (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  local.get $1
  local.get $0
  i32.load
  local.tee $3
  i32.load
  i32.const 2
  i32.shr_u
  i32.ge_u
  if
   local.get $1
   i32.const 268435454
   i32.ge_u
   if
    i32.const 0
    i32.const 8
    i32.const 107
    i32.const 41
    call $~lib/env/abort
    unreachable
   end
   local.get $0
   local.get $3
   local.get $1
   i32.const 1
   i32.add
   i32.const 2
   i32.shl
   call $~lib/internal/arraybuffer/reallocateUnsafe
   local.tee $3
   i32.store
   local.get $0
   local.get $1
   i32.const 1
   i32.add
   i32.store offset=4
  end
  local.get $1
  i32.const 2
  i32.shl
  local.get $3
  i32.add
  local.get $2
  i32.store offset=8
 )
 (func $assembly/index/jsSHA256#constructor (; 13 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  local.get $0
  i32.eqz
  if
   i32.const 32
   call $~lib/allocator/arena/__memory_allocate
   local.set $0
  end
  local.get $0
  i32.const 0
  i32.store
  local.get $0
  i64.const 0
  i64.store offset=8
  local.get $0
  call $~lib/array/Array<u8>#constructor
  i32.store offset=16
  local.get $0
  i32.const 12
  call $~lib/allocator/arena/__memory_allocate
  call $~lib/internal/typedarray/TypedArray<u8>#constructor
  i32.store offset=20
  local.get $0
  call $~lib/array/Array<u32>#constructor
  i32.store offset=24
  local.get $0
  i32.const 680
  i32.store offset=28
  local.get $0
  i32.const 0
  i32.store
  local.get $0
  i64.const 0
  i64.store offset=8
  local.get $0
  i32.load offset=24
  i32.const 0
  i32.const 1779033703
  call $~lib/array/Array<u32>#__set
  local.get $0
  i32.load offset=24
  i32.const 1
  i32.const -1150833019
  call $~lib/array/Array<u32>#__set
  local.get $0
  i32.load offset=24
  i32.const 2
  i32.const 1013904242
  call $~lib/array/Array<u32>#__set
  local.get $0
  i32.load offset=24
  i32.const 3
  i32.const -1521486534
  call $~lib/array/Array<u32>#__set
  local.get $0
  i32.load offset=24
  i32.const 4
  i32.const 1359893119
  call $~lib/array/Array<u32>#__set
  local.get $0
  i32.load offset=24
  i32.const 5
  i32.const -1694144372
  call $~lib/array/Array<u32>#__set
  local.get $0
  i32.load offset=24
  i32.const 6
  i32.const 528734635
  call $~lib/array/Array<u32>#__set
  local.get $0
  i32.load offset=24
  i32.const 7
  i32.const 1541459225
  call $~lib/array/Array<u32>#__set
  local.get $0
 )
 (func $assembly/index/jsSHA256#dummy (; 14 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  i32.const 555
 )
 (func $~lib/internal/typedarray/TypedArray<u8>#__get (; 15 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  local.get $1
  local.get $0
  i32.load offset=8
  i32.ge_u
  if
   i32.const 0
   i32.const 104
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
 (func $~lib/array/Array<u8>#__set (; 16 ;) (type $FUNCSIG$viii) (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  local.get $1
  local.get $0
  i32.load
  local.tee $3
  i32.load
  i32.ge_u
  if
   local.get $1
   i32.const 1073741816
   i32.ge_u
   if
    i32.const 0
    i32.const 8
    i32.const 107
    i32.const 41
    call $~lib/env/abort
    unreachable
   end
   local.get $0
   local.get $3
   local.get $1
   i32.const 1
   i32.add
   call $~lib/internal/arraybuffer/reallocateUnsafe
   local.tee $3
   i32.store
   local.get $0
   local.get $1
   i32.const 1
   i32.add
   i32.store offset=4
  end
  local.get $1
  local.get $3
  i32.add
  local.get $2
  i32.store8 offset=8
 )
 (func $~lib/internal/typedarray/TypedArray<u32>#constructor (; 17 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  (local $1 i32)
  i32.const 256
  call $~lib/internal/arraybuffer/allocateUnsafe
  local.tee $1
  i32.const 8
  i32.add
  i32.const 256
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
  local.get $1
  i32.store
  local.get $0
  i32.const 0
  i32.store offset=4
  local.get $0
  i32.const 256
  i32.store offset=8
  local.get $0
 )
 (func $~lib/array/Array<u8>#__get (; 18 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  local.get $1
  local.get $0
  i32.load
  local.tee $0
  i32.load
  i32.lt_u
  if (result i32)
   local.get $0
   local.get $1
   i32.add
   i32.load8_u offset=8
  else   
   unreachable
  end
 )
 (func $~lib/internal/typedarray/TypedArray<u32>#__set (; 19 ;) (type $FUNCSIG$viii) (param $0 i32) (param $1 i32) (param $2 i32)
  local.get $1
  local.get $0
  i32.load offset=8
  i32.const 2
  i32.shr_u
  i32.ge_u
  if
   i32.const 0
   i32.const 104
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
 (func $~lib/internal/typedarray/TypedArray<u32>#__get (; 20 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  local.get $1
  local.get $0
  i32.load offset=8
  i32.const 2
  i32.shr_u
  i32.ge_u
  if
   i32.const 0
   i32.const 104
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
 (func $~lib/array/Array<u32>#__get (; 21 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  local.get $1
  local.get $0
  i32.load
  local.tee $0
  i32.load
  i32.const 2
  i32.shr_u
  i32.lt_u
  if (result i32)
   local.get $1
   i32.const 2
   i32.shl
   local.get $0
   i32.add
   i32.load offset=8
  else   
   unreachable
  end
 )
 (func $assembly/index/jsSHA256#sha256_transform (; 22 ;) (type $FUNCSIG$vi) (param $0 i32)
  (local $1 i32)
  (local $2 i32)
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
  i32.const 12
  call $~lib/allocator/arena/__memory_allocate
  call $~lib/internal/typedarray/TypedArray<u32>#constructor
  local.set $5
  loop $repeat|0
   local.get $1
   i32.const 16
   i32.lt_u
   if
    local.get $5
    local.get $1
    local.get $0
    i32.load offset=16
    local.get $2
    call $~lib/array/Array<u8>#__get
    i32.const 255
    i32.and
    i32.const 24
    i32.shl
    local.get $0
    i32.load offset=16
    local.get $2
    i32.const 1
    i32.add
    call $~lib/array/Array<u8>#__get
    i32.const 255
    i32.and
    i32.const 16
    i32.shl
    i32.or
    local.get $0
    i32.load offset=16
    local.get $2
    i32.const 2
    i32.add
    call $~lib/array/Array<u8>#__get
    i32.const 255
    i32.and
    i32.const 8
    i32.shl
    i32.or
    local.get $0
    i32.load offset=16
    local.get $2
    i32.const 3
    i32.add
    call $~lib/array/Array<u8>#__get
    i32.const 255
    i32.and
    i32.or
    call $~lib/internal/typedarray/TypedArray<u32>#__set
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    local.get $2
    i32.const 4
    i32.add
    local.set $2
    br $repeat|0
   end
  end
  loop $repeat|1
   local.get $1
   i32.const 64
   i32.lt_u
   if
    local.get $5
    local.get $1
    local.get $5
    local.get $1
    i32.const 2
    i32.sub
    call $~lib/internal/typedarray/TypedArray<u32>#__get
    local.tee $2
    i32.const 17
    i32.rotr
    local.get $2
    i32.const 19
    i32.rotr
    i32.xor
    local.get $2
    i32.const 10
    i32.shr_u
    i32.xor
    local.get $5
    local.get $1
    i32.const 7
    i32.sub
    call $~lib/internal/typedarray/TypedArray<u32>#__get
    i32.add
    local.get $5
    local.get $1
    i32.const 15
    i32.sub
    call $~lib/internal/typedarray/TypedArray<u32>#__get
    local.tee $2
    i32.const 7
    i32.rotr
    local.get $2
    i32.const 18
    i32.rotr
    i32.xor
    local.get $2
    i32.const 3
    i32.shr_u
    i32.xor
    i32.add
    local.get $5
    local.get $1
    i32.const 16
    i32.sub
    call $~lib/internal/typedarray/TypedArray<u32>#__get
    i32.add
    call $~lib/internal/typedarray/TypedArray<u32>#__set
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $repeat|1
   end
  end
  local.get $0
  i32.load offset=24
  i32.const 0
  call $~lib/array/Array<u32>#__get
  local.set $3
  local.get $0
  i32.load offset=24
  i32.const 1
  call $~lib/array/Array<u32>#__get
  local.set $2
  local.get $0
  i32.load offset=24
  i32.const 2
  call $~lib/array/Array<u32>#__get
  local.set $6
  local.get $0
  i32.load offset=24
  i32.const 3
  call $~lib/array/Array<u32>#__get
  local.set $9
  local.get $0
  i32.load offset=24
  i32.const 4
  call $~lib/array/Array<u32>#__get
  local.set $4
  local.get $0
  i32.load offset=24
  i32.const 5
  call $~lib/array/Array<u32>#__get
  local.set $7
  local.get $0
  i32.load offset=24
  i32.const 6
  call $~lib/array/Array<u32>#__get
  local.set $8
  local.get $0
  i32.load offset=24
  i32.const 7
  call $~lib/array/Array<u32>#__get
  local.set $10
  i32.const 0
  local.set $1
  loop $repeat|2
   local.get $1
   i32.const 64
   i32.lt_u
   if
    local.get $0
    i32.load offset=28
    local.get $1
    call $~lib/array/Array<u32>#__get
    local.get $10
    local.get $4
    i32.const 6
    i32.rotr
    local.get $4
    i32.const 11
    i32.rotr
    i32.xor
    local.get $4
    i32.const 25
    i32.rotr
    i32.xor
    i32.add
    local.get $4
    local.get $7
    i32.and
    local.get $4
    i32.const -1
    i32.xor
    local.get $8
    i32.and
    i32.xor
    i32.add
    i32.add
    local.get $5
    local.get $1
    call $~lib/internal/typedarray/TypedArray<u32>#__get
    i32.add
    local.set $11
    local.get $3
    i32.const 2
    i32.rotr
    local.get $3
    i32.const 13
    i32.rotr
    i32.xor
    local.get $3
    i32.const 22
    i32.rotr
    i32.xor
    local.get $2
    local.get $6
    i32.and
    local.get $2
    local.get $3
    i32.and
    local.get $3
    local.get $6
    i32.and
    i32.xor
    i32.xor
    i32.add
    local.set $12
    local.get $8
    local.set $10
    local.get $7
    local.set $8
    local.get $4
    local.set $7
    local.get $9
    local.get $11
    i32.add
    local.set $4
    local.get $6
    local.set $9
    local.get $2
    local.set $6
    local.get $3
    local.set $2
    local.get $11
    local.get $12
    i32.add
    local.set $3
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $repeat|2
   end
  end
  local.get $0
  i32.load offset=24
  i32.const 0
  local.get $0
  i32.load offset=24
  i32.const 0
  call $~lib/array/Array<u32>#__get
  local.get $3
  i32.add
  call $~lib/array/Array<u32>#__set
  local.get $0
  i32.load offset=24
  i32.const 1
  local.get $0
  i32.load offset=24
  i32.const 1
  call $~lib/array/Array<u32>#__get
  local.get $2
  i32.add
  call $~lib/array/Array<u32>#__set
  local.get $0
  i32.load offset=24
  i32.const 2
  local.get $0
  i32.load offset=24
  i32.const 2
  call $~lib/array/Array<u32>#__get
  local.get $6
  i32.add
  call $~lib/array/Array<u32>#__set
  local.get $0
  i32.load offset=24
  i32.const 3
  local.get $0
  i32.load offset=24
  i32.const 3
  call $~lib/array/Array<u32>#__get
  local.get $9
  i32.add
  call $~lib/array/Array<u32>#__set
  local.get $0
  i32.load offset=24
  i32.const 4
  local.get $0
  i32.load offset=24
  i32.const 4
  call $~lib/array/Array<u32>#__get
  local.get $4
  i32.add
  call $~lib/array/Array<u32>#__set
  local.get $0
  i32.load offset=24
  i32.const 5
  local.get $0
  i32.load offset=24
  i32.const 5
  call $~lib/array/Array<u32>#__get
  local.get $7
  i32.add
  call $~lib/array/Array<u32>#__set
  local.get $0
  i32.load offset=24
  i32.const 6
  local.get $0
  i32.load offset=24
  i32.const 6
  call $~lib/array/Array<u32>#__get
  local.get $8
  i32.add
  call $~lib/array/Array<u32>#__set
  local.get $0
  i32.load offset=24
  i32.const 7
  local.get $0
  i32.load offset=24
  i32.const 7
  call $~lib/array/Array<u32>#__get
  local.get $10
  i32.add
  call $~lib/array/Array<u32>#__set
 )
 (func $assembly/index/jsSHA256#sha256_update (; 23 ;) (type $FUNCSIG$viii) (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  block $break|0
   loop $repeat|0
    local.get $3
    local.get $2
    i32.ge_u
    br_if $break|0
    local.get $0
    i32.load offset=16
    local.get $0
    i32.load
    local.get $1
    local.get $3
    call $~lib/internal/typedarray/TypedArray<u8>#__get
    call $~lib/array/Array<u8>#__set
    local.get $0
    local.get $0
    i32.load
    i32.const 1
    i32.add
    i32.store
    local.get $0
    i32.load
    i32.const 64
    i32.eq
    if
     local.get $0
     call $assembly/index/jsSHA256#sha256_transform
     local.get $0
     local.get $0
     i64.load offset=8
     i64.const 512
     i64.add
     i64.store offset=8
     local.get $0
     i32.const 0
     i32.store
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
 )
 (func $~lib/internal/typedarray/TypedArray<u8>#__set (; 24 ;) (type $FUNCSIG$viii) (param $0 i32) (param $1 i32) (param $2 i32)
  local.get $1
  local.get $0
  i32.load offset=8
  i32.ge_u
  if
   i32.const 0
   i32.const 104
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
 (func $assembly/index/jsSHA256#sha256_final (; 25 ;) (type $FUNCSIG$vi) (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  local.get $0
  i32.load
  local.set $2
  local.get $0
  i32.load
  i32.const 56
  i32.lt_u
  if
   local.get $0
   i32.load offset=16
   block (result i32)
    local.get $2
    i32.const 1
    i32.add
    local.set $1
    local.get $2
   end
   i32.const 128
   call $~lib/array/Array<u8>#__set
   loop $continue|0
    local.get $1
    i32.const 56
    i32.lt_u
    if
     local.get $0
     i32.load offset=16
     block (result i32)
      local.get $1
      local.tee $2
      i32.const 1
      i32.add
      local.set $1
      local.get $2
     end
     i32.const 0
     call $~lib/array/Array<u8>#__set
     br $continue|0
    end
   end
  else   
   local.get $0
   i32.load offset=16
   block (result i32)
    local.get $2
    i32.const 1
    i32.add
    local.set $1
    local.get $2
   end
   i32.const 128
   call $~lib/array/Array<u8>#__set
   loop $continue|1
    local.get $1
    i32.const 64
    i32.lt_u
    if
     local.get $0
     i32.load offset=16
     block (result i32)
      local.get $1
      local.tee $2
      i32.const 1
      i32.add
      local.set $1
      local.get $2
     end
     i32.const 0
     call $~lib/array/Array<u8>#__set
     br $continue|1
    end
   end
   local.get $0
   call $assembly/index/jsSHA256#sha256_transform
   i32.const 0
   local.set $1
   loop $repeat|2
    block $break|2
     local.get $1
     i32.const 56
     i32.ge_s
     br_if $break|2
     local.get $0
     i32.load offset=16
     local.get $1
     i32.const 0
     call $~lib/array/Array<u8>#__set
     local.get $1
     i32.const 1
     i32.add
     local.set $1
     br $repeat|2
    end
   end
  end
  local.get $0
  local.get $0
  i64.load offset=8
  local.get $0
  i32.load
  i32.const 3
  i32.shl
  i64.extend_i32_u
  i64.add
  i64.store offset=8
  local.get $0
  i32.load offset=16
  i32.const 63
  local.get $0
  i64.load offset=8
  i32.wrap_i64
  call $~lib/array/Array<u8>#__set
  local.get $0
  i32.load offset=16
  i32.const 62
  local.get $0
  i64.load offset=8
  i64.const 8
  i64.shr_u
  i32.wrap_i64
  call $~lib/array/Array<u8>#__set
  local.get $0
  i32.load offset=16
  i32.const 61
  local.get $0
  i64.load offset=8
  i64.const 16
  i64.shr_u
  i32.wrap_i64
  call $~lib/array/Array<u8>#__set
  local.get $0
  i32.load offset=16
  i32.const 60
  local.get $0
  i64.load offset=8
  i64.const 24
  i64.shr_u
  i32.wrap_i64
  call $~lib/array/Array<u8>#__set
  local.get $0
  i32.load offset=16
  i32.const 59
  local.get $0
  i64.load offset=8
  i64.const 32
  i64.shr_u
  i32.wrap_i64
  call $~lib/array/Array<u8>#__set
  local.get $0
  i32.load offset=16
  i32.const 58
  local.get $0
  i64.load offset=8
  i64.const 40
  i64.shr_u
  i32.wrap_i64
  call $~lib/array/Array<u8>#__set
  local.get $0
  i32.load offset=16
  i32.const 57
  local.get $0
  i64.load offset=8
  i64.const 48
  i64.shr_u
  i32.wrap_i64
  call $~lib/array/Array<u8>#__set
  local.get $0
  i32.load offset=16
  i32.const 56
  local.get $0
  i64.load offset=8
  i64.const 56
  i64.shr_u
  i32.wrap_i64
  call $~lib/array/Array<u8>#__set
  local.get $0
  call $assembly/index/jsSHA256#sha256_transform
  i32.const 0
  local.set $1
  loop $repeat|3
   block $break|3
    local.get $1
    i32.const 4
    i32.ge_u
    br_if $break|3
    local.get $0
    i32.load offset=20
    local.get $1
    local.get $0
    i32.load offset=24
    i32.const 0
    call $~lib/array/Array<u32>#__get
    i32.const 24
    local.get $1
    i32.const 3
    i32.shl
    i32.sub
    i32.shr_u
    i32.const 255
    i32.and
    call $~lib/internal/typedarray/TypedArray<u8>#__set
    local.get $0
    i32.load offset=20
    local.get $1
    i32.const 4
    i32.add
    local.get $0
    i32.load offset=24
    i32.const 1
    call $~lib/array/Array<u32>#__get
    i32.const 24
    local.get $1
    i32.const 3
    i32.shl
    i32.sub
    i32.shr_u
    i32.const 255
    i32.and
    call $~lib/internal/typedarray/TypedArray<u8>#__set
    local.get $0
    i32.load offset=20
    local.get $1
    i32.const 8
    i32.add
    local.get $0
    i32.load offset=24
    i32.const 2
    call $~lib/array/Array<u32>#__get
    i32.const 24
    local.get $1
    i32.const 3
    i32.shl
    i32.sub
    i32.shr_u
    i32.const 255
    i32.and
    call $~lib/internal/typedarray/TypedArray<u8>#__set
    local.get $0
    i32.load offset=20
    local.get $1
    i32.const 12
    i32.add
    local.get $0
    i32.load offset=24
    i32.const 3
    call $~lib/array/Array<u32>#__get
    i32.const 24
    local.get $1
    i32.const 3
    i32.shl
    i32.sub
    i32.shr_u
    i32.const 255
    i32.and
    call $~lib/internal/typedarray/TypedArray<u8>#__set
    local.get $0
    i32.load offset=20
    local.get $1
    i32.const 16
    i32.add
    local.get $0
    i32.load offset=24
    i32.const 4
    call $~lib/array/Array<u32>#__get
    i32.const 24
    local.get $1
    i32.const 3
    i32.shl
    i32.sub
    i32.shr_u
    i32.const 255
    i32.and
    call $~lib/internal/typedarray/TypedArray<u8>#__set
    local.get $0
    i32.load offset=20
    local.get $1
    i32.const 20
    i32.add
    local.get $0
    i32.load offset=24
    i32.const 5
    call $~lib/array/Array<u32>#__get
    i32.const 24
    local.get $1
    i32.const 3
    i32.shl
    i32.sub
    i32.shr_u
    i32.const 255
    i32.and
    call $~lib/internal/typedarray/TypedArray<u8>#__set
    local.get $0
    i32.load offset=20
    local.get $1
    i32.const 24
    i32.add
    local.get $0
    i32.load offset=24
    i32.const 6
    call $~lib/array/Array<u32>#__get
    i32.const 24
    local.get $1
    i32.const 3
    i32.shl
    i32.sub
    i32.shr_u
    i32.const 255
    i32.and
    call $~lib/internal/typedarray/TypedArray<u8>#__set
    local.get $0
    i32.load offset=20
    local.get $1
    i32.const 28
    i32.add
    local.get $0
    i32.load offset=24
    i32.const 7
    call $~lib/array/Array<u32>#__get
    i32.const 24
    local.get $1
    i32.const 3
    i32.shl
    i32.sub
    i32.shr_u
    i32.const 255
    i32.and
    call $~lib/internal/typedarray/TypedArray<u8>#__set
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $repeat|3
   end
  end
 )
 (func $assembly/index/jsSHA256#digest (; 26 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  local.get $0
  i32.load offset=20
 )
 (func $~lib/internal/memory/memcmp (; 27 ;) (type $FUNCSIG$iiii) (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
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
 (func $~lib/memory/memory.compare (; 28 ;) (type $FUNCSIG$iiii) (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  local.get $0
  local.get $1
  local.get $2
  call $~lib/internal/memory/memcmp
 )
 (func $~lib/memory/memory.free (; 29 ;) (type $FUNCSIG$vi) (param $0 i32)
  nop
 )
 (func $~lib/memory/memory.reset (; 30 ;) (type $FUNCSIG$v)
  global.get $~lib/allocator/arena/startOffset
  global.set $~lib/allocator/arena/offset
 )
 (func $start (; 31 ;) (type $FUNCSIG$v)
  i32.const 688
  global.set $~lib/allocator/arena/startOffset
  global.get $~lib/allocator/arena/startOffset
  global.set $~lib/allocator/arena/offset
 )
 (func $null (; 32 ;) (type $FUNCSIG$v)
  nop
 )
)
