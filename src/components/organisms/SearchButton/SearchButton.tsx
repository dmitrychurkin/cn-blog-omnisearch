import React, { memo, useCallback } from "react";
import clsx from "clsx";

import Button from "components/atoms/Button";

import { SuggestionTypeEnum } from "app/enum/SuggestionTypeEnum";
import useRedirect from "app/hook/useRedirect";

import { ReactComponent as SearchIcon } from "icons/Magnifying-glass.svg";

import styles from "./SearchButton.module.css";

const SearchButton: React.FC = () => {
  const handleRedirect = useRedirect();

  const onClick = useCallback(() => {
    handleRedirect(SuggestionTypeEnum.DEFAULT);
  }, [handleRedirect]);

  return (
    <Button
      className={clsx("omnisearch-search-button", styles.root)}
      startIcon={<SearchIcon />}
      onClick={onClick}
    >
      Search
    </Button>
  );
};

export default memo(SearchButton);
