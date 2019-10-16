'use strict';

(function () {
  /* Переводит страницу в активное состояние */
  var activatePage = function () {
    if (!window.map.isMapActive()) {
      window.map.changeMapStatus();
      window.map.fillMap(window.data);
      window.form.changeFormStatus();
    }
  };

  /* Устанавливает обработчики событий главной метки */
  window.map.setMainPinHandlers(activatePage, window.form.fillAddressInput);

  window.form.setResetCallback(function () {
    window.map.changeMapStatus();
    window.map.setMainPinDefaultCoordinates();
  });
})();
