"use strict";
/**** efw5.X Copyright 2025 efwGrp ****/
/**
 * The class to execute a cmd line.
 * 
 * @author Chang kejun
 */
class EfwServerCmd extends Debuggable{
	/**
	 * Execute method to run a command line of os.
	 * If the command line status is not 0, throw a Exception with the error message.
	 * 
	 * @param {Array}
	 *            params: required<br>
	 * 
	 * @returns {status}
	 */
	static execute (params){
		if (params==null && !(params instanceof Array) )params=[];
		Packages.efw.cmd.CmdManager.execute(Java.to(params, Java.type("java.lang.String[]")));
	}	
}
///////////////////////////////////////////////////////////////////////////////
const cmd = EfwServerCmd;