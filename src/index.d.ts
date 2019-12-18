
export function initSha256(): Promise<void>;

/**
 * Wraps the AssemblyScript build in a JS function.
 * This allows users to not have to make AS a dependency in their project.
 * @param {Uint8Array} message Message to hash
 */
export function sha256(message: Uint8Array): Uint8Array;

export declare function clean(): void;

export declare function init(): void;

export declare function update(data: Uint8Array, length: number): void;

export declare function digest(): Uint8Array;

export default sha256;