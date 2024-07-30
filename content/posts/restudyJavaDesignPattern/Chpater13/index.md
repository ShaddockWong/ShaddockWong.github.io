+++
title = '13-外观模式'
date = 2024-07-29T14:22:24+08:00
lastmod = 2024-07-29T14:22:24+08:00
tags = ['java', '设计模式']
categories = ['Java设计模式']
draft = false

+++

## 外观模式概述

在软件开发中，有时候为了完成一项较为复杂的功能，一个客户类需要和多个业务类交互，而这些需要教化的业务类经常会作为一个整体出现，由于涉及到的类比较多，导致使用时代码较为复杂。此时，就需要一个类似服务员一样的角色，由它来负责和多个业务类进行交互，而客户类只需要和该类交互。

外观模式通过引入一个新的外观类（Facade）来实现该功能，外观类充当了软件系统中的“服务员”，它为多个业务类的调用提供了一个统一的入口，简化了类与类之间的交互。

![image-20240729150353889](./image/image-20240729150353889.png '外观模式示意图')

在外观模式汇总，一个子系统的外部与其内部的通信通过一个统一的外观类进行，外观类将客户与子系统的内部复杂性分隔开，是的客户类只需要与外观角色打交道，而不需要与子系统内部的很多对象打交道。

> 外观模式：为子系统中的一组接口提供一个统一的入口。外观模式定义了一个高层接口，这个接口使得这一子系统更加容易使用。
>
> Facade Pattern：Provided a unified interface to a set of interfaces in a subsystem. Facade defines a higher-level interface that makes the subsystem easier to use.

外观模式又称为门面模式，它是一种对象结构型模式。，外观模式是迪米特法则的一种具体实现，通过引入一个新的外观角色可以降低原有系统的复杂度，同时降低客户类与子系统的耦合度。

## 外观模式结构

外观模式没有一个一般化的类图描述，通常用下图描述外观模式的结构图：

![image-20240730095333624](./image/image-20240730095333624.png '外观模式结构图')

外观模式包含以下两个角色：

1. **Facade（外观角色）**：在客户端可以调用它的方法，在外观角色汇总可以知道相关的（一个或者多个）子系统的功能和责任；在正常情况下，它将所有从客户端发来的请求委派到相应的子系统，传递给相应的子系统对象处理。
2. **SubSystem（子系统角色）**：在软件系统中可以有一个或者多个子系统角色，每一个子系统可以不是一个单独的类，而是一个类的集合，它实现子系统的功能；每一个子系统都可以被客户端直接调用，或者被外观角色调用，它处理由外观类传过来的请求；子系统并不知道外观的存在，对于子系统而言，外观角色仅仅是另外一个客户端而已。

## 外观模式实现

外观模式的主要目的是在于降低系统的复杂程度。引入外观模式后，增加新的子系统或者移除子系统都很方便，客户类无需进行修改（或者极少的修改），只需要在外观类汇总增加或移除对子系统的引用即可。从这一点来看，外观模式在一定程度上并不符合开闭原则，增加新的子系统需要对原有系统进行一定的修改。

外观模式中所指的子系统是一个广义的概念，它可以是一个类、一个功能模块、系统的一个组成部分或者一个完整的系统。子系统类通常是一些业务类，实现了一些具体的、独立的业务功能，典型代码如下：

```java
public class SubSystemA {
    public void methodA() {
        // 业务实现代码
    }
}

public class SubSystemB {
    public void methodB() {
        // 业务实现代码
    }
}

public class SubSystemC {
    public void methodC() {
        // 业务实现代码
    }
}
```

在引入外观类之后，与子系统业务类之间的交互统一由外观类来完成，在外观类中通常存在如下代码：

```java
public class Facade {
    private SubSystemA obj1 = new SubSystemA();
    private SubSystemB obj2 = new SubSystemB();
    private SubSystemC obj3 = new SubSystemC();
    
    public void method() {
        obj1.methodA();
        obj2.methodB();
        obj3.methodC();
    }
}
```

由于在外观类中维持了对子系统对象的引用，客户端可以通过外观类来间接调用子系统对象的业务方法，而无需与子系统对象直接交互。在引入外观类后，客户端代码变得非常简单：

