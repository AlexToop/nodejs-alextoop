Development

Ensure node.js is installed
Project root use npm install
Project root use npm start



AWS Bitnami Install

sudo /opt/bitnami/ctlscript.sh stop apache
npm install
*ensure desired port in bin/www (port 80 ideal)
npm start || sudo forever start ./bin/www
