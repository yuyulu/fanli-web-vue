(function(window){
    var cart = {};

    cart.getList = function() {
        var list = localStorage.getItem('cartlist');
        
        if (!list) {
            return [];
        }
        return JSON.parse(list);
    }

    cart.add = function(product) {
        var list = cart.getList();

        // var shop_find = -1;
        // for (var i = 0, len = list.length; i < len; i ++) {
        //     if (product.shop_id == list[i].shop_id) {
        //         shop_find = i;
        //         break;
        //     }
        // }
        // if (shop_find === -1) {
        //     list.push({
        //         shop_id: product.shop_id,
        //         shop_name: product.shop_name,
        //         list: [
        //             {
        //                 shop_id: product.shop_id,
        //                 shop_name: product.shop_name,
        //                 id: product.id,
        //                 pic: product.pic,
        //                 name: product.name,
        //                 price: product.price,
        //                 num: 1
        //             }
        //         ]
        //     });
        // } else {
        //     var product_find = -1;
        //     for (var i = 0, len = list[shop_find].list.length; i < len; i ++) {
        //         if (product.id == list[shop_find].list[i].id) {
        //             product_find = i;
        //             break;
        //         }
        //     }
        //     if (product_find === -1) {
        //         list[shop_find].list.push({
        //             shop_id: product.shop_id,
        //             shop_name: product.shop_name,
        //             id: product.id,
        //             pic: product.pic,
        //             name: product.name,
        //             price: product.price,
        //             num: 1
        //         })
        //     } else {
        //         var old_num = list[shop_find].list[product_find].num;
        //         list[shop_find].list[product_find].num =  parseInt(old_num) + 1;
        //     }
        // }

        list.push({
            shop_id: product.shop_id,
            shop_name: product.shop_name,
            id: product.id,
            pic: product.pic,
            name: product.name,
            price: product.price,
            num: 1
        })
        localStorage.setItem('cartlist', JSON.stringify(list))
    }

    cart.setEmpty = function() {
        localStorage.setItem('cartlist', "")
    }

    window.cart = cart;
})(window);