```java
public class Client {
    public static void main(String args[]) {
        Facade facade = new Facade();
        facade.method();
    }
}
```

## 外观模式应用实例

### 实例说明

某软件公司要开发一个可应用多个软件的文件加密模块，该模块可以对文件中的数据进行加密并将加密之后的数据存储在一个新文件中，具体的流程包含 3 个部分，分别是读取源文件、加密、保存加密之后的文件，其中读取文件和保存文件使用流来实现，加密操作通过求模运算实现。这 3 个操作相对独立，为了实现代码的独立重用，让设计更符合单一职责原则，这 3 个操作的业务代码封装在 3 个不同的类中。现使用外观模式设计该文件加密模块。

### 实例类图

![image-20240730133848412](./image/image-20240730133848412.png '文件加密模块结构图')

EncryptFacade 充当外观类，FileReader、CipherMachine 和 FileWriter 充当子系统类。

### 实例代码

1. FileReader：文件读取类，充当子系统类。

   ```java
   public class FileReader {
       public String read(String fileNameSrc) {
           System.out.println("读取文件，获取明文：");
           StringBuffer sb = new StringBuffer();
           try {
               FileInputStream inFS = new FileInputStream(fileNameSrc);
               int data;
               while ((data = inFS.read()) != -1) {
                   sb = sb.append((char) data);
               }
               inFS.close();
               System.out.println(sb.toString());
           } catch (FileNotFoundException e) {
               System.out.println("文件不存在！");
           } catch (IOException e) {
               System.out.println("文件操作错位！");
           }
           return sb.toString();
       }
   }
   ```

   

2. CipherMachine：数据加密类，充当子系统。

   ```java
   public class CipherMachine {
       public String encrypt(String plainText) {
           String es = "";
           for (int i = 0; i < plainText.length(); i++) {
               String c = String.valueOf(plainText.charAt(i) % 7);
               es += c;
           }
           System.out.println(es);
           return es;
       }
   }
   ```

   

3. FileWriter：文件保存类，充当子系统数。

   ```java
   public class FileWriter {
       public void write(String encryptStr, String fileNameDes) {
           System.out.println("保存密文，写入文件。");
           try {
               FileOutputStream outFS = new FileOutputStream(fileNameDes);
               outFS.write(encryptStr.getBytes());
               outFS.close();
           } catch (FileNotFoundException e) {
               System.out.println("文件不存在！");
           } catch (IOException e) {
               System.out.println("文件操作错误！");
           }
       }
   }
   ```

   

4. EncryptFacade：加密外观类，充当外观类。

   ```java
   public class EncryptFacade {
       // 维持对子系统对象的引用
       private FileReader reader;
       private CipherMachine cipher;
       private FileWriter writer;
   
       public EncryptFacade() {
           reader = new FileReader();
           cipher = new CipherMachine();
           writer = new FileWriter();
       }
   
       // 调用子系统对象的业务方法
       public void fileEncrypt(String fileNameSrc, String fileNameDes) {
           String plainStr = reader.read(fileNameSrc);
           String encryptStr = cipher.encrypt(plainStr);
           writer.write(encryptStr, fileNameDes);
       }
   }
   ```

   

5. Client：客户端测试类。

   ```java
   public class Client {
       public static void main(String[] args) {
           EncryptFacade ef = new EncryptFacade();
           ef.fileEncrypt("design-pattern/src/main/java/com/wangyq/facade/demo/src.txt",
                   "design-pattern/src/main/java/com/wangyq/facade/demo/des.txt");
       }
   }
   ```

输出如下：

```tex
读取文件,获取明文：Hello world!
数据加密,将明文转换为密文：233364062325
保存密文,写入文件。
```



## 抽象外观类

在标准的外观模式结构图中，如果需要增加、删除或更换与外观类交互的子系统类，必须修改外观类或客户端的源代码，者将违背开闭原则。因此可以通过引入抽象外观类对系统进行改进。引入抽象外观类后，客户端可以针对抽象外观类进行编程，对于新的业务需求，不需要修改原有外观类，而对应增加一个新的具体外观类，由新的具体外观类来关联新的子系统对象，同时通过修改配置文件来达到不修改任何源代码并更换外观类的目的。

