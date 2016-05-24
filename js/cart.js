/**
 * Copyright (c) 2015 Jon Cooper
 *
 * This file is part of js-cart.
 *
 * Documentation, related files, and licensing can be found at
 *
 *     <https://github.com/joncoop/js-cart>.
 *
 * Disclaimer/Known isssues:
 *
 * This code is intended for instructional purposes only. No claims of fitness for
 * actual online shopping is expressed or implied. (What I'm saying here is that this
 * code does a pretty good job at replicating the front-end experience of an online
 * shopping site. However, you'd be nuts to use this unless in conjuction with some
 * robust server-side authentication scripts.
 */


//********************************** CART CONFIGURATION ***********************************//

// products you sell by (id, name, price)
var products = new Array();
products[0] = new Product("001", "AMD FX-4350",  89.99);
products[1] = new Product("002", "AMD FX-8350",    159.99);
products[2] = new Product("003", "AMD FX-8370",  199.99);
products[3] = new Product("004", "Intel Core I7-4790k",  339.99);
products[4] = new Product("005", "Intel Core I7-6700k",  349.99);
products[5] = new Product("006", "Radeon R7 360",  89.99);
products[6] = new Product("007", "Radeon R7 370",  159.99);
products[7] = new Product("008", "GeForce GTX 960",  189.99);
products[8] = new Product("009", "Radeon R9 390",  309.99);
products[9] = new Product("010", "GeForce GTX TITAN X",  1199.99);
products[10] = new Product("011", "BenQ RL2455HM",  179.99);
products[11] = new Product("012", "ASUS VG248QE",  259.99);
products[12] = new Product("013", "BenQ XL2411Z",  269.99);
products[13] = new Product("014", "ASUS ROG PG279Q",  799.99);
products[14] = new Product("015", "Acer UM.JX1AA.001",  1099.99);
products[15] = new Product("016", "SteelSeries Rival 100",  38.99);
products[16] = new Product("017", "RAZER DeathAdder Chroma",  63.99);
products[17] = new Product("018", "Logitech G502",  73.99);
products[18] = new Product("019", "RAZER Mamba",  88.99);
products[19] = new Product("020", "Logitech G900 Chaos",  149.99);
products[20] = new Product("021", "AZIO MGK1",  84.99);
products[21] = new Product("022", "Razer BlackWidow X Ultimate",  99.99);
products[22] = new Product("023", "Corsair Gaming STRAFE",  139.99);
products[23] = new Product("024", "Logitech G910",  149.99);
products[24] = new Product("025", "Razer BlackWidow X Chroma",  159.99);

// tax rate for your state
var sales_tax_rate = 0.00;


// shipping
var free_shipping = false;
var shipping_rate = 3.99; // (will not be applied if free_shipping = true)


// site settings
var home_page_url = "index.html";
var cart_url = "cart.html";
var checkout_url = "checkout.html";
var cart_name = "my_cart"; // (must change if multiple carts run on same domain)


//************** END OF CONFIGURATION, DO NOT* MODIFY CODE BELOW THIS LINE!! **************//
//*                     ( * Unless you really know what you are doing. )                  *//


// public functions, for use on html pages

/**
 * Reads the cart string from local storage and sets product quantities. Then refreshes display.
 * Method should be called as body onload event for all pages that implement cart.
 *
 * Usage: <body onload="loadCart()">
 */
function loadCart()
{
    var cart_str = localStorage[cart_name];

    if (cart_str!=null && cart_str.length!=0)
    {
        var item_ids = cart_str.split("|");


        for (var i=0; i<item_ids.length; i++)
        {
            var index = search(item_ids[i]);

            if (index>-1)
            {
                var q = products[index].getQuantity() + 1;
                products[index].setQuantity(q);
            }
        }
    }

    refresh();
}

/**
 * Adds item to cart. Include button on product pages.
 *
 * Usage: <input type="button" onclick="addToCart("[item id]")" value="Add to cart" />
 *
 * @param {String} id of product to add
 */
 
 function addToCart(id)
{
    var index = search(id);

    if (index>-1)
    {
        var name = products[index].getName();
        var quantity = products[index].getQuantity();
        var addIt = false;

        if (quantity==0)
        {
            alert("The following item was added to your cart: " + name)
            addIt = true;
        }
        else
        {
            addIt = confirm("The item \"" + name + "\" is already in your cart. Would you like to add another?");
        }
    }
    else
    {
        alert("Error: Invalid product ID");
    }

    if (addIt)
    {
        products[index].setQuantity(quantity + 1);
        writeCart();
    }

    refresh();
}

/**
 * Deletes the cart string from local storage, effectively setting all item quanties to zero.
 * Call after order is successfully placed.
 *
 * Usage: <body onload="emptyCart()">
 */
function emptyCart()
{
    localStorage.removeItem(cart_name);
    refresh();
}


/**
 * Product object. Product has ID, name, and price set by constructor. Quantity is set
 * by setter method. Getter methods return id, name, price, quantity, and extended price.
 *
 * @param {String} id unique product ID
 * @param {String} name product name
 * @param {Number} price price of product
 */
