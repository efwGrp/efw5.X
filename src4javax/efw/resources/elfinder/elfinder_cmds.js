"use strict";
/**** efw5.X Copyright 2025 efwGrp ****/
/**
 * elfinderの各イベント
 */
class elfinder_cmds{
	static paramsFormat = {};
	static fire(params) {
		let risk=ElfinderEvent.checkRisk(params);if(risk)return risk;
		try{
			let cmd=params["cmd"];
				 if(cmd=="open"){return ElfinderEvent.open(params);}//open directory and initializes data when no directory is defined (first iteration)
			else if(cmd=="parents"){return ElfinderEvent.parents(params);}//return parent directories and its subdirectory childs
			else if(cmd=="tree"){return ElfinderEvent.tree(params);}//return child directories
			else if(cmd=="mkdir"){return ElfinderEvent.mkdir(params);}//create directory
			else if(cmd=="rm"){return ElfinderEvent.rm(params);}//delete files/directories
			else if(cmd=="size"){return ElfinderEvent.size(params);}//return size for selected files or total folder(s) size
			else if(cmd=="rename"){return ElfinderEvent.rename(params);}//rename file
			else if(cmd=="mkfile"){return ElfinderEvent.mkfile(params);}//create text file
			else if(cmd=="ls"){return ElfinderEvent.ls(params);}//list files in directory
			else if(cmd=="duplicate"){return ElfinderEvent.duplicate(params);}//create copy of file
			else if(cmd=="paste"){return ElfinderEvent.paste(params);}//copy or move files
			else if(cmd=="archive"){return ElfinderEvent.archive(params);}//zip files
			else if(cmd=="extract"){return event.extract(params);}//unzip a file
			
		}catch(e){
			if (e instanceof Error)e=""+e;
			let errorMsg=""+Packages.efw.framework.getUsefulInfoFromException(e);
			//event id を明確に表すため、エラーをcatchしている。
			return (new Result()).error("RuntimeErrorException", {"eventId":"elfinder_"+params["cmd"],"message":errorMsg+""});
		}
	}
}
