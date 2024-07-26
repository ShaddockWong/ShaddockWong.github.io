+++
title = '12-装饰模式'
date = 2024-07-25T08:22:24+08:00
lastmod = 2024-07-25T08:22:24+08:00
tags = ['java', '设计模式']
categories = ['Java设计模式']
draft = false

+++

## 装饰模式概述

装饰模式可以在不改变一个对象本身功能的基础上给对象增加额外的新行为。在软件设计中，装饰模式是一种用于替代继承的技术，它通过一种无需定义字类的方式给对象动态增加职责，使用对象之间的关联关系取代类之间的继承关系。在装饰模式中引入了装饰类，在装饰类中既可以调用待装饰的原有类的方法，还可以增加新的方法，以扩充原有类的功能。

> **装饰模式**：动态地给一个对象增加一些额外的职责。就扩展功能而言，装饰模式提供了一种比使用子类更加灵活的替代方案。
>
> **Decorator Pattern**：Attach additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality.

装饰模式是一种对象结构型模式，它以对客户透明的方式动态地给一个对象附加上更多的责任，可以在不需要创建更多子类的情况下让对象的功能得以扩展。

## 装饰模式结构

装饰模式结构如下图所示：

![image-20240725104452197](./image/image-20240725104452197.png '装饰模式结构图')

装饰模式包含以下 4 个角色：

1. **Component（抽象构件）**：它是具体构件和抽象装饰类的共同父类，声明了在具体构件中实现的业务方法，它的引入可以使客户端以一致的方式处理未被装饰的对象以及装饰之后的对象，实现客户端的透明操作。
2. ConcreteComponent（具体构件）：它是抽象构件类的字类，用于定义具体的构件对象，实现了在抽象构件中声明的方法，装饰类可以给它增加额外的职责（方法）。
3. **Decorator（抽象装饰类）**：它也是抽象构建类的字类，用于给具体构件增加职责，但是具体职责在其子类中实现。它维护一个指向抽象构件对象的引用，通过该引用可以调用装饰之前构件对象的方法，并通过其子类扩展该方法，达到装饰的目的。
4. **ConcreteDecorator（具体装饰类）**：它是抽象装饰类的字类，负责向构件添加新的职责。每一个具体装饰类都定义了一些新的行为，它可以调用在抽象装饰中定义的方法，并可以增加新的方法用于扩充对象的行为。

## 装饰模式实现

在装饰模式中，抽象构件类一般设计为抽象类或者接口，在其中声明了抽象业务方法，当然也可以在抽象构件类中实现一些所有具体构件类都共有的业务方法。抽象构件类的典型代码如下：

```java
public abstract class Component {
    public abstract void operation();
}
```

具体构建类作为抽象构件类的字类实现了在抽象构件中声明的业务方法，通常在具体构建类中只提供基本功能的实现，一些复杂的功能需要通过装饰类进行扩展。其典型代码如下：

```java
public class ConcreteComponent extends Component {
    public void operation() {
        // 基本功能实现
    }
}
```

装饰模式的核心在于抽象装饰类的设计，其典型代码如下：

```java
public class Decorator extends Component {
    private Component component; // 维持一个对抽象构件对象的引用
    
    // 注入一个抽象构件类型的对象
    public Decorator(Component component) {
        this.component = component;
    }
    
    public void operation() {
        component.operation(); // 调用原有业务方法
    }
}
```

在抽象装饰类 Decorator 中定义了一个 Component 类型的对象 component，维持一个对抽象构件对象的引用，并可以通过构造方法或 Setter 方法将一个 Component 类型的对象注入进来，同时由于 Decorator 类实现了抽象构件 Component 接口，因此需要实现在其中声明的业务方法 operation()。值得注意的是，在 Decorator 中并未真正实现 operation() 方法，只是调用原有 component 对象的 operation() 方法，它没有真正实施装饰，而是提供一个统一的接口，将具体装饰过程交给子类完成。

在 Decorator 的子类（即具体装饰类）中将继承 operation() 方法并根据需要进行扩展，典型的具体装饰类代码如下：

```java
public class ConcreteDecorator extends Decorator {
    public ConcreteDecorator(Component component) {
        super(component);
    }
    
    public void operation() {
        super.operation(); // 调用原有业务方法
        addedBehavior();   // 调用新增业务方法
    }
    
    // 新增业务方法
    public void addedBehavior() {
        ...
    }
}
```

在具体装饰类中可以调用到抽象装饰类的 operation() 方法，同时可以定义新的业务方法，例如 addedBehavior()。如果该方法不希望客户端单独调用，可以将其可见性设为私有（private）。

