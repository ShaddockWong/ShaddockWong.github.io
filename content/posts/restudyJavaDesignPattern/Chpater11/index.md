+++
title = '11-组合模式'
date = 2024-07-22T11:09:59+08:00
lastmod = 2024-07-22T11:09:59+08:00
tags = ['java', '设计模式']
categories = ['Java设计模式']
draft = false

+++

## 组合模式概述

![image-20240722134042261](./image/image-20240722134042261.png '树形目录结构示意图')

对于所有与目录结构相类似的树形结构，当容器对象（例如文件夹）的某一个方法被调用时，将遍历整个树形结构，寻找包含这个方法的成员对象（可以是容器对象，也可以是叶子对象，例如子文件夹和文件）并调用执行，牵一而动百，其中是用了递归调用的机制对整个结构进行处理。

组合模式通过一种巧妙的设计方案使得用户可以一致性地处理整个树形结构或者树形结构的一部分，它描述了如何将容器对象和叶子对象进行递归组合，使得用户在使用时无需对他们进行区分，可以一致地对待容器对象和叶子对象，这就是组合模式的模式动机。

> **组合模式**：组合多个对象形成树形结构以表示具体部分-整体关系的层次结构。组合模式让客户端可以统一对待单个对象和组合对象。
>
> **Composite Pattern**: Compose objects into tree structures to represent part-whole hierarchies. Composite lets clients treat individual objects and compositions of objects uniformly.

组合模式又称“部分-整体”（Part-Whole）模式，属于对象结构型模式，它将对象组织到树形结构中，可以用来描述整体与部分的关系。

## 组合模式结构

![image-20240722134138909](./image/image-20240722134138909.png '组合模式结构图')

组合模式包含以下 3 个角色：

1. **Component（抽象构件）**：它可以是结构或抽象类，为叶子构件和容器构件对象声明接口，在该角色中可以包含所有字类共有行为的声明和实现。在抽象构件中定义了访问及管理它的子构件的方法，如增加子构件、删除子构件、获取子构件。
2. **Leaf（叶子构件）**：它在组合结构中表示叶子结点对象，叶子结点没有子结点，它实现了在抽象构件中定义的行为。对于那些访问及管理子构件的方法，可以通过抛出异常、提示错误等方式进行处理。
3. **Composite（容器构件）**：它在组合结构中表示容器结点对象，容器结点包含子节点，其子节点可以是叶子结点，也可以是容器结点，它提供了一个结合用于存储子结点，实现了在抽象构件中定义的行为，包括哪些访问及管理子构件的方法，在其业务方法中可以递归调用其子结点的业务方法。

## 组合模式实现

组合模式的关键在于定义了一个抽象构建类，它既可以代表叶子，又可以代表容器，客户端针对该抽象构件类进行编程，无需知道它到底表示的是叶子还是容器，可以对其进行统一处理。同时容器对象和抽象构件类之间还建立一个聚合关联关系，在容器对象中既可以包含叶子，又可以包含容器，以此实现递归组合，形成一个树形结构。

如果不使用组合模式，客户端代码将过多地依赖于容器对象复杂的内部实现结构，容器对象内部实现结构的变化将引起客户代码的频繁变化，造成代码维护困难，可扩展性差等问题，组合模式的使用将在一定程度常解决这些问题。

对于组合模式中的抽象构件角色，其典型代码如下：

```java
public abstract class Component {
    public abstract void add(Component c);			// 增加成员
    public abstract void remove(Componet c);		// 删除成员
    public abstract Component getChild(int i);		// 获取成员
    public abstract void operation();				// 业务方法
}
```

一般将抽象构件类设计为接口或抽象类，将所有字类共有方法的声明和实现放在抽象构件类中。对于客户端而言，将针对抽象构件编程，而无需关心其具体子类是容器构件还是叶子构件。

如果继承抽象构件的是叶子构件，其典型代码如下：

```java
public class Leaf extends Component {
    public void add(Componet c) {
        // 异常处理或错误提示
    }
    
    public void remove(Component c) {
        // 异常处理或错误提示
    }
    
    public Component getChild(int i) {
        // 异常处理或错误提示
        return null;
    }
    
    public void operation() {
        // 叶子构件具体业务方法的实现
    } 
}
```

作为抽象构件类的字类，在叶子构件中需要实现在抽象构件类中声明的所有方法，包括业务以及管理和访问子构件的方法，但是叶子构件不能再包含子构件，因此在叶子构件中实现子构件管理和访问方法时需要提供异常处理和错误提示。显然，这会给叶子构件的实现带来麻烦。

如果继承抽象构件的是容器构件，其典型代码如下：

```java
import java.util.*;

public class Composite extends Component {
    private ArrayList<Component> list = new  ArrayList<Component>();
    
    public void add(Component c) {
        list.add(c);
    }
    
    public void remove(Component c) {
        list.remove(c);
    }
    
    public Component getChild(int i) {
		return (Component)list.get(i);
    }
    
    public void operation() {
        // 容器构件具体业务方法的实现，将递归调用成员构件的业务方法
        for(Object obj:list) {
            ((Component)obj).operation();
        }
    } 
}
```

