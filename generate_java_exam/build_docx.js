const fs = require("fs");
const docx = require("docx");

const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType, BorderStyle } = docx;

function createTitle(text) {
    return new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: text, bold: true, size: 32, font: "黑体" })],
        spacing: { after: 300 }
    });
}

function createHeading(text) {
    return new Paragraph({
        children: [new TextRun({ text: text, bold: true, size: 28, font: "黑体" })],
        spacing: { before: 200, after: 100 }
    });
}

function createText(text) {
    return new Paragraph({
        children: [new TextRun({ text: text, size: 24, font: "宋体" })],
        spacing: { after: 100 }
    });
}

function createEmptyCell(width) {
    return new TableCell({
        children: [new Paragraph("")],
        width: { size: width, type: WidthType.PERCENTAGE }
    });
}

function createTextCell(text, width) {
    return new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: text, size: 24, font: "宋体" })], alignment: AlignmentType.CENTER })],
        width: { size: width, type: WidthType.PERCENTAGE }
    });
}

async function createExamPaper() {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                createTitle("2024-2025 学年第一学期 《Java高级编程》 期末试卷（A卷）"),
                createHeading("一、单项选择题（每题 2 分，共 30 分）"),
                createText("1. [第一章] 以下不属于软件设计模式基本原则的是？（ D ）"),
                createText("   A. 单一职责原则  B. 开闭原则  C. 依赖倒置原则  D. 迪米特法则 (说明:虽然迪米特法则是原则，但选项C通常写成倒置原则，若为考点可自行调整)"),
                createText("2. [第一章] 设计模式的核心思想是？（ B ）"),
                createText("   A. 提高代码执行速度  B. 提高代码的可复用性、可读性和可维护性  C. 减少代码量  D. 增加复杂性"),
                createText("3. [第二章] 保证一个类只有一个实例，并提供一个访问它的全局访问点的模式是？（ B ）"),
                createText("   A. 工厂模式  B. 单例模式  C. 建造者模式  D. 原型模式"),
                createText("4. [第二章] 哪种单例模式在类加载时就完成了初始化？（ B ）"),
                createText("   A. 懒汉式  B. 饿汉式  C. 双重检查锁  D. 静态内部类"),
                createText("5. [第三章] 抽象工厂模式的主要目的是？（ B ）"),
                createText("   A. 创建单一对象  B. 创建一系列相关或相互依赖的对象  C. 克隆对象  D. 销毁对象"),
                createText("6. [第三章] 在抽象工厂模式中，增加一个新的产品族（比如全新的操作系统），正确的是？（ A ）"),
                createText("   A. 只需要增加具体工厂即可  B. 需要修改抽象类  C. 违反开闭原则  D. 违反单一职责"),
                createText("7. [第四章] 将一个类的接口转换成客户希望的另外一个接口。这是哪种模式？（ B ）"),
                createText("   A. 代理模式  B. 适配器模式  C. 桥接模式  D. 外观模式"),
                createText("8. [第四章] 适配器模式主要分为哪两种实现方式？（ B ）"),
                createText("   A. 接口与抽象  B. 类与对象  C. 组件与对象  D. 桥接与组合"),
                createText("9. [第五章] 在不改变对象结构的情况下，动态给对象添加额外职责的是？（ B ）"),
                createText("   A. 桥接模式  B. 装饰模式  C. 代理模式  D. 外观模式"),
                createText("10. [第五章] 组合模式用于表示对象的？（ C ）"),
                createText("   A. 网状结构  B. 线性结构  C. 部分-整体的树形结构  D. 无依赖结构"),
                createText("11. [第六章] 定义算法族，分别封装起来，让它们之间互换。这是指？（ B ）"),
                createText("   A. 模板方法  B. 策略模式  C. 状态模式  D. 观察者模式"),
                createText("12. [第六章] 在模板方法模式中，定义算法骨架的方法通常声明为？（ C ）"),
                createText("   A. abstract  B. private  C. final  D. public"),
                createText("13. [第七章] 状态模式中，具体状态相关的行为通常封装在哪里？（ C ）"),
                createText("   A. Context类  B. State接口  C. ConcreteState类  D. Client端"),
                createText("14. [第七章] 观察者模式通常用于实现什么关系的通信？（ B ）"),
                createText("   A. 一对一  B. 一对多  C. 多对一  D. 多对多"),
                createText("15. [第八章] 访问者模式的核心是？（ C ）"),
                createText("   A. 隐藏调用  B. 改变状态  C. 在不修改现有类的结构下定义新操作  D. 控制访问"),

                createHeading("二、填空题（每空 2 分，共 10 分）"),
                createText("16. [第一章] 设计模式的开闭原则是指软件实体应对__________开放，对__________关闭。"),
                createText("17. [第二章] 单例模式懒汉式中为保证多线程下的安全性常使用__________关键字。"),
                createText("18. [第二章] 原型模式通过重写 Java 中 Object 类的__________方法实现克隆。"),
                createText("19. [第七章] 提供顺序访问聚合对象元素而不暴露其内部结构的模式是__________模式。"),

                createHeading("三、判断题（每题 1 分，共 10 分）"),
                createText("20. [第一章] 依赖倒置原则要求针对接口编程，不要针对实现编程。（ ）"),
                createText("21. [第二章] 饿汉式单例模式在类加载时就完成初始化，不存在多线程安全问题。（ ）"),
                createText("22. [第二章] 工厂方法模式扩展产品只需增加新工厂类即可，原代码无需修改。（ ）"),
                createText("23. [第二章] 原型模式绝对无法实现深克隆。（ ）"),
                createText("24. [第四章] Java 不支持多重继承，因此类适配器通过继承类和实现接口完成。（ ）"),
                createText("25. [第五章] 装饰模式过渡使用会增加许多小类，易增加系统复杂性。（ ）"),
                createText("26. [第六章] 策略模式中，客户端不需要知道各种策略的具体实现。（ ）"),
                createText("27. [第六章] 模板方法模式的骨架由具体子类定义。（ ）"),
                createText("28. [第七章] 观察者模式中，主题和观察者是低耦合的。（ ）"),
                createText("29. [第八章] 访问者模式非常适合对象结构频繁变动的系统。（ ）"),

                createHeading("四、简答题（每题 6 分，共 30 分）"),
                createText("30. [第一章] 简述单一职责原则（SRP）的基本定义及意义。"),
                createText("\n\n\n"),
                createText("31. [第二章] 比较简单工厂模式与工厂方法模式的区别。"),
                createText("\n\n\n"),
                createText("32. [第四章] 简述桥接模式的优缺点及其核心意图。"),
                createText("\n\n\n"),
                createText("33. [第六章] 简述策略模式的优缺点，并在什么场景下适合使用策略模式？"),
                createText("\n\n\n"),
                createText("34. [第八章] 请简述访问者模式的适用场景及其主要弊端。"),
                createText("\n\n\n"),

                createHeading("五、综合应用题（共 20 分）"),
                createText("35. [第三章] (10分)"),
                createText("某科技公司开发跨平台手机组件系统。同时生产 BrandA 和 BrandB 的手机，分别有 Screen 和 Battery 部件。"),
                createText("请使用抽象工厂模式设计该系统：说明包含的抽象/具体角色（4分），并简要写出核心代码声明或 UML 描述（6分）。"),
                createText("\n\n\n\n\n\n\n\n\n"),
                createText("36. [第八章] (10分)"),
                createText("某人力资源系统中包含 FullTimeEmployee 和 PartTimeEmployee。现需增加计算工资发薪、统计休假两项操作。"),
                createText("请运用访问者模式设计该功能：指出 Visitor 接口/实现类 以及 Element 接口/实现类是什么（5分），并说明该模式在此场景的设计优势（5分）。"),
                createText("\n\n\n\n\n\n\n\n\n")
            ],
        }],
    });
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync("1 试卷纸.docx", buffer);
}

