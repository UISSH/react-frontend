# osquery 介绍

osquery是一个针对Windows、OS X（macOS）和Linux操作系统的操作系统工具包。这些工具可以使底层的操作系统分析和监控变得高效且易于理解。

osquery将操作系统呈现为高性能的关系型数据库。这意味着您可以编写SQL查询来探索操作系统数据。使用osquery，SQL表代表抽象概念，如运行的进程、加载的内核模块、打开的网络连接、浏览器插件、硬件事件或文件哈希值。

继续往下阅读时，您需要掌握osquery的基本概念。如果您还不熟悉osquery，请参阅[osquery官方文档](https://osquery.readthedocs.io/en/stable/)。

## 查询数据

要查询系统状态，需要创建 websocket 实例。
```json
{"message": "connection succeeded\r\n", "code": 201}
```
> 注意：每次收到数据后都需要 JSON.parse解析数据, 每次发送数据前都需要 JSON.stringify序列化数据, 否则会报错


```javascript
import { getWSGateway } from ../../requests/utils";

// getWSGateway 会获取当前环境且授权的 websocket 地址
let ws = new WebSocket(getWSGateway("server_status"));

```

连接成功后服务器且会返回一次 201 状态码，此时可以发送查询语句。

```json
{ 
    query_sql:"查询语句",
    interval: "单位秒，如果设置1秒，那么每1秒会返回一次数据"
}
```
```javascript
ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.code === 201) {
        let sql = "select * from processes";
        ws.send(JSON.stringify({ 
            query_sql: sql,
            interval: 1,
         }));
    }else{
        // 每一秒会返回一次数据
        // data as OsqueryResult
        console.log(data);
    }
};
```
### 接口定义

```typescript
interface OsqueryResult {
  doc: string;
  action: string;
  sql: string;
  message: Message;
  code: number;
}

interface Message {
  out: Out[];
  err: string;
}
interface Out {
  [key: string]: string;
}
```

## 本地运行

```bash
osqueryi --json "select * from processes"
```