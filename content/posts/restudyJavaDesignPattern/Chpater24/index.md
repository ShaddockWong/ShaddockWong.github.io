+++
title = '24-策略模式'
date = 2024-09-09T15:49:08+08:00
lastmod = 2024-09-09T15:49:08+08:00
tags = ['java', '设计模式']
categories = ['Java设计模式']
draft = false

+++

## 策略模式概述

实现某一个功能（例如排序、查找等）有多种算法，一种常用的方法是通过硬编码（Hard Coding）将所有的算法集中在一个类中，在该类中提供多个方法，每一个方法对应一个具体的算法。如果需要增加一种新的算法，需要修改算法类的源代码，更换算法也需要修改客户端调用代码。在这个统一的算法类中封装了大量算法，代码非常复杂，维护也很困难。

此时可以使用一种设计模式来实现灵活的选择算法，还能方便地增加新的算法，该设计模式就是策略模式。在策略模式中可以定义一些独立的类来封装不同的算法，每一个类封装一种具体的算法，在这里每一个封装算法的类都可以称为一种策略（Strategy），为了保证这些策略在使用时具有一致性，一般会提供一个抽象的策略类来做算法的声明，而每种算法对应一个具体策略类。

> **策略模式**：定义一些列算法，将每一个算法封装起来，并让它们可以相互替换。策略模式让算法可以独立于使用它的客户而变化。
>
> **Strategy State**: Define a family of algorithms, encapsulate each one, and make them interchangeable. Strategy lets the algorithm vary independently from clients that use it.

策略模式又称为政策（Policy）模式，它是一种对象行为型模式。

## 策略模式结构

![image-20240909161426141](./image/image-20240909161426141.png '策略模式结构图')

1. **Context（环境类）**：环境类是使用算法的角色，它在解决某个问题（即实现某个功能）时可以采用多种策略。在环境类中维持一个对抽象策略类的引用实例，用于定义所采用的策略。
2. **Strategy（抽象策略类）**：抽象策略类为所支持的算法声明了抽象方法，是所有策略类的父类，它可以是抽象类或具体类，也可以是接口。环境类通过抽象策略类中声明的方法在运行时调用具体策略类中实现的算法。
3. **ConcreteStrategy（具体策略类）**：具体策略类实现了在抽象策略类中声明的算法，在运行时具体策略类将覆盖在环境类中定义的抽象策略类对象，使用一种具体的算法实现某个业务功能。

## 策略模式实现

策略模式是一个很容易理解和使用的设计模式，策略模式是对算法的封装，它把算法的责任和算法本身分割开，委派给不同的对象管理。策略模式通常把一个系列的算法封装到一系列具体策略类里，作为抽象策略类的子类。在策略模式中对环境类和抽象策略类的理解非常重要，环境类是需要使用算法的类。

在使用策略模式时需要将算法从环境类 Context 中提取出来，首先应该创建一个抽象策略类，其典型代码如下：

```java
public abstract class AbstractStrategy {
    public abstract void algorithm(); // 声明抽象算法
}
```

然后将封装每一种具体算法的类作为该抽象策略类的子类，代码如下：

```java
public class ConcreteStrategyA extends AbstractStrategy {
    // 算法的具体实现
    public void algorithm() {
        // 算法 A
    }
}
```

其他具体策略类与之类似，对于 Context 类而言，在它与抽象策略类之间建立一个关联关系，其典型代码如下：

```java
public class Context {
    public AbstractStrategy Strategy;  // 维持一个对抽象策略类的引用
    
    public void setStrategy(AbstractStrategy strategy) {
        this.strategy = strategy;
    }
    
    // 调用策略类中的算法
    public void algorithm() {
        strategy.algorithm();
    }
}
```

在 Context 类中定义一个 AbstractStrategy 类型的对象 Strategy，通过注入的方式在客户端传入一个具体策略对象，客户端代码片段如下：

```java
...
Context context = new Context();
AbstractStrategy strategy;
strategy = new ConcreteStrategyA(); // 可在运行时指定类型，通过配置文件和反射机制实现
context.setStrategy(strategy);
context.algorithm();
...
```

在客户端代码中只需注入一个具体策略对象，可以将具体策略类的类名存储在配置文件中，通过反射来动态创建具体策略对象，从而使得用户可以灵活地更换具体策略类，增加新的具体策略类也很方便。策略模式提供了一种可插入式（Pluggable）算法的实现方案。

## 策略模式应用实例

### 实例说明

某软件公司为某电影院开发了一套影院售票系统，在该系统中需要为不同类型的用户提供不同的电影票打着方式，具体打折方案如下：

1. 学生凭学生证可享受票价 8 折优惠。
2. 年龄在 10 周岁及以下的儿童可享受每张票减免 10 元的优惠（原始票价需大于等于 20 元）。
3. 影院 VIP 用户除享受票价半价优惠外还可以进行积分，积分累计到一定程度可换取电影院赠送的礼品。

该系统在将来还要根据需要引入新的打折方案。试使用策略模式设计该影院售票系统的打折方案。

