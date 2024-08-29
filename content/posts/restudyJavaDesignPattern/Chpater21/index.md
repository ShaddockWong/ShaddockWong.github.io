+++
title = '21-备忘录模式'
date = 2024-08-26T14:04:56+08:00
lastmod = 2024-08-26T14:04:56+08:00
tags = ['java', '设计模式']
categories = ['Java设计模式']
draft = false

+++

## 备忘录模式概述

备忘录模式通过了一种状态恢复的视线机制，使得用户可以方便地回到一个特定的历史步骤，当前的状态无效或者存在问题时可以使用暂时存储起来的备忘录将状态复原，当前在很多软件所提供的撤销（Undo）操作中就使用了备忘录模式。

> **备忘录模式**：在不破坏的前提下捕获一个对象的内部状态，并在该对象之外保存这个状态，这样可以在以后将对象恢复到原先保存的状态。
>
> **Memento Pattern**: Without violating encapsulation, capture and externalize an object's internal state so that the object can be restored to this state later.

备忘录模式是一种对象行为型模式，其别名为标记（Token）模式。

## 备忘录模式结构

备忘录模式的核心是备忘录类（memento）以及用于管理备忘录的负责人类（Caretaker）的设计，其结构如图所示：

![image-20240826162431150](./image/image-20240826162431150.png '备忘录模式结构图')

1. **Originator（原发器）**：原发器是一个普通类，它通过创建一个备忘录来存储当前内部状态，也可以使用备忘录来恢复其内部状态，一般将系统中需要保存内部状态的类设计为原发器。
2. **Memento（备忘录）**：备忘录用于存储原发器的内部状态，根据原发器决定保存那些内部状态。备忘录的设计一般可以参考原发器的设计，根据实际需要确定备忘录类中的属性。需要注意的是，除了原发器本身与负责人类之外，备忘录对象不能直接供其他类使用，原发器的设计在不同的变成语言中实现机制会有所不同。
3. **Caretaker（负责人）**：负责人又称为管理者，它负责保存备忘录，但是不能对备忘录的内容进行操作或检查。在负责人中可以存储一个或多个备忘录对象，它只负责存储对象，而不能修改对象，也无需知道对象的实现细节。

## 备忘录模式实现

备忘录模式的关键在于如何设计备忘录类和负责人类。鱿鱼仔备忘录中存储的是原发器的中间状态，因此需要防止原发器以外的其他对象访问备忘录。

在使用备忘录模式时首先应该存在一个原发器类 Originator。在真实业务中，原发器类是一个具体的业务类，它包含一些用于存储成员数据的属性。其典型代码如下：

```java
public class Originator {
    private String state;
    
    public Originator(String state) {
        this.state = state;
    }
    
    // 创建一个备忘录对象
    public Memento createMemento() {
        return new Memento(this);
    }
    
    // 根据备忘录对象恢复原发器状态
    public void restoreMemento(Memento m) {
        state = m.state;
    }
    
    public void setState(String state) {
        this.state = state;
    }
    
    public String getState() {
        return this.state;
    }
} 
```

对于备忘录类 Memento 而言，它通常提供了与原发器相对应的属性（可以是全部，也可以是部分）用于存储原发器的状态。典型的备忘录类代码如下：

```java
// 备忘录类，默认可见性，包内可见
class Memento {
    private String state;
    
    public Memento(Originator o) {
        state = o.getState();
    }
    
    public void setState(String state) {
        this.state = state;
    }
    
    public String getState() {
        return this.state;
    }
}
```

在设计备忘录类时需要考虑其封装性，除了 Originator 类，不允许其他类来调用备忘录类 Memento 的构造函数和相关方法。如果不考虑封装性，允许其他类调用 setState() 等方法，将导致在备忘录中保存的历史状态发生改变，通过撤销操作所恢复的状态就不再是真实的历史状态，备忘录模式也就失去了本身的意义。

对于负责人类 Caretaker，它用于保存备忘录对象，并提供 getMemento() 方法用于想客户端返回一个备忘录对象，原发器通过使用这个备忘录对象可以回到某个历史状态。典型的负责人类的代码如下：

