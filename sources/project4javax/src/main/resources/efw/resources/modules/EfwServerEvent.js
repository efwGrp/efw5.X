"use strict";
/**** efw5.X Copyright 2025 efwGrp ****/
/**
 * The class to operate event.
 * 
 * @author Chang Kejun
 */
class EfwServerEvent extends Debuggable{
	/**
	 * The function to fire another event in an event firing.
	 * 
	 * @param {String}
	 *            eventId: required<br>
	 * @param {Object}
	 *            params: optional<br>
	 *            {param1:value1,param2:value2,...}<br>
	 * @param {String}
	 *            server: optional<br>
	 *            The url of connections to another web server application constructed by Efw.<br>
	 *            http://127.0.0.1:8080/efw<br>
	 * @returns {Result}
	 */
	static fire (eventId, params, server) {
		if (server==undefined){
			if (params==undefined){
				params={};
			}else if(typeof(params) == "string"){
				server=params;
				params={};
			}
		}
		let result=new Result();
		if (server==undefined){
			let ev;
			//in debug mode, load event every time.
			if (_isdebug){
				ev=EfwServerEvent.load(eventId);
			}else{
				ev=EfwServerEvent.get(eventId);
			}
			result=ev.fire(params);
		}else{
			let servletUrl = "efwServlet";
			let jsonString=""+Packages.efw.event.RemoteEventManager.call(
					server+"/"+servletUrl,
					JSON.stringify({eventId:eventId,params:params})
				);
			let resultJSON=JSON.parse(jsonString);
			if (resultJSON.actions!=null&&resultJSON.values!=null){
				result.actions=resultJSON.actions;
				result.values=resultJSON.values;
			}else{
				result=resultJSON;
			}
		}
		return result;
	}
///////////////////////////////////////////////////////////////////////////////

	static get (eventId){
		let ev=null;
		try{
			ev=Function("return (" + eventId + ")")();
		}catch(e){
			ev=null;
		}
		return ev;
	}
	static #remove(eventId){
		try{
			Function("delete " + eventId)();
		}catch(e){}
	}
	/**
	 * The function to load a event.<br>
	 * If the debug mode,load event every time.<br>
	 * If the release mode, load event only the first time.<br>
	 * If the event is from resource,do not reload it.<br>
	 * @param {String}
	 *            eventId: required<br>
	 * @returns {EventInfo}
	 */
	static load (eventId,loadingGlobal){
		//elfinder_cmds is load from jar
		if (eventId=="elfinder_cmds") return EfwServerEvent.get(eventId);
		//if the global.js is not exists,warning log.
		if (loadingGlobal){
			if (!absfile.exists(_eventfolder + "/" + eventId + ".js")){
				Packages.efw.framework.initWLog( eventId + ".js is not found.");
				return null;
			}
		}
		//--------------------
		try {
			load(_eventfolder + "/" + eventId + ".js");
		}catch(e){
			if (e instanceof Error)e=""+e;
			if (loadingGlobal){
				Packages.efw.framework.initSLog("global.js cannot be loaded.",e);
			}else{
				Packages.efw.framework.runtimeSLog(e);
			}
			EfwServerEvent.#remove(eventId);
		}
		return EfwServerEvent.get(eventId);
	}
}
///////////////////////////////////////////////////////////////////////////////
const event = EfwServerEvent;
