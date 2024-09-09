+++
title = '23-状态模式'
date = 2024-09-06T14:00:04+08:00
lastmod = 2024-09-09T14:00:04+08:00
tags = ['java', '设计模式']
categories = ['Java设计模式']
draft = false

+++

## 状态模式概述

在软件系统中，有些对象也像水一样具有多种状态，这些状态在某些情况下能够相互转换，而且对象在不同的状态下也将具有不同的行为。通常可以使用复杂的条件判断语句来进行状态的判断和转换操作，这会导致代码的可维护性和灵活性下降，特别是在出现新的状态时，代码的扩展性很差，客户端代码也需要进行相应的修改，违反了开闭原则。为了解决状态的转换问题，并使得客户端代码与对象状态之间的耦合度降低，可以使用一种被称为状态模式的设计模式。

状态模式用于解决系统中复杂对象的状态转换以及不同状态下行为的封装问题。当系统中的某个对象存在多个状态，这些状态之间可以进行转换，而且对象在不用状态下行为不相同时可以使用状态模式。状态模式将有一个对象的状态从该对象中分离出来，封装到专门的状态类中，使得对象状态可以灵活变化。对于客户端而言，无需关心对象状态的转换以及对象所处的当前状态，无论对于何种状态的对象，客户端都可以一致处理。

> **状态模式**：允许一个对象在其内部状态改变时改变它的行为。对象看起来似乎修改了它的类。
>
> **State Pattern**：Allow an object to alter its behavior when its internal state changes. The object will appear to change its class.

状态模式又名状态对象（Objects for states），它是一种对象行为型模式。

## 状态模式结构

在状态模式中引用了抽象状态类和具体状态类，它们是状态模式的核心，其结构如下图所示：

![image-20240906143149355](./image/image-20240906143149355.png '状态模式结构图')1.

1. **Context（环境类）**：环境类又称为上下文类，它是拥有多种状态的对象。由于环境类的状态存在多样性且在不同状态下对象的行为有所不同，因此将状态独立出去形成单独的状态类。在环境类中维护一个抽象状态类 State 的实例，这个实例定义当前状态，在具体实现时它是一个 State 子类的对象。
2. **State（抽象状态类）**：它用于定义一个接口以封装与环境类的一个特定状态相关的行为，在抽象状态类中声明了各种不同状态对应的方法，而在其子类中实现了这些方法，由于不同状态下对象的行为可能不同，因此在不同子类中方法的实现可能存在不同，相同的方法可以写在抽象状态类中。
3. **ConcreteState（具体状态类）**：它是抽象状态类的子类，每一个子类实现一个与环境类的一个状态相关的行为，每一个具体状态类对应环境的一个具体状态，不同的具体状态类的行为有所不同。

## 状态模式实现

在状态模式中，将对象在不同状态下的行为封装到不同的状态类中，为了让系统具有跟好的灵活性和扩展性，同时对各状态下的共有行为进行封装，需要对状态进行抽象化，引入了抽象状态类角色。其典型代码如下：

```java
public abstract class State {
    // 声明抽象业务方法，不同的具体状态类可以有不同的实现
    public abstract void handle();
}
```

在抽象状态类的子类（即具体状态类）中实现了在抽象状态类中声明的业务方法，不同的具体状态类可以提供完全不同的方法实现。在实际使用时，在一个状态类中可能包含多个业务方法，如果在具体状态类中某些业务方法的实现完全相同，可以将这些方法移至抽象状态类，实现代码的复用。典型的具体状态类代码如下：

```java
public class ConcreteState extends State {
    public void handle() {
        // 方法的具体实现代码
    }
}
```

环境类维持一个对象状态类的引用，通过setState() 方法可以向环境类注入不同的状态对象，然后在环境类的业务方法中调用状态对象的方法。其典型代如下：

```java
public class Context {
    private State state; // 维持一个对抽象状态对象的引用
    private int value; // 其他属性值，该属性值的变化可能会导致对象的状态发生变化
    
    // 设置状态对象
    public void setState(State state) {
        this.state = state;
    }
    
    public void request() {
        // 其他代码
        state.handle();  // 调用状态对象的业务方法
        // 其他代码
    }
}
```

环境类实际上是真正拥有状态的对象，只是将环境类中与状态有关的代码提取出来封装到专门的状态类中。在状态模式结构图中，环境类 Context 与抽象状态类 State 之间存在单向关联关系，在 Context 中定义了一个 State 对象。在实际使用时，它们之间可能存在最为复杂的关系，State 与 Context 之间可能也存在依赖或者双向关联关系。

在状态模式的使用过程中，一个对象的状态之间还可以进行相互转换，通常有两种实现状态转换的方式：

1. 统一由环境类来负责状态之间的转换，此时环境类还充当了状态管理器（State Manager）角色，在环境类的业务方法中通过对某些属性值的判断实现状态转换，还可以提供一个专门的方法用于实现属性判断和状态转换，代码片段如下：

   ```java
   ...
   public void changeState() {
       // 判断属性值，根据属性值进行状态转换
       if(value == 0) {
           this.setState(new ConcreteStateA());
       } else if (value == 1) {
           this.setState(new ConcreteStateB());
       }
       ...
   }
   ...
   ```

