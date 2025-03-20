"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import './HeroSlider.scss';

const HeroSlider = ({ slides }) => {
    const [heroEmblaRef, heroEmblaApi] = useEmblaCarousel({ 
        loop: true,
        speed: 30,
        dragFree: false
    });
    const [heroIndex, setHeroIndex] = useState(0);
    const [autoplayProgress, setAutoplayProgress] = useState(0);
    const [isTextAnimating, setIsTextAnimating] = useState(false);
    const autoplayIntervalRef = useRef(null);
    const progressIntervalRef = useRef(null);
    const autoplayDuration = 5000;
    const isTransitioningRef = useRef(false);

    const clearIntervals = useCallback(() => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
        if (autoplayIntervalRef.current) {
            clearInterval(autoplayIntervalRef.current);
            autoplayIntervalRef.current = null;
        }
    }, []);

    const startAutoplay = useCallback(() => {
        if (isTransitioningRef.current) return;

        clearIntervals();
        
        // Reset progress immediately
        setAutoplayProgress(0);
        
        // Setup new progress interval
        progressIntervalRef.current = setInterval(() => {
            setAutoplayProgress(prev => {
                const newProgress = prev + (50 / autoplayDuration) * 100;
                return newProgress > 100 ? 100 : newProgress;
            });
        }, 50);
        
        // Setup new autoplay interval
        autoplayIntervalRef.current = setInterval(() => {
            if (heroEmblaApi && !isTransitioningRef.current) {
                isTransitioningRef.current = true;
                heroEmblaApi.scrollNext();
            }
        }, autoplayDuration);
    }, [heroEmblaApi, clearIntervals]);

    const scrollHeroNext = useCallback(() => {
        if (heroEmblaApi && !isTransitioningRef.current) {
            isTransitioningRef.current = true;
            
            setAutoplayProgress(0);
            
            heroEmblaApi.scrollNext();
            
            startAutoplay();
        }
    }, [heroEmblaApi, startAutoplay]);

    const onHeroSelect = useCallback(() => {
        if (!heroEmblaApi) return;
        
        setHeroIndex(heroEmblaApi.selectedScrollSnap());
        setIsTextAnimating(true);
        
        setTimeout(() => {
            setIsTextAnimating(false);
            isTransitioningRef.current = false;
        }, 800);
    }, [heroEmblaApi]);

    const onDragStart = useCallback(() => {
        clearIntervals();
        setAutoplayProgress(0);
        isTransitioningRef.current = true;
    }, [clearIntervals]);

    const onDragEnd = useCallback(() => {
        isTransitioningRef.current = false;
        startAutoplay();
    }, [startAutoplay]);

    useEffect(() => {
        if (!heroEmblaApi) return;
        
        onHeroSelect();
        startAutoplay();
        
        heroEmblaApi.on('select', onHeroSelect);
        heroEmblaApi.on('reInit', onHeroSelect);
        heroEmblaApi.on('dragStart', onDragStart);
        heroEmblaApi.on('settle', onDragEnd);
        
        return () => {
            heroEmblaApi.off('select', onHeroSelect);
            heroEmblaApi.off('reInit', onHeroSelect);
            heroEmblaApi.off('dragStart', onDragStart);
            heroEmblaApi.off('settle', onDragEnd);
            clearIntervals();
        };
    }, [heroEmblaApi, onHeroSelect, onDragStart, onDragEnd, startAutoplay, clearIntervals]);

    return (
        <section className="hero-section">
            <div className="hero-embla">
                <div className="hero-embla__viewport" ref={heroEmblaRef}>
                    <div className="hero-embla__container">
                        {slides.map((slide, index) => (
                            <div className="hero-embla__slide" key={index}>
                                <div className="hero-embla__slide__inner">
                                    <img 
                                        className="hero-embla__slide__img" 
                                        src={slide.imageUrl} 
                                        alt={slide.title} 
                                    />
                                    <div className="hero-content">
                                        <div className={`hero-text ${isTextAnimating ? 'animating' : ''}`}>
                                            <h1 className="hero-title">{slide.title}</h1>
                                            <p className="hero-description">{slide.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="hero-controls">
                    
                    <button 
                        className="hero-next-button" 
                        onClick={scrollHeroNext}
                    >
                        <div className="next-slide-preview">
                            <img 
                                src={slides[(heroIndex + 1) % slides.length].imageUrl} 
                                alt="Next slide preview" 
                            />
                        </div>
                        <div className="button-content">
                            <div className="slide-numbers">
                                <span className="current-slide">{String(heroIndex + 1).padStart(2, '0')}</span>
                                <span className="slide-divider">/</span>
                                <span className="total-slides">{String(slides.length).padStart(2, '0')}</span>
                            </div>
                            <span>Next</span>
                        </div>
                        <svg className="progress-border" width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                            <rect
                                className="progress-border__rect"
                                stroke="#ffffff"
                                strokeWidth="2"
                                fill="transparent"
                                width="100%"
                                height="100%"
                                style={{
                                    strokeDasharray: '400',
                                    strokeDashoffset: 400 - (400 * autoplayProgress / 100)
                                }}
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HeroSlider; 