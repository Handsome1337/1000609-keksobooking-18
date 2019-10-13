'use strict';

(function () {
  var MAIN_PIN_WIDTH = 62;
  var MAIN_PIN_HEIGHT = 62;
  var TAIL_OF_MAIN_PIN_HEIGHT = 22;

  /* Переменная map вынесена в util.js, потому что она используется в нескольких модулях */
  var map = document.querySelector('.map');
  var pinMap = map.querySelector('.map__pins');
  /* Находит главную метку, взаимодействие с которой переводит страницу в активное состояние */
  var mainPin = map.querySelector('.map__pin--main');

  /* Находит координаты главный метки */
  var getMainPinPosition = function () {
    var coordinates = {
      'x': Math.round(mainPin.offsetLeft + MAIN_PIN_WIDTH / 2),
      'y': Math.round(mainPin.offsetTop + MAIN_PIN_HEIGHT / 2)
    };
    if (!map.classList.contains('map--faded')) {
      coordinates.y = coordinates.y + TAIL_OF_MAIN_PIN_HEIGHT;
    }
    return coordinates;
  };

  /* Переключает активное и неактивное состояние карты */
  var changeMapStatus = function () {
    map.classList.toggle('map--faded');
  };

  /* Отрисовывает метки на основе случайных объявлений */
  var fillMap = function (arr) {
    var fragment = document.createDocumentFragment();

    arr.forEach(function (item) {
      var pinElement = window.pin(item);

      pinElement.addEventListener('click', function () {
        /* Находит карточку объявления */
        var card = map.querySelector('.map__card');
        /* Находит активную метку */
        var activePin = map.querySelector('.map__pin--active');
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

  var removePins = function () {
    var pins = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    if (pins) {
      for (var i = 0; i < pins.length; i++) {
        pins[i].remove();
      }
    }
  };

  /* Отрисовывает карточку объявления */
  var addCard = function (card) {
    document.addEventListener('keydown', window.card.onCardEscPress);
    return pinMap.parentNode.insertBefore(card, pinMap.nextSibling);
  };

  window.map = {
    map: map,
    mainPin: mainPin,
    getMainPinPosition: getMainPinPosition,
    changeMapStatus: changeMapStatus,
    fillMap: fillMap,
    removePins: removePins
  };
})();
