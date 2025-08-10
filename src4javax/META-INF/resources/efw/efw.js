/**** efw4.X Copyright 2019 efwGrp ****/
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
		(new EfwClient()).fire(eventParams);
	}
};

Efw.prototype.baseurl = ".";
Efw.prototype.dialog = null;
Efw.prototype.messages = null;
Efw.prototype.lang = "en"; 
// /////////////////////////////////////////////////////////////////////////////
// The initialization of system.
// /////////////////////////////////////////////////////////////////////////////
/**
 * efw is an instance of Efw.<br>
 * all using of framework base functions in your program should be started from
 * it.
 */
var efw = new Efw();
/**
 * Add events for input behaviors.
 */
$(function() {
	//--behavior---------------------------------------------------------------
	window.onhelp = efwClientInputBehavior.prototype.unDohelp;
	$(document).on("keydown",efwClientInputBehavior.prototype.DoShortcut);
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
	$(document).on("focus",strSelectors,efwClientInputBehavior.prototype.DoFocus);
	$(document).on("blur",strSelectors,efwClientInputBehavior.prototype.DoBlur);
	$(document).on("focus","[data-format]",efwClientInputBehavior.prototype.DoFormatFocus);
	$(document).on("blur","[data-format]",efwClientInputBehavior.prototype.DoFormatBlur);
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
	//--isDownloading----------------------------------------------------------
	efw.isDownloading=false;
});

