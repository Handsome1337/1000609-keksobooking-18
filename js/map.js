'use strict';

(function () {
  var MainPinSize = {
    WIDTH: 62,
    HEIGHT: 62,
    TAIL_HEIGHT: 22
  };

  var map = document.querySelector('.map');
  /* Ограничения перемещения главной метки по осям X и Y */
  var Limit = {
    TOP: 130 - (MainPinSize.HEIGHT + MainPinSize.TAIL_HEIGHT),
    RIGHT: map.offsetWidth - MainPinSize.WIDTH / 2,
    BOTTOM: 630 - (MainPinSize.HEIGHT + MainPinSize.TAIL_HEIGHT),
    LEFT: -MainPinSize.WIDTH / 2
  };
  var pinMap = map.querySelector('.map__pins');
  /* Находит главную метку, взаимодействие с которой переводит страницу в активное состояние */
  var mainPin = map.querySelector('.map__pin--main');
  /* Создает объект с координатами x и y*/
  var Coordinate = function (x, y) {
    this.x = x;
    this.y = y;
  };
  /* Находит координаты главной метки по умолчанию */
  var mainPinDefaultPosition = new Coordinate(mainPin.style.left, mainPin.style.top);

  /* Находит координаты главный метки */
  var getMainPinCoordinates = function () {
    var coordinates = new Coordinate(Math.round(mainPin.offsetLeft + MainPinSize.WIDTH / 2), Math.round(mainPin.offsetTop + MainPinSize.HEIGHT / 2));
    if (!map.classList.contains('map--faded')) {
      coordinates.y = coordinates.y + MainPinSize.HEIGHT / 2 + MainPinSize.TAIL_HEIGHT;
    }
    return coordinates;
  };

  /* Перемещает главную метку в позицию по умолчанию */
  var setMainPinDefaultPosition = function () {
    mainPin.style.top = mainPinDefaultPosition.y;
    mainPin.style.left = mainPinDefaultPosition.x;
  };

  /* Переключает активное и неактивное состояние карты */
  var changeMapStatus = function () {
    if (!map.classList.contains('map--faded')) {
      removePins();
      window.card.remove();
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
    return activePin ? activePin : false;
  };

  /* Отрисовывает метки на основе полученных объявлений */
  var fillMap = function (arr) {
    /* Удаляет метки, если они есть */
    removePins();
    var fragment = document.createDocumentFragment();

    arr.forEach(function (item) {
      var pin = window.createPin(item);

      pin.addEventListener('click', function () {
        /* Находит карточку объявления */
        var card = map.querySelector('.map__card');
        /* Находит активную метку */
        var activePin = isThereActivePin();
        /* Деактивирует метку, которую ранее активировал пользователь, если такая была */
        if (activePin) {
          activePin.classList.remove('map__pin--active');
        }
        /* Активирует метку */
        pin.classList.add('map__pin--active');
        /* Если ранее была открыта какая-либо карточка, удаляет её */
        if (card) {
          card.remove();
        }
        /* Когда открытых карточек точно нет, присваивает переменной card новую карточку */
        card = addCard(window.card.create(item, function () {
          pin.classList.remove('map__pin--active');
        }));
      });

      fragment.appendChild(pin);
    });

    pinMap.appendChild(fragment);
  };

  /* Удаляет все метки с карты */
  var removePins = function () {
    var pins = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    if (pins) {
      pins.forEach(function (pin) {
        pin.remove();
      });
    }
  };

  /* Отрисовывает карточку объявления */
  var addCard = function (card) {
    return pinMap.parentNode.insertBefore(card, pinMap.nextSibling);
  };

  /* Перемещает главную метку по карте */
  var movePin = function (evt, callback) {
    var startCoordinates = new Coordinate(evt.clientX, evt.clientY);

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var offset = new Coordinate(startCoordinates.x - moveEvt.clientX, startCoordinates.y - moveEvt.clientY);

      startCoordinates = new Coordinate(moveEvt.clientX, moveEvt.clientY);

      if (mainPin.offsetTop - offset.y >= Limit.TOP && mainPin.offsetTop - offset.y <= Limit.BOTTOM) {
        mainPin.style.top = mainPin.offsetTop - offset.y + 'px';
      }
      if (mainPin.offsetLeft - offset.x >= Limit.LEFT && mainPin.offsetLeft - offset.x <= Limit.RIGHT) {
        mainPin.style.left = mainPin.offsetLeft - offset.x + 'px';
      }

      callback(getMainPinCoordinates());
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  /* Устанавливает обработчики событий главной метки */
  var setMainPinHandlers = function (mainPinPressCallback, mainPinMoveCallback) {
    mainPin.addEventListener('mousedown', function (evt) {
      mainPinPressCallback();
      movePin(evt, mainPinMoveCallback);
    });
    mainPin.addEventListener('keydown', function (evt) {
      window.util.isEnterEvent(evt, mainPinPressCallback);
    });
  };

  window.map = {
    getMainPinCoordinates: getMainPinCoordinates,
    setMainPinDefaultPosition: setMainPinDefaultPosition,
    changeStatus: changeMapStatus,
    isActive: isMapActive,
    fill: fillMap,
    setMainPinHandlers: setMainPinHandlers
  };
})();
