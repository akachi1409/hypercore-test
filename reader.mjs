import Hyperswarm from 'hyperswarm'
import Hypercore from 'hypercore'
import goodbye from 'graceful-goodbye'

const swarm = new Hyperswarm()
goodbye(()=> swarm.destroy())

const core = new Hypercore('./reader-storage', process.argv[2])
await core.ready();

const foundPeers = core.findingPeers();
swarm.join(core.discoveryKey);
swarm.on('connection', conn => core.replicate(conn));

swarm.flush().then(()=> foundPeers());

await core.update();

let position = core.length;
console.log(`Skipping ${core.length} earlier blocks...`);
for await (const block of core.createReadStream({start: core.length, live:true})){
    console.log(`Block ${position++}: ${block}`)
}