function Product(id,name,price)
{
    // fields set from constructor
    this.id = String(id);
    this.name = String(name);
    this.price = Number(price);
    var quantity = 0;

    // setters
    this.setQuantity = function(n) { quantity = n };

    // getters
    this.getId = function() { return id; };
    this.getName = function() { return name; };
    this.getPrice = function() { return price; };
    this.getQuantity = function() { return quantity; };
    this.getExtendedPrice = function() { return quantity * price; };

    // for testing only
    this.toString = function()
    {
        return id + "|" + name + "|" + price + "|" + quantity + "|" + this.getExtendedPrice();
    }
}


// helper functions. don't reference these on html pages. for interal use only.

/**
 * Changes the onclick attribute for the Add-to-cart button to selected option.
 *
 * @param {String} option ID of selected product
 * @param {String} button_id ID of corresponding add-to-cart button
 */
function setChoice(option, button_id) {
  if (option.value.length == 0) {
    document.getElementById(button_id).disabled = true;
  }
  else {
    document.getElementById(button_id).disabled = false;
    document.getElementById(button_id).onclick = function() { addToCart(option.value); };
  }
}

/**
 * Searches the products array for a product ID and returns the index of that product.
 * Product IDs are not case-sensitive.
 *
 * @param {String} id ID of product to find
 * @returns {Number} index of product, -1 if product ID is not found
 */
function search(id)
{
    var search_id = id.toLowerCase();

    for (var i=0; i<products.length; i++)
    {
        var this_id = products[i].getId().toLowerCase();

        if (this_id==search_id)
        {
            return i;
        }
    }

    return -1;
}

/**
 * Returns a pipe-delimited list of IDs for all products contained in cart.
 * The ID is contained in string multiple times if quantity is greater than 1.
 *
 * @returns {String} HTML code for shopping cart
 */
function cartToString()
{
    var cart_str ="";

    for (var i=0; i<products.length; i++)
    {
        q = products[i].getQuantity();

        for (var j=0; j<q; j++)
        {
            cart_str += products[i].getId() + "|";
        }
    }

    cart_str = cart_str.substring(0,cart_str.length-1);

    return cart_str;
}

/**
 * Writes the cart string (a list of product ids) to local storage.
 */
function writeCart()
{
    var cart_str = cartToString();
    localStorage[cart_name] = cart_str;
    refresh();
}

/**
 * Gets the button that is clicked's name (product ID) and sets quantity to 0.
 */
function deleteItem(clickedButton) {
	var my_cart = document.getElementById('cart_form');
	var inputs = my_cart.getElementsByTagName('input');
	var id = $(clickedButton).attr("name");
	
	if (confirm('Are you sure you want to delete this item?')) {
		for (i=0; i<inputs.length; i++)
		{
			var quantity = Number(inputs[i].value);
			var index = search(id);
			if (index>-1 && !isNaN(quantity) && quantity>=0)
			{
				products[index].setQuantity(0);
			}
		}
		writeCart();
		refresh();
	} else {
		return;
	}
}

/**
 * Gets new quantities from cart form, writes new cart string.
 */
function updateCart()
{
    var my_cart = document.getElementById('cart_form');
    var inputs = my_cart.getElementsByTagName('input');

    for (i=0; i<inputs.length; i++)
    {
        var id = inputs[i].name;
        var quantity = Number(inputs[i].value);

        var index = search(id);

        if (index>-1 && !isNaN(quantity) && quantity>=0)
        {
            products[index].setQuantity(quantity);
        }
    }

    writeCart();
    refresh();
}

/**
 * Refreshes display of cart data.
 */
function refresh()
{
    var cart_area = document.getElementById("cart")
    var item_count_area = document.getElementById("item_count")
    var cart_link = document.getElementById("cart_link");
    var checkout_link = document.getElementById("checkout_link");
    var num_items = getNumItems();

    // draw cart if on cart page
    if (cart_area != null) cart_area.innerHTML = cartToTable();
    if (cart_area != null) cart_area.innerHTML = cartToTable();

    // update item count
    if (item_count_area != null) item_count_area.innerHTML = num_items;

    // update links
    if (cart_link != null) cart_link.href = cart_url;

    if (checkout_link != null)
    {
        if (num_items==0) checkout_link.href = cart_url;
        else              checkout_link.href = checkout_url;
    }
}

/**
 * Returns the sum of quantities for each item in the shopping cart.
 *
 * @returns total number of items in cart
 */
function getNumItems()
{
    var count = 0;

    for (i=0; i<products.length; i++)
    {
        count += products[i].getQuantity();
    }

    return count;
}

/**
 * Returns cart data as HTML table. If desired, edit style in cart.css.
 *
 * @returns {String} HTML code for shopping cart
 */
