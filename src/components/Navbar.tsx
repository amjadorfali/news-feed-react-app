import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { Box } from "@mui/material";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import { Sources } from "utils/interfaces";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import DateSelector from "./DateSelector";
import { Dayjs } from "dayjs";

interface Props {
  onSearchChange: React.Dispatch<React.SetStateAction<string>>;
  searchValue: string;
  source: Sources;
  onSourceChange: React.Dispatch<React.SetStateAction<Sources>>;
  onDateChange: React.Dispatch<React.SetStateAction<Dayjs | null>>;
  date: Dayjs | null;
}

const drawerWidth = 240;

const Navbar: React.FC<Props> = ({
  onSearchChange,
  onSourceChange,
  onDateChange,
  date,
  source,
  searchValue,
}) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(prevState => !prevState);
  };

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newAlignment: Sources
  ) => {
    if (newAlignment) onSourceChange(newAlignment);
  };

  const drawer = (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        News Feed
      </Typography>
      <Divider />
      <List>
        <ToggleButtonGroup
          color="standard"
          value={source}
          exclusive
          orientation="vertical"
          onChange={(e, newV) => {
            handleChange(e, newV);
            handleDrawerToggle();
          }}
          aria-label="Source"
          fullWidth
          sx={{ pb: 3 }}
        >
          {Object.values(Sources).map(item => (
            <ToggleButton
              sx={{ textTransform: "capitalize" }}
              key={item}
              value={item}
            >
              {item.split("-").join(" ")}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <DateSelector
          date={date}
          onChange={date => {
            onDateChange(date);
            handleDrawerToggle();
          }}
        />
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{ pt: 1 }} component="nav" position="fixed">
        <Toolbar sx={{ justifyContent: "space-around" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "space-around",
              gap: 1,
            }}
          >
            <DateSelector date={date} onChange={onDateChange} />
            <ToggleButtonGroup
              color="standard"
              value={source}
              exclusive
              onChange={handleChange}
              aria-label="Source"
            >
              {Object.values(Sources).map(item => (
                <ToggleButton
                  sx={{ textTransform: "capitalize" }}
                  key={item}
                  value={item}
                >
                  {item.split("-").join(" ")}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              value={searchValue}
              onChange={value => onSearchChange(value.target.value)}
            />
          </Search>
        </Toolbar>
      </AppBar>

      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
};
export default Navbar;

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));
