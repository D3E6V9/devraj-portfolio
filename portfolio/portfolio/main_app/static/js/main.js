// main_app/static/js/main.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('Document loaded, initializing page-specific features...');
    
    // Note: Gear navigation is handled by global-nav.js
    // DO NOT add duplicate gear navigation code here
    
    // Local video handling
    const video = document.getElementById('background-video');
    if (video) {
        // Ensure video plays
        // Ensure video plays
        video.play().catch(function(error) {
            console.log("Video play was prevented: ", error);
            // Add a play button if autoplay is blocked
            if (error.name === "NotAllowedError") {
                const videoContainer = document.querySelector('.video-container');
                const playButton = document.createElement('button');
                playButton.innerHTML = '<i class="fas fa-play"></i>';
                playButton.className = 'video-play-button';
                videoContainer.appendChild(playButton);
                
                playButton.addEventListener('click', function() {
                    video.play();
                    playButton.style.display = 'none';
                });
            }
        });
        
        // Make video responsive
        function resizeVideo() {
            const container = document.querySelector('.video-section');
            if (!container) return;
            
            const width = container.offsetWidth;
            const height = container.offsetHeight;
            
            if (width / height > 16/9) {
                // Container is wider than video aspect ratio
                video.style.width = '100%';
                video.style.height = 'auto';
            } else {
                // Container is taller than video aspect ratio
                video.style.height = '100%';
                video.style.width = 'auto';
            }
        }
        
        // Initial resize and add resize listener
        resizeVideo();
        window.addEventListener('resize', resizeVideo);
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