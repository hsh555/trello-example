(function () {
    "use strict";

    window.app = window.app || {};

    window.app = {
        createListActionNode: createListActionNode,
        createListContainerNode: createListContainerNode,
        createCardNode: createCardNode,
        createMenuNode: createMenuNode
    }

    let cardId = 0;
    let listId = 0;

    if (JSON.parse(localStorage.getItem('hDataAmanj'))) {
        cardId = JSON.parse(localStorage.getItem('hDataAmanj'))['countOfCards'] || 0;
        listId = JSON.parse(localStorage.getItem('hDataAmanj'))['countOfLists'] || 0;
    }

    function createListContainerNode(title, id = null) {
        if (id != null) {
            localStorage.setItem('hDataAmanj', JSON.stringify(app.data));
        }

        let toolTipTextElement = createElement('span', { class: 'tooltip-text' }, 'delete this list');
        let trashIconElement = createElement('i', { class: 'fa fa-trash' });
        let deleteListIconElement = createElement('span', { id: 'delete-list-icon' }, trashIconElement);
        let deleteListElement = createElement('div', { class: 'delete-list' }, [deleteListIconElement, toolTipTextElement]);

        let listBoxTitleElement = createElement('h4', { class: "list-box-title" }, title);

        let listBoxCardsElement = createElement('ul', { class: 'card-items' });

        let addCardBtnElement = createElement('button', { class: 'add-card-btn show' }, '+ Add another card');
        let addCardInputElement = createElement('input', { class: 'add-card-input hide', type: 'text', placeholder: 'Enter a title...' },);
        let addCardElement = createElement('div', { class: 'add-card' }, [addCardBtnElement, addCardInputElement]);

        let listBoxElement = createElement('div', { class: 'list-box', id: (id != null) ? id : `list-${listId++}` }, [listBoxTitleElement, listBoxCardsElement, addCardElement, deleteListElement]);

        let listContainerElement = createElement('div', { class: 'list-container' }, listBoxElement);

        // delete a list
        deleteListIconElement.addEventListener('click', function () {
            let deleteListContainer = this.parentNode.parentNode.parentNode;
            let deleteList = this.parentNode.parentNode;

            document.querySelector('.content').removeChild(deleteListContainer);

            // update app.data
            delete window.app.data[deleteList.id];
            localStorage.setItem('hDataAmanj', JSON.stringify(window.app.data));
        });

        // show card input element
        addCardBtnElement.addEventListener('click', function () {
            addCardBtnElement.classList.remove('show');
            addCardBtnElement.classList.add('hide');

            addCardInputElement.classList.remove('hide');
            addCardInputElement.classList.add('show');
            addCardInputElement.focus();

        });

        // create a new card
        addCardInputElement.addEventListener('keyup', function (e) {
            // ckeck if app.data is valid 
            window.app.data[listBoxElement.id] = window.app.data[listBoxElement.id] || {};
            if (typeof window.app.data[listBoxElement.id]['cards'] == 'undefined') {
                window.app.data[listBoxElement.id]['cards'] = {};
            }

            if (e.keyCode == 13) {
                let valElement = addCardInputElement.value;
                // check if user input is valid
                if (valElement.length >= 1 && valElement[0] != ' ') {
                    let cardElement = createCardNode(valElement);
                    listBoxCardsElement.appendChild(cardElement);
                    addCardInputElement.value = '';

                    // update app.data
                    window.app.data[listBoxElement.id]['cards'][cardElement.id] = valElement;
                    window.app.data['countOfCards'] = cardId;
                    localStorage.setItem('hDataAmanj', JSON.stringify(window.app.data));
                }
            }
        });

        // add focusout event to card input element
        addCardInputElement.addEventListener('focusout', function () {
            addCardBtnElement.classList.remove('hide');
            addCardBtnElement.classList.add('show');

            addCardInputElement.classList.remove('show');
            addCardInputElement.classList.add('hide');
        });

        /* ------- drop card in listBox element -------- */
        listBoxElement.ondragover = function (e) {
            e.preventDefault();
            if (this.id != dragParentId) {
                this.classList.add('overList');
            }
        }

        listBoxElement.ondragenter = function (e) {
            if (this.id != dragElement.parentNode.parentNode.id) {
                this.classList.add('overList');
            }
        }

        listBoxElement.ondragexit = function () {
            this.classList.remove('overList');
        }

        listBoxElement.ondragleave = function (e) {
            this.classList.remove('overList');
        }

        listBoxElement.ondrop = function (e) {
            if (dragParentId != this.id) {
                // add card element to end of drop list
                let ulElement = document.querySelector(`#${this.id} ul`);
                ulElement.appendChild(dragElement);

                // update app.data
                window.app.data[this.id]['cards'] = window.app.data[this.id]['cards'] || {};
                window.app.data[this.id]['cards'][dragElement.id] = dragElement.innerHTML;

                delete window.app.data[dragParentId]['cards'][dragElement.id];

                localStorage.setItem('hDataAmanj', JSON.stringify(window.app.data));
            }
        }

        return listContainerElement;
    }

    function createCardNode(text, id = null) {
        if (id != null) {

            localStorage.setItem('hDataAmanj', JSON.stringify(app.data));
        }
        let cardElement = createElement('li', { class: 'card', id: (id != null) ? id : `card-${cardId++}`, draggable: true }, text);

        let cardModal = document.getElementById('card-modal');

        // show modal if click on card element
        cardElement.addEventListener('click', function (e) {
            document.querySelector('.menu').style.width = 0;

            cardModal.style.display = 'block';
            document.getElementById('card-edit-input').focus();
            window.cardElementId = cardElement.id;
        });

        // close modal card
        cardModal.addEventListener('click', function (e) {
            if (e.target.className != "card-modal-content") {
                this.style.display = "none";
            }
        });

        // close modal
        let closeModalBtn = document.getElementById('modal-close');
        closeModalBtn.addEventListener('click', function () {
            cardModal.style.display = 'none'
        });

        // edit card
        let cardEditBtn = document.getElementById('card-edit-btn');
        cardEditBtn.addEventListener("click", function () {
            let cardEditInput = document.getElementById('card-edit-input');
            if (cardEditInput.value.length >= 1 && cardEditInput.value[0] != ' ') {
                let editCard = document.getElementById(window.cardElementId);
                editCard.innerText = cardEditInput.value;

                // update app.data
                let editCardParentId = editCard.parentNode.parentNode.id;
                window.app.data[editCardParentId]['cards'][editCard.id] = cardEditInput.value;
                localStorage.setItem('hDataAmanj', JSON.stringify(window.app.data));

                cardEditInput.value = '';
                cardModal.style.display = "none";
            }
        });

        // delete card
        let cardDeleteBtn = document.getElementById('card-delete-btn');
        cardDeleteBtn.addEventListener("click", function () {
            let editCard = document.getElementById(window.cardElementId);
            if (editCard != null) {
                let deleteCard = document.getElementById(window.cardElementId);

                // update app.data
                let deleteCardParentId = deleteCard.parentNode.parentNode.id;
                delete window.app.data[deleteCardParentId]['cards'][deleteCard.id];
                localStorage.setItem('hDataAmanj', JSON.stringify(window.app.data));

                deleteCard.remove();
            }
            cardModal.style.display = "none";
        });

        // drag and drop cards
        cardElement.ondragstart = function (e) {
            this.style.opacity = '0.5';
            window.dragElement = this;
            window.dragParentId = dragElement.parentNode.parentNode.id;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.innerHTML);
        }

        cardElement.ondragenter = function (e) {
            if (window.dragParentId === this.parentNode.parentNode.id) {
                this.classList.add('overCard');
            }
        }

        cardElement.ondragover = function (e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            if (window.dragParentId === this.parentNode.parentNode.id) {
                this.classList.add('overCard');
            }
        }

        cardElement.ondragleave = function (e) {
            e.stopPropagation();
            if (window.dragParentId === this.parentNode.parentNode.id) {
                this.classList.remove('overCard');
            }
        }

        cardElement.ondrop = function (e) {
            e.preventDefault();
            if (window.dragParentId === this.parentNode.parentNode.id && dragElement != this) {
                // update app.data
                window.app.data[dragParentId]['cards'][dragElement.id] = this.innerHTML;
                window.app.data[this.parentNode.parentNode.id]['cards'][this.id] = e.dataTransfer.getData('text/html');
                localStorage.setItem('hDataAmanj', JSON.stringify(app.data))

                dragElement.innerHTML = this.innerHTML;
                this.innerHTML = e.dataTransfer.getData('text/html');
            }
            cardElement.classList.remove('overCard');
        }

        cardElement.ondragend = function (e) {
            cardElement.classList.remove('overCard');

            let allOfListBoxes = document.getElementsByClassName("list-box");
            for (let list of allOfListBoxes) {
                list.classList.remove('overList');
            }
            this.style.opacity = '1';
        }

        return cardElement;
    }

    function createListActionNode() {
        let addListBtnElement = createElement('button', { class: 'add-list-btn show' }, '+ Add another list');

        let addListInputElement = createElement('input', { class: 'add-list-input hide', type: 'text', placeholder: 'Enter a list name' });

        let addListElement = createElement('div', { class: 'add-list' }, [addListBtnElement, addListInputElement]);

        let listActionElement = createElement('div', { class: 'list-action' }, addListElement);

        // show add list input element
        addListBtnElement.addEventListener('click', function () {
            addListBtnElement.classList.remove('show');
            addListBtnElement.classList.add('hide');

            addListInputElement.classList.remove('hide');
            addListInputElement.classList.add('show');
            addListInputElement.focus();
        });

        // add a new list
        addListInputElement.addEventListener('keyup', function (e) {
            if (e.keyCode == 13) {
                let valElement = addListInputElement.value;
                if (valElement.length >= 1 && valElement[0] != ' ') {
                    let listContainer = createListContainerNode(valElement);
                    listActionElement.before(listContainer);
                    // update app.data
                    window.app.data[listContainer.childNodes[0]['id']] = { title: valElement };
                    window.app.data['countOfLists'] = listId;
                    localStorage.setItem('hDataAmanj', JSON.stringify(window.app.data));

                    addListInputElement.value = '';
                }
            }
        });

        // show add list button element
        addListInputElement.addEventListener('focusout', function () {
            addListInputElement.classList.remove('show');
            addListInputElement.classList.add('hide');

            addListBtnElement.classList.remove('hide');
            addListBtnElement.classList.add('show');
        });

        return listActionElement;
    }

    function createMenuNode(colorsNameArr, imagesUrlArr) {

        let boxColorschildren = [];
        for (let color of colorsNameArr) {
            let colorElement = createElement('li', { class: 'color' });
            colorElement.style.backgroundColor = color;
            boxColorschildren.push(colorElement);
        }

        let boxColorsElement = createElement('ul', { class: 'box-colors' }, boxColorschildren);

        let boxImagesChildren = [];
        for (let image of imagesUrlArr) {
            let imageElement = createElement('li', { class: 'image' });
            imageElement.style.backgroundImage = `url('${image}')`;
            boxImagesChildren.push(imageElement);
        }

        let boxImagesElement = createElement('ul', { class: 'box-images' }, boxImagesChildren);

        let colorsTitleElement = createElement('h4', { class: 'colors-title' }, 'Colors');

        let imagesTitleElement = createElement('h4', { class: 'images-title' }, 'Images');

        let closeMenuElement = createElement('span', { class: 'menu-close' }, createElement('i', { class: 'fa fa-close' }));
        let menuTitleElement = createElement('h3', { class: 'menu-title' }, 'Change Background');
        let menuHeadElement = createElement('div', { class: 'menu-head' }, [menuTitleElement, closeMenuElement]);

        let menuElement = createElement('div', { class: 'menu' }, [menuHeadElement, colorsTitleElement, boxColorsElement, imagesTitleElement, boxImagesElement]);

        // show mwnu
        let menuBtn = document.querySelector('.menu-btn');
        menuBtn.addEventListener('click', function () {
            menuTitleElement.style.visibility = 'visible';
            closeMenuElement.style.visibility = 'visible';

            if (window.screen.width > 1024) {
                menuElement.style.width = '20%';
            }
            else if (window.screen.width > 769) {
                menuElement.style.width = '25%';
            } else if (window.screen.width > 426) {
                menuElement.style.width = '40%';
            } else {
                menuElement.style.width = '80%';
            }
        });

        // close menu
        closeMenuElement.addEventListener('click', function () {
            menuTitleElement.style.visibility = 'hidden';
            closeMenuElement.style.visibility = 'hidden';

            menuElement.style.width = '0';
        });

        // change background color
        boxColorsElement.addEventListener('click', function (e) {
            if (e.target.tagName == 'LI') {
                document.body.style.backgroundImage = 'initial';

                let color = e.target.style.backgroundColor;
                document.body.style.backgroundColor = color;

                // save basckground to localstorage
                localStorage.setItem('background', color);
            }
        });

        // change background image
        boxImagesElement.addEventListener('click', function (e) {
            if (e.target.tagName == 'LI') {
                document.body.style.backgroundColor = 'initial';

                let image = e.target.style.backgroundImage;
                document.body.style.backgroundImage = image;

                // save basckground image to localstorage
                localStorage.setItem('background', image);
            }
        });

        return menuElement;
    }

})();

