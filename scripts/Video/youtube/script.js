var pasteButton = urlInput = null;

addEventListener('load', () => {
    pasteButton = $('#paste');
    urlInput = $('#video-url');

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
    })
});