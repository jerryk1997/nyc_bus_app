import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import "./SearchTypeToggle.css";
import { useContext } from "react";
import StateContext from "../StateContext";
import DispatchContext from "../DisptachContext";

function SearchTypeToggle() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  return (
    <ToggleButtonGroup
      className="search-toggle-button-group"
      value={appState.searchType}
      exclusive
      onChange={e => {
        appDispatch({ type: "setSearchType", value: e.target.value });
      }}
      fullWidth
      aria-label="Search type"
    >
      <ToggleButton
        className="search-toggle-button no-right-shadow"
        value="publishedLine"
      >
        Published Line
      </ToggleButton>
      <ToggleButton
        className="search-toggle-button no-left-shadow"
        value="vehicleRef"
      >
        Vehicle Ref.
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
export default SearchTypeToggle;
