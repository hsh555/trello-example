(function () {
    // search script
    let searchInputElement = document.querySelector('.top-header .search-box input');
    let searchIconElement = document.querySelector('.top-header .search-box span');
    
    // search search input click
    searchInputElement.addEventListener('click', function (e) {
        if (window.screen.width > 1365) {
            this.style.width = '330px';
        }
        this.style.backgroundColor = '#fff';
        this.style.color = '#1e3152';
        searchIconElement.style.color = '#1e3152';
        this.focus();
    });

    // focusout search input
    searchInputElement.addEventListener('focusout', function (e) {
        this.value = '';
        this.style.width = '';
        this.style.backgroundColor = '';
        searchIconElement.style.color = '';
    });

    // mobile-modal-search
    let mobileSearchBox = document.querySelector('.header .mobile-search-box');
    let mobileModalSearch = document.getElementById("mobile-modal-search");
    let mobileModalSearchClose = document.querySelector("#mobile-modal-search #modal-close");

    // show mobile-modal-search
    mobileSearchBox.addEventListener('click', function () {
        document.querySelector('.menu').style.width = '0';

        mobileModalSearch.style.display = "block";
    });

    // hide mobile-modal-search
    mobileModalSearchClose.addEventListener('click', function () {
        mobileModalSearch.style.display = "none";
    });

    // resize window
    window.onresize = function () {
        mobileModalSearch.style.display = 'none';
    }

})();