在组合模式结构中，由于容器构件中仍然可以包含容器构件，因此在对容器构件进行处理时，需要使用递归算法，即在容器构件的 operation() 方法中递归调用其成员构件的 operation() 方法。

## 组合模式应用实例

### 实例说明

某软件公司要开发一个杀毒（Antivirus）软件，该软件既可以对某个文件夹（Folder）杀毒，也可以对某个指定的文件（File）杀毒。该杀毒软件还可以根据各类文件的特点为不同类型的文件提供不同的杀毒方式，例如图像文件（ImageFile）和文本文件（TextFile）的杀毒方式就有所差异。现使用组合模式来设计该杀毒软件的整体框架。

### 实例类图

![image-20240722155419612](./image/image-20240722155419612.png '杀毒软件框架设计结构图')

AbstractFile 充当抽象构件类，Folder 充当容器构件类，ImageFile、TextFile 和 VideoFile 充当叶子构件类。

### 实例代码

1. AbstractFile：抽象文件类 ，充当抽象构件类。

   ```java
   public abstract class AbstractFile {
       public abstract void add(AbstractFile file);
       public abstract void remove(AbstractFile file);
       public abstract AbstractFile getChild(int i);
       public abstract void killVirus();
   }
   ```

   

2. ImageFile：图像文件类，充当叶子构件类。

   ```java
   public class ImageFile extends AbstractFile {
       private String name;
   
       public ImageFile(String name) {
           this.name = name;
       }
   
       @Override
       public void add(AbstractFile file) {
           System.out.println("对不起，不支持该方法！");
       }
   
       @Override
       public void remove(AbstractFile file) {
           System.out.println("对不起，不支持该方法！");
       }
   
       @Override
       public AbstractFile getChild(int i) {
           System.out.println("对不起，不支持该方法！");
           return null;
       }
   
       @Override
       public void killVirus() {
           // 模拟杀毒
           System.out.println("---- 对图像文件'" + name + "'进行杀毒");
       }
   }
   ```

   

3. TextFile：文本文件类，充当叶子构件类。

   ```java
   public class TextFile extends AbstractFile {
       private String name;
   
       public TextFile(String name) {
           this.name = name;
       }
   
       @Override
       public void add(AbstractFile file) {
           System.out.println("对不起，不支持该方法！");
       }
   
       @Override
       public void remove(AbstractFile file) {
           System.out.println("对不起，不支持该方法！");
       }
   
       @Override
       public AbstractFile getChild(int i) {
           System.out.println("对不起，不支持该方法！");
           return null;
       }
   
       @Override
       public void killVirus() {
           // 模拟杀毒
           System.out.println("---- 对文本文件'" + name + "'进行杀毒");
       }
   }
   ```

   

4. VideoFile：视频文件类，充当叶子构件类。

   ```java
   public class VideoFile extends AbstractFile {
       private String name;
   
       public VideoFile(String name) {
           this.name = name;
       }
   
       @Override
       public void add(AbstractFile file) {
           System.out.println("对不起，不支持该方法！");
       }
   
       @Override
       public void remove(AbstractFile file) {
           System.out.println("对不起，不支持该方法！");
       }
   
       @Override
       public AbstractFile getChild(int i) {
           System.out.println("对不起，不支持该方法！");
           return null;
       }
   
       @Override
       public void killVirus() {
           // 模拟杀毒
           System.out.println("---- 对视频文件'" + name + "'进行杀毒");
       }
   }
   ```

   

5. Folder：文件夹类，充当容器构建类。

   ```java
   public class Folder extends AbstractFile {
       // 定义集合 fileList，用于存储 AbstractFile 类型的成员
       private ArrayList<AbstractFile> filesList = new ArrayList<AbstractFile>();
       private String name;
   
       public Folder(String name) {
           this.name = name;
       }
   
       @Override
       public void add(AbstractFile file) {
           filesList.add(file);
       }
   
       @Override
       public void remove(AbstractFile file) {
           filesList.remove(file);
       }
   
       @Override
       public AbstractFile getChild(int i) {
           return filesList.get(i);
       }
   
       @Override
       public void killVirus() {
           System.out.println("**** 对文件夹'" + name + "'进行杀毒"); // 模拟杀毒
   
           // 递归调用成员构件的 killVirus() 方法
           for (Object obj : filesList) {
               ((AbstractFile) obj).killVirus();
           }
       }
   }
   ```

6. Client：客户端测试类。

   ```java
   public class Client {
       public static void main(String[] args) {
           // 针对抽象构件编程
           AbstractFile file1, file2, file3, file4, file5, folder1, folder2, folder3, folder4;
   
           folder1 = new Folder("Sunny 的资料");
           folder2 = new Folder("图像资料");
           folder3 = new Folder("文本资料");
           folder4 = new Folder("视频资料");
   
           file1 = new ImageFile("小龙女.jpg");
           file2 = new ImageFile("张无忌.jpg");
           file3 = new TextFile("九阴真经.txt");
           file4 = new TextFile("葵花宝典.doc");
           file5 = new VideoFile("笑傲江湖.rmvb");
   
           folder2.add(file1);
           folder2.add(file2);
           folder3.add(file3);
           folder3.add(file4);
           folder4.add(file5);
           folder1.add(folder2);
           folder1.add(folder3);
           folder1.add(folder4);
   
           // 从 "Sunny的资料" 结点开始进行杀毒操作
           folder1.killVirus();
       }
   }
   ```

