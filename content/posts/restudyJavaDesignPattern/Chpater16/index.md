+++
title = '16-职责链模式'
date = 2024-08-09T10:59:19+08:00
lastmod = 2024-08-09T10:59:19+08:00
tags = ['java', '设计模式']
categories = ['Java设计模式']
draft = false

+++

## 行为型模式

行为型模式（Behavioral Pattern）关注系统中对象之间的交互，研究系统在运行时对象之间的相互通信与协作，进一步明确对象的职责。

行为型模式分为类行为型模式和对象行为型模式两种，其中类行为型模式使用继承关系在几个类之间分配行为，主要通过多态等方式来分配父类与子类的职责；而对象行为型模式则使用对象的关联关系来分配行为，主要通过对象关联等方式来分配两个或多个类的职责。根据合成复用原则，在系统中复用功能时要尽量使用关联关系来取代继承关系，因此大部分行为型设计模式都属于对象行为型设计模式。

## 职责链模式概述

> **职责链模式：**避免将一个请求的发送者与接收者耦合在一起，让多个对象都有机会处理请求。将接受请求的对象连接成一条链，并且沿着这条链传递请求，直到有一个对象能够处理它为止。
>
> **Chain of Responsibility Pattern**: Avoid coupling the sender of a request to its receiver by giving more than one object a chance to handle the request. Chain the receiving objects and pass the request along the chain until an object handles it.

职责链模式又称为责任链模式，它是一种对象行为型模式。

## 职责链模式结构

职责链模式结构的核心在于引入了一个抽象处理者，其结构如下图所示：

![image-20240809112109405](./image/image-20240809112109405.png '职责链模式结构图')

包含以下两个角色：

1. **Handler（抽象处理者）**：它定义了一个处理请求的接口，一般设计为抽象类，由于不同的具体处理者处理请求的方式不同，因此在其中定义了抽象请求处理方法。每一个处理者的下家还是一个处理者，故在抽象处理者中定义了一个抽象处理者类型的对象（如图中的 successor）作为其下家的引用，通过该引用处理者可以连成一条链。
2. **ConcreteHandler（具体处理者）**：它是抽象处理者的子类，可以处理用户请求，在具体处理者类中实现了抽象处理者的抽象请求处理方法，在处理请求之前需要进行判断，看是否有相应的处理权限，如果可以处理请求就处理它，否则将请求转发给后继者；在具体处理者中可以访问链中的下一个对象，以便请求的转发。

## 职责链模式实现

在职责链模式中很多对象由每一个对象对其下家的引用连接起来形成一条链。请求在这个链上传递，直到链上的某一个对象决定处理此请求。发出这个请求的客户端并不直到链上的哪一个对象最终处理这个请求，这使得系统可以在不影响客户端的情况下动态地重新组织链和分配责任。

职责链模式的核心在于抽象处理者的设计，抽象处理者的典型代码如下：

```java
public abstract class Handler {
    // 维持对下家的引用
    protected Handler successor;
    
    public void setSuccessor(Handler successor) {
        this.successor = successor;
    }
    
    public abstract void handleRequest(String request);
}
```

抽象处理者类定义了对下家的引用对象，以便将请求转发给下家，该对象的访问符可设为 protected，在其子类中可以使用。

具体处理者是抽象处理者的子类，它有两个作用：一是处理请求，不同的具体处理者以不同的形式实现抽象请求处理方法 handleRequest()；二是转发请求，如果该请求超出了当前处理者类的权限，可以将该请求转发给下家。具体处理者类的典型代码如下：

```java
public class ConcreteHandler extends Handler {
    public void handleRequest(String request) {
        if(请求满足条件){
            // 处理请求
        } else {
            this.successor.handleRequest(request); // 转发请求
        }
    }
}
```

在具体处理类中通过对请求进行判断可以做出相应的处理。

需要注意的是，职责链模式并不负责创建职责链，职责链的创建工作必须由系统的其他部分来完成，一般是在使用该职责链的客户端中创建职责链。职责链模式降低了请求的发送端和接收端之间的耦合，使多个对象都有机会处理这个请求。典型的客户端代码片段如下：

```java
...
Handler handler1, handler2, handler3;
handler1 = new ConcreteHandlerA();
handler2 = new ConcreteHandlerB();
handler3 = new ConcreteHandlerC();
// 创建职责链
handler1.setSuccessor(handler2);
handler2.setSuccessor(handler3);
// 发送请求，请求对象通常为自定义类型
handler1.handleRequest("请求对象");
...
```

## 职责链模式应用实例

### 实例说明

