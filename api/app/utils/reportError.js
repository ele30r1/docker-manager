const fs = require('fs');

module.exports = (err) => {
  const timestamp = Date.now();
  const date = new Date(Date.now()).toLocaleString('en-UK', {
    timeZone: 'Asia/Tehran',
  });

  console.error(err.stack);

  fs.appendFileSync(
    './log.txt',
    `------------------- \r\n [date: ${date} | timestamp :${timestamp}]: ${err.stack}\r\n ------------------ \r\n \r\n `,
    'utf-8',
    (error) => console.log(error)
  );
};
