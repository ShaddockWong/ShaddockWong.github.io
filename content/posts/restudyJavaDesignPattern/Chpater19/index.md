+++
title = '19-迭代器模式'
date = 2024-08-20T11:14:53+08:00
lastmod = 2024-08-20T11:14:53+08:00
tags = ['java', '设计模式']
categories = ['Java设计模式']
draft = false

+++

## 迭代器模式概述

在软件系统中聚合对象拥有两个职责：一是存储数据；二是遍历数据。从依赖性来看，前者是聚合对象的基本职责；而后者既是可变化的，又是可分离的。因此可以将遍历数据的行为从聚合对象中分离出来，封装在迭代器对象中，由迭代器来提供遍历聚合对象内部的数据行为，这将简化聚合对象的设计，更复合单一职责原则的要求。

> **迭代器模式**：提供一种方法顺序访问同一个聚合对象中的各个元素，而又不用暴露该对象的内部表示。
>
> **Iterator Pattern**: Provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation.

迭代器模式又称游标（Cursor）模式，它是一种对象行为型模式。

## 迭代器模式结构

在迭代器模式结构中包含聚合和迭代器两个层次结构，考虑到系统的灵活性和可扩展性，在迭代器模式中应用了工厂方法模式，其模式结构如图所示：

![image-20240820114036180](./image/image-20240820114036180.png '迭代器模式结构图')

1. **Iterator（抽象迭代器）**：它定义了访问和遍历元素的接口，声明了用于遍历数据元素的方法，例如用于获取第一个元素的 first() 方法、用于访问下一个元素的 next() 方法、用于判断是否还有下一个元素的 hasNext() 方法、用于获取当前元素的 currentItem() 方法等，在具体迭代器中将实现这些方法。
2. **ConcreteIterator（具体迭代器）**：它实现了抽象迭代器接口，完成对聚合对象的遍历，同时在具体迭代器中通过游标来记录在聚合对象中所处的当前位置，在具体实现时游标通常是一个表示位置的非负整数。
3. **Aggregate（抽象聚合类）**：它用于存储和管理元素对象，声明一个 createIterator() 方法用于创建一个迭代器对象，充当抽象迭代器工厂角色。
4. **ConcreteAggregate（具体聚合类）**：它是抽象聚合类的子类，实现了在抽象聚合类中声明的 createIterator() 方法，该方法返回一个与该具体聚合类对应的具体迭代器 ConcreteIterator 实例。

## 迭代器模式实现

在迭代器模式中提供了一个外部的迭代器来对聚合对象进行访问和遍历，迭代器定义了一个访问该聚合元素的接口，并且可以跟踪当前遍历的元素，了解那些元素已经遍历过，哪些没有。迭代器的引入将使对一个复杂聚合对象的操作变得简单。

在迭代器模式中应用了工厂方法模式，抽象迭代器对应于抽象产品角色，具体迭代器对应于具体产品角色，抽象聚合类对应于抽象工厂角色，具体聚合类对应于具体工程角色。

在抽象迭代器中声明了用于遍历聚合对象中所存储元素的方法，其典型代码如下：

```java
public interface Iterator {
    public void first();          // 将游标指向第一个元素
    public void next();           // 将游标指向下一个元素
    public boolean hasNext();     // 判断是否存在下一个元素
    public Object currentItem();  // 获取游标指向的当前元素
}
```

在具体迭代器中奖实现抽象迭代器声明的遍历数据的方法，其典型代码如下：

```java
public class ConcreteIterator implements Iterator {
    private ConcreteAggregate objects;  // 维持一个对具体聚合对象的引用，以便于访问存储在聚合对象中的数据
    private int cursor;                 // 定义一个游标，用于记录当前访问位置
    
    public ConcreteIterator(ConcreteAggregate objects) {
        this.objects = objects;
    }
    
    public void first() {...}
    public void next() {...}
    public boolean hasNext() {...}
    public Object currentItem() {...}
}
```

需要注意的是，抽象迭代器接口的设计非常重要，一方面需要充分满足各种遍历操作的要求，尽量为各种遍历方法都提供声明；另一方面有不能包含太多方法，接口中的方法太多将给子类的实现带来麻烦。因此可以考虑使用抽象类来设计抽象迭代器，在抽象类中为每一个方法提供一个空的默认实现。如果需要再具体迭代器中为聚合对象增加全新的遍历操作，则必须修改抽象迭代器的具体迭代器的源代码，这将违反开闭原则，因此在设计时要考虑全面，避免之后修改接口。

