# 在Amazon Linux 2023上安装Certbot
sudo dnf install certbot python3-certbot-nginx -y

# 验证安装
certbot --version

# 1. 停止nginx（让certbot使用80端口）
sudo systemctl stop nginx

# 2. 获取证书
sudo certbot certonly --standalone \
    --agree-tos \
    --no-eff-email \
    --email etherdinh@gmail.com \
    -d storage.34uisdfsigda.filegear-sg.me
// 3.证书位置
    Certificate is saved at: /etc/letsencrypt/live/storage.34uisdfsigda.filegear-sg.me/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/storage.34uisdfsigda.filegear-sg.me/privkey.pem


# 4.编辑配置文件
sudo nano /etc/nginx/conf.d/nextjs-app.conf
# HTTP服务器块 - 重定向到HTTPS
server {
    listen 80;
    server_name storage.34uisdfsigda.filegear-sg.me;
    
    # 重定向所有HTTP请求到HTTPS
    return 301 https://$server_name$request_uri;
}

# HTTPS服务器块
```server {
    listen 443 ssl;
    http2 on;  # 新的http2指令语法
    server_name storage.34uisdfsigda.filegear-sg.me;

    # SSL证书配置
    ssl_certificate /etc/letsencrypt/live/storage.34uisdfsigda.filegear-sg.me/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/storage.34uisdfsigda.filegear-sg.me/privkey.pem;

    # SSL配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # 安全头
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    # 反向代理到Next.js应用
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
        proxy_set_header X-Forwarded-Host $server_name;
        proxy_set_header X-Forwarded-Port $server_port;
    }

    # 文件上传大小限制
    client_max_body_size 100M;
}```

#重新加载nginx配置
sudo systemctl reload nginx
#检查nginx状态
sudo systemctl status nginx
#验证SSL证书状态
sudo certbot certificates

# 测试HTTP重定向
curl -I http://storage.34uisdfsigda.filegear-sg.me

# 测试HTTPS连接
curl -I https://storage.34uisdfsigda.filegear-sg.me