'use strict';

(function () {
  var PINHEIGHT = 70;
  var PINWIDTH = 50;
  var MAIN_PIN_WIDTH = 62;
  var MAIN_PIN_HEIGHT = 62;
  var TAIL_OF_MAIN_PIN_HEIGHT = 22;
  /* Находит главную метку, взаимодействие с которой переводит страницу в активное состояние */
  var mainPin = window.util.map.querySelector('.map__pin--main');
  var defaultPin = document.querySelector('#pin').content.querySelector('.map__pin');

  /* Сооздаёт метку случайного объявления */
  var createPin = function (obj) {
    var pinElement = defaultPin.cloneNode(true);
    pinElement.style.left = obj.location.x - PINWIDTH / 2 + 'px';
    pinElement.style.top = obj.location.y - PINHEIGHT + 'px'; // мне кажется, в ТЗ ошибка и вычитать высоту метки не надо
    pinElement.querySelector('img').setAttribute('src', obj.author.avatar);
    pinElement.querySelector('img').setAttribute('alt', obj.offer.title);
    return pinElement;
  };

  /* Находит координаты главный метки */
  var getMainPinPosition = function () {
    var coordinates = {
      'x': Math.round(mainPin.offsetLeft + MAIN_PIN_WIDTH / 2),
      'y': Math.round(mainPin.offsetTop + MAIN_PIN_HEIGHT / 2)
    };
    if (!window.util.map.classList.contains('map--faded')) {
      coordinates.y = coordinates.y + TAIL_OF_MAIN_PIN_HEIGHT;
    }
    return coordinates;
  };

  window.pin = {
    mainPin: mainPin,
    createPin: createPin,
    getMainPinPosition: getMainPinPosition
  };

})();
