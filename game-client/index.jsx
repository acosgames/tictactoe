import React from "react";
import { GameLoader } from "./GameLoader.jsx";
import "./index.css";

import Gamescreen from "./components/gamescreen";

import { createRoot } from "react-dom/client";
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
    // <React.StrictMode>

    <GameLoader component={Gamescreen} />
);
