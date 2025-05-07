// main_app/static/js/youtube-background.js

// YouTube API code
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
    // Check if we're on a page with the youtube container
    if (document.getElementById('youtube-container')) {
        player = new YT.Player('youtube-container', {
            // Replace VIDEO_ID with your actual YouTube video ID
            videoId: 'GqXeZU9XcEE', 
            playerVars: {
                autoplay: 1,
                controls: 0,
                disablekb: 1,
                enablejsapi: 1,
                iv_load_policy: 3,
                loop: 1,
                modestbranding: 1,
                playsinline: 1,
                rel: 0,
                showinfo: 0,
                mute: 1, // Must be muted for autoplay
                playlist: 'GqXeZU9XcEE', // Required for looping
                vq: 'hd1080' // Request highest quality
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }
}

function onPlayerReady(event) {
    event.target.playVideo();
    
    // Force highest available quality
    player.setPlaybackQuality('highres');
    
    // Set player dimensions to fill container
    resizePlayer();
    
    // Listen for window resize events
    window.addEventListener('resize', resizePlayer);
}

function resizePlayer() {
    if (!player) return;
    
    const container = document.querySelector('.video-section');
    if (!container) return;
    
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    
    // Make sure the player covers the entire container
    const aspectRatio = 16/9;
    
    let playerWidth, playerHeight;
    
    // If container is wider than tall (considering aspect ratio)
    if (width / height > aspectRatio) {
        playerWidth = width * 1.2; // 20% larger than container width
        playerHeight = playerWidth / aspectRatio;
    } else {
        playerHeight = height * 1.2; // 20% larger than container height
        playerWidth = playerHeight * aspectRatio;
    }
    
    // Apply the dimensions
    const iframe = document.querySelector('.youtube-container iframe');
    if (iframe) {
        iframe.style.width = playerWidth + 'px';
        iframe.style.height = playerHeight + 'px';
        iframe.style.position = 'absolute';
        iframe.style.top = '50%';
        iframe.style.left = '50%';
        iframe.style.transform = 'translate(-50%, -50%)';
    }
}

function onPlayerStateChange(event) {
    // If video ends, replay it
    if (event.data === YT.PlayerState.ENDED) {
        player.playVideo();
    }
    
    // Additional quality check whenever the state changes
    if (player.getPlaybackQuality() !== 'highres') {
        player.setPlaybackQuality('highres');
    }
}