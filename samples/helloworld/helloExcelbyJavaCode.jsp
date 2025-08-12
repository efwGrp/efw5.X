<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="efw.excel.ExcelManager"%>
<%@ page import="efw.excel.Excel"%>
<%
//ファイル作成時、テンプレートをコピー作成
Excel excel=ExcelManager.open("excel/IamExcelTemplate.xlsx", false);
//シート作成時、テンプレートをコピー作成
excel.createSheet("newSheet","templateSheet");
//セルに値を代入とともに、書式のコピー元を指定
excel.setCellStringValue("newSheet","B2","helloworld");
excel.setCellStyle("newSheet","B2","templateSheet","A1");
//テンプレートの図形をコピーして、新しい場所に貼り付ける
excel.addShapeInCell("newSheet","C2", "templateSheet","myCircle", "", 0, 0, 0, 0);
//保存する
excel.save("myExcel.xlsx", null);
//閉じる
ExcelManager.close(excel.getKey());
%>
