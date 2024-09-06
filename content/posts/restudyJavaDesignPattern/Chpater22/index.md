+++
title = '22-观察者模式'
date = 2024-08-30T14:07:03+08:00
lastmod = 2024-08-30T14:07:03+08:00
tags = ['java', '设计模式']
categories = ['Java设计模式']
draft = false

+++

## 观察者模式概述

观察者模式使使用频率较高的设计模式之一，它用于建立一种对象和对象之间的依赖关系，一个对象发生改变时将自动通知其他对象，其他对象将相应做出反应。在观察者模式中发生改变的对象称为观察目标，而被通知的对象称为观察者，一个观察目标可以对应多个观察者，而且这些观察者之间可以没有任何相互联系，可以根据需要增加和删除观察者，使得系统更易于扩展。

> **观察者模式**：定义对象之间的一种一对多的依赖关系，使得每当一个对象状态发生改变时其相关依赖对象皆得到通知并被自动更新。
>
> **Observer Pattern**: Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.

观察者模式的别名有发布-订阅（Publish-Subscribe）模式、模型-视图（Model-View）模式、源-监听器（Source-Listener）模式、从属者（Dependents）模式。观察者模式是一种对象行为型模式。

## 观察者模式结构

观察者模式结构中通常包括观察目标和观察者两个继承层次结构，其结构如图所示：

![image-20240830141604763](./image/image-20240830141604763.png '观察者模式结构图')

1. **Subject（目标）**：目标又称为主题，它是指被观察的对象。在目标中定义了一个观察者集合，一个观察目标可以接受任意数量的观察者来观察，它提供了一系列方法来增加和删除观察者对象，同时它定义了通知方法 notify()。目标类可以是接口，也可以是抽象类或具体类。
2. **ConcreteSubject（具体目标）**：具体目标是目标类的子类，它通常包含有经常发生改变的数据，当它的状态发生改变时将向它的各个观察者发出通知；同时它还实现了在目标类中定义的抽象业务逻辑方法（如果有）。如果无需扩展目标类，则具体目标类可以省略。
3. **Observer（观察者）**：观察者将对观察目标的改变做出反应，观察者一般定义为接口，该接口声明了更新数据的方法 update()，因此又称为抽象观察者。
4. **ConcreteObserver（具体观察者）**：在具体观察者中维护一个指向具体目标对象的引用，它存储具体观察者的有关状态，这些状态需要和具体目标的状态保持一致；它实现了在抽象观察者 Observer 中定义的 update() 方法。通常在实现时可以调用具体目标类的 attach() 方法将自己添加到目标的集合中或通过 detach() 方法将自己从目标类的集合中删除。

## 观察者模式实现

观察者模式描述了如何建立对象与对象之间的依赖关系，以及如何构造满足这种需求的系统。观察者模式包含观察目标和观察者两类对象，一个目标可以有任意数目的与之想依赖的观察者，一旦观察目标的状态发生改变，所有的观察者都将得到通知。作为对这个通知的响应，每个观察者都将监视观察目标的状态，以使其转台与目标状态同步，这种交互也称为发布-订阅。观察目标是通知的发布者，它发出通知时并不需要知道谁是它的观察者，可以有任意数目的观察者订阅它并接收通知。

首先定义一个抽象目标类 Subject，典型代码如下：

```java
public abstract class Subject {
    // 定义一个观察者集合用于存储所有观察者对象
    protected ArrayList observers<Observer> = new ArrayList();
    
    // 注册方法，用于向观察者集合中增加一个观察者
    public void attach(Observer observer) {
        observer.add(observer);
    }
    
    // 注销方法，用于从观察者集合中删除一个观察者
    public void detach(Observer observer) {
         observers.remove(observer);
    }
    
    // 声明抽象通知方法
    public abstract void notify();
}
```

具体目标类 ConcreteSubject 是实现了抽象目标类 Subject 的一个具体子类，其典型代码如下：

```java
public class ConcreteSubject extends Subject {
    // 实现通知方法
    public void notify() {
        // 遍历观察者集合，调用每一个观察者的响应方式
        for(Object obs:observers) {
            ((Observer)obs).update();
        }
    }
}
```

抽象观察者角色一般定义为一个接口，通常只声明一个 update() 方法，为不同观察者的更新（响应）行为定义相同的接口，这个方法在其子类中实现，不同的观察者具有不同的响应方法。抽象观察者 Observer 的典型代码如下：

```java
public interface Observer {
    // 声明响应方法
    public void update();
}
```

在具体观察者 ConcreteObserver 中实现了 update() 方法，其典型代码如下：

```java
public class ConcreteObserver implements Observer() {
    // 实现响应方法
    public void update() {
        // 具体响应代码
    }
}
```

