import React, { useState } from "react";
import { Button, Paper, Grid, Typography, Avatar } from "@mui/material";
import "./Menu.css";
import BusDropdown from "./BusDropdown";
import SearchTypeToggle from "./SearchTypeToggle";
import { useContext } from "react";
import StateContext from "../StateContext";
import DispatchContext from "../DisptachContext";

function Menu() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const [showError, setShowError] = useState(false);

  function handleViewRoute() {
    if (!appState.searchParam) {
      setShowError(true);
    } else {
      setShowError(false);
      appDispatch({ type: "addRecentSearch", value: appState.searchType });
      appDispatch({ type: "viewRoute" });
    }
  }

  return (
    <Paper className="menu">
      <Grid container spacing={2}>
        {/* ============ Search type toggle ============ */}
        <Grid item xs={12}>
          <Avatar
            variant="square"
            alt="Bus Icon"
            // style={{ width: "100px", height: "100px" }}
            src="\src\assets\bus.png"
          />
        </Grid>
        {/* ============ Search type toggle ============ */}
        <Grid item xs={12}>
          <SearchTypeToggle />
        </Grid>

        {/* ============ Search Drop down ============ */}
        <Grid item xs={12}>
          <BusDropdown />
          <Typography
            variant="body2"
            color="error"
            className="option-error"
            style={{ display: showError ? "block" : "none", marginTop: "8px" }}
          >
            Please select an option.
          </Typography>
        </Grid>

        {/* ============ View routes ============*/}
        <Grid item xs={12}>
          <div className="menu-buttons">
            <Button
              onClick={() => {
                appDispatch({ type: "reset" });
                appDispatch({ type: "setSearchParam", value: null });
              }}
              className="clear-button"
              variant="contained"
            >
              Clear
            </Button>
            <Button
              onClick={handleViewRoute}
              className="view-route-button"
              variant="contained"
            >
              View Route
            </Button>
          </div>
        </Grid>
        {/* ============ Attribution Footer ============ */}
        <Grid
          item
          xs={12}
          style={{ textAlign: "right" }}
          sx={{ marginBottom: "0px" }}
        >
          <Typography variant="caption">
            <a
              href="https://www.flaticon.com/free-icons/bus"
              title="bus icons"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "grey" }}
            >
              Bus icons created by Freepik - Flaticon
            </a>
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default Menu;
