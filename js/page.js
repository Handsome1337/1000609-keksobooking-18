'use strict';

(function () {
  /* Переводит страницу в активное состояние */
  var activatePage = function () {
    if (!window.map.isMapActive()) {
      window.map.changeMapStatus();
      window.filter.changeFiltersStatus(false);
      window.server.load(function (data) {
        window.filter.setFilterOffersCallback(data, function (filteredData) {
          window.card.removeCard();
          window.map.fillMap(filteredData);
        });
      }, function () {
        window.message.showErrorMessage();
      });
      window.form.changeFormStatus();
    }
  };

  /* Переводит страницу в неактивное состояние */
  var deactivatePage = function () {
    window.map.changeMapStatus();
    window.filter.changeFiltersStatus(true);
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
