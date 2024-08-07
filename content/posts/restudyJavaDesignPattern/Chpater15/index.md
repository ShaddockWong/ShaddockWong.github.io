+++
title = '15-代理模式'
date = 2024-08-06T11:03:24+08:00
lastmod = 2024-08-06T11:03:24+08:00
tags = ['java', '设计模式']
categories = ['Java设计模式']
draft = false

+++

## 代理模式概述

由于某些原因，客户端不想或不能直接访问一个对象，此时可以通过一个称为“代理”的第三者来实现间接访问，该方案对应的设计模式被称为代理模式。

代理模式是一种应用很广泛的结构型设计模式，而且变化形式非常多，常见的代理形式有远程代理、保护代理、虚拟代理、缓冲代理、智能引用代理等。

> **代理模式**：给某一个对象提供一个代理或占位符，并由代理对象来控制原对象的访问。
>
> **Proxy Pattern**: Provide a surrogate or placeholder for another object to control access to it.

代理模式是一种对象结构型模式。在代理模式中引入了一个新的代理对象，代理对象在客户端和目标对象之间起到中介作用，它去掉客户不能看到的内容和服务或者增添客户需要的额外的新服务。

## 代理模式结构

代理模式的结构比较简单，其核心是代理类，为了让客户端能够一致性地对待真实对象和代理对象，在代理模式中引入了抽象层，代理模式的结构如图所示：

![image-20240806112102138](./image/image-20240806112102138.png '代理模式结构图')

包含以下3个角色：

1. **Subject（抽象主题角色）**：它声明了真实主题和代理主题的共同接口，这样一来在任何使用真实主题的地方都可以使用代理主题，客户端通常需要针对抽象主题角色进行编程。
2. **Proxy（代理主题角色）**：它包含了对真实主题的引用，从而可以在任何时候操作真实主题对象；在代理主题角色中提供了一个与真实主题角色相同的接口，以便在任何时候都可以替代主题对象；代理主题角色还可以控制对真实主题的使用，负责在需要的时候创建和删除真实主题对象，并对真实主题对象的使用加以约束。通常，在代理主题角色中客户端在调用所引用的真实主题操作之前或之后还需要执行其他操作，而不仅仅是单纯调用真实主题对象中的操作。
3. **RealSubject（真实主题角色）**：它定义了代理角色所代表的真实对象，在真实主题角色中实现了真实的业务操作，客户端可以通过代理主题角色间接调用真实主题角色中定义的操作。

## 代理模式实现

代理模式的结构图比较简单，但是在真实的使用和实现过程中要复杂很多，特别是代理类的设计和实现。

抽象主题类声明了真实主题类和代理类的公共方法，它可以是接口、抽象类或具体类，客户端针对抽象主题类编程，一致性地对待真实主题和代理主题。典型的抽象主题类代码如下：

```java
public abstract class Subject {
    public abstract void request();
}
```

真实主题类继承了抽象主题类，提供了业务方法的具体实现，其典型代码如下：

```java
public class RealSubject extends Subject {
    public void request(){
        // 业务方法的具体实现代码
    }
}
```

代理类也是抽象主题类的字类，它维持一个对真实主题对象的引用，调用在真实主题中实现的业务方法，在调用时可以在原有业务方法的基础上附加一些新的方法对功能进行扩充和约束。最简单的代理类实现代码如下：

```java
public class Proxy extends Subject {
    private RealSubject realSubject = new RealSubject(); // 维持一个对真实主题对象的引用
    
    public void preRequest() {
        ...
    }
    
    public void request() {
        preRequest();
        realSubject.request();    // 调用真实主题对象的方法
        postRequest();
    }
    
    public void postRequest() {
        ...
    }
}
```

在实际开发过程中，代理类的实现比上述代码要复杂很多，代理模式根据其目的和实现方式不同可分为很多种类，对其中常用的几种代理模式简要说明如下。

