"use strict";
/**** efw5.X Copyright 2025 efwGrp ****/
/**
 * The class to send mail.
 * 
 * @author Chang Kejun
 */
class EfwServerMail extends Debuggable{
	/**
	 * The function to send mail.
	 * 
	 * @param {String}
	 *            groupId: required<br>
	 * @param {String}
	 *            mailId: required<br>
	 * @param {Object}
	 *            params: required<br>
	 *            {param1:value1,param2:value2,...}<br>
	 */
	static send (groupId, mailId, params) {
		let hashMapParams = new java.util.HashMap();
		for ( let key in params) {
			let vl = "" + params[key];
			hashMapParams.put(key, vl);
		}
		Packages.efw.mail.MailManager.send(groupId, mailId, hashMapParams);
	}
}
///////////////////////////////////////////////////////////////////////////////
const mail = EfwServerMail;
