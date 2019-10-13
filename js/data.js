'use strict';

(function () {
  /* Тестовые данные */
  var TITLES = ['Квартира 1', 'Квартира 2', 'Квартира 3', 'Дворец 1', 'Дом 1', 'Дом 2', 'Дом 3', 'Бунгало 1'];
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var TIMES = ['12:00', '13:00', '14:00'];
  var OPTIONS = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PICTURES = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

  /* Функция, которая генерирует объект с объявлением */
  var generatePost = function (number) {
    var post = {
      'author': {
        'avatar': 'img/avatars/user0' + (number + 1) + '.png'
      },

      'offer': {
        'title': TITLES[number],
        'address': '600, 350',
        'price': window.util.getRandomInt(1000, 1000000),
        'type': window.util.getRandomArrElem(TYPES),
        'rooms': window.util.getRandomInt(1, 5),
        'guests': window.util.getRandomInt(1, 15),
        'checkin': window.util.getRandomArrElem(TIMES),
        'checkout': window.util.getRandomArrElem(TIMES),
        'feautures': window.util.getShuffledArr(OPTIONS).slice(0, window.util.getRandomInt(1, OPTIONS.length)),
        'description': 'строка с описанием',
        'photos': window.util.getShuffledArr(PICTURES).slice(0, window.util.getRandomInt(1, PICTURES.length))
      },

      'location': {
        'x': window.util.getRandomInt(0, window.util.map.offsetWidth),
        'y': window.util.getRandomInt(130, 630)
      }
    };
    return post;
  };

  /* Создаёт массив случайных объявлений неподалёку */
  var generateData = function () {
    var data = [];

    for (var i = 0; i < 8; i++) {
      data.push(generatePost(i));
    }

    return data;
  };

  var data = generateData();

  window.data = data;
})();
