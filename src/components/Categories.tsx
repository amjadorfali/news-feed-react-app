import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Category } from "services/queries/useListArticles";

export type TabValue = Category | "latest";
interface Props {
  value: TabValue;
  onChange: React.Dispatch<React.SetStateAction<TabValue>>;
}
const Categories: React.FC<Props> = ({ onChange, value }) => {
  const handleChange = (_event: React.SyntheticEvent, newValue: TabValue) => {
    onChange(newValue);
  };

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      variant="scrollable"
      scrollButtons="auto"
      aria-label="scrollable auto tabs example"
      sx={{ textTransform: "capitalize", maxWidth: { xs: 320, sm: 600 } }}
      textColor="inherit"
    >
      <Tab label={"Latest"} value={"latest"} />
      <Tab label={Category.BUSINESS} value={Category.BUSINESS} />
      <Tab label={Category.ENTERTAINMENT} value={Category.ENTERTAINMENT} />
      <Tab label={Category.GENERAL} value={Category.GENERAL} />
      <Tab label={Category.HEALTH} value={Category.HEALTH} />
      <Tab label={Category.SCIENCE} value={Category.SCIENCE} />
      <Tab label={Category.SPORTS} value={Category.SPORTS} />
      <Tab label={Category.TECHNOLOGY} value={Category.TECHNOLOGY} />
    </Tabs>
  );
};
export default Categories;
