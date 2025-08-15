/**** efw5.X Copyright 2025 efwGrp ****/
package efw.script;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Semaphore;
import java.util.concurrent.locks.ReentrantLock;

import javax.script.ScriptException;

import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.Engine;
import org.graalvm.polyglot.EnvironmentAccess;
import org.graalvm.polyglot.HostAccess;
import org.graalvm.polyglot.PolyglotAccess;
import org.graalvm.polyglot.Source;
import org.graalvm.polyglot.Value;
import org.graalvm.polyglot.io.IOAccess;

import efw.framework;
import efw.file.FileManager;

/**
 * サーバーサイトJavaScriptの管理と実行を行うクラス。
 * @author Chang Kejun
 *
 */
public final class ScriptManager {
	/**
	 * ダミーコンストラクタ
	 */
	public ScriptManager(){super();}
	
	/**
     * スクリプトエンジンに渡すイベントJavaScriptファイルの格納パスのキー。
     * 「_eventfolder」に固定。
     */
    private static final String KEY_EVENTFOLDER="_eventfolder";
    /**
     * スクリプトエンジンに渡すデバッグモード制御フラグのキー。
     * 「_isdebug」に固定。
     */
    private static final String KEY_ISDEBUG="_isdebug";

    private static Engine _se;
    
    private static Source _sc;
    
