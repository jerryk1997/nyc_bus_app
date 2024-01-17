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
      console.log(appState.geoJson);
      const container = context.layerContainer || context.map;
      const geoJsonLayer = new L.geoJSON(appState.geoJson);
      updateRoute(draft => {
        draft.geoJsonLayer = geoJsonLayer;
      });
      container.addLayer(geoJsonLayer);

      console.log("=========== Fitting bounds ===========");
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
