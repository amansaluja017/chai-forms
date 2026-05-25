import { z } from "zod";

export const zodUndefinedModel = z.undefined().describe("undefined");
export const zodUnitModel = z.void().describe("Unit");

export { z };
