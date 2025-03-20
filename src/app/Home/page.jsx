"use client";

import Header from '@/components/Header/Header';
import './page.scss';
import HeroSlider from '@/components/HeroSlider/HeroSlider';
import ProductSlider from '@/components/ProductSlider/ProductSlider';
import { useEffect, useState } from 'react';


export default function Home() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 780);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);
    
    const heroSlides = [
        {
            imageUrl: '/images/hero1.jpeg',
            title: 'Fresh Organic Produce',
            subtitle: 'From Farm to Table',
            description: 'Experience the taste of nature with our sustainably grown organic products'
        },
        {
            imageUrl: '/images/hero2.jpeg',
            title: 'Artisanal Quality',
            subtitle: 'Handcrafted with Care',
            description: 'Discover our selection of carefully crafted food products made with traditional methods'
        },
        {
            imageUrl: '/images/hero3.jpg',
            title: 'Seasonal Selection',
            subtitle: 'Nature\'s Best',
            description: 'Enjoy locally sourced seasonal produce at the peak of freshness'
        }
    ];
    
    const products = [
        {
            imageUrl: '/images/product1.jpg',
            alt: 'Organic Produce',
            title: 'Farm Fresh Organics',
            description: 'Sustainably grown fruits and vegetables direct from our farms'
        },
        {
            imageUrl: '/images/product2.jpg',
            alt: 'Artisanal Products',
            title: 'Handcrafted Quality',
            description: 'Carefully crafted food products made with traditional methods'
        },
        {
            imageUrl: '/images/product3.jpg',
            alt: 'Seasonal Selection',
            title: 'Seasonal Best',
            description: 'Locally sourced seasonal produce at peak freshness'
        },
    ];

    return (
        <>
            <main>
                {/* Hero Section */}
                <HeroSlider slides={heroSlides} />

                <ProductSlider products={products} />
            </main>

            <Header isMobile={isMobile} /> 
        </>
    );
}