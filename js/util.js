'use strict';

(function () {
  var DEBOUNCE_DURATION = 500; // полсекунды

  var KeyCode = {
    ENTER: 13,
    ESC: 27
  };

  /* Создает новый элемент с заданным атрибутом class */
  var createElem = function (elemName, elemClass) {
    var newElement = document.createElement(elemName);
    if (elemClass) {
      newElement.className = elemClass;
    }
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

  /* Удаляет или добавляет атрибут disabled у переданной в параметр коллекции элементов */
  var changeDisabledAttr = function (arr, flag) {
    arr.forEach(function (item) {
      item.disabled = flag;
    });
  };

  /* Если событие произошло при нажатии на клавишу Enter, выполняет функцию, передаваемую вторым параметром */
  var isEnterEvent = function (evt, action) {
    if (evt.keyCode === KeyCode.ENTER) {
      action();
    }
  };

  /* Если событие произошло при нажатии на клавишу ESC, выполняет функцию, передаваемую вторым параметром */
  var isEscEvent = function (evt, action) {
    if (evt.keyCode === KeyCode.ESC) {
      action();
    }
  };

  /* Устранение дребезга */
  var debounce = function (callback) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        callback.apply(null, parameters);
      }, DEBOUNCE_DURATION);
    };
  };

  window.util = {
    createElem: createElem,
    createImg: createImg,
    changeDisabledAttr: changeDisabledAttr,
    isEnterEvent: isEnterEvent,
    isEscEvent: isEscEvent,
    debounce: debounce
  };
})();
