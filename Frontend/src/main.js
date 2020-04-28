$(function () {
    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    PizzaCart.initialiseCart();
    PizzaMenu.initialiseMenu();
    initialize();
    //Коли сторінка завантажилась
    google.maps.event.addDomListener(window, 'load', initialize);
});

function initialize() {
//Тут починаємо працювати з картою
    var mapProp = {
        center: new google.maps.LatLng(50.464379, 30.519131),
        zoom: 11
    };
    var html_element = document.getElementById("googleMap");
    var map = new google.maps.Map(html_element, mapProp);
//Карта створена і показана
}