如果在具体层之间具有关联关系，系统的扩展性将受到一定的影响，增加新的具体目标类有时候需要修改原有观察者的代码，在一定程度上违反了开闭原则，但是如果原有观察者类无需关联新增的具体目标，则系统扩展性不受影响。

## 观察者模式应用实例

### 实例说明

在某多人联机对战游戏中，多个玩家可以加入同一个战队组成联盟，当战队中的某一成员受到敌人攻击时将给所有其他盟友发送通知，盟友收到通知后将作出响应。

试使用观察者模式设计并实现该过程，已实现战队成员之间的联动。

### 实例分析

一个战队联盟成员在受到攻击时需要通知他的每一位盟友，每个联盟成员都需要持有其他所有盟友的信息，这将导致系统开销较大，因此可以引入一个新的角色--指挥部来负责维护和管理每个战队中所有成员的信息。当一个联盟成员受到攻击时将向对应的指挥部发送求助信息，指挥部逐一通知每个盟友，盟友再作出响应。

通过分析，本实例的结构图如图所示：

![image-20240830162924027](./image/image-20240830162924027.png '多人联机对战游戏结构图')

### 实例代码

1. AllyControlCenter：指挥部类，充当抽象目标类。

   ```java
   public abstract class AllyControlCenter {
       protected String allyName; // 战队名称
       protected ArrayList<Observer> players = new ArrayList<Observer>(); // 定义一个集合用于存储战队成员
   
       public String getAllyName() {
           return allyName;
       }
   
       public void setAllyName(String allyName) {
           this.allyName = allyName;
       }
   
       // 注册方法
       public void join(Observer obs) {
           System.out.println(obs.getName() + "加入" + this.allyName + "战队");
           players.add(obs);
       }
   
       // 注销方法
       public void quit(Observer obs) {
           System.out.println(obs.getName() + "退出" + this.allyName + "战队");
           players.remove(obs);
       }
   
       // 声明抽象通知方法
       public abstract void notifyObserver(String name);
   }
   ```

2. ConcreteAllyControlCenter：具体指挥部类，充当具体目标类。

   ```java
   public class ConcreteAllyControlCenter extends AllyControlCenter {
       public ConcreteAllyControlCenter(String allyName) {
           System.out.println(allyName + "战队组件成功！");
           System.out.println("-----------------------------");
           this.allyName = allyName;
       }
   
       // 实现通知方法
       @Override
       public void notifyObserver(String name) {
           System.out.println(this.allyName + "战队紧急通知，盟友" + name + "遭受敌人攻击！");
           // 遍历观察者集合，调用每一个盟友（自己除外）的支援方法
           for (Object obs : players) {
               if (!((Observer) obs).getName().equalsIgnoreCase(name)) {
                   ((Observer) obs).help();
               }
           }
       }
   }
   ```

   

3. Observer：抽象观察者类

   ```java
   public interface Observer {
       public String getName();
       public void setName(String name);
       public void help(); // 声明支援盟友方法
       public void beAttacked(AllyControlCenter acc);// 声明遭受攻击方法
   }
   ```

   

4. Player：战队成员类，充当具体观察者

   ```java
   public class Player implements Observer {
       private String name;
   
       public Player(String name) {
           this.name = name;
       }
   
       @Override
       public String getName() {
           return name;
       }
   
       @Override
       public void setName(String name) {
           this.name = name;
       }
   
       // 支援盟友方法的实现
       @Override
       public void help() {
           System.out.println("坚持住，" + this.name + "来救你！");
       }
   
       // 遭受攻击方法的实现，当遭受攻击时将调用战队控制中心类的通知方法 notifyObserver() 来通知盟友
       @Override
       public void beAttacked(AllyControlCenter acc) {
           System.out.println(this.name + "被攻击！");
           acc.notifyObserver(name);
       }
   }
   ```

   

5. Client：客户端测试类。

   ```java
   public class Client {
       public static void main(String[] args) {
           // 定义观察目标对象
           AllyControlCenter acc;
           acc = new ConcreteAllyControlCenter("金庸群侠");
   
           // 定义 4 个观察者对象
           Observer player1, player2, player3, player4;
   
           player1 = new Player("杨过");
           acc.join(player1);
   
           player2 = new Player("令狐冲");
           acc.join(player2);
   
           player3 = new Player("张无忌");
           acc.join(player3);
   
           player4 = new Player("段誉");
           acc.join(player4);
   
           // 某成员遭受攻击
           player1.beAttacked(acc);
       }
   }
   ```

### 结果及分析

输出结果如下：

```tex
金庸群侠战队组件成功！
-----------------------------
杨过加入金庸群侠战队
令狐冲加入金庸群侠战队
张无忌加入金庸群侠战队
段誉加入金庸群侠战队
杨过被攻击！
金庸群侠战队紧急通知，盟友杨过遭受敌人攻击！
坚持住，令狐冲来救你！
坚持住，张无忌来救你！
坚持住，段誉来救你！
```

