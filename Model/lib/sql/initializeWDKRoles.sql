--==============================================================================
-- Basic grants for read and write roles (public cache)
--==============================================================================

GRANT USAGE ON SCHEMA PUBLIC TO COMM_WDK_W;
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA PUBLIC TO COMM_WDK_W;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA PUBLIC TO COMM_WDK_W;


/* run the following in genomicsdb after FDW is created and in genomicsdb_user before *//
--==============================================================================
-- special permissions for Announce schema
--==============================================================================

GRANT USAGE ON SCHEMA Announce TO COMM_WDK_W;
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA Announce TO COMM_WDK_W;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA Announce TO COMM_WDK_W;

--==============================================================================
-- special permissions for UserDataStore schema 
--==============================================================================

GRANT USAGE ON SCHEMA UserDataStore TO COMM_WDK_W;
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA UserDataStore TO COMM_WDK_W;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA UserDataStore TO COMM_WDK_W;

--==============================================================================
-- special permissions for UserAccounts schema
--==============================================================================

GRANT USAGE ON SCHEMA UserAccounts TO comm_wdk_w;
GRANT SELECT, UPDATE, INSERT ON ALL TABLES IN SCHEMA UserAccounts TO comm_wdk_w;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA UserAccounts TO COMM_WDK_W;

--==============================================================================
-- special permissions for NIAGADS schema
--==============================================================================

GRANT USAGE ON SCHEMA NIAGADS TO COMM_WDK_W;
GRANT SELECT ON ALL TABLES IN SCHEMA NIAGADS TO COMM_WDK_W;
