"use strict";
/**** efw4.X Copyright 2025 efwGrp ****/
//ここだけfunctionにする。
function elfinder_upload(params) {
	let risk=ElfinderEvent.checkRisk(params);if(risk)return "UploadRiskException";;
	let volumeId="EFW_";
	let target=params["target"];
	let targetFolder=""+target.substring(volumeId.length).base64Decode();
	file.saveUploadFiles(targetFolder);
	return "";//成功の場合なにも戻さない。
};
