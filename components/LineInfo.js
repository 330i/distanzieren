"use client"

import { useEffect, useState } from "react";

export default function LineInfo({ lineId, lineInfo, setLineInfo }) {
    const [distance, setDistance] = useState('distance' in lineInfo[lineId] ? lineInfo[lineId].distance : '');

    useEffect(() => setDistance('distance' in lineInfo[lineId] ? lineInfo[lineId].distance : ''), [lineId])

    const setLineDistance = () => {
        if(distance != '') {
            setLineInfo({...lineInfo, [lineId]: {
                ...lineInfo[lineId],
                distance: parseFloat(distance)
            }})
        }
    }

    return (
        <div className="absolute left-4 top-4 z-50">
            {lineId &&
            <div className="min-w-[250px] max-w-[25vw] flex flex-col px-8 py-6 gap-2 border-2 rounded-lg bg-zinc-800 border-gray-600">
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
                    onBlur={() => setLineDistance}
                    onKeyDown={(e) => {
                        if(e.key == 'Enter') {
                            setLineDistance.apply();
                        }
                    }}
                />
                <button
                    className='px-3 py-2 border-2 text-zinc-300 bg-zinc-700/25 border-zinc-700 rounded-lg disabled:text-zinc-300/50 disabled:bg-zinc-700/25 disabled:border-zinc-700/25 hover:text-white hover:border-zinc-300 active:text-black active:bg-white transition-all duration-75'
                    onClick={() => {}}
                >
                    Set Distance
                </button>
            </div>}
        </div>
    );
}