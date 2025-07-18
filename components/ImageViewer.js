"use client"

import clsx from "clsx";
import { useState } from "react";
import LineInfo from "./LineInfo";

export default function ImageViewer({ src }) {
    // Line states
    const [lines, setLines] = useState([]);
    const [lineHitbox, setLineHitbox] = useState([]);
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

    return (
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

            onKeyDown={(e) => {
                if(e.key == 'Escape') {
                    setCurrLineStart(null)
                    setCurrLineEnd(null)
                }
            }}
        >
            {selectedLine && <LineInfo lineId={selectedLine} lineInfo={lineInfo} setLineInfo={setLineInfo} />}
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
                            setLines(lines.concat(
                                <line
                                    key={lineId}
                                    x1={currLineStart.x}
                                    y1={currLineStart.y}
                                    x2={currLineEnd.x}
                                    y2={currLineEnd.y}
                                    stroke="black"
                                    strokeWidth={3}
                                />
                            ));
                            setLineHitbox(lineHitbox.concat(
                                <line
                                    key={`${lineId}-hitbox`}
                                    x1={currLineStart.x}
                                    y1={currLineStart.y}
                                    x2={currLineEnd.x}
                                    y2={currLineEnd.y}
                                    stroke="transparent"
                                    strokeWidth={15}
                                    onClick={() => {
                                        setSelectedLine(lineId)
                                    }}
                                />
                            ));
                            setLineInfo({...lineInfo, [lineId]: {
                                x1: currLineStart.x,
                                y1: currLineStart.y,
                                x2: currLineEnd.x,
                                y2: currLineEnd.y
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
                    {lines}
                    {lineHitbox}
                    {Object.entries(lineInfo).map(([lineId, entry]) => entry.distance &&
                        <text
                            key={lineId}
                            x={(entry.x1 + entry.x2) / 2}
                            y={(entry.y1 + entry.y2) / 2}
                            onClick={() => {
                                setSelectedLine(lineId)
                            }}
                        >
                            {entry.distance}
                        </text>
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
    );
}