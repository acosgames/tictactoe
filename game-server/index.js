import cup from './acosg';
import tictactoe from './game';


cup.on('gamestart', (action) => tictactoe.onNewGame(action));
cup.on('skip', (action) => tictactoe.onSkip(action));
cup.on('join', (action) => tictactoe.onJoin(action));
cup.on('leave', (action) => tictactoe.onLeave(action));
cup.on('pick', (action) => tictactoe.onPick(action));

cup.submit();