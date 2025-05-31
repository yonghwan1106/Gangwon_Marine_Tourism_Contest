// 고급 Chart.js 애니메이션 시스템
class EnhancedChartManager {
    constructor() {
        this.charts = {};
        this.animationQueue = [];
        this.defaultOptions = this.getDefaultChartOptions();
    }

    getDefaultChartOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 2000,
                easing: 'easeOutQuart',
                delay: (context) => {
                    let delay = 0;
                    if (context.type === 'data' && context.mode === 'default') {
                        delay = context.dataIndex * 100 + context.datasetIndex * 200;
                    }
                    return delay;
                },
                onProgress: (animation) => {
                    // 진행률 표시
                    const chart = animation.chart;
                    const progress = animation.currentStep / animation.numSteps;
                    chart.canvas.style.filter = `brightness(${0.8 + 0.2 * progress})`;
                },
                onComplete: (animation) => {
                    // 완료 시 효과
                    const chart = animation.chart;
                    chart.canvas.style.filter = 'brightness(1)';
                    this.addCompletionEffect(chart.canvas);
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#0EA5E9',
                    borderWidth: 2,
                    cornerRadius: 10,
                    displayColors: true,
                    callbacks: {
                        label: (context) => {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.parsed.y.toLocaleString();
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)',
                        lineWidth: 1
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)',
                        lineWidth: 1
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        };
    }

    addCompletionEffect(canvas) {
        canvas.style.transform = 'scale(1.02)';
        setTimeout(() => {
            canvas.style.transform = 'scale(1)';
        }, 200);
    }

    createEnhancedLineChart(ctx, data, options = {}) {
        const config = {
            type: 'line',
            data: {
                ...data,
                datasets: data.datasets.map((dataset, index) => ({
                    ...dataset,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    pointBackgroundColor: dataset.borderColor,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    fill: true,
                    backgroundColor: this.createGradient(ctx, dataset.borderColor)
                }))
            },
            options: {
                ...this.defaultOptions,
                ...options,
                plugins: {
                    ...this.defaultOptions.plugins,
                    ...options.plugins
                }
            }
        };

        return new Chart(ctx, config);
    }

    createEnhancedBarChart(ctx, data, options = {}) {
        const config = {
            type: 'bar',
            data: {
                ...data,
                datasets: data.datasets.map((dataset, index) => ({
                    ...dataset,
                    borderWidth: 2,
                    borderRadius: 4,
                    borderSkipped: false,
                    backgroundColor: this.createGradient(ctx, dataset.borderColor)
                }))
            },
            options: {
                ...this.defaultOptions,
                ...options,
                plugins: {
                    ...this.defaultOptions.plugins,
                    ...options.plugins
                }
            }
        };

        return new Chart(ctx, config);
    }

    createEnhancedDoughnutChart(ctx, data, options = {}) {
        const config = {
            type: 'doughnut',
            data: {
                ...data,
                datasets: data.datasets.map(dataset => ({
                    ...dataset,
                    borderWidth: 3,
                    borderColor: '#fff',
                    hoverBorderWidth: 5
                }))
            },
            options: {
                ...this.defaultOptions,
                ...options,
                cutout: '60%',
                plugins: {
                    ...this.defaultOptions.plugins,
                    ...options.plugins,
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    }
                }
            }
        };

        return new Chart(ctx, config);
    }

    createGradient(ctx, color) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        const baseColor = this.hexToRgb(color);
        
        if (baseColor) {
            gradient.addColorStop(0, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.3)`);
            gradient.addColorStop(1, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.05)`);
        }
        
        return gradient;
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    animateChartSequentially(charts, delay = 500) {
        charts.forEach((chart, index) => {
            setTimeout(() => {
                chart.update('active');
            }, index * delay);
        });
    }

    addHoverEffects(chart) {
        const canvas = chart.canvas;
        
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // 마우스 위치에 따른 미묘한 효과
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
            const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
            const intensity = 1 - (distanceFromCenter / maxDistance);
            
            canvas.style.filter = `brightness(${0.95 + 0.05 * intensity})`;
        });
        
        canvas.addEventListener('mouseleave', () => {
            canvas.style.filter = 'brightness(1)';
        });
    }
}

