<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="efw.file.FileManager"%>
<%@ page import="java.io.File"%>
<%@ page import="java.io.FileOutputStream"%>
<%@ page import="java.io.IOException"%>
<%@ page import="org.apache.poi.EncryptedDocumentException"%>
<%@ page import="org.apache.poi.ss.usermodel.Cell"%>
<%@ page import="org.apache.poi.ss.usermodel.PrintSetup"%>
<%@ page import="org.apache.poi.ss.usermodel.Row"%>
<%@ page import="org.apache.poi.ss.usermodel.Sheet"%>
<%@ page import="org.apache.poi.ss.usermodel.Workbook"%>
<%@ page import="org.apache.poi.ss.usermodel.WorkbookFactory"%>
<%@ page import="org.apache.poi.ss.util.CellReference"%>
<%@ page import="org.apache.poi.xssf.usermodel.XSSFDrawing"%>
<%@ page import="org.apache.poi.xssf.usermodel.XSSFShape"%>
<%@ page import="org.apache.poi.xssf.usermodel.XSSFSheet"%>
<%@ page import="org.apache.poi.xssf.usermodel.XSSFClientAnchor"%>
<%@ page import="org.apache.poi.xssf.usermodel.XSSFSimpleShape"%>
<%@ page import="org.apache.poi.xssf.usermodel.XSSFTextParagraph"%>
<%@ page import="org.apache.poi.xssf.usermodel.XSSFTextRun"%>
<%@ page import="org.apache.poi.xssf.usermodel.XSSFPicture"%>
<%@ page import="org.apache.poi.xssf.usermodel.XSSFPictureData"%>
<%@ page import="org.apache.poi.openxml4j.opc.PackagePart"%>
<%@ page import="org.apache.poi.ss.usermodel.Font"%>
<%@ page import="java.util.List"%>



<%
//テンプレートを一時ファイルにコピーする
File file=FileManager.get("excel/IamExcelTemplate.xlsx");
File tempFile=File.createTempFile("efw", "");
FileManager.duplicate(file, tempFile);
Workbook workbook=WorkbookFactory.create(tempFile);
//新しいシートを作成する
Sheet sheet = workbook.cloneSheet(workbook.getSheetIndex("templateSheet"));
workbook.setSheetName(workbook.getSheetIndex(sheet.getSheetName()), "newSheet");
Sheet tempSheet = workbook.getSheet("templateSheet");
//B2セルに値を設定する
CellReference reference = new CellReference("B2");
Row row = sheet.getRow(reference.getRow());
Cell cell = null;
if (row == null) {
	row = sheet.createRow(reference.getRow());
	row.setHeightInPoints(sheet.getDefaultRowHeightInPoints());//初期高さを設定
}
cell = row.getCell(reference.getCol());
if (cell==null){
	cell=row.createCell(reference.getCol());
}
cell.setCellValue("helloworld");
//B2セルにA1の書式を利用する
CellReference templateReference = new CellReference("A1");
Row templateRow = tempSheet.getRow(templateReference.getRow());
if (templateRow != null) {
	Cell templateCell=templateRow.getCell(templateReference.getCol());
	cell.setCellStyle(templateCell.getCellStyle());
}
//図形を作成する
CellReference shapeReference = new CellReference("C2");
int cellrow=shapeReference.getRow();
int cellcol=shapeReference.getCol();

XSSFSheet xsheet = (XSSFSheet) workbook.getSheet("newSheet");
XSSFSheet xtemplateSheet=(XSSFSheet) workbook.getSheet("templateSheet");

