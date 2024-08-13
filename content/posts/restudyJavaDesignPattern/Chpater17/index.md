+++
title = '17-命令模式'
date = 2024-08-12T11:46:14+08:00
lastmod = 2024-08-12T11:46:14+08:00
tags = ['java', '设计模式']
categories = ['Java设计模式']
draft = false

+++

## 命令模式概述

为了降低系统的耦合度，将请求的发送者和接收者解耦，可以使用一种被称为命令模式的设计模式来设计系统，在命令模式中发送者与接收者之间引入了新的命令对象，将发送者的请求封装在命令对象中，再通过命令对象来调用接收者的方法。

命令模式可以将请求发送者和接收者完全解耦，发送者与接收者之间没有直接引用关系，发送请求的对象只需知道如何发送请求，而并不必知道如何完成请求。

> **命令模式**：将一个请求封装为一个对象，从而可用不同的请求对客户进行参数化，对请求排队或者记录请求日志，以及支持可撤销的操作。
>
> **Command Pattern**：Encapsulate a request as an object，thereby letting you parameterize clients with different request, queue or log request, and support undoable operations.

命令模式是一种对象行为型模式，其别名为动作（Action）模式或事务（Transaction）模式。命令模式的定义比较复杂，提到了很多术语，例如“用不同的请求对客户进行参数化”“对请求排队”“支持可撤销操作”等。

## 命令模式结构

命令模式的核心在于引入了抽象命令类和具体命令类，通过命令类来降低发送者和接收者的耦合度，请求发送者只需要指定一个命令对象，再通过命令对象来调用请求接收者的处理方式，其结构如图所示：

![image-20240812135441419](./image/image-20240812135441419.png '命令模式结构图')

包含以下4个角色：

1. **Command（抽象命令类）**：抽象命令类一般是一个抽象类或接口，在其中声明了用于执行请求的 execute() 等方法，通过这些方法可以调用请求接收者的相关操作。
2. **ConcreteCommand（具体命令类）**：具体命令类是抽象命令类的子类，实现了在抽象命令类中声明的方法，它对应具体的接收者对象，将接收者对象的动作绑定其中。具体命令类在实现 execute() 方法时将调用接收者对象的相关操作（Action）。
3. **Invoker（调用者）**：调用者即请求发送者，它通过命令对象来执行请求。一个调用者并不需要在设计时确定其接收者，因此它只与抽象命令类之间存在关联关系。在程序运行时可以将一个具体命令对象注入其中，再调用具体命令对象的execute() 方法，从而实现间接调用请求接收者的相关操作。
4. **Receiver（接收者）**：接收者执行与请求相关的操作，具体实现对请求的业务处理。

## 命令模式实现

命令模式的本质是对请求进行封装，一个请求对应一个命令，将发出命令的责任和执行命令的责任分隔开。每一个命令都是一个操作：请求的一方发出请求要求执行一个操作；接收的一方收到请求并执行相应的操作。命令模式允许请求的一方和接收的一方独立开来，使得请求的一方不必知道接收请求的一方的接口，更不必知道请求如何被接收、操作是否被执行、何时被执行，以及是怎么被执行的。

命令模式的关键在于引入了抽象命令类，请求发送者针对抽象命令类编程，只有实现了抽象命令类的具体命令才与请求接收者相关联。典型的抽象命令类代码如下：

```java
public abstract class Command {
    public abstract void execute();
}
```

对于请求发送者（即调用者）而言，将针对抽象命令类进行编程，可以通过构造函数或者 Setter 方法在运行时注入具体命令类对象，并在业务方法中调用命令对象的 execute() 方法，其典型代码如下：

```java
public class Invoker {
    private Command command;
    
    // 构造注入
    public Invoker(Command command) {
        this.command = command;
    }
    
    // 设值注入
    public void setCommand(Command command) {
        this.command = command;
    }
    
    // 业务方法，用于调用命令类的 execute() 方法
    public void call() {
        command.execute();
    }
}
```

具体命令类继承了抽象命令类，它与请求接收者相关联，实现了在抽象命令类中声明的 excute() 方法，并在实现时调用接收者的请求响应方法 action()，其典型代码如下：

