import React, { memo } from "react";
import clsx from "clsx";
import Button from "../../../components/atoms/Button";

import styles from "./SearchButton.module.css";
import { ReactComponent as SearchIcon } from "../../../icons/Magnifying-glass.svg";

const SearchButton: React.FC = () => {
  return (
    <Button
      className={clsx("omnisearch-search-button", styles.root)}
      startIcon={<SearchIcon />}
    >
      Search
    </Button>
  );
};

export default memo(SearchButton);
