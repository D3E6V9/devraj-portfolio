// main_app/static/js/threesixnine.js
document.addEventListener('DOMContentLoaded', function() {
    // Note: Gear icon navigation is handled by global-nav.js
    // DO NOT add duplicate gear navigation code here
    
    // Smooth scroll for the scroll indicator
    const scrollIndicator = document.querySelector('.t369-scroll-indicator');
    const bubblesSection = document.querySelector('.t369-bubbles-section');
    
    if (scrollIndicator && bubblesSection) {
        scrollIndicator.addEventListener('click', function() {
            bubblesSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Parallax effect for background image
    window.addEventListener('scroll', function() {
        const heroSection = document.querySelector('.t369-hero-section');
        if (heroSection) {
            const scrollPosition = window.pageYOffset;
            const backgroundImage = document.querySelector('.t369-bg-image');
            if (backgroundImage) {
                backgroundImage.style.transform = `translateY(${scrollPosition * 0.4}px)`;
            }
        }
    });
    
    // Animate bubbles on scroll
    const bubbleItems = document.querySelectorAll('.t369-bubble-item');
    if (bubbleItems.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.2 });
        
        bubbleItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(50px)';
            item.style.transition = `opacity 0.8s ease ${index * 0.2}s, transform 0.8s ease ${index * 0.2}s`;
            observer.observe(item);
        });
    }
    
    // Add click functionality to bubble items
    document.querySelectorAll('.t369-bubble-item').forEach(item => {
        item.addEventListener('click', function() {
            this.classList.add('t369-pulse');
            setTimeout(() => {
                this.classList.remove('t369-pulse');
                // Scroll to the contact section
                document.querySelector('.t369-contact-section').scrollIntoView({
                    behavior: 'smooth'
                });
            }, 600);
        });
    });
    
    // Form submission
    const contactForm = document.querySelector('.t369-contact-form');
    if (contactForm) {
        // Only prevent default if not a POST submission (in case we're viewing locally)
        if (contactForm.method.toLowerCase() !== 'post') {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            });
        }
    }
});