'use strict';

(function () {
  var MAIN_PIN_WIDTH = 62;
  var MAIN_PIN_HEIGHT = 62;
  var TAIL_OF_MAIN_PIN_HEIGHT = 22;

  /* Переменная map вынесена в util.js, потому что она используется в нескольких модулях */
  var map = document.querySelector('.map');
  /* Ограничения перемещения главной метки по осям X и Y */
  var Limit = {
    TOP: 130 - (MAIN_PIN_HEIGHT + TAIL_OF_MAIN_PIN_HEIGHT),
    RIGHT: map.offsetWidth - MAIN_PIN_WIDTH / 2,
    BOTTOM: 630 - (MAIN_PIN_HEIGHT + TAIL_OF_MAIN_PIN_HEIGHT),
    LEFT: -MAIN_PIN_WIDTH / 2
  };
  var pinMap = map.querySelector('.map__pins');
  /* Находит главную метку, взаимодействие с которой переводит страницу в активное состояние */
  var mainPin = map.querySelector('.map__pin--main');
  /* Находит координаты главной метки по умолчанию */
  var MainPinDefaultCoordinates = {
    'x': mainPin.style.left,
    'y': mainPin.style.top
  };

  /* Находит координаты главный метки */
  var getMainPinPosition = function () {
    var coordinates = {
      'x': Math.round(mainPin.offsetLeft + MAIN_PIN_WIDTH / 2),
      'y': Math.round(mainPin.offsetTop + MAIN_PIN_HEIGHT / 2)
    };
    if (!map.classList.contains('map--faded')) {
      coordinates.y = coordinates.y + MAIN_PIN_HEIGHT / 2 + TAIL_OF_MAIN_PIN_HEIGHT;
    }
    return coordinates;
  };

  /* Перемещает главную метку в позицию по умолчанию */
  var setMainPinDefaultCoordinates = function () {
    mainPin.style.top = MainPinDefaultCoordinates.y;
    mainPin.style.left = MainPinDefaultCoordinates.x;
  };

  /* Переключает активное и неактивное состояние карты */
  var changeMapStatus = function () {
    if (!map.classList.contains('map--faded')) {
      removePins();
      window.card.removeCard();
    }
    map.classList.toggle('map--faded');
  };

  /* Возвращает состояние карты: активна она или нет */
  var isMapActive = function () {
    return !map.classList.contains('map--faded');
  };

  /* Проверяет наличие активной метки */
  var isThereActivePin = function () {
    var activePin = map.querySelector('.map__pin--active');
    if (activePin) {
      return activePin;
    } else {
      return false;
    }
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
        var activePin = isThereActivePin();
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

  /* Удаляет все метки с карты */
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
    return pinMap.parentNode.insertBefore(card, pinMap.nextSibling);
  };

  /* Перемещает главную метку по карте */
  var setPinMoveCallback = function (evt, callback) {
    var startCoordinates = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var offset = {
        x: startCoordinates.x - moveEvt.clientX,
        y: startCoordinates.y - moveEvt.clientY
      };

      startCoordinates = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      if (mainPin.offsetTop - offset.y >= Limit.TOP && mainPin.offsetTop - offset.y <= Limit.BOTTOM) {
        mainPin.style.top = mainPin.offsetTop - offset.y + 'px';
      }
      if (mainPin.offsetLeft - offset.x >= Limit.LEFT && mainPin.offsetLeft - offset.x <= Limit.RIGHT) {
        mainPin.style.left = mainPin.offsetLeft - offset.x + 'px';
      }

      callback();
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  window.map = {
    mainPin: mainPin,
    getMainPinPosition: getMainPinPosition,
    setMainPinDefaultCoordinates: setMainPinDefaultCoordinates,
    changeMapStatus: changeMapStatus,
    isMapActive: isMapActive,
    isThereActivePin: isThereActivePin,
    fillMap: fillMap,
    removePins: removePins,
    setPinMoveCallback: setPinMoveCallback
  };
})();
