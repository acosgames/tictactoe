'use strict'

import fsg from './fsg';

try {
    fsg.on('join', (msg) => {
        fsg.log("JOIN: ", msg);
    });
    // debugger
    fsg.on('pick', (msg) => {
        fsg.log("PICK: ", msg);
    });

    fsg.finish();
}
catch (e) {
    fsg.error(e);
}
