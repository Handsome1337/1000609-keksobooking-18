'use strict';

(function () {
  var pinMap = window.util.map.querySelector('.map__pins');

  /* Переключает карту в активное состояние */
  var activateMap = function () {
    window.util.map.classList.remove('map--faded');
  };

  /* Отрисовывает метки на основе случайных объявлений */
  var fillMap = function (arr) {
    var fragment = document.createDocumentFragment();

    arr.forEach(function (item) {
      var pinElement = window.pin.createPin(item);

      pinElement.addEventListener('click', function () {
        /* Находит карточку объявления */
        var card = window.util.map.querySelector('.map__card');
        /* Находит активную метку */
        var activePin = window.util.map.querySelector('.map__pin--active');
        /* Деактивирует метку, которую ранее активировал пользователь, если такая была */
        if (activePin) {
          activePin.classList.remove('map__pin--active');
        }
        /* Активирует метку */
        pinElement.classList.add('map__pin--active');
        /* Если ранее была открыта какая-либо карточка, удаляет её */
        if (card) {
          card.remove();
        }
        card = addCard(window.card.createCard(item));
      });

      fragment.appendChild(pinElement);
    });

    pinMap.appendChild(fragment);
  };

  /* Отрисовывает карточку объявления */
  var addCard = function (card) {
    document.addEventListener('keydown', window.card.onCardEscPress);
    return pinMap.parentNode.insertBefore(card, pinMap.nextSibling);
  };

  window.map = {
    activateMap: activateMap,
    fillMap: fillMap
  };
})();
