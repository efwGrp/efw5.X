"use strict";
/**** efw5.X Copyright 2025 efwGrp ****/
/**
 * The class to operate Excel.
 * @author Chang Kejun
 */
class Excel extends Debuggable{
	/**
	 * Create instance
	 * 
	 * @param {String}
	 *            path: required<br>
	 * @param {boolean}
	 *            isLarge: optional<br>
	 * Even you want to create a new excel file, you must create it from a template file.
	 */
	constructor(path,isLarge){
		super();
		if (isLarge){
			isLarge=true;
		}else{
			isLarge=false;
		}
		this.#workbook = Packages.efw.excel.ExcelManager.open(path,isLarge);
	}
	/**
	 * The function to save the excel object to a file.
	 * @param {String} path: required. <br>
	 * The relative path and file name to the storage folder.
	 */
	save (path,password) {
		if (password==null)password="";
		this.#workbook.save(path,password);
		return this;
	}
	/**
	 * The function to close the handle to free the excel file.
	 */
	close() {
		Packages.efw.excel.ExcelManager.close(this.#workbook.getKey());
	}
	/**
	 * The inner object to keep the operating workbook.
	 */
	#workbook = null;
	/**
	 * The function to get the last row number starting from 1.
	 * @param {String}
	 *            sheetName: required<br>
	 * @returns {Number}
	 */
	getMaxRow(sheetName) {
		return 1 + this.#workbook.getMaxRow(sheetName);
	}
	/**
	 * The function to get the last column number starting from 1.
	 * @param {String}
	 *            sheetName: required<br>
	 * @returns {Number}
	 */
	getMaxCol(sheetName) {
		return 1 + this.#workbook.getMaxCol(sheetName);
	}
	/**
	 * The function to get several fields as an array from a sheet.
	 * @param {String}
	 *            sheetName: required<br>
	 * @param {Number} startRow: required<br>
	 * 			It starts from 1 not 0 . <br>
	 * @param {Number|function} endCondition: required<br>
	 * 			999|function(row){return true/false;} // The parameter row starts from 1 not 0 .<br>
	 * @param {Object|Array} positionRowMaps: required<br>
	 * 			[{<br>//the first row in one record
	 * 				"data1":col,	// The col is "A","B","C" and etc.<br>
	 * 				"data2":[col,formatter,rounder]<br>
	 *            	"data3":function(row){return String|Number|Date|Boolean;}<br> 
	 * 			},{//the second row in one record
	 * 				...
	 * 			}]
	 * 
	 */
	getArray(sheetName, startRow, endCondition, positionRowMaps){
		let ary=[];
		function createPositionMap(row,positionRowMaps){
			let ret={};
			if (positionRowMaps instanceof Array){
				for(let i=0;i<positionRowMaps.length;i++){
					let mp=positionRowMaps[i];
					for(let key in mp){
						let v=mp[key];
						if(v instanceof Array){
							ret[key]=[v[0]+(row+i),v[1],v[2]];//["A0",formatter,rounder]
						}else if(typeof v == "function"){
							ret[key]=v;
						}else{
							ret[key]=v+(row+i);
						}
					}
				}
			}else{
				for(let key in positionRowMaps){
					let v=positionRowMaps[key];
					if(v instanceof Array){
						ret[key]=[v[0]+row,v[1],v[2]];//["A0",formatter,rounder]
					}else if(typeof v == "function"){
						ret[key]=v;
					}else{
						ret[key]=v+row;
					}
				}
			}
			return ret;
		}
		if (typeof endCondition == "function"){
			let row=startRow;
			while(!endCondition(row)){
				ary.push(this.#getSingle(sheetName,createPositionMap(row,positionRowMaps),row));
				if (positionRowMaps instanceof Array){
					row=row+positionRowMaps.length;
				}else{
					row++;
				}
			};
		}else if(typeof endCondition == "number"){
			for(let row=startRow;row<=endCondition;){
				ary.push(this.#getSingle(sheetName,createPositionMap(row,positionRowMaps),row));
				if (positionRowMaps instanceof Array){
					row=row+positionRowMaps.length;
				}else{
					row++;
				}
			};
		}
		return ary;
	}
	/**
	 * The function to get several fields as an object from a sheet.<br>
	 * And you can format the value to String by the formatter in positionMap.<br>
	 * @param {String}
	 *            sheetName: required<br>
	 * @param {Object}
	 * 			positionMap: required<br> 
	 *            { <br> 
	 *            	"data1":position, //row col are required<br> 
	 *            	"data2":[position,formatter,rounder] //formatter rounder are optional<br> 
	 *            	"data3":function(){return String|Number|Date|Boolean;}<br> 
	 *            }<br> 
	 * @returns {Object}
	 */
	getSingle(sheetName, positionMap) {
		return this.#getSingle(sheetName, positionMap);
	}
	#getSingle(sheetName, positionMap,currentRow) {
		let obj = {};
		for (let key in positionMap) {
			let pos = positionMap[key];
			if (pos instanceof Array){
				obj[key]= this.getValue(sheetName, pos[0], pos[1], pos[2]);
			}else if(typeof pos == "function"){
				obj[key]=pos(currentRow);
			}else{
				obj[key]= this.getValue(sheetName, pos);
			}
		}
		return obj;
	}
	/**
	 * The function to get the value from a cell.<br>
	 * And you can format the value to String by the formatter parameter.<br>
	 * 
	 * @param {String}
	 *            sheetName: required<br>
	 * @param {Number}
	 *            position: required<br>
	 *            Example: "A1" etc.
	 * @param {String}
	 *            formatter: optional<br>
	 * @param {String}
	 *            rounder : optional, the default is HALF_EVEN<br>
	 *            {UP | DOWN | CEILING | FLOOR | HALF_UP | HALF_DOWN | HALF_EVEN}<br>
	 * @returns {String | Number | Date | Boolean}
	 */
	getValue(sheetName, position, formatter, rounder) {
		let value = this.#workbook.get(sheetName, position);
		if (value==null){
			//値がnullの場合処理を飛ばす
		}else{
			let valueType=typeof value;
			//if (valueType == "string") {
				//以下タイプは自動的に文字と見なす
				//java.lang.String
			if (valueType == "number") {
				//以下タイプは自動的に数字と見なす
				//java.lang.Byte
				//java.lang.Double
				//java.lang.Float
				//java.lang.Integer
				//java.lang.Short
				if (formatter != null) {
					rounder=""+rounder;
					value = value.format(formatter, rounder);
				}
			//}else if (valueType == "boolean") {
				//以下タイプは自動的にブールと見なす
				//java.lang.Boolean
			}else if (valueType == "object" && value.getClass) {
				let clsName=value.getClass().getName();
				if (clsName == "java.util.Date") {
					let dt = new Date();
					dt.setTime(value.getTime());
					value = dt;
					if (formatter != null) {
						value = value.format(formatter);
					}
				//}else{//他のクラスの場合考慮しない
				}
			//}else{//javascript objectの場合考慮しない
			}
		}
		return value;
	}
	/**
	 * The function to get the Array of sheet names.
	 * @returns {Array}
	 */
	getSheetNames(){
		let ret=[];
		let ary=this.#workbook.getSheetNames();
		for(let i=0;i<ary.size();i++){
			ret.push(""+ary.get(i));
		}
		return ret;
	}
	/**
	 * The function to create a new sheet or clone a existed sheet.
	 * @param {String} sheetName: required<br>
	 * 		The new sheet name.
	 * @param {String} copyFrom: optional<br>
	 * 		The existed sheet name.
	 * @returns {Excel}
	 */
	createSheet(sheetName,copyFrom) {
		if(copyFrom==null){
			this.#workbook.createSheet(sheetName,null);
		}else{
			this.#workbook.createSheet(sheetName,copyFrom);
		}
		return this;
	}
	/**
	 * The function to set a sheet's PrintArea.
	 * @param {String} sheetName: required<br>
	 * @param {Number} startRow: required<br>
	 * @param {Number} endRow: required<br>
	 * @param {Number} startCol: required<br>
	 * @param {Number} endCol: required<br>
	 * @returns {Excel}
	 */
	setPrintArea(sheetName,startRow,endRow,startCol,endCol) {
			this.#workbook.setPrintArea(sheetName,startRow,endRow,startCol,endCol);
		return this;
	}
	/**
	 * The function to remove a sheet.
	 * @param {String} sheetName: required<br>
	 * @returns {Excel}
	 */
	removeSheet(sheetName){
		this.#workbook.removeSheet(sheetName);
		return this;
	}
	/**
	 * The function to set a link in cell.
	 * @param {String} sheetName : required<br>
	 * @param {String} position : required<br>
	 * @param {String} linkUrl : required<br>
	 * @returns {Excel}
	 */
	setLink(sheetName,position,linkUrl) {
		this.#workbook.setLink(sheetName,position,linkUrl);
		return this;
	}
	/**
	 * The function to move a sheet's position.
	 * @param {String} sheetName: required<br>
	 * @param {Number} order: required, start from 1.<br>
	 * @returns {Excel}
	 */
	setSheetOrder(sheetName,order){
		order=order-1;
		if (order<0) order=0;
		this.#workbook.setSheetOrder(sheetName,order);
		return this;
	}
	/**
	 * The function to set a sheet to be active.
	 * @param {String} sheetName: required<br>
	 * @returns {Excel}
	 */
	setActiveSheet(sheetName){
		this.#workbook.setActiveSheet(sheetName);
		return this;
	}
	/**
	 * The function to set a value and style etc into a cell.
	 * @param {String} sheetName: required<br>
	 * @param {String} position: required<br>
	 * @param {String | Number | Date | Boolean | null } value: required<br>
	 * If value is null, it will try to set the formula.
	 * @param {String} templateSheetName: optional<br>
	 * @param {String} templatePosition: optional<br>
	 * @returns {Excel}
	 */
	setCell(sheetName, position, value, templateSheetName, templatePosition) {
	    if (value == undefined || value == Infinity || value == -Infinity || value == NaN || value  == null){
			if(templateSheetName!=null && templatePosition!=null){
				this.#workbook.setCellFormula(sheetName, position, templateSheetName, templatePosition);
			}else{
				this.#workbook.setCellStringValue(sheetName, position, new java.lang.String(""));
			}
		}else if(typeof value == "string"){
			this.#workbook.setCellStringValue(sheetName, position, new java.lang.String(value));
		}else if(typeof value == "number"){
			this.#workbook.setCellDoubleValue(sheetName, position, new java.lang.Double(value));
		}else if(typeof value == "boolean"){
			this.#workbook.setCellBooleanValue(sheetName, position, new java.lang.Boolean(value));
		}else if(typeof value == "object"&& value.getTime){
			this.#workbook.setCellDateValue(sheetName, position, new java.util.Date(value.getTime()));
		}
		if (sheetName == templateSheetName && position == templatePosition) {
		}else{
			if(templateSheetName!=null && templatePosition!=null){
				this.#workbook.setMergedRegion(sheetName, position, templateSheetName, templatePosition);
				this.#workbook.setCellStyle(sheetName, position, templateSheetName, templatePosition);
				//this.#workbook.setCellValidations(sheetName, position, templateSheetName, templatePosition);
			}
		}
		return this;
	}
	/**
	 * The function to judge whether a point is encircled by a shape or not.
	 * @param {String}
	 *            sheetName: required<br>
	 * @param {Number}
	 *            position: required<br>
	 *            Example: "A1" etc.
	 * @param {Number} checkpointXRate: optoinal<br>
	 * The default value is 0.5 which means the center.<br>
	 * @param {Number} checkpointYRate: optoinal<br>
	 * The default value is 0.5 which means the center.<br>
	 * @returns {Boolean}
	 */
	isEncircled(sheetName,position,checkpointXRate,checkpointYRate){
		if (checkpointXRate==null)checkpointXRate=0.5;
		if (checkpointYRate==null)checkpointYRate=0.5;
		return true && this.#workbook.isEncircled(sheetName,position,checkpointXRate,checkpointYRate);
	}
	/**
	 * The function to create a shape by coping to encircle a cell.
	 * @param {String} sheetName: required<br>
	 * @param {String} position: required<br>
	 * @param {String} templateSheetName: required<br>
	 * The sheet where the copied shape is.<br> 
	 * @param {String} templateShapeName: required<br>
	 * The name of the copied shape.
	 * @param {Number} shapeCenterXRate: optional, the default is 0.5 .<br>
	 * The rate of the created shape's center to the width of the cell.<br>
	 * @param {Number} shapeCenterYRate optional, the default is 0.5 .<br>
	 * The rate of the created shape's center to the height of the cell.<br>
	 * @param {Number} shapeWidthRate optional, the default is 0.5 .<br>
	 * The rate of the created shape's width to the width of the cell.<br>
	 * @param {Number} shapeHeightRate optional, the default is 0.5 .<br>
	 * The rate of the created shape's height to the height of the cell.<br>
	 * @returns {Excel}
	 */
	encircle(sheetName,position,templateSheetName,templateShapeName,shapeCenterXRate,shapeCenterYRate,shapeWidthRate,shapeHeightRate){
		if (shapeCenterXRate==null)shapeCenterXRate=0.5;
		if (shapeCenterYRate==null)shapeCenterYRate=0.5;
		if (shapeWidthRate==null)shapeWidthRate=0.5;
		if (shapeHeightRate==null)shapeHeightRate=0.5;
		this.#workbook.encircle(sheetName,position,templateSheetName,templateShapeName,shapeCenterXRate,shapeCenterYRate,shapeWidthRate,shapeHeightRate);
		return this;
	}
	/**
	 * The function to create a shape by coping to encircle a cell.
	 * @param {String} sheetName: required<br>
	 * @param {String} position: required<br>
	 * @param {String} templateSheetName: required<br>
	 * The sheet where the copied shape is.<br> 
	 * @param {String} templateShapeName: required<br>
	 * The name of the copied shape.
	 * @param {String} text optional,the default is same to template'shape.<br>
	 * The created shape's text value.<br>
	 * @param {Number} x: optional, the default is same to template'shape.<br>
	 * The x coordinate of the created shape in the cell.<br>
	 * @param {Number} y optional, the default is same to template'shape.<br>
	 * The y coordinate of the created shape in the cell.<br>
	 * @param {Number} width optional, the default is same to template'shape.<br>
	 * The created shape's width.<br>
	 * @param {Number} height optional,the default is same to template'shape.<br>
	 * The created shape's height.<br>
	 * @returns {Excel}
	 */
	addShape(sheetName,position,templateSheetName,templateShapeName,text,x,y,width,height){
		if (text==null)text="";
		if (x==null)x=0;
		if (y==null)y=0;
		if (width==null)width=0;
		if (height==null)height=0;
		this.#workbook.addShapeInCell(sheetName,position,templateSheetName,templateShapeName,text,x,y,width,height);
		return this;
	}
	/**
	 * The function to create a shape by coping to encircle cell range.
	 * @param {String} sheetName: required<br>
	 * @param {String} firstCellPosition: required<br>
	 * @param {String} lastCellPosition: required<br>
	 * @param {String} templateSheetName: required<br>
	 * The sheet where the copied shape is.<br> 
	 * @param {String} templateShapeName: required<br>
	 * The name of the copied shape.
	 * @param {String} text optional,the default is same to template'shape.<br>
	 * The created shape's text value.<br>
	 * @param {Number} x1: optional, the default is same to template'shape.<br>
	 * The x coordinate within the first cell.<br>
	 * @param {Number} y1 optional, the default is same to template'shape.<br>
	 * The y coordinate within the first cell.<br>
	 * @param {Number} x2 optional, the default is same to template'shape.<br>
	 * The x coordinate within the last cell.<br>
	 * @param {Number} y2 optional,the default is same to template'shape.<br>
	 * The y coordinate within the last cell.<br>
	 * @returns {Excel}
	 */
	addShapeInRange(sheetName,firstCellPosition,lastCellPosition,templateSheetName,templateShapeName,text,x1,y1,x2,y2){
		if (text==null)text="";
		if (x1==null)x1=0;
		if (y1==null)y1=0;
		if (x2==null)x2=0;
		if (y2==null)y2=0;
		this.#workbook.addShapeInRange(sheetName,firstCellPosition,lastCellPosition,templateSheetName,templateShapeName,text,x1,y1,x2,y2);
		return this;
	}
	/**
	 * @param {String} sheetName: required<br>
	 * The sheet where the copied shape is.<br> 
	 * @param {String} shapeName: required<br>
	 * The name of the copied shape.
	 * @param {String} newPicturePath: required<br>
	 * The path of a new picture to be replaced in the templateShape.
	 */
	replacePicture(sheetName,shapeName,newPicturePath){
		this.#workbook.replacePicture(sheetName,shapeName,newPicturePath);
		return this;
	}
	/**
	 * The function to add the row
	 * @param {String} sheetName: required<br>
	 * @param {Number} startRow: required,indexed from 0.<br>
	 * @param {Number} n: optional,the default value is 1.<br>
	 * @returns {Excel}
	 */
	addRow(sheetName, startRow, n) {
		if (startRow<0)return this;//if the param is not correct, do nothing.
		if (n==null)n=1;
		this.#workbook.addRow(sheetName, startRow, n);
		return this;
	}
	/**
	 * The function to del the row
	 * @param {String} sheetName: required<br>
	 * @param {Number} startRow: required,indexed from 0.<br>
	 * @param {Number} n: optional,the default value is 1.<br>
	 * @returns {Excel}
	 */
	delRow(sheetName, startRow, n) {
		if (startRow<0)return this;//if the param is not correct, do nothing.
		if (n==null)n=1;
		this.#workbook.delRow(sheetName, startRow, n);
		return this;
	}
	/**
	 * The function to show the row
	 * @param {String} sheetName: required<br>
	 * @param {Number} startRow: required,indexed from 0.<br>
	 * @param {Number} endRow: optional,the default is same to startRow.<br>
	 * @returns {Excel}
	 */
	showRow(sheetName, startRow, endRow) {
		if (endRow==null)endRow=startRow;
		if (startRow>endRow){let c=endRow;endRow=startRow;startRow=c;}
		if (startRow<0)return this;//if the param is not correct, do nothing.
		this.#workbook.showRow(sheetName, startRow, endRow);
		return this;
	}
	/**
	 * The function to hide the row
	 * @param {String} sheetName: required<br>
	 * @param {Number} startRow: required,indexed from 0.<br>
	 * @param {Number} endRow: optional,the default is same to startRow.<br>
	 * @returns {Excel}
	 */
	hideRow(sheetName, startRow, endRow) {
		if (endRow==null)endRow=startRow;
		if (startRow>endRow){let c=endRow;endRow=startRow;startRow=c;}
		if (startRow<0)return this;//if the param is not correct, do nothing.
		this.#workbook.hideRow(sheetName, startRow, endRow);
		return this;
	}
	/**
	 * The function to show the column
	 * @param {String} sheetName: required<br>
	 * @param {Number} startCol: required,indexed from 0.<br>
	 * @param {Number} endCol: optional,the default is same to startCol.<br>
	 * @returns {Excel}
	 */
	showCol(sheetName, startCol, endCol) {
		if (endCol==null)endCol=startCol;
		if (startCol>endCol){let c=endCol;endCol=startCol;startCol=c;}
		if (startCol<0)return this;//if the param is not correct, do nothing.
		this.#workbook.showCol(sheetName, startCol, endCol);
		return this;
	}
	/**
	 * The function to hide the column
	 * @param {String} sheetName: required<br>
	 * @param {Number} startCol: required,indexed from 0.<br>
	 * @param {Number} endCol: optional,the default is same to startCol.<br>
	 * @returns {Excel}
	 */
	hideCol(sheetName, startCol, endCol) {
		if (endCol==null)endCol=startCol;
		if (startCol>endCol){let c=endCol;endCol=startCol;startCol=c;}
		if (startCol<0)return this;//if the param is not correct, do nothing.
		this.#workbook.hideCol(sheetName, startCol, endCol);
		return this;
	}
	/**
	 * The function to show the sheet
	 * @param sheetName sheetName: required<br>
	 * @returns {Excel}
	 */
	showSheet(sheetName) {
		this.#workbook.showSheet(sheetName);
		return this;
	}
	/**
	 * The function to hide the sheet
	 * @param sheetName sheetName: required<br>
	 * @returns {Excel}
	 */
	hideSheet(sheetName) {
		this.#workbook.hideSheet(sheetName);
		return this;
	}
	/**
	 * The function to zoom the sheet
	 * @param sheetName sheetName: required<br>
	 * @param percent percent: required<br>
	 * @returns {Excel}
	 */
	zoomSheet(sheetName,percent) {
		this.#workbook.zoomSheet(sheetName,percent);
		return this;
	}
}