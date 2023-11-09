import React, { useEffect, useMemo } from "react";
import { Grid, Toolbar, Typography } from "@mui/material";
import useListArticles, { PAGE_LIMIT } from "services/queries/useListArticles";
import ArticleCard from "components/ArticleCard";
import Navbar from "components/Navbar";
import useDebounce from "hooks/useDebounce";
import PaginationComponent from "components/PaginationComponent";
import { Sources } from "utils/interfaces";
import dayjs, { Dayjs } from "dayjs";
import Categories, { TabValue } from "components/Categories";

const Root: React.FC = () => {
  const [searchValue, setSearchValue] = React.useState<string>("");
  const debouncedSearch = useDebounce(searchValue, 500);
  const [page, setPage] = React.useState<number>(1);
  const [source, setSource] = React.useState<Sources>(Sources.NEWS_API);
  const [date, setDate] = React.useState<Dayjs | null>(
    dayjs().subtract(1, "d")
  );
  const debouncedDate = useDebounce(date, 500);

  const [category, setCategory] = React.useState<TabValue>("latest");
  const { data, isSuccess, isError } = useListArticles({
    q: debouncedSearch.toLowerCase(),
    page,
    source,
    from: debouncedDate,
    category: ["latest"].includes(category) ? undefined : category,
  });

  const pagesCount = useMemo(
    () => (data?.total ? Math.ceil(data?.total / PAGE_LIMIT) : 1),
    [data?.total]
  );

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, source, debouncedDate]);

  return (
    <>
      <Navbar
        onSourceChange={setSource}
        onSearchChange={setSearchValue}
        onDateChange={setDate}
        date={date}
        source={source}
        searchValue={searchValue}
      />
      <Toolbar />
      <Grid container gap={5} py={3} justifyContent={"center"}>
        <Grid item xs={12} container justifyContent={"center"}>
          <Categories onChange={setCategory} value={category} />
        </Grid>
        {isSuccess ? (
          <>
            {data.articles.length ? (
              data.articles.map(article => (
                <ArticleCard article={article} key={article.source.id} />
              ))
            ) : (
              <Grid item container xs={12} direction={"column"} gap={10}>
                <Typography
                  textAlign={"center"}
                  children="No articles found :("
                  variant="h2"
                />
                <Typography
                  textAlign={"center"}
                  children="Try modifying the filter criteria"
                  variant="h6"
                />
              </Grid>
            )}
            <Grid
              item
              xs={12}
              sx={{ ".MuiPagination-ul": { justifyContent: "center" } }}
            >
              {!!data.articles.length && (
                <PaginationComponent
                  count={pagesCount}
                  page={page}
                  setPage={setPage}
                />
              )}
            </Grid>
          </>
        ) : (
          <Typography
            children={
              isError ? "An error occurred please refresh" : "Loading..."
            }
            variant="h3"
          />
        )}
      </Grid>
    </>
  );
};

export default Root;
