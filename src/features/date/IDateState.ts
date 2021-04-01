import type { Moment } from "moment";
import { FocusedInputShape } from "react-dates";

export interface IDateState {
    checkIn: Moment | null;
    checkOut: Moment | null;
    currentFocus: FocusedInputShape | null;
}
