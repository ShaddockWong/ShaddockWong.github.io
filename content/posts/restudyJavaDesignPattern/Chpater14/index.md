+++
title = '14-享元模式'
date = 2024-07-31T11:32:20+08:00
lastmod = 2024-07-31T11:32:20+08:00
tags = ['java', '设计模式']
categories = ['Java设计模式']
draft = false

+++

## 享元模式概述

如果一个软件系在运行时创建的相同或相似对象数量太多，将导致运行代价过高，带来系统资源浪费、性能下降等问题。享元模式通过共享技术实现相同或相似对象的重用，在逻辑上每一个出现的字符都有一个对象与之对应，然而在物理上它们却共享同一个享元对象，这个对象可以出现在一个字符串的不同地方，相同的字符对象都指向同一个实例，在享元模式中存储这些共享实例对象的地方称为享元池（Flyweight Pool）。可以针对每一个不同的字符创建一个享元对象，将其放在享元池中，当需要时再从享元池取出。

![image-20240731114741358](./image/image-20240731114741358.png '字符享元对象示意图')

享元模式以共享的方式高效地支持大量细粒度对象的重用，享元对象能做到共享的关键是区分了内部状态（Intrinsic State）和外部状态（Extrinsic State）。下面将对享元的内部状态和外部状态进行简单的介绍。

1. 内部状态是存储在享元对象内部并且不会随环境改变而改变的状态，内部状态可以共享。
2. 外部状态是随环境改变而改变的、不可以共享的状态。享元对象的外部状态通常由客户端保存，并在享元对象被创建之后需要使用的时候再传入到享元对象内部。外部状态之间是相互独立的。

正因为区分了内部状态和外部状态，可以将具有相同内部状态的对象存储在享元池中，享元池中的对象是可以实现共享的，当需要的时候就将对象从享元池中取出，实现对象的复用。通常向取出的对象注入不同的外部状态可以得到一系列相似的对象，而这些对象在内存中实际上只存储一份。

> **享元模式**：运用共享技术有效地支持大量细粒度对象的复用。
>
> **Flyweight Pattern**: Use sharing to support large numbers of fine-grained objects efficiently.

享元模式要求能够被共享的对象必须是细粒度对象，它又称为轻量级模式，享元模式是一种对象结构型模式。

## 享元模式结构

享元模式的结构较为复杂，通常结合工厂模式一起使用，在它的结构图中包含了一个享元工厂类，其结构如图所示：

![image-20240731134828649](./image/image-20240731134828649.png '享元模式结构图')

享元模式包含以下 4 个角色：

1. **Flyweight（抽象享元类）**：抽象享元类通常是一个接口或抽象类，在抽象享元类中声明了具体享元类公共的方法，这些方法可以想外界提供享元对象的内部数据（内部状态），同时也可以通过这些方法来设置外部数据（外部状态）。
2. **ConcreteFlyweight（具体享元类）**：具体享元类实现了抽象享元类，其实例称为享元对象；在具体享元类中为内部状态提供了存储空间。通常可以结合单例模式来设计具体享元类，为每一个具体享元类提供唯一的享元对象。
3. **UnsharedConcreteFlyweight（非共享具体享元类）**：并不是所有的抽象享元类的子类都需要被共享，不能被共享的子类可设计为非共享具体享元类；当需要一个非共享具体享元类的对象时可以直接通过实例化创建。
4. **FlyweightFactory（享元工厂类）**：享元工厂类用于创建并管理享元对象，它针对抽象享元类编程，将各种类型的具体享元对象存储在一个享元池中，享元池一般设计为一个存储“键值对”的集合（也可以是其他类型的集合），可以结合工厂模式进行设计；当用户请求一个具体享元对象时，享元工厂提供一个存储在享元池中已创建的实例或者创建一个新的实例（如果不存在），返回新创建的实例并将其存储在享元池中。

## 享元模式实现

享元类 Flyweight 的设计是享元模式的要点之一，为了提高系统的可扩展性，通常会定义一个抽象享元类作为所有具体享元类的公共父类，典型的抽象享元类代码如下：

```java
public abstract class Flyweight {
    public abstract void operation(String extrinsicState);
}
```

在具体享元类 ConcreteFlyweight 中要将内部状态和外部状态分开处理，通常将内部状态作为具体享元类的成员变量，而外部状态通过注入的方式添加到具体享元类中。典型的具体享元类代码如下：

```java
public class ConcreteFlyweight extends Flyweight {
    // 内部状态 intrinsicState 作为成员变量，同一个享元对象的内部状态是一致的
    private String intrinsicState;
    
    public ConcreteFlyweight(String intrinsicState) {
        this.intrinsicState = intrinsicState;
    }
    
    // 外部状态 extrinsicState 在使用时由外部设置，不保存在享元对象中，即使是同一个对象，
    // 在每一次调用时可以传入不同的外部状态
    public void operations(String extrinsicState) {
        // 实现业务方法
    }
}
```

