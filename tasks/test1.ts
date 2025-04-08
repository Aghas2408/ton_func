import { Address } from "ton-core";
const raw = "a3935861f79daf59a13d6d182e1640210c02f98e3df18fda74b8f5ab141abf18";

const friendly = new Address(0, Buffer.from(raw, "hex"));
console.log(friendly);