import { ACOSServer } from "acosgames";

import { onJoin, onLeave, onNewGame, onPick, onSkip } from "./game";

//prepare gameState for mutation
ACOSServer.init();

//ACOS events
ACOSServer.on("gamestart", onNewGame);
ACOSServer.on("join", onJoin);
ACOSServer.on("leave", onLeave);
ACOSServer.on("skip", onSkip);

//Custom events
ACOSServer.on("pick", onPick);

//Save changes
ACOSServer.save();
