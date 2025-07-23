"use client"

import { useEffect, useState } from "react";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { grey } from "@mui/material/colors";
import clsx from "clsx";

export default function LineInfo({ lineId, lineInfo, setLineInfo }) {
    // Form control states
    const [distance, setDistance] = useState('distance' in lineInfo[lineId] ? lineInfo[lineId].distance : '');

    // Image control states
    const [offset, setOffset] = useState({x: 16, y: 16});
    const [isDragging, setIsDragging] = useState(false);
    const [prevMousePosition, setPrevMousePosition] = useState();

    let isTicking = false;
    useEffect(() => setDistance('distance' in lineInfo[lineId] ? lineInfo[lineId].distance : ''), [lineId])

    const setLineDistance = () => {
        if(distance != '') {
            setLineInfo({...lineInfo, [lineId]: {
                ...lineInfo[lineId],
                distance: parseFloat(distance)
            }})
        }
        else {
            const {distance, ...lineInfoById} = lineInfo[lineId]
            setLineInfo({...lineInfo, [lineId]: {
                ...lineInfoById
            }})
        }
    }

    return (
        <div
            className={clsx("absolute w-screen h-screen", isDragging && "z-50 select-none")}
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
            <div
                className="absolute z-50"
                style={{
                    left: `${offset.x}px`,
                    top: `${offset.y}px`
                }}
            >
                {lineId &&
                <div
                    className="min-w-[250px] max-w-[25vw] flex flex-col pb-6 border-2 rounded-lg bg-zinc-800 border-gray-600"
                >
                    <div
                        className="w-full flex justify-center items-center border-b-2 border-gray-600"

                        // Drag control
                        onMouseDown={() => {
                            setIsDragging(true);
                        }}
                    >
                        <MoreHorizIcon sx={{ color: grey[600] }} />
                    </div>
                    <div className="flex flex-col px-8 pt-4 gap-2">
                        <span className='text-lg'>Editing {lineId}</span>
                        <span className="text-zinc-300">X1: <span className="font-bold">{lineInfo[lineId].x1}</span></span>
                        <span className="text-zinc-300">Y1: <span className="font-bold">{lineInfo[lineId].y1}</span></span>
                        <span className="text-zinc-300">X2: <span className="font-bold">{lineInfo[lineId].x2}</span></span>
                        <span className="text-zinc-300">Y2: <span className="font-bold">{lineInfo[lineId].y2}</span></span>
                        <input
                            className="px-3 py-2 border-2 outline-0 text-zinc-300 bg-zinc-700/25 border-zinc-700 rounded-lg disabled:text-zinc-300/50 disabled:bg-zinc-700/25 disabled:border-zinc-700/25 focus:border-blue-500"
                            type="number"
                            placeholder="Distance"
                            value={distance}
                            onChange={(e) => setDistance(e.target.value)}
                            onKeyDown={(e) => {
                                if(e.key == 'Enter') {
                                    setLineDistance.apply();
                                }
                            }}
                        />
                    </div>
                </div>}
            </div>
        </div>
    );
}