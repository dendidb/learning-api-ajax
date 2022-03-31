/* ------------------------------------------------------------------------------
@name: Login
@description: Login
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

const Login = (() => {

  // Handle Run Validation
  const handleRunValidation = () => {
    Validation.config(ElementEvents, ElementSelector);
  }

  // Handle Click Validation
  const handleClickValidation = () => {
    $('button[type="button"]').on('click', (e) => {
      e.preventDefault();
      $.each(ElementSelector, (i, v) => {
        $('#'+v.id).blur();
      });
      
      if ($('.error').length > 0) {
        e.preventDefault();

      } else {
        const page = e.currentTarget.attributes.page.value;
        const email = $('#email').val();
        const password = $('#password').val();

        if (page == 'login') {
          console.log({
            email, password
          })

          $.ajax({
            url: 'https://x-api.alpha-x.id/v1/login',
            type: 'POST',
            data: {
              email, password
            },
            dataType: 'JSON',
            success: function(data) {
              // console.log(data);
              if (data.code == 203) {
                $('.form-input__error__txt').text(data.message);
                $('.form-input__error').addClass('show');

                // stop(return) function rendering di sini
                // return;
              }
              localStorage.setItem('user', JSON.stringify({
                email, password}));

              // coba redirect ke product list
              window.location.href = 'http://localhost:3000/'
            }
          });
        } else {
          $.ajax({
            url: 'https://x-api.alpha-x.id/v1/registration',
            type: 'POST',
            data: {
              email, password
            },
            dataType: 'JSON',
            success: function(data) {
              console.log(data);
              if (data.code == 400) {
                $('.form-input__error__txt').text('Gagal');
                $('.form-input__error').addClass('show');
              }
            }
          });
        };


        // location.href = "http://localhost:3018/register-berhasil.html";
        // set loaders
        // $(e.currentTarget).addClass('loading').html('<span class="loaders"><span></span><span></span><span></span><span></span></span>Mengirim');

        // set notif error
        // $('.contact-form .fi-status').html('<p class="fi-status-error">Periksa kembali dan harap lengkapi semua formulir</p>');

        // set notif success
        // $('.contact-form .fi-status').html('<p class="fi-status-success"><i class="fi fi-check-circle"></i>Pesan berhasil dikirim, kami akan segera memproses pesan Anda</p>');

        // setTimeout(() => {
          // reload
          // location.reload();
        // }, 3000);

        // e.preventDefault();

      }
    });
  }


  // init
  const init = () => {
    handleRunValidation();
    handleClickValidation();
  }

  return {
    init
  }

})();

export default Login;
