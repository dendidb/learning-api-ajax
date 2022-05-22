/* ------------------------------------------------------------------------------
@name: Cart
@description: Cart
--------------------------------------------------------------------------------- */

// --- variables
import {
  API_URL,
  WEB_URL
} from 'variables';

// --- utilities
import {
  Currency,
  Session
} from 'utilities';

const Cart = (() => {

  const _userData = JSON.parse(Session.get('userData'));

  // --- handleCart
  const handleCart = () => {
    if (_userData) {
      if (_userData.logged) {
        const _email = _userData.email;
        $.ajax({
          url: API_URL.orderCart,
          type: 'POST',
          data: {
            'email': _email
          },
          dataType: 'JSON',
          success: (data) => {
            if (data.code === 200) {
              const _data = data.data;
              const _totalProduct = _data.total;

              let _cartBox = '';
              let _cartItem = '';
              let _cartSummary = '';
              let _totalPriceSummary = 0;
              let _totalDiscountSummary = 0;

              // cart not empty
              let _cart = `<div class="cart__left">
                            <h1 class="cart__title">Keranjang</h1>
                            <div class="cart__check-all">
                              <div class="checkbox js-checkbox">
                                <i class="fi fi-tick"></i>
                                <input type="checkbox" />
                              </div>
                              <h6 class="cart__check-all__title">Pilih Semua</h6>
                              <button class="cart__check-all__delete btn" type="button">Hapus</button>
                            </div>
                            <div class="cart__list"></div>
                          </div>
                          <div class="cart__right"></div>`;

              // cart empty
              if (_data.total === 0) {
                _cart = `<div class="cart__empty">
                          <div class="cart__empty__img">
                            <img class="cart__empty__img__el" src="assets/img/bg/empty-cart.svg" alt="Empty Cart />
                          </div>
                          <div class="cart__empty__txt">
                            <h1 class="cart__empty__title">Wah, Keranjang belanjamu kosong</h1>
                            <p class="cart__empty__desc">Yuk, isi dengan barang-barang impianmu!</p>
                          </div>
                          <div class="cart__empty__btn">
                            <a class="btn btn--order" href="http://localhost:3000/index.html">Mulai Belanja</a>
                            </div>
                          </div>
                        </div>`;
              }
              $('.cart .container').html(_cart);

              // insert cart item
              $.each(_data.list, (i, v) => {

                // set discount
                let _strDiscount = `<span class="cart__discount-price">${Currency.rp(v.price)}</span>`;
                if (v.discount !== 0) {
                  const _totalDiscount = v.discount * v.price / 100;
                  const _priceDiscount = v.price - _totalDiscount;
                  _totalDiscountSummary += (_totalDiscount * v.total);
                  _strDiscount = `<div class="cart__price">
                                    <span class="cart__discount-percent">${v.discount}%</span>
                                    <s class="cart__regular-price">${Currency.rp(v.price)}</s>
                                    <span class="cart__discount-price">${Currency.rp(_priceDiscount)}</span>
                                  </div>`;
                }

                _totalPriceSummary += (v.price * v.total);

                // set note
                let _note = `<div class="cart__note">
                              <p class="cart__note__txt">${v.note}</p>
                              <button class="js-cart-note-edit">Ubah</button>
                              <div class="cart__note__input">
                                <label>Tulis Catatan untuk Barang ini</label>
                                <input type="text" name="note" maxlength="160" />
                                <span>0/160</span>
                              </div>
                            </div>`;
                if (v.note === '') {
                  _note = `<div class="cart__note">
                            <button class="js-cart-note-add">Tulis Catatan</button>
                            <div class="cart__note__input">
                              <label>Tulis Catatan untuk Barang ini</label>
                              <input type="text" name="note" maxlength="160" />
                              <span>0/160</span>
                            </div>
                          </div>`;
                }

                _cartBox += `<div class="cart__box" data-id="${v.id}">
                              <div class="cart__top">
                                <div class="checkbox js-checkbox">
                                  <i class="fi fi-tick"></i>
                                  <input type="checkbox" />
                                </div>
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
                                ${_note}
                                <div class="cart__action">
                                  <button class="cart__delete btn js-delete-order" type="button">
                                    <i class="fi fi-trash"></i></button>
                                  <div class="cart__qty">
                                    <button class="fi-sub btn js-qty-sub" type="button">-</button>
                                    <input class="fi-qty js-total" type="number" value="${v.total}" min="1" max="3">
                                    <button class="fi-add btn js-qty-add" type="button">+</button>
                                  </div>
                                </div>
                              </div>
                            </div>`;
                // set cart item
                _cartItem = `<div class="cart__item">
                              <div class="cart__tocol">
                                <div class="checkbox js-checkbox">
                                  <i class="fi fi-tick"></i>
                                  <input type="checkbox" />
                                </div>
                                <div class="cart__tocol__txt">
                                  <h5 class="cart__tocol__name">Indah Jaya Kaos</h5>
                                  <h4 class="cart__tocol__location">Bandung</h4>
                                </div>
                              </div>
                              ${_cartBox}
                            </div>`;
              });

              $('.cart__list').append(_cartItem);

              let _elementDiscountSummary = '';
              let _grandTotalPriceSummary = _totalPriceSummary;
              if (_totalDiscountSummary !== 0) {
                _elementDiscountSummary = `<li class="cart-summary__item">
                                            <h6 class="cart-summary__name">Total Diskon Barang</h6>
                                            <h6 class="cart-summary__total">${Currency.rp(_totalDiscountSummary)}</h6>
                                          </li>`;
                _grandTotalPriceSummary -= _totalDiscountSummary;
              }

              // set cart summary
              _cartSummary += `<div class="cart-summary">
                                <h4 class="cart-summary__title">Ringkasan belanja</h4>
                                <ul class="cart-summary__list">
                                  <li class="cart-summary__item">
                                    <h6 class="cart-summary__name">Total Harga (${_totalProduct} barang)</h6>
                                    <h6 class="cart-summary__total">${Currency.rp(_totalPriceSummary)}</h6>
                                  </li>
                                  ${_elementDiscountSummary}
                                  <li class="cart-summary__item">
                                    <h6 class="cart-summary__name">Total Harga</h6>
                                    <h6 class="cart-summary__total">${Currency.rp(_grandTotalPriceSummary)}</h6>
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
      location.href = WEB_URL.login;
    }
  }

  // --- handleQuantity
  const handleQuantity = () => {
    $('body').on('click', '.js-qty-add', (e) => {
      const _this = $(e.currentTarget);
      _this.prev().val(+_this.prev().val() + 1);
    });
    $('body').on('click', '.js-qty-sub', (e) => {
      const _this = $(e.currentTarget);
      if (_this.next().val() > 1) {
        if (_this.next().val() > 1) {
          _this.next().val(+_this.next().val() - 1);
        }
      }
    });
  }

  // --- handleAddNote
  const handleAddNote = () => {
    $('body').on('click', '.js-cart-note-add', (e) => {
      const _this = $(e.currentTarget);
      const _parents = _this.parents('.cart__note');
      $('.cart__note').removeClass('cart__note--add');
      _parents.addClass('cart__note--add');
      setTimeout(() => {
        _parents.find('input').focus();
      }, 250);
    });

    $('body').on('keyup', '.cart__note input', (e) => {
      const _this = $(e.currentTarget);
      if (e.key === 'Enter' || e.keyCode === 13) {
        _this.blur();
      }

      // set length character and limit
      const _length = _this.val().length;
      const _limit = _this.attr('maxlength');
      $('.cart__note span').text(_length+'/'+_limit);
    });

    $('body').on('blur', '.cart__note input', (e) => {
      const _this = $(e.currentTarget);
      const _value = _this.val();
      _this.parents('.cart__note').removeClass('cart__note--add');
      if (_value === '') {
        _this.parents('.cart__note').find('.js-cart-note-edit').text('Tulis Catatan').addClass('js-cart-note-add').removeClass('js-cart-note-edit');
      } else {
        _this.parents('.cart__note').prepend(`<p class="cart__note__txt">${_value}</p>`).find('.js-cart-note-add').text('Ubah').addClass('js-cart-note-edit').removeClass('js-cart-note-add');
      }
    });

  }

  // --- handleEditNote
  const handleEditNote = () => {
    $('body').on('click', '.js-cart-note-edit', (e) => {
      const _this = $(e.currentTarget);
      const _parents = _this.parents('.cart__note');
      const _text = _parents.find('p').text();
      _parents.find('input').val(_text);
      _parents.addClass('cart__note--add');
      _parents.find('.cart__note__txt').remove();
      setTimeout(() => {
        _parents.find('input').focus();
      }, 250);

      // set length character and limit
      const _length = _parents.find('input').val().length;
      const _limit = _parents.find('input').attr('maxlength');
      $('.cart__note span').text(_length+'/'+_limit);
    });
  }

  // --- handleCheckbox
  const handleCheckbox = () => {
    $('body').on('click', '.js-checkbox', (e) => {
      const _this = $(e.currentTarget);
      if (_this.hasClass('checked')) {
        _this.removeClass('checked').find('input').prop('checked', false);
      } else {
        _this.addClass('checked').find('input').prop('checked', true);
      }
    });
  }

  // --- handleClickDelete
  const handleClickDelete = () => {
    $('body').on('click', '.js-delete-order', (e) => {
      const _email = _userData.email;
      const _this = $(e.currentTarget);
      const _productID = [_this.parents('.cart__box').attr('data-id')];

      if (confirm('Apakah Anda yakin ingin menghapus produk ini di keranjang?')) {
        $.ajax({
          url: API_URL.orderDelete,
          type: 'POST',
          data: {
            email: _email,
            productID: _productID
          },
          dataType: 'JSON',
          success: (data) => {
            if (data.code === 200) {
              location.reload();
            }
          },
          error: (response) => {
            alert('Data Gagal diproses!');
          }
        });
      }

      // --- handleClickMultipleDelete
      let populatedID = [];
      $('.js-cart-list input:checked').each((e) => {
        const grid = $(e).parents('.cart__box').attr('data-id');
        populatedID.push(getID);
      });

    });

  }

  // init
  const init = () => {
    if ($('.cart').length) {
      handleCart();
      handleQuantity();
      handleAddNote();
      handleEditNote();
      handleCheckbox();
      handleClickDelete();
    }
  }

  return {
    init
  }

})();

export default Cart;
