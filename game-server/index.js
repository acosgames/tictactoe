import fsg from './fsg';
import tictactoe from './game';



fsg.on('newgame', (action) => tictactoe.onNewGame(action));
fsg.on('skip', (action) => tictactoe.onSkip(action));
fsg.on('join', (action) => tictactoe.onJoin(action));
fsg.on('leave', (action) => tictactoe.onLeave(action));
fsg.on('pick', (action) => tictactoe.onPick(action));

fsg.submit();