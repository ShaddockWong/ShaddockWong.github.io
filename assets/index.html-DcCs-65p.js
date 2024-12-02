import{_ as e,c as r,a,o as d}from"./app-Bfpua5rO.js";const n="/assets/image-20240703135455909-CiQRSqMj.png",i="/assets/image-20240703141344836-T5V2hYeL.png",o={};function s(l,t){return d(),r("div",null,t[0]||(t[0]=[a('<h2 id="设计模式的诞生与发展" tabindex="-1"><a class="header-anchor" href="#设计模式的诞生与发展"><span>设计模式的诞生与发展</span></a></h2><h3 id="模式的诞生与定义" tabindex="-1"><a class="header-anchor" href="#模式的诞生与定义"><span>模式的诞生与定义</span></a></h3><p>模式（Pattern）起源于建筑业而非软件业，模式之父 – Christopher Alexander 博士。</p><blockquote><p>模式是在特定环境下人们解决某类重复出现问题的一套成功或有效的解决方案.</p><p>A pattern is a successful or efficient solution to a recurring problem within a context.</p></blockquote><p><img src="'+n+'" alt="image-20240703135455909"></p><p>当一个领域逐渐成熟的时候自然会有很多模式。模式是一种直到，在一个良好的指导下有助于设计一个优良的解决方案，达到事半功倍的效果，而且会的到解决问题的最佳办法。</p><p>最早将模式的思想引入软件工程学的是 1991-1992 年以“四人组”（Gang of Four，GOF，分别是 Erich Gamma、Richard helm、Ralph Johnson 和 John Vlissides）自称的 4 位著名软件工程学者。</p><p>GoF 将模式的概念引入软件工程领域，这标志着软件模式的诞生。</p><p>软件模式并非仅仅限于设计模式，还包括架构模式、分析模式和过程模式等。</p><p>软件模式是在一定条件下的软件开发问题及其解法。软件模式的基本结构由 4 个部分构成，即问题描述、前提条件（环境或约束条件）、解法和效果，如下图所示。</p><p><img src="'+i+'" alt="image-20240703141344836"></p><h3 id="设计模式的定义与分类" tabindex="-1"><a class="header-anchor" href="#设计模式的定义与分类"><span>设计模式的定义与分类</span></a></h3><h4 id="设计模式的定义" tabindex="-1"><a class="header-anchor" href="#设计模式的定义"><span>设计模式的定义</span></a></h4><p>设计模式（Design Pattern）是一套被反复使用的、多数人知晓的、经过分类编目的、代码设计经验的总结。使用设计模式是为了可重用代码、让代码更容易被他人理解并且提高代码的可靠性。</p><p>GoF 对设计模式的定义如下：</p><blockquote><p><strong>设计模式</strong>是在特定环境下为解决某一通用软件设计问题提供的一套定值的解决方案，该方案描述了对象和类之间的相互作用。</p><p><strong>Design patterns</strong> are descriptions of communicating objects and classes that are customized to solve a general design problem in a particular context.</p></blockquote><p>设计模式一般包含模式名称、问题、目的、解决方案、效果、实例代码和相关设计模式，其中的关键元素有以下 4 个。</p><ol><li><p>模式名称（Pattern Name）</p><p>通过一两个词来描述模式的问题、解决方案和效果，以便更好地理解模式并方便开发人员之间的交流，绝大多数模式都是根据其功能或模式结构来命名的。</p></li><li><p>问题（Problem）</p><p>问题描述了应该在何时使用模式，它包含了设计中存在的问题以及问题存在的原因。在对问题进行描述的同时实际上就确定了模式所对应的使用环境以及模式的使用动机。</p></li><li><p>解决方案（Solution）</p><p>结局方案描述了设计模式的组成成分，以及这些组成成分的相互关系、各自的职责和协作方式。不针对具体问题，使用抽象描述和怎样用一个具有一般意义的元素组合（类或对象组合）来解决这个问题。</p></li><li><p>效果（Consequences）</p><p>效果描述了模式应用的效果以及在使用模式时应权衡的问题。没有一个解决方案是百分之百完美的，在使用设计模式时需要进行合理的评价和选择。</p></li></ol><h4 id="设计模式的分类" tabindex="-1"><a class="header-anchor" href="#设计模式的分类"><span>设计模式的分类</span></a></h4><p>设计模式一般有两种分类方式：</p><ol><li><p>根据目的分类</p><p>分为创建型（Creational）、结构型（Structural）和行为型（Behavioral）三类。</p></li><li><p>根据范围分类</p><p>分为类模式和对象模式两种。</p></li></ol><h2 id="gof-设计模式简介" tabindex="-1"><a class="header-anchor" href="#gof-设计模式简介"><span>GoF 设计模式简介</span></a></h2><h3 id="gof-的-23-种模式一览表" tabindex="-1"><a class="header-anchor" href="#gof-的-23-种模式一览表"><span>GoF 的 23 种模式一览表</span></a></h3><table><thead><tr><th style="text-align:center;">范围/目的</th><th style="text-align:center;">创建型模式</th><th style="text-align:center;">结构型模式</th><th style="text-align:center;">行为型模式</th></tr></thead><tbody><tr><td style="text-align:center;">类模式</td><td style="text-align:center;">工厂方法模式</td><td style="text-align:center;">（类）适配器模式</td><td style="text-align:center;">解释器模式 模板方法模式</td></tr><tr><td style="text-align:center;">对象模式</td><td style="text-align:center;">抽象工厂模式 <br> 建造者模式 <br> 原型模式 <br>单例模式</td><td style="text-align:center;">（对象）适配器模式 <br> 桥接模式 <br> 组合模式 <br> 装饰模式 <br> 外观模式 <br> 享元模式 <br> 代理模式</td><td style="text-align:center;">职责链模式 <br> 命令模式 <br> 迭代器模式 <br> 中介者模式 <br> 备忘录模式 <br> 观察者模式 <br> 状态模式 <br> 策略模式 <br> 访问者模式</td></tr></tbody></table><h3 id="gof-的-23-种设计模式的简要说明" tabindex="-1"><a class="header-anchor" href="#gof-的-23-种设计模式的简要说明"><span>GoF 的 23 种设计模式的简要说明</span></a></h3><table><thead><tr><th>模式类别</th><th>模式名称</th><th>模式说明</th></tr></thead><tbody><tr><td>创建型模式（Creational Patterns）</td><td>抽象工厂模式（Abstract Factory Pattern）</td><td>提供一个创建一系列相关或相互依赖对象的接口，而无需指定它们具体的类</td></tr><tr><td></td><td>建造者模式（Builder Pattern）</td><td>将一个复杂对象的构建与它的表示分离，使得同样得构建过程可以创建不同的表示</td></tr><tr><td></td><td>工厂方法模式（Factory Method Pattern）</td><td>定义一个用于创建对象的接口，但是让子类决定将哪一个类实例化。工厂方法模式让一个类的实例化延迟到其子类</td></tr><tr><td></td><td>原型模式（Prototype Pattern）</td><td>使用原型实例指定待创建对象的类型，并且通过复制这个原型来后创建新的对象</td></tr><tr><td></td><td>单例模式（Singleton Pattern）</td><td>确保一个类只有一个实例，并提供一个全局访问点来访问这个唯一实例</td></tr><tr><td>结构型模式（Structural Patterns）</td><td>适配器模式（Adapter Pattern）</td><td>将一个类的接口转换成客户希望的另一个接口。适配器模式让那些接口不兼容的类可以一起工作</td></tr><tr><td></td><td>桥接模式（Bridge Pattern）</td><td>将抽象部分与它的实例部分解耦，使得两者都能够独立变化</td></tr><tr><td></td><td>组合模式（Composite Pattern）</td><td>组合多个对象形成树形结构以表示具有部分-整体关系的层次结构。组合模式让客户端可以统一对待单个对象和组合对象</td></tr><tr><td></td><td>装饰模式（Decorator Pattern）</td><td>动态地给一个对象增加一些额外的职责。就扩展功能而言，装饰模式提供一种比使用子类更加灵活的替代方案</td></tr><tr><td></td><td>外观模式（Façade Pattern）</td><td>为子系统中的一组接口提供一个统一的入口。外观模式定义了一个高层接口，这个接口使得这一子系统更加容易使用</td></tr><tr><td></td><td>享元模式（Flyweight Pattern）</td><td>运用共享技术有效地支持大量细粒度对象的复用</td></tr><tr><td></td><td>代理模式（Proxy Pattern）</td><td>给某一个对象提供一个代理或占位符，并由代理对象来控制对原对象的访问</td></tr><tr><td>行为型模式（Behavioral Patterns）</td><td>职责链模式（Chain of Responsibility Pattern）</td><td>避免将一个请求的发送者与接收者耦合在一起，让多个对象都有机会处理请求。将接收请求的对象连接成一条链，并且沿着这条链传递请求，直到有一个对象能够处理它为止</td></tr><tr><td></td><td>命令模式（Command Pattern）</td><td>将一个请求封装为一个对象，从而可用不同的请求对客户进行参数化，对请求排队或者记录请求日志，以及支持可撤销的操作</td></tr><tr><td></td><td>解释器模式（Interpreter Pattern）</td><td>给定一个语言，定义它的文法的一种表示，并给定一个解释器，这个解释器使用该表示来解释语言中的句子</td></tr><tr><td></td><td>迭代器模式（Iterator Pattern）</td><td>提供一种方法顺序访问一个聚合对象中的各个元素，而又不用暴露该对象的内部表示</td></tr><tr><td></td><td>中介者模式（Mediator Pattern）</td><td>定义一个对象来封装一系列对象的交互，中介者模式使各对象之间不需要显示地相互引用，从而使其耦合松散，而且可以独立地改变它们之间的交互</td></tr><tr><td></td><td>备忘录模式（Memento Pattern）</td><td>在不破坏封装的前提下捕获一个对象的内部状态，并在该对象之外保存这个状态，这样可以将对象恢复到原先保存的状态</td></tr><tr><td></td><td>观察者模式（Observer Pattern）</td><td>定义对象直接按的一种一对多依赖关系，使得每当一个对象状态发生改变时其相关依赖对象皆得到通知被自动更新</td></tr><tr><td></td><td>状态模式（State Pattern）</td><td>允许一个对象在其内部状态改变时改变它的行为。对象看起来似乎修改了它的类</td></tr><tr><td></td><td>策略模式（Strategy Pattern）</td><td>定义一系列算法，将每一个算法封装起来，并让它们可以相互替换。策略模式让算法可以独立于使用它的客户而变化</td></tr><tr><td></td><td>模板方式模式（Template Method Pattern）</td><td>定义一个操作中算法的框架，而将一些步骤延迟到子类中。模板方法模式使得子类可以不改变一个算法的结构即可重定义该算法的某些特定步骤</td></tr><tr><td></td><td>访问者模式（Visitor Pattern）</td><td>表示一个作用与某对象结构中的各个元素的操作。访问者模式可以在不改变各元素的类的前提下定义作用于这些元素的新操作</td></tr></tbody></table><h2 id="设计模式的优点" tabindex="-1"><a class="header-anchor" href="#设计模式的优点"><span>设计模式的优点</span></a></h2><ol><li>设计模式融合了众多专家的经验，并以一种标准的形式供广大开发人员所用，它提供了一套通用的设计词汇和一种通用的语言以方便开发人员之间沟通和交流，使得设计方案更加通俗易懂。</li><li>设计模式使人们可以更加简单、方便地复用成功的设计和体系结构，将已证实的技术表述成设计模式也会使新系统开发者更加容易理解其设计思路。</li><li>设计模式使得设计方案更加灵活，且易于修改。</li><li>设计模式的使用将提高软件系统的开发效率和软件质量，并且在一定程度上节约设计成本。</li><li>设计模式有助于初学者更深入地理解面向对象思想，一方面可以帮助初学者更加方便地阅读和学习现有类库与其他系统中的源代码，另一方面还可以提高软件的设计水平和代码质量。</li></ol>',28)]))}const h=e(o,[["render",s],["__file","index.html.vue"]]),c=JSON.parse('{"path":"/article/rk3ujhm2/","title":"01-设计模式概述","lang":"zh-CN","frontmatter":{"title":"01-设计模式概述","tags":["Java","设计模式"],"createTime":"2024/11/21 11:09:01","permalink":"/article/rk3ujhm2/"},"headers":[],"readingTime":{"minutes":8.74,"words":2623},"git":{"updatedTime":1733105700000,"contributors":[{"name":"ShaddockWong","email":"420434838@qq.com","commits":1,"avatar":"https://avatars.githubusercontent.com/ShaddockWong?v=4","url":"https://github.com/ShaddockWong"}]},"filePathRelative":"1.Java/1.Java设计模式/01-设计模式概述.md","categoryList":[{"id":"277b13","sort":1,"name":"Java"},{"id":"23a388","sort":1,"name":"Java设计模式"}],"bulletin":false}');export{h as comp,c as data};