import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import { Backdrop, CircularProgress } from "@mui/material";

import "./Map.css";
import Route from "./Route";
import "leaflet/dist/leaflet.css";
import StateContext from "../StateContext";
import DispatchContext from "../DisptachContext";

function Map() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchRouteData() {
      console.log("========= Viewing Routes =========");
      let searchRoute;
      if (appState.searchType === "publishedLine") {
        searchRoute = "getBusTripByPubLineName";
      } else {
        searchRoute = "getBusTripByVehRef";
      }
      console.log(`API route: /${searchRoute}/${appState.searchParam}`);

      console.log("Fetching data...");
      setIsLoading(true);
      const response = await axios.get(
        `/${searchRoute}/${appState.searchParam}`
      );
      console.log("GeoJson:\n", response.data);

      appDispatch({ type: "setGeoJson", value: response.data });
      setIsLoading(false);
    }

    if (appState.searchParam) {
      fetchRouteData();
    }
  }, [appState.viewRouteToggle]);

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <MapContainer center={appState.newYorkCoordinates} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Route />
      </MapContainer>
    </>
  );
}

export default Map;
