/**
 * @returns {HTMLElement}
 * @param {String} tagName 
 * @param {Object} objAttrs 
 * @param {String | Array | HTMLElement} arrContent 
 */

function createElement(tagName, objAttrs = null, arrContent = null) {
    let element = document.createElement(tagName);
    for (let attr in objAttrs) {
        element.setAttribute(attr, objAttrs[attr]);
    }

    if (arrContent instanceof Array) {
        for (el of arrContent) {
            element.appendChild(el);
        }
    } else if (arrContent instanceof HTMLElement) {
        element.appendChild(arrContent);
    }
    else {
        element.innerHTML = arrContent;
    }

    return element;
}