由于在抽象装饰类 Decorator 中注入的是 Component 类型的对象，因此可以将一个具体构件对象注入其中，再通过具体装饰类进行装饰；此外，还可以将一个已经装饰过的 Decorator 子类的对象再注入其中进行多次装饰，从而实现对原有功能的多次扩展。

## 装饰模式应用实例

### 实例说明

某软件公司基于面向对象技术开发了一套图形界面构件库 VisualComponent，该构件库提供了大量的基本构件，如窗体、文本框、列表框等，由于在使用该构件库时用户经常要求定制一些特殊的显示效果，如带滚动条的窗体、带黑色边框的文本框、既带滚动条又带黑色边框的列表框等，因此经常需要对该构件库进行扩展以增强其功能。现使用装饰模式来设计该图形界面构件库。

### 实例类图

![image-20240725143034519](./image/image-20240725143034519.png '图形界面构件库结构图')

Component 充当抽象构建类，其子类 Window、TextBox、ListBox 充当具体构件类，Component 类的另一个字类 ComponentDecorator 充当抽象装饰类，ComponentDecorator 的子类 ScrollBarDecorator 和 BlackBorderDecorator 充当具体装饰类。

### 实例代码

1. Component：抽象界面构件类，充当了抽象构件类。为了突出与模式相关的核心代码，在本实例中对控件代码进行了大量的简化。

   ```java
   public abstract class Component {
       public abstract void display();
   }
   ```

2. Window：窗体类，充当具体构件类。

   ```java
   public class Window extends Component{
       @Override
       public void display() {
           System.out.println("显示窗体！");
       }
   }
   ```

   

3. TextBox：文本框类，充当具体构件类。

   ```java
   public class TextBox extends Component{
       @Override
       public void display() {
           System.out.println("显示文本框！");
       }
   }
   ```

   

4. ListBox：列表框类，充当具体构件类。

   ```java
   public class ListBox extends Component{
       @Override
       public void display() {
           System.out.println("显示列表框！");
       }
   }
   ```

   

5. ComponentDecorator：构建装饰类，充当抽象装饰类。

   ```java
   public class ComponentDecorator extends Component {
       private Component component; // 维持对抽象构件类型对象的引用
   
       // 注入抽象构件类型的对象
   
       public ComponentDecorator(Component component) {
           this.component = component;
       }
   
       @Override
       public void display() {
           component.display();
       }
   }
   ```

   

6. ScrollBarDecorator：滚动条装饰类，充当具体装饰类。

   ```java
   public class ScrollBarDecorator extends ComponentDecorator{
       public ScrollBarDecorator(Component component) {
           super(component);
       }
   
       @Override
       public void display() {
           this.setScrollBar();
           super.display();
       }
   
       public void setScrollBar() {
           System.out.println("为构建增加滚动条！");
       }
   }
   ```

   

7. BlackBorderDecorator：黑色边框装饰类，充当具体装饰类。

   ```java
   public class BlackBorderDecorator extends ComponentDecorator {
       public BlackBorderDecorator(Component component) {
           super(component);
       }
   
       @Override
       public void display() {
           this.setBlackBorder();
           super.display();
       }
   
       public void setBlackBorder() {
           System.out.println("为构件增加黑色边框");
       }
   }
   ```

   

8. Client：客户端测试类。

   ```java
   public class Client {
       public static void main(String[] args) {
           Component component, componentSB;        // 使用抽象构件定义对象
           component = new Window();                // 创建具体构件对象
           componentSB = new ScrollBarDecorator(component); // 创建装饰后的构件对象
           componentSB.display();
       }
   }
   ```

### 结果及分析

输出结果如下

```tex
为构建增加滚动条！
显示窗体！
```

如果希望的到一个既有滚动条，又有黑色边框的窗体，不需要对原有类库进行任何修改，只需要将客户端代码修改如下：

```java
public class Client {
    public static void main(String[] args) {
        Component component, componentSB, componentBB; // 使用抽象构件定义对象
        component = new Window(); // 创建具体构件对象
        componentSB = new ScrollBarDecorator(component); // 创建装饰后的构件对象
        componentBB = new BlackBorderDecorator(componentSB); // 将装饰了一次的对象注入另一个装饰类中，进行第二次装饰
        componentBB.display();
    }
}
```

再次编译并运行程序，输出结果如下：

```tex
为构件增加黑色边框
为构建增加滚动条！
显示窗体！
```

