import { itBench } from "@dapplion/benchmark";
import * as ours from "../src/is-ip.js";
import * as net from "node:net";
import * as isIpLib from "is-ip";

const ipv4s = [
  "0.0.0.0",
  "192.168.0.1",
  "255.255.255.255",
  "0.0f.0.0",
  "hahahahah",
  "999.0.0.0",
  "0000.0000.0000.0000",
];

const ipv6s = [
  "1:2:3:4:5:6:7:8",
  "::1",
  "0000:0000:0000:0000:0000:0000:0000:0000",
  "0000:0000:0000:0000:0000:ffff:192.168.100.228",
  "2001:0dc5:72a3:0000:0000:802e:3370:73E4",
  "hahahahahahaha",
  "0000.0000:0000.0000",
];

describe("isIPv4", async function () {
  this.timeout(5000);
  for (const { name, fn } of [
    {
      name: "ours.isIPv4",
      fn: ours.isIPv4,
    },
    {
      name: "net.isIPv4",
      fn: net.isIPv4,
    },
    {
      name: "isIpLib.isIPv4",
      fn: isIpLib.isIPv4,
    },
  ]) {
    for (const ipStr of ipv4s) {
      itBench(`${name}("${ipStr}")`, () => fn(ipStr));
    }
  }
});

describe("isIPv6", async function () {
  this.timeout(10000);
  for (const { name, fn } of [
    {
      name: "ours.isIPv6",
      fn: ours.isIPv6,
    },
    {
      name: "net.isIPv6",
      fn: net.isIPv6,
    },
    {
      name: "isIpLib.isIPv6",
      fn: isIpLib.isIPv6,
    },
  ]) {
    for (const ipStr of ipv6s) {
      itBench(`${name}("${ipStr}")`, () => fn(ipStr));
    }
  }
});

describe("isIP", async function () {
  this.timeout(10000);
  for (const { name, fn } of [
    {
      name: "ours.isIP",
      fn: ours.isIP,
    },
    {
      name: "net.isIP",
      fn: net.isIP,
    },
    {
      name: "isIpLib.isIP",
      fn: isIpLib.isIP,
    },
  ]) {
    for (const ipStr of [...ipv4s, ...ipv6s]) {
      itBench(`${name}("${ipStr}")`, () => fn(ipStr));
    }
  }
});
