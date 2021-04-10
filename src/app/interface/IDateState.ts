import { FocusedInputShape } from "react-dates";
import { IDateBase } from "./IDateBase";

export interface IDateState extends IDateBase {
  currentFocus: FocusedInputShape | null;
}
