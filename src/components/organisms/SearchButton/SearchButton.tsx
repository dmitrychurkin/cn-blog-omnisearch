import React, { memo, useCallback } from "react";
import clsx from "clsx";
import Button from "../../../components/atoms/Button";

import styles from "./SearchButton.module.css";
import { ReactComponent as SearchIcon } from "../../../icons/Magnifying-glass.svg";
import { useRedirect } from "../../../app/hooks";
import { SuggestionTypeEnum } from "../../atoms/SuggestIcon/SuggestionTypeEnum";

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
