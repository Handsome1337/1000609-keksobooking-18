'use strict';

(function () {
  var IMAGE_TYPES = ['gif', 'jpg', 'jpeg', 'png', 'svg', 'webp'];

  /* Размеры превью фотографий жилья в форме объявления пользователя*/
  var PhotoSize = {
    WIDTH: 70,
    HEIGHT: 70
  };

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
  var avatarChooser = form.querySelector('#avatar');
  var imageChooser = form.querySelector('#images');
  var avatarPreview = form.querySelector('img');
  var imagePreviewContainer = form.querySelector('.ad-form__photo-container');
  var imagePreviewParent = imagePreviewContainer.querySelector('.ad-form__photo');

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

  /* Переключает активное и неактивное состояние формы */
  var changeFormStatus = function (callback) {
    form.classList.toggle('ad-form--disabled');
    if (!form.classList.contains('ad-form--disabled')) {
      window.util.changeDisabledAttr(formDisabledElements, false);
      readImageFile(avatarChooser, avatarPreview);
      readImageFile(imageChooser, imagePreviewContainer);
    } else {
      window.util.changeDisabledAttr(formDisabledElements, true);
      form.reset();
      removePreviews();
    }
    fillAddressInput(callback);
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

  /* Добавляет картинку пользователя или фотографию жилья при загрузке в chooser в блок preview */
  var readImageFile = function (chooser, preview) {

    chooser.addEventListener('change', function () {
      if (preview.tagName !== 'IMG') {
        var previewContainer = preview;
        imagePreviewParent.remove();
      }

      Array.from(chooser.files).forEach(function (file) {
        var fileName = file.name.toLowerCase();
        var matches = IMAGE_TYPES.some(function (type) {
          return fileName.endsWith(type);
        });

        if (matches) {
          var reader = new FileReader();

          reader.addEventListener('load', function (event) {
            if (previewContainer) {
              var previewParent = window.util.createElem('div', 'ad-form__photo');
              var previewPhoto = window.util.createImg('img/muffin-grey.svg', PhotoSize.WIDTH, PhotoSize.HEIGHT, 'Фотография жилья');
              previewPhoto.src = event.target.result;
              previewParent.appendChild(previewPhoto);
              previewContainer.appendChild(previewParent);
            } else {
              preview.src = reader.result;
            }
          });
          reader.readAsDataURL(file);

        }
      });
    });
  };

  /* Удаляет превью изображений при переключении состояния формы формы */
  var removePreviews = function () {
    avatarPreview.src = 'img/muffin-grey.svg';
    imagePreviewContainer.querySelectorAll('.ad-form__photo').forEach(function (item) {
      item.remove();
    });
    imagePreviewContainer.appendChild(imagePreviewParent);
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

  var setSubmitCallback = function (submitCallback) {
    form.addEventListener('submit', function (evt) {
      submitCallback(form);
      evt.preventDefault();
    });
  };

  var setResetCallback = function (callback) {
    formReset.addEventListener('click', function (evt) {
      evt.preventDefault();
      callback();
    });
  };

  typeOfHouseSelect.addEventListener('change', onTypeSelectChange);
  timeInSelect.addEventListener('change', onTimeSelectChange);
  timeOutSelect.addEventListener('change', onTimeSelectChange);

  window.form = {
    changeFormStatus: changeFormStatus,
    fillAddressInput: fillAddressInput,
    setSubmitCallback: setSubmitCallback,
    setResetCallback: setResetCallback
  };
})();
