import { useContext, useEffect } from "react";
import { useLeafletContext } from "@react-leaflet/core";
import L from "leaflet";
import { useImmer } from "use-immer";
import bbox from "@turf/bbox";

import "./Map.css";
import "leaflet/dist/leaflet.css";
import StateContext from "../StateContext";
import DispatchContext from "../DisptachContext";

function Route() {
  const context = useLeafletContext();
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const [route, updateRoute] = useImmer({ geoJsonLayer: null });

  useEffect(() => {
    if (appState.geoJson) {
      console.log("============= Viewing routes =============");
      // Get container
      const container = context.layerContainer || context.map;
      console.log("Retrieved map container", container);

      // Create route layer
      console.log("Creating layer from GeoJson:", appState.geoJson);
      const geoJsonLayer = new L.geoJSON(appState.geoJson).bindPopup(layer => {
        console.log(layer.feature);
        const popupContent = document.createElement("div");
        popupContent.innerHTML = `
          <table class="popup-table">
            <thead>
              <tr>
                <td>Property</td>
                <td>Value</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Vehicle Ref.</td>
                <td>${layer.feature.properties.VehicleRef}</td>
              </tr>
              <tr>
                <td>Origin</td>
                <td>${layer.feature.properties.OriginName}</td>
              </tr>
              <tr>
                <td>Destination</td>
                <td>${layer.feature.properties.DestinationName}</td>
              </tr>
            </tbody>
          </table>
        `;
        return popupContent;
      });
      console.log("Created layer:", geoJsonLayer);

      // Update route to component state
      updateRoute(draft => {
        draft.geoJsonLayer = geoJsonLayer;
      });

      // Add layer to map
      container.addLayer(geoJsonLayer);

      // Create bounds for current set of routes
      // and center map on bounds with animation
      const bboxArray = bbox(appState.geoJson);
      const corner1 = [bboxArray[1], bboxArray[0]];
      const corner2 = [bboxArray[3], bboxArray[2]];
      container.flyToBounds([[corner1, corner2]]);

      return () => {
        container.removeLayer(geoJsonLayer);
        updateRoute(draft => {
          draft.geoJsonLayer = null;
        });
      };
    }
  }, [appState.geoJson]);

  useEffect(() => {
    if (appState.geoJson) {
      appDispatch({ type: "setGeoJson", value: null });

      const container = context.layerContainer || context.map;
      container.removeLayer(route.geoJsonLayer);
      updateRoute(draft => {
        draft.geoJsonLayer = null;
      });
      appDispatch({ type: "setGeoJson", value: null });

      container.flyTo(appState.newYorkCoordinates, 13);
    }
  }, [appState.resetToggle]);
  return <></>;
}

export default Route;
