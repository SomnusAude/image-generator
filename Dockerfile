# Используем официальный Node.js образ
FROM node:22-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --legacy-peer-deps
RUN npm i -g @nestjs/cli

# Копируем исходный код
COPY . .

RUN npx prisma generate


# Собираем TypeScript (если требуется)
RUN npm run build

# Открываем порт (по умолчанию 3000 для NestJS)
EXPOSE 3000

# Запускаем приложение
CMD ["node", "dist/main.js"]
