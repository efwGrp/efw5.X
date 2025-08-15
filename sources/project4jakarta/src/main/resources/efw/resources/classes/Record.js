"use strict";
/**** efw5.X Copyright 2025 efwGrp ****/
/**
 * The class to operate the array data.
 *
 * @author Chang Kejun
 */
class Record extends Debuggable{
	/**
	 * Create instance
	 * 
	 * @param {Array}
	 *            array: optional
	 */
	constructor(array) {
		super();
		if (array != null) {
			this.values = array;
			this.length = array.length;
		}
	}
	/**
	 * The internal variable for keeping records length.
	 */
	length = 0;
	/**
	 * The internal variable for keeping records.
	 */
	values = [];
	/**
	 * Seek in records.<br>
	 * The action is one of the options: [ eq | gt | lt | like | !eq | !gt | !lt |
	 * !like ]
	 * 
	 * @param {String}
	 *            field: required<br>
	 * @param {String}
	 *            action: required<br>
	 * @param {String |
	 *            Number | Date | Boolean} value: required<br>
	 * @returns {Record}
	 */
	seek (field, action, value) {
		if (field == "" || field == undefined || field == null)
			return new Record();
		if (action != "eq" && action != "gt" && action != "lt" && action != "like"
				&& action != "!eq" && action != "!gt" && action != "!lt"
				&& action != "!like")
			return new Record();
	
		let ret = [];
		let likeFirst = false;
		let likeLast = false;
		if (action == "like" || action == "!like") {
			value = "" + value;
			if (value.substring(0, 1) == "%")
				likeFirst = true;
			if (value.substring(value.length - 1, value.length) == "%")
				likeLast = true;
			if (likeFirst)
				value = value.substring(1);
			if (likeLast)
				value = value.substring(0, value.length - 1);
		}
		for (let i = 0; i < this.values.length; i++) {
			let rd = this.values[i];
			switch (action) {
			case "eq":
				if (rd[field] == value)
					ret.push(rd);
				break;
			case "gt":
				if (rd[field] > value)
					ret.push(rd);
				break;
			case "lt":
				if (rd[field] < value)
					ret.push(rd);
				break;
			case "like": {
				let data = ("" + rd[field]);
				let idx = data.indexOf(value);
				if (((!likeFirst && idx == 0) || (likeFirst && idx > -1))
						&& ((!likeLast && idx == data.length - value.length) || (likeLast && idx > -1)))
					ret.push(rd);
				break;
			}
			case "!eq":
				if (rd[field] != value)
					ret.push(rd);
				break;
			case "!gt":
				if (rd[field] <= value)
					ret.push(rd);
				break;
			case "!lt":
				if (rd[field] >= value)
					ret.push(rd);
				break;
			case "!like": {
				let data = ("" + rd[field]);
				let idx = data.indexOf(value);
				if (!(((!likeFirst && idx == 0) || (likeFirst && idx > -1)) && ((!likeLast && idx == data.length
						- value.length) || (likeLast && idx > -1))))
					ret.push(rd);
				break;
			}
			}
		}
		return new Record(ret);
	}
	/**
	 * Sort records.<br>
	 * The action is one of the options: [ asc | desc ]
	 * 
	 * @param {String}
	 *            field: required<br>
	 * @param {String}
	 *            action: required<br>
	 * @returns {Record}
	 */
	sort(field, action) {
		if (field == "" || field == undefined || field == null)
			return new Record();
		if (action != "asc" && action != "desc" && action != "ASC"
				&& action != "DESC")
			return new Record();
		let ret = this.values.sort(function(a, b) {
			if (action == "desc" || action == "DESC") {
				if (a[field] < b[field])
					return 1;
				if (a[field] > b[field])
					return -1;
			} else {
				if (a[field] < b[field])
					return -1;
				if (a[field] > b[field])
					return 1;
			}
		});
		return new Record(ret);
	}
	/**
	 * to make all keys uppercase
	 * @returns {Record}
	 */
	makeAllKeysUpperCase(){
		let array = [];
		for (let i = 0; i< this.values.length; i++) {
			let rsdata = this.values[i];
			let item = {};
			for (let key in rsdata){
				item[key.toUpperCase()]=rsdata[key];
			}
			array.push(item);
		}
		return new Record(array);
	}
	/**
	 * to make all keys lowercase
	 * @returns {Record}
	 */
	makeAllKeysLowerCase(){
		let array = [];
		for (let i = 0; i< this.values.length; i++) {
			let rsdata = this.values[i];
			let item = {};
			for (let key in rsdata){
				item[key.toLowerCase()]=rsdata[key];
			}
			array.push(item);
		}
		return new Record(array);
	}
	/**
	 * The function to change the record format.
	 * 
	 * @param mapping:
	 *            required<br>
	 *            {fieldnew1:fieldold1,fieldnew2:fieldold2,...}<br>
	 * @returns {Record}
	 */
	map(mapping) {
		if (mapping == null)
			return new Record();
	
		let array = [];
		for (let i = 0; i < this.values.length; i++) {
			let rsdata = this.values[i];
	
			let itemfix = null;
			let item = {};
			for ( let key in mapping) {
				let mp = mapping[key];
				if (typeof mp == "string") {
					let vl = rsdata[mp];
					item[key] = vl;
				} else if (typeof mp == "function") {
					let vl = mp(rsdata, itemfix);
					item[key] = vl;
				} else if (typeof mp == "object" && mp instanceof Array) {
					let vl = rsdata[mp[0]];
					let ft = mp[1];
					if (vl != null && ft != null) {
						if (ft.indexOf("{")==0&&ft.lastIndexOf("}")==ft.length-1){
							vl = EfwServerFormat.formatEnum(vl, ft);
						}else if (vl.toFixed) {// if vl is number #,##0.00
							let round = "" + mp[2];
							vl = EfwServerFormat.formatNumber(vl, ft, round);
						} else if (vl.getTime) {// if vl is date yyyyMMdd
							vl = EfwServerFormat.formatDate(vl, ft);
						}
						// if vl is not date or number or boolean, it should not have format
					}
					item[key] = vl;
				}
			}
			array.push(item);
		}
		return new Record(array);
	}
	/**
	 * The function to get the first data item from records.
	 * 
	 * @returns {Object}
	 */
	getSingle() {
		if (this.values.length == 0)return {};
		return JSON.clone(this.values[0]);
	}
	/**
	 * The function to get the array data from records.
	 * 
	 * @returns {Array}
	 */
	getArray() {
		return JSON.clone(this.values);
	}
	/**
	 * The function to get a field value from the first data of records.
	 * 
	 * @param {String}
	 *            field: required<br>
	 * @returns {String | Number | Date | Boolean}
	 */
	getValue(field) {
		if (this.values.length == 0)return null;
		return this.values[0][field];
	}
	/**
	 * The function to group the record by param fields.
	 * @param {String}
	 * 			fields: required<br>
	 */
	group(/*field1,field2,field3...*/) {
		if(arguments.length==0) return null;
		let root={};
		//to create the tree
		for (let i=0; i<this.values.length; i++){
			let item=JSON.clone(this.values[i]);
			let current=root;
			for (let j=0; j<arguments.length; j++){
				let key=arguments[j];
				if(current[item[key]]==null){
					if(j==arguments.length-1){
						current[item[key]]=[];
					}else{
						current[item[key]]={};
					}
				}
				current=current[item[key]];
				delete item[key];
			}
			current.push(item);
		}
		return root;
	}
	/**
	 * The function to show the debug info about the record.
	 * @param {String}
	 * 			label: optional<br>
	 * @returns {Record}
	 */
	debug (label) {
		super.debug(label);
		java.lang.System.out.println("records:"+JSON.stringify(this.values));
		return this;
	};
}