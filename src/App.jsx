import { ThemeProvider, createTheme } from "@mui/material";

import { useImmerReducer } from "use-immer";

import Map_v2 from "./components/Map_v2";
import Map from "./components/Map";
import Menu from "./components/Menu";
import StateContext from "./StateContext";
import DispatchContext from "./DisptachContext";

function App() {
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

  const initialState = {
    newYorkCoordinates: [40.7128, -74.006],
    searchType: "publishedLine",
    searchParam: null,
    geoJson: null,
    viewRouteToggle: true,
    resetToggle: true
  };

  function appReducer(draft, action) {
    switch (action.type) {
      case "setSearchType":
        draft.searchType = action.value;
        break;
      case "setSearchParam":
        draft.searchParam = action.value;
        break;
      case "setGeoJson":
        draft.geoJson = action.value;
        break;
      case "viewRoute":
        draft.viewRouteToggle = !draft.viewRouteToggle;
        break;
      case "reset":
        draft.resetToggle = !draft.resetToggle;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(appReducer, initialState);

  return (
    <>
      <ThemeProvider theme={theme}>
        <StateContext.Provider value={state}>
          <DispatchContext.Provider value={dispatch}>
            <Menu />
            <Map_v2 />
          </DispatchContext.Provider>
        </StateContext.Provider>
      </ThemeProvider>
    </>
  );
}

export default App;
