import React, { useState, useEffect, useRef } from "react";
import "../styles/react-realtime-graph.scss";
import WebFont from 'webfontloader';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faPause } from '@fortawesome/free-solid-svg-icons'

export const RealtimeGraph = ({
    title,
    data,
    datasets,
    defaultXDuration = 30,
    defaultXUnit = "seconds",
}) => {
    const [xDuration, setXDuration] = useState(defaultXDuration);
    const [xUnit, setXUnit] = useState(defaultXUnit);
    const [points, setPoints] = useState(null);
    const [svgWidth, setSvgWidth] = useState(0);
    const [svgHeight, setSvgHeight] = useState(0);

    const svgCanvas = useRef({});

    const xTicks = 4;
    const hp = 0.8; // Height proportion
    const wp = 0.8; // Width proportion

    useEffect(() => {
        WebFont.load({
            google: {
                families: ['Inter']
            }
        });

        setPoints(datasets);

        let mainLoop = setInterval(() => {
            setSvgWidth(svgCanvas.current.width.baseVal.value);
            setSvgHeight(svgCanvas.current.height.baseVal.value);
        }, 10);

        return () => clearInterval(mainLoop);
    }, []);

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
                    <button type="text" className="rg-control-button">
                        <FontAwesomeIcon icon={faPause} />
                    </button>
                    <button type="text" className="rg-control-button">
                        <FontAwesomeIcon icon={faCog} />
                    </button>
                </div>
            </div>
            <div className="rg-svg-container">
                <svg ref={svgCanvas} className="rg-svg" width="100%" height="100%">
                    <rect x={svgWidth * ((1 - wp) / 2)} width={svgWidth * wp} height={svgHeight * hp} style={{ fill: "#FFFFFF" }} />
                    {
                        [...Array(xTicks).keys()].map((i) => {
                            const x = svgWidth * wp + ((1 - wp) * svgWidth / 2) - (i * (svgWidth * wp / (xTicks - 1)));
                            return (
                                <line
                                    x1={x}
                                    y1={svgHeight * hp + 5}
                                    x2={x}
                                    y2={svgHeight * hp - 5}
                                    stroke="#6C6C6C" />
                            );
                        })
                    }
                    {
                        [...Array(xTicks).keys()].map((i) => {
                            const x = svgWidth * wp + ((1 - wp) * svgWidth / 2) - (i * (svgWidth * wp / (xTicks - 1)));
                            return (
                                <text
                                    x={x}
                                    y={svgHeight * hp + 25}
                                    fill="#6C6C6C"
                                    text-anchor="middle">
                                    {"-" + (xDuration / (xTicks - 1) * i) + (xUnit === "seconds" ? "s" : "min")}
                                </text>

                            );
                        })
                    }
                </svg>
            </div>
        </div >
    );
}