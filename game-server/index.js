import { ACOSServer } from "acosgames";
// import cup from "./acosg";
import tictactoe from "./game";

ACOSServer.init();

ACOSServer.on("gamestart", (action) => tictactoe.onNewGame(action));
ACOSServer.on("skip", (action) => tictactoe.onSkip(action));
ACOSServer.on("join", (action) => tictactoe.onJoin(action));
ACOSServer.on("leave", (action) => tictactoe.onLeave(action));
ACOSServer.on("pick", (action) => tictactoe.onPick(action));

ACOSServer.submit();
