bashCopy code
FROM node:20
WORKDIR /app
COPY packgae*.json ./
RUN npm install
COPY . .
ENV PORT 8080
EXPOSE 8080
CMD ["node", "app.js"]