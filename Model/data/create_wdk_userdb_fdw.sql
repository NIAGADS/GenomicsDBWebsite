/* creates the folllowing foreign schemas associated with the wdk_userDB foreign server
   userlogins5
   announce
*/


-- DROP EXTENSION postgres_fdw CASCADE;

--CREATE EXTENSION IF NOT EXISTS postgres_fdw;

/* Create the Foriegn Server and user mappings using the createForeignServerMappings script in GenomicsDBWebsite/Model/bin 
        e.g., to create the foreign server mapping:
        createForeignServerMappings --createServer --serverName wdk_userDB --serverPort 5437 --serverDB genomicsdb_user_dev --serverHost localhost --commit
        e.g., to create a user mapping based on the creditials in the gus.config file:
              createForeignServerMappings --createUserMapping --serverName wdk_userDB --commit 
        e.g., to create a non-admin user mapping
              createForeignServerMappings --createUserMapping --serverName wdk_userDB --user <user> --pwd <pwd> --commit
    The script can also be used to alter the server, when transitioning from dev to standby or to production, e.g.,
              createForeignServerMappings --alterServer --serverName wdk_userDB --serverPort 5432 --serverDB genomicsdB_user_prod --serverHost localhost --commit
*/
        
/* after running this, run grantForeignSchemaUsage to grant usage on the schema to the users w/mappings 
   e.g., grantForeignSchemaUsage --schema userlogins5 --user <user> --commit
*/

--==============================================================================

DROP SCHEMA IF EXISTS userlogins5 CASCADE;
CREATE SCHEMA IF NOT EXISTS userlogins5;

--==============================================================================

CREATE FOREIGN TABLE userlogins5.config
(
  config_name   VARCHAR(100) NOT NULL,
  config_value  VARCHAR(255),
  migration_id  NUMERIC(12)
)
SERVER wdk_userDB
        OPTIONS (schema_name 'userlogins5', table_name 'config');
        
--==============================================================================

CREATE FOREIGN TABLE userlogins5.users
(
  user_id       NUMERIC(12) NOT NULL,
  is_guest      BOOLEAN NOT NULL,
  first_access  TIMESTAMP
)
SERVER wdk_userDB
        OPTIONS (schema_name 'userlogins5', table_name 'users');
        
--==============================================================================

CREATE FOREIGN TABLE userlogins5.user_roles
(
  user_id       NUMERIC(12) NOT NULL,
  user_role     VARCHAR(50) NOT NULL,
  migration_id  NUMERIC(12)
)
SERVER wdk_userDB
        OPTIONS (schema_name 'userlogins5', table_name 'user_roles');
        
--==============================================================================

CREATE FOREIGN TABLE userlogins5.preferences
(
  user_id           NUMERIC(12) NOT NULL,
  project_id        VARCHAR(50) NOT NULL,
  preference_name   VARCHAR(200) NOT NULL,
  preference_value  VARCHAR(4000),
  migration_id      NUMERIC(12)
)
SERVER wdk_userDB
        OPTIONS (schema_name 'userlogins5', table_name 'preferences');
        
--==============================================================================

CREATE FOREIGN TABLE userlogins5.user_baskets (
  basket_id       NUMERIC(12) NOT NULL,
  user_id         NUMERIC(12) NOT NULL,
  basket_name     VARCHAR(100),
  project_id      VARCHAR(50) NOT NULL,
  record_class    VARCHAR(100) NOT NULL,
  is_default      BOOLEAN,
  category_id     NUMERIC(12),
  pk_column_1     VARCHAR(1999) NOT NULL,
  pk_column_2     VARCHAR(1999),
  pk_column_3     VARCHAR(1999),
  prev_basket_id  NUMERIC(12),
  migration_id    NUMERIC(12)
) 
SERVER wdk_userDB
        OPTIONS (schema_name 'userlogins5', table_name 'user_baskets');

--==============================================================================

CREATE FOREIGN TABLE userlogins5.favorites (
  favorite_id       NUMERIC(12) NOT NULL,
  user_id           NUMERIC(12) NOT NULL,
  project_id        VARCHAR(50) NOT NULL,
  record_class      VARCHAR(100) NOT NULL,
  pk_column_1       VARCHAR(1999) NOT NULL,
  pk_column_2       VARCHAR(1999),
  pk_column_3       VARCHAR(1999),
  record_note       VARCHAR(200),
  record_group      VARCHAR(50),
  prev_favorite_id  NUMERIC(12),
  migration_id      NUMERIC(12),
  is_deleted        BOOLEAN
) 
SERVER wdk_userDB
        OPTIONS (schema_name 'userlogins5', table_name 'favorites');

--==============================================================================

