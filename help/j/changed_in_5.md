# Efw5の変化箇所

## １、NarshornからGraaljsに変更
- サポートするJavaScriptバージョンはES6(2015)からES15(2024)に更新される。
- globalモジュールloadWithGlobalPool関数とloadWithNewGlobal関数を破棄する。
- Efw関数とモジュールをJavaScriptクラスで再作成する。
- Efwクラスの未初期化エラーNewKeywordWasForgottenExceptionを防止する。
- Threadsクラスを破棄する。

## ２、マルチContextに変更
- リリースモード時、イベントjsフォルダの全ソースをメモリにロードする。
- load関数はリリースモード時無視される。
- eventモジュールのload関数はリリースモード時無視される。
- sessionモジュールではJavaオブジェクトとJSONオブジェクト以外の内容は無視される。
- 初期化用globalイベントで高負荷な処理の実行は非推奨になる。

## ３、実績少ない機能の削除
- dbモジュールmaster関数
- barcodeモジュール
- TXTReaderクラス
- 長時間実行時にセッション維持するためのkeepConnectionAlive

## ４、関連ソフトの変化による破棄
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

## ５、一部内部関数の昇格
- eventモジュールのload、get関数
- dbモジュールのcommit、rollback、commitAll、rollbackAll関数

## ６、Vue連携のための機能調整
- Resultクラスにprovide関数を設ける
- クライアントEfw関数の戻り値を設ける
- ClientタグにaddVue属性を設ける