本实例中实现了两次对象之间的联动，当一个游戏玩家 Player 对象的 beAttacked() 方法被调用时将调用指挥部 AllyControlCenter 的 notifyObserver() 方法进行处理，而在 notifyObserver() 方法中又将调用其他 Player 对象的 help() 方法。Player 的 beAttacked() 方法、AllyControlCenter 的 notifyObserver() 方法以及 Player 的 help() 方法构成了一个联动触发链，执行顺序如下：

Player.beAttacked() --> AllyControlCenter.notifyObserver() --> Player.help()

## JDK 对观察者模式的支持

观察者模式在 JAVA 语言中占据非常重要的地位。在 JDK 的 java.util 包中提供了 Observable 类以及 Observer 接口，它们构成了 JDK 对观察者模式的支持，如下图所示：

![image-20240904113139168](./image/image-20240904113139168.png 'JDK 提供的 Observable 类及 Observer 接口结构图')

### Observer 接口

在 java.util.Observer 接口中只声明一个方法，它充当抽象观察者，其方法声明代码如下：

``` java
void update(Observable o, Object arg);
```

当观察目标的状态发生变化时该方法将会被调用，在 Observer 的子类中将实现 update() 方法，即具体观察者可以根据需要具有不同的更新行为。当调用观察目标类 Observable 的 notifyObservers() 方法时将执行观察者类中的 update() 方法。

### Observable 类

java.util.Observable 类充当观察目标类，在 Observable 中定义了一个向量 Vector 来存储观察者对象，它包含的方法即说明见表：

| 方法名                                           | 方法描述                                                     |
| ------------------------------------------------ | ------------------------------------------------------------ |
| Observable()                                     | 构造方法，实例化 Vector 向量                                 |
| addObserver(Observer o)                          | 用于注册新的观察者对象到向量中                               |
| deleteObserver(Observer o)                       | 用于删除向量中的某一个观察者对象                             |
| notifyObservers() 和 notifyObservers(Object arg) | 通知方法，用于在方法内部循环调用向量中每一个观察者的 update() 方法 |
| deleteObservers()                                | 用于清空向量，即删除向量中所有的观察者对象                   |
| setChanged()                                     | 该方法被调用后会设置一个 boolean 类型的内部标记变量 changed 的值为 true，表示观察目标对象的状态发生了变化 |
| clearChanged()                                   | 用于将 changed 变量的值设为 false，表示对象状态不再发生改变或者已经通知了所有的观察者对象，调用了它们的 update() 方法 |
| hasChanged()                                     | 用于测试对象状态是否改变                                     |
| countObservers()                                 | 用于返回向量中观察者的数量                                   |

用户可以直接使用 Observer 接口和 Observable 类作为观察者模式的抽象层，再自定义具体观察者类和具体观察目标类。通过使用 JDK 中的 Observer 接口和 Observable 类可以更加方便地在 Java 语言中应用观察者模式。

## 观察者模式优点

1. 可以实现表示层和数据逻辑层的分离，定义了稳定的消息更新传递机制，并抽象了更新接口，使得可以有各种各样不同的表示层充当具体观察者角色。
2. 在观察目标和观察者之间建立一个抽象的耦合。观察目标只需要为维持一个抽象观察者的集合，无需了解其具体观察者。由于观察目标和观察者没有紧密的耦合在一起，因此它们可以属于不同的抽象化层次。
3. 支持广播通信，观察目标会像所有已注册的观察者对象发送通知，简化了一对多系统设计的难度。
4. 符合开闭原则，增加新的具体观察者无需修改原有系统代码，在具体观察者与观察目标之间不存在关联关系的情况下增加新的观察目标也很方便。

## 观察者模式缺点

1. 如果一个观察者目标对象有很多直接和间接观察者，将所有的观察者都通知到会花费很多时间。
2. 如果在观察者和观察目标之间存在循环依赖，观察目标会触发它们之间进行循环的调用，可能导致系统崩溃。
3. 观察者模式没有响应的机制让观察者知道所观察的目标对象是怎么发生拜年话的，而仅仅只是知道观察目标发生了变化。

## 观察者模式适用环境

1. 一个抽象模型有两个方面，其中一个方面依赖于另一个方面，将这两个方面封装在独立的对象中使它们可以各自独立地改变和复用。
2. 一个对象的改变将导致一个或多个其他对象也发生改变，而并不知道具体有多少对象将发生改变，也不知道这些对象是谁。
3. 需要再系统中创建一个触发链，A 对象的行为将影响 B 对象，B 对象的行为将影响 C 对象...，可以使用观察者模式创建一种链式触发机制。
