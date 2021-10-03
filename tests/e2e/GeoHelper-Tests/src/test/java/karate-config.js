function fn() {
  var env = karate.env; // get system property 'karate.env'
  karate.log('karate.env system property was:', env);
  if (!env) {
    env = 'dev';
  }
  var config = {
    env: env,
    baseUrl: 'http://localhost:3002/api/v1'
  }
  if (env == 'dev') {
    // customize
    // e.g. config.foo = 'bar';
  } else if (env == 'e2e') {
    // customize
  }

  // Setting access token
  config.accessToken = 'Bearer ' + karate.callSingle('classpath:geohelper/users.feature', config).token;
//  config.accessToken = 'Bearer ';

  return config;
}