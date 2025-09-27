# EFW Function

The EFW function is established to call server events from JSP in AJAX. It is not necessary to send params or receive results when calling server events. The only thing you must do is send the event ID.

## Sample for JSP

```html
<input type="button" value="Send" onclick="Efw('helloWorld_sendMessage')">
<script>
	//you can use await to get return from Efw function.
	var myData=await Efw("helloworld_sendMessage");
	//or use promise then to get it.
	var myData;
	Efw("helloworld_sendMessage").then(function(data){
		myData=data;
	});
	//myData is {a:1,b:2};
	////////////////////////////////////
	//the following source is event js.
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

| Calling | Returning |
|---|---|
| `Efw ( eventId )` | `void` \| `any` |
| `Efw ( eventId, manualParams )` |`void` \| `any` |

| Parameter | Type | Description |
|---|---|---|
| `eventId` | `String` | The name of an event file. |
| `manualParams` | `JSON Object` | To send some values which cannot be defined by jQuery selectors. <br>```{"mode":"edit"}``` |
