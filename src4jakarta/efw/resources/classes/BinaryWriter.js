"use strict";
/**** efw5.X Copyright 2025 efwGrp ****/
/**
 * The class to write binary file.
 * @param {String}
 *			path: required<br>
 * @author Chang Kejun
 */
class BinaryWriter extends Debuggable{
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
	 */
	constructor(path,aryFieldsDef,aryEncoding,rowSize){
		super();
		this.#path = path;
		this.#aryFieldsDef = aryFieldsDef;
		this.#aryEncoding = aryEncoding;
		this.#rowSize = rowSize;
		this.#printWriter = Packages.efw.binary.BinaryManager.open(path);
	}
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
	 * The attr to keep the java writter.
	 */
	#printWriter = null;
	/**
	 * The function to close the java writter.
	 */
	close(){
		Packages.efw.binary.BinaryManager.close(this.#path);
	}
	/**
	 * The function to write all lines into the file.
	 * @param {Array}
	 *            aryLines: required<br>
	 */
	writeAllLines(aryLines){
		let buf=java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, this.#rowSize*aryLines.length);//ファイルから読み込むバファー
	
		for (let i = 0; i < aryLines.length; i++) {
			let buf4row=this.#join(aryLines[i]);
			java.lang.System.arraycopy(buf4row, 0, buf, this.#rowSize*i, this.#rowSize);
		}
		file.writeAllBytes(this.#path,buf);
	}
	/**
	 * The function to write an array into the file.
	 * @param {Array}
	 *            aryLine: required<br>
	 */
	writeLine(aryLine){
		let buf = this.#join(aryLine);
		this.#printWriter.write(buf);
	}
	/**
	 * The inner function to join an array into a buffer
	 * @param {Array}
	 *            aryLine: required<br>
	 * @returns {String}
	 */
	#join(aryLine){
		let bufs=[];
		for(let i=0;i<this.#aryFieldsDef.length;i++){
			if (this.#aryEncoding[i]=="Cp939WithoutShiftInOut"){
				bufs[i]=java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, this.#aryFieldsDef[i]+2);
				for(let j=0;j<bufs[i].length;j++){bufs[i][j]=32}
				bufs[i][0]=14;//shift in 
				bufs[i][this.#aryFieldsDef[i]+2-1]=15;//shift out
				let buf4item=new java.lang.String(""+aryLine[i]).getBytes("Cp939");
				let copyLength=Math.min(buf4item.length,this.#aryFieldsDef[i]);
				java.lang.System.arraycopy(buf4item, 0, bufs[i], 1, copyLength);
				
			}else if (this.#aryEncoding[i]=="S9"){
				bufs[i]=java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, this.#aryFieldsDef[i]);
				for(let j=0;j<bufs[i].length;j++){bufs[i][j]=32}
				let buf4item=new java.lang.String(""+aryLine[i]).getBytes("Cp930");
				let copyLength=Math.min(buf4item.length,this.#aryFieldsDef[i]);
				java.lang.System.arraycopy(buf4item, 0, bufs[i], 0, copyLength);
				
			}else{
				bufs[i]=java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, this.#aryFieldsDef[i]);
				for(let j=0;j<bufs[i].length;j++){bufs[i][j]=32}
				let buf4item=new java.lang.String(""+aryLine[i]).getBytes(this.#aryEncoding[i]);
				let copyLength=Math.min(buf4item.length,this.#aryFieldsDef[i]);
				java.lang.System.arraycopy(buf4item, 0, bufs[i], 0, copyLength);
			}
		}
		let fromP=0;
		let buf=java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, this.#rowSize);//ファイルから読み込むバファー
		for(let i=0;i<this.#aryFieldsDef.length;i++){
			if (this.#aryEncoding[i]=="Cp939WithoutShiftInOut"){
				java.lang.System.arraycopy(bufs[i], 1, buf, fromP, this.#aryFieldsDef[i]);
			}else{
				java.lang.System.arraycopy(bufs[i], 0, buf, fromP, this.#aryFieldsDef[i]);
			}
			fromP+=this.#aryFieldsDef[i];
		}
		return buf;
	}
}

