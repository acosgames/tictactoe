import fsg from './fsg';

try {
    fsg.on('join', (msg) => {
        fsg.log("JOIN: ", JSON.stringify(msg));
    });
    // debugger
    fsg.on('pick', (msg) => {
        fsg.log("PICK: " + JSON.stringify(msg));
    });

    fsg.finish();
}
catch (e) {
    fsg.error(e);
}