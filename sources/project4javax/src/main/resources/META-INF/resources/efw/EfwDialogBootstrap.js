/**** efw5.X Copyright 2025 efwGrp ****/
/**
 * The class to create dialog by bootstrap.
 * 
 * @author Chang Kejun
 */
class EfwDialog {
	constructor(){
		//--alert--------------------------------------------------------------
		if (efw.major=="5"){
			$("body").append("<div class='modal hide' id='efw_client_alert' data-bs-backdrop='static' tabindex='-1'><div class='modal-dialog'><div class='modal-content'><div class='modal-header'><h5 class='modal-title'>Message</h5><button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button></div><div class='modal-body'></div><div class='modal-footer'></div></div></div></div>");
		}else if (efw.major=="4"){
			$("body").append("<div class='modal hide' id='efw_client_alert' data-backdrop='static' tabindex='-1'><div class='modal-dialog'><div class='modal-content'><div class='modal-header'><h5 class='modal-title'>Message</h5><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div><div class='modal-body'></div><div class='modal-footer'></div></div></div></div>");
		}else if (efw.major=="3"){
			$("body").append("<div class='modal' id='efw_client_alert' data-backdrop='static' tabindex='-1'><div class='modal-dialog'><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button><h5 class='modal-title'>Message</h5></div><div class='modal-body'></div><div class='modal-footer'></div></div></div></div>");
		}
		this.#alert = $("#efw_client_alert");
		this.#alert.on("hide.bs.modal", function(){if (efw.dialog.#alert._callback) window.setTimeout(efw.dialog.#alert._callback);});
		//--wait---------------------------------------------------------------
		if (efw.major=="5"){
			$("body").append("<div class='modal hide' id='efw_client_wait' data-bs-backdrop='static' tabindex='-1'><div class='modal-dialog'><div class='modal-content'><div class='modal-header'><h5 class='modal-title'>Message</h5></div><div class='modal-body'></div><div class='modal-footer'></div></div></div></div>");
		}else if (efw.major=="4"){
			$("body").append("<div class='modal hide' id='efw_client_wait' data-backdrop='static' tabindex='-1'><div class='modal-dialog'><div class='modal-content'><div class='modal-header'><h5 class='modal-title'>Message</h5></div><div class='modal-body'></div><div class='modal-footer'></div></div></div></div>");
		}else if (efw.major=="3"){
			$("body").append("<div class='modal' id='efw_client_wait' data-backdrop='static' tabindex='-1'><div class='modal-dialog'><div class='modal-content'><div class='modal-header'><h5 class='modal-title'>Message</h5></div><div class='modal-body'></div><div class='modal-footer'></div></div></div></div>");
		}
		this.#wait = $("#efw_client_wait");
		this.#wait.on("hide.bs.modal", function(){if (efw.dialog.#wait._callback) window.setTimeout(efw.dialog.#wait._callback);});
		//--preview------------------------------------------------------------
		if (efw.major=="5"){
			$("body").append("<div class='modal hide' id='efw_client_preview' data-bs-backdrop='static' tabindex='-1'><div class='modal-dialog'><div class='modal-content'><div class='modal-header'><h5 class='modal-title'>Message</h5><button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button></div><div class='modal-body'></div></div></div></div>");
		}else if (efw.major=="4"){
			$("body").append("<div class='modal hide' id='efw_client_preview' data-backdrop='static' tabindex='-1'><div class='modal-dialog'><div class='modal-content'><div class='modal-header'><h5 class='modal-title'>Message</h5><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div><div class='modal-body'></div></div></div></div>");
		}else if (efw.major=="3"){
			$("body").append("<div class='modal' id='efw_client_preview' data-backdrop='static' tabindex='-1'><div class='modal-dialog'><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button><h5 class='modal-title'>Message</h5></div><div class='modal-body'></div></div></div></div>");
		}
		this.#preview = $("#efw_client_preview");
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
		if (!self.#alert.is(":visible")){
			$(".modal-footer",self.#alert).html("");
			if(buttons!=null){
				let isPrimary=true;
				for(let key in buttons){
					if(isPrimary){
						if (efw.major=="5"){
							$(".modal-footer",self.#alert).append("<button type='button' class='btn btn-primary' data-bs-dismiss='modal'>"+key+"</button>");
						}else if (efw.major=="4"){
							$(".modal-footer",self.#alert).append("<button type='button' class='btn btn-primary' data-dismiss='modal'>"+key+"</button>");
						}else if (efw.major=="3"){
							$(".modal-footer",self.#alert).append("<button type='button' class='btn btn-primary' data-dismiss='modal'>"+key+"</button>");
						}
						isPrimary=false;
					}else{
						if (efw.major=="5"){
							$(".modal-footer",self.#alert).append("<button type='button' class='btn btn-secondary' data-bs-dismiss='modal'>"+key+"</button>");
						}else if (efw.major=="4"){
							$(".modal-footer",self.#alert).append("<button type='button' class='btn btn-secondary' data-dismiss='modal'>"+key+"</button>");
						}else if (efw.major=="3"){
							$(".modal-footer",self.#alert).append("<button type='button' class='btn btn-secondary' data-dismiss='modal'>"+key+"</button>");
						}
					}
					$(".modal-footer button:last",self.#alert).click(function(){
						let btn=buttons[key];
						return function(){
							if (typeof btn =="function"){
								btn();
							}else{
								window.eval(btn);
							}
						};
					}());
				};
			}else{
				if (efw.major=="5"){
					$(".modal-footer",self.#alert).append("<button type='button' class='btn btn-primary' data-bs-dismiss='modal'>"+efw.messages.AlertDialogOK+"</button>");
				}else if (efw.major=="4"){
					$(".modal-footer",self.#alert).append("<button type='button' class='btn btn-primary' data-dismiss='modal'>"+efw.messages.AlertDialogOK+"</button>");
				}else if (efw.major=="3"){
					$(".modal-footer",self.#alert).append("<button type='button' class='btn btn-primary' data-dismiss='modal'>"+efw.messages.AlertDialogOK+"</button>");
				}
			}
			$(".modal-title",self.#alert).html(title!=null?title:efw.messages.AlertDialogTitle);
			$(".modal-body",self.#alert).html(message.replace(/\n/g, "<br>"));
			
			self.#alert._callback=callback;
			self.#alert.modal("show");
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
		if (!self.#wait.is(":visible")){
			$(".modal-title",self.#wait).html(title!=null?title:efw.messages.WaitDialogTitle);
			$(".modal-body",self.#wait).html(message.replace(/\n/g, "<br>"));
			let timer = new easytimer.Timer();
			timer.start({countdown: true, startValues: {seconds: countdown}});
			$(".modal-footer",self.#wait).html(timer.getTimeValues().toString());
			timer.addEventListener("secondsUpdated", function (e){
				$(".modal-footer",self.#wait).html(timer.getTimeValues().toString());
			});
			timer.addEventListener("targetAchieved", function (e){
				self.#wait.modal("hide");
			});
			self.#wait._callback=callback;
			self.#wait.modal("show");
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
		if (!self.#preview.is(":visible")){
			if (fileName)fileName="";
			let ary=fileName.split("/");
			fileName=ary[ary.length-1];
			ary=fileName.split(".");
			let ext=ary[ary.length-1].toLowerCase();
			$(".modal-title",self.#preview).html(efw.messages.PreviewDialogTitle+" : "+fileName);
			let bodyHeight=$("body").css("height");
			$("body").css("height","100%");
			$(".modal-dialog",self.#preview).css("height",$(window).height()*0.95);
			$(".modal-dialog",self.#preview).css("max-height",$(window).height()*0.95);
			$(".modal-dialog",self.#preview).css("width",$(window).width()*0.95);
			$(".modal-dialog",self.#preview).css("max-width",$(window).width()*0.95);
			$(".modal-dialog",self.#preview).css("margin-left","auto");
			$(".modal-content",self.#preview).css("height","100%");
			$(".modal-body",self.#preview).css("overflow","hidden");
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
				$(".modal-body",self.#preview).html('<img src="'+previewUrl+'" style="max-width:100%;max-height:100%;">');
			}else{
				$(".modal-body",self.#preview).html('<object data="'+previewUrl+'" style="width:100%;height:100%;"></object>');
			}
			self.#preview.modal("show");
		}else{
			window.setTimeout(function(){
				self.#preview(previewUrl,fileName);
			},1000);
		}
	}
};
