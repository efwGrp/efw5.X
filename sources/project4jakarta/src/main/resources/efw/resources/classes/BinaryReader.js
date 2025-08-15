"use strict";
/**** efw5.X Copyright 2025 efwGrp ****/
/**
 * The class to read Binary file.
 * @author Chang kejun
 */
class BinaryReader extends Debuggable{
	/**
	 * Create instance
	 * 
	 * @param {String}
	 *			path: required<br>
	 * @param {Array}
	 *			aryFieldsDef: required<br>
	 * @param {Array}
	 *			aryEncoding: required<br>
	 * @param {Number}
	 *			rowSize: required<br>
	 * @param {Number}
	 *			skipRows: optional<br>
	 * @param {Number}
	 *			rowsToRead: optional<br>
	 */
	constructor(path, aryFieldsDef, aryEncoding, rowSize, skipRows, rowsToRead ){
		super();
		this.#path = path;
		this.#aryFieldsDef = aryFieldsDef;
		this.#aryEncoding = aryEncoding;
		this.#rowSize = rowSize;
		if (skipRows != null){this.#skipRows = skipRows;}
		if (rowsToRead != null){this.#rowsToRead = rowsToRead;}
	}
	/**
	 * Binary locker for openning reader
	 */
	#locker = Packages.efw.script.ScriptManager.getLocker();
	/**
	 * The attr to keep the path.
	 */
	#path = null;
	/**
	 * The attr to keep the aryFieldsDef.
	 */
	#aryFieldsDef = null;
	/**
	 * The attr to keep the aryEncoding.
	 */
	#aryEncoding = null;
	/**
	 * The attr to keep the rowSize.
	 */
	#rowSize = null;
	/**
	* The attr to keep the skipRows.
	 */
	#skipRows = -1;
	/**
	* The attr to keep the rowsToRead.
	 */
	#rowsToRead = -1;
	/**
	 * The function to read all lines into a matrix of arrays.
	 * 
	 * @returns {Array}
	 */
	readAllLines(){
		let aryLines = [];
		this.loopAllLines(callback);
		function callback(aryField,intNum){
			aryLines.push(aryField);
		}
		return aryLines;
	}
	/**
	 * The function to loop all lines for callback function calling.
	 * 
	 * @param {Function}
	 *            callback: required<br>
	 */
	loopAllLines(callback){
		let br=null;
		if (callback == null) {return;}
		try{
			let intNum = 0;
			try{
				this.#locker.lock();
				br = new java.io.FileInputStream(Packages.efw.file.FileManager.get(this.#path));
				if (this.#skipRows!=-1){
					br.skip(new java.lang.Long(""+(this.#skipRows*this.#rowSize)).longValue());
				}
			}finally{
				this.#locker.unlock();
			}
			let buf=java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, this.#rowSize);//ファイルから読み込むバファー
			let bufs=[];
			for(let i=0;i<this.#aryFieldsDef.length;i++){
				if (this.#aryEncoding[i]=="Cp939WithoutShiftInOut"){
					bufs[i]=java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, this.#aryFieldsDef[i]+2);
					bufs[i][0]=14;//shift in 
					bufs[i][this.#aryFieldsDef[i]+2-1]=15;//shift out
				}else{
					bufs[i]=java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, this.#aryFieldsDef[i]);
				}
			}
			while (br.read(buf) == this.#rowSize) {
				let fromP=0;
				let aryField=[];
				for(let i=0;i<this.#aryFieldsDef.length;i++){
					if (this.#aryEncoding[i]=="Cp939WithoutShiftInOut"){
						java.lang.System.arraycopy(buf, fromP, bufs[i], 1, this.#aryFieldsDef[i]);
						aryField.push(new java.lang.String(bufs[i],"Cp939"));
					}else if (this.#aryEncoding[i]=="S9"){
						java.lang.System.arraycopy(buf, fromP, bufs[i], 0, this.#aryFieldsDef[i]);
						let tmpS9=""+new java.lang.String(bufs[i],"Cp930");
						let retS9="";
						for(let indexS9=0;indexS9<tmpS9.length;indexS9++){
							let c=tmpS9[indexS9];
							if (c=="{"){retS9+="0";}
							else if (c=="0"){retS9+="0";}
							else if (c=="A"){retS9+="1";}
							else if (c=="1"){retS9+="1";}
							else if (c=="B"){retS9+="2";}
							else if (c=="2"){retS9+="2";}
							else if (c=="C"){retS9+="3";}
							else if (c=="3"){retS9+="3";}
							else if (c=="D"){retS9+="4";}
							else if (c=="4"){retS9+="4";}
							else if (c=="E"){retS9+="5";}
							else if (c=="5"){retS9+="5";}
							else if (c=="F"){retS9+="6";}
							else if (c=="6"){retS9+="6";}
							else if (c=="G"){retS9+="7";}
							else if (c=="7"){retS9+="7";}
							else if (c=="H"){retS9+="8";}
							else if (c=="8"){retS9+="8";}
							else if (c=="I"){retS9+="9";}
							else if (c=="9"){retS9+="9";}
							else if (c=="}"){retS9="-"+retS9+"0";}
							else if (c=="J"){retS9="-"+retS9+"1";}
							else if (c=="K"){retS9="-"+retS9+"2";}
							else if (c=="L"){retS9="-"+retS9+"3";}
							else if (c=="M"){retS9="-"+retS9+"4";}
							else if (c=="N"){retS9="-"+retS9+"5";}
							else if (c=="O"){retS9="-"+retS9+"6";}
							else if (c=="P"){retS9="-"+retS9+"7";}
							else if (c=="Q"){retS9="-"+retS9+"8";}
							else if (c=="R"){retS9="-"+retS9+"9";}
							else{retS9+=c;}
						}
						aryField.push(retS9.trim());
					}else{
						java.lang.System.arraycopy(buf, fromP, bufs[i], 0, this.#aryFieldsDef[i]);
						aryField.push(new java.lang.String(bufs[i],this.#aryEncoding[i]));
					}
					fromP+=this.#aryFieldsDef[i];
				}
				if (this.#rowsToRead!=-1 && intNum>=this.#rowsToRead){
					break;
				}else{
					callback(aryField, intNum+(this.#skipRows!=-1?this.#skipRows:0));
					intNum++;
				}
			}
		}finally{
			try{
				br.close();
			}catch(e){
			}
		}
	}
}