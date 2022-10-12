const metrices = [
    'pixels', 'centimeters', 'inches'
]

function createProject() {
    let name = $('#name').value;
    let width = parseInt($('#width').value) || 1280;
    let height = parseInt($('#height').value) || 720;
    let metrices = $('#metrices').value;
    let background = $('#background').value;

    if(name.length < 1 || name.length > 24) {
        console.error('Name length is invalid');
        return;
    }

    window.location = '/editor';
}

function openCloseProjectWindow() {
    $('#new-project-window').classList.toggle('whidden');
}