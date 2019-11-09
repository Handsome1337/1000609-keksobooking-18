'use strict';

(function () {
  /* Переводит страницу в активное состояние */
  var activatePage = function () {
    if (!window.map.isActive()) {
      window.map.changeStatus();
      window.server.load(function (data) {
        var correctData = data.filter(function (item) {
          return 'offer' in item;
        });
        window.filter.setOffersCallback(correctData, function (filteredData) {
          window.card.remove();
          window.map.fill(filteredData);
        });
      }, function () {
        window.message.showError();
      });
      window.form.changeStatus(window.map.getMainPinCoordinates());
    }
  };

  /* Переводит страницу в неактивное состояние */
  var deactivatePage = function () {
    window.map.changeStatus();
    window.filter.changeStatus(true);
    window.map.setMainPinDefaultPosition();
    window.form.changeStatus(window.map.getMainPinCoordinates());
  };

  /* Устраняет дребезг при отправке формы, выводит сообщение об успешной отправке формы либо об ошибке */
  var debounceSubmitCallback = window.util.debounce(function (form) {
    window.server.upload(new FormData(form), function () {
      deactivatePage();
      window.message.showSuccess();
    }, function () {
      window.card.remove();
      window.message.showError();
    });
  });

  /* Заполняет поле адреса координатами метки сразу при загрузке страницы */
  window.form.fillAddressInput(window.map.getMainPinCoordinates());

  /* Устанавливает обработчики событий главной метки */
  window.map.setMainPinHandlers(activatePage, window.form.fillAddressInput);

  /* Переводит страницу в неактивное состояние при нажатии на кнопку очистки формы */
  window.form.setResetCallback(function () {
    deactivatePage();
  });

  /* Обрабатывает отправку формы */
  window.form.setSubmitCallback(debounceSubmitCallback);
})();