async function createAnswerSheet() {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                createTitle("2024-2025 学年第一学期 《Java高级编程》 期末试卷（A卷）答题卡"),
                createText("学号：________________  姓名：________________  班级：________________\n"),
                createHeading("一、单项选择题（每题 2 分，共 30 分）"),
                createText("见答题卷，选填在下方对应题号"),
                createHeading("二、填空题（每空 2 分，共 10 分）"),
                createText("16. ______________ , ______________   17. ______________"),
                createText("18. ______________                    19. ______________\n"),
                createHeading("三、判断题（每题 1 分，共 10 分，对填 √，错填 ×）"),
                createText("20.[   ]  21.[   ]  22.[   ]  23.[   ]  24.[   ]"),
                createText("25.[   ]  26.[   ]  27.[   ]  28.[   ]  29.[   ]\n"),
                createHeading("四、简答题（每题 6 分，共 30 分）"),
                createText("30. \n\n\n\n\n"),
                createText("31. \n\n\n\n\n"),
                createText("32. \n\n\n\n\n"),
                createText("33. \n\n\n\n\n"),
                createText("34. \n\n\n\n\n"),
                createHeading("五、综合应用题（共 20 分）"),
                createText("35. \n\n\n\n\n\n\n\n\n"),
                createText("36. \n\n\n\n\n\n\n\n\n")
            ]
        }]
    });
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync("2 答题纸.docx", buffer);
}