CREATE FOREIGN TABLE userlogins5.categories (
  category_id       NUMERIC(12) NOT NULL,
  user_id           NUMERIC(12) NOT NULL,
  parent_id         NUMERIC(12),
  category_type     VARCHAR(50) NOT NULL,
  category_name     VARCHAR(100) NOT NULL,
  description       VARCHAR(200),
  prev_category_id  NUMERIC(12),
  migration_id      NUMERIC(12)
) 
SERVER wdk_userDB
        OPTIONS (schema_name 'userlogins5', table_name 'categories');

--==============================================================================

CREATE FOREIGN TABLE userlogins5.datasets (
  dataset_id        NUMERIC(12) NOT NULL,
  user_id           NUMERIC(12),
  dataset_name      VARCHAR(100) NOT NULL,
  dataset_size      NUMERIC(12) NOT NULL,
  content_checksum  VARCHAR(40) NOT NULL,
  created_time      TIMESTAMP NOT NULL,
  upload_file       VARCHAR(2000),
  parser            VARCHAR(50) NOT NULL,
  category_id       NUMERIC(12),
  content           TEXT,
  prev_dataset_id   NUMERIC(12),
  migration_id      NUMERIC(12)
)
SERVER wdk_userDB
        OPTIONS (schema_name 'userlogins5', table_name 'datasets');
        
--==============================================================================

CREATE FOREIGN TABLE userlogins5.dataset_values (
  dataset_value_id       NUMERIC(12) NOT NULL,
  dataset_id             NUMERIC(12) NOT NULL,
  data1                  VARCHAR(1999) NOT NULL,
  data2                  VARCHAR(1999),
  data3                  VARCHAR(1999),
  data4                  VARCHAR(1999),
  data5                  VARCHAR(1999),
  data6                  VARCHAR(1999),
  data7                  VARCHAR(1999),
  data8                  VARCHAR(1999),
  data9                  VARCHAR(1999),
  data10                 VARCHAR(1999),
  data11                 VARCHAR(1999),
  data12                 VARCHAR(1999),
  data13                 VARCHAR(1999),
  data14                 VARCHAR(1999),
  data15                 VARCHAR(1999),
  data16                 VARCHAR(1999),
  data17                 VARCHAR(1999),
  data18                 VARCHAR(1999),
  data19                 VARCHAR(1999),
  data20                 VARCHAR(1999),
  prev_dataset_value_id  NUMERIC(12),
  migration_id           NUMERIC(12)
)
SERVER wdk_userDB
        OPTIONS (schema_name 'userlogins5', table_name 'dataset_values');
        
--==============================================================================

CREATE FOREIGN TABLE userlogins5.steps (
  step_id          NUMERIC(12) NOT NULL,
  user_id          NUMERIC(12) NOT NULL,
  left_child_id    NUMERIC(12),
  right_child_id   NUMERIC(12),
  create_time      TIMESTAMP NOT NULL,
  last_run_time    TIMESTAMP NOT NULL,
  estimate_size    NUMERIC(12),
  answer_filter    VARCHAR(100),
  custom_name      VARCHAR(4000),
  is_deleted       BOOLEAN,
  is_valid         BOOLEAN,
  collapsed_name   VARCHAR(200),
  is_collapsible   BOOLEAN,
  assigned_weight  NUMERIC(12),
  project_id       VARCHAR(50) NOT NULL,
  project_version  VARCHAR(50) NOT NULL,
  question_name    VARCHAR(200) NOT NULL,
  strategy_id      NUMERIC(12),
  display_params   TEXT,
  result_message   TEXT,
  prev_step_id     NUMERIC(12),
  migration_id     NUMERIC(12),
  display_prefs      TEXT DEFAULT '{}',
  branch_is_expanded BOOLEAN DEFAULT FALSE NOT NULL,
  branch_name        VARCHAR(200)
)
SERVER wdk_userDB
        OPTIONS (schema_name 'userlogins5', table_name 'steps');
        
--==============================================================================

CREATE FOREIGN TABLE userlogins5.strategies (
  strategy_id       NUMERIC(12) NOT NULL,
  user_id           NUMERIC(12) NOT NULL,
  root_step_id      NUMERIC(12) NOT NULL,
  project_id        VARCHAR(50) NOT NULL,
  version           VARCHAR(100),
  is_saved          BOOLEAN NOT NULL,
  create_time       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_view_time    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modify_time  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  description       VARCHAR(4000),
  signature         VARCHAR(40),
  name              VARCHAR(200) NOT NULL,
  saved_name        VARCHAR(200),
  is_deleted        BOOLEAN,
  is_public         BOOLEAN,
  prev_strategy_id  NUMERIC(12),
  migration_id      NUMERIC(12)
)
SERVER wdk_userDB
        OPTIONS (schema_name 'userlogins5', table_name 'strategies');
        
