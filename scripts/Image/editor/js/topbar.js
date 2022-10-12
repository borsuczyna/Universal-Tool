/* <button class="top-button">File</button>
<button class="top-button">Edit</button>
<button class="top-button">Image</button>
<button class="top-button">Layer</button>
<button class="top-button">Type</button>
<button class="top-button">Select</button>
<button class="top-button">Filter</button>
<button class="top-button">View</button>
<button class="top-button">Window</button>
<button class="top-button">Help</button> */

const options = {
    'File': {
        'New': ()=>{},
        'Open': {
            'From local storage': ()=>{}
        }
    },
    'Edit': {},
    'Image': {},
    'Layer': {},
    'Type': {},
    'Select': {},
    'Filter': {},
    'View': {},
    'Window': {},
    'Help': {},
}

addEventListener('load', () => {
    let topButtons = document.getElementById('top-buttons');
    if(!topButtons) return;

    for(option in options) {
        let button = document.createElement('button');

        button.innerHTML = option;
        button.classList.add('top-button');

        topButtons.appendChild(button);
    }
});