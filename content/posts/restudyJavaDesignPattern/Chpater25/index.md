+++
title = '25-模板方式模式'
date = 2024-09-10T14:24:20+08:00
lastmod = 2024-09-10T14:24:20+08:00
tags = ['java', '设计模式']
categories = ['Java设计模式']
draft = false

+++

## 模板方法模式概述

某个方法的实现需要多个步骤，其中有些步骤是固定的，而有些步骤不固定，存在可变性。为了提高代码的复用性和系统的灵活性，可以使用一种称为模板方法模式的设计模式来对这类情况进行设计，在模版方法模式中将实现功能的每一个步骤所对应的方法称为基本方法，而将调用这些基本方法同事定义基本方法的执行次序的方法称为模板方法。

> **模板方法模式**：定义一个操作中算法的框架，而将一些步骤延迟到子类中。模板方法模式使得子类可以不改变一个算法的结构即可重定义该算法的某些特定步骤。
>
> **Template Method Pattern**: Define the skeleton of an algorithm in an operation, deferring some steps to subclasses. Template Method lets subclasses redefine certain steps of an algorithm without changing the algorithm's structure.

模板方法模式是一种基于继承的代码复用技术，它是一种类行为型模式。

模板方法模式是结构最简单的行为型设计模式，在其结构中只存在父类和子类之间的继承关系。通过使用模板方法模式可以将一些复杂流程的实现步骤封装在一系列基本方法中，在抽象父类中提供了一个称为模板方式的方法来定义这些基本方法的执行次序，而通过其子类来覆盖某些步骤，从而使得相同的算法框架可以有不同的执行结果。

## 模板方法模式结构

![image-20240910144130884](./image/image-20240910144130884.png '模板方法模式结构图')

1. **AbstractClass（抽象类）**：在抽象类中定义了一系列基本操作（Primitive Operations），这些基本操作可以使具体的，也可以是抽象的，每一个基本操作对应算法的一个步骤，在其子类中可以重定义或实现这些步骤。同时在抽象类中实现了一个模板方法（Template Method），用于定义一个算法的框架，模板方法不仅可以调用在抽象类中实现的基本方法，也可以调用在抽象类的子类中实现的基本方法，还可以调用其他对象中的方法。
2. **ConcreteClass（具体子类）**：它是抽象类的子类，用于实现在父类中声明的抽象基本操作以完成子类特定算法的步骤，也可以覆盖在父类中已经实现的具体基本操作。

## 模板方法模式实现

### 模板方法

一个模板方法是定义在抽象类中的把基本操作方法组合在一起形成一个总算法或一个总行为的方法。这个模板方法定义在抽象类中，并由子类不加修改地完全继承下来（在 Java 语言中可以将模板方法定义为 final 方法）。模板方法是一个具体方法，它给出了一个顶层逻辑框架，而逻辑的组成步骤在抽象类中可以使具体方法，也可以是抽象方法。由于模板方法是具体方法，因此模板方法模式中的抽象层只能是抽象类，而不是接口。

### 基本方法

基本方法是实现算法各个步骤的方法，是模板方法的组成部分。基本方法又可以分为 3 种，即抽象方法（Abstract Method）、具体方法（Concrete Method）和钩子方法（Hook Method）。

1. 抽象方法：一个抽象方法由抽象类声明、由其具体子类实现。在 Java 语言中一个抽象方法以 abstract 关键字标识。
2. 具体方法：一个具体方法由一个抽象类或具体类声明并实现，其子类可以进行覆盖也可以直接继承。
3. 钩子方法：一个钩子方法由一个抽象类或具体类声明并实现，而其子类可能会加以扩展。通常在父类中给出的实现是一个空实现，并以该空实现作为方法的默认实现。当然，钩子方法也可以提供一个非空的默认实现。

在模板方法模式中钩子方法有两类，第一类钩子方法可以与一些具体步骤“挂钩”，以实现在不同条件下执行模板方法的不同步骤，这类钩子方法的返回类型通常是 boolean 类型，方法名一般是 isXXX()，用于对某个条件进行判断，如果条件满足则执行某一步骤，否则将不执行，如下代码片段所示：

```java
// 模板方法
public void templateMethod() {
    open();
    display();
    // 通过钩子方法来确定某一步骤是否执行
    if(isPrint()) {
        print();
    }
}

// 钩子方法
public boolean isPrint() {
    return true;
}
```

在这段代码中，isPrint() 方法即为钩子方法，它可以决定 print() 方法是否执行。一般情况下，钩子方法的返回值为 true，如果不希望某方法执行，可以在其子类中覆盖钩子方法，将其返回值改为 false 即可，这种类型的钩子方法可以控制方法的执行，对一个算法进行约束。 

还有一类钩子方法就是实现体为空的具体方法，子类可以根据需要覆盖或者继承这些钩子方法。

在模板方法模式中，抽象类的典型代码如下：

