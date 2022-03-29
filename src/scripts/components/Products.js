/* ------------------------------------------------------------------------------
@name: Products
@description: Products
--------------------------------------------------------------------------------- */

// --- utilities
import {
  Currency
} from 'utilities';

// --- Products
const Products = (() => {

  // --- handleProduct
  const handleProduct = () => {

    $.ajax({
      url: 'https://x-api.alpha-x.id/v1/product',
      type: 'GET',
      dataType: 'JSON',
      success: function(data) {
        if (data.code === 200) {
          let _listProduct = '';
          $.each(data.data, (i, v) => {
            // set discount
            let _strDiscount = `<h5 class="products__price">${Currency.rp(v.price, 'Rp. ')}</h5>`;
            if (v.discount !== 0) {
              const _totalDiscount = v.discount * v.price / 100;
              const _priceDiscount = v.price - _totalDiscount;
              _strDiscount = `<div class="products__discount">
                                <span>${v.discount}%</span>
                                <s>${Currency.rp(v.price, 'Rp. ')}</s>
                              </div>
                              <h5 class="products__price">${Currency.rp(_priceDiscount, 'Rp. ')}</h5>`;
            }

            // set rate
            let _star = `<i class="fi fi-star"></i>`;
            for (let i=1; i < Math.round(v.review); i++) {
              _star += `<i class="fi fi-star"></i>`;
            }

            _listProduct += `<div class="products__item">
              <div class="products__box">
                <a class="products__link" href="products-detail.html#${v.alias}">${v.name}</a>
                <div class="products__img">
                  <img class="products__img__el" src="${v.image}" alt="${v.name}" />
                </div>
                <div class="products__txt">
                  <h6 class="products__title">${v.name}</h6>
                  ${_strDiscount}
                  <div class="products__bottom">
                    <h6 class="products__city">${v.location}</h6>
                    <div class="products__rate">
                      <div class="products__star">
                        ${_star}
                      </div>
                      <p class="products__count">(${v.total_review})</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>`;
          });
          $('.products__list').html(_listProduct);
        }
      }
    });
  }

  // --- init
  const init = () => {
    // handleSet();
    handleProduct();

  }

  // --- return
  return {
    init

  }

})();

export default Products;
