const cropData = {
    selected: false,
    holding: false,
    moving: false,
};
const touch = {
    x: 0,
    y: 0,
    isDown: false
};
const cursor = {
    x: 0,
    y: 0,
    isDown: false,
};
var crop = player = ctx = null;
var resizePoints = {
    'left': {
        position: (x, y, width, height) => {
            return [x, y + height/2]
        },
        cursor: 'w-resize',
        update: (rect) => {
            let newX = (cursor.x - rect.x)/rect.width;
            let diff = (cropData.selected.x - newX);
            cropData.selected.x = newX;
            cropData.selected.width += diff;
        }
    },
    'left-top': {
        position: (x, y, width, height) => {
            return [x, y]
        },
        cursor: 'nw-resize',
        update: (rect) => {
            let newX = (cursor.x - rect.x)/rect.width;
            let diff = (cropData.selected.x - newX);
            cropData.selected.x = newX;
            cropData.selected.width += diff;

            let newY = (cursor.y - rect.y)/rect.height;
            diff = (cropData.selected.y - newY);
            cropData.selected.y = newY;
            cropData.selected.height += diff;
        }
    },
    'left-bottom': {
        position: (x, y, width, height) => {
            return [x, y + height]
        },
        cursor: 'ne-resize',
        update: (rect) => {
            let newX = (cursor.x - rect.x)/rect.width;
            let diff = (cropData.selected.x - newX);
            cropData.selected.x = newX;
            cropData.selected.width += diff;

            let newY = (cursor.y - rect.y)/rect.height;
            cropData.selected.height = newY - cropData.selected.y;
        }
    },
    'top': {
        position: (x, y, width, height) => {
            return [x + width/2, y]
        },
        cursor: 's-resize',
        update: (rect) => {
            let newY = (cursor.y - rect.y)/rect.height;
            diff = (cropData.selected.y - newY);
            cropData.selected.y = newY;
            cropData.selected.height += diff;
        }
    },
    'right-top': {
        position: (x, y, width, height) => {
            return [x + width, y]
        },
        cursor: 'ne-resize',
        update: (rect) => {
            let newX = (cursor.x - rect.x)/rect.width;
            cropData.selected.width = newX - cropData.selected.x;

            let newY = (cursor.y - rect.y)/rect.height;
            diff = (cropData.selected.y - newY);
            cropData.selected.y = newY;
            cropData.selected.height += diff;
        }
    },
    'right': {
        position: (x, y, width, height) => {
            return [x + width, y + height/2]
        },
        cursor: 'w-resize',
        update: (rect) => {
            let newX = (cursor.x - rect.x)/rect.width;
            cropData.selected.width = newX - cropData.selected.x;
        }
    },
    'right-bottom': {
        position: (x, y, width, height) => {
            return [x + width, y + height]
        },
        cursor: 'nw-resize',
        update: (rect) => {
            let newX = (cursor.x - rect.x)/rect.width;
            cropData.selected.width = newX - cropData.selected.x;

            let newY = (cursor.y - rect.y)/rect.height;
            cropData.selected.height = newY - cropData.selected.y;
        }
    },
    'bottom': {
        position: (x, y, width, height) => {
            return [x + width/2, y + height]
        },
        cursor: 's-resize',
        update: (rect) => {
            let newY = (cursor.y - rect.y)/rect.height;
            cropData.selected.height = newY - cropData.selected.y;
        }
    },
}

