'use strict';

(function () {
  /* Находит блок main и шаблон блока с ошибкой */
  var main = document.querySelector('main');
  var defaultError = document.querySelector('#error').content.querySelector('.error');

  /* При возникновении ошибки добавляет блок в разметку */
  var onError = function () {
    var error = defaultError.cloneNode(true);
    var errorClose = error.querySelector('.error__button');
    main.insertBefore(error, main.firstChild);
    errorClose.addEventListener('click', onErrorCloseClick);
    document.addEventListener('keydown', onErrorEscPress);
    /* Обработчик клика на произвольную область экрана за пределами блока с сообщением */
    document.addEventListener('click', beyondErrorMessageClick);
  };

  /* Удаляет блок с ошибкой */
  var removeError = function () {
    main.querySelector('.error').remove();
    document.removeEventListener('keydown', onErrorEscPress);
    document.removeEventListener('click', beyondErrorMessageClick);
  };

  var onErrorCloseClick = function () {
    removeError();
  };

  var onErrorEscPress = function (evt) {
    window.util.isEscEvent(evt, removeError);
  };

  var beyondErrorMessageClick = function (evt) {
    var errorMessage = document.querySelector('.error__message');
    if (evt.target !== errorMessage) {
      removeError();
    }
  };

  window.error = {
    onError: onError
  };
})();
