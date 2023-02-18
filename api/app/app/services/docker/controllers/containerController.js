const fs = require('fs');
const http = require('http');
const { promisify } = require('util');
const catchAsync = require('../../../../utils/catchAsync');
const AppError = require('../../../../utils/appError');

exports.index = catchAsync(async (req, res, next) => {
  // const options = {
  //   socketPath: '/var/run/docker.sock',
  //   path: 'http://localhost/v1.41/containers/json?all=true',
  // };

  // const callback = (dockerApiRes) => {
  //   dockerApiRes.setEncoding('utf8');
  //   dockerApiRes.on('data', (data) => {
  //     res.status(200).json({
  //       status: 'success',
  //       data: {
  //         containers: JSON.parse(data),
  //       },
  //     });
  //   });
  //   dockerApiRes.on('error', (data) => console.error(data));
  // };

  // const clientRequest = http.request(options, callback);

  // clientRequest.end();

  const resolver = function () {
    return new Promise(function (resolve, reject) {
      const requestObj = http.request(
        {
          socketPath: '/var/run/docker.sock',
          path: 'http://localhost/v1.41/containers/json?all=true',
        },
        function (dockerApiRes) {
          // reject on bad status
          if (dockerApiRes.statusCode < 200 || dockerApiRes.statusCode >= 300) {
            return reject(new Error('statusCode=' + dockerApiRes.statusCode));
          }

          // return on end
          dockerApiRes.on('data', function (data) {
            resolve(JSON.parse(data));
          });
        }
      );
      requestObj.on('err', (err) => reject(err));
      // if (postData) {
      //   requestObj.write(postData);
      // }
      requestObj.end();
    });
  };

  const result = await resolver();

  res.status(200).json({
    status: 'success',
    data: {
      containers: result,
    },
  });
});

exports.get = catchAsync(async (req, res, next) => {
  // const options = {
  //   socketPath: '/var/run/docker.sock',
  //   path: `http://localhost/v1.41/containers/${req.params.containerId}/json`,
  // };

  // const callback = (dockerApiRes) => {
  //   dockerApiRes.setEncoding('utf8');
  //   dockerApiRes.on('data', (data) => {
  //     res.status(200).json({
  //       status: 'success',
  //       data: {
  //         containers: JSON.parse(data),
  //       },
  //     });
  //   });
  //   dockerApiRes.on('error', (data) => console.error(data));
  // };

  // const clientRequest = http.request(options, callback);
  // clientRequest.end();

  const containerResolver = function () {
    return new Promise(function (resolve, reject) {
      const requestObj = http.request(
        {
          socketPath: '/var/run/docker.sock',
          path: `http://localhost/v1.41/containers/${req.params.containerId}/json`,
        },
        function (dockerApiRes) {
          // reject on bad status
          if (dockerApiRes.statusCode < 200 || dockerApiRes.statusCode >= 300) {
            return reject(new Error('statusCode=' + dockerApiRes.statusCode));
          }

          // return on end
          dockerApiRes.on('data', function (data) {
            resolve(JSON.parse(data));
          });
        }
      );
      requestObj.on('err', (err) => reject(err));
      // if (postData) {
      //   requestObj.write(postData);
      // }
      requestObj.end();
    });
  };
  const containerResult = await containerResolver();

  //top
  const needTop = req.query.top;
  const containerTopResolver = function () {
    return new Promise(function (resolve, reject) {
      const requestObj = http.request(
        {
          socketPath: '/var/run/docker.sock',
          path: `http://localhost/v1.41/containers/${req.params.containerId}/top`,
        },
        function (dockerApiRes) {
          // reject on bad status
          if (dockerApiRes.statusCode < 200 || dockerApiRes.statusCode >= 300) {
            console.log(dockerApiRes);
            return reject(
              new Error(
                `statusCode=${dockerApiRes.statusCode} | message: ${dockerApiRes.statusMessage}`
              )
            );
          }

          // return on end
          dockerApiRes.on('data', function (data) {
            resolve(JSON.parse(data));
          });
        }
      );
      requestObj.on('err', (err) => reject(err));
      // if (postData) {
      //   requestObj.write(postData);
      // }
      requestObj.end();
    });
  };

  let containerTopResult = [];

  if (
    needTop &&
    needTop === 'true' &&
    containerResult.State.Status === 'running'
  ) {
    containerTopResult = await containerTopResolver();
  }

  res.status(200).json({
    status: 'success',
    data: {
      container: containerResult,
      top: containerTopResult,
    },
  });
});

