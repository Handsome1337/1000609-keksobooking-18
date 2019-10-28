'use strict';

(function () {
  var postCard = null;

  /* Словарь типов жилья */
  var typeMap = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };

  /* Создаёт коллекцию фотографий жилья */
  var createAlbum = function (arr) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < arr.length; i++) {
      var photo = window.util.createImg(arr[i], 45, 40, 'Фотография жилья', 'popup__photo');
      fragment.appendChild(photo);
    }

    return fragment;
  };

  /* Создаёт коллекцию опций */
  var createFeatures = function (arr) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < arr.length; i++) {
      var feature = window.util.createElem('li', 'popup__feature popup__feature--' + arr[i]);
      fragment.appendChild(feature);
    }

    return fragment;
  };

  /* Заполняет данные карточки объявления */
  var createCard = function (obj) {
    var defaultCard = document.querySelector('#card').content.querySelector('.map__card');
    postCard = defaultCard.cloneNode(true);
    /* Ищет кнопку закрытия карточки */
    var cardClose = postCard.querySelector('.popup__close');
    /* Находит блок для фотографий */
    var album = postCard.querySelector('.popup__photos');
    /* Очищает содержимое блока для фотографий */
    album.textContent = '';
    /* Находит блок для списка опций */
    var featuresList = postCard.querySelector('.popup__features');
    /* Очищает содержимое блока для списка опций */
    featuresList.textContent = '';

    postCard.querySelector('.popup__title').textContent = obj.offer.title;
    postCard.querySelector('.popup__text--address').textContent = obj.offer.address;
    postCard.querySelector('.popup__text--price').textContent = obj.offer.price + '₽/ночь';
    postCard.querySelector('.popup__type').textContent = typeMap[obj.offer.type];
    postCard.querySelector('.popup__text--capacity').textContent = obj.offer.rooms + ' комнаты для ' + obj.offer.guests + ' гостей';
    postCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + obj.offer.checkin + ', выезд до ' + obj.offer.checkout;
    featuresList.appendChild(createFeatures(obj.offer.features));
    postCard.querySelector('.popup__description').textContent = obj.offer.description;
    album.appendChild(createAlbum(obj.offer.photos));
    postCard.querySelector('.popup__avatar').setAttribute('src', obj.author.avatar);

    /* Закрывает карточку */
    cardClose.addEventListener('click', onCardCloseClick);
    document.addEventListener('keydown', onCardEscPress);
    return postCard;
  };

  /* Удаляет карточку объявления и деактивирует его метку */
  var removeCard = function () {
    var postPin = window.map.isThereActivePin();
    if (postCard) {
      postCard.remove();
    }
    if (postPin) {
      postPin.classList.remove('map__pin--active');
    }
    document.removeEventListener('keydown', onCardEscPress);
  };

  /* Удаляет карточку при нажатии на кнопку закрытия карточки */
  var onCardCloseClick = function () {
    removeCard();
  };

  /* Удаляет карточку при нажатии на клавишу ESC */
  var onCardEscPress = function (evt) {
    window.util.isEscEvent(evt, removeCard);
  };

  window.card = {
    createCard: createCard,
    removeCard: removeCard
  };
})();
