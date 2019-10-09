'use strict';

/*
Первое задание по личному проекту
*/

/* Тестовые данные */
var TITLES = ['Квартира 1', 'Квартира 2', 'Квартира 3', 'Дворец 1', 'Дом 1', 'Дом 2', 'Дом 3', 'Бунгало 1'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var TIMES = ['12:00', '13:00', '14:00'];
var OPTIONS = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PICTURES = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var PINHEIGHT = 70;
var PINWIDTH = 50;

var map = document.querySelector('.map');
var pinMap = map.querySelector('.map__pins');
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

var data = generateData();

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
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < arr.length; i++) {
    var pinElement = createPin(arr[i]);
    fragment.appendChild(pinElement);
  }

  pinMap.appendChild(fragment);
};

/*
Второе задание по личному проекту
*/

/* Создает новый элемент с заданным атрибутом class */
var createElem = function (elemName, elemClass) {
  var newElement = document.createElement(elemName);
  newElement.className = elemClass;
  return newElement;
};

/* Создает новый элемент img с заданными атрибутоми src, width, height, alt и class */
var createImg = function (src, width, height, alt, elemClass) {
  var newImg = createElem('img', elemClass);
  newImg.src = src;
  newImg.width = width;
  newImg.height = height;
  newImg.alt = alt;
  return newImg;
};

/* Переименовывает тип жилья в соответствии с ТЗ */
var translateType = function (type) {
  switch (type) {
    case 'palace':
      return 'Дворец';
    case 'flat':
      return 'Квартира';
    case 'house':
      return 'Дом';
    case 'bungalo':
      return 'Бунгало';
    default:
      return type;
  }
};

/* Создаёт коллекцию фотографий жилья */
var createAlbum = function (arr) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < arr.length; i++) {
    var photo = createImg(arr[i], 45, 40, 'Фотография жилья', 'popup__photo');
    fragment.appendChild(photo);
  }

  return fragment;
};

/* Создаёт коллекцию опций */
var createFeautures = function (arr) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < arr.length; i++) {
    var feauture = createElem('li', 'popup__feature popup__feature--' + arr[i]);
    fragment.appendChild(feauture);
  }

  return fragment;
};

/* Заполняет данные карточки объявления */
var fillCard = function (obj) {
  var defaultCard = document.querySelector('#card').content.querySelector('.map__card');
  var postCard = defaultCard.cloneNode(true);
  /* Находит блок для фотографий */
  var album = postCard.querySelector('.popup__photos');
  /* Очищает содержимое блока для фотографий */
  album.textContent = '';
  /* Находит блок для списка опций */
  var feauturesList = postCard.querySelector('.popup__features');
  /* Очищает содержимое блока для списка опций */
  feauturesList.textContent = '';

  postCard.querySelector('.popup__title').textContent = obj.offer.title;
  postCard.querySelector('.popup__text--address').textContent = obj.offer.address;
  postCard.querySelector('.popup__text--price').textContent = obj.offer.price + '₽/ночь';
  postCard.querySelector('.popup__type').textContent = translateType(obj.offer.type);
  postCard.querySelector('.popup__text--capacity').textContent = obj.offer.rooms + ' комнаты для ' + obj.offer.guests + ' гостей';
  postCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + obj.offer.checkin + ', выезд до ' + obj.offer.checkout;
  feauturesList.appendChild(createFeautures(obj.offer.feautures));
  postCard.querySelector('.popup__description').textContent = obj.offer.description;
  album.appendChild(createAlbum(obj.offer.photos));
  postCard.querySelector('.popup__avatar').setAttribute('src', obj.author.avatar);
  return postCard;
};

/* Отрисовывает карточку объявления */
var createCard = function (obj) {
  pinMap.parentNode.insertBefore(fillCard(obj), pinMap.nextSibling);
};

/*
Третье задание по личному проекту
*/

var ENTER_KEYCODE = 13;

/* Находит главную метку, взаимодействие с которой переводит страницу в активное состояние */
var mainPin = map.querySelector('.map__pin--main');
var mainPinWidth = mainPin.offsetWidth;
var mainPinHeight = mainPin.offsetHeight;
/* Находит все элементы, которые недопустны в неактивном состоянии */
var disabledElements = document.querySelectorAll('[disabled]');

/* Находит координаты главный метки */
var getMainPinPosition = function () {
  var x = mainPin.offsetLeft;
  var y = mainPin.offsetTop;
  return [x, y];
};

/* Заполняет поле адреса координатами метки */
var fillAddressInput = function () {
  /* Находит поле адреса */
  var addressInput = document.querySelector('#address');
  addressInput.value = Math.round((getMainPinPosition()[0] + mainPinWidth / 2)) + ', ' + Math.round((getMainPinPosition()[1] + mainPinHeight / 2));
};

/* Удаляет атрибут disabled у переданной в параметр коллекции элементов */
var removeDisabledAttr = function (arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i].removeAttribute('disabled');
  }
};

/* Обработчик делает недопустные элементы доступными при нажатии мышкой на главную метку */
mainPin.addEventListener('mousedown', function () {
  activateMap();
  fillMap(data);
  createCard(data[0]);
  removeDisabledAttr(disabledElements);
});

/* Обработчик делает недопустные элементы доступными при нажатии на кнопку Enter, если фокус установлен на главной метке */
mainPin.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    activateMap();
    fillMap(data);
    createCard(data[0]);
    removeDisabledAttr(disabledElements);
  }
});

var matchRoomsAndGuests = function () {
  var numberOfRooms = parseInt(document.querySelector('#room_number').value, 10);
  var numberOfGuests = parseInt(document.querySelector('#capacity').value, 10);
  var mismatch = '';
  if (numberOfRooms === 1 && numberOfGuests !== 1) {
    mismatch = '1 комната — для 1 гостя';
  } else if (numberOfRooms === 2 && (numberOfGuests !== 1 && numberOfGuests !== 2)) {
    mismatch = '2 комнаты — для 2 гостей или для 1 гостя';
  } else if (numberOfRooms === 3 && numberOfGuests === 0) {
    mismatch = '3 комнаты — для 3 гостей, для 2 гостей или для 1 гостя';
  } else if (numberOfRooms === 100 && numberOfGuests !== 0) {
    mismatch = '100 комнат — не для гостей';
  }
  return mismatch;
};

var postForm = document.querySelector('.ad-form__submit');

postForm.addEventListener('click', function (evt) {
  var target = evt.target;
  var message = matchRoomsAndGuests();

  if (message) {
    target.setCustomValidity(message);
  }
});

fillAddressInput();