exports.getStats = catchAsync(async (req, res, next) => {
  const containerStatsResolver = function () {
    return new Promise(function (resolve, reject) {
      const requestObj = http.request(
        {
          socketPath: '/var/run/docker.sock',
          path: `http://localhost/v1.41/containers/${req.params.containerId}/stats?stream=false&one-shot=true`,
        },
        function (dockerApiRes) {
          // reject on bad status
          if (dockerApiRes.statusCode < 200 || dockerApiRes.statusCode >= 300) {
            return reject(new Error('statusCode=' + dockerApiRes.statusCode));
          }

          // return on end
          dockerApiRes.on('data', function (data) {
            resolve(JSON.parse(data));
          });
        }
      );
      requestObj.on('err', (err) => reject(err));
      // if (postData) {
      //   requestObj.write(postData);
      // }
      requestObj.end();
    });
  };
  const statsResult = await containerStatsResolver();

  res.status(200).json({
    status: 'success',
    data: statsResult,
  });
});

exports.action = catchAsync(async (req, res, next) => {
  const action = req.params.action;

  if (
    !action ||
    !['stop', 'start', 'restart', 'pause', 'unpause'].includes(action)
  ) {
    res.status(400).json({
      status: 'Bad Request',
    });
    return;
  }

  const actionResolver = function (action) {
    return new Promise(function (resolve, reject) {
      const requestObj = http.request(
        {
          method: 'POST',
          socketPath: '/var/run/docker.sock',
          path: `http://localhost/v1.41/containers/${req.params.containerId}/${action}`,
        },
        function (dockerApiRes) {
          // reject on bad status
          if (dockerApiRes.statusCode < 200 || dockerApiRes.statusCode >= 300) {
            return reject(
              new Error(
                `statusCode=${dockerApiRes.statusCode} | message: ${dockerApiRes.statusMessage}`
              )
            );
          }

          if (dockerApiRes.statusCode === 204) {
            resolve(true);
          }

          return reject(new Error(`statusCode=500 | message: server error`));
        }
      );
      requestObj.on('err', (err) => {
        reject(err);
      });

      requestObj.end();
    });
  };
  const actionResult = await actionResolver(action);

  res.status(200).json({
    status: 'success',
    data: {
      result: actionResult,
    },
  });
});

exports.commit = catchAsync(async (req, res, next) => {
  const containerId = req.params.container;
  const repo = req.params.repo;
  const tag = req.params.tag;

  const commitResolver = function () {
    return new Promise(function (resolve, reject) {
      const requestObj = http.request(
        {
          method: 'POST',
          socketPath: '/var/run/docker.sock',
          path: `http://localhost/v1.41/commit?container=${containerId}&repo=${repo}&tag=${tag}`,
        },
        function (dockerApiRes) {
          // reject on bad status
          if (dockerApiRes.statusCode < 200 || dockerApiRes.statusCode >= 300) {
            return reject(
              new Error(
                `statusCode=${dockerApiRes.statusCode} | message: ${dockerApiRes.statusMessage}`
              )
            );
          }

          if (dockerApiRes.statusCode === 201) {
            resolve(true);
          }

          return reject(new Error(`statusCode=500 | message: server error`));
        }
      );
      requestObj.on('err', (err) => {
        reject(err);
      });

      requestObj.end();
    });
  };
  const commitResult = await commitResolver();

  res.status(200).json({
    status: 'success',
    data: {
      result: commitResult,
    },
  });
});