```java
public class ConcreteCommand extends Command {
    private Receiver receiver; // 维持一个对请求接收者对象的引用
    
    public void execute() {
        receiver.action(); // 调用请求接收者的业务处理方法 action()
    }
}
```

请求接收者 Receiver 具体实现对请求的业务处理，它拥有 action() 方法，用于执行与请求相关的操作，其典型代码如下：

```java
public class Receiver {
    public void action() {
        // 具体操作
    }
}
```

## 命令模式应用实例

### 实例说明

为了用户使用方便，某系统提供了一系列功能键，用户可以自定义功能键的功能，例如功能键 FunctionButton 可以用于退出系统（由 SystemExitClass 类来实现），也可以用于显示帮助文档（由DisplayHelpClass来实现）。

用户可以通过修改配置文件改变功能键的用途，现使用命令模式设计该系统，使得功能键与功能类之间解耦，可为同一个功能键设置不同的功能。

### 实例类图

![image-20240812165203659](./image/image-20240812165203659.png '功能键设置结构图')

FunctionButton 充当请求调用者，SystemExitClass 和 DisplayHelpClass 充当请求接收者，Command 是抽象命令类，ExitCommand 和 HelpCommand 充当具体命令类。

### 实例代码

1. FunctionButton：功能键类，充当请求调用者（请求发送者）。

   ```java
   public class FunctionButton {
       private Command command; // 维持一个抽象命令对象的引用
   
       // 为功能键注入命令
       public void setCommand(Command command) {
           this.command = command;
       }
   
       // 发送请求的方式
       public void click(){
           System.out.println("单击功能键：");
           command.execute();
       }
   }
   ```

   

2. Command：抽象命令类。

   ```java
   public abstract class Command {
       public abstract void execute();
   }
   ```

   

3. ExitCommand：退出命令类，充当具体命令类。

   ```java
   public class ExitCommand extends Command {
       private SystemExitClass seObj; // 维持对请求接收者的引用
   
       public ExitCommand() {
           seObj = new SystemExitClass();
       }
   
       // 命令执行方法，将调用请求接收者的业务方法
       @Override
       public void execute() {
           seObj.exit();
       }
   }
   ```

   

4. HelpCommand：帮助命令类，充当具体命令类。

   ```java
   public class HelpCommand extends Command {
       private DisplayHelpClass hcObj;  // 维持对请求接收者的引用
   
       public HelpCommand() {
           hcObj = new DisplayHelpClass();
       }
   
       // 命令执行方法，将调用请求接收者的业务方法
       @Override
       public void execute() {
           hcObj.display();
       }
   }
   ```

   

5. SystemExitClass：退出系统模拟实现类，充当请求接收者。

   ```java
   public class SystemExitClass {
       public void exit(){
           System.out.println("退出系统！");
       }
   }
   ```

   

6. DisplayHelpClass：显示帮助文档模拟实现类，充当请求接收者。

   ```java
   public class DisplayHelpClass {
       public void display() {
           System.out.println("显示帮助文档！");
       }
   }
   ```

   

7. config.xml：配置文件

   ```xml
   <?xml version="1.0" encoding="UTF-8" ?>
   <config>
       <className>com.wangyq.command.ExitCommand</className>
   </config>
   ```

   

8. Client：客户端测试类。

   ```java
   public class Client {
       public static void main(String[] args) {
           FunctionButton fb = new FunctionButton();
           Command command;   // 定义命令对象
           command = (Command) XMLUtil
                   .getBean("design-pattern/src/main/java/com/wangyq/command/config.xml"); // 读取配置文件，反射生成对象
   
           fb.setCommand(command); // 将命令对象注入功能键
           fb.click();
       }
   }
   ```

### 结果及分析

输出结果如下：

```tex
单击功能键：退出系统！
```

如果需要更换具体命令类，无须修改源代码，只需修改配置文件即可。

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<config>
    <className>com.wangyq.command.ExitCommand</className>