### 结果及分析

输出结果如下：

```tex
**** 对文件夹'Sunny 的资料'进行杀毒
**** 对文件夹'图像资料'进行杀毒
---- 对图像文件'小龙女.jpg'进行杀毒
---- 对图像文件'张无忌.jpg'进行杀毒
**** 对文件夹'文本资料'进行杀毒
---- 对文本文件'九阴真经.txt'进行杀毒
---- 对文本文件'葵花宝典.doc'进行杀毒
**** 对文件夹'视频资料'进行杀毒
---- 对视频文件'笑傲江湖.rmvb'进行杀毒
```

在本实例中，抽象构件类声明了所有方法，包括用于管理和访问子构件的方法，例如 add() 方法和 remove() 方法等，因此在 ImageFile 等叶子构件类中实现这些方法时必须进行相应的异常处理或错误提示。在容器构件类 Folder 的 killVirus() 方法中将递归调用其成员对象的 killVirus() 方法，从而实现对整个树形结构的遍历。

如果需要更换操作结点，例如只对文件夹“文本文件”进行杀毒，客户端代码只需修改一行即可，将代码：

``` java
folder1.killVirus();
```

改为

``` java
folder3.killVirus();
```

在具体实现时可以创建图形化界面让用户来选择所需操作的根结点，无需修改源代码，符合开闭原则，客户端无需关心结点的层次结构，可以对所选结点进行统一处理，提高系统的灵活性。

## 透明组合模式与安全组合模式

### 透明组合模式

在透明组合模式中，抽象构件 Component 中声明了所有用于管理成员对象的方法，包括 add()、remove() 以及 getChild() 等方法，如下图所示，这样做的好处是确保所有的构建类都有相同的接口。在客户端看来，叶子对象与容器对象所提供的方法是一致的。

![image-20240724095449464](./image/image-20240724095449464.png '透明组合模式结构图')

透明组合模式的缺点是不够安全，因为叶子对象和容器对象在本质上是有区别的。叶子对象不可能有下一层的对象，即不可能包含成员对象，因此为其提供 add()、remove() 等方法是没有意义的，这在编译阶段不会出错，但在运行阶段如果调用这些方法可能会出错。

### 安全组合模式

在安全组合模式中，抽象构件 Component 中没有声明任何用于管理成员对象的方法，而是在 Composite 类中声明并实现这些方法。这种做法是安全的，因为根本不向叶子对象提供这些管理成员对象的方法，对于叶子对象，客户端不可能调用到这些方法，如下图所示。

![image-20240724100339449](./image/image-20240724100339449.png '安全组合模式结构图')

安全组合模式的缺点是不够透明，因为叶子构件和容器构件具有不同的方法，且容器构件中那些用于管理成员对象的方法，且容器构件中那些用于管理成员对象的方法没有在抽象构件类中定义，因此客户端不能完全针对抽象编程，必须有区别地对待叶子构件和容器构件。在实际应用中，安全组合模式的使用频率也非常高。

## 组合模式优点

1. 可以清楚地定义分层次的复杂对象，表示对象的全部或部分层次，它让客户端忽略了层次的差异，方便对整个层次进行控制。
2. 客户端可以一致地使用一个组合结构或其中单个对象，不必关心处理的是单个对象还是整个组合结构，简化了客户端代码。
3. 在组合模式中增加了新的容器构件和叶子构件都很方便，无需对现有类库进行任何修改，符合开闭原则。
4. 为树形结构的面向对象实现提供了一种灵活的解决方案，通过叶子对象和容器对象的递归组合可以形成复杂的树形结构，但对树形结构的控制却非常简单。

## 组合模式缺点

在增加新构件时很难对容器中的构件类型进行限制。有时候希望一个容器中只能有某些特定类型的对象，例如在某个文件夹中只能包含文本文件，在使用组合模式时不能依赖类型系统来施加这些约束，因为他们都来自与相同的抽象层，在这种情况下，必须通过在运行时进行类型检查来实现，这个实现过程较为复杂。

## 组合模式适用环境

1. 在具有整体和部分的层次结构中希望通过一种方式忽略整体与部分的差异，客户端可以一致地对待它们。
2. 在一个使用面向对象语言开发的系统中需要处理一个树形结构。
3. 在一个系统中能够分离出叶子对象和容器对象，而且它们的类型不固定，需要增加一些新的类型。

Java SE 中的 AWT 好 Swing 报的设计就基于组合模式，在这些界面包中为用户提供了大量的容器构件（如 Container）和成员构件（如 Checkbox、Button 和 TextComponent 等），其结构如图所示：

![image-20240724104729667](./image/image-20240724104729667.png 'AWT 组合模式结构示意图')
