"use client";
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import './ProductSlider.scss';
const DotButton = (props) => {
    const { selected, onClick } = props;

    return (
        <button
            className={`embla__dot${selected ? ' embla__dot--selected' : ''}`}
            type="button"
            onClick={onClick}
        />
    );
};

const PrevButton = (props) => {
    const { enabled, onClick } = props;

    return (
        <button
            className="embla__button embla__button--prev"
            onClick={onClick}
            disabled={!enabled}
        >
            <svg className="embla__button__svg" viewBox="0 0 532 532">
                <path fill="currentColor" d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z" />
            </svg>
        </button>
    );
};

const NextButton = (props) => {
    const { enabled, onClick } = props;

    return (
        <button
            className="embla__button embla__button--next"
            onClick={onClick}
            disabled={!enabled}
        >
            <svg className="embla__button__svg" viewBox="0 0 532 532">
                <path fill="currentColor" d="M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.391c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0 22.928 22.947 206.395 206.507 229.332 229.454a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.2-45.865 45.901-206.404 206.564-229.332 229.52Z" />
            </svg>
        </button>
    );
};

const ProductSlider = ({ products }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'center',
        dragFree: false,
        skipSnaps: false,
        speed: 15
    });

    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState([]);
    const [animatedSection, setAnimatedSection] = useState(false);
    const sectionRef = useRef(null);

    const tweenFactor = useRef(0.52); 
    const tweenNodes = useRef([]);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
        setPrevBtnEnabled(emblaApi.canScrollPrev());
        setNextBtnEnabled(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setAnimatedSection(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    const setTweenNodes = useCallback((emblaApi) => {
        tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
            return slideNode.querySelector('.embla__slide__inner');
        });
    }, []);

    const setTweenFactor = useCallback((emblaApi) => {
        tweenFactor.current = 0.52 * emblaApi.scrollSnapList().length;
    }, []);

    const numberWithinRange = (number, min, max) =>
        Math.min(Math.max(number, min), max);

    const tweenScale = useCallback((emblaApi, eventName) => {
        const engine = emblaApi.internalEngine();
        const scrollProgress = emblaApi.scrollProgress();
        const slidesInView = emblaApi.slidesInView();
        const isScrollEvent = eventName === 'scroll';

        emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
            let diffToTarget = scrollSnap - scrollProgress;
            const slidesInSnap = engine.slideRegistry[snapIndex];

            slidesInSnap.forEach((slideIndex) => {
                if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

                if (engine.options.loop) {
                    engine.slideLooper.loopPoints.forEach((loopItem) => {
                        const target = loopItem.target();

                        if (slideIndex === loopItem.index && target !== 0) {
                            const sign = Math.sign(target);

                            if (sign === -1) {
                                diffToTarget = scrollSnap - (1 + scrollProgress);
                            }
                            if (sign === 1) {
                                diffToTarget = scrollSnap + (1 - scrollProgress);
                            }
                        }
                    });
                }

                const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
                const scale = numberWithinRange(tweenValue, 0.7, 1).toString();

                const rotationAngle = diffToTarget * 15;

                const zTranslation = Math.abs(diffToTarget) * -100;

                const tweenNode = tweenNodes.current[slideIndex];
                if (tweenNode) {
                    tweenNode.style.transform = `
                        scale(${scale}) 
                        rotateY(${rotationAngle}deg) 
                        translateZ(${zTranslation}px)
                    `;
                }
            });
        });
    }, []);

    const onDragEnd = useCallback(() => {
        if (!emblaApi) return;
        
        const currentIndex = emblaApi.selectedScrollSnap();
        emblaApi.scrollTo(currentIndex, true);
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;

        setScrollSnaps(emblaApi.scrollSnapList());
        onSelect();

        setTweenNodes(emblaApi);
        setTweenFactor(emblaApi);
        tweenScale(emblaApi);

        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
        emblaApi.on('dragEnd', onDragEnd);

        emblaApi.on('reInit', () => setTweenNodes(emblaApi));
        emblaApi.on('reInit', () => setTweenFactor(emblaApi));
        emblaApi.on('reInit', () => tweenScale(emblaApi, 'reInit'));
        emblaApi.on('scroll', () => tweenScale(emblaApi, 'scroll'));
        emblaApi.on('slideFocus', () => tweenScale(emblaApi, 'slideFocus'));

        return () => {
            emblaApi.off('select', onSelect);
            emblaApi.off('reInit', onSelect);
            emblaApi.off('dragEnd', onDragEnd);

            emblaApi.off('reInit', () => setTweenNodes(emblaApi));
            emblaApi.off('reInit', () => setTweenFactor(emblaApi));
            emblaApi.off('reInit', () => tweenScale(emblaApi, 'reInit'));
            emblaApi.off('scroll', () => tweenScale(emblaApi, 'scroll'));
            emblaApi.off('slideFocus', () => tweenScale(emblaApi, 'slideFocus'));
        };
    }, [emblaApi, onSelect, setTweenNodes, setTweenFactor, tweenScale, onDragEnd]);

    return (
        <section ref={sectionRef} className="product-section">
            <div className="container">
                <h2 className={`section-title ${animatedSection ? 'animated' : ''}`}>
                    Quality Products
                </h2>
                <p className={`section-description ${animatedSection ? 'animated' : ''}`}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </div>

            <div className="embla">
                <div className="embla__viewport" ref={emblaRef}>
                    <div className="embla__container">
                        {products.map((product, index) => (
                            <div className="embla__slide" key={index}>
                                <div className="embla__slide__inner">
                                    <img
                                        className="embla__slide__img"
                                        src={product.imageUrl}
                                        alt={product.alt}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="product-info">
                    {selectedIndex !== null && products[selectedIndex] && (
                        <div className="product-details">
                            <h3>{products[selectedIndex].title}</h3>
                            <p>{products[selectedIndex].description}</p>
                        </div>
                    )}
                </div>

                <div className="embla__controls">
                    <div className="embla__buttons">
                        <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
                        <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
                    </div>

                    <div className="embla__dots">
                        {scrollSnaps.map((_, index) => (
                            <DotButton
                                key={index}
                                selected={index === selectedIndex}
                                onClick={() => scrollTo(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )

}

export default ProductSlider;