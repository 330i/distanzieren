"use client"

import clsx from "clsx";
import { useState } from "react";

export default function ImageViewer({ src }) {
    // Line states
    const [lines, setLines] = useState([]);
    const [currLineStart, setCurrLineStart] = useState();
    const [currLineEnd, setCurrLineEnd] = useState();

    // Image control states
    const [zoom, setZoom] = useState(100);
    const [offset, setOffset] = useState({x: window.innerWidth/2 - window.innerHeight/2, y: 0});
    const [isDragging, setIsDragging] = useState(false);
    const [prevMousePosition, setPrevMousePosition] = useState();

    let isTicking = false;

    return (
        <div
            className="select-none"

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
                            setLines(lines.concat(
                                <line key={`length-line${lines.length}`} x1={currLineStart.x} y1={currLineStart.y} x2={currLineEnd.x} y2={currLineEnd.y} stroke="black" />
                            ));
                            setCurrLineStart(null)
                            setCurrLineEnd(null)
                        }
                        else {
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
                    {currLineEnd && <line x1={currLineStart.x} y1={currLineStart.y} x2={currLineEnd.x} y2={currLineEnd.y} stroke="black" />}
                </svg>
            </div>
        </div>
    );
}