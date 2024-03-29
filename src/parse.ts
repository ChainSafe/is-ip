import { Parser } from "./parser.js";

// See https://stackoverflow.com/questions/166132/maximum-length-of-the-textual-representation-of-an-ipv6-address
const MAX_IPV6_LENGTH = 45;
const MAX_IPV4_LENGTH = 15;

const parser = new Parser();

/** Parse `input` into IPv4 bytes. */
export function parseIPv4(input: string): Uint8Array | undefined {
  if (input.length > MAX_IPV4_LENGTH) {
    return undefined;
  }
  return parser.new(input).parseWith(() => parser.readIPv4Addr());
}

/** Parse `input` into IPv6 bytes. */
export function parseIPv6(input: string): Uint8Array | undefined {
  // strip zone index if it is present
  if (input.includes("%")) {
    input = input.split("%")[0];
  }
  if (input.length > MAX_IPV6_LENGTH) {
    return undefined;
  }
  return parser.new(input).parseWith(() => parser.readIPv6Addr());
}

/** Parse `input` into IPv4 or IPv6 bytes. */
export function parseIP(input: string): Uint8Array | undefined {
  // strip zone index if it is present
  if (input.includes("%")) {
    input = input.split("%")[0];
  }
  if (input.length > MAX_IPV6_LENGTH) {
    return undefined;
  }
  return parser.new(input).parseWith(() => parser.readIPAddr());
}
