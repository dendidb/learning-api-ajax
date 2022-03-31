/* ------------------------------------------------------------------------------
@name: Header
@description: Header
--------------------------------------------------------------------------------- */

// --- Header
const Header = (() => {

  const handleLogoutUser = () => {
    $('.js-logout-user').on('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('user')

      window.location.href = 'http://localhost:3000/login.html'
    });
  }

  const handleCheckSession = () => {

    const userLogged = JSON.parse(localStorage.getItem('user'));

    if (userLogged) {
      $('.js-cart').append(`<span class="header__cart__total">16</span>`);

      $('.header__right').append(`
      <div class="header__profile">
      <div class="header__user">
        <div class="header__user__avatar">
          <img class="header__user__avatar__el" src="assets/img/dummy/user.png" alt="Alexa Joessee" />
        </div>
        <h6 class="header__user__name">${userLogged.email}</h6>
      </div>
      <ul class="header__dropdown">
        <li class="header__dropdown__item">
          <a class="header__dropdown__link" href="#">
            <i class="fi fi-user"></i>
            <span>Profile</span>
          </a>
        </li>
        <li class="header__dropdown__item">
          <a class="header__dropdown__link js-logout-user" href="#">
            <i class="fi fi-logout"></i>
            <span>Logout</span>
          </a>
        </li>
      </ul>
    </div>
      `)
    } else {
    $('.header__right').append(`
    <a href="login.html" class="header__login btn btn--secondary">Masuk</a>
    `)
    }
  }


// --- init
const init = () => {
  handleCheckSession();
  handleLogoutUser();
}

// -- return
return {
  init
}

})();


export default Header;

