"use strict";
/**** efw5.X Copyright 2025 efwGrp ****/
class elfinder_download {
	static paramsFormat = {
		"cmd":null,
		"home":null,
		"isAbs":null,
		"readonly":null,
		"id":null,
		"targets":null
	};
	static fire(params) {
		let risk=ElfinderEvent.checkRisk(params);if(risk)return risk;
		let volumeId="EFW_";
		let targets=params["targets"];
		let ret=new Result();
		for (let i=0;i<targets.length;i++){
			let target=targets[i];
			let cwdFile=target.substring(volumeId.length).base64Decode();
			let zipBasePath="";
			if (cwdFile.indexOf("/")>-1){
				zipBasePath=cwdFile.substring(0,cwdFile.lastIndexOf("/"));
			}
			if (params["isAbs"]){
				//絶対パス設定された場合
				ret.attach(cwdFile,zipBasePath,true);
			}else{
				ret.attach(cwdFile,zipBasePath);
			}
		}
		return ret;
	}
}