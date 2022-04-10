/* ------------------------------------------------------------------------------
@name: AddToCart
@description: AddToCart
--------------------------------------------------------------------------------- */

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
          const _name = 'Angga Deongs';
          const _phone = '085222433981';
          // const _name = $('.js-name').val();
          // const _phone = $('.js-phone').val();
          const _total = $('.js-total').val();
          const _note = $('.js-note').val();

          $.ajax({
            url: `https://x-api.alpha-x.id/v1/order-product`,
            type: 'POST',
            data: {
              'productID': _id,
              'name': _name,
              'phone': _phone,
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
        location.href = "http://localhost:3000/login.html";
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
