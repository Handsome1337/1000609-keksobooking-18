'use strict';

(function () {
  /* Максимальное количество отображаемых меток */
  var MAX_PINS_QUANTITY = 5;
  var DEBOUNCE_DURATION = 500; // полсекунды

  var filtersForm = document.querySelector('.map__filters');
  var disabledFilters = filtersForm.querySelectorAll('[disabled]');
  var housingType = filtersForm.querySelector('#housing-type');
  var housingPrice = filtersForm.querySelector('#housing-price');
  var housingRoom = filtersForm.querySelector('#housing-rooms');
  var housingGuest = filtersForm.querySelector('#housing-guests');
  var activeHousingFeatures = null;
  var lastTimeout = null;

  /* Переходные цены в фильтре цены */
  var Price = {
    INFINITY: Infinity,
    TOP: 50000,
    MIDDLE: 10000,
    BOTTOM: 0
  };

  /* Активирует/деактивирует фильтры */
  var changeFiltersStatus = function (flag) {
    window.util.changeDisabledAttr(disabledFilters, flag);
    if (flag) {
      filtersForm.reset();
    }
  };

  /* Сравнивает цену объявления с минимальным и максимальным значениями фильтра по цене */
  var comparePrice = function (price, min, max) {
    if (price >= min && price <= max) {
      return price;
    } else {
      return false;
    }
  };

  /* Фильтрует количество отображаемых элементов на карте */
  var filterQuantity = function (arr) {
    return arr.slice(0, MAX_PINS_QUANTITY);
  };

  /* Фильтрует по типу жилья */
  var filterHousingType = function (offers) {
    return offers.filter(function (offer) {
      if (housingType.value === 'any') {
        return offer;
      } else {
        return offer.offer.type === housingType.value;
      }
    });
  };

  /* Фильтрует по цене */
  var filterHousingPrice = function (offers) {
    return offers.filter(function (offer) {
      if (housingPrice.value === 'any') {
        return offer;
      } else if (housingPrice.value === 'middle') {
        return comparePrice(offer.offer.price, Price.MIDDLE, Price.TOP);
      } else if (housingPrice.value === 'low') {
        return comparePrice(offer.offer.price, Price.BOTTOM, Price.MIDDLE);
      } else {
        return comparePrice(offer.offer.price, Price.TOP, Price.INFINITY);
      }
    });
  };

  /* Фильтрует по количеству комнат */
  var filterHousingRooms = function (offers) {
    return offers.filter(function (offer) {
      if (housingRoom.value === 'any') {
        return offer;
      } else {
        return offer.offer.rooms === parseInt(housingRoom.value, 10);
      }
    });
  };

  /* Фильтрует по количеству гостей */
  var filterHousingGuests = function (offers) {
    return offers.filter(function (offer) {
      if (housingGuest.value === 'any') {
        return offer;
      } else {
        return offer.offer.guests === parseInt(housingGuest.value, 10);
      }
    });
  };

  /* Фильтрует по доступным опциям */
  var filterFeatures = function (offers) {
    activeHousingFeatures = Array.from(filtersForm.querySelectorAll('.map__checkbox:checked')).map(function (feature) {
      return feature.value;
    });
    return offers.filter(function (offer) {
      return activeHousingFeatures.every(function (feature) {
        return offer.offer.features.indexOf(feature) !== -1;
      });
    });
  };

  /* Фильтрует объявления по всем фильтрам */
  var filterPosts = function (posts) {
    return filterQuantity(filterHousingGuests(filterHousingRooms(filterFeatures(filterHousingPrice(filterHousingType(posts))))));
  };

  /* Заполняет карту в соответствии со всеми фильтрами */
  var setFilterOffersCallback = function (data, callback) {
    filtersForm.addEventListener('change', function () {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        callback(filterPosts(data));
      }, DEBOUNCE_DURATION);
    });
    callback(filterPosts(data));
    changeFiltersStatus(false);
  };

  window.filter = {
    changeFiltersStatus: changeFiltersStatus,
    setFilterOffersCallback: setFilterOffersCallback
  };
})();
