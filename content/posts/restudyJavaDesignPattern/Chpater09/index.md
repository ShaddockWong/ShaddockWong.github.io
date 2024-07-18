+++
title = '09-适配器模式'
date = 2024-07-18T13:38:49+08:00
lastmod = 2024-07-18T13:38:49+08:00
tags = ['java', '设计模式']
categories = ['Java设计模式']
draft = false

+++

## 适配器模式概述

我们国家生活用电是 220V，而笔记本、手机等电子设备的工作电压没有这么高，为了使这些电子设备可以使用 220V 的生活用电，就需要使用电源适配器。

在软件开发中有时也存在类似这种不兼容的情况，也可以像引入一个电源适配器那样，引入一个称为适配器的角色来协调这种存在不兼容的结构，这种设计方案即为适配器模式。

在适配器模式中引入了一个被称为适配器（Adapter）的包装类，而它所包装的对象称为适配者（Adaptee），即被适配的类。适配器的实现就是把客户类的请求转化为对适配类的方法，而这个过程对客户类是透明的，客户类并不直接访问适配者类。因此，适配器让那些由于接口不兼容而不能交互的类可以一起工作。

> **适配器模式**：将一个类的接口转换成客户希望的另一个接口。适配器模式让那些接口不兼容的类可以一起工作。
>
> **Adapter Pattern**: Convert the interface of a class into another interface clients expect. Adapter lets classes work together that couldn't otherwise because of incompatible interfaces.

适配器模式的别名为包装类（Wrapper）模式，它既可以作为类结构型模式，也可以作为对象结构型模式。

## 适配器模式结构

适配器模式包括类适配器和对象适配器。

类适配器模式的结构如下 图1 所示：

![image-20240718135805624](./image/image-20240718135805624.png '图1 类适配器模式结构图')

对象适配器模式的结构图如下 图2 所示：

![image-20240718135914359](./image/image-20240718135914359.png '图2 对象适配器模式结构图')

适配器模式包含以下 3 个角色。

1. **Target（目标抽象类）**：目标抽象类定义客户所需的接口，可以使一个抽象类或接口，也可以是具体类。在类适配器中，由于 Java 语言不支持多重继承，它只能是接口。
2. **Adapter（适配器类）**：它可以调用另一个接口，作为一个转换器，对 Adaptee 和 Target 进行适配。适配器类是适配器模式的核心，在类适配器中，它通过实现 Target 接口并继承 Adaptee 类来使二者产生联系，在对象适配器中，它通过继承 Target 并关联一个 Adaptee 对象使二者产生联系。
3. **Adaptee（适配者类）**：适配者即被适配的角色，它定义了一个已经存在的接口，这个接口需要适配，适配者类一般是一个具体类，包含了客户希望使用的业务方法，在某些情况下甚至没有适配者类的源代码。

## 适配器模式实现

### 类适配器

在类适配器中适配者类 Adaptee 没有 request() 方法，而客户端期待这个方法，蛋仔适配者类中实现了 specificRequest() 方法，该方法提供的实现正是客户端所需要的。为了使客户端能够使用适配者类，提供了一个中间类，即适配器类 Adapter，适配器类实现了抽象目标接口 Target，并继承了适配者类，在适配器类 request() 方法中调用所继承的适配者类的 specificRequest() 方法，达到了适配的目的。因为适配器类和适配者类是继承关系，所以这种适配器模式称为类适配器模式。典型代码如下：

```java
public class Adapter extends Adaptee implements Target {
    public void request() {
        super.specificRequest();
    }
}
```

### 对象适配器

在对象适配器中客户端需要调用 request() 方法，而适配者类 Adaptee() 没有该方法，但是它提供的 specificRequest() 方法确实客户端所需要的。为了使客户端能够使用适配者类，需要提供一个包装类 Adapter，即适配器类。这个包装类包装类一个适配者的实例，从而将客户端与适配者衔接起来，在适配器的 request() 方法中调用适配者的 specificRequest() 方法。因为适配器类与适配者类是关联关系（也称委派关系），所以这种适配器模式称为对象适配器模式。典型代码如下：

