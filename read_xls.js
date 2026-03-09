const xlsx = require('xlsx'); 
const fs = require('fs');
const wb = xlsx.readFile('E:/repo/computer-course-materials/Java高级编程/Java高级编程/试卷模板/副本广州华立学院命题双向细目表+java高级编程-A卷-林原.xls'); 
fs.writeFileSync('ximubiao_utf8.csv', xlsx.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]), 'utf8');
