import fsg from './fsg';
import tictactoe from './game';

fsg.setTimeLimit(20);

fsg.on('newgame', () => tictactoe.onNewGame());
fsg.on('skip', () => tictactoe.onSkip());
fsg.on('join', () => tictactoe.onJoin());
fsg.on('leave', () => tictactoe.onLeave());
fsg.on('pick', () => tictactoe.onPick());

fsg.submit();