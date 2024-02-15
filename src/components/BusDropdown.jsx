import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  Button,
  Backdrop,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";

import "./BusDropdown.css";
import { useContext } from "react";
import StateContext from "../StateContext";
import DispatchContext from "../DisptachContext";

function BusDropdown() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([""]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [label, setLabel] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function handleClearHistory() {
    appDispatch({ type: "clearRecentSearch" });
    const routeData = appState.routeData[appState.searchType];
    const allOptions = routeData.map(data => ({ group: "All", label: data }));
    setOptions(allOptions);
    if (selectedOption !== null) {
      const selectedOptionValue = selectedOption.label;
      setSelectedOption({ group: "All", label: selectedOptionValue });
    }
    setOpen(false);
  }

  function populateOptions() {
    let routeData = appState.routeData[appState.searchType];
    let recentSearches = appState.recentSearches[appState.searchType];

    if (appState.searchType === "publishedLine") {
      setLabel("Published Line");
    } else {
      setLabel("Vehicle Ref.");
    }

    const allOptions = routeData
      .filter(data => !recentSearches.includes(data))
      .map(data => ({ group: "All", label: data }));

    let recentOptions = [];
    if (recentSearches.length > 0) {
      recentOptions = recentSearches.map(data => {
        return { group: "Recent", label: data };
      });
    }

    const options = [...recentOptions, ...allOptions];

    setOptions(options);
  }

  useEffect(() => {
    setSelectedOption(null);
    populateOptions();
  }, [appState.searchType, appState.routeData]);

  useEffect(() => {
    appDispatch({
      type: "setSearchParam",
      value: selectedOption ? selectedOption.label : null
    });
  }, [selectedOption]);

  useEffect(() => {
    if (appState.searchParam === null) {
      setSelectedOption(null);
    }
  }, [appState.searchParam]);

  useEffect(() => {
    if (
      appState.recentSearches.publishedLine.length === 0 &&
      appState.recentSearches.vehicleRef.length === 0
    ) {
      return;
    }
    let currentSelected = selectedOption;
    setSelectedOption(null);
    populateOptions();
    setSelectedOption({
      ...currentSelected,
      group: "Recent"
    });
  }, [appState.recentSearches]);

  return (
    <div className="dropdown-container">
      <Backdrop></Backdrop>
      <div className="dropdown-background">
        <Autocomplete
          disablePortal
          options={options}
          groupBy={option => option.group} // Grouping options by group property
          getOptionLabel={option => option.label} // Retrieving label from each option object
          value={selectedOption}
          isOptionEqualToValue={(
            option,
            value // Need to provide here as default is strict  === check
          ) => option.group === value.group && option.label === value.label}
          onChange={(e, newValue) => {
            setSelectedOption(newValue ? newValue : null);
          }}
          renderInput={params =>
            isFocused ? (
              // Element with placeholder when dropdown is focused
              <TextField
                {...params}
                label={label}
                placeholder="Type to search"
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            ) : (
              // Element without placeholder to show label when dropdown is not focused
              <TextField
                {...params}
                label={label}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            )
          }
        />
      </div>
      <Button onClick={handleClickOpen}>
        <RestoreIcon fontSize="large" sx={{ color: "grey" }}></RestoreIcon>
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">
          Clear all recent searches?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Clear both published line and vehicle reference recent search
            history.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className="cancel-button" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            className="clear-history-button"
            onClick={handleClearHistory}
            autoFocus
            color="error"
          >
            Clear
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default BusDropdown;
