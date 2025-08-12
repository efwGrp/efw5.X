<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="efw.db.DatabaseManager"%>
<%@ page import="efw.db.Database"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.sql.ResultSet"%>
<%@ page import="java.util.Date"%>
<%@ page import="java.sql.Timestamp"%>
<!DOCTYPE HTML>
<HTML>
<HEAD>
	<title>db テスト</title>
</HEAD>
<BODY>
<%
////////////////////////////////////////////
	DatabaseManager.open();
	Database db=DatabaseManager.getDatabase();
	db.executeUpdate("helloDB","createTbl",new HashMap());
	ResultSet rs=db.executeQuery("helloDB","selectAll",new HashMap());
	int rsLen=0;
	while (rs.next()){
		rsLen++;
	}
	String msg="レコードのサイズ："+rsLen+"<br>";
	rs.close();
////////////////////////////////////////////
	HashMap insetMap=new HashMap();
	insetMap.put("id","001");
	insetMap.put("name","Efw");
	insetMap.put("birthday",new Timestamp(new Date("2016/01/01").getTime()));
	insetMap.put("years",6);
	int insetCnt=db.executeUpdate("helloDB","insertRow",insetMap);
	msg+="挿入行数："+insetCnt+"<br>";
////////////////////////////////////////////
	HashMap updateMap=new HashMap();
	updateMap.put("id","001");
	updateMap.put("name","Escco Framework");
	updateMap.put("tbl","tbl_hello");
	int updateCnt=db.executeUpdate("helloDB","updateName",updateMap);
	msg+="更新行数："+updateCnt+"<br>";
////////////////////////////////////////////
	HashMap dropMap=new HashMap();
	dropMap.put("tbl","tbl_hello");
	db.executeUpdate("helloDB","dropTbl",dropMap);
////////////////////////////////////////////
	db.commit();
	db.close();
%>
<%=msg%><br>
</BODY>
</HTML>
