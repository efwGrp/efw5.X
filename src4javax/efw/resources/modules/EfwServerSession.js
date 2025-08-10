"use strict";
/**** efw5.X Copyright 2025 efwGrp ****/
/**
 * The class to operate session.
 * 
 * @author Chang Kejun
 */
class EfwServerSession extends Debuggable{
	/**
	 * The function to get data from session.
	 * 
	 * @param {String}
	 *            key: the session key.
	 * @returns {Any}
	 */
	static get (key) {
		let value= Packages.efw.framework.getRequest().getSession().getAttribute(key);
		//javaからsessionに値を設定して、efwからそれを取る場合を考慮して以下の処理を行う
		if (value == null) {
			//値がnullの場合処理を飛ばす
		}else{
			let valueType=typeof value;
			if (valueType == "string"){
				if (value.indexOf("JSON:")==0){
					value=JSON.parse(value.substring(5));
				}
			}
		}
		return value;
	}
	/**
	 * The function to set data in session.
	 * 
	 * @param {String}
	 *            key: the session key.
	 * @param {Any}
	 *            value: the data you want to set in session.
	 */
	static set (key, value) {
		//javaからsessionに値を設定して、efwからそれを取る場合を考慮して以下の処理を行う
		if (value == null) {
			//値がnullの場合処理を飛ばす
		}else{
			let valueType=typeof value;
			if (valueType == "object") {
				if (value.getClass){
					//javaオブジェクトの場合そのまま
				}else{
					//javascript objectの場合JSON変換
					value ="JSON:"+JSON.stringify(value);
				}
			//javascriptの単純値の場合そのまま
			}else if (valueType == "string") {
			}else if (valueType == "boolean") {
			}else if (valueType == "number") {
			}else{
				Packages.efw.framework.runtimeWLog(valueType +" can not be set in session, the process will be ignored.");
				return;
			}
		}
		Packages.efw.framework.getRequest().getSession().setAttribute(key, value);
	}
	/**
	 * The function to create a new session.
	 */
	static create () {
		Packages.efw.framework.getRequest().getSession(true);
	}
	/**
	 * The function to invalidate the current session.
	 */
	static invalidate () {
		Packages.efw.framework.getRequest().getSession().invalidate();
	}
}
///////////////////////////////////////////////////////////////////////////////
const session = EfwServerSession;
