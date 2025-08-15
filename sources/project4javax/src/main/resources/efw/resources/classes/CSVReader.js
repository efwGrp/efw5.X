"use strict";
/**** efw5.X Copyright 2025 efwGrp ****/
/**
 * The class to read CSV.<br>
 * @author Chang Kejun
 */
class CSVReader extends Debuggable{
	/**
	 * Create instance
	 *
	 * @param {String}
	 *			path: required<br>
	 * @param {String}
	 *			separator: optional<br>
	 * @param {String}
	 *			delimiter: optional<br>
	 * @param {String}
	 *			encoding: optional<br>
	 * @param {Number}
	 *			offsetBytes: optional<br>
	 * @param {Number}
	 *			offsetRows: optional<br>
	 * @param {Number}
	 *			skipRows: optional<br>
	 * @param {Number}
	 *			rowsToRead: optional<br>
	 **/
	constructor(path, separator, delimiter, encoding, skipRows, rowsToRead, offsetBytes, offsetRows){
		super();
		this.#path = path;
		if (separator != null){this.#separator = separator;}
		if (delimiter != null){this.#delimiter = delimiter;}
		if (encoding != null){this.#encoding = encoding;}
		if (skipRows != null){this.#skipRows = skipRows;}
		if (rowsToRead != null){this.#rowsToRead = rowsToRead;}
		if (offsetBytes != null){this.#offsetBytes = offsetBytes;}
		if (offsetRows != null){this.#offsetRows = offsetRows;}
		// compile the regEx str using the custom delimiter/separator
		// dealed with escape regex-specific control chars
		this.#match = new RegExp("(D|S|\n|\r|[^DS\r\n]+)"
							 .replace(/S/g, this.#separator.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"))
							 .replace(/D/g, this.#delimiter.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"))
							 , "gm");
	}
	/**
	 * CSV locker for openning reader
	 */
	#locker = Packages.efw.script.ScriptManager.getLocker();
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
	 * The attr to keep the match.
	 */
	#match = null;
	/**
	* The attr to keep the offsetBytes.
	 */
	#offsetBytes = -1;
	/**
	* The attr to keep the offsetRows.
	 */
	#offsetRows = -1;
	/**
	* The attr to keep the skipRows.
	 */
	#skipRows = -1;
	/**
	* The attr to keep the rowsToRead.
	 */
	#rowsToRead = -1;
	/**
	* The attr to keep the CRLFCode.
	 */
	#CRLFCode = "\r\n";
	/**
	 * The function to read all lines into a matrix of arrays.
	 * 
	 * @param {String}
	 *            CRLFCode: optional<br>
	 * @returns {Array}
	 */
	readAllLines(CRLFCode){
		if (CRLFCode!=null&&CRLFCode!=""){
			this.#CRLFCode=CRLFCode;
		}
		let aryLinesTemp = file.readAllLines(this.#path,this.#encoding).split(this.#CRLFCode);
		let aryLines = [];
	
		for (let i = 0; i < aryLinesTemp.length; i++) {
			aryLines.push(this.#split(aryLinesTemp[i]));
		}
	
		return aryLines;
	}
	/**
	 * The function to loop all lines for callback function calling.
	 * 
	 * @param {Function}
	 *            callback: required<br>
	 * @param {String}
	 *            CRLFCode: optional<br>
	 */
	loopAllLines(callback,CRLFCode){
		let br=null;
		if (callback == null) {return;}
		if (CRLFCode!=null&&CRLFCode!=""){
			this.#CRLFCode=CRLFCode;
		}
		try{
			try{
				this.#locker.lock();
				br = new Packages.efw.csv.CSVReader(
						new java.io.FileInputStream(Packages.efw.file.FileManager.get(this.#path)),
						this.#encoding,this.#CRLFCode);
			}finally{
				this.#locker.unlock();
			}
			let strLine;
			let intNum = 0;
			
			if (this.#offsetBytes!=-1){
				br.skip(this.#offsetBytes,this.#offsetRows);
			}
			if (this.#skipRows!=-1){
				for(let i=0;i<this.#skipRows;i++){
					br.readLine();
				}
			}
			while (true) {
				if (this.#rowsToRead!=-1 && intNum>=this.#rowsToRead) break;
				let strLine = br.readLine();if (strLine==null) break;
				let aryField = this.#split(strLine,intNum+(this.#skipRows!=-1?this.#skipRows:0)+(this.#offsetRows!=-1?this.#offsetRows:0));
				callback(aryField, intNum+(this.#skipRows!=-1?this.#skipRows:0)+(this.#offsetRows!=-1?this.#offsetRows:0));
				intNum++;
			}
			this.#offsetBytes=0+br.getCurrentOffsetBytes();
			this.#offsetRows=0+br.getCurrentOffsetRows();
		}finally{
			try{
				br.close();
			}catch(e){}
		}
	}
	/**
	 * The inner function to split a string to array 
	 * according to the separator and the delimiter.
	 * 
	 * @param {String}
	 *            rowdata: required<br>
	 * @returns {Array}
	 */
	#split (rowdata,index) {
		//the array for return
		let entry = [];
		//0:start,
		//1:the opening delimiter has dealed,
		//2:a second delimiter has dealed,
		//3:a un-delimited char has dealed
		let state = 0;
		//to keep all chars in one field
		let value = "";
		
		let separator = this.#separator;
		let delimiter = this.#delimiter;
	
		// process control chars individually, use look-ahead on non-control chars
		rowdata.replace(this.#match, function(m0) {
			switch (state) {
				// the start of a value
				case 0:
					// null last value
					if (m0 === separator) {
						value += "";
						entry.push(value);value = "";state = 0;
						break;
					}
					// opening delimiter
					if (m0 === delimiter) {
						state = 1;
						break;
					}
					// skip un-delimited new-lines
					if (m0 === "\n" || m0 === "\r") {
						break;
					}
					// un-delimited value
					value += m0;
					state = 3;
					break;
	
					// delimited input
				case 1:
					// second delimiter? check further
					if (m0 === delimiter) {
						state = 2;
						break;
					}
					// delimited data
					value += m0;
					state = 1;
					break;
	
					// delimiter found in delimited input
				case 2:
					// escaped delimiter?
					if (m0 === delimiter) {
						value += m0;
						state = 1;
						break;
					}
					// null value
					if (m0 === separator) {
						entry.push(value);value = "";state = 0;
						break;
					}
					// skip un-delimited new-lines
					if (m0 === '\n' || m0 === '\r') {
						break;
					}
					// broken paser?
					throw new Packages.efw.CsvTxtDataException("Illegal state",index,rowdata);
					// un-delimited input
				case 3:
					// null last value
					if (m0 === separator) {
						entry.push(value);value = "";state = 0;
						break;
					}
					// skip un-delimited new-lines
					if (m0 === '\n' || m0 === '\r') {
						break;
					}
					// non-compliant data
					if (m0 === delimiter) {
						throw new Packages.efw.CsvTxtDataException("Illegal quote",index,rowdata);
					}
					// broken parser?
					throw new Packages.efw.CsvTxtDataException("Illegal data",index,rowdata);
				default:
					// shenanigans
					throw new Packages.efw.CsvTxtDataException("Unknown state",index,rowdata);
			}
		});
	
		// submit the last value
		entry.push(value);value = "";state = 0;
		return entry;
	}
}
