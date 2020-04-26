var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");
var allType = $("#all_types");
var countFilter = $('#countFilter');

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    countFilter.text(list.length);
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function () {
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big, pizza.big_size.price);
        });
        $node.find(".buy-small").click(function () {
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small, pizza.small_size.price);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

allType.find('#all').addClass('activeFilter');
allType.find(".btn").click(function () {
    $(this).parent().find('.activeFilter').removeClass('activeFilter');
    $(this).addClass('activeFilter');
    filterPizza($(this).text());
});

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];

    if (filter === 'Усі') {
        showPizzaList(Pizza_List);
        return;
    }
    Pizza_List.forEach(function (pizza) {
        if (pizza.type.includes(filter)) pizza_shown.push(pizza);
    });

    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

function initialiseMenu() {
    //Показуємо усі піци

    showPizzaList(Pizza_List)
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;