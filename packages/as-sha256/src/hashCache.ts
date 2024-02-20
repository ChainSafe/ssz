import { HashObject } from "./hashObject";

export const HASH_SIZE = 32;
export const CACHE_HASH_SIZE = 32768;
export const CACHE_BYTE_SIZE = CACHE_HASH_SIZE * HASH_SIZE;

export type HashCache = {
  cache: Uint8Array;
  used: Set<number>;
  next: number;
};

/**
 * A unique identifier for a hash in a cache.
 *
 *
 * The `cacheIndex` is the index of the cache in the `hashCaches` array.
 * The `hashIndex` is the index of the hash in the cache.
 */
export type HashId = number;

export function toHashId(cacheIndex: number, hashIndex: number): HashId {
  return (cacheIndex << 16) | hashIndex;
}

export function fromHashId(id: HashId): [number, number] {
  return [id >> 16, id & 0xffff];
}

export function getCacheIndex(id: HashId): number {
  return id >> 16;
}

export function getHashIndex(id: HashId): number {
  return id & 0xffff;
}

const hashCaches: HashCache[] = [];

export function allocHashCache(): HashCache {
  const cache = new Uint8Array(CACHE_BYTE_SIZE);
  const used = new Set<number>();
  const next = 0;
  const out = {cache, used, next};
  hashCaches.push(out);
  return out;
}

export function getCache(id: HashId): HashCache {
  return hashCaches[getCacheIndex(id)];
}

export function getCacheOffset(id: HashId): number {
  return getHashIndex(id) * HASH_SIZE;
}

export function incrementNext(cache: HashCache): number {
  const out = cache.next;
  cache.used.add(out);
  // eslint-disable-next-line no-empty
  while (cache.used.has(++cache.next)) {}
  return out;
}

export function newHashId(cacheIndex: number, cache: HashCache): HashId {
  const hashIndex = incrementNext(cache);
  return toHashId(cacheIndex, hashIndex);
}

export function allocHashId(): HashId {
  const cachesLength = hashCaches.length;
  for (let i = 0; i < cachesLength; i++) {
    const cache = hashCaches[i];
    if (cache.next < CACHE_HASH_SIZE) {
      return newHashId(i, cache);
    }
  }
  const cache = allocHashCache();
  return newHashId(cachesLength, cache);
}

export function freeHashId(id: HashId): void {
  const [cacheIndex, hashIndex] = fromHashId(id);
  hashCaches[cacheIndex].used.delete(hashIndex);
  if (hashCaches[cacheIndex].next > hashIndex) {
    hashCaches[cacheIndex].next = hashIndex;
  }
}

export function cloneHashId(source: HashId, target: HashId): void {
  const {cache: cacheSource} = getCache(source);
  let offsetSource = getCacheOffset(source);
  const {cache: cacheTarget} = getCache(target);
  let offsetTarget = getCacheOffset(target);

  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
  cacheTarget[offsetTarget++] = cacheSource[offsetSource++];
}

export function getHash(id: HashId): Uint8Array {
  const [cacheIndex, hashIndex] = fromHashId(id);
  const cache = hashCaches[cacheIndex];
  const offset = hashIndex * HASH_SIZE;
  return cache.cache.subarray(offset, offset + HASH_SIZE);
}

export function getHashObject(id: HashId): HashObject {
  const {cache} = getCache(id);
  let offset = getCacheOffset(id);

  return {
    h0: cache[offset++] + (cache[offset++] << 8) + (cache[offset++] << 16) + (cache[offset++] << 24),
    h1: cache[offset++] + (cache[offset++] << 8) + (cache[offset++] << 16) + (cache[offset++] << 24),
    h2: cache[offset++] + (cache[offset++] << 8) + (cache[offset++] << 16) + (cache[offset++] << 24),
    h3: cache[offset++] + (cache[offset++] << 8) + (cache[offset++] << 16) + (cache[offset++] << 24),
    h4: cache[offset++] + (cache[offset++] << 8) + (cache[offset++] << 16) + (cache[offset++] << 24),
    h5: cache[offset++] + (cache[offset++] << 8) + (cache[offset++] << 16) + (cache[offset++] << 24),
    h6: cache[offset++] + (cache[offset++] << 8) + (cache[offset++] << 16) + (cache[offset++] << 24),
    h7: cache[offset++] + (cache[offset++] << 8) + (cache[offset++] << 16) + (cache[offset++] << 24),
  };
}

