'use strict';

(function () {
  /* Формирует xhr-объект */
  var createXhr = function (method, url, onSuccess, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 10000; // 10s

    xhr.open(method, url);
    if (data) {
      xhr.send(data);
    } else {
      xhr.send();
    }

    xhr.addEventListener('load', function () {
      if (xhr.statuss === 200 && data) {
        onSuccess();
      } else if (xhr.status === 200) {
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
