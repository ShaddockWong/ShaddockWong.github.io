+++
title = '10-桥接模式'
date = 2024-07-19T09:01:34+08:00
lastmod = 2024-07-19T09:01:34+08:00
tags = ['java', '设计模式']
categories = ['Java设计模式']
draft = false

+++

## 桥接模式概述

毛笔和蜡笔是两种很常见的文具，假如需要大、中、小 3 种型号的画笔，能够绘制 12 中不同的颜色，如果使用蜡笔，需要准备 3 × 12 = 36 支；使用毛笔，只需要提供 3 中型号的毛笔，外加 12 种颜色的调色板，设计的对象个数仅为 3 + 12 = 15，却能实现 36支蜡笔同样的功能。

通过分析不难发现：在蜡笔中，颜色和型号两个不同的变化维度耦合在一起，无论是对颜色进行扩展还是对型号进行扩展，势必会影响另一个维度；但在毛笔中，颜色和型号实现了分离，增加新的颜色或者型号对另一方没有任何影响。在软件开发中有一种设计模式可以用来处理与画笔类似的具有多变化维度的情况，它就是桥接模式。

桥接模式中将两个独立变化的维度，设计为两个独立的继承等级结构，而不是将二者耦合在一起形成多层继承结构。在抽象层建立起一个抽象关联，该关联关系类似一条连接两个独立继承结构的桥，故名桥接模式。

> **桥接模式**：将抽象部分与它的实现部分解耦，使的两者都能够独立变化。
>
> **Bridge Pattern**: Decouple an abstraction from its implemenmtation so that the two can vary independently.

桥接模式是一种对象结构模式，又称为柄体（Handle and Body）模式或接口（Interface）模式。

## 桥接模式结构

![image-20240719092443424](./image/image-20240719092443424.png '桥接模式结构图')

桥接模式包含以下 4 个角色：

1. **Abstraction（抽象类）**：用于定义抽象类的接口，通常是抽象类而不是结构，其中定义了一个 Implementor（实现类接口）类型的对象并可以维护该对象，它与 Implementor 之间具有关联关系，它既可以包含抽象业务方法，也可以包含具体业务方法。
2. **RefinedAbstraction（扩充抽象类）**：它扩充由 Abstraction 定义的接口，通常情况下它不再是抽象类而是具体类，实现了在 Abstraction 中声明的抽象业务方法，在 RefinedAbstraction 中可以调用在 Implementor 中定义的业务方法。
3. **Implementor（实现类接口）**：它是定义实现类的接口，这个接口不一定要与 Abstraction 的接口完全一致，事实上这两个接口可以完全不同。一般而言，Implementor 接口仅提供基本操作，而 Abstraction 定义的接口可能会做更多更复杂的操作。Implementor 接口对这些基本操作进行了声明，而具体实现交给其字类。通过关联关系，在 Abstraction 中不仅拥有自己的方法，还可以调用到 Implementor 中定义的方法，使用关联关系来替代继承关系。
4. **ConcreteImplementor（具体实现类）**：它具体实现了 Implementor 接口，在不同的 ConcreteImplementor 中提供了基本操作的不同实现，在程序运行时 ConcreteImplementor 对象将替换其父类对象，提供给抽象类具体的业务操作方法。

## 桥接模式实现

桥接模式是一个非常使用的设计模式，在桥接模式中体现了很多面向对象的设计原则的思想，包括单一指责原则、开闭原则、合成服用原则、里氏代换原则、依赖倒转原则等。

在使用桥接模式时首先应识别出一个类所具有的两个独立变化的维度，将它们设计为两个独立的继承等级结构，为两个维度都提供抽象层，并建立抽象耦合。在同常情况下，将具有两个独立变化维度的类的一些普通业务方法和与之关系最密切的维度设计为“抽象类”层次结构（抽象部分），而将另一个维度设计为“实现类”层次结构（实现部分）。

在具体编码实现时，由于在桥接模式中存在两个独立变化的维度，为了降低两者之间的耦合度，首先需要针对两个不同的维度提取抽象类和实现类接口，并建立一个抽象管理关系。对于“实现部分”维度，典型的实现类接口代码如下：

```java
public interface Implementor {
    public void operationImpl();
}
```

在实现 Implementor 接口的子类 ConcreteImplementor 中实现了在该接口中声明的方法，用于定义与该维度相对应的一些具体方法，代码如下：

```java
public class ConcreteImplementor implements Implementor {
    public void operationImpl() {
        // 具体业务方法的实现
    }
}
```

对于另一“抽象部分”维度而言，其典型的抽象代码如下：

```java
public abstract class Abstraction {
    protected Implementor impl;   // 定义实现类接口对象
    
    public void setImpl(Implementor impl) {
        this.impl = impl;
    }
    
    public abstract void operation();  // 声明抽象业务方法
}
```

在抽象类 Abstraction 中定义了一个实现类接口类型的成员变量impl，再通过 Setter 方法或者构造方法以注入的方式给该对象赋值，一般将该对象的可见性定义为 protected，一边在其子类中访问 Implementor 的方法，其子类一般称为扩充抽象类或细化抽象类（RefinedAbstraction），典型的 RefinedAbstraction 类代码如下：

