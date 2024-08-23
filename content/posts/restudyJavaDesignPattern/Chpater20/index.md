+++
title = '20-中介者模式'
date = 2024-08-22T16:14:46+08:00
lastmod = 2024-08-22T16:14:46+08:00
tags = ['java', '设计模式']
categories = ['Java设计模式']
draft = false

+++

## 中介者模式概述

在软件系统中，某些类/对象之间的相互调用关系错综负责，类似 QQ 用户何子健的关系，此时特别需要一个类似 QQ群 的中间类来协调这些类/对象之间的复杂关系，以降低系统的耦合度。中介者模式为此而诞生，它通过在系统中增加中介者对象来降低原有类/对象之间的复杂引用关系。

如果在一个系统中对象之间的联系呈现为网状结构，如图所示，对象之间存在大量的多对多联系，将导致系统非常复杂，这些对象即会影响其他对象，也会被其他对象所影响，这些对象被称为同事对象，它们之间通过彼此的相互引用实现系统的行为。在网状结构中，几乎每个对象都需要与其他对象发生相互作用，而这种相互作用表现为一个对象与另外一个对象的直接耦合，这将导致一个过渡耦合的系统。

![image-20240822162128127](./image/image-20240822162128127.png '对象之间存在复杂关系的网状结构')

中介者模式可以使对象之间的关系数量急剧减少，通过引入中介者对象，可以将系统的网状结构变成以中介者为中心的星型结构，如下图所示。在这个星型结构中，同事对象不再直接与另一个对象联系，它通过中介者对象与另一个对象发生相互作用。中介者对象的存在在保证了对象结构上的稳定，也就是说，系统的结构不会因为新对象的引入带来大量的修改工作。

![image-20240822162357764](./image/image-20240822162357764.png '引入中介者对象的星型结构')

> **中介者模式**：定义一个对象来封装一系列对象的交互。中介者模式使各个对象之间不需要显示地相互引用，从而使其耦合松散，而且用户可以独立地改变它们之间的交互。
>
> **Mediator Pattern**: Define an object that encapsulates how a set of objects interact. Mediator promotes loose coupling by keeping objects from referring to each other explicitly, and it lets you vary their interaction independently.

中介者模式又称为调停者模式，它是一种对象行为性模式。在中介者模式中，通过引入中介者来简化对象之间的复杂交互，中介者模式使迪米特法则的一个典型应用。

## 中介者模式结构

在中介者模式中引入了用于协调其他对象/类之间相互调用的中介者类，为了让系统具有更好的灵活性和可扩展性，通常还提供了抽象中介者，其结构如下图所示：

![image-20240822163251185](./image/image-20240822163251185.png '中介者模式结构图')

1. **Mediator（抽象中介者）**：它定义一个接口，该接口用于与各同事对象之间进行通信。
2. **ConcreteMediator（具体中介者）**：它是抽象中介者的子类，通过协调各个同事对象来实现协作行为，它维持了对各个同事对象的引用。
3. **Colleague（抽象同事类）**：它定义了各个同事类公有的方法，并声明了一些抽象方法供子类实现，同时它维持了一个对抽象中介者类的引用，其子类可以通过该引用于中介者通信。
4. **ConcreteColleague（具体同事类）**：它是抽象同事类的子类，每一个同事对象在需要和其他同事对象通信时先与中介者通信，通过中介者间接完成与其他同事类的通信；在具体同事类中实现了在抽象同事类中声明的抽象方法。

## 中介者模式实现

中介者模式的核心在于中介者类的引入，在中介者模式中，中介者类承担了两个方面的职责：

1. 中转作用（结构性）：通过中介者提供的中转作用，各个同事对象不再需要显式地引用其他同事，当需要和其他同事进行通信时可通过中介者实现间接调用。该中转作用属于中介者在结构上的支持。
2. 协调作用（行为性）：中介者可以更进一步地对同事之间的关系进行封装，同事可以一致地和中介者进行交互，而不需要指明中介者需要具体怎么做，中介者根据封装在自身内部的协调逻辑对同事的请求进行进一步处理，将同事成员之间的关系进行分离和封装。该协调作用属于中介者在行为上的支持。

典型的抽象中介者代码如下：

