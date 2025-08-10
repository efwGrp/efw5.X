"use strict";
/**** efw5.X Copyright 2025 efwGrp ****/
class elfinder_file {
	//This event is called from Efw function, so the paramsFormat must be defined.
	static paramsFormat = {
		"cmd":null,
		"home":null,
		"isAbs":null,
		"readonly":null,
		"id":null,
		"target":null
	};
	static fire (params) {
		let risk=ElfinderEvent.checkRisk(params);if(risk)return risk;
		let volumeId="EFW_";
		let target=params["target"];
		let cwdFile=target.substring(volumeId.length).base64Decode();
		if (params["isAbs"]){
			//絶対パス設定された場合
			return (new Result()).attach(cwdFile,null,true);
		}else{
			return (new Result()).attach(cwdFile);
		}
	}
}