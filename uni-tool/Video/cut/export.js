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
    
    var result = await makeRequest('POST', '/api/cut', {
        file: videoUrl,
        start: player.duration * currentPosition[0],
        finish: player.duration * (currentPosition[0] + currentPosition[1]),
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