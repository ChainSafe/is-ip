import { Parser, err } from "./parser.js";

// See https://stackoverflow.com/questions/166132/maximum-length-of-the-textual-representation-of-an-ipv6-address
const MAX_IPV6_LENGTH = 45;
const MAX_IPV4_LENGTH = 15;

const parser = new Parser();

/** Parse `input` into IPv4 bytes. */
export function parseIPv4(input: string): Uint8Array {
  if (input.length > MAX_IPV4_LENGTH) {
    throw err;
  }
  return parser.new(input).parseWith(() => parser.readIPv4Addr());
}

/** Parse `input` into IPv6 bytes. */
export function parseIPv6(input: string): Uint8Array {
  if (input.length > MAX_IPV6_LENGTH) {
    throw err;
  }
  return parser.new(input).parseWith(() => parser.readIPv6Addr());
}

/** Parse `input` into IPv4 or IPv6 bytes. */
export function parseIP(input: string): Uint8Array {
  if (input.length > MAX_IPV6_LENGTH) {
    throw err;
  }
  return parser.new(input).parseWith(() => parser.readIPAddr());
}

/** Check if `input` is IPv4. */
export function isIPv4(input: string): boolean {
  try {
    parseIPv4(input);
    return true;
  } catch (e) {
    return false;
  }
}

/** Check if `input` is IPv6. */
export function isIPv6(input: string): boolean {
  try {
    parseIPv6(input);
    return true;
  } catch (e) {
    return false;
  }
}

/** Check if `input` is IPv4 or IPv6. */
export function isIP(input: string): boolean {
  try {
    parseIP(input);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * @returns `6` if `input` is IPv6, `4` if `input` is IPv4, or `undefined` if `input` is neither.
 */
export function ipVersion(input: string): 4 | 6 | undefined {
  if (isIPv4(input)) {
    return 4;
  } else if (isIPv6(input)) {
    return 6;
  } else {
    return undefined;
  }
}
