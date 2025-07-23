"use client"

import clsx from "clsx";
import { useEffect, useState } from "react";
import LineInfo from "./LineInfo";

export default function ImageViewer({ src }) {
    // Line states
    const [lineInfo, setLineInfo] = useState({});
    const [currLineStart, setCurrLineStart] = useState();
    const [currLineEnd, setCurrLineEnd] = useState();
    const [selectedLine, setSelectedLine] = useState();

    // Image control states
    const [zoom, setZoom] = useState(100);
    const [offset, setOffset] = useState({x: window.innerWidth/2 - window.innerHeight/2, y: 0});
    const [isDragging, setIsDragging] = useState(false);
    const [prevMousePosition, setPrevMousePosition] = useState();
    let isTicking = false;

    // Per pixel calculation
    const [distancePerPixel, setDistancePerPixel] = useState();

    useEffect(() => {
        const lines = Object.values(lineInfo).filter((e) => 'distance' in e)
        setDistancePerPixel(lines.length ? (lines.reduce((a, c) => a + c.distance, 0) / lines.reduce((a, c) => a + c.pixels, 0)) : 0)
        console.log(distancePerPixel)
    }, [lineInfo])

    return (
        <div>
            {selectedLine && <LineInfo lineId={selectedLine} lineInfo={lineInfo} setLineInfo={setLineInfo} />}
            <div
                className="select-none"
                tabIndex={-1}

                // Zoom control
                onWheel={(e) => {
                    const bounds = document.getElementById('viewer').getBoundingClientRect();
                    setZoom(zoom * (1 - e.deltaY * 0.001));
                    setOffset({x: offset.x + e.deltaY * 0.001 * (e.clientX - bounds.left), y: offset.y + e.deltaY * 0.001 * (e.clientY - bounds.top)});
                }}

                // Drag control
                onMouseDown={() => {
                    setIsDragging(true);
                }}
                onMouseMove={(e) => {
                    if (!isTicking) requestAnimationFrame(() => {
                        isTicking = false;
                        if(!isDragging) return;
                        if(prevMousePosition) setOffset({x: offset.x + e.clientX - prevMousePosition.x, y: offset.y + e.clientY - prevMousePosition.y});
                        setPrevMousePosition({x: e.clientX, y: e.clientY});
                    });
                    isTicking = true;
                }}
                onMouseUp={() => {
                    setIsDragging(false);
                    setPrevMousePosition(null);
                }}
                
                // Cancel line control
                onKeyDown={(e) => {
                    if(e.key == 'Escape') {
                        setCurrLineStart(null)
                        setCurrLineEnd(null)
                    }
                }}
            >
                <div className="relative w-screen h-screen overflow-clip">
                    <svg
                        id="viewer"
                        viewBox={`0 0 1000 1000`}
                        className={clsx("absolute h-full aspect-square", prevMousePosition && 'pointer-events-none')}
                        style={{
                            height: `${zoom}%`,
                            left: `${offset.x}px`,
                            top: `${offset.y}px`
                        }}

                        // Line control
                        onClick={(e) => {
                            const bounds = e.currentTarget.getBoundingClientRect();
                            if(currLineStart) {
                                const lineId = `line${Date.now()}`;
                                setLineInfo({...lineInfo, [lineId]: {
                                    x1: currLineStart.x,
                                    y1: currLineStart.y,
                                    x2: currLineEnd.x,
                                    y2: currLineEnd.y,
                                    pixels: Math.sqrt(Math.pow(currLineEnd.x - currLineStart.x, 2) + Math.pow(currLineEnd.y - currLineStart.y, 2))
                                }});
                                setCurrLineStart(null)
                                setCurrLineEnd(null)
                            }
                            else if(e.ctrlKey) {
                                setCurrLineStart({x: (e.clientX - bounds.left) * 1000 / bounds.width, y: (e.clientY - bounds.top) * 1000 / bounds.height})
                            }
                        }}
                        onMouseMove={(e) => {
                            if(!currLineStart) return;
                            const bounds = e.currentTarget.getBoundingClientRect();
                            setCurrLineEnd({x: (e.clientX - bounds.left) * 1000 / bounds.width, y: (e.clientY - bounds.top) * 1000 / bounds.height});
                        }}
                    >
                        <image href={src} width={1000} height={1000} />
                        {/* Very much trading performance for flexibility */}
                        {Object.entries(lineInfo).map(([lineId, entry]) => [
                            <line
                                key={`${lineId}-hitbox`}
                                x1={entry.x1}
                                y1={entry.y1}
                                x2={entry.x2}
                                y2={entry.y2}
                                stroke="transparent"
                                strokeWidth={15}
                                onClick={() => {
                                    setSelectedLine(lineId)
                                }}
                            />,
                            <line
                                key={lineId}
                                x1={entry.x1}
                                y1={entry.y1}
                                x2={entry.x2}
                                y2={entry.y2}
                                stroke={clsx(entry.distance ? "#00FF00" : "black")}
                                strokeWidth={3}
                            />]
                        )}
                        {Object.entries(lineInfo).map(([lineId, entry]) => 
                            entry.distance ?
                            <text
                                key={`${lineId}-distance`}
                                x={(entry.x1 + entry.x2) / 2}
                                y={(entry.y1 + entry.y2) / 2}
                                fill="#00FF00"
                                onClick={() => {
                                    setSelectedLine(lineId)
                                }}
                            >
                                {entry.distance}
                            </text> :
                            (distancePerPixel &&
                            <text
                                key={`${lineId}-distance`}
                                x={(entry.x1 + entry.x2) / 2}
                                y={(entry.y1 + entry.y2) / 2}
                                fill="white"
                                stroke="black"
                                strokeWidth={0.5}
                                onClick={() => {
                                    setSelectedLine(lineId)
                                }}
                            >
                                {(distancePerPixel * entry.pixels).toFixed(3)}
                            </text>)
                        )}
                        {currLineEnd &&
                        <line
                            x1={currLineStart.x}
                            y1={currLineStart.y}
                            x2={currLineEnd.x}
                            y2={currLineEnd.y}
                            stroke="black"
                            strokeWidth={3}
                        />}
                    </svg>
                </div>
            </div>
        </div>
    );
}