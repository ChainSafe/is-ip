import { isIPv4, isIPv6, isIP as ipVersion } from "node:net";

export { isIPv4, isIPv6, ipVersion };

/** Check if `input` is IPv4 or IPv6. */
export function isIP(input: string): boolean {
  return Boolean(ipVersion(input));
}
