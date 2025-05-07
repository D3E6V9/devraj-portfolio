// main_app/static/js/main.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('Document loaded, initializing page-specific features...');
    
    // Note: Gear navigation is handled by global-nav.js
    // DO NOT add duplicate gear navigation code here
    
    // Video section interactive
    const videoSection = document.querySelector('.video-section');
    if (videoSection) {
        const video = document.getElementById('background-video');
        if (video) {
            videoSection.addEventListener('mouseover', function() {
                video.play();
            });
            
            // Video plays automatically, but this ensures it's playing
            video.play();
        }
    }
    
    // Form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        // Only add this event listener if we're not using POST method
        // (for local development without Django backend)
        if (contactForm.method.toLowerCase() !== 'post') {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Thank you for your message! I will get back to you soon.');
                contactForm.reset();
            });
        }
    }
});