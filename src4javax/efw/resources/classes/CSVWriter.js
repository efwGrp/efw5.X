"use strict";
/**** efw5.X Copyright 2025 efwGrp ****/
/**
 * The class to write CSV.<br>
 * @author Chang Kejun
 */
class CSVWriter extends Debuggable{
	/**
	 * Create instance
	 * @param {String}
	 *			path: required<br>
	 * @param {String}
	 *			separator: optional<br>
	 * @param {String}
	 *			delimiter: optional<br>
	 * @param {String}
	 *			encoding: required<br>
	 **/
	constructor(path, separator, delimiter, encoding){
		super();
		this.#path = path;
		if (separator != null){this.#separator = separator;}
		if (delimiter != null){this.#delimiter = delimiter;}
		if (encoding != null){this.#encoding = encoding;}
		this.#printWriter = Packages.efw.csv.CSVManager.open(path,this.#encoding);
	}
	/**
	 * The attr to keep the path.
	 */
	#path = null;
	/**
	 * The attr to keep the separator.
	 */
	#separator = ",";
	/**
	 * The attr to keep the delimiter.
	 */
	#delimiter = "\"";
	/**
	 * The attr to keep the encoding.
	 */
	#encoding = "UTF-8";
	/**
	 * The attr to keep the java writter.
	 */
	#printWriter = null;
	/**
	 * The function to close the java writter.
	 */
	close(){
		Packages.efw.csv.CSVManager.close(this.#path);
	}
	/**
	 * The function to write all lines into the file.
	 * @param {Array}
	 *            aryLines: required<br>
	 */
	writeAllLines(aryLines){
		let aryTemp = [];
	
		for (let i = 0; i < aryLines.length; i++) {
			aryTemp.push(this.#join(aryLines[i]));
		}
	
		file.writeAllLines(this.#path, aryTemp.join("\r\n"), this.#encoding);
	}
	/**
	 * The function to write an array into the file.
	 * @param {Array}
	 *            aryLine: required<br>
	 */
	writeLine(aryLine){
		let strLine = this.#join(aryLine);
		this.#printWriter.println(strLine);
	}
	/**
	 * The inner function to join an array into a string
	 * according to the separator and the delimiter.
	 * @param {Array}
	 *            aryLine: required<br>
	 * @returns {String}
	 */
	#join(aryLine){
		let lineValues=[];
	
		for (let i = 0; i < aryLine.length; i++) {
			let strValue = (aryLine[i] === undefined || aryLine[i] === null) ? '' : aryLine[i].toString();
			
			strValue=strValue.replace(/\r/g,"");
	
			if (strValue.indexOf(this.#delimiter) > -1) {
				strValue = strValue.replace(new RegExp(this.#delimiter, 'g'), this.#delimiter + this.#delimiter);
			}
	
			if (strValue.indexOf(this.#delimiter) > -1||strValue.indexOf(this.#separator) > -1||strValue.indexOf("\n") > -1) {
				strValue = this.#delimiter + strValue + this.#delimiter;
			}
	
			lineValues.push(strValue);
		}
	
		return lineValues.join(this.#separator);
	}
}
