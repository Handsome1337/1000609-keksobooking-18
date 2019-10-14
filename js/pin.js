'use strict';

(function () {
  var PINHEIGHT = 70;
  var PINWIDTH = 50;
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

  window.pin = createPin;
})();
