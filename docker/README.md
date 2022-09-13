# GenomicsDBWebsite Docker Container

> Recommendation: Use `docker compose`; otherwise will have to specify a lot of `build args`

To build from docker image:

* Modify `sample.ev` and save as `.env`
  * **TOMCAT_PORT**: mapped host port for tomcat (default=8080)
  * **TOMCAT_LOG**: target path on host for mounting tomcat log directory; enables logs to be viewed outside of the container
  * **SITE_ADMIN_EMAIL**: _internal_; site error checking mechanism will e-mail certain types of errors to this admin
  * **WEBAPP**: site web application name; e.g., `www.niagads.org/`**genomics** (default=genomics)
  * **PROJECT_ID**: site project or `model` name; `GRCh38` or `GRCh37` (default=GRCh38)
  * **GENOME_BUILD**: full genome build for display purposes (e.g., hg38/GRCh38.p8) (default=GRCh38.p8)
  * **GENCODE_VERSION**:  GENCODE version; for dynamically populating genome browser config; will vary depending on _GENOME_BUILD_ and release
  * **DBSNP_VERSION**: dbSNP version; for dynamically populating genome browser config; will vary depending on _GENOME_BUILD_ and release
  * **ALT_BUILD_LINK**: URL for alternative site (i.e., GRCh37 site if GRCh38 and vice versa) (default=http://localhost:8080/genomics37; production=https://www.niagads.org/genomics37 for alt to GRCh38; https://www.niagads.org/genomics for alt to GRCh37)
  * **GOOGLE_ANALYTICS_ID**: Google analytics ID (default=NA)
  * **DB_PORT**: host port through which database can be accessed (default=5432)
  * **DB_HOST**: database server; if tunneling should use `host.docker.internal` instead of `localhost`
  * **DB_NAME**: name of the web application database (default=genomics38; specify `genomics37` for GRCh37)
  * **DB_WEB_USER**: website "user" account in the DB
  * **DB_WEB_PASSWORD**: password for website "user" account in the DB
  * **SECRET_KEY**: text key for encoding login cookies
