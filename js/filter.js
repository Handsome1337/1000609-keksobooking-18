'use strict';

(function () {
  /* Максимальное количество отображаемых меток */
  var MAX_PINS_QUANTITY = 5;

  /* Переходные цены в фильтре цены */
  var Price = {
    INFINITY: Infinity,
    TOP: 50000,
    MIDDLE: 10000,
    BOTTOM: 0
  };

  var filtersForm = document.querySelector('.map__filters');
  var disabledFilters = filtersForm.querySelectorAll('[disabled]');
  var housingType = filtersForm.querySelector('#housing-type');
  var housingPrice = filtersForm.querySelector('#housing-price');
  var housingRoom = filtersForm.querySelector('#housing-rooms');
  var housingGuest = filtersForm.querySelector('#housing-guests');
  var housingFeatures = Array.from(filtersForm.querySelectorAll('.map__checkbox'));

  /* Активирует/деактивирует фильтры */
  var changeFiltersStatus = function (flag) {
    window.util.changeDisabledAttr(disabledFilters, flag);
    if (flag) {
      filtersForm.reset();
    }
  };

  /* Сравнивает цену объявления с минимальным и максимальным значениями фильтра по цене */
  var comparePrice = function (price, min, max) {
    return price >= min && price <= max;
  };

  /* Фильтрует количество отображаемых элементов на карте */
  var filterQuantity = function (arr) {
    return arr.slice(0, MAX_PINS_QUANTITY);
  };

  /* Фильтрует по типу жилья */
  var filterHousingType = function (offer) {
    return housingType.value === 'any' || offer.offer.type === housingType.value;
  };

  /* Фильтрует по цене */
  var filterHousingPrice = function (offer) {
    return housingPrice.value === 'any' ||
     housingPrice.value === 'middle' && comparePrice(offer.offer.price, Price.MIDDLE, Price.TOP) ||
     housingPrice.value === 'low' && comparePrice(offer.offer.price, Price.BOTTOM, Price.MIDDLE) ||
     housingPrice.value === 'high' && comparePrice(offer.offer.price, Price.TOP, Price.INFINITY);
  };

  /* Фильтрует по количеству комнат */
  var filterHousingRooms = function (offer) {
    return housingRoom.value === 'any' || offer.offer.rooms === parseInt(housingRoom.value, 10);
  };

  /* Фильтрует по количеству гостей */
  var filterHousingGuests = function (offer) {
    return housingGuest.value === 'any' || offer.offer.guests === parseInt(housingGuest.value, 10);
  };

  /* Фильтрует по доступным опциям */
  var filterFeatures = function (offer) {
    var activeHousingFeatures = housingFeatures.filter(function (feature) {
      return feature.checked;
    });
    return activeHousingFeatures.every(function (feature) {
      return offer.offer.features.indexOf(feature.value) !== -1;
    });
  };

  /* Фильтрует объявления по всем фильтрам */
  var filterPosts = function (posts) {
    return filterQuantity(posts.filter(function (post) {
      return filterHousingType(post) && filterHousingPrice(post) && filterFeatures(post) && filterHousingRooms(post) && filterHousingGuests(post);
    }));
  };

  /* Заполняет карту в соответствии со всеми фильтрами */
  var setFilterOffersCallback = function (data, callback) {
    var callbackWidthDelay = window.util.debounce(function () {
      callback(filterPosts(data));
    });
    filtersForm.addEventListener('change', function () {
      callbackWidthDelay();
    });
    callback(filterPosts(data));
    changeFiltersStatus(false);
  };

  window.filter = {
    changeStatus: changeFiltersStatus,
    setOffersCallback: setFilterOffersCallback
  };
})();
