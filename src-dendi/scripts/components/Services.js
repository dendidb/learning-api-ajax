/* ------------------------------------------------------------------------------
@name: Services
@description: Services
--------------------------------------------------------------------------------- */

// --- Services
const Services = (() => {

  // --- handleSet
  const handleSet = () => {
    handleCheckHeight();
  }

  // --- handleCheckHeight
  const handleCheckHeight = () => {
    let _height = 0;
    handleResetHeight();
    $('.js-services-list .services__item').each((i, e) => {
      if (_height < $(e).children('.services__box').height()) {
        _height = $(e).children('.services__box').height();
      }
    });
    $('.services__box').height(_height);
  }

  // --- handleResetHeight
  const handleResetHeight = () => {
    let _attr = $('.services__box').attr('style');
    // For some browsers, `attr` is undefined; for others,
    // `attr` is false.  Check for both.
    if (typeof _attr !== 'undefined' && _attr !== false) {
      $('.services__box').removeAttr('style');
    }
  }

  // --- init
  const init = () => {
    handleSet();
  }

  // --- return
  return {
    init,
    checkHeight: handleSet
  }

})();

export default Services;
