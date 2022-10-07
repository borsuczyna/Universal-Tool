const upload = {
    elapsed: 0,
    remaining: 0,
    speed: 0,
    progress: 0,
    lastProgress: 0,
    file: undefined,
    canUpload: true
};

convertSecondsToTime = (seconds) => {
    if (seconds < 60) {
        return `00:${seconds < 10 ? `0${seconds}` : seconds}`;
    } else {
        let min = Math.floor(seconds / 60);
        let sec = seconds - min * 60;
        return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`;
    }
}

humanReadableSize = (size) => {
    if(size < 1024) return `${Number(size).toFixed(2)}b`;
    size /= 1024;
    if(size < 1024) return `${Number(size).toFixed(2)}kb`
    size /= 1024;
    if(size < 1024) return `${Number(size).toFixed(2)}mb`
    size /= 1024;
    if(size < 1024) return `${Number(size).toFixed(2)}gb`
    size /= 1024;
    if(size < 1024) return `${Number(size).toFixed(2)}tb`

    return `${size}?`
}

updateRemainingTime = () => {
    upload.remaining = Math.round((upload.elapsed / (upload.progress + 0.001)) - upload.elapsed); /* make sure not to divide by 0 */;
};

updateUploadStats = () => {
    let changedProgress = upload.progress - upload.lastProgress;
    let uploaded = changedProgress * upload.file.size;

    $('#upload-elapsed').innerHTML = convertSecondsToTime(upload.elapsed);  
    $('#upload-remaining').innerHTML = convertSecondsToTime(upload.remaining);
    $('#upload-speed').innerHTML = humanReadableSize(uploaded) + '/s';
};

setInterval(() => {
    upload.elapsed++;
    updateRemainingTime();
}, 1000);

function exportVideo() {
    const formData = new FormData();
    var file = document.getElementById('file');
    file = file?.files[0];
    if(!file) return;

    formData.append('originalFile', videoUrl);
    formData.append('file', file);

    upload.elapsed = 0;
    upload.canUpload = false;
    upload.file = file;
    upload.progress = 0;
    upload.lastProgress = 0;

    $('#progress').style.display = 'block';
    
    // Axios
    const config = {
        onUploadProgress: function(progressEvent) {
            const percentCompleted = (progressEvent.loaded / progressEvent.total);
            $('#progress-bar').setAttribute('value', Math.round(percentCompleted*100));
            upload.progress = percentCompleted;

            // update before updating last progress
            updateUploadStats();

            // update last progress now △
            upload.lastProgress = percentCompleted;
        }
    }
    
    axios.post('/api/merge', formData, config)
        .then(res => {
            if(res.status == 200) {
                console.log(res);
                if(res.data.token && res.data.token.length > 0) {
                    window.location.replace(`/queue?token=${res.data.token}`)
                }
            } else {
                console.log(res.data.message);
            }
        })
        .catch(err => console.log(err));
}