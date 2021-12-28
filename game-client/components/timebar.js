import fs from 'flatstore';

function TimeBar(props) {

    const processProgress = () => {
        let timer = fs.get('timer') || {};
        let totalSeconds = timer.seconds || {};
        let timeleft = fs.get('timeleft') || 0;

        try {
            if (typeof timeleft != 'number')
                timeleft = Number.parseInt(timeleft);

            timeleft = (timeleft / 1000);
        } catch (e) {
            timeleft = 0;
        }

        return ((timeleft / totalSeconds)) * 100;
    }

    let pct = processProgress() || 0;

    let style = {
        width: pct + '%'
    };

    if (!props.reverse) {
        style.width = '100%';
        style.left = (100 - (pct)) + '%';
        //     style = {
        //         right: 50 + '%',
        //         width: 100 + '%'
        //     };
    }
    return (<
        div className="progress"
        style={
            style
        }
    />
    )

}

export default fs.connect(['timeleft'])(TimeBar);