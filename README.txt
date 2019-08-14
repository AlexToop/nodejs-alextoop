-----------------------------------------------------------
Requirements AWS Bitnami for this tutorial. Node.js required.
-----------------------------------------------------------

------------------- AWS Bitnami Install -------------------
1. sudo /opt/bitnami/letsencrypt/scripts/generate-certificate.sh -m YOURMAIL -d YOURDOMAIN -d www.YOURDOMAIN
2. sudo mkdir -p /opt/bitnami/apps/nodejs_website
   sudo mkdir /opt/bitnami/apps/nodejs_website/conf
   sudo mkdir /opt/bitnami/apps/nodejs_website/htdocs
3. sudo vim /opt/bitnami/apps/myapp/conf/httpd-prefix.conf add:
   Include "/opt/bitnami/apps/nodejs_website/conf/httpd-app.conf"
4. sudo vim /opt/bitnami/apps/myapp/conf/httpd-app.conf add:
   ProxyPass / http://127.0.0.1:443/
   ProxyPassReverse / http://127.0.0.1:443/
5. sudo vim /opt/bitnami/apache2/conf/bitnami/bitnami-apps-prefix.conf add:
   Include "/opt/bitnami/apps/myapp/conf/httpd-prefix.conf"
6. cd /opt/bitnami/apps/nodejs_website/htdocs
   git clone https://github.com/AlexToop/nodejs-alextoop.git .
   (ensure that final '.' is included)
   npm install

Bitnami assitance:
(Credit https://docs.bitnami.com/aws/how-to/generate-install-lets-encrypt-ssl/#step-3-configure-the-web-server-to-use-the-let-s-encrypt-certificate)
(Credit https://docs.bitnami.com/aws/infrastructure/nodejs/administration/create-custom-application-nodejs/)
HTTPS assitence:
https://www.youtube.com/watch?v=8ptiZlO7ROs
https://coolaj86.com/articles/how-to-create-a-csr-for-https-tls-ssl-rsa-pems/ && https://github.com/solderjs/nodejs-ssl-example

------------------- General operation -------------------
1. Apache: sudo /opt/bitnami/ctlscript.sh stop apache (etc.)
2. npm start (testing)
3. sudo forever start ./bin/www.js (production)
4. Requires new certificate and edits to bin/www.js is new hosting is desired.

------ Full used installation ------

sudo apt upgrade
sudo apt update

curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install build-essential nodejs
sudo npm install express --global
sudo npm install forever --global
sudo apt install certbot
sudo apt install git-core
-> go to desired install location (folder)
sudo git clone https://github.com/AlexToop/nodejs-alextoop.git .
sudo npm install
sudo certbot certonly --standalone
alextoop@outlook.com
Y
N
www.alextoop.com
Ensure lightsail has port 443 TCP port open for HTTPS
cd /home/apps/alextoopcom/
sudo forever start ./bin/www.js (alternatively: npm start ./bin/www.js)
sudo certbot renew

-------------------------------------------------------------------------------------------------

----- Run certbot -----
sudo certbot certonly --standalone
// if needed: app.use(express.static(__dirname + '/static', { dotfiles: 'allow' } ))
type certbot
env EDITOR=vim crontab -e
add (check renew every 12 hours): 0 */12 * * * root /usr/local/bin/certbot renew >/dev/null 2>&1
crontab -l

----- Run forever -----
forever start test.js
forever list
forever stop 0

----- Maintenance -----
free --mega

----- Check installations -----
npm -v
nodejs -v
express -v
