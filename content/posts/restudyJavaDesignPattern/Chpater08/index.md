+++
title = '08-单例模式'
date = 2024-07-17T09:47:43+08:00
lastmod = 2024-07-17T09:47:43+08:00
tags = ['java', '设计模式']
categories = ['Java设计模式']
draft = false

+++

## 单例模式概述

对于一个软件系统中的某些类而言，只有一个实例很重要，例如一个系统只能有一个窗口管理器或文件系统，一个系统只能有一个计时工具或 ID（序号）生成器。

> **单例模式：**确保一个类只有一个实例，并提供一个全局访问点来访问这个唯一实例。
>
> **Singleton Pattern**: Ensure a class has only one instance, and provide a global point of access to it.

单例模式是一种对象创建型模式。有 3 个要点：一是某个类只能有一个实例；二是它必须自行创建这个实例；三是它必须自行向整个系统提供这个实例。

## 单例模式结构

单例模式是结构最简单的设计模式，它只包含一个类，即单例类。结构图如下图所示：

![image-20240717142211266](./image/image-20240717142211266.png '单例模式结构图')

单例模式只包含一个单例角色，就是 Singleton。

对于 Singleton，在单例类的内部创建它的唯一实例，并通过静态方法 getInstance() 让客户端可以使用它的唯一实例；为了防止在外部对单例类实例化，将其构造函数的可见性设为 private；在单例类内部定义了一个 Singleton 类型的静态对象作为供外部共享访问的唯一实例。

## 单例模式实现

单例模式包含的角色只有一个，也就是单例类 Singleton。单例类拥有一个私有构造函数，确保用户无法通过 new 关键字直接实例化它。除此之外，在单例类中还包含一个静态私有成员变量与静态公有的工厂方法，该工厂方法负责检验实例的存在性并实例化自己，然后存储在静态成员变量中，以确保只有一个实例被创建。

单例模式的实现代码如下：

```java
public class Singleton {
    private static Singleton instance = null; // 静态私有成员变量
    
    // 私有构造方法
    private Singleton() {
    }
    
    // 静态公有工厂方法，返回唯一实例
    public static Singleton getInstance() {
        if(instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```

为了测试单例类所创建对象的唯一性，可以编写一下客户端测试代码：

```java
public class Client {
    public static void main(String[] args) {
        Singleton s1 = Singleton.getInstance();
        Singleton s2 = Singleton.getInstance();
        // 判断两个对象是否相同
        if(s1 == s2) {
            System.out.println("两个对象实例相同")；
        } else {
            System.out.println("两个对象实例不同")；
        }
    }
}
```

输出结果为：

```tex
两个对象是实例相同
```

这说明两次调用 getInstance() 时所获取的对象是同一实例对象，且无法在外部对 Singleton 进行实例化，因此确保系统中只有唯一的一个 Singleton 对象。

在单例模式的实现过程中需要注意以下 3 点：

1. 单例类构造函数的可见性为 private。
2. 提供一个类型为自身的静态私有成员变量。
3. 提供一个供油的静态工厂方法。

## 单例模式应用实例

### 实例说明

某软件公司承接了一个服务器负载均衡（Load Balance）软件的开发工作，该软件运行在一台负载均衡服务器上，可以将并发访问和数据流量分发到服务器集群中的多台设备上进行并发处理，提高系统的整体处理能力，缩短相应时间。由于集群中的服务器需要动态删减，且客户端请求需要统一分发，因此需要确保负载均衡器的唯一性，只能有一个负载均衡器来负责服务器的管理和请求的分发，否则将会带来服务器状态的不一致以及请求分配冲突等问题。如何确保负载均衡器的唯一性是该软件成功的关键，试使用单例模式设计服务器负载均衡器。

### 实例类图

通过分析，本实例的结构图如下所示：

![image-20240717151357897](./image/image-20240717151357897.png '服务器负载均衡器结构图')

### 实例代码

1. LoadBalancer：负载均衡类，充当单例角色。在真实环境下该类将非常复杂，包括大量初始化的工作和业务方法，考虑到代码的可读性和易理解性，此处只列出部分与模式相关的核心代码。

   ```java
   public class LoadBalancer {
       // 私有静态成员变量，存储唯一实例
       private static LoadBalancer instance = null;
       // 服务器集合
       private List<String> serverList = null;
   
       // 私有构造函数
       private LoadBalancer() {
           serverList = new ArrayList<>();
       }
   
       // 公有静态成员方法，返回唯一实例
       public static LoadBalancer getLoadBalancer() {
           if (instance == null) {
               instance = new LoadBalancer();
           }
           return instance;
       }
   
       // 增加服务器
       public void addServer(String server) {
           serverList.add(server);
       }
   
       // 删除服务器
       public void removeServer(String server) {
           serverList.remove(server);
       }
   
       // 使用 Random 类随机获取服务器
       public String getServer() {
           Random random = new Random();
           int i = random.nextInt(serverList.size());
           return serverList.get(i);
       }
   }
   ```

   

