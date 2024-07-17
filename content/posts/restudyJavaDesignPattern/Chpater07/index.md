+++
title = '07-原型模式'
date = 2024-07-15T16:35:00+08:00
lastmod = 2024-07-16T16:35:00+08:00
tags = ['java', '设计模式']
categories = ['Java设计模式']
draft = false

+++

## 原型模式概述

在面向对象系统中可以通过复制一个原型对象得到多个与原型对象一模一样的新对象，这就是原型模式的动机。

> **原型模式**：使用原型实例指定待创建对象的类型，并且通过复制这个原型来创建新的对象。
>
> **Prototype Pattern**: Specify the kinds of objects to create using a  prototypical instance, and create new objects by copying this prototype.

原型模式是一种对象创建型模式，它的工作原理很简单：将一个原型对象传给要发动创建的对象（即客户端对象），这个要发动创建的对象通过请求原型对象复制自己来实现创建过程。

需要注意的是通过克隆方法所创建的对象是全新的对象，它们在内存中拥有新的地址，通常对克隆所产生的对象进行修改不会对原型对象造成任何影响，每一个克隆对象都是相互独立的。

## 原型模式结构

原型模式结构如下图所示：

![原型模式结构图](./image/原型模式结构图-1721100461867-5.jpg '原型模式结构图')

由上图可知，原型模式包含以下 3 个角色。

1. **Prototype（抽象原型类）**：它是声明克隆方法的接口，是所有具体原型类的公共父类，它可以是抽象类也可以是借口，甚至还可以是具体实现类。
2. **ConcretePrototype（具体原型类）**：它实现在抽象原型类中声明的克隆方法，在克隆方法中返回自己的一个克隆对象。
3. **Client（客户类）**：在客户类中，让一个原型对象克隆自身从而创建一个新的对象，只需要直接实例化或通过工厂方法等方式创建一个原型对象，再通过调用该对象的克隆方法得到多个相同的对象。由于客户类针对抽象原型类 Prototype 编程，因此用户可以根据需要选择具体原型类，系统具有较好的可扩展性，增加或更换具体原型类都很方便。

### 浅克隆与深克隆

1. 浅克隆

   如果原型对象的成员变量是值类型（基本数据类型），将复制一份给克隆对象；如果原型对象的成员变量是引用类型，将引用对象的地址（内存引用地址）复制一份给克隆对象。

   当原型对象被复制时只复制它本身和其中包含的值类型的成员变量，而引用类型的成员变量并没有复制。

   ![image-20240716114902556](./image/image-20240716114902556.png '浅克隆示意图')

2. 深克隆

   不论原型对象的成员变量是值类型还是引用类型，都将复制一份给克隆对象。也就是除了对象本身，对象所包含的所有成员变量也将被复制。

   ![image-20240716133914348](./image/image-20240716133914348.png '深克隆示意图')

## 原型模式实现

### 通过实现方法

通用的克隆实现方法是在具体原型的克隆方法中实例化一个与自身类型相同的对象并将其返回，同时将相关的参数传入新创建的对象中，保证它们的成员变量相同。

```java
public abstract class Prototype {
    public abstract Prototypr cloen();
}

public class ConcretePrototypr extends Prototype {
    private String attr;		// 成员变量
    
    public void setAttr(String attr) {
        this.attr = attr;
    }
    
    public String getAttr() {
        return this.attr;
    }
    
    // 克隆方法
    public Prototype clone() {
        Prototype prototype = new Prototype(); // 创建新对象
        prototype.setAttr(this.attr);
        return prototype;
    }
}
```

在客户类中只需要创建一个 ConcretePrototype 对象作为原型对象，然后调用其 cloen() 方法即可得到对象的克隆对象，例如：

```java
...
ConcretePrototype prototype = new ConcretePrototype();
prototype.setAttr("Sunny");
ConcretePrototype copy = (ConcretePrototype)prototype.clone();
...
```

此方法是原型模式的通用实现，它与编程语言本身的特性无关，其他面向编程语言也可以使用这种形式来实现对原型对象的克隆。

### Java 语言中的 clone() 方法和 Cloneable 接口

在 Java 语言中，Object 类提供了一个 clone() 方法，可以将一个 Java 对象复制一份。因此在 Java 中可以直接使用 Object 提供的 clone() 方法实现浅克隆。

能够实现克隆的 Java 类必须实现一个标识接口 Cloneable，表示这个 Java 类支持被复制。如果没有实现这个接口，Java 编译器将抛出一个 CloneNotSupportedException 异常。

```java
public class ConcretePrototype implements Cloneable {
    ...
    public Prototype clone() {
        Object object = null;
        try {
            object = super.clone();	// 浅克隆
        }
        catch(CloneNotSuppertedException exception) {
            System.err.println("Not support cloneable");
        }
        return (Prototype)object;
    }
    ...
}
```