```java
public abstract class Mediator {
    protected ArrayList<Colleague> colleagues = new ArrayList<Colleague>();  // 用于存储同事对象
    
    // 注册方法，用于增加同事对象
    public void register(Colleague colleague) {
        colleagues.add(colleague);
    }
    
    // 声明抽象的业务方法
    public abstract void operation();
}
```

在抽象中介者中可以定义一个同事类的集合，用于存储同事对象并提供注册方法，同时声明了具体中介者类所具有的方法。在具体中介者类中将实现这些抽象方法，典型的具体中介者类代码如下：

```java
public class ConcreteMediator extends Mediator {
    // 实现业务方法，封装同事之间的调用
    public void operation() {
        ...
        ((Colleague)(Colleagues.get(0))).method1(); // 通过中介者调用同事类的方法
        ...
    }
}
```

在具体中介者类中将调用同事类的方法，在调用时可以增加以一些自己的业务代码对调用进行控制。

在抽象同事类中维持了一个抽象中介者的引用，用于调用中介者的方法。典型的好凑想同事类代码如下：

```java
public abstract class Colleague {
    protected Mediator mediator;  // 维持一个抽象中介者的引用
    
    public Colleague(Mediator mediator) {
        this.mediator = mediator;
    }
    
    public abstract void method1(); // 声明自身方法，处理自己的行为
    
    // 定义依赖方法，与中介者进行通信
    public void method2() {
        mediator.operation();
    }
}
```

在抽象同事类中声明了同事类的抽象方法，而在具体同事类中将实现这些方法。典型的具体同事类代码如下：

```java
public class ConcreteColleague extends Colleague {
    public ConcreteColleague(Mediator mediator) {
        super(mediator);
    }
    
    // 实现自身方法
    public void method1() {
        ...
    }
}
```

在具体同事类 ConcreteColleague 中实现了在抽象同事类中声明的方法，其中方法 method1() 是同事类的自身方法（Self-Method），用于处理自己的行为；而方法 method2() 是依赖方法（Depend-Method），用于调用在中介者中定义的方法，依赖中介者来完成相应的行为，例如调用另一个同事类的相关方法。

## 中介者模式应用实例

### 实例说明

某软件公司要开发一套 CRM 系统，其中包含一个客户信息管理模块，所设计的“客户信息管理窗口”界面效果图如图所示。

![image-20240823103526991](./image/image-20240823103526991.png '“客户信息管理窗口”界面效果图')

通过分析发现，在图中界面组件之间存在较为复杂的交互关系：如果删除一个客户，则将从客户列表（List）中删掉对应的项，客户选择组合框（ComboBox）中的客户名称也将减少一个；如果增加一个客户信息，则客户列表中将增加一个客户，并且组合框中也将增加一项。

为了更好地处理界面组件之间的交互，现使用中介者模式设计该系统。

### 实例分析及类图

为了协调界面组件对象之间的复杂交互关系，可以引入一个中介者类，其结构如下图

![image-20240823104955758](./image/image-20240823104955758.png '引入了中介者类的"客户信息管理窗口"结构示意图')

上图只是一个结构示意图，在具体实现时为了确保系统具有更好的灵活性和可扩展性，需要定义抽象中介者和抽象组件类，其中抽象组件类是所有具体组件类的公共父类，完整类图如下图所示：

![image-20240823105548231](./image/image-20240823105548231.png '“客户信息管理窗口”结构图')

### 实例代码

1. Mediator：抽象中介者类。

   ```java
   public abstract class Mediator {
       public abstract void componentChange(Component c);
   }
   ```

   

2. ConcreteMediator：具体中介者类。

   ```java
   public class ConcreteMediator extends Mediator {
       // 维持对各个同事对象的引用
       public Button addButton;
   
       public List list;
       public TextBox userNameTextBox;
       public ComboBox cb;
   
       // 封装同事对象直接的交互
       @Override
       public void componentChange(Component c) {
           // 单机按钮
           if (c == addButton) {
               System.out.println(" -- 单击增加按钮 -- ");
               list.update();
               cb.update();
               userNameTextBox.update();
           }
           // 从列表框选择客户
           else if (c == list) {
               System.out.println(" -- 从列表框选择客户 -- ");
               cb.select();
               userNameTextBox.setTex();
           }
           // 从组合框选择客户
           else if (c == cb) {
               System.out.println(" -- 从组合框选择客户 -- ");
               cb.select();
               userNameTextBox.setTex();
           }
       }
   }
   ```

   

