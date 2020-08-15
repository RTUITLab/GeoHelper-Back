require('module-alias/register');
const http = require('http'),
			GeoHelperAPI = require('@GeoHelperAPI'),
			GeoHelperServer = http.Server(GeoHelperAPI),
			GeoHelperWS = require('@GeoHelperWS')(GeoHelperServer),
			GeoHelperPORT = process.env.PORT || 3002,
			LOCAL = '0.0.0.0';

GeoHelperServer.listen(GeoHelperPORT, LOCAL, () => {
	console.log(`GeoHelperAPI running on ${GeoHelperPORT}`)
});
