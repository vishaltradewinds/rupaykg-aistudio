import { BmAg04001Engine, type BmAg04001Inputs, type BmAg04001Result } from "./bmAg04001Engine.ts";
import { BmIn02002Engine, type BmIn02002Inputs, type BmIn02002Result } from "./bmIn02002Engine.ts";
import { BmWa03002Engine, type BmWa03002Inputs, type BmWa03002Result } from "./bmWa03002Engine.ts";
import { BmWa03003Engine, type BmWa03003Inputs, type BmWa03003Result } from "./bmWa03003Engine.ts";
import { assertMethodologyContext, type MethodologyProjectContext } from "./methodologyContext.ts";

export type Wave1EngineResult =
  | { methodologyId: "BM-AG04.001"; result: BmAg04001Result }
  | { methodologyId: "BM-IN02.002"; result: BmIn02002Result }
  | { methodologyId: "BM-WA03.001"; result: BmWa03002Result }
  | { methodologyId: "BM-WA03.003"; result: BmWa03003Result };

export function runWave1Methodology(
  context: MethodologyProjectContext,
  input: BmAg04001Inputs | BmIn02002Inputs | BmWa03002Inputs | BmWa03003Inputs,
  methodologyId: Wave1EngineResult["methodologyId"]
): Wave1EngineResult {
  assertMethodologyContext(context);
  switch (methodologyId) {
    case "BM-AG04.001":
      return { methodologyId, result: BmAg04001Engine.calculate(input as BmAg04001Inputs) };
    case "BM-IN02.002":
      return { methodologyId, result: BmIn02002Engine.calculate(input as BmIn02002Inputs) };
    case "BM-WA03.001":
      return { methodologyId, result: BmWa03002Engine.calculate(input as BmWa03002Inputs) };
    case "BM-WA03.003":
      return { methodologyId, result: BmWa03003Engine.calculate(input as BmWa03003Inputs) };
  }
}