// 데이터 시각화 개선 함수들
function createMarketChart() {
    const ctx = document.getElementById('marketChart');
    if (!ctx) return;

    const chartManager = new EnhancedChartManager();
    
    const data = {
        labels: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', 
                '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12',
                '2025-01', '2025-02', '2025-03', '2025-04', '2025-05'],
        datasets: [{
            label: '체류형 관광',
            data: [49.07, 97.92, 57.10, 70.56, 68.45, 55.13, 55.72, 54.16, 63.93, 73.59, 53.46, 45.17, 43.72, 39.95, 38.48, 53.17, 46.99],
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)'
        }, {
            label: '지역축제',
            data: [0.21, 0.21, 0.34, 0.61, 2.23, 12.15, 11.04, 10.62, 0.29, 0.32, 0.21, 0.18, 0.19, 0.18, 0.28, 0.54, 1.49],
            borderColor: '#F59E0B',
            backgroundColor: 'rgba(245, 158, 11, 0.1)'
        }, {
            label: '해양관광',
            data: [0.72, 0.73, 0.63, 0.72, 0.91, 0.99, 1.09, 0.80, 0.52, 0.51, 0.51, 0.51, 0.55, 0.59, 0.51, 0.58, 0.56],
            borderColor: '#0EA5E9',
            backgroundColor: 'rgba(14, 165, 233, 0.1)'
        }]
    };

    const options = {
        plugins: {
            title: {
                display: true,
                text: '분야별 검색 트렌드 (2024-2025)',
                font: {
                    size: 18,
                    weight: 'bold'
                },
                padding: 20
            }
        }
    };

    const chart = chartManager.createEnhancedLineChart(ctx, data, options);
    chartManager.addHoverEffects(chart);
    chartManager.charts['market'] = chart;
}

function createRegionChart() {
    const ctx = document.getElementById('regionChart');
    if (!ctx) return;

    const chartManager = new EnhancedChartManager();
    
    const data = {
        labels: ['2024-05', '2024-06', '2024-07', '2024-08', '2024-09', '2024-10', 
                '2024-11', '2024-12', '2025-01', '2025-02', '2025-03', '2025-04', '2025-05'],
        datasets: [{
            label: '동해안북부 (속초권)',
            data: [58.06, 73.01, 100.00, 98.37, 51.87, 46.42, 40.51, 44.04, 48.48, 43.41, 42.09, 42.12, 44.66],
            backgroundColor: 'rgba(239, 68, 68, 0.8)',
            borderColor: '#EF4444',
            borderWidth: 2
        }, {
            label: '동해안중부 (강릉권)',
            data: [51.87, 59.81, 71.12, 65.52, 47.64, 43.18, 41.85, 48.78, 56.94, 48.81, 44.81, 44.00, 44.54],
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
            borderColor: '#22C55E',
            borderWidth: 2
        }, {
            label: '동해안남부 (삼척)',
            data: [15.28, 19.13, 26.53, 24.34, 14.20, 11.25, 9.69, 9.85, 11.58, 10.54, 11.51, 12.10, 12.97],
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: '#3B82F6',
            borderWidth: 2
        }]
    };

    const options = {
        plugins: {
            title: {
                display: true,
                text: '지역별 관심도 변화 (2024-2025)',
                font: {
                    size: 18,
                    weight: 'bold'
                },
                padding: 20
            }
        }
    };

    const chart = chartManager.createEnhancedBarChart(ctx, data, options);
    chartManager.addHoverEffects(chart);
    chartManager.charts['region'] = chart;
}

