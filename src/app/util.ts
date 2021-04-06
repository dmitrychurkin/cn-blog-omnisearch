import moment, { Moment } from "moment";
import { SuggestPayloadType } from "../components/molecules/SuggestUnit/SuggestPayloadType";

export const constructLocationString = (
  { name, city, state, country }: Partial<SuggestPayloadType>,
  separator = ", "
) =>
  [name, city, state, country]
    .map((w) => w?.trim())
    .filter((w) => w)
    .join(separator);

export const validateDate = (date1: Moment | null | undefined, date2: Moment | null | undefined) => {
  const constrainedDate1 = moment(date1);
  if (!date1 || !constrainedDate1.isValid()) {
    return false;
  }

  let constrainedDate2 = moment(date2);
  if (!constrainedDate2.isValid()) {
    constrainedDate2 = moment();
  }

  return constrainedDate1
    .startOf('day')
    .isSameOrBefore(constrainedDate2.startOf('day'));
};
