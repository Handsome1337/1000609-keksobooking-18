'use strict';

(function () {
  /* Перечисление параметров фотографий жилья */
  var Photo = {
    WIDTH: 45,
    HEIGHT: 40
  };

  var postCard = null;
  var closeCallback = null;

  /* Словарь типов жилья */
  var typeMap = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  /* Создаёт коллекцию фотографий жилья */
  var createAlbum = function (arr) {
    var fragment = document.createDocumentFragment();

    arr.forEach(function (item) {
      var photo = window.util.createImg(item, Photo.WIDTH, Photo.HEIGHT, 'Фотография жилья', 'popup__photo');
      fragment.appendChild(photo);
    });

    return fragment;
  };

  /* Создаёт коллекцию опций */
  var createFeatures = function (arr) {
    var fragment = document.createDocumentFragment();

    arr.forEach(function (item) {
      var feature = window.util.createElem('li', 'popup__feature popup__feature--' + item);
      fragment.appendChild(feature);
    });

    return fragment;
  };

  /* Заполняет данные карточки объявления */
  var createCard = function (obj, callback) {
    closeCallback = callback;
    var defaultCard = document.querySelector('#card').content.querySelector('.map__card');
    postCard = defaultCard.cloneNode(true);
    var cardItems = postCard.querySelectorAll(':not(img)');
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

    cardItems.forEach(function (elem) {
      if (!elem.innerHTML) {
        elem.remove();
      }
    });

    /* Закрывает карточку */
    cardClose.addEventListener('click', onCardCloseClick);
    document.addEventListener('keydown', onCardEscPress);
    return postCard;
  };

  /* Удаляет карточку объявления и деактивирует его метку */
  var removeCard = function () {
    if (postCard) {
      postCard.remove();
    }
    if (closeCallback) {
      closeCallback();
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
    create: createCard,
    remove: removeCard
  };
})();
