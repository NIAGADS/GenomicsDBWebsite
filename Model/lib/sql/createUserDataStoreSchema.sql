/*==============================================================================
 * This SQL script will create the UserDatastore schema and all required tables
 * and sequences needed for a properly functioning WDK.
 *============================================================================*/

DROP SCHEMA IF EXISTS UserDatastore CASCADE;
CREATE SCHEMA IF NOT EXISTS UserDatastore;
GRANT USAGE ON SCHEMA UserDatastore TO COMM_WDK_W;

/*==============================================================================
 * create tables
 *============================================================================*/

CREATE TABLE UserDatastore.config
(
  config_name   CHARACTER VARYING(100) NOT NULL,
  config_value  CHARACTER VARYING(255),
  migration_id  NUMERIC(12),
  CONSTRAINT "config_pk" PRIMARY KEY (config_name)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON UserDatastore.config TO COMM_WDK_W;

-- special metadata insert to declare WDK schema version
INSERT INTO UserDatastore.config(config_name, config_value) VALUES('wdk.user.schema.version', '5');

--==============================================================================

CREATE TABLE UserDatastore.users
(
  user_id       NUMERIC(12) NOT NULL,
  is_guest      BOOLEAN NOT NULL,
  first_access  TIMESTAMP,
  CONSTRAINT "users_pk" PRIMARY KEY (user_id)
);

CREATE INDEX users_idx01 ON UserDatastore.users (is_guest);

GRANT SELECT, INSERT, UPDATE, DELETE ON UserDatastore.users TO COMM_WDK_W;

--==============================================================================

CREATE TABLE UserDatastore.user_roles
(
  user_id       NUMERIC(12) NOT NULL,
  user_role     CHARACTER VARYING(50) NOT NULL,
  migration_id  NUMERIC(12),
  CONSTRAINT "user_roles_pk" PRIMARY KEY (user_id, user_role),
  CONSTRAINT "user_roles_fk01" FOREIGN KEY (user_id)
      REFERENCES UserDatastore.users (user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON UserDatastore.user_roles TO COMM_WDK_W;

--==============================================================================

CREATE TABLE UserDatastore.preferences
(
  user_id           NUMERIC(12) NOT NULL,
  project_id        CHARACTER VARYING(50) NOT NULL,
  preference_name   CHARACTER VARYING(200) NOT NULL,
  preference_value  CHARACTER VARYING(4000),
  migration_id      NUMERIC(12),
  CONSTRAINT "preferences_pk" PRIMARY KEY (user_id, project_id, preference_name),
  CONSTRAINT "preferences_fk01" FOREIGN KEY (user_id)
      REFERENCES UserDatastore.users (user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON UserDatastore.preferences TO COMM_WDK_W;

--==============================================================================

CREATE TABLE UserDatastore.user_baskets (
  basket_id       NUMERIC(12) NOT NULL,
  user_id         NUMERIC(12) NOT NULL,
  basket_name     CHARACTER VARYING(100),
  project_id      CHARACTER VARYING(50) NOT NULL,
  record_class    CHARACTER VARYING(100) NOT NULL,
  is_default      BOOLEAN,
  category_id     NUMERIC(12),
  pk_column_1     CHARACTER VARYING(1999) NOT NULL,
  pk_column_2     CHARACTER VARYING(1999),
  pk_column_3     CHARACTER VARYING(1999),
  prev_basket_id  NUMERIC(12),
  migration_id    NUMERIC(12),
  CONSTRAINT "user_baskets_pk" PRIMARY KEY (basket_id),
  CONSTRAINT "user_baskets_uq01" UNIQUE (user_id, project_id, record_class, pk_column_1, pk_column_2, pk_column_3),
  CONSTRAINT "user_baskets_fk01" FOREIGN KEY (user_id)
      REFERENCES UserDatastore.users (user_id)
);

CREATE INDEX user_baskets_idx01 ON UserDatastore.user_baskets (project_id, record_class);

GRANT SELECT, INSERT, UPDATE, DELETE ON UserDatastore.user_baskets TO COMM_WDK_W;

--==============================================================================

CREATE TABLE UserDatastore.favorites (
  favorite_id       NUMERIC(12) NOT NULL,
  user_id           NUMERIC(12) NOT NULL,
  project_id        CHARACTER VARYING(50) NOT NULL,
  record_class      CHARACTER VARYING(100) NOT NULL,
  pk_column_1       CHARACTER VARYING(1999) NOT NULL,
  pk_column_2       CHARACTER VARYING(1999),
  pk_column_3       CHARACTER VARYING(1999),
  record_note       CHARACTER VARYING(200),
  record_group      CHARACTER VARYING(50),
  prev_favorite_id  NUMERIC(12),
  migration_id      NUMERIC(12),
  is_deleted        BOOLEAN,
  CONSTRAINT "favorites_pk" PRIMARY KEY (favorite_id),
  CONSTRAINT "favorites_uq01" UNIQUE (user_id, project_id, record_class, pk_column_1, pk_column_2, pk_column_3),
  CONSTRAINT "favorites_fk01" FOREIGN KEY (user_id)
      REFERENCES UserDatastore.users (user_id)
);

CREATE INDEX favorites_idx01 ON UserDatastore.favorites (record_class, project_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON UserDatastore.favorites TO COMM_WDK_W;

--==============================================================================

CREATE TABLE UserDatastore.categories (
  category_id       NUMERIC(12) NOT NULL,
  user_id           NUMERIC(12) NOT NULL,
  parent_id         NUMERIC(12),
  category_type     CHARACTER VARYING(50) NOT NULL,
  category_name     CHARACTER VARYING(100) NOT NULL,
  description       CHARACTER VARYING(200),
  prev_category_id  NUMERIC(12),
  migration_id      NUMERIC(12),
  CONSTRAINT "categories_pk" PRIMARY KEY (category_id),
  CONSTRAINT "categories_uq01" UNIQUE (user_id, category_type, parent_id, category_name),
  CONSTRAINT "categories_fk01" FOREIGN KEY (user_id)
      REFERENCES UserDatastore.users (user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON UserDatastore.categories TO COMM_WDK_W;

--==============================================================================

CREATE TABLE UserDatastore.datasets (
  dataset_id        NUMERIC(12) NOT NULL,
  user_id           NUMERIC(12),
  dataset_name      CHARACTER VARYING(100) NOT NULL,
  dataset_size      NUMERIC(12) NOT NULL,
  content_checksum  CHARACTER VARYING(40) NOT NULL,
  created_time      TIMESTAMP NOT NULL,
  upload_file       CHARACTER VARYING(2000),
  parser            CHARACTER VARYING(50) NOT NULL,
  category_id       NUMERIC(12),
  content           TEXT,
  prev_dataset_id   NUMERIC(12),
  migration_id      NUMERIC(12),
  CONSTRAINT "datasets_pk" PRIMARY KEY (dataset_id),
  CONSTRAINT "datasets_fk01" FOREIGN KEY (user_id)
      REFERENCES UserDatastore.users (user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON UserDatastore.datasets TO COMM_WDK_W;

--==============================================================================

CREATE TABLE UserDatastore.dataset_values (
  dataset_value_id       NUMERIC(12) NOT NULL,
  dataset_id             NUMERIC(12) NOT NULL,
  data1                  CHARACTER VARYING(1999) NOT NULL,
  data2                  CHARACTER VARYING(1999),
  data3                  CHARACTER VARYING(1999),
  data4                  CHARACTER VARYING(1999),
  data5                  CHARACTER VARYING(1999),
  data6                  CHARACTER VARYING(1999),
  data7                  CHARACTER VARYING(1999),
  data8                  CHARACTER VARYING(1999),
  data9                  CHARACTER VARYING(1999),
  data10                 CHARACTER VARYING(1999),
  data11                 CHARACTER VARYING(1999),
  data12                 CHARACTER VARYING(1999),
  data13                 CHARACTER VARYING(1999),
  data14                 CHARACTER VARYING(1999),
  data15                 CHARACTER VARYING(1999),
  data16                 CHARACTER VARYING(1999),
  data17                 CHARACTER VARYING(1999),
  data18                 CHARACTER VARYING(1999),
  data19                 CHARACTER VARYING(1999),
  data20                 CHARACTER VARYING(1999),
  prev_dataset_value_id  NUMERIC(12),
  migration_id           NUMERIC(12),
  CONSTRAINT "dataset_values_pk" PRIMARY KEY (dataset_value_id),
  CONSTRAINT "dataset_values_fk01" FOREIGN KEY (dataset_id)
      REFERENCES UserDatastore.datasets (dataset_id)
);

CREATE INDEX dataset_values_idx01 ON UserDatastore.dataset_values (dataset_id, data1);

GRANT SELECT, INSERT, UPDATE, DELETE ON UserDatastore.dataset_values TO COMM_WDK_W;

--==============================================================================

CREATE TABLE UserDatastore.steps (
  step_id            NUMERIC(12) NOT NULL,
  user_id            NUMERIC(12) NOT NULL,
  left_child_id      NUMERIC(12),
  right_child_id     NUMERIC(12),
  create_time        TIMESTAMP NOT NULL,
  last_run_time      TIMESTAMP NOT NULL,
  estimate_size      NUMERIC(12),
  answer_filter      CHARACTER VARYING(100),
  custom_name        CHARACTER VARYING(4000),
  is_deleted         BOOLEAN,
  is_valid           BOOLEAN,
  collapsed_name     CHARACTER VARYING(200),
  is_collapsible     BOOLEAN,
  assigned_weight    NUMERIC(12),
  project_id         CHARACTER VARYING(50) NOT NULL,
  project_version    CHARACTER VARYING(50) NOT NULL,
  question_name      CHARACTER VARYING(200) NOT NULL,
  strategy_id        NUMERIC(12),
  display_params     TEXT,
  result_message     TEXT,
  prev_step_id       NUMERIC(12),
  migration_id       NUMERIC(12),
  display_prefs      TEXT DEFAULT '{}',
  branch_is_expanded BOOLEAN DEFAULT FALSE NOT NULL,
  branch_name        CHARACTER VARYING(200),
  CONSTRAINT "steps_pk" PRIMARY KEY (step_id),
  CONSTRAINT "steps_fk01" FOREIGN KEY (user_id)
      REFERENCES UserDatastore.users (user_id)
);

CREATE INDEX steps_idx01 ON UserDatastore.steps (left_child_id, right_child_id, user_id);
CREATE INDEX steps_idx02 ON UserDatastore.steps (project_id, question_name, user_id);
CREATE INDEX steps_idx03 ON UserDatastore.steps (is_deleted, user_id, project_id);
CREATE INDEX steps_idx04 ON UserDatastore.steps (is_valid, project_id, user_id);
CREATE INDEX steps_idx05 ON UserDatastore.steps (last_run_time, user_id, project_id);
CREATE INDEX steps_idx06 ON UserDatastore.steps (strategy_id, user_id, project_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON UserDatastore.steps TO COMM_WDK_W;

--==============================================================================

CREATE TABLE UserDatastore.strategies (
  strategy_id       NUMERIC(12) NOT NULL,
  user_id           NUMERIC(12) NOT NULL,
  root_step_id      NUMERIC(12) NOT NULL,
  project_id        CHARACTER VARYING(50) NOT NULL,
  version           CHARACTER VARYING(100),
  is_saved          BOOLEAN NOT NULL,
  create_time       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_view_time    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_modify_time  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  description       CHARACTER VARYING(4000),
  signature         CHARACTER VARYING(40),
  name              CHARACTER VARYING(200) NOT NULL,
  saved_name        CHARACTER VARYING(200),
  is_deleted        BOOLEAN,
  is_public         BOOLEAN,
  prev_strategy_id  NUMERIC(12),
  migration_id      NUMERIC(12),
  CONSTRAINT "strategies_pk" PRIMARY KEY (strategy_id),
  CONSTRAINT "strategies_fk01" FOREIGN KEY (root_step_id)
      REFERENCES UserDatastore.steps (step_id),
  CONSTRAINT "strategies_fk02" FOREIGN KEY (user_id)
      REFERENCES UserDatastore.users (user_id)
);

CREATE INDEX strategies_idx01 ON UserDatastore.strategies (signature, project_id);
CREATE INDEX strategies_idx02 ON UserDatastore.strategies (user_id, project_id, is_deleted, is_saved);
CREATE INDEX strategies_idx03 ON UserDatastore.strategies (root_step_id, project_id, user_id, is_saved, is_deleted);
CREATE INDEX strategies_idx04 ON UserDatastore.strategies (is_deleted, is_saved, name, project_id, user_id);
CREATE INDEX strategies_idx05 ON UserDatastore.strategies (project_id, is_public, is_saved, is_deleted);

GRANT SELECT, INSERT, UPDATE, DELETE ON UserDatastore.strategies TO COMM_WDK_W;

--==============================================================================

CREATE TABLE UserDatastore.step_analysis (
  analysis_id          NUMERIC(12) NOT NULL,
  step_id              NUMERIC(12) NOT NULL,
  display_name         CHARACTER VARYING(1024),
  user_notes           CHARACTER VARYING(4000),
  is_new               INTEGER,
  has_params           BOOLEAN,
  invalid_step_reason  CHARACTER VARYING(1024),
  context_hash         CHARACTER VARYING(96),
  context              TEXT,
  properties           TEXT,
  CONSTRAINT "step_analysis_pk" PRIMARY KEY (analysis_id),
  CONSTRAINT "step_analysis_fk01" FOREIGN KEY (step_id)
      REFERENCES UserDatastore.steps (step_id)
);

CREATE INDEX step_analysis_idx01 ON UserDatastore.step_analysis (step_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON UserDatastore.step_analysis TO COMM_WDK_W;

--==============================================================================
-- create sequences -- not necessary if using foreign data wrappers
-- as sequences will never be used; foreign schema will require local versions
--==============================================================================

CREATE SEQUENCE UserDatastore.user_baskets_pkseq INCREMENT BY 10; -- START WITH 100000000;

CREATE SEQUENCE UserDatastore.favorites_pkseq INCREMENT BY 10; -- START WITH 100000000;

CREATE SEQUENCE UserDatastore.categories_pkseq INCREMENT BY 10; -- START WITH 100000000;

CREATE SEQUENCE UserDatastore.datasets_pkseq INCREMENT BY 10; -- START WITH 100000000;

CREATE SEQUENCE UserDatastore.dataset_values_pkseq INCREMENT BY 10; -- START WITH 100000000;

CREATE SEQUENCE UserDatastore.strategies_pkseq INCREMENT BY 10; -- START WITH 100000000;

CREATE SEQUENCE UserDatastore.steps_pkseq INCREMENT BY 10; -- START WITH 100000000;

CREATE SEQUENCE UserDatastore.step_analysis_pkseq INCREMENT BY 10; -- START WITH 100000000;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA UserDatastore TO COMM_WDK_W;
