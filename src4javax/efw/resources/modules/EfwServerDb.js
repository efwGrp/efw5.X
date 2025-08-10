"use strict";
/**** efw5.X Copyright 2025 efwGrp ****/
/**
 * The class to operate Database.
 * 
 * @author Chang Kejun
 */
class EfwServerDb extends Debuggable{
	/**
	 * The class to execute insert update delete sql in database.
	 * <br>
	 * db.change(groupId,sqlId,params)<br>
	 * db.change(groupId,sqlId,params,jdbcResourceName)<br>
	 * db.change(sql)<br>
	 * db.change(sql,jdbcResourceName)<br>
	 * <br>
	 * @param {String}
	 *            groupId<br>
	 * @param {String}
	 *            sqlId<br>
	 * @param {Object}
	 *            params<br>
	 *            {param1:value1,param2:value2,...}<br>
	 * @param {String}
	 *            jdbcResourceName<br>
	 * @param {String}
	 *            sql<br>
	 * @returns {Number}
	 */
	static change(groupId, sqlId, params, jdbcResourceName) {
		let count=0;
		if (params==undefined){
			let innerSql=groupId;//first param
			let innerJdbcResourceName=sqlId;//second param
			count = EfwServerDb.#executeUpdate({
				"jdbcResourceName" : innerJdbcResourceName,
				"sql" : innerSql
			});
		}else{
			count = EfwServerDb.#executeUpdate({
				"jdbcResourceName" : jdbcResourceName,
				"groupId" : groupId,
				"sqlId" : sqlId,
				"params" : params
			});
		}
		return count;
	}
	/**
	 * The function to execute select sql in database.<br>
	 * <br>
	 * select(groupId,sqlId,params)<br>
	 * select(groupId,sqlId,params,jdbcResourceName)<br>
	 * select(sql)<br>
	 * select(sql,jdbcResourceName)<br>
	 * <br>
	 * @param {String}
	 *            groupId<br>
	 * @param {String}
	 *            sqlId<br>
	 * @param {Object}
	 *            params<br>
	 *            {param1:value1,param2:value2,...}<br>
	 * @param {String}
	 *            jdbcResourceName<br>
	 * @param {String}
	 *            sql<br>
	 * @returns {Record}
	 */
	static select(groupId, sqlId, params, jdbcResourceName) {
		let values;
		if (params==undefined){
			let innerSql=groupId;//first param
			let innerJdbcResourceName=sqlId;//second param
			values = EfwServerDb.#executeQuery({
				"jdbcResourceName" : innerJdbcResourceName,
				"sql" : innerSql
			});
		}else{
			values = EfwServerDb.#executeQuery({
				"jdbcResourceName" : jdbcResourceName,
				"groupId" : groupId,
				"sqlId" : sqlId,
				"params" : params
			});
		}
		return new Record(values);
	}
	///////////////////////////////////////////////////////////////////////////////
	/**
	 * The function to execute select sql.
	 * 
	 * @param executionParams
	 *            <br>{ <br>
	 *            groupId:String,//required<br>
	 *            sqlId:String,//optional<br>
	 *            sql:String,//optional<br>
	 *            params:{param1:value1,param2:value2,...}//required<br>
	 *            jdbcResourceName:String,//optional<br> }<br>
	 * @returns {null | Array}
	 */
	static #executeQuery (executionParams) {
		let jdbcResourceName = executionParams.jdbcResourceName;
		if (jdbcResourceName == undefined || jdbcResourceName == null)
			jdbcResourceName = "";
		let groupId = executionParams.groupId;
		let sqlId = executionParams.sqlId;
		let sql = executionParams.sql;
		let aryParam = executionParams.params;
		let params = new java.util.HashMap();
		for ( let key in aryParam) {
			let vl = aryParam[key];
			if (null == vl ||(typeof(vl) == "string" && vl == "")){
				vl = null;
			}else if (vl.getTime){
				vl = new java.sql.Timestamp(vl.getTime());
			}
			params.put(key, vl);
		}
		let db=Packages.efw.db.DatabaseManager.getDatabase(jdbcResourceName);
		if (db==null){
			Packages.efw.db.DatabaseManager.open(jdbcResourceName);
			db=Packages.efw.db.DatabaseManager.getDatabase(jdbcResourceName);
		}
		let rs;
		if (sqlId != null) {
			rs = db.executeQuery(groupId, sqlId, params);
		} else if (sql != null) {
			rs = db.executeQuerySql(sql);
		} else {
			return null;
		}
		let ret = [];
		let meta = rs.getMetaData();
		let parseValue = function(vl) {
			let value = vl;
			if (value == null) {
				//値がnullの場合処理を飛ばす
			}else{
				let valueType=typeof value;
				//if (valueType == "string") {
					//以下タイプは自動的に文字と見なす
					//java.lang.String
				//}else if (valueType == "number") {
					//以下タイプは自動的に数字と見なす
					//java.lang.Byte
					//java.lang.Double
					//java.lang.Float
					//java.lang.Integer
					//java.lang.Short
				//}else if (valueType == "boolean") {
					//以下タイプは自動的にブールと見なす
					//java.lang.Boolean
				if ((valueType == "object"||valueType =="function") && value.getClass) {
					let clsName=value.getClass().getName();
					if(clsName=="java.lang.Long"
							|| clsName=="java.math.BigDecimal"){
						value = 0 + new Number(value);//new Numberはdebug関数を付けていないため+0にする
					} else if (clsName == "java.sql.Date"
							|| clsName == "java.sql.Time"
							|| clsName == "java.sql.Timestamp"
							|| clsName == "java.util.Date") {
						let dt = new Date();
						dt.setTime(value.getTime());
						value = dt;
					} else if (clsName == "oracle.sql.TIMESTAMP"){
						let dt = new Date();
						dt.setTime(value.timestampValue().getTime());
						value = dt;
					} else if (clsName == "java.time.LocalDateTime"){
						let dt = new Date();
						dt.setTime(java.sql.Timestamp.valueOf(value).getTime());
						value = dt;
					} else {
						let sValue=""+value;
						if (sValue.length>50){
							sValue=sValue.substr(0,50)+"...";
						}
						// you should do something if the comment is printed out.
						Packages.efw.framework.runtimeWLog("[" + sValue + "] is an instance of " + value.getClass().getName()
								+ " which is treated as a string in efw.");
						value=""+value;//change unknown type to string.
					}
				//}else{//javascript objectの場合//db処理の場合存在しない
				}
			}
			return value;
		};
	
		while (rs.next()) {// change recordset to javascript array
			let rsdata = {};
			let maxColumnCount = meta.getColumnCount();
			for (let j = 1; j <= maxColumnCount; j++) {
				let key = (""+meta.getColumnName(j)).toLowerCase();
				rsdata[key] = parseValue(rs.getObject(key));
			}
			ret.push(rsdata);
		}
		rs.close();
		// close query to free handle
		Packages.efw.db.DatabaseManager.getDatabase(jdbcResourceName).closeQuery();
		return ret;
	}
	/**
	 * The function to execute insert update delete sql.
	 * @param executionParams
	 *            <br>{ <br>
	 *            groupId:String,//required<br>
	 *            sqlId:String,//optional<br>
	 *            sql:String,//optional<br>
	 *            params:{param1:value1,param2:value2,...}//required<br>
	 *            jdbcResourceName:String,//optional<br> }<br>
	 * @returns {Number}
	 */
	static #executeUpdate(executionParams) {
		let jdbcResourceName = executionParams.jdbcResourceName;
		if (jdbcResourceName == undefined || jdbcResourceName == null)
			jdbcResourceName = "";
		let groupId = executionParams.groupId;
		let sqlId = executionParams.sqlId;
		let sql = executionParams.sql;
		let aryParam = executionParams.params;
		let params = new java.util.HashMap();
		for ( let key in aryParam) {
			let vl = aryParam[key];
			if (null == vl ||(typeof(vl) == "string" && vl == "")){
				vl = null;
			}else if (vl.getTime){
				vl = new java.sql.Timestamp(vl.getTime());
			}
			params.put(key, vl);
		}
		let db=Packages.efw.db.DatabaseManager.getDatabase(jdbcResourceName);
		if (db==null){
			Packages.efw.db.DatabaseManager.open(jdbcResourceName);
			db=Packages.efw.db.DatabaseManager.getDatabase(jdbcResourceName);
		}
		if (sqlId != null)
			return db.executeUpdate(groupId, sqlId, params);
		if (sql != null)
			return db.executeUpdateSql(sql);
		return 0;
	}
	/**
	 * The function to commit.
	 * @param {String} jdbcResourceName
	 */
	static commit(jdbcResourceName) {
		if (jdbcResourceName == undefined || jdbcResourceName == null)
			jdbcResourceName = "";
		Packages.efw.db.DatabaseManager.getDatabase(jdbcResourceName).commit();
	}
	/**
	 * The function to rollback.
	 * @param {String} jdbcResourceName
	 */
	static rollback(jdbcResourceName) {
		if (jdbcResourceName == undefined || jdbcResourceName == null)
			jdbcResourceName = "";
		Packages.efw.db.DatabaseManager.getDatabase(jdbcResourceName).rollback();
	}
	/**
	 * The function to commit all database.
	 */
	static commitAll() {
		Packages.efw.db.DatabaseManager.commitAll();
	}
	/**
	 * The function to rollback all database.
	 */
	static rollbackAll() {
		Packages.efw.db.DatabaseManager.rollbackAll();
	}
}
///////////////////////////////////////////////////////////////////////////////
const db = EfwServerDb;