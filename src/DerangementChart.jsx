import React, { useEffect, useRef } from 'react';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(annotationPlugin, LineController, LineElement, PointElement, LinearScale, CategoryScale);

const expectedMean = 1 - 1/Math.E;
const defaultOutcomesLength = 10;

function DerangementChart({ outcomes, runningAverage }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);
    const pointColors = outcomes.map(value => value === 1 ? 'green' : 'red');

    useEffect(() => {

        const xMaxValue = Math.max(outcomes.length, defaultOutcomesLength);

        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            
            if (chartRef.current) {
                chartRef
                .current.destroy();  // Destroy the old chart if it exists
            }

            const expectedMeanData = Array(xMaxValue).fill(expectedMean);

            const chartData = {
                labels: Array(xMaxValue).fill().map((_, i) => i + 1), 
                datasets: [
                    {
                        label: 'Outcome',
                        data: outcomes,
                        fill: false,
                        showLine: false, // This will hide the line
                        pointBackgroundColor: pointColors,
                        pointBorderColor: pointColors, 
                        pointRadius: 4  // adjust the size as needed
                    },
                    {
                        label: 'Running Average (%)',
                        data: runningAverage,
                        fill: false,
                        pointRadius: 0,  
                        borderColor: '#000080',  
                    },
                    {
                        label: 'Expected mean',
                        data: expectedMeanData,
                        borderColor: 'grey',        
                        pointRadius: 0,  
                        borderDash: [5, 5]  // Dashed line
                                
                    }
                ]
            };

            chartRef.current = new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: {
                    plugins: {
                        legend: {
                            display: true,  // By default, it's true. Set to false to hide the legend.
                            position: 'top',  // Can be 'top', 'left', 'bottom', 'right'
                            labels: {
                                color: 'rgb(255, 99, 132)',  // Color of the legend labels
                                // Other customization options can go here
                            }
                        },
                        
                        annotation: {
                            annotations: {
                                label1: {
                                    type: 'label',
                                    xValue: xMaxValue-xMaxValue*0.18,  // just outside the x-range
                                    yValue: expectedMean + 0.05,
                                    backgroundColor: 'rgba(245,245,245,0)',  // set alpha to 0 to make the background transparent
                                    content: ['Expected mean: 1-1/e ≈ 63.2%'],
                                    font: {
                                        size: 15
                                    },
                                    color: 'grey',
                                },                            
                                notDerangement: {
                                    type: 'label',
                                    xValue: 'start',
                                    yValue: 0.95,          
                                    content: 'Not a derangement',
                                    color: 'green',
                                    font: {
                                        size: 15
                                    }
                                },
                                derangement: {
                                    type: 'label',
                                    xValue: 'start',
                                    yValue: 0.05,          
                                    content: 'Derangement',
                                    color: 'red',
                                    font: {
                                        size: 15
                                    }                            
                                }                               
                            }
                        }
                    },
                    animation: false,
                    scales: {
                        x: { 
                            title: {
                                display: true,
                    
                                font: {
                                    size: 20
                                }
                            },
                            type: 'linear',
                            min: 1,  // starting point
                            max: xMaxValue
                        },
                        y: { 
                            type: 'linear',
                     
                            ticks: {
                                min: 0,
                                max: 1,
                                autoSkip: false,
                                stepSize: 0.1,
                                beginAtZero: true,
                                callback: function(value) {
                                    const allowedValues = [0, 0.2, 0.4, 0.6, 0.8, 1];
                                    return allowedValues.includes(value) ? value : '';
                                }
                            }
                        }
                        
                    }
                }
            });
        }
        }, [outcomes, runningAverage]);

    
    return <canvas ref={canvasRef} />;
}

export default DerangementChart;