如果需要在原有系统中增加一个新的具体构件类或者新的具体装饰类，无需修改现有类库代码，只需将它们分别作为抽象构件类或者抽象装饰类的子类即可。

## 透明装饰模式与半透明装饰模式

在标准的装饰模式中，新增行为需要在原有业务方法中调用，无论是具体构件对象还是装饰过的构件对象，对于客户端而言都是透明的，这种装饰模式被称为透明（Transparent）装饰模式。但是在某些情况下，有些新增行为可能需要单独被调用，此时客户端不能再一致性地处理之前的对象和装饰之后的对象，这种装饰模式被称为半透明（Semi-transparent）装饰模式。

### 透明装饰模式

在透明装饰模式中要求客户端完全针对抽象编程，装饰模式的透明性要求客户端程序不应该将对象声明为具体构件类型或具体装饰类型，而应该全部声明为抽象构件类型。对于客户端而言，具体构件对象和具体装饰对象没有任何区别。也就是应该使用以下代码了：

```java
Component component_o, component_d; // 使用抽象构件类型定义对象
component_o = new ConcreteComponent();
component_d = new ConcreteDecorator(component_o);
component_d.operation();
```

使用抽象构件类型 Component 定义全部具体构件对象和具体装饰对象，客户端可以一致地使用这些对象，因此符合透明装饰模式的要求。

透明装饰模式可以让客户端透明地使用装饰之前的对象和装饰之后的对象，无需关心它们的区别，此外还可以对一个已装饰过的对象进行多次装饰，得到更加复杂、功能更加强大的对象。

### 半透明装饰模式

透明装饰模式的设计难度较大，而且有时需要单独调用新增的业务方法。为了能够调用到新增方法，不得不用具体装饰类型来定义装饰之后的对象，而具体构件类型仍然可以使用抽象构件类型来定义，这种装饰模式即半透明装饰模式。对客户端而言，具体构件类型无需关系，是透明的，但是具体装饰类型必须指定，这是不透明的。客户端代码片段如下：

```java
...
Component component_o;			// 使用抽象构件类型定义
component_o = new ConcreteComponent();
component_o.operation();
ConcreteDecorator component_d;	 // 使用具体构件类型定义
component_d = new ConcreteDecorator(component_o);
component_d.operation();		 // 单独调用新增业务方法
...
```

半透明装饰模式可以给系统带来更多的灵活性，设计相对简单，使用起来也非常方便；但其最大的缺点在于不能实现同一个对象的多次装饰，而且客户端需要有区别地对待装饰之前的对象和装饰之后的对象。实现半透明装饰模式时只需要在具体装饰类中增加一个独立的 addedBehavior() 方法来封装对应的业务处理，由于客户端使用具体装饰类型来定义装饰后的对象，因此可以单独调用 addedBehavior() 方法。

## 装饰模式优点

1. 对于扩展一个对象的功能，装饰模式比继承更加灵活，不会导致类的个数急剧增加。
2. 可以通过一种动态的方式来扩展一个对象的功能，通过配置文件可以在运行时选择不同的具体装饰类，从而实现不同的行为。
3. 可以对一个对象进行多次装饰，通过使用不同的具体装饰类以及这些装饰类的排列组合可以创造出很多不同行为的组合，得到功能更加强大的对象。
4. 具体构建类与具体装饰类可以独立变化，用户可以根据需要增加新的具体构建类和具体装饰类，原有类库代码无须改变，符合开闭原则。

## 装饰模式缺点

1. 在使用装饰模式进行系统设计时将产生很多小对象，这些对象的区别在于它们之间相互连接的方式有所不同，而不是他们的类或者属性值有所不同，大量小对象的产生势必会占用更多的系统资源，在一定程度上影响程序的性能。
2. 装饰模式提供了一种比继承更加灵活、机动的解决方案，但同时也意味着比继承更加易于出错，排错也更加困难，对于多次装饰的对象，在调试时寻找错误可能需要逐级排查，较为繁琐。

## 装饰模式适用环境

1. 在不影响其他对象的情况下以动态、透明的方式给单个对象添加职责。
2. 当不能采用继承的方式对系统进行扩展或者采用继承不利于系统扩展和维护时可以使用装饰模式。不能采用继承的情况主要有两类：第一类是系统中存在大量独立的扩展，为支持每一种扩展或者扩展之间的组合将产生大量的子类，使得子类数目呈爆炸性增长；第二类是因为类已定义为不能被继承（例如在 Java 语言中使用 `final` 关键字修饰的类）
