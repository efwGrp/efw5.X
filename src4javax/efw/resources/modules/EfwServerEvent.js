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
			let ev=EfwServerEvent.get(eventId);
			if (ev==null||ev.from=="file"){
				ev=EfwServerEvent.load(eventId);
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
		//if the global.js is not exists,warning log.
		if (loadingGlobal){
			if (!absfile.exists(_eventfolder + "/" + eventId + ".js")){
				Packages.efw.framework.initWLog( eventId + ".js is not found.");
				return null;
			}
		}
		//--------------------
		/**
		 * This function to set eventinfo about service
		 */
		function setService(eventId,ev,preService,preSemaphore){
			if (ev.service!=null){
				if (preService==null)preService={};
				if(ev.service.max!=null && ev.service.max>-1 && ev.service.max!=preService.max){
					ev.semaphore=Packages.efw.script.ScriptManager.getSemaphore(eventId,ev.service.max);
				}else if(ev.service.max==preService.max){
					ev.semaphore=preSemaphore;
				}
			}else{
				ev.semaphore=null;
			}
		}
		//--------------------
		try {
			//if the event hasnot be loaded, load it.
			if(!EfwServerEvent.get(eventId)){
				load(_eventfolder + "/" + eventId + ".js");
				let ev=EfwServerEvent.get(eventId);
				if (ev){
					ev.lastModified =""+absfile.get(_eventfolder + "/" + eventId + ".js").lastModified;
					if(eventId!="global")setService(eventId,ev,null,null);
					ev.from="file";//from is checked in fire event, so it must be the last step.
				}
			}else if (_isdebug){
				let org=EfwServerEvent.get(eventId);
				let orgLastModified=""+org.lastModified;
				let evLastModified=""+absfile.get(_eventfolder + "/" + eventId + ".js").lastModified;
				if (orgLastModified!=evLastModified){
					EfwServerEvent.#remove(eventId);
					load(_eventfolder + "/" + eventId + ".js");
					let ev=EfwServerEvent.get(eventId);
					if (ev){
						ev.lastModified =absfile.get(_eventfolder + "/" + eventId + ".js").lastModified;
						setService(eventId,ev,org.service,org.semaphore);
						ev.from="file";//from is checked in fire event, so it must be the last step.
					}
				}
			}
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