1. 远程代理（Remote Proxy）：为一个位于不同地址空间的对象提供一个本地的代理对象，这个不同的地址空间可以在同一台主机中，也可以在另一台主机中，远程代理又称为大师（Ambassador）。
2. 虚拟代理（Virtual Proxy）：如果需要创建一个资源消耗较大的对象，先创建一个消耗相对较小的对象来表示，真实对象只在需要时才会被真正创建。
3. 保护代理（Protect Proxy）：控制对一个对象的访问，可以给不同的用户提供不同级别的使用权限。
4. 缓冲代理（Cache Proxy）：为某一个目标操作的结果提供临时的存储空间，以便多个客户端可以共享这些结果。
5. 智能引用代理（Smart Reference Proxy）：当一个对象被引用时提供一些额外的操作，例如将对象被调用的次数记录下来等。

## 代理模式应用实例

### 实例说明

某软件公司承接了某信息咨询公司的收费商务信息查询系统的开发任务，该系统的基本要求如下：

1. 在进行商务信息查询之前用户需要通过身份验证，只有合法用户才能够使用该查询系统。
2. 在进行商务信息查询时系统需要记录查询日志，以便根据查询次数收取查询费用。

该软件公司的开发人员已完成了商务信息查询模块的开发任务，现希望能够以一种松耦合的方式向原有系统增加身份验证和日志记录功能，客户端代码可以无区别地对待原始的商务信息查询模块和增加新功能之后的商务信息查询模块和增加新功能之后的商务信息查询模块，而且可能在将来还要在该信息查询模块中增加一些新的功能。

试使用代理模式设计并实现该收费商务信息查询系统。

### 实例类图

通过分析，可以采用一种间接访问的方式来实现该商务信息查询系统的设计，在客户端对象和信息查询对象之间增加一个代理对象，让代理对象实现身份验证和日志记录等功能，而无需直接对原有的商务信息查询对象进行修改，如下图：

![image-20240806141755432](./image/image-20240806141755432.png '商务信息查询系统设计方案示意图')

在上图中，客户端对象通过代理对象间接访问具有商务信息查询功能的真实对象，在代理对象中除了调用真实对象的商务信息查询功能外，还增加了身份验证和日志记录等功能。使用代理模式设计该商务信息查询系统，结构图如图所示：

![image-20240806142342047](./image/image-20240806142342047.png '商务信息查询系统结构图')

在图中，业务类 AccessValidator 用于验证用户身份，业务类 Logger 用于记录用户查询日志，Searcher 充当抽象主题角色，RealSearcher 充当真实主题角色，ProxySearcher 充当代理主题角色。

### 实例代码

1. AccessValidator：身份验证类（业务类），它提供 validate() 方法来实现身份验证。

   ```java
   public class AccessValidator {
       // 模拟实现登录验证
       public boolean validate(String userId) {
           System.out.println("在数据库中验证用户'" + userId + "'是否为合法用户？");
           if (userId.equalsIgnoreCase("杨过")) {
               System.out.println("'" + userId + "'登录成功！");
               return true;
           } else {
               System.out.println("'" + userId + "'登录失败！");
               return false;
           }
       }
   }
   ```

   

2. Logger：日志记录类（业务类），它提供 log() 方法来保存日志。

   ```java
   public class Logger {
       // 模拟实现日志记录
       public void log(String userId) {
           System.out.println("更新数据库，用户'" + userId + "'查询次数加 1！");
       }
   }
   ```

   

3. Searcher：抽象查询类，充当抽象主题角色，它声明了 doSearch() 方法。

   ```java
   public interface Searcher {
       public String doSearch(String userId, String keyword);
   }
   ```

   

4. RealSearcher：具体查询类，充当真实主题角色，它实现查询功能，提供 doSearch() 方法来查询信息。

   ```java
   public class RealSearcher implements Searcher {
       // 模拟查询商务信息
       @Override
       public String doSearch(String userId, String keyword) {
           System.out.println("用户'" + userId + "'使用关键词'" + keyword + "'查询商务信息！");
           return "返回具体内容";
       }
   }
   ```

   

