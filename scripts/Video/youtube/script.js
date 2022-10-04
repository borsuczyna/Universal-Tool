var pasteButton = urlInput = selection = selectionOptions = selected = null;
var open = false;

function openOrClose() {
    let svg = $('#open_close_selection');
    svg.classList.toggle('open');
    selection.classList.toggle('open');
    selectionOptions.classList.toggle('open');
    open = !open;
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
        } catch {}
    });

    selection.addEventListener('click', openOrClose);
});