"use strict";
/**** efw4.X Copyright 2019 efwGrp ****/
class ElfinderEvent{
	static paramsFormat = {};
	///////////////////////////////////////////////////////////////////////////
	/**
	 * リスクチェック関数
	 */
	static checkRisk(params){
		let volumeId="EFW_";
		let id=params["id"];//elfinderのid
		let home=params["home"];//ホームフォルダ、ストレージフォルダからの相対位置
		let isAbs=params["isAbs"];//絶対パスかどうか
		let readonly=params["readonly"];//参照のみかどうか,true,false
		let target=params["target"];
		let targets=params["targets"];
	
		let reg=session.get("EFW_ELFINDER_PROTECTED_"+id);
		if (reg==null){//指定idは、初期化されたかどうか
			return (new Result()).alert("{ElFinderSessionTimeoutMessage}");
		}else if (reg=="true"){
			let sessionHome=session.get("EFW_ELFINDER_HOME_"+id)+"";
			let sessionIsAbs=session.get("EFW_ELFINDER_ISABS_"+id)+"";
			if (sessionIsAbs=="true")sessionIsAbs=true;
			if (sessionIsAbs=="false")sessionIsAbs=false;
			let sessionReadonly=session.get("EFW_ELFINDER_READONLY_"+id)+"";
			if (sessionReadonly=="true")sessionReadonly=true;
			if (sessionReadonly=="false")sessionReadonly=false;
			if(home!=sessionHome||isAbs!=sessionIsAbs||readonly!=sessionReadonly){
				return (new Result()).alert("{ElFinderIsProtectedMessage}");
			}
		}
		
		if (!isAbs){//相対パスの場合
			params["file"]=file;
		}else{//絶対パスの場合
			params["file"]=absfile;
		}
		if (home.indexOf("..")>-1){
			return (new Result()).alert("{ElFinderHackingRiskMessage}");
		}else if(!params["file"].exists(home)){
			return (new Result()).alert("{ElFinderHomeNotExistsMessage}");
		}
		if (target!=null){
			let cwdFile=target.substring(volumeId.length).base64Decode();
			if (cwdFile!=""){
				if (cwdFile.indexOf(home)!=0||cwdFile.indexOf("..")>-1){
					return (new Result()).alert("{ElFinderHackingRiskMessage}");
				}
			}
		}
		if (targets!=null){
			for(let i=0;i<targets.length;i++){
				let target=targets[i];
				let cwdFile=target.substring(volumeId.length).base64Decode();
				if (cwdFile!=""){
					if (cwdFile.indexOf(home)!=0||cwdFile.indexOf("..")>-1){
						return (new Result()).alert("{ElFinderHackingRiskMessage}");
					}
				}
			}
		}
		return null;
	}
	///////////////////////////////////////////////////////////////////////////
	/**
	 * 開く関数、画面初期化 と フォルダを開く 操作で実行される
	 */
	static open(params) {
		let file=params.file;
		let volumeId="EFW_";
		let home=params["home"];//ホームフォルダ、ストレージフォルダからの相対位置
		let readonly=params["readonly"];//参照のみかどうか,true,false
		let id=params["id"];//elfinderのid
		let init=params["init"];//初回表示かどうか、1,0
		let target=params["target"];//初回以降はcwdのhashになる。
		let saveupload=params["saveupload"];//アップロード後の再表示のため。1,0
		//---------------------------------------------------------------------
		let options={
			"uploadMaxConn":-1,		//アップロードファイルは分割しない
			"archivers": {
				"create": [
					"application\/zip"
				],
				"extract": [
					"application\/zip"
				],
				"createext": {
					"application\/zip": "zip"
				}
			},
		};
	
		//---------------------------------------------------------------------
		let cwdFolder="";
		let folderinfo;
		if (init==1){//初期表示
			cwdFolder=home;
		}else{
			cwdFolder=target.substring(volumeId.length).base64Decode();
		}
		//---------------------------------------------------------------------
	//	if (saveupload==1){//この機能をここでの実装をやめて、uploadServletに移しました。
	//		file.saveUploadFiles(cwdFolder);
	//	};
		//---------------------------------------------------------------------
		folderinfo=file.get(cwdFolder,true);
		let cwd={
			"mime":"directory",	
			"volumeid":volumeId,
			"dirs":1,
			"read":1,
			"ts":parseInt(folderinfo.lastModified.getTime()/1000),
			"size":folderinfo.length,
			"hash":volumeId+cwdFolder.base64EncodeURI(),
		};
		
		if (cwdFolder==home){
			cwd.name="home";
		}else{
			cwd.name=folderinfo.name;
			cwd.phash=volumeId+cwdFolder.substring(0, cwdFolder.length-folderinfo.name.length-1).base64EncodeURI();
		}
		if (readonly){
			cwd.write=0;
			cwd.locked=1;
		}else{
			cwd.write=1;
			cwd.locked=0;
		}
		//---------------------------------------------------------------------
		let files=new Record(file.list(cwdFolder,true))
		.seek("isHidden","eq",false)
		.map({
	         "mime":"mineType",//function(){return "directory";},
	         "ts":function(data){return parseInt(data.lastModified.getTime()/1000);},
	         "size":"length",
	         "hash":function(data){return volumeId+(cwdFolder+"/"+data.name).base64EncodeURI();},
	         "name":"name",
	         "phash":function(){return cwd.hash;},
	         "dirs":function(data){if(data.mineType=="directory"&&!data.isBlank){return 1;}else{return 0;}},
	         "read":function(){return 1;},
	         "write":function(){if (readonly){return 0;}else{return 1;}},
	         "locked":function(){if (readonly){return 1;}else{return 0;}},
		})
		.getArray();
		files.unshift(cwd);
		let ret={};
		if (init){
			ret.cwd=cwd;
			ret.options=options;
			ret.api=2.1;//If it is init ,api must be returned or you can not return it.
			ret.files=files;
			if (params.selection){
				if (params.selection.substring(0,1)=="/")params.selection=params.selection.substring(1);
				if (home.substring(home.length-1,1)=="/")home=home.substring(0,home.length-1);
				let selection=home+"/"+params.selection;
				ret.selectedFileHash=volumeId+selection.base64EncodeURI();
				ret.selectedFolderHash=
					volumeId+selection.substring(0,selection.lastIndexOf("/")).base64EncodeURI();
			}
		}else{
			ret.cwd=cwd;
			ret.options=options;
			ret.files=files;
		};
		return ret;
	}
	///////////////////////////////////////////////////////////////////////////
	/**
	 * 親フォルダ取得、elfinderの右側更新時利用される
	 */
	static parents(params) {
		let file=params.file;
		let readonly=params["readonly"];//参照のみかどうか,true,false
		let volumeId="EFW_";
		let home=params["home"];//ホームフォルダ、ストレージフォルダからの相対位置
		let target=params["target"];
		let targetFolder=""+target.substring(volumeId.length).base64Decode();
	
		let folders=[];
		while(true){
			folders=folders.concat(new Record(file.list(targetFolder,true))
			.seek("mineType","eq","directory")
			.map({
		         "mime":"mineType",//function(){return "directory";},
		         "ts":function(data){return parseInt(data.lastModified.getTime()/1000);},
		         "size":"length",
		         "hash":function(data){return volumeId+(targetFolder+"/"+data.name).base64EncodeURI();},
		         "name":"name",
		         "phash":function(data){return volumeId+(targetFolder).base64EncodeURI();},
		         "dirs":function(data){if(data.mineType=="directory"&&!data.isBlank){return 1;}else{return 0;}},
		         "read":function(){return 1;},
		         "write":function(){if (readonly){return 0;}else{return 1;}},
		         "locked":function(){if (readonly){return 1;}else{return 0;}},
			}).getArray());
			
			if (targetFolder.lastIndexOf("/")==-1||targetFolder==home){
				folders.push(new Record([file.get(targetFolder,true)])
				.map({
			         "mime":"mineType",//function(){return "directory";},
			         "ts":function(data){return parseInt(data.lastModified.getTime()/1000);},
			         "size":"length",
			         "hash":function(data){return volumeId+(targetFolder).base64EncodeURI();},
			         "name":function(){return "home";},
			         "phash":function(data){return "";},
			         "dirs":function(data){if(data.mineType=="directory"&&!data.isBlank){return 1;}else{return 0;}},
			         "read":function(){return 1;},
			         "write":function(){if (readonly){return 0;}else{return 1;}},
			         "locked":function(){if (readonly){return 1;}else{return 0;}},
			         
				}).getSingle());
				break;
			}else{
				targetFolder=targetFolder.substring(0,targetFolder.lastIndexOf("/"));
			}
		}
		return {"tree":folders};
	}
	///////////////////////////////////////////////////////////////////////////
	/**
	 * ツリー取得、右側でフォルダ名変更後、左側で親フォルダを再クリック時利用される
	 */
	static tree(params) {
		let file=params.file;
		let readonly=params["readonly"];//参照のみかどうか,true,false
		let volumeId="EFW_";
		let target=params["target"];
		let targetFolder=""+target.substring(volumeId.length).base64Decode();
	
		let folders=new Record(file.list(targetFolder,true))
		.seek("isHidden","eq",false)
		.seek("mineType","eq","directory")
		.map({
	         "mime":"mineType",//function(){return "directory";},
	         "ts":function(data){return parseInt(data.lastModified.getTime()/1000);},
	         "size":"length",
	         "hash":function(data){return volumeId+(targetFolder+"/"+data.name).base64EncodeURI();},
	         "name":"name",
	         "phash":function(data){return volumeId+(targetFolder).base64EncodeURI();},
	         "dirs":function(data){if(data.mineType=="directory"&&!data.isBlank){return 1;}else{return 0;}},
	         "read":function(){return 1;},
	         "write":function(){if (readonly){return 0;}else{return 1;}},
	         "locked":function(){if (readonly){return 1;}else{return 0;}},
		}).getArray();
	
		return {"tree":folders};
	}
	///////////////////////////////////////////////////////////////////////////
	/**
	 * フォルダ作成、フォルダ作成時利用される
	 */
	static mkdir(params) {
		let file=params.file;
		let volumeId="EFW_";
		let readonly=params["readonly"];//参照のみかどうか,true,false
		let target=params["target"];//初回以降はcwdのhashになる。
		let cwdFolder=target.substring(volumeId.length).base64Decode();
		let name=params["name"];
		let dirs=params["dirs"];
		
		function mkdr(name){
			file.makeDir(cwdFolder+"/"+name);
			return new Record([file.get(cwdFolder+"/"+name,true)])
			.map({
		         "mime":"mineType",//function(){return "directory";},
		         "ts":function(data){return parseInt(data.lastModified.getTime()/1000);},
		         "size":"length",
		         "hash":function(data){return volumeId+(cwdFolder+"/"+data.name).base64EncodeURI();},
		         "name":"name",
		         "phash":function(){return target;},
		         "dirs":function(data){if(data.mineType=="directory"&&!data.isBlank){return 1;}else{return 0;}},
		         "read":function(){return 1;},
		         "write":function(){if (readonly){return 0;}else{return 1;}},
		         "locked":function(){if (readonly){return 1;}else{return 0;}},
			}).getArray();
		}
		
		if (name!=null){
			return {"added":mkdr(name)};
		}else{
			let ret=[];
			for(let i=0;i<dirs.length;i++){
				name=dirs[i];
				ret.concat(mkdr(name));
			}
			return {"added":ret};
		}
	}
	///////////////////////////////////////////////////////////////////////////
	/**
	 * 削除、ファイルまたはフォルダを削除時利用される
	 */
	static rm(params) {
		let file=params.file;
		let volumeId="EFW_";
		let targets=params["targets"];
		for(let i=0;i<targets.length;i++){
			let target=targets[i];
			let cwdFolder=target.substring(volumeId.length).base64Decode();
			file.remove(cwdFolder);
		}
		return {"removed":targets};
	}
	///////////////////////////////////////////////////////////////////////////
	/**
	 * サイズ取得、情報ダイアログでフォルダのサイズを閲覧時利用される
	 */
	static size(params) {
		let file=params.file;
		let volumeId="EFW_";
		let targets=params["targets"];
		let size=0;
		for(let i=0;i<targets.length;i++){
			let target=targets[i];
			let cwdFolder=target.substring(volumeId.length).base64Decode();
			let info=file.get(cwdFolder);//ここだけサイズを取る
			size+=info.length;
		}
		return {"size":size};
	}
	///////////////////////////////////////////////////////////////////////////
	/**
	 * 名称変更、ファイルまたはフォルダ名変更時利用される
	 */
	static rename(params) {
		let file=params.file;
		let volumeId="EFW_";
		let target=params["target"];
		let name=params["name"];
		let readonly=params["readonly"];//参照のみかどうか,true,false
		let cwdFile=target.substring(volumeId.length).base64Decode();
		let cwdParentFolder=cwdFile.substring(0,cwdFile.lastIndexOf("/"));
		let newFilePath=cwdParentFolder+"/"+name;
		file.rename(cwdFile, name);
	
		let files=new Record([file.get(newFilePath,true)])
		.map({
	         "mime":"mineType",//function(){return "directory";},
	         "ts":function(data){return parseInt(data.lastModified.getTime()/1000);},
	         "size":"length",
	         "hash":function(data){return volumeId+(newFilePath).base64EncodeURI();},
	         "name":"name",
	         "phash":function(){return volumeId+(cwdParentFolder).base64EncodeURI();},
	         "dirs":function(data){if(data.mineType=="directory"&&!data.isBlank){return 1;}else{return 0;}},
	         "read":function(){return 1;},
	         "write":function(){if (readonly){return 0;}else{return 1;}},
	         "locked":function(){if (readonly){return 1;}else{return 0;}},
		})
		.getArray();
		return {"added":files,"removed":[target]};
	}
	///////////////////////////////////////////////////////////////////////////
	/**
	 * テキストファイル作成、空のテキストファイルを作成時利用される
	 */
	static mkfile(params) {
		let file=params.file;
		let volumeId="EFW_";
		let readonly=params["readonly"];//参照のみかどうか,true,false
		let target=params["target"];//初回以降はcwdのhashになる。
		let cwdFolder=target.substring(volumeId.length).base64Decode();
		let name=params["name"];
		file.makeFile(cwdFolder+"/"+name);
		let files=new Record([file.get(cwdFolder+"/"+name,true)])
		.map({
	         "mime":"mineType",//function(){return "directory";},
	         "ts":function(data){return parseInt(data.lastModified.getTime()/1000);},
	         "size":"length",
	         "hash":function(data){return volumeId+(cwdFolder+"/"+data.name).base64EncodeURI();},
	         "name":"name",
	         "phash":function(){return target;},
	         "dirs":function(data){if(data.mineType=="directory"&&!data.isBlank){return 1;}else{return 0;}},
	         "read":function(){return 1;},
	         "write":function(){if (readonly){return 0;}else{return 1;}},
	         "locked":function(){if (readonly){return 1;}else{return 0;}},
		})
		.getArray();
	
		return {"added":files};
	}
	///////////////////////////////////////////////////////////////////////////
	/**
	 * フォルダ中身一覧取得、アップロードする前、格納先のフォルダ中身と重複有無を確認するため利用される
	 */
	static ls(params) {
		let file=params.file;
		let volumeId="EFW_";
		let target=params["target"];
		let intersect=params["intersect"];
		let cwdFolder=target.substring(volumeId.length).base64Decode();
		let files=new Record(file.list(cwdFolder,true)).seek("isHidden","eq",false);
		let list=[];
		for(let i=0;i<intersect.length;i++){
			if (files.seek("name", "eq", intersect[i]).length>0){
				list.push(intersect[i]);
			}
		}
		return {"list":list};
	}
	///////////////////////////////////////////////////////////////////////////
	/**
	 * 複製、複製ボタンの処理。
	 */
	static duplicate(params) {
		let file=params.file;
		let volumeId="EFW_";
		let readonly=params["readonly"];//参照のみかどうか,true,false
		let targets=params["targets"];
		let files=[];
		for (let i=0;i<targets.length;i++){
			let target=targets[i];
			let cwdFile=target.substring(volumeId.length).base64Decode();
			let parentPath=cwdFile.substring(0,cwdFile.lastIndexOf("/"));
			let lastIndex=cwdFile.lastIndexOf(".");
			let pre="",ext="";
			if (lastIndex==-1){
				pre=cwdFile;
			}else if (lastIndex<parentPath.length){//フォルダ名に.がある場合
				pre=cwdFile;
			}else{
				pre=cwdFile.substring(0,lastIndex);
				ext=cwdFile.substring(lastIndex);
			}
			
			let newFile="";
			if (file.exists(pre+"_copy"+ext)){
				let j=1;
				while(file.exists(pre+"_copy"+j+ext)){j++;}
				newFile=pre+"_copy"+j+ext;
			}else{
				newFile=pre+"_copy"+ext;
			}
			
			file.duplicate(cwdFile,newFile);
	
			files.push((new Record([file.get(newFile,true)]))
			.map({
		         "mime":"mineType",//function(){return "directory";},
		         "ts":function(data){return parseInt(data.lastModified.getTime()/1000);},
		         "size":"length",
		         "hash":function(data){return volumeId+(newFile).base64EncodeURI();},
		         "name":"name",
		         "phash":function(){return volumeId+(parentPath).base64EncodeURI();},
		         "dirs":function(data){if(data.mineType=="directory"&&!data.isBlank){return 1;}else{return 0;}},
		         "read":function(){return 1;},
		         "write":function(){if (readonly){return 0;}else{return 1;}},
		         "locked":function(){if (readonly){return 1;}else{return 0;}},
			}).getSingle());
		}
		return {"added":files};
	}
	///////////////////////////////////////////////////////////////////////////
	/**
	 * 貼り付け、ペーストボタンの処理
	 */
	static paste(params) {
		let file=params.file;
		let volumeId="EFW_";
		let readonly=params["readonly"];//参照のみかどうか,true,false
		//let src=params["src"];//コピーファイルの場所
		let targets=params["targets"];//コピーファイル（複数可）
		let dst=params["dst"];//貼付け場所
		let cut=params["cut"];//0,1 cut or not
		let hashes=params["hashes"];//重複したキー
		let files=[];
		let dstParentPath=dst.substring(volumeId.length).base64Decode();
		for (let i=0;i<targets.length;i++){
			let target=targets[i];
			let srcFile=target.substring(volumeId.length).base64Decode();
			let fileName=srcFile.substring(srcFile.lastIndexOf("/")+1);
			let dstFile=dstParentPath+"/"+fileName;
			file.duplicate(srcFile,dstFile);
			if (cut==1){
				file.remove(srcFile);
			}
			let newItem=(new Record([file.get(dstFile,true)]))
				.map({
			         "mime":"mineType",//function(){return "directory";},
			         "ts":function(data){return parseInt(data.lastModified.getTime()/1000);},
			         "size":"length",
			         "hash":function(data){return volumeId+(dstFile).base64EncodeURI();},
			         "name":"name",
			         "phash":function(){return volumeId+(dstParentPath).base64EncodeURI();},
			         "dirs":function(data){if(data.mineType=="directory"&&!data.isBlank){return 1;}else{return 0;}},
			         "read":function(){return 1;},
			         "write":function(){if (readonly){return 0;}else{return 1;}},
			         "locked":function(){if (readonly){return 1;}else{return 0;}},
				}).getSingle();
	
			if (hashes!=null){
				if (hashes[target]==null){
					files.push(newItem);
				}
			}else{
				files.push(newItem);
			}
		}
		let ret={"added":files};
		if (cut==1){
			ret["removed"]=targets;
		}
		return ret;
	}
	///////////////////////////////////////////////////////////////////////////
	/**
	 * 圧縮関数、アーカイブ作成ボタンの処理。
	 */
	static archive (params) {
		let file=params.file;
		let volumeId="EFW_";
		let readonly=params["readonly"];//参照のみかどうか,true,false
		let targets=params["targets"];
		let zipName=params["name"];
		let parentPath=params["target"].substring(volumeId.length).base64Decode();
		let newFile=parentPath+"/"+zipName;
		let isAbs=params["isAbs"];
		//圧縮対象の配列を作成する
		let files=[];
		for (let i=0;i<targets.length;i++){
			let target=targets[i];
			let cwdFile=target.substring(volumeId.length).base64Decode();
			files.push(cwdFile);
		}
		//圧縮する
		Packages.efw.file.FileManager.zip(newFile,isAbs, files, parentPath,isAbs, null);
		//圧縮ファイル情報を取得する
		let target=(new Record([file.get(newFile,true)]))
		.map({
	         "mime":"mineType",//function(){return "directory";},
	         "ts":function(data){return parseInt(data.lastModified.getTime()/1000);},
	         "size":"length",
	         "hash":function(){return volumeId+(newFile).base64EncodeURI();},
	         "name":"name",
	         "phash":function(){return volumeId+(parentPath).base64EncodeURI();},
	         "dirs":function(data){if(data.mineType=="directory"&&!data.isBlank){return 1;}else{return 0;}},
	         "read":function(){return 1;},
	         "write":function(){if (readonly){return 0;}else{return 1;}},
	         "locked":function(){if (readonly){return 1;}else{return 0;}},
		}).getSingle();
		//圧縮ファイル情報を戻す
		return {"added":[target]};
	}
	///////////////////////////////////////////////////////////////////////////
	/**
	 * 解凍、解凍ボタンの処理
	 */
	static extract(params) {
		let file=params.file;
		let volumeId="EFW_";
		let readonly=params["readonly"];//参照のみかどうか,true,false
		let isAbs=params["isAbs"];
		let makedir=params["makedir"];
		let fromZipPath=params["target"].substring(volumeId.length).base64Decode();
		let parentPath=fromZipPath.substring(0,fromZipPath.lastIndexOf("/"));
		let currentPath=parentPath;
		let zipNameWithoutExt=fromZipPath.substring(fromZipPath.lastIndexOf("/")+1,fromZipPath.lastIndexOf("."));
		//解凍する前のファイル配列情報
		let before=(new Record(file.list(currentPath,true)))
		.map({
			 "mime":"mineType",//function(){return "directory";},
			 "ts":function(data){return parseInt(data.lastModified.getTime()/1000);},
			 "size":"length",
			 "hash":function(data){return volumeId+(currentPath+"/"+data.name).base64EncodeURI();},
			 "name":"name",
			 "phash":function(){return volumeId+(currentPath).base64EncodeURI();},
			 "dirs":function(data){if(data.mineType=="directory"&&!data.isBlank){return 1;}else{return 0;}},
			 "read":function(){return 1;},
			 "write":function(){if (readonly){return 0;}else{return 1;}},
			 "locked":function(){if (readonly){return 1;}else{return 0;}},
		}).getArray();
		//必要の場合解凍先フォルダを作成する
		if (makedir=="1"){
			parentPath=parentPath+"/"+zipNameWithoutExt;
			if (!file.exists(parentPath)){
				file.makeDir(parentPath);
			}
		}
		//解凍する
		Packages.efw.file.FileManager.unZip(fromZipPath,isAbs, parentPath,isAbs);
		//解凍後のファイル配列情報
		let after=(new Record(file.list(currentPath,true)))
		.map({
			 "mime":"mineType",//function(){return "directory";},
			 "ts":function(data){return parseInt(data.lastModified.getTime()/1000);},
			 "size":"length",
			 "hash":function(data){return volumeId+(currentPath+"/"+data.name).base64EncodeURI();},
			 "name":"name",
			 "phash":function(){return volumeId+(currentPath).base64EncodeURI();},
			 "dirs":function(data){if(data.mineType=="directory"&&!data.isBlank){return 1;}else{return 0;}},
			 "read":function(){return 1;},
			 "write":function(){if (readonly){return 0;}else{return 1;}},
			 "locked":function(){if (readonly){return 1;}else{return 0;}},
		}).getArray();
		//差分を取る
		let targets=[];
		for(let i=0;i<after.length;i++){
			let created=true;
			for(let j=0;j<before.length;j++){
				if (after[i].name==before[j].name){
					created=false;
					break;
				}
			}
			if (created){
				targets.push(after[i]);
			}
		}
		//差分情報を戻す
		return {"added":targets};
	}
}
