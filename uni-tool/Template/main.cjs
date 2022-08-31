RenderTemplate = async () => {
    let page = await Render('template', __dirname, null, true);
    return page;
}