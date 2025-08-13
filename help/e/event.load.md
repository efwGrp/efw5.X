# event.load

The `load` function is used to load an application event from its script file. 

## Sample

```javascript
var ev=event.get("subEvent");
if (!ev){ev=event.load("subEvent")}
```

| Calling | Returning |
|---|---|
| `event. load ( eventId )` | `void` |

| Parameters | Type | Description |
|---|---|---|
| `eventId` | `String` | The event file name. |
