/* ------------------------------------------------------------------------------
@name: ProductsDetail
@description: ProductsDetail
--------------------------------------------------------------------------------- */

// --- utilities
import {
  Currency
} from 'utilities';

const ProductsDetail = (() => {

  // --- handleProductDetail
  const handleProductDetail = () => {
    const _alias = location.hash.split('#')[1];
    $.ajax({
      url: `https://x-api.alpha-x.id/v1/product-detail`,
      type: 'POST',
      data: {
        'alias': _alias
      },
      dataType: 'JSON',
      success: function(data) {
        if (data.code === 200) {
          const _data = data.data;
          let _productDetail = '';

          // set discount
          let _strDiscount = `<h2 class="products-detail__price">${Currency.rp(_data.price, 'Rp. ')}</h2>`;
          if (_data.discount !== 0) {
            const _totalDiscount = _data.discount * _data.price / 100;
            const _priceDiscount = _data.price - _totalDiscount;
            _strDiscount = `<h2 class="products-detail__price">${Currency.rp(_priceDiscount, 'Rp. ')}</h2>
                            <div class="products-detail__discount">
                              <span>${_data.discount}%</span>
                              <s>${Currency.rp(_data.price, 'Rp. ')}</s>
                            </div>`;
          }

          _productDetail += `
          <div class="products-detail__img">
            <img class="products-detail__img__el" src="${_data.image}" alt="${_data.name}" />
          </div>
          <div class="products-detail__txt">
            <!--products-detail-top-->
            <div class="products-detail__top" data-id="${_data.id}">
              <h1 class="products-detail__title">${_data.name}</h1>
              <ul class="products-detail__info">
                <li class="products-detail__info__item">
                  <i class="fi fi-star"></i>${_data.review}
                  <span>(${_data.review_total} ulasan)</span>
                </li>
              </ul>
              ${_strDiscount}
            </div>
            <!--products-detail-bottom-->
            <div class="products-detail__bottom">
              <div class="products-detail__desc">
                ${_data.detail}
              </div>
              <div class="products-detail__tocol">
                <h5 class="products-detail__tocol__name">${_data.shop_name}</h5>
                <h6 class="products-detail__tocol__location">${_data.location}</h6>
              </div>
            </div>
            <!--products-detail-form-->
            <div class="products-detail__form">
              <form class="fi-form js-form" action="#" method="get">
                <div class="fi-row">
                  <label class="fi-label" for="nama">Nama</label>
                  <input class="fi-single-line js-name" type="text" id="name" name="name" data-target="alertName" autocomplete="off" />
                  <p class="fi-alert" id="alertName" data-req="Name is required!"></p>
                </div>
                <div class="fi-row">
                  <label class="fi-label" for="phone">No. Handphone</label>
                  <input class="fi-single-line js-phone number-pnly" type="text" id="phone" name="phone" data-target="alertPhone" autocomplete="off" />
                  <p class="fi-alert" id="alertPhone" data-req="Phone Number is required!" data-invalid="Number Only" data-invalid-phone="Phone Number Invalid"></p>
                </div>
                <div class="fi-row">
                  <label class="fi-label" for="total">Jumlah</label>
                  <button class="sub btn" type="button">-</button>
                  <input class="fi-qty js-total" type="number" value="1" min="1" max="3" />
                  <button class="add btn" type="button">+</button>
                </div>
                <div class="fi-row">
                  <label class="fi-label" for="notes">Catatan</label>
                  <input class="fi-single-line js-note" type="text" id="notes" name="notes" data-target="alertNotes" autocomplete="off" />
                  <p class="fi-alert" id="alertNotes" data-req="Notes is required!"></p>
                </div>
                <button class="btn btn--submit js-add-to-cart" type="submit">Tambahkan Keranjang</button>
              </form>
            </div>
            <!--products-detail-cart-->
            <div class="products-detail__cart">
              <img src="assets/img/dummy/cart.png" alt="cart"/>
              <span>0</span>
            </div>
          </div>`;

          $('.products-detail__body').html(_productDetail);
        }
      }
    });
  }

  // --- handleQuantity
  const handleQuantity = () => {
    $('body').on('click', '.js-form .add', (e) => {
      $(e.currentTarget).prev().val(+$(e.currentTarget).prev().val() + 1);
    });
    $('body').on('click', '.js-form .sub', (e) => {
      if ($(e.currentTarget).next().val() > 1) {
        if ($(e.currentTarget).next().val() > 1) {
          $(e.currentTarget).next().val(+$(e.currentTarget).next().val() - 1);
        }
      }
    });
  }

  // - init
  const init = () => {
    handleProductDetail();
    handleQuantity();
  }

  return {
    init
  }

})();

export default ProductsDetail;
