"use strict";
/**** efw5.X Copyright 2025 efwGrp ****/
/**
 * The class to operate cookie.
 * 
 * @author Chang Kejun
 */
class EfwServerCookie extends Debuggable{
	/**
	 * The function to get data from cookie.
	 * 
	 * @param {String}
	 *            key: the cookie key.
	 * @returns {String}
	 */
	static get(key) {
		let value=Packages.efw.cookie.CookieManager.get(key);
		if (value == null) {
			value = null;
		} else {
			value = "" + value;
		}
		return value;
	}
	/**
	 * The function to set data in cookie.
	 * 
	 * @param {String}
	 *            key: the cookie key.
	 * @param {String}
	 *            value: the data you want to set in cookie.
	 */
	static set(key, value) {
		Packages.efw.cookie.CookieManager.set(key, ""+value);
	}
}
///////////////////////////////////////////////////////////////////////////////
const cookie = EfwServerCookie;
