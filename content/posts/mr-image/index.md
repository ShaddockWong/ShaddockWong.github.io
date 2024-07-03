+++
title = 'MapReduce流程图（重制版）'
date = 2024-07-03T10:31:20+08:00
lastmod = 2024-07-03T10:31:20+08:00
tags = ['大数据', 'Hadoop']
categories = ['Hadoop']
draft = false
+++

这篇文章并非原厂，是之前在网上找的，Hadoop MapReduce 的流程图，觉得很不错，就是网上的图太糊了，在这里重置一下。MR 作为大数据处理的基石，顺便梳理一下 MR 的流程。

MapReduce 一共有 7 个角色参与，分为 4 个大阶段，7 个小阶段。分别是：

1. 任务启动阶段
   1. 由 Client 端发起请求；
   2. YarnRunner 接受请求并申请资源；
   3. ResourceManager 检索资源情况，分配资源路径给 YarnRunner；
   4. YarnRunner 进行分配，申请启动 MRAppMaster；
   5. ResourceManager 根据分片和 job 等信息，选择数据所在节点启动 MapTask（程序找数据），唤醒MRAppMaster；
   6. MRAppMaster 启动，持续监控和管理任务；
   7. MapTask 启动，开始干活；
2. Map 阶段
   1. 数据读取，每个 task 读取自己节点上的数据；
   2. 数据处理
      1. 每个 task 对自己读取到的数据进行 split，分成更小的数据块；
      2. 对每个 split 的数据进行 map，提取 key、value、con；
      3. 对数据进行分区，有条件建议自定义分区，可以解决数据倾斜的问题，对之后的 reduce 也有极大的优化；
      4. 数据进入环形缓冲区，以起始点为赤道，到达溢出比后，刷新赤道；
      5. 溢出的数据刷入 sort 进行排序；
      6. 排序号的数据放入 spill，进行 merge 后有序写入 HDFS；
3. Reduce 阶段
   1. Reduce 启动
      1. MRAppMaster 监控到 reduce 任务即将结束，开始申请启动 ReduceTask；RM 接受申请，根据分区结果，启动若干 ReduceTask。
      2. ReduceTask启动，把每个 map 结果中的不同分区的数据，shuffle 数据到对应 ReduceTask 所在节点的缓存。
   2. 数据处理
      1. 在缓存中对每个 sotr 进行 merge（内存、缓存都有）；
      2. 将 merge 后的结果，重新进行 spill，排序后，落到 HDFS；
      3. 将所有小文件 merge 成一个大文件；
   3. Reduce 阶段
      1. 调用 Reduce 函数，对排序好的 file 进行汇总；
      2. 将最终结果写入到 HDFS 中；
4. 任务结束阶段
   1. MRAppMaster 监控到每个 Reduce 节点的执行情况；
   2. 向上汇报，并申请注销自己；
   3. RM 注销 MRAppMaster，并向上汇报；
   4. YarnRunner 返回任务完成信息；
   5. 客户端接受信息，任务结束。

整体流程图如下：

... 无奈，图片比较大，显示效果特别差，只能放链接了，后边想办法优化。

链接：https://pan.baidu.com/s/1cF2CDo5NAzI7vOtQgvo_nw?pwd=r85y

提取码：r85y 
