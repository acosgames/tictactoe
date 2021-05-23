import fsg from './fsg';
import tictactoe from './game';

fsg.on('newgame', () => tictactoe.onNewGame());
fsg.on('join', () => tictactoe.onJoin());
fsg.on('leave', () => tictactoe.onLeave());
fsg.on('pick', () => tictactoe.onPick());

fsg.submit();