'use client'

import React, { useEffect, useState } from "react";
import Papa from "papaparse";

import Tooltip from "./Tooltop";

import { FaFileDownload } from "react-icons/fa";


const CsvViewer = () => {
    const [fileList] = useState(["Pune", "Chennai", "Erode", "Jabalpur", "Solapur", "Thanjavur", "Tiruchirappalli"]);
    const [selectedFile, setSelectedFile] = useState(fileList[0]);
    const [data, setData] = useState([]);

    useEffect(() => {
        if (!selectedFile) return;

        fetch(`/${selectedFile}.csv`)
            .then((response) => response.text())
            .then((csvText) => {
                const parsedData = Papa.parse(csvText, { header: true, skipEmptyLines: true });
                setData(parsedData.data);
            })
            .catch((error) => console.error("Error loading CSV:", error));
    }, [selectedFile]);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.value);
    };

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = `/${selectedFile}.csv`;
        link.download = selectedFile;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-[20px] flex flex-col">
            <div className="flex mb-[20px] bg-gray-200 w-fit whitespace-nowrap px-[20px] py-[10px] rounded-md">
                <select onChange={handleFileChange} value={selectedFile} className="text-[16px] font-bold outline-none cursor-pointer">
                    {fileList.map((file) => (
                        <option key={file} value={file}>
                            {file}
                        </option>
                    ))}
                </select>
                <button onClick={handleDownload} className="ml-[10px] text-[30px]">
                    <Tooltip text="Download CSV" pos={2}>
                        <FaFileDownload className='hover:text-primaryAccent hover:scale-110 transition ease-in-out delay-75 cursor-pointer' />
                    </Tooltip>
                </button>
            </div>
            <div>
                {data.length > 0 ? (
                    <table>
                        <thead>
                            <tr className="bg-gray-200">
                                {Object.keys(data[0]).map((key) => (
                                    <th key={key} className="border-[2px] border-black text-center px-[10px] py-[5px]">{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={index}>
                                    {Object.values(row).map((value, i) => (
                                        <td key={i} className="border-[2px] border-black text-center px-[10px] py-[5px]">{value}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Loading CSV data...</p>
                )}
            </div>
        </div>
    );
};

export default CsvViewer;
