'use strict';

(function () {
  /* Максимальное количество отображаемых меток */
  var MAX_PINS_QUANTITY = 5;

  var filtersForm = document.querySelector('.map__filters');
  var disabledFilters = filtersForm.querySelectorAll('[disabled]');
  var housingType = filtersForm.querySelector('#housing-type');

  var changeFiltersStatus = function (flag) {
    window.util.changeDisabledAttr(disabledFilters, flag);
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

  /* Заполняет карту в соответствии со всеми фильтрами */
  var setFilterOffersCallback = function (data, removeCardCallback, fillMapCallback) {
    var offers = data;
    housingType.addEventListener('change', function () {
      removeCardCallback();
      fillMapCallback(filterQuantity(filterHousingType(offers)));
    });
    fillMapCallback(filterQuantity(filterHousingType(offers)));
  };

  window.filter = {
    changeFiltersStatus: changeFiltersStatus,
    setFilterOffersCallback: setFilterOffersCallback
  };
})();