function createTrendChart() {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;

    const chartManager = new EnhancedChartManager();
    
    const data = {
        labels: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', 
                '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12',
                '2025-01', '2025-02', '2025-03', '2025-04', '2025-05'],
        datasets: [{
            label: 'MZ맞춤 트렌드',
            data: [63.50, 60.53, 89.64, 73.28, 71.00, 74.92, 85.56, 84.73, 82.97, 85.53, 82.63, 85.70, 82.87, 80.36, 92.41, 100.00, 91.38],
            borderColor: '#EC4899',
            backgroundColor: 'rgba(236, 72, 153, 0.1)',
            borderWidth: 4,
            pointRadius: 6,
            pointHoverRadius: 10
        }, {
            label: '신트렌드 (어캠스, 워케이션)',
            data: [2.23, 2.33, 2.46, 2.40, 2.59, 2.44, 2.42, 2.44, 2.02, 2.35, 2.11, 1.56, 1.52, 1.67, 3.47, 1.86, 1.79],
            borderColor: '#8B5CF6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)'
        }, {
            label: '체험형 관광',
            data: [1.20, 1.12, 1.17, 1.25, 1.42, 1.75, 1.32, 1.32, 1.12, 1.14, 0.87, 0.85, 0.89, 0.99, 0.96, 0.91, 1.07],
            borderColor: '#F97316',
            backgroundColor: 'rgba(249, 115, 22, 0.1)'
        }]
    };

    const options = {
        plugins: {
            title: {
                display: true,
                text: 'MZ세대 & 신트렌드 분석 (2024-2025)',
                font: {
                    size: 18,
                    weight: 'bold'
                },
                padding: 20
            }
        }
    };

    const chart = chartManager.createEnhancedLineChart(ctx, data, options);
    chartManager.addHoverEffects(chart);
    chartManager.charts['trend'] = chart;
}

// 차트 초기화 시스템 개선
function initializeCharts() {
    // 기존 차트 파괴
    Chart.helpers.each(Chart.instances, function(instance) {
        instance.destroy();
    });
    
    // 순차적 차트 생성
    setTimeout(() => createMarketChart(), 100);
    setTimeout(() => createRegionChart(), 300);
    setTimeout(() => createTrendChart(), 500);
}

// 추가 차트들 (비즈니스 모델, 벤치마킹 등)
function createBusinessChart() {
    const ctx = document.getElementById('businessChart');
    if (!ctx) return;

    const chartManager = new EnhancedChartManager();
    
    const data = {
        labels: ['1년차', '2년차', '3년차', '4년차', '5년차'],
        datasets: [{
            label: '예상 매출 (억원)',
            data: [0.6, 1.8, 3.5, 5.2, 6.8],
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            fill: true
        }, {
            label: '누적 투자 회수 (억원)',
            data: [0, 0.3, 1.2, 2.8, 4.8],
            borderColor: '#F59E0B',
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            fill: true
        }]
    };

    const options = {
        plugins: {
            title: {
                display: true,
                text: '5년 성장 시나리오',
                font: {
                    size: 18,
                    weight: 'bold'
                }
            }
        }
    };

    const chart = chartManager.createEnhancedLineChart(ctx, data, options);
    chartManager.addHoverEffects(chart);
}

function createCompetitorChart() {
    const ctx = document.getElementById('competitorChart');
    if (!ctx) return;

    const chartManager = new EnhancedChartManager();
    
    const data = {
        labels: ['혁신성', '실현가능성', '시장성', '차별성', '완성도'],
        datasets: [{
            label: '우리 서비스',
            data: [95, 88, 92, 96, 93],
            borderColor: '#0EA5E9',
            backgroundColor: 'rgba(14, 165, 233, 0.2)',
            pointBackgroundColor: '#0EA5E9',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#0EA5E9'
        }, {
            label: '경쟁사 평균',
            data: [65, 78, 75, 60, 70],
            borderColor: '#6B7280',
            backgroundColor: 'rgba(107, 114, 128, 0.1)',
            pointBackgroundColor: '#6B7280',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#6B7280'
        }]
    };

    const options = {
        scales: {
            r: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    stepSize: 20
                }
            }
        },
        plugins: {
            title: {
                display: true,
                text: '경쟁력 비교 분석',
                font: {
                    size: 18,
                    weight: 'bold'
                }
            }
        }
    };

    const chart = new Chart(ctx, {
        type: 'radar',
        data: data,
        options: options
    });

    chartManager.addHoverEffects(chart);
}

// 전역 차트 관리자
const globalChartManager = new EnhancedChartManager();

// 브라우저 전역에서 사용 가능하도록 설정
window.EnhancedChartManager = EnhancedChartManager;
window.createMarketChart = createMarketChart;
window.createRegionChart = createRegionChart;
window.createTrendChart = createTrendChart;
window.createBusinessChart = createBusinessChart;
window.createCompetitorChart = createCompetitorChart;
window.globalChartManager = globalChartManager;