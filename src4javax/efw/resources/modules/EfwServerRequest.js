"use strict";
/**** efw5.X Copyright 2025 efwGrp ****/
/**
 * The class to operate request.
 * 
 * @author Chang Kejun
 */
class EfwServerRequest extends Debuggable{
	/**
	 * The function to get data from request.
	 * 
	 * @param {String}
	 *            key: the request key.
	 * @returns {Any}
	 */
	static get (key){
		let url= Packages.efw.framework.getRequest().getHeader("referer");
		function getParam(url,name) {
		    name = name.replace(/[\[\]]/g, "\\$&");
		    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		        results = regex.exec(url);
		    if (!results) return null;
		    if (!results[2]) return '';
		    let value= decodeURIComponent(results[2].replace(/\+/g, " "));
			//禁則文字の定義を取得する
			let characters = Packages.efw.properties.PropertiesManager.getProperty(
				Packages.efw.properties.PropertiesManager.EFW_FORBIDDEN_CHARACTERS,"");
			let replacement= Packages.efw.properties.PropertiesManager.getProperty(
				Packages.efw.properties.PropertiesManager.EFW_FORBIDDEN_REPLACEMENT,"");
			characters=characters.split("");
			replacement=replacement.split("");
			//禁則文字対応
			for (let i=0;i<characters.length;i++){
				let chr=characters[i];
				let rpl=replacement[i];
				if (rpl==null)rpl="";
				value=value.replace(new RegExp("["+chr+"]","g"),rpl);
			}
		    return value;
		}
		return getParam(url,key);
	}
}
///////////////////////////////////////////////////////////////////////////////
const request = EfwServerRequest;
