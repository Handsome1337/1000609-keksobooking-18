'use strict';

/* Первое задание по личному проекту */

/* Тестовые данные */
var TITLES = ['Квартира 1', 'Квартира 2', 'Квартира 3', 'Дворец 1', 'Дом 1', 'Дом 2', 'Дом 3', 'Бунгало 1'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var TIMES = ['12:00', '13:00', '14:00'];
var OPTIONS = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PICTURES = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var map = document.querySelector('.map');

/* Функция генерации случайного числа */
var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/* Функция выбора случайного элемента массива */
var getRandomArrElem = function (arr) {
  var rand = Math.floor(Math.random() * arr.length);
  return arr[rand];
};

/* Функция перетасовки массива */
var getShuffledArr = function (arr) {
  arr.sort(function () {
    return 0.5 - Math.random();
  });
  return arr;
};

/* Функция, которая генерирует объект с объявлением */
var generatePost = function (number) {
  var post = {
    'author': {
      'avatar': 'img/avatars/user0' + (number + 1) + '.png'
    },

    'offer': {
      'title': TITLES[number],
      'address': '600, 350',
      'price': getRandomInt(1000, 1000000),
      'type': getRandomArrElem(TYPES),
      'rooms': getRandomInt(1, 5),
      'guests': getRandomInt(1, 15),
      'checkin': getRandomArrElem(TIMES),
      'checkout': getRandomArrElem(TIMES),
      'feautures': getShuffledArr(OPTIONS).slice(0, getRandomInt(1, OPTIONS.length)),
      'description': 'строка с описанием',
      'photos': getShuffledArr(PICTURES).slice(0, getRandomInt(1, PICTURES.length))
    },

    'location': {
      'x': getRandomInt(0, map.offsetWidth),
      'y': getRandomInt(130, 630)
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

/* Переключает карту в активное состояние, отрисовывает метки на основе случайных  */
var generateMap = function () {
  map.classList.remove('map--faded');

  var pinMap = document.querySelector('.map__pins');
  var defaultPin = document.querySelector('#pin').content.querySelector('.map__pin');
  var fragment = document.createDocumentFragment();

  var data = generateData();

  for (var i = 0; i < data.length; i++) {
    var pinElement = defaultPin.cloneNode(true);
    pinElement.setAttribute('style', 'left:' + (data[i].location.x - pinElement.offsetWidth / 2) + 'px; top:' + (data[i].location.y - pinElement.offsetHeight) + 'px');
    pinElement.querySelector('img').setAttribute('src', data[i].author.avatar);
    pinElement.querySelector('img').setAttribute('alt', data[i].offer.title);

    fragment.appendChild(pinElement);
  }

  pinMap.appendChild(fragment);
};

generateMap();