聚合类用于存储数据并负责创建迭代器对象，最简单的抽象聚合类代码如下：

```java
public interface Aggregate {
    Iterator createIterator();
}
```

具体聚合类作为抽象聚合类的子类，一方面负责存储数据，另一方面实现了在抽象聚合类中声明的工厂方法 createIterator()，用于返回一个与该具体聚合类对应的具体迭代器对象，典型代码如下：

```java
public class ConcreteAggregate implement Aggregate {
    ...
    public Iterator createIterator() {
        return new ConcreteIterator(this);
    }
    ...
}
```

## 迭代器模式应用实例

### 实例说明

某软件公司为某商场开发了一套销售管理系统，在对该系统进行分析和设计时，开发人员发现经常需要对系统中的商品数据、客户数据等进行遍历，为了复用这些遍历代码，开发人员设计了一个抽象的数据集合类 AbstractObjectList，而将存储商品和客户等数据的类作为其子类，AbstractObjectList 类的结构如图所示：

![image-20240821140639508](./image/image-20240821140639508.png 'AbstractObjectList 类结构图')

在上图中 List 类型的对象 objects 用于存储数据，方法说明如下表所示：

| 方法名               | 方法说明                         |
| -------------------- | -------------------------------- |
| AbstractObjectList() | 构造方法，用于给 object 对象赋值 |
| addObject()          | 增加元素                         |
| removeObject()       | 删除元素                         |
| getObjects()         | 获取所有元素                     |
| next()               | 移至下一个元素                   |
| isLast()             | 判断当前元素是否为最后一个元素   |
| previous()           | 移至上一个元素                   |
| isFirst()            | 判断当前元素是否为第一个元素     |
| getNextItem()        | 获取下一个元素                   |
| getPreviousItem()    | 获取上一个元素                   |

AbstractObjectList 类的子类 ProductList 和 CustomerList 分别用于存储商品数据和客户数据。

通过分析发现 AbstractObjectList 类的职责非常中，它及负责存储和管理数据，又负责遍历数据，违反了单一职责鸭子呢，实现代码将非常负责。因此开发人员决定使用迭代器模式对 AbstractObjectList 类进行重构，将负责遍历数据的方法提取出来封装到专门的类中，实现数据存储和数据遍历分离，还可以给不同的具体数据集合提供不同的遍历方式。

现给出使用迭代器模式重构后的解决方案。

### 实例类图

![image-20240821162827231](./image/image-20240821162827231.png '销售管理系统数据遍历结构图')

在图中，AbstractObjectList 充当抽象聚合类，ProductList 充当具体聚合类，AbstractIterator 充当抽象迭代器，ProductIterator 充当具体迭代器。

在本实例中为了详细说明自定义迭代器的实现过程，没有使用 JDK 中内置的迭代器，事实上 JDK 内置迭代器已经实现了对一个 List 对象的正向遍历。

### 实例代码

1. AbstractObjectList：抽象聚合类。

   ```java
   public abstract class AbstractObjectList {
       protected List<Object> objects = new ArrayList<Object>();
   
       public AbstractObjectList(List<Object> objects) {
           this.objects = objects;
       }
   
       public void addObject(Object obj) {
           this.objects.add(obj);
       }
   
       public void removeObject(Object obj) {
           this.objects.remove(obj);
       }
   
       public List<Object> getObjects() {
           return this.objects;
       }
   
       // 声明创建迭代器对象的抽象工厂方法
       public abstract AbstractIterator createIterator();
   }
   ```

   

2. ProductList：商品数据类，充当具体聚合类。

   ```java
   public class ProductList extends AbstractObjectList {
       public ProductList(List<Object> objects) {
           super(objects);
       }
   
       // 实现创建迭代器对象的具体工厂方法
       @Override
       public AbstractIterator createIterator() {
           return null;
       }
   }
   ```

   

3. AbstractIterator：抽象迭代器。

   ```java
   public interface AbstractIterator {
       public void next();         // 移至下一个元素
       public boolean isLast();    // 判断是否为最后一个元素
       public void precious();     // 移至上一个元素
       public boolean isFirst();   // 判断是否为第一个元素
       public Object getNextItem(); // 获取下一个元素
       public Object getPreviousItem(); // 获取上一个元素
   }
   ```

   

