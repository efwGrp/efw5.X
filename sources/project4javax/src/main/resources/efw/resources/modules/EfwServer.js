"use strict";
/**** efw5.X Copyright 2025 efwGrp ****/
/**
 * The class to check or fire event.
 * 
 * @author Chang Kejun
 */
class EfwServer extends Debuggable{
	/**
	 * The function to check login or not.
	 * @param eventId: Event Id.
	 * @returns {null | Result}<br>
	 */
	static checkLogin(eventId, lang){
		let currentAuthBean=Packages.efw.efwFilter.getCurrentAuthBean();
		let needLoginCheck = currentAuthBean.loginCheck;
		let loginUrl = currentAuthBean.loginUrl;
		let outOfLoginEventIdPattern = ""+currentAuthBean.outOfloginEventIdPatternString;
		let loginkey = ""+currentAuthBean.loginKey;
		if (needLoginCheck && outOfLoginEventIdPattern!="" && eventId.search(new RegExp(outOfLoginEventIdPattern))==-1) { // the login check
			let vl = session.get(loginkey);
			if (vl == null ||(typeof(vl) == "string" && vl == "")) {
				let result=(new Result())
				.alert(messages.get("SessionTimeoutException",lang));
				//メインアプリとして呼び出す場合、ログインURL遷移。
				result.navigate(loginUrl);
				return result;
			}
		}
		return null;
	}
	/**
	 * The function to check auth.
	 * @param eventId: Event Id.
	 * @returns {null | Result}<br>
	 */
	static checkAuth(eventId, lang){
		let currentAuthBean = Packages.efw.efwFilter.getCurrentAuthBean();
		let systemErrorUrl = currentAuthBean.systemErrorUrl;
		let outOfLoginEventIdPattern =""+currentAuthBean.outOfloginEventIdPatternString;
		if (eventId.search(new RegExp(outOfLoginEventIdPattern)) == -1) {
			let needAuthCheck = currentAuthBean.authCheck;
			let authKey = ""+currentAuthBean.authKey;
			let authCases = ""+currentAuthBean.authCases;
			let authValue = session.get(authKey);
			if (needAuthCheck && authValue != null && authValue != ""  && authCases != "") {
				let hasAuth=false;
				let authCaseAry  = authCases.split(",");
				for (let i = 0; i < authCaseAry.length; i++) {
					let itm=currentAuthBean.authCasesMap.get(authCaseAry[i]);
					let authPattern = ""+itm.get(Packages.efw.properties.PropertiesManager.EFW_AUTH_AUTHPATTERN);
					let eventidPattern = ""+itm.get(Packages.efw.properties.PropertiesManager.EFW_AUTH_EVENTIDPATTERN);
					if (authPattern != "" && eventidPattern != "" && authValue.search(new RegExp(authPattern)) > -1  && eventId.search(new RegExp(eventidPattern)) > -1){
							hasAuth=true;
							break;
					}
				}
				if (hasAuth == false) {
					let result=(new Result())
					.alert(messages.get("OtherErrorException",lang))
					.navigate(systemErrorUrl);
					return result;
				}
			}
		}
		return null;
	}
	/**
	 * The function to check request params by params format
	 * 
	 * @param event:
	 *            event object defined in your program.
	 * @param requestParams:
	 *            params from client.
	 * @returns {null | Result}<br>
	 */
	static 	checkStyle(event, requestParams, lang){
		//禁則文字の定義を取得する
		let characters = Packages.efw.properties.PropertiesManager.getProperty(
			Packages.efw.properties.PropertiesManager.EFW_FORBIDDEN_CHARACTERS,"");
		let replacement= Packages.efw.properties.PropertiesManager.getProperty(
			Packages.efw.properties.PropertiesManager.EFW_FORBIDDEN_REPLACEMENT,"");
		characters=characters.split("");
		replacement=replacement.split("");
	
		function _check(pms, fts, parentkey) { // required,format,display-name,max-length,min,max,
			let result = new Result();
			if (parentkey != null && parentkey != "")
				parentkey += " ";// in order for the space, parentkey+" "+sonkey"
			for ( let key in fts) { // check requestParams by every format define
				let paramdef = fts[key];
				let param = pms[key];
	
				if (paramdef == null) { // if format define is null do nothing
				} else if (paramdef instanceof Array) { // if format define is array
					if (param != null) {
						// loop it to validate items in the array
						for (let i = 0; i < param.length; i++) {
							result = result.concat(_check(param[i], paramdef[0],
									parentkey + key + ":eq(" + i + ")"));
						}
					}
				} else if (typeof paramdef === "object") {
					// if format define is object check it
					if (param != null) { // validate attributes in the object
						result = result.concat(_check(param, paramdef, parentkey + key));
					}
				} else if (typeof paramdef == "string") {
					// if paramdef is string ,it means validators
					let validators = {};
					// split with [;] then split with fist [:] to get
					let tempAry = paramdef.split(";");
					for (let i = 0; i < tempAry.length; i++) {
						let vdtr = tempAry[i];
						let point = vdtr.indexOf(":");
						if (point > 0)
							validators[vdtr.substring(0, point)] = vdtr
									.substring(point + 1);
					}
					// must be inputed
					let required = validators["required"];
					// input format for date or number
					let format = validators["format"];
					// display name in error message
					let displayName = validators["display-name"];
					// input length for string
					let maxLength = validators["max-length"];
					let min = validators["min"]; // min value in format define
					let max = validators["max"]; // max value in format define
					let accept = validators["accept"]; // file ext name
					let secure = validators["secure"];
					let minv = null; // min value
					let maxv = null; // max value
					let value = null; // the value of param
					// pay attention to the space, parentkey+" "+sonkey"
					let errorElementKey = parentkey + key;
					if ((param == null || param == "") && required == "true") {
						// if data is not inputed check required
						let message = messages.get("IsRequiredMessage",lang);
						result.alert(message,{"display-name":displayName})
						.highlight(errorElementKey)
						.focus(errorElementKey);
						continue;
					} else if (param != null && param != "" && format != null
							&& format != "") {
						// check format and convert data type
						let parser = null;
						let requriedMessage = null;
						if (format.indexOf("{")==0&&format.lastIndexOf("}")==format.length-1){
							parser = EfwServerFormat.parseEnum;
							requriedMessage = messages.get("BooleanIsReuqiredMessage",lang);
						}else if (format.indexOf("#") > -1 || format.indexOf("0") > -1) {// number #,##0.0
							parser = EfwServerFormat.parseNumber;
							requriedMessage = messages.get("NumberIsReuqiredMessage",lang);
						} else { // date yyyy/MM/dd
							parser = EfwServerFormat.parseDate;
							requriedMessage = messages.get("DateIsReuqiredMessage",lang);
						}
						try { // check it is number or not
							value = parser(param, format);
							pms[key] = value;
							try {
								minv = parser(min, format);
							} catch (e) {
							}
							try {
								maxv = parser(max, format);
							} catch (e) {
							}
						} catch (e) {
							let message = requriedMessage;
							result.alert(message,{"display-name":displayName})
							.highlight(errorElementKey)
							.focus(errorElementKey);
							continue;
						}
					} else if (param != null && param != "") {
						// if no format, the data is regraded as string,check maxlength
						let maxLengthv = new Number(maxLength);
						if (isNaN(maxLengthv))
							maxLengthv = null;
						// check max length
						if (maxLengthv != null && param.length > maxLengthv) {
							let message = messages.get("MaxLengthOverMessage",lang);
							result.alert(message,{"display-name":displayName,"max-length":maxLength})
							.highlight(errorElementKey)
							.focus(errorElementKey);
							continue;
						}
						if (accept != null) { // check file ext
							let exts = accept.toLowerCase().split(",");
							let paramAry=param.toLowerCase().split("|");
							let isAccepted = false;
							for (let p=0;p<paramAry.length;p++){
								isAccepted = false;
								for (let i = 0; i < exts.length; i++) {
									let ext=exts[i];
									let flnm=paramAry[p];
									if (
										flnm.toLowerCase().search(new RegExp("."+ext+"\\|"))>0	//to do for multi file upload
										||flnm.toLowerCase().search(new RegExp("."+ext+"$"))>0	//
									){
										isAccepted = true;
										break;
									}
								}
								if (!isAccepted) break;
							}
							if (!isAccepted) {
								let message = messages.get("NotAcceptMessage",lang);
								result.alert(message,{"display-name":displayName})
								.highlight(errorElementKey)
								.focus(errorElementKey);
								continue;
							}
						}
						if (min == null || min == undefined)
							minv = null;
						else
							minv = min;
						if (max == null || max == undefined)
							maxv = null;
						else
							maxv = max;
	
						value=param;
						//暗号化の場合復号化する
						if (secure=="true"){
							value=decodeURIComponent(value.base64Decode());
						}
						//禁則文字対応
						for (let i=0;i<characters.length;i++){
							let chr=characters[i];
							let rpl=replacement[i];
							if (rpl==null)rpl="";
							value=value.replace(new RegExp("["+chr+"]","g"),rpl);
						}
						pms[key] = value;
					}
	
					if (value != null && value != "") {// check min max
						let message = null;
						if (minv != null && maxv != null) {
							if (value < minv || value > maxv)
							message = messages.get("MinOrMaxOverMessage",lang);
						} else if (minv != null) {
							if (value < minv)
							message = messages.get("MinOverMessage",lang);
						} else if (maxv != null) {
							if (value > maxv)
							message = messages.get("MaxOverMessage",lang);
						}
						if (message != null) {
							let dataType="";
							if (value.toFixed){
								dataType=messages.get("NumberType",lang);
							}else if (value.getTime){
								dataType=messages.get("DateType",lang);
							}else{
								dataType=messages.get("StringType",lang);
							}
							result.alert(message,{
								"display-name":displayName,
								"min":min,
								"max":max,
								"data-type":dataType,
							})
							.highlight(errorElementKey)
							.focus(errorElementKey);
							continue;
						}
					}
				}
			}
			return result;
		}
		// clone the paramsFormat, if function exists, it will be run.
		let paramsFormat = JSON.clone(event.paramsFormat,true);
		let result= _check(requestParams, paramsFormat, "");
		if (result.actions.alert){
			return result;
		}else{
			return null;
		}
	}
	/**
	 * The function to fire event.
	 * 
	 * @param event:
	 *            event object defined in your program.
	 * @param requestParams:
	 *            params from client.
	 * @returns {null | Result | Event}
	 */
	static fire(event, requestParams) {
		try {
			let result = event.fire(requestParams);
			if (result != null && result["actions"] != null
					&& result["actions"]["download"] != null) {// save download
				// info to session
				let download = result["actions"]["download"];
				let tmpfile = download.file;
				if (tmpfile == null)
					tmpfile = "";
				let tmpzip = download.zip;
				if (tmpzip == null)
					tmpzip = "";
				else
					tmpzip = tmpzip.join("|");
				let tmpdeleteafterdownload = download.deleteafterdownload;
				if (tmpdeleteafterdownload == null)
					tmpdeleteafterdownload = "";
				else
					tmpdeleteafterdownload = "" + tmpdeleteafterdownload;
				let tmpsaveas = download.saveas;
				if (tmpsaveas == null)
					tmpsaveas = "";
				let tmppassword=download.password;
				if (tmppassword == null)
					tmppassword = "";
				let tmpzipBasePath =download.zipBasePath;
				if (tmpzipBasePath == null)
					tmpzipBasePath = "";
				let tmpisAbs = download.isAbs;
				if (tmpisAbs == null)
					tmpisAbs ="";
				else
					tmpisAbs =""+tmpisAbs;
					
				session.set("efw.download.file", tmpfile);
				session.set("efw.download.zip", tmpzip);
				session.set("efw.download.deleteafterdownload",
						tmpdeleteafterdownload);
				session.set("efw.download.saveas", tmpsaveas);
				session.set("efw.download.password", tmppassword);
				session.set("efw.download.zipBasePath", tmpzipBasePath);
				session.set("efw.download.isAbs", tmpisAbs);
				
			}
			if (result != null && result["actions"] != null
					&& result["actions"]["preview"] != null) {// save preview
				let preview = result["actions"]["preview"];
				let tmpfile = preview.file;
				if (tmpfile == null)
					tmpfile = "";
				let tmpisAbs = preview.isAbs;
				if (tmpisAbs == null)
					tmpisAbs ="";
				else
					tmpisAbs =""+tmpisAbs;
					
				session.set("efw.preview.file", tmpfile);
				session.set("efw.preview.isAbs", tmpisAbs);
			}
			db.commitAll();
			return result;
		} catch (e) {
			db.rollbackAll();
			throw e;
		} finally {
			Packages.efw.db.DatabaseManager.closeAll();
			Packages.efw.excel.ExcelManager.closeAll();
			Packages.efw.csv.CSVManager.closeAll();
			Packages.efw.binary.BinaryManager.closeAll();
			Packages.efw.pdf.PdfManager.closeAll();
		}
	}
}
