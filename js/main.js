'use strict';

/* Первое задание по личному проекту */

/* Тестовые данные */
var TITLES = ['Квартира 1', 'Квартира 2', 'Квартира 3', 'Дворец 1', 'Дом 1', 'Дом 2', 'Дом 3', 'Бунгало 1'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var TIMES = ['12:00', '13:00', '14:00'];
var OPTIONS = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PICTURES = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var PINHEIGHT = 70;
var PINWIDTH = 50;

var map = document.querySelector('.map');
var pinMap = document.querySelector('.map__pins');
var defaultPin = document.querySelector('#pin').content.querySelector('.map__pin');

/* Функция генерации случайного числа */
var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/* Функция выбора случайного элемента массива */
var getRandomArrElem = function (arr) {
  var rand = getRandomInt(0, arr.length - 1);
  return arr[rand];
};

/* Функция перетасовки массива */
var getShuffledArr = function (arr) {
  var shuffledArr = arr.slice().sort(function () {
    return 0.5 - Math.random();
  });
  return shuffledArr;
};

var getFragment = function () {
  var fragment = document.createDocumentFragment();
  return fragment;
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

/* Переключает карту в активное состояние */
var activateMap = function () {
  map.classList.remove('map--faded');
};

/* Сооздаёт метку случайного объявления */
var createPin = function (obj) {
  var pinElement = defaultPin.cloneNode(true);
  pinElement.style.left = obj.location.x - PINWIDTH / 2 + 'px';
  pinElement.style.top = obj.location.y - PINHEIGHT + 'px'; // мне кажется, в ТЗ ошибка и вычитать высоту метки не надо
  pinElement.querySelector('img').setAttribute('src', obj.author.avatar);
  pinElement.querySelector('img').setAttribute('alt', obj.offer.title);
  return pinElement;
};

/* Отрисовывает метки на основе случайных объявлений */
var fillMap = function (arr) {
  var fragment = getFragment();

  for (var i = 0; i < arr.length; i++) {
    var pinElement = createPin(arr[i]);
    fragment.appendChild(pinElement);
  }

  pinMap.appendChild(fragment);
};

activateMap();
fillMap(generateData());

/*
Второе задание по личному проекту
*/

var defaultCard = document.querySelector('#card').content.querySelector('.map__card');
var postCard = defaultCard.cloneNode(true);

/* Переименовывает тип жилья в соответствии с ТЗ */
var translateType = function (type) {
  switch (type) {
    case 'palace':
      type = 'Дворец';
      break;
    case 'flat':
      type = 'Квартира';
      break;
    case 'house':
      type = 'Дом';
      break;
    case 'bungalo':
      type = 'Бунгало';
      break;
    default:
      type = type;
  }
  return type;
};

/* Создаёт альбом фотографий жилья */
var createAlbum = function (arr) {
  var fragment = getFragment();

  /* Находит блок для фотографий */
  var album = postCard.querySelector('.popup__photos');
  /* Находит элемент для фотографии внутрии блока */
  var photo = postCard.querySelector('.popup__photo');
  /* Очищает содержимое блока для фотографий */
  album.textContent = '';

  for (var i = 0; i < arr.length; i++) {
    /* Создаёт копию шаблона для фотографии */
    var copy = photo.cloneNode(true);
    copy.setAttribute('src', arr[i]);
    fragment.appendChild(copy);
  }

  album.appendChild(fragment);
};

/* Заполняет данные карточки объявления */
var fillCard = function (obj) {
  postCard.querySelector('.popup__title').textContent = obj.offer.title;
  postCard.querySelector('.popup__text--address').textContent = obj.offer.address;
  postCard.querySelector('.popup__text--price').textContent = obj.offer.price + '₽/ночь';
  postCard.querySelector('.popup__type').textContent = translateType(obj.offer.type);
  postCard.querySelector('.popup__text--capacity').textContent = obj.offer.rooms + ' комнаты для ' + obj.offer.guests + ' гостей';
  postCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + obj.offer.checkin + ', выезд до ' + obj.offer.checkout;
  postCard.querySelector('.popup__features').textContent = obj.offer.feautures.join(', ');
  postCard.querySelector('.popup__description').textContent = obj.offer.description;
  createAlbum(obj.offer.photos);
  postCard.querySelector('.popup__avatar').setAttribute('src', obj.author.avatar);
  return postCard;
};

/* Отрисовывает карточку объявления */
var createCard = function (arr) {
  var fragment = getFragment();

  fragment.appendChild(fillCard(arr[0]));
  pinMap.parentNode.insertBefore(fragment, pinMap.nextSibling);
};

createCard(generateData());
