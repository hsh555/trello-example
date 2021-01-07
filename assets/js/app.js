
(function () {
    "use strics";

    window.app = window.app || {};

    // get data from localstorage
    window.app.data = JSON.parse(localStorage.getItem('hDataAmanj')) || {};

    // get backgroundColor from localstorage
    let bodyBackground = localStorage.getItem('background') || null;
    if (bodyBackground) {
        if (bodyBackground.search('.jpeg') > 0 || bodyBackground.search('.jpg') > 0) {
            document.body.style.backgroundColor = 'initial';
            document.body.style.backgroundImage = bodyBackground;
        } else {
            document.body.style.backgroundImage = 'initial';
            document.body.style.backgroundColor = bodyBackground;
        }
    }

    // images and colors menu
    const colorsArr = [
        'rgb(0, 121, 191)', 'rgb(210, 144, 52)', 'rgb(81, 152, 57)', 'rgb(176, 70, 50)',
        'rgb(137, 96, 158)', 'rgb(205, 90, 145)', 'rgb(75, 191, 107)', 'rgb(0, 174, 204)', 'rgb(131, 140, 145)'
    ];

    const imagesArr = [
        './assets/images/backgrounds/1.jpg', './assets/images/backgrounds/2.jpg', './assets/images/backgrounds/3.jpg', './assets/images/backgrounds/4.jpg'
    ];

    // add menu to bottom header
    let createMenuElement = app.createMenuNode(colorsArr, imagesArr);
    document.querySelector('.bottom-header .col-8').appendChild(createMenuElement);


    // add list action element to content
    let contentElement = document.querySelector('.content');
    let listActionElement = window.app.createListActionNode();
    contentElement.appendChild(listActionElement);

    // show saved data
    if (window.app.data) {
        for (let listId in window.app.data) {
            if (listId != 'countOfCards' && listId != 'countOfLists') {
                let title = window.app.data[listId]['title'];
                let listContainer = window.app.createListContainerNode(title, listId);
                if (window.app.data[listId]['cards']) {
                    for (let item in window.app.data[listId]['cards']) {
                        let card = app.createCardNode(window.app.data[listId]['cards'][item], item);
                        listContainer.childNodes[0].childNodes[1].appendChild(card);
                    }
                }
                listActionElement.before(listContainer);
            }
        }
    }
})();
