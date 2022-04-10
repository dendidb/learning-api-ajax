/* ------------------------------------------------------------------------------
@name: Footer
@description: Footer
--------------------------------------------------------------------------------- */

// --- Footer
const Footer = (() => {

  // --- handleSet
  const handleSet = () => {
    if ($(window).width() >= 992) {
      const _footerHeight = $('.footer').outerHeight();
      $('.main-site').css('padding-bottom',_footerHeight);
    } else {
      $('.main-site').removeAttr('style');
    }

  }

  // --- init
  const init = () => {
    handleSet();

  }

  // --- return
  return {
    init,
    setFooter: handleSet
  }

})();

export default Footer;
