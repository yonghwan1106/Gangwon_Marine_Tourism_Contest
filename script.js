// DOM 요소 선택
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// 탭 전환 기능
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        // 모든 탭 버튼과 컨텐츠에서 active 클래스 제거
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // 클릭된 탭 버튼과 해당 컨텐츠에 active 클래스 추가
        button.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
        
        // 차트 초기화 (탭이 변경될 때마다)
        initializeCharts();
    });
});

// 차트 초기화 함수
function initializeCharts() {
    // 기존 차트 인스턴스 파괴
    Chart.helpers.each(Chart.instances, function(instance) {
        instance.destroy();
    });
    
    // 시장성 분석 차트
    const marketCtx = document.getElementById('marketChart');
    if (marketCtx && document.getElementById('market').classList.contains('active')) {
        createMarketChart();
    }
    
    // 지역별 분석 차트
    const regionCtx = document.getElementById('regionChart');
    if (regionCtx && document.getElementById('region').classList.contains('active')) {
        createRegionChart();
    }
    
    // 트렌드 분석 차트
    const trendCtx = document.getElementById('trendChart');
    if (trendCtx && document.getElementById('trend').classList.contains('active')) {
        createTrendChart();
    }
}

// 시장성 분석 차트 생성
function createMarketChart() {
    const ctx = document.getElementById('marketChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', 
                    '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12',
                    '2025-01', '2025-02', '2025-03', '2025-04', '2025-05'],
            datasets: [{
                label: '체류형 관광',
                data: [49.07, 97.92, 57.10, 70.56, 68.45, 55.13, 55.72, 54.16, 63.93, 73.59, 53.46, 45.17, 43.72, 39.95, 38.48, 53.17, 46.99],
                borderColor: '#28a745',
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }, {
                label: '지역축제',
                data: [0.21, 0.21, 0.34, 0.61, 2.23, 12.15, 11.04, 10.62, 0.29, 0.32, 0.21, 0.18, 0.19, 0.18, 0.28, 0.54, 1.49],
                borderColor: '#ffc107',
                backgroundColor: 'rgba(255, 193, 7, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }, {
                label: '해양관광',
                data: [0.72, 0.73, 0.63, 0.72, 0.91, 0.99, 1.09, 0.80, 0.52, 0.51, 0.51, 0.51, 0.55, 0.59, 0.51, 0.58, 0.56],
                borderColor: '#17a2b8',
                backgroundColor: 'rgba(23, 162, 184, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '분야별 검색 트렌드 (2024-2025)',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '검색 비율'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '기간'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// 지역별 분석 차트 생성
function createRegionChart() {
    const ctx = document.getElementById('regionChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['2024-05', '2024-06', '2024-07', '2024-08', '2024-09', '2024-10', 
                    '2024-11', '2024-12', '2025-01', '2025-02', '2025-03', '2025-04', '2025-05'],
            datasets: [{
                label: '동해안북부 (속초권)',
                data: [58.06, 73.01, 100.00, 98.37, 51.87, 46.42, 40.51, 44.04, 48.48, 43.41, 42.09, 42.12, 44.66],
                backgroundColor: 'rgba(244, 67, 54, 0.7)',
                borderColor: '#f44336',
                borderWidth: 2
            }, {
                label: '동해안중부 (강릉권)',
                data: [51.87, 59.81, 71.12, 65.52, 47.64, 43.18, 41.85, 48.78, 56.94, 48.81, 44.81, 44.00, 44.54],
                backgroundColor: 'rgba(76, 175, 80, 0.7)',
                borderColor: '#4caf50',
                borderWidth: 2
            }, {
                label: '동해안남부 (삼척)',
                data: [15.28, 19.13, 26.53, 24.34, 14.20, 11.25, 9.69, 9.85, 11.58, 10.54, 11.51, 12.10, 12.97],
                backgroundColor: 'rgba(33, 150, 243, 0.7)',
                borderColor: '#2196f3',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '지역별 관심도 변화 (2024-2025)',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '검색 비율'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '기간'
                    }
                }
            }
        }
    });
}

// 트렌드 분석 차트 생성
function createTrendChart() {
    const ctx = document.getElementById('trendChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', 
                    '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12',
                    '2025-01', '2025-02', '2025-03', '2025-04', '2025-05'],
            datasets: [{
                label: 'MZ맞춤 트렌드',
                data: [63.50, 60.53, 89.64, 73.28, 71.00, 74.92, 85.56, 84.73, 82.97, 85.53, 82.63, 85.70, 82.87, 80.36, 92.41, 100.00, 91.38],
                borderColor: '#e91e63',
                backgroundColor: 'rgba(233, 30, 99, 0.1)',
                borderWidth: 4,
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8
            }, {
                label: '신트렌드 (어캠스, 워케이션)',
                data: [2.23, 2.33, 2.46, 2.40, 2.59, 2.44, 2.42, 2.44, 2.02, 2.35, 2.11, 1.56, 1.52, 1.67, 3.47, 1.86, 1.79],
                borderColor: '#9c27b0',
                backgroundColor: 'rgba(156, 39, 176, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }, {
                label: '체험형 관광',
                data: [1.20, 1.12, 1.17, 1.25, 1.42, 1.75, 1.32, 1.32, 1.12, 1.14, 0.87, 0.85, 0.89, 0.99, 0.96, 0.91, 1.07],
                borderColor: '#ff9800',
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                borderWidth: 2,
                fill: false,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'MZ세대 & 신트렌드 분석 (2024-2025)',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '검색 비율'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '기간'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 첫 번째 탭 활성화
    if (tabButtons.length > 0) {
        tabButtons[0].click();
    }
    
    // 카드 호버 효과
    addCardAnimations();
    
    // 스크롤 애니메이션
    addScrollAnimations();
});

// 카드 애니메이션 효과
function addCardAnimations() {
    const cards = document.querySelectorAll('.market-card, .region-card, .trend-card, .idea-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        });
    });
}

