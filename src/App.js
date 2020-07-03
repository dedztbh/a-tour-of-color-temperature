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
    const [delay, setDelay] = useState(3e8);
    const [disc, setDisc] = useState('Candle');
    const [discBuffer, setDiscBuffer] = useState('Candle');
    const [change, setChange] = useState(false);
    const [slider, setSlider] = useState(false);

    useInterval(() => {
        if (!slider) {
            if (temp < targetTemp) {
                setTemp(temp + 2);
                switch (temp) {
                    case 5000:
                        setDisc('Daylight')
                        break;
                    default:
                }
            } else if (temp > targetTemp) {
                setTemp(temp - 2);
            } else {
                if (change) {
                    setChange(false);
                    setDelay(3e8);
                    setDisc(discBuffer);
                    switch (temp) {
                        case 1500:
                            setSlider(true);
                            break;
                        default:
                    }
                }
            }
        }
    }, delay)


    function buttonClicked() {
        if (!change) {
            switch (page) {
                case 0:
                    setTargetTemp(2400);
                    setDelay(10);
                    setDiscBuffer('Incandescent Light & High Pressure Sodium streetlight');
                    setChange(true);
                    break;
                case 1:
                    setTargetTemp(3000);
                    setDelay(10);
                    setDiscBuffer('Maximum color temperature for street lighting according to AMA\'s recommendation');
                    setChange(true);
                    break;
                case 2:
                    setTargetTemp(4100);
                    setDelay(5);
                    setDiscBuffer('Moonlight');
                    setChange(true);
                    break;
                case 3:
                    setTargetTemp(6500);
                    setDelay(10);
                    setDiscBuffer('LED streetlights');
                    setChange(true);
                    break;
                case 4:
                    setTargetTemp(1500);
                    setDelay(10);
                    setDiscBuffer('Play with color temperature!');
                    setChange(true);
                    break;
                default:
            }
            setPage(page + 1);
        }
    }

    let rgb = colorTemperatureToRGB(temp);

    return (
        <div className="App">
            <header className="App-header" style={{background : `rgb(${rgb.r},${rgb.g},${rgb.b})` }}>
                <div style={{minHeight: '60vh'}}>
                </div>
                <p>{temp}K</p>
                <p>{disc}</p>
                <div className="slideContainer" style={slider ? {} : {}}>
                    <input type="range" min="1000" max="6500" className="slider"
                           id="myRange" value={temp} onChange={(event) => {setTemp(parseInt(event.target.value))}}
                           disabled={!slider} />
                </div>
                <button onClick={buttonClicked}>Continue</button>
            </header>
        </div>
    );
}

export default App;