某企业的 SCM（Supply Chain Management，供应链管理）系统中包含一个采购审批子系统。该企业的采购审批是分级进行的，即根据采购金额的不同由不同层次的主管人员来审批，主任可以审批5万元以下（不包括5万元）的采购单，副董事长可以审批5万元至10万元（不包括10万元）的采购单，董事长可以审批10万元至50万元（不包括50万元）的采购单，50万元以上的采购单则需要开董事会讨论决定，如下图所示：

![image-20240809140905061](./image/image-20240809140905061.png '采购分级审批示意图')

现使用职责链模式设计实现该系统。

### 实例类图

![image-20240809141646267](./image/image-20240809141646267.png '采购单分级审批结构图')

抽象类 Approver 充当抽象处理者（抽象传递者），Director、VicePresident、President 和 Congress 充当具体处理者（具体传递者），PurchaseRequest 充当请求类。

### 实例代码

1. PurchaseRequest：采购单类，充当请求类。

   ```java
   public class PurchaseRequest {
       private double amount;  // 采购金额
       private int number;     // 采购单编号
       private String purpose; // 采购目的
   
       public PurchaseRequest(double amount, int number, String purpose) {
           this.amount = amount;
           this.number = number;
           this.purpose = purpose;
       }
   
       public double getAmount() {
           return amount;
       }
   
       public void setAmount(double amount) {
           this.amount = amount;
       }
   
       public int getNumber() {
           return number;
       }
   
       public void setNumber(int number) {
           this.number = number;
       }
   
       public String getPurpose() {
           return purpose;
       }
   
       public void setPurpose(String purpose) {
           this.purpose = purpose;
       }
   }
   ```

   

2. Approver：审批者类，充当抽象处理者。

   ```java
   public abstract class Approver {
       protected Approver successor; // 定义后继对象
       protected String name;        // 审批者姓名
   
       public Approver(String name) {
           this.name = name;
       }
   
       // 设置后继者
       public void setSuccessor(Approver successor) {
           this.successor = successor;
       }
   
       // 抽象请求处理方法
       public abstract void processRequest(PurchaseRequest request);
   }
   ```

   

3. Director：主任类，充当具体处理者。

   ```java
   public class Director extends Approver {
       public Director(String name) {
           super(name);
       }
   
       // 具体请求处理方法
       @Override
       public void processRequest(PurchaseRequest request) {
           if (request.getAmount() < 50000) {
               System.out.println("主任" + this.name + "审批采购单：" + request.getNumber() + "，金额：" + request.getAmount()
                       + "元，采购目的：" + request.getPurpose() + "."); // 处理请求
           } else {
               this.successor.processRequest(request); // 转发请求
           }
       }
   }
   ```

4. VicePresident：副董事长类，充当具体处理者。

   ```java
   public class VicePresident extends Approver {
       public VicePresident(String name) {
           super(name);
       }
   
       // 具体请求处理方法
       @Override
       public void processRequest(PurchaseRequest request) {
           if (request.getAmount() < 100000) {
               System.out.println("副董事长" + this.name + "审批采购单：" + request.getNumber() + "，金额：" + request.getAmount()
                       + "元，采购目的：" + request.getPurpose() + "。"); // 处理请求
           } else {
               this.successor.processRequest(request); // 转发请求
           }
       }
   }
   ```

5. President：董事长类，充当具体处理者。

   ```java
   public class President extends Approver{
       public President(String name) {
           super(name);
       }
   
       // 具体请求处理方法
       @Override
       public void processRequest(PurchaseRequest request) {
           if (request.getAmount() < 500000) {
               System.out.println("董事长" + this.name + "审批采购单：" + request.getNumber() + "，金额：" + request.getAmount()
                       + "元，采购目的：" + request.getPurpose() + "。"); // 处理请求
           } else {
               this.successor.processRequest(request); // 转发请求
           }
       }
   }
   ```

6. Congress：董事会类，充当具体处理者。

   ```java
   public class Congress extends Approver {
       public Congress(String name) {
           super(name);
       }
   
       // 具体请求处理方法
       @Override
       public void processRequest(PurchaseRequest request) {
           System.out.println("召开董事会审批采购单：" + request.getNumber() + "，金额：" + request.getAmount()
                   + "元，采购目的：" + request.getPurpose() + "。"); // 处理请求
       }
   }
   ```

7. Client：客户端测试类。

   ```java
   public class Client {
       public static void main(String[] args) {
           Approver wjzhang, gyang, jguo, meeting;
           wjzhang = new Director("张无忌");
           gyang = new VicePresident("杨过");
           jguo = new President("郭靖");
           meeting = new Congress("董事会");
   
           // 创建职责链
           wjzhang.setSuccessor(gyang);
           gyang.setSuccessor(jguo);
           jguo.setSuccessor(meeting);
   
           // 创建采购单
           PurchaseRequest pr1 = new PurchaseRequest(45000, 10001, "购买倚天剑");
           wjzhang.processRequest(pr1);
   
           PurchaseRequest pr2 = new PurchaseRequest(60000, 10002, "购买《葵花宝典》");
           wjzhang.processRequest(pr2);
   
           PurchaseRequest pr3 = new PurchaseRequest(160000, 10003, "购买《金刚经》");
           wjzhang.processRequest(pr3);
   
           PurchaseRequest pr4 = new PurchaseRequest(800000, 10003, "购买桃花岛");
           wjzhang.processRequest(pr4);
       }
   }
   ```

