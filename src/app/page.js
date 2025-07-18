"use client"

import { useState } from "react";
import ImageViewer from "../../components/ImageViewer";
import { FileUpload } from "@mui/icons-material";

export default function Home() {
    const [img, setImg] = useState();

    return (
        <div
            className="bg-zinc-900"
        >
            {img ? 
            <ImageViewer src={img} /> :
            <div
                className="w-screen h-screen flex justify-center items-center"
            >
                <input
                    id="img-uploader"
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImg(URL.createObjectURL(e.target.files[0]))}
                />
                <label
                    htmlFor="img-uploader"
                    className="flex flex-col justify-center items-center gap-2"
                >
                    <div
                        className="p-4 rounded-2xl ring-2 ring-blue-400 shadow-lg shadow-blue-700/50 inset-shadow-sm inset-shadow-blue-700"
                    >
                        <FileUpload
                            color="white"
                            sx={{ fontSize: 48 }}
                        />
                    </div>
                    <span
                        className="text-xl"
                    >
                        Upload Image
                    </span>
                </label>
            </div>}
        </div>
    );
}
