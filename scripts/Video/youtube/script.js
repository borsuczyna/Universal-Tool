var pasteButton = urlInput = selection = selectionOptions = selected = null;
var open = false;

function openOrClose() {
    let svg = $('#open_close_selection');
    svg.classList.toggle('open');
    selection.classList.toggle('open');
    selectionOptions.classList.toggle('open');
    open = !open;
}

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
    
    try {
        var url = urlInput.value;
        var result = await makeRequest('POST', '/api/youtube-downloader', {
            url: url,
            quality: selected.innerHTML
        });
        
        result = JSON.parse(result);
        
        if(result.token && result.token.length > 0) {
            window.location.replace(`/queue?token=${result.token}`)
        }
    } catch {}

    canClick = true;
}

addEventListener('load', () => {
    pasteButton = $('#paste');
    urlInput = $('#video-url');
    selection = $('#select');
    selected = $('#selected');
    selectionOptions = $('#selection-options');
    listItems = [...selectionOptions.getElementsByTagName("li")];

    selected.innerHTML = listItems[0].innerHTML;
    
    listItems.forEach(item => {
        item.addEventListener('click', () => {
            if(!open) return;
            
            selected.innerHTML = item.innerHTML;
            openOrClose();
        });
    });

    pasteButton.addEventListener('click', async () => {
        try {
            const clipboardItems = await navigator.clipboard.read();

            for (const clipboardItem of clipboardItems) {
                for (const type of clipboardItem.types) {
                    const blob = await clipboardItem.getType(type);
                    let text = await blob.text();
                    urlInput.value = text;
                    
                    break;
                }
            }
        } catch {};
    });

    $('#export-button').addEventListener('click', async () => {
        await exportVideo();
    });

    selection.addEventListener('click', openOrClose);
});