# event.load

`load` 函数用于从脚本文件加载应用程序事件。

## 示例

```javascript
var ev=event.get("subEvent");
if (!ev){ev=event.load("subEvent")}
```

| 调用 | 返回值 |
|---|---|
| `event. load ( eventId )` | `void` |

| 参数 | 类型 | 描述 |
|---|---|---|
| `eventId` | `String` | 事件文件名。 |
