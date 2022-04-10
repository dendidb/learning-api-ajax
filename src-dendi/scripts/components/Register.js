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

  // Handle Run Validation
  const handleRunValidation = () => {
    Validation.config(ElementEvents, ElementSelector);
  }

  // Handle Click Validation
  const handleClickValidation = () => {
    $('button[type="submit"]').on('click', (e) => {
      $.each(ElementSelector, (i, v) => {
        $('#'+v.id).blur();
      });

      if ($('.error').length > 0) {
        e.preventDefault();
      } else {
        location.href = "http://localhost:3018/register-berhasil.html";
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

export default Register;
