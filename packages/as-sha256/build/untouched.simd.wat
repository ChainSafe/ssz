(module
 (type $0 (func (param i32) (result i32)))
 (type $1 (func (param i32 i32)))
 (type $2 (func))
 (type $3 (func (param i32 i32) (result i32)))
 (type $4 (func (param i32 i32 i32)))
 (type $5 (func (param i32)))
 (type $6 (func (param i32 i32 i32 i32)))
 (type $7 (func (param i32 i32 i64) (result i32)))
 (type $8 (func (param i32 i64 i32)))
 (type $9 (func (param i64 i32) (result i32)))
 (type $10 (func (param i32 i64 i32 i32)))
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
 (global $assembly/utils/const/K i32 (i32.const 320))
 (global $assembly/utils/const/W64 i32 (i32.const 656))
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
 (global $assembly/simd/iV128 (mut v128) (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000))
 (global $assembly/simd/t1V128 (mut v128) (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000))
 (global $assembly/simd/t2V128 (mut v128) (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000))
 (global $assembly/simd/i (mut i32) (i32.const 0))
 (global $assembly/simd/tmpW (mut v128) (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000))
 (global $~lib/shared/runtime/Runtime.Stub i32 (i32.const 0))
 (global $~lib/shared/runtime/Runtime.Minimal i32 (i32.const 1))
 (global $~lib/shared/runtime/Runtime.Incremental i32 (i32.const 2))
 (global $~lib/rt/tlsf/ROOT (mut i32) (i32.const 0))
 (global $~lib/native/ASC_LOW_MEMORY_LIMIT i32 (i32.const 0))
 (global $~lib/rt/tcms/fromSpace (mut i32) (i32.const 0))
 (global $~lib/rt/tcms/white (mut i32) (i32.const 0))
 (global $~lib/rt/tcms/total (mut i32) (i32.const 0))
 (global $~lib/native/ASC_RUNTIME i32 (i32.const 1))
 (global $assembly/simd/kV128ArrayBuffer (mut i32) (i32.const 0))
 (global $assembly/simd/kV128Ptr (mut i32) (i32.const 0))
 (global $~lib/native/ASC_SHRINK_LEVEL i32 (i32.const 0))
 (global $assembly/simd/w64V12ArrayBuffer (mut i32) (i32.const 0))
 (global $assembly/simd/w64V128Ptr (mut i32) (i32.const 0))
 (global $assembly/simd/DEFAULT_H0V128 v128 (v128.const i32x4 0x6a09e667 0x6a09e667 0x6a09e667 0x6a09e667))
 (global $assembly/simd/DEFAULT_H1V128 v128 (v128.const i32x4 0xbb67ae85 0xbb67ae85 0xbb67ae85 0xbb67ae85))
 (global $assembly/simd/DEFAULT_H2V128 v128 (v128.const i32x4 0x3c6ef372 0x3c6ef372 0x3c6ef372 0x3c6ef372))
 (global $assembly/simd/DEFAULT_H3V128 v128 (v128.const i32x4 0xa54ff53a 0xa54ff53a 0xa54ff53a 0xa54ff53a))
 (global $assembly/simd/DEFAULT_H4V128 v128 (v128.const i32x4 0x510e527f 0x510e527f 0x510e527f 0x510e527f))
 (global $assembly/simd/DEFAULT_H5V128 v128 (v128.const i32x4 0x9b05688c 0x9b05688c 0x9b05688c 0x9b05688c))
 (global $assembly/simd/DEFAULT_H6V128 v128 (v128.const i32x4 0x1f83d9ab 0x1f83d9ab 0x1f83d9ab 0x1f83d9ab))
 (global $assembly/simd/DEFAULT_H7V128 v128 (v128.const i32x4 0x5be0cd19 0x5be0cd19 0x5be0cd19 0x5be0cd19))
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
 (global $~lib/memory/__heap_base i32 (i32.const 3196))
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
 (data $10 (i32.const 1020) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00$\00\00\00I\00n\00d\00e\00x\00 \00o\00u\00t\00 \00o\00f\00 \00r\00a\00n\00g\00e\00\00\00\00\00\00\00\00\00")
 (data $11 (i32.const 1084) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\1a\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00.\00t\00s\00\00\00")
 (data $12 (i32.const 1132) "|\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00d\00\00\00t\00o\00S\00t\00r\00i\00n\00g\00(\00)\00 \00r\00a\00d\00i\00x\00 \00a\00r\00g\00u\00m\00e\00n\00t\00 \00m\00u\00s\00t\00 \00b\00e\00 \00b\00e\00t\00w\00e\00e\00n\00 \002\00 \00a\00n\00d\00 \003\006\00\00\00\00\00\00\00\00\00")
 (data $13 (i32.const 1260) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00&\00\00\00~\00l\00i\00b\00/\00u\00t\00i\00l\00/\00n\00u\00m\00b\00e\00r\00.\00t\00s\00\00\00\00\00\00\00")
 (data $14 (i32.const 1324) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\02\00\00\000\00\00\00\00\00\00\00\00\00\00\00")
 (data $15 (i32.const 1356) "0\000\000\001\000\002\000\003\000\004\000\005\000\006\000\007\000\008\000\009\001\000\001\001\001\002\001\003\001\004\001\005\001\006\001\007\001\008\001\009\002\000\002\001\002\002\002\003\002\004\002\005\002\006\002\007\002\008\002\009\003\000\003\001\003\002\003\003\003\004\003\005\003\006\003\007\003\008\003\009\004\000\004\001\004\002\004\003\004\004\004\005\004\006\004\007\004\008\004\009\005\000\005\001\005\002\005\003\005\004\005\005\005\006\005\007\005\008\005\009\006\000\006\001\006\002\006\003\006\004\006\005\006\006\006\007\006\008\006\009\007\000\007\001\007\002\007\003\007\004\007\005\007\006\007\007\007\008\007\009\008\000\008\001\008\002\008\003\008\004\008\005\008\006\008\007\008\008\008\009\009\000\009\001\009\002\009\003\009\004\009\005\009\006\009\007\009\008\009\009\00")
 (data $16 (i32.const 1756) "\1c\04\00\00\00\00\00\00\00\00\00\00\02\00\00\00\00\04\00\000\000\000\001\000\002\000\003\000\004\000\005\000\006\000\007\000\008\000\009\000\00a\000\00b\000\00c\000\00d\000\00e\000\00f\001\000\001\001\001\002\001\003\001\004\001\005\001\006\001\007\001\008\001\009\001\00a\001\00b\001\00c\001\00d\001\00e\001\00f\002\000\002\001\002\002\002\003\002\004\002\005\002\006\002\007\002\008\002\009\002\00a\002\00b\002\00c\002\00d\002\00e\002\00f\003\000\003\001\003\002\003\003\003\004\003\005\003\006\003\007\003\008\003\009\003\00a\003\00b\003\00c\003\00d\003\00e\003\00f\004\000\004\001\004\002\004\003\004\004\004\005\004\006\004\007\004\008\004\009\004\00a\004\00b\004\00c\004\00d\004\00e\004\00f\005\000\005\001\005\002\005\003\005\004\005\005\005\006\005\007\005\008\005\009\005\00a\005\00b\005\00c\005\00d\005\00e\005\00f\006\000\006\001\006\002\006\003\006\004\006\005\006\006\006\007\006\008\006\009\006\00a\006\00b\006\00c\006\00d\006\00e\006\00f\007\000\007\001\007\002\007\003\007\004\007\005\007\006\007\007\007\008\007\009\007\00a\007\00b\007\00c\007\00d\007\00e\007\00f\008\000\008\001\008\002\008\003\008\004\008\005\008\006\008\007\008\008\008\009\008\00a\008\00b\008\00c\008\00d\008\00e\008\00f\009\000\009\001\009\002\009\003\009\004\009\005\009\006\009\007\009\008\009\009\009\00a\009\00b\009\00c\009\00d\009\00e\009\00f\00a\000\00a\001\00a\002\00a\003\00a\004\00a\005\00a\006\00a\007\00a\008\00a\009\00a\00a\00a\00b\00a\00c\00a\00d\00a\00e\00a\00f\00b\000\00b\001\00b\002\00b\003\00b\004\00b\005\00b\006\00b\007\00b\008\00b\009\00b\00a\00b\00b\00b\00c\00b\00d\00b\00e\00b\00f\00c\000\00c\001\00c\002\00c\003\00c\004\00c\005\00c\006\00c\007\00c\008\00c\009\00c\00a\00c\00b\00c\00c\00c\00d\00c\00e\00c\00f\00d\000\00d\001\00d\002\00d\003\00d\004\00d\005\00d\006\00d\007\00d\008\00d\009\00d\00a\00d\00b\00d\00c\00d\00d\00d\00e\00d\00f\00e\000\00e\001\00e\002\00e\003\00e\004\00e\005\00e\006\00e\007\00e\008\00e\009\00e\00a\00e\00b\00e\00c\00e\00d\00e\00e\00e\00f\00f\000\00f\001\00f\002\00f\003\00f\004\00f\005\00f\006\00f\007\00f\008\00f\009\00f\00a\00f\00b\00f\00c\00f\00d\00f\00e\00f\00f\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $17 (i32.const 2812) "\\\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00H\00\00\000\001\002\003\004\005\006\007\008\009\00a\00b\00c\00d\00e\00f\00g\00h\00i\00j\00k\00l\00m\00n\00o\00p\00q\00r\00s\00t\00u\00v\00w\00x\00y\00z\00\00\00\00\00")
 (data $18 (i32.const 2908) "\\\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00H\00\00\00s\00e\00t\00V\001\002\008\00:\00 \00e\00x\00p\00e\00c\00t\00 \00i\00 \00f\00r\00o\00m\00 \000\00 \00t\00o\00 \006\003\00,\00 \00g\00o\00t\00 \00\00\00\00\00")
 (data $19 (i32.const 3004) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $20 (i32.const 3036) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00,\00\00\00a\00s\00s\00e\00m\00b\00l\00y\00/\00u\00t\00i\00l\00s\00/\00v\001\002\008\00.\00t\00s\00")
 (data $21 (i32.const 3100) "\\\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00H\00\00\00g\00e\00t\00V\001\002\008\00:\00 \00e\00x\00p\00e\00c\00t\00 \00i\00 \00f\00r\00o\00m\00 \000\00 \00t\00o\00 \006\003\00,\00 \00g\00o\00t\00 \00\00\00\00\00")
 (table $0 1 1 funcref)
 (elem $0 (i32.const 1))
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
 (func $~lib/array/Array<u32>#get:length_ (param $0 i32) (result i32)
  local.get $0
  i32.load offset=12
 )
 (func $~lib/array/Array<u32>#get:dataStart (param $0 i32) (result i32)
  local.get $0
  i32.load offset=4
 )
 (func $~lib/array/Array<u32>#__get (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  local.get $1
  local.get $0
  call $~lib/array/Array<u32>#get:length_
  i32.ge_u
  if
   i32.const 1040
   i32.const 1104
   i32.const 114
   i32.const 42
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  call $~lib/array/Array<u32>#get:dataStart
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  i32.load
  local.set $2
  i32.const 0
  drop
  local.get $2
  return
 )
 (func $~lib/util/number/decimalCount32 (param $0 i32) (result i32)
  local.get $0
  i32.const 100000
  i32.lt_u
  if
   local.get $0
   i32.const 100
   i32.lt_u
   if
    i32.const 1
    local.get $0
    i32.const 10
    i32.ge_u
    i32.add
    return
   else
    i32.const 3
    local.get $0
    i32.const 10000
    i32.ge_u
    i32.add
    local.get $0
    i32.const 1000
    i32.ge_u
    i32.add
    return
   end
   unreachable
  else
   local.get $0
   i32.const 10000000
   i32.lt_u
   if
    i32.const 6
    local.get $0
    i32.const 1000000
    i32.ge_u
    i32.add
    return
   else
    i32.const 8
    local.get $0
    i32.const 1000000000
    i32.ge_u
    i32.add
    local.get $0
    i32.const 100000000
    i32.ge_u
    i32.add
    return
   end
   unreachable
  end
  unreachable
 )
 (func $~lib/util/number/utoa32_dec_lut (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i64)
  (local $8 i64)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  loop $while-continue|0
   local.get $1
   i32.const 10000
   i32.ge_u
   if
    local.get $1
    i32.const 10000
    i32.div_u
    local.set $3
    local.get $1
    i32.const 10000
    i32.rem_u
    local.set $4
    local.get $3
    local.set $1
    local.get $4
    i32.const 100
    i32.div_u
    local.set $5
    local.get $4
    i32.const 100
    i32.rem_u
    local.set $6
    i32.const 1356
    local.get $5
    i32.const 2
    i32.shl
    i32.add
    i64.load32_u
    local.set $7
    i32.const 1356
    local.get $6
    i32.const 2
    i32.shl
    i32.add
    i64.load32_u
    local.set $8
    local.get $2
    i32.const 4
    i32.sub
    local.set $2
    local.get $0
    local.get $2
    i32.const 1
    i32.shl
    i32.add
    local.get $7
    local.get $8
    i64.const 32
    i64.shl
    i64.or
    i64.store
    br $while-continue|0
   end
  end
  local.get $1
  i32.const 100
  i32.ge_u
  if
   local.get $1
   i32.const 100
   i32.div_u
   local.set $9
   local.get $1
   i32.const 100
   i32.rem_u
   local.set $10
   local.get $9
   local.set $1
   local.get $2
   i32.const 2
   i32.sub
   local.set $2
   i32.const 1356
   local.get $10
   i32.const 2
   i32.shl
   i32.add
   i32.load
   local.set $11
   local.get $0
   local.get $2
   i32.const 1
   i32.shl
   i32.add
   local.get $11
   i32.store
  end
  local.get $1
  i32.const 10
  i32.ge_u
  if
   local.get $2
   i32.const 2
   i32.sub
   local.set $2
   i32.const 1356
   local.get $1
   i32.const 2
   i32.shl
   i32.add
   i32.load
   local.set $12
   local.get $0
   local.get $2
   i32.const 1
   i32.shl
   i32.add
   local.get $12
   i32.store
  else
   local.get $2
   i32.const 1
   i32.sub
   local.set $2
   i32.const 48
   local.get $1
   i32.add
   local.set $13
   local.get $0
   local.get $2
   i32.const 1
   i32.shl
   i32.add
   local.get $13
   i32.store16
  end
 )
 (func $~lib/util/number/utoa_hex_lut (param $0 i32) (param $1 i64) (param $2 i32)
  loop $while-continue|0
   local.get $2
   i32.const 2
   i32.ge_u
   if
    local.get $2
    i32.const 2
    i32.sub
    local.set $2
    local.get $0
    local.get $2
    i32.const 1
    i32.shl
    i32.add
    i32.const 1776
    local.get $1
    i32.wrap_i64
    i32.const 255
    i32.and
    i32.const 2
    i32.shl
    i32.add
    i32.load
    i32.store
    local.get $1
    i64.const 8
    i64.shr_u
    local.set $1
    br $while-continue|0
   end
  end
  local.get $2
  i32.const 1
  i32.and
  if
   local.get $0
   i32.const 1776
   local.get $1
   i32.wrap_i64
   i32.const 6
   i32.shl
   i32.add
   i32.load16_u
   i32.store16
  end
 )
 (func $~lib/util/number/ulog_base (param $0 i64) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i64)
  (local $4 i64)
  (local $5 i32)
  block $~lib/util/number/isPowerOf2<i32>|inlined.0 (result i32)
   local.get $1
   local.set $2
   local.get $2
   i32.popcnt
   i32.const 1
   i32.eq
   br $~lib/util/number/isPowerOf2<i32>|inlined.0
  end
  if
   i32.const 63
   local.get $0
   i64.clz
   i32.wrap_i64
   i32.sub
   i32.const 31
   local.get $1
   i32.clz
   i32.sub
   i32.div_u
   i32.const 1
   i32.add
   return
  end
  local.get $1
  i64.extend_i32_s
  local.set $3
  local.get $3
  local.set $4
  i32.const 1
  local.set $5
  loop $while-continue|0
   local.get $0
   local.get $4
   i64.ge_u
   if
    local.get $0
    local.get $4
    i64.div_u
    local.set $0
    local.get $4
    local.get $4
    i64.mul
    local.set $4
    local.get $5
    i32.const 1
    i32.shl
    local.set $5
    br $while-continue|0
   end
  end
  loop $while-continue|1
   local.get $0
   i64.const 1
   i64.ge_u
   if
    local.get $0
    local.get $3
    i64.div_u
    local.set $0
    local.get $5
    i32.const 1
    i32.add
    local.set $5
    br $while-continue|1
   end
  end
  local.get $5
  i32.const 1
  i32.sub
  return
 )
 (func $~lib/util/number/utoa64_any_core (param $0 i32) (param $1 i64) (param $2 i32) (param $3 i32)
  (local $4 i64)
  (local $5 i64)
  (local $6 i64)
  (local $7 i64)
  local.get $3
  i64.extend_i32_s
  local.set $4
  local.get $3
  local.get $3
  i32.const 1
  i32.sub
  i32.and
  i32.const 0
  i32.eq
  if
   local.get $3
   i32.ctz
   i32.const 7
   i32.and
   i64.extend_i32_s
   local.set $5
   local.get $4
   i64.const 1
   i64.sub
   local.set $6
   loop $do-loop|0
    local.get $2
    i32.const 1
    i32.sub
    local.set $2
    local.get $0
    local.get $2
    i32.const 1
    i32.shl
    i32.add
    i32.const 2832
    local.get $1
    local.get $6
    i64.and
    i32.wrap_i64
    i32.const 1
    i32.shl
    i32.add
    i32.load16_u
    i32.store16
    local.get $1
    local.get $5
    i64.shr_u
    local.set $1
    local.get $1
    i64.const 0
    i64.ne
    br_if $do-loop|0
   end
  else
   loop $do-loop|1
    local.get $2
    i32.const 1
    i32.sub
    local.set $2
    local.get $1
    local.get $4
    i64.div_u
    local.set $7
    local.get $0
    local.get $2
    i32.const 1
    i32.shl
    i32.add
    i32.const 2832
    local.get $1
    local.get $7
    local.get $4
    i64.mul
    i64.sub
    i32.wrap_i64
    i32.const 1
    i32.shl
    i32.add
    i32.load16_u
    i32.store16
    local.get $7
    local.set $1
    local.get $1
    i64.const 0
    i64.ne
    br_if $do-loop|1
   end
  end
 )
 (func $~lib/util/number/itoa32 (param $0 i32) (param $1 i32) (result i32)
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
  local.get $1
  i32.const 2
  i32.lt_s
  if (result i32)
   i32.const 1
  else
   local.get $1
   i32.const 36
   i32.gt_s
  end
  if
   i32.const 1152
   i32.const 1280
   i32.const 373
   i32.const 5
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.eqz
  if
   i32.const 1344
   return
  end
  local.get $0
  i32.const 31
  i32.shr_u
  i32.const 1
  i32.shl
  local.set $2
  local.get $2
  if
   i32.const 0
   local.get $0
   i32.sub
   local.set $0
  end
  local.get $1
  i32.const 10
  i32.eq
  if
   local.get $0
   call $~lib/util/number/decimalCount32
   local.set $4
   local.get $4
   i32.const 1
   i32.shl
   local.get $2
   i32.add
   i32.const 2
   call $~lib/rt/tcms/__new
   local.set $3
   local.get $3
   local.get $2
   i32.add
   local.set $5
   local.get $0
   local.set $6
   local.get $4
   local.set $7
   i32.const 0
   i32.const 1
   i32.ge_s
   drop
   local.get $5
   local.get $6
   local.get $7
   call $~lib/util/number/utoa32_dec_lut
  else
   local.get $1
   i32.const 16
   i32.eq
   if
    i32.const 31
    local.get $0
    i32.clz
    i32.sub
    i32.const 2
    i32.shr_s
    i32.const 1
    i32.add
    local.set $8
    local.get $8
    i32.const 1
    i32.shl
    local.get $2
    i32.add
    i32.const 2
    call $~lib/rt/tcms/__new
    local.set $3
    local.get $3
    local.get $2
    i32.add
    local.set $9
    local.get $0
    local.set $10
    local.get $8
    local.set $11
    i32.const 0
    i32.const 1
    i32.ge_s
    drop
    local.get $9
    local.get $10
    i64.extend_i32_u
    local.get $11
    call $~lib/util/number/utoa_hex_lut
   else
    local.get $0
    local.set $12
    local.get $12
    i64.extend_i32_u
    local.get $1
    call $~lib/util/number/ulog_base
    local.set $13
    local.get $13
    i32.const 1
    i32.shl
    local.get $2
    i32.add
    i32.const 2
    call $~lib/rt/tcms/__new
    local.set $3
    local.get $3
    local.get $2
    i32.add
    local.get $12
    i64.extend_i32_u
    local.get $13
    local.get $1
    call $~lib/util/number/utoa64_any_core
   end
  end
  local.get $2
  if
   local.get $3
   i32.const 45
   i32.store16
  end
  local.get $3
  return
 )
 (func $~lib/number/I32#toString (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  local.get $1
  call $~lib/util/number/itoa32
  return
 )
 (func $~lib/rt/common/OBJECT#get:rtSize (param $0 i32) (result i32)
  local.get $0
  i32.load offset=16
 )
 (func $~lib/string/String#get:length (param $0 i32) (result i32)
  local.get $0
  i32.const 20
  i32.sub
  call $~lib/rt/common/OBJECT#get:rtSize
  i32.const 1
  i32.shr_u
  return
 )
 (func $~lib/string/String#concat (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  local.get $0
  call $~lib/string/String#get:length
  i32.const 1
  i32.shl
  local.set $2
  local.get $1
  call $~lib/string/String#get:length
  i32.const 1
  i32.shl
  local.set $3
  local.get $2
  local.get $3
  i32.add
  local.set $4
  local.get $4
  i32.const 0
  i32.eq
  if
   i32.const 3024
   return
  end
  local.get $4
  i32.const 2
  call $~lib/rt/tcms/__new
  local.set $5
  local.get $5
  local.get $0
  local.get $2
  memory.copy
  local.get $5
  local.get $2
  i32.add
  local.get $1
  local.get $3
  memory.copy
  local.get $5
  return
 )
 (func $start:assembly/simd
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 v128)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 v128)
  (local $9 i32)
  i32.const 992
  call $~lib/rt/tcms/initLazy
  global.set $~lib/rt/tcms/fromSpace
  i32.const 0
  i32.const 4
  i32.const 64
  i32.mul
  i32.const 4
  i32.mul
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/simd/kV128ArrayBuffer
  global.get $assembly/simd/kV128ArrayBuffer
  global.set $assembly/simd/kV128Ptr
  i32.const 0
  local.set $0
  loop $for-loop|0
   local.get $0
   i32.const 64
   i32.lt_s
   if
    global.get $assembly/simd/kV128Ptr
    local.set $1
    local.get $0
    local.set $2
    global.get $assembly/utils/const/K
    local.get $0
    call $~lib/array/Array<u32>#__get
    i32x4.splat
    local.set $3
    block $break|1
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
                                                                      local.get $2
                                                                      local.set $4
                                                                      local.get $4
                                                                      i32.const 0
                                                                      i32.eq
                                                                      br_if $case0|1
                                                                      local.get $4
                                                                      i32.const 1
                                                                      i32.eq
                                                                      br_if $case1|1
                                                                      local.get $4
                                                                      i32.const 2
                                                                      i32.eq
                                                                      br_if $case2|1
                                                                      local.get $4
                                                                      i32.const 3
                                                                      i32.eq
                                                                      br_if $case3|1
                                                                      local.get $4
                                                                      i32.const 4
                                                                      i32.eq
                                                                      br_if $case4|1
                                                                      local.get $4
                                                                      i32.const 5
                                                                      i32.eq
                                                                      br_if $case5|1
                                                                      local.get $4
                                                                      i32.const 6
                                                                      i32.eq
                                                                      br_if $case6|1
                                                                      local.get $4
                                                                      i32.const 7
                                                                      i32.eq
                                                                      br_if $case7|1
                                                                      local.get $4
                                                                      i32.const 8
                                                                      i32.eq
                                                                      br_if $case8|1
                                                                      local.get $4
                                                                      i32.const 9
                                                                      i32.eq
                                                                      br_if $case9|1
                                                                      local.get $4
                                                                      i32.const 10
                                                                      i32.eq
                                                                      br_if $case10|1
                                                                      local.get $4
                                                                      i32.const 11
                                                                      i32.eq
                                                                      br_if $case11|1
                                                                      local.get $4
                                                                      i32.const 12
                                                                      i32.eq
                                                                      br_if $case12|1
                                                                      local.get $4
                                                                      i32.const 13
                                                                      i32.eq
                                                                      br_if $case13|1
                                                                      local.get $4
                                                                      i32.const 14
                                                                      i32.eq
                                                                      br_if $case14|1
                                                                      local.get $4
                                                                      i32.const 15
                                                                      i32.eq
                                                                      br_if $case15|1
                                                                      local.get $4
                                                                      i32.const 16
                                                                      i32.eq
                                                                      br_if $case16|1
                                                                      local.get $4
                                                                      i32.const 17
                                                                      i32.eq
                                                                      br_if $case17|1
                                                                      local.get $4
                                                                      i32.const 18
                                                                      i32.eq
                                                                      br_if $case18|1
                                                                      local.get $4
                                                                      i32.const 19
                                                                      i32.eq
                                                                      br_if $case19|1
                                                                      local.get $4
                                                                      i32.const 20
                                                                      i32.eq
                                                                      br_if $case20|1
                                                                      local.get $4
                                                                      i32.const 21
                                                                      i32.eq
                                                                      br_if $case21|1
                                                                      local.get $4
                                                                      i32.const 22
                                                                      i32.eq
                                                                      br_if $case22|1
                                                                      local.get $4
                                                                      i32.const 23
                                                                      i32.eq
                                                                      br_if $case23|1
                                                                      local.get $4
                                                                      i32.const 24
                                                                      i32.eq
                                                                      br_if $case24|1
                                                                      local.get $4
                                                                      i32.const 25
                                                                      i32.eq
                                                                      br_if $case25|1
                                                                      local.get $4
                                                                      i32.const 26
                                                                      i32.eq
                                                                      br_if $case26|1
                                                                      local.get $4
                                                                      i32.const 27
                                                                      i32.eq
                                                                      br_if $case27|1
                                                                      local.get $4
                                                                      i32.const 28
                                                                      i32.eq
                                                                      br_if $case28|1
                                                                      local.get $4
                                                                      i32.const 29
                                                                      i32.eq
                                                                      br_if $case29|1
                                                                      local.get $4
                                                                      i32.const 30
                                                                      i32.eq
                                                                      br_if $case30|1
                                                                      local.get $4
                                                                      i32.const 31
                                                                      i32.eq
                                                                      br_if $case31|1
                                                                      local.get $4
                                                                      i32.const 32
                                                                      i32.eq
                                                                      br_if $case32|1
                                                                      local.get $4
                                                                      i32.const 33
                                                                      i32.eq
                                                                      br_if $case33|1
                                                                      local.get $4
                                                                      i32.const 34
                                                                      i32.eq
                                                                      br_if $case34|1
                                                                      local.get $4
                                                                      i32.const 35
                                                                      i32.eq
                                                                      br_if $case35|1
                                                                      local.get $4
                                                                      i32.const 36
                                                                      i32.eq
                                                                      br_if $case36|1
                                                                      local.get $4
                                                                      i32.const 37
                                                                      i32.eq
                                                                      br_if $case37|1
                                                                      local.get $4
                                                                      i32.const 38
                                                                      i32.eq
                                                                      br_if $case38|1
                                                                      local.get $4
                                                                      i32.const 39
                                                                      i32.eq
                                                                      br_if $case39|1
                                                                      local.get $4
                                                                      i32.const 40
                                                                      i32.eq
                                                                      br_if $case40|1
                                                                      local.get $4
                                                                      i32.const 41
                                                                      i32.eq
                                                                      br_if $case41|1
                                                                      local.get $4
                                                                      i32.const 42
                                                                      i32.eq
                                                                      br_if $case42|1
                                                                      local.get $4
                                                                      i32.const 43
                                                                      i32.eq
                                                                      br_if $case43|1
                                                                      local.get $4
                                                                      i32.const 44
                                                                      i32.eq
                                                                      br_if $case44|1
                                                                      local.get $4
                                                                      i32.const 45
                                                                      i32.eq
                                                                      br_if $case45|1
                                                                      local.get $4
                                                                      i32.const 46
                                                                      i32.eq
                                                                      br_if $case46|1
                                                                      local.get $4
                                                                      i32.const 47
                                                                      i32.eq
                                                                      br_if $case47|1
                                                                      local.get $4
                                                                      i32.const 48
                                                                      i32.eq
                                                                      br_if $case48|1
                                                                      local.get $4
                                                                      i32.const 49
                                                                      i32.eq
                                                                      br_if $case49|1
                                                                      local.get $4
                                                                      i32.const 50
                                                                      i32.eq
                                                                      br_if $case50|1
                                                                      local.get $4
                                                                      i32.const 51
                                                                      i32.eq
                                                                      br_if $case51|1
                                                                      local.get $4
                                                                      i32.const 52
                                                                      i32.eq
                                                                      br_if $case52|1
                                                                      local.get $4
                                                                      i32.const 53
                                                                      i32.eq
                                                                      br_if $case53|1
                                                                      local.get $4
                                                                      i32.const 54
                                                                      i32.eq
                                                                      br_if $case54|1
                                                                      local.get $4
                                                                      i32.const 55
                                                                      i32.eq
                                                                      br_if $case55|1
                                                                      local.get $4
                                                                      i32.const 56
                                                                      i32.eq
                                                                      br_if $case56|1
                                                                      local.get $4
                                                                      i32.const 57
                                                                      i32.eq
                                                                      br_if $case57|1
                                                                      local.get $4
                                                                      i32.const 58
                                                                      i32.eq
                                                                      br_if $case58|1
                                                                      local.get $4
                                                                      i32.const 59
                                                                      i32.eq
                                                                      br_if $case59|1
                                                                      local.get $4
                                                                      i32.const 60
                                                                      i32.eq
                                                                      br_if $case60|1
                                                                      local.get $4
                                                                      i32.const 61
                                                                      i32.eq
                                                                      br_if $case61|1
                                                                      local.get $4
                                                                      i32.const 62
                                                                      i32.eq
                                                                      br_if $case62|1
                                                                      local.get $4
                                                                      i32.const 63
                                                                      i32.eq
                                                                      br_if $case63|1
                                                                      br $case64|1
                                                                     end
                                                                     local.get $1
                                                                     local.get $3
                                                                     v128.store
                                                                     br $break|1
                                                                    end
                                                                    local.get $1
                                                                    local.get $3
                                                                    v128.store offset=16
                                                                    br $break|1
                                                                   end
                                                                   local.get $1
                                                                   local.get $3
                                                                   v128.store offset=32
                                                                   br $break|1
                                                                  end
                                                                  local.get $1
                                                                  local.get $3
                                                                  v128.store offset=48
                                                                  br $break|1
                                                                 end
                                                                 local.get $1
                                                                 local.get $3
                                                                 v128.store offset=64
                                                                 br $break|1
                                                                end
                                                                local.get $1
                                                                local.get $3
                                                                v128.store offset=80
                                                                br $break|1
                                                               end
                                                               local.get $1
                                                               local.get $3
                                                               v128.store offset=96
                                                               br $break|1
                                                              end
                                                              local.get $1
                                                              local.get $3
                                                              v128.store offset=112
                                                              br $break|1
                                                             end
                                                             local.get $1
                                                             local.get $3
                                                             v128.store offset=128
                                                             br $break|1
                                                            end
                                                            local.get $1
                                                            local.get $3
                                                            v128.store offset=144
                                                            br $break|1
                                                           end
                                                           local.get $1
                                                           local.get $3
                                                           v128.store offset=160
                                                           br $break|1
                                                          end
                                                          local.get $1
                                                          local.get $3
                                                          v128.store offset=176
                                                          br $break|1
                                                         end
                                                         local.get $1
                                                         local.get $3
                                                         v128.store offset=192
                                                         br $break|1
                                                        end
                                                        local.get $1
                                                        local.get $3
                                                        v128.store offset=208
                                                        br $break|1
                                                       end
                                                       local.get $1
                                                       local.get $3
                                                       v128.store offset=224
                                                       br $break|1
                                                      end
                                                      local.get $1
                                                      local.get $3
                                                      v128.store offset=240
                                                      br $break|1
                                                     end
                                                     local.get $1
                                                     local.get $3
                                                     v128.store offset=256
                                                     br $break|1
                                                    end
                                                    local.get $1
                                                    local.get $3
                                                    v128.store offset=272
                                                    br $break|1
                                                   end
                                                   local.get $1
                                                   local.get $3
                                                   v128.store offset=288
                                                   br $break|1
                                                  end
                                                  local.get $1
                                                  local.get $3
                                                  v128.store offset=304
                                                  br $break|1
                                                 end
                                                 local.get $1
                                                 local.get $3
                                                 v128.store offset=320
                                                 br $break|1
                                                end
                                                local.get $1
                                                local.get $3
                                                v128.store offset=336
                                                br $break|1
                                               end
                                               local.get $1
                                               local.get $3
                                               v128.store offset=352
                                               br $break|1
                                              end
                                              local.get $1
                                              local.get $3
                                              v128.store offset=368
                                              br $break|1
                                             end
                                             local.get $1
                                             local.get $3
                                             v128.store offset=384
                                             br $break|1
                                            end
                                            local.get $1
                                            local.get $3
                                            v128.store offset=400
                                            br $break|1
                                           end
                                           local.get $1
                                           local.get $3
                                           v128.store offset=416
                                           br $break|1
                                          end
                                          local.get $1
                                          local.get $3
                                          v128.store offset=432
                                          br $break|1
                                         end
                                         local.get $1
                                         local.get $3
                                         v128.store offset=448
                                         br $break|1
                                        end
                                        local.get $1
                                        local.get $3
                                        v128.store offset=464
                                        br $break|1
                                       end
                                       local.get $1
                                       local.get $3
                                       v128.store offset=480
                                       br $break|1
                                      end
                                      local.get $1
                                      local.get $3
                                      v128.store offset=496
                                      br $break|1
                                     end
                                     local.get $1
                                     local.get $3
                                     v128.store offset=512
                                     br $break|1
                                    end
                                    local.get $1
                                    local.get $3
                                    v128.store offset=528
                                    br $break|1
                                   end
                                   local.get $1
                                   local.get $3
                                   v128.store offset=544
                                   br $break|1
                                  end
                                  local.get $1
                                  local.get $3
                                  v128.store offset=560
                                  br $break|1
                                 end
                                 local.get $1
                                 local.get $3
                                 v128.store offset=576
                                 br $break|1
                                end
                                local.get $1
                                local.get $3
                                v128.store offset=592
                                br $break|1
                               end
                               local.get $1
                               local.get $3
                               v128.store offset=608
                               br $break|1
                              end
                              local.get $1
                              local.get $3
                              v128.store offset=624
                              br $break|1
                             end
                             local.get $1
                             local.get $3
                             v128.store offset=640
                             br $break|1
                            end
                            local.get $1
                            local.get $3
                            v128.store offset=656
                            br $break|1
                           end
                           local.get $1
                           local.get $3
                           v128.store offset=672
                           br $break|1
                          end
                          local.get $1
                          local.get $3
                          v128.store offset=688
                          br $break|1
                         end
                         local.get $1
                         local.get $3
                         v128.store offset=704
                         br $break|1
                        end
                        local.get $1
                        local.get $3
                        v128.store offset=720
                        br $break|1
                       end
                       local.get $1
                       local.get $3
                       v128.store offset=736
                       br $break|1
                      end
                      local.get $1
                      local.get $3
                      v128.store offset=752
                      br $break|1
                     end
                     local.get $1
                     local.get $3
                     v128.store offset=768
                     br $break|1
                    end
                    local.get $1
                    local.get $3
                    v128.store offset=784
                    br $break|1
                   end
                   local.get $1
                   local.get $3
                   v128.store offset=800
                   br $break|1
                  end
                  local.get $1
                  local.get $3
                  v128.store offset=816
                  br $break|1
                 end
                 local.get $1
                 local.get $3
                 v128.store offset=832
                 br $break|1
                end
                local.get $1
                local.get $3
                v128.store offset=848
                br $break|1
               end
               local.get $1
               local.get $3
               v128.store offset=864
               br $break|1
              end
              local.get $1
              local.get $3
              v128.store offset=880
              br $break|1
             end
             local.get $1
             local.get $3
             v128.store offset=896
             br $break|1
            end
            local.get $1
            local.get $3
            v128.store offset=912
            br $break|1
           end
           local.get $1
           local.get $3
           v128.store offset=928
           br $break|1
          end
          local.get $1
          local.get $3
          v128.store offset=944
          br $break|1
         end
         local.get $1
         local.get $3
         v128.store offset=960
         br $break|1
        end
        local.get $1
        local.get $3
        v128.store offset=976
        br $break|1
       end
       local.get $1
       local.get $3
       v128.store offset=992
       br $break|1
      end
      local.get $1
      local.get $3
      v128.store offset=1008
      br $break|1
     end
     i32.const 2928
     local.get $2
     i32.const 10
     call $~lib/number/I32#toString
     call $~lib/string/String#concat
     i32.const 3056
     i32.const 201
     i32.const 7
     call $~lib/builtins/abort
     unreachable
    end
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|0
   end
  end
  i32.const 0
  i32.const 4
  i32.const 64
  i32.mul
  i32.const 4
  i32.mul
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $assembly/simd/w64V12ArrayBuffer
  global.get $assembly/simd/w64V12ArrayBuffer
  global.set $assembly/simd/w64V128Ptr
  i32.const 0
  local.set $5
  loop $for-loop|2
   local.get $5
   i32.const 64
   i32.lt_s
   if
    global.get $assembly/simd/w64V128Ptr
    local.set $6
    local.get $5
    local.set $7
    global.get $assembly/utils/const/W64
    local.get $5
    call $~lib/array/Array<u32>#__get
    i32x4.splat
    local.set $8
    block $break|3
     block $case64|3
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
                                                                      local.get $7
                                                                      local.set $9
                                                                      local.get $9
                                                                      i32.const 0
                                                                      i32.eq
                                                                      br_if $case0|3
                                                                      local.get $9
                                                                      i32.const 1
                                                                      i32.eq
                                                                      br_if $case1|3
                                                                      local.get $9
                                                                      i32.const 2
                                                                      i32.eq
                                                                      br_if $case2|3
                                                                      local.get $9
                                                                      i32.const 3
                                                                      i32.eq
                                                                      br_if $case3|3
                                                                      local.get $9
                                                                      i32.const 4
                                                                      i32.eq
                                                                      br_if $case4|3
                                                                      local.get $9
                                                                      i32.const 5
                                                                      i32.eq
                                                                      br_if $case5|3
                                                                      local.get $9
                                                                      i32.const 6
                                                                      i32.eq
                                                                      br_if $case6|3
                                                                      local.get $9
                                                                      i32.const 7
                                                                      i32.eq
                                                                      br_if $case7|3
                                                                      local.get $9
                                                                      i32.const 8
                                                                      i32.eq
                                                                      br_if $case8|3
                                                                      local.get $9
                                                                      i32.const 9
                                                                      i32.eq
                                                                      br_if $case9|3
                                                                      local.get $9
                                                                      i32.const 10
                                                                      i32.eq
                                                                      br_if $case10|3
                                                                      local.get $9
                                                                      i32.const 11
                                                                      i32.eq
                                                                      br_if $case11|3
                                                                      local.get $9
                                                                      i32.const 12
                                                                      i32.eq
                                                                      br_if $case12|3
                                                                      local.get $9
                                                                      i32.const 13
                                                                      i32.eq
                                                                      br_if $case13|3
                                                                      local.get $9
                                                                      i32.const 14
                                                                      i32.eq
                                                                      br_if $case14|3
                                                                      local.get $9
                                                                      i32.const 15
                                                                      i32.eq
                                                                      br_if $case15|3
                                                                      local.get $9
                                                                      i32.const 16
                                                                      i32.eq
                                                                      br_if $case16|3
                                                                      local.get $9
                                                                      i32.const 17
                                                                      i32.eq
                                                                      br_if $case17|3
                                                                      local.get $9
                                                                      i32.const 18
                                                                      i32.eq
                                                                      br_if $case18|3
                                                                      local.get $9
                                                                      i32.const 19
                                                                      i32.eq
                                                                      br_if $case19|3
                                                                      local.get $9
                                                                      i32.const 20
                                                                      i32.eq
                                                                      br_if $case20|3
                                                                      local.get $9
                                                                      i32.const 21
                                                                      i32.eq
                                                                      br_if $case21|3
                                                                      local.get $9
                                                                      i32.const 22
                                                                      i32.eq
                                                                      br_if $case22|3
                                                                      local.get $9
                                                                      i32.const 23
                                                                      i32.eq
                                                                      br_if $case23|3
                                                                      local.get $9
                                                                      i32.const 24
                                                                      i32.eq
                                                                      br_if $case24|3
                                                                      local.get $9
                                                                      i32.const 25
                                                                      i32.eq
                                                                      br_if $case25|3
                                                                      local.get $9
                                                                      i32.const 26
                                                                      i32.eq
                                                                      br_if $case26|3
                                                                      local.get $9
                                                                      i32.const 27
                                                                      i32.eq
                                                                      br_if $case27|3
                                                                      local.get $9
                                                                      i32.const 28
                                                                      i32.eq
                                                                      br_if $case28|3
                                                                      local.get $9
                                                                      i32.const 29
                                                                      i32.eq
                                                                      br_if $case29|3
                                                                      local.get $9
                                                                      i32.const 30
                                                                      i32.eq
                                                                      br_if $case30|3
                                                                      local.get $9
                                                                      i32.const 31
                                                                      i32.eq
                                                                      br_if $case31|3
                                                                      local.get $9
                                                                      i32.const 32
                                                                      i32.eq
                                                                      br_if $case32|3
                                                                      local.get $9
                                                                      i32.const 33
                                                                      i32.eq
                                                                      br_if $case33|3
                                                                      local.get $9
                                                                      i32.const 34
                                                                      i32.eq
                                                                      br_if $case34|3
                                                                      local.get $9
                                                                      i32.const 35
                                                                      i32.eq
                                                                      br_if $case35|3
                                                                      local.get $9
                                                                      i32.const 36
                                                                      i32.eq
                                                                      br_if $case36|3
                                                                      local.get $9
                                                                      i32.const 37
                                                                      i32.eq
                                                                      br_if $case37|3
                                                                      local.get $9
                                                                      i32.const 38
                                                                      i32.eq
                                                                      br_if $case38|3
                                                                      local.get $9
                                                                      i32.const 39
                                                                      i32.eq
                                                                      br_if $case39|3
                                                                      local.get $9
                                                                      i32.const 40
                                                                      i32.eq
                                                                      br_if $case40|3
                                                                      local.get $9
                                                                      i32.const 41
                                                                      i32.eq
                                                                      br_if $case41|3
                                                                      local.get $9
                                                                      i32.const 42
                                                                      i32.eq
                                                                      br_if $case42|3
                                                                      local.get $9
                                                                      i32.const 43
                                                                      i32.eq
                                                                      br_if $case43|3
                                                                      local.get $9
                                                                      i32.const 44
                                                                      i32.eq
                                                                      br_if $case44|3
                                                                      local.get $9
                                                                      i32.const 45
                                                                      i32.eq
                                                                      br_if $case45|3
                                                                      local.get $9
                                                                      i32.const 46
                                                                      i32.eq
                                                                      br_if $case46|3
                                                                      local.get $9
                                                                      i32.const 47
                                                                      i32.eq
                                                                      br_if $case47|3
                                                                      local.get $9
                                                                      i32.const 48
                                                                      i32.eq
                                                                      br_if $case48|3
                                                                      local.get $9
                                                                      i32.const 49
                                                                      i32.eq
                                                                      br_if $case49|3
                                                                      local.get $9
                                                                      i32.const 50
                                                                      i32.eq
                                                                      br_if $case50|3
                                                                      local.get $9
                                                                      i32.const 51
                                                                      i32.eq
                                                                      br_if $case51|3
                                                                      local.get $9
                                                                      i32.const 52
                                                                      i32.eq
                                                                      br_if $case52|3
                                                                      local.get $9
                                                                      i32.const 53
                                                                      i32.eq
                                                                      br_if $case53|3
                                                                      local.get $9
                                                                      i32.const 54
                                                                      i32.eq
                                                                      br_if $case54|3
                                                                      local.get $9
                                                                      i32.const 55
                                                                      i32.eq
                                                                      br_if $case55|3
                                                                      local.get $9
                                                                      i32.const 56
                                                                      i32.eq
                                                                      br_if $case56|3
                                                                      local.get $9
                                                                      i32.const 57
                                                                      i32.eq
                                                                      br_if $case57|3
                                                                      local.get $9
                                                                      i32.const 58
                                                                      i32.eq
                                                                      br_if $case58|3
                                                                      local.get $9
                                                                      i32.const 59
                                                                      i32.eq
                                                                      br_if $case59|3
                                                                      local.get $9
                                                                      i32.const 60
                                                                      i32.eq
                                                                      br_if $case60|3
                                                                      local.get $9
                                                                      i32.const 61
                                                                      i32.eq
                                                                      br_if $case61|3
                                                                      local.get $9
                                                                      i32.const 62
                                                                      i32.eq
                                                                      br_if $case62|3
                                                                      local.get $9
                                                                      i32.const 63
                                                                      i32.eq
                                                                      br_if $case63|3
                                                                      br $case64|3
                                                                     end
                                                                     local.get $6
                                                                     local.get $8
                                                                     v128.store
                                                                     br $break|3
                                                                    end
                                                                    local.get $6
                                                                    local.get $8
                                                                    v128.store offset=16
                                                                    br $break|3
                                                                   end
                                                                   local.get $6
                                                                   local.get $8
                                                                   v128.store offset=32
                                                                   br $break|3
                                                                  end
                                                                  local.get $6
                                                                  local.get $8
                                                                  v128.store offset=48
                                                                  br $break|3
                                                                 end
                                                                 local.get $6
                                                                 local.get $8
                                                                 v128.store offset=64
                                                                 br $break|3
                                                                end
                                                                local.get $6
                                                                local.get $8
                                                                v128.store offset=80
                                                                br $break|3
                                                               end
                                                               local.get $6
                                                               local.get $8
                                                               v128.store offset=96
                                                               br $break|3
                                                              end
                                                              local.get $6
                                                              local.get $8
                                                              v128.store offset=112
                                                              br $break|3
                                                             end
                                                             local.get $6
                                                             local.get $8
                                                             v128.store offset=128
                                                             br $break|3
                                                            end
                                                            local.get $6
                                                            local.get $8
                                                            v128.store offset=144
                                                            br $break|3
                                                           end
                                                           local.get $6
                                                           local.get $8
                                                           v128.store offset=160
                                                           br $break|3
                                                          end
                                                          local.get $6
                                                          local.get $8
                                                          v128.store offset=176
                                                          br $break|3
                                                         end
                                                         local.get $6
                                                         local.get $8
                                                         v128.store offset=192
                                                         br $break|3
                                                        end
                                                        local.get $6
                                                        local.get $8
                                                        v128.store offset=208
                                                        br $break|3
                                                       end
                                                       local.get $6
                                                       local.get $8
                                                       v128.store offset=224
                                                       br $break|3
                                                      end
                                                      local.get $6
                                                      local.get $8
                                                      v128.store offset=240
                                                      br $break|3
                                                     end
                                                     local.get $6
                                                     local.get $8
                                                     v128.store offset=256
                                                     br $break|3
                                                    end
                                                    local.get $6
                                                    local.get $8
                                                    v128.store offset=272
                                                    br $break|3
                                                   end
                                                   local.get $6
                                                   local.get $8
                                                   v128.store offset=288
                                                   br $break|3
                                                  end
                                                  local.get $6
                                                  local.get $8
                                                  v128.store offset=304
                                                  br $break|3
                                                 end
                                                 local.get $6
                                                 local.get $8
                                                 v128.store offset=320
                                                 br $break|3
                                                end
                                                local.get $6
                                                local.get $8
                                                v128.store offset=336
                                                br $break|3
                                               end
                                               local.get $6
                                               local.get $8
                                               v128.store offset=352
                                               br $break|3
                                              end
                                              local.get $6
                                              local.get $8
                                              v128.store offset=368
                                              br $break|3
                                             end
                                             local.get $6
                                             local.get $8
                                             v128.store offset=384
                                             br $break|3
                                            end
                                            local.get $6
                                            local.get $8
                                            v128.store offset=400
                                            br $break|3
                                           end
                                           local.get $6
                                           local.get $8
                                           v128.store offset=416
                                           br $break|3
                                          end
                                          local.get $6
                                          local.get $8
                                          v128.store offset=432
                                          br $break|3
                                         end
                                         local.get $6
                                         local.get $8
                                         v128.store offset=448
                                         br $break|3
                                        end
                                        local.get $6
                                        local.get $8
                                        v128.store offset=464
                                        br $break|3
                                       end
                                       local.get $6
                                       local.get $8
                                       v128.store offset=480
                                       br $break|3
                                      end
                                      local.get $6
                                      local.get $8
                                      v128.store offset=496
                                      br $break|3
                                     end
                                     local.get $6
                                     local.get $8
                                     v128.store offset=512
                                     br $break|3
                                    end
                                    local.get $6
                                    local.get $8
                                    v128.store offset=528
                                    br $break|3
                                   end
                                   local.get $6
                                   local.get $8
                                   v128.store offset=544
                                   br $break|3
                                  end
                                  local.get $6
                                  local.get $8
                                  v128.store offset=560
                                  br $break|3
                                 end
                                 local.get $6
                                 local.get $8
                                 v128.store offset=576
                                 br $break|3
                                end
                                local.get $6
                                local.get $8
                                v128.store offset=592
                                br $break|3
                               end
                               local.get $6
                               local.get $8
                               v128.store offset=608
                               br $break|3
                              end
                              local.get $6
                              local.get $8
                              v128.store offset=624
                              br $break|3
                             end
                             local.get $6
                             local.get $8
                             v128.store offset=640
                             br $break|3
                            end
                            local.get $6
                            local.get $8
                            v128.store offset=656
                            br $break|3
                           end
                           local.get $6
                           local.get $8
                           v128.store offset=672
                           br $break|3
                          end
                          local.get $6
                          local.get $8
                          v128.store offset=688
                          br $break|3
                         end
                         local.get $6
                         local.get $8
                         v128.store offset=704
                         br $break|3
                        end
                        local.get $6
                        local.get $8
                        v128.store offset=720
                        br $break|3
                       end
                       local.get $6
                       local.get $8
                       v128.store offset=736
                       br $break|3
                      end
                      local.get $6
                      local.get $8
                      v128.store offset=752
                      br $break|3
                     end
                     local.get $6
                     local.get $8
                     v128.store offset=768
                     br $break|3
                    end
                    local.get $6
                    local.get $8
                    v128.store offset=784
                    br $break|3
                   end
                   local.get $6
                   local.get $8
                   v128.store offset=800
                   br $break|3
                  end
                  local.get $6
                  local.get $8
                  v128.store offset=816
                  br $break|3
                 end
                 local.get $6
                 local.get $8
                 v128.store offset=832
                 br $break|3
                end
                local.get $6
                local.get $8
                v128.store offset=848
                br $break|3
               end
               local.get $6
               local.get $8
               v128.store offset=864
               br $break|3
              end
              local.get $6
              local.get $8
              v128.store offset=880
              br $break|3
             end
             local.get $6
             local.get $8
             v128.store offset=896
             br $break|3
            end
            local.get $6
            local.get $8
            v128.store offset=912
            br $break|3
           end
           local.get $6
           local.get $8
           v128.store offset=928
           br $break|3
          end
          local.get $6
          local.get $8
          v128.store offset=944
          br $break|3
         end
         local.get $6
         local.get $8
         v128.store offset=960
         br $break|3
        end
        local.get $6
        local.get $8
        v128.store offset=976
        br $break|3
       end
       local.get $6
       local.get $8
       v128.store offset=992
       br $break|3
      end
      local.get $6
      local.get $8
      v128.store offset=1008
      br $break|3
     end
     i32.const 2928
     local.get $7
     i32.const 10
     call $~lib/number/I32#toString
     call $~lib/string/String#concat
     i32.const 3056
     i32.const 201
     i32.const 7
     call $~lib/builtins/abort
     unreachable
    end
    local.get $5
    i32.const 1
    i32.add
    local.set $5
    br $for-loop|2
   end
  end
 )
 (func $start:assembly/common
  global.get $assembly/utils/const/K
  call $~lib/array/Array<u32>#get:dataStart
  global.set $assembly/common/kPtr
  global.get $assembly/utils/const/W64
  call $~lib/array/Array<u32>#get:dataStart
  global.set $assembly/common/w64Ptr
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
 (func $start:assembly/index.simd
  call $start:assembly/simd
  call $start:assembly/common
 )
 (func $assembly/simd/initV128
  global.get $assembly/simd/DEFAULT_H0V128
  global.set $assembly/simd/H0V128
  global.get $assembly/simd/DEFAULT_H1V128
  global.set $assembly/simd/H1V128
  global.get $assembly/simd/DEFAULT_H2V128
  global.set $assembly/simd/H2V128
  global.get $assembly/simd/DEFAULT_H3V128
  global.set $assembly/simd/H3V128
  global.get $assembly/simd/DEFAULT_H4V128
  global.set $assembly/simd/H4V128
  global.get $assembly/simd/DEFAULT_H5V128
  global.set $assembly/simd/H5V128
  global.get $assembly/simd/DEFAULT_H6V128
  global.set $assembly/simd/H6V128
  global.get $assembly/simd/DEFAULT_H7V128
  global.set $assembly/simd/H7V128
 )
 (func $assembly/simd/hashPreCompWV128
  (local $0 v128)
  (local $1 v128)
  (local $2 i32)
  (local $3 i32)
  (local $4 v128)
  (local $5 v128)
  (local $6 v128)
  (local $7 i32)
  (local $8 i32)
  (local $9 v128)
  (local $10 v128)
  (local $11 v128)
  (local $12 i32)
  (local $13 i32)
  (local $14 v128)
  (local $15 v128)
  (local $16 v128)
  (local $17 v128)
  (local $18 v128)
  (local $19 i32)
  (local $20 i32)
  (local $21 i32)
  (local $22 v128)
  (local $23 v128)
  (local $24 i32)
  (local $25 i32)
  (local $26 v128)
  (local $27 v128)
  (local $28 v128)
  (local $29 i32)
  (local $30 i32)
  (local $31 v128)
  (local $32 v128)
  (local $33 v128)
  (local $34 i32)
  (local $35 i32)
  (local $36 v128)
  (local $37 v128)
  (local $38 v128)
  (local $39 v128)
  (local $40 v128)
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
    block $assembly/simd/EP1V128|inlined.1 (result v128)
     global.get $assembly/simd/eV128
     local.set $0
     block $assembly/simd/rotrV128|inlined.10 (result v128)
      local.get $0
      local.set $1
      i32.const 6
      local.set $2
      i32.const 32
      local.get $2
      i32.sub
      local.set $3
      local.get $1
      local.get $2
      i32x4.shr_u
      local.set $4
      local.get $1
      local.get $3
      i32x4.shl
      local.set $5
      local.get $4
      local.get $5
      v128.or
      br $assembly/simd/rotrV128|inlined.10
     end
     block $assembly/simd/rotrV128|inlined.11 (result v128)
      local.get $0
      local.set $6
      i32.const 11
      local.set $7
      i32.const 32
      local.get $7
      i32.sub
      local.set $8
      local.get $6
      local.get $7
      i32x4.shr_u
      local.set $9
      local.get $6
      local.get $8
      i32x4.shl
      local.set $10
      local.get $9
      local.get $10
      v128.or
      br $assembly/simd/rotrV128|inlined.11
     end
     v128.xor
     block $assembly/simd/rotrV128|inlined.12 (result v128)
      local.get $0
      local.set $11
      i32.const 25
      local.set $12
      i32.const 32
      local.get $12
      i32.sub
      local.set $13
      local.get $11
      local.get $12
      i32x4.shr_u
      local.set $14
      local.get $11
      local.get $13
      i32x4.shl
      local.set $15
      local.get $14
      local.get $15
      v128.or
      br $assembly/simd/rotrV128|inlined.12
     end
     v128.xor
     br $assembly/simd/EP1V128|inlined.1
    end
    i32x4.add
    block $assembly/simd/CHV128|inlined.1 (result v128)
     global.get $assembly/simd/eV128
     local.set $16
     global.get $assembly/simd/fV128
     local.set $17
     global.get $assembly/simd/gV128
     local.set $18
     local.get $16
     local.get $17
     v128.and
     local.get $16
     v128.not
     local.get $18
     v128.and
     v128.xor
     br $assembly/simd/CHV128|inlined.1
    end
    i32x4.add
    block $assembly/utils/v128/getV128|inlined.6 (result v128)
     global.get $assembly/simd/w64V128Ptr
     local.set $19
     global.get $assembly/simd/i
     local.set $20
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
                                                                      local.get $20
                                                                      local.set $21
                                                                      local.get $21
                                                                      i32.const 0
                                                                      i32.eq
                                                                      br_if $case0|1
                                                                      local.get $21
                                                                      i32.const 1
                                                                      i32.eq
                                                                      br_if $case1|1
                                                                      local.get $21
                                                                      i32.const 2
                                                                      i32.eq
                                                                      br_if $case2|1
                                                                      local.get $21
                                                                      i32.const 3
                                                                      i32.eq
                                                                      br_if $case3|1
                                                                      local.get $21
                                                                      i32.const 4
                                                                      i32.eq
                                                                      br_if $case4|1
                                                                      local.get $21
                                                                      i32.const 5
                                                                      i32.eq
                                                                      br_if $case5|1
                                                                      local.get $21
                                                                      i32.const 6
                                                                      i32.eq
                                                                      br_if $case6|1
                                                                      local.get $21
                                                                      i32.const 7
                                                                      i32.eq
                                                                      br_if $case7|1
                                                                      local.get $21
                                                                      i32.const 8
                                                                      i32.eq
                                                                      br_if $case8|1
                                                                      local.get $21
                                                                      i32.const 9
                                                                      i32.eq
                                                                      br_if $case9|1
                                                                      local.get $21
                                                                      i32.const 10
                                                                      i32.eq
                                                                      br_if $case10|1
                                                                      local.get $21
                                                                      i32.const 11
                                                                      i32.eq
                                                                      br_if $case11|1
                                                                      local.get $21
                                                                      i32.const 12
                                                                      i32.eq
                                                                      br_if $case12|1
                                                                      local.get $21
                                                                      i32.const 13
                                                                      i32.eq
                                                                      br_if $case13|1
                                                                      local.get $21
                                                                      i32.const 14
                                                                      i32.eq
                                                                      br_if $case14|1
                                                                      local.get $21
                                                                      i32.const 15
                                                                      i32.eq
                                                                      br_if $case15|1
                                                                      local.get $21
                                                                      i32.const 16
                                                                      i32.eq
                                                                      br_if $case16|1
                                                                      local.get $21
                                                                      i32.const 17
                                                                      i32.eq
                                                                      br_if $case17|1
                                                                      local.get $21
                                                                      i32.const 18
                                                                      i32.eq
                                                                      br_if $case18|1
                                                                      local.get $21
                                                                      i32.const 19
                                                                      i32.eq
                                                                      br_if $case19|1
                                                                      local.get $21
                                                                      i32.const 20
                                                                      i32.eq
                                                                      br_if $case20|1
                                                                      local.get $21
                                                                      i32.const 21
                                                                      i32.eq
                                                                      br_if $case21|1
                                                                      local.get $21
                                                                      i32.const 22
                                                                      i32.eq
                                                                      br_if $case22|1
                                                                      local.get $21
                                                                      i32.const 23
                                                                      i32.eq
                                                                      br_if $case23|1
                                                                      local.get $21
                                                                      i32.const 24
                                                                      i32.eq
                                                                      br_if $case24|1
                                                                      local.get $21
                                                                      i32.const 25
                                                                      i32.eq
                                                                      br_if $case25|1
                                                                      local.get $21
                                                                      i32.const 26
                                                                      i32.eq
                                                                      br_if $case26|1
                                                                      local.get $21
                                                                      i32.const 27
                                                                      i32.eq
                                                                      br_if $case27|1
                                                                      local.get $21
                                                                      i32.const 28
                                                                      i32.eq
                                                                      br_if $case28|1
                                                                      local.get $21
                                                                      i32.const 29
                                                                      i32.eq
                                                                      br_if $case29|1
                                                                      local.get $21
                                                                      i32.const 30
                                                                      i32.eq
                                                                      br_if $case30|1
                                                                      local.get $21
                                                                      i32.const 31
                                                                      i32.eq
                                                                      br_if $case31|1
                                                                      local.get $21
                                                                      i32.const 32
                                                                      i32.eq
                                                                      br_if $case32|1
                                                                      local.get $21
                                                                      i32.const 33
                                                                      i32.eq
                                                                      br_if $case33|1
                                                                      local.get $21
                                                                      i32.const 34
                                                                      i32.eq
                                                                      br_if $case34|1
                                                                      local.get $21
                                                                      i32.const 35
                                                                      i32.eq
                                                                      br_if $case35|1
                                                                      local.get $21
                                                                      i32.const 36
                                                                      i32.eq
                                                                      br_if $case36|1
                                                                      local.get $21
                                                                      i32.const 37
                                                                      i32.eq
                                                                      br_if $case37|1
                                                                      local.get $21
                                                                      i32.const 38
                                                                      i32.eq
                                                                      br_if $case38|1
                                                                      local.get $21
                                                                      i32.const 39
                                                                      i32.eq
                                                                      br_if $case39|1
                                                                      local.get $21
                                                                      i32.const 40
                                                                      i32.eq
                                                                      br_if $case40|1
                                                                      local.get $21
                                                                      i32.const 41
                                                                      i32.eq
                                                                      br_if $case41|1
                                                                      local.get $21
                                                                      i32.const 42
                                                                      i32.eq
                                                                      br_if $case42|1
                                                                      local.get $21
                                                                      i32.const 43
                                                                      i32.eq
                                                                      br_if $case43|1
                                                                      local.get $21
                                                                      i32.const 44
                                                                      i32.eq
                                                                      br_if $case44|1
                                                                      local.get $21
                                                                      i32.const 45
                                                                      i32.eq
                                                                      br_if $case45|1
                                                                      local.get $21
                                                                      i32.const 46
                                                                      i32.eq
                                                                      br_if $case46|1
                                                                      local.get $21
                                                                      i32.const 47
                                                                      i32.eq
                                                                      br_if $case47|1
                                                                      local.get $21
                                                                      i32.const 48
                                                                      i32.eq
                                                                      br_if $case48|1
                                                                      local.get $21
                                                                      i32.const 49
                                                                      i32.eq
                                                                      br_if $case49|1
                                                                      local.get $21
                                                                      i32.const 50
                                                                      i32.eq
                                                                      br_if $case50|1
                                                                      local.get $21
                                                                      i32.const 51
                                                                      i32.eq
                                                                      br_if $case51|1
                                                                      local.get $21
                                                                      i32.const 52
                                                                      i32.eq
                                                                      br_if $case52|1
                                                                      local.get $21
                                                                      i32.const 53
                                                                      i32.eq
                                                                      br_if $case53|1
                                                                      local.get $21
                                                                      i32.const 54
                                                                      i32.eq
                                                                      br_if $case54|1
                                                                      local.get $21
                                                                      i32.const 55
                                                                      i32.eq
                                                                      br_if $case55|1
                                                                      local.get $21
                                                                      i32.const 56
                                                                      i32.eq
                                                                      br_if $case56|1
                                                                      local.get $21
                                                                      i32.const 57
                                                                      i32.eq
                                                                      br_if $case57|1
                                                                      local.get $21
                                                                      i32.const 58
                                                                      i32.eq
                                                                      br_if $case58|1
                                                                      local.get $21
                                                                      i32.const 59
                                                                      i32.eq
                                                                      br_if $case59|1
                                                                      local.get $21
                                                                      i32.const 60
                                                                      i32.eq
                                                                      br_if $case60|1
                                                                      local.get $21
                                                                      i32.const 61
                                                                      i32.eq
                                                                      br_if $case61|1
                                                                      local.get $21
                                                                      i32.const 62
                                                                      i32.eq
                                                                      br_if $case62|1
                                                                      local.get $21
                                                                      i32.const 63
                                                                      i32.eq
                                                                      br_if $case63|1
                                                                      br $case64|1
                                                                     end
                                                                     local.get $19
                                                                     v128.load
                                                                     br $assembly/utils/v128/getV128|inlined.6
                                                                    end
                                                                    local.get $19
                                                                    v128.load offset=16
                                                                    br $assembly/utils/v128/getV128|inlined.6
                                                                   end
                                                                   local.get $19
                                                                   v128.load offset=32
                                                                   br $assembly/utils/v128/getV128|inlined.6
                                                                  end
                                                                  local.get $19
                                                                  v128.load offset=48
                                                                  br $assembly/utils/v128/getV128|inlined.6
                                                                 end
                                                                 local.get $19
                                                                 v128.load offset=64
                                                                 br $assembly/utils/v128/getV128|inlined.6
                                                                end
                                                                local.get $19
                                                                v128.load offset=80
                                                                br $assembly/utils/v128/getV128|inlined.6
                                                               end
                                                               local.get $19
                                                               v128.load offset=96
                                                               br $assembly/utils/v128/getV128|inlined.6
                                                              end
                                                              local.get $19
                                                              v128.load offset=112
                                                              br $assembly/utils/v128/getV128|inlined.6
                                                             end
                                                             local.get $19
                                                             v128.load offset=128
                                                             br $assembly/utils/v128/getV128|inlined.6
                                                            end
                                                            local.get $19
                                                            v128.load offset=144
                                                            br $assembly/utils/v128/getV128|inlined.6
                                                           end
                                                           local.get $19
                                                           v128.load offset=160
                                                           br $assembly/utils/v128/getV128|inlined.6
                                                          end
                                                          local.get $19
                                                          v128.load offset=176
                                                          br $assembly/utils/v128/getV128|inlined.6
                                                         end
                                                         local.get $19
                                                         v128.load offset=192
                                                         br $assembly/utils/v128/getV128|inlined.6
                                                        end
                                                        local.get $19
                                                        v128.load offset=208
                                                        br $assembly/utils/v128/getV128|inlined.6
                                                       end
                                                       local.get $19
                                                       v128.load offset=224
                                                       br $assembly/utils/v128/getV128|inlined.6
                                                      end
                                                      local.get $19
                                                      v128.load offset=240
                                                      br $assembly/utils/v128/getV128|inlined.6
                                                     end
                                                     local.get $19
                                                     v128.load offset=256
                                                     br $assembly/utils/v128/getV128|inlined.6
                                                    end
                                                    local.get $19
                                                    v128.load offset=272
                                                    br $assembly/utils/v128/getV128|inlined.6
                                                   end
                                                   local.get $19
                                                   v128.load offset=288
                                                   br $assembly/utils/v128/getV128|inlined.6
                                                  end
                                                  local.get $19
                                                  v128.load offset=304
                                                  br $assembly/utils/v128/getV128|inlined.6
                                                 end
                                                 local.get $19
                                                 v128.load offset=320
                                                 br $assembly/utils/v128/getV128|inlined.6
                                                end
                                                local.get $19
                                                v128.load offset=336
                                                br $assembly/utils/v128/getV128|inlined.6
                                               end
                                               local.get $19
                                               v128.load offset=352
                                               br $assembly/utils/v128/getV128|inlined.6
                                              end
                                              local.get $19
                                              v128.load offset=368
                                              br $assembly/utils/v128/getV128|inlined.6
                                             end
                                             local.get $19
                                             v128.load offset=384
                                             br $assembly/utils/v128/getV128|inlined.6
                                            end
                                            local.get $19
                                            v128.load offset=400
                                            br $assembly/utils/v128/getV128|inlined.6
                                           end
                                           local.get $19
                                           v128.load offset=416
                                           br $assembly/utils/v128/getV128|inlined.6
                                          end
                                          local.get $19
                                          v128.load offset=432
                                          br $assembly/utils/v128/getV128|inlined.6
                                         end
                                         local.get $19
                                         v128.load offset=448
                                         br $assembly/utils/v128/getV128|inlined.6
                                        end
                                        local.get $19
                                        v128.load offset=464
                                        br $assembly/utils/v128/getV128|inlined.6
                                       end
                                       local.get $19
                                       v128.load offset=480
                                       br $assembly/utils/v128/getV128|inlined.6
                                      end
                                      local.get $19
                                      v128.load offset=496
                                      br $assembly/utils/v128/getV128|inlined.6
                                     end
                                     local.get $19
                                     v128.load offset=512
                                     br $assembly/utils/v128/getV128|inlined.6
                                    end
                                    local.get $19
                                    v128.load offset=528
                                    br $assembly/utils/v128/getV128|inlined.6
                                   end
                                   local.get $19
                                   v128.load offset=544
                                   br $assembly/utils/v128/getV128|inlined.6
                                  end
                                  local.get $19
                                  v128.load offset=560
                                  br $assembly/utils/v128/getV128|inlined.6
                                 end
                                 local.get $19
                                 v128.load offset=576
                                 br $assembly/utils/v128/getV128|inlined.6
                                end
                                local.get $19
                                v128.load offset=592
                                br $assembly/utils/v128/getV128|inlined.6
                               end
                               local.get $19
                               v128.load offset=608
                               br $assembly/utils/v128/getV128|inlined.6
                              end
                              local.get $19
                              v128.load offset=624
                              br $assembly/utils/v128/getV128|inlined.6
                             end
                             local.get $19
                             v128.load offset=640
                             br $assembly/utils/v128/getV128|inlined.6
                            end
                            local.get $19
                            v128.load offset=656
                            br $assembly/utils/v128/getV128|inlined.6
                           end
                           local.get $19
                           v128.load offset=672
                           br $assembly/utils/v128/getV128|inlined.6
                          end
                          local.get $19
                          v128.load offset=688
                          br $assembly/utils/v128/getV128|inlined.6
                         end
                         local.get $19
                         v128.load offset=704
                         br $assembly/utils/v128/getV128|inlined.6
                        end
                        local.get $19
                        v128.load offset=720
                        br $assembly/utils/v128/getV128|inlined.6
                       end
                       local.get $19
                       v128.load offset=736
                       br $assembly/utils/v128/getV128|inlined.6
                      end
                      local.get $19
                      v128.load offset=752
                      br $assembly/utils/v128/getV128|inlined.6
                     end
                     local.get $19
                     v128.load offset=768
                     br $assembly/utils/v128/getV128|inlined.6
                    end
                    local.get $19
                    v128.load offset=784
                    br $assembly/utils/v128/getV128|inlined.6
                   end
                   local.get $19
                   v128.load offset=800
                   br $assembly/utils/v128/getV128|inlined.6
                  end
                  local.get $19
                  v128.load offset=816
                  br $assembly/utils/v128/getV128|inlined.6
                 end
                 local.get $19
                 v128.load offset=832
                 br $assembly/utils/v128/getV128|inlined.6
                end
                local.get $19
                v128.load offset=848
                br $assembly/utils/v128/getV128|inlined.6
               end
               local.get $19
               v128.load offset=864
               br $assembly/utils/v128/getV128|inlined.6
              end
              local.get $19
              v128.load offset=880
              br $assembly/utils/v128/getV128|inlined.6
             end
             local.get $19
             v128.load offset=896
             br $assembly/utils/v128/getV128|inlined.6
            end
            local.get $19
            v128.load offset=912
            br $assembly/utils/v128/getV128|inlined.6
           end
           local.get $19
           v128.load offset=928
           br $assembly/utils/v128/getV128|inlined.6
          end
          local.get $19
          v128.load offset=944
          br $assembly/utils/v128/getV128|inlined.6
         end
         local.get $19
         v128.load offset=960
         br $assembly/utils/v128/getV128|inlined.6
        end
        local.get $19
        v128.load offset=976
        br $assembly/utils/v128/getV128|inlined.6
       end
       local.get $19
       v128.load offset=992
       br $assembly/utils/v128/getV128|inlined.6
      end
      local.get $19
      v128.load offset=1008
      br $assembly/utils/v128/getV128|inlined.6
     end
     i32.const 3120
     local.get $20
     i32.const 10
     call $~lib/number/I32#toString
     call $~lib/string/String#concat
     i32.const 3056
     i32.const 341
     i32.const 7
     call $~lib/builtins/abort
     unreachable
    end
    i32x4.add
    global.set $assembly/simd/t1V128
    block $assembly/simd/EP0V128|inlined.1 (result v128)
     global.get $assembly/simd/aV128
     local.set $22
     block $assembly/simd/rotrV128|inlined.13 (result v128)
      local.get $22
      local.set $23
      i32.const 2
      local.set $24
      i32.const 32
      local.get $24
      i32.sub
      local.set $25
      local.get $23
      local.get $24
      i32x4.shr_u
      local.set $26
      local.get $23
      local.get $25
      i32x4.shl
      local.set $27
      local.get $26
      local.get $27
      v128.or
      br $assembly/simd/rotrV128|inlined.13
     end
     block $assembly/simd/rotrV128|inlined.14 (result v128)
      local.get $22
      local.set $28
      i32.const 13
      local.set $29
      i32.const 32
      local.get $29
      i32.sub
      local.set $30
      local.get $28
      local.get $29
      i32x4.shr_u
      local.set $31
      local.get $28
      local.get $30
      i32x4.shl
      local.set $32
      local.get $31
      local.get $32
      v128.or
      br $assembly/simd/rotrV128|inlined.14
     end
     v128.xor
     block $assembly/simd/rotrV128|inlined.15 (result v128)
      local.get $22
      local.set $33
      i32.const 22
      local.set $34
      i32.const 32
      local.get $34
      i32.sub
      local.set $35
      local.get $33
      local.get $34
      i32x4.shr_u
      local.set $36
      local.get $33
      local.get $35
      i32x4.shl
      local.set $37
      local.get $36
      local.get $37
      v128.or
      br $assembly/simd/rotrV128|inlined.15
     end
     v128.xor
     br $assembly/simd/EP0V128|inlined.1
    end
    block $assembly/simd/MAJV128|inlined.1 (result v128)
     global.get $assembly/simd/aV128
     local.set $38
     global.get $assembly/simd/bV128
     local.set $39
     global.get $assembly/simd/cV128
     local.set $40
     local.get $38
     local.get $39
     v128.and
     local.get $38
     local.get $40
     v128.and
     v128.xor
     local.get $39
     local.get $40
     v128.and
     v128.xor
     br $assembly/simd/MAJV128|inlined.1
    end
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
 (func $assembly/simd/digest64V128 (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 v128)
  (local $10 v128)
  (local $11 i32)
  (local $12 i32)
  (local $13 v128)
  (local $14 v128)
  (local $15 v128)
  (local $16 i32)
  (local $17 i32)
  (local $18 v128)
  (local $19 v128)
  (local $20 i32)
  (local $21 i32)
  (local $22 i32)
  (local $23 i32)
  (local $24 i32)
  (local $25 i32)
  (local $26 v128)
  (local $27 v128)
  (local $28 i32)
  (local $29 i32)
  (local $30 v128)
  (local $31 v128)
  (local $32 v128)
  (local $33 i32)
  (local $34 i32)
  (local $35 v128)
  (local $36 v128)
  (local $37 i32)
  (local $38 i32)
  (local $39 i32)
  (local $40 i32)
  (local $41 i32)
  (local $42 v128)
  (local $43 i32)
  (local $44 v128)
  (local $45 v128)
  (local $46 i32)
  (local $47 i32)
  (local $48 v128)
  (local $49 v128)
  (local $50 v128)
  (local $51 i32)
  (local $52 i32)
  (local $53 v128)
  (local $54 v128)
  (local $55 v128)
  (local $56 i32)
  (local $57 i32)
  (local $58 v128)
  (local $59 v128)
  (local $60 v128)
  (local $61 v128)
  (local $62 v128)
  (local $63 i32)
  (local $64 i32)
  (local $65 i32)
  (local $66 v128)
  (local $67 v128)
  (local $68 i32)
  (local $69 i32)
  (local $70 v128)
  (local $71 v128)
  (local $72 v128)
  (local $73 i32)
  (local $74 i32)
  (local $75 v128)
  (local $76 v128)
  (local $77 v128)
  (local $78 i32)
  (local $79 i32)
  (local $80 v128)
  (local $81 v128)
  (local $82 v128)
  (local $83 v128)
  (local $84 v128)
  (local $85 i32)
  (local $86 i32)
  (local $87 i32)
  (local $88 i32)
  (local $89 i32)
  (local $90 i32)
  (local $91 i32)
  (local $92 i32)
  (local $93 i32)
  (local $94 i32)
  (local $95 i32)
  (local $96 i32)
  (local $97 i32)
  (local $98 i32)
  (local $99 i32)
  (local $100 i32)
  (local $101 i32)
  (local $102 i32)
  (local $103 i32)
  (local $104 i32)
  (local $105 i32)
  (local $106 i32)
  (local $107 i32)
  (local $108 i32)
  (local $109 i32)
  (local $110 i32)
  (local $111 i32)
  (local $112 i32)
  (local $113 i32)
  (local $114 i32)
  (local $115 i32)
  (local $116 i32)
  (local $117 i32)
  (local $118 i32)
  (local $119 i32)
  (local $120 i32)
  (local $121 i32)
  (local $122 i32)
  (local $123 i32)
  (local $124 i32)
  (local $125 i32)
  (local $126 i32)
  (local $127 i32)
  (local $128 i32)
  (local $129 i32)
  (local $130 i32)
  (local $131 i32)
  (local $132 i32)
  (local $133 i32)
  (local $134 i32)
  (local $135 i32)
  (local $136 i32)
  (local $137 i32)
  (local $138 i32)
  (local $139 i32)
  (local $140 i32)
  (local $141 i32)
  (local $142 i32)
  (local $143 i32)
  (local $144 i32)
  (local $145 i32)
  (local $146 i32)
  (local $147 i32)
  (local $148 i32)
  (local $149 i32)
  (local $150 i32)
  (local $151 i32)
  (local $152 i32)
  (local $153 i32)
  (local $154 i32)
  (local $155 i32)
  (local $156 i32)
  (local $157 i32)
  (local $158 i32)
  (local $159 i32)
  (local $160 i32)
  (local $161 i32)
  (local $162 i32)
  (local $163 i32)
  (local $164 i32)
  (local $165 i32)
  (local $166 i32)
  (local $167 i32)
  (local $168 i32)
  (local $169 i32)
  (local $170 i32)
  (local $171 i32)
  (local $172 i32)
  (local $173 i32)
  (local $174 i32)
  (local $175 i32)
  (local $176 i32)
  (local $177 i32)
  (local $178 i32)
  (local $179 i32)
  (local $180 i32)
  call $assembly/simd/initV128
  local.get $0
  local.set $2
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
    global.get $assembly/simd/i
    i32.const 16
    i32.lt_s
    if (result v128)
     block $assembly/utils/v128/getV128|inlined.0 (result v128)
      local.get $2
      local.set $3
      global.get $assembly/simd/i
      local.set $4
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
                                                                       local.get $4
                                                                       local.set $5
                                                                       local.get $5
                                                                       i32.const 0
                                                                       i32.eq
                                                                       br_if $case0|1
                                                                       local.get $5
                                                                       i32.const 1
                                                                       i32.eq
                                                                       br_if $case1|1
                                                                       local.get $5
                                                                       i32.const 2
                                                                       i32.eq
                                                                       br_if $case2|1
                                                                       local.get $5
                                                                       i32.const 3
                                                                       i32.eq
                                                                       br_if $case3|1
                                                                       local.get $5
                                                                       i32.const 4
                                                                       i32.eq
                                                                       br_if $case4|1
                                                                       local.get $5
                                                                       i32.const 5
                                                                       i32.eq
                                                                       br_if $case5|1
                                                                       local.get $5
                                                                       i32.const 6
                                                                       i32.eq
                                                                       br_if $case6|1
                                                                       local.get $5
                                                                       i32.const 7
                                                                       i32.eq
                                                                       br_if $case7|1
                                                                       local.get $5
                                                                       i32.const 8
                                                                       i32.eq
                                                                       br_if $case8|1
                                                                       local.get $5
                                                                       i32.const 9
                                                                       i32.eq
                                                                       br_if $case9|1
                                                                       local.get $5
                                                                       i32.const 10
                                                                       i32.eq
                                                                       br_if $case10|1
                                                                       local.get $5
                                                                       i32.const 11
                                                                       i32.eq
                                                                       br_if $case11|1
                                                                       local.get $5
                                                                       i32.const 12
                                                                       i32.eq
                                                                       br_if $case12|1
                                                                       local.get $5
                                                                       i32.const 13
                                                                       i32.eq
                                                                       br_if $case13|1
                                                                       local.get $5
                                                                       i32.const 14
                                                                       i32.eq
                                                                       br_if $case14|1
                                                                       local.get $5
                                                                       i32.const 15
                                                                       i32.eq
                                                                       br_if $case15|1
                                                                       local.get $5
                                                                       i32.const 16
                                                                       i32.eq
                                                                       br_if $case16|1
                                                                       local.get $5
                                                                       i32.const 17
                                                                       i32.eq
                                                                       br_if $case17|1
                                                                       local.get $5
                                                                       i32.const 18
                                                                       i32.eq
                                                                       br_if $case18|1
                                                                       local.get $5
                                                                       i32.const 19
                                                                       i32.eq
                                                                       br_if $case19|1
                                                                       local.get $5
                                                                       i32.const 20
                                                                       i32.eq
                                                                       br_if $case20|1
                                                                       local.get $5
                                                                       i32.const 21
                                                                       i32.eq
                                                                       br_if $case21|1
                                                                       local.get $5
                                                                       i32.const 22
                                                                       i32.eq
                                                                       br_if $case22|1
                                                                       local.get $5
                                                                       i32.const 23
                                                                       i32.eq
                                                                       br_if $case23|1
                                                                       local.get $5
                                                                       i32.const 24
                                                                       i32.eq
                                                                       br_if $case24|1
                                                                       local.get $5
                                                                       i32.const 25
                                                                       i32.eq
                                                                       br_if $case25|1
                                                                       local.get $5
                                                                       i32.const 26
                                                                       i32.eq
                                                                       br_if $case26|1
                                                                       local.get $5
                                                                       i32.const 27
                                                                       i32.eq
                                                                       br_if $case27|1
                                                                       local.get $5
                                                                       i32.const 28
                                                                       i32.eq
                                                                       br_if $case28|1
                                                                       local.get $5
                                                                       i32.const 29
                                                                       i32.eq
                                                                       br_if $case29|1
                                                                       local.get $5
                                                                       i32.const 30
                                                                       i32.eq
                                                                       br_if $case30|1
                                                                       local.get $5
                                                                       i32.const 31
                                                                       i32.eq
                                                                       br_if $case31|1
                                                                       local.get $5
                                                                       i32.const 32
                                                                       i32.eq
                                                                       br_if $case32|1
                                                                       local.get $5
                                                                       i32.const 33
                                                                       i32.eq
                                                                       br_if $case33|1
                                                                       local.get $5
                                                                       i32.const 34
                                                                       i32.eq
                                                                       br_if $case34|1
                                                                       local.get $5
                                                                       i32.const 35
                                                                       i32.eq
                                                                       br_if $case35|1
                                                                       local.get $5
                                                                       i32.const 36
                                                                       i32.eq
                                                                       br_if $case36|1
                                                                       local.get $5
                                                                       i32.const 37
                                                                       i32.eq
                                                                       br_if $case37|1
                                                                       local.get $5
                                                                       i32.const 38
                                                                       i32.eq
                                                                       br_if $case38|1
                                                                       local.get $5
                                                                       i32.const 39
                                                                       i32.eq
                                                                       br_if $case39|1
                                                                       local.get $5
                                                                       i32.const 40
                                                                       i32.eq
                                                                       br_if $case40|1
                                                                       local.get $5
                                                                       i32.const 41
                                                                       i32.eq
                                                                       br_if $case41|1
                                                                       local.get $5
                                                                       i32.const 42
                                                                       i32.eq
                                                                       br_if $case42|1
                                                                       local.get $5
                                                                       i32.const 43
                                                                       i32.eq
                                                                       br_if $case43|1
                                                                       local.get $5
                                                                       i32.const 44
                                                                       i32.eq
                                                                       br_if $case44|1
                                                                       local.get $5
                                                                       i32.const 45
                                                                       i32.eq
                                                                       br_if $case45|1
                                                                       local.get $5
                                                                       i32.const 46
                                                                       i32.eq
                                                                       br_if $case46|1
                                                                       local.get $5
                                                                       i32.const 47
                                                                       i32.eq
                                                                       br_if $case47|1
                                                                       local.get $5
                                                                       i32.const 48
                                                                       i32.eq
                                                                       br_if $case48|1
                                                                       local.get $5
                                                                       i32.const 49
                                                                       i32.eq
                                                                       br_if $case49|1
                                                                       local.get $5
                                                                       i32.const 50
                                                                       i32.eq
                                                                       br_if $case50|1
                                                                       local.get $5
                                                                       i32.const 51
                                                                       i32.eq
                                                                       br_if $case51|1
                                                                       local.get $5
                                                                       i32.const 52
                                                                       i32.eq
                                                                       br_if $case52|1
                                                                       local.get $5
                                                                       i32.const 53
                                                                       i32.eq
                                                                       br_if $case53|1
                                                                       local.get $5
                                                                       i32.const 54
                                                                       i32.eq
                                                                       br_if $case54|1
                                                                       local.get $5
                                                                       i32.const 55
                                                                       i32.eq
                                                                       br_if $case55|1
                                                                       local.get $5
                                                                       i32.const 56
                                                                       i32.eq
                                                                       br_if $case56|1
                                                                       local.get $5
                                                                       i32.const 57
                                                                       i32.eq
                                                                       br_if $case57|1
                                                                       local.get $5
                                                                       i32.const 58
                                                                       i32.eq
                                                                       br_if $case58|1
                                                                       local.get $5
                                                                       i32.const 59
                                                                       i32.eq
                                                                       br_if $case59|1
                                                                       local.get $5
                                                                       i32.const 60
                                                                       i32.eq
                                                                       br_if $case60|1
                                                                       local.get $5
                                                                       i32.const 61
                                                                       i32.eq
                                                                       br_if $case61|1
                                                                       local.get $5
                                                                       i32.const 62
                                                                       i32.eq
                                                                       br_if $case62|1
                                                                       local.get $5
                                                                       i32.const 63
                                                                       i32.eq
                                                                       br_if $case63|1
                                                                       br $case64|1
                                                                      end
                                                                      local.get $3
                                                                      v128.load
                                                                      br $assembly/utils/v128/getV128|inlined.0
                                                                     end
                                                                     local.get $3
                                                                     v128.load offset=16
                                                                     br $assembly/utils/v128/getV128|inlined.0
                                                                    end
                                                                    local.get $3
                                                                    v128.load offset=32
                                                                    br $assembly/utils/v128/getV128|inlined.0
                                                                   end
                                                                   local.get $3
                                                                   v128.load offset=48
                                                                   br $assembly/utils/v128/getV128|inlined.0
                                                                  end
                                                                  local.get $3
                                                                  v128.load offset=64
                                                                  br $assembly/utils/v128/getV128|inlined.0
                                                                 end
                                                                 local.get $3
                                                                 v128.load offset=80
                                                                 br $assembly/utils/v128/getV128|inlined.0
                                                                end
                                                                local.get $3
                                                                v128.load offset=96
                                                                br $assembly/utils/v128/getV128|inlined.0
                                                               end
                                                               local.get $3
                                                               v128.load offset=112
                                                               br $assembly/utils/v128/getV128|inlined.0
                                                              end
                                                              local.get $3
                                                              v128.load offset=128
                                                              br $assembly/utils/v128/getV128|inlined.0
                                                             end
                                                             local.get $3
                                                             v128.load offset=144
                                                             br $assembly/utils/v128/getV128|inlined.0
                                                            end
                                                            local.get $3
                                                            v128.load offset=160
                                                            br $assembly/utils/v128/getV128|inlined.0
                                                           end
                                                           local.get $3
                                                           v128.load offset=176
                                                           br $assembly/utils/v128/getV128|inlined.0
                                                          end
                                                          local.get $3
                                                          v128.load offset=192
                                                          br $assembly/utils/v128/getV128|inlined.0
                                                         end
                                                         local.get $3
                                                         v128.load offset=208
                                                         br $assembly/utils/v128/getV128|inlined.0
                                                        end
                                                        local.get $3
                                                        v128.load offset=224
                                                        br $assembly/utils/v128/getV128|inlined.0
                                                       end
                                                       local.get $3
                                                       v128.load offset=240
                                                       br $assembly/utils/v128/getV128|inlined.0
                                                      end
                                                      local.get $3
                                                      v128.load offset=256
                                                      br $assembly/utils/v128/getV128|inlined.0
                                                     end
                                                     local.get $3
                                                     v128.load offset=272
                                                     br $assembly/utils/v128/getV128|inlined.0
                                                    end
                                                    local.get $3
                                                    v128.load offset=288
                                                    br $assembly/utils/v128/getV128|inlined.0
                                                   end
                                                   local.get $3
                                                   v128.load offset=304
                                                   br $assembly/utils/v128/getV128|inlined.0
                                                  end
                                                  local.get $3
                                                  v128.load offset=320
                                                  br $assembly/utils/v128/getV128|inlined.0
                                                 end
                                                 local.get $3
                                                 v128.load offset=336
                                                 br $assembly/utils/v128/getV128|inlined.0
                                                end
                                                local.get $3
                                                v128.load offset=352
                                                br $assembly/utils/v128/getV128|inlined.0
                                               end
                                               local.get $3
                                               v128.load offset=368
                                               br $assembly/utils/v128/getV128|inlined.0
                                              end
                                              local.get $3
                                              v128.load offset=384
                                              br $assembly/utils/v128/getV128|inlined.0
                                             end
                                             local.get $3
                                             v128.load offset=400
                                             br $assembly/utils/v128/getV128|inlined.0
                                            end
                                            local.get $3
                                            v128.load offset=416
                                            br $assembly/utils/v128/getV128|inlined.0
                                           end
                                           local.get $3
                                           v128.load offset=432
                                           br $assembly/utils/v128/getV128|inlined.0
                                          end
                                          local.get $3
                                          v128.load offset=448
                                          br $assembly/utils/v128/getV128|inlined.0
                                         end
                                         local.get $3
                                         v128.load offset=464
                                         br $assembly/utils/v128/getV128|inlined.0
                                        end
                                        local.get $3
                                        v128.load offset=480
                                        br $assembly/utils/v128/getV128|inlined.0
                                       end
                                       local.get $3
                                       v128.load offset=496
                                       br $assembly/utils/v128/getV128|inlined.0
                                      end
                                      local.get $3
                                      v128.load offset=512
                                      br $assembly/utils/v128/getV128|inlined.0
                                     end
                                     local.get $3
                                     v128.load offset=528
                                     br $assembly/utils/v128/getV128|inlined.0
                                    end
                                    local.get $3
                                    v128.load offset=544
                                    br $assembly/utils/v128/getV128|inlined.0
                                   end
                                   local.get $3
                                   v128.load offset=560
                                   br $assembly/utils/v128/getV128|inlined.0
                                  end
                                  local.get $3
                                  v128.load offset=576
                                  br $assembly/utils/v128/getV128|inlined.0
                                 end
                                 local.get $3
                                 v128.load offset=592
                                 br $assembly/utils/v128/getV128|inlined.0
                                end
                                local.get $3
                                v128.load offset=608
                                br $assembly/utils/v128/getV128|inlined.0
                               end
                               local.get $3
                               v128.load offset=624
                               br $assembly/utils/v128/getV128|inlined.0
                              end
                              local.get $3
                              v128.load offset=640
                              br $assembly/utils/v128/getV128|inlined.0
                             end
                             local.get $3
                             v128.load offset=656
                             br $assembly/utils/v128/getV128|inlined.0
                            end
                            local.get $3
                            v128.load offset=672
                            br $assembly/utils/v128/getV128|inlined.0
                           end
                           local.get $3
                           v128.load offset=688
                           br $assembly/utils/v128/getV128|inlined.0
                          end
                          local.get $3
                          v128.load offset=704
                          br $assembly/utils/v128/getV128|inlined.0
                         end
                         local.get $3
                         v128.load offset=720
                         br $assembly/utils/v128/getV128|inlined.0
                        end
                        local.get $3
                        v128.load offset=736
                        br $assembly/utils/v128/getV128|inlined.0
                       end
                       local.get $3
                       v128.load offset=752
                       br $assembly/utils/v128/getV128|inlined.0
                      end
                      local.get $3
                      v128.load offset=768
                      br $assembly/utils/v128/getV128|inlined.0
                     end
                     local.get $3
                     v128.load offset=784
                     br $assembly/utils/v128/getV128|inlined.0
                    end
                    local.get $3
                    v128.load offset=800
                    br $assembly/utils/v128/getV128|inlined.0
                   end
                   local.get $3
                   v128.load offset=816
                   br $assembly/utils/v128/getV128|inlined.0
                  end
                  local.get $3
                  v128.load offset=832
                  br $assembly/utils/v128/getV128|inlined.0
                 end
                 local.get $3
                 v128.load offset=848
                 br $assembly/utils/v128/getV128|inlined.0
                end
                local.get $3
                v128.load offset=864
                br $assembly/utils/v128/getV128|inlined.0
               end
               local.get $3
               v128.load offset=880
               br $assembly/utils/v128/getV128|inlined.0
              end
              local.get $3
              v128.load offset=896
              br $assembly/utils/v128/getV128|inlined.0
             end
             local.get $3
             v128.load offset=912
             br $assembly/utils/v128/getV128|inlined.0
            end
            local.get $3
            v128.load offset=928
            br $assembly/utils/v128/getV128|inlined.0
           end
           local.get $3
           v128.load offset=944
           br $assembly/utils/v128/getV128|inlined.0
          end
          local.get $3
          v128.load offset=960
          br $assembly/utils/v128/getV128|inlined.0
         end
         local.get $3
         v128.load offset=976
         br $assembly/utils/v128/getV128|inlined.0
        end
        local.get $3
        v128.load offset=992
        br $assembly/utils/v128/getV128|inlined.0
       end
       local.get $3
       v128.load offset=1008
       br $assembly/utils/v128/getV128|inlined.0
      end
      i32.const 3120
      local.get $4
      i32.const 10
      call $~lib/number/I32#toString
      call $~lib/string/String#concat
      i32.const 3056
      i32.const 341
      i32.const 7
      call $~lib/builtins/abort
      unreachable
     end
    else
     block $assembly/simd/SIG1V128|inlined.0 (result v128)
      block $assembly/utils/v128/getV128|inlined.1 (result v128)
       local.get $2
       local.set $6
       global.get $assembly/simd/i
       i32.const 2
       i32.sub
       local.set $7
       block $case64|2
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
                                                                        local.get $7
                                                                        local.set $8
                                                                        local.get $8
                                                                        i32.const 0
                                                                        i32.eq
                                                                        br_if $case0|2
                                                                        local.get $8
                                                                        i32.const 1
                                                                        i32.eq
                                                                        br_if $case1|2
                                                                        local.get $8
                                                                        i32.const 2
                                                                        i32.eq
                                                                        br_if $case2|2
                                                                        local.get $8
                                                                        i32.const 3
                                                                        i32.eq
                                                                        br_if $case3|2
                                                                        local.get $8
                                                                        i32.const 4
                                                                        i32.eq
                                                                        br_if $case4|2
                                                                        local.get $8
                                                                        i32.const 5
                                                                        i32.eq
                                                                        br_if $case5|2
                                                                        local.get $8
                                                                        i32.const 6
                                                                        i32.eq
                                                                        br_if $case6|2
                                                                        local.get $8
                                                                        i32.const 7
                                                                        i32.eq
                                                                        br_if $case7|2
                                                                        local.get $8
                                                                        i32.const 8
                                                                        i32.eq
                                                                        br_if $case8|2
                                                                        local.get $8
                                                                        i32.const 9
                                                                        i32.eq
                                                                        br_if $case9|2
                                                                        local.get $8
                                                                        i32.const 10
                                                                        i32.eq
                                                                        br_if $case10|2
                                                                        local.get $8
                                                                        i32.const 11
                                                                        i32.eq
                                                                        br_if $case11|2
                                                                        local.get $8
                                                                        i32.const 12
                                                                        i32.eq
                                                                        br_if $case12|2
                                                                        local.get $8
                                                                        i32.const 13
                                                                        i32.eq
                                                                        br_if $case13|2
                                                                        local.get $8
                                                                        i32.const 14
                                                                        i32.eq
                                                                        br_if $case14|2
                                                                        local.get $8
                                                                        i32.const 15
                                                                        i32.eq
                                                                        br_if $case15|2
                                                                        local.get $8
                                                                        i32.const 16
                                                                        i32.eq
                                                                        br_if $case16|2
                                                                        local.get $8
                                                                        i32.const 17
                                                                        i32.eq
                                                                        br_if $case17|2
                                                                        local.get $8
                                                                        i32.const 18
                                                                        i32.eq
                                                                        br_if $case18|2
                                                                        local.get $8
                                                                        i32.const 19
                                                                        i32.eq
                                                                        br_if $case19|2
                                                                        local.get $8
                                                                        i32.const 20
                                                                        i32.eq
                                                                        br_if $case20|2
                                                                        local.get $8
                                                                        i32.const 21
                                                                        i32.eq
                                                                        br_if $case21|2
                                                                        local.get $8
                                                                        i32.const 22
                                                                        i32.eq
                                                                        br_if $case22|2
                                                                        local.get $8
                                                                        i32.const 23
                                                                        i32.eq
                                                                        br_if $case23|2
                                                                        local.get $8
                                                                        i32.const 24
                                                                        i32.eq
                                                                        br_if $case24|2
                                                                        local.get $8
                                                                        i32.const 25
                                                                        i32.eq
                                                                        br_if $case25|2
                                                                        local.get $8
                                                                        i32.const 26
                                                                        i32.eq
                                                                        br_if $case26|2
                                                                        local.get $8
                                                                        i32.const 27
                                                                        i32.eq
                                                                        br_if $case27|2
                                                                        local.get $8
                                                                        i32.const 28
                                                                        i32.eq
                                                                        br_if $case28|2
                                                                        local.get $8
                                                                        i32.const 29
                                                                        i32.eq
                                                                        br_if $case29|2
                                                                        local.get $8
                                                                        i32.const 30
                                                                        i32.eq
                                                                        br_if $case30|2
                                                                        local.get $8
                                                                        i32.const 31
                                                                        i32.eq
                                                                        br_if $case31|2
                                                                        local.get $8
                                                                        i32.const 32
                                                                        i32.eq
                                                                        br_if $case32|2
                                                                        local.get $8
                                                                        i32.const 33
                                                                        i32.eq
                                                                        br_if $case33|2
                                                                        local.get $8
                                                                        i32.const 34
                                                                        i32.eq
                                                                        br_if $case34|2
                                                                        local.get $8
                                                                        i32.const 35
                                                                        i32.eq
                                                                        br_if $case35|2
                                                                        local.get $8
                                                                        i32.const 36
                                                                        i32.eq
                                                                        br_if $case36|2
                                                                        local.get $8
                                                                        i32.const 37
                                                                        i32.eq
                                                                        br_if $case37|2
                                                                        local.get $8
                                                                        i32.const 38
                                                                        i32.eq
                                                                        br_if $case38|2
                                                                        local.get $8
                                                                        i32.const 39
                                                                        i32.eq
                                                                        br_if $case39|2
                                                                        local.get $8
                                                                        i32.const 40
                                                                        i32.eq
                                                                        br_if $case40|2
                                                                        local.get $8
                                                                        i32.const 41
                                                                        i32.eq
                                                                        br_if $case41|2
                                                                        local.get $8
                                                                        i32.const 42
                                                                        i32.eq
                                                                        br_if $case42|2
                                                                        local.get $8
                                                                        i32.const 43
                                                                        i32.eq
                                                                        br_if $case43|2
                                                                        local.get $8
                                                                        i32.const 44
                                                                        i32.eq
                                                                        br_if $case44|2
                                                                        local.get $8
                                                                        i32.const 45
                                                                        i32.eq
                                                                        br_if $case45|2
                                                                        local.get $8
                                                                        i32.const 46
                                                                        i32.eq
                                                                        br_if $case46|2
                                                                        local.get $8
                                                                        i32.const 47
                                                                        i32.eq
                                                                        br_if $case47|2
                                                                        local.get $8
                                                                        i32.const 48
                                                                        i32.eq
                                                                        br_if $case48|2
                                                                        local.get $8
                                                                        i32.const 49
                                                                        i32.eq
                                                                        br_if $case49|2
                                                                        local.get $8
                                                                        i32.const 50
                                                                        i32.eq
                                                                        br_if $case50|2
                                                                        local.get $8
                                                                        i32.const 51
                                                                        i32.eq
                                                                        br_if $case51|2
                                                                        local.get $8
                                                                        i32.const 52
                                                                        i32.eq
                                                                        br_if $case52|2
                                                                        local.get $8
                                                                        i32.const 53
                                                                        i32.eq
                                                                        br_if $case53|2
                                                                        local.get $8
                                                                        i32.const 54
                                                                        i32.eq
                                                                        br_if $case54|2
                                                                        local.get $8
                                                                        i32.const 55
                                                                        i32.eq
                                                                        br_if $case55|2
                                                                        local.get $8
                                                                        i32.const 56
                                                                        i32.eq
                                                                        br_if $case56|2
                                                                        local.get $8
                                                                        i32.const 57
                                                                        i32.eq
                                                                        br_if $case57|2
                                                                        local.get $8
                                                                        i32.const 58
                                                                        i32.eq
                                                                        br_if $case58|2
                                                                        local.get $8
                                                                        i32.const 59
                                                                        i32.eq
                                                                        br_if $case59|2
                                                                        local.get $8
                                                                        i32.const 60
                                                                        i32.eq
                                                                        br_if $case60|2
                                                                        local.get $8
                                                                        i32.const 61
                                                                        i32.eq
                                                                        br_if $case61|2
                                                                        local.get $8
                                                                        i32.const 62
                                                                        i32.eq
                                                                        br_if $case62|2
                                                                        local.get $8
                                                                        i32.const 63
                                                                        i32.eq
                                                                        br_if $case63|2
                                                                        br $case64|2
                                                                       end
                                                                       local.get $6
                                                                       v128.load
                                                                       br $assembly/utils/v128/getV128|inlined.1
                                                                      end
                                                                      local.get $6
                                                                      v128.load offset=16
                                                                      br $assembly/utils/v128/getV128|inlined.1
                                                                     end
                                                                     local.get $6
                                                                     v128.load offset=32
                                                                     br $assembly/utils/v128/getV128|inlined.1
                                                                    end
                                                                    local.get $6
                                                                    v128.load offset=48
                                                                    br $assembly/utils/v128/getV128|inlined.1
                                                                   end
                                                                   local.get $6
                                                                   v128.load offset=64
                                                                   br $assembly/utils/v128/getV128|inlined.1
                                                                  end
                                                                  local.get $6
                                                                  v128.load offset=80
                                                                  br $assembly/utils/v128/getV128|inlined.1
                                                                 end
                                                                 local.get $6
                                                                 v128.load offset=96
                                                                 br $assembly/utils/v128/getV128|inlined.1
                                                                end
                                                                local.get $6
                                                                v128.load offset=112
                                                                br $assembly/utils/v128/getV128|inlined.1
                                                               end
                                                               local.get $6
                                                               v128.load offset=128
                                                               br $assembly/utils/v128/getV128|inlined.1
                                                              end
                                                              local.get $6
                                                              v128.load offset=144
                                                              br $assembly/utils/v128/getV128|inlined.1
                                                             end
                                                             local.get $6
                                                             v128.load offset=160
                                                             br $assembly/utils/v128/getV128|inlined.1
                                                            end
                                                            local.get $6
                                                            v128.load offset=176
                                                            br $assembly/utils/v128/getV128|inlined.1
                                                           end
                                                           local.get $6
                                                           v128.load offset=192
                                                           br $assembly/utils/v128/getV128|inlined.1
                                                          end
                                                          local.get $6
                                                          v128.load offset=208
                                                          br $assembly/utils/v128/getV128|inlined.1
                                                         end
                                                         local.get $6
                                                         v128.load offset=224
                                                         br $assembly/utils/v128/getV128|inlined.1
                                                        end
                                                        local.get $6
                                                        v128.load offset=240
                                                        br $assembly/utils/v128/getV128|inlined.1
                                                       end
                                                       local.get $6
                                                       v128.load offset=256
                                                       br $assembly/utils/v128/getV128|inlined.1
                                                      end
                                                      local.get $6
                                                      v128.load offset=272
                                                      br $assembly/utils/v128/getV128|inlined.1
                                                     end
                                                     local.get $6
                                                     v128.load offset=288
                                                     br $assembly/utils/v128/getV128|inlined.1
                                                    end
                                                    local.get $6
                                                    v128.load offset=304
                                                    br $assembly/utils/v128/getV128|inlined.1
                                                   end
                                                   local.get $6
                                                   v128.load offset=320
                                                   br $assembly/utils/v128/getV128|inlined.1
                                                  end
                                                  local.get $6
                                                  v128.load offset=336
                                                  br $assembly/utils/v128/getV128|inlined.1
                                                 end
                                                 local.get $6
                                                 v128.load offset=352
                                                 br $assembly/utils/v128/getV128|inlined.1
                                                end
                                                local.get $6
                                                v128.load offset=368
                                                br $assembly/utils/v128/getV128|inlined.1
                                               end
                                               local.get $6
                                               v128.load offset=384
                                               br $assembly/utils/v128/getV128|inlined.1
                                              end
                                              local.get $6
                                              v128.load offset=400
                                              br $assembly/utils/v128/getV128|inlined.1
                                             end
                                             local.get $6
                                             v128.load offset=416
                                             br $assembly/utils/v128/getV128|inlined.1
                                            end
                                            local.get $6
                                            v128.load offset=432
                                            br $assembly/utils/v128/getV128|inlined.1
                                           end
                                           local.get $6
                                           v128.load offset=448
                                           br $assembly/utils/v128/getV128|inlined.1
                                          end
                                          local.get $6
                                          v128.load offset=464
                                          br $assembly/utils/v128/getV128|inlined.1
                                         end
                                         local.get $6
                                         v128.load offset=480
                                         br $assembly/utils/v128/getV128|inlined.1
                                        end
                                        local.get $6
                                        v128.load offset=496
                                        br $assembly/utils/v128/getV128|inlined.1
                                       end
                                       local.get $6
                                       v128.load offset=512
                                       br $assembly/utils/v128/getV128|inlined.1
                                      end
                                      local.get $6
                                      v128.load offset=528
                                      br $assembly/utils/v128/getV128|inlined.1
                                     end
                                     local.get $6
                                     v128.load offset=544
                                     br $assembly/utils/v128/getV128|inlined.1
                                    end
                                    local.get $6
                                    v128.load offset=560
                                    br $assembly/utils/v128/getV128|inlined.1
                                   end
                                   local.get $6
                                   v128.load offset=576
                                   br $assembly/utils/v128/getV128|inlined.1
                                  end
                                  local.get $6
                                  v128.load offset=592
                                  br $assembly/utils/v128/getV128|inlined.1
                                 end
                                 local.get $6
                                 v128.load offset=608
                                 br $assembly/utils/v128/getV128|inlined.1
                                end
                                local.get $6
                                v128.load offset=624
                                br $assembly/utils/v128/getV128|inlined.1
                               end
                               local.get $6
                               v128.load offset=640
                               br $assembly/utils/v128/getV128|inlined.1
                              end
                              local.get $6
                              v128.load offset=656
                              br $assembly/utils/v128/getV128|inlined.1
                             end
                             local.get $6
                             v128.load offset=672
                             br $assembly/utils/v128/getV128|inlined.1
                            end
                            local.get $6
                            v128.load offset=688
                            br $assembly/utils/v128/getV128|inlined.1
                           end
                           local.get $6
                           v128.load offset=704
                           br $assembly/utils/v128/getV128|inlined.1
                          end
                          local.get $6
                          v128.load offset=720
                          br $assembly/utils/v128/getV128|inlined.1
                         end
                         local.get $6
                         v128.load offset=736
                         br $assembly/utils/v128/getV128|inlined.1
                        end
                        local.get $6
                        v128.load offset=752
                        br $assembly/utils/v128/getV128|inlined.1
                       end
                       local.get $6
                       v128.load offset=768
                       br $assembly/utils/v128/getV128|inlined.1
                      end
                      local.get $6
                      v128.load offset=784
                      br $assembly/utils/v128/getV128|inlined.1
                     end
                     local.get $6
                     v128.load offset=800
                     br $assembly/utils/v128/getV128|inlined.1
                    end
                    local.get $6
                    v128.load offset=816
                    br $assembly/utils/v128/getV128|inlined.1
                   end
                   local.get $6
                   v128.load offset=832
                   br $assembly/utils/v128/getV128|inlined.1
                  end
                  local.get $6
                  v128.load offset=848
                  br $assembly/utils/v128/getV128|inlined.1
                 end
                 local.get $6
                 v128.load offset=864
                 br $assembly/utils/v128/getV128|inlined.1
                end
                local.get $6
                v128.load offset=880
                br $assembly/utils/v128/getV128|inlined.1
               end
               local.get $6
               v128.load offset=896
               br $assembly/utils/v128/getV128|inlined.1
              end
              local.get $6
              v128.load offset=912
              br $assembly/utils/v128/getV128|inlined.1
             end
             local.get $6
             v128.load offset=928
             br $assembly/utils/v128/getV128|inlined.1
            end
            local.get $6
            v128.load offset=944
            br $assembly/utils/v128/getV128|inlined.1
           end
           local.get $6
           v128.load offset=960
           br $assembly/utils/v128/getV128|inlined.1
          end
          local.get $6
          v128.load offset=976
          br $assembly/utils/v128/getV128|inlined.1
         end
         local.get $6
         v128.load offset=992
         br $assembly/utils/v128/getV128|inlined.1
        end
        local.get $6
        v128.load offset=1008
        br $assembly/utils/v128/getV128|inlined.1
       end
       i32.const 3120
       local.get $7
       i32.const 10
       call $~lib/number/I32#toString
       call $~lib/string/String#concat
       i32.const 3056
       i32.const 341
       i32.const 7
       call $~lib/builtins/abort
       unreachable
      end
      local.set $9
      block $assembly/simd/rotrV128|inlined.0 (result v128)
       local.get $9
       local.set $10
       i32.const 17
       local.set $11
       i32.const 32
       local.get $11
       i32.sub
       local.set $12
       local.get $10
       local.get $11
       i32x4.shr_u
       local.set $13
       local.get $10
       local.get $12
       i32x4.shl
       local.set $14
       local.get $13
       local.get $14
       v128.or
       br $assembly/simd/rotrV128|inlined.0
      end
      block $assembly/simd/rotrV128|inlined.1 (result v128)
       local.get $9
       local.set $15
       i32.const 19
       local.set $16
       i32.const 32
       local.get $16
       i32.sub
       local.set $17
       local.get $15
       local.get $16
       i32x4.shr_u
       local.set $18
       local.get $15
       local.get $17
       i32x4.shl
       local.set $19
       local.get $18
       local.get $19
       v128.or
       br $assembly/simd/rotrV128|inlined.1
      end
      v128.xor
      local.get $9
      i32.const 10
      i32x4.shr_u
      v128.xor
      br $assembly/simd/SIG1V128|inlined.0
     end
     block $assembly/utils/v128/getV128|inlined.2 (result v128)
      local.get $2
      local.set $20
      global.get $assembly/simd/i
      i32.const 7
      i32.sub
      local.set $21
      block $case64|3
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
                                                                       local.get $21
                                                                       local.set $22
                                                                       local.get $22
                                                                       i32.const 0
                                                                       i32.eq
                                                                       br_if $case0|3
                                                                       local.get $22
                                                                       i32.const 1
                                                                       i32.eq
                                                                       br_if $case1|3
                                                                       local.get $22
                                                                       i32.const 2
                                                                       i32.eq
                                                                       br_if $case2|3
                                                                       local.get $22
                                                                       i32.const 3
                                                                       i32.eq
                                                                       br_if $case3|3
                                                                       local.get $22
                                                                       i32.const 4
                                                                       i32.eq
                                                                       br_if $case4|3
                                                                       local.get $22
                                                                       i32.const 5
                                                                       i32.eq
                                                                       br_if $case5|3
                                                                       local.get $22
                                                                       i32.const 6
                                                                       i32.eq
                                                                       br_if $case6|3
                                                                       local.get $22
                                                                       i32.const 7
                                                                       i32.eq
                                                                       br_if $case7|3
                                                                       local.get $22
                                                                       i32.const 8
                                                                       i32.eq
                                                                       br_if $case8|3
                                                                       local.get $22
                                                                       i32.const 9
                                                                       i32.eq
                                                                       br_if $case9|3
                                                                       local.get $22
                                                                       i32.const 10
                                                                       i32.eq
                                                                       br_if $case10|3
                                                                       local.get $22
                                                                       i32.const 11
                                                                       i32.eq
                                                                       br_if $case11|3
                                                                       local.get $22
                                                                       i32.const 12
                                                                       i32.eq
                                                                       br_if $case12|3
                                                                       local.get $22
                                                                       i32.const 13
                                                                       i32.eq
                                                                       br_if $case13|3
                                                                       local.get $22
                                                                       i32.const 14
                                                                       i32.eq
                                                                       br_if $case14|3
                                                                       local.get $22
                                                                       i32.const 15
                                                                       i32.eq
                                                                       br_if $case15|3
                                                                       local.get $22
                                                                       i32.const 16
                                                                       i32.eq
                                                                       br_if $case16|3
                                                                       local.get $22
                                                                       i32.const 17
                                                                       i32.eq
                                                                       br_if $case17|3
                                                                       local.get $22
                                                                       i32.const 18
                                                                       i32.eq
                                                                       br_if $case18|3
                                                                       local.get $22
                                                                       i32.const 19
                                                                       i32.eq
                                                                       br_if $case19|3
                                                                       local.get $22
                                                                       i32.const 20
                                                                       i32.eq
                                                                       br_if $case20|3
                                                                       local.get $22
                                                                       i32.const 21
                                                                       i32.eq
                                                                       br_if $case21|3
                                                                       local.get $22
                                                                       i32.const 22
                                                                       i32.eq
                                                                       br_if $case22|3
                                                                       local.get $22
                                                                       i32.const 23
                                                                       i32.eq
                                                                       br_if $case23|3
                                                                       local.get $22
                                                                       i32.const 24
                                                                       i32.eq
                                                                       br_if $case24|3
                                                                       local.get $22
                                                                       i32.const 25
                                                                       i32.eq
                                                                       br_if $case25|3
                                                                       local.get $22
                                                                       i32.const 26
                                                                       i32.eq
                                                                       br_if $case26|3
                                                                       local.get $22
                                                                       i32.const 27
                                                                       i32.eq
                                                                       br_if $case27|3
                                                                       local.get $22
                                                                       i32.const 28
                                                                       i32.eq
                                                                       br_if $case28|3
                                                                       local.get $22
                                                                       i32.const 29
                                                                       i32.eq
                                                                       br_if $case29|3
                                                                       local.get $22
                                                                       i32.const 30
                                                                       i32.eq
                                                                       br_if $case30|3
                                                                       local.get $22
                                                                       i32.const 31
                                                                       i32.eq
                                                                       br_if $case31|3
                                                                       local.get $22
                                                                       i32.const 32
                                                                       i32.eq
                                                                       br_if $case32|3
                                                                       local.get $22
                                                                       i32.const 33
                                                                       i32.eq
                                                                       br_if $case33|3
                                                                       local.get $22
                                                                       i32.const 34
                                                                       i32.eq
                                                                       br_if $case34|3
                                                                       local.get $22
                                                                       i32.const 35
                                                                       i32.eq
                                                                       br_if $case35|3
                                                                       local.get $22
                                                                       i32.const 36
                                                                       i32.eq
                                                                       br_if $case36|3
                                                                       local.get $22
                                                                       i32.const 37
                                                                       i32.eq
                                                                       br_if $case37|3
                                                                       local.get $22
                                                                       i32.const 38
                                                                       i32.eq
                                                                       br_if $case38|3
                                                                       local.get $22
                                                                       i32.const 39
                                                                       i32.eq
                                                                       br_if $case39|3
                                                                       local.get $22
                                                                       i32.const 40
                                                                       i32.eq
                                                                       br_if $case40|3
                                                                       local.get $22
                                                                       i32.const 41
                                                                       i32.eq
                                                                       br_if $case41|3
                                                                       local.get $22
                                                                       i32.const 42
                                                                       i32.eq
                                                                       br_if $case42|3
                                                                       local.get $22
                                                                       i32.const 43
                                                                       i32.eq
                                                                       br_if $case43|3
                                                                       local.get $22
                                                                       i32.const 44
                                                                       i32.eq
                                                                       br_if $case44|3
                                                                       local.get $22
                                                                       i32.const 45
                                                                       i32.eq
                                                                       br_if $case45|3
                                                                       local.get $22
                                                                       i32.const 46
                                                                       i32.eq
                                                                       br_if $case46|3
                                                                       local.get $22
                                                                       i32.const 47
                                                                       i32.eq
                                                                       br_if $case47|3
                                                                       local.get $22
                                                                       i32.const 48
                                                                       i32.eq
                                                                       br_if $case48|3
                                                                       local.get $22
                                                                       i32.const 49
                                                                       i32.eq
                                                                       br_if $case49|3
                                                                       local.get $22
                                                                       i32.const 50
                                                                       i32.eq
                                                                       br_if $case50|3
                                                                       local.get $22
                                                                       i32.const 51
                                                                       i32.eq
                                                                       br_if $case51|3
                                                                       local.get $22
                                                                       i32.const 52
                                                                       i32.eq
                                                                       br_if $case52|3
                                                                       local.get $22
                                                                       i32.const 53
                                                                       i32.eq
                                                                       br_if $case53|3
                                                                       local.get $22
                                                                       i32.const 54
                                                                       i32.eq
                                                                       br_if $case54|3
                                                                       local.get $22
                                                                       i32.const 55
                                                                       i32.eq
                                                                       br_if $case55|3
                                                                       local.get $22
                                                                       i32.const 56
                                                                       i32.eq
                                                                       br_if $case56|3
                                                                       local.get $22
                                                                       i32.const 57
                                                                       i32.eq
                                                                       br_if $case57|3
                                                                       local.get $22
                                                                       i32.const 58
                                                                       i32.eq
                                                                       br_if $case58|3
                                                                       local.get $22
                                                                       i32.const 59
                                                                       i32.eq
                                                                       br_if $case59|3
                                                                       local.get $22
                                                                       i32.const 60
                                                                       i32.eq
                                                                       br_if $case60|3
                                                                       local.get $22
                                                                       i32.const 61
                                                                       i32.eq
                                                                       br_if $case61|3
                                                                       local.get $22
                                                                       i32.const 62
                                                                       i32.eq
                                                                       br_if $case62|3
                                                                       local.get $22
                                                                       i32.const 63
                                                                       i32.eq
                                                                       br_if $case63|3
                                                                       br $case64|3
                                                                      end
                                                                      local.get $20
                                                                      v128.load
                                                                      br $assembly/utils/v128/getV128|inlined.2
                                                                     end
                                                                     local.get $20
                                                                     v128.load offset=16
                                                                     br $assembly/utils/v128/getV128|inlined.2
                                                                    end
                                                                    local.get $20
                                                                    v128.load offset=32
                                                                    br $assembly/utils/v128/getV128|inlined.2
                                                                   end
                                                                   local.get $20
                                                                   v128.load offset=48
                                                                   br $assembly/utils/v128/getV128|inlined.2
                                                                  end
                                                                  local.get $20
                                                                  v128.load offset=64
                                                                  br $assembly/utils/v128/getV128|inlined.2
                                                                 end
                                                                 local.get $20
                                                                 v128.load offset=80
                                                                 br $assembly/utils/v128/getV128|inlined.2
                                                                end
                                                                local.get $20
                                                                v128.load offset=96
                                                                br $assembly/utils/v128/getV128|inlined.2
                                                               end
                                                               local.get $20
                                                               v128.load offset=112
                                                               br $assembly/utils/v128/getV128|inlined.2
                                                              end
                                                              local.get $20
                                                              v128.load offset=128
                                                              br $assembly/utils/v128/getV128|inlined.2
                                                             end
                                                             local.get $20
                                                             v128.load offset=144
                                                             br $assembly/utils/v128/getV128|inlined.2
                                                            end
                                                            local.get $20
                                                            v128.load offset=160
                                                            br $assembly/utils/v128/getV128|inlined.2
                                                           end
                                                           local.get $20
                                                           v128.load offset=176
                                                           br $assembly/utils/v128/getV128|inlined.2
                                                          end
                                                          local.get $20
                                                          v128.load offset=192
                                                          br $assembly/utils/v128/getV128|inlined.2
                                                         end
                                                         local.get $20
                                                         v128.load offset=208
                                                         br $assembly/utils/v128/getV128|inlined.2
                                                        end
                                                        local.get $20
                                                        v128.load offset=224
                                                        br $assembly/utils/v128/getV128|inlined.2
                                                       end
                                                       local.get $20
                                                       v128.load offset=240
                                                       br $assembly/utils/v128/getV128|inlined.2
                                                      end
                                                      local.get $20
                                                      v128.load offset=256
                                                      br $assembly/utils/v128/getV128|inlined.2
                                                     end
                                                     local.get $20
                                                     v128.load offset=272
                                                     br $assembly/utils/v128/getV128|inlined.2
                                                    end
                                                    local.get $20
                                                    v128.load offset=288
                                                    br $assembly/utils/v128/getV128|inlined.2
                                                   end
                                                   local.get $20
                                                   v128.load offset=304
                                                   br $assembly/utils/v128/getV128|inlined.2
                                                  end
                                                  local.get $20
                                                  v128.load offset=320
                                                  br $assembly/utils/v128/getV128|inlined.2
                                                 end
                                                 local.get $20
                                                 v128.load offset=336
                                                 br $assembly/utils/v128/getV128|inlined.2
                                                end
                                                local.get $20
                                                v128.load offset=352
                                                br $assembly/utils/v128/getV128|inlined.2
                                               end
                                               local.get $20
                                               v128.load offset=368
                                               br $assembly/utils/v128/getV128|inlined.2
                                              end
                                              local.get $20
                                              v128.load offset=384
                                              br $assembly/utils/v128/getV128|inlined.2
                                             end
                                             local.get $20
                                             v128.load offset=400
                                             br $assembly/utils/v128/getV128|inlined.2
                                            end
                                            local.get $20
                                            v128.load offset=416
                                            br $assembly/utils/v128/getV128|inlined.2
                                           end
                                           local.get $20
                                           v128.load offset=432
                                           br $assembly/utils/v128/getV128|inlined.2
                                          end
                                          local.get $20
                                          v128.load offset=448
                                          br $assembly/utils/v128/getV128|inlined.2
                                         end
                                         local.get $20
                                         v128.load offset=464
                                         br $assembly/utils/v128/getV128|inlined.2
                                        end
                                        local.get $20
                                        v128.load offset=480
                                        br $assembly/utils/v128/getV128|inlined.2
                                       end
                                       local.get $20
                                       v128.load offset=496
                                       br $assembly/utils/v128/getV128|inlined.2
                                      end
                                      local.get $20
                                      v128.load offset=512
                                      br $assembly/utils/v128/getV128|inlined.2
                                     end
                                     local.get $20
                                     v128.load offset=528
                                     br $assembly/utils/v128/getV128|inlined.2
                                    end
                                    local.get $20
                                    v128.load offset=544
                                    br $assembly/utils/v128/getV128|inlined.2
                                   end
                                   local.get $20
                                   v128.load offset=560
                                   br $assembly/utils/v128/getV128|inlined.2
                                  end
                                  local.get $20
                                  v128.load offset=576
                                  br $assembly/utils/v128/getV128|inlined.2
                                 end
                                 local.get $20
                                 v128.load offset=592
                                 br $assembly/utils/v128/getV128|inlined.2
                                end
                                local.get $20
                                v128.load offset=608
                                br $assembly/utils/v128/getV128|inlined.2
                               end
                               local.get $20
                               v128.load offset=624
                               br $assembly/utils/v128/getV128|inlined.2
                              end
                              local.get $20
                              v128.load offset=640
                              br $assembly/utils/v128/getV128|inlined.2
                             end
                             local.get $20
                             v128.load offset=656
                             br $assembly/utils/v128/getV128|inlined.2
                            end
                            local.get $20
                            v128.load offset=672
                            br $assembly/utils/v128/getV128|inlined.2
                           end
                           local.get $20
                           v128.load offset=688
                           br $assembly/utils/v128/getV128|inlined.2
                          end
                          local.get $20
                          v128.load offset=704
                          br $assembly/utils/v128/getV128|inlined.2
                         end
                         local.get $20
                         v128.load offset=720
                         br $assembly/utils/v128/getV128|inlined.2
                        end
                        local.get $20
                        v128.load offset=736
                        br $assembly/utils/v128/getV128|inlined.2
                       end
                       local.get $20
                       v128.load offset=752
                       br $assembly/utils/v128/getV128|inlined.2
                      end
                      local.get $20
                      v128.load offset=768
                      br $assembly/utils/v128/getV128|inlined.2
                     end
                     local.get $20
                     v128.load offset=784
                     br $assembly/utils/v128/getV128|inlined.2
                    end
                    local.get $20
                    v128.load offset=800
                    br $assembly/utils/v128/getV128|inlined.2
                   end
                   local.get $20
                   v128.load offset=816
                   br $assembly/utils/v128/getV128|inlined.2
                  end
                  local.get $20
                  v128.load offset=832
                  br $assembly/utils/v128/getV128|inlined.2
                 end
                 local.get $20
                 v128.load offset=848
                 br $assembly/utils/v128/getV128|inlined.2
                end
                local.get $20
                v128.load offset=864
                br $assembly/utils/v128/getV128|inlined.2
               end
               local.get $20
               v128.load offset=880
               br $assembly/utils/v128/getV128|inlined.2
              end
              local.get $20
              v128.load offset=896
              br $assembly/utils/v128/getV128|inlined.2
             end
             local.get $20
             v128.load offset=912
             br $assembly/utils/v128/getV128|inlined.2
            end
            local.get $20
            v128.load offset=928
            br $assembly/utils/v128/getV128|inlined.2
           end
           local.get $20
           v128.load offset=944
           br $assembly/utils/v128/getV128|inlined.2
          end
          local.get $20
          v128.load offset=960
          br $assembly/utils/v128/getV128|inlined.2
         end
         local.get $20
         v128.load offset=976
         br $assembly/utils/v128/getV128|inlined.2
        end
        local.get $20
        v128.load offset=992
        br $assembly/utils/v128/getV128|inlined.2
       end
       local.get $20
       v128.load offset=1008
       br $assembly/utils/v128/getV128|inlined.2
      end
      i32.const 3120
      local.get $21
      i32.const 10
      call $~lib/number/I32#toString
      call $~lib/string/String#concat
      i32.const 3056
      i32.const 341
      i32.const 7
      call $~lib/builtins/abort
      unreachable
     end
     i32x4.add
     block $assembly/simd/SIG0V128|inlined.0 (result v128)
      block $assembly/utils/v128/getV128|inlined.3 (result v128)
       local.get $2
       local.set $23
       global.get $assembly/simd/i
       i32.const 15
       i32.sub
       local.set $24
       block $case64|4
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
                                                                        local.get $24
                                                                        local.set $25
                                                                        local.get $25
                                                                        i32.const 0
                                                                        i32.eq
                                                                        br_if $case0|4
                                                                        local.get $25
                                                                        i32.const 1
                                                                        i32.eq
                                                                        br_if $case1|4
                                                                        local.get $25
                                                                        i32.const 2
                                                                        i32.eq
                                                                        br_if $case2|4
                                                                        local.get $25
                                                                        i32.const 3
                                                                        i32.eq
                                                                        br_if $case3|4
                                                                        local.get $25
                                                                        i32.const 4
                                                                        i32.eq
                                                                        br_if $case4|4
                                                                        local.get $25
                                                                        i32.const 5
                                                                        i32.eq
                                                                        br_if $case5|4
                                                                        local.get $25
                                                                        i32.const 6
                                                                        i32.eq
                                                                        br_if $case6|4
                                                                        local.get $25
                                                                        i32.const 7
                                                                        i32.eq
                                                                        br_if $case7|4
                                                                        local.get $25
                                                                        i32.const 8
                                                                        i32.eq
                                                                        br_if $case8|4
                                                                        local.get $25
                                                                        i32.const 9
                                                                        i32.eq
                                                                        br_if $case9|4
                                                                        local.get $25
                                                                        i32.const 10
                                                                        i32.eq
                                                                        br_if $case10|4
                                                                        local.get $25
                                                                        i32.const 11
                                                                        i32.eq
                                                                        br_if $case11|4
                                                                        local.get $25
                                                                        i32.const 12
                                                                        i32.eq
                                                                        br_if $case12|4
                                                                        local.get $25
                                                                        i32.const 13
                                                                        i32.eq
                                                                        br_if $case13|4
                                                                        local.get $25
                                                                        i32.const 14
                                                                        i32.eq
                                                                        br_if $case14|4
                                                                        local.get $25
                                                                        i32.const 15
                                                                        i32.eq
                                                                        br_if $case15|4
                                                                        local.get $25
                                                                        i32.const 16
                                                                        i32.eq
                                                                        br_if $case16|4
                                                                        local.get $25
                                                                        i32.const 17
                                                                        i32.eq
                                                                        br_if $case17|4
                                                                        local.get $25
                                                                        i32.const 18
                                                                        i32.eq
                                                                        br_if $case18|4
                                                                        local.get $25
                                                                        i32.const 19
                                                                        i32.eq
                                                                        br_if $case19|4
                                                                        local.get $25
                                                                        i32.const 20
                                                                        i32.eq
                                                                        br_if $case20|4
                                                                        local.get $25
                                                                        i32.const 21
                                                                        i32.eq
                                                                        br_if $case21|4
                                                                        local.get $25
                                                                        i32.const 22
                                                                        i32.eq
                                                                        br_if $case22|4
                                                                        local.get $25
                                                                        i32.const 23
                                                                        i32.eq
                                                                        br_if $case23|4
                                                                        local.get $25
                                                                        i32.const 24
                                                                        i32.eq
                                                                        br_if $case24|4
                                                                        local.get $25
                                                                        i32.const 25
                                                                        i32.eq
                                                                        br_if $case25|4
                                                                        local.get $25
                                                                        i32.const 26
                                                                        i32.eq
                                                                        br_if $case26|4
                                                                        local.get $25
                                                                        i32.const 27
                                                                        i32.eq
                                                                        br_if $case27|4
                                                                        local.get $25
                                                                        i32.const 28
                                                                        i32.eq
                                                                        br_if $case28|4
                                                                        local.get $25
                                                                        i32.const 29
                                                                        i32.eq
                                                                        br_if $case29|4
                                                                        local.get $25
                                                                        i32.const 30
                                                                        i32.eq
                                                                        br_if $case30|4
                                                                        local.get $25
                                                                        i32.const 31
                                                                        i32.eq
                                                                        br_if $case31|4
                                                                        local.get $25
                                                                        i32.const 32
                                                                        i32.eq
                                                                        br_if $case32|4
                                                                        local.get $25
                                                                        i32.const 33
                                                                        i32.eq
                                                                        br_if $case33|4
                                                                        local.get $25
                                                                        i32.const 34
                                                                        i32.eq
                                                                        br_if $case34|4
                                                                        local.get $25
                                                                        i32.const 35
                                                                        i32.eq
                                                                        br_if $case35|4
                                                                        local.get $25
                                                                        i32.const 36
                                                                        i32.eq
                                                                        br_if $case36|4
                                                                        local.get $25
                                                                        i32.const 37
                                                                        i32.eq
                                                                        br_if $case37|4
                                                                        local.get $25
                                                                        i32.const 38
                                                                        i32.eq
                                                                        br_if $case38|4
                                                                        local.get $25
                                                                        i32.const 39
                                                                        i32.eq
                                                                        br_if $case39|4
                                                                        local.get $25
                                                                        i32.const 40
                                                                        i32.eq
                                                                        br_if $case40|4
                                                                        local.get $25
                                                                        i32.const 41
                                                                        i32.eq
                                                                        br_if $case41|4
                                                                        local.get $25
                                                                        i32.const 42
                                                                        i32.eq
                                                                        br_if $case42|4
                                                                        local.get $25
                                                                        i32.const 43
                                                                        i32.eq
                                                                        br_if $case43|4
                                                                        local.get $25
                                                                        i32.const 44
                                                                        i32.eq
                                                                        br_if $case44|4
                                                                        local.get $25
                                                                        i32.const 45
                                                                        i32.eq
                                                                        br_if $case45|4
                                                                        local.get $25
                                                                        i32.const 46
                                                                        i32.eq
                                                                        br_if $case46|4
                                                                        local.get $25
                                                                        i32.const 47
                                                                        i32.eq
                                                                        br_if $case47|4
                                                                        local.get $25
                                                                        i32.const 48
                                                                        i32.eq
                                                                        br_if $case48|4
                                                                        local.get $25
                                                                        i32.const 49
                                                                        i32.eq
                                                                        br_if $case49|4
                                                                        local.get $25
                                                                        i32.const 50
                                                                        i32.eq
                                                                        br_if $case50|4
                                                                        local.get $25
                                                                        i32.const 51
                                                                        i32.eq
                                                                        br_if $case51|4
                                                                        local.get $25
                                                                        i32.const 52
                                                                        i32.eq
                                                                        br_if $case52|4
                                                                        local.get $25
                                                                        i32.const 53
                                                                        i32.eq
                                                                        br_if $case53|4
                                                                        local.get $25
                                                                        i32.const 54
                                                                        i32.eq
                                                                        br_if $case54|4
                                                                        local.get $25
                                                                        i32.const 55
                                                                        i32.eq
                                                                        br_if $case55|4
                                                                        local.get $25
                                                                        i32.const 56
                                                                        i32.eq
                                                                        br_if $case56|4
                                                                        local.get $25
                                                                        i32.const 57
                                                                        i32.eq
                                                                        br_if $case57|4
                                                                        local.get $25
                                                                        i32.const 58
                                                                        i32.eq
                                                                        br_if $case58|4
                                                                        local.get $25
                                                                        i32.const 59
                                                                        i32.eq
                                                                        br_if $case59|4
                                                                        local.get $25
                                                                        i32.const 60
                                                                        i32.eq
                                                                        br_if $case60|4
                                                                        local.get $25
                                                                        i32.const 61
                                                                        i32.eq
                                                                        br_if $case61|4
                                                                        local.get $25
                                                                        i32.const 62
                                                                        i32.eq
                                                                        br_if $case62|4
                                                                        local.get $25
                                                                        i32.const 63
                                                                        i32.eq
                                                                        br_if $case63|4
                                                                        br $case64|4
                                                                       end
                                                                       local.get $23
                                                                       v128.load
                                                                       br $assembly/utils/v128/getV128|inlined.3
                                                                      end
                                                                      local.get $23
                                                                      v128.load offset=16
                                                                      br $assembly/utils/v128/getV128|inlined.3
                                                                     end
                                                                     local.get $23
                                                                     v128.load offset=32
                                                                     br $assembly/utils/v128/getV128|inlined.3
                                                                    end
                                                                    local.get $23
                                                                    v128.load offset=48
                                                                    br $assembly/utils/v128/getV128|inlined.3
                                                                   end
                                                                   local.get $23
                                                                   v128.load offset=64
                                                                   br $assembly/utils/v128/getV128|inlined.3
                                                                  end
                                                                  local.get $23
                                                                  v128.load offset=80
                                                                  br $assembly/utils/v128/getV128|inlined.3
                                                                 end
                                                                 local.get $23
                                                                 v128.load offset=96
                                                                 br $assembly/utils/v128/getV128|inlined.3
                                                                end
                                                                local.get $23
                                                                v128.load offset=112
                                                                br $assembly/utils/v128/getV128|inlined.3
                                                               end
                                                               local.get $23
                                                               v128.load offset=128
                                                               br $assembly/utils/v128/getV128|inlined.3
                                                              end
                                                              local.get $23
                                                              v128.load offset=144
                                                              br $assembly/utils/v128/getV128|inlined.3
                                                             end
                                                             local.get $23
                                                             v128.load offset=160
                                                             br $assembly/utils/v128/getV128|inlined.3
                                                            end
                                                            local.get $23
                                                            v128.load offset=176
                                                            br $assembly/utils/v128/getV128|inlined.3
                                                           end
                                                           local.get $23
                                                           v128.load offset=192
                                                           br $assembly/utils/v128/getV128|inlined.3
                                                          end
                                                          local.get $23
                                                          v128.load offset=208
                                                          br $assembly/utils/v128/getV128|inlined.3
                                                         end
                                                         local.get $23
                                                         v128.load offset=224
                                                         br $assembly/utils/v128/getV128|inlined.3
                                                        end
                                                        local.get $23
                                                        v128.load offset=240
                                                        br $assembly/utils/v128/getV128|inlined.3
                                                       end
                                                       local.get $23
                                                       v128.load offset=256
                                                       br $assembly/utils/v128/getV128|inlined.3
                                                      end
                                                      local.get $23
                                                      v128.load offset=272
                                                      br $assembly/utils/v128/getV128|inlined.3
                                                     end
                                                     local.get $23
                                                     v128.load offset=288
                                                     br $assembly/utils/v128/getV128|inlined.3
                                                    end
                                                    local.get $23
                                                    v128.load offset=304
                                                    br $assembly/utils/v128/getV128|inlined.3
                                                   end
                                                   local.get $23
                                                   v128.load offset=320
                                                   br $assembly/utils/v128/getV128|inlined.3
                                                  end
                                                  local.get $23
                                                  v128.load offset=336
                                                  br $assembly/utils/v128/getV128|inlined.3
                                                 end
                                                 local.get $23
                                                 v128.load offset=352
                                                 br $assembly/utils/v128/getV128|inlined.3
                                                end
                                                local.get $23
                                                v128.load offset=368
                                                br $assembly/utils/v128/getV128|inlined.3
                                               end
                                               local.get $23
                                               v128.load offset=384
                                               br $assembly/utils/v128/getV128|inlined.3
                                              end
                                              local.get $23
                                              v128.load offset=400
                                              br $assembly/utils/v128/getV128|inlined.3
                                             end
                                             local.get $23
                                             v128.load offset=416
                                             br $assembly/utils/v128/getV128|inlined.3
                                            end
                                            local.get $23
                                            v128.load offset=432
                                            br $assembly/utils/v128/getV128|inlined.3
                                           end
                                           local.get $23
                                           v128.load offset=448
                                           br $assembly/utils/v128/getV128|inlined.3
                                          end
                                          local.get $23
                                          v128.load offset=464
                                          br $assembly/utils/v128/getV128|inlined.3
                                         end
                                         local.get $23
                                         v128.load offset=480
                                         br $assembly/utils/v128/getV128|inlined.3
                                        end
                                        local.get $23
                                        v128.load offset=496
                                        br $assembly/utils/v128/getV128|inlined.3
                                       end
                                       local.get $23
                                       v128.load offset=512
                                       br $assembly/utils/v128/getV128|inlined.3
                                      end
                                      local.get $23
                                      v128.load offset=528
                                      br $assembly/utils/v128/getV128|inlined.3
                                     end
                                     local.get $23
                                     v128.load offset=544
                                     br $assembly/utils/v128/getV128|inlined.3
                                    end
                                    local.get $23
                                    v128.load offset=560
                                    br $assembly/utils/v128/getV128|inlined.3
                                   end
                                   local.get $23
                                   v128.load offset=576
                                   br $assembly/utils/v128/getV128|inlined.3
                                  end
                                  local.get $23
                                  v128.load offset=592
                                  br $assembly/utils/v128/getV128|inlined.3
                                 end
                                 local.get $23
                                 v128.load offset=608
                                 br $assembly/utils/v128/getV128|inlined.3
                                end
                                local.get $23
                                v128.load offset=624
                                br $assembly/utils/v128/getV128|inlined.3
                               end
                               local.get $23
                               v128.load offset=640
                               br $assembly/utils/v128/getV128|inlined.3
                              end
                              local.get $23
                              v128.load offset=656
                              br $assembly/utils/v128/getV128|inlined.3
                             end
                             local.get $23
                             v128.load offset=672
                             br $assembly/utils/v128/getV128|inlined.3
                            end
                            local.get $23
                            v128.load offset=688
                            br $assembly/utils/v128/getV128|inlined.3
                           end
                           local.get $23
                           v128.load offset=704
                           br $assembly/utils/v128/getV128|inlined.3
                          end
                          local.get $23
                          v128.load offset=720
                          br $assembly/utils/v128/getV128|inlined.3
                         end
                         local.get $23
                         v128.load offset=736
                         br $assembly/utils/v128/getV128|inlined.3
                        end
                        local.get $23
                        v128.load offset=752
                        br $assembly/utils/v128/getV128|inlined.3
                       end
                       local.get $23
                       v128.load offset=768
                       br $assembly/utils/v128/getV128|inlined.3
                      end
                      local.get $23
                      v128.load offset=784
                      br $assembly/utils/v128/getV128|inlined.3
                     end
                     local.get $23
                     v128.load offset=800
                     br $assembly/utils/v128/getV128|inlined.3
                    end
                    local.get $23
                    v128.load offset=816
                    br $assembly/utils/v128/getV128|inlined.3
                   end
                   local.get $23
                   v128.load offset=832
                   br $assembly/utils/v128/getV128|inlined.3
                  end
                  local.get $23
                  v128.load offset=848
                  br $assembly/utils/v128/getV128|inlined.3
                 end
                 local.get $23
                 v128.load offset=864
                 br $assembly/utils/v128/getV128|inlined.3
                end
                local.get $23
                v128.load offset=880
                br $assembly/utils/v128/getV128|inlined.3
               end
               local.get $23
               v128.load offset=896
               br $assembly/utils/v128/getV128|inlined.3
              end
              local.get $23
              v128.load offset=912
              br $assembly/utils/v128/getV128|inlined.3
             end
             local.get $23
             v128.load offset=928
             br $assembly/utils/v128/getV128|inlined.3
            end
            local.get $23
            v128.load offset=944
            br $assembly/utils/v128/getV128|inlined.3
           end
           local.get $23
           v128.load offset=960
           br $assembly/utils/v128/getV128|inlined.3
          end
          local.get $23
          v128.load offset=976
          br $assembly/utils/v128/getV128|inlined.3
         end
         local.get $23
         v128.load offset=992
         br $assembly/utils/v128/getV128|inlined.3
        end
        local.get $23
        v128.load offset=1008
        br $assembly/utils/v128/getV128|inlined.3
       end
       i32.const 3120
       local.get $24
       i32.const 10
       call $~lib/number/I32#toString
       call $~lib/string/String#concat
       i32.const 3056
       i32.const 341
       i32.const 7
       call $~lib/builtins/abort
       unreachable
      end
      local.set $26
      block $assembly/simd/rotrV128|inlined.2 (result v128)
       local.get $26
       local.set $27
       i32.const 7
       local.set $28
       i32.const 32
       local.get $28
       i32.sub
       local.set $29
       local.get $27
       local.get $28
       i32x4.shr_u
       local.set $30
       local.get $27
       local.get $29
       i32x4.shl
       local.set $31
       local.get $30
       local.get $31
       v128.or
       br $assembly/simd/rotrV128|inlined.2
      end
      block $assembly/simd/rotrV128|inlined.3 (result v128)
       local.get $26
       local.set $32
       i32.const 18
       local.set $33
       i32.const 32
       local.get $33
       i32.sub
       local.set $34
       local.get $32
       local.get $33
       i32x4.shr_u
       local.set $35
       local.get $32
       local.get $34
       i32x4.shl
       local.set $36
       local.get $35
       local.get $36
       v128.or
       br $assembly/simd/rotrV128|inlined.3
      end
      v128.xor
      local.get $26
      i32.const 3
      i32x4.shr_u
      v128.xor
      br $assembly/simd/SIG0V128|inlined.0
     end
     i32x4.add
     block $assembly/utils/v128/getV128|inlined.4 (result v128)
      local.get $2
      local.set $37
      global.get $assembly/simd/i
      i32.const 16
      i32.sub
      local.set $38
      block $case64|5
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
                                                                       local.get $38
                                                                       local.set $39
                                                                       local.get $39
                                                                       i32.const 0
                                                                       i32.eq
                                                                       br_if $case0|5
                                                                       local.get $39
                                                                       i32.const 1
                                                                       i32.eq
                                                                       br_if $case1|5
                                                                       local.get $39
                                                                       i32.const 2
                                                                       i32.eq
                                                                       br_if $case2|5
                                                                       local.get $39
                                                                       i32.const 3
                                                                       i32.eq
                                                                       br_if $case3|5
                                                                       local.get $39
                                                                       i32.const 4
                                                                       i32.eq
                                                                       br_if $case4|5
                                                                       local.get $39
                                                                       i32.const 5
                                                                       i32.eq
                                                                       br_if $case5|5
                                                                       local.get $39
                                                                       i32.const 6
                                                                       i32.eq
                                                                       br_if $case6|5
                                                                       local.get $39
                                                                       i32.const 7
                                                                       i32.eq
                                                                       br_if $case7|5
                                                                       local.get $39
                                                                       i32.const 8
                                                                       i32.eq
                                                                       br_if $case8|5
                                                                       local.get $39
                                                                       i32.const 9
                                                                       i32.eq
                                                                       br_if $case9|5
                                                                       local.get $39
                                                                       i32.const 10
                                                                       i32.eq
                                                                       br_if $case10|5
                                                                       local.get $39
                                                                       i32.const 11
                                                                       i32.eq
                                                                       br_if $case11|5
                                                                       local.get $39
                                                                       i32.const 12
                                                                       i32.eq
                                                                       br_if $case12|5
                                                                       local.get $39
                                                                       i32.const 13
                                                                       i32.eq
                                                                       br_if $case13|5
                                                                       local.get $39
                                                                       i32.const 14
                                                                       i32.eq
                                                                       br_if $case14|5
                                                                       local.get $39
                                                                       i32.const 15
                                                                       i32.eq
                                                                       br_if $case15|5
                                                                       local.get $39
                                                                       i32.const 16
                                                                       i32.eq
                                                                       br_if $case16|5
                                                                       local.get $39
                                                                       i32.const 17
                                                                       i32.eq
                                                                       br_if $case17|5
                                                                       local.get $39
                                                                       i32.const 18
                                                                       i32.eq
                                                                       br_if $case18|5
                                                                       local.get $39
                                                                       i32.const 19
                                                                       i32.eq
                                                                       br_if $case19|5
                                                                       local.get $39
                                                                       i32.const 20
                                                                       i32.eq
                                                                       br_if $case20|5
                                                                       local.get $39
                                                                       i32.const 21
                                                                       i32.eq
                                                                       br_if $case21|5
                                                                       local.get $39
                                                                       i32.const 22
                                                                       i32.eq
                                                                       br_if $case22|5
                                                                       local.get $39
                                                                       i32.const 23
                                                                       i32.eq
                                                                       br_if $case23|5
                                                                       local.get $39
                                                                       i32.const 24
                                                                       i32.eq
                                                                       br_if $case24|5
                                                                       local.get $39
                                                                       i32.const 25
                                                                       i32.eq
                                                                       br_if $case25|5
                                                                       local.get $39
                                                                       i32.const 26
                                                                       i32.eq
                                                                       br_if $case26|5
                                                                       local.get $39
                                                                       i32.const 27
                                                                       i32.eq
                                                                       br_if $case27|5
                                                                       local.get $39
                                                                       i32.const 28
                                                                       i32.eq
                                                                       br_if $case28|5
                                                                       local.get $39
                                                                       i32.const 29
                                                                       i32.eq
                                                                       br_if $case29|5
                                                                       local.get $39
                                                                       i32.const 30
                                                                       i32.eq
                                                                       br_if $case30|5
                                                                       local.get $39
                                                                       i32.const 31
                                                                       i32.eq
                                                                       br_if $case31|5
                                                                       local.get $39
                                                                       i32.const 32
                                                                       i32.eq
                                                                       br_if $case32|5
                                                                       local.get $39
                                                                       i32.const 33
                                                                       i32.eq
                                                                       br_if $case33|5
                                                                       local.get $39
                                                                       i32.const 34
                                                                       i32.eq
                                                                       br_if $case34|5
                                                                       local.get $39
                                                                       i32.const 35
                                                                       i32.eq
                                                                       br_if $case35|5
                                                                       local.get $39
                                                                       i32.const 36
                                                                       i32.eq
                                                                       br_if $case36|5
                                                                       local.get $39
                                                                       i32.const 37
                                                                       i32.eq
                                                                       br_if $case37|5
                                                                       local.get $39
                                                                       i32.const 38
                                                                       i32.eq
                                                                       br_if $case38|5
                                                                       local.get $39
                                                                       i32.const 39
                                                                       i32.eq
                                                                       br_if $case39|5
                                                                       local.get $39
                                                                       i32.const 40
                                                                       i32.eq
                                                                       br_if $case40|5
                                                                       local.get $39
                                                                       i32.const 41
                                                                       i32.eq
                                                                       br_if $case41|5
                                                                       local.get $39
                                                                       i32.const 42
                                                                       i32.eq
                                                                       br_if $case42|5
                                                                       local.get $39
                                                                       i32.const 43
                                                                       i32.eq
                                                                       br_if $case43|5
                                                                       local.get $39
                                                                       i32.const 44
                                                                       i32.eq
                                                                       br_if $case44|5
                                                                       local.get $39
                                                                       i32.const 45
                                                                       i32.eq
                                                                       br_if $case45|5
                                                                       local.get $39
                                                                       i32.const 46
                                                                       i32.eq
                                                                       br_if $case46|5
                                                                       local.get $39
                                                                       i32.const 47
                                                                       i32.eq
                                                                       br_if $case47|5
                                                                       local.get $39
                                                                       i32.const 48
                                                                       i32.eq
                                                                       br_if $case48|5
                                                                       local.get $39
                                                                       i32.const 49
                                                                       i32.eq
                                                                       br_if $case49|5
                                                                       local.get $39
                                                                       i32.const 50
                                                                       i32.eq
                                                                       br_if $case50|5
                                                                       local.get $39
                                                                       i32.const 51
                                                                       i32.eq
                                                                       br_if $case51|5
                                                                       local.get $39
                                                                       i32.const 52
                                                                       i32.eq
                                                                       br_if $case52|5
                                                                       local.get $39
                                                                       i32.const 53
                                                                       i32.eq
                                                                       br_if $case53|5
                                                                       local.get $39
                                                                       i32.const 54
                                                                       i32.eq
                                                                       br_if $case54|5
                                                                       local.get $39
                                                                       i32.const 55
                                                                       i32.eq
                                                                       br_if $case55|5
                                                                       local.get $39
                                                                       i32.const 56
                                                                       i32.eq
                                                                       br_if $case56|5
                                                                       local.get $39
                                                                       i32.const 57
                                                                       i32.eq
                                                                       br_if $case57|5
                                                                       local.get $39
                                                                       i32.const 58
                                                                       i32.eq
                                                                       br_if $case58|5
                                                                       local.get $39
                                                                       i32.const 59
                                                                       i32.eq
                                                                       br_if $case59|5
                                                                       local.get $39
                                                                       i32.const 60
                                                                       i32.eq
                                                                       br_if $case60|5
                                                                       local.get $39
                                                                       i32.const 61
                                                                       i32.eq
                                                                       br_if $case61|5
                                                                       local.get $39
                                                                       i32.const 62
                                                                       i32.eq
                                                                       br_if $case62|5
                                                                       local.get $39
                                                                       i32.const 63
                                                                       i32.eq
                                                                       br_if $case63|5
                                                                       br $case64|5
                                                                      end
                                                                      local.get $37
                                                                      v128.load
                                                                      br $assembly/utils/v128/getV128|inlined.4
                                                                     end
                                                                     local.get $37
                                                                     v128.load offset=16
                                                                     br $assembly/utils/v128/getV128|inlined.4
                                                                    end
                                                                    local.get $37
                                                                    v128.load offset=32
                                                                    br $assembly/utils/v128/getV128|inlined.4
                                                                   end
                                                                   local.get $37
                                                                   v128.load offset=48
                                                                   br $assembly/utils/v128/getV128|inlined.4
                                                                  end
                                                                  local.get $37
                                                                  v128.load offset=64
                                                                  br $assembly/utils/v128/getV128|inlined.4
                                                                 end
                                                                 local.get $37
                                                                 v128.load offset=80
                                                                 br $assembly/utils/v128/getV128|inlined.4
                                                                end
                                                                local.get $37
                                                                v128.load offset=96
                                                                br $assembly/utils/v128/getV128|inlined.4
                                                               end
                                                               local.get $37
                                                               v128.load offset=112
                                                               br $assembly/utils/v128/getV128|inlined.4
                                                              end
                                                              local.get $37
                                                              v128.load offset=128
                                                              br $assembly/utils/v128/getV128|inlined.4
                                                             end
                                                             local.get $37
                                                             v128.load offset=144
                                                             br $assembly/utils/v128/getV128|inlined.4
                                                            end
                                                            local.get $37
                                                            v128.load offset=160
                                                            br $assembly/utils/v128/getV128|inlined.4
                                                           end
                                                           local.get $37
                                                           v128.load offset=176
                                                           br $assembly/utils/v128/getV128|inlined.4
                                                          end
                                                          local.get $37
                                                          v128.load offset=192
                                                          br $assembly/utils/v128/getV128|inlined.4
                                                         end
                                                         local.get $37
                                                         v128.load offset=208
                                                         br $assembly/utils/v128/getV128|inlined.4
                                                        end
                                                        local.get $37
                                                        v128.load offset=224
                                                        br $assembly/utils/v128/getV128|inlined.4
                                                       end
                                                       local.get $37
                                                       v128.load offset=240
                                                       br $assembly/utils/v128/getV128|inlined.4
                                                      end
                                                      local.get $37
                                                      v128.load offset=256
                                                      br $assembly/utils/v128/getV128|inlined.4
                                                     end
                                                     local.get $37
                                                     v128.load offset=272
                                                     br $assembly/utils/v128/getV128|inlined.4
                                                    end
                                                    local.get $37
                                                    v128.load offset=288
                                                    br $assembly/utils/v128/getV128|inlined.4
                                                   end
                                                   local.get $37
                                                   v128.load offset=304
                                                   br $assembly/utils/v128/getV128|inlined.4
                                                  end
                                                  local.get $37
                                                  v128.load offset=320
                                                  br $assembly/utils/v128/getV128|inlined.4
                                                 end
                                                 local.get $37
                                                 v128.load offset=336
                                                 br $assembly/utils/v128/getV128|inlined.4
                                                end
                                                local.get $37
                                                v128.load offset=352
                                                br $assembly/utils/v128/getV128|inlined.4
                                               end
                                               local.get $37
                                               v128.load offset=368
                                               br $assembly/utils/v128/getV128|inlined.4
                                              end
                                              local.get $37
                                              v128.load offset=384
                                              br $assembly/utils/v128/getV128|inlined.4
                                             end
                                             local.get $37
                                             v128.load offset=400
                                             br $assembly/utils/v128/getV128|inlined.4
                                            end
                                            local.get $37
                                            v128.load offset=416
                                            br $assembly/utils/v128/getV128|inlined.4
                                           end
                                           local.get $37
                                           v128.load offset=432
                                           br $assembly/utils/v128/getV128|inlined.4
                                          end
                                          local.get $37
                                          v128.load offset=448
                                          br $assembly/utils/v128/getV128|inlined.4
                                         end
                                         local.get $37
                                         v128.load offset=464
                                         br $assembly/utils/v128/getV128|inlined.4
                                        end
                                        local.get $37
                                        v128.load offset=480
                                        br $assembly/utils/v128/getV128|inlined.4
                                       end
                                       local.get $37
                                       v128.load offset=496
                                       br $assembly/utils/v128/getV128|inlined.4
                                      end
                                      local.get $37
                                      v128.load offset=512
                                      br $assembly/utils/v128/getV128|inlined.4
                                     end
                                     local.get $37
                                     v128.load offset=528
                                     br $assembly/utils/v128/getV128|inlined.4
                                    end
                                    local.get $37
                                    v128.load offset=544
                                    br $assembly/utils/v128/getV128|inlined.4
                                   end
                                   local.get $37
                                   v128.load offset=560
                                   br $assembly/utils/v128/getV128|inlined.4
                                  end
                                  local.get $37
                                  v128.load offset=576
                                  br $assembly/utils/v128/getV128|inlined.4
                                 end
                                 local.get $37
                                 v128.load offset=592
                                 br $assembly/utils/v128/getV128|inlined.4
                                end
                                local.get $37
                                v128.load offset=608
                                br $assembly/utils/v128/getV128|inlined.4
                               end
                               local.get $37
                               v128.load offset=624
                               br $assembly/utils/v128/getV128|inlined.4
                              end
                              local.get $37
                              v128.load offset=640
                              br $assembly/utils/v128/getV128|inlined.4
                             end
                             local.get $37
                             v128.load offset=656
                             br $assembly/utils/v128/getV128|inlined.4
                            end
                            local.get $37
                            v128.load offset=672
                            br $assembly/utils/v128/getV128|inlined.4
                           end
                           local.get $37
                           v128.load offset=688
                           br $assembly/utils/v128/getV128|inlined.4
                          end
                          local.get $37
                          v128.load offset=704
                          br $assembly/utils/v128/getV128|inlined.4
                         end
                         local.get $37
                         v128.load offset=720
                         br $assembly/utils/v128/getV128|inlined.4
                        end
                        local.get $37
                        v128.load offset=736
                        br $assembly/utils/v128/getV128|inlined.4
                       end
                       local.get $37
                       v128.load offset=752
                       br $assembly/utils/v128/getV128|inlined.4
                      end
                      local.get $37
                      v128.load offset=768
                      br $assembly/utils/v128/getV128|inlined.4
                     end
                     local.get $37
                     v128.load offset=784
                     br $assembly/utils/v128/getV128|inlined.4
                    end
                    local.get $37
                    v128.load offset=800
                    br $assembly/utils/v128/getV128|inlined.4
                   end
                   local.get $37
                   v128.load offset=816
                   br $assembly/utils/v128/getV128|inlined.4
                  end
                  local.get $37
                  v128.load offset=832
                  br $assembly/utils/v128/getV128|inlined.4
                 end
                 local.get $37
                 v128.load offset=848
                 br $assembly/utils/v128/getV128|inlined.4
                end
                local.get $37
                v128.load offset=864
                br $assembly/utils/v128/getV128|inlined.4
               end
               local.get $37
               v128.load offset=880
               br $assembly/utils/v128/getV128|inlined.4
              end
              local.get $37
              v128.load offset=896
              br $assembly/utils/v128/getV128|inlined.4
             end
             local.get $37
             v128.load offset=912
             br $assembly/utils/v128/getV128|inlined.4
            end
            local.get $37
            v128.load offset=928
            br $assembly/utils/v128/getV128|inlined.4
           end
           local.get $37
           v128.load offset=944
           br $assembly/utils/v128/getV128|inlined.4
          end
          local.get $37
          v128.load offset=960
          br $assembly/utils/v128/getV128|inlined.4
         end
         local.get $37
         v128.load offset=976
         br $assembly/utils/v128/getV128|inlined.4
        end
        local.get $37
        v128.load offset=992
        br $assembly/utils/v128/getV128|inlined.4
       end
       local.get $37
       v128.load offset=1008
       br $assembly/utils/v128/getV128|inlined.4
      end
      i32.const 3120
      local.get $38
      i32.const 10
      call $~lib/number/I32#toString
      call $~lib/string/String#concat
      i32.const 3056
      i32.const 341
      i32.const 7
      call $~lib/builtins/abort
      unreachable
     end
     i32x4.add
    end
    global.set $assembly/simd/tmpW
    global.get $assembly/simd/i
    i32.const 16
    i32.ge_s
    if
     local.get $2
     local.set $40
     global.get $assembly/simd/i
     local.set $41
     global.get $assembly/simd/tmpW
     local.set $42
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
                                                                       local.get $41
                                                                       local.set $43
                                                                       local.get $43
                                                                       i32.const 0
                                                                       i32.eq
                                                                       br_if $case0|6
                                                                       local.get $43
                                                                       i32.const 1
                                                                       i32.eq
                                                                       br_if $case1|6
                                                                       local.get $43
                                                                       i32.const 2
                                                                       i32.eq
                                                                       br_if $case2|6
                                                                       local.get $43
                                                                       i32.const 3
                                                                       i32.eq
                                                                       br_if $case3|6
                                                                       local.get $43
                                                                       i32.const 4
                                                                       i32.eq
                                                                       br_if $case4|6
                                                                       local.get $43
                                                                       i32.const 5
                                                                       i32.eq
                                                                       br_if $case5|6
                                                                       local.get $43
                                                                       i32.const 6
                                                                       i32.eq
                                                                       br_if $case6|6
                                                                       local.get $43
                                                                       i32.const 7
                                                                       i32.eq
                                                                       br_if $case7|6
                                                                       local.get $43
                                                                       i32.const 8
                                                                       i32.eq
                                                                       br_if $case8|6
                                                                       local.get $43
                                                                       i32.const 9
                                                                       i32.eq
                                                                       br_if $case9|6
                                                                       local.get $43
                                                                       i32.const 10
                                                                       i32.eq
                                                                       br_if $case10|6
                                                                       local.get $43
                                                                       i32.const 11
                                                                       i32.eq
                                                                       br_if $case11|6
                                                                       local.get $43
                                                                       i32.const 12
                                                                       i32.eq
                                                                       br_if $case12|6
                                                                       local.get $43
                                                                       i32.const 13
                                                                       i32.eq
                                                                       br_if $case13|6
                                                                       local.get $43
                                                                       i32.const 14
                                                                       i32.eq
                                                                       br_if $case14|6
                                                                       local.get $43
                                                                       i32.const 15
                                                                       i32.eq
                                                                       br_if $case15|6
                                                                       local.get $43
                                                                       i32.const 16
                                                                       i32.eq
                                                                       br_if $case16|6
                                                                       local.get $43
                                                                       i32.const 17
                                                                       i32.eq
                                                                       br_if $case17|6
                                                                       local.get $43
                                                                       i32.const 18
                                                                       i32.eq
                                                                       br_if $case18|6
                                                                       local.get $43
                                                                       i32.const 19
                                                                       i32.eq
                                                                       br_if $case19|6
                                                                       local.get $43
                                                                       i32.const 20
                                                                       i32.eq
                                                                       br_if $case20|6
                                                                       local.get $43
                                                                       i32.const 21
                                                                       i32.eq
                                                                       br_if $case21|6
                                                                       local.get $43
                                                                       i32.const 22
                                                                       i32.eq
                                                                       br_if $case22|6
                                                                       local.get $43
                                                                       i32.const 23
                                                                       i32.eq
                                                                       br_if $case23|6
                                                                       local.get $43
                                                                       i32.const 24
                                                                       i32.eq
                                                                       br_if $case24|6
                                                                       local.get $43
                                                                       i32.const 25
                                                                       i32.eq
                                                                       br_if $case25|6
                                                                       local.get $43
                                                                       i32.const 26
                                                                       i32.eq
                                                                       br_if $case26|6
                                                                       local.get $43
                                                                       i32.const 27
                                                                       i32.eq
                                                                       br_if $case27|6
                                                                       local.get $43
                                                                       i32.const 28
                                                                       i32.eq
                                                                       br_if $case28|6
                                                                       local.get $43
                                                                       i32.const 29
                                                                       i32.eq
                                                                       br_if $case29|6
                                                                       local.get $43
                                                                       i32.const 30
                                                                       i32.eq
                                                                       br_if $case30|6
                                                                       local.get $43
                                                                       i32.const 31
                                                                       i32.eq
                                                                       br_if $case31|6
                                                                       local.get $43
                                                                       i32.const 32
                                                                       i32.eq
                                                                       br_if $case32|6
                                                                       local.get $43
                                                                       i32.const 33
                                                                       i32.eq
                                                                       br_if $case33|6
                                                                       local.get $43
                                                                       i32.const 34
                                                                       i32.eq
                                                                       br_if $case34|6
                                                                       local.get $43
                                                                       i32.const 35
                                                                       i32.eq
                                                                       br_if $case35|6
                                                                       local.get $43
                                                                       i32.const 36
                                                                       i32.eq
                                                                       br_if $case36|6
                                                                       local.get $43
                                                                       i32.const 37
                                                                       i32.eq
                                                                       br_if $case37|6
                                                                       local.get $43
                                                                       i32.const 38
                                                                       i32.eq
                                                                       br_if $case38|6
                                                                       local.get $43
                                                                       i32.const 39
                                                                       i32.eq
                                                                       br_if $case39|6
                                                                       local.get $43
                                                                       i32.const 40
                                                                       i32.eq
                                                                       br_if $case40|6
                                                                       local.get $43
                                                                       i32.const 41
                                                                       i32.eq
                                                                       br_if $case41|6
                                                                       local.get $43
                                                                       i32.const 42
                                                                       i32.eq
                                                                       br_if $case42|6
                                                                       local.get $43
                                                                       i32.const 43
                                                                       i32.eq
                                                                       br_if $case43|6
                                                                       local.get $43
                                                                       i32.const 44
                                                                       i32.eq
                                                                       br_if $case44|6
                                                                       local.get $43
                                                                       i32.const 45
                                                                       i32.eq
                                                                       br_if $case45|6
                                                                       local.get $43
                                                                       i32.const 46
                                                                       i32.eq
                                                                       br_if $case46|6
                                                                       local.get $43
                                                                       i32.const 47
                                                                       i32.eq
                                                                       br_if $case47|6
                                                                       local.get $43
                                                                       i32.const 48
                                                                       i32.eq
                                                                       br_if $case48|6
                                                                       local.get $43
                                                                       i32.const 49
                                                                       i32.eq
                                                                       br_if $case49|6
                                                                       local.get $43
                                                                       i32.const 50
                                                                       i32.eq
                                                                       br_if $case50|6
                                                                       local.get $43
                                                                       i32.const 51
                                                                       i32.eq
                                                                       br_if $case51|6
                                                                       local.get $43
                                                                       i32.const 52
                                                                       i32.eq
                                                                       br_if $case52|6
                                                                       local.get $43
                                                                       i32.const 53
                                                                       i32.eq
                                                                       br_if $case53|6
                                                                       local.get $43
                                                                       i32.const 54
                                                                       i32.eq
                                                                       br_if $case54|6
                                                                       local.get $43
                                                                       i32.const 55
                                                                       i32.eq
                                                                       br_if $case55|6
                                                                       local.get $43
                                                                       i32.const 56
                                                                       i32.eq
                                                                       br_if $case56|6
                                                                       local.get $43
                                                                       i32.const 57
                                                                       i32.eq
                                                                       br_if $case57|6
                                                                       local.get $43
                                                                       i32.const 58
                                                                       i32.eq
                                                                       br_if $case58|6
                                                                       local.get $43
                                                                       i32.const 59
                                                                       i32.eq
                                                                       br_if $case59|6
                                                                       local.get $43
                                                                       i32.const 60
                                                                       i32.eq
                                                                       br_if $case60|6
                                                                       local.get $43
                                                                       i32.const 61
                                                                       i32.eq
                                                                       br_if $case61|6
                                                                       local.get $43
                                                                       i32.const 62
                                                                       i32.eq
                                                                       br_if $case62|6
                                                                       local.get $43
                                                                       i32.const 63
                                                                       i32.eq
                                                                       br_if $case63|6
                                                                       br $case64|6
                                                                      end
                                                                      local.get $40
                                                                      local.get $42
                                                                      v128.store
                                                                      br $break|6
                                                                     end
                                                                     local.get $40
                                                                     local.get $42
                                                                     v128.store offset=16
                                                                     br $break|6
                                                                    end
                                                                    local.get $40
                                                                    local.get $42
                                                                    v128.store offset=32
                                                                    br $break|6
                                                                   end
                                                                   local.get $40
                                                                   local.get $42
                                                                   v128.store offset=48
                                                                   br $break|6
                                                                  end
                                                                  local.get $40
                                                                  local.get $42
                                                                  v128.store offset=64
                                                                  br $break|6
                                                                 end
                                                                 local.get $40
                                                                 local.get $42
                                                                 v128.store offset=80
                                                                 br $break|6
                                                                end
                                                                local.get $40
                                                                local.get $42
                                                                v128.store offset=96
                                                                br $break|6
                                                               end
                                                               local.get $40
                                                               local.get $42
                                                               v128.store offset=112
                                                               br $break|6
                                                              end
                                                              local.get $40
                                                              local.get $42
                                                              v128.store offset=128
                                                              br $break|6
                                                             end
                                                             local.get $40
                                                             local.get $42
                                                             v128.store offset=144
                                                             br $break|6
                                                            end
                                                            local.get $40
                                                            local.get $42
                                                            v128.store offset=160
                                                            br $break|6
                                                           end
                                                           local.get $40
                                                           local.get $42
                                                           v128.store offset=176
                                                           br $break|6
                                                          end
                                                          local.get $40
                                                          local.get $42
                                                          v128.store offset=192
                                                          br $break|6
                                                         end
                                                         local.get $40
                                                         local.get $42
                                                         v128.store offset=208
                                                         br $break|6
                                                        end
                                                        local.get $40
                                                        local.get $42
                                                        v128.store offset=224
                                                        br $break|6
                                                       end
                                                       local.get $40
                                                       local.get $42
                                                       v128.store offset=240
                                                       br $break|6
                                                      end
                                                      local.get $40
                                                      local.get $42
                                                      v128.store offset=256
                                                      br $break|6
                                                     end
                                                     local.get $40
                                                     local.get $42
                                                     v128.store offset=272
                                                     br $break|6
                                                    end
                                                    local.get $40
                                                    local.get $42
                                                    v128.store offset=288
                                                    br $break|6
                                                   end
                                                   local.get $40
                                                   local.get $42
                                                   v128.store offset=304
                                                   br $break|6
                                                  end
                                                  local.get $40
                                                  local.get $42
                                                  v128.store offset=320
                                                  br $break|6
                                                 end
                                                 local.get $40
                                                 local.get $42
                                                 v128.store offset=336
                                                 br $break|6
                                                end
                                                local.get $40
                                                local.get $42
                                                v128.store offset=352
                                                br $break|6
                                               end
                                               local.get $40
                                               local.get $42
                                               v128.store offset=368
                                               br $break|6
                                              end
                                              local.get $40
                                              local.get $42
                                              v128.store offset=384
                                              br $break|6
                                             end
                                             local.get $40
                                             local.get $42
                                             v128.store offset=400
                                             br $break|6
                                            end
                                            local.get $40
                                            local.get $42
                                            v128.store offset=416
                                            br $break|6
                                           end
                                           local.get $40
                                           local.get $42
                                           v128.store offset=432
                                           br $break|6
                                          end
                                          local.get $40
                                          local.get $42
                                          v128.store offset=448
                                          br $break|6
                                         end
                                         local.get $40
                                         local.get $42
                                         v128.store offset=464
                                         br $break|6
                                        end
                                        local.get $40
                                        local.get $42
                                        v128.store offset=480
                                        br $break|6
                                       end
                                       local.get $40
                                       local.get $42
                                       v128.store offset=496
                                       br $break|6
                                      end
                                      local.get $40
                                      local.get $42
                                      v128.store offset=512
                                      br $break|6
                                     end
                                     local.get $40
                                     local.get $42
                                     v128.store offset=528
                                     br $break|6
                                    end
                                    local.get $40
                                    local.get $42
                                    v128.store offset=544
                                    br $break|6
                                   end
                                   local.get $40
                                   local.get $42
                                   v128.store offset=560
                                   br $break|6
                                  end
                                  local.get $40
                                  local.get $42
                                  v128.store offset=576
                                  br $break|6
                                 end
                                 local.get $40
                                 local.get $42
                                 v128.store offset=592
                                 br $break|6
                                end
                                local.get $40
                                local.get $42
                                v128.store offset=608
                                br $break|6
                               end
                               local.get $40
                               local.get $42
                               v128.store offset=624
                               br $break|6
                              end
                              local.get $40
                              local.get $42
                              v128.store offset=640
                              br $break|6
                             end
                             local.get $40
                             local.get $42
                             v128.store offset=656
                             br $break|6
                            end
                            local.get $40
                            local.get $42
                            v128.store offset=672
                            br $break|6
                           end
                           local.get $40
                           local.get $42
                           v128.store offset=688
                           br $break|6
                          end
                          local.get $40
                          local.get $42
                          v128.store offset=704
                          br $break|6
                         end
                         local.get $40
                         local.get $42
                         v128.store offset=720
                         br $break|6
                        end
                        local.get $40
                        local.get $42
                        v128.store offset=736
                        br $break|6
                       end
                       local.get $40
                       local.get $42
                       v128.store offset=752
                       br $break|6
                      end
                      local.get $40
                      local.get $42
                      v128.store offset=768
                      br $break|6
                     end
                     local.get $40
                     local.get $42
                     v128.store offset=784
                     br $break|6
                    end
                    local.get $40
                    local.get $42
                    v128.store offset=800
                    br $break|6
                   end
                   local.get $40
                   local.get $42
                   v128.store offset=816
                   br $break|6
                  end
                  local.get $40
                  local.get $42
                  v128.store offset=832
                  br $break|6
                 end
                 local.get $40
                 local.get $42
                 v128.store offset=848
                 br $break|6
                end
                local.get $40
                local.get $42
                v128.store offset=864
                br $break|6
               end
               local.get $40
               local.get $42
               v128.store offset=880
               br $break|6
              end
              local.get $40
              local.get $42
              v128.store offset=896
              br $break|6
             end
             local.get $40
             local.get $42
             v128.store offset=912
             br $break|6
            end
            local.get $40
            local.get $42
            v128.store offset=928
            br $break|6
           end
           local.get $40
           local.get $42
           v128.store offset=944
           br $break|6
          end
          local.get $40
          local.get $42
          v128.store offset=960
          br $break|6
         end
         local.get $40
         local.get $42
         v128.store offset=976
         br $break|6
        end
        local.get $40
        local.get $42
        v128.store offset=992
        br $break|6
       end
       local.get $40
       local.get $42
       v128.store offset=1008
       br $break|6
      end
      i32.const 2928
      local.get $41
      i32.const 10
      call $~lib/number/I32#toString
      call $~lib/string/String#concat
      i32.const 3056
      i32.const 201
      i32.const 7
      call $~lib/builtins/abort
      unreachable
     end
    end
    global.get $assembly/simd/hV128
    block $assembly/simd/EP1V128|inlined.0 (result v128)
     global.get $assembly/simd/eV128
     local.set $44
     block $assembly/simd/rotrV128|inlined.4 (result v128)
      local.get $44
      local.set $45
      i32.const 6
      local.set $46
      i32.const 32
      local.get $46
      i32.sub
      local.set $47
      local.get $45
      local.get $46
      i32x4.shr_u
      local.set $48
      local.get $45
      local.get $47
      i32x4.shl
      local.set $49
      local.get $48
      local.get $49
      v128.or
      br $assembly/simd/rotrV128|inlined.4
     end
     block $assembly/simd/rotrV128|inlined.5 (result v128)
      local.get $44
      local.set $50
      i32.const 11
      local.set $51
      i32.const 32
      local.get $51
      i32.sub
      local.set $52
      local.get $50
      local.get $51
      i32x4.shr_u
      local.set $53
      local.get $50
      local.get $52
      i32x4.shl
      local.set $54
      local.get $53
      local.get $54
      v128.or
      br $assembly/simd/rotrV128|inlined.5
     end
     v128.xor
     block $assembly/simd/rotrV128|inlined.6 (result v128)
      local.get $44
      local.set $55
      i32.const 25
      local.set $56
      i32.const 32
      local.get $56
      i32.sub
      local.set $57
      local.get $55
      local.get $56
      i32x4.shr_u
      local.set $58
      local.get $55
      local.get $57
      i32x4.shl
      local.set $59
      local.get $58
      local.get $59
      v128.or
      br $assembly/simd/rotrV128|inlined.6
     end
     v128.xor
     br $assembly/simd/EP1V128|inlined.0
    end
    i32x4.add
    block $assembly/simd/CHV128|inlined.0 (result v128)
     global.get $assembly/simd/eV128
     local.set $60
     global.get $assembly/simd/fV128
     local.set $61
     global.get $assembly/simd/gV128
     local.set $62
     local.get $60
     local.get $61
     v128.and
     local.get $60
     v128.not
     local.get $62
     v128.and
     v128.xor
     br $assembly/simd/CHV128|inlined.0
    end
    i32x4.add
    block $assembly/utils/v128/getV128|inlined.5 (result v128)
     global.get $assembly/simd/kV128Ptr
     local.set $63
     global.get $assembly/simd/i
     local.set $64
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
                                                                      local.get $64
                                                                      local.set $65
                                                                      local.get $65
                                                                      i32.const 0
                                                                      i32.eq
                                                                      br_if $case0|7
                                                                      local.get $65
                                                                      i32.const 1
                                                                      i32.eq
                                                                      br_if $case1|7
                                                                      local.get $65
                                                                      i32.const 2
                                                                      i32.eq
                                                                      br_if $case2|7
                                                                      local.get $65
                                                                      i32.const 3
                                                                      i32.eq
                                                                      br_if $case3|7
                                                                      local.get $65
                                                                      i32.const 4
                                                                      i32.eq
                                                                      br_if $case4|7
                                                                      local.get $65
                                                                      i32.const 5
                                                                      i32.eq
                                                                      br_if $case5|7
                                                                      local.get $65
                                                                      i32.const 6
                                                                      i32.eq
                                                                      br_if $case6|7
                                                                      local.get $65
                                                                      i32.const 7
                                                                      i32.eq
                                                                      br_if $case7|7
                                                                      local.get $65
                                                                      i32.const 8
                                                                      i32.eq
                                                                      br_if $case8|7
                                                                      local.get $65
                                                                      i32.const 9
                                                                      i32.eq
                                                                      br_if $case9|7
                                                                      local.get $65
                                                                      i32.const 10
                                                                      i32.eq
                                                                      br_if $case10|7
                                                                      local.get $65
                                                                      i32.const 11
                                                                      i32.eq
                                                                      br_if $case11|7
                                                                      local.get $65
                                                                      i32.const 12
                                                                      i32.eq
                                                                      br_if $case12|7
                                                                      local.get $65
                                                                      i32.const 13
                                                                      i32.eq
                                                                      br_if $case13|7
                                                                      local.get $65
                                                                      i32.const 14
                                                                      i32.eq
                                                                      br_if $case14|7
                                                                      local.get $65
                                                                      i32.const 15
                                                                      i32.eq
                                                                      br_if $case15|7
                                                                      local.get $65
                                                                      i32.const 16
                                                                      i32.eq
                                                                      br_if $case16|7
                                                                      local.get $65
                                                                      i32.const 17
                                                                      i32.eq
                                                                      br_if $case17|7
                                                                      local.get $65
                                                                      i32.const 18
                                                                      i32.eq
                                                                      br_if $case18|7
                                                                      local.get $65
                                                                      i32.const 19
                                                                      i32.eq
                                                                      br_if $case19|7
                                                                      local.get $65
                                                                      i32.const 20
                                                                      i32.eq
                                                                      br_if $case20|7
                                                                      local.get $65
                                                                      i32.const 21
                                                                      i32.eq
                                                                      br_if $case21|7
                                                                      local.get $65
                                                                      i32.const 22
                                                                      i32.eq
                                                                      br_if $case22|7
                                                                      local.get $65
                                                                      i32.const 23
                                                                      i32.eq
                                                                      br_if $case23|7
                                                                      local.get $65
                                                                      i32.const 24
                                                                      i32.eq
                                                                      br_if $case24|7
                                                                      local.get $65
                                                                      i32.const 25
                                                                      i32.eq
                                                                      br_if $case25|7
                                                                      local.get $65
                                                                      i32.const 26
                                                                      i32.eq
                                                                      br_if $case26|7
                                                                      local.get $65
                                                                      i32.const 27
                                                                      i32.eq
                                                                      br_if $case27|7
                                                                      local.get $65
                                                                      i32.const 28
                                                                      i32.eq
                                                                      br_if $case28|7
                                                                      local.get $65
                                                                      i32.const 29
                                                                      i32.eq
                                                                      br_if $case29|7
                                                                      local.get $65
                                                                      i32.const 30
                                                                      i32.eq
                                                                      br_if $case30|7
                                                                      local.get $65
                                                                      i32.const 31
                                                                      i32.eq
                                                                      br_if $case31|7
                                                                      local.get $65
                                                                      i32.const 32
                                                                      i32.eq
                                                                      br_if $case32|7
                                                                      local.get $65
                                                                      i32.const 33
                                                                      i32.eq
                                                                      br_if $case33|7
                                                                      local.get $65
                                                                      i32.const 34
                                                                      i32.eq
                                                                      br_if $case34|7
                                                                      local.get $65
                                                                      i32.const 35
                                                                      i32.eq
                                                                      br_if $case35|7
                                                                      local.get $65
                                                                      i32.const 36
                                                                      i32.eq
                                                                      br_if $case36|7
                                                                      local.get $65
                                                                      i32.const 37
                                                                      i32.eq
                                                                      br_if $case37|7
                                                                      local.get $65
                                                                      i32.const 38
                                                                      i32.eq
                                                                      br_if $case38|7
                                                                      local.get $65
                                                                      i32.const 39
                                                                      i32.eq
                                                                      br_if $case39|7
                                                                      local.get $65
                                                                      i32.const 40
                                                                      i32.eq
                                                                      br_if $case40|7
                                                                      local.get $65
                                                                      i32.const 41
                                                                      i32.eq
                                                                      br_if $case41|7
                                                                      local.get $65
                                                                      i32.const 42
                                                                      i32.eq
                                                                      br_if $case42|7
                                                                      local.get $65
                                                                      i32.const 43
                                                                      i32.eq
                                                                      br_if $case43|7
                                                                      local.get $65
                                                                      i32.const 44
                                                                      i32.eq
                                                                      br_if $case44|7
                                                                      local.get $65
                                                                      i32.const 45
                                                                      i32.eq
                                                                      br_if $case45|7
                                                                      local.get $65
                                                                      i32.const 46
                                                                      i32.eq
                                                                      br_if $case46|7
                                                                      local.get $65
                                                                      i32.const 47
                                                                      i32.eq
                                                                      br_if $case47|7
                                                                      local.get $65
                                                                      i32.const 48
                                                                      i32.eq
                                                                      br_if $case48|7
                                                                      local.get $65
                                                                      i32.const 49
                                                                      i32.eq
                                                                      br_if $case49|7
                                                                      local.get $65
                                                                      i32.const 50
                                                                      i32.eq
                                                                      br_if $case50|7
                                                                      local.get $65
                                                                      i32.const 51
                                                                      i32.eq
                                                                      br_if $case51|7
                                                                      local.get $65
                                                                      i32.const 52
                                                                      i32.eq
                                                                      br_if $case52|7
                                                                      local.get $65
                                                                      i32.const 53
                                                                      i32.eq
                                                                      br_if $case53|7
                                                                      local.get $65
                                                                      i32.const 54
                                                                      i32.eq
                                                                      br_if $case54|7
                                                                      local.get $65
                                                                      i32.const 55
                                                                      i32.eq
                                                                      br_if $case55|7
                                                                      local.get $65
                                                                      i32.const 56
                                                                      i32.eq
                                                                      br_if $case56|7
                                                                      local.get $65
                                                                      i32.const 57
                                                                      i32.eq
                                                                      br_if $case57|7
                                                                      local.get $65
                                                                      i32.const 58
                                                                      i32.eq
                                                                      br_if $case58|7
                                                                      local.get $65
                                                                      i32.const 59
                                                                      i32.eq
                                                                      br_if $case59|7
                                                                      local.get $65
                                                                      i32.const 60
                                                                      i32.eq
                                                                      br_if $case60|7
                                                                      local.get $65
                                                                      i32.const 61
                                                                      i32.eq
                                                                      br_if $case61|7
                                                                      local.get $65
                                                                      i32.const 62
                                                                      i32.eq
                                                                      br_if $case62|7
                                                                      local.get $65
                                                                      i32.const 63
                                                                      i32.eq
                                                                      br_if $case63|7
                                                                      br $case64|7
                                                                     end
                                                                     local.get $63
                                                                     v128.load
                                                                     br $assembly/utils/v128/getV128|inlined.5
                                                                    end
                                                                    local.get $63
                                                                    v128.load offset=16
                                                                    br $assembly/utils/v128/getV128|inlined.5
                                                                   end
                                                                   local.get $63
                                                                   v128.load offset=32
                                                                   br $assembly/utils/v128/getV128|inlined.5
                                                                  end
                                                                  local.get $63
                                                                  v128.load offset=48
                                                                  br $assembly/utils/v128/getV128|inlined.5
                                                                 end
                                                                 local.get $63
                                                                 v128.load offset=64
                                                                 br $assembly/utils/v128/getV128|inlined.5
                                                                end
                                                                local.get $63
                                                                v128.load offset=80
                                                                br $assembly/utils/v128/getV128|inlined.5
                                                               end
                                                               local.get $63
                                                               v128.load offset=96
                                                               br $assembly/utils/v128/getV128|inlined.5
                                                              end
                                                              local.get $63
                                                              v128.load offset=112
                                                              br $assembly/utils/v128/getV128|inlined.5
                                                             end
                                                             local.get $63
                                                             v128.load offset=128
                                                             br $assembly/utils/v128/getV128|inlined.5
                                                            end
                                                            local.get $63
                                                            v128.load offset=144
                                                            br $assembly/utils/v128/getV128|inlined.5
                                                           end
                                                           local.get $63
                                                           v128.load offset=160
                                                           br $assembly/utils/v128/getV128|inlined.5
                                                          end
                                                          local.get $63
                                                          v128.load offset=176
                                                          br $assembly/utils/v128/getV128|inlined.5
                                                         end
                                                         local.get $63
                                                         v128.load offset=192
                                                         br $assembly/utils/v128/getV128|inlined.5
                                                        end
                                                        local.get $63
                                                        v128.load offset=208
                                                        br $assembly/utils/v128/getV128|inlined.5
                                                       end
                                                       local.get $63
                                                       v128.load offset=224
                                                       br $assembly/utils/v128/getV128|inlined.5
                                                      end
                                                      local.get $63
                                                      v128.load offset=240
                                                      br $assembly/utils/v128/getV128|inlined.5
                                                     end
                                                     local.get $63
                                                     v128.load offset=256
                                                     br $assembly/utils/v128/getV128|inlined.5
                                                    end
                                                    local.get $63
                                                    v128.load offset=272
                                                    br $assembly/utils/v128/getV128|inlined.5
                                                   end
                                                   local.get $63
                                                   v128.load offset=288
                                                   br $assembly/utils/v128/getV128|inlined.5
                                                  end
                                                  local.get $63
                                                  v128.load offset=304
                                                  br $assembly/utils/v128/getV128|inlined.5
                                                 end
                                                 local.get $63
                                                 v128.load offset=320
                                                 br $assembly/utils/v128/getV128|inlined.5
                                                end
                                                local.get $63
                                                v128.load offset=336
                                                br $assembly/utils/v128/getV128|inlined.5
                                               end
                                               local.get $63
                                               v128.load offset=352
                                               br $assembly/utils/v128/getV128|inlined.5
                                              end
                                              local.get $63
                                              v128.load offset=368
                                              br $assembly/utils/v128/getV128|inlined.5
                                             end
                                             local.get $63
                                             v128.load offset=384
                                             br $assembly/utils/v128/getV128|inlined.5
                                            end
                                            local.get $63
                                            v128.load offset=400
                                            br $assembly/utils/v128/getV128|inlined.5
                                           end
                                           local.get $63
                                           v128.load offset=416
                                           br $assembly/utils/v128/getV128|inlined.5
                                          end
                                          local.get $63
                                          v128.load offset=432
                                          br $assembly/utils/v128/getV128|inlined.5
                                         end
                                         local.get $63
                                         v128.load offset=448
                                         br $assembly/utils/v128/getV128|inlined.5
                                        end
                                        local.get $63
                                        v128.load offset=464
                                        br $assembly/utils/v128/getV128|inlined.5
                                       end
                                       local.get $63
                                       v128.load offset=480
                                       br $assembly/utils/v128/getV128|inlined.5
                                      end
                                      local.get $63
                                      v128.load offset=496
                                      br $assembly/utils/v128/getV128|inlined.5
                                     end
                                     local.get $63
                                     v128.load offset=512
                                     br $assembly/utils/v128/getV128|inlined.5
                                    end
                                    local.get $63
                                    v128.load offset=528
                                    br $assembly/utils/v128/getV128|inlined.5
                                   end
                                   local.get $63
                                   v128.load offset=544
                                   br $assembly/utils/v128/getV128|inlined.5
                                  end
                                  local.get $63
                                  v128.load offset=560
                                  br $assembly/utils/v128/getV128|inlined.5
                                 end
                                 local.get $63
                                 v128.load offset=576
                                 br $assembly/utils/v128/getV128|inlined.5
                                end
                                local.get $63
                                v128.load offset=592
                                br $assembly/utils/v128/getV128|inlined.5
                               end
                               local.get $63
                               v128.load offset=608
                               br $assembly/utils/v128/getV128|inlined.5
                              end
                              local.get $63
                              v128.load offset=624
                              br $assembly/utils/v128/getV128|inlined.5
                             end
                             local.get $63
                             v128.load offset=640
                             br $assembly/utils/v128/getV128|inlined.5
                            end
                            local.get $63
                            v128.load offset=656
                            br $assembly/utils/v128/getV128|inlined.5
                           end
                           local.get $63
                           v128.load offset=672
                           br $assembly/utils/v128/getV128|inlined.5
                          end
                          local.get $63
                          v128.load offset=688
                          br $assembly/utils/v128/getV128|inlined.5
                         end
                         local.get $63
                         v128.load offset=704
                         br $assembly/utils/v128/getV128|inlined.5
                        end
                        local.get $63
                        v128.load offset=720
                        br $assembly/utils/v128/getV128|inlined.5
                       end
                       local.get $63
                       v128.load offset=736
                       br $assembly/utils/v128/getV128|inlined.5
                      end
                      local.get $63
                      v128.load offset=752
                      br $assembly/utils/v128/getV128|inlined.5
                     end
                     local.get $63
                     v128.load offset=768
                     br $assembly/utils/v128/getV128|inlined.5
                    end
                    local.get $63
                    v128.load offset=784
                    br $assembly/utils/v128/getV128|inlined.5
                   end
                   local.get $63
                   v128.load offset=800
                   br $assembly/utils/v128/getV128|inlined.5
                  end
                  local.get $63
                  v128.load offset=816
                  br $assembly/utils/v128/getV128|inlined.5
                 end
                 local.get $63
                 v128.load offset=832
                 br $assembly/utils/v128/getV128|inlined.5
                end
                local.get $63
                v128.load offset=848
                br $assembly/utils/v128/getV128|inlined.5
               end
               local.get $63
               v128.load offset=864
               br $assembly/utils/v128/getV128|inlined.5
              end
              local.get $63
              v128.load offset=880
              br $assembly/utils/v128/getV128|inlined.5
             end
             local.get $63
             v128.load offset=896
             br $assembly/utils/v128/getV128|inlined.5
            end
            local.get $63
            v128.load offset=912
            br $assembly/utils/v128/getV128|inlined.5
           end
           local.get $63
           v128.load offset=928
           br $assembly/utils/v128/getV128|inlined.5
          end
          local.get $63
          v128.load offset=944
          br $assembly/utils/v128/getV128|inlined.5
         end
         local.get $63
         v128.load offset=960
         br $assembly/utils/v128/getV128|inlined.5
        end
        local.get $63
        v128.load offset=976
        br $assembly/utils/v128/getV128|inlined.5
       end
       local.get $63
       v128.load offset=992
       br $assembly/utils/v128/getV128|inlined.5
      end
      local.get $63
      v128.load offset=1008
      br $assembly/utils/v128/getV128|inlined.5
     end
     i32.const 3120
     local.get $64
     i32.const 10
     call $~lib/number/I32#toString
     call $~lib/string/String#concat
     i32.const 3056
     i32.const 341
     i32.const 7
     call $~lib/builtins/abort
     unreachable
    end
    i32x4.add
    global.get $assembly/simd/tmpW
    i32x4.add
    global.set $assembly/simd/t1V128
    block $assembly/simd/EP0V128|inlined.0 (result v128)
     global.get $assembly/simd/aV128
     local.set $66
     block $assembly/simd/rotrV128|inlined.7 (result v128)
      local.get $66
      local.set $67
      i32.const 2
      local.set $68
      i32.const 32
      local.get $68
      i32.sub
      local.set $69
      local.get $67
      local.get $68
      i32x4.shr_u
      local.set $70
      local.get $67
      local.get $69
      i32x4.shl
      local.set $71
      local.get $70
      local.get $71
      v128.or
      br $assembly/simd/rotrV128|inlined.7
     end
     block $assembly/simd/rotrV128|inlined.8 (result v128)
      local.get $66
      local.set $72
      i32.const 13
      local.set $73
      i32.const 32
      local.get $73
      i32.sub
      local.set $74
      local.get $72
      local.get $73
      i32x4.shr_u
      local.set $75
      local.get $72
      local.get $74
      i32x4.shl
      local.set $76
      local.get $75
      local.get $76
      v128.or
      br $assembly/simd/rotrV128|inlined.8
     end
     v128.xor
     block $assembly/simd/rotrV128|inlined.9 (result v128)
      local.get $66
      local.set $77
      i32.const 22
      local.set $78
      i32.const 32
      local.get $78
      i32.sub
      local.set $79
      local.get $77
      local.get $78
      i32x4.shr_u
      local.set $80
      local.get $77
      local.get $79
      i32x4.shl
      local.set $81
      local.get $80
      local.get $81
      v128.or
      br $assembly/simd/rotrV128|inlined.9
     end
     v128.xor
     br $assembly/simd/EP0V128|inlined.0
    end
    block $assembly/simd/MAJV128|inlined.0 (result v128)
     global.get $assembly/simd/aV128
     local.set $82
     global.get $assembly/simd/bV128
     local.set $83
     global.get $assembly/simd/cV128
     local.set $84
     local.get $82
     local.get $83
     v128.and
     local.get $82
     local.get $84
     v128.and
     v128.xor
     local.get $83
     local.get $84
     v128.and
     v128.xor
     br $assembly/simd/MAJV128|inlined.0
    end
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
  local.set $85
  i32.const 0
  local.set $86
  global.get $assembly/simd/H0V128
  i32x4.extract_lane 0
  call $~lib/polyfills/bswap<i32>
  local.set $87
  local.get $85
  local.get $86
  i32.const 2
  i32.shl
  i32.add
  local.get $87
  i32.store
  local.get $1
  local.set $88
  i32.const 1
  local.set $89
  global.get $assembly/simd/H1V128
  i32x4.extract_lane 0
  call $~lib/polyfills/bswap<i32>
  local.set $90
  local.get $88
  local.get $89
  i32.const 2
  i32.shl
  i32.add
  local.get $90
  i32.store
  local.get $1
  local.set $91
  i32.const 2
  local.set $92
  global.get $assembly/simd/H2V128
  i32x4.extract_lane 0
  call $~lib/polyfills/bswap<i32>
  local.set $93
  local.get $91
  local.get $92
  i32.const 2
  i32.shl
  i32.add
  local.get $93
  i32.store
  local.get $1
  local.set $94
  i32.const 3
  local.set $95
  global.get $assembly/simd/H3V128
  i32x4.extract_lane 0
  call $~lib/polyfills/bswap<i32>
  local.set $96
  local.get $94
  local.get $95
  i32.const 2
  i32.shl
  i32.add
  local.get $96
  i32.store
  local.get $1
  local.set $97
  i32.const 4
  local.set $98
  global.get $assembly/simd/H4V128
  i32x4.extract_lane 0
  call $~lib/polyfills/bswap<i32>
  local.set $99
  local.get $97
  local.get $98
  i32.const 2
  i32.shl
  i32.add
  local.get $99
  i32.store
  local.get $1
  local.set $100
  i32.const 5
  local.set $101
  global.get $assembly/simd/H5V128
  i32x4.extract_lane 0
  call $~lib/polyfills/bswap<i32>
  local.set $102
  local.get $100
  local.get $101
  i32.const 2
  i32.shl
  i32.add
  local.get $102
  i32.store
  local.get $1
  local.set $103
  i32.const 6
  local.set $104
  global.get $assembly/simd/H6V128
  i32x4.extract_lane 0
  call $~lib/polyfills/bswap<i32>
  local.set $105
  local.get $103
  local.get $104
  i32.const 2
  i32.shl
  i32.add
  local.get $105
  i32.store
  local.get $1
  local.set $106
  i32.const 7
  local.set $107
  global.get $assembly/simd/H7V128
  i32x4.extract_lane 0
  call $~lib/polyfills/bswap<i32>
  local.set $108
  local.get $106
  local.get $107
  i32.const 2
  i32.shl
  i32.add
  local.get $108
  i32.store
  local.get $1
  local.set $109
  i32.const 8
  local.set $110
  global.get $assembly/simd/H0V128
  i32x4.extract_lane 1
  call $~lib/polyfills/bswap<i32>
  local.set $111
  local.get $109
  local.get $110
  i32.const 2
  i32.shl
  i32.add
  local.get $111
  i32.store
  local.get $1
  local.set $112
  i32.const 9
  local.set $113
  global.get $assembly/simd/H1V128
  i32x4.extract_lane 1
  call $~lib/polyfills/bswap<i32>
  local.set $114
  local.get $112
  local.get $113
  i32.const 2
  i32.shl
  i32.add
  local.get $114
  i32.store
  local.get $1
  local.set $115
  i32.const 10
  local.set $116
  global.get $assembly/simd/H2V128
  i32x4.extract_lane 1
  call $~lib/polyfills/bswap<i32>
  local.set $117
  local.get $115
  local.get $116
  i32.const 2
  i32.shl
  i32.add
  local.get $117
  i32.store
  local.get $1
  local.set $118
  i32.const 11
  local.set $119
  global.get $assembly/simd/H3V128
  i32x4.extract_lane 1
  call $~lib/polyfills/bswap<i32>
  local.set $120
  local.get $118
  local.get $119
  i32.const 2
  i32.shl
  i32.add
  local.get $120
  i32.store
  local.get $1
  local.set $121
  i32.const 12
  local.set $122
  global.get $assembly/simd/H4V128
  i32x4.extract_lane 1
  call $~lib/polyfills/bswap<i32>
  local.set $123
  local.get $121
  local.get $122
  i32.const 2
  i32.shl
  i32.add
  local.get $123
  i32.store
  local.get $1
  local.set $124
  i32.const 13
  local.set $125
  global.get $assembly/simd/H5V128
  i32x4.extract_lane 1
  call $~lib/polyfills/bswap<i32>
  local.set $126
  local.get $124
  local.get $125
  i32.const 2
  i32.shl
  i32.add
  local.get $126
  i32.store
  local.get $1
  local.set $127
  i32.const 14
  local.set $128
  global.get $assembly/simd/H6V128
  i32x4.extract_lane 1
  call $~lib/polyfills/bswap<i32>
  local.set $129
  local.get $127
  local.get $128
  i32.const 2
  i32.shl
  i32.add
  local.get $129
  i32.store
  local.get $1
  local.set $130
  i32.const 15
  local.set $131
  global.get $assembly/simd/H7V128
  i32x4.extract_lane 1
  call $~lib/polyfills/bswap<i32>
  local.set $132
  local.get $130
  local.get $131
  i32.const 2
  i32.shl
  i32.add
  local.get $132
  i32.store
  local.get $1
  local.set $133
  i32.const 16
  local.set $134
  global.get $assembly/simd/H0V128
  i32x4.extract_lane 2
  call $~lib/polyfills/bswap<i32>
  local.set $135
  local.get $133
  local.get $134
  i32.const 2
  i32.shl
  i32.add
  local.get $135
  i32.store
  local.get $1
  local.set $136
  i32.const 17
  local.set $137
  global.get $assembly/simd/H1V128
  i32x4.extract_lane 2
  call $~lib/polyfills/bswap<i32>
  local.set $138
  local.get $136
  local.get $137
  i32.const 2
  i32.shl
  i32.add
  local.get $138
  i32.store
  local.get $1
  local.set $139
  i32.const 18
  local.set $140
  global.get $assembly/simd/H2V128
  i32x4.extract_lane 2
  call $~lib/polyfills/bswap<i32>
  local.set $141
  local.get $139
  local.get $140
  i32.const 2
  i32.shl
  i32.add
  local.get $141
  i32.store
  local.get $1
  local.set $142
  i32.const 19
  local.set $143
  global.get $assembly/simd/H3V128
  i32x4.extract_lane 2
  call $~lib/polyfills/bswap<i32>
  local.set $144
  local.get $142
  local.get $143
  i32.const 2
  i32.shl
  i32.add
  local.get $144
  i32.store
  local.get $1
  local.set $145
  i32.const 20
  local.set $146
  global.get $assembly/simd/H4V128
  i32x4.extract_lane 2
  call $~lib/polyfills/bswap<i32>
  local.set $147
  local.get $145
  local.get $146
  i32.const 2
  i32.shl
  i32.add
  local.get $147
  i32.store
  local.get $1
  local.set $148
  i32.const 21
  local.set $149
  global.get $assembly/simd/H5V128
  i32x4.extract_lane 2
  call $~lib/polyfills/bswap<i32>
  local.set $150
  local.get $148
  local.get $149
  i32.const 2
  i32.shl
  i32.add
  local.get $150
  i32.store
  local.get $1
  local.set $151
  i32.const 22
  local.set $152
  global.get $assembly/simd/H6V128
  i32x4.extract_lane 2
  call $~lib/polyfills/bswap<i32>
  local.set $153
  local.get $151
  local.get $152
  i32.const 2
  i32.shl
  i32.add
  local.get $153
  i32.store
  local.get $1
  local.set $154
  i32.const 23
  local.set $155
  global.get $assembly/simd/H7V128
  i32x4.extract_lane 2
  call $~lib/polyfills/bswap<i32>
  local.set $156
  local.get $154
  local.get $155
  i32.const 2
  i32.shl
  i32.add
  local.get $156
  i32.store
  local.get $1
  local.set $157
  i32.const 24
  local.set $158
  global.get $assembly/simd/H0V128
  i32x4.extract_lane 3
  call $~lib/polyfills/bswap<i32>
  local.set $159
  local.get $157
  local.get $158
  i32.const 2
  i32.shl
  i32.add
  local.get $159
  i32.store
  local.get $1
  local.set $160
  i32.const 25
  local.set $161
  global.get $assembly/simd/H1V128
  i32x4.extract_lane 3
  call $~lib/polyfills/bswap<i32>
  local.set $162
  local.get $160
  local.get $161
  i32.const 2
  i32.shl
  i32.add
  local.get $162
  i32.store
  local.get $1
  local.set $163
  i32.const 26
  local.set $164
  global.get $assembly/simd/H2V128
  i32x4.extract_lane 3
  call $~lib/polyfills/bswap<i32>
  local.set $165
  local.get $163
  local.get $164
  i32.const 2
  i32.shl
  i32.add
  local.get $165
  i32.store
  local.get $1
  local.set $166
  i32.const 27
  local.set $167
  global.get $assembly/simd/H3V128
  i32x4.extract_lane 3
  call $~lib/polyfills/bswap<i32>
  local.set $168
  local.get $166
  local.get $167
  i32.const 2
  i32.shl
  i32.add
  local.get $168
  i32.store
  local.get $1
  local.set $169
  i32.const 28
  local.set $170
  global.get $assembly/simd/H4V128
  i32x4.extract_lane 3
  call $~lib/polyfills/bswap<i32>
  local.set $171
  local.get $169
  local.get $170
  i32.const 2
  i32.shl
  i32.add
  local.get $171
  i32.store
  local.get $1
  local.set $172
  i32.const 29
  local.set $173
  global.get $assembly/simd/H5V128
  i32x4.extract_lane 3
  call $~lib/polyfills/bswap<i32>
  local.set $174
  local.get $172
  local.get $173
  i32.const 2
  i32.shl
  i32.add
  local.get $174
  i32.store
  local.get $1
  local.set $175
  i32.const 30
  local.set $176
  global.get $assembly/simd/H6V128
  i32x4.extract_lane 3
  call $~lib/polyfills/bswap<i32>
  local.set $177
  local.get $175
  local.get $176
  i32.const 2
  i32.shl
  i32.add
  local.get $177
  i32.store
  local.get $1
  local.set $178
  i32.const 31
  local.set $179
  global.get $assembly/simd/H7V128
  i32x4.extract_lane 3
  call $~lib/polyfills/bswap<i32>
  local.set $180
  local.get $178
  local.get $179
  i32.const 2
  i32.shl
  i32.add
  local.get $180
  i32.store
 )
 (func $assembly/index.simd/batchHash4UintArray64s (param $0 i32)
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
  (local $36 i32)
  (local $37 i32)
  (local $38 i32)
  (local $39 i32)
  (local $40 i32)
  (local $41 i32)
  (local $42 i32)
  (local $43 i32)
  (local $44 i32)
  (local $45 i32)
  (local $46 i32)
  (local $47 i32)
  (local $48 i32)
  (local $49 i32)
  (local $50 i32)
  (local $51 i32)
  (local $52 i32)
  (local $53 i32)
  (local $54 i32)
  (local $55 i32)
  (local $56 i32)
  (local $57 i32)
  i32.const 0
  local.set $1
  loop $for-loop|0
   local.get $1
   i32.const 16
   i32.lt_s
   if
    global.get $assembly/common/wPtr
    local.set $13
    global.get $assembly/common/PARALLEL_FACTOR
    local.get $1
    i32.mul
    local.set $14
    block $assembly/common/load32be|inlined.0 (result i32)
     global.get $assembly/common/inputPtr
     local.set $2
     local.get $1
     local.set $3
     local.get $3
     i32.const 2
     i32.shl
     local.set $4
     block $assembly/common/load8|inlined.0 (result i32)
      local.get $2
      local.set $5
      local.get $4
      i32.const 0
      i32.add
      local.set $6
      local.get $5
      local.get $6
      i32.add
      i32.load8_u
      br $assembly/common/load8|inlined.0
     end
     i32.const 255
     i32.and
     i32.const 24
     i32.shl
     block $assembly/common/load8|inlined.1 (result i32)
      local.get $2
      local.set $7
      local.get $4
      i32.const 1
      i32.add
      local.set $8
      local.get $7
      local.get $8
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
      local.get $2
      local.set $9
      local.get $4
      i32.const 2
      i32.add
      local.set $10
      local.get $9
      local.get $10
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
      local.get $2
      local.set $11
      local.get $4
      i32.const 3
      i32.add
      local.set $12
      local.get $11
      local.get $12
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
    local.set $15
    local.get $13
    local.get $14
    i32.const 2
    i32.shl
    i32.add
    local.get $15
    i32.store
    global.get $assembly/common/wPtr
    local.set $27
    global.get $assembly/common/PARALLEL_FACTOR
    local.get $1
    i32.mul
    i32.const 1
    i32.add
    local.set $28
    block $assembly/common/load32be|inlined.1 (result i32)
     global.get $assembly/common/inputPtr
     local.set $16
     local.get $1
     i32.const 16
     i32.add
     local.set $17
     local.get $17
     i32.const 2
     i32.shl
     local.set $18
     block $assembly/common/load8|inlined.4 (result i32)
      local.get $16
      local.set $19
      local.get $18
      i32.const 0
      i32.add
      local.set $20
      local.get $19
      local.get $20
      i32.add
      i32.load8_u
      br $assembly/common/load8|inlined.4
     end
     i32.const 255
     i32.and
     i32.const 24
     i32.shl
     block $assembly/common/load8|inlined.5 (result i32)
      local.get $16
      local.set $21
      local.get $18
      i32.const 1
      i32.add
      local.set $22
      local.get $21
      local.get $22
      i32.add
      i32.load8_u
      br $assembly/common/load8|inlined.5
     end
     i32.const 255
     i32.and
     i32.const 16
     i32.shl
     i32.or
     block $assembly/common/load8|inlined.6 (result i32)
      local.get $16
      local.set $23
      local.get $18
      i32.const 2
      i32.add
      local.set $24
      local.get $23
      local.get $24
      i32.add
      i32.load8_u
      br $assembly/common/load8|inlined.6
     end
     i32.const 255
     i32.and
     i32.const 8
     i32.shl
     i32.or
     block $assembly/common/load8|inlined.7 (result i32)
      local.get $16
      local.set $25
      local.get $18
      i32.const 3
      i32.add
      local.set $26
      local.get $25
      local.get $26
      i32.add
      i32.load8_u
      br $assembly/common/load8|inlined.7
     end
     i32.const 255
     i32.and
     i32.const 0
     i32.shl
     i32.or
     br $assembly/common/load32be|inlined.1
    end
    local.set $29
    local.get $27
    local.get $28
    i32.const 2
    i32.shl
    i32.add
    local.get $29
    i32.store
    global.get $assembly/common/wPtr
    local.set $41
    global.get $assembly/common/PARALLEL_FACTOR
    local.get $1
    i32.mul
    i32.const 2
    i32.add
    local.set $42
    block $assembly/common/load32be|inlined.2 (result i32)
     global.get $assembly/common/inputPtr
     local.set $30
     local.get $1
     i32.const 32
     i32.add
     local.set $31
     local.get $31
     i32.const 2
     i32.shl
     local.set $32
     block $assembly/common/load8|inlined.8 (result i32)
      local.get $30
      local.set $33
      local.get $32
      i32.const 0
      i32.add
      local.set $34
      local.get $33
      local.get $34
      i32.add
      i32.load8_u
      br $assembly/common/load8|inlined.8
     end
     i32.const 255
     i32.and
     i32.const 24
     i32.shl
     block $assembly/common/load8|inlined.9 (result i32)
      local.get $30
      local.set $35
      local.get $32
      i32.const 1
      i32.add
      local.set $36
      local.get $35
      local.get $36
      i32.add
      i32.load8_u
      br $assembly/common/load8|inlined.9
     end
     i32.const 255
     i32.and
     i32.const 16
     i32.shl
     i32.or
     block $assembly/common/load8|inlined.10 (result i32)
      local.get $30
      local.set $37
      local.get $32
      i32.const 2
      i32.add
      local.set $38
      local.get $37
      local.get $38
      i32.add
      i32.load8_u
      br $assembly/common/load8|inlined.10
     end
     i32.const 255
     i32.and
     i32.const 8
     i32.shl
     i32.or
     block $assembly/common/load8|inlined.11 (result i32)
      local.get $30
      local.set $39
      local.get $32
      i32.const 3
      i32.add
      local.set $40
      local.get $39
      local.get $40
      i32.add
      i32.load8_u
      br $assembly/common/load8|inlined.11
     end
     i32.const 255
     i32.and
     i32.const 0
     i32.shl
     i32.or
     br $assembly/common/load32be|inlined.2
    end
    local.set $43
    local.get $41
    local.get $42
    i32.const 2
    i32.shl
    i32.add
    local.get $43
    i32.store
    global.get $assembly/common/wPtr
    local.set $55
    global.get $assembly/common/PARALLEL_FACTOR
    local.get $1
    i32.mul
    i32.const 3
    i32.add
    local.set $56
    block $assembly/common/load32be|inlined.3 (result i32)
     global.get $assembly/common/inputPtr
     local.set $44
     local.get $1
     i32.const 48
     i32.add
     local.set $45
     local.get $45
     i32.const 2
     i32.shl
     local.set $46
     block $assembly/common/load8|inlined.12 (result i32)
      local.get $44
      local.set $47
      local.get $46
      i32.const 0
      i32.add
      local.set $48
      local.get $47
      local.get $48
      i32.add
      i32.load8_u
      br $assembly/common/load8|inlined.12
     end
     i32.const 255
     i32.and
     i32.const 24
     i32.shl
     block $assembly/common/load8|inlined.13 (result i32)
      local.get $44
      local.set $49
      local.get $46
      i32.const 1
      i32.add
      local.set $50
      local.get $49
      local.get $50
      i32.add
      i32.load8_u
      br $assembly/common/load8|inlined.13
     end
     i32.const 255
     i32.and
     i32.const 16
     i32.shl
     i32.or
     block $assembly/common/load8|inlined.14 (result i32)
      local.get $44
      local.set $51
      local.get $46
      i32.const 2
      i32.add
      local.set $52
      local.get $51
      local.get $52
      i32.add
      i32.load8_u
      br $assembly/common/load8|inlined.14
     end
     i32.const 255
     i32.and
     i32.const 8
     i32.shl
     i32.or
     block $assembly/common/load8|inlined.15 (result i32)
      local.get $44
      local.set $53
      local.get $46
      i32.const 3
      i32.add
      local.set $54
      local.get $53
      local.get $54
      i32.add
      i32.load8_u
      br $assembly/common/load8|inlined.15
     end
     i32.const 255
     i32.and
     i32.const 0
     i32.shl
     i32.or
     br $assembly/common/load32be|inlined.3
    end
    local.set $57
    local.get $55
    local.get $56
    i32.const 2
    i32.shl
    i32.add
    local.get $57
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
  local.set $1
  loop $for-loop|0
   local.get $1
   i32.const 16
   global.get $assembly/common/PARALLEL_FACTOR
   i32.mul
   i32.lt_s
   if
    global.get $assembly/common/wPtr
    local.set $13
    local.get $1
    local.set $14
    block $assembly/common/load32be|inlined.4 (result i32)
     global.get $assembly/common/inputPtr
     local.set $2
     local.get $1
     local.set $3
     local.get $3
     i32.const 2
     i32.shl
     local.set $4
     block $assembly/common/load8|inlined.16 (result i32)
      local.get $2
      local.set $5
      local.get $4
      i32.const 0
      i32.add
      local.set $6
      local.get $5
      local.get $6
      i32.add
      i32.load8_u
      br $assembly/common/load8|inlined.16
     end
     i32.const 255
     i32.and
     i32.const 24
     i32.shl
     block $assembly/common/load8|inlined.17 (result i32)
      local.get $2
      local.set $7
      local.get $4
      i32.const 1
      i32.add
      local.set $8
      local.get $7
      local.get $8
      i32.add
      i32.load8_u
      br $assembly/common/load8|inlined.17
     end
     i32.const 255
     i32.and
     i32.const 16
     i32.shl
     i32.or
     block $assembly/common/load8|inlined.18 (result i32)
      local.get $2
      local.set $9
      local.get $4
      i32.const 2
      i32.add
      local.set $10
      local.get $9
      local.get $10
      i32.add
      i32.load8_u
      br $assembly/common/load8|inlined.18
     end
     i32.const 255
     i32.and
     i32.const 8
     i32.shl
     i32.or
     block $assembly/common/load8|inlined.19 (result i32)
      local.get $2
      local.set $11
      local.get $4
      i32.const 3
      i32.add
      local.set $12
      local.get $11
      local.get $12
      i32.add
      i32.load8_u
      br $assembly/common/load8|inlined.19
     end
     i32.const 255
     i32.and
     i32.const 0
     i32.shl
     i32.or
     br $assembly/common/load32be|inlined.4
    end
    local.set $15
    local.get $13
    local.get $14
    i32.const 2
    i32.shl
    i32.add
    local.get $15
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
    block $assembly/common/load32be|inlined.5 (result i32)
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
     block $assembly/common/load8|inlined.20 (result i32)
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
      br $assembly/common/load8|inlined.20
     end
     i32.const 255
     i32.and
     i32.const 24
     i32.shl
     block $assembly/common/load8|inlined.21 (result i32)
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
      br $assembly/common/load8|inlined.21
     end
     i32.const 255
     i32.and
     i32.const 16
     i32.shl
     i32.or
     block $assembly/common/load8|inlined.22 (result i32)
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
      br $assembly/common/load8|inlined.22
     end
     i32.const 255
     i32.and
     i32.const 8
     i32.shl
     i32.or
     block $assembly/common/load8|inlined.23 (result i32)
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
      br $assembly/common/load8|inlined.23
     end
     i32.const 255
     i32.and
     i32.const 0
     i32.shl
     i32.or
     br $assembly/common/load32be|inlined.5
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
 (func $~start
  call $start:assembly/index.simd
 )
)