在客户端创建原型对象和克隆对象也很简单。

```java
Prototype prototype = new Prototype();
Prototype copy = prototype.clone();
```

Java 语言中的 clone() 方法满足以下几点：

1. 对任何对象 x，都有 x.clone() != x，即克隆对象和原型对象不是同一个对象。
2. 对任何对象 x，都有 x.clone().getClass() == x.getClass()，即克隆对象与原型对象的类型一样。
3. 如果对象的 x 的 equles() 方法定义恰当，那么 x.clone().equals(x) 应该成立。

为了获取对象的一个克隆，可以直接利用 Object 类的 clone() 方法，具体步骤如下：

1. 在派生类中覆盖基类的 clone() 方法，并声明为 public。
2. 在派生类的 clone() 方法中调用 super.clone()。
3. 派生类需实现 Cloneable 接口。

此时，Object 类相当于抽象原型类，所有实现了 Cloneable 接口的类相当于具体原型类。

## 原型模式应用实例

### 实例说明

在使用某 OA 系统时，有些岗位的员工发现他们每周的工作都大同小异，因此在填写工作周报时很多内容都是重复的，为了提高工作周报的创建效率，大家迫切希望有一种机制能够快速创建相同或者相似的周报，包括创建周报的附件。

试使用原型模式对该 OA 系统中的工作周报创建模块进行改进。

### 实例类图

通过分析，本实例的结构图如下：

![image-20240716143621652](./image/image-20240716143621652.png '工作周报创建模块结构图（浅克隆）')

### 实例代码

1. Attachment：附件类

   ```java
   public class Attachment {
       private String name; // 附件名
   
       public void setName(String name) {
           this.name = name;
       }
   
       public String getName() {
           return this.name;
       }
   
       public void download() {
           System.out.println("下载附件，文件名为 " + name);
       }
   }
   ```

   

2. WeeklyLog：工作周报类，充当原型角色。在真实环境下该类将比较复杂，考虑到代码的可读性，在此只列出部分与模式相关的核心代码。

   ```java
   public class WeeklyLog implements Cloneable {
       // 为了简化设计和实现，假设一份工作周报中只有一个附件对象，在实际情况中可以包含多个附件，可以通过 List 等集合对象来实现
       private Attachment attachment;
       private String name;
       private String date;
       private String content;
   
       public Attachment getAttachment() {
           return attachment;
       }
   
       public void setAttachment(Attachment attachment) {
           this.attachment = attachment;
       }
   
       public String getName() {
           return name;
       }
   
       public void setName(String name) {
           this.name = name;
       }
   
       public String getDate() {
           return date;
       }
   
       public void setDate(String date) {
           this.date = date;
       }
   
       public String getContent() {
           return content;
       }
   
       public void setContent(String content) {
           this.content = content;
       }
   
       // 使用 clone() 方法实现浅克隆
       public WeeklyLog clone() {
           Object obj = null;
           try {
               obj = super.clone();
               return (WeeklyLog) obj;
           } catch (CloneNotSupportedException e) {
               System.out.println("不支持复制");
               return null;
           }
       }
   }
   ```

   

3. Client：客户端测试类。

   ```java
   public class Client {
       public static void main(String[] args) {
           WeeklyLog log_previous, log_new;
           log_previous = new WeeklyLog();             // 创建原型对象
           Attachment attachment = new Attachment();   // 创建附件对象
           log_previous.setAttachment(attachment);     // 将附件添加到周报中
           log_new = log_previous.clone();             // 调用克隆方法创建克隆对象
           // 比较周报
           System.out.println("周报是否相同？" + (log_previous == log_new));
           // 比较附件
           System.out.println("附件是否相同？" + (log_previous.getAttachment() == log_new.getAttachment()));
       }
   }
   ```

### 结果及分析

编译并运行程序，输出结果如下，此方式仅仅实现了对象的浅克隆。

```tex
周报是否相同？false
附件是否相同？true
```

### 深克隆解决方案

在 Java 语言中可以通过序列化（Serialization）等方式来实现深克隆。序列化就是将对象写到流的过程，写到流中的对象是原有对象的一个复制，而原对象仍然存在于内存中。通过序列化将对象写到一个流中，再从流中将其读出来，可以实现深克隆。需要注意能够实现序列化的对象其类必须实现实现 Serialization 接口。

下面是用深克隆技术来实现工作周报和附件对象的复制，由于要将附件对象和工作周报对象都写入流中，因此两个类均要实现 Serializable 接口，其结构如下图所示：

![image-20240716162628089](./image/image-20240716162628089.png '工作周报创建模块结构图（深克隆）')

修改后的附件类 Attachment 的代码如下：

```java
public class Attachment implements Serializable {
    private String name; // 附件名

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return this.name;
    }

    public void download() {
        System.out.println("下载附件，文件名为 " + name);
    }
}
```

