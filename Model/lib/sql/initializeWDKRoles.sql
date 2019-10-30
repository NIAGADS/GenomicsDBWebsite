--==============================================================================
-- Basic grants for read and write roles (public cache)
--==============================================================================

GRANT USAGE ON SCHEMA PUBLIC TO COMM_WDK_W;
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA PUBLIC TO COMM_WDK_W;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA PUBLIC TO COMM_WDK_W;


--==============================================================================
-- special permissions for announce schema
--==============================================================================

GRANT USAGE ON SCHEMA Announce TO COMM_WDK_W;
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA Announce TO COMM_WDK_W;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA Announce TO COMM_WDK_W;

--==============================================================================
-- special permissions for userlogins5 schema 
--==============================================================================

GRANT USAGE ON SCHEMA UserLogins5 TO COMM_WDK_W;
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA UserLogins5 TO COMM_WDK_W;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA UserLogins5 TO COMM_WDK_W;

--==============================================================================
-- special permissions for userlogins5 schema
--==============================================================================

GRANT USAGE ON SCHEMA UserAccounts TO comm_wdk_w;
GRANT SELECT, UPDATE, INSERT ON ALL TABLES IN SCHEMA UserAccounts TO comm_wdk_w;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA UserLogins5 TO COMM_WDK_W;

--==============================================================================
-- special permissions for PennTurbo schema (Tuning views)
--==============================================================================

GRANT USAGE ON SCHEMA PennTurbo TO COMM_WDK_W;
GRANT SELECT ON ALL TABLES IN SCHEMA PennTurbo TO COMM_WDK_W;