2. 有具体状态类来负责状态之间的转换，可以在具体状态类的业务方法中判断环境类的某些属性值，再根据情况为环境类设置新的状态对象，实现状态转换。同样，也可以提供一个专门的方法来负责属性值的判断和状态转换。此时状态类与环境类之间将存在依赖或关联关系，因此状态类需要访问环境类中的属性值，具体状态类 ConcreteStateA 的代码片段如下：

   ```java
   ...
   public void changeState(context ctx) {
       // 根据环境对象中的属性值进行状态转换
       if(ctx.getValue() == 1) {
           ctx.setState(new ConcreteStateB());
       } else if (ctx.getValue() == 2) {
           ctx.setState(new ConcreteStateC());
       }
       ...
   }
   ...
   ```

   ## 状态模式应用实例

   ### 实例说明

   某软件公司要为一银行开发一套信用卡业务系统，银行账户（Account）是系统的核心类之一，通过分析，该软件公司的开发人员发现在系统中账户存在3种状态，且在不同状态下账户存在不同的行为，具体说明如下：

   1. 如果账户汇总的余额大于等于0，则账户的状态为正常状态（Normal State），此时用户既可以向该账户存款，也可以从该账户取款。
   2. 如果账户中的余额小于0，并且大于-2000，则该账户的状态为透支状态（Overdraft State），此时用户既可以向该账户存款也可以从该账户取款，单需要按天计算利息。
   3. 如果账户汇总的余额等于 -2000，那么账户的状态为受限状态（Restricted State），此时用户只能向该账号存款，不能再从中取款，同时按天计算利息。
   4. 根据余额的不同，以上3种状态可发生相互转换。

   试使用状态模式设计并实现银行账户状态的转换。

   ### 实例分析及类图

   ![image-20240909094723082](./image/image-20240909094723082.png '银行账户状态图')

在上图中，NormalState 表示正常状态，OverdraftState 表示透支状态，RestrictedState 表示受限状态。在这3中状态下账户对象拥有不同的行为，方法 deposit() 用于存款，withdraw() 用于取款，computeInterest() 用于计算利息，stateCheck() 用于在每一次执行存款和取款操作后根据余额来判断是否需要进行状态转换并实现状态转换，相同的方法在不同的状态下可能会有不同的实现。

使用状态模式对银行账户的状态进行设计，所得结构如图所示：

![image-20240909100029693](./image/image-20240909100029693.png '银行账户结构图')

### 实例代码

