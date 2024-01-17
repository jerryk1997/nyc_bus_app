import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import axios from "axios";

axios.defaults.baseURL =
  "https://nyc-bus-engine-k3q4yvzczq-an.a.run.app/api/bus_trip";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
