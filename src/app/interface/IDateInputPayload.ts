import type { Moment } from "moment";

export interface IDateInputPayload {
  readonly startDate: Moment | null;
  readonly endDate: Moment | null;
}
