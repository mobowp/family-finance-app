# 修复登录重定向问题

## 问题分析
点击登录后跳转到 `http://114.55.131.189:3000/` 而不是域名，原因在于 NextAuth 的配置。NextAuth 使用 `NEXTAUTH_URL` 环境变量来确定认证回调和重定向的基础 URL。
目前看来，服务器上的环境变量或者 `docker-compose.yml` 配置可能将 `NEXTAUTH_URL` 设置为了服务器 IP 地址。
此外，您的 Nginx 配置是 HTTP (80端口)，但 `.env.production` 中配置的是 HTTPS，这可能导致协议不匹配。

## 修改计划

### 1. 更新环境配置 (`.env.production`)
将 URL 修改为 HTTP 协议，以匹配当前的 Nginx 配置。
- `NEXT_PUBLIC_APP_URL` 修改为 `http://xywm0601.top`
- `NEXTAUTH_URL` 修改为 `http://xywm0601.top`

### 2. 更新 Docker 配置 (`docker-compose.yml`)
修改 `docker-compose.yml`，使其使用环境变量中的 `NEXTAUTH_URL`，而不是硬编码的 `localhost:3000`。这样部署时会正确使用 `.env` 文件中的域名配置。

## 验证
修改后，您需要重新部署或重启应用，确保环境变量生效。登录流程将不再跳转到 IP 地址。