```java
public class Adapter extends Target {
    private Adaptee adaptee;  // 维持一个对适配者对象的引用
    
    public Adapter(Adaptee adaptee) {
        this.adaptee = adaptee;
    }
    
    public void request() {
        adaptee.specificRequest();  // 转发调用
    }
}
```

适配器模式更多的是强调对代码的组织，而不是功能的实现。在实际开发中，对象适配器的使用频率更高。

## 适配器模式应用实例

### 实例说明

某公司要开发一款儿童玩具汽车，为了更好地吸引小朋友的注意力，该玩具汽车在移动过程中伴随着灯光闪烁和声音提示。在该公司以往的产品中已经实现了控制灯光闪烁和声音提示的程序，为了重用先前的代码并且使汽车控制软件具有更好的灵活性和扩展性，现使用适配器模式设计该玩具汽车控制软件。

### 实例类图

![image-20240718145711624](./image/image-20240718145711624.png '汽车控制软件结构图')

### 实例代码

1. CarController：汽车控制类，充当目标抽象类。

   ```java
   public abstract class CarController {
       public void move() {
           System.out.println("玩具汽车移动！");
       }
   
       public abstract void phonate(); // 发出声音
   
       public abstract void twinkle(); // 灯光闪烁
   }
   ```

   

2. PoliceSound：警笛类，充当适配者。

   ```java
   public class PoliceSound {
       public void alarmSound() {
           System.out.println("发出警笛声！");
       }
   }
   ```

   

3. PoliceLamp：警灯类，充当适配者。

   ```java
   public class PoliceLamp {
       public void alarmLamp() {
           System.out.println("呈现警灯闪烁！");
       }
   }
   ```

   

4. PoliceCarAdapter：警车适配器，充当适配器。

   ```java
   public class PoliceCarAdapter extends CarController {
       private PoliceSound sound;     // 定义i适配者 PoliceSound 对象
       private PoliceLamp lamp;       // 定义适配者 PoliceLamp 对象
   
       public PoliceCarAdapter() {
           sound = new PoliceSound();
           lamp = new PoliceLamp();
       }
   
       // 发出警笛声音
       @Override
       public void phonate() {
           sound.alarmSound();         // 调用适配者类 PoliceSound 的方法
       }
   
       // 呈现警灯闪烁
       @Override
       public void twinkle() {
           lamp.alarmLamp();           // 调用适配者类 PoliceLamp 的方法
       }
   }
   ```

   

5. 配置文件 config.xml

   ``` xml
   <?xml version="1.0"?>
   <config>
       <className>com.wangyq.adapter.demo.PoliceCarAdapter</className>
   </config>
   ```

   

6. Client：客户端测试类

   ```java
   public class Client {
       public static void main(String[] args) {
           CarController car;
           car = (CarController) XMLUtil.getBean("design-pattern/src/main/java/com/wangyq/adapter/demo/config.xml");
           car.move();
           car.phonate();
           car.twinkle();
       }
   }
   ```

### 结果及分析

运行程序，输出结果如下：

```tex
玩具汽车移动！
发出警笛声音！
呈现警灯闪烁！
```

本实例中使用了对象适配器模式，同时引入了配置文件，如果需要使用其他声音类或者灯光类，可以增加一个新的适配器类，使用新的适配器来适配新的声音或者灯光类，原有代码无需修改，符合开闭原则。

在本实例中目标抽象类是一个抽象类，而不是接口，并且实力中的适配器类 PoliceCarAdapter 同时适配了两个适配者，由于 Java 语言不支持多重类继承，因此本实例只能通过对象适配器来实现，而不能使用类适配器。在实际软件开发中对象适配器比类适配器更加灵活，使用频率更高。

## 缺省适配器模式

缺省适配其模式是适配器模式的一种变体，其应用也比较广泛。

