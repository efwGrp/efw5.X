# event.get

The `get` function is used to get an application event. Its return is the object of the application event.

## Sample

```javascript
var ev=event.get("subEvent");
if (!ev){ev=event.load("subEvent")}
```

| Calling | Returning |
|---|---|
| `event. get ( eventId )` | `Event` |

| Parameters | Type | Description |
|---|---|---|
| `eventId` | `String` | The event file name. |
