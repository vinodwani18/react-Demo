import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import 'semantic-ui-css/semantic.min.css'
import { render } from "react-dom";
import { Provider } from "react-redux";
import store from "./js/store/index";
import App from "./components/App";

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

