'use strict';

(function () {
  /* Переводит страницу в активное состояние */
  var activatePage = function () {
    if (!window.map.isMapActive()) {
      window.map.changeMapStatus();
      window.server.load(function (data) {
        window.map.fillMap(data);
      }, function () {
        window.message.showErrorMessage();
      });
      window.form.changeFormStatus();
    }
  };

  /* Переводит страницу в неактивное состояние */
  var deactivatePage = function () {
    window.map.changeMapStatus();
    window.map.setMainPinDefaultCoordinates();
    window.form.changeFormStatus();
  };

  /* Устанавливает обработчики событий главной метки */
  window.map.setMainPinHandlers(activatePage, window.form.fillAddressInput);

  /* Переводит страницу в неактивное состояние при нажатии на кнопку очистки формы */
  window.form.setResetCallback(function () {
    deactivatePage();
  });

  /* Обрабатывает отправку формы */
  window.form.setSubmitCallbacks(function () {
    deactivatePage();
    window.message.showSuccessMessage();
  }, function () {
    window.card.removeCard();
    window.message.showErrorMessage();
  });
})();
