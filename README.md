# # 410stats-client
Ce repository comprend 2 composants :
- [L'API (Hapi.js)](./api) fournissant les données au client web
- [Le client web (Vue.js)](./dashboard) affichant les données de l'API

## Avant de commencer

### Réglages
#### API
Contrairement au script 410stats, je n'ai pas encore fait de fichier de configuration séparé pour l'API.
Il faut modifier directement [le fichier source de l'API](./api/api.js)  pour y rentrer les réglages de la base MySQL. Des réglages fictifs y sont déjà présents, pour chaque environnement (production ou développement)
```
if (process.env.NODE_ENV === "production") {
  console.log("Production mode");
  pool = mysql.createPool({
    host: 'localhost',
    user: '410stats_api',
    database: '410stats',
    password: 'lQYnhUV9FXBS4icb',
    debug: false
  });
} else {
  console.log("Dev mode");
  pool = mysql.createPool({
    host: '188.166.175.66',
    user: 'dev_api',
    database: '410stats_dev',
    password: 'ebDBLxZvLtdRJovh',
    debug: false
  });
}
```


### Installation
Il faut installer les paquets Npm de l'API ET celui du client web.
N'effectuez pas cette commande à la racine du repository, mais effectuez 2 fois cette commande, une fois en étant dans le dossier /api, une autre fois dans le dossier /dashboard
```
npm install
```
### Lancement
#### API
Un fichier de configuration PM2 est présent à la racine du projet [Ecosystem410stats_api.config.json](./Ecosystem410stats_api.config.json)
Tout d'abord installez PM2
```
npm install -g pm2
```
Puis lancez le fichier de configuration
```
pm2 start Ecosystem410stats_api.config.json
```
Si vous voulez le lancer en mod production :
```
pm2 start Ecosystem410stats_api.config.json --env production
```
Normalement, l'API s'est lancée en mode service (elle ne se fermera pas à la fermeture de votre invité de commande) et vous pouvez y accéder via localhost:8000
#### Client web

Je vous invite à aller voir le fichier [Readme](./dashboard/README.md), provenant de la template que j'ai utilisée, pour lancer et/ou build le client web. Pour un déploiement public vous aurez plutôt besoin de le build.
Cependant, le client ne sera pas encore lié à l'api. Lisez le paragraphe suivant.
### Déploiement
Pour que le client fonctionne, il faut que le serveur web l'hébergeant et l'API soient sur le même port.
Pour cela, nous allons utiliser un  **reverse proxy** qui redirigera les requêtes sur l'adresse /api du port 80 (le port web) vers le port 8000 utilisé par l'API.
Pour ce faire, j'ai utilisé Nginx, qui s'occupe d'heberger les fichiers HTML statiques du client web, tout en effectuant cette redirection.
Voici un exemple de fichier de configuration Nginx servant le dossier contenant le build de vuejs dans "/home/vuejs"
Reportez vous à la documentation de Nginx pour plus d'informations, le fichier ne marchera surement pas pour votre cas.

```
#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;
events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    upstream api_node_js {
        server    127.0.0.1:8000;
    }

    server {
          listen       80;
	      server_name  localhost;

	      root /home/vuejs;

          index index.html;

          location / {
            try_files $uri $uri/ @rewrites;
          }

          location @rewrites {
            rewrite ^(.+)$ /index.html last;
          }

          location ~* \.(?:ico|css|js|gif|jpe?g|png)$ {
            # Some basic cache-control for static files to be sent to the browser
            expires max;
            add_header Pragma public;
            add_header Cache-Control "public, must-revalidate, proxy-revalidate";
          }

          location /api {
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header Host $http_host;
            proxy_set_header X-NginX-Proxy true;

            rewrite ^/api/?(.*) /$1 break;

            proxy_pass http://api_node_js;
            proxy_redirect off;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```