function cartToTable()
{
    var html_cart_str = "";
    var sub_total = 0;
    var tax = 0;
    var total = 0;
    var num_items = getNumItems();

    if (num_items>0)
    {
        html_cart_str = "<p>Please review your order. Press 'Update' to change quantities. " +
                        "To remove an item from your cart, change the quantity to zero or hit the delete button. " +
                        "Press 'Checkout' when you are ready to place your order.";

        html_cart_str += "<div class='cart'>"
        html_cart_str += "<form id='cart_form' action='" + checkout_url + "'>";
        html_cart_str += "<table>";
        html_cart_str += "<tr class='column-headings'>";
		html_cart_str += "<th>Delete</th>";
        html_cart_str += "<th>Item</th>";
        html_cart_str += "<th>Quantity</th>";
        html_cart_str += "<th>Unit Price</th>";
        html_cart_str += "<th>Ext. Price</th>";
        html_cart_str += "</tr>";

        for (i=0; i<products.length; i++)
        {
            var id = products[i].getId();
            var name = products[i].getName();
            var quantity = products[i].getQuantity();
            var price = products[i].getPrice();
            var extended_price = products[i].getExtendedPrice();

            sub_total += extended_price;
            tax = sub_total * sales_tax_rate;
            total = sub_total + tax;

            if (quantity>0)
            {
                html_cart_str += "<tr class='item'>";
				html_cart_str += "<td class='delete'><input id='delete' name='" + id + "' type='button' class='delete' value='X' onclick='{deleteItem(this);}' /></td>";
                html_cart_str += "<td class='item_name'>" + name + "<br><span class='item_id'>ID: " + id + "</span></td>";
                html_cart_str += "<td class='item_quantity'><input name='" + id + "' type='text' size='3' value='" + quantity + "' /></td>";
                html_cart_str += "<td class='item_price'>$" + price.toFixed(2) + "</td>";
                html_cart_str += "<td class='item_total'>$" + extended_price.toFixed(2) + "</td>";
                html_cart_str += "</tr>";
            }
        }

        html_cart_str += "<tr class='subtotal'>";
        html_cart_str += "<th class='subtotal'colspan='4'>Subtotal:</th>";
        html_cart_str += "<td class='subtotal'>$" + sub_total.toFixed(2) + "</th>";
        html_cart_str += "</tr>";

        html_cart_str += "<tr class='tax'>";
        html_cart_str += "<th class='tax'colspan='4'>Tax:</th>";
        html_cart_str += "<td class='tax'>$" + tax.toFixed(2) + "</th>";
        html_cart_str += "</tr>";

        if (!free_shipping)
        {
            html_cart_str += "<tr class='shipping'>";
            html_cart_str += "<th class='shipping' colspan='4'>Shipping:</th>";
            html_cart_str += "<td class='shipping'>$" + shipping_rate.toFixed(2) + "</td>";
            html_cart_str += "</tr>";

            total += shipping_rate;
        }

        html_cart_str += "<tr class='total'>";
        html_cart_str += "<th class='total'colspan='4'>Total:</th>";
        html_cart_str += "<td class='total'>$" + total.toFixed(2) + "</th>";
        html_cart_str += "</tr>";
        html_cart_str += "</table>"

        html_cart_str += "<div class='buttons'>";
        html_cart_str += "<input type='button' value='Update' onclick='updateCart()' />";
        html_cart_str += "<input type='submit' value='Checkout' />";
        html_cart_str += "</form>"
        html_cart_str += "</div>";
    }
    else
    {
        html_cart_str = "<p class='no_items'>Your cart is empty. <a style='text-decoration:underline;' href='" + home_page_url + "'>Go shopping!</a></p>";
    }

    return html_cart_str;
}

// for testing only. writes a plain-text list of all products
function listProducts()
{
    for (i=0; i<products.length; i++)
    {
        document.write(products[i].toString() + "<br />");
    }
}

//Handles the search engine of page - Not meant for professional use.
$("#search").keyup(function(event){
    if(event.keyCode == 13){
        $("#searchbutton").click();
    }
});

function sendToPage()
{
	var input = document.getElementById("search").value.toLowerCase();
	if (['graphics', 'gfx', 'gtx', 'graphic', 'gtx 960', 'r7 370', 'r7 360', 'r9 390', 'titan x'].indexOf(input) >= 0){
		location.href = "graphics.html";
		return false;
	}
	else if (['cpu', 'cpus', 'fx-4350', 'fx-8350', 'fx-8370', 'i7-4790k', 'i7-6700k'].indexOf(input) >= 0){
		location.href = "cpus.html";
		return false;
	}
	else if (['mouse', 'mice', 'rival 100', 'deathadder', 'logitech g502', 'mamba', 'logitech g900'].indexOf(input) >= 0){
		location.href = "mice.html";
		return false;
	}
	else if (['keyboard', 'keyboards', 'azio mgk1', 'blackwidow x ultimate', 'strafe', 'logitech g910', 'blackwidow x chroma'].indexOf(input) >= 0){
		location.href = "keyboards.html";
		return false;
	}
	else if (['monitor', 'monitors', 'benq', 'asus', 'acer'].indexOf(input) >= 0){
		location.href = "monitors.html";
		return false;
	}
	else {
		alert("Item not found.")
	}
}


