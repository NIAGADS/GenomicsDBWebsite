-- first execute the following on the original schemas in the userdb
/* 
GRANT USAGE ON SCHEMA Announce TO <user>;
GRANT SELECT ON ALL TABLES IN SCHEMA Announce TO <user>;

*/ 

CREATE EXTENSION postgres_fdw;

-- create database links to user database in app database
-- "<dbuser>", "<dbpassword>", "<port>", and "<dbversion>" must be replaced by the actual values before this is run

DROP SERVER IF EXISTS wdk_userdb CASCADE;
DROP SCHEMA IF EXISTS UserDatastore CASCADE;
DROP SCHEMA IF EXISTS Announce CASCADE;
DROP SCHEMA IF EXISTS UserAccounts CASCADE;


CREATE SERVER wdk_userdb
        FOREIGN DATA WRAPPER postgres_fdw
        OPTIONS (HOST 'localhost', port '5437', dbname 'genomicsdb_user', use_remote_estimate 'True');

GRANT USAGE ON FOREIGN SERVER wdk_userdb TO COMM_WDK_W;

CREATE USER MAPPING FOR <user> -- superuser & genomicsdb
        SERVER wdk_userdb
        OPTIONS (user '<>', password '<>');

--==============================================================================
-- UserDatastore
--==============================================================================

CREATE SCHEMA UserDatastore;
GRANT USAGE ON SCHEMA UserDatastore TO COMM_WDK_W;

IMPORT FOREIGN SCHEMA UserDatastore
    FROM SERVER wdk_userdb INTO UserDatastore;

GRANT INSERT, UPDATE, DELETE, SELECT ON ALL TABLES IN SCHEMA UserDatastore TO COMM_WDK_W;

-- defaults not being set
ALTER FOREIGN TABLE UserDatastore.Strategies ALTER COLUMN create_time SET DEFAULT CURRENT_TIMESTAMP;
ALTER FOREIGN TABLE UserDatastore.Strategies ALTER COLUMN last_view_time SET DEFAULT CURRENT_TIMESTAMP;
ALTER FOREIGN TABLE UserDatastore.Strategies ALTER COLUMN last_modify_time SET DEFAULT CURRENT_TIMESTAMP;

CREATE SEQUENCE UserDatastore.user_baskets_pkseq INCREMENT BY 10; 
CREATE SEQUENCE UserDatastore.favorites_pkseq INCREMENT BY 10; 
CREATE SEQUENCE UserDatastore.categories_pkseq INCREMENT BY 10;
CREATE SEQUENCE UserDatastore.datasets_pkseq INCREMENT BY 10; 
CREATE SEQUENCE UserDatastore.dataset_values_pkseq INCREMENT BY 10;
CREATE SEQUENCE UserDatastore.strategies_pkseq INCREMENT BY 10; 
CREATE SEQUENCE UserDatastore.steps_pkseq INCREMENT BY 10; 
CREATE SEQUENCE UserDatastore.step_analysis_pkseq INCREMENT BY 10;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA UserDatastore TO COMM_WDK_W;

--==============================================================================
-- UserAccounts
--==============================================================================

CREATE SCHEMA UserAccounts;
GRANT USAGE ON SCHEMA UserAccounts TO COMM_WDK_W;

IMPORT FOREIGN SCHEMA UserAccounts
    FROM SERVER wdk_userdb INTO UserAccounts;

GRANT INSERT, UPDATE, DELETE, SELECT ON ALL TABLES IN SCHEMA UserAccounts TO COMM_WDK_W;

CREATE SEQUENCE UserAccounts.Accounts_PKSEQ;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA UserAccounts TO COMM_WDK_W;

--==============================================================================
-- Announce
--==============================================================================

CREATE SCHEMA Announce;
GRANT USAGE ON SCHEMA Announce TO COMM_WDK_W;

IMPORT FOREIGN SCHEMA Announce
    FROM SERVER wdk_userdb INTO Announce;

GRANT INSERT, UPDATE, DELETE, SELECT ON ALL TABLES IN SCHEMA Announce TO COMM_WDK_W;

CREATE SEQUENCE Announce.Accounts_PKSEQ;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA Announce TO COMM_WDK_W;
