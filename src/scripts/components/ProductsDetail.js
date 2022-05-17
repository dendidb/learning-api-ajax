/* ------------------------------------------------------------------------------
@name: ProductsDetail
@description: ProductsDetail
--------------------------------------------------------------------------------- */

import {
  API_URL
} from 'variables';

// --- utilities
import {
  Currency
} from 'utilities';

const ProductsDetail = (() => {

  // --- handleProductDetail
  const handleProductDetail = () => {
    const _alias = location.hash.split('#')[1];
    $.ajax({
      url: API_URL.productDetail(_alias),
      type: 'GET',
      data: {
        'alias': _alias
      },
      dataType: 'JSON',
      success: (data) => {
        if (data.code === 200) {
          const _data = data.data;
          // console.log(_data);
          let _productDetail = '';

          // set discount
          let _strDiscount = `<h2 class="products-detail__price">${Currency.rp(_data.price, 'Rp. ')}</h2>`;
          if (_data.discount !== 0) {
            const _totalDiscount = _data.discount * _data.price / 100;
            const _priceDiscount = _data.price - _totalDiscount;
            _strDiscount = `<div class="products-detail__discount">
                              <span>${_data.discount}%</span>
                              <s>${Currency.rp(_data.price, 'Rp. ')}</s>
                            </div>
                            <h2 class="products-detail__price">${Currency.rp(_priceDiscount, 'Rp. ')}</h2>`;
          }

          // set rate
          let _star = `<i class="fi fi-star"></i>`;
          for (let i = 1; i < Math.round(_data.review); i++) {
            _star += `<i class="fi fi-star"></i>`;
          }
          if (Math.round(_data.review) < 5) {
            for (let i = Math.round(_data.review); i < 5; i++) {
              _star += `<i class="fi fi-star-o"></i>`;
            }
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
                  ${_star}
                </li>
                <li class="products-detail__info__item">
                  <span>(${_data.review_total})</span>
                </li>
              </ul>
              ${_strDiscount}
            </div>
            <!--products-detail-bottom-->
            <div class="products-detail__bottom">
              <div class="products-detail__desc">
                <h6>Detail</h6>
                ${_data.detail}
              </div>
              <div class="products-detail__tocol">
                <div class="products-detail__tocol__img">
                  <img class="products-detail__tocol__img__el" src="assets/img/dummy/tocol.png" alt="${_data.shop_name}" />
                </div>
                <div class="products-detail__tocol__txt">
                  <h5 class="products-detail__tocol__name">${_data.shop_name}</h5>
                  <h6 class="products-detail__tocol__location">${_data.location}</h6>
                </div>
              </div>
            </div>
            <!--products-detail-form-->
            <div class="products-detail__form">
              <h6 class="products-detail__form__title">Pesan Produk</h6>
              <form class="fi-form" action="#" method="get">
                <div class="fi-row">
                  <label class="fi-label" for="total">Jumlah</label>
                  <button class="fi-sub btn js-qty-sub" type="button">-</button>
                  <input class="fi-qty js-total" type="number" value="1" min="1" max="3" />
                  <button class="fi-add btn js-qty-add" type="button">+</button>
                </div>
                <div class="fi-row">
                  <label class="fi-label" for="notes">Catatan</label>
                  <textarea class="fi-multiline js-note" id="notes" name="notes" data-target="alertNotes" autocomplete="off"></textarea>
                  <p class="fi-alert" id="alertNotes" data-req="Notes is required!"></p>
                </div>
                <button class="fi-action btn btn--secondary js-add-to-cart" type="submit">+ Keranjang</button>
              </form>
            </div>
          </div>`;

          $('.products-detail__body').html(_productDetail);
        }
      },
      error: (data) => {
        alert('Data Gagal diproses!');
      }
    });
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

  // - init
  const init = () => {
    if ($('.products-detail').length) {
      handleProductDetail();
      handleQuantity();
    }
  }

  return {
    init
  }

})();

export default ProductsDetail;
