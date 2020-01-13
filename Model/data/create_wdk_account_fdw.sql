/* creates the folllowing foreign schemas associated with the wdk_accountDB foreign server
   useraccound
*/

-- assume postgres_fdw extension already created w/user fdw

/* Create the Foriegn Server and user mappings using the createForeignServerMappings script in GenomicsDBWebsite/Model/bin 
        e.g., to create the foreign server mapping:
        createForeignServerMappings --createServer --serverName wdk_accountDB --serverPort 5437 --serverDB genomicsdb_user_dev --serverHost localhost --commit
        e.g., to create a user mapping based on the creditials in the gus.config file:
              createForeignServerMappings --createUserMapping --serverName wdk_accountDB --commit 
        e.g., to create a non-admin user mapping
              createForeignServerMappings --createUserMapping --serverName wdk_accountDB --user <user> --pwd <pwd> --commit
    The script can also be used to alter the server, when transitioning from dev to standby or to production, e.g.,
              createForeignServerMappings --alterServer --serverName wdk_userDB --serverPort 5432 --serverDB genomicsdB_user_prod --serverHost localhost --commit
*/
        
/* after running this, run grantForeignSchemaUsage to grant usage on the schema to the users w/mappings 
   e.g., grantForeignSchemaUsage --schema useraccounts --user <user> --commit
*/



--==============================================================================

DROP SCHEMA IF EXISTS UserAccounts CASCADE;
CREATE SCHEMA IF NOT EXISTS UserAccounts;

--==============================================================================

CREATE FOREIGN TABLE UserAccounts.Accounts (
        USER_ID NUMERIC NOT NULL,
        EMAIL VARCHAR(255) NOT NULL,
        PASSWD VARCHAR(50) NOT NULL,
        IS_GUEST NUMERIC(1) NOT NULL,
        SIGNATURE VARCHAR(40),
        STABLE_ID VARCHAR(500),
        REGISTER_TIME TIMESTAMP(6),
        LAST_LOGIN TIMESTAMP(6) 
)
SERVER wdk_accountDB
        OPTIONS (schema_name 'useraccounts', table_name 'accounts');

--==============================================================================

CREATE FOREIGN TABLE UserAccounts.Account_Properties (
        USER_ID NUMERIC NOT NULL,
        KEY VARCHAR(12),
        VALUE VARCHAR(4000)
)
SERVER wdk_accountDB
        OPTIONS (schema_name 'useraccounts', table_name 'account_properties');
        
--==============================================================================

CREATE SEQUENCE useraccounts.accounts_pkseq INCREMENT BY 10; -- START WITH 100000000;

CREATE SEQUENCE useraccounts.account_properties_pkseq INCREMENT BY 10; -- START WITH 100000000;

