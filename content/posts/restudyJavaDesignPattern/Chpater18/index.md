+++
title = '18-解释器模式'
date = 2024-08-17T16:01:33+08:00
lastmod = 2024-08-17T16:01:33+08:00
tags = ['java', '设计模式']
categories = ['Java设计模式']
draft = false

+++

## 解释器模式概述

解释器模式是一种使用频率相对较低且学习难度相对较大的设计模式，它用于描述如何使用面向对象语言构成一个简单的语言解释器。

> **解释器模式**：给定一个语言，定义它的文法的一种表示，并定义一个解释器，这个解释器使用该表示来解释语言中的句子。
>
> **Interpreter Pattern**：Given a language, define a representation for its grammar along with an interpreter that uses the representation to interpret sentences in the language.

## 文法规则和抽象语法树

解释器模式描述了如何为简单的语言定义一个文法，如何在该语言中表示一个句子以及如何解释这些句子。

在加法/减法解释器中，每一个输入表达式（例如“1+2+3-4+1”）都包含了3个语言单位，可以使用以下文法规则来定义：

```
expression ::= value | operation
operation ::= expression '+' expression | expression '-' expression
value ::= an integer // 一个整数值
```

该文法规则包含3条语句，每一条表示表达式的组成方式，其中 value 和 operation 是后面两个语言单位的定义，每一条语句所定义的字符串（如 operation 和 value）称为语言构造成分或语言单位，符号“::=”是“定义为”的意思，其左边的语言单位通过右边来进行说明和定义，语言单位对应终结符表达式和非终结符表达式。例如本规则中的 operation 是非终结符表达式，它的组成元素仍然可以是表达式，可以进一步分解，而 value 是终结符表达式，它的组成元素是最基本的语言单位，不能再进行分解。

在文法规则定义中可以使用一些符号来表示不同的含义，例如使用“|”表示或、使用“{”和“}”表示组合、使用“*”表示出现 0 次或多次等，其中使用频率最高的符号是表示“或”关系的“|”。

除了使用文法规则来定义一个语言外，在解释器模式中还可以通过一种称为抽象语法树（Abstract Syntax Tree，AST）的图像方式来直观地表示语言的构成，每一棵抽象语法树对应一个语言实例，例如“1+2+3-4+1”可以通过下图表示：

![image-20240817163125545](./image/image-20240817163125545.png '抽象语法树示意图')

在该抽象语法树中可以通过终结符表达式 value 和非终结符表达式 operation 组成复杂的语句，每个文法规则的语言实例都可以表示为一个抽象语法树。抽象语法树描述了如何构成一个复杂的句子，通过对抽象语法树的分析可以识别出语言中的终结符类和非终结符类。

## 解释器模式结构

由于表达式可分为终结符表达式和非终结符表达式，因此解释器模式的结构与组合模式的结构有些类似，但在解释器模式中包含更多的组成元素，他的结构如下图所示：

![image-20240817164350904](./image/image-20240817164350904.png '解释器模式结构图')

1. **AbstractExpression（抽象表达式）**：在抽象表达式中声明了抽象的解释操作，它是所有终结表达式和非终结表达式的公共父类。
2. **TerminalExpression（终结符表达式）**：终结符表达式是抽象表达式的子类，它实习了与文法中的终结符相关联的解释操作，在句子中的每一个终结符都是该类的一个实例。通常在一个解释器模式中只有少数几个终结符表达式累，它们的实例可以通过非终结表达式组成较为复杂的句子。
3. **NoterminalExpression（非终结符表达式）**：非终结符表达式也是抽象表达式的子类，它实现了文法中非终结符的解释操作，由于在非终结符表达式中可以包含终结符表达式，也可以继续包含非终结符表达式，因此其解释操作一般通过递归的方式完成。
4. **Context（环境类）**：环境类又称为上下文类，它用于存储解释器之外的一些全局信息，通常它临时存储了需要解释的语句。

## 解释器模式实现

在解释器模式中每一种终结符和非终结符都有一个具体类与之对应，正因为使用类来表示每一条文法规则，所以系统将具有较好的灵活性和可扩展性。

对于所有的终结符和非终结符，首先需要抽象出一个公共父类，即抽象表达式。代码如下：

```java
public abstract class AbstractExpression {
    public abstract void interpret(Context ctx);
}
```

终结符表达式类和非终结符表达式类都是抽象表达式类的子类，对于终结符表达式类，其代码很简单，主要是对终结符元素的处理。代码如下：

```java
public class TerminalExpression extends AbstractExpression {
    public void interpret(Context ctx) {
        // 终结符表达式的解释操作
    }
}
```

对于非终结符表达式，其代码相对比较复杂，因为可以通过非终结符将表达式组合成更加复杂的结构，对于包含两个操作元素的非终结符表达式类，其典型代码如下：

