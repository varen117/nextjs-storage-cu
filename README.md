## 安装shadcn/ui
```bash
pnpm dlx shadcn@latest init
```
提示弹出框：``pnpm dlx shadcn@latest add sonner``
 

============================服务器配置=============================
# 安装docker
```shell
sudo dnf install -y docker
```
 启动自动启动并启动Docker
```shell
systemctl enable --now docker
```
如果希望默认 Amazon Linux 2023 操作系统用户在ec2-user没有根权限的情况下docker操作命令，可执行如下命令：
```shell
usermod -aG docker ec2-user
```

确认安装
```shell
docker info
```
# 安装Docker Compose
```shell
 DOCKER_CONFIG=${DOCKER_CONFIG:-/usr/local/lib/docker}
```
```shell
sudo mkdir -p $DOCKER_CONFIG/cli-plugins
```
```shell
sudo curl -SL https://github.com/docker/compose/releases/download/v2.18.1/docker-compose-linux-x86_64 -o $DOCKER_CONFIG/cli-plugins/docker-compose
```
```shell
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
```
确认安装
```shell
docker compose version
```
# Docker配置常识
#nodejs版本号
FROM node:22.12.0
### 运行目录
WORKDIR /app
### 复制所有必要文件到目录下
COPY package*.json ./
### 他会查看上述package中依赖的所有内容，并在WORKDIR指定的目录下安装所有依赖
RUN npm install
### 将src下所有内容复制到/app目录下
COPY . .
### 运行端口
EXPOSE 3000
#
CMD npm run dev

# 打包Docker镜像
```shell
# mac电脑本地执行
docker build --no-cache -t nextjs-storage-app .
#服务器执行
docker build . --platform linux/amd64 -t storage-app
```
# 推送到github包管理器中
## 生成token令牌
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
## 登陆ghcr.io
```shell
docker login ghcr.io
#密码是上述生成的token
```
## 生成符合要求的docker镜像
```shell
docker build . --platform linux/amd64 -t ghcr.io/varen117/storage-app:latest
```
## 推送镜像到仓库
```shell
docker push ghcr.io/varen117/storage-app:latest
```
# 在服务器上拉取docker镜像
```shell
# 提示：首先应该在服务器上执行上述：登陆ghcr.io的步骤后执行该命令
docker run -p 3000:3000 ghcr.io/varen117/storage-app:latest
```
有环境变量不方便打包进去镜像时使用该命令传入默认配置
```shell
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_APPWRITE_PROJECT_ID="6868c8f8df8dbf" \
  -e NEXT_PUBLIC_APPWRITE_ENDPOINT="https://nyc.cloud.appwrite.io/v1" \
  -e NEXT_PUBLIC_APPWRITE_DATABASE="6868cb2200cc0" \
  -e NEXT_PUBLIC_APPWRITE_USERS_COLLECTION="6868cc0f0a47940" \
  -e NEXT_PUBLIC_APPWRITE_FILES_COLLECTION="6868cd1d5cc" \
  -e NEXT_PUBLIC_APPWRITE_BUCKET="6868cfeb09327b" \
  -e NEXT_APPWRITE_KEY="standard_5c5c8d1c933b6a39ba474cb753116f9c42304faac06413d671f51651fcc8fd244883abc093f5fd2eb9273cdaf862c58885c2897205b15364db14c15c5eea9d2de3df5bcc146807f6dce1c4a77706ca4ff7534b36a6e871c2c641f14e8c2d71bf00e668a035" \
  ghcr.io/varen117/storage-app:v2
```
# 给网站安装SSL证书
1. 申请域名
2. 本地配置SSL证书

## 安装acme.sh
```shell
curl https://get.acme.sh | sh -s email=etherdinh@gmail.com
```

使用：https://github.com/acmesh-official/acme.sh
安装 cron（cronie）：sudo dnf install -y cronie
启动 cron 服务并设置开机自启：sudo systemctl enable --now crond
安装 socat：sudo dnf install -y socat
```markdown
安装位置：
[Sat Jul 12 19:13:21 UTC 2025] Installing to /home/ec2-user/.acme.sh
[Sat Jul 12 19:13:21 UTC 2025] Installed to /home/ec2-user/.acme.sh/acme.sh
```
3. 配置nginx： [NginxReadme.md](NginxReadme.md)
4. nginx配置SSL