3. Component：抽象组件类，充当抽象同事类。

   ```java
   public abstract class Component {
       protected Mediator mediator;
   
       public void setMediator(Mediator mediator) {
           this.mediator = mediator;
       }
   
       // 转发调用
       public void change() {
           mediator.componentChange(this);
       }
   
       public abstract void update();
   }
   ```

4. Button：按钮类，充当具体同事类。

   ```java
   public class Button extends Component{
       @Override
       public void update() {
           // 按钮不产生响应
       }
   }
   ```

   

5. List：列表框类，充当具体同事类

   ```java
   public class List extends Component {
       @Override
       public void update() {
           System.out.println("列表框增加一项：张无忌。");
       }
   
       public void select() {
           System.out.println("列表框选中项：小龙女。");
       }
   }
   ```

   

6. ComboBox：组合框类，充当具体同事类

   ```java
   public class ComboBox extends Component {
       @Override
       public void update() {
           System.out.println("组合框增加一项：张无忌。");
       }
   
       public void select() {
           System.out.println("组合框选中项：小龙女。");
       }
   }
   ```

   

7. TextBox：文本框类，充当具体同事类。

   ```java
   public class TextBox extends Component {
       @Override
       public void update() {
           System.out.println("客户信息增加成功后文本框清空。");
       }
   
       public void setTex() {
           System.out.println("文本框显式：小龙女。");
       }
   }
   ```

   

8. Client：客户端测试类。

   ```java
   public class Client {
       public static void main(String[] args) {
           // 定义中介者对象
           ConcreteMediator mediator;
           mediator = new ConcreteMediator();
   
           // 定义同事对象
           Button addBT = new Button();
           List list = new List();
           ComboBox cb = new ComboBox();
           TextBox userNameTB = new TextBox();
   
           addBT.setMediator(mediator);
           list.setMediator(mediator);
           cb.setMediator(mediator);
           userNameTB.setMediator(mediator);
   
           mediator.addButton = addBT;
           mediator.list = list;
           mediator.cb = cb;
           mediator.userNameTextBox = userNameTB;
   
           addBT.change();
           System.out.println("---------------------");
           list.change();
       }
   }
   ```

### 结果及分析

```tex
 -- 单击增加按钮 -- 
列表框增加一项：张无忌。
组合框增加一项：张无忌。
客户信息增加成功后文本框清空。
---------------------
 -- 从列表框选择客户 -- 
组合框选中项：小龙女。
文本框显式：小龙女。
```

在引入中介者后，同事之间的复杂交互由中介者间接实现，当某个组件类的 changed() 方法被调用时，中介者 componentChanged() 将被调用，在中介者的 componentChanged() 方法中再逐个调用与该组件由交互的其他组件的相关方法。如果某个组件类需要与新的组件进行交互，无需修改已有组件类的源代码，只需修改中介者或者对现有中介者进行扩展即可，系统具有更好的灵活性和可扩展性。

## 扩展中介者和同事类

对“客户信息管理窗口”进行改进，使窗口的下端能够及时显式当前系统中客户信息的总数。

![image-20240823133747413](./image/image-20240823133747413.png '修改之后的“客户信息管理窗口”界面图')

从图中不难发现，可以通过增加一个文本标签（Label） 来显式客户信息总数，而且当用户单击“增加”按钮或者“删除”按钮时将改变文本标签的内容。

由于使用了中介者模式，在原有系统中增加新的组件（即新的同事类）将变得很容易，至少有以下两种解决方案。

方案一：增加一个界面组件类 Label，修改原有的具体中介者类 ConcreteMediator，增加一个对 Label 对象的引用，然后修改 componentChanged() 方法中其他相关组件对象的业务处理代码，原有组件类无需任何修改，客户端代码也需要针对新增组件 Label 进行适当修改。

