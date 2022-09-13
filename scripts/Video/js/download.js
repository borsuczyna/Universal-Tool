function downloadFile(url) {
    document.getElementById('my_iframe').src = url;
};

addEventListener('load', () => {
    let download = $('#download-button');
    
    // download.addEventListener('click', () => {
    //     window.location.replace('<%= file %>');
    // }); 
});