```java
public class Cretaker {
    private Memento memento;
    
    public Memento getMemento() {
        return memento;
    }
    
    public void setMemento(Memento memento) {
        this.memento = memento;
    }
}
```

在 Caretaker 类中不应该直接调用 Memento 中的状态改变方法，他的作用仅仅是存储备忘录对象。将原发器备份生产的备忘录对象存储在其中，当用户需要对原发器进行恢复时再将存储在其中的备忘录对象取出。

在客户端中可以通过创还能 Memento 对象来保存原发器的历史状态，在需要的时候再用历史状态来覆盖当前状态，客户端演示代码如下：

```java
public class Client {
    public static void main(String args[]) {
        // 创建原发器对象
        Originator ori = new Originator("状态(1)");
        System.out.println(ori.getState());
        
        // 创建负责人对象，保存创建的备忘录对象
        Caretaker ct = new Caretaker();
        ct.setMemento(ori.createMemento());
        
        ori.setState("状态(2)");
        System.out.println(ori.getState());
        
        // 从负责人对象中取出备忘录对象，实现撤销
        ori.restoreMemento(ct.getMemento());
        System.out.println(ori.getState());
    }
}
```

输出结果如下：

```tex
状态(1)
状态(2)
状态(1)
```

## 备忘录模式应用实例

### 实例说明

某软件公司要使用 Java 语言开发一款可以运行在 Android 平台的触摸式中国象棋软件，由于考虑到有些用户是“菜鸟”，经常不小心走错棋；还有些用户因为不习惯使用手指在手机屏幕上拖动棋子，常常出现操作失误，因此该中国象棋要提供“悔棋”功能，用户走错棋或操作失误后可以恢复到前一个步骤。

为了实现“悔棋”功能，现使用备忘录模式来设计该中国象棋软件。

### 实例类图

![image-20240827163503461](./image/image-20240827163503461.png '中国象棋棋子撤销功能结构图')

### 实例代码

1. Chessman：象棋其子类，充当原发器。

   ```java
   public class Chessman {
       private String label;
       private int x;
       private int y;
   
       public Chessman(String label, int x, int y) {
           this.label = label;
           this.x = x;
           this.y = y;
       }
   
       public String getLabel() {
           return label;
       }
   
       public void setLabel(String label) {
           this.label = label;
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
   
       // 保存状态
       public ChessmanMemento save() {
           return new ChessmanMemento(this.label, this.x, this.y);
       }
   
       // 恢复状态
       public void restore(ChessmanMemento memento){
           this.label = memento.getLabel();
           this.x = memento.getX();
           this.y = memento.getY();
       }
   }
   ```

   

2. ChessmanMemento：象棋棋子备忘录类，充当备忘录。

   ```java
   public class ChessmanMemento {
       private String label;
       private int x;
       private int y;
   
       public ChessmanMemento(String label, int x, int y) {
           this.label = label;
           this.x = x;
           this.y = y;
       }
   
       public String getLabel() {
           return label;
       }
   
       public void setLabel(String label) {
           this.label = label;
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

   

3. MementoCaretaker：象棋棋子备忘录管理类，充当负责人。

   ```java
   public class MementoCaretaker {
       private ChessmanMemento memento;
   
       public ChessmanMemento getMemento() {
           return memento;
       }
   
       public void setMemento(ChessmanMemento memento) {
           this.memento = memento;
       }
   }
   ```

4. Client：客户端测试类。

   ```java
   public class Client {
       public static void main(String[] args) {
           MementoCaretaker mc = new MementoCaretaker();
           Chessman chess = new Chessman("车", 1, 1);
           display(chess);
           mc.setMemento(chess.save());        // 保存状态
           chess.setY(4);
           display(chess);
           mc.setMemento(chess.save());        // 保存状态
           chess.setX(5);
           display(chess);
           System.out.println("**********悔棋**********");
           chess.restore(mc.getMemento());     // 恢复状态
           display(chess);
       }
   
       public static void display(Chessman chess) {
           System.out.println("棋子" + chess.getLabel() + "当前位置为：第" + chess.getX() + "行 第" + chess.getY() + "列.");
       }
   }
   ```

### 结果及分析

输出结果如下：

```tex
棋子车当前位置为：第1行 第1列.
棋子车当前位置为：第1行 第4列.
棋子车当前位置为：第5行 第4列.
**********悔棋**********
棋子车当前位置为：第1行 第4列.
```

## 实现多次撤销

在负责人类中定义一个集合来存储多个备忘录，每个备忘录负责保存一个历史状态，在撤销时可以对备忘录集合进行逆向遍历，回到一个指定的历史状态，而且还可以对备忘录集合进行正向遍历，实现重做（Redo）或恢复操作，即取消撤销，让对象状态得到恢复。

![image-20240827174419740](./image/image-20240827174419740.png '改进之后的中国象棋棋子撤销功能结构图')

对负责人类 MementoCaretaker 进行了修改，在其中定义了一个 ArrayList 类型的集合对象来存储多个备忘录，其代码如下：

```java
public class MementoCaretaker {
    // 定义一个集合来存储多个备忘录
    private ArrayList<ChessmanMemento> mementoList = new ArrayList<ChessmanMemento>();