```java
public abstract class AbstractClass {
    // 模板方法
    public void templateMethod() {
        primitiveOperation1();
        primitiveOperation2();
        primitiveOperation3();
    }
    
    // 基本方法--具体方法
    public void primitiveOperation1() {
        // 实现代码
    }
    
    // 基本方法--抽象方法
    public abstract void primitiveOperation2();
    
    // 基本方法--钩子方法
    public void primitiveOperation3() {
        
    }
}
```

用户可以在抽象类的子类中提供抽象步骤的实现，也可覆盖父类中已经实现的具体方法。

```java
public class ConcreteClass extends AbstractClass {
    public void primitiveOperation2() {
        // 实现代码
    }
    
    public void primitiveOperation3() {
        // 实现代码
    }
}
```

在模板方法模式中，由于面向对象的多态性，子类对象在运行时将覆盖父类独享，子类中定义的方法也将覆盖父类中定义的方法，因此程序在运行时具体子类的基本方法将覆盖父类中定义的基本方法，子类的钩子方法也将覆盖父类的钩子方法， 从而可以通过子类中实现的钩子方法对父类方法的执行进行约束，实现子类对父类行为的反向控制。

## 模板方法模式应用实例

### 实例说明

某软件公司要为某银行的业务支持系统开发一个利息计算模块，利息计算流程如下：

1. 系统根据账号和密码验证用户信息，如果用户信息错误，系统显示出错提示。
2. 如果用户信息正确，则根据用户系统的不同使用不同的利息计算公式计算利息（如活期账户和定期账户具有不同的计算公式）。
3. 系统显示利息。

试使用模板方法模板设计该利息计算模板。

### 实例类图

![image-20240910165051346](./image/image-20240910165051346.png '银行利息计算模块结构图')

### 实例代码

1. Account：账户类，充当抽象类。

   ```java
   public abstract class Account {
       // 基本方法--具体方法
       public boolean validate(String account, String password) {
           System.out.println("账号：" + account);
           System.out.println("密码：" + password);
           if (account.equalsIgnoreCase("张无忌") && password.equalsIgnoreCase("123456")) {
               return true;
           } else {
               return false;
           }
       }
   
       // 基本方法--抽象方法
       public abstract void calculateInterest();
   
       // 基本方法--具体方法
       public void display() {
           System.out.println("显示利息！");
       }
   
       // 模板方法
       public void handle(String account, String password) {
           if (!validate(account, password)) {
               System.out.println("账户或密码错误！");
               return;
           }
           calculateInterest();
           display();
       }
   }
   ```

   

2. CurrentAccount：活期账户类，充当具体子类。

   ```java
   // 活期账户类：具体子类
   public class CurrentAccount extends Account{
       // 覆盖父类的抽象具体方法
       @Override
       public void calculateInterest() {
           System.out.println("按活期利息计算利息！");
       }
   }
   ```

   

3. SavingAccount：定期账户类，充当具体子类。

   ```java
   public class SavingAccount extends Account{
       // 覆盖父类的抽象基本方法
       @Override
       public void calculateInterest() {
           System.out.println("按定期利率计算利息！");
       }
   }
   ```

   

4. config.xml：在配置文件中存储了具体子类的类名。

   ```xml
   <?xml version="1.0" ?>
   <config>
       <className>com.wangyq.template.CurrentAccount</className>
   </config>
   ```

   

5. Client：客户端测试类。

   ```java
   public class Client {
       public static void main(String[] args) {
           Account account;
           account = (Account) XMLUtil.getBean("design-pattern/src/main/java/com/wangyq/template/config.xml");
           account.handle("张无忌", "123456");
       }
   }
   ```

### 结果及分析

```tex
账号：张无忌
密码：123456
按活期利息计算利息！
显示利息！
```

如果需要更换具体子类，无需修改源代码，只需修改配置文件即可。

## 模板方法模式优点

1. 在父类中形式化地定义一个算法，而由它的子类来实现细节的处理，在子类实现详细的处理算法时并不会改变算法中步骤的执行次序。
2. 模板方法模式是一种代码复用技术，在类库设计汇总尤为重要，它提取了类库汇总的公共行为，将公共行为放在父类中，而通过其子类实现不同的行为，它鼓励用户掐当地使用继承来实现代码复用。
3. 模板方法模式可实现一种反向控制结构，通过子类覆盖父类的钩子方法来决定某一特定步骤是否需要执行。
4. 在模板方法模式中可以通过子类来覆盖父类的基本方法，不同的子类可以提供基本方法的不同实现，更换和增加新的子类很方便，符合单一职责原则和开闭原则。

## 模板方法模式缺点

在模板方法模式中需要为每一个基本方法的不同实现提供一个子类，如果父类中可变的基本方法太多，将会导致类的个数增加，系统更加庞大，设计也更加抽象，此时可结合桥接模式进行设计。

## 模板方法模式适用环境

1. 对一些复杂的算法进行分割，将其算法中固定不变的部分设计为模板方法和父类具体方法，而一些可以改变的细节由其子类来实现。即一次性实现一个算法的不变部分，并将可变的行为留给子类来实现。
2. 各子类中公共的行为应该被提取出来并集中到一个公共父类中以避免代码重复。
3. 需要通过子类来决定父类算法中的某个步骤是否执行，实现子类对父类的反向控制。
