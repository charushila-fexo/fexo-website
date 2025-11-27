  const videos = [
    "assests/videos/Banking&lending.mp4",
    "assests/videos/Insurance claims.mp4",
    "assests/videos/Audit&Compilance.mp4"
  ];

  let index = 0;
  const player = document.getElementById("videoPlayer");

  function playNextVideo() {
    player.src = videos[index];
    player.play();
    index = (index + 1) % videos.length; // Loop back to first video
  }

  player.addEventListener("ended", playNextVideo);

  // Start playlist
  playNextVideo();