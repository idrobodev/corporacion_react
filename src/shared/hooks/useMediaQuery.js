import { useState, useEffect } from 'react';

/**
 * useMediaQuery hook - Detect media query matches with window.matchMedia
 * 
 * @param {string} query - Media query string (e.g., '(min-width: 768px)')
 * @returns {boolean} - Whether the media query matches
 */
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    // Check if window is available (SSR safety)
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    // Check if window is available (SSR safety)
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    
    // Update state with current match status
    setMatches(mediaQuery.matches);

    // Event handler for media query changes
    const handleChange = (event) => {
      setMatches(event.matches);
    };

    // Add event listener
    // Use addEventListener for modern browsers, addListener for older ones
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Cleanup function to remove event listener
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [query]);

  return matches;
};

/**
 * Common breakpoint hooks based on Tailwind CSS breakpoints
 */

/**
 * useIsMobile - Detect if viewport is mobile (< 768px)
 * @returns {boolean} - True if viewport width is less than 768px
 */
export const useIsMobile = () => {
  return useMediaQuery('(max-width: 767px)');
};

/**
 * useIsTablet - Detect if viewport is tablet (768px - 1023px)
 * @returns {boolean} - True if viewport width is between 768px and 1023px
 */
export const useIsTablet = () => {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
};

/**
 * useIsDesktop - Detect if viewport is desktop (>= 1024px)
 * @returns {boolean} - True if viewport width is 1024px or greater
 */
export const useIsDesktop = () => {
  return useMediaQuery('(min-width: 1024px)');
};

/**
 * useIsMobileOrTablet - Detect if viewport is mobile or tablet (< 1024px)
 * @returns {boolean} - True if viewport width is less than 1024px
 */
export const useIsMobileOrTablet = () => {
  return useMediaQuery('(max-width: 1023px)');
};

/**
 * useIsSmallMobile - Detect if viewport is small mobile (< 640px)
 * @returns {boolean} - True if viewport width is less than 640px
 */
export const useIsSmallMobile = () => {
  return useMediaQuery('(max-width: 639px)');
};

/**
 * useIsLargeDesktop - Detect if viewport is large desktop (>= 1280px)
 * @returns {boolean} - True if viewport width is 1280px or greater
 */
export const useIsLargeDesktop = () => {
  return useMediaQuery('(min-width: 1280px)');
};

/**
 * useBreakpoints - Get all breakpoint states at once
 * Useful when you need to check multiple breakpoints
 * 
 * @returns {Object} Object with boolean properties for each breakpoint
 * 
 * @example
 * const { isMobile, isTablet, isDesktop } = useBreakpoints();
 * if (isMobile) {
 *   // Render mobile view
 * }
 */
export const useBreakpoints = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  const isSmallMobile = useIsSmallMobile();
  const isLargeDesktop = useIsLargeDesktop();

  return {
    isMobile,
    isTablet,
    isDesktop,
    isSmallMobile,
    isLargeDesktop,
    // Convenience properties
    isMobileOrTablet: isMobile || isTablet,
    isTabletOrDesktop: isTablet || isDesktop,
  };
};

export default useMediaQuery;
