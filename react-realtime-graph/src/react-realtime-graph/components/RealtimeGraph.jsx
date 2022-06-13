import React, { useState, useEffect, useRef } from "react";
import "../styles/react-realtime-graph.scss";
import WebFont from 'webfontloader';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faPause, faPlay } from '@fortawesome/free-solid-svg-icons'

export const RealtimeGraph = ({
    title,
    data,
    datasets,
    defaultXDuration = 30,
    defaultXUnit = "seconds",
    defaultYMin = -1,
    defaultYMax = 1,
    defaultAutoY = true,
    decimalPlaces = 2,
}) => {
    const [xDuration, setXDuration] = useState(defaultXDuration);
    const [xUnit, setXUnit] = useState(defaultXUnit);
    const [points, setPoints] = useState(null);
    const [svgWidth, setSvgWidth] = useState(0);
    const [svgHeight, setSvgHeight] = useState(0);
    const [yMin, setYMin] = useState(defaultYMin);
    const [yMax, setYMax] = useState(defaultYMax);
    const [mousePos, setMousePos] = useState(null);
    const [paused, setPaused] = useState(false);

    const svgCanvas = useRef({});

    const rounded = (n, places = decimalPlaces) => {
        let pow = Math.pow(10, places);
        let rounded = Math.round(pow * n) / pow;
        return rounded.toFixed(places);
    }

    const xTicks = 4;
    const yTicks = 4;
    const hp = 0.75; // Height proportion
    const wp = 0.8; // Width proportion
    const mt = 20;

    useEffect(() => {
        WebFont.load({
            google: {
                families: ['Inter']
            }
        });
        setPoints(datasets);

        updateSVGDimensions();

        window.addEventListener('resize', updateSVGDimensions);

        return () => {
            window.addEventListener('resize', updateSVGDimensions);
        };
    }, []);

    const updateSVGDimensions = () => {
        setSvgWidth(svgCanvas.current.width.baseVal.value);
        setSvgHeight(svgCanvas.current.height.baseVal.value);
    }

    useEffect(() => {
        if (points === null)
            return () => { };
        for (let dataset of Object.keys(data)) {
            if (!("data" in points[dataset]))
                points[dataset].data = [];
            points[dataset].data.push({ time: Date.now(), value: data[dataset] });
        }
        setPoints(points);
    }, [data]);

    return (
        <div className="rg-main">
            <div className="rg-header-row">
                <div className="rg-title-box">
                    <h1 className="rg-text rg-graph-title">
                        {title}&nbsp;
                        <span className="rg-x-range-title">
                            {`(Showing past ${xDuration} ${xUnit} of data)`}
                        </span>
                    </h1>
                </div>
                <div className="rg-control-buttons">
                    <button type="text" className="rg-control-button" onClick={() => setPaused(!paused)}>
                        <FontAwesomeIcon icon={paused ? faPlay : faPause} />
                    </button>
                    <button type="text" className="rg-control-button">
                        <FontAwesomeIcon icon={faCog} />
                    </button>
                </div>
            </div>
            <div className="rg-svg-container" onLoad={updateSVGDimensions}>
                <svg ref={svgCanvas} className="rg-svg" width="100%" height="100%">
                    <rect
                        x={svgWidth * ((1 - wp) / 2)}
                        y={mt}
                        width={svgWidth * wp}
                        height={svgHeight * hp}
                        style={{ fill: "#FFFFFF" }}
                        onMouseMove={(e) => {
                            let rect = e.target.getBoundingClientRect();
                            let curX = e.clientX - rect.left;
                            let curY = e.clientY - rect.top;
                            setMousePos({ x: curX, y: curY });
                        }}
                        onMouseOut={() => {
                            setMousePos(null);
                        }}
                    />
                    {
                        [...Array(xTicks).keys()].map((i) => {
                            const x = svgWidth * wp + ((1 - wp) * svgWidth / 2) - (i * (svgWidth * wp / (xTicks - 1)));
                            return (
                                <>
                                    <line
                                        x1={x}
                                        y1={svgHeight * hp + mt + 5}
                                        x2={x}
                                        y2={svgHeight * hp + mt - 5}
                                        stroke="#6C6C6C"
                                    />
                                    <text
                                        x={x}
                                        y={svgHeight * hp + mt + 25}
                                        fill="#6C6C6C"
                                        textAnchor="middle">
                                        {"-" + rounded(xDuration / (xTicks - 1) * i, 1) + (xUnit === "seconds" ? "s" : "min")}
                                    </text>
                                </>

                            );
                        })
                    }
                    {
                        [...Array(yTicks).keys()].map((i) => {
                            const y = (hp * svgHeight + mt) - (i * (svgHeight * hp / (yTicks - 1)));
                            return (
                                <>
                                    <line
                                        x1={(svgWidth * (1 - wp) / 2) - 5}
                                        y1={y}
                                        x2={(svgWidth * (1 - wp) / 2) + 5}
                                        y2={y}
                                        stroke="#6C6C6C" />
                                    <text
                                        x={(svgWidth * (1 - wp) / 2) - 20}
                                        y={y}
                                        fill="#6C6C6C"
                                        textAnchor="end"
                                        alignmentBaseline="middle">
                                        {rounded(yMin + (i * (yMax - yMin) / (yTicks - 1)))}
                                    </text>
                                </>

                            );
                        })
                    }
                    {
                        mousePos === null ? null : (
                            <>
                                <line
                                    x1={(svgWidth * (1 - wp) / 2) + mousePos.x}
                                    y1={svgHeight * hp + mt + 40}
                                    x2={(svgWidth * (1 - wp) / 2) + mousePos.x}
                                    y2={mt + mousePos.y}
                                    stroke="#949494"
                                    strokeDasharray={"5,5"}
                                    style={{ pointerEvents: "none" }}
                                />
                                <text
                                    x={(svgWidth * (1 - wp) / 2) + mousePos.x}
                                    y={svgHeight * hp + mt + 55}
                                    fill="#949494"
                                    textAnchor="middle"
                                    alignmentBaseline="middle">
                                    {"-" + rounded((1 - mousePos.x / (svgWidth * wp)) * xDuration, 1) + (xUnit === "seconds" ? "s" : "min")}
                                </text>
                                <line
                                    x1={(svgWidth * (1 - wp) / 2) + mousePos.x}
                                    y1={mt + mousePos.y}
                                    x2={(svgWidth * (1 - wp) / 2) - 50}
                                    y2={mt + mousePos.y}
                                    stroke="#949494"
                                    strokeDasharray={"5,5"}
                                    style={{ pointerEvents: "none" }}
                                />
                                <text
                                    x={(svgWidth * (1 - wp) / 2) - 60}
                                    y={mt + mousePos.y}
                                    fill="#949494"
                                    textAnchor="end"
                                    alignmentBaseline="middle">
                                    {rounded((svgHeight * hp - mousePos.y) / (svgHeight * hp) * (yMax - yMin) + yMin)}
                                </text>
                            </>
                        )
                    }
                    {
                        points === null ? null : Object.keys(points).map((dataset) => {
                            let dataPoints = points[dataset].data;
                            if (typeof points[dataset].data === 'undefined')
                                return null;
                            return (
                                <>
                                    {
                                        dataPoints.map((p) => {
                                            let minTime = 0;
                                            if (xUnit === "seconds") {
                                                minTime = Date.now() - xDuration * 1000;
                                            } else {
                                                minTime = Date.now() - xDuration * 60 * 1000;
                                            }
                                            if (p.time > minTime) {
                                                let now = Date.now();
                                                let x = svgWidth * ((1 - wp) / 2) + (svgWidth * wp) * ((p.time - minTime) / (now - minTime));
                                                let y = mt + (svgHeight * hp) * (1 - ((p.value - yMin) / (yMax - yMin)));
                                                // console.log(y);
                                                return (
                                                    <circle
                                                        cx={x}
                                                        cy={y}
                                                        r={2}
                                                        fill={"#FF0000"}
                                                        style={{ pointerEvents: "none" }}
                                                    />
                                                );
                                            }
                                        })
                                    }
                                </>
                            );
                        })
                    }
                </svg>
            </div>
        </div >
    );
}