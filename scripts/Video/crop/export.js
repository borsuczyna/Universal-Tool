var canClick = true;

function makeRequest(method, url, params) {
    params = JSON.stringify(params);
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);

        xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");

        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send(params);
    });
}

const exportVideo = async () => {
    if(!canClick) return;
    canClick = false;
    
    if(!cropData || !cropData.selected) return;
    let x = cropData.selected.x * player.videoWidth;
    let y = cropData.selected.y * player.videoHeight;
    let width = cropData.selected.width * player.videoWidth;
    let height = cropData.selected.height * player.videoHeight;

    if(width < 0) {
        x += width;
        width = -cropData.selected.width;
    } if(height < 0) {
        y += height;
        height = -height;
    }
    
    var result = await makeRequest('POST', '/api/crop', {
        file: videoUrl,
        x: x,
        y: y,
        width: width,
        height: height
    });
    
    result = JSON.parse(result);
    
    if(result.token && result.token.length > 0) {
        window.location.replace(`/queue?token=${result.token}`)
    }

    canClick = true;
};

addEventListener('load', () => {
    $('#export-button').addEventListener('click', async () => {
        await exportVideo();
    });
});