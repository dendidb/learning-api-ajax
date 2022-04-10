/* ------------------------------------------------------------------------------
@name: Login
@description: Login
--------------------------------------------------------------------------------- */


// --- utilities
import {
  Validation,
  Session
} from 'utilities';

// Form Validation
const ElementSelector = [
  {
    id: 'email',
    validation: {
      required: true,
      email: true
    }
  },
  {
    id: 'password',
    validation: {
      required: true,
    }
  }
];

const ElementEvents = ['input', 'blur'];

const Login = (() => {

  // --- Handle Run Validation
  const handleRunValidation = () => {
    Validation.config(ElementEvents, ElementSelector);
  }

  // --- Handle Click Validation
  const handleClickValidation = () => {
    $('.js-auth-login button[type="submit"]').on('click', (e) => {
      $.each(ElementSelector, (i, v) => {
        $('#'+v.id).blur();
      });

      if ($('.error').length === 0) {
        handleCheckData();
      }
      e.preventDefault();
    });
  }

  // --- HandleCheckData
  const handleCheckData = () => {
    const _email = $('#email').val();
    const _password = $('#password').val();
    $.ajax({
      url: 'https://x-api.alpha-x.id/v1/login',
      type: 'POST',
      dataType: 'JSON',
      data: {
        email: _email,
        password: _password
      },
      beforeSend: () => {
        // set loader
        $('.js-auth-login button[type="submit"]').html('<span class="lds-ring"><span></span><span></span><span></span><span></span></span> Mengirim');
      },
      success: (response) => {

        const _data = response;
        if (_data.code === 203) {
          $('.form-input__error__txt').text(_data.message);
          $('.form-input__error').show(0);
          // remove loader
          $('.js-auth-login button[type="submit"]').html('Masuk');
        } else if (_data.code === 200) {
          // set session
          Session.set('userData', JSON.stringify(_data.data));
          // redirect page
          location.href = "http://localhost:3000/index.html";
        }
      },
      error: (response) => {
        alert('Data Gagal di proses!');
      }
    });
  }

  // --- HandleCheckSession
  const handleCheckSession = () => {
    const _userData = JSON.parse(Session.get('userData'));
    if (_userData) {
      if (_userData.logged) {
        location.href = "http://localhost:3000/index.html";
      }
    } else {
      $('.js-main-site').removeClass('auth--hide');
    }
  }

  // --- HandleCloseAlert
  const handleCloseAlert = () => {
    $('.js-form-input-error').on('click', (e) => {
      $(e.currentTarget).parents('.form-input__error').hide(0);
    });
  }

  // --- init
  const init = () => {
    if ($('.js-auth-login').length) {
      handleCloseAlert();
      handleRunValidation();
      handleClickValidation();
      handleCheckSession();
    }
  }

  return {
    init
  }

})();

export default Login;
