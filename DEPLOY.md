# 部署指南 (Deployment Guide)

本指南将帮助您将家庭记账理财应用部署到阿里云服务器（或其他 VPS）。

## 1. 准备工作

### 服务器环境
确保您的服务器已安装 Docker 和 Docker Compose。

如果尚未安装，可以使用以下命令（以 Ubuntu 为例）：

```bash
# 安装 Docker
curl -fsSL https://get.docker.com | bash

# 安装 Docker Compose (如果 Docker 版本较新，可能已内置 docker compose 命令)
sudo apt-get update
sudo apt-get install docker-compose-plugin
```

### 本地准备
1. 确保项目根目录下的 `next.config.mjs` 已配置 `output: "standalone"`（已为您配置）。
2. 确保本地已生成数据库文件 `prisma/dev.db`（如果还没有，请在本地运行 `npm run dev` 或 `npx prisma migrate dev` 生成）。

## 2. 上传代码

将项目文件上传到服务器。您可以使用 `scp`、`rsync` 或 FTP 工具。

**需要上传的文件/目录：**
- `app/`
- `components/`
- `hooks/`
- `lib/`
- `prisma/`
- `public/`
- `Dockerfile`
- `docker-compose.yml`
- `next.config.mjs`
- `package.json`
- `postcss.config.js`
- `tailwind.config.ts`
- `tsconfig.json`
- `.env` (可选，或者在 docker-compose.yml 中配置环境变量)

**不需要上传：**
- `node_modules/`
- `.next/`
- `.git/`

## 3. 服务器端配置

1. **创建数据目录**
   在服务器上的项目根目录下，创建一个 `data` 目录用于存放数据库文件，以确保数据持久化。

   ```bash
   mkdir data
   ```

2. **准备数据库文件**
   - **如果您有现有的数据**：将本地的 `prisma/dev.db` 文件上传到服务器的 `data/` 目录中。
   - **如果是新部署**：建议先在本地生成好 `dev.db` 然后上传。

3. **修改配置 (可选)**
   编辑 `docker-compose.yml` 文件，修改 `AUTH_SECRET` 为一个随机的安全字符串。

   ```yaml
   environment:
     - AUTH_SECRET=your_secure_random_string
   ```

## 4. 启动服务

在服务器项目目录下运行：

```bash
docker compose up -d --build
```

- `--build`: 确保构建最新的镜像。
- `-d`: 后台运行。

## 5. 阿里云安全组设置

确保您的阿里云 ECS 实例的安全组规则中，已开放 **3000** 端口（TCP）。

1. 登录阿里云控制台。
2. 进入 ECS 实例详情 -> 安全组 -> 配置规则。
3. 添加一条入方向规则：
   - 端口范围：`3000/3000`
   - 授权对象：`0.0.0.0/0` (允许所有 IP 访问)

## 6. 访问应用

在浏览器中访问：`http://<您的服务器公网IP>:3000`

## 常见问题

### 如何更新应用？
1. 上传新的代码文件。
2. 运行 `docker compose up -d --build`。

### 如何备份数据？
只需备份服务器上的 `data/dev.db` 文件即可。

### 数据库迁移？
由于生产环境镜像不包含开发依赖（如 Prisma CLI），建议在本地进行数据库结构变更（Migration），然后将更新后的 `dev.db` 上传到服务器。或者在本地执行 `npx prisma migrate deploy` 更新本地 db 后再上传。
