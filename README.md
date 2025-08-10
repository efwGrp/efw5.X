# efw5.X

## efw4.Xとの違い
### １、NarshornからGraaljsに変更
- サポートするJavaScriptバージョンはES6(2015)からES15(2024)にアップする。
- globalモジュールloadWithGlobalPool関数とloadWithNewGlobal関数を破棄する。
- Efw関数とモジュールをJavaScriptクラスで再作成する。
- Efwクラスが未初期化エラーNewKeywordWasForgottenExceptionを廃棄する。

### ２、マルチContextに変更
- リリースモード時、イベントjsフォルダの全ソースをメモリにロードする。
- load関数はリリースモード時無視される。
- eventモジュールのload関数はリリースモジュール時無視される。
- sessionモジュールにJavaオブジェクトとJSONオブジェクト以外の内容は無視される。
- 初期化用globalイベントで負荷高い処理の実行は非推奨になる。

### ３、実績少ない機能の削除
- dbモジュールmaster関数
- barcodeモジュール
- TXTReaderモジュール
- 長時間実行時セッション維持するためのkeepConnectionAlive

### ３、関連ソフトの変化による破棄
- Clientタグのnopromise属性
```
IEおよびIEモードのサポート終了
wkhtmltopdfのサポート終了
```

- brmsモジュールと関連のプロパティ設定
```
innorulesのランタイム利用からRestAPI利用へのシフト
```
- クライアント関数Efw()のserverパラメータ
```
各種ブラウザーのセキュリティ強化によりcors利用困難
```
- cors関連のプロパティ設定
```
Tomcatのcors設定でご対応ください。
https://tomcat.apache.org/tomcat-9.0-doc/config/filter.html
```

### ４、一部内部関数の昇格
- eventモジュールのload、get関数
- dbモジュールのcommit、rollback、commitAll、rollbackAll関数

help OK event.load
help OK event.get
help OK result.preview


Client.vue
rest.get put detete postをクライアントで実装する






