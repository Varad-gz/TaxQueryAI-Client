'use client';

import { useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { toPng } from 'html-to-image';

export function TaxBarChart({ rawData }) {
    const chartRef = useRef(null);

    const chartData = Object.entries(rawData)
        .filter(([name]) => name !== 'Total')
        .map(([name, value]) => ({
            name,
            value: Number(value.toFixed(2)),
        }));

    const longestLabelLength = Math.max(...chartData.map(({ name }) => name.length));
    const xAxisHeight = longestLabelLength * 5;

    const handleDownload = async () => {
        if (!chartRef.current) return;

        const dataUrl = await toPng(chartRef.current, { backgroundColor: 'white' });
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'TaxChart.png';
        link.click();
    };

    return (
        <div className='flex flex-col items-end'>
            <button
                onClick={handleDownload}
                className="text-sm bg-primaryAccent text-white px-3 py-1 rounded hover:bg-blue-600"
            >
                Download Chart
            </button>
            <div className="w-full overflow-x-auto">
                <div ref={chartRef}
                    style={{
                        width: `${chartData.length * 60}px`,
                    }}
                >
                    <BarChart
                        width={chartData.length * 60}
                        height={500}
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 10, bottom: 80 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            interval={0}
                            height={xAxisHeight}
                        />
                        <YAxis
                            label={{ value: 'Crore ₹', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip />
                        <Bar
                            dataKey="value"
                            name="Tax Collection (Cr)"
                            fill="#3C82F6"
                            label={{
                                position: 'top',
                                angle: 0,
                                fill: '#000',
                                fontSize: 12,
                                formatter: (value) => `${value}`,
                            }}
                        />
                    </BarChart>
                </div>
            </div>
        </div>
    );
}

export function KPIIndicator({ title, value, year, isCurrency, isPredicted = false }) {

    const toTitleCase = (str) => str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1));

    return (
        <div className="flex flex-col items-center justify-center p-6 rounded-lg shadow bg-white border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">
                {toTitleCase(title)}
                {isPredicted && <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Predicted</span>}
            </h3>
            <div className="text-4xl font-bold mt-3 text-blue-500">
                {isCurrency ? `₹ ${value} Cr` : `${value}%`}
            </div>
            <p className="text-gray-600 mt-2">
                Year: {year}
            </p>
        </div>
    );
}