var profiles = {};

var Profiler;
module.exports = Profiler = {
    debug: true,

    constructor: function () {
    },

    log: function () {
        if (!this.debug) return;
        console.log.apply(console, arguments);
    },

    info: function () {
        console.log.apply(console, arguments);
    },

    Start: function (name) {
        if (!this.debug) return;
        profiles[name] = process.hrtime();
    },

    End: function (name) {
        if (!this.debug) return;
        if (!profiles[name]) return;

        this.Memory(name);

        let hrend = process.hrtime(profiles[name]);
        let seconds = hrend[0];
        let ms = hrend[1] / 1000000;
        this.log(name + " Time: %ds %d ms", seconds, ms.toFixed(2));
    },

    StartLog: function (name) {

        profiles[name] = process.hrtime();
    },

    EndLog: function (name) {
        if (!profiles[name]) return;
        this.Memory(name);

        let hrend = process.hrtime(profiles[name]);
        let seconds = hrend[0];
        let ms = hrend[1] / 1000000;
        this.info(name + " Time: %ds %d ms", seconds, ms.toFixed(2));
    },

    Memory: function (name) {
        if (!this.debug) return;
        //Calculate memory usage
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        this.log(
            `Memory Usage: ${Math.round(used * 100) / 100} MB`
        );
    }
};

Profiler.constructor();
