import React, { memo, useCallback } from "react";
import clsx from "clsx";

import useAppDispatch from "app/hook/useAppDispatch";
import useAppSelector from "app/hook/useAppSelector";

import { IGuestBase } from "app/interface/IGuestBase";

import GuestInput from "components/molecules/GuestInput";
import GuestSelector from "components/organisms/GuestSelector";

import { change, focus } from "./guestSlice";

import { ReactComponent as GuestIcon } from "icons/Person-outlined.svg";

import styles from "./Guest.module.css";

const Guest: React.FC = () => {
  const dispatch = useAppDispatch();
  const { adult, child, infant, isFocus } = useAppSelector(
    (state) => state.guest
  );

  const onChange = useCallback(
    ({ adult, child, infant }: IGuestBase) => {
      dispatch(change({ adult, child, infant }));
    },
    [dispatch]
  );

  const onToggleFocus = useCallback(() => {
    dispatch(focus());
  }, [dispatch]);

  return (
    <div className={clsx("omnisearch-guest", styles.root)}>
      <GuestInput
        startIcon={<GuestIcon />}
        guestCount={adult + child + infant}
        onOpen={onToggleFocus}
        isFocus={isFocus}
      />
      <GuestSelector
        {...{ adult, child, infant }}
        isOpen={isFocus}
        onChange={onChange}
        onClose={onToggleFocus}
        appElement={document.getElementById("omnisearch")}
      />
    </div>
  );
};

export default memo(Guest);
