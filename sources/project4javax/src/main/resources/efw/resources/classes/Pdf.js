"use strict";
/**** efw5.X Copyright 2025 efwGrp ****/
/**
 * The class to operate Pdf.
 * 
 * @author Chang Kejun
 */
class Pdf extends Debuggable{
	/**
	 * Create instance
	 * Even you want to create a new pdf file, you must create it from a template file.
	 *
	 * @param {String}
	 *            path: required
	 */
	constructor(path){
		super();
		this.#pdf = Packages.efw.pdf.PdfManager.open(path);
	}
	/**
	 * The inner object to keep the operating pdf.
	 */
	#pdf = null;
	/**
	 * The function to save the pdf object to a file.
	 * @param {String} path: required. <br>
	 * The relative path and file name to the storage folder.
	 */
	save(path) {
		this.#pdf.save(path);
		return this;
	}
	/**
	 * The function to close the handle to free the pdf file.
	 */
	close() {
		Packages.efw.pdf.PdfManager.close(this.#pdf.getKey());
	}
	/**
	 * The function to set the value in the form field.
	 */
	setField(fieldName,fieldValue) {
		if (fieldValue==null)fieldValue="";
		this.#pdf.setField(fieldName,fieldValue);
		return this;
	}
	/**
	 * The function to convert the html string to a pdf.
	 */
	static html2pdf(html,baseUrl,pdfPath,fontsPath,fontsPathIsAbs){
		let fl = fontsPathIsAbs
				?Packages.efw.file.FileManager.getByAbsolutePath(fontsPath)
				:Packages.efw.file.FileManager.get(fontsPath);
		Packages.efw.pdf.PdfManager.html2pdf(html,baseUrl,pdfPath,fl);
	}
	/**
	 * The function to get a names array of all fonts contained in the path.
	 */
	static getFontNames(fontsPath,fontsPathIsAbs){
		let fl = fontsPathIsAbs
				?Packages.efw.file.FileManager.getByAbsolutePath(fontsPath)
				:Packages.efw.file.FileManager.get(fontsPath);
		let ary=Packages.efw.pdf.PdfManager.getFontNames(fl);
		let ret=[];
		for (let i=0;i<ary.length;i++){
			ret.push(""+ary[i]);
		}
		return ret;
	}
}
