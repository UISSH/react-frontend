
# 常用方法

## 路由到新页面

```javascript
import { useLocation, useNavigate } from "react-router-dom";


const location = useLocation();
const navigate = useNavigate();

navigate(`?action=update`, {
        state: {
        id: row.id,
        schedule: row.schedule,
        command: row.command,
        shellscript: row.shellscript,
        },
    });
    
//  new page
let data = {
        schedule: location.state?.schedule,
        command: location.state?.command,
      }
```

# 组件

[ShortcutBook 组件](/zh-cn/shortcut.md)

# 后端API

[osquery 使用](/zh-cn/osquery.md)