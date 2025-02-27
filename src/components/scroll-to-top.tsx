'use client';
import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <Button onClick={scrollToTop} className={`${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 rounded-full px-4 py-6 shadow-lg`} variant="outline" size="lg">
                <div className="flex items-center gap-2">
                    <ArrowUp className="h-5 w-5" />
                    <span className="text-sm">Back to Top</span>
                </div>
            </Button>
        </div>
    );
}
