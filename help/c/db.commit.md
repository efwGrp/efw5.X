# db.commit

`commit` 函数用于提交事务。默认情况下，它不需要显式调用。

## 示例

```javascript
try{
	db.change("TB1","deleteAll",{});
	db.commit();
}catch(e){
	db._rollback();
}
```

## API

| 调用 | 返回值 |
|---|---|
| `db. commit ( )` | `void` |
| `db. commit ( jdbcResourceName )` | `void` |

| 参数 | 类型 | 描述 |
|---|---|---|
| `jdbcResourceName` | `String` | 用于操作另一个数据库资源（非默认）的事务。 |