除了可以共享的具体享元类以外，在使用享元模式时有时候还需要处理那些不需要共享的抽象享元类 Flyweight 的子类，这些子类被定义为非共享具体享元类 UnsharedConcreteFlyweight，其典型代码如下：

```java
public class UnsharedConcreteFlyweight extends Flyweight {
    public void operation(String extrinsicState) {
        // 实现业务方法
    }
}
```

在享元模式中引入了享元工厂类 FlyweightFactory，享元工厂类的作用是提供一个用于存储享元对象的享元池，当用户需要对象时首先从享元池中获取，如果享元池中不存在，则创建一个新的享元对象返回给用户，并在享元池中保存该新增对象。典型的享元工厂类的代码如下：

```java
public class FlyweightFactory {
    // 定义一个 HashMap 用于存储享元对象，实现享元池
    private HashMap flyweight = new HashMap();
    
    public Flyweight getFlyweight(String key) {
        // 如果对象存在，则直接从享元池获取
        if(flyweight.containsKey(key)) {
            return (Flyweight)flyweight.get(key);
        }
        // 如果对象不存在，现创建一个新的对象添加到享元池中，然后返回
        else {
            Flyweight fw = new ConcreteFlyweight();
        }
    }
}
```

## 享元模式应用实例

### 案例说明

某软件公司要开发一个围棋软件。该公司的开发人员通过对周围围棋软件进行分析发现，在围棋棋盘中包含大量的黑子和白子，它们的形状、大小一模一样，只是出现的位置不同而已。如果将每一个棋子作为一个独立的对象存储在内存中，将导致该围棋软件在运行时所需的内存空间较大，那么如何降低运行代价、提高系统性能是需要解决的一个问题。

为了解决该问题，现使用享元模式来设计该围棋软件的棋子对象。

![image-20240731150936603](./image/image-20240731150936603.png '围棋棋子结构图')

IgoChessman 充当抽象享元类，BlackIgoChessman 和 WhiteIgoChessman 充当具体享元类，IgoChessmanFactory 充当享元工厂类。

### 实例代码

1. IgoChessman：围棋棋子类，充当抽象享元类。

   ```java
   public abstract class IgoChessman {
       public abstract String getColor();
   
       public void display() {
           System.out.println("棋子颜色：" + this.getColor());
       }
   }
   ```

   

2. BlackIgoChessman：黑色棋子类，充当具体享元类。

   ```java
   public class BlackIgoChessman extends IgoChessman{
       @Override
       public String getColor() {
           return "黑色";
       }
   }
   ```

   

3. WhiteIgoChessman：白色棋子类，充当具体享元类。

   ```java
   public class WhiteIgoChessman extends IgoChessman {
       @Override
       public String getColor() {
           return "白色";
       }
   }
   ```

   

4. IgoChessmanFactory：围棋棋子工厂类，充当享元工厂类，使用单例模式对其进行设计。

   ```java
   public class IgoChessmanFactory {
       private static IgoChessmanFactory instance = new IgoChessmanFactory();
       private static Hashtable ht; // 使用 Hashtable 来存储享元对象，充当享元池
   
       private IgoChessmanFactory() {
           ht = new Hashtable();
           IgoChessman black, white;
           black = new BlackIgoChessman();
           ht.put("b", black);
           white = new WhiteIgoChessman();
           ht.put("w", white);
       }
   
       // 返回享元工厂类的唯一实例
       public static IgoChessmanFactory getInstance() {
           return instance;
       }
   
       // 通过 key 获取存储在 Hashtable 中的享元对象
       public static IgoChessman getIgoChessman(String color) {
           return (IgoChessman) ht.get(color);
       }
   }
   ```

5. Client：客户端测试类

   ```java
   public class Client {
       public static void main(String[] args) {
           IgoChessman black1, black2, black3, white1, white2;
           IgoChessmanFactory factory;
   
           // 获取享元工厂对象
           factory = IgoChessmanFactory.getInstance();
   
           // 通过享元工厂获取 3 颗黑子
           black1 = factory.getIgoChessman("b");
           black2 = factory.getIgoChessman("b");
           black3 = factory.getIgoChessman("b");
           System.out.println("判断两颗黑子是否相同：" + (black1 == black2));
   
           // 通过享元工厂获取 2 颗白子
           white1 = factory.getIgoChessman("w");
           white2 = factory.getIgoChessman("w");
           System.out.println("判断两颗白子是否相同：" + (white1 == white2));
   
           // 显示棋子
           black1.display();
           black2.display();
           black3.display();
           white1.display();
           white2.display();
       }
   }
   ```

### 结果及分析

输出结果如下：

```java
判断两颗黑子是否相同：true
判断两颗白子是否相同：true
棋子颜色：黑色
棋子颜色：黑色
棋子颜色：黑色
棋子颜色：白色
棋子颜色：白色
```

