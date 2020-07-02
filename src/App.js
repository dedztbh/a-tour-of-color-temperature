import React, {useEffect, useState, useRef} from 'react';
import {colorTemperatureToRGB} from './lib/colorTempToRGB';
import './App.css';

//From https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

function App() {
    const [targetTemp, setTargetTemp] = useState(1850);
    const [temp, setTemp] = useState(1850);
    const [page, setPage] = useState(0);
    const [delay, setDelay] = useState(1);
    const [disc, setDisc] = useState('Candle');
    const [discBuffer, setDiscBuffer] = useState('Candle');
    const [change, setChange] = useState(false);

    useInterval(() => {
        if (temp < targetTemp) {
            setChange(true);
            setTemp(temp + 2);
        } else if (temp > targetTemp) {
            setChange(true);
            setTemp(temp - 2);
        } else {
            if (change) {
                setChange(false);
                setDelay(3e8);
                setDisc(discBuffer);
            }
        }
    }, delay)


    function buttonClicked() {
        switch (page) {
            case 0:
                setTargetTemp(2400);
                setDelay(10);
                setDiscBuffer('Incandescent Light / High Pressure Sodium');
                break;
            case 1:
                setTargetTemp(4100);
                setDelay(5);
                setDiscBuffer('Moonlight');
                break;
            case 2:
                setTargetTemp(5000);
                setDelay(10);
                setDiscBuffer('Daylight');
                break;
            case 3:
                setTargetTemp(6500);
                setDelay(10);
                setDiscBuffer('White LED Streetlights');
                break;
            default:
                setTargetTemp(1000);
                setDelay(2);
                setDiscBuffer('Warmer Color');
                break;
        }
        setPage(page + 1);
    }

    let rgb = colorTemperatureToRGB(temp);

    return (
        <div className="App">
            <header className="App-header" style={{background : `rgb(${rgb.r},${rgb.g},${rgb.b})` }}>
                <button onClick={buttonClicked} style={{'padding': '1em'}}>Continue</button>
                <p>{temp}K</p>
                <p>{disc}</p>
                <p>{JSON.stringify(rgb)}</p>
            </header>
        </div>
    );
}

export default App;
