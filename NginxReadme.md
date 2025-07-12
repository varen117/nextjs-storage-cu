根据[nginx官方文档](https://nginx.org/en/linux_packages.html#Amazon-Linux)，我来为你提供在Amazon Linux 2023服务器上安装、配置和启动nginx的完整步骤。

## 🚀 Amazon Linux 2023 安装nginx完整教程

### 1. 安装前置依赖

首先安装必要的工具：

```bash
sudo yum install yum-utils
```

### 2. 配置nginx yum仓库

为Amazon Linux 2023创建nginx仓库配置文件：

```bash
sudo tee /etc/yum.repos.d/nginx.repo << 'EOF'
[nginx-stable]
name=nginx stable repo
baseurl=http://nginx.org/packages/amzn/2023/$basearch/
gpgcheck=1
enabled=1
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true
priority=9

[nginx-mainline]
name=nginx mainline repo
baseurl=http://nginx.org/packages/mainline/amzn/2023/$basearch/
gpgcheck=1
enabled=0
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true
priority=9
EOF
```

### 3. 选择nginx版本（可选）

默认情况下会安装稳定版本。如果你想使用主线版本，可以执行：

```bash
sudo yum-config-manager --enable nginx-mainline
```

### 4. 安装nginx

```bash
sudo yum install nginx
```

安装过程中会提示接受GPG密钥，确认指纹匹配 `573B FD6B 3D8F BC64 1079 A6AB ABF5 BD82 7BD9 BF62` 后接受。

### 5. 启动和启用nginx服务

```bash
# 启动nginx服务
sudo systemctl start nginx

# 设置开机自启动
sudo systemctl enable nginx

# 检查服务状态
sudo systemctl status nginx
```

### 6. 配置防火墙（如果启用了firewall）

```bash
# 开放HTTP端口
sudo firewall-cmd --permanent --add-service=http

# 开放HTTPS端口
sudo firewall-cmd --permanent --add-service=https

# 重新加载防火墙配置
sudo firewall-cmd --reload
```

### 7. 验证安装

```bash
# 检查nginx版本
nginx -v

# 测试nginx配置
sudo nginx -t

# 查看nginx进程
ps aux | grep nginx
```

在浏览器中访问你的服务器IP地址，应该能看到nginx的欢迎页面。

## 🔧 基本配置

### 主配置文件位置

```bash
# 主配置文件
/etc/nginx/nginx.conf

# 站点配置目录
/etc/nginx/conf.d/

# 网站根目录
/usr/share/nginx/html/
```

### 常用管理命令

```bash
# 启动nginx
sudo systemctl start nginx

# 停止nginx
sudo systemctl stop nginx

# 重启nginx
sudo systemctl restart nginx

# 重新加载配置（无需重启）
sudo systemctl reload nginx

# 查看nginx状态
sudo systemctl status nginx

# 测试配置文件语法
sudo nginx -t
```

## 🌐 配置反向代理（用于Docker应用）

如果你要为Docker中的Next.js应用配置反向代理，创建一个新的配置文件：

```bash
sudo tee /etc/nginx/conf.d/nextjs-app.conf << 'EOF'
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名或IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
EOF
```

然后重新加载nginx配置：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 📊 监控和日志

### 查看nginx日志

```bash
# 访问日志
sudo tail -f /var/log/nginx/access.log

# 错误日志
sudo tail -f /var/log/nginx/error.log

# 查看特定站点日志
sudo tail -f /var/log/nginx/access.log | grep "your-domain.com"
```

### 配置日志轮转

nginx日志轮转通常由logrotate自动管理，配置文件位于：

```bash
/etc/logrotate.d/nginx
```

## 🔐 SSL/HTTPS配置（可选）

如果你有SSL证书，可以配置HTTPS：

```bash
sudo tee /etc/nginx/conf.d/nextjs-app-ssl.conf << 'EOF'
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# 重定向HTTP到HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
EOF
```

## 🎯 完整的部署流程

结合你的Docker应用，完整的部署流程是：

```bash
# 1. 启动Docker容器
npm run docker:build:clean
npm run docker:run:detach

# 2. 验证应用运行
curl http://localhost:3000

# 3. 配置nginx反向代理
sudo tee /etc/nginx/conf.d/nextjs-app.conf << 'EOF'
server {
    listen 80;
    server_name your-server-ip;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# 4. 测试并重新加载nginx
sudo nginx -t
sudo systemctl reload nginx
```

现在你的Next.js应用就可以通过nginx在80端口对外提供服务了！
