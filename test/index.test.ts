import { expect } from "chai";
import { parseIPv4, parseIPv6 } from "../src/index.js";

describe("parseIPv4", () => {
  it("should return on valid IPv4 strings", () => {
    for (const { input, output } of [
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
    ]) {
      try {
        expect(parseIPv4(input)).to.deep.equal(output);
      } catch (e) {
        expect.fail(`${input}: ${(e as Error).message}`);
      }
    }
  });

  it("should throw on invalid IPv4 strings", () => {
    for (const input of [
      "256.256.256.256",
      "0.0.0.0.0",
      "0.0.0.0 ",
      " 0.0.0.0",
      "1.1.l.1",
      "hahahahahaha",
      "1a.2.3.4",
    ]) {
      try {
        parseIPv4(input);
        expect.fail(input);
      } catch (e) {
        if ((e as Error).message === input) {
          throw e;
        }
      }
    }
  });
});

describe("parseIPv6", () => {
  it("should return on valid IPv6 strings", () => {
    for (const { input, output } of [
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
    ]) {
      try {
        expect(parseIPv6(input)).to.deep.equal(output);
      } catch (e) {
        expect.fail(`${input}: ${(e as Error).message}`);
      }
    }
  });

  it("should throw on invalid IPv6 strings", () => {
    for (const input of [
      "0000:0000:0000:0000:0000:0000:0000:00000",
      "1.2.3.4::1",
      "1::1.2.3.4::1",
      "1::::1",
      "2001:0dc5:72a3:0000::0000:802e:3370:73E4",
      "0000:0000:0000:0000:0000:0000:ffff:192.168.100.228",
    ]) {
      try {
        parseIPv6(input);
        expect.fail(input);
        // eslint-disable-next-line no-empty
      } catch (e) {
        if ((e as Error).message === input) {
          throw e;
        }
      }
    }
  });
});
