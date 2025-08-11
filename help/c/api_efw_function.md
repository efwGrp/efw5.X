# EFW 函数

EFW 函数用于通过 AJAX 从 JSP 调用服务器事件。调用服务器事件时，无需发送参数或接收结果。您唯一需要做的就是发送事件 ID。

## JSP 示例

```html
<input type="button" value="发送" onclick="Efw('helloWorld_sendMessage')">
<script>
	//您可以使用 await 从 Efw 函数获取返回。
	var myData=await Efw("helloworld_sendMessage");
	//或者使用 promise then 来获取它.
	var myData;
	Efw("helloworld_sendMessage").then(function(data){
		myData=data;
	});
	//myData is {a:1,b:2};
	////////////////////////////////////
	//以下是事件js。
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

| 调用 | 返回值 |
|---|--|
| `Efw ( eventId )` | `void` \| `any` |
| `Efw ( eventId, manualParams )` | `void` \| `any` |

| 参数 | 类型 | 描述 |
|---|---|---|
| `eventId` | `String` | 事件文件的名称。 |
| `manualParams` | `JSON 对象` | 用于发送一些无法通过 jQuery 选择器定义的值。<br>```{"mode":"edit"}``` |
