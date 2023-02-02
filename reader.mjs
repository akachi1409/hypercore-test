import Hyperswarm from "hyperswarm";
import Hypercore from "hypercore";
import goodbye from "graceful-goodbye";

const swarm = new Hyperswarm();
goodbye(() => swarm.destroy());
// , process.argv[2]
const core = new Hypercore("/Hyperbee-books");
await core.ready();
console.log("block length:", core.length);

console.log("discory key:", process.argv[2])
const foundPeers = core.findingPeers();
swarm.join(process.argv[2]);
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
