// 고급 애니메이션 카운터 시스템
class AnimatedCounter {
    constructor(element, targetValue, options = {}) {
        this.element = element;
        this.targetValue = targetValue;
        this.options = {
            duration: options.duration || 2000,
            easing: options.easing || 'easeOutExpo',
            suffix: options.suffix || '',
            prefix: options.prefix || '',
            separator: options.separator || '',
            decimal: options.decimal || 0,
            delay: options.delay || 0
        };
        this.startValue = 0;
        this.currentValue = 0;
        this.isAnimating = false;
    }

    start() {
        if (this.isAnimating) return;
        
        setTimeout(() => {
            this.isAnimating = true;
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / this.options.duration, 1);
                
                // 이징 함수 적용
                const easedProgress = this.easing(progress);
                this.currentValue = this.startValue + (this.targetValue - this.startValue) * easedProgress;
                
                // 값 포맷팅 및 표시
                this.updateDisplay();
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.isAnimating = false;
                    this.onComplete();
                }
            };
            
            requestAnimationFrame(animate);
        }, this.options.delay);
    }

    updateDisplay() {
        let displayValue = this.currentValue;
        
        // 소수점 처리
        if (this.options.decimal > 0) {
            displayValue = displayValue.toFixed(this.options.decimal);
        } else {
            displayValue = Math.floor(displayValue);
        }
        
        // 천단위 구분자
        if (this.options.separator) {
            displayValue = displayValue.toLocaleString();
        }
        
        // 접두사, 접미사 추가
        const formattedValue = this.options.prefix + displayValue + this.options.suffix;
        this.element.textContent = formattedValue;
    }

    easing(t) {
        switch (this.options.easing) {
            case 'easeOutExpo':
                return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            case 'easeOutQuart':
                return 1 - Math.pow(1 - t, 4);
            case 'easeOutBack':
                const c1 = 1.70158;
                const c3 = c1 + 1;
                return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
            case 'easeOutBounce':
                const n1 = 7.5625;
                const d1 = 2.75;
                if (t < 1 / d1) {
                    return n1 * t * t;
                } else if (t < 2 / d1) {
                    return n1 * (t -= 1.5 / d1) * t + 0.75;
                } else if (t < 2.5 / d1) {
                    return n1 * (t -= 2.25 / d1) * t + 0.9375;
                } else {
                    return n1 * (t -= 2.625 / d1) * t + 0.984375;
                }
            default:
                return t;
        }
    }

    onComplete() {
        // 완료 시 펄스 효과
        this.element.style.transform = 'scale(1.1)';
        setTimeout(() => {
            this.element.style.transform = 'scale(1)';
        }, 200);
    }
}

// 통계 카운터 초기화 시스템
class StatsAnimationManager {
    constructor() {
        this.counters = [];
        this.observer = null;
        this.init();
    }

    init() {
        // Intersection Observer 설정
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStatsInSection(entry.target);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px'
        });

        // 페이지 로드 후 초기화
        document.addEventListener('DOMContentLoaded', () => {
            this.setupStatsAnimations();
        });
    }

    setupStatsAnimations() {
        // 메인 히어로 섹션 통계
        const heroStats = document.querySelectorAll('.stat-number');
        heroStats.forEach((stat, index) => {
            const text = stat.textContent;
            let value, suffix = '';
            
            if (text.includes('점')) {
                value = 93;
                suffix = '점';
            } else if (text.includes('억')) {
                value = 6;
                suffix = '억원';
            } else if (text.includes('톤')) {
                value = 30;
                suffix = '톤';
            } else if (text.includes('명')) {
                value = 2400;
                suffix = '명';
            }
            
            if (value) {
                const counter = new AnimatedCounter(stat, value, {
                    duration: 2500,
                    easing: 'easeOutExpo',
                    suffix: suffix,
                    delay: index * 300,
                    separator: value > 999
                });
                this.counters.push(counter);
            }
        });

        // 다른 섹션의 숫자들
        this.setupSectionCounters();
        
        // 섹션 관찰 시작
        this.observeSections();
    }

    setupSectionCounters() {
        // 데이터 분석 페이지의 큰 숫자들
        const bigNumbers = document.querySelectorAll('.big-number, .trend-score');
        bigNumbers.forEach(number => {
            this.observer.observe(number.closest('section') || number.closest('.tab-content') || number);
        });

        // 파트너십 숫자들
        const partnerNumbers = document.querySelectorAll('[data-counter]');
        partnerNumbers.forEach(number => {
            const value = parseInt(number.getAttribute('data-counter'));
            const suffix = number.getAttribute('data-suffix') || '';
            
            const counter = new AnimatedCounter(number, value, {
                duration: 1500,
                suffix: suffix,
                easing: 'easeOutQuart'
            });
            this.counters.push(counter);
        });
    }

    observeSections() {
        const sections = document.querySelectorAll('section, .hero-slider, .tab-content');
        sections.forEach(section => {
            this.observer.observe(section);
        });
    }

    animateStatsInSection(section) {
        // 해당 섹션의 모든 카운터 실행
        const numbers = section.querySelectorAll('.stat-number, .big-number, .trend-score, [data-counter]');
        
        numbers.forEach((number, index) => {
            const text = number.textContent;
            const dataValue = number.getAttribute('data-counter');
            
            let value, suffix = '', prefix = '';
            
            if (dataValue) {
                value = parseInt(dataValue);
                suffix = number.getAttribute('data-suffix') || '';
            } else {
                // 텍스트에서 숫자 추출
                const matches = text.match(/([\d,]+\.?\d*)\s*([가-힣%]+)?/);
                if (matches) {
                    value = parseFloat(matches[1].replace(/,/g, ''));
                    suffix = matches[2] || '';
                }
            }
            
            if (value && !number.hasAttribute('data-animated')) {
                number.setAttribute('data-animated', 'true');
                
                const counter = new AnimatedCounter(number, value, {
                    duration: 1500 + (index * 200),
                    easing: 'easeOutExpo',
                    suffix: suffix,
                    prefix: prefix,
                    separator: value > 999,
                    delay: index * 150
                });
                
                counter.start();
            }
        });
    }

    startHeroAnimation() {
        // 히어로 섹션 카운터들 실행
        this.counters.forEach((counter, index) => {
            if (counter.element.closest('.hero-slider')) {
                counter.start();
            }
        });
    }
}

