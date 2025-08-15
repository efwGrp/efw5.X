"use strict";
/**** efw5.X Copyright 2025 efwGrp ****/
/**
 * The class for batch result.
 * 
 * @author Chang Kejun
 */
class Batch extends Debuggable{
	/**
	 * The error level for batch.
	 */
	errorlevel=0;
	/**
	 * The array to keep logs.
	 */
	logs = [];
	/**
	 * The array to keep echos.
	 */
	echos = [];

	/**
	 * The function to concatenate to another batch result.
	 * 
	 * @param {Batch} batch: required<br>
	 * @returns {Batch}
	 */
	concat(batch) {
		if(batch){
			if (this.errorlevel<batch.errorlevel)this.errorlevel=batch.errorlevel;
			if(batch.logs){
				this.logs = this.logs.concat(batch.logs);
			}
			if(batch.echos){
				this.echos = this.echos.concat(batch.echos);
			}
		}
		return this;
	}
	/**
	 * The function to set error level.
	 * 
	 * @param {Number} errorlevel: required<br>
	 * @returns {Batch}
	 */
	exit(errorlevel){
		this.errorlevel=errorlevel;
		return this;
	}
	/**
	 * The function to log a message.
	 * 
	 * @param {String} message: required<br>
	 * @returns {Batch}
	 */
	log(message){
		this.logs.push(message);
		return this;
	}
	/**
	 * The function to echo a message.
	 * 
	 * @param {String} message: required<br>
	 * @returns {Batch}
	 */
	echo(message){
		this.echos.push(message);
		return this;
	}
}