import { SuggestPayloadType } from "../components/molecules/SuggestUnit/SuggestPayloadType";

export const constructLocationString = (
  { name, city, state, country }: Partial<SuggestPayloadType>,
  separator = ", "
) =>
  [name, city, state, country]
    .map((w) => w?.trim())
    .filter((w) => w)
    .join(separator);
