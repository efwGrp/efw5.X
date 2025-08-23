/**** efw5.X Copyright 2025 efwGrp ****/
package efw.script;

import org.graalvm.polyglot.Value;
/**
 * GraaljsのContextのラッパー
 * @author Chang Kejun
 */
public class ScriptContext {
	/**
	 * コンストラクタ
	 * @param jsBindings GraaljsのContextのjsBindings
	 */
	protected ScriptContext(Value jsBindings) {
		_doInit=jsBindings.getMember("efw").getMember("doInit");
		_doDestroy=jsBindings.getMember("efw").getMember("doDestroy");
		_doPost=jsBindings.getMember("efw").getMember("doPost");
		_doBatch=jsBindings.getMember("efw").getMember("doBatch");
		_doRestAPI=jsBindings.getMember("efw").getMember("doRestAPI");
	}
	/**
	 * JS初期化関数のハンドル
	 */
	private Value _doInit=null;
	/**
	 * JS初期化関数の実行関数
	 */
	public void doInit() {
		_doInit.executeVoid();
	}
	/**
	 * JS破棄関数のハンドル
	 */
	private Value _doDestroy=null;
	/**
	 * JS破棄関数の実行関数
	 */
	public void doDestory() {
		_doDestroy.executeVoid();
		_doDestroy.getContext().close();
	}
	/**
	 * JSポスト関数のハンドル
	 */
	private Value _doPost=null;
	/**
	 * JSポスト関数の実行関数
	 * @param req パラメータ
	 * @return 実行結果
	 */
	public String doPost(String req) {
		return _doPost.execute(req).asString();
		
	}
	/**
	 * JSバッチ関数のハンドル
	 */
	private Value _doBatch=null;
	/**
	 * JSバッチ関数の実行関数
	 * @param req パラメータ
	 * @return 実行結果
	 */
	public String doBatch(String req) {
		return _doBatch.execute(req).asString();
	}
	/**
	 * JSRESTサービス関数のハンドル
	 */
	private Value _doRestAPI=null;
	/**
	 * RESTサービス関数の実行関数
	 * @param eventId RESTイベントID。
	 * @param reqKeys RESTイベントのURLのキー。
	 * @param httpMethod HTTPメソッド。
	 * @param reqParams RESTイベントのURLのパラメータ。
	 * @return 実行結果のJSON文字列。
	 */
	public String doRestAPI(String eventId,String reqKeys,String httpMethod,String reqParams) {
		return _doRestAPI.execute(eventId,reqKeys,httpMethod,reqParams).asString();
	}
}
