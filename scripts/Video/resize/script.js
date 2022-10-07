var widthInput = heightInput = percentageInput = video = keepAspectRatio = null;
var aspectRatio = 1;
var canClick = true;

function updateInputs() {
    widthInput.value = video.videoWidth;
    heightInput.value = video.videoHeight;
    aspectRatio = video.videoWidth/video.videoHeight;
}

function onInputsUpdate() {
    if(keepAspectRatio.checked) {
        const other = this == widthInput ? heightInput : widthInput;
        
        if(other == heightInput) {
            other.value = Math.floor(this.value/aspectRatio);
        } else {
            other.value = Math.floor(this.value*aspectRatio);
        }
    }
}

function percentageChanged() {
    widthInput.value = Math.floor(video.videoWidth*this.value/100);
    heightInput.value = Math.floor(video.videoHeight*this.value/100);
}

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
    
    var result = await makeRequest('POST', '/api/resize', {
        file: videoUrl,
        width: widthInput.value,
        height: heightInput.value,
    });
    
    result = JSON.parse(result);
    
    if(result.token && result.token.length > 0) {
        window.location.replace(`/queue?token=${result.token}`)
    }

    canClick = true;
};

addEventListener('load', () => {
    widthInput = $('#width');
    heightInput = $('#height');
    percentageInput = $('#percentage');
    keepAspectRatio = $('#keep-aspect-ratio');
    
    widthInput.addEventListener('input', onInputsUpdate);
    heightInput.addEventListener('input', onInputsUpdate);
    percentageInput.addEventListener('input', percentageChanged);

    video = document.createElement('video');
    video.src = videoUrl;
    video.muted = true;
    video.addEventListener('loadeddata', () => {
        updateInputs();
    });
});