```java
public class RefinedAbstraction extends Abstraction {
    public void operation() {
        // 业务代码
        impl.operationImpl(); // 调用实现类的方法
        // 业务代码
    }
}
```

对于客户端而言，可以针对两个维度的抽象层编程，在程序运行时再动态确定两个维度的字类，动态组合对象，将两个独立变化的维度完全解耦，以便能够灵活地扩充任一维度而对另一维度不造成任何影响。

## 桥接模式应用实例

### 实例说明

某软件公司要开发一个跨平台图像浏览系统，要求该系统能够显示 BMP、JPG、GIF、PNG 等多种格式的文件，并且能够在 Windows、Linux、UNIX 等多个操作系统上运行。系统首先将各种格式的文件解析为像素矩阵（Matrix），然后将像素矩阵显示在屏幕上，在不同的操作系统中可以调用不同的绘制函数来绘制像素矩阵。系统需具有较好的扩展性，以便在将来支持新的文件格式和操作系统。试使用桥接模式设计该跨平台图像浏览系统。

### 实例类图

![image-20240719162240560](./image/image-20240719162240560.png '跨平台图像浏览系统结构图')

### 实例代码

1. Matrix：像素矩阵类，它是一个辅助类，各种格式的图像文件最终都被转化为像素矩阵，不同的操作系统提供不同的方式显示像素矩阵。

   ```java
   public class Matrix {
       // 代码省略
   }
   ```

   

2. ImageImp：抽象操作系统实现类，充当实现类接口。

   ```java
   public interface ImageImp {
       public void doPaint(Matrix m); // 显示像素矩阵 m
   }
   
   ```

   

3. WindowsImp：Windows 操作系统实现类，充当具体实现类。

   ```java
   public class WindowsImp implements ImageImp{
       @Override
       public void doPaint(Matrix m) {
           // 调用 Windows 系统的绘制函数绘制像素矩阵
           System.out.println("在 Windows 操作系统中显示图像：");
       }
   }
   ```

   

4. LinuxImp：Linux 操作系统实现类，充当具体实现类。

   ```java
   public class LinuxImp implements ImageImp {
       @Override
       public void doPaint(Matrix m) {
           // 调用 Linux 系统的绘制函数绘制像素矩阵
           System.out.println("在 Linux 操作系统中显示图像：");
       }
   }
   ```

   

5. UnixImp：UNIX 操作系统实现类，充当具体实现类。

   ```java
   public class UnixImp implements ImageImp{
       @Override
       public void doPaint(Matrix m) {
           // 调用 UNIX 系统的绘制函数绘制像素矩阵
           System.out.println("在 UNIX 操作系统中显示图像：");
       }
   }
   ```

   

6. Image：抽象图像类，充当抽象类。

   ```java
   public abstract class Image {
       protected ImageImp imp;
   
       // 注入实现类接口对象
       public void setImageImp(ImageImp imp) {
           this.imp = imp;
       }
   
       public abstract void parseFile(String fileName);
   }
   ```

   

7. JPGImage：JPG 格式图像类，充当扩充抽象类。

   ```java
   public class JPGImage extends Image{
       @Override
       public void parseFile(String fileName) {
           // 模拟解析 JPG 文件并获得一个像素矩阵对象 m
           Matrix m = new Matrix();
           imp.doPaint(m);
           System.out.println(fileName + "，格式为 JPG。");
       }
   }
   ```

   

8. PNGImage：PNG 格式图像类，充当扩充抽象类。

   ```java
   public class PNGImage extends Image{
       @Override
       public void parseFile(String fileName) {
           // 模拟解析 PNG 文件并获得一个像素矩阵对象 m
           Matrix m = new Matrix();
           imp.doPaint(m);
           System.out.println(fileName + "，格式为 PNG。");
       }
   }
   ```

   

9. BMPImage：BMP 格式图像类，充当扩充抽象类。

   ```java
   public class BMPImage extends Image{
       @Override
       public void parseFile(String fileName) {
           // 模拟解析 BMP 文件并获得一个像素矩阵对象 m
           Matrix m = new Matrix();
           imp.doPaint(m);
           System.out.println(fileName + "，格式为 BMP。");
       }
   }
   ```

   

10. GIFImage：GIF 格式图像类，充当扩充抽象类。

    ```java
    public class GIFImage extends Image{
        @Override
        public void parseFile(String fileName) {
            // 模拟解析 GIF 文件并获得一个像素矩阵对象 m
            Matrix m = new Matrix();
            imp.doPaint(m);
            System.out.println(fileName + "，格式为 GIF。");
        }
    }
    ```

    

11. 配置文件 config.xml，在配置文件中存储了具体扩充抽象类和具体实现类的类名。

    ```xml
    <?xml version="1.0"?>
    <config>
        <!-- RefinedAbstraction -->
        <className>com.wangyq.bridge.demo.JPGImage</className>
        <!-- ConcreteImplementor -->
        <className>com.wangyq.bridge.demo.WindowsImp</className>
    </config>
    ```

    

