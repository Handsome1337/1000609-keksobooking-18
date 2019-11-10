'use strict';

(function () {
  var SUCCESS = 'success';

  /* Находит блок main и шаблоны блоков с сообщениями об успешной отправке и ошибке */
  var main = document.querySelector('main');
  var defaultSuccess = document.querySelector('#success').content.querySelector('.success');
  var defaultError = document.querySelector('#error').content.querySelector('.error');
  var message = null;

  /* Добавляет сообщение в разметку */
  var addMessage = function (type) {
    if (type === SUCCESS) {
      message = defaultSuccess.cloneNode(true);
    } else {
      message = defaultError.cloneNode(true);
      var errorClose = message.querySelector('.error__button');
      errorClose.addEventListener('click', onErrorCloseClick);
    }
    main.insertBefore(message, main.firstChild);
    document.addEventListener('keydown', onMessageEscPress);
    /* Обработчик клика на произвольную область экрана за пределами блока с сообщением */
    document.addEventListener('click', onBeyondMessageClick);
  };

  /* Удаляет сообщение */
  var removeMessage = function () {
    message.remove();
    document.removeEventListener('keydown', onMessageEscPress);
    document.removeEventListener('click', onBeyondMessageClick);
  };

  var onErrorCloseClick = function () {
    removeMessage();
  };

  var onMessageEscPress = function (evt) {
    window.util.isEscEvent(evt, removeMessage);
  };

  var onBeyondMessageClick = function (evt) {
    var typeOfMessage = message.className;
    var messageText = message.querySelector('.' + typeOfMessage + '__message');
    if (evt.target !== messageText) {
      removeMessage();
    }
  };

  window.message = {
    showSuccess: function () {
      addMessage('success');
    },
    showError: function () {
      addMessage();
    }
  };
})();
