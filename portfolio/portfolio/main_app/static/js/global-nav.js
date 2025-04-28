// main_app/static/js/global-nav.js
// This file handles navigation across all pages
document.addEventListener('DOMContentLoaded', function() {
    console.log('Global navigation initialized');
    
    // Gear icon navigation toggle
    const gearIcon = document.getElementById('gearIcon');
    const gearNavMenu = document.getElementById('gearNavMenu');
    
    if (gearIcon && gearNavMenu) {
        console.log('Gear navigation elements found');
        
        // Toggle menu when gear icon is clicked
        gearIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            gearNavMenu.classList.toggle('active');
            console.log('Gear clicked, menu toggled');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!gearNavMenu.contains(e.target) && !gearIcon.contains(e.target)) {
                gearNavMenu.classList.remove('active');
            }
        });
        
        // Add hover effect to adjust gear animation speed
        gearIcon.addEventListener('mouseenter', function() {
            this.style.animationDuration = '8s'; // Slightly faster on hover
        });
        
        gearIcon.addEventListener('mouseleave', function() {
            this.style.animationDuration = '10s'; // Return to normal speed
        });
    } else {
        console.error('Gear navigation elements not found. gearIcon:', gearIcon, 'gearNavMenu:', gearNavMenu);
    }
});