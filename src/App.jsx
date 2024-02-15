import {
  ThemeProvider,
  createTheme,
  Backdrop,
  CircularProgress
} from "@mui/material";

import { useImmerReducer } from "use-immer";

import Map from "./components/Map";
import Menu from "./components/Menu";
import StateContext from "./StateContext";
import DispatchContext from "./DisptachContext";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // ========= Styling =========
  const theme = createTheme({
    typography: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(",")
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "20px"
          }
        }
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            borderRadius: "20px"
          }
        }
      }
    }
  });

  // ========= Initial State =========
  const initialState = {
    newYorkCoordinates: [40.7128, -74.006],
    searchType: "publishedLine",
    searchParam: null,
    geoJson: null,
    viewRouteToggle: true,
    resetToggle: true,
    recentSearches: {
      publishedLine: [],
      vehicleRef: []
    },
    routeData: {
      publishedLine: [],
      vehicleRef: []
    }
  };

  // ========= Reducer utility functions =========
  function addRecentSearch(recentSearches, currentSearch) {
    let i = recentSearches.indexOf(currentSearch);
    if (i === -1 && recentSearches.length < 5) {
      recentSearches.unshift(currentSearch);
    } else if (i === -1) {
      recentSearches.pop();
      recentSearches.unshift(currentSearch);
    } else {
      while (i >= 1) {
        const temp = recentSearches[i - 1];
        recentSearches[i - 1] = recentSearches[i];
        recentSearches[i] = temp;
        i -= 1;
      }
    }
  }

  // ========= Reducer =========
  function appReducer(draft, action) {
    switch (action.type) {
      case "setBusData":
        draft.routeData[action.key] = action.value;
        break;
      case "setSearchType":
        draft.searchType = action.value;
        break;
      case "setSearchParam":
        draft.searchParam = action.value;
        break;
      case "setGeoJson":
        draft.geoJson = action.value;
        break;
      case "setRecentSearches":
        draft.recentSearches = action.value;
        break;
      case "viewRoute":
        draft.viewRouteToggle = !draft.viewRouteToggle;
        break;
      case "reset":
        draft.resetToggle = !draft.resetToggle;
        break;
      case "addRecentSearch":
        let key;
        if (action.value === "publishedLine") {
          key = "publishedLine";
        } else {
          key = "vehicleRef";
        }

        // Check if search exists and needs to be pushed up
        let recentSearches = [...draft.recentSearches[key]];
        addRecentSearch(recentSearches, draft.searchParam);
        draft.recentSearches[key] = recentSearches;

        const jsonString = JSON.stringify(draft.recentSearches);
        localStorage.setItem("recentSearches", jsonString);
        break;
      case "clearRecentSearch":
        draft.recentSearches.publishedLine = [];
        draft.recentSearches.vehicleRef = [];

        localStorage.removeItem("recentSearches");
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(appReducer, initialState);

  // ========= Use effects =========
  // Initialising
  useEffect(() => {
    async function fetchOptions() {
      // Wake up server
      await axios.get("/ready");

      console.log("====== Server Ready, Fetching data ======");

      // Fetching data
      let publishedLineResponse = await axios.get("/getPubLineName");
      let vehRefResponse = await axios.get("/getVehRef");
      while (
        publishedLineResponse.data.length === 0 ||
        vehRefResponse.data.length === 0
      ) {
        console.log("Trying to fetch again");
        publishedLineResponse = await axios.get("/getPubLineName");
        vehRefResponse = await axios.get("/getVehRef");
      }

      dispatch({
        type: "setBusData",
        key: "publishedLine",
        value: publishedLineResponse.data
      });
      console.log("Fetched published line data");

      dispatch({
        type: "setBusData",
        key: "vehicleRef",
        value: vehRefResponse.data
      });
      console.log("Fetched vehicle ref data");
    }

    fetchOptions();
    if (localStorage.getItem("recentSearches")) {
      const recentSearches = JSON.parse(localStorage.getItem("recentSearches"));
      dispatch({ type: "setRecentSearches", value: recentSearches });
    }
  }, []);

  // Loading Route
  useEffect(() => {
    console.log(state.routeData);
    if (
      state.routeData.publishedLine.length > 0 &&
      state.routeData.vehicleRef.length > 0
    ) {
      setIsLoading(false);
    }
  }, [state.routeData]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <StateContext.Provider value={state}>
          <DispatchContext.Provider value={dispatch}>
            <Backdrop
              sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }}
              open={isLoading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            <Menu />
            <Map />
          </DispatchContext.Provider>
        </StateContext.Provider>
      </ThemeProvider>
    </>
  );
}

export default App;
