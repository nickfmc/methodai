/**
 * Stat Counter Animation Script
 * Handles counting animation on scroll into view
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Create intersection observer to trigger animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const numberEl = counter.querySelector('.c-stat-counter__number');
                
                if (numberEl && !counter.classList.contains('is-animated')) {
                    animateCounter(counter, numberEl);
                }
            }
        });
    }, {
        threshold: 0.5, // Trigger when 50% visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before fully in view
    });

    // Observe all stat counters
    const counters = document.querySelectorAll('.c-stat-counter');
    counters.forEach(counter => {
        observer.observe(counter);
    });

    function animateCounter(counterEl, numberEl) {
        const target = numberEl.getAttribute('data-target');
        const duration = parseInt(counterEl.getAttribute('data-duration')) || 2000;
        const delay = parseInt(counterEl.getAttribute('data-delay')) || 0;
        
        // Mark as animated to prevent re-triggering
        counterEl.classList.add('is-animated');
        
        // Apply delay if specified
        setTimeout(() => {
            counterEl.classList.add('is-animating');
            
            // Extract number and suffix/prefix from target
            const matches = target.match(/^(.*?)([0-9.,]+)(.*?)$/);
            if (!matches) {
                // If no number found, just show the target
                numberEl.textContent = target;
                counterEl.classList.remove('is-animating');
                counterEl.classList.add('is-completed');
                return;
            }
            
            const prefix = matches[1] || '';
            const numberStr = matches[2];
            const suffix = matches[3] || '';
            
            // Parse the number (handle decimals and commas)
            const cleanNumber = numberStr.replace(/,/g, '');
            const targetNumber = parseFloat(cleanNumber);
            
            if (isNaN(targetNumber)) {
                numberEl.textContent = target;
                counterEl.classList.remove('is-animating');
                counterEl.classList.add('is-completed');
                return;
            }
            
            // Determine if it's a decimal number
            const isDecimal = cleanNumber.includes('.');
            const decimalPlaces = isDecimal ? cleanNumber.split('.')[1].length : 0;
            
            // Animation parameters
            const startTime = Date.now();
            const startValue = 0;
            
            function updateCounter() {
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Use easeOutCubic for smooth deceleration
                const easedProgress = 1 - Math.pow(1 - progress, 3);
                const currentValue = startValue + (targetNumber * easedProgress);
                
                // Format the current value
                let displayValue;
                if (isDecimal) {
                    displayValue = currentValue.toFixed(decimalPlaces);
                } else {
                    displayValue = Math.floor(currentValue).toString();
                }
                
                // Add commas for large numbers
                if (targetNumber >= 1000 && !isDecimal) {
                    displayValue = parseInt(displayValue).toLocaleString();
                } else if (targetNumber >= 1000 && isDecimal) {
                    displayValue = parseFloat(displayValue).toLocaleString(undefined, {
                        minimumFractionDigits: decimalPlaces,
                        maximumFractionDigits: decimalPlaces
                    });
                }
                
                // Update display
                numberEl.textContent = prefix + displayValue + suffix;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    // Animation complete
                    numberEl.textContent = target; // Ensure exact target value
                    counterEl.classList.remove('is-animating');
                    counterEl.classList.add('is-completed');
                }
            }
            
            requestAnimationFrame(updateCounter);
            
        }, delay);
    }
});