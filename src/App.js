import React, {useState} from 'react';
import {Transition} from 'react-transition-group'
import {colorTemperatureToRGB} from './lib/colorTempToRGB';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Fullscreen from 'react-full-screen';
import {faGithub} from '@fortawesome/free-brands-svg-icons'
import {faExpand, faPlayCircle, faForward, faRedoAlt} from '@fortawesome/free-solid-svg-icons'

import {useInterval} from './useInterval';
import {text1850, text1500, text2400, text2700, text3000, text4100, text5000, text6500, text_decrease} from './quotes';
import './App.css';

const duration = 300;
const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
}
const transitionStyles = {
    entering: {opacity: 1},
    entered: {opacity: 1},
    exiting: {opacity: 0},
    exited: {opacity: 0},
};

function App() {
    const [targetTemp, setTargetTemp] = useState(1850);
    const [temp, setTemp] = useState(1850);
    const [page, setPage] = useState(0);
    const [delay, setDelay] = useState(3e8);
    const [disc, setDisc] = useState(text1850);
    const [discBuffer, setDiscBuffer] = useState('');
    const [change, setChange] = useState(false);
    const [slider, setSlider] = useState(false);
    const [isFull, setIsFull] = useState(false);

    useInterval(() => {
        if (!slider) {
            if (temp < targetTemp) {
                setTemp(temp + 2);
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
                    setDiscBuffer(text2400);
                    setChange(true);
                    setDelay(15);
                    break;
                case 1:
                    setTargetTemp(2700);
                    setDiscBuffer(text2700);
                    setChange(true);
                    setDelay(15);
                    break;
                case 2:
                    setTargetTemp(3000);
                    setDiscBuffer(text3000);
                    setChange(true);
                    setDelay(15);
                    break;
                case 3:
                    setTargetTemp(4100);
                    setDiscBuffer(text4100);
                    setChange(true);
                    setDelay(10);
                    break;
                case 4:
                    setTargetTemp(5000);
                    setDiscBuffer(text5000);
                    setChange(true);
                    setDelay(10);
                    break;
                case 5:
                    setTargetTemp(6500);
                    setDiscBuffer(text6500);
                    setChange(true);
                    setDelay(5);
                    break;
                case 6:
                    setTargetTemp(1500);
                    setDisc(text_decrease);
                    setDiscBuffer(text1500);
                    setChange(true);
                    setDelay(15);
                    break;
                default:
                    setTargetTemp(1850);
                    setTemp(1850);
                    setPage(0);
                    setDelay(3e8);
                    setDisc(text1850);
                    setDiscBuffer('');
                    setChange(false);
                    setSlider(false);
                    return;
            }
            setPage(page + 1);
        } else {
            setDelay(0);
        }
    }

    let rgb = colorTemperatureToRGB(temp);

    let btn_disable = change && !delay;

    return (
        <div className="App">
            <Fullscreen enabled={isFull} onChange={f => setIsFull(f)}>
                <div className="App-header" style={{background: `rgb(${rgb.r},${rgb.g},${rgb.b})`}}>
                    <div>
                        <div className="k-meter">{temp}K</div>
                        <div style={{fontSize: 'large', opacity: temp < 1000 ? 1 : 0}}>
                            {temp === 500 ? 'You found the secret red flashlight!' : '*Color might not be accurate under 1000K' }
                        </div>
                    </div>
                    <div className="main-area">
                        <Transition timeout={duration} in={!change || temp > targetTemp}>
                            {state => (
                                <div
                                    style={{
                                        ...defaultStyle,
                                        ...transitionStyles[state]
                                    }}>
                                    <div className="disc">
                                        <span>{disc}</span>
                                    </div>
                                    <div className="slideContainer" style={slider ? {} : {display: 'none'}}>
                                        <input type="range" min="500" max="6500" className="slider"
                                               id="myRange" value={temp} onChange={(event) => {
                                            setTemp(parseInt(event.target.value))
                                        }}
                                               disabled={!slider}/>
                                    </div>
                                </div>
                            )}
                        </Transition>
                        <FontAwesomeIcon className="fab btn"
                                         disabled={btn_disable}
                                         style={{opacity : btn_disable ? 0 : 1}}
                                         icon={slider ? faRedoAlt : (change ? faForward : faPlayCircle)}
                                         onClick={buttonClicked}/>
                    </div>
                </div>
                <a href="https://github.com/DEDZTBH/a-tour-of-color-temperature">
                    <FontAwesomeIcon className="fab github" icon={faGithub}/>
                </a>
            </Fullscreen>
            <FontAwesomeIcon className="fab full-screen" icon={faExpand} onClick={() => {
                setIsFull(true);
            }}/>
        </div>
    );
}

export default App;