2. Client：客户端测试类

   ```java
   public class Client {
       public static void main(String[] args) {
           // 创建 4 个 LoadBalancer 对象
           LoadBalancer balancer1, balancer2, balancer3, balancer4;
           balancer1 = LoadBalancer.getLoadBalancer();
           balancer2 = LoadBalancer.getLoadBalancer();
           balancer3 = LoadBalancer.getLoadBalancer();
           balancer4 = LoadBalancer.getLoadBalancer();
   
           // 判断服务器负载均衡器是否相同
           if (balancer1 == balancer2 && balancer2 == balancer3 && balancer3 == balancer4) {
               System.out.println("服务器负载均衡器具有唯一性！");
           }
   
           // 增加服务器
           balancer1.addServer("Server 1");
           balancer1.addServer("Server 2");
           balancer1.addServer("Server 3");
           balancer1.addServer("Server 4");
   
           // 模拟客户端请求的分发，如果输出结果为同一个 server，可以将 i 适当放大
           // 例如，改为 "i < 100"
           for (int i = 0; i < 10; i++) {
               String server = balancer1.getServer();
               System.out.println("分发请求至服务器：" + server);
           }
       }
   }
   ```

### 运行结果及分析

```tex
服务器负载均衡器具有唯一性！
分发请求至服务器：Server 1
分发请求至服务器：Server 2
分发请求至服务器：Server 1
分发请求至服务器：Server 2
分发请求至服务器：Server 1
分发请求至服务器：Server 3
分发请求至服务器：Server 2
分发请求至服务器：Server 1
分发请求至服务器：Server 3
分发请求至服务器：Server 2
```

虽然创建了 4 个 LoadBalancer 对象，但是它们实际上是同一个对象，因此通过使用单例模式可以确保 LoadBalancer 对象的唯一性。

## 饿汉式单例和懒汉式单例

### 饿汉式单例

饿汉式单例（Eager Singleton）是实现起来最简单的单例类，其结构图如下图所示：

![image-20240717163755288](./image/image-20240717163755288.png '饿汉式单例结构图')

从图中可以看出，由于在定义静态变量的时候实例化单例类，因此在类加载时单例对象就已创建，代码如下：

```java
public class EagerSingleton {
    private static final EagerSingleton instance = new EagerSingleton();
    private EagerSingleton() {}
    
    public static EagerSingleton getInstance() {
        return instance;
    }
}
```

当类被加载时，静态变量 instance 会被初始化，此时类的私有构造函数会被调用，单例类的唯一实例将被创建。

### 懒汉式单例类与双重检查锁定

与饿汉式单例类相同的是，懒汉式单例类（Lazy Singleton）的构造函数也是私有的。与懒汉式单例不同的是，懒汉式单例类在第一次被引用时将自己实例化，在懒汉式单例类被加载时不会将自己实例化。其结构图如下：

![image-20240717165254872](./image/image-20240717165254872.png '懒汉式单例结构图')

懒汉式单例在第一次调用 getInstance() 方法时实例化，在了加载时并不自行实例化，这种技术称为延迟加载（懒加载 Lazy Load）技术，即需要的时候再加载实例。为了避免多个线程同时调用 getInstance() 方法，可以使用关键字 synchronized，代码如下：

```java
public class LazySingleton {
    private static LazySingleton instance = null;
    
    private LazySingleton() { }
    
    // 使用 synchronized 关键字对方法加锁，确保任意时刻只有一个线程可执行该方法
    synchronized public static LazySingleton getInstance() {
        if(instance == null) {
            instance = new LazySingleton();
        }
        return instance;
    }
}
```

上述代码虽然解决了线程安全问题，但是每次调用 getInstance() 时都需要进行线程锁定判断，在多线程高并发访问环境中将会导致系统性能大大降低，因此需要继续进行改写，getInstance() 方法可以进行如下改写。

```java
...
public static LazySingleton getInstance() {
    if(instance == null) {
        synchronize(LazySingleton.class) {
            instance = new LazySingleton();
        }
    }
    return instance;
}
...
```

