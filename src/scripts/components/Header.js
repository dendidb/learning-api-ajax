/* ------------------------------------------------------------------------------
@name: Header
@description: Header
--------------------------------------------------------------------------------- */

import {
  Session
} from "../utilities";

// --- Header
const Header = (() => {
  const _userData = JSON.parse(Session.get('userData'));

  // --- handleCheckSession
  const handleCheckSession = () => {
    Session.timeout(() => {
      Session.remove('userData');
      location.reload();
    }, 10);
  }

  // --- handleLoginHeader
  const handleLoginHeader = () => {
    if (_userData) {
      if (_userData.logged) {
        // header-cart
        const _userCart = `<span class="header__cart__total">16</span>`;

        $('.header__cart').append(_userCart);

        // header-profile
        $('.header__right .header__login').remove();

        const _userProfile = `<div class="header__profile">
                                <div class="header__user">
                                  <div class="header__user__avatar">
                                    <img class="header__user__avatar__el" src="${_userData.profilePicture}" alt="${_userData.fullName}" />
                                  </div>
                                  <h6 class="header__user__name">${_userData.fullName}</h6>
                                </div>
                                <ul class="header__dropdown">
                                  <li class="header__dropdown__item">
                                    <a class="header__dropdown__link" href="profile.html">
                                      <i class="fi fi-user"></i>
                                      <span>Profile</span></a>
                                  </li>
                                  <li class="header__dropdown__item">
                                    <a class="header__dropdown__link js-logout" href="login.html">
                                      <i class="fi fi-logout"></i>
                                      <span>Logout</span></a>
                                  </li>
                                </ul>
                              </div>`;

        $('.header__right').append(_userProfile);
      }
    }
  }

  // --- handleLogout
  const handleLogout = () => {
    $('body').on('click', '.js-logout', (e) => {
      Session.remove('userData');
      location.href = 'http://localhost:3000/index.html';
      e.preventDefault();
    });
  }

  // --- init
  const init = () => {
    handleLoginHeader();
    // handleCheckSession();
    handleLogout();
  }

  // --- return
  return {
    init

  }

})();

export default Header;
