'use strict';

(function () {
  /* Находит форму объявления и кнопки отправки и сброса формы */
  var form = document.querySelector('.ad-form');
  var formSubmit = form.querySelector('.ad-form__submit');
  var formReset = form.querySelector('.ad-form__reset');
  /* Находит все элементы формы, которые недопустны в неактивном состоянии */
  var formDisabledElements = form.querySelectorAll('[disabled]');
  /* Находит select с выбором количества комнат и select с выбором количества гостей */
  var numberOfRoomsSelect = document.querySelector('#room_number');
  var numberOfGuestsSelect = document.querySelector('#capacity');
  /* Находит input для ввода адреса */
  var addressInput = document.querySelector('#address');
  var inputTitle = form.querySelector('#title');
  var inputPrice = form.querySelector('#price');
  var typeOfHouseSelect = form.querySelector('#type');
  var timeInSelect = form.querySelector('#timein');
  var timeOutSelect = form.querySelector('#timeout');

  /* Сопоставляет количество комнат с количеством гостей */
  var matchRoomsAndGuests = function () {
    var numberOfRooms = parseInt(numberOfRoomsSelect.value, 10);
    var numberOfGuests = parseInt(numberOfGuestsSelect.value, 10);
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

  /* Сопоставляет минимальную цену за ночь с типом жилья */
  var matchTypesAndPrice = function () {
    var typeOfHouse = typeOfHouseSelect.value;
    var minPrice = '0';
    if (typeOfHouse === 'flat') {
      minPrice = '1000';
    } else if (typeOfHouse === 'house') {
      minPrice = '5000';
    } else if (typeOfHouse === 'palace') {
      minPrice = '10000';
    }
    return minPrice;
  };

  /* Заполняет поле адреса координатами метки */
  var fillAddressInput = function (obj) {
    addressInput.value = obj.x + ', ' + obj.y;
  };

  /* Удаляет или добавляет атрибут disabled у переданной в параметр коллекции элементов */
  var changeDisabledAttr = function (arr, flag) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].disabled = flag;
    }
  };

  /* Переключает активное и неактивное состояние формы */
  var changeFormStatus = function () {
    form.classList.toggle('ad-form--disabled');
    if (!form.classList.contains('ad-form--disabled')) {
      changeDisabledAttr(formDisabledElements, false);
    } else {
      changeDisabledAttr(formDisabledElements, true);
      form.reset();
    }
    fillAddressInput(window.map.getMainPinPosition());
  };

  /* Изменяет цену за ночь в атрибутах placeholder и min в соответствии с типом жилья */
  var onTypeSelectChange = function () {
    var minPrice = matchTypesAndPrice();
    inputPrice.placeholder = minPrice;
    inputPrice.min = minPrice;
  };

  /* Изменяет время заезда и выезда */
  var onTimeSelectChange = function (evt) {
    if (evt.target === timeInSelect) {
      timeOutSelect.value = timeInSelect.value;
    } else {
      timeInSelect.value = timeOutSelect.value;
    }
  };

  /* Проверяет валидность поля с заголовком объявления */
  inputTitle.addEventListener('change', function () {
    if (inputTitle.validity.valueMissing) {
      inputTitle.setCustomValidity('Обязательное поле. Минимальная длина — 30 символов, максимальная — 100');
    } else if (inputTitle.validity.patternMismatch) {
      inputTitle.setCustomValidity('Минимальная длина — 30 символов, максимальная — 100');
    } else {
      inputTitle.setCustomValidity('');
    }
  });

  /* Обработчик не отправляет форму, если количество комнат не совпадает с доступным количеством гостей */
  formSubmit.addEventListener('click', function () {
    numberOfGuestsSelect.setCustomValidity(matchRoomsAndGuests());
    /* Передаём сообщение об ошибке только в select с выбором количества гостей, так как скорее всего у пользователя
    один объект недвижимости с фиксированным количеством комнат, а не много объектов, поэтому количество комнат с
    высокой вероятностью не изменится, изменится количество гостей */
  });

  var setResetCallback = function (callback) {
    formReset.addEventListener('click', function (evt) {
      evt.preventDefault();
      changeFormStatus();
      callback();
    });
  };

  fillAddressInput(window.map.getMainPinPosition());
  typeOfHouseSelect.addEventListener('change', onTypeSelectChange);
  timeInSelect.addEventListener('change', onTimeSelectChange);
  timeOutSelect.addEventListener('change', onTimeSelectChange);

  window.form = {
    changeFormStatus: changeFormStatus,
    setResetCallback: setResetCallback
  };
})();
