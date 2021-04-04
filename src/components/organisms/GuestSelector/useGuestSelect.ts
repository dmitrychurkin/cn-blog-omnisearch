import { useCallback, useMemo, useState } from "react";
import { IGuestBase } from "../../../features/guest/IGuestBase";
import { OperationTypeEnum } from "../../molecules/GuestCounter/OperationTypeEnum";
import { GuestTypeEnum } from "./GuestTypeEnum";

export default function useGuestSelect({
  adult,
  child,
  infant,
}: IGuestBase): [
  IGuestBase,
  (guestType: GuestTypeEnum, op: OperationTypeEnum, value: number) => void,
  Map<GuestTypeEnum, [number, number]>
] {
  const [guestState, setGuestState] = useState<IGuestBase>(() => ({
    adult,
    child,
    infant,
  }));

  const constraints = useMemo(
    () =>
      new Map<GuestTypeEnum, [number, number]>()
        .set(GuestTypeEnum.ADULT, [1, 20])
        .set(GuestTypeEnum.CHILD, [0, 10])
        .set(GuestTypeEnum.INFANT, [0, 10]),
    []
  );

  const action = useMemo(
    () => ({
      [GuestTypeEnum.ADULT]: {
        [OperationTypeEnum.INC]: () =>
          setGuestState((state) => ({ ...state, adult: state.adult + 1 })),
        [OperationTypeEnum.DEC]: () =>
          setGuestState((state) => ({ ...state, adult: state.adult - 1 })),
      },
      [GuestTypeEnum.CHILD]: {
        [OperationTypeEnum.INC]: () =>
          setGuestState((state) => ({ ...state, child: state.child + 1 })),
        [OperationTypeEnum.DEC]: () =>
          setGuestState((state) => ({ ...state, child: state.child - 1 })),
      },
      [GuestTypeEnum.INFANT]: {
        [OperationTypeEnum.INC]: () =>
          setGuestState((state) => ({ ...state, infant: state.infant + 1 })),
        [OperationTypeEnum.DEC]: () =>
          setGuestState((state) => ({ ...state, infant: state.infant - 1 })),
      },
    }),
    []
  );

  const validator = useCallback(
    (gusetType: GuestTypeEnum, op: OperationTypeEnum, value: number) => {
      const [min, max] = constraints.get(gusetType ?? GuestTypeEnum.ADULT)!;

      if (op === OperationTypeEnum.INC && value < max) {
        return true;
      }
      if (op === OperationTypeEnum.DEC && value > min) {
        return true;
      }

      return false;
    },
    [constraints]
  );

  const onChange = useCallback(
    (guestType: GuestTypeEnum, op: OperationTypeEnum, value: number) => {
      if (validator(guestType, op, value)) {
        action[guestType][op]();
      }
    },
    [validator, action]
  );

  return [guestState, onChange, constraints];
}
