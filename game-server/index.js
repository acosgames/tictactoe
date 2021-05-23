import fsg from './fsg';
import ttt from './game';

fsg.on('newgame', () => ttt.onNewGame());
fsg.on('join', () => ttt.onJoin());
fsg.on('pick', () => ttt.onPick());

fsg.submit();