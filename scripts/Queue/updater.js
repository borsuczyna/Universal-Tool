var token = null;
var timeElapsed = <%= new Date() - start %>; ''; // ignore this error in next lines

function makeRequest(method, url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
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
        xhr.send();
    });
}

updateElapsedTime = () => {
    timeElapsed += 1000;

    timeElapsedElement.innerHTML = convertMS(timeElapsed);
};

updateProgressBar = async () => {
    try {
        let value = await makeRequest('GET', `/api/queue?token=${token}`);
        if(!value) return new Error('Wrong token');
        value = JSON.parse(value);

        progressBar.value = value.progress || 0;

        if(value.console) {
            let html = '';

            for(let message of value.console) {
                html = `<span class="message-${message[0]}">${message[1]}</span><br>` + html;
            }

            consoleElement.innerHTML = html;
        }

        if(value.finished) {
            window.location.replace(`/${value.next}?file=${value.finished}`);
        }
    } catch(e) {
        console.log(e);
    }
};

addEventListener('load', () => {
    timeElapsedElement = $('#time-elapsed');
    progressBar = $('#progress-bar');
    consoleElement = $('#console');
    
    setInterval(updateElapsedTime, 1000);
    setInterval(updateProgressBar, 500);

    const params = new URLSearchParams(window.location.search);
    token = params.get('token');
});