(() => {
  'use strict';

  const forms = document.querySelectorAll('.needs-validation');

  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');

  if (password && confirmPassword) {
    const validatePasswordMatch = () => {
      if (confirmPassword.value && password.value !== confirmPassword.value) {
        confirmPassword.setCustomValidity('Passwords do not match.');
      } else {
        confirmPassword.setCustomValidity('');
      }
    };

    password.addEventListener('input', validatePasswordMatch);
    confirmPassword.addEventListener('input', validatePasswordMatch);
  }

  Array.from(forms).forEach((form) => {
    form.addEventListener(
      'submit',
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add('was-validated');
      },
      false
    );
  });
})();
