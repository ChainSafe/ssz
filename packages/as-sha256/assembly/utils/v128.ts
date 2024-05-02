/**
 * Cannot store v128 to memory with non-constant index, otherwise get error:
 * "ERROR AS220: Expression must be a compile-time constant."
 */
@inline
export function setV128(ptr: usize, i: i32, v: v128): void {
  switch(i) {
    case 0:
      v128.store(ptr, v, 0);
      break;
    case 1:
      v128.store(ptr, v, 16);
      break;
    case 2:
      v128.store(ptr, v, 32);
      break;
    case 3:
      v128.store(ptr, v, 48);
      break;
    case 4:
      v128.store(ptr, v, 64);
      break;
    case 5:
      v128.store(ptr, v, 80);
      break;
    case 6:
      v128.store(ptr, v, 96);
      break;
    case 7:
      v128.store(ptr, v, 112);
      break;
    case 8:
      v128.store(ptr, v, 128);
      break;
    case 9:
      v128.store(ptr, v, 144);
      break;
    case 10:
      v128.store(ptr, v, 160);
      break;
    case 11:
      v128.store(ptr, v, 176);
      break;
    case 12:
      v128.store(ptr, v, 192);
      break;
    case 13:
      v128.store(ptr, v, 208);
      break;
    case 14:
      v128.store(ptr, v, 224);
      break;
    case 15:
      v128.store(ptr, v, 240);
      break;
    case 16:
      v128.store(ptr, v, 256);
      break;
    case 17:
      v128.store(ptr, v, 272);
      break;
    case 18:
      v128.store(ptr, v, 288);
      break;
    case 19:
      v128.store(ptr, v, 304);
      break;
    case 20:
      v128.store(ptr, v, 320);
      break;
    case 21:
      v128.store(ptr, v, 336);
      break;
    case 22:
      v128.store(ptr, v, 352);
      break;
    case 23:
      v128.store(ptr, v, 368);
      break;
    case 24:
      v128.store(ptr, v, 384);
      break;
    case 25:
      v128.store(ptr, v, 400);
      break;
    case 26:
      v128.store(ptr, v, 416);
      break;
    case 27:
      v128.store(ptr, v, 432);
      break;
    case 28:
      v128.store(ptr, v, 448);
      break;
    case 29:
      v128.store(ptr, v, 464);
      break;
    case 30:
      v128.store(ptr, v, 480);
      break;
    case 31:
      v128.store(ptr, v, 496);
      break;
    case 32:
      v128.store(ptr, v, 512);
      break;
    case 33:
      v128.store(ptr, v, 528);
      break;
    case 34:
      v128.store(ptr, v, 544);
      break;
    case 35:
      v128.store(ptr, v, 560);
      break;
    case 36:
      v128.store(ptr, v, 576);
      break;
    case 37:
      v128.store(ptr, v, 592);
      break;
    case 38:
      v128.store(ptr, v, 608);
      break;
    case 39:
      v128.store(ptr, v, 624);
      break;
    case 40:
      v128.store(ptr, v, 640);
      break;
    case 41:
      v128.store(ptr, v, 656);
      break;
    case 42:
      v128.store(ptr, v, 672);
      break;
    case 43:
      v128.store(ptr, v, 688);
      break;
    case 44:
      v128.store(ptr, v, 704);
      break;
    case 45:
      v128.store(ptr, v, 720);
      break;
    case 46:
      v128.store(ptr, v, 736);
      break;
    case 47:
      v128.store(ptr, v, 752);
      break;
    case 48:
      v128.store(ptr, v, 768);
      break;
    case 49:
      v128.store(ptr, v, 784);
      break;
    case 50:
      v128.store(ptr, v, 800);
      break;
    case 51:
      v128.store(ptr, v, 816);
      break;
    case 52:
      v128.store(ptr, v, 832);
      break;
    case 53:
      v128.store(ptr, v, 848);
      break;
    case 54:
      v128.store(ptr, v, 864);
      break;
    case 55:
      v128.store(ptr, v, 880);
      break;
    case 56:
      v128.store(ptr, v, 896);
      break;
    case 57:
      v128.store(ptr, v, 912);
      break;
    case 58:
      v128.store(ptr, v, 928);
      break;
    case 59:
      v128.store(ptr, v, 944);
      break;
    case 60:
      v128.store(ptr, v, 960);
      break;
    case 61:
      v128.store(ptr, v, 976);
      break;
    case 62:
      v128.store(ptr, v, 992);
      break;
    case 63:
      v128.store(ptr, v, 1008);
      break;
    default:
      throw new Error(`setV128: expect i from 0 to 63, got ${i}`);
  }
}

