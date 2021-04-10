import moment from "moment";
import { SuggestPayloadType } from "./type/SuggestPayloadType";
import { DateInputType } from "./type/DateInputType";

export const constructLocationString = (
  { name, city, state, country }: Partial<SuggestPayloadType>,
  separator = ", "
) =>
  [name, city, state, country]
    .map((w) => w?.trim())
    .filter((w) => w)
    .join(separator);

export const getValidDates = (date1: DateInputType, date2: DateInputType) => {
  const defaultValues = [moment(), moment().add(1, "d")];

  const constrainedDate1 = moment(date1).startOf("d");

  if (!date1 || !constrainedDate1.isValid()) {
    return defaultValues;
  }

  let constrainedDate2 = moment(date2);
  if (!constrainedDate2.isValid()) {
    constrainedDate2 = moment(constrainedDate1).add(1, "d");
  }

  if (constrainedDate1.isBefore(constrainedDate2.startOf("d"))) {
    return [date1, date2];
  }

  return defaultValues;
};
