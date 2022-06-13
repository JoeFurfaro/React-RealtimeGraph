import React, { useState, useEffect, useRef } from "react";
import "../styles/react-realtime-graph.scss";
import WebFont from 'webfontloader';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faPause } from '@fortawesome/free-solid-svg-icons'

export const RealtimeGraph = ({
    title,
    datasets,
    defaultXDuration = 30,
    defaultXUnit = "seconds",
}) => {

    const [xDuration, setXDuration] = useState(defaultXDuration);
    const [xUnit, setXUnit] = useState(defaultXUnit);
    const [svgHeight, setSvgHeight] = useState(0);

    const headerRow = useRef({ style: { height: -1 } });

    useEffect(() => {
        WebFont.load({
            google: {
                families: ['Inter']
            }
        });
    }, []);

    useEffect(() => {
        setSvgHeight(headerRow.current.style.height);
        console.log(svgHeight);
    }, [headerRow.current.style]);

    return (
        <div className="rg-main">
            <div className="rg-header-row" ref={headerRow} >
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

            </div>
        </div >
    );
}