    private static String ID="js";
	/**
	 * スクリプトエンジンを初期化する。
	 * @throws ScriptException スクリプトエラー。
	 */
	public static void init() throws ScriptException{
		try {
			//スレッドを跨る共有egineを作成する
			System.setProperty("polyglotimpl.AttachLibraryFailureAction", "ignore");
			_se = Engine.newBuilder()
				.option("engine.WarnInterpreterOnly", "false")
				.build();
			//スレッドを跨る共有ソースを作成する
			StringBuilder sb=new StringBuilder();
			sb.append(ScriptManager.loadResource("efw/resources/modules/EfwExtension4Js.js"));

			sb.append(ScriptManager.loadResource("efw/resources/classes/Record.js"));
			sb.append(ScriptManager.loadResource("efw/resources/classes/Result.js"));
			sb.append(ScriptManager.loadResource("efw/resources/classes/Excel.js"));
			sb.append(ScriptManager.loadResource("efw/resources/classes/Batch.js"));
			sb.append(ScriptManager.loadResource("efw/resources/classes/CSVReader.js"));
			sb.append(ScriptManager.loadResource("efw/resources/classes/CSVWriter.js"));
			sb.append(ScriptManager.loadResource("efw/resources/classes/BinaryReader.js"));
			sb.append(ScriptManager.loadResource("efw/resources/classes/BinaryWriter.js"));
			sb.append(ScriptManager.loadResource("efw/resources/classes/Pdf.js"));

			sb.append(ScriptManager.loadResource("efw/resources/elfinder/ElfinderEvent.js"));
			sb.append(ScriptManager.loadResource("efw/resources/elfinder/elfinder_cmds.js"));
			//以下のイベントはEfw関数から呼び出すため、パラメータを固定にする必要。
			sb.append(ScriptManager.loadResource("efw/resources/elfinder/elfinder_download.js"));
			sb.append(ScriptManager.loadResource("efw/resources/elfinder/elfinder_downloadFileList.js"));
			sb.append(ScriptManager.loadResource("efw/resources/elfinder/elfinder_file.js"));
			sb.append(ScriptManager.loadResource("efw/resources/elfinder/elfinder_preview.js"));

			sb.append(ScriptManager.loadResource("efw/resources/modules/EfwServer.js"));//EfwServerはEfwの前に置く必要。
			sb.append(ScriptManager.loadResource("efw/resources/modules/Efw.js"));
			sb.append(ScriptManager.loadResource("efw/resources/modules/EfwServerProperties.js"));
			sb.append(ScriptManager.loadResource("efw/resources/modules/EfwServerSession.js"));
			sb.append(ScriptManager.loadResource("efw/resources/modules/EfwServerRequest.js"));
			sb.append(ScriptManager.loadResource("efw/resources/modules/EfwServerDb.js"));
			sb.append(ScriptManager.loadResource("efw/resources/modules/EfwServerEvent.js"));
			sb.append(ScriptManager.loadResource("efw/resources/modules/EfwServerFile.js"));
			sb.append(ScriptManager.loadResource("efw/resources/modules/EfwServerMail.js"));
			sb.append(ScriptManager.loadResource("efw/resources/modules/EfwServerCookie.js"));
			sb.append(ScriptManager.loadResource("efw/resources/modules/EfwServerMessages.js"));
			sb.append(ScriptManager.loadResource("efw/resources/modules/EfwServerRest.js"));
			sb.append(ScriptManager.loadResource("efw/resources/modules/EfwServerCmd.js"));
			sb.append(ScriptManager.loadResource("efw/resources/modules/EfwServerFormat.js"));
			//リリースモードであれば全部イベントファイルをロードする
			if (!framework.getIsDebug()) {
				//システムのload関数を上書きする
				sb.append("function load(path){}");
				File[] lst=FileManager.getListByAbsolutePath(framework.getEventFolder());
				StringBuilder lg=new StringBuilder();
				lg.append("The following files are loaded:\n");
				for(int i=0;i<lst.length;i++) {
					lg.append(lst[i].getName()+"\n");
					sb.append(ScriptManager.loadFile(lst[i].getAbsolutePath()));
				}
				framework.initCLog(lg.toString());
			}
			_sc = Source.newBuilder(ID, sb.toString(),"efw.all.js").build();
			
			try(Context ctx=newContext(true)){}
		} catch (Exception e) {
			e.printStackTrace();
			throw new ScriptException(e);
		}

	}
	/**
	 * 新しいContextを作成する
	 * @return Context
	 */
	private static Context newContext(boolean loadSourceFlag) {
		Context ctx;
		ctx=Context.newBuilder(ID)
				.allowHostAccess(HostAccess.ALL)
				.allowNativeAccess(true)
				.allowCreateThread(true)
				.allowIO(IOAccess.ALL)
				.allowHostClassLookup(s -> true)
				.allowHostClassLoading(true)
				.allowPolyglotAccess(PolyglotAccess.ALL)
				.allowHostAccess(HostAccess.ALL)
				.allowCreateProcess(true)
				.allowEnvironmentAccess(EnvironmentAccess.INHERIT)
				.allowInnerContextOptions(true)
				.allowValueSharing(true)
				.allowExperimentalOptions(true)
				.option("js.nashorn-compat", "true")
				.option("js.ecmascript-version", "latest")
				.engine(_se).build();
		Value jsBindings = ctx.getBindings(ID);
		if (loadSourceFlag) {
			jsBindings.putMember(KEY_EVENTFOLDER, framework.getEventFolder());
			jsBindings.putMember(KEY_ISDEBUG, framework.getIsDebug());
			ctx.eval(_sc);
			jsBindings.getMember("efw").getMember("doInit").executeVoid();
		}
		return ctx;
	}
	/**
	 * サーバサイトイベントを実行する。
	 * @param req リクエストからjsイベントへの依頼情報。
	 * @return 実行結果のJSON文字列。
	 */
	public static String doPost(String req){
		try(Context ctx=newContext(true)){
			Value jsBindings = ctx.getBindings(ID);
			return jsBindings.getMember("efw").getMember("doPost").execute(req).asString();
		}
	}
	/**
	 * スクリプトエンジンを破棄する。
	 */
	public static void doDestroy(){
		try(Context ctx=newContext(true)){
			Value jsBindings = ctx.getBindings(ID);
			jsBindings.getMember("efw").getMember("doDestroy").executeVoid();
		}
	}
	/**
	 * バッチを実行する。
	 * doPostと比較する場合、HttpServletRequestがないようにすること。
	 * @param req バッチからjsイベントへの依頼情報。
	 * @return 実行結果のJSON文字列。
	 */
	public static String doBatch(String req){
		try(Context ctx=newContext(true)){
			Value jsBindings = ctx.getBindings(ID);
			return jsBindings.getMember("efw").getMember("doBatch").execute(req).asString();
		}
	}
	/**
	 * RESTサービスを実行する。
	 * @param eventId RESTイベントID。
	 * @param reqKeys RESTイベントのURLのキー。
	 * @param httpMethod HTTPメソッド。
	 * @param reqParams RESTイベントのURLのパラメータ。
	 * @return 実行結果のJSON文字列。
	 */
	public static String doRestAPI(String eventId,String reqKeys,String httpMethod,String reqParams){
		try(Context ctx=newContext(true)){
			Value jsBindings = ctx.getBindings(ID);
			return jsBindings.getMember("efw").getMember("doRestAPI").execute(eventId,reqKeys,httpMethod,reqParams).asString();
		}
	}
	/**
	 * パラメータマップに指定キーのパラメータが空白か否か判断する。
	 * 指定キーのパラメータが存在しない場合、true。
	 * 指定キーのパラメータがnullの場合、true。
	 * 指摘キーのパラメータが""の場合、true。
	 * @param params パラメータマップ。
	 * @param script ロジカル計算式。
	 * @return　判断結果。
	 */
	public static boolean getBool(Map<String,Object> params,String script) {
		try(Context ctx=newContext(false)){
			Value jsBindings = ctx.getBindings(ID);
			for(Map.Entry<String, Object> entry : params.entrySet()) {
				jsBindings.putMember(entry.getKey(), entry.getValue());
			}
			return ctx.eval(ID,script).asBoolean();
		}
	}
	/////////////////////////////////////////////////////
	/**
	 * 指定ファイル名のサーバーサイトJavaScriptファイルをロードする。
	 * @param fileName　サーバーサイトJavaScriptファイルの名称。
	 * @return ファイルの中身。
	 * @throws ScriptException スクリプトエラー。
	 * @throws IOException ファイル操作エラー。
	 */
	private static String loadFile(String fileName) throws ScriptException, IOException  {
		BufferedReader rd=new BufferedReader(new InputStreamReader(
				new FileInputStream(fileName),framework.SYSTEM_CHAR_SET));
		StringBuffer buffer=new StringBuffer();
		String line=null;
		while((line=rd.readLine())!=null){
			buffer.append(line);
			buffer.append("\n");
		}
		rd.close();
		return buffer.toString();
	}
	/**
	 * Jarに含まれるjsをロードする。
	 * @param fileName　Jarファイル内のリソースのパス。
	 * @return ファイルの中身。
	 * @throws ScriptException スクリプトエラー。
	 * @throws IOException ファイル操作エラー。
	 */
	private static String loadResource(String fileName) throws ScriptException, IOException  {
		BufferedReader rd=new BufferedReader(new InputStreamReader(
				Thread.currentThread().getContextClassLoader().getResourceAsStream(fileName),framework.SYSTEM_CHAR_SET));
		StringBuffer buffer=new StringBuffer();
		String line=null;
		while((line=rd.readLine())!=null){
			buffer.append(line);
			buffer.append("\n");
		}
		rd.close();
		return buffer.toString();
	}

