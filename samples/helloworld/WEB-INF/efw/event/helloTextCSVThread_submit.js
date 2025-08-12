var helloTextCSVThread_submit={};
helloTextCSVThread_submit.paramsFormat={
	mode:null,
};
helloTextCSVThread_submit.mylocker = new java.util.concurrent.locks.ReentrantLock();//マルチスレッドバッファーを操作するためのロッカー
helloTextCSVThread_submit.fire=function(params){
	file.remove("text&csv/seperated");
	file.makeDir("text&csv/seperated");
	var ret=new Result().eval("elfinder1.setHome('text&csv/seperated')");
	
	//例１、各種制限を考慮せず無邪気な例
	if (params.mode=="1"){//////////////////////////////////////////////////////
		var ary=new BinaryReader(
		    "text&csv/myText.txt",//読み取るファイル
		    [10,10],//項目ごとのバイト数
		    ["MS932","MS932"],//項目ごとの文字コード
		    20//１つレイアウトのバイト数
		).readAllLines();//全部レコードを一括で読み取る
		for(var i=0;i<ary.length;i++){
		    //IDで保存先を特定する。
		    var writer= new CSVWriter("text&csv/seperated/"+ary[i][0]+".csv", ",", "\"", "MS932");
		    writer.writeLine(ary[i]);//レコードを書き込む
		    writer.close();
		}
	//例２、１件ずつ処理の慎重派の例
	}else if (params.mode=="2"){////////////////////////////////////////////////
		new BinaryReader(
		    "text&csv/myText.txt",//読み取るファイル
		    [10,10],//項目ごとのバイト数
		    ["MS932","MS932"],//項目ごとの文字コード
		    20//１つレイアウトのバイト数
		).loopAllLines(function(fields,index){//全部レコードを１件ずつ読み取る
		    //IDで保存先を特定する。
		    var writer= new CSVWriter("text&csv/seperated/"+fields[0]+".csv", ",", "\"", "MS932");
		    writer.writeLine(fields);//レコードを書き込む
		    writer.close();
		});
	//例３、ロット別でIOを分ける例
	}else if (params.mode=="3"){////////////////////////////////////////////////
		var buffer=[];//ロット処理のバッファー
		new BinaryReader(
		    "text&csv/myText.txt",//読み取るファイル
		    [10,10],//項目ごとのバイト数
		    ["MS932","MS932"],//項目ごとの文字コード
		    20//１つレイアウトのバイト数
		).loopAllLines(function(fields,index){//全部レコードを１件ずつ読み取る
		    buffer.push(fields);
		    if (index % 10 == 0){//ロット数に達すかどうか判断
		        saveBuffer();//ロットを保存する
		    }
		});
		saveBuffer();//ロット数未満の残データを保存する
		//------以下はバッファー保存用の内部関数
		function saveBuffer(){
		    for (var i=0;i<buffer.length;i++){
		        //IDで保存先を特定する。
		        var writer= new CSVWriter("text&csv/seperated/"+buffer[i][0]+".csv", ",", "\"", "MS932");
		        writer.writeLine(buffer[i]);//レコードを書き込む
		        writer.close();
		    }
		    buffer=[];//バッファーを初期化する
		}
	//例４、ライターの使いまわし例
	}else if (params.mode=="4"){////////////////////////////////////////////////
		var buffer=[];//ロット処理のバッファー
		var writers={};//ライターを格納するマップ
		new BinaryReader(
		    "text&csv/myText.txt",//読み取るファイル
		    [10,10],//項目ごとのバイト数
		    ["MS932","MS932"],//項目ごとの文字コード
		    20//１つレイアウトのバイト数
		).loopAllLines(function(fields,index){//全部レコードを１件ずつ読み取る
		    buffer.push(fields);
		    if (index % 10 == 0){//ロット数に達すかどうか判断
		        saveBuffer();//ロットを保存する
		    }
		});
		saveBuffer();//ロット数未満の残データを保存する
		saveWriters();//ライターを一括で閉じる
		//------以下はバッファー保存用の内部関数
		function saveBuffer(){
		    for (var i=0;i<buffer.length;i++){
		        //IDで保存先を特定する。
		        var writer=writers[buffer[i][0]];
		        if (writer==null){
		            writer=new CSVWriter("text&csv/seperated/"+buffer[i][0]+".csv", ",", "\"", "MS932");
		            writers[buffer[i][0]]=writer;
		        }
		        writer.writeLine(buffer[i]);//レコードを書き込む
		    }
		    buffer=[];//バッファーを初期化する
		}
		//--------ライターを一括で閉じる関数
		function saveWriters(){
		    for(var key in writers){
		        if (key=="debug")continue;
		        writers[key].close();
		    }
		}
	//例５、バッファーの配列をID別に分ける例
	}else if (params.mode=="5"){////////////////////////////////////////////////
		var buffer={};//ロット処理のバッファーマップ、ID別の配列を格納する
		new BinaryReader(
		    "text&csv/myText.txt",//読み取るファイル
		    [10,10],//項目ごとのバイト数
		    ["MS932","MS932"],//項目ごとの文字コード
		    20//１つレイアウトのバイト数
		).loopAllLines(function(fields,index){//全部レコードを１件ずつ読み取る
		    //もしID別の配列がまだ存在しない場合、その配列を初期化する
		    if (buffer[fields[0]]==null)buffer[fields[0]]=[];
		    buffer[fields[0]].push(fields);
		    if (index % 10 == 0){//ロット数に達すかどうか判断
		        saveBuffer();//ロットを保存する
		    }
		});
		saveBuffer();//ロット数未満の残データを保存する
		//------以下はバッファー保存用の内部関数
		function saveBuffer(){
		    for (var key in buffer){
		        if (key=="debug")continue;
		        var ary=buffer[key];
		        var writer=new CSVWriter("text&csv/seperated/"+key+".csv", ",", "\"", "MS932");
		        for(var i=0;i<ary.length;i++){
		             writer.writeLine(ary[i]);//レコードを書き込む
		        }
		        writer.close();
		    }
		    buffer={};//バッファーを初期化する
		}
	
	//例６、マルチスレッドの例
	}else if (params.mode=="6"){////////////////////////////////////////////////
		var buffer={};//ロット処理のバッファーマップ、ID別の配列を格納する
		var hasDataFlag=false;//データ有無フラグ
		var lot=0;
		do{
			hasDataFlag=false;//初期値false
			var threads = new Threads(2);
			threads.add({from:0+lot*10 ,run:makeCsvBuffer});
			threads.add({from:5+lot*10 ,run:makeCsvBuffer});
			threads.run();//マルチスレッドを実行する
			saveBuffer();//バッファーを保存する。データある場合、hasDataFlagをtrueにする
			lot++;
		}while(hasDataFlag);
		//------以下はCSVバッファーを作成する関数
		function makeCsvBuffer(){
			new BinaryReader(
			    "text&csv/myText.txt",//読み取るファイル
			    [10,10],//項目ごとのバイト数
			    ["MS932","MS932"],//項目ごとの文字コード
			    20,//１つレイアウトのバイト数
				this.from,//読み込み開始レコード番号
				5//読み込み件数、ロット件数/スレッド数
			).loopAllLines(function(fields,index){//全部レコードを１件ずつ読み取る
			    //もしID別の配列がまだ存在しない場合、その配列を初期化する
				helloTextCSVThread_submit.mylocker.lock();//ロックする
			    	if (buffer[fields[0]]==null)buffer[fields[0]]=[];
			    	buffer[fields[0]].push(fields);
				helloTextCSVThread_submit.mylocker.unlock();//ロック解除する
			});
		}
		//------以下はバッファー保存用の内部関数
		function saveBuffer(){
		    for (var key in buffer){
		        if (key=="debug")continue;
		        var ary=buffer[key];
		        var writer=new CSVWriter("text&csv/seperated/"+key+".csv", ",", "\"", "MS932");
		        for(var i=0;i<ary.length;i++){
		             writer.writeLine(ary[i]);//レコードを書き込む
		        }
		        writer.close();
		    	hasDataFlag=true;
		    }
		    buffer={};//バッファーを初期化する
		}
	}
	return ret.alert("The file has been seperated.");
	
}