'use strict';

(function () {
  var Pin = {
    HEIGHT: 70,
    WIDTH: 50
  };

  var defaultPin = document.querySelector('#pin').content.querySelector('.map__pin');

  window.createPin = function (obj) {
    /* Создаёт метку случайного объявления */
    var pin = defaultPin.cloneNode(true);
    pin.style.left = obj.location.x - Pin.WIDTH / 2 + 'px';
    pin.style.top = obj.location.y - Pin.HEIGHT + 'px'; // мне кажется, в ТЗ ошибка и вычитать высоту метки не надо
    pin.querySelector('img').src = obj.author.avatar;
    pin.querySelector('img').alt = obj.offer.title;
    return pin;
  };
})();
