/**
 * Created by pzheng on 14/02/2017.
 */
module.exports = {
  upSQLs: [
    " execute block \
      as \
      begin \
        execute statement 'CREATE GENERATOR GEN_USERS_ID;'; \
        execute statement ' CREATE TABLE USERS ' || \
          ' ( ' || \
          '  ID Integer NOT NULL, ' || \
          '  FIRSTNAME Varchar(64), ' || \
          '  LASTNAME Varchar(64), ' || \
          '  EMAIL Varchar(128), ' || \
          '  USERNAME Varchar(32) NOT NULL, ' || \
          '  USERPASS Varchar(128) NOT NULL, ' || \
          '  ROLEGROUP Smallint, ' || \
          '  PROVIDER Varchar(128), ' || \
          '  SALT Varchar(64), ' || \
          '  CREATED Date, ' || \
          '  RESETPASSWORDTOKEN Varchar(128), ' || \
          '  RESETPASSWORDEXPIRES Integer, ' || \
          '  CONSTRAINT PK_USERS_1 PRIMARY KEY (ID), ' || \
          '  CONSTRAINT UNQ_USERS_1 UNIQUE (USERNAME) ' || \
          ' ); ' ; \
        execute statement ' GRANT ALL ON USERS TO AIMHD; '; \
        execute statement ' GRANT DELETE, INSERT, REFERENCES, SELECT, UPDATE ' || \
          ' ON USERS TO AIMDBA WITH GRANT OPTION; '; \
        execute statement ' CREATE TRIGGER TRG_USERS_BI FOR USERS ACTIVE ' || \
          ' BEFORE INSERT POSITION 0 AS ' || \
          ' BEGIN ' || \
          '     if( new.ID is null ) then ' || \
          '     begin ' || \
          '         new.ID = GEN_ID(GEN_USERS_ID, 1); ' || \
          '     end ' || \
          ' END '; \
      end \
    "
  ],
  downSQLs: [
    " \
      EXECUTE BLOCK \
      as \
      begin \
        IF (EXISTS( select 1 from RDB$TRIGGERS \
        where RDB$TRIGGER_NAME = 'TRG_USERS_BI' )) then \
        begin \
          execute statement 'DROP TRIGGER TRG_USERS_BI;'; \
        end \
        IF (EXISTS( SELECT 1 \
          FROM RDB$RELATIONS \
          where RDB$RELATION_NAME = 'USERS' )) THEN \
        begin \
          execute statement 'DROP TABLE USERS;'; \
        end \
        if (EXISTS( SELECT 1 from RDB$GENERATORS where RDB$GENERATOR_NAME = 'GEN_USERS_ID')) then \
        begin \
          execute statement 'DROP GENERATOR GEN_USERS_ID;'; \
        end \
      END \
    "
  ],
  resetSQLs: [" \
    EXECUTE BLOCK \
    as \
    begin \
      IF (EXISTS( SELECT 1 \
        FROM RDB$RELATIONS \
      where RDB$RELATION_NAME = 'USERS' )) THEN \
      begin \
        execute statement 'delete from USERS;'; \
      end \
      if (EXISTS( SELECT 1 from RDB$GENERATORS where RDB$GENERATOR_NAME = 'GEN_USERS_ID')) then \
      begin \
        execute statement 'SET GENERATOR GEN_USERS_ID TO 0;'; \
      end \
    END \
  "
  ],
  buildAll: function() { return this.downSQLs.concat(this.upSQLs); }
}
