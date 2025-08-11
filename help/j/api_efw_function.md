# EFW関数

EFW関数は、JSPからAJAXでサーバーイベントを呼び出すために提供されています。サーバーイベントを呼び出す際に、パラメータを送信したり、結果を受け取ったりする必要はありません。必要なのはイベントIDを送信することだけです。

## JSPのサンプル

```html
<input type="button" value="送信" onclick="Efw('helloWorld_sendMessage')">
<script>
	//Efw 関数からの戻り値を取得するには、await を使用できます。
	var myData=await Efw("helloworld_sendMessage");
	//または promise then を使用して取得します。
	var myData;
	Efw("helloworld_sendMessage").then(function(data){
		myData=data;
	});
	//myData is {a:1,b:2};
	////////////////////////////////////
	//次のソースはイベント js です。
	/*
	var helloWorld_sendMessage={};
	helloWorld_sendMessage.paramsFormat={};
	helloWorld_sendMessage.fire(params){
		return new Result()
		.alert("here")
		.provide({a:1,b:2});
	}
	*/
</script>

```

## API

| 呼び出し | 戻り値 |
|---|--|
| `Efw ( eventId )` | `void` \| `any` |
| `Efw ( eventId, manualParams )` | `void` \| `any` |

| パラメータ | 型 | 説明 |
|---|---|---|
| `eventId` | `String` | イベントファイルの名前。 |
| `manualParams` | `JSONオブジェクト` | jQueryセレクタで定義できない値を送信する場合に使用します。<br>```{"mode":"edit"}``` |
