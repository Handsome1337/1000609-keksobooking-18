'use strict';

(function () {
  /* Переводит страницу в активное состояние */
  var activatePage = function () {
    if (!window.map.isMapActive()) {
      window.map.changeMapStatus();
      window.server.load(function (data) {
        window.filter.setFilterOffersCallback(data, function (filteredData) {
          window.card.removeCard();
          window.map.fillMap(filteredData);
        });
      }, function () {
        window.message.showErrorMessage();
      });
      window.form.changeFormStatus(window.map.getMainPinPosition());
    }
  };

  /* Переводит страницу в неактивное состояние */
  var deactivatePage = function () {
    window.map.changeMapStatus();
    window.filter.changeFiltersStatus(true);
    window.map.setMainPinDefaultCoordinates();
    window.form.changeFormStatus(window.map.getMainPinPosition());
  };

  /* Устраняет дребезг при отправке формы, выводит сообщение об успешной отправке формы либо об ошибке */
  var debounceSubmitCallback = window.util.debounce(function (form) {
    window.server.upload(new FormData(form), function () {
      deactivatePage();
      window.message.showSuccessMessage();
    }, function () {
      window.card.removeCard();
      window.message.showErrorMessage();
    });
  });

  /* Заполняет поле адреса координатами метки сразу при загрузке страницы */
  window.form.fillAddressInput(window.map.getMainPinPosition());

  /* Устанавливает обработчики событий главной метки */
  window.map.setMainPinHandlers(activatePage, window.form.fillAddressInput);

  /* Переводит страницу в неактивное состояние при нажатии на кнопку очистки формы */
  window.form.setResetCallback(function () {
    deactivatePage();
  });

  /* Обрабатывает отправку формы */
  window.form.setSubmitCallback(debounceSubmitCallback);
})();
