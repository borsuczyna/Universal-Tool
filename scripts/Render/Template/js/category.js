let $ = (selector) => document.querySelector(selector);

let categories = [
    {
        name: "Video",
        url: '/video',
        subCategory: [
            {
                name: "YouTube downloader",
                url: '/youtube-downloader'
            },
            {
                name: "Cut",
                url: '/cut'
            },
            {
                name: "Crop",
                url: '/crop'
            },
            {
                name: "Resize",
                url: '/resize'
            },
            {
                name: "Rotate",
                url: '/rotate'
            },
            {
                name: "Reverse",
                url: '/reverse'
            },
            {
                name: "Change speed",
                url: '/change_speed'
            },
            {
                name: "Mute",
                url: '/mute'
            },
            {
                name: "Merge",
                url: '/merge'
            },
        ]
    },
    {
        name: "Image",
        url: '/image',
        subCategory: [
            {
                name: "Image downloader",
            }
        ]
    },
    {
        name: "GIF",
        url: '/gif',
        subCategory: [
            {
                name: "GIF downloader",
            }
        ]
    },
    {
        name: "GIF",
        url: '/gif',
        subCategory: [
            {
                name: "GIF downloader",
            }
        ]
    },
]

window.onload = function() {
    let topCategories = $('#categories-list');

    let current = window.location.pathname;
    current = current.replace(/^\//, '').split('/')[0]; 

    let currentCategory = null;

    const params = new URLSearchParams(window.location.search);

    let file = params.get('file');
    if(file && file.length > 0) {
        file = '?file=' + file;
    } else {
        file = '';
    }

    for(let category of categories) {
        let categoryElement = document.createElement('li');
        categoryElement.innerHTML = `${category.name}`;
        categoryElement.classList.add('noselect');

        categoryElement.onclick = function() {
            window.location.href = `${category.url}${file}`;
        }

        if(current == category.url.replace(/^\//, '')) {
            currentCategory = category;
            categoryElement.classList.add('category-active');
        }

        topCategories.appendChild(categoryElement);
    }

    let subCategories = $('#sub-categories-list');
    let currentSub = window.location.pathname;
    currentSub = currentSub.replace(/^\//, '').split('/')[1];

    if(currentCategory == null) {
        subCategories.style.display = 'none';
        return;
    }

    for(let subCategory of currentCategory.subCategory) {
        let subCategoryElement = document.createElement('li');
        subCategoryElement.innerHTML = `${subCategory.name}`;
        subCategoryElement.classList.add('noselect');

        subCategoryElement.onclick = function() {
            window.location.href = `${currentCategory.url}${subCategory.url}${file}`;
        }

        if(currentSub == subCategory.url.replace(/^\//, '')) {
            subCategoryElement.classList.add('category-active');
        }

        subCategories.appendChild(subCategoryElement);
    }
};

/*<li>YouTube downloader</li>
<li>Video</li>
<li>Image</li>
<li>GIF</li> */