虽然在客户端代码中获取了 3 个黑子对象和两个白子对象，但是它们的内存地址相同，也就是说它们实际上是同一个对象。

## 有外部状态的享元模式

虽然黑色棋子和白色棋子可以共享，但是它们将显示在棋盘的不同位置，如何让相同的黑子或者白子能够多次重复显示且位于一个棋盘的不同地方？解决方案之一就是将棋子的位置定义为棋子的一个外部状态，在需要时再进行设置。

![image-20240731155908108](./image/image-20240731155908108.png '引入外部状态之后的围棋棋子结构图')

可以在上面的结构中新增加一个 Coordinates（坐标类），在抽象享元类 IgoChessman 中的 display() 方法也对应增加一个 Coordinates 类型的参数，用于在显示棋子时指定其坐标。

Coordinates 类的代码如下：

```java
public class Coordinates {
    private int x;
    private int y;

    public Coordinates(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }
}
```

修改之后的 IgoChessman 类代码如下：

```java
public abstract class IgoChessman {
    public abstract String getColor();

    public void display(Coordinates coord) {
        System.out.println("棋子颜色：" + this.getColor() + "，棋子位置：" + coord.getX() + "," + coord.getY());
    }
}
```

将客户端测试代码修改如下：

```java
public class Client {
    public static void main(String[] args) {
        IgoChessman black1, black2, black3, white1, white2;
        IgoChessmanFactory factory;

        // 获取享元工厂对象
        factory = IgoChessmanFactory.getInstance();

        // 通过享元工厂获取 3 颗黑子
        black1 = factory.getIgoChessman("b");
        black2 = factory.getIgoChessman("b");
        black3 = factory.getIgoChessman("b");
        System.out.println("判断两颗黑子是否相同：" + (black1 == black2));

        // 通过享元工厂获取 2 颗白子
        white1 = factory.getIgoChessman("w");
        white2 = factory.getIgoChessman("w");
        System.out.println("判断两颗白子是否相同：" + (white1 == white2));

        // 显示棋子,同时设置棋子的坐标位置
        black1.display(new Coordinates(1, 2));
        black2.display(new Coordinates(3, 4));
        black3.display(new Coordinates(1, 3));
        white1.display(new Coordinates(2, 5));
        white2.display(new Coordinates(2, 4));
    }
}
```

运行输出结果如下：

```tex
判断两颗黑子是否相同：true
判断两颗白子是否相同：true
棋子颜色：黑色，棋子位置：1,2
棋子颜色：黑色，棋子位置：3,4
棋子颜色：黑色，棋子位置：1,3
棋子颜色：白色，棋子位置：2,5
棋子颜色：白色，棋子位置：2,4
```

在每次调用 display() 方法时都设置了不同的外部状态 -- 坐标值，因此相同的棋子对象虽然有相同的颜色，但是它们的坐标值不同，将显示在棋盘的不同位置。

## 单纯享元模式和复合享元模式

### 单纯享元模式

在单纯享元模式汇总所有的具体享元类都是可以共享的，不存在非共享具体享元类。单纯享元模式结构如图所示：

![image-20240731164514182](./image/image-20240731164514182.png '单纯享元模式结构图')

### 复合享元模式

将一些单纯享元对象使用组合模式加以组合还可以形成符合享元对象，这样的复合享元对象本身不能共享，但是它们可以分解成单纯享元对象，而后者可以共享。复合享元模式的结构图如图所示：

![image-20240731164928117](./image/image-20240731164928117.png '复合享元模式结构图')

通过使用复合享元模式可以让符合享元类 CompositeConcreteFlyweight 中所包含的每个单纯享元类 ConcreteFlyweight 都具有相同的外部状态，而这些单纯享元的内部状态往往可以不同。

## 享元模式和 String 类

JDK 类库中的 String 类使用了享元模式，在修改享元对象时先将原有对象复制一份，然后在新对象上实时修改操作的机制称为 “Copy On Write”。

## 享元模式优点

1. 享元模式可以减少内存中对象的数量，使得相同或者相似对象在内存中只保存了一份，从而可以节约系统资源，提高系统性能。
2. 享元模式的外部状态相对独立，而且不会影响其内部状态，从而使享元对象可以在不同的环境中被共存。

## 享元模式缺点

1. 享元模式使系统变得复杂，需要分离出内部状态和外部状态，这使得程序的逻辑复杂化。
2. 为了使对象可以共存，享元模式需要将享元对象的部分状态外部化，而读取外部状态将使运行时间变长。

## 享元模式适用环境

1. 一个系统有大量相同或相似的对象，造成内存的大量耗费。
2. 对象的大部分状态都可以外部化，可以将这些外部状态传入对象中。
3. 在使用享元模式时需要维护一个存储享元对象的享元池，而这需要耗费一定的系统资源，因此应当在需要多次重复使用享元对象时才使用享元模式。
