这是一个适用于 [x-ui](https://github.com/vaxilu/x-ui) 的管理站点。在使用该项目之前，需先安装 `x-ui` 才能接下来的步骤。该项目使用 [Next.js](https://nextjs.org/docs) 框架开发，所有你得有相关前端的经验才能更好的上手。

## 功能

- 使用订阅链接的方式生成用户节点
- 自动检测节点是否可用并重新生成
- 用户端根据用户名登录查看节点信息以及订阅链接
- 后台可配置服务模型和用户管理
- 适配移动端且整站支持暗黑模式

![](https://raw.github.com/ponjs/xray-node/master/public/readme-dashboard.png)
![](https://raw.github.com/ponjs/xray-node/master/public/readme-client.png)

## 开发

在执行下面命令之前，得确保你电脑已经安装好了 [Node.js 18.17](https://nodejs.org/) 以上版本和 [yarn](https://yarnpkg.com/)。

```bash
# 安装依赖
yarn install
```

将项目中 `.env.example` 文件复制一份到根目录并改名为 `.env`，在 `.env` 文件填入项目 `x-ui` 相关信息。

```
X_BASE_URL="http://127.0.0.1:54321"
X_USERNAME="username"
X_PASSWORD="password"
```

创建本地数据库。

```bash
npx prisma migrate dev --name init
```

执行下面命令运行开发模式，在浏览器访问 `http://localhost:3000` 即可。

```bash
yarn dev
```

## 部署

在部署之前可先查看 [Next.js](https://nextjs.org/docs/app/building-your-application/deploying) 文档。

```bash
# 编译
yarn build
# 运行
yarn start
```
