"use strict";
/**** efw5.X Copyright 2025 efwGrp ****/
/**
 * The Efw Class
 * @author Chang Kejun
 */
class Efw extends Debuggable{
	/**
	 * The array to keep keys
	 * _eventfolder: The event folder absolute path.
	 * _isdebug: The boolean flag to show the mode is debug or not.
	 */
	static #keys=["_eventfolder","_isdebug"];
	/**
	 * Register a key in efw to bypass global pollution checks
	 */
	static register(key){
		Efw.#keys.push(key);
	}
	/**
	 * Check a key is exists in efw context or not.
	 */
	static contains(key){
		if (Efw.#keys.indexOf(key)>-1){
			return true;
		}else{
			return false;
		}
	}
	static server=EfwServer;

// /////////////////////////////////////////////////////////////////////////////
	/**
	 * The init function
	 * It will be called when every context is created
	 */
	static doInit(){
		/**
		 * Run global event.
		 */
		if (event.load("global",true)){
			try{
				efw.server.fire(event.get("global"));
			}catch(e){
				if (e instanceof Error)e=""+e;
				Packages.efw.framework.initSLog("Global event failed.",e);
				throw e;//globalエラーの場合、初期化失敗
			}
		}
	}
	/**
	 * The destory function
	 * It will be called when system close
	 */
	static doDestroy(){
		/**
		 * Run by servlet destory.
		 */
		try{
			if (!absfile.exists(_eventfolder + "/destroy.js")){
				
			}
			if (event.load("destroy",true)){
				efw.server.fire(event.get("destroy"));
			}
		}catch(e){
			if (e instanceof Error)e=""+e;
			Packages.efw.framework.runtimeSLog("destory event failed.",e);
			throw e;//destoryエラーの場合
		}
	}
	/**
	 * The ajax service function<br>
	 * It will be called by efwServlet
	 * 
	 * @param req:
	 *            JSON String from client
	 * @returns: JSON String to client
	 */
	static doPost(req) {
		let reqJson = JSON.parse(req); // parse request string to json object
		let eventId = reqJson.eventId; // get eventId from json object
		let params = reqJson.params; // get params from json object
		let lang = reqJson.lang; // get lang from json object
		let service = null;
		let semaphore = null;// the semmaphore to control event maxrequests
		let semaphoreNeedRelease=false;// the flag about semmaphore release
		let currentAuthBean=Packages.efw.efwFilter.getCurrentAuthBean();
		
		eventId=eventId.replace(/[<>.\\\/]/g,"");//to delete forbidden characters.
	
		//イベント取得できない場合、エラーを画面に出す。該当エラーはよく発生する。
		let ev=event.get(eventId);
		//if event is not loaded or it is in debug mode
		if (ev==null){
			ev=event.load(eventId);
		}
		if (ev==null){
			let result=(new Result())
			.error("RuntimeErrorException", {"eventId":eventId,"message":""+messages.get("EventIsNotExistsMessage",lang)});
			let systemErrorUrl=""+currentAuthBean.systemErrorUrl;
			if (systemErrorUrl!=""){
				result.navigate(systemErrorUrl);
			}
			return messages.translate(JSON.stringify(result),lang);
		}else{
			service=ev.service;
			if (ev.service!=null && ev.service.max!=null && ev.service.max>-1 ){
				semaphore=Packages.efw.script.ScriptManager.getSemaphore(eventId,ev.service.max);
			}else{
				semaphore=null;
			}

		}
	
		try{
			if (params == null) {
				return messages.translate(JSON.stringify(JSON.clone(ev.paramsFormat,true)),lang);
			} else {
				//login check
				let ret = efw.server.checkLogin(eventId, lang);
				if (ret==null){
					// auth check
					ret = efw.server.checkAuth(eventId, lang);
					if (ret == null){
						ret = efw.server.checkStyle(ev, params, lang);
						if (ret == null){
							if (semaphore==null){
								Packages.efw.framework.accessLog(session.get(currentAuthBean.loginKey),req);//操作履歴のため。
								ret = efw.server.fire(ev, params);
							}else if(semaphore.tryAcquire()){
								semaphoreNeedRelease=true;
								Packages.efw.framework.accessLog(session.get(currentAuthBean.loginKey),req);//操作履歴のため。
								ret = efw.server.fire(ev, params);
							}else{
								ret=(new Result()).error("EventIsBusyException",service);
							}
						}
					} 
				}
				// if it is null, return blank array to client as a success
				if (ret == null) ret=new Result();
				
				let arylst=Packages.efw.framework.getThreadLogs();
				ret.threadLogs=[];
				if(arylst!=null){
					for(let i=0;i<arylst.size();i++){
						ret.threadLogs.push(arylst.get(i));
					}
				}
				// change data to string and return it to client
				if(ret.withoutI18nTranslation){
					return JSON.stringify(ret);
				}else{
					return messages.translate(JSON.stringify(ret),lang);
				}
			}
		}catch(e){
			if (e instanceof Error)e=""+e;
			Packages.efw.framework.runtimeSLog(e);
			let errorMsg=""+Packages.efw.framework.getUsefulInfoFromException(e);
			errorMsg=errorMsg.replace(/</g,"&lt;").replace(/>/g,"&gt;");//to encode the error message for showing in alert dialog.
			let result=(new Result())
			.error("RuntimeErrorException", {"eventId":eventId,"message":errorMsg});
			let systemErrorUrl=""+currentAuthBean.systemErrorUrl;
			if (systemErrorUrl!=""){
				result.navigate(systemErrorUrl);
			}
			let arylst=Packages.efw.framework.getThreadLogs();
			result.threadLogs=[];
			if(arylst!=null){
				for(let i=0;i<arylst.size();i++){
					result.threadLogs.push(arylst.get(i));
				}
			}
			return messages.translate(JSON.stringify(result),lang);
		}finally{
			if(semaphoreNeedRelease){
				semaphore.release();
			}
			//remove all uploaded files when event over
			Packages.efw.file.FileManager.removeUploadFiles();
			// to find javascript global pollution when debug mode and second calling.
			if (_isdebug && params!=null){
				let g = new Function('return this')();
				for(let i in g){
					if (  efw.contains(i)
						||typeof g[i]=="function"//common function
						||(g[i]!=null&&g[i].fire!=null)//event js
						||(g[i]!=null&&(g[i].PUT!=null||g[i].GET!=null||g[i].POST!=null||g[i].DELETE!=null))//restAPI js
					){
						//default global object is ok
					}else{
						// you should do something if the comment is printed out.
						Packages.efw.framework.runtimeWLog("[" + i + "] is not an event js name but is added to Global. It is not recommended.");
					}
				}
			}
		}
	}
///////////////////////////////////////////////////////////////////////////////
	/**
	 * The service function<br>
	 * It will be called by efwBatch
	 * 
	 * @param req:
	 *            JSON String from batch
	 * @returns: JSON String to batch
	 */
	static doBatch(req) {
		let reqJson = JSON.parse(req); // parse request string to json object
		let eventId = reqJson.eventId; // get eventId from json object
		let params = reqJson.params; // get params from json object
		let lang = reqJson.lang; // get lang from json object
		try{
			let ev=event.get(eventId);
			//if event is not loaded or it is in debug mode
			if (ev==null){
				ev=event.load(eventId);
			}
			if (ev==null){
				return;//Event Is Not Exists this error will show trace info by load function.
			}
			let ret = efw.server.checkStyle(ev, params);
			if (ret!=null){
				java.lang.System.out.println(ret.actions.alert.join("\n"));// params error, return;
				return;
			}
			ret = efw.server.fire(ev, params);
			if(ret==null){
				return;
			}else if(ret.errorlevel!=null){//batch objectの戻り値の場合
				for(let i=0;i<ret.logs.length;i++){
					Packages.efw.framework.runtimeWLog(ret.logs[i]);
				}
				for(let i=0;i<ret.echos.length;i++){
					java.lang.System.out.println(ret.echos[i]);
				}
				if(ret.errorlevel>0){
					java.lang.System.exit(ret.errorlevel);
				}
				return;//event return is normal
			}else{
				java.lang.System.out.println(JSON.stringify(ret));
				return;//event return has errorlevel
			}
		}catch(e){
			if (e instanceof Error)e=""+e;
			Packages.efw.framework.runtimeSLog(e);
			return;//exception return;
		}
	}
///////////////////////////////////////////////////////////////////////////////
	/**
	 * The service function<br>
	 * It will be called by efwRestAPI
	 * 
	 * @param req:
	 *            JSON String from batch
	 * @param httpMethod:
	 *            PUT GET POST DELETE
	 * @returns: 　https://qiita.com/uenosy/items/ba9dbc70781bddc4a491
	 * 			500 Internal Server Error	その他のサーバに起因するエラーにより処理続行できない場合
	 * 			404 Not Found				イベントが見つからない
	 * 			200 OK						GET PUT POST方法成功の戻り値、結果リソースと一緒に送信
	 * 			204 No Content				PUT POST DELETE方法成功の戻り値、結果リソースと一緒に送信しない
	 * 
	 */
	static doRestAPI(eventId,reqkeys,httpMethod,reqParams) {
		reqParams=reqParams.replace(/\r?\n/g, "");//to delete \r\n
		let params = reqParams==""?{}:JSON.parse(reqParams); // parse request string to json object. if blank then {}
		let keys = JSON.parse(reqkeys);// parse keys string to json array
		let lang = params==null?"en":params.lang; // get lang from json object
	
		//イベント取得できない場合、エラーを画面に出す。該当エラーはよく発生する。
		let ev=event.get(eventId);
		//if event is not loaded or it is in debug mode
		if (ev==null){
			ev=event.load(eventId);
		}
		if (ev==null){
			Packages.efw.framework.getResponse().setStatus(java.net.HttpURLConnection.HTTP_NOT_FOUND);//404 Not Found 見つからない
			return;
		}
	
		try{
			let currentAuthBean=Packages.efw.efwFilter.getCurrentAuthBean();
			Packages.efw.framework.accessLog(session.get(currentAuthBean.loginKey),eventId+"/"+keys.join("/"));//操作履歴のため。
			let ret;
			if (httpMethod=="PUT"){
				ret=ev.PUT(keys,params);
			}else if (httpMethod=="POST"){
				ret=ev.POST(keys,params);
			}else if (httpMethod=="GET"){
				ret=ev.GET(keys);
			}else if (httpMethod=="DELETE"){
				ev.DELETE(keys);
			}
			
			db.commitAll();
			// if it is null, return blank array to client as a success
			if (ret != null){//200 201
				Packages.efw.framework.getResponse().setStatus(java.net.HttpURLConnection.HTTP_OK);//200 OK
			}else{//204
				Packages.efw.framework.getResponse().setStatus(java.net.HttpURLConnection.HTTP_NO_CONTENT);//204 No Content
			}
			
			// change data to string and return it to client
			if (ret != null){//200 201
				return JSON.stringify(ret);
			}else{
				return;
			}
		}catch(e){
			if (e instanceof Error)e=""+e;
			Packages.efw.framework.runtimeSLog(e);
			db.rollbackAll();
			throw e;//500 Internal Server Error
		}finally{
			Packages.efw.db.DatabaseManager.closeAll();
		}
	}
}
///////////////////////////////////////////////////////////////////////////////
const efw = Efw;
