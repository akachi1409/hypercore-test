import Hyperswarm from "hyperswarm";
import Hypercore from "hypercore";
import goodbye from "graceful-goodbye";
import b4a from "b4a";

const swarm = new Hyperswarm();
goodbye(() => swarm.destroy());

const core = new Hypercore("./writer-storage", { valueEncoding: "json" });

await core.ready();
console.log("hypercore key:", b4a.toString(core.key, "hex"));
console.log("core length:", core.length);
process.stdin.on('data', data=> core.append(data));
// const firstBlock = await core.get(0, { valueEncoding: "json" });
// console.log("first block:", firstBlock);

const tempKey = b4a.alloc(32).fill("game-room-002")
swarm.join(tempKey);
swarm.on("connection", (conn) => {
  console.log("connected in mjs");
  core.replicate(conn);
});
