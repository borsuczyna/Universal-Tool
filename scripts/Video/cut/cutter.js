var i = 0;
var cutter = context = videoElement = player = video = dumpStart = dumpEnd = null;
var videoFrames = [];
var currentPosition = [0.1, 0.8, 0.3];
var cursor = {
    x: 0,
    y: 0,
    down: [],
    holding: false,
    movedDistance: 0,
}

isMouseInPosition = (x, y, w, h) => {
    return (cursor.x >= x && cursor.x <= x+w && cursor.y >= y && cursor.y <= y+h);
}

addEventListener('load', () => {
    cutter = $('#video-cutter');
    context = cutter.getContext('2d');
    
    video = document.createElement('video');
    video.src = videoUrl;
    video.muted = true;
    video.addEventListener('loadeddata', () => {
        video.play();
        updateCanvasDimensions();
        updatePreview();
        updateCutter();
    });

    dumpStart = $('#dump-start-button');
    dumpEnd = $('#dump-end-button');

    dumpStart.addEventListener('click', () => {
        let full = currentPosition[0] + currentPosition[1];
        currentPosition[0] = player.currentTime/player.duration;
        currentPosition[1] = full - currentPosition[0];
        if(currentPosition[0] > full) {
            currentPosition[0] = full - 0.001;
        }
    });

    dumpEnd.addEventListener('click', () => {
        currentPosition[1] = player.currentTime/player.duration - currentPosition[0];
    });
});

addEventListener('mousemove', (e) => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
});

function catchElements() {
    const rect = cutter.getBoundingClientRect();
    let x = (cursor.x - rect.x)/rect.width;

    if(isMouseInPosition(rect.x + cutter.width * currentPosition[0], rect.y, rect.width * currentPosition[1], rect.height)) {
        cursor.holding = {
            element: 'inner',
            x: x
        }
    } else if(isMouseInPosition(rect.x + cutter.width * currentPosition[0] - 11, rect.y, 10, rect.height)) {
        cursor.holding = {
            element: 'resize-left',
            x: x
        }
    } else if(isMouseInPosition(rect.x + cutter.width * currentPosition[0] + cutter.width * currentPosition[1] + 1, rect.y, 10, rect.height)) {
        cursor.holding = {
            element: 'resize-right',
            x: x
        }
    }
}

addEventListener('mousedown', (e) => {
    cursor.down[e.button] = true;

    if(e.button != 0) return;
    catchElements();
});

addEventListener('mouseup', (e) => {
    cursor.down[e.button] = false;

    if(e.button != 0) return;
    cursor.holding = false;
    const rect = cutter.getBoundingClientRect();
    
    if(Math.abs(cursor.movedDistance) == 0 && isMouseInPosition(rect.x, rect.y, rect.width, rect.height)) {
        let position = (cursor.x - rect.x)/rect.width;
        
        if(position < currentPosition[0]) {
            let diff = position - currentPosition[0];
            currentPosition[0] += diff;
            currentPosition[1] -= diff;
        } else if(position > currentPosition[0] + currentPosition[1]) {
            let diff = position - (currentPosition[0] + currentPosition[1]);
            currentPosition[1] += diff;
        }
        
        position *= player.duration;

        player.currentTime = position;
    }

    cursor.movedDistance = 0;
});

addEventListener('touchmove', (e) => {
    cursor.x = e.changedTouches[0].clientX;
    cursor.y = e.changedTouches[0].clientY;
});

addEventListener('touchstart', catchElements);

addEventListener('touchend', () => {
    cursor.holding = false;
});

updateCanvasDimensions = () => {
    const rect = cutter.getBoundingClientRect();
    cutter.width = rect.width;
    cutter.height = rect.height;
};

addEventListener('resize', updateCanvasDimensions);

updatePreview = () => {
    const aspectRatio = video.videoWidth/video.videoHeight;
    const width = cutter.height * aspectRatio;
    const possible = Math.floor(cutter.width/width);
    const duration = video.duration;
    
    if(i < possible+1) {
        i++;
    } else {
        i = 0;
    }
    
    video.pause();
    video.currentTime = duration * (i/(possible+1));

    if(!videoFrames[i]) {
        videoFrames[i] = {
            element: document.createElement('canvas'),
        }
    }

    videoFrames[i].element.width = width;
    videoFrames[i].element.height = cutter.height;

    videoFrames[i].context = videoFrames[i].element.getContext('2d');

    videoFrames[i].context.fillStyle = 'red';
    videoFrames[i].context.drawImage(video, 0, 0, width, cutter.height);

    setTimeout(updatePreview, 1000/15);
};