List<XSSFShape> templateShapes=((XSSFDrawing) xtemplateSheet.getDrawingPatriarch()).getShapes();
for (XSSFShape templateShape : templateShapes) {
	if ("myCircle".equals(templateShape.getShapeName())) {
		XSSFDrawing patriarch=xsheet.getDrawingPatriarch();
		if(patriarch==null) patriarch = xsheet.createDrawingPatriarch();
		XSSFShape shape=cloneShape(workbook,patriarch,templateShape,"");
		XSSFClientAnchor anchor=(XSSFClientAnchor)(shape.getAnchor());
		int x=0;
		int y=0;
		int dx1=0;
		int dy1=0;
		int dx2=0;
		int dy2=0;
		int width=0;
		int height=0;
		if(x==0){
			dx1=anchor.getDx1();
		}
		if(y==0){
			dy1=anchor.getDy1();
		}
		if(width==0){
			width=anchor.getDx2()-anchor.getDx1();
		}
		if(height==0){
			height=anchor.getDy2()-anchor.getDy1();
		}
		dx2=width+dx1;
		dy2=height+dy1;
		anchor.setRow1(cellrow);
		anchor.setRow2(cellrow);
		anchor.setCol1(cellcol);
		anchor.setCol2(cellcol);
		anchor.setDx1(dx1);
		anchor.setDy1(dy1);
		anchor.setDx2(dx2);
		anchor.setDy2(dy2);
		break;
	}
}
//目的ファイルとして保存する
FileOutputStream fileOutputStream = new FileOutputStream(FileManager.get("myExcel.xlsx"));
workbook.setForceFormulaRecalculation(true);
workbook.write(fileOutputStream);
fileOutputStream.close();
workbook.close();
//一時ファイルファイルを削除する
tempFile.delete();
%>
<!-- 以下はclone関数 -->
<%!
	/**
	 * XSSFのShapeをコピーする
	 * @param patriarch
	 * @param templateShape
	 * @param value
	 * @return　作成されたshape
	 */
	XSSFShape cloneShape(Workbook workbook,XSSFDrawing patriarch,XSSFShape templateShape,String value){
		String clsNm=templateShape.getClass().getSimpleName();
		if ("XSSFSimpleShape".equals(clsNm)) {
			XSSFSimpleShape orgSimpleShape=(XSSFSimpleShape)templateShape;
			XSSFSimpleShape simpleShape = patriarch.createSimpleShape((XSSFClientAnchor)orgSimpleShape.getAnchor());
			simpleShape.getCTShape().set(orgSimpleShape.getCTShape().copy());
			if(orgSimpleShape.getTextParagraphs().size()>0){
				XSSFTextParagraph tempParagraph=orgSimpleShape.getTextParagraphs().get(0);
				if(tempParagraph.getTextRuns().size()>0){
					XSSFTextRun tempRun=tempParagraph.getTextRuns().get(0);
					simpleShape.setText(tempRun.getText());
					if(simpleShape.getTextParagraphs().size()>0){
						XSSFTextParagraph paragraph=simpleShape.getTextParagraphs().get(0);
						if(paragraph.getTextRuns().size()>0){
							XSSFTextRun textRun= paragraph.getTextRuns().get(0);
							if (value!=null) {
								textRun.setText(value);
							}else {
								textRun.setText(tempRun.getText());
							}
							textRun.setFontSize(tempRun.getFontSize());
							textRun.setCharacterSpacing(tempRun.getCharacterSpacing());
							textRun.setFontColor(tempRun.getFontColor());
							textRun.setFontFamily(tempRun.getFontFamily(), Font.DEFAULT_CHARSET, tempRun.getPitchAndFamily(), false);
							paragraph.setTextAlign(tempParagraph.getTextAlign());
							paragraph.setTextFontAlign(tempParagraph.getTextFontAlign());
						}
					}
				}
			}
			return (XSSFShape)simpleShape;
		}else if ("XSSFPicture".equals(clsNm)) {
			XSSFPicture orgPicture=(XSSFPicture)templateShape;
			PackagePart orgPackagePart= orgPicture.getPictureData().getPackagePart();
			@SuppressWarnings("unchecked")
			List<XSSFPictureData> allpictures=(List<XSSFPictureData>) workbook.getAllPictures();
			int pictureIndex=-1;
			for(int index=0;index<allpictures.size();index++) {
				PackagePart packagePart=allpictures.get(index).getPackagePart();
				if (packagePart.equals(orgPackagePart)) {
					pictureIndex=index;
					break;
				}
			}
			XSSFPicture picture = patriarch.createPicture((XSSFClientAnchor)orgPicture.getAnchor(),pictureIndex);
			return (XSSFShape)picture;
		}
		return null;
	}
%>