/**
 * Cannot load v128 from memory with non-constant index, otherwise get error:
 * "ERROR AS220: Expression must be a compile-time constant."
 */
@inline
export function getV128(ptr: usize, i: i32): v128 {
  switch (i) {
    case 0:
      return v128.load(ptr, 0);
    case 1:
      return v128.load(ptr, 16);
    case 2:
      return v128.load(ptr, 32);
    case 3:
      return v128.load(ptr, 48);
    case 4:
      return v128.load(ptr, 64);
    case 5:
      return v128.load(ptr, 80);
    case 6:
      return v128.load(ptr, 96);
    case 7:
      return v128.load(ptr, 112);
    case 8:
      return v128.load(ptr, 128);
    case 9:
      return v128.load(ptr, 144);
    case 10:
      return v128.load(ptr, 160);
    case 11:
      return v128.load(ptr, 176);
    case 12:
      return v128.load(ptr, 192);
    case 13:
      return v128.load(ptr, 208);
    case 14:
      return v128.load(ptr, 224);
    case 15:
      return v128.load(ptr, 240);
    case 16:
      return v128.load(ptr, 256);
    case 17:
      return v128.load(ptr, 272);
    case 18:
      return v128.load(ptr, 288);
    case 19:
      return v128.load(ptr, 304);
    case 20:
      return v128.load(ptr, 320);
    case 21:
      return v128.load(ptr, 336);
    case 22:
      return v128.load(ptr, 352);
    case 23:
      return v128.load(ptr, 368);
    case 24:
      return v128.load(ptr, 384);
    case 25:
      return v128.load(ptr, 400);
    case 26:
      return v128.load(ptr, 416);
    case 27:
      return v128.load(ptr, 432);
    case 28:
      return v128.load(ptr, 448);
    case 29:
      return v128.load(ptr, 464);
    case 30:
      return v128.load(ptr, 480);
    case 31:
      return v128.load(ptr, 496);
    case 32:
      return v128.load(ptr, 512);
    case 33:
      return v128.load(ptr, 528);
    case 34:
      return v128.load(ptr, 544);
    case 35:
      return v128.load(ptr, 560);
    case 36:
      return v128.load(ptr, 576);
    case 37:
      return v128.load(ptr, 592);
    case 38:
      return v128.load(ptr, 608);
    case 39:
      return v128.load(ptr, 624);
    case 40:
      return v128.load(ptr, 640);
    case 41:
      return v128.load(ptr, 656);
    case 42:
      return v128.load(ptr, 672);
    case 43:
      return v128.load(ptr, 688);
    case 44:
      return v128.load(ptr, 704);
    case 45:
      return v128.load(ptr, 720);
    case 46:
      return v128.load(ptr, 736);
    case 47:
      return v128.load(ptr, 752);
    case 48:
      return v128.load(ptr, 768);
    case 49:
      return v128.load(ptr, 784);
    case 50:
      return v128.load(ptr, 800);
    case 51:
      return v128.load(ptr, 816);
    case 52:
      return v128.load(ptr, 832);
    case 53:
      return v128.load(ptr, 848);
    case 54:
      return v128.load(ptr, 864);
    case 55:
      return v128.load(ptr, 880);
    case 56:
      return v128.load(ptr, 896);
    case 57:
      return v128.load(ptr, 912)
    case 58:
      return v128.load(ptr, 928);
    case 59:
      return v128.load(ptr, 944);
    case 60:
      return v128.load(ptr, 960);
    case 61:
      return v128.load(ptr, 976);
    case 62:
      return v128.load(ptr, 992);
    case 63:
      return v128.load(ptr, 1008);
    default:
      throw new Error(`getV128: expect i from 0 to 63, got ${i}`);
  }
}