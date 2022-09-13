# syntax=docker/dockerfile:1

ARG WEBAPP=genomics
ARG PROJECT_ID=GRCh38
ARG SECRET_KEY=key
ARG GOOGLE_ANALYTICS_ID=NA

ARG DB_PORT=5432
ARG DB_HOST=localhost
ARG DB_NAME=genomics38

ARG DB_WEB_USER=genomics
ARG DB_WEB_PASSWORD=pg_password

ARG GENOME_BUILD=GRCh38.p8
ARG GENCODE_VERSION=v36
ARG DBSNP_VERSION=155
ARG ALT_BUILD_LINK=https://www.niagads.org/genomics37

# FROM tomcat:jdk11-adoptopenjdk-hotspot
FROM tomcat:9.0.65-jdk11-temurin-jammy

ENV SITE_HOME=/www/genomics
ENV COMMON_DIR=/www/common
ENV GUS_HOME=/www/genomics/gus_home
ENV PROJECT_HOME=/www/genomics/project_home

RUN echo "Builiding $GENOME_BUILD website at w/web root = ${WEBAPP}"

# install build dependencies
# TODO: specify versions for maven, nodejs, npm?
RUN apt-get update && apt-get install -y git maven nodejs npm ant python3-pip && \
    # clean up temp directories
	apt-get clean && apt-get purge && \
	rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*


# Python Modules 
# -------------------------------------------------
RUN pip3 install --no-cache-dir  \
    pandas scipy statsmodels wordcloud numpy seaborn

RUN mkdir -p $SITE_HOME/conf $SITE_HOME/gus_home/config $SITE_HOME/webapp \ 
    $SITE_HOME/cgi-bin $SITE_HOME/cgi-lib $SITE_HOME/htdocs \
    $COMMON_DIR/temp $COMMON_DIR/secret

WORKDIR $PROJECT_HOME

RUN git clone --depth 1 -b api-build-50 https://github.com/NIAGADS/WDK.git && \
    git clone --depth 1 -b api-build-50 https://github.com/NIAGADS/WDKClient.git && \
    git clone --depth 1 -b api-build-50 https://github.com/NIAGADS/install.git && \
    git clone --depth 1 -b api-build-50 https://github.com/NIAGADS/WSF.git && \
    git clone --depth 1 -b api-build-50 https://github.com/NIAGADS/FgpUtil.git && \
    git clone --depth 1 -b api-build-50 https://github.com/NIAGADS/EbrcModelCommon.git && \
    git clone --depth 1 -b api-build-50 https://github.com/NIAGADS/EbrcWebsiteCommon.git && \
    git clone --depth 1 -b api-build-50 https://github.com/NIAGADS/EbrcWebSvcCommon.git && \
    git clone --depth 1 https://github.com/NIAGADS/GenomicsDBWebsite.git

WORKDIR $SITE_HOME

ENV PATH $PATH:$GUS_HOME/bin:$PROJECT_HOME/install/bin

RUN echo "Building website " && \ 
    # https://www.topzenith.com/2020/07/http-status-404-not-found-docker-tomcat-image.html
    rm -r $CATALINA_HOME/webapps && mv $CATALINA_HOME/webapps.dist/ $CATALINA_HOME/webapps && \
    # set webapp properties
    cp $GUS_HOME/config/webapp.prop.sample webapp.prop && \
    sed -i "s|@WEBAPP@|${WEBAPP}|g" $GUS_HOME/config/webapp.prop && \
    sed -i "s|@PROJECT_ID@|${PROJECT_ID}|g" $GUS_HOME/config/webapp.prop && \
    sed -i "s|@GOOGLE_ANALYTICS_ID@|${GOOGLE_ANALYTICS_ID}|g" $GUS_HOME/config/webapp.prop && \
    # build website
    cp $PROJECT_HOME/install/gus.config.sample $GUS_HOME/config/gus.config && \
    bldw NIAGADSWebsite $GUS_HOME/conifg/webapp.prop && \
    # link postgres driver to tomcat
    ln -s $GUS_HOME/lib/java/db_driver/postgresql-42.2.14.jar $CATALINA_HOME/lib/postgresql-42.2.14.jar 
    # clean up
    # && rm -r $PROJECT_HOME

RUN echo "Creating/modifying configuration files" && \
    # secret key file for cookie-based authentication
    cat $SECRET_KEY > $COMMON_DIR/secret/.wdk_key && \
    # model.props (specific for genome build b/c of third-party URLs)
    cp $GUS_HOME/config/$GENOME_BUILD/model.prop.sample $GUS_HOME/config/{$GENOME_BUILD}/model.prop && \
    sed -i "s|@WEBAPP@|${WEBAPP}|g" $GUS_HOME/config/$GENOME_BUILD/model.prop && \
    sed -i "s|@SITE_ADMIN_EMAIL@|${SITE_ADMIN_EMAIL}|g" $GUS_HOME/config/$GENOME_BUILD/model.prop && \
    # model-config
    cp $GUS_HOME/config/model-config.xml.sample $GUS_HOME/config/{$GENOME_BUILD}/model-config.xml && \
    sed -i "s|@MODEL@|${PROJECT_ID}|g" $GUS_HOME/config/$GENOME_BUILD/model-config.xml && \
    sed -i "s|@SITE_ADMIN_EMAIL@|${PROJECT_ID}|g" $GUS_HOME/config/$GENOME_BUILD/model-config.xml && \
    sed -i "s|@DB_WEB_USER@|${DB_WEB_USER}|g" $GUS_HOME/config/$GENOME_BUILD/model-config.xml && \
    sed -i "s|@DB_WEB_PASSWORD@|${DB_WEB_PASSWORD}|g" $GUS_HOME/config/$GENOME_BUILD/model-config.xml && \
    sed -i "s|@DB_HOST@|${DB_HOST}|g" $GUS_HOME/config/$GENOME_BUILD/model-config.xml && \
    sed -i "s|@DB_PORT@|${DB_PORT}|g" $GUS_HOME/config/$GENOME_BUILD/model-config.xml && \
    sed -i "s|@DB_NAME@|${DB_NAME}|g" $GUS_HOME/config/$GENOME_BUILD/model-config.xml
