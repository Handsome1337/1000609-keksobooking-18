'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;

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

  /* Если событие произошло при нажатии на клавишу Enter, выполняет функцию, передаваемую вторым параметром */
  var isEnterEvent = function (evt, action) {
    if (evt.keyCode === ENTER_KEYCODE) {
      action();
    }
  };

  /* Если событие произошло при нажатии на клавишу ESC, выполняет функцию, передаваемую вторым параметром */
  var isEscEvent = function (evt, action) {
    if (evt.keyCode === ESC_KEYCODE) {
      action();
    }
  };

  window.util = {
    ENTER_KEYCODE: ENTER_KEYCODE,
    ESC_KEYCODE: ESC_KEYCODE,
    getRandomInt: getRandomInt,
    getRandomArrElem: getRandomArrElem,
    getShuffledArr: getShuffledArr,
    createElem: createElem,
    createImg: createImg,
    isEnterEvent: isEnterEvent,
    isEscEvent: isEscEvent
  };
})();