5. ProxySearcher：代理查询类，充当代理主题角色，它是查询代理，维持了对 RealSearch 对象，AccessValidator 对象和 Logger 对象的引用。

   ```java
   public class ProxySearcher implements Searcher {
       private RealSearcher searcher = new RealSearcher(); // 维持一个对真实主题的引用
       private AccessValidator validator;
   
       private Logger logger;
   
       @Override
       public String doSearch(String userId, String keyword) {
           // 如果身份验证成功，则执行查询
           if (this.validator(userId)) {
               String result = searcher.doSearch(userId, keyword); // 调用真实主题对象的查询方法
               this.log(userId);
               return result;
           } else {
               return null;
           }
   
       }
   
       // 创建访问验证对象并调用其 validate() 方法实现身份验证
       private boolean validator(String userId) {
           validator = new AccessValidator();
           return validator.validate(userId);
       }
   
       // 创建日志记录对象并调用其 log() 方法实现日志记录
       private void log(String userId) {
           logger = new Logger();
           logger.log(userId);
       }
   }
   ```

   

6. 配置文件 config.xml，在配置文件中存储了代理主题类的类名。

   ```xml
   <?xml version="1.0" encoding="UTF-8" ?>
   <config>
       <className>com.wangyq.proxy.demo.ProxySearcher</className>
   </config>
   ```

   

7. Client：客户端测试类。

   ```java
   public class Client {
       public static void main(String[] args) {
           Searcher searcher;  // 针对抽象编程，客户端无须分别真实主题类和代理类
           searcher = (Searcher) XMLUtil.getBean("design-pattern/src/main/java/com/wangyq/proxy/demo/config.xml");
           String result = searcher.doSearch("杨过", "玉女心经");
       }
   }
   ```

### 结果及分析

输出结果如下：

```tex
在数据库中验证用户'杨过'是否为合法用户？
'杨过'登录成功！
用户'杨过'使用关键词'玉女心经'查询商务信息！
更新数据库，用户'杨过'查询次数加 1！
```

本实例是保护代理和智能引用代理的应用实例，在代理类 ProxySearcher 中实现对真实主题类的权限控制和引用计数，如果需要在访问真实主题时，增加新的访问控制机制和新功能，只需增加一个新的代理类，再修改配置文件，在客户端代码中使用新增代理类即可，源代码无须修改，符合开闭原则。

## 远程代理

远程代理（Remote Proxy）是一种常用的代理模式，它使得客户端程序可以访问在远程主机上的对象，远程主机可能具有更好的计算性能与处理速度，可以快速响应并处理客户端的请求。远程代理可以将网络的细节隐藏起来，使得客户端不比考虑网络的存在。客户端完全可以认为被代理的远程业务对象是在本地而不是在远程，而远程代理对象承担了大部分的网络通信工作，并负责对远程方法的调用。

远程代理中，客户端不能直接访问远程主机中的业务对象，只能采取间接访问的方式。远程业务对象在本地主机中有一个代理对象，该代理对象负责对远程业务对象的访问和网络通信，它对于客户端而言是透明的。客户端无须关心实现具体业务的是谁，只需要按照服务接口所定义的方式直接与本地主机中的代理对象交互即可。

![image-20240806160707395](./image/image-20240806160707395.png '远程代理示意图')

## 虚拟代理

虚拟代理（Virtual Proxy）也是一种常用的代理模式，对于一些占用系统资源较多或者加载时间较长的对象，可以给这些对象提供一个虚拟代理。在真实对象创建成功之前虚拟代理扮演真实对象的替身，而当真实对象创建之后虚拟代理将用户的请求转发给真实对象。

通常在一下两种情况下可以考虑使用虚拟代理：

1. 由于对象本身的复杂性或者网络等原因导致一个对象需要较长的加载时间，此时可以用一个加载时间相对较短的代理对象来代表真实对象。
2. 当一个对象的加载十分耗费系统资源的时候也非常适合使用虚拟代理。

虚拟代理是用一个“虚假”的代理对象来代表真实对象，通过代理对象来间接引用真实对象，可以在一定程度上提高系统的性能。

## Java 动态代理

代理类所实现的接口和所代理的方法都是固定的，这种代理被称为静态代理（Static Proxy）。动态代理（Dynamic Proxy）可以让系统在运行时根据实际需要来创建代理类，让同一个代理类能够代理多个不同的真实主题类而且可以代理不同的方法。动态代理是一种较为高级的代理模式，它在事务管理、AOP（Aspect-Oriented Programming，面向方向编程）等领域都发挥了重要的作用。

