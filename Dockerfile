# 使用 node 14 作為基礎映像
FROM node:14

# 創建一個工作目錄
WORKDIR /app

# 將 package.json 和 package-lock.json 複製到容器中
COPY package*.json ./

# 安裝依賴項
RUN npm install

# 將所有文件複製到容器中
COPY . .

# 暴露 3000 端口
EXPOSE 3000

# 啟動應用程式
CMD [ "node", "index.js" ]
