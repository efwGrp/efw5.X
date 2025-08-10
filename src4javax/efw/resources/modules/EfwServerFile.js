"use strict";
/**** efw5.X Copyright 2025 efwGrp ****/
/**
 * The class to operate file in storage.
 * 
 * @author Chang Kejun
 */
class EfwServerFile extends Debuggable{
	constructor(isAbsolutePath){
		super();
		this.isAbsolutePath=isAbsolutePath;
	}
	/**
	 * The function to judge whether a path exists or not. 
	 * @param {String} path
	 * @returns {Boolean}
	 */
	exists(path){
		let fl = this.isAbsolutePath
				?Packages.efw.file.FileManager.getByAbsolutePath(path)
				:Packages.efw.file.FileManager.get(path);
		if (fl.exists()) {
			return true;
		}else{
			return false;
		}
	}
	/**
	 * The function to judge whether a path is File or not. 
	 * @param {String} path
	 * @returns {Boolean}
	 */
	isFile(path){
		let fl = this.isAbsolutePath
				?Packages.efw.file.FileManager.getByAbsolutePath(path)
				:Packages.efw.file.FileManager.get(path);
		if (fl.isFile()) {
			return true;
		}else{
			return false;
		}
	}
	/**
	 * The function to judge whether a path is Folder or not. 
	 * @param {String} path
	 * @returns {Boolean}
	 */
	isFolder(path){
		let fl = this.isAbsolutePath
				?Packages.efw.file.FileManager.getByAbsolutePath(path)
				:Packages.efw.file.FileManager.get(path);
		if (fl.isDirectory()) {
			return true;
		}else{
			return false;
		}
	}
	/**
	 * The function to get all folders and files infomation in the relative folder path to the
	 * storage folder.
	 * 
	 * @param {String}
	 *            path: required<br>
	 * @param {Boolean}
	 *            withoutFolderLength: optional<br>
	 * @returns {Array}
	 * {name:String,<br>
	 * 		length:Number,<br>
	 * 		lastModified:Date,<br>
	 * 		absolutePath:String,<br>
	 * 		mineType:String,<br>
	 * 		isBlank:Boolean,<br>
	 * }<br>
	 */
	list(path,withoutFolderLength) {
		let lst = this.isAbsolutePath
				?Packages.efw.file.FileManager.getListByAbsolutePath(path)
				:Packages.efw.file.FileManager.getList(path);
		let ret = [];
		for (let i = 0; i < lst.length; i++) {
			let fl = lst[i];
			let lastModified = new Date();
			lastModified.setTime(fl.lastModified());
			let data = {
				"name" : "" + fl.getName(),
				"lastModified" : lastModified,
				"absolutePath" : "" + fl.getAbsolutePath(),
				"isHidden" : true && fl.isHidden(),
				"mineType" : "" + Packages.efw.file.FileManager.getMimeType(fl.getAbsolutePath()),
			};
			if (data.mineType=="directory"){
				if (withoutFolderLength==true){
					data["length"]= 0;
				}else{
					data["length"]= 0 + Packages.efw.file.FileManager.getFolderSize(fl);
				}
				if (fl.listFiles().length==0){
					data["isBlank"]=true;
				}else{
					data["isBlank"]=false;
				}
			}else{
				data["length"]= 0 + fl.length();
				if (data["length"]==0){
					data["isBlank"]=true;
				}else{
					data["isBlank"]=false;
				}
			}
			ret.push(data);
		}
		return ret;
	}
	/**
	 * The function to get the information of the relative path to the
	 * storage folder.
	 * 
	 * @param {String}
	 *            path: required<br>
	 * @param {Boolean}
	 *            withoutFolderLength: optional<br>
	 * @returns {null | Object}
	 * {name:String,<br>
	 * 		length:Number,<br>
	 * 		lastModified:Date,<br>
	 * 		absolutePath:String,<br>
	 * 		mineType:String,<br>
	 * 		isBlank:Boolean,<br>
	 * }<br>
	 */
	get(path,withoutFolderLength) {
		let fl = this.isAbsolutePath
				?Packages.efw.file.FileManager.getByAbsolutePath(path)
				:Packages.efw.file.FileManager.get(path);
		let lastModified = new Date();
		lastModified.setTime(fl.lastModified());
		let data = {
			"name" : "" + fl.getName(),
			"lastModified" : lastModified,
			"absolutePath" : "" + fl.getAbsolutePath(),
			"mineType" : "" + Packages.efw.file.FileManager.getMimeType(fl.getAbsolutePath()),
		};
		if (data.mineType=="directory"){
			if (withoutFolderLength==true){
				data["length"]= 0;
			}else{
				data["length"]= 0 + Packages.efw.file.FileManager.getFolderSize(fl);
			}
			if (fl.listFiles().length==0){
				data["isBlank"]=true;
			}else{
				data["isBlank"]=false;
			}
		}else{
			data["length"]= 0 + fl.length();
			if (data["length"]==0){
				data["isBlank"]=true;
			}else{
				data["isBlank"]=false;
			}
		}
		return data;
	}
	/**
	 * The function to remove a file or a folder by the relative path to the storage
	 * folder.
	 * 
	 * @param {String}
	 *            path: required<br>
	 */
	remove(path) {
		let fl = this.isAbsolutePath
				?Packages.efw.file.FileManager.getByAbsolutePath(path)
				:Packages.efw.file.FileManager.get(path);
		Packages.efw.file.FileManager.remove(fl);
	}
	/**
	 * The function to get the absolute path of the storage folder.
	 * 
	 * @returns {String}
	 */
	getStorageFolder() {
		return "" + Packages.efw.framework.getStorageFolder();
	}
	/**
	 * The function to save a single upload file to the relative path to the storage folder.
	 * 
	 * @param {String}
	 *            path: required<br>
	 */
	saveSingleUploadFile(path) {
		let fl = this.isAbsolutePath
				?Packages.efw.file.FileManager.getByAbsolutePath(path)
				:Packages.efw.file.FileManager.get(path);
		Packages.efw.file.FileManager.saveSingleUploadFile(fl);
	}
	/**
	 * The function to save upload files in the relative path to the storage folder.
	 * 
	 * @param {String}
	 *            path: required<br>
	 */
	saveUploadFiles(path) {
		let fl = this.isAbsolutePath
				?Packages.efw.file.FileManager.getByAbsolutePath(path)
				:Packages.efw.file.FileManager.get(path);
		Packages.efw.file.FileManager.saveUploadFiles(fl);
	}
	/**
	 * The function to make dirs by the relative path to the storage folder.
	 * @param {String}
	 *            path: required<br>
	 */
	makeDir(path) {
		let fl = this.isAbsolutePath
				?Packages.efw.file.FileManager.getByAbsolutePath(path)
				:Packages.efw.file.FileManager.get(path);
		Packages.efw.file.FileManager.makeDir(fl);
	}
	/**
	 * The function to read all from a text file with auto charset checking.
	 * @param {String}
	 *            path: required<br>
	 * @param {String}
	 *            encoding: optional<br>
	 * @returns {String}
	 */
	readAllLines(path, encoding){
		let fl = this.isAbsolutePath
				?Packages.efw.file.FileManager.getByAbsolutePath(path)
				:Packages.efw.file.FileManager.get(path);
		if (encoding==null||encoding=="")encoding="UTF-8";
		return ""+Packages.efw.file.FileManager.readAllLines(fl,encoding);
	}
	/**
	 * The function to rename a file by relative paths to the storage folder.
	 * @param {String}
	 *            orgPath: required<br>
	 * @param {String}
	 *            newName: required<br>
	 * @returns {String}
	 */
	rename(orgPath,newName){
		let fl = this.isAbsolutePath
				?Packages.efw.file.FileManager.getByAbsolutePath(orgPath)
				:Packages.efw.file.FileManager.get(orgPath);
		Packages.efw.file.FileManager.rename(fl,newName);
	}
	/**
	 * The function to move a file by relative paths to the storage folder.
	 * @param {String}
	 *            orgPath: required<br>
	 * @param {String}
	 *            newPath: required<br>
	 * @returns {String}
	 */
	move(orgPath,newPath){
		let orgfile = this.isAbsolutePath
				?Packages.efw.file.FileManager.getByAbsolutePath(orgPath)
				:Packages.efw.file.FileManager.get(orgPath);
		let newfile = this.isAbsolutePath
				?Packages.efw.file.FileManager.getByAbsolutePath(newPath)
				:Packages.efw.file.FileManager.get(newPath);
		Packages.efw.file.FileManager.move(orgfile,newfile);
	}
	/**
	 * The function to make an empty file by the relative path to the storage folder.
	 * @param {String}
	 *            path: required<br>
	 */
	makeFile(path) {
		let fl = this.isAbsolutePath
				?Packages.efw.file.FileManager.getByAbsolutePath(path)
				:Packages.efw.file.FileManager.get(path);
		Packages.efw.file.FileManager.makeFile(fl);
	}
	/**
	 * The function to write a text file by the relative path to the storage folder.
	 * @param {String}
	 *            path: required<br>
	 * @param {String}
	 *            content: required<br>
	 * @param {String}
	 *            encoding: optional<br>
	 */
	writeAllLines(path,content,encoding) {
		let fl = this.isAbsolutePath
				?Packages.efw.file.FileManager.getByAbsolutePath(path)
				:Packages.efw.file.FileManager.get(path);
		if(encoding==null)encoding="UTF-8";
		Packages.efw.file.FileManager.writeAllLines(fl,content,encoding);
	}
	/**
	 * The function to duplicate a file by  relative paths to the storage folder.
	 * @param {String}
	 *            srcPath: required<br>
	 * @param {String}
	 *            destPath: required<br>
	 */
	duplicate(srcPath,destPath) {
		let srcfl = this.isAbsolutePath
				?Packages.efw.file.FileManager.getByAbsolutePath(srcPath)
				:Packages.efw.file.FileManager.get(srcPath);
		let destfl = this.isAbsolutePath
				?Packages.efw.file.FileManager.getByAbsolutePath(destPath)
				:Packages.efw.file.FileManager.get(destPath);
		Packages.efw.file.FileManager.duplicate(srcfl,destfl);
	}
	/**
	 * The function to get a tempfile name in a folder.
	 * @returns {String}
	 *            the tempfile name
	 */
	getTempFileName() {
		return ""+Packages.efw.file.FileManager.getTempFileName();
	}
	/**
	 * The function to read all from a binary file.
	 * @param {String}
	 *            path: required<br>
	 * @returns {Bytes}
	 */
	readAllBytes(path){
		let fl = this.isAbsolutePath
				?Packages.efw.file.FileManager.getByAbsolutePath(path)
				:Packages.efw.file.FileManager.get(path);
		return Packages.efw.file.FileManager.readAllBytes(fl);
	}
	/**
	 * The function to write all binary bytes to a file.
	 * @param {Uinit8Array}
	 *            content: required<br>
	 * @param {String}
	 *            path: required<br>
	 * @returns {Bytes}
	 */
	writeAllBytes(path, content){
		let fl = this.isAbsolutePath
				?Packages.efw.file.FileManager.getByAbsolutePath(path)
				:Packages.efw.file.FileManager.get(path);
		return Packages.efw.file.FileManager.writeAllBytes(fl, content);
	}
}
///////////////////////////////////////////////////////////////////////////////
const file = new EfwServerFile(false);
const absfile = new EfwServerFile(true);
