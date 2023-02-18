const fs = require('fs');
const http = require('http');
const catchAsync = require('../../../../utils/catchAsync');
const AppError = require('../../../../utils/appError');

exports.index = catchAsync(async (req, res, next) => {
  const options = {
    socketPath: '/var/run/docker.sock',
    path: 'http://localhost/v1.41/images/json',
  };

  const callback = (dockerApiRes) => {
    dockerApiRes.setEncoding('utf8');
    dockerApiRes.on('data', (data) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        status: 'success',
        data: {
          images: JSON.parse(data),
        },
      });
    });
    dockerApiRes.on('error', (data) => console.error(data));
  };

  const clientRequest = http.request(options, callback);
  clientRequest.end();
});
exports.search = catchAsync(async (req, res, next) => {
  const term = req.query.term;
  const searchResolver = function () {
    return new Promise(function (resolve, reject) {
      const requestObj = http.request(
        {
          socketPath: '/var/run/docker.sock',
          path: `http://localhost/v1.41/images/search?term=${term}&limit=10`,
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
  const statsResult = await searchResolver();

  res.status(200).json({
    status: 'success',
    data: statsResult,
  });
});

exports.create = catchAsync(async (req, res, next) => {
  const createResolver = function () {
    return new Promise(function (resolve, reject) {
      const requestObj = http.request(
        {
          method: 'POST',
          socketPath: '/var/run/docker.sock',
          path: `http://localhost/v1.41/images/create?fromImage=${req.params.image}&tag=latest`,
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
  const result = await createResolver();

  res.status(200).json({
    status: 'success',
    data: result,
  });
});

// exports.aboutUs = catchAsync(async (req, res, next) => {
//   let cached = await pageCache.get('about-us');

//   if (!cached) {
//     console.log('caching "about-us"...');
//     const abputUsHtml = fs.readFileSync(
//       `${__dirname}/../views/about-us.html`,
//       'utf-8'
//     );
//     await pageCache.set('about-us', abputUsHtml);
//     cached = abputUsHtml;
//   }

//   res.end(cached);
// });

// exports.privacy = catchAsync(async (req, res, next) => {
//   let cached = await pageCache.get('privacy');

//   if (!cached) {
//     console.log('caching "privacy"...');
//     const privacyHtml = fs.readFileSync(
//       `${__dirname}/../views/privacy.html`,
//       'utf-8'
//     );
//     await pageCache.set('privacy', privacyHtml);
//     cached = privacyHtml;
//   }

//   res.end(cached);
// });

// exports.show = catchAsync(async (req, res, next) => {
//   if (req.params.id > 10) {
//     return next(new AppError('No test found with that id', 404));
//   }

//   await client.set('name', 'sirwan');
//   res.status(200).send({
//     stats: 'success',
//   });
// });