这样实现单例类后，还是会存在单例对象不唯一的情况，原因为：假如在某一瞬间线程 A 和 线程 B 都在调用 getInstance() 方法，此时 instance 对象为 null 值，均能通过 instance == null 的判断。由于实现了 synchronized 加锁机制，线程 A 进入 synchronized 锁定的代码中执行实例创建代码，线程 B 处于排队等待状态，必须等待线程 A 执行完毕后才可以进入 synchronized 锁定的代码。但当 A 执行完毕时线程 B 并不知道实例已经创建，将继续创建新的实例，导致产生多个单例对象，违背了单例模式的设计思想，所以要进一步改进，在 synchronized 中再进行一次 instance == null 判断，这种方式称为双重检查锁定（Double-Check Locking）。完整代码如下：

```java
public class LazySingleton {
    private volatile static LazySingleton instance = null;
    
    private LazySingleton() { }
    
    synchronized public static LazySingleton getInstance() {
        // 第一重判断
        if(instance == null) {
            // 锁定代码块
            synchronized (LazySingleton.class) {
                // 第二重判断
                if(instance == null) {
                    instance = new LazySingleton(); // 创建单例实例
                }
            }
        }
        return instance;
    }
}
```

需要注意的是，如果使用双重检查锁定来实现懒汉式单例类，需要在静态成员变量 instance 之前增加修饰符 volatile，被 volatile 修饰的成员变量可以确保多个线程都能正确处理。由于 volatile 关键字会屏蔽 Java 虚拟机所做的一些代码优化，可能会导致系统的运行效率降低，因此即使使用双重检查锁定来实现单例模式也不是一种完美的实现方法。

### 饿汉式单例类与懒汉式单例类的比较

饿汉式单例类在类加载时就将自己实例化，它的优点在于无需考虑多个线程同时访问的问题，可以确保实例的唯一性；从调用速度和反应时间来讲，由于单例对象一开始就得以创建，因此要优于懒汉式单例。从资源利用率角度来讲，饿汉式单例不及懒汉式单例，而且在系统加载时由于需要创建饿汉式单例对象，加载时间可能会比较长。

懒汉式单例在第一次使用时创建，无需一直占用系统资源，实现了延迟加载，但是必须处理多个线程同时访问的问题，特别是当单例类作为资源控制器，在实例化时必然设计资源初始化，而资源初始化很有可能耗费大量时间，这意味着出现多线程同时首次引用此类的几率变得较大，需要通过双重检查锁定等机制进行控制，这将导致系统性能受到一定影响。

### 使用静态内部类实现单例模式

饿汉式单例和懒汉式单例都存在一些问题，为了克服这些问题，在 Java 语言中可以通过 Initialization on Demand Holder（IoDH）技术来实现单例模式。

在 IoDH 中，需要在单例类中增加一个静态内部类，在该内部类中创建单例对象，再将该单例对象通过 getInstance() 方法返回给外部使用，实现代码如下：

```java
// Initialization on Demand Holder(IoDH)
public class Singleton {
    private Singleton(){
    }
    
    // 静态内部类
    private static class HolderClass {
        private final static Singleton instance = new Singleton();
    }
    
    public static Singleton getInstance() {
        return HolderClass.instance;
    }
    
    public static void main(String args[]){
        Singleton s1,s2;
    }
}
```

由于静态单例对象没有作为 Singleton 的成员变量直接实例化，因此类加载时不会实例化 Singleton，第一次调用 getInstance() 时将加载内部类 HolderClass，在该内部类中定义了一个 static 类型的变量 instance，此时会首先初始化这个成员变量，由 Java 虚拟机来保证其线程安全性，确保该成员变量只能初始化一次。由于 getInstance() 方法没有任何线程锁定，因此其性能不会造成任何影响。

## 单例模式优点

1. 单例模式提供了对唯一实例的受控访问。
2. 由于在系统内存中只存在一个对象，因此可以节约系统资源，对于一些需要频繁创建和销毁的对象，单例模式无疑可以提高系统的性能。
3. 允许可变数目的实例。基于单例模式可以进行扩展，使用与控制单例对象相似的方法来获得指定个数的实例对象，即节省系统资源，又解决了由于单例对象共享过多有损性能的问题。

## 单例模式缺点

1. 由于单例模式中没有抽象层，因此单例类的扩展有很大的困难。
2. 单例类的指责过重，在一定程度上违背了单一职责原则。因为单例类既提供了业务方法，又提供了创建对象的方法（工厂方法），将对象的创建和对象本身的功能耦合在一起。
3. 大部分面向对象语言都提供了垃圾回收技术，因此如果实例化的共享对象长时间不利用，系统会认为它是垃圾，会自动销毁并回收资源，下次利用时又将重新实例化，这导致共享的单例对象状态的丢失。

## 单例模式使用环境

1. 系统只需要一个实例对象，例如系统要求提供一个唯一的序列化生成器或资源管理器等。
2. 客户调用类的单个实例只允许使用一个公共访问点，除了公共访问点，不能通过其他途径访问该实例。
