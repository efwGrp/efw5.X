"use strict";
/**** efw5.X Copyright 2025 efwGrp ****/
/**
 * The class to visit the rest service
 *
 * @author Chang Kejun
 */
class EfwServerRest extends Debuggable{
	/**
	 * The function to get data from the rest service.
	 * @param {String} apiUrl
	 * @param {key:value} heads
	 * @returns {JsonObject}
	 */
	static get(apiUrl, heads){
		let mapHeads=new java.util.HashMap();
		if (heads!=null){
			for(let key in heads){
				mapHeads.put(key,heads[key]);
			}
		}
	    let strRtnVal = Packages.efw.rest.RestManager.visit(apiUrl,"GET","",mapHeads);
	    if (strRtnVal==""){
	    	return null;
	    }else{
	        return JSON.parse(strRtnVal);
	    }
	}
	/**
	 * The function to post data to the rest service.
	 * @param {String} apiUrl
	 * @param {id:string} params
	 * @param {key:value} heads
	 * @returns {JsonObject}
	 */
	static post(apiUrl, params, heads){
		let mapHeads=new java.util.HashMap();
		if (heads!=null){
			for(let key in heads){
				mapHeads.put(key,heads[key]);
			}
		}
	    let strJson = JSON.stringify(params);
	    let strRtnVal = Packages.efw.rest.RestManager.visit(apiUrl,"POST",strJson,mapHeads);
	    if (strRtnVal==""){
	    	return null;
	    }else{
	        return JSON.parse(strRtnVal);
	    }
	}
	/**
	 * The function to put data to the rest service.
	 * @param {String} apiUrl
	 * @param {id:string} params
	 * @param {key:value} heads
	 * @returns {JsonObject}
	 */
	static put(apiUrl, params, heads){
		let mapHeads=new java.util.HashMap();
		if (heads!=null){
			for(let key in heads){
				mapHeads.put(key,heads[key]);
			}
		}
	    let strJson = JSON.stringify(params);
	    let strRtnVal = Packages.efw.rest.RestManager.visit(apiUrl,"PUT",strJson,mapHeads);
	    if (strRtnVal==""){
	    	return null;
	    }else{
	        return JSON.parse(strRtnVal);
	    }
	}
	/**
	 * The function to delete data from the rest service.
	 * @param {String} apiUrl
	 * @param {key:value} heads
	 * @returns {JsonObject}
	 */
	static delete(apiUrl, heads){
		let mapHeads=new java.util.HashMap();
		if (heads!=null){
			for(let key in heads){
				mapHeads.put(key,heads[key]);
			}
		}
		let strRtnVal = Packages.efw.rest.RestManager.visit(apiUrl,"DELETE","",mapHeads);
	    if (strRtnVal==""){
	    	return null;
	    }else{
	        return JSON.parse(strRtnVal);
	    }
	}
	/**
	 * The function to get response code after rest calling.
	 * @returns {JsonObject}
	 */
	static getStatus(){
		return 0 + Packages.efw.rest.RestManager.getStatus();
	}
}
///////////////////////////////////////////////////////////////////////////////
const rest = EfwServerRest;