方案二：首先增加一个 Label 类，但不修改原有具体中介者类 ConcreteMediator 的代码，而是增加一个 ConcreteMediator 的子类 SubConcreteMediator 来实现对 Label 对象的引用，然后在新增的中介者类 SubConcreteMediator 中通过覆盖 componentChanged() 方法来实现所有组件（包括新增 Label 组件）之间的交互。同样，原有组件类无需做任何修改，客户端代码需要做少许修改。

引入 Label 类之后的“客户信息管理窗口”结构示意图如下图所示：

![image-20240823135119627](./image/image-20240823135119627.png '增加 Label 类后的“客户信息管理窗口”示意图')

由于方案二无需修改 ConcreteMediator 类，更符合开闭原则，因此选择方案二对新增 Label 类进行处理，对应的完整类图如下：

![image-20240823135256279](./image/image-20240823135256279.png '修改之后的“客户信息管理窗口”结构图')

在图中新增了具体同事类 Label 和具体中介者类 SubConcreteMediator，Label 类的代码如下：

```java
public class Label extends Component {
    @Override
    public void update() {
        System.out.println("文本标签内容改变，客户信息总数加1.");
    }
}
```

SubConcreteMediator 类的代码如下：

```java
public class SubConcreteMediator extends ConcreteMediator {
    // 增加对 Label 对象的引用
    public Label label;

    public void componentChanged(Component c) {
        // 单击按钮
        if (c == addButton) {
            System.out.println(" -- 单击增加按钮 -- ");
            list.update();
            cb.update();
            userNameTextBox.update();
            label.update(); // 文本标签更新
        }
        // 从列表框选择客户
        else if (c == list) {
            System.out.println(" -- 从列表框选择客户 -- ");
            cb.select();
            userNameTextBox.setTex();
        }
        // 从组合框选择客户
        else if (c == cb) {
            System.out.println(" -- 从组合框选择客户 -- ");
            cb.select();
            userNameTextBox.setTex();
        }
    }
}
```

修改客户端测试代码如下：

```java
public class Client {
    public static void main(String[] args) {
        // 用新增具体中介者定义中介者对象
        SubConcreteMediator mediator;
        mediator = new SubConcreteMediator();

        // 定义同事对象
        Button addBT = new Button();
        List list = new List();
        ComboBox cb = new ComboBox();
        TextBox userNameTB = new TextBox();
        Label label = new Label();

        addBT.setMediator(mediator);
        list.setMediator(mediator);
        cb.setMediator(mediator);
        userNameTB.setMediator(mediator);
        label.setMediator(mediator);

        mediator.addButton = addBT;
        mediator.list = list;
        mediator.cb = cb;
        mediator.userNameTextBox = userNameTB;
        mediator.label = label;

        addBT.change();
        System.out.println("---------------------");
        list.change();
    }
}
```

输出结果如下：

```tex
 -- 单击增加按钮 -- 
列表框增加一项：张无忌。
组合框增加一项：张无忌。
客户信息增加成功后文本框清空。
文本标签内容改变，客户信息总数加1.
---------------------
 -- 从列表框选择客户 -- 
组合框选中项：小龙女。
文本框显式：小龙女。
```

## 中介者模式优点

1. 中介者模式简化了对象之间的交互，它用中介者和同事的一对多交互代替了原来同事之间的多对多交互，一对多关系更容易理解、维护和扩展，将原本难以理解的网状结构转换成相对简单的星型结构。
2. 可将各同事对象解耦。中介者有利于各同事之间的松耦合，可以独立地改变和复用每一个同事和中介者，增加新的中介者和新的同事类都比较方便，更好地符合开闭原则。
3. 可以减少子类生产，中介者将原本分布于多个对象间的行为集中在一起，改变这些行为只需要生成新的中介者子类即可，这使得各个同事类可以被重用，无需直接对同事类进行扩展。

## 中介者模式缺点

在具体中介者类中包含了大量同事之间的交互细节，可能会导致具体中介者非常复杂，使得系统难以维护。

## 中介者模式适用环境

1. 系统中对象之间存在复杂的引用关系，系统结构混乱且难以理解。
2. 一个对象由于引用了其他很多对象并且直接和这些对象通信，导致难以复用该对象。
3. 想通过一个中间类来封装多个类中的行为，而又不想生成太多的子类，此时可以通过引入中介者类来实现，在中介者中定义对象交互的公共行为，如果需要改变行为则可以增加新的具体中介者类。
