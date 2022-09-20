import { RollsAndResults } from "./rolls-and-results";

export class CalculatedRaises extends RollsAndResults {
  sets;
  raises;
  remainders;
  results;
  rolls;

  constructor(dice, props, logger = true) {
    super(dice, props, logger);

    const calculation = this.calculateRaises();
    this.sets = calculation.sets;
    this.raises =
      this.base === 10 ? calculation.sets.length : calculation.sets.length * 2;
    this.remainders = calculation.remainders;
  }

  calculateRaises(rolls = this.results, raises: number[][] = []) {
    rolls.sort((a, b) => b - a);
    super.log(`modified rolls: ${rolls.join()}`);
    // remove tens
    if (this.base === 10) {
      rolls.forEach((roll) => {
        if (roll === 10) {
          raises.push([10]);
        }
      });
      rolls = rolls.slice(raises.length);
    }
    return this.makeSets(rolls, raises);
  }

  makeSets(rolls: number[], raises: number[][] = [], count = 1) {
    super.log(`rolls: ${rolls.join()}`);
    if (rolls.length > count) {
      super.log(`have enough rolls (${rolls.length}) to try make sets`);
      const high = rolls[0];
      let modifier = rolls[rolls.length - count];
      let usedRolls = [modifier];
      let usedIndexes = [rolls.length - count];
      if (high + modifier < this.base) {
        // try adding last [count] together
        modifier = 0;
        usedRolls = [];
        usedIndexes = [];
        let i = rolls.length - 1;
        let j = 0;
        while (i > 0 && j < count) {
          modifier += rolls[i];
          usedRolls.push(rolls[i]);
          usedIndexes.push(i);
          --i;
          ++j;
        }
      }
      if (high + modifier >= this.base) {
        super.log(`using highest and lowest ${count} make a set!`);
        raises.push([high, ...usedRolls.sort()]);
        rolls = rolls
          .slice(1)
          .filter((_, index) => !usedIndexes.includes(index + 1));
        super.log(
          `remaining rolls: ${rolls.join()}, 
          raises: ${raises.join()}`
        );
        count = 1;
        return this.makeSets(rolls, raises, count);
      } else {
        super.log(`highest and lowest ${count} don't make a set...`);
        ++count;
        return this.makeSets(rolls, raises, count);
      }
    }
    return {
      remainders: rolls,
      sets: raises,
    };
  }
}