如果在本章的应用实例“文件加密模块”中需要更换一个加密类，不再使用原有的基于求模运算的加密类 CipherMachine，而改为基于移位运算的新加密类 NewCipherMachine，其代码如下：

```java
public class NewCipherMachine {
    public String encrypt(String plainText) {
        System.out.print("数据加密，将明文转换为密文：");
        String es = "";
        int key = 10; // 设置密钥，移位数为 10
        for (int i = 0; i < plainText.length(); i++) {
            char c = plainText.charAt(i);
            // 小写字母移位
            if (c >= 'a' && c <= 'z') {
                c += key % 26;
                if (c > 'z') {
                    c -= 26;
                }
                if (c < 'a') {
                    c += 26;
                }
            }
            // 大写字母移位
            if (c >= 'A' && c <= 'Z') {
                c += key % 26;
                if (c > 'Z') {
                    c -= 26;
                }
                if (c < 'A') {
                    c += 26;
                }
            }
            es += c;
        }
        System.out.println(es);
        return es;
    }
}
```

引入抽象外观类之后的文件加密模块结构如图所示：

![image-20240730155639097](./image/image-20240730155639097.png '引入抽象外观类之后的文件加密模块结构图')

抽象外观类 AbstractEncryptFacade 的代码如下：

```java
public abstract class AbstractEncryptFacade {
    public abstract void fileEncrypt(String fileNameSrc, String fileNameDes);
}
```

新增具体加密外观类 NewEncryptFacade 的代码如下：

```java
public class NewEncryptFacade extends AbstractEncryptFacade {
    private FileReader reader;
    private NewCipherMachine cipher;
    private FileWriter writer;

    public NewEncryptFacade() {
        reader = new FileReader();
        cipher = new NewCipherMachine();
        writer = new FileWriter();
    }

    @Override
    public void fileEncrypt(String fileNameSrc, String fileNameDes) {
        String plainStr = reader.read(fileNameSrc);
        String encryptStr = cipher.encrypt(plainStr);
        writer.write(encryptStr, fileNameDes);
    }
}
```

配置文件 config.xml 中存储量具体外观类的类名，代码如下：

```xml
<?xml version="1.0" ?>
<config>
    <className>com.wangyq.facade.demo.NewEncryptFacade</className>
</config>
```

客户端测试代码修改如下：

```java
public class Client {
    public static void main(String[] args) {
        // 针对抽象外观类编程
        AbstractEncryptFacade ef;
        // 读取配置文件，反射生成对象
        ef = (AbstractEncryptFacade) XMLUtil.getBean("design-pattern/src/main/java/com/wangyq/facade/demo/config.xml");
        ef.fileEncrypt("design-pattern/src/main/java/com/wangyq/facade/demo/src.txt",
                "design-pattern/src/main/java/com/wangyq/facade/demo/des.txt");
    }
}
```

输出结果如下：

```tex
读取文件，获取明文：Hello world!
数据加密，将明文转换为密文：Rovvy gybvn!
保存密文，写入文件。
```

原有外观类 EncryptFacade 也需要作为抽象外观类 AbstractEncryptFacade 的子类，在更换具体外观类时只需修改配置文件，无需修改源代码，符合开闭原则。

## 外观模式优点

1. 它对客户端屏蔽了子系统组件，减少了客户端所需处理的对象数目，并使子系统使用起来更加容易。
2. 它实现了子系统与客户端之间的松耦合关系，这使得子系统的变化不会影响到调用它的客户端，只需要调整外观类即可。
3. 一个子系统的修改对其他子系统没有任何影响，而且子系统内部变化也不会影响到外观对象。

### 外观模式缺点

1. 不能很好地限制客户端直接使用子系统，如果对客户端访问子系统做太多的限制则减少了可变性和灵活性。
2. 如果设计不当，增加新的子系统可能需要修改外观类的源代码，违背了开闭原则。

## 外观模式适用环境

1. 当要为访问一系列复杂的子系统提供一个简单入口时可以使用外观模式。
2. 客户端程序与多个子系统之间存在很大的依赖性。引入外观类可以将子系统与客户端解耦，从而提高子系统的独立性和可移植性。
3. 在层次化结构中可以使用外观模式定义系统中每一层的入口，层与层之间不直接产生联系，而通过外观类建立联系，降低层之间的耦合度。
