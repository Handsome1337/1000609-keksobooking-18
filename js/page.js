'use strict';

(function () {
  /* Переводит страницу в активное состояние */
  var activatePage = function () {
    if (window.map.map.classList.contains('map--faded')) {
      window.map.changeMapStatus();
      window.map.fillMap(window.data);
      window.form.changeFormStatus();
    }
  };

  /* Обработчик делает недопустные элементы доступными при нажатии мышкой на главную метку */
  window.map.mainPin.addEventListener('mousedown', function () {
    activatePage();
  });

  /* Обработчик делает недоступные элементы доступными при нажатии на кнопку Enter, если фокус установлен на главной метке */
  window.map.mainPin.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, activatePage);
  });


  window.form.setResetCallback(function () {
    window.map.changeMapStatus();
    window.map.removePins();
    window.card.removeCard();
  });
})();
