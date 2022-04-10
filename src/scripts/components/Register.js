/* ------------------------------------------------------------------------------
@name: Register
@description: Register
--------------------------------------------------------------------------------- */


// --- utilities
import {
  Validation
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

const Register = (() => {

  // --- HandleRunValidation
  const handleRunValidation = () => {
    Validation.config(ElementEvents, ElementSelector);
  }

  // --- HandleClickValidation
  const handleClickValidation = () => {
    $('.js-auth-registration button[type="submit"]').on('click', (e) => {
      $.each(ElementSelector, (i, v) => {
        $('#'+v.id).blur();
      });

      if ($('.error').length === 0) {
        handleRegistration();
      }
      e.preventDefault();
    });
  }

  // --- HandleRegistration
  const handleRegistration = () => {
    const _email = $('#email').val();
    const _password = $('#password').val();
    $.ajax({
      url: 'https://x-api.alpha-x.id/v1/registration',
      type: 'POST',
      dataType: 'JSON',
      data: {
        email: _email,
        password: _password
      },
      beforeSend: () => {
        // set loader
        $('.js-auth-registration button[type="submit"]').html('<span class="lds-ring"><span></span><span></span><span></span><span></span></span> Mengirim');
      },
      success: (response) => {

        const _data = response;
        if (_data.code === 203) {
          // set error
          $('.form-input__error__txt').text(_data.message);
          $('.form-input__error').show(0);
          // remove loader
          $('.js-auth-registration button[type="submit"]').html('Daftar');
        } else {
          // set success
          const _success = `<div class="form-input__success">
                              <div class="form-input__success_icon">
                                <i class="fi fi-checklist"></i>
                              </div>
                              <h2 class="form-input__success__title">Registrasi Berhasil</h2>
                              <p class="form-input__success__desc">Silakan cek email Anda untuk proses aktivasi akun</p>
                            </div>`;
          $('.js-auth-registration .form-input__wrapper').html(_success);
        }
      },
      error: (response) => {
        alert('Data Gagal di proses!');
      }
    });
  }

  // --- HandleCloseAlert
  const handleCloseAlert = () => {
    $('.js-form-input-error').on('click', (e) => {
      $(e.currentTarget).parents('.form-input__error').hide(0);
    });
  }

  // --- init
  const init = () => {
    if ($('.js-auth-registration').length) {
      handleCloseAlert();
      handleRunValidation();
      handleClickValidation();
    }
  }

  return {
    init
  }

})();

export default Register;
