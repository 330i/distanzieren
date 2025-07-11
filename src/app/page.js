"use client"

import { useState } from "react";
import ImageViewer from "../../components/ImageViewer";

export default function Home() {
    const [img, setImg] = useState();

    return (
        <div>
            {img ? 
            <ImageViewer src={img} /> :
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setImg(URL.createObjectURL(e.target.files[0]))}
            />}
        </div>
    );
}
