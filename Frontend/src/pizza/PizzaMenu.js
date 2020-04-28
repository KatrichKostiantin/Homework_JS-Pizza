var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List;
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

var namePlaceholder = $('#namePlaceholder');
var telPlaceholder = $('#telPlaceholder');
var addressPlaceholder = $('#addressPlaceholder');

$('#next').click(function () {
    var flag = true;
    if (namePlaceholder.val() === '') {
        $(namePlaceholder).parent().find('.alert').text("Ви нічого не ввели");
        $(namePlaceholder).addClass('alert_input');
        flag = false;
    } else if (namePlaceholder.val().toString().split(' ').length !== 2) {
        $(namePlaceholder).addClass('alert_input');
        $(namePlaceholder).parent().find('.alert').text("Ви не ввели фамілію чи ім'я");
        flag = false;
    } else {
        $(namePlaceholder).removeClass('alert_input');
        $(namePlaceholder).parent().find('.alert').text("");
    }

    String.prototype.isNumber = function () {
        return /^\d+$/.test(this);
    }
    /*---Telephone---*/
    if (telPlaceholder.val() === '') {
        $(telPlaceholder).parent().find('.alert').text("Ви нічого не ввели ");
        $(telPlaceholder).addClass('alert_input');
        flag = false;
    } else if (!telPlaceholder.val().toString().startsWith("380") &&
        !telPlaceholder.val().toString().startsWith("0")) {
        $(telPlaceholder).parent().find('.alert').text("Введіть номер телефону у форматі 380 або почніть з 0");
        $(telPlaceholder).addClass('alert_input');
        flag = false;
    } else if (!telPlaceholder.val().toString().isNumber()) {
        $(telPlaceholder).parent().find('.alert').text("Ви ввели не тількт цифри");
        $(telPlaceholder).addClass('alert_input');
        flag = false;
    } else {
        $(telPlaceholder).removeClass('alert_input');
        $(telPlaceholder).parent().find('.alert').text("");
    }

    /*---Address---*/
    if (addressPlaceholder.val() === '') {
        $(addressPlaceholder).parent().find('.alert').text("Ви нічого не ввели");
        $(addressPlaceholder).addClass('alert_input');
        flag = false;
    } else {
        $(addressPlaceholder).removeClass('alert_input');
        $(addressPlaceholder).parent().find('.alert').text("");
    }
    if (flag) {
        $("#clear").click();

        var order = {
            version: 3,
            public_key: "LIQPAY_PUBLIC_KEY",
            action: "pay",
            amount: 568.00,
            currency: "UAH",
            description: "Опис транзакції",
            order_id: Math.random(),
            sandbox: 1
        };
        var dataLiqPay = base64(JSON.stringify(order));

        var data = {
            name: namePlaceholder.val(),
            tel: telPlaceholder.val(),
            address: addressPlaceholder.val(),
            orderLiqPay: dataLiqPay
        };
        postRequest("/api/create-order/", data, function (req, res) {
            res.body;
            document.location.href = "/";
        })
    }
});

function base64(str) {
    return new Buffer(str).toString('base64');
}

var crypto = require('crypto');
function sha1(string) {
    var sha1 = crypto.createHash('sha1');
    sha1.update(string);
    return sha1.digest('base64');
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
    getRequest("/api/get-pizza-list/", function (req, res) {
        Pizza_List = res;
        showPizzaList(Pizza_List)
        console.log("Pizza_List is definition");
    });
}


function getRequest(url, callback) {
    $.ajax({
        url: url,
        type: 'GET',
        success: function (data) {
            callback(null, data);
        },
        fail: function () {
            callback(new Error("Ajax Failed"));
        }
    })
}

function postRequest(url, data, callback) {
    $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (data) {
            callback(null, data);
        },
        fail: function () {
            callback(new Error("Ajax Failed"));
        }
    })
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;