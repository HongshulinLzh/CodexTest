# 前后端一体化用户登录系统（Vue3 + Express + SQLite + JWT）

## 1. 项目结构

```bash
your-project/
├─ frontend/
│  ├─ index.html
│  ├─ package.json
│  ├─ vite.config.js
│  └─ src/
│     ├─ App.vue
│     ├─ main.js
│     └─ style.css
├─ backend/
│  ├─ .env.example
│  ├─ db.js
│  ├─ package.json
│  ├─ server.js
│  └─ data/
│     └─ auth.db          # 运行后自动生成（已在 .gitignore 中忽略）
├─ .gitignore
└─ README.md
```

## 2. 功能说明

- 前端：Vue3 + Vite + Axios，包含注册/登录表单。
- 登录成功后显示当前用户信息和 JWT Token。
- 后端：Node.js + Express，提供：
  - `POST /api/register`
  - `POST /api/login`
- 数据库：SQLite，服务启动时自动创建 `users` 表：
  - `id`
  - `username`
  - `password_hash`

## 3. 环境要求

- Node.js 18+（建议）
- npm 9+

## 4. 正确进入项目目录（解决 `cd: no such file or directory`）

> 不要直接使用 `/workspace/CodexTest`，这是开发容器里的路径，在你的电脑上通常不存在。

请先进入你自己克隆下来的项目目录，例如：

```bash
# 例子：你把仓库放在 ~/code/login-demo
cd ~/code/login-demo
pwd
```

确认当前目录下存在 `frontend/` 和 `backend/`：

```bash
ls
```

## 5. 依赖安装

### 安装后端依赖

```bash
cd backend
npm install
```

### 安装前端依赖

```bash
cd ../frontend
npm install
```

## 6. 启动命令

### 启动后端（端口 3000）

```bash
cd backend
cp .env.example .env
npm run dev
```

### 启动前端（端口 5173）

```bash
cd frontend
npm run dev
```

启动后访问：`http://localhost:5173`

## 7. 常见报错排查

### 报错 1：`cd: no such file or directory: /workspace/CodexTest/backend`

原因：你在本机执行了容器专用路径。

解决：进入你本机真实项目目录后，再执行：

```bash
cd backend
```

---

### 报错 2：`npm error Tracker "idealTree" already exists`

常见原因：

- 在同一目录同时启动了多个 `npm install`。
- 上一次安装中断，缓存/锁状态异常。

按顺序修复：

```bash
# 1) 关闭其他 npm 进程
# macOS / Linux:
pkill -f npm || true

# 2) 在报错目录执行（如 backend 或 frontend）
rm -rf node_modules package-lock.json
npm cache clean --force

# 3) 重新安装
npm install
```

如果仍失败，可升级 npm 后重试：

```bash
npm i -g npm
npm -v
```

## 8. 接口说明

### `POST /api/register`

请求体：

```json
{
  "username": "alice",
  "password": "123456"
}
```

成功响应（201）：

```json
{
  "message": "注册成功",
  "user": {
    "id": 1,
    "username": "alice"
  }
}
```

### `POST /api/login`

请求体：

```json
{
  "username": "alice",
  "password": "123456"
}
```

成功响应（200）：

```json
{
  "message": "登录成功",
  "token": "<JWT_TOKEN>",
  "user": {
    "id": 1,
    "username": "alice"
  }
}
```

## 9. GitHub 提交完整步骤（含 `.gitignore`）

```bash
# 1) 初始化仓库（若未初始化）
git init

# 2) 检查 .gitignore 是否生效
git status

# 3) 添加文件
git add .

# 4) 创建提交
git commit -m "feat: add full-stack login system with vue express sqlite jwt"

# 5) 关联远程仓库（替换为你的地址）
git remote add origin git@github.com:<your-name>/<your-repo>.git

# 6) 推送到主分支
git branch -M main
git push -u origin main
```

## 10. 安全建议（生产环境）

- 使用强随机 `JWT_SECRET`。
- 对登录接口增加限流与验证码。
- 开启 HTTPS。
- 密码策略（最小长度、复杂度）和异常登录审计。
