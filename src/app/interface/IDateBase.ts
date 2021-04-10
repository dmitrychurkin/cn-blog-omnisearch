import type { Moment } from "moment";

export interface IDateBase {
  checkIn: Moment | null;
  checkOut: Moment | null;
}