export function setHashObject(id: HashId, obj: HashObject): void {
  const {cache} = getCache(id);
  let offset = getCacheOffset(id);

  cache[offset++] = obj.h0 & 0xff;
  cache[offset++] = (obj.h0 >> 8) & 0xff;
  cache[offset++] = (obj.h0 >> 16) & 0xff;
  cache[offset++] = (obj.h0 >> 24) & 0xff;
  cache[offset++] = obj.h1 & 0xff;
  cache[offset++] = (obj.h1 >> 8) & 0xff;
  cache[offset++] = (obj.h1 >> 16) & 0xff;
  cache[offset++] = (obj.h1 >> 24) & 0xff;
  cache[offset++] = obj.h2 & 0xff;
  cache[offset++] = (obj.h2 >> 8) & 0xff;
  cache[offset++] = (obj.h2 >> 16) & 0xff;
  cache[offset++] = (obj.h2 >> 24) & 0xff;
  cache[offset++] = obj.h3 & 0xff;
  cache[offset++] = (obj.h3 >> 8) & 0xff;
  cache[offset++] = (obj.h3 >> 16) & 0xff;
  cache[offset++] = (obj.h3 >> 24) & 0xff;
  cache[offset++] = obj.h4 & 0xff;
  cache[offset++] = (obj.h4 >> 8) & 0xff;
  cache[offset++] = (obj.h4 >> 16) & 0xff;
  cache[offset++] = (obj.h4 >> 24) & 0xff;
  cache[offset++] = obj.h5 & 0xff;
  cache[offset++] = (obj.h5 >> 8) & 0xff;
  cache[offset++] = (obj.h5 >> 16) & 0xff;
  cache[offset++] = (obj.h5 >> 24) & 0xff;
  cache[offset++] = obj.h6 & 0xff;
  cache[offset++] = (obj.h6 >> 8) & 0xff;
  cache[offset++] = (obj.h6 >> 16) & 0xff;
  cache[offset++] = (obj.h6 >> 24) & 0xff;
  cache[offset++] = obj.h7 & 0xff;
  cache[offset++] = (obj.h7 >> 8) & 0xff;
  cache[offset++] = (obj.h7 >> 16) & 0xff;
  cache[offset++] = (obj.h7 >> 24) & 0xff;
}

export function setHashObjectItems(
  id: HashId,
  h0: number,
  h1: number,
  h2: number,
  h3: number,
  h4: number,
  h5: number,
  h6: number,
  h7: number
): void {
  const {cache} = getCache(id);
  let offset = getCacheOffset(id);

  cache[offset++] = h0 & 0xff;
  cache[offset++] = (h0 >> 8) & 0xff;
  cache[offset++] = (h0 >> 16) & 0xff;
  cache[offset++] = (h0 >> 24) & 0xff;
  cache[offset++] = h1 & 0xff;
  cache[offset++] = (h1 >> 8) & 0xff;
  cache[offset++] = (h1 >> 16) & 0xff;
  cache[offset++] = (h1 >> 24) & 0xff;
  cache[offset++] = h2 & 0xff;
  cache[offset++] = (h2 >> 8) & 0xff;
  cache[offset++] = (h2 >> 16) & 0xff;
  cache[offset++] = (h2 >> 24) & 0xff;
  cache[offset++] = h3 & 0xff;
  cache[offset++] = (h3 >> 8) & 0xff;
  cache[offset++] = (h3 >> 16) & 0xff;
  cache[offset++] = (h3 >> 24) & 0xff;
  cache[offset++] = h4 & 0xff;
  cache[offset++] = (h4 >> 8) & 0xff;
  cache[offset++] = (h4 >> 16) & 0xff;
  cache[offset++] = (h4 >> 24) & 0xff;
  cache[offset++] = h5 & 0xff;
  cache[offset++] = (h5 >> 8) & 0xff;
  cache[offset++] = (h5 >> 16) & 0xff;
  cache[offset++] = (h5 >> 24) & 0xff;
  cache[offset++] = h6 & 0xff;
  cache[offset++] = (h6 >> 8) & 0xff;
  cache[offset++] = (h6 >> 16) & 0xff;
  cache[offset++] = (h6 >> 24) & 0xff;
  cache[offset++] = h7 & 0xff;
  cache[offset++] = (h7 >> 8) & 0xff;
  cache[offset++] = (h7 >> 16) & 0xff;
  cache[offset++] = (h7 >> 24) & 0xff;
}

export function setHash(id: HashId, hash: Uint8Array): void {
  const {cache} = getCache(id);
  const offset = getCacheOffset(id);
  cache.set(hash, offset);
}
