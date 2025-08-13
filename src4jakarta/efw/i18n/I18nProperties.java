/**** efw5.X Copyright 2025 efwGrp ****/
package efw.i18n;

import java.util.Date;
import java.util.Properties;
/**
 * 多国語プロパティを表すクラス。
 * @author kejun.chang
 *
 */
public final class I18nProperties extends Properties {
	private Date lastModifytime=null;

	protected Date getLastModifytime() {
		return lastModifytime;
	}

	protected void setLastModifytime(Date lastModifytime) {
		this.lastModifytime = lastModifytime;
	}
	
}