Java 实现动态代理需要用到位于 java.lang.reflect 包中的一些类：

1. Proxy 类

   Proxy 类提供了用于创建动态代理类和实例对象的方法，它是所创建的动态代理的父类，它最常用的方法如下。

   （1）`public static Class <?> getProxyClass (ClassLoader loader, Class <?>... interfaces)` ：该方法用于返回一个 Class 类的代理类，在参数中需要提供类加载器并需要指定代理的接口数组（与真实主题类的接口列表一致）。

   `public static Object newProxyInstance(ClassLoader loader, Class <?>[] interfaces, InvocationHandler h)`：该方法用于返回一个动态创建的代理类的实例，方法中的第一个从那时 loader 表示代理类的类加载器，第二个参数 interfaces 表示代理类所实现的接口列表（与真实主题类的接口列表一致），第三个参数 h 表示所指派的调用处理程序类。

2. InvocationHandler 接口

   InvocationHandler 接口是代理类处理程序类的实现接口，该接口作为代理实例的调用处理者的公共父类，每一个代理类的实例都可以提供一个相关的具体调用处理者（InvocationHandler 接口的子类）。在该接口中声明了如下方法:

   `public Object invoke(Object proxy, Method method, Object[] args)`

   该方法用于处理对代理类实例的方法调用并返回相应的结果，当一个代理实例中的业务方法被调用时将自动调用该方法。invoke() 方法包含3个参数，其中第一个参数 proxy 表示代理类的实例，第二个参数 method 表示需要代理的方法，第三个参数 args 表示代理方法的参数数组。

动态代理需要在运行时指定所代理这是主题类的接口，客户端在调用动态代理对象的方法时调用请求自动转发给 InvocationHandler 对象的 invoke() 方法，由 invoke() 方法来实现对请求的统一处理。

下面通过一个简单实例来学习如何使用动态代理模式：

### 实例说明

某软件公司要为公司 OA 系统数据访问层 DAO 增加方法调用日志，记录每一个方法被调用的时间和调用结果，现使用动态代理进行设计和实现。

### 实例代码

1. AbstractUserDAO：抽象用户 DAO 类，抽象主题角色。

   ```java
   public interface AbstractUserDAO {
       public Boolean findUserById(String userId);
   }
   ```

2. AbstractDocumentDAO：抽象文档 DAO 类，抽象主题角色。

   ```java
   public interface AbstractDocumentDAO {
       public Boolean deleteDocumentById(String documentId);
   }
   ```

3. UserDAO：用户 DAO 类，具体主题角色。

   ```java
   public class UserDAO implement AbstractUserDAO {
       public Boolean findUserById(String userId) {
           if(userId.equalsIgnoreCase("张无忌")) {
               System.out.println("查询 ID 为" + userId + "的用户信息成功！");
               return true;
           } else {
               System.out.println("查询 ID 为" + userId + "的用户信息失败！");
               return false;
           }
       }
   }
   ```

4. DocumentDAO：文档 DAO 类，具体主题角色。

   ```java
   public class DocumentDAO implement AbstractDocumentDAO {
       public Boolean deleteDocumentById(String documentId) {
           if(documentId.equalsIgnoreCase("D001")) {
               System.out.println("删除 ID 为" + documentId + "的文档信息成功！");
               return true;
           } else {
               System.out.println("删除 ID 为" + documentId + "的文档信息失败！");
               return false;
           }
       }
   }
   ```

5. DAOLogHandler：自定义请求处理程序类。

   ```java
   public class DAOLogHandler implements InvocationHandler {
       private Calendar calendar;
       private Object object;
   
       public DAOLogHandler() {
       }
   
       // 自定义有参构造函数，用于注入一个需要提供代理的真实主题对象
       public DAOLogHandler(Object object) {
           this.object = object;
       }
   
       // 实现 invoke() 方法，调用在真实主题类中定义的方法
       @Override
       public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
           beforeInvoke();
           Object result = method.invoke(object, args);// 转发调用
           afterInvoke();
           return result;
       }
   
       // 记录方法调用时间
       private void beforeInvoke() {
           calendar = new GregorianCalendar();
           int hour = calendar.get(Calendar.HOUR_OF_DAY);
           int minute = calendar.get(Calendar.MINUTE);
           int second = calendar.get(Calendar.SECOND);
           String time = hour + ":" + minute + ":" + second;
           System.out.println("调用时间：" + time);
       }
   
       private void afterInvoke() {
           System.out.println("方法调用结束！");
       }
   }
   ```