12. XMLUtil：工具类

    ```java
    public class XMLUtil {
        /**
         * 该方法用于从 XML 配置文件中提取具体类的类名，并返回一个实例对象
         *
         * @param args args
         * @return {@link Object }
         */
        public static Object getBean(String args) {
            try {
                // 创建文档对象
                DocumentBuilderFactory dFactory = DocumentBuilderFactory.newInstance();
                DocumentBuilder builder = dFactory.newDocumentBuilder();
                Document doc;
                doc = builder.parse(new File("design-pattern/src/main/java/com/wangyq/bridge/demo/config.xml"));
                NodeList nl = null;
                Node classNode = null;
                String cName = null;
                nl = doc.getElementsByTagName("className");
    
                // 获取第一个包含类名的节点，即扩充抽象类
                if (args.equals("image")) {
                    classNode = nl.item(0).getFirstChild();
                }
                // 获取第二个包含类名的节点，即具体实现类
                else if (args.equals("os")) {
                    classNode = nl.item(1).getFirstChild();
                }
    
                cName = classNode.getNodeValue();
                // 通过类名生成实例对象并将其返回
                Class c = Class.forName(cName);
                Object obj = c.newInstance();
                return obj;
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }
    }
    ```

    

13. Client：客户端测试类。

    ```java
    public class Client {
        public static void main(String[] args) {
            Image image;
            ImageImp imp;
            image = (Image) XMLUtil.getBean("image");
            imp = (ImageImp) XMLUtil.getBean("os");
            image.setImageImp(imp);
            image.parseFile("小龙女");
        }
    }
    ```

### 结果及分析

运行结果如下：

```tex
在 Windows 操作系统中显示图像：
小龙女，格式为 JPG。
```

在实际使用使可以通过分析图像文件格式扩展名来确定具体的文件格式，在程序运行时获取操作系统类型，无需使用配置文件。当增加新的图像文件格式或者操作系统时原有代码无需任何修改，只需要增加一个对应的扩充抽象类或具体实现类即可，完全符合开闭原则。

## 桥接模式与适配器模式的联用

适配器模式可以解决两个已有接口不兼容的问题，在这种情况下被适配的类往往是一个黑盒子。适配器模式通常用于现有系统和第三方产品功能的集成，采用增加适配器的方式将第三方类集成到系统中。桥接模式则不同，用户可以通过接口继承或类继承的方式对系统进行扩展。

桥接模式和适配器模式用于设计的不同阶段，桥接模式用于系统的初步设计，对于存在两个独立变化维度的类可以将其分为抽象化和实现化两个角色，使他们可以分别进行变化；而在初步设计完成之后，当发现系统与已有类无法协同工作时可以采用适配器模式。

下面通过一个实例来说明适配器模式和桥接模式的联合使用：

在某系统的报表处理模块中需要将报表显示和数据输出分开，系统可以有多种报表显示方式也可以有多种数据输出方式，例如可以将数据输出为文本文件，也可以输出为 Excel 文件，如果需要输出为 Excel 文件，则需要调用与 Excel 相关的 API，而这个 API 是现有系统所不具备的，该 API 由厂商提供，因此可以同时使用适配器模式和桥接模式来设计该模块。



![image-20240719172505534](./image/image-20240719172505534.png '桥接模式与适配器模式联用示意图')

## 桥接模式优点

1. 分离抽象接口及实现部分。桥接模式使用“对象间的关联关系”解耦了抽象和实现之间固有的绑定关系，使得抽象和实现可以沿着各自的维度来变化。
2. 在很多情况下，桥接模式可以取代多层继承方案，多层继承方案违背了单一指责原则，复用性较差，并且类的个数非常多，桥接模式是比多层继承方案更好的解决方案，它极大地减少了子类的个数。
3. 桥接模式提高了系统的可扩展性，在两个变化维度中任意扩展一个维度都不需要修改原有系统，符合开闭原则。

## 桥接模式缺点

1. 桥接模式的使用会增加系统的理解与设计难度，由于关联关系建立在抽象层，要求开发者一开始就针对抽象层进行设计与编程。
2. 桥接模式要求正确地识别系统中的两个独立变化的维度，因此其使用范围具有一定的局限性，如何正确识别两个独立维度也需要一定的经验积累。

## 桥接模式适用环境

1. 如果一个系统需要在抽象层和具体化之间增加更多的灵活性，避免在两个层次之间建立静态的继承关系，通过桥接模式可以使他们在抽象层建立一个关联关系。
2. 抽象部分和实现部分可以用继承的方式独立扩展而互不影响，在程序运行时可以动态地将一个抽象化子类的对象和一个实现化字类的对象进行组合，即系统需要对抽象化角色和实现化角色进行动态解耦。
3. 一个类存在两个（或多个）独立变化的维度，且这两个（或多个）维度都需要独立进行扩展。
4. 对于那些不希望使用继承或因为多层继承导致系统类的个数急剧增加的系统，桥接模式尤为适用。