> 缺省适配器模式（Default Adapter Pattern）：当不需要实现一个接口提供的所有方法时，可现设计一个抽象类实现该接口，并为接口中的每个方法提供一个默认实现（空方法），那么该抽象类的子类可以选择性地覆盖父类的某些方法来实现需求，它适合于不想使用一个接口中的所有方法的情况，又称为单接口适配器模式。

缺省适配器模式结构如下图所示：

![image-20240718154120159](./image/image-20240718154120159.png '缺省适配器模式结构图')

包含以下 3 个角色：

1. **ServiceInterface（适配者接口）**：它是一个接口，通常在该接口中声明了大量的方法。
2. **AbstractServiceClass（缺省适配器类）**：它是缺省适配器模式的核心类，使用空方法的形式实现了在 ServiceInterface 接口中声明的方法。通常将它定义为抽象类，因为对它进行实例化没有任何意义。
3. **ConcreteServiceClass（具体业务类）**：它是缺省适配器类的字类，在没有引入适配器之前它需要实现适配者接口，因此需要实现在适配者接口中定义的所有方法，而对于一些无需使用的方法不得不提供空实现。在有了缺省适配器之后可以直接继承该适配器类，根据需要有选择地覆盖在适配器类中定义的方法。

缺省适配器类的典型代码片段如下：

```java
public abstract class AbstractServiceClass implements ServiceInterface {
    public void serviceMethod1() { } // 空方法
    public void serviceMethod2() { } // 空方法
    public void serviceMethod3() { } // 空方法
}
```

## 双向适配器

在对象适配器的使用过程中，如果在适配器中同时包含对目标类和适配者类的引用，适配者可以通过它调用目标类中的方法，目标类也可以通过它调用适配者类中方法，那么该适配器就是一个双向适配器，其结构如下图所示：

![image-20240718160155374](./image/image-20240718160155374.png '双向适配器结构示意图')

双向适配器的实现较为复杂，其典型代码如下：

```java
public class Adapter implements Target, Adaptee {
    // 同时维持对抽象目标类和适配者的引用
    private Target target;
    private Adaptee adaptee;
    
    public Adapter(Target target) {
        this.target = target;
    }
    
    public Adapter(Adaptee adaptee) {
        this.adaptee = adaptee;
    }
    
    public void request() {
        adaptee.specificRequest();
    }
    
    public void specificRequest() {
        target.request()
    }
}
```

## 适配器模式优点

1. 将目标类和适配者类解耦，通过引入一个适配器类来重用现有的适配者类，无需修改原有结构。
2. 增加了类的透明性和复用性，将具体的业务实现过程封装在适配者类中，对于客户端而言是透明的，而且提高了适配者的复用性，同一个适配者类可以在多个不同的系统中复用。
3. 灵活性和扩展性都非常好，通过配置文件可以很方便地更换适配器，也无需修改原有代码，完全符合开闭原则。

具体来说，对于类适配器还有以下优点：

1. 由于适配器是适配者类的字类，因此可以在适配器类中置换一些适配者的方法，使得适配器的灵活性更强。

对象适配器模式还有一下优点：

1. 一个对象适配器可以把多个不同的适配者适配到同一个目标；
2. 可以适配一个适配者的字类，由于适配器和适配者时间是管理关系，根据里氏代换原则，适配者的字类也可通过该适配器进行适配。

## 适配器模式缺点

1. 对于不支持多重继承的语言，一次最多只能适配一个适配者类，不能同时适配多个适配者。
2. 适配者类不能为最终类。
3. 在 Java、C# 等语言中，类适配器模式中的目标类只能为接口，不能为类，其使用具有一定的局限性。
4. 对象适配器与类适配器模式相比，要在适配器中置换适配者类的某些方法比较麻烦。

## 适配器模式适用环境

1. 系统需要使用一些现有的类，而这些类的接口（例如方法名）不符合系统的需要，甚至没有这些类的源代码。
2. 想创建一个可以重复使用的类，用于和一些彼此之间没有太大关联的类（包括一些可能在将来引进的类）一起工作。
