import fs from 'flatstore';

function TimeBar(props) {

    let [timeleft] = fs.useWatch('timeleft');

    const processProgress = () => {
        let timer = fs.get('timer') || {};
        let totalSeconds = timer.seconds || {};

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
    }
    return (<
        div className="progress"
        style={
            style
        }
    />
    )

}

export default TimeBar;