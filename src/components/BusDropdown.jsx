import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";

import "./BusDropdown.css";
import { useContext } from "react";
import StateContext from "../StateContext";
import DispatchContext from "../DisptachContext";

function BusDropdown() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

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
    console.log(allOptions);

    let recentOptions = [];
    if (recentSearches.length > 0) {
      recentOptions = recentSearches.map(data => {
        return { group: "Recent", label: data };
      });
    }

    const options = [...recentOptions, ...allOptions];

    console.log(options);
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
      <Autocomplete
        disablePortal
        options={options}
        groupBy={option => option.group} // Grouping options by group property
        getOptionLabel={option => option.label} // Retrieving label from each option object
        value={selectedOption}
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
  );
}

export default BusDropdown;

/* <Box sx={{ minWidth: 100 }}>
        <FormControl fullWidth>
          {label && (
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              {label}
            </InputLabel>
          )}
          <NativeSelect
            variant="filled"
            value={selectedOption}
            onChange={e => {
              setSelectedOption(e.target.value);
              e.target.blur();
            }}
            inputProps={{
              name: "Vehicle Reference",
              id: "uncontrolled-native"
            }}
          >
            {options &&
              options.map((value, index) => {
                return (
                  <option key={index} value={value}>
                    {value}
                  </option>
                );
              })}
          </NativeSelect>
        </FormControl>
        {/* <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Published Line</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Published Line"
          >
            {options &&
              options.slice(0, 300).map((value, index) => {
                return (
                  <MenuItem key={index} value={value}>
                    {value}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl> 
      </Box> */
