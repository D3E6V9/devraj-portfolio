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
                playlist: 'GqXeZU9XcEE' // Required for looping
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
    // Set video quality (small, medium, large, hd720, hd1080, highres)
    player.setPlaybackQuality('hd720');
}

function onPlayerStateChange(event) {
    // If video ends, replay it
    if (event.data === YT.PlayerState.ENDED) {
        player.playVideo();
    }
}