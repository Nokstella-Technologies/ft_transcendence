FROM nginx:latest

WORKDIR /app
# Copiar o restante do código da aplicação

COPY ./nginx.conf /etc/nginx/nginx.conf
# Copiar os arquivos estáticos para o Nginx
COPY . /usr/share/nginx/html

# Expor a porta que o Nginx está rodando
EXPOSE 80

# Comando para rodar o Nginx
CMD ["nginx", "-g", "daemon off;"]