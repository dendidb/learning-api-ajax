/* ------------------------------------------------------------------------------
@name: AddToCart
@description: AddToCart
--------------------------------------------------------------------------------- */

// --- variables
import {
  API_URL,
  WEB_URL
} from 'variables';

// --- utilities
import {
  Scrolllable,
  Session
} from 'utilities';

const AddToCart = (() => {

  const _userData = JSON.parse(Session.get('userData'));

  // handleAddToCart
  const handleAddToCart = () => {
    $('body').on('click', '.js-add-to-cart', (e) => {
      if (_userData) {
        if (_userData.logged) {
          const _id = $('.products-detail__top').attr('data-id');
          const _email = _userData.email;
          const _total = Number($('.js-total').val());
          const _note = $('.js-note').val();

          $.ajax({
            url: API_URL.orderAdd,
            type: 'POST',
            data: {
              'productID': _id,
              'email': _email,
              'total': _total,
              'note': _note
            },
            dataType: 'JSON',
            success: (data) => {
              if (data.code === 200) {
                const _data = data.data;
                // set total cart
                $('.header .header__cart__total').text(_data.total);

                // insert data to popup cart success
                const _name = $('.products-detail__title').text();
                const _img = $('.products-detail__img__el').attr('src');
                $('.popup-cart__item__title').text(_name);
                $('.popup-cart__item__img__el').attr({
                  src: _img,
                  alt: _name
                });

                // show popup cart success
                $('body').addClass('show-popup-cart-success');
                Scrolllable.disable();
              }
            },
            error: (data) => {
              alert('Data Gagal di proses!');
            }
          });

        }
      } else {
        location.href = WEB_URL.login;
      }
      e.preventDefault();
    });
  }

  // handleClosePopup
  const handleClosePopup = () => {
    $('.overlay').on('click', () => {
      handleHidePopup();
    });

    $('.js-popup-cart-close').on('click', () => {
      handleHidePopup();
    });

    $(document).on('keyup', (e) => {
      if (e.which === 27) {
        handleHidePopup();
      }
    });
  }

  // handleHidePopup
  const handleHidePopup = () => {
    if ($('body').hasClass('show-popup-cart-success')) {
      $('body').removeClass('show-popup-cart-success');
      Scrolllable.enable();
    }
  }

  // init
  const init = () => {
    if ($('.products-detail').length) {
      handleAddToCart();
      handleClosePopup();
    }
  }

  return {
    init
  }

})();

export default AddToCart;
