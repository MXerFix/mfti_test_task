import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

const start = async () => {
  if (process.env.NODE_ENV === "development") {
    await import("./mocks/browser.js").then(({ worker }) => worker.start());
  }
  ReactDOM.render(<App />, document.getElementById("root"));
}

start()