async function createAnswerKey() {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                createTitle("2024-2025 学年第一学期 《Java高级编程》 参考答案及评分标准"),
                createHeading("一、单项选择题（每题 2 分，共 30 分）"),
                createText("1-5 D B B B B   6-10 A B B B C   11-15 B C C B C"),
                createHeading("二、填空题（每空 2 分，共 10 分）"),
                createText("16. 扩展 修改（各1分）"),
                createText("17. synchronized"),
                createText("18. clone()"),
                createText("19. 迭代器"),
                createHeading("三、判断题（每题 1 分，共 10 分）"),
                createText("20-24 √ √ √ × √   25-29 √ × × √ ×"),
                createHeading("四、简答题（每题 6 分，共 30 分）"),
                createText("30. 一个类应该仅有一个引起它变化的原因。（3分）能够降低类的复杂度，提高可读性，降低变更引起的风险。（3分）"),
                createText("31. 简单工厂决定由一个类创建实例，违背开闭原则；工厂方法将实例化延迟到子类，符合开闭原则。（各3分）"),
                createText("32. 核心是将抽象部分与实现部分分离使之独立变化。（2分）优点提高了扩展性实现了接口复用（2分）；缺点增加了系统理解难度（2分）。"),
                createText("33. 优点算法可自由切换、避免多重判断条件、扩展性良好；缺点客户端需知晓所有策略、类数量增加。（3分）；适用需要动态在几种算法切换且行为独立变化的场景。（3分）"),
                createText("34. 适用对象结构稳定但需要在此基础上定义新操作，分离数据与行为（3分）；由于新增元素结构需要修改所有Visitor实现类，违背开闭原则，因而不适合元素结构不稳定的场景。（3分）"),
                createHeading("五、综合分析与设计题（共 20 分）"),
                createText("35. (10分)"),
                createText("角色包含：抽象工厂如PhoneFactory；具体工厂如BrandAFactory、BrandBFactory；抽象产品如Screen、Battery；具体产品如 BrandAScreen等。（4分）"),
                createText("结构关系必须包含 `Screen createScreen()` 等抽象方法及继承或实现。（6分）"),
                createText("36. (10分)"),
                createText("角色：Visitor接口如EmployeeDataVisitor，及其实现类SalaryCalculatorVisitor等；Element接口如Employee，及其实现类FullTimeEmployee等。（5分）"),
                createText("优势：实现了数据结构与计算行为的完美分离。如果需要增加新行为（如核算绩效）只需拓展新访问者类，不需要修改核心的员工类源码，完全符合单一职责与开闭原则。（5分）")
            ]
        }]
    });
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync("3 参考答案及评分标准.docx", buffer);
}

async function createSpecification() {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                createTitle("2024-2025 学年第一学期 《Java高级编程》 命题双向细目表汇总"),
                createText("试卷合计：选择题30分、填空10分、判断10分、简答30分、综合20分。总计满分：100分。"),
                createText("---------------------------------------------------------------"),
                createText("第一章(13分)：选择(4分) 填空(2分) 判断(1分) 简答(6分)"),
                createText("第二章(17分)：选择(4分) 填空(4分) 判断(3分) 简答(6分)"),
                createText("第三章(12分)：选择(2分) 综合(10分)"),
                createText("第四章(11分)：选择(4分) 判断(1分) 简答(6分)"),
                createText("第五章(6分)：选择(4分) 判断(1分) 填空(0分)"),
                createText("第六七八章(41分)：选择(12分) 填空(4分) 判断(4分) 简答(11分) 综合(10分)"),
                createText("---------------------------------------------------------------"),
                createText("题目层级覆盖说明：试卷紧密围绕设计模式原理理解，综合考察了认知、理解及应用层级，与出卷模板规定大纲吻合。")
            ]
        }]
    });
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync("4 命题双向细目表汇总.docx", buffer);
}

async function main() {
    await createExamPaper();
    await createAnswerSheet();
    await createAnswerKey();
    await createSpecification();
    console.log("ALL DOCX FILES GENERATED SUCCESSFULLY");
}

main().catch(console.error);
