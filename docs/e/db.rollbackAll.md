# db.rollbackAll

The `rollbackAll` function is established to rollback all transactions for all database resources. By default, it does not need to be called explicitly.

## Sample

```javascript
try{
	db.change("TB1","deleteAll",{},"jdbc/efw");
	db.change("TB2","deleteAll",{},"jdbc/car");
	db._commitAll();
}catch(e){
	db.rollbackAll();
}
```

## API

| Calling | Returning |
|---|---|
| `db. rollbackAll ( )` | `void` |