'use strict';

(function () {
  /* Находит блок main и шаблон блока с сообщением об успешной отправке */
  var main = document.querySelector('main');
  var defaultSuccess = document.querySelector('#success').content.querySelector('.success');

  /* При успешной отправке формы добавляет блок в разметку */
  var onSuccess = function () {
    var success = defaultSuccess.cloneNode(true);
    main.insertBefore(success, main.firstChild);
    document.addEventListener('keydown', onSuccessEscPress);
    document.addEventListener('click', beyondSuccessMessageClick);
  };

  /* Удаляет блок с сообщением об супешной отправке формы */
  var removeSuccess = function () {
    main.querySelector('.success').remove();
    document.removeEventListener('keydown', onSuccessEscPress);
    document.removeEventListener('click', beyondSuccessMessageClick);
  };

  var onSuccessEscPress = function (evt) {
    window.util.isEscEvent(evt, removeSuccess);
  };

  var beyondSuccessMessageClick = function (evt) {
    var successMessage = document.querySelector('.success__message');
    if (evt.target !== successMessage) {
      removeSuccess();
    }
  };

  window.success = {
    showSuccessMessage: onSuccess
  };
})();