updateCutter = () => {
    const aspectRatio = video.videoWidth/video.videoHeight;
    const width = cutter.height * aspectRatio;
    const possible = Math.floor(cutter.width/width);

    context.clearRect(0, 0, cutter.width, cutter.height);

    for(let i = 0; i < possible+1; i++) {
        if(!videoFrames[i]) break;
        
        context.drawImage(videoFrames[i].element, width * i, 0, width, cutter.height);
    }

    context.fillStyle = 'rgba(45, 45, 45, 0.8)';
    context.fillRect(0, 0, cutter.width * currentPosition[0], cutter.height);
    context.fillRect(cutter.width * currentPosition[0] + cutter.width * currentPosition[1], 0, cutter.width - (cutter.width * currentPosition[1]), cutter.height);

    context.fillStyle = 'rgba(255, 255, 255, 1)';
    context.fillRect(cutter.width * currentPosition[0], 0, 1, cutter.height);
    context.fillRect(cutter.width * currentPosition[0] + cutter.width * currentPosition[1], 0, 1, cutter.height);
    
    context.fillStyle = 'rgba(0, 224, 255, 1)';
    roundRect(context, cutter.width * currentPosition[0] - 11, 0, 10, cutter.height, {tl: 5, tr: 0, br: 0, bl: 5}, true, false);
    roundRect(context, cutter.width * currentPosition[0] + cutter.width * currentPosition[1] + 1, 0, 10, cutter.height, {tl: 0, tr: 5, br: 5, bl: 0}, true, false);

    context.beginPath();
    context.fillStyle = 'white';

    context.arc(cutter.width * currentPosition[0] - 5, cutter.height/2, 2, 0, 2 * Math.PI, false);
    context.fill();
    context.arc(cutter.width * currentPosition[0] - 5, cutter.height/2 - 8, 2, 0, 2 * Math.PI, false);
    context.fill();
    context.arc(cutter.width * currentPosition[0] - 5, cutter.height/2 + 8, 2, 0, 2 * Math.PI, false);
    context.fill();

    context.closePath();
    context.beginPath();
    
    context.arc(cutter.width * currentPosition[0] + cutter.width * currentPosition[1] + 6, cutter.height/2, 2, 0, 2 * Math.PI, false);
    context.fill();
    context.arc(cutter.width * currentPosition[0] + cutter.width * currentPosition[1] + 6, cutter.height/2 - 8, 2, 0, 2 * Math.PI, false);
    context.fill();
    context.arc(cutter.width * currentPosition[0] + cutter.width * currentPosition[1] + 6, cutter.height/2 + 8, 2, 0, 2 * Math.PI, false);
    context.fill();

    cutter.style.cursor = 'default';
    
    const rect = cutter.getBoundingClientRect();
    if(isMouseInPosition(rect.x + cutter.width * currentPosition[0], rect.y, rect.width * currentPosition[1], rect.height)) {
        cutter.style.cursor = 'grab';
    } else if(isMouseInPosition(rect.x + cutter.width * currentPosition[0] - 11, rect.y, 10, rect.height)) {
        cutter.style.cursor = 'e-resize';
    } else if(isMouseInPosition(rect.x + cutter.width * currentPosition[0] + cutter.width * currentPosition[1] + 1, rect.y, 10, rect.height)) {
        cutter.style.cursor = 'e-resize';
    }

    if(cursor.holding) {
        let x = (cursor.x - rect.x)/rect.width;
        let diff = x - cursor.holding.x;
        cursor.holding.x = x;

        if(cursor.holding.element == 'inner') {
            currentPosition[0] += diff
        } else if(cursor.holding.element == 'resize-left') {
            currentPosition[0] += diff;
            currentPosition[1] -= diff;
        } else if(cursor.holding.element == 'resize-right') {
            currentPosition[1] += diff;
        }

        cursor.movedDistance += diff;

        currentPosition[1] = Math.min(Math.max(currentPosition[1], 0.01), 1);
        currentPosition[0] = Math.max(Math.min(currentPosition[0], 1 - currentPosition[1]), 0);

        let target = (currentPosition[0] + currentPosition[1]) * player.duration;
        if(cursor.holding.element == 'inner' || cursor.holding.element == 'resize-left') {
            target = currentPosition[0] * player.duration + 0.02;
        }

        if(player.currentTime != target) player.currentTime = target;
    } else if(isMouseInPosition(rect.x, rect.y, rect.width, rect.height)) {
        context.fillStyle = 'rgba(255, 255, 255, 1)';
        context.fillRect(cursor.x - rect.x, 0, 1, cutter.height);
    }

    let position = (player.currentTime/player.duration);
    context.fillStyle = 'rgba(255, 255, 255, 1)';
    context.fillRect(cutter.width * position, 0, 1, cutter.height);

    if(position < currentPosition[0]) {
        player.currentTime = currentPosition[0] * player.duration + 0.02;
    } else if(position > currentPosition[0] + currentPosition[1]) {
        if(!player.paused) {
            player.currentTime = currentPosition[0] * player.duration + 0.02;
        } else {
            player.currentTime = (currentPosition[0] + currentPosition[1]) * player.duration;
        }
    }

    requestAnimationFrame(updateCutter);
};