</config>
```

重新运行，输出结果如下：

```tex
单击功能键：显示帮助文档！
```

如果在系统中增加了新的功能，功能键需要与新功能对应，只需要对应增加一个新的具体命令类，在新的具体命令类中调用新功能类的业务方法，然后将该具体命令类的对象通过配置文件注入到功能键即可，原有代码无须修改，符合开闭原则。

在命令模式汇总每一个命令类对应一个请求的处理者（接收者），通过向请求发送者注入不同的具体命令对象可以使相同的发送者对应不同的接收者，从而实现“将一个请求封装为一个对象，用不同的请求对客户进行参数化”，客户端只需要将具体命令对象作为参数注入请求发送者，无须直接操作请求的接收者。

## 实现命令队列

当一个请求发送者发送一个请求是不止有一个请求接收者产生响应，这些请求接收者将逐个执行业务方法，完成对请求的处理，此时可以通过命令队列来实现。

命令队列的实现方法有多种形式，其中最常用、灵活性最好的一种是增加一个 CommandQueue 类，由该类负责存储多个命令对象，而不同的命令对象可以对应不同的请求接收者。CommandQueue 类的典型代码如下：

```java
public class CommandQueue {
    // 定义一个 ArrayList 来存储命令队列
    private ArrayList<Command> commands = new ArrayList<Command>();
    
    public void addCommand(Command command) {
        command.add(command);
    }
    
    public void removeCommand(Command command) {
        commands.remove(command);
    }
    
    // 循环调用每一个命令对象的 execute() 方法
    public void execute() {
        for(Object command : commands) {
            ((Command)command).execute();
        }
    }
}
```

在增加了命令队列类 CommandQueue 以后，请求发送者类 Invoker 将针对 CommandQueue 编程，其代码修改如下：

```java
public class Invoker {
    private CommandQueue commandQueue; // 维持一个 CommandQueue 对象的引用
    
    // 构造诸如
    public Invoker(CommandQueue commandQueue) {
        this.commandQueue = commandQueue;
    }
    
    // 设值注入
    public void setCommandQueue(CommandQueue commandQueue) {
        this.commandQueue = commandQueue;
    }
    
