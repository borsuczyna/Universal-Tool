RenderUploader = async () => {
    let page = await Render('uploader', __dirname, null, true);
    return page;
}