```java
public class NoterminalExpression extends AbstractExpression {
    private AbstractExpression left;
    private AbstractExpression right;
    
    public NoterminalExpression(AbstractExpression left, AbstractExpression right) {
        this.left = left;
        this.right = right;
    }
    
    public void interpret(Context ctx) {
        // 递归调用每一个组成部分的 interpret() 方法
        // 在递归调用时指定组成部分的连接方式，即非终结符的功能
    }
}
```

除了上述用于表示表达式的类意外，通常在解释器模式中还提供了一个环境类 Context，用于存储一些全局信息，在环境类汇总一般包含了一个 HashMap 或 ArrayList 等类型的集合信息，存储一系列公共信息，例如变量名与值的映射关系（key/value）等，用于在执行具体的解释操作时从中获取相关信息。代码如下：

```java
public class Context {
    private HashMap<String, String> map = new HashMap<String, String>();
    
    public void assign(String key, String value) {
        // 往环境类中设值
        map.put(key, value);
    }
    
    public String lookup(String key) {
        // 获取存储在环境类中的值
        return map.get(key);
    }
}
```

环境类 Context 的对象通常作为参数被传递到所有表达式的解释方法 interpret() 中，可以在环境类对象中存储和访问表达式解释器的状态，向表达式解释器提供一些全局的、公共的数据，此外还可以在环境类中增加一些所有表达式解释器共有的功能，已减轻解释器的职责。当系统无需提供全局公共信息时可以省略环境类，根据实际情况决定是否需要环境类。

## 解释器模式应用实例

### 实例说明

某软件公司要开发一套机器人控制程序，在该机器人控制程序中包含一些简单的英文控制指令，每一个指令对应一个表达式（expression），该表达式可以是简单表达式也可以是复合表达式，每一个简单表达式也可以是复合表达式，每一个简单表达式由移动方向（direction），移动方式（action）和移动距离（distance）3部分组成，其中移动方向包括上（up）、下（down）、左（left）、右（right）；移动方式包括移动（move）和快速移动（run）；移动距离为一个正整数。两个表达式之间可以通过与（and）连接形成复合（composite）表达式。

用户通过对图形化的设置界面进行操作可以创建一个机器人控制指令，机器人在收到指令后将按照指令的设置进行移动，例如输入控制指令“up move 5”，则“向上移动 5 个单位”；输入控制指令“down run 10 and left move 20”，则“向下快速移动 10 个单位再向左移动 20 个单位”。

现使用解释器模式来设计该程序并模拟实现。

### 实例分析

根据上述需求描述用形式化语言表示该简单语言的文法规则如下：

```tex
expression ::= direction action distance | composite     // 表达式
composite ::= expression 'and' expression                // 复合表达式
direction ::= 'up' | 'down' | 'left' | 'right'           // 移动方向
action ::= 'move' | 'run'                                // 移动方式
distance ::= an integer                                  // 移动距离
```

该语言移动定义了 5 条文法规则，对应 5 个语言单位，这些语言单位可以分为两类，一类为终结符（也称为终结符表达式），例如 direction、action 和 distance，它们是语言的最小组成单位，不能再进行拆分；另一类为非终结符（也称为非终结符表达式），例如 expression 和 composite，它们都是一个完整的句子，包含一些列终结符和非终结符。

可以通过抽象语法树来表示具体解释过程，如下图所示：

![image-20240819144142881](./image/image-20240819144142881.png '机器人控制程序抽象语法树实例')

机器人控制程序实例的基本结构如图所示：

![image-20240819144637902](./image/image-20240819144637902.png '机器人控制程序结构图')

AbstractNode 充当抽象表达式角色，DirectionNode、ActionNode 和 DistanceNode 充当终结符表达式角色，AndNode 和 SentenceNode 充当非终结符表达式角色。

### 实例代码

1. **AbstractNode**：抽象结点类，充当抽象表达式角色。

   ```java
   public abstract class AbstractNode {
       public abstract String interpret();
   }
   ```

   

2. **AndNode**：And 结点类，充当非终结符表达式角色。

   ```java
   public class AndNode extends AbstractNode {
       private AbstractNode left; // And的左表达式
       private AbstractNode right; // And的右表示式
   
       public AndNode(AbstractNode left, AbstractNode right) {
           this.left = left;
           this.right = right;
       }
   
       // And 表达式解释操作
       @Override
       public String interpret() {
           return left.interpret() + "再" + right.interpret();
       }
   }
   ```

   

3. **SentenceNode**：简单句子节点类，充当非终结符表达式角色。

   ```java
   public class SentenceNode extends AbstractNode {
       private AbstractNode direction;
       private AbstractNode action;
       private AbstractNode distance;
   
       public SentenceNode(AbstractNode direction, AbstractNode action, AbstractNode distance) {
           this.direction = direction;
           this.action = action;
           this.distance = distance;
       }
   
       // 简单句子的解释操作
       @Override
       public String interpret() {
           return direction.interpret() + action.interpret() + distance.interpret();
       }
   }
   ```

   

