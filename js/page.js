'use strict';

(function () {
  /* Переводит страницу в активное состояние */
  var activatePage = function () {
    if (window.util.map.classList.contains('map--faded')) {
      window.map.activateMap();
      window.map.fillMap(window.data);
      window.form();
    }
  };

  /* Обработчик делает недопустные элементы доступными при нажатии мышкой на главную метку */
  window.pin.mainPin.addEventListener('mousedown', function () {
    activatePage();
  });

  /* Обработчик делает недоступные элементы доступными при нажатии на кнопку Enter, если фокус установлен на главной метке */
  window.pin.mainPin.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, activatePage);
  });
})();
