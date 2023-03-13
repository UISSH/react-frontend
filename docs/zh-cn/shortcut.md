# ShortcutBook

本文将介绍开发者如何添加一个路由到快捷方式中

## 数据流

初始化数据：用户登录成功后，将在`Shortcut.tsx` 渲染时从后端获取快捷方式数据*覆盖写入* localStorage 中。

增删改查数据：均在 `ShortcutBook.tsx` 中完成，且只对 localStorage 中的数据进行操作。

数据的同步：`ShortcutBook.tsx` 组件被卸载后将调用`syncShortcut(../../store/shortStore)`方法同步 localStorage 中的数据至后端。

## 组件

使用该组件时，您需要传入一个`ShortcutItemIF`接口的数据到`shortcutData`即可, 然后按照下列代码传入组件。

### 可选参数

- label
  - 显示在快捷方式上的文字，可选
- className
  - 快捷方式的样式，可选

```javascript
import ShortcutBook from "../overview/ShortcutBook";
import { ShortcutItemIF } from "../../store/shortStore";

const location = useLocation();
const [shortcutData, setShortcutData] = useState<ShortcutItemIF>();

// 适当时机调用 setShortcutData
// 例如：在路由变化时
/*
    useEffect(() => {
    setShortcutData({
        name: "快捷方式名称",
        unique: "唯一标识符",
        cate: "terminal",
        router: location,
    });
    }, [location]);
*/

{
  shortcutData && <ShortcutBook {...shortcutData}></ShortcutBook>
}
```

### 自定义 location

在当前页面添加其他页面的快捷方式的场景时，可以自定义 location 参数

```javascript
const customLocation = {
  pathname: "/terminal?id=1",
  // search: "?id=1", 无效
  state: { fromDashboard: true },
};
```

## 分类

目前不支持自定义分类，仅支持以下分类

- database

  - 数据库相关的分类

- terminal

  - 终端相关的分类

- website

  - 网站相关的分类

- folder

  - 目录相关的分类

- text

  - 可编辑的文本分类

## 接口

### ShortcutItemIF

```javascript
{
  name: string;
  unique: string; // 保证该值唯一
  cate: CateIF["name"];
  router: Location;
}

export type ShortCutCategoryIF =
  | "terminal"
  | "database"
  | "terminal"
  | "website"
  | "folder"
  | "text";

interface CateIF {
  name: ShortCutCategoryIF;
  description: string;
}
```
