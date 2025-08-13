# event.fire

`get` 函数用于获取应用程序事件。它的返回值是应用程序事件的对象。

## 示例

```javascript
var ev=event.get("subEvent");
if (!ev){ev=event.load("subEvent")}
```

| 调用 | 返回值 |
|---|---|
| `event. get ( eventId )` | `Event` |

| 参数 | 类型 | 描述 |
|---|---|---|
| `eventId` | `String` | 事件文件名。 |
