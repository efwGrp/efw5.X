"use strict";
/**** efw5.X Copyright 2025 efwGrp ****/
class elfinder_downloadFileList{
	static paramsFormat = {
		"cmd":null,
		"home":null,
		"isAbs":null,
		"readonly":null,
		"id":null,
		"target":null
	};
	static fire(params) {
		let risk=ElfinderEvent.checkRisk(params);if(risk)return risk;
		let file=params.file;
		let volumeId="EFW_";
		let target=params["target"];
		let cwdFile=target.substring(volumeId.length).base64Decode();
		
		function loopFilder(root){
			let ret="";
			let ary=file.list(root);
			for(let i=0;i<ary.length;i++){
				let item=ary[i];
				if (file.isFolder(root+"/"+item.name)){
					ret+=loopFilder(root+"/"+item.name);
				}else{
					let lastModified=item.lastModified==null?"":item.lastModified.format("yyyy/MM/dd HH:mm:ss");
					ret+=item.name+"\t"+item.length+"\t"+lastModified+"\t"+root+"\r\n";
				}
			}
			return ret;
		}
		let txt="name\tlength\tlastModified\tabsolutePath\r\n";
		txt+=loopFilder(cwdFile);
		
		let filename=absfile.getTempFileName();
		absfile.writeAllLines(absfile.getStorageFolder()+"/"+filename,txt);
		
		return new Result()
		.attach(filename)
		.saveas("list.txt")
		.deleteAfterDownload();
	}
}
