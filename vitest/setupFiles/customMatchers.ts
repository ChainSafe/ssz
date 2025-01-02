import {expect} from "vitest";

expect.extend({
  toBeWithMessage(received: unknown, expected: unknown, message: string) {
    if (Object.is(received, expected)) {
      return {
        message: () => "Received value is the same as expected value",
        pass: true,
      };
    }

    return {
      pass: false,
      message: () => message,
      actual: received,
      expected,
    };
  },
  toEqualWithMessage(received: unknown, expected: unknown, message: string) {
    if (this.equals(received, expected)) {
      return {
        message: () => "Received value equals expected value",
        pass: true,
      };
    }

    return {
      pass: false,
      message: () => message,
      actual: received,
      expected,
    };
  },
});
