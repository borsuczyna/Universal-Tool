addEventListener('load', () => {
    player = $('#video-player-src');
    
    player.addEventListener('ended', () => {
        player.currentTime = 0;
        player.play();
    }); 
});

playOrPause = () => {
    if(player.paused) {
        player.play();
        $('#pause-icon').style.display = 'block';
        $('#play-icon').style.display = 'none';
    } else {
        player.pause();
        $('#pause-icon').style.display = 'none';
        $('#play-icon').style.display = 'block';
    }
};

addEventListener('load', () => {
    playButton = $('#play-button');
    playButton.addEventListener('click', playOrPause);
});

addEventListener('keydown', (e) => {
    if(e.code == 'Space') playOrPause();
});