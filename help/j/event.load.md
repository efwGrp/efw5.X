# event.fire

`load` 関数は、スクリプト ファイルからアプリケーション イベントをロードするために使用されます。

## サンプル

```javascript
var ev=event.get("subEvent");
if (!ev){ev=event.load("subEvent")}
```

| 呼び出し | 戻り値 |
|---|---|
| `event. load ( eventId )` | `void` |

| パラメータ | 型 | 説明 |
|---|---|---|
| `eventId` | `String` | イベントファイル名。 |