function updateCropCanvas() {
    requestAnimationFrame(updateCropCanvas);

    let rect = player.getBoundingClientRect();
    crop.style.left = `${rect.x}px`;
    crop.style.top = `${rect.y}px`;
    crop.style.width = `${rect.width}px`;
    crop.style.height = `${rect.height}px`;
    crop.width = rect.width;
    crop.height = rect.height;

    let overBox = false;
    let overPoint = false;
    let overCropCanvas = (cursor.x >= rect.x && cursor.x <= rect.x + rect.width && cursor.y >= rect.y && cursor.y <= rect.y + rect.height);

    if(cropData.selected) {
        let x = cropData.selected.x;
        let y = cropData.selected.y;
        let width = cropData.selected.width;
        let height = cropData.selected.height;

        if(x + width < x) {
            x += width;
            width = -width;
        } if(y + height < y) {
            y += height;
            height = -height;
        }

        x *= rect.width;
        y *= rect.height;
        width *= rect.width;
        height *= rect.height;

        x = Math.floor(x);
        y = Math.floor(y);
        width = Math.floor(width);
        height = Math.floor(height);

        ctx.fillStyle = 'rgba(15,15,15,0.7)';
        ctx.fillRect(x, 0, rect.width - x, y);
        ctx.fillRect(0, 0, x, rect.height);
        ctx.fillRect(x, y + height, width, rect.height);
        ctx.fillRect(x + width, y, rect.width, rect.height);

        // Borders
        ctx.fillStyle = 'white';
        ctx.fillRect(x, y, 1, height);
        ctx.fillRect(x, y, width, 1);
        ctx.fillRect(x + width, y, 1, height);
        ctx.fillRect(x, y + height, width, 1);
        
        // Grab points
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        for(let i in resizePoints) {
            let data = resizePoints[i];
            let pos = data.position(x, y, width, height);
            ctx.strokeRect(pos[0] - 5, pos[1] - 5, 10, 10);

            if(cursor.x >= rect.x + pos[0] - 8 && cursor.x <= rect.x + pos[0] + 8 && cursor.y >= rect.y + pos[1] - 8 && cursor.y <= rect.y + pos[1] + 8 && cropData.holding != 'creating') {
                overPoint = i;
                crop.style.cursor = data.cursor;
            }
        }

        if(cursor.x >= rect.x + x && cursor.x <= rect.x + x + width && cursor.y >= rect.y + y && cursor.y <= rect.y + y + height && cropData.holding != 'creating') {
            overBox = true;
        }
    }

    if(overPoint && !cropData.holding && cursor.isDown) {
        cropData.holding = 'resize';
        cropData.resize = overPoint;
    } else if(cropData.holding == 'resize') {
        if(!cursor.isDown) cropData.holding = false;

        if(cropData.selected.width < 0) {
            cropData.selected.x += cropData.selected.width;
            cropData.selected.width = -cropData.selected.width;
        } if(cropData.selected.height < 0) {
            cropData.selected.y += cropData.selected.height;
            cropData.selected.height = -cropData.selected.height;
        }

        resizePoints[cropData.resize].update(rect);

        return;
    }

    if(!overCropCanvas || overPoint) return;

    if(!overBox) {
        crop.style.cursor = 'crosshair';

        if(!cropData.holding && cursor.isDown) {
            cropData.holding = 'creating';
            cropData.selected = {
                x: Math.floor(cursor.x - rect.x)/rect.width,
                y: Math.floor(cursor.y - rect.y)/rect.height,
                width: 0,
                height: 0,
            }
        } else if(cropData.holding == 'creating') {
            if(!cursor.isDown) cropData.holding = false;

            cropData.selected.width = Math.floor(cursor.x - rect.x - cropData.selected.x * rect.width)/rect.width;
            cropData.selected.height = Math.floor(cursor.y - rect.y - cropData.selected.y * rect.height)/rect.height;
        }
    } else {
        crop.style.cursor = 'move';

        if(!cropData.holding && cursor.isDown) {
            cropData.holding = 'moving';
            cropData.moving = {
                x: cursor.x,
                y: cursor.y
            }
        } else if(cropData.holding == 'moving') {
            if(!cursor.isDown) cropData.holding = false;

            cropData.selected.x += (cursor.x - cropData.moving.x)/rect.width;
            cropData.selected.y += (cursor.y - cropData.moving.y)/rect.height;
            cropData.moving.x = cursor.x;
            cropData.moving.y = cursor.y;

            if(cropData.selected.x < 0) {
                cropData.selected.x = 0;
            } if(cropData.selected.y < 0) {
                cropData.selected.y = 0;
            } if(cropData.selected.x + cropData.selected.width > 1) {
                cropData.selected.x = 1 - cropData.selected.width;
            } if(cropData.selected.y + cropData.selected.height > 1) {
                cropData.selected.y = 1 - cropData.selected.height;
            }

            if(cropData.selected.x + cropData.selected.width < 0) {
                cropData.selected.x = -cropData.selected.width;
            } if(cropData.selected.y + cropData.selected.height < 0) {
                cropData.selected.y = -cropData.selected.height;
            } if(cropData.selected.x > 1) {
                cropData.selected.x = 1;
            } if(cropData.selected.y > 1) {
                cropData.selected.y = 1;
            }
        }
    }
} 

addEventListener('mousemove', (e) => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
});

addEventListener('mousedown', (e) => {
    let rect = player.getBoundingClientRect();
    let overCropCanvas = (cursor.x >= rect.x && cursor.x <= rect.x + rect.width && cursor.y >= rect.y && cursor.y <= rect.y + rect.height);
    if(!overCropCanvas || e.button != 0) return;

    cursor.isDown = true;
});

addEventListener('mouseup', (e) => {
    if(e.button != 0) return;

    cursor.isDown = false;
});

addEventListener('load', () => {
    player = $('#video-player');
    crop = $('#crop');
    ctx = crop.getContext('2d');

    requestAnimationFrame(updateCropCanvas);
});

addEventListener('touchstart', (e) => {
    let rect = player.getBoundingClientRect();
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;
    let overCropCanvas = (x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height);
    if(!overCropCanvas) return;
    
    touch.isDown = true;

    cropData.holding = 'creating';
    cropData.selected = {
        x: Math.floor(x - rect.x)/rect.width,
        y: Math.floor(y - rect.y)/rect.height,
        width: 0,
        height: 0,
    }
});

addEventListener('touchend', (e) => {
    touch.isDown = false;
});

addEventListener('touchmove', (e) => {
    if(!touch.isDown) return;

    let rect = player.getBoundingClientRect();
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;

    cropData.selected.width = Math.floor(x - rect.x - cropData.selected.x * rect.width)/rect.width;
    cropData.selected.height = Math.floor(y - rect.y - cropData.selected.y * rect.height)/rect.height;
});