// 스크롤 애니메이션
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 애니메이션 대상 요소들
    const animateElements = document.querySelectorAll('.summary-card, .market-card, .region-card, .trend-card, .idea-card, .timeline-item');
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// 숫자 카운터 애니메이션
function animateNumbers() {
    const numbers = document.querySelectorAll('.stat-number, .big-number, .trend-score');
    
    numbers.forEach(number => {
        const targetValue = parseFloat(number.textContent.replace(/[^0-9.-]/g, ''));
        if (!isNaN(targetValue)) {
            animateValue(number, 0, targetValue, 2000);
        }
    });
}

function animateValue(element, start, end, duration) {
    const startTimestamp = performance.now();
    const originalText = element.textContent;
    
    function step(timestamp) {
        const elapsed = timestamp - startTimestamp;
        const progress = Math.min(elapsed / duration, 1);
        const current = start + (end - start) * easeOutExpo(progress);
        
        // 원래 텍스트 형식 유지
        if (originalText.includes('천원')) {
            element.textContent = Math.floor(current).toLocaleString() + '천원';
        } else if (originalText.includes('점')) {
            element.textContent = Math.floor(current) + '점';
        } else if (originalText.includes('건')) {
            element.textContent = Math.floor(current) + '건';
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
        
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }
    
    requestAnimationFrame(step);
}

function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

// 탭 전환 시 숫자 애니메이션 실행
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        setTimeout(animateNumbers, 300);
    });
});

// 데이터 하이라이트 기능
function highlightData() {
    // 최고점 데이터 하이라이트
    const highestValues = document.querySelectorAll('.big-number, .trend-score');
    
    highestValues.forEach(element => {
        const value = parseFloat(element.textContent.replace(/[^0-9.-]/g, ''));
        if (value >= 90) {
            element.style.color = '#e65100';
            element.style.textShadow = '2px 2px 4px rgba(230, 81, 0, 0.3)';
            
            // 펄스 효과
            element.style.animation = 'pulse 2s infinite';
        }
    });
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .highlight-flash {
        animation: flash 1s ease-in-out;
    }
    
    @keyframes flash {
        0%, 100% { background-color: transparent; }
        50% { background-color: rgba(255, 235, 59, 0.3); }
    }
`;
document.head.appendChild(style);

// 검색 기능 (향후 확장 가능)
function addSearchFeature() {
    // 검색 기능은 향후 구현 예정
    console.log('Search feature will be implemented in future versions');
}

// 데이터 익스포트 기능
function exportData() {
    const data = {
        market_analysis: {
            stay_tourism: [49.07, 97.92, 57.10, 70.56, 68.45, 55.13, 55.72, 54.16, 63.93, 73.59, 53.46, 45.17, 43.72, 39.95, 38.48, 53.17, 46.99],
            local_festival: [0.21, 0.21, 0.34, 0.61, 2.23, 12.15, 11.04, 10.62, 0.29, 0.32, 0.21, 0.18, 0.19, 0.18, 0.28, 0.54, 1.49],
            marine_tourism: [0.72, 0.73, 0.63, 0.72, 0.91, 0.99, 1.09, 0.80, 0.52, 0.51, 0.51, 0.51, 0.55, 0.59, 0.51, 0.58, 0.56]
        },
        region_analysis: {
            north_coast: [58.06, 73.01, 100.00, 98.37, 51.87, 46.42, 40.51, 44.04, 48.48, 43.41, 42.09, 42.12, 44.66],
            central_coast: [51.87, 59.81, 71.12, 65.52, 47.64, 43.18, 41.85, 48.78, 56.94, 48.81, 44.81, 44.00, 44.54],
            south_coast: [15.28, 19.13, 26.53, 24.34, 14.20, 11.25, 9.69, 9.85, 11.58, 10.54, 11.51, 12.10, 12.97]
        },
        trend_analysis: {
            mz_trend: [63.50, 60.53, 89.64, 73.28, 71.00, 74.92, 85.56, 84.73, 82.97, 85.53, 82.63, 85.70, 82.87, 80.36, 92.41, 100.00, 91.38],
            new_trend: [2.23, 2.33, 2.46, 2.40, 2.59, 2.44, 2.42, 2.44, 2.02, 2.35, 2.11, 1.56, 1.52, 1.67, 3.47, 1.86, 1.79]
        }
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'naver_datalab_analysis.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// 페이지 로드 완료 후 추가 초기화
window.addEventListener('load', function() {
    setTimeout(() => {
        animateNumbers();
        highlightData();
    }, 500);
});