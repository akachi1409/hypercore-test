import Hyperswarm from 'hyperswarm';
import Hypercore from 'hypercore';
import goodbye from 'graceful-bye';
import b4a from 'b4a';

const swarm = new Hyperswarm();
goodbye(()=> swarm.destroy());

const core = new Hypercore('./writer-storage');

await core.ready();
console.log("hypercore key:", b4a.toString(core.key, 'hex'));

process.stdin.on('data', data=> core.append(data));

swarm.join(core.discoveryKey);
swarm.on('connection', conn => core.replicate(conn));