const Webdriver = require('selenium-webdriver');

let saucelabs;
const username = process.env.SAUCE_USERNAME;
const accessKey = process.env.SAUCE_ACCESS_KEY;

if (process.env.SELENIUM_SERVER) {
  // when using a custom selenium server, mock out saucelabs
  saucelabs = { updateJob: function (a, b, cb) { cb(); } };
} else {
  const SauceLabs = require('saucelabs');

  saucelabs = new SauceLabs({
    username: username,
    password: accessKey
  });

  process.env.SELENIUM_SERVER = `http://${username}:${accessKey}@ondemand.saucelabs.com/wd/hub`;
}

exports.saucelabs = saucelabs;

exports.JSPERF_HOST = process.env.JSPERF_HOST || 'http://localhost:3000';

exports.build = function () {
  return new Webdriver.Builder()
    .withCapabilities({
      browserName: 'chrome',
      username,
      accessKey,
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
      build: process.env.TRAVIS_BUILD_NUMBER
    })
    .usingServer(process.env.SELENIUM_SERVER)
    .build();
};