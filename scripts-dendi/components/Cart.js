/* ------------------------------------------------------------------------------
@name: Cart
@description: Cart
--------------------------------------------------------------------------------- */

// --- variables
import {
  API_URL
} from 'variables';

// --- utilities
import {
  Currency,
  Session
} from 'utilities';

const Cart = (() => {

  const _userData = JSON.parse(Session.get('userData'));

  // handleCart
  const handleCart = () => {
    if (_userData) {
      if (_userData.logged) {
        const _email = 'budidendi1234@gmail.com';
        $.ajax({
          url: API_URL.orderCart,
          type: 'POST',
          data: {
            'email': _email
          },
          dataType: 'JSON',
          success: function(data) {
            if (data.code === 200) {
              const _data = data.data;
              const _totalProduct = _data.product_list.length;

              let _cartItem = '';
              let _cartSummary = '';

              // insert cart item
              $.each(_data.product_list, (i, v) => {

                // set discount
                let _strDiscount = `<span class="cart__discount-price">${Currency.rp(v.price, 'Rp. ')}</span>`;
                if (v.discount !== 0) {
                  const _totalDiscount = v.discount * v.price / 100;
                  const _priceDiscount = v.price - _totalDiscount;
                  _strDiscount = `<div class="cart__price">
                                    <span class="cart__discount-percent">${v.discount}%</span>
                                    <s class="cart__regular-price">${Currency.rp(v.price, 'Rp. ')}</s>
                                    <span class="cart__discount-price">${Currency.rp(_priceDiscount, 'Rp. ')}</span>
                                  </div>`;
                }

                // set cart item
                _cartItem += `<div class="cart__item">
                                <div class="cart__tocol">
                                  <h5 class="cart__tocol__name">Indah Jaya Kaos</h5>
                                  <h4 class="cart__tocol__location">${v.location}</h4>
                                </div>
                                <div class="cart__top">
                                  <div class="cart__img">
                                    <img class="cart__img__el" src="${v.image}" alt="${v.name}" />
                                  </div>
                                  <div class="cart__txt">
                                    <h4 class="cart__name">${v.name}</h4>
                                    <div class="cart__price">
                                      ${_strDiscount}
                                    </div>
                                  </div>
                                </div>
                                <div class="cart__bottom">
                                  <p class="cart__note">${v.note}</p>
                                  <div class="cart__action">
                                    <button class="cart__delete btn" type="button">
                                      <i class="fi fi-trash"></i></button>
                                    <div class="cart__qty">
                                      <button class="fi-sub btn js-qty-sub" type="button">-</button>
                                      <input class="fi-qty js-total" type="number" value="${v.total}" min="1" max="3">
                                      <button class="fi-add btn js-qty-add" type="button">+</button>
                                    </div>
                                  </div>
                                </div>
                              </div>`;

              });
              $('.cart__list').append(_cartItem);

              // set cart summary
              _cartSummary += `<div class="cart__summary">
                                <h4 class="cart__summary__title">Ringkasan belanja</h4>
                                <ul class="cart__summary__list">
                                  <li class="cart__summary__item">
                                    <h6 class="cart__summary__name">Total Harga (${_totalProduct} barang)</h6>
                                    <h6 class="cart__summary__total">Rp375.000</h6>
                                  </li>
                                  <li class="cart__summary__item">
                                    <h6 class="cart__summary__name">Total Diskon Barang</h6>
                                    <h6 class="cart__summary__total">Rp45.000</h6>
                                  </li>
                                  <li class="cart__summary__item">
                                    <h6 class="cart__summary__name">Total Harga</h6>
                                    <h6 class="cart__summary__total">Rp330.000</h6>
                                  </li>
                                </ul>
                                <button class="btn btn--order" type="button">Beli (${_totalProduct})</button>
                              </div>`;
              $('.cart__right').append(_cartSummary);
            }
          }
        });
      }
    } else {
      location.href = "http://localhost:3000/login.html";
    }
  }

  // init
  const init = () => {
    if ($('.cart').length) {
      handleCart();
    }
  }

  return {
    init
  }

})();

export default Cart;
