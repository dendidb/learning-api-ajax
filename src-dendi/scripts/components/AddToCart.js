/* ------------------------------------------------------------------------------
@name: AddToCart
@description: AddToCart
--------------------------------------------------------------------------------- */

const AddToCart = (() => {

  // handleAddToCart
  const handleAddToCart = () => {
    // console.log('handleAddToCart');
    $('.js-add-to-cart').on('click', (e) => {
      e.preventDefault();
      const _id = $('.products-detail__top').attr('data-id');
      // const _name = $('.js-name').val();
      // const _phone = $('.js-phone').val();
      const _total = $('.js-total').val();
      const _note = $('.js-note').val();
      console.log('_id');

      $.ajax({
        url: `https://x-api.alpha-x.id/v1/order-product`,
        type: 'POST',
        data: {
          'productID': _id,
          // 'name': _name,
          // 'phone': _phone,
          'total': _total,
          'note': _note
        },
        dataType: 'JSON',
        success: function(data) {
          console.log(data);
          if (data.code === 200) {
            const _data = data.data;
            $('body .products-detail__cart span').text(_data.total);
          }
        }
      });
      e.preventDefault();
    });
  }

  // init
  const init = () => {
    handleAddToCart();
  }

  return {
    init
  }

})();

export default AddToCart;
