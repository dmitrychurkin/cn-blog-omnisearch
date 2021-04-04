import clsx from "clsx";
import React, { memo, PropsWithChildren } from "react";

import styles from "./Layout.module.css";

const Layout: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <div className={clsx("omnisearch-layout", styles.root)}>
    <div className={clsx("omnisearch-layout_wrapper", styles.wrapper)}>
      {children}
    </div>
  </div>
);

export default memo(Layout);
