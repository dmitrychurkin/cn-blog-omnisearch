import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { IGlobalCtx } from "./IGlobalCtx";
import { ViewportMinSizeEnum } from "./ViewportMinSizeEnum";
import { ViewportTypeEnum } from "./ViewportTypeEnum";

export const GlobalCtx = React.createContext<IGlobalCtx | null>(null);

const Global: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const getViewportType = useCallback(() => {
    const { innerWidth } = window;
    if (innerWidth < ViewportMinSizeEnum.TABLET) {
      return ViewportTypeEnum.MOBILE;
    }
    if (innerWidth < ViewportMinSizeEnum.DESKTOP) {
      return ViewportTypeEnum.TABLET;
    }
    return ViewportTypeEnum.DESKTOP;
  }, []);

  const [state, setState] = useState<IGlobalCtx>(() => ({
    viewportType: getViewportType(),
  }));

  const prevViewportType = useRef(state.viewportType);

  useEffect(() => {
    const resizeHandler = () => {
      const viewportType = getViewportType();
      if (viewportType !== prevViewportType.current) {
        setState((state) => ({
          ...state,
          viewportType,
        }));
      }
      prevViewportType.current = viewportType;
    };

    resizeHandler();

    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [getViewportType]);

  return <GlobalCtx.Provider value={state}>{children}</GlobalCtx.Provider>;
};

export default memo(Global);