### 实例类图

![image-20240909173159358](./image/image-20240909173159358.png '电影票打折方案结构图')

### 实例代码

1. MovieTicket：电影票类，充当环境类。

   ```java
   public class MovieTicket {
       private double price;
       private Discount discount;  // 维持一个对抽象折扣类的引用
   
       public void setPrice(double price) {
           this.price = price;
       }
   
       // 注入一个折扣类对象
       public void setDiscount(Discount discount) {
           this.discount = discount;
       }
   
       public double getPrice() {
           // 调用折扣类的折扣计算方法
           return discount.calculate(this.price);
       }
   }
   ```

   

2. Discount：折扣类，充当抽象策略类。

   ```java
   public interface Discount {
       public double calculate(double price);
   }
   ```

   

3. StudentDiscount：学生票折扣类，充当具体策略类。

   ```java
   public class StudentDiscount implements Discount {
       private final double DISCOUNT = 0.8;
   
       @Override
       public double calculate(double price) {
           System.out.println("学生票");
           return price * DISCOUNT;
       }
   }
   ```

4. ChildrenDiscount：儿童票折扣类，充当具体策略类。

   ```java
   public class ChildrenDiscount implements Discount {
       private final double DISCOUNT = 10;
   
       @Override
       public double calculate(double price) {
           System.out.println("儿童票");
           if (price >= 20) {
               return price - DISCOUNT;
           } else {
               return price;
           }
       }
   }
   
   ```

   

5. VIPDiscount：VIP 会员票折扣类，充当具体策略类。

   ```java
   public class VIPDiscount implements Discount {
       private final double DISCOUNT = 0.5;
   
       @Override
       public double calculate(double price) {
           System.out.println("VIP 票：");
           System.out.println("增加积分！");
           return price * DISCOUNT;
       }
   }
   ```

6. config.xml：配置文件，存储了具体折扣类的类名。

   ```xml
   <?xml version="1.0" ?>
   <config>
       <className>com.wangyq.strategy.StudentDiscount</className>
   </config>
   ```

   

7. Client：客户端测试类。

   ```java
   public class Client {
       public static void main(String[] args) {
           MovieTicket mt = new MovieTicket();
           double originalPrice = 60.0;
           double currentPrice;
   
           mt.setPrice(originalPrice);
           System.out.println("原始价为：" + originalPrice);
           System.out.println("--------------------------------------");
   
           Discount discount;
           discount = (Discount) XMLUtil.getBean("design-pattern/src/main/java/com/wangyq/strategy/config.xml");
           mt.setDiscount(discount);  // 注入折扣对象
   
           currentPrice = mt.getPrice();
           System.out.println("折后价为：" + currentPrice);
       }
   }
   ```

   ### 结果及分析

   输出结果如下：

   ```tex
   原始价为：60.0
   --------------------------------------
   学生票
   折后价为：48.0
   ```

   如果需要更换具体策略类，无需修改源代码，只需修改配置文件即可。如果要增加新的打折方式，原有代码无需修改，只需要增加一个新的折扣类作为抽象折扣类的子类即可，完全符合开闭原则。

## 策略模式优点

1. 策略模式提供了对开闭原则的完美支持，用户可以在不修改原有系统的基础上原则算法或行为，也可以灵活地增加新的算法或行为。
2. 策略模式提供了管理相关的算法族的办法。策略类的等级结构定义了一个算法或行为族，恰当地使用继承可以把公共的代码移到抽象策略类中，从而避免重复的代码。
3. 策略模式提供了一种可以替换继承关系的办法。
4. 使用策略模式可以避免多重条件选择语句。
5. 策略模式提供了一种算法的复用机制，由于将算法单独提取处理封装在策略类中，因此不同的环境类可以方便地服用这些策略类。

## 策略模式缺点

1. 客户端必须知道所有的策略类，并自行决定使用哪一个策略类。
2. 策略模式将造成系统产生很多具体策略类，任何细小的变化都将导致系统要增加一个新的具体策略类。
3. 无法同时在客户端使用多个策略类，也就是说，在使用策略模式时客户端每次只能使用一个策略类，不支持使用一个策略类完成部分功能后再使用另一个策略类完成剩余功能的情况。

## 策略模式适用环境

1. 一个系统需要动态地在几种算法中选择一种，那么可以将这些算法封装到一个个的具体算法类中，而这些具体算法类都是一个抽象算法类的子类。换而言之，这些具体算法类均有统一的接口，根据里氏代换原则和面向对象的多态性，客户端可以选择使用任何一个具体算法类，并只需要维持一个数据类型是抽象算法类的对象。
2. 一个对象有很多行为，如果不用恰当的模式，这些行为则只好使用多重条件选择语句来实现。此时使用策略模式把这些行为转移到相应的具体策略类里面，就可以避免使用难以维护的多重条件选择语句。
3. 不希望客户端知道复杂的、与算法相关的数据结构，在具体策略类中封装算法与相关的数据结构，可以提高算法的保密性与安全性。
