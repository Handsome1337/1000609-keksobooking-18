'use strict';

(function () {
  /* Находит блок main и шаблоны блоков с сообщениями об успешной отправке и ошибке */
  var main = document.querySelector('main');
  var defaultSuccess = document.querySelector('#success').content.querySelector('.success');
  var defaultError = document.querySelector('#error').content.querySelector('.error');
  var message = null;

  /* Добавляет сообщение в разметку */
  var addMessage = function (type) {
    if (type === 'success') {
      message = defaultSuccess.cloneNode(true);
    } else {
      message = defaultError.cloneNode(true);
      var errorClose = message.querySelector('.error__button');
      errorClose.addEventListener('click', onErrorCloseClick);
    }
    main.insertBefore(message, main.firstChild);
    document.addEventListener('keydown', onMessageEscPress);
    /* Обработчик клика на произвольную область экрана за пределами блока с сообщением */
    document.addEventListener('click', beyondMessageClick);
  };

  var showSuccessMessage = function () {
    addMessage('success');
  };

  var showErrorMessage = function () {
    addMessage();
  };

  /* Удаляет сообщение */
  var removeMessage = function () {
    message.remove();
    document.removeEventListener('keydown', onMessageEscPress);
    document.removeEventListener('click', beyondMessageClick);
  };

  var onErrorCloseClick = function () {
    removeMessage();
  };

  var onMessageEscPress = function (evt) {
    window.util.isEscEvent(evt, removeMessage);
  };

  var beyondMessageClick = function (evt) {
    var typeOfMessage = message.className;
    var messageText = message.querySelector('.' + typeOfMessage + '__message');
    if (evt.target !== messageText) {
      removeMessage();
    }
  };

  window.message = {
    showSuccessMessage: showSuccessMessage,
    showErrorMessage: showErrorMessage
  };
})();