    // 调用 CommandQueue 类的 execute() 方法
    public void call() {
        commandQueue.execute();
    }
}
```

命令队列与人们常说的“批处理”有点类似。

## 记录请求日志

请求日志就是将请求的历史记录保存下来，通常以日志文件（Log File）的形式永久存储在计算机中。请求日志文件可以实现很多功能，常用功能如下：

1. 一旦系统发生故障，日志文件可以为系统提供一种恢复机制，在请求日志文件中可以记录用户对系统的每一步操作，从而让系统能够顺利恢复到某一个特定的状态。
2. 请求日志也可以用于实现批处理，在一个请求日志文件中可以存储一系列命令对象，例如一个命令队列。
3. 可以将命令队列中的所有命令对象都存储在一个日志文件中，每执行一个命令则从日志文件中删除一个对应的命令对象，防止因为断电或者系统重启等原因造成请求丢失，而且可以避免重新发送全部请求时造成某些命令的重复执行，只需读取请求日志文件，再继续执行文件中剩余的命令即可。

## 实现撤销操作

在命令模式中可以通过对命令类进行修改使得系统支持撤销（Undo）操作和恢复（Redo）操作，下面通过一个简单实例来学习如何在命令模式汇总实现撤销操作。

### 实例说明

设计一个简易计算器，该计算器可以实现简单的数学运算，还可以对运算实施撤销操作。

### 实例类图

![image-20240813103428664](./image/image-20240813103428664.png '简易计算器结构图')

计算器界面类 CalculatorForm 充当请求发送者，实现了数据求和功能的加法类 Adder 充当请求接收者，界面类可间接调用加法类中的 add() 方法实现加法运算，并且提供了可撤销加法运算的 undo() 方法。

### 实例代码

1. Adder：充当请求接收者。

   ```java
   public class Adder {
       private int num = 0; // 定义初始值为 0
   
       // 加法操作，每次将传入的值与 num 作加法运算，再将结果返回
       public int add(int value) {
           num += value;
           return num;
       }
   }
   ```

   

2. AbstractCommand：充当抽象命令类，声明了 execute() 方法和撤销方法 undo()。

   ```java
   public abstract class AbstractCommand {
       public abstract int execute(int value); // 声明命令执行方法 execute()
       public abstract int undo(); // 声明撤销方法 undo()
   }
   ```

   

3. AddCommand：充当具体命令类，实现了在抽象命令类 AbstractCommand 中声明的 execute() 方法和撤销方法 undo()。

   ```java
   public class AddCommand extends AbstractCommand {
       private Adder adder = new Adder();
       private int value;
   
       // 实现抽象命令类中声明的 execute() 方法，调用加法类的加法操作
       @Override
       public int execute(int value) {
           this.value = value;
           return adder.add(value);
       }
   
       // 实现抽象命令类中声明的 undo() 方法，通过加一个相反数来实现加法的逆向操作
       @Override
       public int undo() {
           return adder.add(-value);
       }
   }
   ```

   

4. CalculatorForm 充当请求发送者，它引用一个抽象命令类型 AbstractCommand 的对象 command，通过该 command 对象间接调用请求接收者 Adder 类的业务处理方法。

   ```java
   public class CalculatorForm {
       private AbstractCommand command;
   
       public void setCommand(AbstractCommand command) {
           this.command = command;
       }
   
       // 调用命令对象的 execute() 方法执行运算
       public void compute(int value) {
           int i = command.execute(value);
           System.out.println("执行运算，运算结果为：" + i);
       }
   
       // 调用命令对象的 undo() 方法执行撤销
       public void undo() {
           int i = command.undo();
           System.out.println("执行撤销，运算结果为：" + i);
       }
   }
   ```

   

5. Client：客户端测试类，其中定义了抽象命令类型的命令对象 command，还创建了请求发送者对象 form，通过调用 form 对象的 compute() 方法实现加法运算，还可以调用 undo() 方法撤销最后一次加法运算。

   ```java
   public class Client {
       public static void main(String[] args) {
           CalculatorForm form = new CalculatorForm();
           AbstractCommand command;
           command = new AddCommand();
           form.setCommand(command); // 向发送者注入命令对象
   
           form.compute(10);
           form.compute(5);
           form.compute(10);
           form.undo(); // 撤销
       }
   }
   ```

### 结果及分析

```tex
执行运算，运算结果为：10
执行运算，运算结果为：15
执行运算，运算结果为：25
执行撤销，运算结果为：15
```

需要注意的是在本实例中只能实现一步撤销操作，因为没有保存命令对象的历史状态，可以通过引入一个命令集合或其他方式来存储每一次操作时命令的状态，从而实现多次撤销操作。

## 宏命令

宏命令（Macro Command）又称组合命令（Composite Command），它是组合模式和命令模式联用的产物。宏命令是一个具体命令类，它拥有一个劲i个，在该集合中包含了对其他命令对象的引用。通常宏命令不直接与请求接收者交互，而是通过它的成员来调用接收者的方法。当调用宏命令的 execute() 方法时，将地柜调用它所包含的每个成员命令的 execute() 方法，一个宏命令的成员可以是简单命令，也可以继续是宏命令。执行一个宏命令将出发多个具体命令的执行，从而实现对命令的批处理。

![image-20240813111621523](./image/image-20240813111621523.png '宏命令结构图')

## 命令模式优点

1. 降低系统的耦合度。
2. 新的命令可以很容易地加入到系统中。
3. 可以比较容易地设计一个命令队列或宏命令（组合命令）。
4. 为请求的撤销和恢复操作提供了一种设计和实现方案。

## 命令模式缺点

使用命令模式可能会导致某些系统有过多的具体命令类。因为针对每一个对请求接收者的调用操作都需要设计一个具体命令类，所以在某些系统中可能需要提供大量的具体命令类，这将影响命令模式的使用。

## 命令模式适用环境

1. 系统需要将请求调用者和请求接收者解耦，是的调用者和接收者不直接交互。请求调用者无须直到接收者的存在，也无须直到接收者是谁，接收者也无须关心何时被调用。
2. 系统需要在不同的时间指定请求、将请求排队和执行请求。一个命令对象和请求的初始调用者可以有不同的生命期，换而言之，最初的请求发出这可能已经不在了，而命令对象本身仍然是活动的，可以通过该命令对象去调用请求接收者，并且无须关系请求调用者的存在性，可以通过请求日志文件等机制来具体实现。
3. 系统需要支持命令的撤销和恢复操作。
4. 系统需要将一组操作组合在一起形成宏命令。
