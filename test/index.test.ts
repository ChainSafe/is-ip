import { expect } from "chai";
import { parseIP, parseIPv4, parseIPv6, parseIPv4Mapped } from "../src/parse.js";
import { isIP, isIPv4, isIPv6 } from "../src/is-ip.js";

const validIPv4 = [
  {
    input: "0.0.0.0",
    output: Uint8Array.from([0, 0, 0, 0]),
  },
  {
    input: "127.0.0.1",
    output: Uint8Array.from([127, 0, 0, 1]),
  },
  {
    input: "10.0.0.1",
    output: Uint8Array.from([10, 0, 0, 1]),
  },
  {
    input: "192.168.0.1",
    output: Uint8Array.from([192, 168, 0, 1]),
  },
  {
    input: "255.255.255.255",
    output: Uint8Array.from([255, 255, 255, 255]),
  },
];

const invalidIPv4 = ["256.256.256.256", "0.0.0.0.0", "0.0.0.0 ", " 0.0.0.0", "1.1.l.1", "hahahahahaha", "1a.2.3.4"];

const validIPv6 = [
  {
    input: "1:2:3:4:5:6:7:8",
    output: Uint8Array.from([0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8]),
  },
  {
    input: "::1",
    output: Uint8Array.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]),
  },
  {
    input: "0000:0000:0000:0000:0000:0000:0000:0000",
    output: Uint8Array.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
  },
  {
    input: "0000:0000:0000:0000:0000:ffff:192.168.100.228",
    output: Uint8Array.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 192, 168, 100, 228]),
  },
  {
    input: "0000:0000:0000::0000:ffff:192.168.100.228",
    output: Uint8Array.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 192, 168, 100, 228]),
  },
  {
    input: "0000:0000:0000::192.168.100.228",
    output: Uint8Array.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 192, 168, 100, 228]),
  },
  {
    input: "2001:0dc5:72a3:0000:0000:802e:3370:73E4",
    output: Uint8Array.from([0x20, 1, 0x0d, 0xc5, 0x72, 0xa3, 0, 0, 0, 0, 0x80, 0x2e, 0x33, 0x70, 0x73, 0xe4]),
  },
  {
    input: "abcd:0000:0001:0002:0003:0004:0005:0006",
    output: Uint8Array.from([0xab, 0xcd, 0, 0, 0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6]),
  },
  {
    input: "abcd:0:1:2:3:4:5:6",
    output: Uint8Array.from([0xab, 0xcd, 0, 0, 0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6]),
  },
  {
    // IPv6 with a zone index - https://en.wikipedia.org/wiki/IPv6_address#Scoped_literal_IPv6_addresses_(with_zone_index)
    input: "fe80::8cb1:25ff:fec5:28e3%llw0",
    output: Uint8Array.from([0xfe, 0x80, 0, 0, 0, 0, 0, 0, 0x8c, 0xb1, 0x25, 0xff, 0xfe, 0xc5, 0x28, 0xe3]),
  },
];

const invalidIPv6 = [
  "0000:0000:0000:0000:0000:0000:0000:00000",
  "1.2.3.4::1",
  "1::1.2.3.4::1",
  "1::::1",
  "2001:0dc5:72a3:0000::0000:802e:3370:73E4",
  "0000:0000:0000:0000:0000:0000:ffff:192.168.100.228",
];

describe("parseIPv4", () => {
  it("should return on valid IPv4 strings", () => {
    for (const { input, output } of validIPv4) {
      expect(parseIPv4(input)).to.deep.equal(output);
      expect(isIPv4(input)).to.equal(true);
    }
  });

  it("should throw on invalid IPv4 strings", () => {
    for (const input of invalidIPv4) {
      expect(parseIPv4(input)).to.equal(undefined);
      expect(isIPv4(input)).to.equal(false);
    }
  });
});

describe("parseIPv6", () => {
  it("should return on valid IPv6 strings", () => {
    for (const { input, output } of validIPv6) {
      expect(parseIPv6(input)).to.deep.equal(output);
      expect(isIPv6(input)).to.equal(true);
    }
  });

  it("should throw on invalid IPv6 strings", () => {
    for (const input of invalidIPv6) {
      expect(parseIPv6(input)).to.equal(undefined);
      expect(isIPv6(input)).to.equal(false);
    }
  });
});

describe("parse IPv4 as IPv4-mapped IPv6 address", () => {
  it("should return an IPv4-mapped address", () => {
    const testCase = [
      {
        input: "1.2.3.4",
        output: Uint8Array.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0xff, 0xff, 1, 2, 3, 4]),
      },
    ];
    for (const { input, output } of testCase) {
      const r = parseIPv4Mapped(input);
      if (r === undefined) {
        throw new Error("undefined address");
      }

      expect(r).to.deep.equal(output);
    }
  });
});

describe("parseIP", () => {
  it("should return on valid IP strings", () => {
    for (const { input, output } of [...validIPv4, ...validIPv6]) {
      expect(parseIP(input)).to.deep.equal(output);
      expect(isIP(input)).to.equal(true);
    }
  });

  it("should return on valid IP strings when mapping IPv4", () => {
    for (const { input, output } of [...validIPv4]) {
      expect(parseIP(input)).to.deep.equal(output);
      expect(isIP(input)).to.equal(true);
    }
  });

  it("should throw on invalid IP strings", () => {
    for (const input of [...invalidIPv4, ...invalidIPv6]) {
      expect(parseIP(input)).to.equal(undefined);
      expect(isIP(input)).to.equal(false);
    }
  });

  it("should throw on invalid IP strings when mapping IPv4", () => {
    for (const input of [...invalidIPv4, ...invalidIPv6]) {
      expect(parseIP(input, true)).to.equal(undefined);
      expect(isIP(input)).to.equal(false);
    }
  });
});
