'use strict';

(function () {
  var SUCCESS_CODE = 200;
  var TIMEOUT_DURATION = 10000; // 10s

  /* Формирует xhr-объект */
  var createXhr = function (method, url, onSuccess, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT_DURATION; // 10s

    xhr.open(method, url);
    if (data) {
      xhr.send(data);
    } else {
      xhr.send();
    }

    xhr.addEventListener('load', function () {
      if (xhr.statuss === SUCCESS_CODE && data) {
        onSuccess();
      } else if (xhr.status === SUCCESS_CODE) {
        onSuccess(xhr.response);
      } else {
        onError();
      }
    });

    xhr.addEventListener('error', function () {
      onError();
    });

    xhr.addEventListener('timeout', function () {
      onError();
    });
  };

  /* Загружает данные с сервера */
  var load = function (onSuccess, onError) {
    createXhr('GET', 'https://js.dump.academy/keksobooking/data', onSuccess, onError);
  };

  /* Загружает данные на сервер */
  var upload = function (data, onSuccess, onError) {
    createXhr('POST', 'https://js.dump.academy/keksobooking', onSuccess, onError, data);
  };

  window.server = {
    load: load,
    upload: upload
  };
})();