1. Account：银行账户，充当环境类。

   ```java
   public class Account {
       private AccountState state;             // 维持一个对抽象状态对象的引用
       private String owner;                   // 开户名
       private double balance = 0;             // 账户余额
   
       public Account(String owner, double init) {
           this.owner = owner;
           this.balance = balance;
           this.state = new NormalState(this); // 设置初始状态
           System.out.println(this.owner + "开户，初始金额为" + init);
       }
   
       public double getBalance() {
           return this.balance;
       }
   
       public void setBalance(double balance) {
           this.balance = balance;
       }
   
       public void setState(AccountState state) {
           this.state = state;
       }
   
       public void deposit(double amount) {
           System.out.println(this.owner + "存款" + amount);
           state.deposit(amount);                  // 调用状态对象的 deposit() 方法
           System.out.println("现在余额为" + this.balance);
           System.out.println("现在账户状态为" + this.state.getClass().getName());
           System.out.println("-------------------------------------------------");
       }
   
       public void withdraw(double amount) {
           System.out.println(this.owner + "取款" + amount);
           state.withdraw(amount);                 // 调用状态对象的 withdraw() 方法
           System.out.println("现在余额为" + this.balance);
           System.out.println("现在账户状态为" + this.state.getClass().getName());
           System.out.println("--------------------------------------------------");
       }
   
       public void computerInterest() {
           state.computeInterest();                // 调用状态对象的 computeInterest() 方法
       }
   }

2. AccountState：账户状态类，充当抽象状态类。

   ```java
   public abstract class AccountState {
       protected Account acc;
   
       public abstract void deposit(double amount);
   
       public abstract void withdraw(double amount);
   
       public abstract void computeInterest();
   
       public abstract void stateCheck();
   }
   ```

   

3. NormalState：正常状态类，充当具体状态类。

   ```java
   public class NormalState extends AccountState {
       public NormalState(Account acc) {
           this.acc = acc;
       }
   
       public NormalState(AccountState state) {
           this.acc = state.acc;
       }
   
       @Override
       public void deposit(double amount) {
           acc.setBalance(acc.getBalance() + amount);
           stateCheck();
       }
   
       @Override
       public void withdraw(double amount) {
           acc.setBalance(acc.getBalance() - amount);
           stateCheck();
       }
   
       @Override
       public void computeInterest() {
           System.out.println("正常状态，无需支付利息！");
       }
   
       @Override
       public void stateCheck() {
           if (acc.getBalance() > -2000 && acc.getBalance() <= 0) {
               acc.setState(new OverdraftState(this));
           } else if (acc.getBalance() == -2000) {
               acc.setState(new RestrictedState(this));
           } else if (acc.getBalance() < -2000) {
               System.out.println("操作受限！");
           }
       }
   }
   ```

   

4. OverdraftState：透支状态类，充当具体状态类。

   ```java
   public class OverdraftState extends AccountState {
       public OverdraftState(AccountState state) {
           this.acc = state.acc;
       }
   
       @Override
       public void deposit(double amount) {
           acc.setBalance(acc.getBalance() + amount);
           stateCheck();
       }
   
       @Override
       public void withdraw(double amount) {
           acc.setBalance(acc.getBalance() - amount);
           stateCheck();
       }
   
       @Override
       public void computeInterest() {
           System.out.println("计算利息！");
       }
   
       // 状态转换
       @Override
       public void stateCheck() {
           if (acc.getBalance() > 0) {
               acc.setState(new NormalState(this));
           } else if (acc.getBalance() == -2000) {
               acc.setState(new RestrictedState(this));
           } else if (acc.getBalance() < -2000) {
               System.out.println("操作受限！");
           }
       }
   }
   ```

   

5. RestrictedState：受限状态类，充当具体状态类。

   ```java
   public class RestrictedState extends AccountState {
       public RestrictedState(AccountState state) {
           this.acc = state.acc;
       }
   
       @Override
       public void deposit(double amount) {
           acc.setBalance(acc.getBalance() + amount);
           stateCheck();
       }
   
       @Override
       public void withdraw(double amount) {
           System.out.println("账号受限，取款失败");
       }
   
       @Override
       public void computeInterest() {
           System.out.println("计算利息！");
       }
   
       // 状态转换
       @Override
       public void stateCheck() {
           if (acc.getBalance() > 0) {
               acc.setState(new NormalState(this));
           } else if (acc.getBalance() > -2000) {
               acc.setState(new OverdraftState(this));
           }
       }
   }
   ```

   

6. Client：客户端测试类。

   ```java
   public class Client {
       public static void main(String[] args) {
           Account acc = new Account("段誉", 0.0);
           acc.deposit(1000);
           acc.withdraw(2000);
           acc.deposit(3000);
           acc.withdraw(4000);
           acc.withdraw(1000);
           acc.computerInterest();
       }
   }
   ```

### 结果及分析

```tex
段誉开户，初始金额为0.0
段誉存款1000.0
现在余额为1000.0
现在账户状态为com.wangyq.state.NormalState
-------------------------------------------------
段誉取款2000.0
现在余额为-1000.0
现在账户状态为com.wangyq.state.OverdraftState
--------------------------------------------------
段誉存款3000.0
现在余额为2000.0
现在账户状态为com.wangyq.state.NormalState
-------------------------------------------------
段誉取款4000.0
现在余额为-2000.0
现在账户状态为com.wangyq.state.RestrictedState
--------------------------------------------------
段誉取款1000.0
账号受限，取款失败
现在余额为-2000.0
现在账户状态为com.wangyq.state.RestrictedState
--------------------------------------------------
计算利息！
```

客户端代码中3次调用取款方法 withdraw() 的输出结构，由于对象状态不一样，因此这3次输出结果均有所差异。第一次取款后账户状态由正常状态（Normal State）变为透支状态（Overdraft State）；第二次取款后账户状态由正常状态（Normal State）变为受限状态（Restricted State）；在第三次取款时，由于账户状态此时已经为受限状态，因此取款失败。这3次取款操作体现了对象在不同状态下具有不同的行为，而且对象的转换是自动的，客户端无需关心其转换细节。

## 状态模式优点

1. 状态模式封装了状态的转换规则，在状态模式中可以将状态的转换代码封装在环境类或者具体状态类中，可以对状态转换代码进行集中管理，而不是分散在一个个业务方法中。
2. 状态模式将所有与某个状态有关的行为放到一个类中，只需要注入一个不同的状态对象即可是环境对象拥有不同的行为。
3. 状态模式允许状态转换逻辑与状态对象合成一体，而不是提供一个巨大的条件语句块，状态模式可以避免使用庞大的条件语句将业务方法和状态转换代码交织在一起。
4. 状态模式可以让多个环境对象共享一个状态对象，从而减少系统中对象的个数。

## 状态模式缺点

1. 状态模式会增加系统中类和对象的个数，导致系统运行开销增大。
2. 状态模式的结构与实现都较为复杂，如果使用不当将导致程序结构和代码的婚礼，增加系统设计的难度。
3. 状态模式对开闭原则的支持并不太好，增加新的状态类需要修改那些负责状态转换的源代码，否则无法转换到新增状态；而且修改某个状态类的行为也需要修改对应类的源代码。

## 状态模式适用环境

1. 对象的行为依赖于它的状态（例如某些属性值），状态的改变将导致行为的变化。
2. 在代码中包含大量与对象状态有关的条件语句，这些条件语句的出现会导致代码的可维护性和灵活性变差，不能方便地增加和删除状态，并且导致客户类与类库之间的耦合增强。