4. ProductIterator：商品迭代器，充当具体迭代器

   ```java
   public class ProductIterator implements AbstractIterator {
       private List<Object> products;
       private int cursor1;        // 定义一个游标，用于记录正向遍历的位置
       private int cursor2;        // 定义一个游标，用于记录逆向遍历的位置
   
       public ProductIterator(ProductList list) {
           this.products = list.getObjects();  // 获取集合对象
           cursor1 = 0;                        // 设置正向遍历游标的初始值
           cursor2 = products.size() - 1;      // 设置逆向遍历游标的初始值
       }
   
       @Override
       public void next() {
           if (cursor1 < products.size()) {
               cursor1++;
           }
       }
   
       @Override
       public boolean isLast() {
           return (cursor1 == products.size());
       }
   
       @Override
       public void precious() {
           if (cursor2 > -1) {
               cursor2--;
           }
       }
   
       @Override
       public boolean isFirst() {
           return (cursor2 == -1);
       }
   
       @Override
       public Object getNextItem() {
           return products.get(cursor1);
       }
   
       @Override
       public Object getPreviousItem() {
           return products.get(cursor2);
       }
   }
   ```

5. Client：客户端测试类。

   ```java
   public class Client {
       public static void main(String[] args) {
           List<Object> products = new ArrayList<>();
           products.add("倚天剑");
           products.add("屠龙刀");
           products.add("断肠草");
           products.add("葵花宝典");
           products.add("四十二章经");
   
           AbstractObjectList list;
           AbstractIterator iterator;
   
           list = new ProductList(products);    // 创建聚合对象
           iterator = list.createIterator();    // 创建迭代器对象
   
           System.out.println("正向遍历：");
           while (!iterator.isLast()) {
               System.out.println(iterator.getNextItem() + ",");
               iterator.next();
           }
   
           System.out.println();
           System.out.println("------------------------");
           System.out.println();
           while (!iterator.isFirst()) {
               System.out.println(iterator.getPreviousItem());
               iterator.previous();
           }
       }
   }
   ```

### 结果及分析

```tex
正向遍历：
倚天剑,屠龙刀,断肠草,葵花宝典,四十二章经,
------------------------
逆向遍历：
四十二章经,葵花宝典,断肠草,屠龙刀,倚天剑,
```

如果需要增加一个新的具体聚合类，只需要增加一个新的聚合子类和一个新的具体迭代器类即可，原有类库代码无需修改，符合开闭原则。如果需要为 ProductList 类更换一个迭代器，只需增加一个新的具体迭代器类作为抽象迭代器类的子类，原有迭代器代码无需修改，也符合开闭原则。但是如果要在迭代器中增加新的方法，则需要修改抽象迭代器源代码，这将违背开闭原则。

## 迭代器模式优点

1. 迭代器模式支持以不同的方式遍历一个聚合对象，在同一个聚合对象上可以定义多种遍历方式。在迭代器模式中只需要用一个不同的迭代器来替换原有迭代器即可改变遍历算法，也可以自己定义迭代器的子类以支持新的遍历方式。
2. 迭代器模式简化了聚合类。由于引入了迭代器，在原有的聚合对象中不需要再自行提供数据遍历等方法，这样可以简化聚合类的设计。
3. 在迭代器模式中由于引入了抽象类，增加新的聚合类和迭代器类都很方便，无需修改原有代码，满足开闭原则。

## 迭代器模式缺点

1. 由于迭代器模式将存储数据和遍历数据的职责分离，在增加新的聚合时需要对应增加新的迭代器类，类的个数成对增加，这在一定程度上增加了系统的复杂性。
2. 抽象迭代器的设计难度较大，需要充分考虑到系统将来的扩展。在自定义迭代器时创建一个考虑全面的抽象迭代器并不是一件很容易的事情。

## 迭代器模式适用环境

1. 访问一个聚合对象的内容而无需保留它的内部表示。将聚合对象的访问与内部数据的存储分离，使得访问聚合对象时无需了解其内部实现细节。
2. 需要为一个聚合对象提供多种遍历方式。
3. 为遍历不同的聚合结构提供一个统一的接口，在该接口的实现类中为不同的聚合结构提供不同的遍历方式，而客户端可以一致地操作该接口。
