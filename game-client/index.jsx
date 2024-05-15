import React from "react";
import { GameLoader } from "./GameLoader.jsx";
import "./index.css";
import "./game.scss";

import Gamescreen from "./components/GameScreen.jsx";

import { createRoot } from "react-dom/client";
const container = document.getElementById("root");
const root = createRoot(container);

root.render(<GameLoader component={Gamescreen} />);
