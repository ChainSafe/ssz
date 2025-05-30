(module
 (type $0 (func (param i32 i32)))
 (type $1 (func (param i32) (result i32)))
 (type $2 (func (param i32 i32) (result i32)))
 (type $3 (func (param i32)))
 (type $4 (func))
 (type $5 (func (param i32 i32 i32 i32)))
 (type $6 (func (param i32 i32 i64)))
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
 (global $assembly/simd/H0V128 (mut v128) (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000))
 (global $assembly/simd/H1V128 (mut v128) (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000))
 (global $assembly/simd/H2V128 (mut v128) (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000))
 (global $assembly/simd/H3V128 (mut v128) (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000))
 (global $assembly/simd/H4V128 (mut v128) (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000))
 (global $assembly/simd/H5V128 (mut v128) (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000))
 (global $assembly/simd/H6V128 (mut v128) (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000))
 (global $assembly/simd/H7V128 (mut v128) (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000))
 (global $assembly/simd/aV128 (mut v128) (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000))
 (global $assembly/simd/bV128 (mut v128) (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000))
 (global $assembly/simd/cV128 (mut v128) (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000))
 (global $assembly/simd/dV128 (mut v128) (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000))
 (global $assembly/simd/eV128 (mut v128) (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000))
 (global $assembly/simd/fV128 (mut v128) (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000))
 (global $assembly/simd/gV128 (mut v128) (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000))
 (global $assembly/simd/hV128 (mut v128) (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000))
 (global $assembly/simd/t1V128 (mut v128) (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000))
 (global $assembly/simd/t2V128 (mut v128) (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000))
 (global $assembly/simd/i (mut i32) (i32.const 0))
 (global $assembly/simd/tmpW (mut v128) (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000))
 (global $~lib/rt/tlsf/ROOT (mut i32) (i32.const 0))
 (global $~lib/rt/tcms/fromSpace (mut i32) (i32.const 0))
 (global $~lib/rt/tcms/total (mut i32) (i32.const 0))
 (global $assembly/simd/kV128ArrayBuffer (mut i32) (i32.const 0))
 (global $assembly/simd/kV128Ptr (mut i32) (i32.const 0))
 (global $assembly/simd/w64V12ArrayBuffer (mut i32) (i32.const 0))
 (global $assembly/simd/w64V128Ptr (mut i32) (i32.const 0))
 (global $assembly/common/PARALLEL_FACTOR i32 (i32.const 4))
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
 (global $assembly/index.simd/HAS_SIMD i32 (i32.const 1))
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
 (data $10 (i32.const 2044) "<")
 (data $10.1 (i32.const 2056) "\02\00\00\00$\00\00\00I\00n\00d\00e\00x\00 \00o\00u\00t\00 \00o\00f\00 \00r\00a\00n\00g\00e")
 (data $11 (i32.const 2108) ",")
 (data $11.1 (i32.const 2120) "\02\00\00\00\1a\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00.\00t\00s")
 (data $12 (i32.const 2156) "|")
 (data $12.1 (i32.const 2168) "\02\00\00\00d\00\00\00t\00o\00S\00t\00r\00i\00n\00g\00(\00)\00 \00r\00a\00d\00i\00x\00 \00a\00r\00g\00u\00m\00e\00n\00t\00 \00m\00u\00s\00t\00 \00b\00e\00 \00b\00e\00t\00w\00e\00e\00n\00 \002\00 \00a\00n\00d\00 \003\006")
 (data $13 (i32.const 2284) "<")
 (data $13.1 (i32.const 2296) "\02\00\00\00&\00\00\00~\00l\00i\00b\00/\00u\00t\00i\00l\00/\00n\00u\00m\00b\00e\00r\00.\00t\00s")
 (data $14 (i32.const 2348) "\1c")
 (data $14.1 (i32.const 2360) "\02\00\00\00\02\00\00\000")
 (data $15 (i32.const 2380) "\\")
 (data $15.1 (i32.const 2392) "\02\00\00\00H\00\00\000\001\002\003\004\005\006\007\008\009\00a\00b\00c\00d\00e\00f\00g\00h\00i\00j\00k\00l\00m\00n\00o\00p\00q\00r\00s\00t\00u\00v\00w\00x\00y\00z")
 (data $16 (i32.const 2476) "\\")
 (data $16.1 (i32.const 2488) "\02\00\00\00H\00\00\00s\00e\00t\00V\001\002\008\00:\00 \00e\00x\00p\00e\00c\00t\00 \00i\00 \00f\00r\00o\00m\00 \000\00 \00t\00o\00 \006\003\00,\00 \00g\00o\00t\00 ")
 (data $17 (i32.const 2572) "\1c")
 (data $17.1 (i32.const 2584) "\02")
 (data $18 (i32.const 2604) "<")
 (data $18.1 (i32.const 2616) "\02\00\00\00,\00\00\00a\00s\00s\00e\00m\00b\00l\00y\00/\00u\00t\00i\00l\00s\00/\00v\001\002\008\00.\00t\00s")
 (data $19 (i32.const 2668) "\\")
 (data $19.1 (i32.const 2680) "\02\00\00\00H\00\00\00g\00e\00t\00V\001\002\008\00:\00 \00e\00x\00p\00e\00c\00t\00 \00i\00 \00f\00r\00o\00m\00 \000\00 \00t\00o\00 \006\003\00,\00 \00g\00o\00t\00 ")
 (export "HAS_SIMD" (global $assembly/index.simd/HAS_SIMD))
 (export "batchHash4UintArray64s" (func $assembly/index.simd/batchHash4UintArray64s))
 (export "batchHash4HashObjectInputs" (func $assembly/index.simd/batchHash4HashObjectInputs))
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
 (func $~lib/rt/tcms/__new (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
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
   local.tee $3
   i32.const 0
   i32.le_s
   if (result i32)
    i32.const 1
    local.get $3
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
   i32.const 2768
   i32.const 0
   call $~lib/rt/tlsf/Root#set:flMap
   i32.const 4336
   i32.const 0
   i32.store
   loop $for-loop|0
    local.get $2
    i32.const 23
    i32.lt_u
    if
     local.get $2
     i32.const 2
     i32.shl
     i32.const 2768
     i32.add
     i32.const 0
     i32.store offset=4
     i32.const 0
     local.set $3
     loop $for-loop|1
      local.get $3
      i32.const 16
      i32.lt_u
      if
       local.get $2
       i32.const 4
       i32.shl
       local.get $3
       i32.add
       i32.const 2
       i32.shl
       i32.const 2768
       i32.add
       i32.const 0
       i32.store offset=96
       local.get $3
       i32.const 1
       i32.add
       local.set $3
       br $for-loop|1
      end
     end
     local.get $2
     i32.const 1
     i32.add
     local.set $2
     br $for-loop|0
    end
   end
   i32.const 2768
   i32.const 4340
   memory.size
   i64.extend_i32_s
   i64.const 16
   i64.shl
   call $~lib/rt/tlsf/addMemory
   i32.const 2768
   global.set $~lib/rt/tlsf/ROOT
  end
  global.get $~lib/rt/tlsf/ROOT
  local.get $0
  i32.const 16
  i32.add
  call $~lib/rt/tlsf/allocateBlock
  local.tee $2
  local.get $1
  i32.store offset=12
  local.get $2
  local.get $0
  i32.store offset=16
  global.get $~lib/rt/tcms/fromSpace
  local.tee $0
  i32.load offset=8
  local.set $1
  local.get $2
  local.get $0
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
  local.get $0
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
 )
 (func $~lib/arraybuffer/ArrayBuffer#constructor (param $0 i32) (result i32)
  (local $1 i32)
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
  i32.const 1
  call $~lib/rt/tcms/__new
  local.tee $1
  i32.const 0
  local.get $0
  memory.fill
  local.get $1
 )
 (func $~lib/array/Array<u32>#__get (param $0 i32) (param $1 i32) (result i32)
  local.get $1
  local.get $0
  i32.load offset=12
  i32.ge_u
  if
   i32.const 2064
   i32.const 2128
   i32.const 114
   i32.const 42
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.load offset=4
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  i32.load
 )
 (func $~lib/util/number/itoa32 (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  local.get $0
  i32.eqz
  if
   i32.const 2368
   return
  end
  i32.const 0
  local.get $0
  i32.sub
  local.get $0
  local.get $0
  i32.const 31
  i32.shr_u
  i32.const 1
  i32.shl
  local.tee $1
  select
  local.tee $0
  i32.const 10
  i32.ge_u
  i32.const 1
  i32.add
  local.get $0
  i32.const 10000
  i32.ge_u
  i32.const 3
  i32.add
  local.get $0
  i32.const 1000
  i32.ge_u
  i32.add
  local.get $0
  i32.const 100
  i32.lt_u
  select
  local.get $0
  i32.const 1000000
  i32.ge_u
  i32.const 6
  i32.add
  local.get $0
  i32.const 1000000000
  i32.ge_u
  i32.const 8
  i32.add
  local.get $0
  i32.const 100000000
  i32.ge_u
  i32.add
  local.get $0
  i32.const 10000000
  i32.lt_u
  select
  local.get $0
  i32.const 100000
  i32.lt_u
  select
  local.tee $2
  i32.const 1
  i32.shl
  local.get $1
  i32.add
  i32.const 2
  call $~lib/rt/tcms/__new
  local.tee $3
  local.get $1
  i32.add
  local.set $4
  loop $do-loop|0
   local.get $4
   local.get $2
   i32.const 1
   i32.sub
   local.tee $2
   i32.const 1
   i32.shl
   i32.add
   local.get $0
   i32.const 10
   i32.rem_u
   i32.const 48
   i32.add
   i32.store16
   local.get $0
   i32.const 10
   i32.div_u
   local.tee $0
   br_if $do-loop|0
  end
  local.get $1
  if
   local.get $3
   i32.const 45
   i32.store16
  end
  local.get $3
 )
 (func $~lib/string/String#get:length (param $0 i32) (result i32)
  local.get $0
  i32.const 20
  i32.sub
  i32.load offset=16
  i32.const 1
  i32.shr_u
 )
 (func $~lib/string/String#concat (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  local.get $0
  call $~lib/string/String#get:length
  i32.const 1
  i32.shl
  local.tee $2
  local.get $1
  call $~lib/string/String#get:length
  i32.const 1
  i32.shl
  local.tee $3
  i32.add
  local.tee $4
  i32.eqz
  if
   i32.const 2592
   return
  end
  local.get $4
  i32.const 2
  call $~lib/rt/tcms/__new
  local.tee $4
  local.get $0
  local.get $2
  memory.copy
  local.get $2
  local.get $4
  i32.add
  local.get $1
  local.get $3
  memory.copy
  local.get $4
 )
 (func $start:assembly/simd
  (local $0 i32)
  (local $1 v128)
  (local $2 i32)
  i32.const 2016
  i32.const 2016
  call $~lib/rt/tlsf/Block#set:prev
  i32.const 2016
  i32.const 2016
  call $~lib/rt/tlsf/Block#set:next
  i32.const 2016
  global.set $~lib/rt/tcms/fromSpace
  i32.const 1024
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/simd/kV128ArrayBuffer
  global.get $assembly/simd/kV128ArrayBuffer
  global.set $assembly/simd/kV128Ptr
  block $folding-inner0
   loop $for-loop|0
    local.get $0
    i32.const 64
    i32.lt_s
    if
     global.get $assembly/simd/kV128Ptr
     local.set $2
     i32.const 1344
     local.get $0
     call $~lib/array/Array<u32>#__get
     i32x4.splat
     local.set $1
     block $break|1
      block $case63|1
       block $case62|1
        block $case61|1
         block $case60|1
          block $case59|1
           block $case58|1
            block $case57|1
             block $case56|1
              block $case55|1
               block $case54|1
                block $case53|1
                 block $case52|1
                  block $case51|1
                   block $case50|1
                    block $case49|1
                     block $case48|1
                      block $case47|1
                       block $case46|1
                        block $case45|1
                         block $case44|1
                          block $case43|1
                           block $case42|1
                            block $case41|1
                             block $case40|1
                              block $case39|1
                               block $case38|1
                                block $case37|1
                                 block $case36|1
                                  block $case35|1
                                   block $case34|1
                                    block $case33|1
                                     block $case32|1
                                      block $case31|1
                                       block $case30|1
                                        block $case29|1
                                         block $case28|1
                                          block $case27|1
                                           block $case26|1
                                            block $case25|1
                                             block $case24|1
                                              block $case23|1
                                               block $case22|1
                                                block $case21|1
                                                 block $case20|1
                                                  block $case19|1
                                                   block $case18|1
                                                    block $case17|1
                                                     block $case16|1
                                                      block $case15|1
                                                       block $case14|1
                                                        block $case13|1
                                                         block $case12|1
                                                          block $case11|1
                                                           block $case10|1
                                                            block $case9|1
                                                             block $case8|1
                                                              block $case7|1
                                                               block $case6|1
                                                                block $case5|1
                                                                 block $case4|1
                                                                  block $case3|1
                                                                   block $case2|1
                                                                    block $case1|1
                                                                     block $case0|1
                                                                      local.get $0
                                                                      br_table $case0|1 $case1|1 $case2|1 $case3|1 $case4|1 $case5|1 $case6|1 $case7|1 $case8|1 $case9|1 $case10|1 $case11|1 $case12|1 $case13|1 $case14|1 $case15|1 $case16|1 $case17|1 $case18|1 $case19|1 $case20|1 $case21|1 $case22|1 $case23|1 $case24|1 $case25|1 $case26|1 $case27|1 $case28|1 $case29|1 $case30|1 $case31|1 $case32|1 $case33|1 $case34|1 $case35|1 $case36|1 $case37|1 $case38|1 $case39|1 $case40|1 $case41|1 $case42|1 $case43|1 $case44|1 $case45|1 $case46|1 $case47|1 $case48|1 $case49|1 $case50|1 $case51|1 $case52|1 $case53|1 $case54|1 $case55|1 $case56|1 $case57|1 $case58|1 $case59|1 $case60|1 $case61|1 $case62|1 $case63|1 $folding-inner0
                                                                     end
                                                                     local.get $2
                                                                     local.get $1
                                                                     v128.store
                                                                     br $break|1
                                                                    end
                                                                    local.get $2
                                                                    local.get $1
                                                                    v128.store offset=16
                                                                    br $break|1
                                                                   end
                                                                   local.get $2
                                                                   local.get $1
                                                                   v128.store offset=32
                                                                   br $break|1
                                                                  end
                                                                  local.get $2
                                                                  local.get $1
                                                                  v128.store offset=48
                                                                  br $break|1
                                                                 end
                                                                 local.get $2
                                                                 local.get $1
                                                                 v128.store offset=64
                                                                 br $break|1
                                                                end
                                                                local.get $2
                                                                local.get $1
                                                                v128.store offset=80
                                                                br $break|1
                                                               end
                                                               local.get $2
                                                               local.get $1
                                                               v128.store offset=96
                                                               br $break|1
                                                              end
                                                              local.get $2
                                                              local.get $1
                                                              v128.store offset=112
                                                              br $break|1
                                                             end
                                                             local.get $2
                                                             local.get $1
                                                             v128.store offset=128
                                                             br $break|1
                                                            end
                                                            local.get $2
                                                            local.get $1
                                                            v128.store offset=144
                                                            br $break|1
                                                           end
                                                           local.get $2
                                                           local.get $1
                                                           v128.store offset=160
                                                           br $break|1
                                                          end
                                                          local.get $2
                                                          local.get $1
                                                          v128.store offset=176
                                                          br $break|1
                                                         end
                                                         local.get $2
                                                         local.get $1
                                                         v128.store offset=192
                                                         br $break|1
                                                        end
                                                        local.get $2
                                                        local.get $1
                                                        v128.store offset=208
                                                        br $break|1
                                                       end
                                                       local.get $2
                                                       local.get $1
                                                       v128.store offset=224
                                                       br $break|1
                                                      end
                                                      local.get $2
                                                      local.get $1
                                                      v128.store offset=240
                                                      br $break|1
                                                     end
                                                     local.get $2
                                                     local.get $1
                                                     v128.store offset=256
                                                     br $break|1
                                                    end
                                                    local.get $2
                                                    local.get $1
                                                    v128.store offset=272
                                                    br $break|1
                                                   end
                                                   local.get $2
                                                   local.get $1
                                                   v128.store offset=288
                                                   br $break|1
                                                  end
                                                  local.get $2
                                                  local.get $1
                                                  v128.store offset=304
                                                  br $break|1
                                                 end
                                                 local.get $2
                                                 local.get $1
                                                 v128.store offset=320
                                                 br $break|1
                                                end
                                                local.get $2
                                                local.get $1
                                                v128.store offset=336
                                                br $break|1
                                               end
                                               local.get $2
                                               local.get $1
                                               v128.store offset=352
                                               br $break|1
                                              end
                                              local.get $2
                                              local.get $1
                                              v128.store offset=368
                                              br $break|1
                                             end
                                             local.get $2
                                             local.get $1
                                             v128.store offset=384
                                             br $break|1
                                            end
                                            local.get $2
                                            local.get $1
                                            v128.store offset=400
                                            br $break|1
                                           end
                                           local.get $2
                                           local.get $1
                                           v128.store offset=416
                                           br $break|1
                                          end
                                          local.get $2
                                          local.get $1
                                          v128.store offset=432
                                          br $break|1
                                         end
                                         local.get $2
                                         local.get $1
                                         v128.store offset=448
                                         br $break|1
                                        end
                                        local.get $2
                                        local.get $1
                                        v128.store offset=464
                                        br $break|1
                                       end
                                       local.get $2
                                       local.get $1
                                       v128.store offset=480
                                       br $break|1
                                      end
                                      local.get $2
                                      local.get $1
                                      v128.store offset=496
                                      br $break|1
                                     end
                                     local.get $2
                                     local.get $1
                                     v128.store offset=512
                                     br $break|1
                                    end
                                    local.get $2
                                    local.get $1
                                    v128.store offset=528
                                    br $break|1
                                   end
                                   local.get $2
                                   local.get $1
                                   v128.store offset=544
                                   br $break|1
                                  end
                                  local.get $2
                                  local.get $1
                                  v128.store offset=560
                                  br $break|1
                                 end
                                 local.get $2
                                 local.get $1
                                 v128.store offset=576
                                 br $break|1
                                end
                                local.get $2
                                local.get $1
                                v128.store offset=592
                                br $break|1
                               end
                               local.get $2
                               local.get $1
                               v128.store offset=608
                               br $break|1
                              end
                              local.get $2
                              local.get $1
                              v128.store offset=624
                              br $break|1
                             end
                             local.get $2
                             local.get $1
                             v128.store offset=640
                             br $break|1
                            end
                            local.get $2
                            local.get $1
                            v128.store offset=656
                            br $break|1
                           end
                           local.get $2
                           local.get $1
                           v128.store offset=672
                           br $break|1
                          end
                          local.get $2
                          local.get $1
                          v128.store offset=688
                          br $break|1
                         end
                         local.get $2
                         local.get $1
                         v128.store offset=704
                         br $break|1
                        end
                        local.get $2
                        local.get $1
                        v128.store offset=720
                        br $break|1
                       end
                       local.get $2
                       local.get $1
                       v128.store offset=736
                       br $break|1
                      end
                      local.get $2
                      local.get $1
                      v128.store offset=752
                      br $break|1
                     end
                     local.get $2
                     local.get $1
                     v128.store offset=768
                     br $break|1
                    end
                    local.get $2
                    local.get $1
                    v128.store offset=784
                    br $break|1
                   end
                   local.get $2
                   local.get $1
                   v128.store offset=800
                   br $break|1
                  end
                  local.get $2
                  local.get $1
                  v128.store offset=816
                  br $break|1
                 end
                 local.get $2
                 local.get $1
                 v128.store offset=832
                 br $break|1
                end
                local.get $2
                local.get $1
                v128.store offset=848
                br $break|1
               end
               local.get $2
               local.get $1
               v128.store offset=864
               br $break|1
              end
              local.get $2
              local.get $1
              v128.store offset=880
              br $break|1
             end
             local.get $2
             local.get $1
             v128.store offset=896
             br $break|1
            end
            local.get $2
            local.get $1
            v128.store offset=912
            br $break|1
           end
           local.get $2
           local.get $1
           v128.store offset=928
           br $break|1
          end
          local.get $2
          local.get $1
          v128.store offset=944
          br $break|1
         end
         local.get $2
         local.get $1
         v128.store offset=960
         br $break|1
        end
        local.get $2
        local.get $1
        v128.store offset=976
        br $break|1
       end
       local.get $2
       local.get $1
       v128.store offset=992
       br $break|1
      end
      local.get $2
      local.get $1
      v128.store offset=1008
     end
     local.get $0
     i32.const 1
     i32.add
     local.set $0
     br $for-loop|0
    end
   end
   i32.const 1024
   call $~lib/arraybuffer/ArrayBuffer#constructor
   global.set $assembly/simd/w64V12ArrayBuffer
   global.get $assembly/simd/w64V12ArrayBuffer
   global.set $assembly/simd/w64V128Ptr
   i32.const 0
   local.set $0
   loop $for-loop|2
    local.get $0
    i32.const 64
    i32.lt_s
    if
     global.get $assembly/simd/w64V128Ptr
     local.set $2
     i32.const 1680
     local.get $0
     call $~lib/array/Array<u32>#__get
     i32x4.splat
     local.set $1
     block $break|3
      block $case63|3
       block $case62|3
        block $case61|3
         block $case60|3
          block $case59|3
           block $case58|3
            block $case57|3
             block $case56|3
              block $case55|3
               block $case54|3
                block $case53|3
                 block $case52|3
                  block $case51|3
                   block $case50|3
                    block $case49|3
                     block $case48|3
                      block $case47|3
                       block $case46|3
                        block $case45|3
                         block $case44|3
                          block $case43|3
                           block $case42|3
                            block $case41|3
                             block $case40|3
                              block $case39|3
                               block $case38|3
                                block $case37|3
                                 block $case36|3
                                  block $case35|3
                                   block $case34|3
                                    block $case33|3
                                     block $case32|3
                                      block $case31|3
                                       block $case30|3
                                        block $case29|3
                                         block $case28|3
                                          block $case27|3
                                           block $case26|3
                                            block $case25|3
                                             block $case24|3
                                              block $case23|3
                                               block $case22|3
                                                block $case21|3
                                                 block $case20|3
                                                  block $case19|3
                                                   block $case18|3
                                                    block $case17|3
                                                     block $case16|3
                                                      block $case15|3
                                                       block $case14|3
                                                        block $case13|3
                                                         block $case12|3
                                                          block $case11|3
                                                           block $case10|3
                                                            block $case9|3
                                                             block $case8|3
                                                              block $case7|3
                                                               block $case6|3
                                                                block $case5|3
                                                                 block $case4|3
                                                                  block $case3|3
                                                                   block $case2|3
                                                                    block $case1|3
                                                                     block $case0|3
                                                                      local.get $0
                                                                      br_table $case0|3 $case1|3 $case2|3 $case3|3 $case4|3 $case5|3 $case6|3 $case7|3 $case8|3 $case9|3 $case10|3 $case11|3 $case12|3 $case13|3 $case14|3 $case15|3 $case16|3 $case17|3 $case18|3 $case19|3 $case20|3 $case21|3 $case22|3 $case23|3 $case24|3 $case25|3 $case26|3 $case27|3 $case28|3 $case29|3 $case30|3 $case31|3 $case32|3 $case33|3 $case34|3 $case35|3 $case36|3 $case37|3 $case38|3 $case39|3 $case40|3 $case41|3 $case42|3 $case43|3 $case44|3 $case45|3 $case46|3 $case47|3 $case48|3 $case49|3 $case50|3 $case51|3 $case52|3 $case53|3 $case54|3 $case55|3 $case56|3 $case57|3 $case58|3 $case59|3 $case60|3 $case61|3 $case62|3 $case63|3 $folding-inner0
                                                                     end
                                                                     local.get $2
                                                                     local.get $1
                                                                     v128.store
                                                                     br $break|3
                                                                    end
                                                                    local.get $2
                                                                    local.get $1
                                                                    v128.store offset=16
                                                                    br $break|3
                                                                   end
                                                                   local.get $2
                                                                   local.get $1
                                                                   v128.store offset=32
                                                                   br $break|3
                                                                  end
                                                                  local.get $2
                                                                  local.get $1
                                                                  v128.store offset=48
                                                                  br $break|3
                                                                 end
                                                                 local.get $2
                                                                 local.get $1
                                                                 v128.store offset=64
                                                                 br $break|3
                                                                end
                                                                local.get $2
                                                                local.get $1
                                                                v128.store offset=80
                                                                br $break|3
                                                               end
                                                               local.get $2
                                                               local.get $1
                                                               v128.store offset=96
                                                               br $break|3
                                                              end
                                                              local.get $2
                                                              local.get $1
                                                              v128.store offset=112
                                                              br $break|3
                                                             end
                                                             local.get $2
                                                             local.get $1
                                                             v128.store offset=128
                                                             br $break|3
                                                            end
                                                            local.get $2
                                                            local.get $1
                                                            v128.store offset=144
                                                            br $break|3
                                                           end
                                                           local.get $2
                                                           local.get $1
                                                           v128.store offset=160
                                                           br $break|3
                                                          end
                                                          local.get $2
                                                          local.get $1
                                                          v128.store offset=176
                                                          br $break|3
                                                         end
                                                         local.get $2
                                                         local.get $1
                                                         v128.store offset=192
                                                         br $break|3
                                                        end
                                                        local.get $2
                                                        local.get $1
                                                        v128.store offset=208
                                                        br $break|3
                                                       end
                                                       local.get $2
                                                       local.get $1
                                                       v128.store offset=224
                                                       br $break|3
                                                      end
                                                      local.get $2
                                                      local.get $1
                                                      v128.store offset=240
                                                      br $break|3
                                                     end
                                                     local.get $2
                                                     local.get $1
                                                     v128.store offset=256
                                                     br $break|3
                                                    end
                                                    local.get $2
                                                    local.get $1
                                                    v128.store offset=272
                                                    br $break|3
                                                   end
                                                   local.get $2
                                                   local.get $1
                                                   v128.store offset=288
                                                   br $break|3
                                                  end
                                                  local.get $2
                                                  local.get $1
                                                  v128.store offset=304
                                                  br $break|3
                                                 end
                                                 local.get $2
                                                 local.get $1
                                                 v128.store offset=320
                                                 br $break|3
                                                end
                                                local.get $2
                                                local.get $1
                                                v128.store offset=336
                                                br $break|3
                                               end
                                               local.get $2
                                               local.get $1
                                               v128.store offset=352
                                               br $break|3
                                              end
                                              local.get $2
                                              local.get $1
                                              v128.store offset=368
                                              br $break|3
                                             end
                                             local.get $2
                                             local.get $1
                                             v128.store offset=384
                                             br $break|3
                                            end
                                            local.get $2
                                            local.get $1
                                            v128.store offset=400
                                            br $break|3
                                           end
                                           local.get $2
                                           local.get $1
                                           v128.store offset=416
                                           br $break|3
                                          end
                                          local.get $2
                                          local.get $1
                                          v128.store offset=432
                                          br $break|3
                                         end
                                         local.get $2
                                         local.get $1
                                         v128.store offset=448
                                         br $break|3
                                        end
                                        local.get $2
                                        local.get $1
                                        v128.store offset=464
                                        br $break|3
                                       end
                                       local.get $2
                                       local.get $1
                                       v128.store offset=480
                                       br $break|3
                                      end
                                      local.get $2
                                      local.get $1
                                      v128.store offset=496
                                      br $break|3
                                     end
                                     local.get $2
                                     local.get $1
                                     v128.store offset=512
                                     br $break|3
                                    end
                                    local.get $2
                                    local.get $1
                                    v128.store offset=528
                                    br $break|3
                                   end
                                   local.get $2
                                   local.get $1
                                   v128.store offset=544
                                   br $break|3
                                  end
                                  local.get $2
                                  local.get $1
                                  v128.store offset=560
                                  br $break|3
                                 end
                                 local.get $2
                                 local.get $1
                                 v128.store offset=576
                                 br $break|3
                                end
                                local.get $2
                                local.get $1
                                v128.store offset=592
                                br $break|3
                               end
                               local.get $2
                               local.get $1
                               v128.store offset=608
                               br $break|3
                              end
                              local.get $2
                              local.get $1
                              v128.store offset=624
                              br $break|3
                             end
                             local.get $2
                             local.get $1
                             v128.store offset=640
                             br $break|3
                            end
                            local.get $2
                            local.get $1
                            v128.store offset=656
                            br $break|3
                           end
                           local.get $2
                           local.get $1
                           v128.store offset=672
                           br $break|3
                          end
                          local.get $2
                          local.get $1
                          v128.store offset=688
                          br $break|3
                         end
                         local.get $2
                         local.get $1
                         v128.store offset=704
                         br $break|3
                        end
                        local.get $2
                        local.get $1
                        v128.store offset=720
                        br $break|3
                       end
                       local.get $2
                       local.get $1
                       v128.store offset=736
                       br $break|3
                      end
                      local.get $2
                      local.get $1
                      v128.store offset=752
                      br $break|3
                     end
                     local.get $2
                     local.get $1
                     v128.store offset=768
                     br $break|3
                    end
                    local.get $2
                    local.get $1
                    v128.store offset=784
                    br $break|3
                   end
                   local.get $2
                   local.get $1
                   v128.store offset=800
                   br $break|3
                  end
                  local.get $2
                  local.get $1
                  v128.store offset=816
                  br $break|3
                 end
                 local.get $2
                 local.get $1
                 v128.store offset=832
                 br $break|3
                end
                local.get $2
                local.get $1
                v128.store offset=848
                br $break|3
               end
               local.get $2
               local.get $1
               v128.store offset=864
               br $break|3
              end
              local.get $2
              local.get $1
              v128.store offset=880
              br $break|3
             end
             local.get $2
             local.get $1
             v128.store offset=896
             br $break|3
            end
            local.get $2
            local.get $1
            v128.store offset=912
            br $break|3
           end
           local.get $2
           local.get $1
           v128.store offset=928
           br $break|3
          end
          local.get $2
          local.get $1
          v128.store offset=944
          br $break|3
         end
         local.get $2
         local.get $1
         v128.store offset=960
         br $break|3
        end
        local.get $2
        local.get $1
        v128.store offset=976
        br $break|3
       end
       local.get $2
       local.get $1
       v128.store offset=992
       br $break|3
      end
      local.get $2
      local.get $1
      v128.store offset=1008
     end
     local.get $0
     i32.const 1
     i32.add
     local.set $0
     br $for-loop|2
    end
   end
   return
  end
  i32.const 2496
  local.get $0
  call $~lib/util/number/itoa32
  call $~lib/string/String#concat
  i32.const 2624
  i32.const 201
  i32.const 7
  call $~lib/builtins/abort
  unreachable
 )
 (func $assembly/simd/hashPreCompWV128
  (local $0 v128)
  (local $1 i32)
  (local $2 i32)
  (local $3 v128)
  global.get $assembly/simd/H0V128
  global.set $assembly/simd/aV128
  global.get $assembly/simd/H1V128
  global.set $assembly/simd/bV128
  global.get $assembly/simd/H2V128
  global.set $assembly/simd/cV128
  global.get $assembly/simd/H3V128
  global.set $assembly/simd/dV128
  global.get $assembly/simd/H4V128
  global.set $assembly/simd/eV128
  global.get $assembly/simd/H5V128
  global.set $assembly/simd/fV128
  global.get $assembly/simd/H6V128
  global.set $assembly/simd/gV128
  global.get $assembly/simd/H7V128
  global.set $assembly/simd/hV128
  i32.const 0
  global.set $assembly/simd/i
  loop $for-loop|0
   global.get $assembly/simd/i
   i32.const 64
   i32.lt_s
   if
    global.get $assembly/simd/hV128
    global.get $assembly/simd/eV128
    local.tee $0
    i32.const 6
    i32x4.shr_u
    local.get $0
    i32.const 26
    i32x4.shl
    v128.or
    local.get $0
    i32.const 11
    i32x4.shr_u
    local.get $0
    i32.const 21
    i32x4.shl
    v128.or
    v128.xor
    local.get $0
    i32.const 25
    i32x4.shr_u
    local.get $0
    i32.const 7
    i32x4.shl
    v128.or
    v128.xor
    i32x4.add
    global.get $assembly/simd/eV128
    local.tee $0
    global.get $assembly/simd/fV128
    v128.and
    local.get $0
    v128.not
    global.get $assembly/simd/gV128
    v128.and
    v128.xor
    i32x4.add
    local.set $3
    global.get $assembly/simd/w64V128Ptr
    local.set $1
    block $assembly/utils/v128/getV128|inlined.6
     block $case64|1
      block $case63|1
       block $case62|1
        block $case61|1
         block $case60|1
          block $case59|1
           block $case58|1
            block $case57|1
             block $case56|1
              block $case55|1
               block $case54|1
                block $case53|1
                 block $case52|1
                  block $case51|1
                   block $case50|1
                    block $case49|1
                     block $case48|1
                      block $case47|1
                       block $case46|1
                        block $case45|1
                         block $case44|1
                          block $case43|1
                           block $case42|1
                            block $case41|1
                             block $case40|1
                              block $case39|1
                               block $case38|1
                                block $case37|1
                                 block $case36|1
                                  block $case35|1
                                   block $case34|1
                                    block $case33|1
                                     block $case32|1
                                      block $case31|1
                                       block $case30|1
                                        block $case29|1
                                         block $case28|1
                                          block $case27|1
                                           block $case26|1
                                            block $case25|1
                                             block $case24|1
                                              block $case23|1
                                               block $case22|1
                                                block $case21|1
                                                 block $case20|1
                                                  block $case19|1
                                                   block $case18|1
                                                    block $case17|1
                                                     block $case16|1
                                                      block $case15|1
                                                       block $case14|1
                                                        block $case13|1
                                                         block $case12|1
                                                          block $case11|1
                                                           block $case10|1
                                                            block $case9|1
                                                             block $case8|1
                                                              block $case7|1
                                                               block $case6|1
                                                                block $case5|1
                                                                 block $case4|1
                                                                  block $case3|1
                                                                   block $case2|1
                                                                    block $case1|1
                                                                     block $case0|1
                                                                      global.get $assembly/simd/i
                                                                      local.tee $2
                                                                      br_table $case0|1 $case1|1 $case2|1 $case3|1 $case4|1 $case5|1 $case6|1 $case7|1 $case8|1 $case9|1 $case10|1 $case11|1 $case12|1 $case13|1 $case14|1 $case15|1 $case16|1 $case17|1 $case18|1 $case19|1 $case20|1 $case21|1 $case22|1 $case23|1 $case24|1 $case25|1 $case26|1 $case27|1 $case28|1 $case29|1 $case30|1 $case31|1 $case32|1 $case33|1 $case34|1 $case35|1 $case36|1 $case37|1 $case38|1 $case39|1 $case40|1 $case41|1 $case42|1 $case43|1 $case44|1 $case45|1 $case46|1 $case47|1 $case48|1 $case49|1 $case50|1 $case51|1 $case52|1 $case53|1 $case54|1 $case55|1 $case56|1 $case57|1 $case58|1 $case59|1 $case60|1 $case61|1 $case62|1 $case63|1 $case64|1
                                                                     end
                                                                     local.get $1
                                                                     v128.load
                                                                     local.set $0
                                                                     br $assembly/utils/v128/getV128|inlined.6
                                                                    end
                                                                    local.get $1
                                                                    v128.load offset=16
                                                                    local.set $0
                                                                    br $assembly/utils/v128/getV128|inlined.6
                                                                   end
                                                                   local.get $1
                                                                   v128.load offset=32
                                                                   local.set $0
                                                                   br $assembly/utils/v128/getV128|inlined.6
                                                                  end
                                                                  local.get $1
                                                                  v128.load offset=48
                                                                  local.set $0
                                                                  br $assembly/utils/v128/getV128|inlined.6
                                                                 end
                                                                 local.get $1
                                                                 v128.load offset=64
                                                                 local.set $0
                                                                 br $assembly/utils/v128/getV128|inlined.6
                                                                end
                                                                local.get $1
                                                                v128.load offset=80
                                                                local.set $0
                                                                br $assembly/utils/v128/getV128|inlined.6
                                                               end
                                                               local.get $1
                                                               v128.load offset=96
                                                               local.set $0
                                                               br $assembly/utils/v128/getV128|inlined.6
                                                              end
                                                              local.get $1
                                                              v128.load offset=112
                                                              local.set $0
                                                              br $assembly/utils/v128/getV128|inlined.6
                                                             end
                                                             local.get $1
                                                             v128.load offset=128
                                                             local.set $0
                                                             br $assembly/utils/v128/getV128|inlined.6
                                                            end
                                                            local.get $1
                                                            v128.load offset=144
                                                            local.set $0
                                                            br $assembly/utils/v128/getV128|inlined.6
                                                           end
                                                           local.get $1
                                                           v128.load offset=160
                                                           local.set $0
                                                           br $assembly/utils/v128/getV128|inlined.6
                                                          end
                                                          local.get $1
                                                          v128.load offset=176
                                                          local.set $0
                                                          br $assembly/utils/v128/getV128|inlined.6
                                                         end
                                                         local.get $1
                                                         v128.load offset=192
                                                         local.set $0
                                                         br $assembly/utils/v128/getV128|inlined.6
                                                        end
                                                        local.get $1
                                                        v128.load offset=208
                                                        local.set $0
                                                        br $assembly/utils/v128/getV128|inlined.6
                                                       end
                                                       local.get $1
                                                       v128.load offset=224
                                                       local.set $0
                                                       br $assembly/utils/v128/getV128|inlined.6
                                                      end
                                                      local.get $1
                                                      v128.load offset=240
                                                      local.set $0
                                                      br $assembly/utils/v128/getV128|inlined.6
                                                     end
                                                     local.get $1
                                                     v128.load offset=256
                                                     local.set $0
                                                     br $assembly/utils/v128/getV128|inlined.6
                                                    end
                                                    local.get $1
                                                    v128.load offset=272
                                                    local.set $0
                                                    br $assembly/utils/v128/getV128|inlined.6
                                                   end
                                                   local.get $1
                                                   v128.load offset=288
                                                   local.set $0
                                                   br $assembly/utils/v128/getV128|inlined.6
                                                  end
                                                  local.get $1
                                                  v128.load offset=304
                                                  local.set $0
                                                  br $assembly/utils/v128/getV128|inlined.6
                                                 end
                                                 local.get $1
                                                 v128.load offset=320
                                                 local.set $0
                                                 br $assembly/utils/v128/getV128|inlined.6
                                                end
                                                local.get $1
                                                v128.load offset=336
                                                local.set $0
                                                br $assembly/utils/v128/getV128|inlined.6
                                               end
                                               local.get $1
                                               v128.load offset=352
                                               local.set $0
                                               br $assembly/utils/v128/getV128|inlined.6
                                              end
                                              local.get $1
                                              v128.load offset=368
                                              local.set $0
                                              br $assembly/utils/v128/getV128|inlined.6
                                             end
                                             local.get $1
                                             v128.load offset=384
                                             local.set $0
                                             br $assembly/utils/v128/getV128|inlined.6
                                            end
                                            local.get $1
                                            v128.load offset=400
                                            local.set $0
                                            br $assembly/utils/v128/getV128|inlined.6
                                           end
                                           local.get $1
                                           v128.load offset=416
                                           local.set $0
                                           br $assembly/utils/v128/getV128|inlined.6
                                          end
                                          local.get $1
                                          v128.load offset=432
                                          local.set $0
                                          br $assembly/utils/v128/getV128|inlined.6
                                         end
                                         local.get $1
                                         v128.load offset=448
                                         local.set $0
                                         br $assembly/utils/v128/getV128|inlined.6
                                        end
                                        local.get $1
                                        v128.load offset=464
                                        local.set $0
                                        br $assembly/utils/v128/getV128|inlined.6
                                       end
                                       local.get $1
                                       v128.load offset=480
                                       local.set $0
                                       br $assembly/utils/v128/getV128|inlined.6
                                      end
                                      local.get $1
                                      v128.load offset=496
                                      local.set $0
                                      br $assembly/utils/v128/getV128|inlined.6
                                     end
                                     local.get $1
                                     v128.load offset=512
                                     local.set $0
                                     br $assembly/utils/v128/getV128|inlined.6
                                    end
                                    local.get $1
                                    v128.load offset=528
                                    local.set $0
                                    br $assembly/utils/v128/getV128|inlined.6
                                   end
                                   local.get $1
                                   v128.load offset=544
                                   local.set $0
                                   br $assembly/utils/v128/getV128|inlined.6
                                  end
                                  local.get $1
                                  v128.load offset=560
                                  local.set $0
                                  br $assembly/utils/v128/getV128|inlined.6
                                 end
                                 local.get $1
                                 v128.load offset=576
                                 local.set $0
                                 br $assembly/utils/v128/getV128|inlined.6
                                end
                                local.get $1
                                v128.load offset=592
                                local.set $0
                                br $assembly/utils/v128/getV128|inlined.6
                               end
                               local.get $1
                               v128.load offset=608
                               local.set $0
                               br $assembly/utils/v128/getV128|inlined.6
                              end
                              local.get $1
                              v128.load offset=624
                              local.set $0
                              br $assembly/utils/v128/getV128|inlined.6
                             end
                             local.get $1
                             v128.load offset=640
                             local.set $0
                             br $assembly/utils/v128/getV128|inlined.6
                            end
                            local.get $1
                            v128.load offset=656
                            local.set $0
                            br $assembly/utils/v128/getV128|inlined.6
                           end
                           local.get $1
                           v128.load offset=672
                           local.set $0
                           br $assembly/utils/v128/getV128|inlined.6
                          end
                          local.get $1
                          v128.load offset=688
                          local.set $0
                          br $assembly/utils/v128/getV128|inlined.6
                         end
                         local.get $1
                         v128.load offset=704
                         local.set $0
                         br $assembly/utils/v128/getV128|inlined.6
                        end
                        local.get $1
                        v128.load offset=720
                        local.set $0
                        br $assembly/utils/v128/getV128|inlined.6
                       end
                       local.get $1
                       v128.load offset=736
                       local.set $0
                       br $assembly/utils/v128/getV128|inlined.6
                      end
                      local.get $1
                      v128.load offset=752
                      local.set $0
                      br $assembly/utils/v128/getV128|inlined.6
                     end
                     local.get $1
                     v128.load offset=768
                     local.set $0
                     br $assembly/utils/v128/getV128|inlined.6
                    end
                    local.get $1
                    v128.load offset=784
                    local.set $0
                    br $assembly/utils/v128/getV128|inlined.6
                   end
                   local.get $1
                   v128.load offset=800
                   local.set $0
                   br $assembly/utils/v128/getV128|inlined.6
                  end
                  local.get $1
                  v128.load offset=816
                  local.set $0
                  br $assembly/utils/v128/getV128|inlined.6
                 end
                 local.get $1
                 v128.load offset=832
                 local.set $0
                 br $assembly/utils/v128/getV128|inlined.6
                end
                local.get $1
                v128.load offset=848
                local.set $0
                br $assembly/utils/v128/getV128|inlined.6
               end
               local.get $1
               v128.load offset=864
               local.set $0
               br $assembly/utils/v128/getV128|inlined.6
              end
              local.get $1
              v128.load offset=880
              local.set $0
              br $assembly/utils/v128/getV128|inlined.6
             end
             local.get $1
             v128.load offset=896
             local.set $0
             br $assembly/utils/v128/getV128|inlined.6
            end
            local.get $1
            v128.load offset=912
            local.set $0
            br $assembly/utils/v128/getV128|inlined.6
           end
           local.get $1
           v128.load offset=928
           local.set $0
           br $assembly/utils/v128/getV128|inlined.6
          end
          local.get $1
          v128.load offset=944
          local.set $0
          br $assembly/utils/v128/getV128|inlined.6
         end
         local.get $1
         v128.load offset=960
         local.set $0
         br $assembly/utils/v128/getV128|inlined.6
        end
        local.get $1
        v128.load offset=976
        local.set $0
        br $assembly/utils/v128/getV128|inlined.6
       end
       local.get $1
       v128.load offset=992
       local.set $0
       br $assembly/utils/v128/getV128|inlined.6
      end
      local.get $1
      v128.load offset=1008
      local.set $0
      br $assembly/utils/v128/getV128|inlined.6
     end
     i32.const 2688
     local.get $2
     call $~lib/util/number/itoa32
     call $~lib/string/String#concat
     i32.const 2624
     i32.const 341
     i32.const 7
     call $~lib/builtins/abort
     unreachable
    end
    local.get $3
    local.get $0
    i32x4.add
    global.set $assembly/simd/t1V128
    global.get $assembly/simd/aV128
    local.tee $0
    i32.const 2
    i32x4.shr_u
    local.get $0
    i32.const 30
    i32x4.shl
    v128.or
    local.get $0
    i32.const 13
    i32x4.shr_u
    local.get $0
    i32.const 19
    i32x4.shl
    v128.or
    v128.xor
    local.get $0
    i32.const 22
    i32x4.shr_u
    local.get $0
    i32.const 10
    i32x4.shl
    v128.or
    v128.xor
    global.get $assembly/simd/aV128
    local.tee $0
    global.get $assembly/simd/bV128
    local.tee $3
    v128.and
    local.get $0
    global.get $assembly/simd/cV128
    local.tee $0
    v128.and
    v128.xor
    local.get $3
    local.get $0
    v128.and
    v128.xor
    i32x4.add
    global.set $assembly/simd/t2V128
    global.get $assembly/simd/gV128
    global.set $assembly/simd/hV128
    global.get $assembly/simd/fV128
    global.set $assembly/simd/gV128
    global.get $assembly/simd/eV128
    global.set $assembly/simd/fV128
    global.get $assembly/simd/dV128
    global.get $assembly/simd/t1V128
    i32x4.add
    global.set $assembly/simd/eV128
    global.get $assembly/simd/cV128
    global.set $assembly/simd/dV128
    global.get $assembly/simd/bV128
    global.set $assembly/simd/cV128
    global.get $assembly/simd/aV128
    global.set $assembly/simd/bV128
    global.get $assembly/simd/t1V128
    global.get $assembly/simd/t2V128
    i32x4.add
    global.set $assembly/simd/aV128
    global.get $assembly/simd/i
    i32.const 1
    i32.add
    global.set $assembly/simd/i
    br $for-loop|0
   end
  end
  global.get $assembly/simd/H0V128
  global.get $assembly/simd/aV128
  i32x4.add
  global.set $assembly/simd/H0V128
  global.get $assembly/simd/H1V128
  global.get $assembly/simd/bV128
  i32x4.add
  global.set $assembly/simd/H1V128
  global.get $assembly/simd/H2V128
  global.get $assembly/simd/cV128
  i32x4.add
  global.set $assembly/simd/H2V128
  global.get $assembly/simd/H3V128
  global.get $assembly/simd/dV128
  i32x4.add
  global.set $assembly/simd/H3V128
  global.get $assembly/simd/H4V128
  global.get $assembly/simd/eV128
  i32x4.add
  global.set $assembly/simd/H4V128
  global.get $assembly/simd/H5V128
  global.get $assembly/simd/fV128
  i32x4.add
  global.set $assembly/simd/H5V128
  global.get $assembly/simd/H6V128
  global.get $assembly/simd/gV128
  i32x4.add
  global.set $assembly/simd/H6V128
  global.get $assembly/simd/H7V128
  global.get $assembly/simd/hV128
  i32x4.add
  global.set $assembly/simd/H7V128
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
 (func $assembly/simd/digest64V128 (param $0 i32) (param $1 i32)
  (local $2 v128)
  (local $3 i32)
  (local $4 v128)
  (local $5 i32)
  v128.const i32x4 0x6a09e667 0x6a09e667 0x6a09e667 0x6a09e667
  global.set $assembly/simd/H0V128
  v128.const i32x4 0xbb67ae85 0xbb67ae85 0xbb67ae85 0xbb67ae85
  global.set $assembly/simd/H1V128
  v128.const i32x4 0x3c6ef372 0x3c6ef372 0x3c6ef372 0x3c6ef372
  global.set $assembly/simd/H2V128
  v128.const i32x4 0xa54ff53a 0xa54ff53a 0xa54ff53a 0xa54ff53a
  global.set $assembly/simd/H3V128
  v128.const i32x4 0x510e527f 0x510e527f 0x510e527f 0x510e527f
  global.set $assembly/simd/H4V128
  v128.const i32x4 0x9b05688c 0x9b05688c 0x9b05688c 0x9b05688c
  global.set $assembly/simd/H5V128
  v128.const i32x4 0x1f83d9ab 0x1f83d9ab 0x1f83d9ab 0x1f83d9ab
  global.set $assembly/simd/H6V128
  v128.const i32x4 0x5be0cd19 0x5be0cd19 0x5be0cd19 0x5be0cd19
  global.set $assembly/simd/H7V128
  v128.const i32x4 0x6a09e667 0x6a09e667 0x6a09e667 0x6a09e667
  global.set $assembly/simd/aV128
  v128.const i32x4 0xbb67ae85 0xbb67ae85 0xbb67ae85 0xbb67ae85
  global.set $assembly/simd/bV128
  v128.const i32x4 0x3c6ef372 0x3c6ef372 0x3c6ef372 0x3c6ef372
  global.set $assembly/simd/cV128
  v128.const i32x4 0xa54ff53a 0xa54ff53a 0xa54ff53a 0xa54ff53a
  global.set $assembly/simd/dV128
  v128.const i32x4 0x510e527f 0x510e527f 0x510e527f 0x510e527f
  global.set $assembly/simd/eV128
  v128.const i32x4 0x9b05688c 0x9b05688c 0x9b05688c 0x9b05688c
  global.set $assembly/simd/fV128
  v128.const i32x4 0x1f83d9ab 0x1f83d9ab 0x1f83d9ab 0x1f83d9ab
  global.set $assembly/simd/gV128
  v128.const i32x4 0x5be0cd19 0x5be0cd19 0x5be0cd19 0x5be0cd19
  global.set $assembly/simd/hV128
  i32.const 0
  global.set $assembly/simd/i
  block $folding-inner0
   loop $for-loop|0
    global.get $assembly/simd/i
    i32.const 64
    i32.lt_s
    if
     global.get $assembly/simd/i
     i32.const 16
     i32.lt_s
     if (result v128)
      block $assembly/utils/v128/getV128|inlined.0 (result v128)
       block $case63|1
        block $case62|1
         block $case61|1
          block $case60|1
           block $case59|1
            block $case58|1
             block $case57|1
              block $case56|1
               block $case55|1
                block $case54|1
                 block $case53|1
                  block $case52|1
                   block $case51|1
                    block $case50|1
                     block $case49|1
                      block $case48|1
                       block $case47|1
                        block $case46|1
                         block $case45|1
                          block $case44|1
                           block $case43|1
                            block $case42|1
                             block $case41|1
                              block $case40|1
                               block $case39|1
                                block $case38|1
                                 block $case37|1
                                  block $case36|1
                                   block $case35|1
                                    block $case34|1
                                     block $case33|1
                                      block $case32|1
                                       block $case31|1
                                        block $case30|1
                                         block $case29|1
                                          block $case28|1
                                           block $case27|1
                                            block $case26|1
                                             block $case25|1
                                              block $case24|1
                                               block $case23|1
                                                block $case22|1
                                                 block $case21|1
                                                  block $case20|1
                                                   block $case19|1
                                                    block $case18|1
                                                     block $case17|1
                                                      block $case16|1
                                                       block $case15|1
                                                        block $case14|1
                                                         block $case13|1
                                                          block $case12|1
                                                           block $case11|1
                                                            block $case10|1
                                                             block $case9|1
                                                              block $case8|1
                                                               block $case7|1
                                                                block $case6|1
                                                                 block $case5|1
                                                                  block $case4|1
                                                                   block $case3|1
                                                                    block $case2|1
                                                                     block $case1|1
                                                                      block $case0|1
                                                                       global.get $assembly/simd/i
                                                                       local.tee $3
                                                                       br_table $case0|1 $case1|1 $case2|1 $case3|1 $case4|1 $case5|1 $case6|1 $case7|1 $case8|1 $case9|1 $case10|1 $case11|1 $case12|1 $case13|1 $case14|1 $case15|1 $case16|1 $case17|1 $case18|1 $case19|1 $case20|1 $case21|1 $case22|1 $case23|1 $case24|1 $case25|1 $case26|1 $case27|1 $case28|1 $case29|1 $case30|1 $case31|1 $case32|1 $case33|1 $case34|1 $case35|1 $case36|1 $case37|1 $case38|1 $case39|1 $case40|1 $case41|1 $case42|1 $case43|1 $case44|1 $case45|1 $case46|1 $case47|1 $case48|1 $case49|1 $case50|1 $case51|1 $case52|1 $case53|1 $case54|1 $case55|1 $case56|1 $case57|1 $case58|1 $case59|1 $case60|1 $case61|1 $case62|1 $case63|1 $folding-inner0
                                                                      end
                                                                      local.get $0
                                                                      v128.load
                                                                      br $assembly/utils/v128/getV128|inlined.0
                                                                     end
                                                                     local.get $0
                                                                     v128.load offset=16
                                                                     br $assembly/utils/v128/getV128|inlined.0
                                                                    end
                                                                    local.get $0
                                                                    v128.load offset=32
                                                                    br $assembly/utils/v128/getV128|inlined.0
                                                                   end
                                                                   local.get $0
                                                                   v128.load offset=48
                                                                   br $assembly/utils/v128/getV128|inlined.0
                                                                  end
                                                                  local.get $0
                                                                  v128.load offset=64
                                                                  br $assembly/utils/v128/getV128|inlined.0
                                                                 end
                                                                 local.get $0
                                                                 v128.load offset=80
                                                                 br $assembly/utils/v128/getV128|inlined.0
                                                                end
                                                                local.get $0
                                                                v128.load offset=96
                                                                br $assembly/utils/v128/getV128|inlined.0
                                                               end
                                                               local.get $0
                                                               v128.load offset=112
                                                               br $assembly/utils/v128/getV128|inlined.0
                                                              end
                                                              local.get $0
                                                              v128.load offset=128
                                                              br $assembly/utils/v128/getV128|inlined.0
                                                             end
                                                             local.get $0
                                                             v128.load offset=144
                                                             br $assembly/utils/v128/getV128|inlined.0
                                                            end
                                                            local.get $0
                                                            v128.load offset=160
                                                            br $assembly/utils/v128/getV128|inlined.0
                                                           end
                                                           local.get $0
                                                           v128.load offset=176
                                                           br $assembly/utils/v128/getV128|inlined.0
                                                          end
                                                          local.get $0
                                                          v128.load offset=192
                                                          br $assembly/utils/v128/getV128|inlined.0
                                                         end
                                                         local.get $0
                                                         v128.load offset=208
                                                         br $assembly/utils/v128/getV128|inlined.0
                                                        end
                                                        local.get $0
                                                        v128.load offset=224
                                                        br $assembly/utils/v128/getV128|inlined.0
                                                       end
                                                       local.get $0
                                                       v128.load offset=240
                                                       br $assembly/utils/v128/getV128|inlined.0
                                                      end
                                                      local.get $0
                                                      v128.load offset=256
                                                      br $assembly/utils/v128/getV128|inlined.0
                                                     end
                                                     local.get $0
                                                     v128.load offset=272
                                                     br $assembly/utils/v128/getV128|inlined.0
                                                    end
                                                    local.get $0
                                                    v128.load offset=288
                                                    br $assembly/utils/v128/getV128|inlined.0
                                                   end
                                                   local.get $0
                                                   v128.load offset=304
                                                   br $assembly/utils/v128/getV128|inlined.0
                                                  end
                                                  local.get $0
                                                  v128.load offset=320
                                                  br $assembly/utils/v128/getV128|inlined.0
                                                 end
                                                 local.get $0
                                                 v128.load offset=336
                                                 br $assembly/utils/v128/getV128|inlined.0
                                                end
                                                local.get $0
                                                v128.load offset=352
                                                br $assembly/utils/v128/getV128|inlined.0
                                               end
                                               local.get $0
                                               v128.load offset=368
                                               br $assembly/utils/v128/getV128|inlined.0
                                              end
                                              local.get $0
                                              v128.load offset=384
                                              br $assembly/utils/v128/getV128|inlined.0
                                             end
                                             local.get $0
                                             v128.load offset=400
                                             br $assembly/utils/v128/getV128|inlined.0
                                            end
                                            local.get $0
                                            v128.load offset=416
                                            br $assembly/utils/v128/getV128|inlined.0
                                           end
                                           local.get $0
                                           v128.load offset=432
                                           br $assembly/utils/v128/getV128|inlined.0
                                          end
                                          local.get $0
                                          v128.load offset=448
                                          br $assembly/utils/v128/getV128|inlined.0
                                         end
                                         local.get $0
                                         v128.load offset=464
                                         br $assembly/utils/v128/getV128|inlined.0
                                        end
                                        local.get $0
                                        v128.load offset=480
                                        br $assembly/utils/v128/getV128|inlined.0
                                       end
                                       local.get $0
                                       v128.load offset=496
                                       br $assembly/utils/v128/getV128|inlined.0
                                      end
                                      local.get $0
                                      v128.load offset=512
                                      br $assembly/utils/v128/getV128|inlined.0
                                     end
                                     local.get $0
                                     v128.load offset=528
                                     br $assembly/utils/v128/getV128|inlined.0
                                    end
                                    local.get $0
                                    v128.load offset=544
                                    br $assembly/utils/v128/getV128|inlined.0
                                   end
                                   local.get $0
                                   v128.load offset=560
                                   br $assembly/utils/v128/getV128|inlined.0
                                  end
                                  local.get $0
                                  v128.load offset=576
                                  br $assembly/utils/v128/getV128|inlined.0
                                 end
                                 local.get $0
                                 v128.load offset=592
                                 br $assembly/utils/v128/getV128|inlined.0
                                end
                                local.get $0
                                v128.load offset=608
                                br $assembly/utils/v128/getV128|inlined.0
                               end
                               local.get $0
                               v128.load offset=624
                               br $assembly/utils/v128/getV128|inlined.0
                              end
                              local.get $0
                              v128.load offset=640
                              br $assembly/utils/v128/getV128|inlined.0
                             end
                             local.get $0
                             v128.load offset=656
                             br $assembly/utils/v128/getV128|inlined.0
                            end
                            local.get $0
                            v128.load offset=672
                            br $assembly/utils/v128/getV128|inlined.0
                           end
                           local.get $0
                           v128.load offset=688
                           br $assembly/utils/v128/getV128|inlined.0
                          end
                          local.get $0
                          v128.load offset=704
                          br $assembly/utils/v128/getV128|inlined.0
                         end
                         local.get $0
                         v128.load offset=720
                         br $assembly/utils/v128/getV128|inlined.0
                        end
                        local.get $0
                        v128.load offset=736
                        br $assembly/utils/v128/getV128|inlined.0
                       end
                       local.get $0
                       v128.load offset=752
                       br $assembly/utils/v128/getV128|inlined.0
                      end
                      local.get $0
                      v128.load offset=768
                      br $assembly/utils/v128/getV128|inlined.0
                     end
                     local.get $0
                     v128.load offset=784
                     br $assembly/utils/v128/getV128|inlined.0
                    end
                    local.get $0
                    v128.load offset=800
                    br $assembly/utils/v128/getV128|inlined.0
                   end
                   local.get $0
                   v128.load offset=816
                   br $assembly/utils/v128/getV128|inlined.0
                  end
                  local.get $0
                  v128.load offset=832
                  br $assembly/utils/v128/getV128|inlined.0
                 end
                 local.get $0
                 v128.load offset=848
                 br $assembly/utils/v128/getV128|inlined.0
                end
                local.get $0
                v128.load offset=864
                br $assembly/utils/v128/getV128|inlined.0
               end
               local.get $0
               v128.load offset=880
               br $assembly/utils/v128/getV128|inlined.0
              end
              local.get $0
              v128.load offset=896
              br $assembly/utils/v128/getV128|inlined.0
             end
             local.get $0
             v128.load offset=912
             br $assembly/utils/v128/getV128|inlined.0
            end
            local.get $0
            v128.load offset=928
            br $assembly/utils/v128/getV128|inlined.0
           end
           local.get $0
           v128.load offset=944
           br $assembly/utils/v128/getV128|inlined.0
          end
          local.get $0
          v128.load offset=960
          br $assembly/utils/v128/getV128|inlined.0
         end
         local.get $0
         v128.load offset=976
         br $assembly/utils/v128/getV128|inlined.0
        end
        local.get $0
        v128.load offset=992
        br $assembly/utils/v128/getV128|inlined.0
       end
       local.get $0
       v128.load offset=1008
      end
     else
      block $assembly/utils/v128/getV128|inlined.1 (result v128)
       block $case63|2
        block $case62|2
         block $case61|2
          block $case60|2
           block $case59|2
            block $case58|2
             block $case57|2
              block $case56|2
               block $case55|2
                block $case54|2
                 block $case53|2
                  block $case52|2
                   block $case51|2
                    block $case50|2
                     block $case49|2
                      block $case48|2
                       block $case47|2
                        block $case46|2
                         block $case45|2
                          block $case44|2
                           block $case43|2
                            block $case42|2
                             block $case41|2
                              block $case40|2
                               block $case39|2
                                block $case38|2
                                 block $case37|2
                                  block $case36|2
                                   block $case35|2
                                    block $case34|2
                                     block $case33|2
                                      block $case32|2
                                       block $case31|2
                                        block $case30|2
                                         block $case29|2
                                          block $case28|2
                                           block $case27|2
                                            block $case26|2
                                             block $case25|2
                                              block $case24|2
                                               block $case23|2
                                                block $case22|2
                                                 block $case21|2
                                                  block $case20|2
                                                   block $case19|2
                                                    block $case18|2
                                                     block $case17|2
                                                      block $case16|2
                                                       block $case15|2
                                                        block $case14|2
                                                         block $case13|2
                                                          block $case12|2
                                                           block $case11|2
                                                            block $case10|2
                                                             block $case9|2
                                                              block $case8|2
                                                               block $case7|2
                                                                block $case6|2
                                                                 block $case5|2
                                                                  block $case4|2
                                                                   block $case3|2
                                                                    block $case2|2
                                                                     block $case1|2
                                                                      block $case0|2
                                                                       global.get $assembly/simd/i
                                                                       i32.const 2
                                                                       i32.sub
                                                                       local.tee $3
                                                                       br_table $case0|2 $case1|2 $case2|2 $case3|2 $case4|2 $case5|2 $case6|2 $case7|2 $case8|2 $case9|2 $case10|2 $case11|2 $case12|2 $case13|2 $case14|2 $case15|2 $case16|2 $case17|2 $case18|2 $case19|2 $case20|2 $case21|2 $case22|2 $case23|2 $case24|2 $case25|2 $case26|2 $case27|2 $case28|2 $case29|2 $case30|2 $case31|2 $case32|2 $case33|2 $case34|2 $case35|2 $case36|2 $case37|2 $case38|2 $case39|2 $case40|2 $case41|2 $case42|2 $case43|2 $case44|2 $case45|2 $case46|2 $case47|2 $case48|2 $case49|2 $case50|2 $case51|2 $case52|2 $case53|2 $case54|2 $case55|2 $case56|2 $case57|2 $case58|2 $case59|2 $case60|2 $case61|2 $case62|2 $case63|2 $folding-inner0
                                                                      end
                                                                      local.get $0
                                                                      v128.load
                                                                      br $assembly/utils/v128/getV128|inlined.1
                                                                     end
                                                                     local.get $0
                                                                     v128.load offset=16
                                                                     br $assembly/utils/v128/getV128|inlined.1
                                                                    end
                                                                    local.get $0
                                                                    v128.load offset=32
                                                                    br $assembly/utils/v128/getV128|inlined.1
                                                                   end
                                                                   local.get $0
                                                                   v128.load offset=48
                                                                   br $assembly/utils/v128/getV128|inlined.1
                                                                  end
                                                                  local.get $0
                                                                  v128.load offset=64
                                                                  br $assembly/utils/v128/getV128|inlined.1
                                                                 end
                                                                 local.get $0
                                                                 v128.load offset=80
                                                                 br $assembly/utils/v128/getV128|inlined.1
                                                                end
                                                                local.get $0
                                                                v128.load offset=96
                                                                br $assembly/utils/v128/getV128|inlined.1
                                                               end
                                                               local.get $0
                                                               v128.load offset=112
                                                               br $assembly/utils/v128/getV128|inlined.1
                                                              end
                                                              local.get $0
                                                              v128.load offset=128
                                                              br $assembly/utils/v128/getV128|inlined.1
                                                             end
                                                             local.get $0
                                                             v128.load offset=144
                                                             br $assembly/utils/v128/getV128|inlined.1
                                                            end
                                                            local.get $0
                                                            v128.load offset=160
                                                            br $assembly/utils/v128/getV128|inlined.1
                                                           end
                                                           local.get $0
                                                           v128.load offset=176
                                                           br $assembly/utils/v128/getV128|inlined.1
                                                          end
                                                          local.get $0
                                                          v128.load offset=192
                                                          br $assembly/utils/v128/getV128|inlined.1
                                                         end
                                                         local.get $0
                                                         v128.load offset=208
                                                         br $assembly/utils/v128/getV128|inlined.1
                                                        end
                                                        local.get $0
                                                        v128.load offset=224
                                                        br $assembly/utils/v128/getV128|inlined.1
                                                       end
                                                       local.get $0
                                                       v128.load offset=240
                                                       br $assembly/utils/v128/getV128|inlined.1
                                                      end
                                                      local.get $0
                                                      v128.load offset=256
                                                      br $assembly/utils/v128/getV128|inlined.1
                                                     end
                                                     local.get $0
                                                     v128.load offset=272
                                                     br $assembly/utils/v128/getV128|inlined.1
                                                    end
                                                    local.get $0
                                                    v128.load offset=288
                                                    br $assembly/utils/v128/getV128|inlined.1
                                                   end
                                                   local.get $0
                                                   v128.load offset=304
                                                   br $assembly/utils/v128/getV128|inlined.1
                                                  end
                                                  local.get $0
                                                  v128.load offset=320
                                                  br $assembly/utils/v128/getV128|inlined.1
                                                 end
                                                 local.get $0
                                                 v128.load offset=336
                                                 br $assembly/utils/v128/getV128|inlined.1
                                                end
                                                local.get $0
                                                v128.load offset=352
                                                br $assembly/utils/v128/getV128|inlined.1
                                               end
                                               local.get $0
                                               v128.load offset=368
                                               br $assembly/utils/v128/getV128|inlined.1
                                              end
                                              local.get $0
                                              v128.load offset=384
                                              br $assembly/utils/v128/getV128|inlined.1
                                             end
                                             local.get $0
                                             v128.load offset=400
                                             br $assembly/utils/v128/getV128|inlined.1
                                            end
                                            local.get $0
                                            v128.load offset=416
                                            br $assembly/utils/v128/getV128|inlined.1
                                           end
                                           local.get $0
                                           v128.load offset=432
                                           br $assembly/utils/v128/getV128|inlined.1
                                          end
                                          local.get $0
                                          v128.load offset=448
                                          br $assembly/utils/v128/getV128|inlined.1
                                         end
                                         local.get $0
                                         v128.load offset=464
                                         br $assembly/utils/v128/getV128|inlined.1
                                        end
                                        local.get $0
                                        v128.load offset=480
                                        br $assembly/utils/v128/getV128|inlined.1
                                       end
                                       local.get $0
                                       v128.load offset=496
                                       br $assembly/utils/v128/getV128|inlined.1
                                      end
                                      local.get $0
                                      v128.load offset=512
                                      br $assembly/utils/v128/getV128|inlined.1
                                     end
                                     local.get $0
                                     v128.load offset=528
                                     br $assembly/utils/v128/getV128|inlined.1
                                    end
                                    local.get $0
                                    v128.load offset=544
                                    br $assembly/utils/v128/getV128|inlined.1
                                   end
                                   local.get $0
                                   v128.load offset=560
                                   br $assembly/utils/v128/getV128|inlined.1
                                  end
                                  local.get $0
                                  v128.load offset=576
                                  br $assembly/utils/v128/getV128|inlined.1
                                 end
                                 local.get $0
                                 v128.load offset=592
                                 br $assembly/utils/v128/getV128|inlined.1
                                end
                                local.get $0
                                v128.load offset=608
                                br $assembly/utils/v128/getV128|inlined.1
                               end
                               local.get $0
                               v128.load offset=624
                               br $assembly/utils/v128/getV128|inlined.1
                              end
                              local.get $0
                              v128.load offset=640
                              br $assembly/utils/v128/getV128|inlined.1
                             end
                             local.get $0
                             v128.load offset=656
                             br $assembly/utils/v128/getV128|inlined.1
                            end
                            local.get $0
                            v128.load offset=672
                            br $assembly/utils/v128/getV128|inlined.1
                           end
                           local.get $0
                           v128.load offset=688
                           br $assembly/utils/v128/getV128|inlined.1
                          end
                          local.get $0
                          v128.load offset=704
                          br $assembly/utils/v128/getV128|inlined.1
                         end
                         local.get $0
                         v128.load offset=720
                         br $assembly/utils/v128/getV128|inlined.1
                        end
                        local.get $0
                        v128.load offset=736
                        br $assembly/utils/v128/getV128|inlined.1
                       end
                       local.get $0
                       v128.load offset=752
                       br $assembly/utils/v128/getV128|inlined.1
                      end
                      local.get $0
                      v128.load offset=768
                      br $assembly/utils/v128/getV128|inlined.1
                     end
                     local.get $0
                     v128.load offset=784
                     br $assembly/utils/v128/getV128|inlined.1
                    end
                    local.get $0
                    v128.load offset=800
                    br $assembly/utils/v128/getV128|inlined.1
                   end
                   local.get $0
                   v128.load offset=816
                   br $assembly/utils/v128/getV128|inlined.1
                  end
                  local.get $0
                  v128.load offset=832
                  br $assembly/utils/v128/getV128|inlined.1
                 end
                 local.get $0
                 v128.load offset=848
                 br $assembly/utils/v128/getV128|inlined.1
                end
                local.get $0
                v128.load offset=864
                br $assembly/utils/v128/getV128|inlined.1
               end
               local.get $0
               v128.load offset=880
               br $assembly/utils/v128/getV128|inlined.1
              end
              local.get $0
              v128.load offset=896
              br $assembly/utils/v128/getV128|inlined.1
             end
             local.get $0
             v128.load offset=912
             br $assembly/utils/v128/getV128|inlined.1
            end
            local.get $0
            v128.load offset=928
            br $assembly/utils/v128/getV128|inlined.1
           end
           local.get $0
           v128.load offset=944
           br $assembly/utils/v128/getV128|inlined.1
          end
          local.get $0
          v128.load offset=960
          br $assembly/utils/v128/getV128|inlined.1
         end
         local.get $0
         v128.load offset=976
         br $assembly/utils/v128/getV128|inlined.1
        end
        local.get $0
        v128.load offset=992
        br $assembly/utils/v128/getV128|inlined.1
       end
       local.get $0
       v128.load offset=1008
      end
      local.tee $2
      i32.const 17
      i32x4.shr_u
      local.get $2
      i32.const 15
      i32x4.shl
      v128.or
      local.get $2
      i32.const 19
      i32x4.shr_u
      local.get $2
      i32.const 13
      i32x4.shl
      v128.or
      v128.xor
      local.get $2
      i32.const 10
      i32x4.shr_u
      v128.xor
      block $assembly/utils/v128/getV128|inlined.2 (result v128)
       block $case63|3
        block $case62|3
         block $case61|3
          block $case60|3
           block $case59|3
            block $case58|3
             block $case57|3
              block $case56|3
               block $case55|3
                block $case54|3
                 block $case53|3
                  block $case52|3
                   block $case51|3
                    block $case50|3
                     block $case49|3
                      block $case48|3
                       block $case47|3
                        block $case46|3
                         block $case45|3
                          block $case44|3
                           block $case43|3
                            block $case42|3
                             block $case41|3
                              block $case40|3
                               block $case39|3
                                block $case38|3
                                 block $case37|3
                                  block $case36|3
                                   block $case35|3
                                    block $case34|3
                                     block $case33|3
                                      block $case32|3
                                       block $case31|3
                                        block $case30|3
                                         block $case29|3
                                          block $case28|3
                                           block $case27|3
                                            block $case26|3
                                             block $case25|3
                                              block $case24|3
                                               block $case23|3
                                                block $case22|3
                                                 block $case21|3
                                                  block $case20|3
                                                   block $case19|3
                                                    block $case18|3
                                                     block $case17|3
                                                      block $case16|3
                                                       block $case15|3
                                                        block $case14|3
                                                         block $case13|3
                                                          block $case12|3
                                                           block $case11|3
                                                            block $case10|3
                                                             block $case9|3
                                                              block $case8|3
                                                               block $case7|3
                                                                block $case6|3
                                                                 block $case5|3
                                                                  block $case4|3
                                                                   block $case3|3
                                                                    block $case2|3
                                                                     block $case1|3
                                                                      block $case0|3
                                                                       global.get $assembly/simd/i
                                                                       i32.const 7
                                                                       i32.sub
                                                                       local.tee $3
                                                                       br_table $case0|3 $case1|3 $case2|3 $case3|3 $case4|3 $case5|3 $case6|3 $case7|3 $case8|3 $case9|3 $case10|3 $case11|3 $case12|3 $case13|3 $case14|3 $case15|3 $case16|3 $case17|3 $case18|3 $case19|3 $case20|3 $case21|3 $case22|3 $case23|3 $case24|3 $case25|3 $case26|3 $case27|3 $case28|3 $case29|3 $case30|3 $case31|3 $case32|3 $case33|3 $case34|3 $case35|3 $case36|3 $case37|3 $case38|3 $case39|3 $case40|3 $case41|3 $case42|3 $case43|3 $case44|3 $case45|3 $case46|3 $case47|3 $case48|3 $case49|3 $case50|3 $case51|3 $case52|3 $case53|3 $case54|3 $case55|3 $case56|3 $case57|3 $case58|3 $case59|3 $case60|3 $case61|3 $case62|3 $case63|3 $folding-inner0
                                                                      end
                                                                      local.get $0
                                                                      v128.load
                                                                      br $assembly/utils/v128/getV128|inlined.2
                                                                     end
                                                                     local.get $0
                                                                     v128.load offset=16
                                                                     br $assembly/utils/v128/getV128|inlined.2
                                                                    end
                                                                    local.get $0
                                                                    v128.load offset=32
                                                                    br $assembly/utils/v128/getV128|inlined.2
                                                                   end
                                                                   local.get $0
                                                                   v128.load offset=48
                                                                   br $assembly/utils/v128/getV128|inlined.2
                                                                  end
                                                                  local.get $0
                                                                  v128.load offset=64
                                                                  br $assembly/utils/v128/getV128|inlined.2
                                                                 end
                                                                 local.get $0
                                                                 v128.load offset=80
                                                                 br $assembly/utils/v128/getV128|inlined.2
                                                                end
                                                                local.get $0
                                                                v128.load offset=96
                                                                br $assembly/utils/v128/getV128|inlined.2
                                                               end
                                                               local.get $0
                                                               v128.load offset=112
                                                               br $assembly/utils/v128/getV128|inlined.2
                                                              end
                                                              local.get $0
                                                              v128.load offset=128
                                                              br $assembly/utils/v128/getV128|inlined.2
                                                             end
                                                             local.get $0
                                                             v128.load offset=144
                                                             br $assembly/utils/v128/getV128|inlined.2
                                                            end
                                                            local.get $0
                                                            v128.load offset=160
                                                            br $assembly/utils/v128/getV128|inlined.2
                                                           end
                                                           local.get $0
                                                           v128.load offset=176
                                                           br $assembly/utils/v128/getV128|inlined.2
                                                          end
                                                          local.get $0
                                                          v128.load offset=192
                                                          br $assembly/utils/v128/getV128|inlined.2
                                                         end
                                                         local.get $0
                                                         v128.load offset=208
                                                         br $assembly/utils/v128/getV128|inlined.2
                                                        end
                                                        local.get $0
                                                        v128.load offset=224
                                                        br $assembly/utils/v128/getV128|inlined.2
                                                       end
                                                       local.get $0
                                                       v128.load offset=240
                                                       br $assembly/utils/v128/getV128|inlined.2
                                                      end
                                                      local.get $0
                                                      v128.load offset=256
                                                      br $assembly/utils/v128/getV128|inlined.2
                                                     end
                                                     local.get $0
                                                     v128.load offset=272
                                                     br $assembly/utils/v128/getV128|inlined.2
                                                    end
                                                    local.get $0
                                                    v128.load offset=288
                                                    br $assembly/utils/v128/getV128|inlined.2
                                                   end
                                                   local.get $0
                                                   v128.load offset=304
                                                   br $assembly/utils/v128/getV128|inlined.2
                                                  end
                                                  local.get $0
                                                  v128.load offset=320
                                                  br $assembly/utils/v128/getV128|inlined.2
                                                 end
                                                 local.get $0
                                                 v128.load offset=336
                                                 br $assembly/utils/v128/getV128|inlined.2
                                                end
                                                local.get $0
                                                v128.load offset=352
                                                br $assembly/utils/v128/getV128|inlined.2
                                               end
                                               local.get $0
                                               v128.load offset=368
                                               br $assembly/utils/v128/getV128|inlined.2
                                              end
                                              local.get $0
                                              v128.load offset=384
                                              br $assembly/utils/v128/getV128|inlined.2
                                             end
                                             local.get $0
                                             v128.load offset=400
                                             br $assembly/utils/v128/getV128|inlined.2
                                            end
                                            local.get $0
                                            v128.load offset=416
                                            br $assembly/utils/v128/getV128|inlined.2
                                           end
                                           local.get $0
                                           v128.load offset=432
                                           br $assembly/utils/v128/getV128|inlined.2
                                          end
                                          local.get $0
                                          v128.load offset=448
                                          br $assembly/utils/v128/getV128|inlined.2
                                         end
                                         local.get $0
                                         v128.load offset=464
                                         br $assembly/utils/v128/getV128|inlined.2
                                        end
                                        local.get $0
                                        v128.load offset=480
                                        br $assembly/utils/v128/getV128|inlined.2
                                       end
                                       local.get $0
                                       v128.load offset=496
                                       br $assembly/utils/v128/getV128|inlined.2
                                      end
                                      local.get $0
                                      v128.load offset=512
                                      br $assembly/utils/v128/getV128|inlined.2
                                     end
                                     local.get $0
                                     v128.load offset=528
                                     br $assembly/utils/v128/getV128|inlined.2
                                    end
                                    local.get $0
                                    v128.load offset=544
                                    br $assembly/utils/v128/getV128|inlined.2
                                   end
                                   local.get $0
                                   v128.load offset=560
                                   br $assembly/utils/v128/getV128|inlined.2
                                  end
                                  local.get $0
                                  v128.load offset=576
                                  br $assembly/utils/v128/getV128|inlined.2
                                 end
                                 local.get $0
                                 v128.load offset=592
                                 br $assembly/utils/v128/getV128|inlined.2
                                end
                                local.get $0
                                v128.load offset=608
                                br $assembly/utils/v128/getV128|inlined.2
                               end
                               local.get $0
                               v128.load offset=624
                               br $assembly/utils/v128/getV128|inlined.2
                              end
                              local.get $0
                              v128.load offset=640
                              br $assembly/utils/v128/getV128|inlined.2
                             end
                             local.get $0
                             v128.load offset=656
                             br $assembly/utils/v128/getV128|inlined.2
                            end
                            local.get $0
                            v128.load offset=672
                            br $assembly/utils/v128/getV128|inlined.2
                           end
                           local.get $0
                           v128.load offset=688
                           br $assembly/utils/v128/getV128|inlined.2
                          end
                          local.get $0
                          v128.load offset=704
                          br $assembly/utils/v128/getV128|inlined.2
                         end
                         local.get $0
                         v128.load offset=720
                         br $assembly/utils/v128/getV128|inlined.2
                        end
                        local.get $0
                        v128.load offset=736
                        br $assembly/utils/v128/getV128|inlined.2
                       end
                       local.get $0
                       v128.load offset=752
                       br $assembly/utils/v128/getV128|inlined.2
                      end
                      local.get $0
                      v128.load offset=768
                      br $assembly/utils/v128/getV128|inlined.2
                     end
                     local.get $0
                     v128.load offset=784
                     br $assembly/utils/v128/getV128|inlined.2
                    end
                    local.get $0
                    v128.load offset=800
                    br $assembly/utils/v128/getV128|inlined.2
                   end
                   local.get $0
                   v128.load offset=816
                   br $assembly/utils/v128/getV128|inlined.2
                  end
                  local.get $0
                  v128.load offset=832
                  br $assembly/utils/v128/getV128|inlined.2
                 end
                 local.get $0
                 v128.load offset=848
                 br $assembly/utils/v128/getV128|inlined.2
                end
                local.get $0
                v128.load offset=864
                br $assembly/utils/v128/getV128|inlined.2
               end
               local.get $0
               v128.load offset=880
               br $assembly/utils/v128/getV128|inlined.2
              end
              local.get $0
              v128.load offset=896
              br $assembly/utils/v128/getV128|inlined.2
             end
             local.get $0
             v128.load offset=912
             br $assembly/utils/v128/getV128|inlined.2
            end
            local.get $0
            v128.load offset=928
            br $assembly/utils/v128/getV128|inlined.2
           end
           local.get $0
           v128.load offset=944
           br $assembly/utils/v128/getV128|inlined.2
          end
          local.get $0
          v128.load offset=960
          br $assembly/utils/v128/getV128|inlined.2
         end
         local.get $0
         v128.load offset=976
         br $assembly/utils/v128/getV128|inlined.2
        end
        local.get $0
        v128.load offset=992
        br $assembly/utils/v128/getV128|inlined.2
       end
       local.get $0
       v128.load offset=1008
      end
      i32x4.add
      block $assembly/utils/v128/getV128|inlined.3 (result v128)
       block $case63|4
        block $case62|4
         block $case61|4
          block $case60|4
           block $case59|4
            block $case58|4
             block $case57|4
              block $case56|4
               block $case55|4
                block $case54|4
                 block $case53|4
                  block $case52|4
                   block $case51|4
                    block $case50|4
                     block $case49|4
                      block $case48|4
                       block $case47|4
                        block $case46|4
                         block $case45|4
                          block $case44|4
                           block $case43|4
                            block $case42|4
                             block $case41|4
                              block $case40|4
                               block $case39|4
                                block $case38|4
                                 block $case37|4
                                  block $case36|4
                                   block $case35|4
                                    block $case34|4
                                     block $case33|4
                                      block $case32|4
                                       block $case31|4
                                        block $case30|4
                                         block $case29|4
                                          block $case28|4
                                           block $case27|4
                                            block $case26|4
                                             block $case25|4
                                              block $case24|4
                                               block $case23|4
                                                block $case22|4
                                                 block $case21|4
                                                  block $case20|4
                                                   block $case19|4
                                                    block $case18|4
                                                     block $case17|4
                                                      block $case16|4
                                                       block $case15|4
                                                        block $case14|4
                                                         block $case13|4
                                                          block $case12|4
                                                           block $case11|4
                                                            block $case10|4
                                                             block $case9|4
                                                              block $case8|4
                                                               block $case7|4
                                                                block $case6|4
                                                                 block $case5|4
                                                                  block $case4|4
                                                                   block $case3|4
                                                                    block $case2|4
                                                                     block $case1|4
                                                                      block $case0|4
                                                                       global.get $assembly/simd/i
                                                                       i32.const 15
                                                                       i32.sub
                                                                       local.tee $3
                                                                       br_table $case0|4 $case1|4 $case2|4 $case3|4 $case4|4 $case5|4 $case6|4 $case7|4 $case8|4 $case9|4 $case10|4 $case11|4 $case12|4 $case13|4 $case14|4 $case15|4 $case16|4 $case17|4 $case18|4 $case19|4 $case20|4 $case21|4 $case22|4 $case23|4 $case24|4 $case25|4 $case26|4 $case27|4 $case28|4 $case29|4 $case30|4 $case31|4 $case32|4 $case33|4 $case34|4 $case35|4 $case36|4 $case37|4 $case38|4 $case39|4 $case40|4 $case41|4 $case42|4 $case43|4 $case44|4 $case45|4 $case46|4 $case47|4 $case48|4 $case49|4 $case50|4 $case51|4 $case52|4 $case53|4 $case54|4 $case55|4 $case56|4 $case57|4 $case58|4 $case59|4 $case60|4 $case61|4 $case62|4 $case63|4 $folding-inner0
                                                                      end
                                                                      local.get $0
                                                                      v128.load
                                                                      br $assembly/utils/v128/getV128|inlined.3
                                                                     end
                                                                     local.get $0
                                                                     v128.load offset=16
                                                                     br $assembly/utils/v128/getV128|inlined.3
                                                                    end
                                                                    local.get $0
                                                                    v128.load offset=32
                                                                    br $assembly/utils/v128/getV128|inlined.3
                                                                   end
                                                                   local.get $0
                                                                   v128.load offset=48
                                                                   br $assembly/utils/v128/getV128|inlined.3
                                                                  end
                                                                  local.get $0
                                                                  v128.load offset=64
                                                                  br $assembly/utils/v128/getV128|inlined.3
                                                                 end
                                                                 local.get $0
                                                                 v128.load offset=80
                                                                 br $assembly/utils/v128/getV128|inlined.3
                                                                end
                                                                local.get $0
                                                                v128.load offset=96
                                                                br $assembly/utils/v128/getV128|inlined.3
                                                               end
                                                               local.get $0
                                                               v128.load offset=112
                                                               br $assembly/utils/v128/getV128|inlined.3
                                                              end
                                                              local.get $0
                                                              v128.load offset=128
                                                              br $assembly/utils/v128/getV128|inlined.3
                                                             end
                                                             local.get $0
                                                             v128.load offset=144
                                                             br $assembly/utils/v128/getV128|inlined.3
                                                            end
                                                            local.get $0
                                                            v128.load offset=160
                                                            br $assembly/utils/v128/getV128|inlined.3
                                                           end
                                                           local.get $0
                                                           v128.load offset=176
                                                           br $assembly/utils/v128/getV128|inlined.3
                                                          end
                                                          local.get $0
                                                          v128.load offset=192
                                                          br $assembly/utils/v128/getV128|inlined.3
                                                         end
                                                         local.get $0
                                                         v128.load offset=208
                                                         br $assembly/utils/v128/getV128|inlined.3
                                                        end
                                                        local.get $0
                                                        v128.load offset=224
                                                        br $assembly/utils/v128/getV128|inlined.3
                                                       end
                                                       local.get $0
                                                       v128.load offset=240
                                                       br $assembly/utils/v128/getV128|inlined.3
                                                      end
                                                      local.get $0
                                                      v128.load offset=256
                                                      br $assembly/utils/v128/getV128|inlined.3
                                                     end
                                                     local.get $0
                                                     v128.load offset=272
                                                     br $assembly/utils/v128/getV128|inlined.3
                                                    end
                                                    local.get $0
                                                    v128.load offset=288
                                                    br $assembly/utils/v128/getV128|inlined.3
                                                   end
                                                   local.get $0
                                                   v128.load offset=304
                                                   br $assembly/utils/v128/getV128|inlined.3
                                                  end
                                                  local.get $0
                                                  v128.load offset=320
                                                  br $assembly/utils/v128/getV128|inlined.3
                                                 end
                                                 local.get $0
                                                 v128.load offset=336
                                                 br $assembly/utils/v128/getV128|inlined.3
                                                end
                                                local.get $0
                                                v128.load offset=352
                                                br $assembly/utils/v128/getV128|inlined.3
                                               end
                                               local.get $0
                                               v128.load offset=368
                                               br $assembly/utils/v128/getV128|inlined.3
                                              end
                                              local.get $0
                                              v128.load offset=384
                                              br $assembly/utils/v128/getV128|inlined.3
                                             end
                                             local.get $0
                                             v128.load offset=400
                                             br $assembly/utils/v128/getV128|inlined.3
                                            end
                                            local.get $0
                                            v128.load offset=416
                                            br $assembly/utils/v128/getV128|inlined.3
                                           end
                                           local.get $0
                                           v128.load offset=432
                                           br $assembly/utils/v128/getV128|inlined.3
                                          end
                                          local.get $0
                                          v128.load offset=448
                                          br $assembly/utils/v128/getV128|inlined.3
                                         end
                                         local.get $0
                                         v128.load offset=464
                                         br $assembly/utils/v128/getV128|inlined.3
                                        end
                                        local.get $0
                                        v128.load offset=480
                                        br $assembly/utils/v128/getV128|inlined.3
                                       end
                                       local.get $0
                                       v128.load offset=496
                                       br $assembly/utils/v128/getV128|inlined.3
                                      end
                                      local.get $0
                                      v128.load offset=512
                                      br $assembly/utils/v128/getV128|inlined.3
                                     end
                                     local.get $0
                                     v128.load offset=528
                                     br $assembly/utils/v128/getV128|inlined.3
                                    end
                                    local.get $0
                                    v128.load offset=544
                                    br $assembly/utils/v128/getV128|inlined.3
                                   end
                                   local.get $0
                                   v128.load offset=560
                                   br $assembly/utils/v128/getV128|inlined.3
                                  end
                                  local.get $0
                                  v128.load offset=576
                                  br $assembly/utils/v128/getV128|inlined.3
                                 end
                                 local.get $0
                                 v128.load offset=592
                                 br $assembly/utils/v128/getV128|inlined.3
                                end
                                local.get $0
                                v128.load offset=608
                                br $assembly/utils/v128/getV128|inlined.3
                               end
                               local.get $0
                               v128.load offset=624
                               br $assembly/utils/v128/getV128|inlined.3
                              end
                              local.get $0
                              v128.load offset=640
                              br $assembly/utils/v128/getV128|inlined.3
                             end
                             local.get $0
                             v128.load offset=656
                             br $assembly/utils/v128/getV128|inlined.3
                            end
                            local.get $0
                            v128.load offset=672
                            br $assembly/utils/v128/getV128|inlined.3
                           end
                           local.get $0
                           v128.load offset=688
                           br $assembly/utils/v128/getV128|inlined.3
                          end
                          local.get $0
                          v128.load offset=704
                          br $assembly/utils/v128/getV128|inlined.3
                         end
                         local.get $0
                         v128.load offset=720
                         br $assembly/utils/v128/getV128|inlined.3
                        end
                        local.get $0
                        v128.load offset=736
                        br $assembly/utils/v128/getV128|inlined.3
                       end
                       local.get $0
                       v128.load offset=752
                       br $assembly/utils/v128/getV128|inlined.3
                      end
                      local.get $0
                      v128.load offset=768
                      br $assembly/utils/v128/getV128|inlined.3
                     end
                     local.get $0
                     v128.load offset=784
                     br $assembly/utils/v128/getV128|inlined.3
                    end
                    local.get $0
                    v128.load offset=800
                    br $assembly/utils/v128/getV128|inlined.3
                   end
                   local.get $0
                   v128.load offset=816
                   br $assembly/utils/v128/getV128|inlined.3
                  end
                  local.get $0
                  v128.load offset=832
                  br $assembly/utils/v128/getV128|inlined.3
                 end
                 local.get $0
                 v128.load offset=848
                 br $assembly/utils/v128/getV128|inlined.3
                end
                local.get $0
                v128.load offset=864
                br $assembly/utils/v128/getV128|inlined.3
               end
               local.get $0
               v128.load offset=880
               br $assembly/utils/v128/getV128|inlined.3
              end
              local.get $0
              v128.load offset=896
              br $assembly/utils/v128/getV128|inlined.3
             end
             local.get $0
             v128.load offset=912
             br $assembly/utils/v128/getV128|inlined.3
            end
            local.get $0
            v128.load offset=928
            br $assembly/utils/v128/getV128|inlined.3
           end
           local.get $0
           v128.load offset=944
           br $assembly/utils/v128/getV128|inlined.3
          end
          local.get $0
          v128.load offset=960
          br $assembly/utils/v128/getV128|inlined.3
         end
         local.get $0
         v128.load offset=976
         br $assembly/utils/v128/getV128|inlined.3
        end
        local.get $0
        v128.load offset=992
        br $assembly/utils/v128/getV128|inlined.3
       end
       local.get $0
       v128.load offset=1008
      end
      local.tee $2
      i32.const 7
      i32x4.shr_u
      local.get $2
      i32.const 25
      i32x4.shl
      v128.or
      local.get $2
      i32.const 18
      i32x4.shr_u
      local.get $2
      i32.const 14
      i32x4.shl
      v128.or
      v128.xor
      local.get $2
      i32.const 3
      i32x4.shr_u
      v128.xor
      i32x4.add
      block $assembly/utils/v128/getV128|inlined.4 (result v128)
       block $case63|5
        block $case62|5
         block $case61|5
          block $case60|5
           block $case59|5
            block $case58|5
             block $case57|5
              block $case56|5
               block $case55|5
                block $case54|5
                 block $case53|5
                  block $case52|5
                   block $case51|5
                    block $case50|5
                     block $case49|5
                      block $case48|5
                       block $case47|5
                        block $case46|5
                         block $case45|5
                          block $case44|5
                           block $case43|5
                            block $case42|5
                             block $case41|5
                              block $case40|5
                               block $case39|5
                                block $case38|5
                                 block $case37|5
                                  block $case36|5
                                   block $case35|5
                                    block $case34|5
                                     block $case33|5
                                      block $case32|5
                                       block $case31|5
                                        block $case30|5
                                         block $case29|5
                                          block $case28|5
                                           block $case27|5
                                            block $case26|5
                                             block $case25|5
                                              block $case24|5
                                               block $case23|5
                                                block $case22|5
                                                 block $case21|5
                                                  block $case20|5
                                                   block $case19|5
                                                    block $case18|5
                                                     block $case17|5
                                                      block $case16|5
                                                       block $case15|5
                                                        block $case14|5
                                                         block $case13|5
                                                          block $case12|5
                                                           block $case11|5
                                                            block $case10|5
                                                             block $case9|5
                                                              block $case8|5
                                                               block $case7|5
                                                                block $case6|5
                                                                 block $case5|5
                                                                  block $case4|5
                                                                   block $case3|5
                                                                    block $case2|5
                                                                     block $case1|5
                                                                      block $case0|5
                                                                       global.get $assembly/simd/i
                                                                       i32.const 16
                                                                       i32.sub
                                                                       local.tee $3
                                                                       br_table $case0|5 $case1|5 $case2|5 $case3|5 $case4|5 $case5|5 $case6|5 $case7|5 $case8|5 $case9|5 $case10|5 $case11|5 $case12|5 $case13|5 $case14|5 $case15|5 $case16|5 $case17|5 $case18|5 $case19|5 $case20|5 $case21|5 $case22|5 $case23|5 $case24|5 $case25|5 $case26|5 $case27|5 $case28|5 $case29|5 $case30|5 $case31|5 $case32|5 $case33|5 $case34|5 $case35|5 $case36|5 $case37|5 $case38|5 $case39|5 $case40|5 $case41|5 $case42|5 $case43|5 $case44|5 $case45|5 $case46|5 $case47|5 $case48|5 $case49|5 $case50|5 $case51|5 $case52|5 $case53|5 $case54|5 $case55|5 $case56|5 $case57|5 $case58|5 $case59|5 $case60|5 $case61|5 $case62|5 $case63|5 $folding-inner0
                                                                      end
                                                                      local.get $0
                                                                      v128.load
                                                                      br $assembly/utils/v128/getV128|inlined.4
                                                                     end
                                                                     local.get $0
                                                                     v128.load offset=16
                                                                     br $assembly/utils/v128/getV128|inlined.4
                                                                    end
                                                                    local.get $0
                                                                    v128.load offset=32
                                                                    br $assembly/utils/v128/getV128|inlined.4
                                                                   end
                                                                   local.get $0
                                                                   v128.load offset=48
                                                                   br $assembly/utils/v128/getV128|inlined.4
                                                                  end
                                                                  local.get $0
                                                                  v128.load offset=64
                                                                  br $assembly/utils/v128/getV128|inlined.4
                                                                 end
                                                                 local.get $0
                                                                 v128.load offset=80
                                                                 br $assembly/utils/v128/getV128|inlined.4
                                                                end
                                                                local.get $0
                                                                v128.load offset=96
                                                                br $assembly/utils/v128/getV128|inlined.4
                                                               end
                                                               local.get $0
                                                               v128.load offset=112
                                                               br $assembly/utils/v128/getV128|inlined.4
                                                              end
                                                              local.get $0
                                                              v128.load offset=128
                                                              br $assembly/utils/v128/getV128|inlined.4
                                                             end
                                                             local.get $0
                                                             v128.load offset=144
                                                             br $assembly/utils/v128/getV128|inlined.4
                                                            end
                                                            local.get $0
                                                            v128.load offset=160
                                                            br $assembly/utils/v128/getV128|inlined.4
                                                           end
                                                           local.get $0
                                                           v128.load offset=176
                                                           br $assembly/utils/v128/getV128|inlined.4
                                                          end
                                                          local.get $0
                                                          v128.load offset=192
                                                          br $assembly/utils/v128/getV128|inlined.4
                                                         end
                                                         local.get $0
                                                         v128.load offset=208
                                                         br $assembly/utils/v128/getV128|inlined.4
                                                        end
                                                        local.get $0
                                                        v128.load offset=224
                                                        br $assembly/utils/v128/getV128|inlined.4
                                                       end
                                                       local.get $0
                                                       v128.load offset=240
                                                       br $assembly/utils/v128/getV128|inlined.4
                                                      end
                                                      local.get $0
                                                      v128.load offset=256
                                                      br $assembly/utils/v128/getV128|inlined.4
                                                     end
                                                     local.get $0
                                                     v128.load offset=272
                                                     br $assembly/utils/v128/getV128|inlined.4
                                                    end
                                                    local.get $0
                                                    v128.load offset=288
                                                    br $assembly/utils/v128/getV128|inlined.4
                                                   end
                                                   local.get $0
                                                   v128.load offset=304
                                                   br $assembly/utils/v128/getV128|inlined.4
                                                  end
                                                  local.get $0
                                                  v128.load offset=320
                                                  br $assembly/utils/v128/getV128|inlined.4
                                                 end
                                                 local.get $0
                                                 v128.load offset=336
                                                 br $assembly/utils/v128/getV128|inlined.4
                                                end
                                                local.get $0
                                                v128.load offset=352
                                                br $assembly/utils/v128/getV128|inlined.4
                                               end
                                               local.get $0
                                               v128.load offset=368
                                               br $assembly/utils/v128/getV128|inlined.4
                                              end
                                              local.get $0
                                              v128.load offset=384
                                              br $assembly/utils/v128/getV128|inlined.4
                                             end
                                             local.get $0
                                             v128.load offset=400
                                             br $assembly/utils/v128/getV128|inlined.4
                                            end
                                            local.get $0
                                            v128.load offset=416
                                            br $assembly/utils/v128/getV128|inlined.4
                                           end
                                           local.get $0
                                           v128.load offset=432
                                           br $assembly/utils/v128/getV128|inlined.4
                                          end
                                          local.get $0
                                          v128.load offset=448
                                          br $assembly/utils/v128/getV128|inlined.4
                                         end
                                         local.get $0
                                         v128.load offset=464
                                         br $assembly/utils/v128/getV128|inlined.4
                                        end
                                        local.get $0
                                        v128.load offset=480
                                        br $assembly/utils/v128/getV128|inlined.4
                                       end
                                       local.get $0
                                       v128.load offset=496
                                       br $assembly/utils/v128/getV128|inlined.4
                                      end
                                      local.get $0
                                      v128.load offset=512
                                      br $assembly/utils/v128/getV128|inlined.4
                                     end
                                     local.get $0
                                     v128.load offset=528
                                     br $assembly/utils/v128/getV128|inlined.4
                                    end
                                    local.get $0
                                    v128.load offset=544
                                    br $assembly/utils/v128/getV128|inlined.4
                                   end
                                   local.get $0
                                   v128.load offset=560
                                   br $assembly/utils/v128/getV128|inlined.4
                                  end
                                  local.get $0
                                  v128.load offset=576
                                  br $assembly/utils/v128/getV128|inlined.4
                                 end
                                 local.get $0
                                 v128.load offset=592
                                 br $assembly/utils/v128/getV128|inlined.4
                                end
                                local.get $0
                                v128.load offset=608
                                br $assembly/utils/v128/getV128|inlined.4
                               end
                               local.get $0
                               v128.load offset=624
                               br $assembly/utils/v128/getV128|inlined.4
                              end
                              local.get $0
                              v128.load offset=640
                              br $assembly/utils/v128/getV128|inlined.4
                             end
                             local.get $0
                             v128.load offset=656
                             br $assembly/utils/v128/getV128|inlined.4
                            end
                            local.get $0
                            v128.load offset=672
                            br $assembly/utils/v128/getV128|inlined.4
                           end
                           local.get $0
                           v128.load offset=688
                           br $assembly/utils/v128/getV128|inlined.4
                          end
                          local.get $0
                          v128.load offset=704
                          br $assembly/utils/v128/getV128|inlined.4
                         end
                         local.get $0
                         v128.load offset=720
                         br $assembly/utils/v128/getV128|inlined.4
                        end
                        local.get $0
                        v128.load offset=736
                        br $assembly/utils/v128/getV128|inlined.4
                       end
                       local.get $0
                       v128.load offset=752
                       br $assembly/utils/v128/getV128|inlined.4
                      end
                      local.get $0
                      v128.load offset=768
                      br $assembly/utils/v128/getV128|inlined.4
                     end
                     local.get $0
                     v128.load offset=784
                     br $assembly/utils/v128/getV128|inlined.4
                    end
                    local.get $0
                    v128.load offset=800
                    br $assembly/utils/v128/getV128|inlined.4
                   end
                   local.get $0
                   v128.load offset=816
                   br $assembly/utils/v128/getV128|inlined.4
                  end
                  local.get $0
                  v128.load offset=832
                  br $assembly/utils/v128/getV128|inlined.4
                 end
                 local.get $0
                 v128.load offset=848
                 br $assembly/utils/v128/getV128|inlined.4
                end
                local.get $0
                v128.load offset=864
                br $assembly/utils/v128/getV128|inlined.4
               end
               local.get $0
               v128.load offset=880
               br $assembly/utils/v128/getV128|inlined.4
              end
              local.get $0
              v128.load offset=896
              br $assembly/utils/v128/getV128|inlined.4
             end
             local.get $0
             v128.load offset=912
             br $assembly/utils/v128/getV128|inlined.4
            end
            local.get $0
            v128.load offset=928
            br $assembly/utils/v128/getV128|inlined.4
           end
           local.get $0
           v128.load offset=944
           br $assembly/utils/v128/getV128|inlined.4
          end
          local.get $0
          v128.load offset=960
          br $assembly/utils/v128/getV128|inlined.4
         end
         local.get $0
         v128.load offset=976
         br $assembly/utils/v128/getV128|inlined.4
        end
        local.get $0
        v128.load offset=992
        br $assembly/utils/v128/getV128|inlined.4
       end
       local.get $0
       v128.load offset=1008
      end
      i32x4.add
     end
     global.set $assembly/simd/tmpW
     global.get $assembly/simd/i
     i32.const 16
     i32.ge_s
     if
      global.get $assembly/simd/tmpW
      local.set $2
      block $break|6
       block $case64|6
        block $case63|6
         block $case62|6
          block $case61|6
           block $case60|6
            block $case59|6
             block $case58|6
              block $case57|6
               block $case56|6
                block $case55|6
                 block $case54|6
                  block $case53|6
                   block $case52|6
                    block $case51|6
                     block $case50|6
                      block $case49|6
                       block $case48|6
                        block $case47|6
                         block $case46|6
                          block $case45|6
                           block $case44|6
                            block $case43|6
                             block $case42|6
                              block $case41|6
                               block $case40|6
                                block $case39|6
                                 block $case38|6
                                  block $case37|6
                                   block $case36|6
                                    block $case35|6
                                     block $case34|6
                                      block $case33|6
                                       block $case32|6
                                        block $case31|6
                                         block $case30|6
                                          block $case29|6
                                           block $case28|6
                                            block $case27|6
                                             block $case26|6
                                              block $case25|6
                                               block $case24|6
                                                block $case23|6
                                                 block $case22|6
                                                  block $case21|6
                                                   block $case20|6
                                                    block $case19|6
                                                     block $case18|6
                                                      block $case17|6
                                                       block $case16|6
                                                        block $case15|6
                                                         block $case14|6
                                                          block $case13|6
                                                           block $case12|6
                                                            block $case11|6
                                                             block $case10|6
                                                              block $case9|6
                                                               block $case8|6
                                                                block $case7|6
                                                                 block $case6|6
                                                                  block $case5|6
                                                                   block $case4|6
                                                                    block $case3|6
                                                                     block $case2|6
                                                                      block $case1|6
                                                                       block $case0|6
                                                                        global.get $assembly/simd/i
                                                                        local.tee $3
                                                                        br_table $case0|6 $case1|6 $case2|6 $case3|6 $case4|6 $case5|6 $case6|6 $case7|6 $case8|6 $case9|6 $case10|6 $case11|6 $case12|6 $case13|6 $case14|6 $case15|6 $case16|6 $case17|6 $case18|6 $case19|6 $case20|6 $case21|6 $case22|6 $case23|6 $case24|6 $case25|6 $case26|6 $case27|6 $case28|6 $case29|6 $case30|6 $case31|6 $case32|6 $case33|6 $case34|6 $case35|6 $case36|6 $case37|6 $case38|6 $case39|6 $case40|6 $case41|6 $case42|6 $case43|6 $case44|6 $case45|6 $case46|6 $case47|6 $case48|6 $case49|6 $case50|6 $case51|6 $case52|6 $case53|6 $case54|6 $case55|6 $case56|6 $case57|6 $case58|6 $case59|6 $case60|6 $case61|6 $case62|6 $case63|6 $case64|6
                                                                       end
                                                                       local.get $0
                                                                       local.get $2
                                                                       v128.store
                                                                       br $break|6
                                                                      end
                                                                      local.get $0
                                                                      local.get $2
                                                                      v128.store offset=16
                                                                      br $break|6
                                                                     end
                                                                     local.get $0
                                                                     local.get $2
                                                                     v128.store offset=32
                                                                     br $break|6
                                                                    end
                                                                    local.get $0
                                                                    local.get $2
                                                                    v128.store offset=48
                                                                    br $break|6
                                                                   end
                                                                   local.get $0
                                                                   local.get $2
                                                                   v128.store offset=64
                                                                   br $break|6
                                                                  end
                                                                  local.get $0
                                                                  local.get $2
                                                                  v128.store offset=80
                                                                  br $break|6
                                                                 end
                                                                 local.get $0
                                                                 local.get $2
                                                                 v128.store offset=96
                                                                 br $break|6
                                                                end
                                                                local.get $0
                                                                local.get $2
                                                                v128.store offset=112
                                                                br $break|6
                                                               end
                                                               local.get $0
                                                               local.get $2
                                                               v128.store offset=128
                                                               br $break|6
                                                              end
                                                              local.get $0
                                                              local.get $2
                                                              v128.store offset=144
                                                              br $break|6
                                                             end
                                                             local.get $0
                                                             local.get $2
                                                             v128.store offset=160
                                                             br $break|6
                                                            end
                                                            local.get $0
                                                            local.get $2
                                                            v128.store offset=176
                                                            br $break|6
                                                           end
                                                           local.get $0
                                                           local.get $2
                                                           v128.store offset=192
                                                           br $break|6
                                                          end
                                                          local.get $0
                                                          local.get $2
                                                          v128.store offset=208
                                                          br $break|6
                                                         end
                                                         local.get $0
                                                         local.get $2
                                                         v128.store offset=224
                                                         br $break|6
                                                        end
                                                        local.get $0
                                                        local.get $2
                                                        v128.store offset=240
                                                        br $break|6
                                                       end
                                                       local.get $0
                                                       local.get $2
                                                       v128.store offset=256
                                                       br $break|6
                                                      end
                                                      local.get $0
                                                      local.get $2
                                                      v128.store offset=272
                                                      br $break|6
                                                     end
                                                     local.get $0
                                                     local.get $2
                                                     v128.store offset=288
                                                     br $break|6
                                                    end
                                                    local.get $0
                                                    local.get $2
                                                    v128.store offset=304
                                                    br $break|6
                                                   end
                                                   local.get $0
                                                   local.get $2
                                                   v128.store offset=320
                                                   br $break|6
                                                  end
                                                  local.get $0
                                                  local.get $2
                                                  v128.store offset=336
                                                  br $break|6
                                                 end
                                                 local.get $0
                                                 local.get $2
                                                 v128.store offset=352
                                                 br $break|6
                                                end
                                                local.get $0
                                                local.get $2
                                                v128.store offset=368
                                                br $break|6
                                               end
                                               local.get $0
                                               local.get $2
                                               v128.store offset=384
                                               br $break|6
                                              end
                                              local.get $0
                                              local.get $2
                                              v128.store offset=400
                                              br $break|6
                                             end
                                             local.get $0
                                             local.get $2
                                             v128.store offset=416
                                             br $break|6
                                            end
                                            local.get $0
                                            local.get $2
                                            v128.store offset=432
                                            br $break|6
                                           end
                                           local.get $0
                                           local.get $2
                                           v128.store offset=448
                                           br $break|6
                                          end
                                          local.get $0
                                          local.get $2
                                          v128.store offset=464
                                          br $break|6
                                         end
                                         local.get $0
                                         local.get $2
                                         v128.store offset=480
                                         br $break|6
                                        end
                                        local.get $0
                                        local.get $2
                                        v128.store offset=496
                                        br $break|6
                                       end
                                       local.get $0
                                       local.get $2
                                       v128.store offset=512
                                       br $break|6
                                      end
                                      local.get $0
                                      local.get $2
                                      v128.store offset=528
                                      br $break|6
                                     end
                                     local.get $0
                                     local.get $2
                                     v128.store offset=544
                                     br $break|6
                                    end
                                    local.get $0
                                    local.get $2
                                    v128.store offset=560
                                    br $break|6
                                   end
                                   local.get $0
                                   local.get $2
                                   v128.store offset=576
                                   br $break|6
                                  end
                                  local.get $0
                                  local.get $2
                                  v128.store offset=592
                                  br $break|6
                                 end
                                 local.get $0
                                 local.get $2
                                 v128.store offset=608
                                 br $break|6
                                end
                                local.get $0
                                local.get $2
                                v128.store offset=624
                                br $break|6
                               end
                               local.get $0
                               local.get $2
                               v128.store offset=640
                               br $break|6
                              end
                              local.get $0
                              local.get $2
                              v128.store offset=656
                              br $break|6
                             end
                             local.get $0
                             local.get $2
                             v128.store offset=672
                             br $break|6
                            end
                            local.get $0
                            local.get $2
                            v128.store offset=688
                            br $break|6
                           end
                           local.get $0
                           local.get $2
                           v128.store offset=704
                           br $break|6
                          end
                          local.get $0
                          local.get $2
                          v128.store offset=720
                          br $break|6
                         end
                         local.get $0
                         local.get $2
                         v128.store offset=736
                         br $break|6
                        end
                        local.get $0
                        local.get $2
                        v128.store offset=752
                        br $break|6
                       end
                       local.get $0
                       local.get $2
                       v128.store offset=768
                       br $break|6
                      end
                      local.get $0
                      local.get $2
                      v128.store offset=784
                      br $break|6
                     end
                     local.get $0
                     local.get $2
                     v128.store offset=800
                     br $break|6
                    end
                    local.get $0
                    local.get $2
                    v128.store offset=816
                    br $break|6
                   end
                   local.get $0
                   local.get $2
                   v128.store offset=832
                   br $break|6
                  end
                  local.get $0
                  local.get $2
                  v128.store offset=848
                  br $break|6
                 end
                 local.get $0
                 local.get $2
                 v128.store offset=864
                 br $break|6
                end
                local.get $0
                local.get $2
                v128.store offset=880
                br $break|6
               end
               local.get $0
               local.get $2
               v128.store offset=896
               br $break|6
              end
              local.get $0
              local.get $2
              v128.store offset=912
              br $break|6
             end
             local.get $0
             local.get $2
             v128.store offset=928
             br $break|6
            end
            local.get $0
            local.get $2
            v128.store offset=944
            br $break|6
           end
           local.get $0
           local.get $2
           v128.store offset=960
           br $break|6
          end
          local.get $0
          local.get $2
          v128.store offset=976
          br $break|6
         end
         local.get $0
         local.get $2
         v128.store offset=992
         br $break|6
        end
        local.get $0
        local.get $2
        v128.store offset=1008
        br $break|6
       end
       i32.const 2496
       local.get $3
       call $~lib/util/number/itoa32
       call $~lib/string/String#concat
       i32.const 2624
       i32.const 201
       i32.const 7
       call $~lib/builtins/abort
       unreachable
      end
     end
     global.get $assembly/simd/hV128
     global.get $assembly/simd/eV128
     local.tee $2
     i32.const 6
     i32x4.shr_u
     local.get $2
     i32.const 26
     i32x4.shl
     v128.or
     local.get $2
     i32.const 11
     i32x4.shr_u
     local.get $2
     i32.const 21
     i32x4.shl
     v128.or
     v128.xor
     local.get $2
     i32.const 25
     i32x4.shr_u
     local.get $2
     i32.const 7
     i32x4.shl
     v128.or
     v128.xor
     i32x4.add
     global.get $assembly/simd/eV128
     local.tee $2
     global.get $assembly/simd/fV128
     v128.and
     local.get $2
     v128.not
     global.get $assembly/simd/gV128
     v128.and
     v128.xor
     i32x4.add
     local.set $4
     global.get $assembly/simd/kV128Ptr
     local.set $3
     block $assembly/utils/v128/getV128|inlined.5
      block $case64|7
       block $case63|7
        block $case62|7
         block $case61|7
          block $case60|7
           block $case59|7
            block $case58|7
             block $case57|7
              block $case56|7
               block $case55|7
                block $case54|7
                 block $case53|7
                  block $case52|7
                   block $case51|7
                    block $case50|7
                     block $case49|7
                      block $case48|7
                       block $case47|7
                        block $case46|7
                         block $case45|7
                          block $case44|7
                           block $case43|7
                            block $case42|7
                             block $case41|7
                              block $case40|7
                               block $case39|7
                                block $case38|7
                                 block $case37|7
                                  block $case36|7
                                   block $case35|7
                                    block $case34|7
                                     block $case33|7
                                      block $case32|7
                                       block $case31|7
                                        block $case30|7
                                         block $case29|7
                                          block $case28|7
                                           block $case27|7
                                            block $case26|7
                                             block $case25|7
                                              block $case24|7
                                               block $case23|7
                                                block $case22|7
                                                 block $case21|7
                                                  block $case20|7
                                                   block $case19|7
                                                    block $case18|7
                                                     block $case17|7
                                                      block $case16|7
                                                       block $case15|7
                                                        block $case14|7
                                                         block $case13|7
                                                          block $case12|7
                                                           block $case11|7
                                                            block $case10|7
                                                             block $case9|7
                                                              block $case8|7
                                                               block $case7|7
                                                                block $case6|7
                                                                 block $case5|7
                                                                  block $case4|7
                                                                   block $case3|7
                                                                    block $case2|7
                                                                     block $case1|7
                                                                      block $case0|7
                                                                       global.get $assembly/simd/i
                                                                       local.tee $5
                                                                       br_table $case0|7 $case1|7 $case2|7 $case3|7 $case4|7 $case5|7 $case6|7 $case7|7 $case8|7 $case9|7 $case10|7 $case11|7 $case12|7 $case13|7 $case14|7 $case15|7 $case16|7 $case17|7 $case18|7 $case19|7 $case20|7 $case21|7 $case22|7 $case23|7 $case24|7 $case25|7 $case26|7 $case27|7 $case28|7 $case29|7 $case30|7 $case31|7 $case32|7 $case33|7 $case34|7 $case35|7 $case36|7 $case37|7 $case38|7 $case39|7 $case40|7 $case41|7 $case42|7 $case43|7 $case44|7 $case45|7 $case46|7 $case47|7 $case48|7 $case49|7 $case50|7 $case51|7 $case52|7 $case53|7 $case54|7 $case55|7 $case56|7 $case57|7 $case58|7 $case59|7 $case60|7 $case61|7 $case62|7 $case63|7 $case64|7
                                                                      end
                                                                      local.get $3
                                                                      v128.load
                                                                      local.set $2
                                                                      br $assembly/utils/v128/getV128|inlined.5
                                                                     end
                                                                     local.get $3
                                                                     v128.load offset=16
                                                                     local.set $2
                                                                     br $assembly/utils/v128/getV128|inlined.5
                                                                    end
                                                                    local.get $3
                                                                    v128.load offset=32
                                                                    local.set $2
                                                                    br $assembly/utils/v128/getV128|inlined.5
                                                                   end
                                                                   local.get $3
                                                                   v128.load offset=48
                                                                   local.set $2
                                                                   br $assembly/utils/v128/getV128|inlined.5
                                                                  end
                                                                  local.get $3
                                                                  v128.load offset=64
                                                                  local.set $2
                                                                  br $assembly/utils/v128/getV128|inlined.5
                                                                 end
                                                                 local.get $3
                                                                 v128.load offset=80
                                                                 local.set $2
                                                                 br $assembly/utils/v128/getV128|inlined.5
                                                                end
                                                                local.get $3
                                                                v128.load offset=96
                                                                local.set $2
                                                                br $assembly/utils/v128/getV128|inlined.5
                                                               end
                                                               local.get $3
                                                               v128.load offset=112
                                                               local.set $2
                                                               br $assembly/utils/v128/getV128|inlined.5
                                                              end
                                                              local.get $3
                                                              v128.load offset=128
                                                              local.set $2
                                                              br $assembly/utils/v128/getV128|inlined.5
                                                             end
                                                             local.get $3
                                                             v128.load offset=144
                                                             local.set $2
                                                             br $assembly/utils/v128/getV128|inlined.5
                                                            end
                                                            local.get $3
                                                            v128.load offset=160
                                                            local.set $2
                                                            br $assembly/utils/v128/getV128|inlined.5
                                                           end
                                                           local.get $3
                                                           v128.load offset=176
                                                           local.set $2
                                                           br $assembly/utils/v128/getV128|inlined.5
                                                          end
                                                          local.get $3
                                                          v128.load offset=192
                                                          local.set $2
                                                          br $assembly/utils/v128/getV128|inlined.5
                                                         end
                                                         local.get $3
                                                         v128.load offset=208
                                                         local.set $2
                                                         br $assembly/utils/v128/getV128|inlined.5
                                                        end
                                                        local.get $3
                                                        v128.load offset=224
                                                        local.set $2
                                                        br $assembly/utils/v128/getV128|inlined.5
                                                       end
                                                       local.get $3
                                                       v128.load offset=240
                                                       local.set $2
                                                       br $assembly/utils/v128/getV128|inlined.5
                                                      end
                                                      local.get $3
                                                      v128.load offset=256
                                                      local.set $2
                                                      br $assembly/utils/v128/getV128|inlined.5
                                                     end
                                                     local.get $3
                                                     v128.load offset=272
                                                     local.set $2
                                                     br $assembly/utils/v128/getV128|inlined.5
                                                    end
                                                    local.get $3
                                                    v128.load offset=288
                                                    local.set $2
                                                    br $assembly/utils/v128/getV128|inlined.5
                                                   end
                                                   local.get $3
                                                   v128.load offset=304
                                                   local.set $2
                                                   br $assembly/utils/v128/getV128|inlined.5
                                                  end
                                                  local.get $3
                                                  v128.load offset=320
                                                  local.set $2
                                                  br $assembly/utils/v128/getV128|inlined.5
                                                 end
                                                 local.get $3
                                                 v128.load offset=336
                                                 local.set $2
                                                 br $assembly/utils/v128/getV128|inlined.5
                                                end
                                                local.get $3
                                                v128.load offset=352
                                                local.set $2
                                                br $assembly/utils/v128/getV128|inlined.5
                                               end
                                               local.get $3
                                               v128.load offset=368
                                               local.set $2
                                               br $assembly/utils/v128/getV128|inlined.5
                                              end
                                              local.get $3
                                              v128.load offset=384
                                              local.set $2
                                              br $assembly/utils/v128/getV128|inlined.5
                                             end
                                             local.get $3
                                             v128.load offset=400
                                             local.set $2
                                             br $assembly/utils/v128/getV128|inlined.5
                                            end
                                            local.get $3
                                            v128.load offset=416
                                            local.set $2
                                            br $assembly/utils/v128/getV128|inlined.5
                                           end
                                           local.get $3
                                           v128.load offset=432
                                           local.set $2
                                           br $assembly/utils/v128/getV128|inlined.5
                                          end
                                          local.get $3
                                          v128.load offset=448
                                          local.set $2
                                          br $assembly/utils/v128/getV128|inlined.5
                                         end
                                         local.get $3
                                         v128.load offset=464
                                         local.set $2
                                         br $assembly/utils/v128/getV128|inlined.5
                                        end
                                        local.get $3
                                        v128.load offset=480
                                        local.set $2
                                        br $assembly/utils/v128/getV128|inlined.5
                                       end
                                       local.get $3
                                       v128.load offset=496
                                       local.set $2
                                       br $assembly/utils/v128/getV128|inlined.5
                                      end
                                      local.get $3
                                      v128.load offset=512
                                      local.set $2
                                      br $assembly/utils/v128/getV128|inlined.5
                                     end
                                     local.get $3
                                     v128.load offset=528
                                     local.set $2
                                     br $assembly/utils/v128/getV128|inlined.5
                                    end
                                    local.get $3
                                    v128.load offset=544
                                    local.set $2
                                    br $assembly/utils/v128/getV128|inlined.5
                                   end
                                   local.get $3
                                   v128.load offset=560
                                   local.set $2
                                   br $assembly/utils/v128/getV128|inlined.5
                                  end
                                  local.get $3
                                  v128.load offset=576
                                  local.set $2
                                  br $assembly/utils/v128/getV128|inlined.5
                                 end
                                 local.get $3
                                 v128.load offset=592
                                 local.set $2
                                 br $assembly/utils/v128/getV128|inlined.5
                                end
                                local.get $3
                                v128.load offset=608
                                local.set $2
                                br $assembly/utils/v128/getV128|inlined.5
                               end
                               local.get $3
                               v128.load offset=624
                               local.set $2
                               br $assembly/utils/v128/getV128|inlined.5
                              end
                              local.get $3
                              v128.load offset=640
                              local.set $2
                              br $assembly/utils/v128/getV128|inlined.5
                             end
                             local.get $3
                             v128.load offset=656
                             local.set $2
                             br $assembly/utils/v128/getV128|inlined.5
                            end
                            local.get $3
                            v128.load offset=672
                            local.set $2
                            br $assembly/utils/v128/getV128|inlined.5
                           end
                           local.get $3
                           v128.load offset=688
                           local.set $2
                           br $assembly/utils/v128/getV128|inlined.5
                          end
                          local.get $3
                          v128.load offset=704
                          local.set $2
                          br $assembly/utils/v128/getV128|inlined.5
                         end
                         local.get $3
                         v128.load offset=720
                         local.set $2
                         br $assembly/utils/v128/getV128|inlined.5
                        end
                        local.get $3
                        v128.load offset=736
                        local.set $2
                        br $assembly/utils/v128/getV128|inlined.5
                       end
                       local.get $3
                       v128.load offset=752
                       local.set $2
                       br $assembly/utils/v128/getV128|inlined.5
                      end
                      local.get $3
                      v128.load offset=768
                      local.set $2
                      br $assembly/utils/v128/getV128|inlined.5
                     end
                     local.get $3
                     v128.load offset=784
                     local.set $2
                     br $assembly/utils/v128/getV128|inlined.5
                    end
                    local.get $3
                    v128.load offset=800
                    local.set $2
                    br $assembly/utils/v128/getV128|inlined.5
                   end
                   local.get $3
                   v128.load offset=816
                   local.set $2
                   br $assembly/utils/v128/getV128|inlined.5
                  end
                  local.get $3
                  v128.load offset=832
                  local.set $2
                  br $assembly/utils/v128/getV128|inlined.5
                 end
                 local.get $3
                 v128.load offset=848
                 local.set $2
                 br $assembly/utils/v128/getV128|inlined.5
                end
                local.get $3
                v128.load offset=864
                local.set $2
                br $assembly/utils/v128/getV128|inlined.5
               end
               local.get $3
               v128.load offset=880
               local.set $2
               br $assembly/utils/v128/getV128|inlined.5
              end
              local.get $3
              v128.load offset=896
              local.set $2
              br $assembly/utils/v128/getV128|inlined.5
             end
             local.get $3
             v128.load offset=912
             local.set $2
             br $assembly/utils/v128/getV128|inlined.5
            end
            local.get $3
            v128.load offset=928
            local.set $2
            br $assembly/utils/v128/getV128|inlined.5
           end
           local.get $3
           v128.load offset=944
           local.set $2
           br $assembly/utils/v128/getV128|inlined.5
          end
          local.get $3
          v128.load offset=960
          local.set $2
          br $assembly/utils/v128/getV128|inlined.5
         end
         local.get $3
         v128.load offset=976
         local.set $2
         br $assembly/utils/v128/getV128|inlined.5
        end
        local.get $3
        v128.load offset=992
        local.set $2
        br $assembly/utils/v128/getV128|inlined.5
       end
       local.get $3
       v128.load offset=1008
       local.set $2
       br $assembly/utils/v128/getV128|inlined.5
      end
      i32.const 2688
      local.get $5
      call $~lib/util/number/itoa32
      call $~lib/string/String#concat
      i32.const 2624
      i32.const 341
      i32.const 7
      call $~lib/builtins/abort
      unreachable
     end
     local.get $4
     local.get $2
     i32x4.add
     global.get $assembly/simd/tmpW
     i32x4.add
     global.set $assembly/simd/t1V128
     global.get $assembly/simd/aV128
     local.tee $2
     i32.const 2
     i32x4.shr_u
     local.get $2
     i32.const 30
     i32x4.shl
     v128.or
     local.get $2
     i32.const 13
     i32x4.shr_u
     local.get $2
     i32.const 19
     i32x4.shl
     v128.or
     v128.xor
     local.get $2
     i32.const 22
     i32x4.shr_u
     local.get $2
     i32.const 10
     i32x4.shl
     v128.or
     v128.xor
     global.get $assembly/simd/aV128
     local.tee $2
     global.get $assembly/simd/bV128
     local.tee $4
     v128.and
     local.get $2
     global.get $assembly/simd/cV128
     local.tee $2
     v128.and
     v128.xor
     local.get $4
     local.get $2
     v128.and
     v128.xor
     i32x4.add
     global.set $assembly/simd/t2V128
     global.get $assembly/simd/gV128
     global.set $assembly/simd/hV128
     global.get $assembly/simd/fV128
     global.set $assembly/simd/gV128
     global.get $assembly/simd/eV128
     global.set $assembly/simd/fV128
     global.get $assembly/simd/dV128
     global.get $assembly/simd/t1V128
     i32x4.add
     global.set $assembly/simd/eV128
     global.get $assembly/simd/cV128
     global.set $assembly/simd/dV128
     global.get $assembly/simd/bV128
     global.set $assembly/simd/cV128
     global.get $assembly/simd/aV128
     global.set $assembly/simd/bV128
     global.get $assembly/simd/t1V128
     global.get $assembly/simd/t2V128
     i32x4.add
     global.set $assembly/simd/aV128
     global.get $assembly/simd/i
     i32.const 1
     i32.add
     global.set $assembly/simd/i
     br $for-loop|0
    end
   end
   global.get $assembly/simd/H0V128
   global.get $assembly/simd/aV128
   i32x4.add
   global.set $assembly/simd/H0V128
   global.get $assembly/simd/H1V128
   global.get $assembly/simd/bV128
   i32x4.add
   global.set $assembly/simd/H1V128
   global.get $assembly/simd/H2V128
   global.get $assembly/simd/cV128
   i32x4.add
   global.set $assembly/simd/H2V128
   global.get $assembly/simd/H3V128
   global.get $assembly/simd/dV128
   i32x4.add
   global.set $assembly/simd/H3V128
   global.get $assembly/simd/H4V128
   global.get $assembly/simd/eV128
   i32x4.add
   global.set $assembly/simd/H4V128
   global.get $assembly/simd/H5V128
   global.get $assembly/simd/fV128
   i32x4.add
   global.set $assembly/simd/H5V128
   global.get $assembly/simd/H6V128
   global.get $assembly/simd/gV128
   i32x4.add
   global.set $assembly/simd/H6V128
   global.get $assembly/simd/H7V128
   global.get $assembly/simd/hV128
   i32x4.add
   global.set $assembly/simd/H7V128
   call $assembly/simd/hashPreCompWV128
   local.get $1
   global.get $assembly/simd/H0V128
   i32x4.extract_lane 0
   call $~lib/polyfills/bswap<i32>
   i32.store
   local.get $1
   global.get $assembly/simd/H1V128
   i32x4.extract_lane 0
   call $~lib/polyfills/bswap<i32>
   i32.store offset=4
   local.get $1
   global.get $assembly/simd/H2V128
   i32x4.extract_lane 0
   call $~lib/polyfills/bswap<i32>
   i32.store offset=8
   local.get $1
   global.get $assembly/simd/H3V128
   i32x4.extract_lane 0
   call $~lib/polyfills/bswap<i32>
   i32.store offset=12
   local.get $1
   global.get $assembly/simd/H4V128
   i32x4.extract_lane 0
   call $~lib/polyfills/bswap<i32>
   i32.store offset=16
   local.get $1
   global.get $assembly/simd/H5V128
   i32x4.extract_lane 0
   call $~lib/polyfills/bswap<i32>
   i32.store offset=20
   local.get $1
   global.get $assembly/simd/H6V128
   i32x4.extract_lane 0
   call $~lib/polyfills/bswap<i32>
   i32.store offset=24
   local.get $1
   global.get $assembly/simd/H7V128
   i32x4.extract_lane 0
   call $~lib/polyfills/bswap<i32>
   i32.store offset=28
   local.get $1
   global.get $assembly/simd/H0V128
   i32x4.extract_lane 1
   call $~lib/polyfills/bswap<i32>
   i32.store offset=32
   local.get $1
   global.get $assembly/simd/H1V128
   i32x4.extract_lane 1
   call $~lib/polyfills/bswap<i32>
   i32.store offset=36
   local.get $1
   global.get $assembly/simd/H2V128
   i32x4.extract_lane 1
   call $~lib/polyfills/bswap<i32>
   i32.store offset=40
   local.get $1
   global.get $assembly/simd/H3V128
   i32x4.extract_lane 1
   call $~lib/polyfills/bswap<i32>
   i32.store offset=44
   local.get $1
   global.get $assembly/simd/H4V128
   i32x4.extract_lane 1
   call $~lib/polyfills/bswap<i32>
   i32.store offset=48
   local.get $1
   global.get $assembly/simd/H5V128
   i32x4.extract_lane 1
   call $~lib/polyfills/bswap<i32>
   i32.store offset=52
   local.get $1
   global.get $assembly/simd/H6V128
   i32x4.extract_lane 1
   call $~lib/polyfills/bswap<i32>
   i32.store offset=56
   local.get $1
   global.get $assembly/simd/H7V128
   i32x4.extract_lane 1
   call $~lib/polyfills/bswap<i32>
   i32.store offset=60
   local.get $1
   i32.const -64
   i32.sub
   global.get $assembly/simd/H0V128
   i32x4.extract_lane 2
   call $~lib/polyfills/bswap<i32>
   i32.store
   local.get $1
   global.get $assembly/simd/H1V128
   i32x4.extract_lane 2
   call $~lib/polyfills/bswap<i32>
   i32.store offset=68
   local.get $1
   global.get $assembly/simd/H2V128
   i32x4.extract_lane 2
   call $~lib/polyfills/bswap<i32>
   i32.store offset=72
   local.get $1
   global.get $assembly/simd/H3V128
   i32x4.extract_lane 2
   call $~lib/polyfills/bswap<i32>
   i32.store offset=76
   local.get $1
   global.get $assembly/simd/H4V128
   i32x4.extract_lane 2
   call $~lib/polyfills/bswap<i32>
   i32.store offset=80
   local.get $1
   global.get $assembly/simd/H5V128
   i32x4.extract_lane 2
   call $~lib/polyfills/bswap<i32>
   i32.store offset=84
   local.get $1
   global.get $assembly/simd/H6V128
   i32x4.extract_lane 2
   call $~lib/polyfills/bswap<i32>
   i32.store offset=88
   local.get $1
   global.get $assembly/simd/H7V128
   i32x4.extract_lane 2
   call $~lib/polyfills/bswap<i32>
   i32.store offset=92
   local.get $1
   global.get $assembly/simd/H0V128
   i32x4.extract_lane 3
   call $~lib/polyfills/bswap<i32>
   i32.store offset=96
   local.get $1
   global.get $assembly/simd/H1V128
   i32x4.extract_lane 3
   call $~lib/polyfills/bswap<i32>
   i32.store offset=100
   local.get $1
   global.get $assembly/simd/H2V128
   i32x4.extract_lane 3
   call $~lib/polyfills/bswap<i32>
   i32.store offset=104
   local.get $1
   global.get $assembly/simd/H3V128
   i32x4.extract_lane 3
   call $~lib/polyfills/bswap<i32>
   i32.store offset=108
   local.get $1
   global.get $assembly/simd/H4V128
   i32x4.extract_lane 3
   call $~lib/polyfills/bswap<i32>
   i32.store offset=112
   local.get $1
   global.get $assembly/simd/H5V128
   i32x4.extract_lane 3
   call $~lib/polyfills/bswap<i32>
   i32.store offset=116
   local.get $1
   global.get $assembly/simd/H6V128
   i32x4.extract_lane 3
   call $~lib/polyfills/bswap<i32>
   i32.store offset=120
   local.get $1
   global.get $assembly/simd/H7V128
   i32x4.extract_lane 3
   call $~lib/polyfills/bswap<i32>
   i32.store offset=124
   return
  end
  i32.const 2688
  local.get $3
  call $~lib/util/number/itoa32
  call $~lib/string/String#concat
  i32.const 2624
  i32.const 341
  i32.const 7
  call $~lib/builtins/abort
  unreachable
 )
 (func $assembly/index.simd/batchHash4UintArray64s (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  loop $for-loop|0
   local.get $1
   i32.const 16
   i32.lt_s
   if
    local.get $1
    i32.const 2
    i32.shl
    local.tee $2
    i32.const 1
    i32.add
    local.set $3
    global.get $assembly/common/wPtr
    local.get $2
    i32.const 2
    i32.shl
    i32.add
    local.get $2
    i32.const 3
    i32.add
    local.tee $4
    global.get $assembly/common/inputPtr
    local.tee $5
    i32.add
    i32.load8_u
    local.get $2
    local.get $5
    i32.add
    i32.load8_u
    i32.const 24
    i32.shl
    local.get $3
    local.get $5
    i32.add
    i32.load8_u
    i32.const 16
    i32.shl
    i32.or
    local.get $2
    i32.const 2
    i32.add
    local.tee $2
    local.get $5
    i32.add
    i32.load8_u
    i32.const 8
    i32.shl
    i32.or
    i32.or
    i32.store
    global.get $assembly/common/wPtr
    local.get $3
    i32.const 2
    i32.shl
    i32.add
    global.get $assembly/common/inputPtr
    local.tee $3
    local.get $1
    i32.const 16
    i32.add
    i32.const 2
    i32.shl
    local.tee $5
    i32.const 3
    i32.add
    i32.add
    i32.load8_u
    local.get $3
    local.get $5
    i32.add
    i32.load8_u
    i32.const 24
    i32.shl
    local.get $5
    i32.const 1
    i32.add
    local.get $3
    i32.add
    i32.load8_u
    i32.const 16
    i32.shl
    i32.or
    local.get $5
    i32.const 2
    i32.add
    local.get $3
    i32.add
    i32.load8_u
    i32.const 8
    i32.shl
    i32.or
    i32.or
    i32.store
    global.get $assembly/common/wPtr
    local.get $2
    i32.const 2
    i32.shl
    i32.add
    global.get $assembly/common/inputPtr
    local.tee $2
    local.get $1
    i32.const 32
    i32.add
    i32.const 2
    i32.shl
    local.tee $3
    i32.const 3
    i32.add
    i32.add
    i32.load8_u
    local.get $2
    local.get $3
    i32.add
    i32.load8_u
    i32.const 24
    i32.shl
    local.get $3
    i32.const 1
    i32.add
    local.get $2
    i32.add
    i32.load8_u
    i32.const 16
    i32.shl
    i32.or
    local.get $3
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
    global.get $assembly/common/wPtr
    local.get $4
    i32.const 2
    i32.shl
    i32.add
    global.get $assembly/common/inputPtr
    local.tee $2
    local.get $1
    i32.const 48
    i32.add
    i32.const 2
    i32.shl
    local.tee $3
    i32.const 3
    i32.add
    i32.add
    i32.load8_u
    local.get $2
    local.get $3
    i32.add
    i32.load8_u
    i32.const 24
    i32.shl
    local.get $3
    i32.const 1
    i32.add
    local.get $2
    i32.add
    i32.load8_u
    i32.const 16
    i32.shl
    i32.or
    local.get $3
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
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $for-loop|0
   end
  end
  global.get $assembly/common/wPtr
  local.get $0
  call $assembly/simd/digest64V128
 )
 (func $assembly/index.simd/batchHash4HashObjectInputs (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  loop $for-loop|0
   local.get $2
   i32.const 64
   i32.lt_s
   if
    local.get $2
    i32.const 2
    i32.shl
    local.tee $1
    global.get $assembly/common/wPtr
    i32.add
    global.get $assembly/common/inputPtr
    local.tee $3
    local.get $1
    i32.const 3
    i32.add
    i32.add
    i32.load8_u
    local.get $1
    local.get $3
    i32.add
    i32.load8_u
    i32.const 24
    i32.shl
    local.get $1
    i32.const 1
    i32.add
    local.get $3
    i32.add
    i32.load8_u
    i32.const 16
    i32.shl
    i32.or
    local.get $1
    i32.const 2
    i32.add
    local.get $3
    i32.add
    i32.load8_u
    i32.const 8
    i32.shl
    i32.or
    i32.or
    i32.store
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $for-loop|0
   end
  end
  global.get $assembly/common/wPtr
  local.get $0
  call $assembly/simd/digest64V128
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
 (func $assembly/common/hashBlocks (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
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
    global.get $assembly/common/i
    i32.const 2
    i32.shl
    local.tee $2
    local.get $0
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
    global.get $assembly/common/i
    i32.const 2
    i32.shl
    i32.add
    local.get $0
    global.get $assembly/common/i
    i32.const 16
    i32.sub
    i32.const 2
    i32.shl
    i32.add
    i32.load
    local.get $0
    global.get $assembly/common/i
    i32.const 7
    i32.sub
    i32.const 2
    i32.shl
    i32.add
    i32.load
    local.get $0
    global.get $assembly/common/i
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
    global.get $assembly/common/i
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
    global.get $assembly/common/i
    i32.const 2
    i32.shl
    local.tee $1
    local.get $0
    i32.add
    i32.load
    local.get $1
    global.get $assembly/common/kPtr
    i32.add
    i32.load
    global.get $assembly/common/h
    global.get $assembly/common/e
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
    global.get $assembly/common/e
    local.tee $1
    global.get $assembly/common/f
    i32.and
    global.get $assembly/common/g
    local.get $1
    i32.const -1
    i32.xor
    i32.and
    i32.xor
    i32.add
    i32.add
    i32.add
    global.set $assembly/common/t1
    global.get $assembly/common/a
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
    global.get $assembly/common/b
    local.tee $2
    global.get $assembly/common/c
    local.tee $3
    i32.and
    global.get $assembly/common/a
    local.tee $1
    local.get $2
    i32.and
    local.get $1
    local.get $3
    i32.and
    i32.xor
    i32.xor
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
 (func $assembly/common/update (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  global.get $assembly/common/bytesHashed
  local.get $1
  i32.add
  global.set $assembly/common/bytesHashed
  global.get $assembly/common/mLength
  if
   i32.const 64
   global.get $assembly/common/mLength
   i32.sub
   local.tee $2
   local.get $1
   i32.le_s
   if
    global.get $assembly/common/mPtr
    global.get $assembly/common/mLength
    i32.add
    local.get $0
    local.get $2
    memory.copy
    global.get $assembly/common/mLength
    local.get $2
    i32.add
    global.set $assembly/common/mLength
    i32.const 64
    global.get $assembly/common/mLength
    i32.sub
    local.set $2
    local.get $1
    i32.const 64
    global.get $assembly/common/mLength
    i32.sub
    i32.sub
    local.set $1
    global.get $assembly/common/wPtr
    global.get $assembly/common/mPtr
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
    global.get $assembly/common/wPtr
    local.get $0
    local.get $2
    i32.add
    call $assembly/common/hashBlocks
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
   global.get $assembly/common/mPtr
   global.get $assembly/common/mLength
   i32.add
   local.get $0
   local.get $2
   i32.add
   local.get $1
   memory.copy
   global.get $assembly/common/mLength
   local.get $1
   i32.add
   global.set $assembly/common/mLength
  end
 )
 (func $assembly/common/final (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  global.get $assembly/common/mPtr
  global.get $assembly/common/mLength
  i32.add
  i32.const 128
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
   local.tee $1
   i32.const 64
   global.get $assembly/common/mLength
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
   global.get $assembly/common/wPtr
   global.get $assembly/common/mPtr
   call $assembly/common/hashBlocks
   i32.const 0
   global.set $assembly/common/mLength
  end
  global.get $assembly/common/mPtr
  global.get $assembly/common/mLength
  i32.add
  local.tee $1
  i32.const 56
  global.get $assembly/common/mLength
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
  global.get $assembly/common/mPtr
  global.get $assembly/common/bytesHashed
  i32.const 536870912
  i32.div_s
  call $~lib/polyfills/bswap<i32>
  i32.store offset=56
  global.get $assembly/common/mPtr
  global.get $assembly/common/bytesHashed
  i32.const 3
  i32.shl
  call $~lib/polyfills/bswap<i32>
  i32.store offset=60
  global.get $assembly/common/wPtr
  global.get $assembly/common/mPtr
  call $assembly/common/hashBlocks
  local.get $0
  global.get $assembly/common/H0
  call $~lib/polyfills/bswap<i32>
  i32.store
  local.get $0
  global.get $assembly/common/H1
  call $~lib/polyfills/bswap<i32>
  i32.store offset=4
  local.get $0
  global.get $assembly/common/H2
  call $~lib/polyfills/bswap<i32>
  i32.store offset=8
  local.get $0
  global.get $assembly/common/H3
  call $~lib/polyfills/bswap<i32>
  i32.store offset=12
  local.get $0
  global.get $assembly/common/H4
  call $~lib/polyfills/bswap<i32>
  i32.store offset=16
  local.get $0
  global.get $assembly/common/H5
  call $~lib/polyfills/bswap<i32>
  i32.store offset=20
  local.get $0
  global.get $assembly/common/H6
  call $~lib/polyfills/bswap<i32>
  i32.store offset=24
  local.get $0
  global.get $assembly/common/H7
  call $~lib/polyfills/bswap<i32>
  i32.store offset=28
 )
 (func $assembly/common/digest (param $0 i32)
  call $assembly/common/init
  global.get $assembly/common/inputPtr
  local.get $0
  call $assembly/common/update
  global.get $assembly/common/outputPtr
  call $assembly/common/final
 )
 (func $assembly/common/hashPreCompW (param $0 i32)
  (local $1 i32)
  (local $2 i32)
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
    local.get $0
    global.get $assembly/common/i
    i32.const 2
    i32.shl
    i32.add
    i32.load
    global.get $assembly/common/h
    global.get $assembly/common/e
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
    global.get $assembly/common/e
    local.tee $1
    global.get $assembly/common/f
    i32.and
    global.get $assembly/common/g
    local.get $1
    i32.const -1
    i32.xor
    i32.and
    i32.xor
    i32.add
    i32.add
    global.set $assembly/common/t1
    global.get $assembly/common/a
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
    global.get $assembly/common/b
    local.tee $2
    global.get $assembly/common/c
    local.tee $1
    i32.and
    local.get $2
    global.get $assembly/common/a
    local.tee $2
    i32.and
    local.get $1
    local.get $2
    i32.and
    i32.xor
    i32.xor
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
 (func $assembly/common/digest64 (param $0 i32) (param $1 i32)
  call $assembly/common/init
  global.get $assembly/common/wPtr
  local.get $0
  call $assembly/common/hashBlocks
  global.get $assembly/common/w64Ptr
  call $assembly/common/hashPreCompW
  local.get $1
  global.get $assembly/common/H0
  call $~lib/polyfills/bswap<i32>
  i32.store
  local.get $1
  global.get $assembly/common/H1
  call $~lib/polyfills/bswap<i32>
  i32.store offset=4
  local.get $1
  global.get $assembly/common/H2
  call $~lib/polyfills/bswap<i32>
  i32.store offset=8
  local.get $1
  global.get $assembly/common/H3
  call $~lib/polyfills/bswap<i32>
  i32.store offset=12
  local.get $1
  global.get $assembly/common/H4
  call $~lib/polyfills/bswap<i32>
  i32.store offset=16
  local.get $1
  global.get $assembly/common/H5
  call $~lib/polyfills/bswap<i32>
  i32.store offset=20
  local.get $1
  global.get $assembly/common/H6
  call $~lib/polyfills/bswap<i32>
  i32.store offset=24
  local.get $1
  global.get $assembly/common/H7
  call $~lib/polyfills/bswap<i32>
  i32.store offset=28
 )
 (func $~start
  call $start:assembly/simd
  i32.const 1348
  i32.load
  global.set $assembly/common/kPtr
  i32.const 1684
  i32.load
  global.set $assembly/common/w64Ptr
  i32.const 64
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/common/M
  global.get $assembly/common/M
  global.set $assembly/common/mPtr
  i32.const 1024
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/common/W
  global.get $assembly/common/W
  global.set $assembly/common/wPtr
  i32.const 512
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/common/input
  global.get $assembly/common/input
  global.set $assembly/common/inputPtr
  i32.const 32
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/common/output
  global.get $assembly/common/output
  global.set $assembly/common/outputPtr
 )
)