--==============================================================================

CREATE FOREIGN TABLE userlogins5.step_analysis (
  analysis_id          NUMERIC(12) NOT NULL,
  step_id              NUMERIC(12) NOT NULL,
  display_name         VARCHAR(1024),
  user_notes           VARCHAR(4000),
  is_new               BOOLEAN,
  has_params           BOOLEAN,
  invalid_step_reason  VARCHAR(1024),
  context_hash         VARCHAR(96),
  context              TEXT,
  properties           TEXT
)
SERVER wdk_userDB
        OPTIONS (schema_name 'userlogins5', table_name 'step_analysis');

--==============================================================================

CREATE SEQUENCE userlogins5.user_baskets_pkseq INCREMENT BY 10; -- START WITH 100000000;
CREATE SEQUENCE userlogins5.favorites_pkseq INCREMENT BY 10; -- START WITH 100000000;
CREATE SEQUENCE userlogins5.categories_pkseq INCREMENT BY 10; -- START WITH 100000000;
CREATE SEQUENCE userlogins5.datasets_pkseq INCREMENT BY 10; -- START WITH 100000000;
CREATE SEQUENCE userlogins5.dataset_values_pkseq INCREMENT BY 10; -- START WITH 100000000;
CREATE SEQUENCE userlogins5.strategies_pkseq INCREMENT BY 10; -- START WITH 100000000;
CREATE SEQUENCE userlogins5.steps_pkseq INCREMENT BY 10; -- START WITH 100000000;
CREATE SEQUENCE userlogins5.step_analysis_pkseq INCREMENT BY 10; -- START WITH 100000000;

--==============================================================================

DROP SCHEMA IF EXISTS announce CASCADE;
CREATE SCHEMA IF NOT EXISTS announce;

--==============================================================================


CREATE FOREIGN TABLE announce.projects
(
  PROJECT_ID    NUMERIC(3,0) NOT NULL,
  PROJECT_NAME  VARCHAR(150) NOT NULL
)
SERVER wdk_userDB
        OPTIONS (schema_name 'announce', table_name 'projects');
-- existing projects

--INSERT INTO announce.projects(PROJECT_ID, PROJECT_NAME) VALUES(20, 'GRCh37');
--INSERT INTO announce.projects(PROJECT_ID, PROJECT_NAME) VALUES(30, 'GRCh38');

--==============================================================================

CREATE FOREIGN TABLE announce.category
(
  CATEGORY_ID    NUMERIC(3,0) NOT NULL,
  CATEGORY_NAME  VARCHAR(150) NOT NULL
)
SERVER wdk_userDB
        OPTIONS (schema_name 'announce', table_name 'category');
/*
INSERT INTO announce.category(CATEGORY_ID, CATEGORY_NAME) VALUES(10, 'Information');
INSERT INTO announce.category(CATEGORY_ID, CATEGORY_NAME) VALUES(20, 'Degraded');
INSERT INTO announce.category(CATEGORY_ID, CATEGORY_NAME) VALUES(30, 'Down');
INSERT INTO announce.category(CATEGORY_ID, CATEGORY_NAME) VALUES(230, 'Event');*/

--==============================================================================

CREATE FOREIGN TABLE announce.messages
(
  MESSAGE_ID        NUMERIC(10,0) NOT NULL,
  MESSAGE_TEXT      VARCHAR(4000) NOT NULL,
  MESSAGE_CATEGORY  VARCHAR(150) NOT NULL,
  START_DATE        DATE NOT NULL,
  STOP_DATE         DATE NOT NULL,
  ADMIN_COMMENTS    VARCHAR(4000),
  TIME_SUBMITTED    TIMESTAMP NOT NULL
)
SERVER wdk_userDB
        OPTIONS (schema_name 'announce', table_name 'messages');

--==============================================================================

CREATE FOREIGN TABLE announce.message_projects
(
  MESSAGE_ID  NUMERIC(10,0) NOT NULL,
  PROJECT_ID  NUMERIC(3,0) NOT NULL)
  SERVER wdk_userDB
        OPTIONS (schema_name 'announce', table_name 'message_projects');

/*==============================================================================
 * create sequences
 *============================================================================*/

-- note start value may change depending on initial project list: see above
CREATE SEQUENCE announce.projects_id_pkseq INCREMENT BY 10 START WITH 100;

-- note start value may change depending on initial project list; see above
CREATE SEQUENCE announce.category_id_pkseq INCREMENT BY 10 START WITH 40;

CREATE SEQUENCE announce.messages_id_pkseq INCREMENT BY 10 START WITH 10;

