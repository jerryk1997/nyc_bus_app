import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { useImmer } from "use-immer";
import { Backdrop, CircularProgress } from "@mui/material";
import bbox from "@turf/bbox";

import "./Map.css";
import "leaflet/dist/leaflet.css";
import StateContext from "../StateContext";

function Map() {
  const appState = useContext(StateContext);
  const mapRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [mapState, setMapState] = useImmer({ routeData: null });

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

      setMapState(draft => {
        draft.routeData = response.data;
      });
      setIsLoading(false);
    }

    if (appState.searchParam) {
      fetchRouteData();
    }
  }, [appState.viewRouteToggle]);

  function Route({ geoJson }) {
    const map = useMap();

    useEffect(() => {
      if (geoJson) {
        console.log("=========== Fitting bounds ===========");
        const bboxArray = bbox(geoJson);
        const corner1 = [bboxArray[1], bboxArray[0]];
        const corner2 = [bboxArray[3], bboxArray[2]];
        map.fitBounds([[corner1, corner2]]);
      }
    }, [appState.viewRouteToggle]);
    return null;
  }

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <MapContainer
        ref={mapRef}
        key={JSON.stringify(mapState.routeData)}
        center={appState.newYorkCoordinates}
        zoom={13}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mapState.routeData && (
          <GeoJSON
            key={JSON.stringify(mapState.routeData)}
            data={mapState.routeData}
          />
        )}
        new
        <Route geoJson={mapState.routeData} />
      </MapContainer>
    </>
  );
}

export default Map;
