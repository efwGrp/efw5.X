# Efw5 中的变更

## 1. 从 Narshorn 切换到 Graaljs
- 支持的 JavaScript 版本从 ES6 (2015) 升级到 ES15 (2024)。
- 废弃了全局模块的 loadWithGlobalPool 和 loadWithNewGlobal 函数。
- 将 Efw 函数和模块重新创建为 JavaScript 类。
- 废弃了 Efw 类未初始化时出现的 NewKeywordWasForgottenException 错误。
- 废弃了Threads类。

## 2. 更改为多上下文
- 在发布模式下，事件 js 文件夹中的所有源代码都会加载到内存中。
- 在发布模式下，load 函数会被忽略。
- 在发布模式下，事件模块的 load 函数会被忽略。
- 会话模块中除 Java 对象和 JSON 对象以外的内容会被忽略。
- 不推荐在初始化全局事件时执行繁重的处理。

## 3. 移除一些鲜有使用记录的功能
- db 模块主函数
- 条形码模块
- TXTReader 类
- keepConnectionAlive 用于在长时间运行执行期间维持会话

## 4. 由于相关软件的变更而停用
- Client 标签的 nopromise 属性
```
终止对 IE 和 IE 模式的支持
终止对 wkhtmltopdf 的支持
```

- brms 模块及相关属性设置
```
从运行时使用 innorules 转换为 RestAPI
```
- 客户端函数 Efw() 的服务器参数
```
各种浏览器的安全性增强导致使用 CORS 变得困难
```
- CORS 相关属性设置
```
请使用 Tomcat 的 CORS 设置解决此问题。
https://tomcat.apache.org/tomcat-9.0-doc/config/filter.html
```

## 5. 部分内部函数升级
- event 模块中的 load 和 get 函数
- db 模块中的 commit、rollback、commitAll 和 rollbackAll 函数

## 6. 针对 Vue 集成的功能调整
- 为 Result 类添加 provide 函数
- 为客户端 Efw 函数添加返回值
- 为 Client 标签添加 addVue 属性