6. Client：客户端测试类。

   ```java
   public class Client {
       public static void main(String[] args) {
           InvocationHandler handler = null;
           AbstractUserDAO userDAO = new UserDAO();
           handler = new DAOLogHandler(userDAO);
           AbstractUserDAO proxy = null;
   
           // 动态创建代理对象，用于代理一个 AbstractUserDAO 类型的真实主题对象
           proxy = (AbstractUserDAO) Proxy.newProxyInstance(
                   AbstractUserDAO.class.getClassLoader(),
                   new Class[]{AbstractUserDAO.class},
                   handler
           );
           proxy.findUserById("张无忌"); // 调用代理对象的业务方法
   
           System.out.println("--------------------------------");
   
           AbstractDocumentDAO docDAO = new DocumentDAO();
           handler = new DAOLogHandler(docDAO);
           AbstractDocumentDAO proxy_new = null;
   
           // 动态创建代理对象，用于代理一个 AbstractDocumentDAO 类型的真实主题对象
           proxy_new = (AbstractDocumentDAO) Proxy.newProxyInstance(
                   AbstractDocumentDAO.class.getClassLoader(),
                   new Class[]{AbstractDocumentDAO.class},
                   handler
           );
           proxy_new.deleteDocumentById("D002"); // 调用代理对象的业务方法
       }
   }
   ```

### 运行结果分析

```tex
调用时间：10:45:28
查询 ID 为张无忌的用户信息成功！
方法调用结束！
--------------------------------
调用时间：10:45:28
删除 ID 为D002的文档信息失败！
方法调用结束！
```

通过使用动态代理可以实现对多个真实主题类的统一代理和集中控制。

JDK 中提供的动态代理只能代理一个或多个接口，如果需要动态代理具体类或抽象类，可以使用 CGLib（Code Generation Library）等工具。CGLib 是一个功能较为强大、性能和质量也比较好的代码生成包，在许多 AOP 框架中得到了广泛应用。

## 代理模式优点

代理模式的共同优点如下：

1. 能够协调调用者和被调用者，在一定程度上降低了系统的耦合度。
2. 客户端可以针对抽象主题角色进行编程，增加和更换代理类无须修改源代码，符合开闭原则，系统具有较好的灵活性和可编程性。

不同类型的代理模式具有独特的优点：

1. 远程代理为位于两个不同地址空间的对象的访问提供了一种实现机制，可以将一些消耗资源较多的对象和操作移至性能更好的计算机上，提高了系统的整体运行效率。
2. 虚拟代理通过一个消耗资源较少的对象来代表一个消耗资源较多的对象，可以在一定程度上节省系统的运行开销。
3. 缓冲代理为某一个操作的结果提供临时的缓存存储空间，以便在后续使用中能够共享这些结果，优化系统性能，缩短执行时间。
4. 保护代理可以控制对一个对象的访问权限，为不同用户提供不同级别的使用权限。

## 代理模式缺点

1. 由于在客户端和真实主题之间增加了对象代理，因此有些类型的代理模式可能会造成请求的处理速度变慢，例如保护代理。
2. 实现代理模式需要额外的工作，而且有些代理模式的实现过程较为复杂，例如远程代理。

## 代理模式适用环境

1. 当客户端对象需要访问远程主机中的对象时可以使用远程代理。
2. 当需要用一个消耗资源较少的对象来代表一个消耗资源较多的对象，从而降低系统开销、缩短运行时间时可以使用虚拟代理，例如一个对象需要很长时间才能完成加载时。
3. 当需要为某一个被频繁访问的操作结果提供一个临时存储空间，以供多个客户端共享访问这些结果时可以使用缓冲代理。
4. 当需要控制对一个对象的访问为不同用户提供不同级别的访问权限时可以使用保护代理。
5. 当需要为一个对象的访问（引用）提供一些额外的操作时可以使用智能引用代理。
