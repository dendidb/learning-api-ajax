/* ------------------------------------------------------------------------------
@name: Cart
@description: Cart
--------------------------------------------------------------------------------- */

// --- utilities
import {
  Currency
} from 'utilities';

const Cart = (() => {

  // handleCart
  const handleCart = () => {
    $('.js-check-cart').on('click', (e) => {
      const _phone = $('.js-phone').val();

      $.ajax({
        url: `https://x-api.alpha-x.id/v1/order-cart`,
        type: 'POST',
        data: {
          'phone': _phone
        },
        dataType: 'JSON',
        success: function(data) {
          if (data.code === 200) {
            const _data = data.data;
            const _name = _data.name;
            let _cartItem = '';

            // insert cart item
            $.each(_data.product_list, (i, v) => {

              // set discount
              let _strDiscount = `<h5 class="cart__price">${Currency.rp(v.price, 'Rp. ')}</h5`;
              if (v.discount !== 0) {
                const _totalDiscount = v.discount * v.price / 100;
                const _priceDiscount = v.price - _totalDiscount;
                _strDiscount = `<div class="cart__price">
                                  <span class="cart__price__discount-percent">${v.discount}%</span>
                                  <s class="cart__price__regular">${Currency.rp(v.price, 'Rp. ')}</s>
                                  <span class="cart__price__discount">${Currency.rp(_priceDiscount, 'Rp. ')}</span>
                                </div>`;
              }

              _cartItem += `<div class="cart__item">
                              <div class="cart__top">
                                <div class="cart__img">
                                  <img class="cart__img__el" src="${v.image}" alt="${v.name}" />
                                </div>
                                <div class="cart__txt">
                                  <h3 class="cart__title">${v.name}</h3>
                                  ${_strDiscount}
                                  <h6 class="cart__total">Total ${v.total}</h6>
                                </div>
                              </div>
                              <div class="cart__bottom">
                                <p class="cart__desc">${v.note}</p>
                              </div>
                            </div>`;

            });
            $('.cart__list').append(_cartItem);

            // insert name
            $('.cart__name').text(_name);
          }
        }
      });

      e.preventDefault();
    });
  }

  // init
  const init = () => {
    handleCart();
  }

  return {
    init
  }

})();

export default Cart;
