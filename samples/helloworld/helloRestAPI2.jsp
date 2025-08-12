<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="efw" uri="efw" %>
<!DOCTYPE HTML>
<HTML>
<HEAD>
	<title>Rest API Server and Client Test</title>
	<efw:Client lang="jp"/>
</HEAD>
<BODY>
	ID：<input type="text" id="customerId">
	Name：<input type="text" id="customerName"><br>
	token:<input type="text" id="token" value="1234567890">※httpヘッダからセキュリティ情報送信のテスト<br>

<script>
	function browserTest(samedomain){
		var domain=samedomain?"localhost":"127.0.0.1";
		var url="http://"+domain+":8080/helloworld/efwRestAPI/customer/"+$("#customerId").val();
		$.ajax({
			url:url,
			xhrFields: { withCredentials: true },
			headers:{ token:$("#token").val()},
			type: "GET",
			cache: false,
			async: true,
			dataType: "json",// send or get data by json type
			contentType: "application/json;charset=UTF-8",
			success:function(result){
				window.alert(JSON.stringify(result));
			},
			error:function(errorResponse){
				window.alert(JSON.stringify(errorResponse));
			}
		})
	}
</script>
<button onclick="browserTest(true)">ブラウザーテスト</button>
<button onclick="browserTest(false)">別ドメインテスト</button>
</BODY>
</HTML>
