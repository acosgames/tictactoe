import { ACOSServer } from "acosgames";
// import cup from "./acosg";
import TicTacToe from "./game";

let tictactoe = new TicTacToe();
ACOSServer.init();

ACOSServer.on("gamestart", (action) => tictactoe.onNewGame(action));
ACOSServer.on("skip", (action) => tictactoe.onSkip(action));
ACOSServer.on("join", (action) => tictactoe.onJoin(action));
ACOSServer.on("leave", (action) => tictactoe.onLeave(action));
ACOSServer.on("pick", (action) => tictactoe.onPick(action));

ACOSServer.commit();
