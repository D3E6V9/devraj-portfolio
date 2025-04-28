// main_app/static/js/threesixninepix.js
document.addEventListener('DOMContentLoaded', function() {
    // Note: Gear icon navigation is handled by global-nav.js
    // DO NOT add duplicate gear navigation code here
    
    // Gallery photo interactions
    const galleryItems = document.querySelectorAll('.gallery-item');
    const swipeableGallery = document.querySelector('.swipeable-gallery-container');
    const swipeableImage = document.querySelector('.swipeable-gallery-image');
    const swipeableCaption = document.querySelector('.swipeable-gallery-caption');
    const swipeableCaptionTitle = swipeableCaption.querySelector('h3');
    const swipeableCaptionText = swipeableCaption.querySelector('p');
    const swipeableCounter = document.querySelector('.swipeable-gallery-counter');
    const swipeableCurrent = swipeableCounter.querySelector('.current');
    const swipeableTotal = swipeableCounter.querySelector('.total');
    const prevButton = document.querySelector('.swipeable-gallery-nav.prev');
    const nextButton = document.querySelector('.swipeable-gallery-nav.next');
    const closeButton = document.querySelector('.swipeable-gallery-close');
    
    // Track current gallery and image index
    let currentGalleryId = null;
    let currentImageIndex = 0;
    let galleryImages = [];
    
    // Initialize fade-in animations for gallery items
    if (galleryItems.length > 0) {
        galleryItems.forEach(item => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.2 });
            
            observer.observe(item);
            
            // Add click handler for gallery item to open swipeable gallery
            item.addEventListener('click', function() {
                const galleryId = this.getAttribute('data-gallery-id');
                openSwipeableGallery(galleryId);
            });
        });
    }
    
    // Function to extract gallery data from the hidden div
    function getGalleryData(galleryId) {
        const galleryElement = document.querySelector(`#galleryData div[data-gallery-id="${galleryId}"]`);
        if (!galleryElement) return null;
        
        const galleryTitle = galleryElement.getAttribute('data-gallery-title');
        const imageElements = galleryElement.querySelectorAll('div[data-image-src]');
        
        const images = Array.from(imageElements).map(el => ({
            src: el.getAttribute('data-image-src'),
            alt: el.getAttribute('data-image-alt')
        }));
        
        return {
            id: galleryId,
            title: galleryTitle,
            images: images
        };
    }
    
    // Function to update the gallery view with current image
    function updateGalleryView() {
        if (!galleryImages.length) return;
        
        const image = galleryImages[currentImageIndex];
        swipeableImage.src = image.src;
        swipeableImage.alt = image.alt;
        
        // Update caption
        const galleryData = getGalleryData(currentGalleryId);
        swipeableCaptionTitle.textContent = galleryData.title;
        swipeableCaptionText.textContent = `Image ${currentImageIndex + 1} of ${galleryImages.length}`;
        
        // Update counter
        swipeableCurrent.textContent = currentImageIndex + 1;
        
        // Toggle navigation buttons visibility based on current index
        prevButton.style.visibility = currentImageIndex > 0 ? 'visible' : 'hidden';
        nextButton.style.visibility = currentImageIndex < galleryImages.length - 1 ? 'visible' : 'hidden';
    }
    
    // Function to open swipeable gallery
    function openSwipeableGallery(galleryId, initialIndex = 0) {
        // Get gallery data
        const galleryData = getGalleryData(galleryId);
        if (!galleryData || galleryData.images.length === 0) return;
        
        // Set current gallery and images
        currentGalleryId = galleryId;
        galleryImages = galleryData.images;
        currentImageIndex = initialIndex;
        
        // Update counter
        swipeableTotal.textContent = galleryImages.length;
        updateGalleryView();
        
        // Show gallery
        document.body.style.overflow = 'hidden';
        swipeableGallery.classList.add('active');
    }
    
    // Function to close swipeable gallery
    function closeSwipeableGallery() {
        swipeableGallery.classList.remove('active');
        setTimeout(() => {
            document.body.style.overflow = '';
            // Reset data
            currentGalleryId = null;
            currentImageIndex = 0;
            galleryImages = [];
        }, 300);
    }
    
    // Function to navigate to previous image
    function showPreviousImage() {
        if (galleryImages.length === 0 || currentImageIndex <= 0) return;
        
        currentImageIndex--;
        updateGalleryView();
    }
    
    // Function to navigate to next image
    function showNextImage() {
        if (galleryImages.length === 0 || currentImageIndex >= galleryImages.length - 1) return;
        
        currentImageIndex++;
        updateGalleryView();
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!swipeableGallery.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeSwipeableGallery();
        } else if (e.key === 'ArrowLeft') {
            showPreviousImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    });
    
    // Touch swipe functionality
    let touchStartX = 0;
    let touchEndX = 0;
    
    swipeableGallery.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    swipeableGallery.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const swipeThreshold = 50; // Minimum pixels to trigger a swipe
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swiped left (next)
            showNextImage();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swiped right (previous)
            showPreviousImage();
        }
    }
    
    // Add event listeners
    if (closeButton) {
        closeButton.addEventListener('click', closeSwipeableGallery);
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', showPreviousImage);
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', showNextImage);
    }
    
    // Close gallery when clicking outside the image
    swipeableGallery.addEventListener('click', function(e) {
        if (e.target === swipeableGallery) {
            closeSwipeableGallery();
        }
    });
});