4. **DirectionNode**：方向结点类，充当终结符表达式角色。

   ```java
   public class DirectionNode extends AbstractNode {
       private String direction;
   
       public DirectionNode(String direction) {
           this.direction = direction;
       }
   
       // 方向表达式的解释操作
       @Override
       public String interpret() {
           if (direction.equalsIgnoreCase("up")) {
               return "向上";
           } else if (direction.equalsIgnoreCase("down")) {
               return "向下";
           } else if (direction.equalsIgnoreCase("left")) {
               return "向左";
           } else if (direction.equalsIgnoreCase("right")) {
               return "向右";
           } else {
               return "无效指令";
           }
       }
   }
   ```

   

5. ActionNode：动作结点类，充当终结符表达式角色。

   ```java
   public class ActionNode extends AbstractNode {
       private String action;
   
       public ActionNode(String action) {
           this.action = action;
       }
   
       // 动作（移动方式）表达式的解释操作
       @Override
       public String interpret() {
           if (action.equalsIgnoreCase("move")) {
               return "移动";
           } else if (action.equalsIgnoreCase("run")) {
               return "快速移动";
           } else {
               return "无效指令";
           }
       }
   }
   ```

   

6. DistanceNode：距离结点类，充当终结符表达式角色。

   ```java
   public class DistanceNode extends AbstractNode {
       private String distance;
   
       public DistanceNode(String distance) {
           this.distance = distance;
       }
   
       // 距离表达式的解释操作
       @Override
       public String interpret() {
           return this.distance;
       }
   }
   ```

   

7. InstructionHandler：指令处理类，工具类，提供相应的方法对输入指令进行处理。它将输入指令分割为字符串数组，将第一个、第二个和第三个单词组合成一个句子，并存入栈中；如果发现单词有“and”，则将“and”后的第一个、第二个和第三个单词组合成一个新的句子作为“and”的右表达式，并从栈中取出原先所存的句子作为左表达式，然后组合成一个 And 结点存入栈中。依次类推，直到整个指令解析结束。

   ```java
   public class InstructionHandler {
       private AbstractNode node;
   
       public void handle(String instruction) {
           AbstractNode left = null, right = null;
           AbstractNode direction = null, action = null, distance = null;
           Stack<AbstractNode> stack = new Stack<AbstractNode>();  // 声明一个栈对象用于存储抽象语法树
           String[] words = instruction.split(" ");  // 以空格分割指令字符串
           for (int i = 0; i < words.length; i++) {
               if (words[i].equalsIgnoreCase("and")) {
                   left = (AbstractNode) stack.pop();  // 弹出栈顶表达式作为左表达式
                   String word1 = words[++i];
                   direction = new DirectionNode(word1);
                   String word2 = words[++i];
                   action = new ActionNode(word2);
                   String word3 = words[++i];
                   distance = new DistanceNode(word3);
                   right = new SentenceNode(direction, action, distance); // 右表达式
                   stack.push(new AndNode(left, right));  // 将新表达式压入栈中
               }
               // 如果是从头开始进行解释，则将前3个单词组成一个简单句子 SentenceNode 并将该句子压入栈中
               else {
                   String word1 = words[i];
                   direction = new DirectionNode(word1);
                   String word2 = words[++i];
                   action = new ActionNode(word2);
                   String word3 = words[++i];
                   distance = new DistanceNode(word3);
                   left = new SentenceNode(direction, action, distance);
                   stack.push(left); // 将新表达式压入栈中
               }
           }
           this.node = (AbstractNode) stack.pop(); // 将表达式从栈中弹出
       }
   
       public String output() {
           String result = node.interpret(); // 解释表达式
           return result;
       }
   }
   ```

   

8. Client：客户端测试类。

   ```java
   public class Client {
       public static void main(String[] args) {
           String instruction = "down run 10 and left move 20";
           InstructionHandler handler = new InstructionHandler();
           handler.handle(instruction);
   
           String outString;
           outString = handler.output();
           System.out.println(outString);
       }
   }
   ```

### 结果及分析

```tex
向下快速移动10再向左移动20
```

简单的解释器模式就完成了。

## 优点

1. 易于改变和扩展文法。
2. 每一条文法规则都可以表示一个类，因此可以方便地实现一个简单的语言。
3. 实现文法较为容易。
4. 增加新的解释表达式较为方便。

## 缺点

1. 对于复杂文法难以维护。
2. 执行效率较低。

## 适用环境

1. 可以将一个需要解释执行的语言中的句子表示为一棵抽象语法树。
2. 一些重复出现的问题可以用一种简单的语言进行表达。
3. 一个语言的文法较为简单。
4. 执行效率不是关键问题。