### 结果及分析

```tex
主任张无忌审批采购单：10001，金额：45000.0元，采购目的：购买倚天剑。
副董事长杨过审批采购单：10002，金额：60000.0元，采购目的：购买《葵花宝典》。
董事长郭靖审批采购单：10003，金额：160000.0元，采购目的：购买《金刚经》。
召开董事会审批采购单：10003，金额：800000.0元，采购目的：购买桃花岛。
```

如果需要增加一个新的具体处理者，由于链的创建过程由客户端负责，因此增加新的具体处理者类对原有类库无任何影响，无须修改已有类的源代码，符合开闭原则。

在客户端代码中，如果要将新的具体请求处理者应用在系统中，需要创建新的具体处理者对象，然后将该对象加入职责链中。

例如：

```java
Approver new = new Manager("黄蓉");

wjzhang.setSuccessor(rhuang); // 将黄蓉作为张无忌的下家
rhuang.setSuccessor(gyang);   // 将杨过作为黄蓉的下家
```

## 纯与不纯的职责链模式

### 纯的职责链模式

一个纯的职责链模式要求一个具体处理者对象只能在两个行为中选择一个，要么承担全部责任，要么将责任推给下家，不允许出现某一个具体处理者对象在承担了一部分或全部责任后又将责任向下传递的情况。而且纯的职责链模式中要求一个请求必须被某一个处理者对象所接收，不能出现某个请求未被任何一个处理者对象处理的情况。上节的例子就是纯的职责链模式。

### 不纯的职责链模式

在一个不纯的职责链模式中允许某个请求被一个具体处理者部分处理后再向下传递，或者一个具体处理者处理完某请求后其后继处理者可以继续处理该请求，而且一个请求可以最终不被任何处理者对象所接收并处理。

Java AWT 1.0 中的事件处理模型应用的是不纯的职责链模式。原理如下：由于窗口组件（如按钮、文本框等）一般位于容器组件中，因此当事件发生在某一个组件上时先通过组件对象的 handleEvent() 方法将事件传递给相应的事件处理方法，该事件处理方法将处理此事件，然后决定是否将该事件向上一级容器组件传播；上级容器组件在接到事件之后可以继续处理此事件并决定是否继续向上级容器组件传播，如此反复，直到事件到达顶层容器组件为止；如果一直传到最顶层容器仍没有处理方法，则该事件不予处理。早起 Java AWT 事件模型中的这种事件处理机制又叫事件浮升（Event Bubblling）机制。从 Java 1.1 以后，JDK 使用观察者模式代替职责链模式来处理事件。

## 职责链模式优点

1. 职责链模式使得一个对象无须直到是其他哪一个对象处理其请求，对象仅需知道该请求会被处理即可，接收者和发送者都没有对方的明确信息，并且链中的对象不需要直到链的结构，由客户端负责链的创建，降低了系统的耦合度。
2. 请求处理对象仅需维持一个指向其后继者的引用，而不需要维持它对所有的候选处理者的引用，可简化对象之间的相互连接。
3. 再给对象分派职责时，职责链可以带来更多的灵活性，可以通过在运行时对该链进行动态的增加或修改来增加或改变处理一个请求的职责。
4. 在系统中增加一个新的具体请求处理者无须修改原有系统的代码，只需要在客户端重新建链即可，从这一点看是符合开闭原则的。

## 职责链模式缺点

1. 由于一个请求没有明确的接收者，那么就不能保证它一定会被处理，该请求可能一直到链的末端都得不到处理；一个请求也可能因职责链没有被正确配置而得不到处理。
2. 对于比较长的职责链，请求的处理可能涉及多个处理独享，系统性能将收到一定的影响，而且在进行代码调试时不太方便。
3. 如果建链不当，可能会造成循环调用，将导致系统陷入死循环。

## 职责链模式适用环境

1. 有多个对象可以处理同一个请求，具体哪些对象处理请求待运行时再确定，客户端只需将请求提交到链上，而无须关心请求的处理对象是谁以及它是如何处理的。
2. 在不明确指定接收者的情况下向多个对象中的一个提交一个请求。
3. 可动态指定一组对象处理请求，客户端可以动态创建职责链来处理请求，还可以改变链中处理者之间的先后次序。
