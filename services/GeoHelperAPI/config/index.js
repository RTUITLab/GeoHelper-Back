//
//
//	File:	index.js
//
//	By:		Ivan Laptev <ivlaptev13@ya.ru>
//
//	Created:	2020-06-06 16:41:42
//	Updated:	2020-08-16 22:37:35
//
//

/*
 * Description:
 * Configuration of application.
 */

const M_USER = process.env.M_USER,
			M_PASS = process.env.M_PASS,
			M_HOST = process.env.M_HOST,
			M_PORT = process.env.M_PORT,
			M_DB = process.env.M_DB

const url = process.env.M_URL || `mongodb://${M_USER}:${M_PASS}@${M_HOST}:${M_PORT}/${M_DB}?authSource=admin`;

console.log(url);

module.exports = {
	secret: process.env.M_SECRET,
	session: { session: false },
	database: url
}