工作周报类 WeeklyLog 不再使用 Java 自带的克隆机制，而是通过序列化从头实现对象的深克隆，编写 deepClone() 方法实现深克隆。

```java
public class WeeklyLog implements Serializable {
    private Attachment attachment;
    private String name;
    private String date;
    private String content;

    public Attachment getAttachment() {
        return attachment;
    }

    public void setAttachment(Attachment attachment) {
        this.attachment = attachment;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    // 使用序列化技术实现深克隆
    public WeeklyLog deepClone() throws IOException, ClassNotFoundException, OptionalDataException {
        // 将对象写入流中
        ByteArrayOutputStream bao = new ByteArrayOutputStream();
        ObjectOutputStream oos = new ObjectOutputStream(bao);
        oos.writeObject(this);
        // 将对象从流中取出
        ByteArrayInputStream bis = new ByteArrayInputStream(bao.toByteArray());
        ObjectInputStream ois = new ObjectInputStream(bis);
        return (WeeklyLog) ois.readObject();
    }
}
```

客户端测试类 Client 的代码修改如下：

```java
public class Client {
    public static void main(String[] args) {
        WeeklyLog log_previous, log_new = null;
        log_previous = new WeeklyLog();             // 创建原型对象
        Attachment attachment = new Attachment();   // 创建附件对象
        log_previous.setAttachment(attachment);     // 将附件添加到周报中
        try {
            log_new = log_previous.deepClone();     // 调用深克隆方法创建克隆对象
        } catch (Exception e) {
            System.out.println("克隆失败");
        }
        // 比较周报
        System.out.println("周报是否相同？" + (log_previous == log_new));
        // 比较附件
        System.out.println("附件是否相同？" + (log_previous.getAttachment() == log_new.getAttachment()));
    }
}
```

输出结果如下：

```tex
周报是否相同？false
附件是否相同？false
```

## 原型管理器

原型管理器（Prototype Manager）将多个原型对象存储在一个集合中供客户端使用，它是一个专门负责克隆对象的工厂，其中定义了一个集合用于存储原型对象，如果需要某个原型对爱那个的一个克隆，可以通过复制集合中对应的原型对象来获得。在原型管理器中对原型类进行编程，以便扩展。

![image-20240716170105224](./image/image-20240716170105224.png '带原型管理器的原型模式')

典型的原型管理器 PrototypeManager 类的实现代码片段如下：

```java
import java.util.*;

public class PrototypeManager {
    private Hashtable prototypeTable = new Hashtable(); // 使用 Hashtable 存储原型对象
    public PrototypeManager() {
        prototypeTable.put("A", new ConcretePrototypeA());
        prototypeTable.put("B", new ConcretePrototypeA());
    }
    
    public void add(String key, Prototype prototype) {
        prototypeTable.put(key, prototype);
    }
    
    public Prototype get(String key) {
        Prototype clone = null;
        clone = ((Prototype) prototypeTable.get(key)).clone(); // 通过克隆方法创建新对象
        return clone;
    }
}
```

在实际开发中可以将 PrototypeManager 设计为单例类，确保系统中只有一个 PrototypeManager 对象，这样既有利于节省系统资源，还可以更好地对原型管理器对象进行控制。

## 原型模式优点

1. 当创建新的对象实例较为复杂时，使用原型模式可以简化对象的创建过程，通过复制一个已有实例可以提高新实例的创建效率。
2. 扩展性较好，由于在原型模式中提供了抽象原型类，在客户端可以针对抽象原型类进行编程，而将具体原型类写在配置文件中，增加或减少产品类对原有系统没有任何影响。
3. 原型模式提供了简化的创建结构，工厂方法模式常常需要有一个产品等级结构相同的工厂等级结构，而原型模式就不需要这样，原型模式中产品的复制是通过封装在原型类中的克隆方法实现的，无需专门的工厂类来创建产品。
4. 可以使用深克隆的方式保存对象的状态，使用原型模式将对象复制一份并将其状态保存起来，以便在需要的时候使用（例如恢复到某一历史状态），可辅助实现撤销操作。

## 原型模式缺点

1. 需要为每一个类配备一个克隆方法，而且该克隆方法位于一个类的内部，当对已有的类进行改造时需要修改源代码，违背了开闭原则。
2. 在实现深克隆时需要便携较为复杂的代码，而且当对象之间存在多重的嵌套引用时，为了实现深克隆，每一层对象对应的类都必须支持深克隆，实现比较麻烦。

## 原型模式适应环境

1. 创建新对象成本较大，新对象可以通过复制已有对象来获得。
2. 系统要保存对象的状态，而对象的状态变化很小。
3. 需要避免使用分层次的工厂类来创建分层次的对象，并且类的实例对象只有一个或很少的几个组合状态，通过复制对象得到新实例可能比使用构造函数构造一个新实例更加方便。
