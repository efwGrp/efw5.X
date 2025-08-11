/**** efw5.X Copyright 2025 efwGrp ****/
/**
 * efw framework client library
 * @author Chang Kejun
 */
///////////////////////////////////////////////////////////////////////////////
//The classes of the framework
///////////////////////////////////////////////////////////////////////////////
/**
 * The Efw class
 * Efw(eventId)<br>
 * Efw(eventId,manualParams)<br>
 */
var Efw = function(eventId,manualParams) {
	if(eventId!=undefined){
		var eventParams={"eventId":eventId};
		eventParams.manualParams=manualParams;
		//it will return result.data
		return (new EfwClient()).fire(eventParams);
	}
};
// /////////////////////////////////////////////////////////////////////////////
// The initialization of system.
// /////////////////////////////////////////////////////////////////////////////
/**
 * efw is a rename of EfwClass.<br>
 * all using of framework base functions in your program should be started from
 * it.
 */
class EfwRoot{
	static baseurl = ".";
	static mode = "";
	static theme = "";
	static major = "";
	static dialog = null;
	static messages = null;
	static lang = "en";
	static isDownloading =false;
}
var efw = EfwRoot;
/**
 * Add events for input behaviors.
 */
$(function() {
	//--behavior---------------------------------------------------------------
	window.onhelp = EfwClientInputBehavior.unDohelp;
	$(document).on("keydown",EfwClientInputBehavior.doShortcut);
	var strSelectors=":text,:password,:radio,:checkbox,select,textarea"
		+",[type='search']"
		+",[type='tel']"
		+",[type='url']"
		+",[type='email']"
		+",[type='datetime']"
		+",[type='date']"
		+",[type='month']"
		+",[type='week']"
		+",[type='time']"
		+",[type='datetime-local']"
		+",[type='number']"
		+",[type='file']"
		+",[type='SEARCH']"
		+",[type='TEL']"
		+",[type='URL']"
		+",[type='EMAIL']"
		+",[type='DATETIME']"
		+",[type='DATE']"
		+",[type='MONTH']"
		+",[type='WEEK']"
		+",[type='TIME']"
		+",[type='DATETIME-LOCAL']"
		+",[type='NUMBER']"
		+",[type='FILE']"
//color range hidden submit image reset button
	;
	$(document).on("focus",strSelectors,EfwClientInputBehavior.doFocus);
	$(document).on("blur",strSelectors,EfwClientInputBehavior.doBlur);
	$(document).on("focus","[data-format]",EfwClientInputBehavior.doFormatFocus);
	$(document).on("blur","[data-format]",EfwClientInputBehavior.doFormatBlur);
	//--loading----------------------------------------------------------------
	$("body").append("<div id='efw_loading'></div>");
	$("#efw_loading").hide();
	$(document).bind("ajaxStart",function(){
		$("#efw_loading").show();
	});
	$(document).bind("ajaxStop",function(){
		$("#efw_loading").hide();
	});
	//--dialog-----------------------------------------------------------------
	efw.dialog=new EfwDialog();
	//--messages---------------------------------------------------------------
	efw.messages=new EfwClientMessages();
});

