/**** efw5.X Copyright 2025 efwGrp ****/
/**
 * The class to create dialog by jquery-ui.
 * 
 * @author Chang Kejun
 */
class EfwDialog{
	constructor(){
		//--alert--------------------------------------------------------------
		$("body").append("<div id='efw_client_alert' style='display:none'><p></p></div>");
		this.#alert = $("#efw_client_alert").dialog({
			modal : true,
			width : 500,
			title : "Message",
			autoOpen: false
		});
		//--wait---------------------------------------------------------------
		$("body").append("<div id='efw_client_wait' style='display:none'><p></p><div style='text-align:right'></div></div>");
		this.#wait = $("#efw_client_wait").dialog({
			dialogClass:"no-close",
			modal : true,
			width : 500,
			title : "Message",
			autoOpen: false
		});
		//--preview------------------------------------------------------------
		$("body").append("<div id='efw_client_preview' style='display:none'></div>");
		this.#preview = $("#efw_client_preview").dialog({
			modal : true,
			height : 500,
			title : "Preview",
			autoOpen: false
		});
	}
	#alert=null;
	#wait=null;
	#preview=null;
	/**
	 * The function to show alert.
	 * @param {String} message: required<br>
	 * @param {Object} buttons: optional<br>
	 * @param {String} title: optional<br>
	 * @param {Function} callback: optional<br>
	 */
	alert(message, buttons, title, callback) {
		let self=this;
		if (!self.#alert.dialog("isOpen")){
			let dialogButtons={};
			if(buttons!=null){
				for(let key in buttons){
					dialogButtons[key]=function(){
						let btn=buttons[key];
						return function(){
							self.#alert.dialog("close");
							if (typeof btn =="function"){
								btn();
							}else{
								window.eval(btn);
							}
						};
					}();
				};
			}else{
				dialogButtons[efw.messages.AlertDialogOK]=function(){
					self.#alert.dialog("close");
				};
			}
			self.#alert.dialog("option", "buttons", dialogButtons);
			self.#alert.dialog("option", "title", title!=null?title:efw.messages.AlertDialogTitle);
			if(callback){
				self.#alert.dialog("option", "beforeClose", function(){window.setTimeout(callback);});
			}else{
				self.#alert.dialog("option", "beforeClose", null);
			}
			$("#efw_client_alert p").html(message.replace(/\n/g, "<br>"));
			
			self.#alert.dialog("open");
		}else{
			window.setTimeout(function(){
				self.alert(message, buttons, title, callback);
			},1000);
		}
	}
	/**
	 * The function to show wait.
	 * @param {String} message: required<br>
	 * @param {String} title: optional<br>
	 * @param {Function} callback: optional<br>
	 */
	wait(message, countdown, title, callback) {
		let self=this;
		if (!self.#wait.dialog("isOpen")){
			self.#wait.dialog("option", "title", title!=null?title:efw.messages.WaitDialogTitle);
			if(callback)self.#wait.dialog("option", "beforeClose", function(){window.setTimeout(callback);});
			$("#efw_client_wait p").html(message.replace(/\n/g, "<br>"));
			let timer = new easytimer.Timer();
			timer.start({countdown: true, startValues: {seconds: countdown}});
			$("#efw_client_wait div").html(timer.getTimeValues().toString());
			timer.addEventListener("secondsUpdated", function (e){
				$("#efw_client_wait div").html(timer.getTimeValues().toString());
			});
			timer.addEventListener("targetAchieved", function (e){
				self.#wait.dialog("close");
			});
			self.#wait.dialog("open");
		}else{
			window.setTimeout(function(){
				self.wait(message, countdown, title, callback);
			},1000);
		}
	}
	/**
	 * The function to show preview.
	 * @param {String} previewUrl: required<br>
	 * @param {String} fileName: optional<br>
	 */
	preview(previewUrl,fileName) {
		let self=this;
		if (!self.#preview.dialog("isOpen")){
			let ary=fileName.split("/");
			fileName=ary[ary.length-1];
			ary=fileName.split(".");
			let ext=ary[ary.length-1].toLowerCase();
			let bodyHeight=$("body").css("height");
			$("body").css("height","100%");
			self.#preview.dialog("option", "title", efw.messages.PreviewDialogTitle+" : "+fileName);
			self.#preview.dialog("option", "height", $(window).height()*0.95 );
			self.#preview.dialog("option", "width", $(window).width()*0.95 );
			$("#efw_client_preview").css("overflow","hidden");
			$("body").css("height",bodyHeight);
			if (previewUrl.indexOf("?")==-1){
				previewUrl+="?";
			}else{
				previewUrl+="&";
			}
			previewUrl+="dt="+new Date().getTime();
			//画像かどうか判断する
			if(ext=="tiff"||ext=="svg"||ext=="png"||ext=="jpeg"||ext=="jpg"||ext=="gif"){
				//ヘッダがあるからheightを90%にする
				$("#efw_client_preview").html('<img src="'+previewUrl+'" style="max-width:100%;max-height:100%;">');
			}else{
				$("#efw_client_preview").html('<object data="'+previewUrl+'" style="width:100%;height:100%;"></object>');
			}
	
			self.#preview.dialog("open");
		}else{
			window.setTimeout(function(){
				self.#preview(previewUrl,fileName);
			},1000);
		}
	}
};