	private static ReentrantLock locker=new ReentrantLock();
	/**
	 * ファイル作成用の排他ロッカーを取得する。
	 * @return 排他ロッカー。
	 */
	public static ReentrantLock getLocker() {
		return locker;
	}
	private static HashMap<String,HashMap<String, Object>> semaphores=new HashMap<String,HashMap<String, Object>>();
	/**
	 * イベント同時実行制限用のセマフォを取得する。
	 * @param eventId イベントID。
	 * @param max 同時実行数。
	 * @return セマフォ。
	 */
	public static synchronized Semaphore getSemaphore(String eventId,int max) {
		HashMap<String, Object> ret;
		if ((ret=semaphores.get(eventId))==null) {
			HashMap<String, Object> created=new  HashMap<String, Object> ();
			created.put("eventId", eventId);
			created.put("max", max);
			created.put("semaphore", new java.util.concurrent.Semaphore(max));
			semaphores.put(eventId, ret=created);
		}else {
			int premax=(int)ret.get("max");
			if (premax!=max) {
				ret.put("max", max);
				ret.put("semaphore", new java.util.concurrent.Semaphore(max));
			}
		}
		return (Semaphore)ret.get("semaphore");
	}
}
//https://docs.oracle.com/cd/F44923_01/jdk/21/docs/reference-manual/js/ScriptEngine/#prerequisite
//https://docs.oracle.com/cd/F44923_01/enterprise/21/docs/reference-manual/js/Multithreading/#multithreading-with-java-and-javascript
//https://docs.oracle.com/cd/F44923_01/jdk/21/docs/reference-manual/js/ScriptEngine/#recommendation-use-compiledscript-api
//https://github.com/oracle/graal/issues/2147
//https://stackoverflow.com/questions/69263736/use-import-in-javascript-being-called-from-java-program-through-graalvm