    public ChessmanMemento getMemento(int i) {
        return mementoList.get(i);
    }

    public void setMemento(ChessmanMemento memento) {
        mementoList.add(memento);
    }
}
```

客户端测试代码修改如下：

```java
public class Client {
    private static int index = -1;          // 定义一个索引来记录当前状态所在的位置
    private static MementoCaretaker mc = new MementoCaretaker();

    public static void main(String[] args) {
        Chessman chess = new Chessman("车", 1, 1);
        play(chess);
        chess.setY(4);
        play(chess);
        chess.setX(5);
        play(chess);
        undo(chess, index);
        undo(chess, index);
        redo(chess, index);
        redo(chess, index);
    }

    // 下棋
    public static void play(Chessman chess) {
        mc.setMemento(chess.save());
        index++;
        System.out.println("棋子" + chess.getLabel() + "当前位置为：第" + chess.getX() + "行 第" + chess.getY() + "列.");
    }

    // 悔棋
    public static void undo(Chessman chess, int i) {
        System.out.println("********悔棋********");
        index--;
        chess.restore(mc.getMemento(i - 1));  // 撤销到上一个备忘录
        System.out.println("棋子" + chess.getLabel() + "当前位置为：第" + chess.getX() + "行 第" + chess.getY() + "列.");
    }

    // 撤销悔棋
    public static void redo(Chessman chess, int i) {
        System.out.println("********撤销悔棋********");
        index++;
        chess.restore(mc.getMemento(i + 1)); // 恢复到下一个备忘录
        System.out.println("棋子" + chess.getLabel() + "当前位置为：第" + chess.getX() + "行 第" + chess.getY() + "列.");
    }
}
```

输出结果如下：

```tex
棋子车当前位置为：第1行 第1列.
棋子车当前位置为：第1行 第4列.
棋子车当前位置为：第5行 第4列.
********悔棋********
棋子车当前位置为：第1行 第4列.
********悔棋********
棋子车当前位置为：第1行 第1列.
********撤销悔棋********
棋子车当前位置为：第1行 第4列.
********撤销悔棋********
棋子车当前位置为：第5行 第4列.
```

在实际开发中可以使用链表或者堆栈来处理有分支的对象状态改变。

## 备忘录模式优点

1. 提供了一种状态回复的实现机制，使得用户可以方便地回到一个特定的历史步骤，当新的状态无效或者存在问题时可以使用暂时存储起来的备忘录将状态复原。
2. 备忘录实现了对信息的封装，一个备忘录对象是一种原发器对象状态的表示，不会被其他代码所改动。备忘录保存了原发器的状态，采用列表、堆栈等集合来存储备忘录对象可以实现多次撤销操作。

## 备忘录模式缺点

资源消耗过大，如果需要保存的原发器类的成员变量太多，就不可避免地需要占用大量的存储空间，每保存一次对象的状态都需要消耗一定的系统资源。

## 备忘录模式适用环境

1. 保存一个对象在某一个时刻的全部状态或部分状态，这样以后需要时它能够恢复到原先的状态，实现撤销操作。
2. 防止外界对象破坏一个对象历史状态的封装性，避免将对象历史状态的视线细节暴露给外界对象。
