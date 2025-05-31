// 고급 스크롤 애니메이션 시스템
class ScrollAnimationManager {
    constructor() {
        this.observers = new Map();
        this.scrollProgress = 0;
        this.ticking = false;
        this.elements = new Set();
        this.init();
    }

    init() {
        this.setupScrollProgress();
        this.setupIntersectionObservers();
        this.setupScrollTriggers();
        this.setupParallaxEffects();
        
        // 페이지 로드 시 초기화
        document.addEventListener('DOMContentLoaded', () => {
            this.registerElements();
            this.startAnimations();
        });
    }

    // 스크롤 진행률 표시
    setupScrollProgress() {
        // 진행률 인디케이터 생성
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-indicator';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    const scrollTop = window.pageYOffset;
                    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                    this.scrollProgress = scrollTop / docHeight;
                    
                    progressBar.style.width = `${this.scrollProgress * 100}%`;
                    this.updateScrollEffects();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        });
    }

    // 향상된 Intersection Observer
    setupIntersectionObservers() {
        // 기본 애니메이션용
        const basicObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // 카운터 애니메이션용 (더 높은 threshold)
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerCounterAnimation(entry.target);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px'
        });

        // 차트 애니메이션용
        const chartObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerChartAnimation(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });

        this.observers.set('basic', basicObserver);
        this.observers.set('counter', counterObserver);
        this.observers.set('chart', chartObserver);
    }

    // 스크롤 트리거 설정
    setupScrollTriggers() {
        this.scrollTriggers = [
            {
                element: '.hero-slider',
                start: 0,
                end: window.innerHeight,
                onProgress: (progress) => {
                    const hero = document.querySelector('.hero-slider');
                    if (hero) {
                        hero.style.transform = `translateY(${progress * 50}px)`;
                        hero.style.opacity = 1 - progress * 0.5;
                    }
                }
            },
            {
                element: '.stat-item',
                start: 0.2,
                end: 0.8,
                onProgress: (progress) => {
                    document.querySelectorAll('.stat-item').forEach((stat, index) => {
                        const delay = index * 0.1;
                        const adjustedProgress = Math.max(0, (progress - delay) / (1 - delay));
                        stat.style.transform = `translateY(${(1 - adjustedProgress) * 30}px)`;
                        stat.style.opacity = adjustedProgress;
                    });
                }
            }
        ];
    }

    // 패럴랙스 효과
    setupParallaxEffects() {
        this.parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', () => {
            this.parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || 0.5;
                const rect = element.getBoundingClientRect();
                const scrolled = window.pageYOffset;
                const rate = scrolled * -speed;
                
                if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                    element.style.transform = `translateY(${rate}px)`;
                }
            });
        });
    }

    // 요소 등록
    registerElements() {
        // 기본 애니메이션 요소들
        const basicElements = document.querySelectorAll(`
            .market-card, .region-card, .trend-card, .idea-card,
            .partner-card, .business-card, .schedule-card,
            .summary-card, .timeline-item, section
        `);
        basicElements.forEach(el => {
            this.observers.get('basic').observe(el);
            this.elements.add(el);
        });

        // 카운터 요소들
        const counterElements = document.querySelectorAll(`
            .stat-number, .big-number, .trend-score, [data-counter]
        `);
        counterElements.forEach(el => {
            this.observers.get('counter').observe(el);
        });

        // 차트 요소들
        const chartElements = document.querySelectorAll(`
            canvas, .chart-container, #marketChart, #regionChart, #trendChart
        `);
        chartElements.forEach(el => {
            this.observers.get('chart').observe(el);
        });
    }

    // 기본 애니메이션 트리거
    triggerAnimation(element) {
        if (element.hasAttribute('data-animated')) return;
        element.setAttribute('data-animated', 'true');

        // 애니메이션 타입 결정
        const animationType = this.getAnimationType(element);
        
        switch (animationType) {
            case 'fadeInUp':
                this.animateFadeInUp(element);
                break;
            case 'slideInLeft':
                this.animateSlideInLeft(element);
                break;
            case 'slideInRight':
                this.animateSlideInRight(element);
                break;
            case 'scaleIn':
                this.animateScaleIn(element);
                break;
            case 'rotateIn':
                this.animateRotateIn(element);
                break;
            default:
                this.animateFadeInUp(element);
        }
    }

    // 애니메이션 타입 결정
    getAnimationType(element) {
        if (element.classList.contains('market-card')) return 'slideInLeft';
        if (element.classList.contains('region-card')) return 'slideInRight';
        if (element.classList.contains('trend-card')) return 'scaleIn';
        if (element.classList.contains('partner-card')) return 'rotateIn';
        return 'fadeInUp';
    }

    // 개별 애니메이션 함수들
    animateFadeInUp(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

    animateSlideInLeft(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-50px)';
        element.style.transition = 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }

    animateSlideInRight(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(50px)';
        element.style.transition = 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }

    animateScaleIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        element.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        });
    }

    animateRotateIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'rotate(-10deg) scale(0.8)';
        element.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'rotate(0deg) scale(1)';
        });
    }

    // 카운터 애니메이션 트리거
    triggerCounterAnimation(element) {
        if (element.hasAttribute('data-counter-animated')) return;
        element.setAttribute('data-counter-animated', 'true');

        // 기존 AnimatedCounter 클래스 사용
        if (typeof AnimatedCounter !== 'undefined') {
            const text = element.textContent;
            const dataValue = element.getAttribute('data-counter');
            let value, suffix = '';
            
            if (dataValue) {
                value = parseInt(dataValue);
                suffix = element.getAttribute('data-suffix') || '';
            } else {
                const matches = text.match(/([\d,]+\.?\d*)\s*([가-힣%]+)?/);
                if (matches) {
                    value = parseFloat(matches[1].replace(/,/g, ''));
                    suffix = matches[2] || '';
                }
            }
            
            if (value) {
                const counter = new AnimatedCounter(element, value, {
                    duration: 2000,
                    easing: 'easeOutExpo',
                    suffix: suffix,
                    separator: value > 999
                });
                counter.start();
            }
        }
    }

    // 차트 애니메이션 트리거
    triggerChartAnimation(element) {
        if (element.hasAttribute('data-chart-animated')) return;
        element.setAttribute('data-chart-animated', 'true');

        // Chart.js 애니메이션 재실행
        const chartId = element.id;
        if (chartId && typeof Chart !== 'undefined') {
            const existingChart = Chart.getChart(chartId);
            if (existingChart) {
                existingChart.update('active');
            }
        }
    }

    // 스크롤 효과 업데이트
    updateScrollEffects() {
        this.scrollTriggers.forEach(trigger => {
            const element = document.querySelector(trigger.element);
            if (element) {
                const rect = element.getBoundingClientRect();
                const elementTop = rect.top + window.pageYOffset;
                const elementHeight = rect.height;
                const windowHeight = window.innerHeight;
                
                const start = elementTop - windowHeight;
                const end = elementTop + elementHeight;
                const scrollPos = window.pageYOffset;
                
                if (scrollPos >= start && scrollPos <= end) {
                    const progress = (scrollPos - start) / (end - start);
                    trigger.onProgress(progress);
                }
            }
        });
    }

    // 순차적 애니메이션
    animateSequence(elements, delay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                this.triggerAnimation(element);
            }, index * delay);
        });
    }

    // 웨이브 애니메이션
    animateWave(elements, direction = 'right') {
        const totalDuration = 1000;
        const stepDelay = totalDuration / elements.length;
        
        elements.forEach((element, index) => {
            const delay = direction === 'right' ? index * stepDelay : (elements.length - 1 - index) * stepDelay;
            
            setTimeout(() => {
                element.style.transform = 'translateY(-10px)';
                element.style.transition = 'transform 0.3s ease';
                
                setTimeout(() => {
                    element.style.transform = 'translateY(0)';
                }, 300);
            }, delay);
        });
    }

    // 폭죽 효과 (특별한 순간용)
    createFireworks(x, y) {
        const colors = ['#0EA5E9', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '10000';
            
            document.body.appendChild(particle);
            
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 2 + Math.random() * 3;
            const distance = 50 + Math.random() * 50;
            
            const endX = x + Math.cos(angle) * distance;
            const endY = y + Math.sin(angle) * distance;
            
            particle.animate([
                { transform: `translate(0, 0) scale(1)`, opacity: 1 },
                { transform: `translate(${endX - x}px, ${endY - y}px) scale(0)`, opacity: 0 }
            ], {
                duration: 1000 + Math.random() * 500,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).addEventListener('finish', () => {
                document.body.removeChild(particle);
            });
        }
    }

    // 시작 애니메이션
    startAnimations() {
        // 히어로 섹션 즉시 애니메이션
        const heroElements = document.querySelectorAll('.slide-title, .slide-subtitle, .stat-item');
        this.animateSequence(heroElements, 200);
        
        // 네비게이션 애니메이션
        const navItems = document.querySelectorAll('nav a');
        setTimeout(() => {
            this.animateWave(navItems, 'right');
        }, 500);
    }

    // 페이지 전환 애니메이션
    animatePageTransition(fromPage, toPage) {
        return new Promise((resolve) => {
            // 현재 페이지 페이드 아웃
            fromPage.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            fromPage.style.opacity = '0';
            fromPage.style.transform = 'translateX(-30px)';
            
            setTimeout(() => {
                fromPage.style.display = 'none';
                toPage.style.display = 'block';
                toPage.style.opacity = '0';
                toPage.style.transform = 'translateX(30px)';
                
                // 새 페이지 페이드 인
                requestAnimationFrame(() => {
                    toPage.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    toPage.style.opacity = '1';
                    toPage.style.transform = 'translateX(0)';
                    
                    setTimeout(resolve, 300);
                });
            }, 300);
        });
    }

    // 모바일 최적화
    optimizeForMobile() {
        if (window.innerWidth <= 768) {
            // 모바일에서는 애니메이션 단순화
            this.scrollTriggers = this.scrollTriggers.map(trigger => ({
                ...trigger,
                onProgress: () => {} // 패럴랙스 비활성화
            }));
        }
    }

    // 성능 모니터링
    monitorPerformance() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const checkFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = frameCount;
                frameCount = 0;
                lastTime = currentTime;
                
                // FPS가 30 이하면 애니메이션 최적화
                if (fps < 30) {
                    this.optimizeAnimations();
                }
            }
            
            requestAnimationFrame(checkFPS);
        };
        
        requestAnimationFrame(checkFPS);
    }

    // 애니메이션 최적화
    optimizeAnimations() {
        // GPU 가속 활성화
        this.elements.forEach(element => {
            element.style.willChange = 'transform, opacity';
            element.style.transform = 'translateZ(0)';
        });
        
        // 복잡한 애니메이션 비활성화
        document.body.classList.add('reduced-animations');
    }
}

// 전역 스크롤 애니메이션 관리자 초기화
const globalScrollManager = new ScrollAnimationManager();

// 유틸리티 함수들
const ScrollUtils = {
    // 부드러운 스크롤
    smoothScrollTo(target, duration = 1000) {
        const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
        if (!targetElement) return;
        
        const startPosition = window.pageYOffset;
        const targetPosition = targetElement.getBoundingClientRect().top + startPosition;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ScrollUtils.easeInOutQuart(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        requestAnimationFrame(animation);
    },

    // 이징 함수
    easeInOutQuart(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t * t + b;
        t -= 2;
        return -c / 2 * (t * t * t * t - 2) + b;
    },

    // 뷰포트 가시성 확인
    isInViewport(element, threshold = 0) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        return (
            rect.top >= -threshold &&
            rect.left >= -threshold &&
            rect.bottom <= windowHeight + threshold &&
            rect.right <= windowWidth + threshold
        );
    }
};

// 브라우저 전역에서 사용 가능하도록 설정
window.ScrollAnimationManager = ScrollAnimationManager;
window.ScrollUtils = ScrollUtils;