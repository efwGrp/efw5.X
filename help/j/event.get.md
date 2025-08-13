# event.get

`get`関数はアプリケーションイベントを取得するために使用されます。戻り値はアプリケーションイベントのオブジェクトです。

## サンプル

```javascript
var ev=event.get("subEvent");
if (!ev){ev=event.load("subEvent")}
```

| 呼び出し | 戻り値 |
|---|---|
| `event. get ( eventId )` | `Event` |

| パラメータ | 型 | 説明 |
|---|---|---|
| `eventId` | `String` | イベントファイル名。 |
