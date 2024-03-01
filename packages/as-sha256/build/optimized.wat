(module
 (type $0 (func (param i32 i32)))
 (type $1 (func (param i32) (result i32)))
 (type $2 (func (param i32)))
 (type $3 (func (param i32 i32) (result i32)))
 (type $4 (func))
 (type $5 (func (param i32 i32 i32 i32)))
 (type $6 (func (param i32 i32 i64)))
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
 (global $assembly/index/INPUT_LENGTH i32 (i32.const 512))
 (global $assembly/index/kPtr (mut i32) (i32.const 0))
 (global $assembly/index/w64Ptr (mut i32) (i32.const 0))
 (global $assembly/index/H0 (mut i32) (i32.const 0))
 (global $assembly/index/H1 (mut i32) (i32.const 0))
 (global $assembly/index/H2 (mut i32) (i32.const 0))
 (global $assembly/index/H3 (mut i32) (i32.const 0))
 (global $assembly/index/H4 (mut i32) (i32.const 0))
 (global $assembly/index/H5 (mut i32) (i32.const 0))
 (global $assembly/index/H6 (mut i32) (i32.const 0))
 (global $assembly/index/H7 (mut i32) (i32.const 0))
 (global $assembly/index/a (mut i32) (i32.const 0))
 (global $assembly/index/b (mut i32) (i32.const 0))
 (global $assembly/index/c (mut i32) (i32.const 0))
 (global $assembly/index/d (mut i32) (i32.const 0))
 (global $assembly/index/e (mut i32) (i32.const 0))
 (global $assembly/index/f (mut i32) (i32.const 0))
 (global $assembly/index/g (mut i32) (i32.const 0))
 (global $assembly/index/h (mut i32) (i32.const 0))
 (global $assembly/index/i (mut i32) (i32.const 0))
 (global $assembly/index/t1 (mut i32) (i32.const 0))
 (global $assembly/index/t2 (mut i32) (i32.const 0))
 (global $~lib/rt/tlsf/ROOT (mut i32) (i32.const 0))
 (global $~lib/rt/tcms/fromSpace (mut i32) (i32.const 0))
 (global $~lib/rt/tcms/total (mut i32) (i32.const 0))
 (global $assembly/index/M (mut i32) (i32.const 0))
 (global $assembly/index/mPtr (mut i32) (i32.const 0))
 (global $assembly/index/W (mut i32) (i32.const 0))
 (global $assembly/index/wPtr (mut i32) (i32.const 0))
 (global $assembly/index/input (mut i32) (i32.const 0))
 (global $assembly/index/inputPtr (mut i32) (i32.const 0))
 (global $assembly/index/output (mut i32) (i32.const 0))
 (global $assembly/index/outputPtr (mut i32) (i32.const 0))
 (global $assembly/index/mLength (mut i32) (i32.const 0))
 (global $assembly/index/bytesHashed (mut i32) (i32.const 0))
 (memory $0 1)
 (data $0 (i32.const 1036) "\1c\01")
 (data $0.1 (i32.const 1048) "\01\00\00\00\00\01\00\00\98/\8aB\91D7q\cf\fb\c0\b5\a5\db\b5\e9[\c2V9\f1\11\f1Y\a4\82?\92\d5^\1c\ab\98\aa\07\d8\01[\83\12\be\851$\c3}\0cUt]\ber\fe\b1\de\80\a7\06\dc\9bt\f1\9b\c1\c1i\9b\e4\86G\be\ef\c6\9d\c1\0f\cc\a1\0c$o,\e9-\aa\84tJ\dc\a9\b0\\\da\88\f9vRQ>\98m\c61\a8\c8\'\03\b0\c7\7fY\bf\f3\0b\e0\c6G\91\a7\d5Qc\ca\06g))\14\85\n\b7\'8!\1b.\fcm,M\13\r8STs\ne\bb\njv.\c9\c2\81\85,r\92\a1\e8\bf\a2Kf\1a\a8p\8bK\c2\a3Ql\c7\19\e8\92\d1$\06\99\d6\855\0e\f4p\a0j\10\16\c1\a4\19\08l7\1eLwH\'\b5\bc\b04\b3\0c\1c9J\aa\d8NO\ca\9c[\f3o.h\ee\82\8ftoc\a5x\14x\c8\84\08\02\c7\8c\fa\ff\be\90\eblP\a4\f7\a3\f9\be\f2xq\c6")
 (data $1 (i32.const 1324) ",")
 (data $1.1 (i32.const 1336) "\04\00\00\00\10\00\00\00 \04\00\00 \04\00\00\00\01\00\00@")
 (data $2 (i32.const 1372) "\1c\01")
 (data $2.1 (i32.const 1384) "\01\00\00\00\00\01\00\00\98/\8a\c2\91D7q\cf\fb\c0\b5\a5\db\b5\e9[\c2V9\f1\11\f1Y\a4\82?\92\d5^\1c\ab\98\aa\07\d8\01[\83\12\be\851$\c3}\0cUt]\ber\fe\b1\de\80\a7\06\dc\9bt\f3\9b\c1\c1i\9bd\86G\fe\f0\c6\ed\e1\0fT\f2\0c$o4\e9O\be\84\c9l\1eA\b9a\fa\88\f9\16RQ\c6\f2mZ\8e\a8e\fc\19\b0\c7\9e\d9\b9\c31\12\9a\a0\ea\0e\e7+#\b1\fd\b0>5\c7\d5\bai0_m\97\cb\8f\11\0fZ\fd\ee\1e\dc\89\b65\n\04z\0b\de\9d\ca\f4X\16[]\e1\86>\7f\00\80\89\0872\ea\07\a57\95\abo\10a@\17\f1\d6\8c\rm;\aa\cd7\be\bb\c0\da;a\83c\a3H\db1\e9\02\0b\a7\\\d1o\ca\fa\1aR1\8431\95\1a\d4n\90xCm\f2\91\9c\c3\bd\ab\cc\9e\e6\a0\c9\b5<\b6/S\c6A\c7\d2\a3~#\07hK\95\a4v\1d\19L")
 (data $3 (i32.const 1660) ",")
 (data $3.1 (i32.const 1672) "\04\00\00\00\10\00\00\00p\05\00\00p\05\00\00\00\01\00\00@")
 (data $4 (i32.const 1708) ",")
 (data $4.1 (i32.const 1720) "\02\00\00\00\1c\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00l\00e\00n\00g\00t\00h")
 (data $5 (i32.const 1756) "<")
 (data $5.1 (i32.const 1768) "\02\00\00\00&\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00b\00u\00f\00f\00e\00r\00.\00t\00s")
 (data $6 (i32.const 1820) "<")
 (data $6.1 (i32.const 1832) "\02\00\00\00(\00\00\00A\00l\00l\00o\00c\00a\00t\00i\00o\00n\00 \00t\00o\00o\00 \00l\00a\00r\00g\00e")
 (data $7 (i32.const 1884) "<")
 (data $7.1 (i32.const 1896) "\02\00\00\00\1e\00\00\00~\00l\00i\00b\00/\00r\00t\00/\00t\00c\00m\00s\00.\00t\00s")
 (data $8 (i32.const 1948) "<")
 (data $8.1 (i32.const 1960) "\02\00\00\00\1e\00\00\00~\00l\00i\00b\00/\00r\00t\00/\00t\00l\00s\00f\00.\00t\00s")
 (export "INPUT_LENGTH" (global $assembly/index/INPUT_LENGTH))
 (export "input" (global $assembly/index/input))
 (export "output" (global $assembly/index/output))
 (export "init" (func $assembly/index/init))
 (export "update" (func $assembly/index/update))
 (export "final" (func $assembly/index/final))
 (export "digest" (func $assembly/index/digest))
 (export "digest64" (func $assembly/index/digest64))
 (export "memory" (memory $0))
 (start $~start)
 (func $~lib/rt/tlsf/Root#set:flMap (param $0 i32) (param $1 i32)
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
 (func $~lib/rt/tlsf/removeBlock (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  local.get $1
  i32.load
  i32.const -4
  i32.and
  local.tee $3
  i32.const 256
  i32.lt_u
  if (result i32)
   local.get $3
   i32.const 4
   i32.shr_u
  else
   i32.const 31
   i32.const 1073741820
   local.get $3
   local.get $3
   i32.const 1073741820
   i32.ge_u
   select
   local.tee $3
   i32.clz
   i32.sub
   local.tee $4
   i32.const 7
   i32.sub
   local.set $2
   local.get $3
   local.get $4
   i32.const 4
   i32.sub
   i32.shr_u
   i32.const 16
   i32.xor
  end
  local.set $3
  local.get $1
  i32.load offset=8
  local.set $5
  local.get $1
  i32.load offset=4
  local.tee $4
  if
   local.get $4
   local.get $5
   call $~lib/rt/tlsf/Block#set:next
  end
  local.get $5
  if
   local.get $5
   local.get $4
   call $~lib/rt/tlsf/Block#set:prev
  end
  local.get $1
  local.get $0
  local.get $2
  i32.const 4
  i32.shl
  local.get $3
  i32.add
  i32.const 2
  i32.shl
  i32.add
  local.tee $1
  i32.load offset=96
  i32.eq
  if
   local.get $1
   local.get $5
   i32.store offset=96
   local.get $5
   i32.eqz
   if
    local.get $0
    local.get $2
    i32.const 2
    i32.shl
    i32.add
    local.tee $1
    i32.load offset=4
    i32.const -2
    local.get $3
    i32.rotl
    i32.and
    local.set $3
    local.get $1
    local.get $3
    i32.store offset=4
    local.get $3
    i32.eqz
    if
     local.get $0
     local.get $0
     i32.load
     i32.const -2
     local.get $2
     i32.rotl
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
  local.get $1
  i32.load
  local.set $3
  local.get $1
  i32.const 4
  i32.add
  local.get $1
  i32.load
  i32.const -4
  i32.and
  i32.add
  local.tee $4
  i32.load
  local.tee $2
  i32.const 1
  i32.and
  if
   local.get $0
   local.get $4
   call $~lib/rt/tlsf/removeBlock
   local.get $1
   local.get $3
   i32.const 4
   i32.add
   local.get $2
   i32.const -4
   i32.and
   i32.add
   local.tee $3
   call $~lib/rt/tlsf/Root#set:flMap
   local.get $1
   i32.const 4
   i32.add
   local.get $1
   i32.load
   i32.const -4
   i32.and
   i32.add
   local.tee $4
   i32.load
   local.set $2
  end
  local.get $3
  i32.const 2
  i32.and
  if
   local.get $1
   i32.const 4
   i32.sub
   i32.load
   local.tee $1
   i32.load
   local.set $6
   local.get $0
   local.get $1
   call $~lib/rt/tlsf/removeBlock
   local.get $1
   local.get $6
   i32.const 4
   i32.add
   local.get $3
   i32.const -4
   i32.and
   i32.add
   local.tee $3
   call $~lib/rt/tlsf/Root#set:flMap
  end
  local.get $4
  local.get $2
  i32.const 2
  i32.or
  call $~lib/rt/tlsf/Root#set:flMap
  local.get $4
  i32.const 4
  i32.sub
  local.get $1
  i32.store
  local.get $0
  local.get $3
  i32.const -4
  i32.and
  local.tee $2
  i32.const 256
  i32.lt_u
  if (result i32)
   local.get $2
   i32.const 4
   i32.shr_u
  else
   i32.const 31
   i32.const 1073741820
   local.get $2
   local.get $2
   i32.const 1073741820
   i32.ge_u
   select
   local.tee $2
   i32.clz
   i32.sub
   local.tee $3
   i32.const 7
   i32.sub
   local.set $5
   local.get $2
   local.get $3
   i32.const 4
   i32.sub
   i32.shr_u
   i32.const 16
   i32.xor
  end
  local.tee $2
  local.get $5
  i32.const 4
  i32.shl
  i32.add
  i32.const 2
  i32.shl
  i32.add
  i32.load offset=96
  local.set $3
  local.get $1
  i32.const 0
  call $~lib/rt/tlsf/Block#set:prev
  local.get $1
  local.get $3
  call $~lib/rt/tlsf/Block#set:next
  local.get $3
  if
   local.get $3
   local.get $1
   call $~lib/rt/tlsf/Block#set:prev
  end
  local.get $0
  local.get $5
  i32.const 4
  i32.shl
  local.get $2
  i32.add
  i32.const 2
  i32.shl
  i32.add
  local.get $1
  i32.store offset=96
  local.get $0
  local.get $0
  i32.load
  i32.const 1
  local.get $5
  i32.shl
  i32.or
  call $~lib/rt/tlsf/Root#set:flMap
  local.get $0
  local.get $5
  i32.const 2
  i32.shl
  i32.add
  local.tee $0
  local.get $0
  i32.load offset=4
  i32.const 1
  local.get $2
  i32.shl
  i32.or
  i32.store offset=4
 )
 (func $~lib/rt/tlsf/addMemory (param $0 i32) (param $1 i32) (param $2 i64)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  local.get $1
  i32.const 19
  i32.add
  i32.const -16
  i32.and
  i32.const 4
  i32.sub
  local.set $1
  local.get $0
  i32.load offset=1568
  local.tee $3
  if
   local.get $3
   local.get $1
   i32.const 16
   i32.sub
   local.tee $5
   i32.eq
   if
    local.get $3
    i32.load
    local.set $4
    local.get $5
    local.set $1
   end
  end
  local.get $2
  i32.wrap_i64
  i32.const -16
  i32.and
  local.get $1
  i32.sub
  local.tee $3
  i32.const 20
  i32.lt_u
  if
   return
  end
  local.get $1
  local.get $4
  i32.const 2
  i32.and
  local.get $3
  i32.const 8
  i32.sub
  local.tee $3
  i32.const 1
  i32.or
  i32.or
  call $~lib/rt/tlsf/Root#set:flMap
  local.get $1
  i32.const 0
  call $~lib/rt/tlsf/Block#set:prev
  local.get $1
  i32.const 0
  call $~lib/rt/tlsf/Block#set:next
  local.get $1
  i32.const 4
  i32.add
  local.get $3
  i32.add
  local.tee $3
  i32.const 2
  call $~lib/rt/tlsf/Root#set:flMap
  local.get $0
  local.get $3
  i32.store offset=1568
  local.get $0
  local.get $1
  call $~lib/rt/tlsf/insertBlock
 )
 (func $~lib/rt/tlsf/roundSize (param $0 i32) (result i32)
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
  local.get $0
  local.get $0
  i32.const 536870910
  i32.lt_u
  select
 )
 (func $~lib/rt/tlsf/searchBlock (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  local.get $1
  i32.const 256
  i32.lt_u
  if (result i32)
   local.get $1
   i32.const 4
   i32.shr_u
  else
   i32.const 31
   local.get $1
   call $~lib/rt/tlsf/roundSize
   local.tee $1
   i32.clz
   i32.sub
   local.tee $3
   i32.const 7
   i32.sub
   local.set $2
   local.get $1
   local.get $3
   i32.const 4
   i32.sub
   i32.shr_u
   i32.const 16
   i32.xor
  end
  local.set $1
  local.get $0
  local.get $2
  i32.const 2
  i32.shl
  i32.add
  i32.load offset=4
  i32.const -1
  local.get $1
  i32.shl
  i32.and
  local.tee $1
  if (result i32)
   local.get $0
   local.get $1
   i32.ctz
   local.get $2
   i32.const 4
   i32.shl
   i32.add
   i32.const 2
   i32.shl
   i32.add
   i32.load offset=96
  else
   local.get $0
   i32.load
   i32.const -1
   local.get $2
   i32.const 1
   i32.add
   i32.shl
   i32.and
   local.tee $1
   if (result i32)
    local.get $0
    local.get $0
    local.get $1
    i32.ctz
    local.tee $0
    i32.const 2
    i32.shl
    i32.add
    i32.load offset=4
    i32.ctz
    local.get $0
    i32.const 4
    i32.shl
    i32.add
    i32.const 2
    i32.shl
    i32.add
    i32.load offset=96
   else
    i32.const 0
   end
  end
 )
 (func $~lib/rt/tlsf/allocateBlock (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  local.get $1
  i32.const 1073741820
  i32.gt_u
  if
   i32.const 1840
   i32.const 1968
   i32.const 461
   i32.const 29
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.const 12
  local.get $1
  i32.const 19
  i32.add
  i32.const -16
  i32.and
  i32.const 4
  i32.sub
  local.get $1
  i32.const 12
  i32.le_u
  select
  local.tee $1
  call $~lib/rt/tlsf/searchBlock
  local.tee $2
  i32.eqz
  if
   local.get $1
   i32.const 256
   i32.ge_u
   if (result i32)
    local.get $1
    call $~lib/rt/tlsf/roundSize
   else
    local.get $1
   end
   local.set $2
   memory.size
   local.tee $3
   local.get $2
   i32.const 4
   local.get $0
   i32.load offset=1568
   local.get $3
   i32.const 16
   i32.shl
   i32.const 4
   i32.sub
   i32.ne
   i32.shl
   i32.add
   i32.const 65535
   i32.add
   i32.const -65536
   i32.and
   i32.const 16
   i32.shr_u
   local.tee $2
   local.get $2
   local.get $3
   i32.lt_s
   select
   memory.grow
   i32.const 0
   i32.lt_s
   if
    local.get $2
    memory.grow
    i32.const 0
    i32.lt_s
    if
     unreachable
    end
   end
   local.get $0
   local.get $3
   i32.const 16
   i32.shl
   memory.size
   i64.extend_i32_s
   i64.const 16
   i64.shl
   call $~lib/rt/tlsf/addMemory
   local.get $0
   local.get $1
   call $~lib/rt/tlsf/searchBlock
   local.set $2
  end
  local.get $2
  i32.load
  drop
  local.get $0
  local.get $2
  call $~lib/rt/tlsf/removeBlock
  local.get $2
  i32.load
  local.tee $3
  i32.const -4
  i32.and
  local.get $1
  i32.sub
  local.tee $4
  i32.const 16
  i32.ge_u
  if
   local.get $2
   local.get $1
   local.get $3
   i32.const 2
   i32.and
   i32.or
   call $~lib/rt/tlsf/Root#set:flMap
   local.get $2
   i32.const 4
   i32.add
   local.get $1
   i32.add
   local.tee $1
   local.get $4
   i32.const 4
   i32.sub
   i32.const 1
   i32.or
   call $~lib/rt/tlsf/Root#set:flMap
   local.get $0
   local.get $1
   call $~lib/rt/tlsf/insertBlock
  else
   local.get $2
   local.get $3
   i32.const -2
   i32.and
   call $~lib/rt/tlsf/Root#set:flMap
   local.get $2
   i32.const 4
   i32.add
   local.get $2
   i32.load
   i32.const -4
   i32.and
   i32.add
   local.tee $0
   local.get $0
   i32.load
   i32.const -3
   i32.and
   call $~lib/rt/tlsf/Root#set:flMap
  end
  local.get $2
 )
 (func $~lib/arraybuffer/ArrayBuffer#constructor (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  i32.const 1073741820
  i32.gt_u
  if
   i32.const 1728
   i32.const 1776
   i32.const 52
   i32.const 43
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.const 1073741804
  i32.gt_u
  if
   i32.const 1840
   i32.const 1904
   i32.const 125
   i32.const 30
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/rt/tlsf/ROOT
  i32.eqz
  if
   memory.size
   local.tee $2
   i32.const 0
   i32.le_s
   if (result i32)
    i32.const 1
    local.get $2
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
   i32.const 2048
   i32.const 0
   call $~lib/rt/tlsf/Root#set:flMap
   i32.const 3616
   i32.const 0
   i32.store
   loop $for-loop|0
    local.get $1
    i32.const 23
    i32.lt_u
    if
     local.get $1
     i32.const 2
     i32.shl
     i32.const 2048
     i32.add
     i32.const 0
     i32.store offset=4
     i32.const 0
     local.set $2
     loop $for-loop|1
      local.get $2
      i32.const 16
      i32.lt_u
      if
       local.get $1
       i32.const 4
       i32.shl
       local.get $2
       i32.add
       i32.const 2
       i32.shl
       i32.const 2048
       i32.add
       i32.const 0
       i32.store offset=96
       local.get $2
       i32.const 1
       i32.add
       local.set $2
       br $for-loop|1
      end
     end
     local.get $1
     i32.const 1
     i32.add
     local.set $1
     br $for-loop|0
    end
   end
   i32.const 2048
   i32.const 3620
   memory.size
   i64.extend_i32_s
   i64.const 16
   i64.shl
   call $~lib/rt/tlsf/addMemory
   i32.const 2048
   global.set $~lib/rt/tlsf/ROOT
  end
  global.get $~lib/rt/tlsf/ROOT
  local.get $0
  i32.const 16
  i32.add
  call $~lib/rt/tlsf/allocateBlock
  local.tee $2
  i32.const 1
  i32.store offset=12
  local.get $2
  local.get $0
  i32.store offset=16
  global.get $~lib/rt/tcms/fromSpace
  local.tee $3
  i32.load offset=8
  local.set $1
  local.get $2
  local.get $3
  call $~lib/rt/tlsf/Block#set:prev
  local.get $2
  local.get $1
  call $~lib/rt/tlsf/Block#set:next
  local.get $1
  local.get $2
  local.get $1
  i32.load offset=4
  i32.const 3
  i32.and
  i32.or
  call $~lib/rt/tlsf/Block#set:prev
  local.get $3
  local.get $2
  call $~lib/rt/tlsf/Block#set:next
  global.get $~lib/rt/tcms/total
  local.get $2
  i32.load
  i32.const -4
  i32.and
  i32.const 4
  i32.add
  i32.add
  global.set $~lib/rt/tcms/total
  local.get $2
  i32.const 20
  i32.add
  local.tee $1
  i32.const 0
  local.get $0
  memory.fill
  local.get $1
 )
 (func $assembly/index/init
  i32.const 1779033703
  global.set $assembly/index/H0
  i32.const -1150833019
  global.set $assembly/index/H1
  i32.const 1013904242
  global.set $assembly/index/H2
  i32.const -1521486534
  global.set $assembly/index/H3
  i32.const 1359893119
  global.set $assembly/index/H4
  i32.const -1694144372
  global.set $assembly/index/H5
  i32.const 528734635
  global.set $assembly/index/H6
  i32.const 1541459225
  global.set $assembly/index/H7
  i32.const 0
  global.set $assembly/index/mLength
  i32.const 0
  global.set $assembly/index/bytesHashed
 )
 (func $assembly/index/hashBlocks (param $0 i32) (param $1 i32)
  (local $2 i32)
  global.get $assembly/index/H0
  global.set $assembly/index/a
  global.get $assembly/index/H1
  global.set $assembly/index/b
  global.get $assembly/index/H2
  global.set $assembly/index/c
  global.get $assembly/index/H3
  global.set $assembly/index/d
  global.get $assembly/index/H4
  global.set $assembly/index/e
  global.get $assembly/index/H5
  global.set $assembly/index/f
  global.get $assembly/index/H6
  global.set $assembly/index/g
  global.get $assembly/index/H7
  global.set $assembly/index/h
  i32.const 0
  global.set $assembly/index/i
  loop $for-loop|0
   global.get $assembly/index/i
   i32.const 16
   i32.lt_u
   if
    local.get $0
    global.get $assembly/index/i
    i32.const 2
    i32.shl
    local.tee $2
    i32.add
    local.get $1
    local.get $2
    i32.const 3
    i32.add
    i32.add
    i32.load8_u
    local.get $1
    local.get $2
    i32.add
    i32.load8_u
    i32.const 24
    i32.shl
    local.get $1
    local.get $2
    i32.const 1
    i32.add
    i32.add
    i32.load8_u
    i32.const 16
    i32.shl
    i32.or
    local.get $1
    local.get $2
    i32.const 2
    i32.add
    i32.add
    i32.load8_u
    i32.const 8
    i32.shl
    i32.or
    i32.or
    i32.store
    global.get $assembly/index/i
    i32.const 1
    i32.add
    global.set $assembly/index/i
    br $for-loop|0
   end
  end
  i32.const 16
  global.set $assembly/index/i
  loop $for-loop|1
   global.get $assembly/index/i
   i32.const 64
   i32.lt_u
   if
    local.get $0
    global.get $assembly/index/i
    i32.const 2
    i32.shl
    i32.add
    local.get $0
    global.get $assembly/index/i
    i32.const 16
    i32.sub
    i32.const 2
    i32.shl
    i32.add
    i32.load
    local.get $0
    global.get $assembly/index/i
    i32.const 7
    i32.sub
    i32.const 2
    i32.shl
    i32.add
    i32.load
    local.get $0
    global.get $assembly/index/i
    i32.const 2
    i32.sub
    i32.const 2
    i32.shl
    i32.add
    i32.load
    local.tee $1
    i32.const 17
    i32.rotr
    local.get $1
    i32.const 19
    i32.rotr
    i32.xor
    local.get $1
    i32.const 10
    i32.shr_u
    i32.xor
    i32.add
    local.get $0
    global.get $assembly/index/i
    i32.const 15
    i32.sub
    i32.const 2
    i32.shl
    i32.add
    i32.load
    local.tee $1
    i32.const 7
    i32.rotr
    local.get $1
    i32.const 18
    i32.rotr
    i32.xor
    local.get $1
    i32.const 3
    i32.shr_u
    i32.xor
    i32.add
    i32.add
    i32.store
    global.get $assembly/index/i
    i32.const 1
    i32.add
    global.set $assembly/index/i
    br $for-loop|1
   end
  end
  i32.const 0
  global.set $assembly/index/i
  loop $for-loop|2
   global.get $assembly/index/i
   i32.const 64
   i32.lt_u
   if
    local.get $0
    global.get $assembly/index/i
    i32.const 2
    i32.shl
    local.tee $1
    i32.add
    i32.load
    local.get $1
    global.get $assembly/index/kPtr
    i32.add
    i32.load
    global.get $assembly/index/h
    global.get $assembly/index/e
    local.tee $1
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
    i32.add
    global.get $assembly/index/e
    local.tee $1
    global.get $assembly/index/f
    i32.and
    global.get $assembly/index/g
    local.get $1
    i32.const -1
    i32.xor
    i32.and
    i32.xor
    i32.add
    i32.add
    i32.add
    global.set $assembly/index/t1
    global.get $assembly/index/a
    local.tee $1
    i32.const 2
    i32.rotr
    local.get $1
    i32.const 13
    i32.rotr
    i32.xor
    local.get $1
    i32.const 22
    i32.rotr
    i32.xor
    global.get $assembly/index/b
    local.tee $1
    global.get $assembly/index/c
    local.tee $2
    i32.and
    local.get $1
    global.get $assembly/index/a
    local.tee $1
    i32.and
    local.get $1
    local.get $2
    i32.and
    i32.xor
    i32.xor
    i32.add
    global.set $assembly/index/t2
    global.get $assembly/index/g
    global.set $assembly/index/h
    global.get $assembly/index/f
    global.set $assembly/index/g
    global.get $assembly/index/e
    global.set $assembly/index/f
    global.get $assembly/index/d
    global.get $assembly/index/t1
    i32.add
    global.set $assembly/index/e
    global.get $assembly/index/c
    global.set $assembly/index/d
    global.get $assembly/index/b
    global.set $assembly/index/c
    global.get $assembly/index/a
    global.set $assembly/index/b
    global.get $assembly/index/t1
    global.get $assembly/index/t2
    i32.add
    global.set $assembly/index/a
    global.get $assembly/index/i
    i32.const 1
    i32.add
    global.set $assembly/index/i
    br $for-loop|2
   end
  end
  global.get $assembly/index/H0
  global.get $assembly/index/a
  i32.add
  global.set $assembly/index/H0
  global.get $assembly/index/H1
  global.get $assembly/index/b
  i32.add
  global.set $assembly/index/H1
  global.get $assembly/index/H2
  global.get $assembly/index/c
  i32.add
  global.set $assembly/index/H2
  global.get $assembly/index/H3
  global.get $assembly/index/d
  i32.add
  global.set $assembly/index/H3
  global.get $assembly/index/H4
  global.get $assembly/index/e
  i32.add
  global.set $assembly/index/H4
  global.get $assembly/index/H5
  global.get $assembly/index/f
  i32.add
  global.set $assembly/index/H5
  global.get $assembly/index/H6
  global.get $assembly/index/g
  i32.add
  global.set $assembly/index/H6
  global.get $assembly/index/H7
  global.get $assembly/index/h
  i32.add
  global.set $assembly/index/H7
 )
 (func $assembly/index/update (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  global.get $assembly/index/bytesHashed
  local.get $1
  i32.add
  global.set $assembly/index/bytesHashed
  global.get $assembly/index/mLength
  if
   i32.const 64
   global.get $assembly/index/mLength
   i32.sub
   local.tee $2
   local.get $1
   i32.le_s
   if
    global.get $assembly/index/mPtr
    global.get $assembly/index/mLength
    i32.add
    local.get $0
    local.get $2
    memory.copy
    global.get $assembly/index/mLength
    local.get $2
    i32.add
    global.set $assembly/index/mLength
    i32.const 64
    global.get $assembly/index/mLength
    i32.sub
    local.set $2
    local.get $1
    i32.const 64
    global.get $assembly/index/mLength
    i32.sub
    i32.sub
    local.set $1
    global.get $assembly/index/wPtr
    global.get $assembly/index/mPtr
    call $assembly/index/hashBlocks
    i32.const 0
    global.set $assembly/index/mLength
   else
    global.get $assembly/index/mPtr
    global.get $assembly/index/mLength
    i32.add
    local.get $0
    local.get $1
    memory.copy
    global.get $assembly/index/mLength
    local.get $1
    i32.add
    global.set $assembly/index/mLength
    return
   end
  end
  loop $for-loop|0
   local.get $3
   local.get $1
   i32.const 64
   i32.div_s
   i32.lt_s
   if
    global.get $assembly/index/wPtr
    local.get $0
    local.get $2
    i32.add
    call $assembly/index/hashBlocks
    local.get $3
    i32.const 1
    i32.add
    local.set $3
    local.get $2
    i32.const -64
    i32.sub
    local.set $2
    br $for-loop|0
   end
  end
  local.get $1
  i32.const 63
  i32.and
  local.tee $1
  if
   global.get $assembly/index/mPtr
   global.get $assembly/index/mLength
   i32.add
   local.get $0
   local.get $2
   i32.add
   local.get $1
   memory.copy
   global.get $assembly/index/mLength
   local.get $1
   i32.add
   global.set $assembly/index/mLength
  end
 )
 (func $~lib/polyfills/bswap<i32> (param $0 i32) (result i32)
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
 )
 (func $assembly/index/final (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  global.get $assembly/index/bytesHashed
  i32.const 63
  i32.and
  i32.const 63
  i32.lt_u
  if
   global.get $assembly/index/mPtr
   global.get $assembly/index/mLength
   i32.add
   i32.const 128
   i32.store8
   global.get $assembly/index/mLength
   i32.const 1
   i32.add
   global.set $assembly/index/mLength
  end
  global.get $assembly/index/bytesHashed
  i32.const 63
  i32.and
  i32.const 56
  i32.ge_u
  if
   global.get $assembly/index/mPtr
   global.get $assembly/index/mLength
   i32.add
   local.tee $1
   i32.const 64
   global.get $assembly/index/mLength
   i32.sub
   i32.add
   local.set $2
   loop $while-continue|0
    local.get $1
    local.get $2
    i32.lt_u
    if
     local.get $1
     i32.const 0
     i32.store8
     local.get $1
     i32.const 1
     i32.add
     local.set $1
     br $while-continue|0
    end
   end
   global.get $assembly/index/wPtr
   global.get $assembly/index/mPtr
   call $assembly/index/hashBlocks
   i32.const 0
   global.set $assembly/index/mLength
  end
  global.get $assembly/index/bytesHashed
  i32.const 63
  i32.and
  i32.const 63
  i32.ge_u
  if
   global.get $assembly/index/mPtr
   global.get $assembly/index/mLength
   i32.add
   i32.const 128
   i32.store8
   global.get $assembly/index/mLength
   i32.const 1
   i32.add
   global.set $assembly/index/mLength
  end
  global.get $assembly/index/mPtr
  global.get $assembly/index/mLength
  i32.add
  local.tee $1
  i32.const 56
  global.get $assembly/index/mLength
  i32.sub
  i32.add
  local.set $2
  loop $while-continue|1
   local.get $1
   local.get $2
   i32.lt_u
   if
    local.get $1
    i32.const 0
    i32.store8
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $while-continue|1
   end
  end
  global.get $assembly/index/mPtr
  global.get $assembly/index/bytesHashed
  i32.const 536870912
  i32.div_s
  call $~lib/polyfills/bswap<i32>
  i32.store offset=56
  global.get $assembly/index/mPtr
  global.get $assembly/index/bytesHashed
  i32.const 3
  i32.shl
  call $~lib/polyfills/bswap<i32>
  i32.store offset=60
  global.get $assembly/index/wPtr
  global.get $assembly/index/mPtr
  call $assembly/index/hashBlocks
  local.get $0
  global.get $assembly/index/H0
  call $~lib/polyfills/bswap<i32>
  i32.store
  local.get $0
  global.get $assembly/index/H1
  call $~lib/polyfills/bswap<i32>
  i32.store offset=4
  local.get $0
  global.get $assembly/index/H2
  call $~lib/polyfills/bswap<i32>
  i32.store offset=8
  local.get $0
  global.get $assembly/index/H3
  call $~lib/polyfills/bswap<i32>
  i32.store offset=12
  local.get $0
  global.get $assembly/index/H4
  call $~lib/polyfills/bswap<i32>
  i32.store offset=16
  local.get $0
  global.get $assembly/index/H5
  call $~lib/polyfills/bswap<i32>
  i32.store offset=20
  local.get $0
  global.get $assembly/index/H6
  call $~lib/polyfills/bswap<i32>
  i32.store offset=24
  local.get $0
  global.get $assembly/index/H7
  call $~lib/polyfills/bswap<i32>
  i32.store offset=28
 )
 (func $assembly/index/digest (param $0 i32)
  call $assembly/index/init
  global.get $assembly/index/inputPtr
  local.get $0
  call $assembly/index/update
  global.get $assembly/index/outputPtr
  call $assembly/index/final
 )
 (func $assembly/index/hashPreCompW (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  global.get $assembly/index/H0
  global.set $assembly/index/a
  global.get $assembly/index/H1
  global.set $assembly/index/b
  global.get $assembly/index/H2
  global.set $assembly/index/c
  global.get $assembly/index/H3
  global.set $assembly/index/d
  global.get $assembly/index/H4
  global.set $assembly/index/e
  global.get $assembly/index/H5
  global.set $assembly/index/f
  global.get $assembly/index/H6
  global.set $assembly/index/g
  global.get $assembly/index/H7
  global.set $assembly/index/h
  i32.const 0
  global.set $assembly/index/i
  loop $for-loop|0
   global.get $assembly/index/i
   i32.const 64
   i32.lt_u
   if
    local.get $0
    global.get $assembly/index/i
    i32.const 2
    i32.shl
    i32.add
    i32.load
    global.get $assembly/index/h
    global.get $assembly/index/e
    local.tee $1
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
    i32.add
    global.get $assembly/index/e
    local.tee $1
    global.get $assembly/index/f
    i32.and
    global.get $assembly/index/g
    local.get $1
    i32.const -1
    i32.xor
    i32.and
    i32.xor
    i32.add
    i32.add
    global.set $assembly/index/t1
    global.get $assembly/index/a
    local.tee $1
    i32.const 2
    i32.rotr
    local.get $1
    i32.const 13
    i32.rotr
    i32.xor
    local.get $1
    i32.const 22
    i32.rotr
    i32.xor
    global.get $assembly/index/b
    local.tee $2
    global.get $assembly/index/c
    local.tee $1
    i32.and
    local.get $2
    global.get $assembly/index/a
    local.tee $2
    i32.and
    local.get $1
    local.get $2
    i32.and
    i32.xor
    i32.xor
    i32.add
    global.set $assembly/index/t2
    global.get $assembly/index/g
    global.set $assembly/index/h
    global.get $assembly/index/f
    global.set $assembly/index/g
    global.get $assembly/index/e
    global.set $assembly/index/f
    global.get $assembly/index/d
    global.get $assembly/index/t1
    i32.add
    global.set $assembly/index/e
    global.get $assembly/index/c
    global.set $assembly/index/d
    global.get $assembly/index/b
    global.set $assembly/index/c
    global.get $assembly/index/a
    global.set $assembly/index/b
    global.get $assembly/index/t1
    global.get $assembly/index/t2
    i32.add
    global.set $assembly/index/a
    global.get $assembly/index/i
    i32.const 1
    i32.add
    global.set $assembly/index/i
    br $for-loop|0
   end
  end
  global.get $assembly/index/H0
  global.get $assembly/index/a
  i32.add
  global.set $assembly/index/H0
  global.get $assembly/index/H1
  global.get $assembly/index/b
  i32.add
  global.set $assembly/index/H1
  global.get $assembly/index/H2
  global.get $assembly/index/c
  i32.add
  global.set $assembly/index/H2
  global.get $assembly/index/H3
  global.get $assembly/index/d
  i32.add
  global.set $assembly/index/H3
  global.get $assembly/index/H4
  global.get $assembly/index/e
  i32.add
  global.set $assembly/index/H4
  global.get $assembly/index/H5
  global.get $assembly/index/f
  i32.add
  global.set $assembly/index/H5
  global.get $assembly/index/H6
  global.get $assembly/index/g
  i32.add
  global.set $assembly/index/H6
  global.get $assembly/index/H7
  global.get $assembly/index/h
  i32.add
  global.set $assembly/index/H7
 )
 (func $assembly/index/digest64 (param $0 i32) (param $1 i32)
  call $assembly/index/init
  global.get $assembly/index/wPtr
  local.get $0
  call $assembly/index/hashBlocks
  global.get $assembly/index/w64Ptr
  call $assembly/index/hashPreCompW
  local.get $1
  global.get $assembly/index/H0
  call $~lib/polyfills/bswap<i32>
  i32.store
  local.get $1
  global.get $assembly/index/H1
  call $~lib/polyfills/bswap<i32>
  i32.store offset=4
  local.get $1
  global.get $assembly/index/H2
  call $~lib/polyfills/bswap<i32>
  i32.store offset=8
  local.get $1
  global.get $assembly/index/H3
  call $~lib/polyfills/bswap<i32>
  i32.store offset=12
  local.get $1
  global.get $assembly/index/H4
  call $~lib/polyfills/bswap<i32>
  i32.store offset=16
  local.get $1
  global.get $assembly/index/H5
  call $~lib/polyfills/bswap<i32>
  i32.store offset=20
  local.get $1
  global.get $assembly/index/H6
  call $~lib/polyfills/bswap<i32>
  i32.store offset=24
  local.get $1
  global.get $assembly/index/H7
  call $~lib/polyfills/bswap<i32>
  i32.store offset=28
 )
 (func $~start
  i32.const 1348
  i32.load
  global.set $assembly/index/kPtr
  i32.const 1684
  i32.load
  global.set $assembly/index/w64Ptr
  i32.const 2016
  i32.const 2016
  call $~lib/rt/tlsf/Block#set:prev
  i32.const 2016
  i32.const 2016
  call $~lib/rt/tlsf/Block#set:next
  i32.const 2016
  global.set $~lib/rt/tcms/fromSpace
  i32.const 64
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/index/M
  global.get $assembly/index/M
  global.set $assembly/index/mPtr
  i32.const 256
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/index/W
  global.get $assembly/index/W
  global.set $assembly/index/wPtr
  i32.const 512
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/index/input
  global.get $assembly/index/input
  global.set $assembly/index/inputPtr
  i32.const 32
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/index/output
  global.get $assembly/index/output
  global.set $assembly/index/outputPtr
 )
)
