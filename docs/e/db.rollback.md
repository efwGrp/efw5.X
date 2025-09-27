# db.rollback

The `rollback` function is established to rollback a transaction. By default, it does not need to be called explicitly.

## Sample

```javascript
try{
	db.change("TB1","deleteAll",{});
	db._commit();
}catch(e){
	db.rollback();
}
```

## API

| Calling | Returning |
|---|---|
| `db. rollback ( )` | `void` |
| `db. rollback ( jdbcResourceName )` | `void` |

| Parameters | Type | Description |
|---|---|---|
| `jdbcResourceName` | `String` | To operate the transaction for another database resource, not the default. |

