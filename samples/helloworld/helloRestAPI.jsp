<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="efw" uri="efw" %>
<!DOCTYPE HTML>
<HTML>
<HEAD>
	<title>Rest API Server and Client Test</title>
	<efw:Client lang="jp"/>
</HEAD>
<BODY>
	<button onclick="Efw('helloRestAPI_submit',{mode:'0'})">初期化（テーブル作成）</button><br><br>
	ID：<input type="text" id="customerId">
	Name：<input type="text" id="customerName"><br>
	token:<input type="text" id="token" value="1234567890">※httpヘッダからセキュリティ情報送信のテスト<br>
	<button onclick="Efw('helloRestAPI_submit',{mode:'1'})">顧客追加</button>
	<button onclick="Efw('helloRestAPI_submit',{mode:'2'})">顧客変更</button>
	<button onclick="Efw('helloRestAPI_submit',{mode:'3'})">顧客削除</button>
	<button onclick="Efw('helloRestAPI_submit',{mode:'4'})">顧客取得</button><br><br>
	<textarea style="width:800px;height:300px;">
	</textarea><br><br>
	<button onclick="Efw('helloRestAPI_submit',{mode:'9'})">終了（テーブル削除）</button><br><br>
</BODY>
</HTML>
