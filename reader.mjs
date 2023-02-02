import Hyperswarm from "hyperswarm";
import Hypercore from "hypercore";
import goodbye from "graceful-goodbye";
import b4a from "b4a";


const swarm = new Hyperswarm();
goodbye(() => swarm.destroy());
// , process.argv[2]
const core = new Hypercore("./writer-storage", { valueEncoding: "json" })
await core.ready();

console.log("block length:", core.length);

const foundPeers = core.findingPeers();
const tempKey = b4a.alloc(32).fill("game-room-002")
swarm.join(tempKey);
swarm.on("connection", (conn) => {
    console.log("swarm connected")
  core.replicate(conn);
});

swarm.flush().then(() => foundPeers());
await core.update();

let position = core.length;
console.log(`Skipping ${core.length} earlier blocks...`);
for await (const block of core.createReadStream({
  start: core.length,
  live: true,
})) {
  console.log(`Block ${position++}: ${block}`);
}
