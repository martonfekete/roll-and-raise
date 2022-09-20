import { OptionKeys, RollAndRaiseOptions } from "./roll-and-raise.model";

export class RollsAndResults {
  results: number[];
  rolls: number[];

  private props: RollAndRaiseOptions;
  private transformedRolls: number[];
  private logger: boolean;

  get base() {
    return this.props[OptionKeys.BASE] || 10;
  }
  get rerollLowest() {
    return this.props[OptionKeys.REROLL];
  }
  get legendary() {
    return this.props[OptionKeys.LEGENDARY];
  }
  get increaseRolls() {
    return this.props[OptionKeys.PLUSONE];
  }
  get explode10s() {
    return this.props[OptionKeys.EXPLODE];
  }
  get vivre() {
    return this.props[OptionKeys.VIVRE];
  }

  constructor(dice: number, props: RollAndRaiseOptions, logger = true) {
    this.props = props;
    this.logger = logger;
    this.results = this.generateResults(dice);
  }

  generateResults(numberOfDice) {
    const natural = this.roll(numberOfDice);
    this.rolls = [...natural];
    this.transformedRolls = [...natural];
    this.log(`natural rolls: ${natural.join()}`);

    if (this.increaseRolls) {
      this.incrementResults();
    }
    if (this.legendary) {
      this.applyLegendary();
    }
    if (this.rerollLowest) {
      this.reroll();
    }
    if (this.explode10s) {
      this.explode();
    }
    if (this.vivre > 0) {
      this.applyVivre();
    }

    return this.transformedRolls;
  }

  incrementResults() {
    this.log("increase: adding one to all non-10 results");
    this.transformedRolls = this.transformedRolls.map((result) =>
      result === 10 ? result : ++result
    );
  }

  applyLegendary() {
    this.log("legendary: replacing the last roll with 10");
    this.transformedRolls = this.transformedRolls.slice(0, -1);
    this.transformedRolls.unshift(10);
  }

  reroll() {
    const input = this.transformedRolls;
    const lowest = input[input.length - 1];
    const newRoll = this.roll()[0];
    this.log(`re-roll lowest: ${lowest}; new roll: ${newRoll}`);
    if (newRoll > lowest) {
      this.transformedRolls = input.slice(0, -1);
      this.transformedRolls.push(newRoll);
    }
  }

  explode() {
    const results = this.transformedRolls;
    if (!results.includes(10)) {
      return;
    }
    this.log(
      `exploding ${results.reduce(
        (acc, curr) => (acc += curr === 10 ? 1 : 0),
        0
      )} 10's`
    );
    let i = 0;
    while (results.includes(10)) {
      i++;
      results.shift();
      const newRoll = this.roll()[0];
      this.log(`explosion: ${newRoll}`);
      results.push(newRoll);
      results.sort((a, b) => b - a);
    }
    for (let j = 0; j < i; j++) {
      results.unshift(10);
    }
    this.transformedRolls = results;
  }

  applyVivre() {
    this.log(
      `joie de vivre: adjusted results lower than skill rank (${this.vivre}) to ${this.vivre}`
    );
    const results = this.transformedRolls;
    results.map((result) => (result < this.vivre ? this.vivre : result));
    this.transformedRolls = results;
  }

  roll(numberOfDice = 1): number[] {
    const results: number[] = [];
    for (let i = 0; i < numberOfDice; i++) {
      results.push(Math.floor(Math.random() * 10 + 1));
    }
    results.sort((a, b) => b - a);
    return results;
  }

  log(msg) {
    if (this.logger) {
      console.log(msg);
    }
  }
}
