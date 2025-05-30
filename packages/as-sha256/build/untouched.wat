(module
 (type $0 (func (param i32) (result i32)))
 (type $1 (func (param i32 i32)))
 (type $2 (func))
 (type $3 (func (param i32)))
 (type $4 (func (param i32 i32) (result i32)))
 (type $5 (func (param i32 i32 i32)))
 (type $6 (func (param i32 i32 i32 i32)))
 (type $7 (func (param i32 i32 i64) (result i32)))
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
 (global $assembly/utils/const/K i32 (i32.const 320))
 (global $assembly/utils/const/W64 i32 (i32.const 656))
 (global $assembly/common/PARALLEL_FACTOR i32 (i32.const 4))
 (global $assembly/common/DIGEST_LENGTH i32 (i32.const 32))
 (global $assembly/common/INPUT_LENGTH i32 (i32.const 512))
 (global $assembly/common/kPtr (mut i32) (i32.const 0))
 (global $assembly/common/w64Ptr (mut i32) (i32.const 0))
 (global $assembly/common/H0 (mut i32) (i32.const 0))
 (global $assembly/common/H1 (mut i32) (i32.const 0))
 (global $assembly/common/H2 (mut i32) (i32.const 0))
 (global $assembly/common/H3 (mut i32) (i32.const 0))
 (global $assembly/common/H4 (mut i32) (i32.const 0))
 (global $assembly/common/H5 (mut i32) (i32.const 0))
 (global $assembly/common/H6 (mut i32) (i32.const 0))
 (global $assembly/common/H7 (mut i32) (i32.const 0))
 (global $assembly/common/a (mut i32) (i32.const 0))
 (global $assembly/common/b (mut i32) (i32.const 0))
 (global $assembly/common/c (mut i32) (i32.const 0))
 (global $assembly/common/d (mut i32) (i32.const 0))
 (global $assembly/common/e (mut i32) (i32.const 0))
 (global $assembly/common/f (mut i32) (i32.const 0))
 (global $assembly/common/g (mut i32) (i32.const 0))
 (global $assembly/common/h (mut i32) (i32.const 0))
 (global $assembly/common/i (mut i32) (i32.const 0))
 (global $assembly/common/t1 (mut i32) (i32.const 0))
 (global $assembly/common/t2 (mut i32) (i32.const 0))
 (global $~lib/shared/runtime/Runtime.Stub i32 (i32.const 0))
 (global $~lib/shared/runtime/Runtime.Minimal i32 (i32.const 1))
 (global $~lib/shared/runtime/Runtime.Incremental i32 (i32.const 2))
 (global $~lib/rt/tlsf/ROOT (mut i32) (i32.const 0))
 (global $~lib/native/ASC_LOW_MEMORY_LIMIT i32 (i32.const 0))
 (global $~lib/rt/tcms/fromSpace (mut i32) (i32.const 0))
 (global $~lib/rt/tcms/white (mut i32) (i32.const 0))
 (global $~lib/rt/tcms/total (mut i32) (i32.const 0))
 (global $~lib/native/ASC_RUNTIME i32 (i32.const 1))
 (global $assembly/common/M (mut i32) (i32.const 0))
 (global $assembly/common/mPtr (mut i32) (i32.const 0))
 (global $assembly/common/W (mut i32) (i32.const 0))
 (global $assembly/common/wPtr (mut i32) (i32.const 0))
 (global $assembly/common/input (mut i32) (i32.const 0))
 (global $assembly/common/inputPtr (mut i32) (i32.const 0))
 (global $assembly/common/output (mut i32) (i32.const 0))
 (global $assembly/common/outputPtr (mut i32) (i32.const 0))
 (global $assembly/common/mLength (mut i32) (i32.const 0))
 (global $assembly/common/bytesHashed (mut i32) (i32.const 0))
 (global $assembly/index/HAS_SIMD i32 (i32.const 0))
 (global $~lib/memory/__heap_base i32 (i32.const 1012))
 (memory $0 1)
 (data $0 (i32.const 12) "\1c\01\00\00\00\00\00\00\00\00\00\00\01\00\00\00\00\01\00\00\98/\8aB\91D7q\cf\fb\c0\b5\a5\db\b5\e9[\c2V9\f1\11\f1Y\a4\82?\92\d5^\1c\ab\98\aa\07\d8\01[\83\12\be\851$\c3}\0cUt]\ber\fe\b1\de\80\a7\06\dc\9bt\f1\9b\c1\c1i\9b\e4\86G\be\ef\c6\9d\c1\0f\cc\a1\0c$o,\e9-\aa\84tJ\dc\a9\b0\\\da\88\f9vRQ>\98m\c61\a8\c8\'\03\b0\c7\7fY\bf\f3\0b\e0\c6G\91\a7\d5Qc\ca\06g))\14\85\n\b7\'8!\1b.\fcm,M\13\r8STs\ne\bb\njv.\c9\c2\81\85,r\92\a1\e8\bf\a2Kf\1a\a8p\8bK\c2\a3Ql\c7\19\e8\92\d1$\06\99\d6\855\0e\f4p\a0j\10\16\c1\a4\19\08l7\1eLwH\'\b5\bc\b04\b3\0c\1c9J\aa\d8NO\ca\9c[\f3o.h\ee\82\8ftoc\a5x\14x\c8\84\08\02\c7\8c\fa\ff\be\90\eblP\a4\f7\a3\f9\be\f2xq\c6\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $1 (i32.const 300) ",\00\00\00\00\00\00\00\00\00\00\00\04\00\00\00\10\00\00\00 \00\00\00 \00\00\00\00\01\00\00@\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $2 (i32.const 348) "\1c\01\00\00\00\00\00\00\00\00\00\00\01\00\00\00\00\01\00\00\98/\8a\c2\91D7q\cf\fb\c0\b5\a5\db\b5\e9[\c2V9\f1\11\f1Y\a4\82?\92\d5^\1c\ab\98\aa\07\d8\01[\83\12\be\851$\c3}\0cUt]\ber\fe\b1\de\80\a7\06\dc\9bt\f3\9b\c1\c1i\9bd\86G\fe\f0\c6\ed\e1\0fT\f2\0c$o4\e9O\be\84\c9l\1eA\b9a\fa\88\f9\16RQ\c6\f2mZ\8e\a8e\fc\19\b0\c7\9e\d9\b9\c31\12\9a\a0\ea\0e\e7+#\b1\fd\b0>5\c7\d5\bai0_m\97\cb\8f\11\0fZ\fd\ee\1e\dc\89\b65\n\04z\0b\de\9d\ca\f4X\16[]\e1\86>\7f\00\80\89\0872\ea\07\a57\95\abo\10a@\17\f1\d6\8c\rm;\aa\cd7\be\bb\c0\da;a\83c\a3H\db1\e9\02\0b\a7\\\d1o\ca\fa\1aR1\8431\95\1a\d4n\90xCm\f2\91\9c\c3\bd\ab\cc\9e\e6\a0\c9\b5<\b6/S\c6A\c7\d2\a3~#\07hK\95\a4v\1d\19L\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $3 (i32.const 636) ",\00\00\00\00\00\00\00\00\00\00\00\04\00\00\00\10\00\00\00p\01\00\00p\01\00\00\00\01\00\00@\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $4 (i32.const 684) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\1c\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00l\00e\00n\00g\00t\00h\00")
 (data $5 (i32.const 732) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00&\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00b\00u\00f\00f\00e\00r\00.\00t\00s\00\00\00\00\00\00\00")
 (data $6 (i32.const 796) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00(\00\00\00A\00l\00l\00o\00c\00a\00t\00i\00o\00n\00 \00t\00o\00o\00 \00l\00a\00r\00g\00e\00\00\00\00\00")
 (data $7 (i32.const 860) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\1e\00\00\00~\00l\00i\00b\00/\00r\00t\00/\00t\00c\00m\00s\00.\00t\00s\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $8 (i32.const 924) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\1e\00\00\00~\00l\00i\00b\00/\00r\00t\00/\00t\00l\00s\00f\00.\00t\00s\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $9 (i32.const 992) "\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (table $0 1 1 funcref)
 (elem $0 (i32.const 1))
 (export "HAS_SIMD" (global $assembly/index/HAS_SIMD))
 (export "batchHash4UintArray64s" (func $assembly/index/batchHash4UintArray64s))
 (export "batchHash4HashObjectInputs" (func $assembly/index/batchHash4HashObjectInputs))
 (export "INPUT_LENGTH" (global $assembly/common/INPUT_LENGTH))
 (export "PARALLEL_FACTOR" (global $assembly/common/PARALLEL_FACTOR))
 (export "input" (global $assembly/common/input))
 (export "output" (global $assembly/common/output))
 (export "init" (func $assembly/common/init))
 (export "update" (func $assembly/common/update))
 (export "final" (func $assembly/common/final))
 (export "digest" (func $assembly/common/digest))
 (export "digest64" (func $assembly/common/digest64))
 (export "memory" (memory $0))
 (start $~start)
 (func $~lib/array/Array<u32>#get:dataStart (param $0 i32) (result i32)
  local.get $0
  i32.load offset=4
 )
 (func $~lib/rt/tlsf/Root#set:flMap (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store
 )
 (func $~lib/rt/common/BLOCK#get:mmInfo (param $0 i32) (result i32)
  local.get $0
  i32.load
 )
 (func $~lib/rt/common/BLOCK#set:mmInfo (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store
 )
 (func $~lib/rt/tlsf/Block#set:prev (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=4
 )
 (func $~lib/rt/tlsf/Block#set:next (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=8
 )
 (func $~lib/rt/tlsf/Block#get:prev (param $0 i32) (result i32)
  local.get $0
  i32.load offset=4
 )
 (func $~lib/rt/tlsf/Block#get:next (param $0 i32) (result i32)
  local.get $0
  i32.load offset=8
 )
 (func $~lib/rt/tlsf/Root#get:flMap (param $0 i32) (result i32)
  local.get $0
  i32.load
 )
 (func $~lib/rt/tlsf/removeBlock (param $0 i32) (param $1 i32)
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
  local.get $1
  call $~lib/rt/common/BLOCK#get:mmInfo
  local.set $2
  i32.const 1
  drop
  local.get $2
  i32.const 1
  i32.and
  i32.eqz
  if
   i32.const 0
   i32.const 944
   i32.const 268
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $2
  i32.const 3
  i32.const -1
  i32.xor
  i32.and
  local.set $3
  i32.const 1
  drop
  local.get $3
  i32.const 12
  i32.ge_u
  i32.eqz
  if
   i32.const 0
   i32.const 944
   i32.const 270
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $3
  i32.const 256
  i32.lt_u
  if
   i32.const 0
   local.set $4
   local.get $3
   i32.const 4
   i32.shr_u
   local.set $5
  else
   local.get $3
   local.tee $6
   i32.const 1073741820
   local.tee $7
   local.get $6
   local.get $7
   i32.lt_u
   select
   local.set $8
   i32.const 31
   local.get $8
   i32.clz
   i32.sub
   local.set $4
   local.get $8
   local.get $4
   i32.const 4
   i32.sub
   i32.shr_u
   i32.const 1
   i32.const 4
   i32.shl
   i32.xor
   local.set $5
   local.get $4
   i32.const 8
   i32.const 1
   i32.sub
   i32.sub
   local.set $4
  end
  i32.const 1
  drop
  local.get $4
  i32.const 23
  i32.lt_u
  if (result i32)
   local.get $5
   i32.const 16
   i32.lt_u
  else
   i32.const 0
  end
  i32.eqz
  if
   i32.const 0
   i32.const 944
   i32.const 284
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  call $~lib/rt/tlsf/Block#get:prev
  local.set $9
  local.get $1
  call $~lib/rt/tlsf/Block#get:next
  local.set $10
  local.get $9
  if
   local.get $9
   local.get $10
   call $~lib/rt/tlsf/Block#set:next
  end
  local.get $10
  if
   local.get $10
   local.get $9
   call $~lib/rt/tlsf/Block#set:prev
  end
  local.get $1
  block $~lib/rt/tlsf/GETHEAD|inlined.0 (result i32)
   local.get $0
   local.set $11
   local.get $4
   local.set $12
   local.get $5
   local.set $13
   local.get $11
   local.get $12
   i32.const 4
   i32.shl
   local.get $13
   i32.add
   i32.const 2
   i32.shl
   i32.add
   i32.load offset=96
   br $~lib/rt/tlsf/GETHEAD|inlined.0
  end
  i32.eq
  if
   local.get $0
   local.set $14
   local.get $4
   local.set $15
   local.get $5
   local.set $16
   local.get $10
   local.set $17
   local.get $14
   local.get $15
   i32.const 4
   i32.shl
   local.get $16
   i32.add
   i32.const 2
   i32.shl
   i32.add
   local.get $17
   i32.store offset=96
   local.get $10
   i32.eqz
   if
    block $~lib/rt/tlsf/GETSL|inlined.0 (result i32)
     local.get $0
     local.set $18
     local.get $4
     local.set $19
     local.get $18
     local.get $19
     i32.const 2
     i32.shl
     i32.add
     i32.load offset=4
     br $~lib/rt/tlsf/GETSL|inlined.0
    end
    local.set $20
    local.get $0
    local.set $21
    local.get $4
    local.set $22
    local.get $20
    i32.const 1
    local.get $5
    i32.shl
    i32.const -1
    i32.xor
    i32.and
    local.tee $20
    local.set $23
    local.get $21
    local.get $22
    i32.const 2
    i32.shl
    i32.add
    local.get $23
    i32.store offset=4
    local.get $20
    i32.eqz
    if
     local.get $0
     local.get $0
     call $~lib/rt/tlsf/Root#get:flMap
     i32.const 1
     local.get $4
     i32.shl
     i32.const -1
     i32.xor
     i32.and
     call $~lib/rt/tlsf/Root#set:flMap
    end
   end
  end
 )
 (func $~lib/rt/tlsf/insertBlock (param $0 i32) (param $1 i32)
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
  i32.const 1
  drop
  local.get $1
  i32.eqz
  if
   i32.const 0
   i32.const 944
   i32.const 201
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  call $~lib/rt/common/BLOCK#get:mmInfo
  local.set $2
  i32.const 1
  drop
  local.get $2
  i32.const 1
  i32.and
  i32.eqz
  if
   i32.const 0
   i32.const 944
   i32.const 203
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  block $~lib/rt/tlsf/GETRIGHT|inlined.0 (result i32)
   local.get $1
   local.set $3
   local.get $3
   i32.const 4
   i32.add
   local.get $3
   call $~lib/rt/common/BLOCK#get:mmInfo
   i32.const 3
   i32.const -1
   i32.xor
   i32.and
   i32.add
   br $~lib/rt/tlsf/GETRIGHT|inlined.0
  end
  local.set $4
  local.get $4
  call $~lib/rt/common/BLOCK#get:mmInfo
  local.set $5
  local.get $5
  i32.const 1
  i32.and
  if
   local.get $0
   local.get $4
   call $~lib/rt/tlsf/removeBlock
   local.get $1
   local.get $2
   i32.const 4
   i32.add
   local.get $5
   i32.const 3
   i32.const -1
   i32.xor
   i32.and
   i32.add
   local.tee $2
   call $~lib/rt/common/BLOCK#set:mmInfo
   block $~lib/rt/tlsf/GETRIGHT|inlined.1 (result i32)
    local.get $1
    local.set $6
    local.get $6
    i32.const 4
    i32.add
    local.get $6
    call $~lib/rt/common/BLOCK#get:mmInfo
    i32.const 3
    i32.const -1
    i32.xor
    i32.and
    i32.add
    br $~lib/rt/tlsf/GETRIGHT|inlined.1
   end
   local.set $4
   local.get $4
   call $~lib/rt/common/BLOCK#get:mmInfo
   local.set $5
  end
  local.get $2
  i32.const 2
  i32.and
  if
   block $~lib/rt/tlsf/GETFREELEFT|inlined.0 (result i32)
    local.get $1
    local.set $7
    local.get $7
    i32.const 4
    i32.sub
    i32.load
    br $~lib/rt/tlsf/GETFREELEFT|inlined.0
   end
   local.set $8
   local.get $8
   call $~lib/rt/common/BLOCK#get:mmInfo
   local.set $9
   i32.const 1
   drop
   local.get $9
   i32.const 1
   i32.and
   i32.eqz
   if
    i32.const 0
    i32.const 944
    i32.const 221
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
   local.get $0
   local.get $8
   call $~lib/rt/tlsf/removeBlock
   local.get $8
   local.set $1
   local.get $1
   local.get $9
   i32.const 4
   i32.add
   local.get $2
   i32.const 3
   i32.const -1
   i32.xor
   i32.and
   i32.add
   local.tee $2
   call $~lib/rt/common/BLOCK#set:mmInfo
  end
  local.get $4
  local.get $5
  i32.const 2
  i32.or
  call $~lib/rt/common/BLOCK#set:mmInfo
  local.get $2
  i32.const 3
  i32.const -1
  i32.xor
  i32.and
  local.set $10
  i32.const 1
  drop
  local.get $10
  i32.const 12
  i32.ge_u
  i32.eqz
  if
   i32.const 0
   i32.const 944
   i32.const 233
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  i32.const 1
  drop
  local.get $1
  i32.const 4
  i32.add
  local.get $10
  i32.add
  local.get $4
  i32.eq
  i32.eqz
  if
   i32.const 0
   i32.const 944
   i32.const 234
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $4
  i32.const 4
  i32.sub
  local.get $1
  i32.store
  local.get $10
  i32.const 256
  i32.lt_u
  if
   i32.const 0
   local.set $11
   local.get $10
   i32.const 4
   i32.shr_u
   local.set $12
  else
   local.get $10
   local.tee $13
   i32.const 1073741820
   local.tee $14
   local.get $13
   local.get $14
   i32.lt_u
   select
   local.set $15
   i32.const 31
   local.get $15
   i32.clz
   i32.sub
   local.set $11
   local.get $15
   local.get $11
   i32.const 4
   i32.sub
   i32.shr_u
   i32.const 1
   i32.const 4
   i32.shl
   i32.xor
   local.set $12
   local.get $11
   i32.const 8
   i32.const 1
   i32.sub
   i32.sub
   local.set $11
  end
  i32.const 1
  drop
  local.get $11
  i32.const 23
  i32.lt_u
  if (result i32)
   local.get $12
   i32.const 16
   i32.lt_u
  else
   i32.const 0
  end
  i32.eqz
  if
   i32.const 0
   i32.const 944
   i32.const 251
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  block $~lib/rt/tlsf/GETHEAD|inlined.1 (result i32)
   local.get $0
   local.set $16
   local.get $11
   local.set $17
   local.get $12
   local.set $18
   local.get $16
   local.get $17
   i32.const 4
   i32.shl
   local.get $18
   i32.add
   i32.const 2
   i32.shl
   i32.add
   i32.load offset=96
   br $~lib/rt/tlsf/GETHEAD|inlined.1
  end
  local.set $19
  local.get $1
  i32.const 0
  call $~lib/rt/tlsf/Block#set:prev
  local.get $1
  local.get $19
  call $~lib/rt/tlsf/Block#set:next
  local.get $19
  if
   local.get $19
   local.get $1
   call $~lib/rt/tlsf/Block#set:prev
  end
  local.get $0
  local.set $20
  local.get $11
  local.set $21
  local.get $12
  local.set $22
  local.get $1
  local.set $23
  local.get $20
  local.get $21
  i32.const 4
  i32.shl
  local.get $22
  i32.add
  i32.const 2
  i32.shl
  i32.add
  local.get $23
  i32.store offset=96
  local.get $0
  local.get $0
  call $~lib/rt/tlsf/Root#get:flMap
  i32.const 1
  local.get $11
  i32.shl
  i32.or
  call $~lib/rt/tlsf/Root#set:flMap
  local.get $0
  local.set $26
  local.get $11
  local.set $27
  block $~lib/rt/tlsf/GETSL|inlined.1 (result i32)
   local.get $0
   local.set $24
   local.get $11
   local.set $25
   local.get $24
   local.get $25
   i32.const 2
   i32.shl
   i32.add
   i32.load offset=4
   br $~lib/rt/tlsf/GETSL|inlined.1
  end
  i32.const 1
  local.get $12
  i32.shl
  i32.or
  local.set $28
  local.get $26
  local.get $27
  i32.const 2
  i32.shl
  i32.add
  local.get $28
  i32.store offset=4
 )
 (func $~lib/rt/tlsf/addMemory (param $0 i32) (param $1 i32) (param $2 i64) (result i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  local.get $2
  i32.wrap_i64
  local.set $3
  i32.const 1
  drop
  local.get $1
  i64.extend_i32_u
  local.get $2
  i64.le_u
  i32.eqz
  if
   i32.const 0
   i32.const 944
   i32.const 382
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  i32.const 4
  i32.add
  i32.const 15
  i32.add
  i32.const 15
  i32.const -1
  i32.xor
  i32.and
  i32.const 4
  i32.sub
  local.set $1
  local.get $3
  i32.const 15
  i32.const -1
  i32.xor
  i32.and
  local.set $3
  block $~lib/rt/tlsf/GETTAIL|inlined.0 (result i32)
   local.get $0
   local.set $4
   local.get $4
   i32.load offset=1568
   br $~lib/rt/tlsf/GETTAIL|inlined.0
  end
  local.set $5
  i32.const 0
  local.set $6
  local.get $5
  if
   i32.const 1
   drop
   local.get $1
   local.get $5
   i32.const 4
   i32.add
   i32.ge_u
   i32.eqz
   if
    i32.const 0
    i32.const 944
    i32.const 389
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
   local.get $1
   i32.const 16
   i32.sub
   local.get $5
   i32.eq
   if
    local.get $1
    i32.const 16
    i32.sub
    local.set $1
    local.get $5
    call $~lib/rt/common/BLOCK#get:mmInfo
    local.set $6
   else
   end
  else
   i32.const 1
   drop
   local.get $1
   local.get $0
   i32.const 1572
   i32.add
   i32.ge_u
   i32.eqz
   if
    i32.const 0
    i32.const 944
    i32.const 402
    i32.const 5
    call $~lib/builtins/abort
    unreachable
   end
  end
  local.get $3
  local.get $1
  i32.sub
  local.set $7
  local.get $7
  i32.const 4
  i32.const 12
  i32.add
  i32.const 4
  i32.add
  i32.lt_u
  if
   i32.const 0
   return
  end
  local.get $7
  i32.const 2
  i32.const 4
  i32.mul
  i32.sub
  local.set $8
  local.get $1
  local.set $9
  local.get $9
  local.get $8
  i32.const 1
  i32.or
  local.get $6
  i32.const 2
  i32.and
  i32.or
  call $~lib/rt/common/BLOCK#set:mmInfo
  local.get $9
  i32.const 0
  call $~lib/rt/tlsf/Block#set:prev
  local.get $9
  i32.const 0
  call $~lib/rt/tlsf/Block#set:next
  local.get $1
  i32.const 4
  i32.add
  local.get $8
  i32.add
  local.set $5
  local.get $5
  i32.const 0
  i32.const 2
  i32.or
  call $~lib/rt/common/BLOCK#set:mmInfo
  local.get $0
  local.set $10
  local.get $5
  local.set $11
  local.get $10
  local.get $11
  i32.store offset=1568
  local.get $0
  local.get $9
  call $~lib/rt/tlsf/insertBlock
  i32.const 1
  return
 )
 (func $~lib/rt/tlsf/initialize
  (local $0 i32)
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
  (local $13 i32)
  (local $14 i32)
  (local $15 i32)
  i32.const 0
  drop
  global.get $~lib/memory/__heap_base
  i32.const 15
  i32.add
  i32.const 15
  i32.const -1
  i32.xor
  i32.and
  local.set $0
  memory.size
  local.set $1
  local.get $0
  i32.const 1572
  i32.add
  i32.const 65535
  i32.add
  i32.const 65535
  i32.const -1
  i32.xor
  i32.and
  i32.const 16
  i32.shr_u
  local.set $2
  local.get $2
  local.get $1
  i32.gt_s
  if (result i32)
   local.get $2
   local.get $1
   i32.sub
   memory.grow
   i32.const 0
   i32.lt_s
  else
   i32.const 0
  end
  if
   unreachable
  end
  local.get $0
  local.set $3
  local.get $3
  i32.const 0
  call $~lib/rt/tlsf/Root#set:flMap
  local.get $3
  local.set $4
  i32.const 0
  local.set $5
  local.get $4
  local.get $5
  i32.store offset=1568
  i32.const 0
  local.set $6
  loop $for-loop|0
   local.get $6
   i32.const 23
   i32.lt_u
   if
    local.get $3
    local.set $7
    local.get $6
    local.set $8
    i32.const 0
    local.set $9
    local.get $7
    local.get $8
    i32.const 2
    i32.shl
    i32.add
    local.get $9
    i32.store offset=4
    i32.const 0
    local.set $10
    loop $for-loop|1
     local.get $10
     i32.const 16
     i32.lt_u
     if
      local.get $3
      local.set $11
      local.get $6
      local.set $12
      local.get $10
      local.set $13
      i32.const 0
      local.set $14
      local.get $11
      local.get $12
      i32.const 4
      i32.shl
      local.get $13
      i32.add
      i32.const 2
      i32.shl
      i32.add
      local.get $14
      i32.store offset=96
      local.get $10
      i32.const 1
      i32.add
      local.set $10
      br $for-loop|1
     end
    end
    local.get $6
    i32.const 1
    i32.add
    local.set $6
    br $for-loop|0
   end
  end
  local.get $0
  i32.const 1572
  i32.add
  local.set $15
  i32.const 0
  drop
  local.get $3
  local.get $15
  memory.size
  i64.extend_i32_s
  i64.const 16
  i64.shl
  call $~lib/rt/tlsf/addMemory
  drop
  local.get $3
  global.set $~lib/rt/tlsf/ROOT
 )
 (func $~lib/rt/tlsf/computeSize (param $0 i32) (result i32)
  local.get $0
  i32.const 12
  i32.le_u
  if (result i32)
   i32.const 12
  else
   local.get $0
   i32.const 4
   i32.add
   i32.const 15
   i32.add
   i32.const 15
   i32.const -1
   i32.xor
   i32.and
   i32.const 4
   i32.sub
  end
  return
 )
 (func $~lib/rt/tlsf/prepareSize (param $0 i32) (result i32)
  local.get $0
  i32.const 1073741820
  i32.gt_u
  if
   i32.const 816
   i32.const 944
   i32.const 461
   i32.const 29
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/rt/tlsf/computeSize
  return
 )
 (func $~lib/rt/tlsf/roundSize (param $0 i32) (result i32)
  local.get $0
  i32.const 536870910
  i32.lt_u
  if (result i32)
   local.get $0
   i32.const 1
   i32.const 27
   local.get $0
   i32.clz
   i32.sub
   i32.shl
   i32.add
   i32.const 1
   i32.sub
  else
   local.get $0
  end
  return
 )
 (func $~lib/rt/tlsf/searchBlock (param $0 i32) (param $1 i32) (result i32)
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
  (local $13 i32)
  (local $14 i32)
  (local $15 i32)
  (local $16 i32)
  (local $17 i32)
  local.get $1
  i32.const 256
  i32.lt_u
  if
   i32.const 0
   local.set $2
   local.get $1
   i32.const 4
   i32.shr_u
   local.set $3
  else
   local.get $1
   call $~lib/rt/tlsf/roundSize
   local.set $4
   i32.const 4
   i32.const 8
   i32.mul
   i32.const 1
   i32.sub
   local.get $4
   i32.clz
   i32.sub
   local.set $2
   local.get $4
   local.get $2
   i32.const 4
   i32.sub
   i32.shr_u
   i32.const 1
   i32.const 4
   i32.shl
   i32.xor
   local.set $3
   local.get $2
   i32.const 8
   i32.const 1
   i32.sub
   i32.sub
   local.set $2
  end
  i32.const 1
  drop
  local.get $2
  i32.const 23
  i32.lt_u
  if (result i32)
   local.get $3
   i32.const 16
   i32.lt_u
  else
   i32.const 0
  end
  i32.eqz
  if
   i32.const 0
   i32.const 944
   i32.const 334
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  block $~lib/rt/tlsf/GETSL|inlined.2 (result i32)
   local.get $0
   local.set $5
   local.get $2
   local.set $6
   local.get $5
   local.get $6
   i32.const 2
   i32.shl
   i32.add
   i32.load offset=4
   br $~lib/rt/tlsf/GETSL|inlined.2
  end
  i32.const 0
  i32.const -1
  i32.xor
  local.get $3
  i32.shl
  i32.and
  local.set $7
  i32.const 0
  local.set $8
  local.get $7
  i32.eqz
  if
   local.get $0
   call $~lib/rt/tlsf/Root#get:flMap
   i32.const 0
   i32.const -1
   i32.xor
   local.get $2
   i32.const 1
   i32.add
   i32.shl
   i32.and
   local.set $9
   local.get $9
   i32.eqz
   if
    i32.const 0
    local.set $8
   else
    local.get $9
    i32.ctz
    local.set $2
    block $~lib/rt/tlsf/GETSL|inlined.3 (result i32)
     local.get $0
     local.set $10
     local.get $2
     local.set $11
     local.get $10
     local.get $11
     i32.const 2
     i32.shl
     i32.add
     i32.load offset=4
     br $~lib/rt/tlsf/GETSL|inlined.3
    end
    local.set $7
    i32.const 1
    drop
    local.get $7
    i32.eqz
    if
     i32.const 0
     i32.const 944
     i32.const 347
     i32.const 18
     call $~lib/builtins/abort
     unreachable
    end
    block $~lib/rt/tlsf/GETHEAD|inlined.2 (result i32)
     local.get $0
     local.set $12
     local.get $2
     local.set $13
     local.get $7
     i32.ctz
     local.set $14
     local.get $12
     local.get $13
     i32.const 4
     i32.shl
     local.get $14
     i32.add
     i32.const 2
     i32.shl
     i32.add
     i32.load offset=96
     br $~lib/rt/tlsf/GETHEAD|inlined.2
    end
    local.set $8
   end
  else
   block $~lib/rt/tlsf/GETHEAD|inlined.3 (result i32)
    local.get $0
    local.set $15
    local.get $2
    local.set $16
    local.get $7
    i32.ctz
    local.set $17
    local.get $15
    local.get $16
    i32.const 4
    i32.shl
    local.get $17
    i32.add
    i32.const 2
    i32.shl
    i32.add
    i32.load offset=96
    br $~lib/rt/tlsf/GETHEAD|inlined.3
   end
   local.set $8
  end
  local.get $8
  return
 )
 (func $~lib/rt/tlsf/growMemory (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  i32.const 0
  drop
  local.get $1
  i32.const 256
  i32.ge_u
  if
   local.get $1
   call $~lib/rt/tlsf/roundSize
   local.set $1
  end
  memory.size
  local.set $2
  local.get $1
  i32.const 4
  local.get $2
  i32.const 16
  i32.shl
  i32.const 4
  i32.sub
  block $~lib/rt/tlsf/GETTAIL|inlined.1 (result i32)
   local.get $0
   local.set $3
   local.get $3
   i32.load offset=1568
   br $~lib/rt/tlsf/GETTAIL|inlined.1
  end
  i32.ne
  i32.shl
  i32.add
  local.set $1
  local.get $1
  i32.const 65535
  i32.add
  i32.const 65535
  i32.const -1
  i32.xor
  i32.and
  i32.const 16
  i32.shr_u
  local.set $4
  local.get $2
  local.tee $5
  local.get $4
  local.tee $6
  local.get $5
  local.get $6
  i32.gt_s
  select
  local.set $7
  local.get $7
  memory.grow
  i32.const 0
  i32.lt_s
  if
   local.get $4
   memory.grow
   i32.const 0
   i32.lt_s
   if
    unreachable
   end
  end
  memory.size
  local.set $8
  local.get $0
  local.get $2
  i32.const 16
  i32.shl
  local.get $8
  i64.extend_i32_s
  i64.const 16
  i64.shl
  call $~lib/rt/tlsf/addMemory
  drop
 )
 (func $~lib/rt/tlsf/prepareBlock (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  local.get $1
  call $~lib/rt/common/BLOCK#get:mmInfo
  local.set $3
  i32.const 1
  drop
  local.get $2
  i32.const 4
  i32.add
  i32.const 15
  i32.and
  i32.eqz
  i32.eqz
  if
   i32.const 0
   i32.const 944
   i32.const 361
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $3
  i32.const 3
  i32.const -1
  i32.xor
  i32.and
  local.get $2
  i32.sub
  local.set $4
  local.get $4
  i32.const 4
  i32.const 12
  i32.add
  i32.ge_u
  if
   local.get $1
   local.get $2
   local.get $3
   i32.const 2
   i32.and
   i32.or
   call $~lib/rt/common/BLOCK#set:mmInfo
   local.get $1
   i32.const 4
   i32.add
   local.get $2
   i32.add
   local.set $5
   local.get $5
   local.get $4
   i32.const 4
   i32.sub
   i32.const 1
   i32.or
   call $~lib/rt/common/BLOCK#set:mmInfo
   local.get $0
   local.get $5
   call $~lib/rt/tlsf/insertBlock
  else
   local.get $1
   local.get $3
   i32.const 1
   i32.const -1
   i32.xor
   i32.and
   call $~lib/rt/common/BLOCK#set:mmInfo
   block $~lib/rt/tlsf/GETRIGHT|inlined.3 (result i32)
    local.get $1
    local.set $7
    local.get $7
    i32.const 4
    i32.add
    local.get $7
    call $~lib/rt/common/BLOCK#get:mmInfo
    i32.const 3
    i32.const -1
    i32.xor
    i32.and
    i32.add
    br $~lib/rt/tlsf/GETRIGHT|inlined.3
   end
   block $~lib/rt/tlsf/GETRIGHT|inlined.2 (result i32)
    local.get $1
    local.set $6
    local.get $6
    i32.const 4
    i32.add
    local.get $6
    call $~lib/rt/common/BLOCK#get:mmInfo
    i32.const 3
    i32.const -1
    i32.xor
    i32.and
    i32.add
    br $~lib/rt/tlsf/GETRIGHT|inlined.2
   end
   call $~lib/rt/common/BLOCK#get:mmInfo
   i32.const 2
   i32.const -1
   i32.xor
   i32.and
   call $~lib/rt/common/BLOCK#set:mmInfo
  end
 )
 (func $~lib/rt/tlsf/allocateBlock (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  local.get $1
  call $~lib/rt/tlsf/prepareSize
  local.set $2
  local.get $0
  local.get $2
  call $~lib/rt/tlsf/searchBlock
  local.set $3
  local.get $3
  i32.eqz
  if
   local.get $0
   local.get $2
   call $~lib/rt/tlsf/growMemory
   local.get $0
   local.get $2
   call $~lib/rt/tlsf/searchBlock
   local.set $3
   i32.const 1
   drop
   local.get $3
   i32.eqz
   if
    i32.const 0
    i32.const 944
    i32.const 499
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
  end
  i32.const 1
  drop
  local.get $3
  call $~lib/rt/common/BLOCK#get:mmInfo
  i32.const 3
  i32.const -1
  i32.xor
  i32.and
  local.get $2
  i32.ge_u
  i32.eqz
  if
   i32.const 0
   i32.const 944
   i32.const 501
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  local.get $3
  call $~lib/rt/tlsf/removeBlock
  local.get $0
  local.get $3
  local.get $2
  call $~lib/rt/tlsf/prepareBlock
  i32.const 0
  drop
  local.get $3
  return
 )
 (func $~lib/rt/tlsf/__alloc (param $0 i32) (result i32)
  global.get $~lib/rt/tlsf/ROOT
  i32.eqz
  if
   call $~lib/rt/tlsf/initialize
  end
  global.get $~lib/rt/tlsf/ROOT
  local.get $0
  call $~lib/rt/tlsf/allocateBlock
  i32.const 4
  i32.add
  return
 )
 (func $~lib/rt/tcms/Object#set:rtId (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=12
 )
 (func $~lib/rt/tcms/Object#set:rtSize (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=16
 )
 (func $~lib/rt/tcms/Object#set:nextWithColor (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=4
 )
 (func $~lib/rt/tcms/Object#set:prev (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store offset=8
 )
 (func $~lib/rt/tcms/initLazy (param $0 i32) (result i32)
  local.get $0
  local.get $0
  call $~lib/rt/tcms/Object#set:nextWithColor
  local.get $0
  local.get $0
  call $~lib/rt/tcms/Object#set:prev
  local.get $0
  return
 )
 (func $~lib/rt/tcms/Object#get:prev (param $0 i32) (result i32)
  local.get $0
  i32.load offset=8
 )
 (func $~lib/rt/tcms/Object#get:nextWithColor (param $0 i32) (result i32)
  local.get $0
  i32.load offset=4
 )
 (func $~lib/rt/tcms/Object#set:next (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  local.get $0
  call $~lib/rt/tcms/Object#get:nextWithColor
  i32.const 3
  i32.and
  i32.or
  call $~lib/rt/tcms/Object#set:nextWithColor
 )
 (func $~lib/rt/tcms/Object#linkTo (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  local.get $1
  call $~lib/rt/tcms/Object#get:prev
  local.set $3
  local.get $0
  local.get $1
  local.get $2
  i32.or
  call $~lib/rt/tcms/Object#set:nextWithColor
  local.get $0
  local.get $3
  call $~lib/rt/tcms/Object#set:prev
  local.get $3
  local.get $0
  call $~lib/rt/tcms/Object#set:next
  local.get $1
  local.get $0
  call $~lib/rt/tcms/Object#set:prev
 )
 (func $~lib/rt/tcms/Object#get:size (param $0 i32) (result i32)
  i32.const 4
  local.get $0
  call $~lib/rt/common/BLOCK#get:mmInfo
  i32.const 3
  i32.const -1
  i32.xor
  i32.and
  i32.add
  return
 )
 (func $~lib/rt/tcms/__new (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  local.get $0
  i32.const 1073741804
  i32.gt_u
  if
   i32.const 816
   i32.const 880
   i32.const 125
   i32.const 30
   call $~lib/builtins/abort
   unreachable
  end
  i32.const 16
  local.get $0
  i32.add
  call $~lib/rt/tlsf/__alloc
  i32.const 4
  i32.sub
  local.set $2
  local.get $2
  local.get $1
  call $~lib/rt/tcms/Object#set:rtId
  local.get $2
  local.get $0
  call $~lib/rt/tcms/Object#set:rtSize
  local.get $2
  global.get $~lib/rt/tcms/fromSpace
  global.get $~lib/rt/tcms/white
  call $~lib/rt/tcms/Object#linkTo
  global.get $~lib/rt/tcms/total
  local.get $2
  call $~lib/rt/tcms/Object#get:size
  i32.add
  global.set $~lib/rt/tcms/total
  local.get $2
  i32.const 20
  i32.add
  return
 )
 (func $~lib/arraybuffer/ArrayBuffer#constructor (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  local.get $1
  i32.const 1073741820
  i32.gt_u
  if
   i32.const 704
   i32.const 752
   i32.const 52
   i32.const 43
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  i32.const 1
  call $~lib/rt/tcms/__new
  local.set $2
  i32.const 1
  global.get $~lib/shared/runtime/Runtime.Incremental
  i32.ne
  drop
  local.get $2
  i32.const 0
  local.get $1
  memory.fill
  local.get $2
  return
 )
 (func $start:assembly/common
  global.get $assembly/utils/const/K
  call $~lib/array/Array<u32>#get:dataStart
  global.set $assembly/common/kPtr
  global.get $assembly/utils/const/W64
  call $~lib/array/Array<u32>#get:dataStart
  global.set $assembly/common/w64Ptr
  i32.const 992
  call $~lib/rt/tcms/initLazy
  global.set $~lib/rt/tcms/fromSpace
  i32.const 0
  i32.const 64
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/common/M
  global.get $assembly/common/M
  global.set $assembly/common/mPtr
  i32.const 0
  i32.const 256
  global.get $assembly/common/PARALLEL_FACTOR
  i32.mul
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/common/W
  global.get $assembly/common/W
  global.set $assembly/common/wPtr
  i32.const 0
  global.get $assembly/common/INPUT_LENGTH
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/common/input
  global.get $assembly/common/input
  global.set $assembly/common/inputPtr
  i32.const 0
  global.get $assembly/common/DIGEST_LENGTH
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/common/output
  global.get $assembly/common/output
  global.set $assembly/common/outputPtr
 )
 (func $start:assembly/index
  call $start:assembly/common
 )
 (func $assembly/common/init
  i32.const 1779033703
  global.set $assembly/common/H0
  i32.const -1150833019
  global.set $assembly/common/H1
  i32.const 1013904242
  global.set $assembly/common/H2
  i32.const -1521486534
  global.set $assembly/common/H3
  i32.const 1359893119
  global.set $assembly/common/H4
  i32.const -1694144372
  global.set $assembly/common/H5
  i32.const 528734635
  global.set $assembly/common/H6
  i32.const 1541459225
  global.set $assembly/common/H7
  i32.const 0
  global.set $assembly/common/mLength
  i32.const 0
  global.set $assembly/common/bytesHashed
 )
 (func $assembly/common/hashBlocks (param $0 i32) (param $1 i32) (param $2 i32)
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
  global.get $assembly/common/H0
  global.set $assembly/common/a
  global.get $assembly/common/H1
  global.set $assembly/common/b
  global.get $assembly/common/H2
  global.set $assembly/common/c
  global.get $assembly/common/H3
  global.set $assembly/common/d
  global.get $assembly/common/H4
  global.set $assembly/common/e
  global.get $assembly/common/H5
  global.set $assembly/common/f
  global.get $assembly/common/H6
  global.set $assembly/common/g
  global.get $assembly/common/H7
  global.set $assembly/common/h
  i32.const 0
  global.set $assembly/common/i
  loop $for-loop|0
   global.get $assembly/common/i
   i32.const 16
   i32.lt_u
   if
    local.get $0
    local.set $14
    global.get $assembly/common/i
    local.set $15
    block $assembly/common/load32be|inlined.0 (result i32)
     local.get $1
     local.set $3
     global.get $assembly/common/i
     local.get $2
     i32.mul
     local.set $4
     local.get $4
     i32.const 2
     i32.shl
     local.set $5
     block $assembly/common/load8|inlined.0 (result i32)
      local.get $3
      local.set $6
      local.get $5
      i32.const 0
      i32.add
      local.set $7
      local.get $6
      local.get $7
      i32.add
      i32.load8_u
      br $assembly/common/load8|inlined.0
     end
     i32.const 255
     i32.and
     i32.const 24
     i32.shl
     block $assembly/common/load8|inlined.1 (result i32)
      local.get $3
      local.set $8
      local.get $5
      i32.const 1
      i32.add
      local.set $9
      local.get $8
      local.get $9
      i32.add
      i32.load8_u
      br $assembly/common/load8|inlined.1
     end
     i32.const 255
     i32.and
     i32.const 16
     i32.shl
     i32.or
     block $assembly/common/load8|inlined.2 (result i32)
      local.get $3
      local.set $10
      local.get $5
      i32.const 2
      i32.add
      local.set $11
      local.get $10
      local.get $11
      i32.add
      i32.load8_u
      br $assembly/common/load8|inlined.2
     end
     i32.const 255
     i32.and
     i32.const 8
     i32.shl
     i32.or
     block $assembly/common/load8|inlined.3 (result i32)
      local.get $3
      local.set $12
      local.get $5
      i32.const 3
      i32.add
      local.set $13
      local.get $12
      local.get $13
      i32.add
      i32.load8_u
      br $assembly/common/load8|inlined.3
     end
     i32.const 255
     i32.and
     i32.const 0
     i32.shl
     i32.or
     br $assembly/common/load32be|inlined.0
    end
    local.set $16
    local.get $14
    local.get $15
    i32.const 2
    i32.shl
    i32.add
    local.get $16
    i32.store
    global.get $assembly/common/i
    i32.const 1
    i32.add
    global.set $assembly/common/i
    br $for-loop|0
   end
  end
  i32.const 16
  global.set $assembly/common/i
  loop $for-loop|1
   global.get $assembly/common/i
   i32.const 64
   i32.lt_u
   if
    local.get $0
    local.set $27
    global.get $assembly/common/i
    local.set $28
    block $assembly/common/SIG1|inlined.0 (result i32)
     block $assembly/common/load32|inlined.0 (result i32)
      local.get $0
      local.set $17
      global.get $assembly/common/i
      i32.const 2
      i32.sub
      local.set $18
      local.get $17
      local.get $18
      i32.const 2
      i32.shl
      i32.add
      i32.load
      br $assembly/common/load32|inlined.0
     end
     local.set $19
     local.get $19
     i32.const 17
     i32.rotr
     local.get $19
     i32.const 19
     i32.rotr
     i32.xor
     local.get $19
     i32.const 10
     i32.shr_u
     i32.xor
     br $assembly/common/SIG1|inlined.0
    end
    block $assembly/common/load32|inlined.1 (result i32)
     local.get $0
     local.set $20
     global.get $assembly/common/i
     i32.const 7
     i32.sub
     local.set $21
     local.get $20
     local.get $21
     i32.const 2
     i32.shl
     i32.add
     i32.load
     br $assembly/common/load32|inlined.1
    end
    i32.add
    block $assembly/common/SIG0|inlined.0 (result i32)
     block $assembly/common/load32|inlined.2 (result i32)
      local.get $0
      local.set $22
      global.get $assembly/common/i
      i32.const 15
      i32.sub
      local.set $23
      local.get $22
      local.get $23
      i32.const 2
      i32.shl
      i32.add
      i32.load
      br $assembly/common/load32|inlined.2
     end
     local.set $24
     local.get $24
     i32.const 7
     i32.rotr
     local.get $24
     i32.const 18
     i32.rotr
     i32.xor
     local.get $24
     i32.const 3
     i32.shr_u
     i32.xor
     br $assembly/common/SIG0|inlined.0
    end
    i32.add
    block $assembly/common/load32|inlined.3 (result i32)
     local.get $0
     local.set $25
     global.get $assembly/common/i
     i32.const 16
     i32.sub
     local.set $26
     local.get $25
     local.get $26
     i32.const 2
     i32.shl
     i32.add
     i32.load
     br $assembly/common/load32|inlined.3
    end
    i32.add
    local.set $29
    local.get $27
    local.get $28
    i32.const 2
    i32.shl
    i32.add
    local.get $29
    i32.store
    global.get $assembly/common/i
    i32.const 1
    i32.add
    global.set $assembly/common/i
    br $for-loop|1
   end
  end
  i32.const 0
  global.set $assembly/common/i
  loop $for-loop|2
   global.get $assembly/common/i
   i32.const 64
   i32.lt_u
   if
    global.get $assembly/common/h
    block $assembly/common/EP1|inlined.0 (result i32)
     global.get $assembly/common/e
     local.set $30
     local.get $30
     i32.const 6
     i32.rotr
     local.get $30
     i32.const 11
     i32.rotr
     i32.xor
     local.get $30
     i32.const 25
     i32.rotr
     i32.xor
     br $assembly/common/EP1|inlined.0
    end
    i32.add
    block $assembly/common/CH|inlined.0 (result i32)
     global.get $assembly/common/e
     local.set $31
     global.get $assembly/common/f
     local.set $32
     global.get $assembly/common/g
     local.set $33
     local.get $31
     local.get $32
     i32.and
     local.get $31
     i32.const -1
     i32.xor
     local.get $33
     i32.and
     i32.xor
     br $assembly/common/CH|inlined.0
    end
    i32.add
    block $assembly/common/load32|inlined.4 (result i32)
     global.get $assembly/common/kPtr
     local.set $34
     global.get $assembly/common/i
     local.set $35
     local.get $34
     local.get $35
     i32.const 2
     i32.shl
     i32.add
     i32.load
     br $assembly/common/load32|inlined.4
    end
    i32.add
    block $assembly/common/load32|inlined.5 (result i32)
     local.get $0
     local.set $36
     global.get $assembly/common/i
     local.set $37
     local.get $36
     local.get $37
     i32.const 2
     i32.shl
     i32.add
     i32.load
     br $assembly/common/load32|inlined.5
    end
    i32.add
    global.set $assembly/common/t1
    block $assembly/common/EP0|inlined.0 (result i32)
     global.get $assembly/common/a
     local.set $38
     local.get $38
     i32.const 2
     i32.rotr
     local.get $38
     i32.const 13
     i32.rotr
     i32.xor
     local.get $38
     i32.const 22
     i32.rotr
     i32.xor
     br $assembly/common/EP0|inlined.0
    end
    block $assembly/common/MAJ|inlined.0 (result i32)
     global.get $assembly/common/a
     local.set $39
     global.get $assembly/common/b
     local.set $40
     global.get $assembly/common/c
     local.set $41
     local.get $39
     local.get $40
     i32.and
     local.get $39
     local.get $41
     i32.and
     i32.xor
     local.get $40
     local.get $41
     i32.and
     i32.xor
     br $assembly/common/MAJ|inlined.0
    end
    i32.add
    global.set $assembly/common/t2
    global.get $assembly/common/g
    global.set $assembly/common/h
    global.get $assembly/common/f
    global.set $assembly/common/g
    global.get $assembly/common/e
    global.set $assembly/common/f
    global.get $assembly/common/d
    global.get $assembly/common/t1
    i32.add
    global.set $assembly/common/e
    global.get $assembly/common/c
    global.set $assembly/common/d
    global.get $assembly/common/b
    global.set $assembly/common/c
    global.get $assembly/common/a
    global.set $assembly/common/b
    global.get $assembly/common/t1
    global.get $assembly/common/t2
    i32.add
    global.set $assembly/common/a
    global.get $assembly/common/i
    i32.const 1
    i32.add
    global.set $assembly/common/i
    br $for-loop|2
   end
  end
  global.get $assembly/common/H0
  global.get $assembly/common/a
  i32.add
  global.set $assembly/common/H0
  global.get $assembly/common/H1
  global.get $assembly/common/b
  i32.add
  global.set $assembly/common/H1
  global.get $assembly/common/H2
  global.get $assembly/common/c
  i32.add
  global.set $assembly/common/H2
  global.get $assembly/common/H3
  global.get $assembly/common/d
  i32.add
  global.set $assembly/common/H3
  global.get $assembly/common/H4
  global.get $assembly/common/e
  i32.add
  global.set $assembly/common/H4
  global.get $assembly/common/H5
  global.get $assembly/common/f
  i32.add
  global.set $assembly/common/H5
  global.get $assembly/common/H6
  global.get $assembly/common/g
  i32.add
  global.set $assembly/common/H6
  global.get $assembly/common/H7
  global.get $assembly/common/h
  i32.add
  global.set $assembly/common/H7
 )
 (func $assembly/common/hashPreCompW (param $0 i32)
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
  global.get $assembly/common/H0
  global.set $assembly/common/a
  global.get $assembly/common/H1
  global.set $assembly/common/b
  global.get $assembly/common/H2
  global.set $assembly/common/c
  global.get $assembly/common/H3
  global.set $assembly/common/d
  global.get $assembly/common/H4
  global.set $assembly/common/e
  global.get $assembly/common/H5
  global.set $assembly/common/f
  global.get $assembly/common/H6
  global.set $assembly/common/g
  global.get $assembly/common/H7
  global.set $assembly/common/h
  i32.const 0
  global.set $assembly/common/i
  loop $for-loop|0
   global.get $assembly/common/i
   i32.const 64
   i32.lt_u
   if
    global.get $assembly/common/h
    block $assembly/common/EP1|inlined.1 (result i32)
     global.get $assembly/common/e
     local.set $1
     local.get $1
     i32.const 6
     i32.rotr
     local.get $1
     i32.const 11
     i32.rotr
     i32.xor
     local.get $1
     i32.const 25
     i32.rotr
     i32.xor
     br $assembly/common/EP1|inlined.1
    end
    i32.add
    block $assembly/common/CH|inlined.1 (result i32)
     global.get $assembly/common/e
     local.set $2
     global.get $assembly/common/f
     local.set $3
     global.get $assembly/common/g
     local.set $4
     local.get $2
     local.get $3
     i32.and
     local.get $2
     i32.const -1
     i32.xor
     local.get $4
     i32.and
     i32.xor
     br $assembly/common/CH|inlined.1
    end
    i32.add
    block $assembly/common/load32|inlined.6 (result i32)
     local.get $0
     local.set $5
     global.get $assembly/common/i
     local.set $6
     local.get $5
     local.get $6
     i32.const 2
     i32.shl
     i32.add
     i32.load
     br $assembly/common/load32|inlined.6
    end
    i32.add
    global.set $assembly/common/t1
    block $assembly/common/EP0|inlined.1 (result i32)
     global.get $assembly/common/a
     local.set $7
     local.get $7
     i32.const 2
     i32.rotr
     local.get $7
     i32.const 13
     i32.rotr
     i32.xor
     local.get $7
     i32.const 22
     i32.rotr
     i32.xor
     br $assembly/common/EP0|inlined.1
    end
    block $assembly/common/MAJ|inlined.1 (result i32)
     global.get $assembly/common/a
     local.set $8
     global.get $assembly/common/b
     local.set $9
     global.get $assembly/common/c
     local.set $10
     local.get $8
     local.get $9
     i32.and
     local.get $8
     local.get $10
     i32.and
     i32.xor
     local.get $9
     local.get $10
     i32.and
     i32.xor
     br $assembly/common/MAJ|inlined.1
    end
    i32.add
    global.set $assembly/common/t2
    global.get $assembly/common/g
    global.set $assembly/common/h
    global.get $assembly/common/f
    global.set $assembly/common/g
    global.get $assembly/common/e
    global.set $assembly/common/f
    global.get $assembly/common/d
    global.get $assembly/common/t1
    i32.add
    global.set $assembly/common/e
    global.get $assembly/common/c
    global.set $assembly/common/d
    global.get $assembly/common/b
    global.set $assembly/common/c
    global.get $assembly/common/a
    global.set $assembly/common/b
    global.get $assembly/common/t1
    global.get $assembly/common/t2
    i32.add
    global.set $assembly/common/a
    global.get $assembly/common/i
    i32.const 1
    i32.add
    global.set $assembly/common/i
    br $for-loop|0
   end
  end
  global.get $assembly/common/H0
  global.get $assembly/common/a
  i32.add
  global.set $assembly/common/H0
  global.get $assembly/common/H1
  global.get $assembly/common/b
  i32.add
  global.set $assembly/common/H1
  global.get $assembly/common/H2
  global.get $assembly/common/c
  i32.add
  global.set $assembly/common/H2
  global.get $assembly/common/H3
  global.get $assembly/common/d
  i32.add
  global.set $assembly/common/H3
  global.get $assembly/common/H4
  global.get $assembly/common/e
  i32.add
  global.set $assembly/common/H4
  global.get $assembly/common/H5
  global.get $assembly/common/f
  i32.add
  global.set $assembly/common/H5
  global.get $assembly/common/H6
  global.get $assembly/common/g
  i32.add
  global.set $assembly/common/H6
  global.get $assembly/common/H7
  global.get $assembly/common/h
  i32.add
  global.set $assembly/common/H7
 )
 (func $~lib/polyfills/bswap<u32> (param $0 i32) (result i32)
  i32.const 1
  drop
  i32.const 4
  i32.const 1
  i32.eq
  drop
  i32.const 4
  i32.const 2
  i32.eq
  drop
  i32.const 4
  i32.const 4
  i32.eq
  drop
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
 (func $assembly/common/digest64WithStep (param $0 i32) (param $1 i32) (param $2 i32)
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
  call $assembly/common/init
  global.get $assembly/common/wPtr
  local.get $0
  local.get $2
  call $assembly/common/hashBlocks
  global.get $assembly/common/w64Ptr
  call $assembly/common/hashPreCompW
  local.get $1
  local.set $3
  i32.const 0
  local.set $4
  global.get $assembly/common/H0
  call $~lib/polyfills/bswap<u32>
  local.set $5
  local.get $3
  local.get $4
  i32.const 2
  i32.shl
  i32.add
  local.get $5
  i32.store
  local.get $1
  local.set $6
  i32.const 1
  local.set $7
  global.get $assembly/common/H1
  call $~lib/polyfills/bswap<u32>
  local.set $8
  local.get $6
  local.get $7
  i32.const 2
  i32.shl
  i32.add
  local.get $8
  i32.store
  local.get $1
  local.set $9
  i32.const 2
  local.set $10
  global.get $assembly/common/H2
  call $~lib/polyfills/bswap<u32>
  local.set $11
  local.get $9
  local.get $10
  i32.const 2
  i32.shl
  i32.add
  local.get $11
  i32.store
  local.get $1
  local.set $12
  i32.const 3
  local.set $13
  global.get $assembly/common/H3
  call $~lib/polyfills/bswap<u32>
  local.set $14
  local.get $12
  local.get $13
  i32.const 2
  i32.shl
  i32.add
  local.get $14
  i32.store
  local.get $1
  local.set $15
  i32.const 4
  local.set $16
  global.get $assembly/common/H4
  call $~lib/polyfills/bswap<u32>
  local.set $17
  local.get $15
  local.get $16
  i32.const 2
  i32.shl
  i32.add
  local.get $17
  i32.store
  local.get $1
  local.set $18
  i32.const 5
  local.set $19
  global.get $assembly/common/H5
  call $~lib/polyfills/bswap<u32>
  local.set $20
  local.get $18
  local.get $19
  i32.const 2
  i32.shl
  i32.add
  local.get $20
  i32.store
  local.get $1
  local.set $21
  i32.const 6
  local.set $22
  global.get $assembly/common/H6
  call $~lib/polyfills/bswap<u32>
  local.set $23
  local.get $21
  local.get $22
  i32.const 2
  i32.shl
  i32.add
  local.get $23
  i32.store
  local.get $1
  local.set $24
  i32.const 7
  local.set $25
  global.get $assembly/common/H7
  call $~lib/polyfills/bswap<u32>
  local.set $26
  local.get $24
  local.get $25
  i32.const 2
  i32.shl
  i32.add
  local.get $26
  i32.store
 )
 (func $assembly/common/digest64 (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.const 1
  call $assembly/common/digest64WithStep
 )
 (func $assembly/index/batchHash4UintArray64s (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  i32.const 0
  local.set $1
  loop $for-loop|0
   local.get $1
   i32.const 4
   i32.lt_s
   if
    local.get $1
    i32.const 64
    i32.mul
    local.set $2
    local.get $1
    i32.const 32
    i32.mul
    local.set $3
    global.get $assembly/common/inputPtr
    local.get $2
    i32.add
    local.get $0
    local.get $3
    i32.add
    call $assembly/common/digest64
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $for-loop|0
   end
  end
 )
 (func $assembly/index/batchHash4HashObjectInputs (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  i32.const 0
  local.set $1
  loop $for-loop|0
   local.get $1
   i32.const 4
   i32.lt_s
   if
    local.get $1
    i32.const 4
    i32.mul
    local.set $2
    local.get $1
    i32.const 32
    i32.mul
    local.set $3
    global.get $assembly/common/inputPtr
    local.get $2
    i32.add
    local.get $0
    local.get $3
    i32.add
    i32.const 4
    call $assembly/common/digest64WithStep
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $for-loop|0
   end
  end
 )
 (func $assembly/common/update (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  i32.const 0
  local.set $2
  global.get $assembly/common/bytesHashed
  local.get $1
  i32.add
  global.set $assembly/common/bytesHashed
  global.get $assembly/common/mLength
  if
   i32.const 64
   global.get $assembly/common/mLength
   i32.sub
   local.get $1
   i32.le_s
   if
    global.get $assembly/common/mPtr
    global.get $assembly/common/mLength
    i32.add
    local.get $0
    i32.const 64
    global.get $assembly/common/mLength
    i32.sub
    memory.copy
    global.get $assembly/common/mLength
    i32.const 64
    global.get $assembly/common/mLength
    i32.sub
    i32.add
    global.set $assembly/common/mLength
    local.get $2
    i32.const 64
    global.get $assembly/common/mLength
    i32.sub
    i32.add
    local.set $2
    local.get $1
    i32.const 64
    global.get $assembly/common/mLength
    i32.sub
    i32.sub
    local.set $1
    global.get $assembly/common/wPtr
    global.get $assembly/common/mPtr
    i32.const 1
    call $assembly/common/hashBlocks
    i32.const 0
    global.set $assembly/common/mLength
   else
    global.get $assembly/common/mPtr
    global.get $assembly/common/mLength
    i32.add
    local.get $0
    local.get $1
    memory.copy
    global.get $assembly/common/mLength
    local.get $1
    i32.add
    global.set $assembly/common/mLength
    local.get $2
    local.get $1
    i32.add
    local.set $2
    local.get $1
    local.get $1
    i32.sub
    local.set $1
    return
   end
  end
  i32.const 0
  local.set $3
  loop $for-loop|0
   local.get $3
   local.get $1
   i32.const 64
   i32.div_s
   i32.lt_s
   if
    global.get $assembly/common/wPtr
    local.get $0
    local.get $2
    i32.add
    i32.const 1
    call $assembly/common/hashBlocks
    local.get $3
    i32.const 1
    i32.add
    local.set $3
    local.get $2
    i32.const 64
    i32.add
    local.set $2
    br $for-loop|0
   end
  end
  local.get $1
  i32.const 63
  i32.and
  if
   global.get $assembly/common/mPtr
   global.get $assembly/common/mLength
   i32.add
   local.get $0
   local.get $2
   i32.add
   local.get $1
   i32.const 63
   i32.and
   memory.copy
   global.get $assembly/common/mLength
   local.get $1
   i32.const 63
   i32.and
   i32.add
   global.set $assembly/common/mLength
  end
 )
 (func $~lib/polyfills/bswap<i32> (param $0 i32) (result i32)
  i32.const 1
  drop
  i32.const 4
  i32.const 1
  i32.eq
  drop
  i32.const 4
  i32.const 2
  i32.eq
  drop
  i32.const 4
  i32.const 4
  i32.eq
  drop
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
 (func $assembly/common/final (param $0 i32)
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
  global.get $assembly/common/mPtr
  local.set $1
  global.get $assembly/common/mLength
  local.set $2
  i32.const 128
  local.set $3
  local.get $1
  local.get $2
  i32.add
  local.get $3
  i32.store8
  global.get $assembly/common/mLength
  i32.const 1
  i32.add
  global.set $assembly/common/mLength
  global.get $assembly/common/mLength
  i32.const 56
  i32.gt_s
  if
   global.get $assembly/common/mPtr
   global.get $assembly/common/mLength
   i32.add
   local.set $4
   i32.const 0
   local.set $5
   i32.const 64
   global.get $assembly/common/mLength
   i32.sub
   local.set $6
   local.get $4
   local.get $6
   i32.add
   local.set $7
   loop $while-continue|0
    local.get $4
    local.get $7
    i32.lt_u
    if
     local.get $4
     local.get $5
     i32.store8
     local.get $4
     i32.const 1
     i32.add
     local.set $4
     br $while-continue|0
    end
   end
   global.get $assembly/common/wPtr
   global.get $assembly/common/mPtr
   i32.const 1
   call $assembly/common/hashBlocks
   i32.const 0
   global.set $assembly/common/mLength
  end
  global.get $assembly/common/mPtr
  global.get $assembly/common/mLength
  i32.add
  local.set $8
  i32.const 0
  local.set $9
  i32.const 64
  global.get $assembly/common/mLength
  i32.sub
  i32.const 8
  i32.sub
  local.set $10
  local.get $8
  local.get $10
  i32.add
  local.set $11
  loop $while-continue|1
   local.get $8
   local.get $11
   i32.lt_u
   if
    local.get $8
    local.get $9
    i32.store8
    local.get $8
    i32.const 1
    i32.add
    local.set $8
    br $while-continue|1
   end
  end
  global.get $assembly/common/mPtr
  i32.const 64
  i32.add
  i32.const 8
  i32.sub
  global.get $assembly/common/bytesHashed
  i32.const 536870912
  i32.div_s
  call $~lib/polyfills/bswap<i32>
  i32.store
  global.get $assembly/common/mPtr
  i32.const 64
  i32.add
  i32.const 4
  i32.sub
  global.get $assembly/common/bytesHashed
  i32.const 3
  i32.shl
  call $~lib/polyfills/bswap<i32>
  i32.store
  global.get $assembly/common/wPtr
  global.get $assembly/common/mPtr
  i32.const 1
  call $assembly/common/hashBlocks
  local.get $0
  local.set $12
  i32.const 0
  local.set $13
  global.get $assembly/common/H0
  call $~lib/polyfills/bswap<u32>
  local.set $14
  local.get $12
  local.get $13
  i32.const 2
  i32.shl
  i32.add
  local.get $14
  i32.store
  local.get $0
  local.set $15
  i32.const 1
  local.set $16
  global.get $assembly/common/H1
  call $~lib/polyfills/bswap<u32>
  local.set $17
  local.get $15
  local.get $16
  i32.const 2
  i32.shl
  i32.add
  local.get $17
  i32.store
  local.get $0
  local.set $18
  i32.const 2
  local.set $19
  global.get $assembly/common/H2
  call $~lib/polyfills/bswap<u32>
  local.set $20
  local.get $18
  local.get $19
  i32.const 2
  i32.shl
  i32.add
  local.get $20
  i32.store
  local.get $0
  local.set $21
  i32.const 3
  local.set $22
  global.get $assembly/common/H3
  call $~lib/polyfills/bswap<u32>
  local.set $23
  local.get $21
  local.get $22
  i32.const 2
  i32.shl
  i32.add
  local.get $23
  i32.store
  local.get $0
  local.set $24
  i32.const 4
  local.set $25
  global.get $assembly/common/H4
  call $~lib/polyfills/bswap<u32>
  local.set $26
  local.get $24
  local.get $25
  i32.const 2
  i32.shl
  i32.add
  local.get $26
  i32.store
  local.get $0
  local.set $27
  i32.const 5
  local.set $28
  global.get $assembly/common/H5
  call $~lib/polyfills/bswap<u32>
  local.set $29
  local.get $27
  local.get $28
  i32.const 2
  i32.shl
  i32.add
  local.get $29
  i32.store
  local.get $0
  local.set $30
  i32.const 6
  local.set $31
  global.get $assembly/common/H6
  call $~lib/polyfills/bswap<u32>
  local.set $32
  local.get $30
  local.get $31
  i32.const 2
  i32.shl
  i32.add
  local.get $32
  i32.store
  local.get $0
  local.set $33
  i32.const 7
  local.set $34
  global.get $assembly/common/H7
  call $~lib/polyfills/bswap<u32>
  local.set $35
  local.get $33
  local.get $34
  i32.const 2
  i32.shl
  i32.add
  local.get $35
  i32.store
 )
 (func $assembly/common/digest (param $0 i32)
  call $assembly/common/init
  global.get $assembly/common/inputPtr
  local.get $0
  call $assembly/common/update
  global.get $assembly/common/outputPtr
  call $assembly/common/final
 )
 (func $~start
  call $start:assembly/index
 )
)
