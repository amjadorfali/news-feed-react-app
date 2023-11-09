import * as React from "react";
import Pagination from "@mui/material/Pagination";

interface Props {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  count: number;
}
const PaginationComponent: React.FC<Props> = ({ count, page, setPage }) => {
  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Pagination
      color="primary"
      count={count}
      page={page}
      onChange={handleChange}
    />
  );
};

export default PaginationComponent;
