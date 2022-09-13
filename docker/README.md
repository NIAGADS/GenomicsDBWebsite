# GenomicsDBWebsite Docker Container

> Recommendation: Use `docker compose`; otherwise will have to specify a lot of `build args`

To build from docker image:

* Modify `sample.ev` and save as `.env`
  * **TOMCAT_PORT**: mapped host port for tomcat (default=8080)
  * **TOMCAT_LOG**: target path on host for mounting tomcat log directory; enables logs to be viewed outside of the container
  * **SITE_ADMIN_EMAIL**: _internal_; site error checking mechanism will e-mail certain types of errors to this admin
  * **WEBAPP**
WEBAPP=genomics
PROJECT_ID=GRCh38
GENOME_BUILD=GRCh38.p8
GENCODE_VERSION=v36
DBSNP_VERSION=155
ALT_BUILD_LINK=http://localhost:8080/genomics37
GOOGLE_ANALYTICS_ID=NA

DB_PORT=5432
# DB_HOST=host.docker.internal
DB_HOST=db-host-name-or-ip
DB_NAME=genomics38

DB_WEB_USER=genomics
DB_WEB_PASSWORD=pg_password

SECRET_KEY=niagads-secret-key-for-encoding-login-cookie
