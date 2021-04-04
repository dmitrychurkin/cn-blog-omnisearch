import clsx from "clsx";
import React, { memo, PropsWithChildren } from "react";

import styles from "./SearchWrapper.module.css";

type Prop = {
  readonly isActive: boolean;
};

const SearchWrapper: React.FC<PropsWithChildren<Prop>> = ({
  children,
  isActive,
}) => (
  <div
    className={clsx(
      "omnisearch-search-wrapper",
      isActive && ["omnisearch-search-wrapper--active", styles.active],
      styles.root
    )}
  >
    {children}
  </div>
);

export default memo(SearchWrapper);
