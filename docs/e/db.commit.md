# db.commit

The `commit` function is established to commit a transaction. By default, it does not need to be called explicitly.

## Sample

```javascript
try{
	db.change("TB1","deleteAll",{});
	db.commit();
}catch(e){
	db._rollback();
}
```

## API

| Calling | Returning |
|---|---|
| `db. commit ( )` | `void` |
| `db. commit ( jdbcResourceName )` | `void` |

| Parameters | Type | Description |
|---|---|---|
| `jdbcResourceName` | `String` | To operate the transaction for another database resource, not the default. |

