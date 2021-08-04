/**
 * Pass 8 numbers in an object and set that to inputArray.
 * This function contains multiple same procedures but we intentionally
 * do it step by step to improve performance a bit.
 **/
 export function objToByteArr(obj, byteArr, offset) {
  let tmp;
  for (let index = 0; index < 8; index++) {
    switch (index) {
      case 0:
        tmp = obj.h0;
        break;
      case 1:
        tmp = obj.h1;
        break;
      case 2:
        tmp = obj.h2;
        break;
      case 3:
        tmp = obj.h3;
        break;
      case 4:
        tmp = obj.h4;
        break;
      case 5:
        tmp = obj.h5;
        break;
      case 6:
        tmp = obj.h6;
        break;
      case 7:
        tmp = obj.h7;
        break;
    }
    for (let byte = 0; byte < 4; byte++) {
      byteArr[index * 4 + byte + offset] = tmp & 0xff;
      if (byte < 3) tmp = tmp >> 8;
    }
  }
}

/**
 * Parse outputArray into an object of 8 numbers.
 * This is the order that makes Uint32Array the same to Uint8Array
 * This function contains multiple same procedures but we intentionally
 * do it step by step to improve performance a bit.
 **/
export function byteArrToObj(byteArr) {
  let h0, h1, h2, h3, h4, h5, h6, h7;

  for (let index = 0; index < 8; index++) {
    let tmp = 0;
    // 4 byte = 1 number
    for (let byte = 0; byte < 4; byte++) {
      tmp |= byteArr[index * 4 + (3 - byte)] & 0xff;
      if (byte < 3) tmp = tmp << 8;
    }
    switch(index) {
      case 0:
        h0 = tmp;
        break;
      case 1:
        h1 = tmp;
        break;
      case 2:
        h2 = tmp;
        break;
      case 3:
        h3 = tmp;
        break;
      case 4:
        h4 = tmp;
        break;
      case 5:
        h5 = tmp;
        break;
      case 6:
        h6 = tmp;
        break;
      case 7:
        h7 = tmp;
        break;
    }
  }
  return {
    h0,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    h7,
  };;
}