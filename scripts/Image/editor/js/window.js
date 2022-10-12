const cursor = {
    x: 0,
    y: 0,
    isDown: false,
    holding: null
}

function isMouseInPosition(x, y, w, h) {
    return (cursor.x >= x && cursor.x <= x + w && cursor.y >= y && cursor.y <= y + h);
}

addEventListener('mousedown', () => {
    cursor.isDown = true;

    // check if mouse is over any .whead
    let heads = document.getElementsByClassName('whead');
    
    for(head of heads) {
        let rect = head.getBoundingClientRect();
       
        if(isMouseInPosition(rect.x, rect.y, rect.width, rect.height)) {
            cursor.holding = {
                element: head.parentElement,
                x: cursor.x - rect.x,
                y: cursor.y - rect.y
            }
            break;
        }
    }
});

addEventListener('mouseup', () => {
    cursor.isDown = false;
    cursor.holding = false;
});

addEventListener('mousemove', (e) => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;

    let holding = cursor.holding;
    if(holding) {
        holding.element.style.left = cursor.x - holding.x + 'px';
        holding.element.style.top = cursor.y - holding.y + 'px';
    }
});