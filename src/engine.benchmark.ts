import Engine from "./engine";
import { useSeed } from "./helpers";

useSeed();

const t = +new Date();

const engine = new Engine([50, 50], 60, 20, {
  fish: {
    breedTime: 10,
  },
  shark: {
    startingEnergy: 40,
    energyBonus: 20,
    breedEnergy: 320,
  },
});

let stats = engine.getBoardStats();
let i = 0;
while (stats.fish !== 0 && stats.shark !== 0) {
  i++;
  engine.nextState();
  stats = engine.getBoardStats();
}
console.log((+new Date() - t) / 1000);
console.log(stats);
console.log(i);

/**
 * (dev mode)
 * 12.047s / 330 - starting
 *  0.189s / 282 - mutate board + use arrays with numbers instead of objects for cells + fast random
 */
