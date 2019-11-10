'use strict';

(function () {
  var IMAGE_TYPES = ['gif', 'jpg', 'jpeg', 'png', 'svg', 'webp'];

  /* Размеры превью фотографий жилья в форме объявления пользователя*/
  var PhotoSize = {
    WIDTH: 70,
    HEIGHT: 70
  };

  /* Сопоставление минимальной цены за ночь с типом жилья */
  var typeToPrice = {
    bungalo: '0',
    flat: '1000',
    house: '5000',
    palace: '10000'
  };

  /* Сопоставление количества комнат с количеством доступных гостей */
  var roomsToGuests = {
    1: ['1'],
    2: ['1', '2'],
    3: ['1', '2', '3'],
    100: ['0']
  };

  /* Несоответствие количества комнат количеству гостей */
  var roomsToMismatch = {
    1: '1 комната — для 1 гостя',
    2: '2 комнаты — для 2 гостей или для 1 гостя',
    3: '3 комнаты — для 3 гостей, для 2 гостей или для 1 гостя',
    100: '100 комнат — не для гостей'
  };

  /* Находит форму объявления и кнопки отправки и сброса формы */
  var form = document.querySelector('.ad-form');
  /* Находит все инпуты и селекты формы */
  var formInputsAndSelects = form.querySelectorAll('input, select');
  var formSubmit = form.querySelector('.ad-form__submit');
  var formReset = form.querySelector('.ad-form__reset');
  /* Находит все элементы формы, которые недопустны в неактивном состоянии */
  var formDisabledItems = form.querySelectorAll('[disabled]');
  /* Находит select с выбором количества комнат и select с выбором количества гостей */
  var numberOfRoomsSelect = form.querySelector('#room_number');
  var numberOfGuestsSelect = form.querySelector('#capacity');
  /* Находит input для ввода адреса */
  var addressInput = form.querySelector('#address');
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
    /* Записывает несоответствие для выбранного количества комнат */
    var mismatch = roomsToMismatch[numberOfRoomsSelect.value];
    /* Проверяет, есть ли соответствие */
    return roomsToGuests[numberOfRoomsSelect.value].includes(numberOfGuestsSelect.value) ? '' : mismatch;
  };

  /* Заполняет поле адреса координатами метки */
  var fillAddressInput = function (obj) {
    addressInput.value = obj.x + ', ' + obj.y;
  };

  /* Переключает активное и неактивное состояние формы */
  var changeFormStatus = function (callback) {
    form.classList.toggle('ad-form--disabled');
    if (!form.classList.contains('ad-form--disabled')) {
      window.util.changeDisabledAttr(formDisabledItems, false);
    } else {
      window.util.changeDisabledAttr(formDisabledItems, true);
      form.reset();
      removePreviews();
    }
    fillAddressInput(callback);
  };

  /* Изменяет цену за ночь в атрибутах placeholder и min в соответствии с типом жилья */
  var onTypeSelectChange = function () {
    var minPrice = typeToPrice[typeOfHouseSelect.value];
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

      Array.from(chooser.files).forEach(function (file) {
        var fileName = file.name.toLowerCase();
        var matches = IMAGE_TYPES.some(function (type) {
          return fileName.endsWith(type);
        });

        if (matches) {
          var reader = new FileReader();

          reader.addEventListener('load', function (event) {
            if (preview.tagName !== 'IMG') {
              var previewParent = window.util.createElem('div', 'ad-form__photo');
              var previewPhoto = window.util.createImg('img/muffin-grey.svg', PhotoSize.WIDTH, PhotoSize.HEIGHT, 'Фотография жилья');
              previewPhoto.src = event.target.result;
              imagePreviewParent.remove();
              previewParent.appendChild(previewPhoto);
              preview.appendChild(previewParent);
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

    /* Подсвечивает неверно заполненные поля красной рамкой */
    formInputsAndSelects.forEach(function (item) {
      if (item.validity.valid) {
        item.removeAttribute('style');
      } else {
        item.style.boxShadow = '0 0 3px 3px red';
      }
    });
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
      formInputsAndSelects.forEach(function (item) {
        item.removeAttribute('style');
      });
      callback();
    });
  };

  readImageFile(avatarChooser, avatarPreview);
  readImageFile(imageChooser, imagePreviewContainer);
  typeOfHouseSelect.addEventListener('change', onTypeSelectChange);
  timeInSelect.addEventListener('change', onTimeSelectChange);
  timeOutSelect.addEventListener('change', onTimeSelectChange);

  window.form = {
    changeStatus: changeFormStatus,
    fillAddressInput: fillAddressInput,
    setSubmitCallback: setSubmitCallback,
    setResetCallback: setResetCallback
  };
})();
