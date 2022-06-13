import logo from './logo.svg';
import './App.css';
import "./styles/test.scss";
import { useEffect, useState } from 'react';

import { RealtimeGraph } from './react-realtime-graph/components/RealtimeGraph';

function App() {

    const f = (x) => {
        return Math.sin(x);
    }

    const [x, setX] = useState(0);
    const [curA, setCurA] = useState(f(0));

    useEffect(() => {
        const interval = setInterval(() => {
            setX(cx => cx + 0.0174533);
        }, 20);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setCurA(f(x));
    }, [x]);

    const datasets = [
        {
            "name": "sin(x)",
            "curVal": curA,
            "color": "#399e41",
        }
    ];

    return (
        <div className="main">
            <RealtimeGraph title={"A graph of y = sin x"} datasets={datasets} />
        </div>
    );
}

export default App;
