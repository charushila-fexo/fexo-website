document.addEventListener("DOMContentLoaded", () => {

    const videos = [
        "assests/videos/Banking&lending.mp4",
        "assests/videos/Insurance_claims.mp4",
        "assests/videos/Audit&Compilance.mp4"
    ];

    let index = 0;
    const player = document.getElementById("videoPlayer");

    if (!player) {
        console.error("Video element not found!");
        return;
    }

    function playNextVideo() {
        player.src = videos[index];

        player.load();   // IMPORTANT
        player.play().catch(err => console.error("Play error:", err));

        index = (index + 1) % videos.length;
    }

    player.addEventListener("ended", () => {
        console.log("Video ended, loading next...");
        playNextVideo();
    });

    playNextVideo();
});
