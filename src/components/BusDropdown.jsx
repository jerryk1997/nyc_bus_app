import React, { useEffect, useState } from "react";
import {
  Box,
  InputLabel,
  FormControl,
  NativeSelect,
  Select,
  MenuItem,
  Autocomplete,
  TextField
} from "@mui/material";
import axios from "axios";

import "./BusDropdown.css";
import { useContext } from "react";
import StateContext from "../StateContext";
import DispatchContext from "../DisptachContext";

function BusDropdown() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const [options, setOptions] = useState([""]);
  const [recentSelected, setRecentSelected] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [label, setLabel] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  useEffect(() => {
    async function populateOptions() {
      console.log("========= Populating options =========");
      let response;
      if (appState.searchType === "publishedLine") {
        setLabel("Published Line");
        console.log("Fetching published line options");
        response = await axios.get("/getPubLineName");
        console.log("Published line data fetched\n", response.data);
      } else {
        setLabel("Vehicle Ref.");
        console.log("Fetching vehicle reference options");
        response = await axios.get("/getVehRef");
        console.log("Vehiche reference data fetched\n", response.data);
      }

      setSelectedOption(null);
      setOptions(response.data);
    }

    populateOptions();
  }, [appState.searchType]);

  useEffect(() => {
    appDispatch({ type: "setSearchParam", value: selectedOption });
  }, [selectedOption]);

  useEffect(() => {
    if (appState.searchParam === null) {
      setSelectedOption(null);
    }
  }, [appState.searchParam]);

  return (
    <div className="dropdown-container">
      <Autocomplete
        disablePortal
        options={options}
        value={selectedOption}
        onChange={e => setSelectedOption(e.target.textContent || null)}
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