// 파티클 시스템 (배경 효과)
class ParticleSystem {
    constructor(container, options = {}) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        
        this.options = {
            particleCount: options.particleCount || 50,
            particleColor: options.particleColor || 'rgba(14, 165, 233, 0.1)',
            particleSize: options.particleSize || 2,
            speed: options.speed || 0.5,
            connectionDistance: options.connectionDistance || 100
        };
        
        this.init();
    }

    init() {
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        
        this.container.style.position = 'relative';
        this.container.appendChild(this.canvas);
        
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.options.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.options.speed,
                vy: (Math.random() - 0.5) * this.options.speed,
                size: Math.random() * this.options.particleSize + 1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 파티클 업데이트 및 그리기
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // 경계 처리
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // 파티클 그리기
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = this.options.particleColor;
            this.ctx.fill();
        });
        
        // 연결선 그리기
        this.drawConnections();
        
        requestAnimationFrame(() => this.animate());
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.options.connectionDistance) {
                    const opacity = 1 - (distance / this.options.connectionDistance);
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(14, 165, 233, ${opacity * 0.1})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        }
    }
}

// 타이핑 애니메이션
class TypingAnimation {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = Array.isArray(texts) ? texts : [texts];
        this.options = {
            typeSpeed: options.typeSpeed || 100,
            deleteSpeed: options.deleteSpeed || 50,
            pauseTime: options.pauseTime || 2000,
            loop: options.loop !== false
        };
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.start();
    }

    start() {
        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.options.typeSpeed;
        if (this.isDeleting) {
            typeSpeed = this.options.deleteSpeed;
        }

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = this.options.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex++;
            if (this.textIndex >= this.texts.length) {
                if (this.options.loop) {
                    this.textIndex = 0;
                } else {
                    return;
                }
            }
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// 전역 애니메이션 관리자 초기화
const globalAnimationManager = new StatsAnimationManager();

// 히어로 섹션 특별 효과
function initHeroEffects() {
    // 파티클 시스템 (필요시 활성화)
    const heroSection = document.querySelector('#hero');
    if (heroSection) {
        // const particles = new ParticleSystem(heroSection, {
        //     particleCount: 30,
        //     particleColor: 'rgba(14, 165, 233, 0.05)',
        //     speed: 0.3
        // });
        
        // 히어로 애니메이션 지연 시작
        setTimeout(() => {
            globalAnimationManager.startHeroAnimation();
        }, 1000);
    }
}

// 페이지 로드 시 초기화
window.addEventListener('load', () => {
    initHeroEffects();
});

// 공통 유틸리티 함수들
const AnimationUtils = {
    // 요소가 뷰포트에 있는지 확인
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // 랜덤 지연 시간 생성
    randomDelay(min = 0, max = 500) {
        return Math.random() * (max - min) + min;
    },

    // 색상 애니메이션
    animateColor(element, fromColor, toColor, duration = 1000) {
        const startTime = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 간단한 색상 보간 (실제로는 더 복잡한 RGB 보간 필요)
            const opacity = progress;
            element.style.color = toColor;
            element.style.opacity = opacity;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    }
};

export { AnimatedCounter, StatsAnimationManager, ParticleSystem, TypingAnimation, AnimationUtils };