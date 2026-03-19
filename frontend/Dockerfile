# Dockerfile para aplicação React
FROM node:18

# Diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY . .

#Expõe a porta da aplicação
EXPOSE 3001

# Comando para iniciar a aplicação em modo desenvolvimento
CMD ["npm", "start"]
