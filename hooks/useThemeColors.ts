import { useState, useEffect } from 'react';

const getCssVar = (varName: string) => {
    if (typeof window === 'undefined') return '';
    const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    return `hsl(${value})`;
};

export const useThemeColors = () => {
    const [colors, setColors] = useState({
        primary: getCssVar('--primary'),
        destructive: getCssVar('--destructive'),
        mutedForeground: getCssVar('--muted-foreground'),
        card: getCssVar('--card'),
        border: getCssVar('--border'),
        chart: {
            bar: getCssVar('--chart-bar'),
            line: getCssVar('--chart-line'),
            axis: getCssVar('--chart-axis'),
            grid: getCssVar('--chart-grid'),
        }
    });

    useEffect(() => {
        const updateColors = () => {
            setColors({
                primary: getCssVar('--primary'),
                destructive: getCssVar('--destructive'),
                mutedForeground: getCssVar('--muted-foreground'),
                card: getCssVar('--card'),
                border: getCssVar('--border'),
                chart: {
                    bar: getCssVar('--chart-bar'),
                    line: getCssVar('--chart-line'),
                    axis: getCssVar('--chart-axis'),
                    grid: getCssVar('--chart-grid'),
                }
            });
        };
        
        // Initial update
        updateColors();

        // Update when theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', updateColors);

        return () => {
            mediaQuery.removeEventListener('change', updateColors);
        };
    }, []);

    return colors;
};
