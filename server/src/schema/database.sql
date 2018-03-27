CREATE GENERATOR GEN_USERS_ID;

CREATE TABLE USERS
(
  ID Integer NOT NULL,
  FIRSTNAME Varchar(64),
  LASTNAME Varchar(64),
  EMAIL Varchar(128),
  USERNAME Varchar(32) NOT NULL,
  USERPASS Varchar(128) NOT NULL,
  ROLEGROUP Smallint,
  PROVIDER Varchar(128),
  SALT Varchar(64),
  CREATED Date,
  RESETPASSWORDTOKEN Varchar(128),
  RESETPASSWORDEXPIRES Integer,
  CONSTRAINT PK_USERS_1 PRIMARY KEY (ID),
  CONSTRAINT UNQ_USERS_1 UNIQUE (USERNAME)
);

SET TERM ^ ;
CREATE TRIGGER TRG_USERS_BI FOR USERS ACTIVE
BEFORE INSERT POSITION 0
AS  BEGIN
  if( new.ID is null ) then
  begin
    new.ID = GEN_ID(GEN_USERS_ID, 1);
  end
END^
SET TERM ; ^

ALTER TABLE CLIENTS ADD
Implementation_fee Decimal(12,2);

ALTER TABLE CLIENTS ADD
REVIEWDATE Date;

ALTER TABLE ADDRESS ADD
NUMBER_OF_BEDS Integer;

ALTER TABLE ADDRESS ADD
NUMBER_OF_ILUS Integer;

ALTER TABLE ADDRESS ADD
NUMBER_OF_CCARES Integer;

ALTER TABLE MESSAGES ADD
REMINDDATE Date;

ALTER TABLE MESSAGES ADD
viewed smallint;

SET TERM ^ ;
CREATE PROCEDURE SPW_CLIENTS
RETURNS (
    CLIENT_ID Integer,
    NAME Varchar(256),
    CONTRACT_EXPIRES Date,
    CURRENT_VERSION Varchar(48),
    CURRENT_SOFTWARE_ID Integer,
    LOCATIONS Integer,
    STATUS Smallint,
    UPRDESC Varchar(256),
    PREPAIDMINUTES Integer,
    LAST_ALLOCATION_ROLLOVER Date,
    IMPLEMENTATION_FEE Decimal(12,2),
    REVIEWDATE Date,
    REMINDDATE Date,
    REMINDER_MESSAGE Varchar(1024),
    VIEWED Smallint,
    EMAIL Varchar(256) )
AS
BEGIN
    FOR SELECT  c.CLIENT_ID,
            c.NAME,
            c.CONTRACT_EXPIRES,
            c.STATUS,
            UPPER(c.NAME) UPRDESC,
            c.PREPAIDMINUTES,
            c.ROLLOVER_STAMP,
            c.IMPLEMENTATION_FEE,
            c.REVIEWDATE
    from clients c
    --where exists (select d.ID from SFTWR_LCNS_DETS d join CLIENTMODULES e on d.CLIENT_MODULE_ID = e.ID join CLIENTS f on e.CIDREF = f.CLIENT_ID and f.CLIENT_ID = c.CLIENT_ID)
    ORDER by c.name
    INTO :CLIENT_ID, :NAME, :CONTRACT_EXPIRES, :STATUS, :UPRDESC, :PREPAIDMINUTES, :last_allocation_rollover, :IMPLEMENTATION_FEE, :REVIEWDATE
    do
    BEGIN
        SELECT COUNT(*) FROM ADDRESS WHERE ADDRESS.CIDREF = :CLIENT_ID and ADDRESS.TYPEREF = 'L'  INTO :LOCATIONS;
        SELECT J.DESCRIPTION, K.ID
        FROM (SELECT MAX(FROMDATE) LATEST_DATE
                FROM CLIENTVERSION
               WHERE CIDREF = :CLIENT_ID) TMP,
             CLIENTVERSION T join AIMVERSIONS J on T.VERSIONREF = J.VER
                            join TL_SOFTWARE K on J.TL_SOFTWARE_ID = K.ID
        WHERE T.CIDREF = :CLIENT_ID AND T.FROMDATE = TMP.LATEST_DATE
        INTO :CURRENT_VERSION, :CURRENT_SOFTWARE_ID;

        select first(1) t.REMINDDATE, t.MESSAGEDATA, t.VIEWED
        from MESSAGES t
        where t.CIDREF = :CLIENT_ID
        order by t.REMINDDATE desc
        into :REMINDDATE, :REMINDER_MESSAGE, :VIEWED;

        select first(1) t.EMAIL
        from WEBDETAILS t
        where t.CIDREF=:CLIENT_ID
        into :EMAIL;

        SUSPEND;
    END
END^
SET TERM ; ^

UPDATE RDB$PROCEDURES set
  RDB$DESCRIPTION = 'show clients with softare licences and locations'
  where RDB$PROCEDURE_NAME = 'SPW_CLIENTS';

SET TERM ^ ;
CREATE PROCEDURE SPW_ADDCLIENT (
    NAME Varchar(256),
    EXPIRYDATE Date,
    PREPAIDMINUTES Integer,
    LAST_ROLLOVER Date,
    EMAIL Varchar(256),
    INIT_FEE Decimal(12,2),
    REVIEWDATE Date,
    VIEWED Smallint,
    REMINDER_MESSAGE Varchar(1024),
    REMINDDATE Date,
    STATUS Smallint )
RETURNS (
    CLIENT_ID Integer )
AS
DECLARE VARIABLE MESSAGE_ID integer;
DECLARE VARIABLE WEB_ID integer;
BEGIN
    CLIENT_ID = GEN_ID(CLIENT_ID_GEN, 1);
    INSERT INTO CLIENTS (CLIENT_ID, NAME, STATUS, CONTRACT_EXPIRES, PREPAIDMINUTES, ROLLOVER_STAMP, IMPLEMENTATION_FEE, REVIEWDATE)
    values(:CLIENT_ID, :NAME, :STATUS, :EXPIRYDATE, :PREPAIDMINUTES, :LAST_ROLLOVER, :INIT_FEE, :REVIEWDATE);

    MESSAGE_ID = GEN_ID(GEN_MESSAGES_ID, 1);
    INSERT INTO MESSAGES (ID, CIDREF, MESSAGEDATA, REMINDDATE, VIEWED)
    VALUES (:MESSAGE_ID, :CLIENT_ID, :REMINDER_MESSAGE, :REMINDDATE, :VIEWED);

    WEB_ID = GEN_ID(GEN_WEBDETAILS_ID, 1);
    INSERT INTO WEBDETAILS (CIDREF, USERNAME, PASS, EMAIL, STARTDATE, ID)
     VALUES (:CLIENT_ID, '', '', :EMAIL, current_date, :WEB_ID);

    suspend;
END^
SET TERM ; ^

SET TERM ^ ;
CREATE PROCEDURE SPW_UPDATECLIENT (
    CLIENT_ID Integer,
    NAME Varchar(256),
    EXPIRYDATE Date,
    PREPAIDMINUTES Integer,
    LAST_ROLLOVER Date,
    EMAIL Varchar(256),
    INIT_FEE Decimal(12,2),
    REVIEWDATE Date,
    VIEWED Smallint,
    REMINDER_MESSAGE Varchar(1024),
    REMINDDATE Date,
    STATUS Smallint )
RETURNS(
    ID integer
)
AS
BEGIN
    ID = :CLIENT_ID;
    BEGIN
        update CLIENTS t
        set t.NAME = coalesce(:NAME, t.NAME),
            t.STATUS = coalesce(:STATUS, t.STATUS),
            t.CONTRACT_EXPIRES = coalesce(:EXPIRYDATE, t.CONTRACT_EXPIRES),
            t.PREPAIDMINUTES = coalesce(:PREPAIDMINUTES, t.PREPAIDMINUTES),
            t.ROLLOVER_STAMP = coalesce(:LAST_ROLLOVER, t.ROLLOVER_STAMP),
            t.IMPLEMENTATION_FEE = coalesce(:INIT_FEE, t.IMPLEMENTATION_FEE),
            t.REVIEWDATE = coalesce(:REVIEWDATE, t.REVIEWDATE)
        where t.CLIENT_ID = :CLIENT_ID;

        update MESSAGES t
        set t.MESSAGEDATA = coalesce(:REMINDER_MESSAGE, t.MESSAGEDATA),
            t.VIEWED = coalesce(:VIEWED, t.VIEWED),
            t.REMINDDATE = coalesce(:REMINDDATE, t.REMINDDATE)
        where t.CIDREF = :CLIENT_ID
            and t.REMINDDATE = :REMINDDATE;

        update WEBDETAILS t
        set t.EMAIL = coalesce(:EMAIL, t.EMAIL)
        where t.CIDREF = :CLIENT_ID;
        suspend;
    END
    When any do
    begin
        ID = 0;
        suspend;
        exception;
    end
END^
SET TERM ; ^

INSERT INTO ADDRESSTYPE(ADDTYPE, ID, DESCRIPTION) VALUES ('I', '3', 'ILU');
INSERT INTO ADDRESSTYPE(ADDTYPE, ID, DESCRIPTION) VALUES ('C', '4', 'COMMUNITY CARE');
INSERT INTO ADDRESSTYPE(ADDTYPE, ID, DESCRIPTION) VALUES ('O', '5', 'OTHER');

ALTER TABLE ADDRESS ADD NUMBER_OF_UNITS Integer;


CREATE VIEW VW_ADDRESSES (ADDRESS_ID, TITLE, CIDREF, TYPEREF, ADDRESSTYPE, TYPE_INST, ADDRESS1, ADDRESS2, STARTDATE, NOTES, SUBURB, STATE, POSTCODE, NUMBER_OF_UNITS)
AS
SELECT adr.ADDRESS_ID, adr.TITLE, adr.CIDREF, adr.TYPEREF, adrt.DESCRIPTION,  adr.TYPE_INST, adr.ADDRESS1, adr.ADDRESS2, adr.STARTDATE, adr.NOTES,  adr.SUBURB, adr.STATE, adr.POSTCODE, adr.NUMBER_OF_UNITS
FROM ADDRESS adr LEFT join ADDRESSTYPE adrt on adrt.ADDTYPE = adr.TYPEREF;


SET TERM ^ ;
CREATE PROCEDURE SPW_ADDCLIENTADDRESS (
    CID Integer,
    TITLE Varchar(256),
    TYPEREF Varchar(1),
    ADDR1 Varchar(64),
    ADDR2 Varchar(64),
    PCSTATE Varchar(48),
    PCSUB Varchar(48),
    PCCD Varchar(10),
    NOTE Varchar(1024),
    NUMBER_OF_UNITS Integer )
RETURNS (
    ADDRESS_ID Integer,
    ADDRESSTYPE Varchar(48) )
AS
BEGIN
  ADDRESS_ID = GEN_ID(ADDRESS_ID_GEN, 1);
  ADDRESSTYPE = '';
  select t.DESCRIPTION from ADDRESSTYPE t
  where t.ADDTYPE = :TYPEREF
  into :ADDRESSTYPE;

  INSERT INTO ADDRESS (ADDRESS_ID, TITLE,CIDREF, TYPEREF, PCREF, ADDRESS1, ADDRESS2, SUBURB, STATE, POSTCODE, STARTDATE, NOTES, NUMBER_OF_UNITS)
  VALUES ( :ADDRESS_ID,
            :TITLE,
           :CID,
           :TYPEREF,
           (SELECT PCID FROM PCODEMAPS WHERE STATE = :PCSTATE AND SUBURB = :PCSUB AND POSTCODE = :PCCD),
           :ADDR1,
           :ADDR2,
           :PCSUB,
           :PCSTATE,
           :PCCD,
           CURRENT_DATE,
           :NOTE,
           :NUMBER_OF_UNITS
        );
  suspend;
END^
SET TERM ; ^

SET TERM ^ ;
CREATE PROCEDURE SPW_UPDATECLIENTADDRESS (
    AID Integer,
    NAME Varchar(256),
    CID Integer,
    TYPEREF Varchar(1),
    ADDR1 Varchar(64),
    ADDR2 Varchar(64),
    PCSTATE Varchar(48),
    PCSUB Varchar(48),
    PCCD Varchar(10),
    NOTE Varchar(1024),
    NUMBER_OF_UNITS Integer )
RETURNS (
    ADDRESS_ID Integer,
    ADDRESSTYPE Varchar(48) )
AS
BEGIN
    ADDRESS_ID = :AID;
    select t.DESCRIPTION from ADDRESSTYPE t where t.ADDTYPE = :TYPEREF into :ADDRESSTYPE;
    BEGIN
      UPDATE ADDRESS t SET TITLE = :NAME, CIDREF = :CID, TYPEREF = :TYPEREF,
            PCREF = (SELECT PCID FROM PCODEMAPS WHERE STATE = :PCSTATE AND SUBURB = :PCSUB AND POSTCODE = :PCCD),
            ADDRESS1 =:ADDR1, ADDRESS2 = :ADDR2, STATE = :PCSTATE, SUBURB = :PCSUB, POSTCODE = :PCCD,
            STARTDATE = CURRENT_DATE, NOTES = :NOTE,
            NUMBER_OF_UNITS = :NUMBER_OF_UNITS
      WHERE ADDRESS_ID =:AID;
      suspend;
    END
    When any do
    begin
        ADDRESS_ID = 0;
        ADDRESSTYPE = '';
        suspend;
        exception;
    end
END^
SET TERM ; ^

SET TERM ^ ;
CREATE PROCEDURE SPW_ADDCLIENTCONTACT (
    CID Integer,
    PCONTACT Integer,
    SALTTN Varchar(15),
    GNAME Varchar(64),
    SNAME Varchar(64),
    JDESC Varchar(64),
    PHONE Varchar(13),
    FAX Varchar(13),
    MOB Varchar(13),
    EMAIL Varchar(256),
    NOTE Varchar(1024)
 )
RETURNS (
    CONTACT_ID Integer,
    IDENTITY varchar(130)
    )
AS
BEGIN
    begin
        INSERT INTO CONTACTS(
            CONTACT_ID, CIDREF,  GIVENNAME, SURNAME, SALUTATION,
            JOBDESCRIPTION, PHONE, FAX,
            MOBILE, EMAIL, NOTES,PRIMARYCONTACT )
        VALUES( GEN_ID(CONTACT_ID_GEN, 1), :CID, :GNAME, :SNAME, :SALTTN, :JDESC, :PHONE, :FAX, :MOB, :EMAIL, :NOTE, :PCONTACT );
        CONTACT_ID = GEN_ID(CONTACT_ID_GEN, 0);
        IDENTITY = coalesce(:GNAME, '') || ' ' || coalesce(:SNAME, '');
        suspend;
    end
    WHEN ANY DO
    begin
        CONTACT_ID = 0;
        suspend;
        exception;
    end
END^
SET TERM ; ^


CREATE VIEW VW_CONTACTS (CONTACT_ID, CID, PRIMARYCONTACT, SALUTATION, GIVENNAME, SURNAME, PHONE, EMAIL, FAX, JOBDESCRIPTION, NOTES, MOBILE, IDENTITY)
AS
/* write select statement here */
SELECT CNCT.CONTACT_ID,
CNCT.CIDREF,
COALESCE(CNCT.PRIMARYCONTACT,0),
CNCT.SALUTATION,
CNCT.GIVENNAME,
CNCT.SURNAME,
CNCT.PHONE,
CNCT.EMAIL,
CNCT.FAX,
CNCT.JOBDESCRIPTION,
CNCT.NOTES,
CNCT.MOBILE,
TRIM(COALESCE(GIVENNAME,' ') || ' ' || COALESCE(SURNAME,' ')) IDENTITY

FROM CONTACTS CNCT;

SET TERM ^ ;
CREATE PROCEDURE SPW_UPDATECLIENTCONTACT (
    ID Integer,
    PRIMARYCONTACT integer,
    SALUTATION varchar(15),
    GIVENNAME Varchar(64),
    SURNAME Varchar(64),
    JOBDESCRIPTION Varchar(64),
    PHONE Varchar(13),
    FAX Varchar(13),
    MOBILE Varchar(13),
    EMAIL Varchar(256),
    NOTES Varchar(1024) )
RETURNS (
    CONTACT_ID Integer,
    IDENTITY Varchar(130) )
AS
BEGIN
    CONTACT_ID = :ID;
    IDENTITY = TRIM(COALESCE(:GIVENNAME,' ') || ' ' || COALESCE(:SURNAME,' '));
    BEGIN
      UPDATE CONTACTS t
        SET t.PRIMARYCONTACT = :PRIMARYCONTACT,
                            t.SALUTATION = :SALUTATION,
                            t.GIVENNAME = :GIVENNAME,
                            t.SURNAME = :SURNAME,
                            t.JOBDESCRIPTION = :JOBDESCRIPTION,
                            t.PHONE = :PHONE,
                            t.FAX = :FAX,
                            t.MOBILE = :MOBILE,
                            t.EMAIL = :EMAIL,
                            t.NOTES = :NOTES
      WHERE t.CONTACT_ID = :ID;
      suspend;
    END
    When any do
    begin
        CONTACT_ID = 0;
        IDENTITY = '';
        suspend;
        exception;
    end
END^
SET TERM ; ^

SET TERM ^ ;
CREATE PROCEDURE SPW_DELETECONTACT (
    ID Integer )
AS
BEGIN
    delete from CONTACTS t
    where t.CONTACT_ID = :ID;
END^
SET TERM ; ^

CREATE VIEW VW_CLIENTMODULES (ID, CIDREF, MID, MDESC)
AS
SELECT cm.ID, cm.CIDREF, am.MODULE, am.DESCRIPTION

FROM CLIENTMODULES cm left JOIN AIMMODULES am
on cm.MODULEREF = am.MODULE;

CREATE VIEW VW_AIMMODULES (MODULE, CODE, DESCRIPTION, AVAILABLE, UPRDESC)
AS
SELECT MODULE, CODE, DESCRIPTION, COALESCE(AVAILABLE,0), UPPER(DESCRIPTION) uprdesc
FROM AIMMODULES;

SET TERM ^ ;
CREATE PROCEDURE SPF_GETINTEGERLIST (
    AINTEGERLIST Varchar(32000) )
RETURNS (
    ID Integer )
AS
declare variable IntegerList varchar(32000);
 declare variable CommaPos integer;
 declare variable IntegerVal varchar(10);
 begin
   IntegerList = :AIntegerList || ' ';
   CommaPos = Position(',', IntegerList);

   while (CommaPos > 0) do
   begin
     IntegerVal = Trim(SubString(IntegerList from 1 for CommaPos - 1));

     if (Char_Length(IntegerVal) > 0) then
     begin
       if (IntegerVal similar to '[0-9]*') then
       begin
         ID = Cast(IntegerVal as integer);
         suspend;
       end
     end

     if (Char_Length(IntegerList) > CommaPos) then
       IntegerList = SubString(IntegerList from CommaPos + 1);
     else
       IntegerList = '';

     CommaPos = Position(',', IntegerList);
   end

   IntegerList = Trim(IntegerList);

   if (Char_Length(IntegerList) > 0) then
   begin
     if (IntegerList similar to '[0-9]*') then
     begin
       ID = Cast(IntegerList as integer);
       suspend;
     end
   end
 END ^
SET TERM ; ^

UPDATE RDB$PROCEDURES set
  RDB$DESCRIPTION = 'Convert string with comma as delimiter to integer list'
  where RDB$PROCEDURE_NAME = 'SPF_GETINTEGERLIST';

SET TERM ^ ;
CREATE PROCEDURE SPF_GETCHARLIST (
    ACHARLIST Varchar(32000) )
RETURNS (
    CODE Varchar(16) )
AS
declare variable CharList varchar(32000);
 declare variable CommaPos integer;
 declare variable CharVal varchar(16);
 begin
   CharList = :ACHARLIST || ' ';
   CommaPos = Position(',', CharList);
   while (CommaPos > 0) do
   begin
     CharVal = Trim(SubString(CharList from 1 for CommaPos - 1));

     if (Char_Length(CharVal) > 0) then
     begin
         CODE = CharVal;
         suspend;
     end

     if (Char_Length(CharList) > CommaPos) then
       CharList = SubString(CharList from CommaPos + 1);
     else
       CharList = '';

     CommaPos = Position(',', CharList);
   end

   CharList = Trim(CharList);

   if (Char_Length(CharList) > 0) then
   begin
       CODE = CharList;
       suspend;
   end
 END ^
SET TERM ; ^

UPDATE RDB$PROCEDURES set
  RDB$DESCRIPTION = 'convert a string with comma as delimiter to string list '
  where RDB$PROCEDURE_NAME = 'SPF_GETCHARLIST';

SET TERM ^ ;
CREATE PROCEDURE SPW_UPDATECLIENTMODULE (
    CIDREF Integer,
    MIDSTRING Varchar(120) )
RETURNS (
    OK Smallint )
AS
declare variable MID integer;
declare variable CLIENT_MODULE_ID integer;
BEGIN
    OK = 1;
    BEGIN
        if( strlen(trim(:MIDSTRING)) = 0 ) then
        begin
            delete from CLIENTMODULES t
            where t.CIDREF = :CIDREF;
        end
        else
        begin
            for select t.ID from CLIENTMODULES t
            where t.CIDREF = :CIDREF and
                t.MODULEREF not in (
                select p.ID from SPF_GETINTEGERLIST(:MIDSTRING) p
            )
            into :CLIENT_MODULE_ID
            do
            begin
                delete from SFTWR_LCNS_DETS where CLIENT_MODULE_ID = :CLIENT_MODULE_ID;
            end

            delete from CLIENTMODULES t
            where t.CIDREF = :CIDREF and
                t.MODULEREF not in (
                select p.ID from SPF_GETINTEGERLIST(:MIDSTRING) p
            );

            insert into CLIENTMODULES(ID, CIDREF, MODULEREF)
            select GEN_ID(GEN_CLIENTMODULES_ID, 1), :CIDREF, p.ID from SPF_GETINTEGERLIST(:MIDSTRING) p
            where p.ID not in (select t.MODULEREF from CLIENTMODULES t
                where t.CIDREF = :CIDREF );
        end
        suspend;
    END
    When any do
    begin
        OK = 0;
        suspend;
        exception;
    end
END^
SET TERM ; ^

CREATE GENERATOR GEN_FEECATEGORIES_ID;
SET GENERATOR GEN_FEECATEGORIES_ID TO 0;

CREATE TABLE FEECATEGORIES
(
  ID Integer NOT NULL,
  DESCRIPTION Varchar(64),
  CONSTRAINT PK_FEECATEGORIES_1 PRIMARY KEY (ID)
);

GRANT DELETE, INSERT, REFERENCES, SELECT, UPDATE
 ON FEECATEGORIES TO  AIMHD WITH GRANT OPTION;

SET TERM ^ ;

CREATE TRIGGER TRG_FEECATEGORIES_BI FOR FEECATEGORIES
ACTIVE BEFORE INSERT POSITION 0
AS
BEGIN
	if( new.ID is null ) then
	begin
        new.ID = GEN_ID(GEN_FEECATEGORIES_ID, 1);
	end
END^

SET TERM ; ^

INSERT INTO FEECATEGORIES (DESCRIPTION)
 VALUES ('Rental Fee');

INSERT INTO FEECATEGORIES (DESCRIPTION)
 VALUES ('Backup Fee');

ALTER TABLE CLIENTFEE ADD REVIEWDATE Date;
ALTER TABLE CLIENTFEE ADD FEECATEGORIES_ID Integer;
commit;

update CLIENTFEE t set t.FEECATEGORIES_ID = 1;
commit;

alter table CLIENTFEE add constraint FK_CLIENTFEE_3
foreign key (FEECATEGORIES_ID) references FEECATEGORIES (ID) on update CASCADE on delete SET NULL;

CREATE VIEW VW_CLIENTFEES (CFEE_ID, CIDREF, FROMDATE, ANNUALFEE, FREQTYPE, NOTES, FREQDESC, REVIEWDATE, FEECATEGORIES_ID, FEECATDESC )
AS
SELECT cf.CFEE_ID, cf.CIDREF, cf.FROMDATE, cf.ANNUALFEE,cf.FREQTYPE, cf.NOTES,  ft.DESCRIPTION, cf.REVIEWDATE, fc.ID, fc.DESCRIPTION
FROM CLIENTFEE cf
    LEFT JOIN FEETYPES ft on cf.FREQTYPE = ft.ID
    LEFT JOIN FEECATEGORIES fc on cf.FEECATEGORIES_ID = fc.ID
ORDER BY cf.CIDREF;

SET TERM ^ ;
CREATE PROCEDURE SPW_ADDCLIENTFEE (
    CIDREF integer,
    FROMDATE date,
    FREQTYPE integer,
    ANNUALFEE dec(12,2),
    NOTES varchar(1024),
    REVIEWDATE date,
    FEECATEGORIES_ID integer
 )
RETURNS (
    CFEE_ID Integer,
    FEECATEGORY Varchar(48),
    FREQUENCY varchar(10)
    )
AS
BEGIN
  CFEE_ID = GEN_ID(CLIENT_FEE_ID_GEN, 1);
  FEECATEGORY = '';
  select t.DESCRIPTION from FEECATEGORIES t
  where t.ID = :FEECATEGORIES_ID
  into :FEECATEGORY;

  select t.ID from FEETYPES t
  where t.ID = :FREQTYPE
  into :FREQUENCY;

  INSERT INTO CLIENTFEE (CFEE_ID, CIDREF, FROMDATE, FREQTYPE, ANNUALFEE, FREQUENCY, NOTES, REVIEWDATE, FEECATEGORIES_ID)
  VALUES ( :CFEE_ID, :CIDREF, :FROMDATE, :FREQTYPE, :ANNUALFEE, :FREQUENCY, :NOTES, :REVIEWDATE, :FEECATEGORIES_ID );
  suspend;
END^
SET TERM ; ^

SET TERM ^ ;
CREATE PROCEDURE SPW_UPDATECLIENTFEE (
    FEEID integer,
    CIDREF integer,
    FROMDATE date,
    FREQTYPE integer,
    ANNUALFEE dec(12,2),
    NOTES varchar(1024),
    REVIEWDATE date,
    FEECATEGORIES_ID integer )
RETURNS (
    CFEE_ID Integer,
    FREQUENCY Varchar(10),
    FEECATEGORY varchar(48)
     )
AS
BEGIN
    CFEE_ID = :FEEID;
    select t.DESCRIPTION from FEETYPES t where t.ID = :FREQTYPE into :FREQUENCY;
    select t.DESCRIPTION from FEECATEGORIES t where t.ID = :FREQTYPE into :FEECATEGORY;
    BEGIN
      update CLIENTFEE t
      set t.FEECATEGORIES_ID = :FEECATEGORIES_ID,
          t.FROMDATE = :FROMDATE,
          t.FREQTYPE = :FREQTYPE,
          t.ANNUALFEE = :ANNUALFEE,
          t.NOTES = :NOTES,
          t.REVIEWDATE = :REVIEWDATE
      where t.CFEE_ID = :CFEE_ID;
      suspend;
    END
    When any do
    begin
        CFEE_ID = 0;
        FREQUENCY = '';
        FEECATEGORY = '';
        suspend;
        exception;
    end
END^
SET TERM ; ^

SET TERM ^ ;
create PROCEDURE SPW_DELETECLIENTFEE (
    ID Integer )
AS
BEGIN
    delete from CLIENTFEE t
    where t.CFEE_ID = :ID;
END^
SET TERM ; ^

CREATE VIEW VW_CLIENTEDI (CIDREF, EDINUMBER, SERVICE, EDISTRING)
AS
SELECT CIDREF, EDINUMBER, SERVICE, EDISTRING FROM CLIENTEDI;


SET TERM ^ ;
CREATE PROCEDURE SPW_ADDCLIENTEDI (
    CIDREF Integer,
    EDI_ID Integer,
    SERVICE Varchar(124),
    EDISTRING Varchar(8) )
RETURNS (
    EDINUMBER Integer )
AS
BEGIN
  EDINUMBER = :EDI_ID;
  INSERT INTO CLIENTEDI (CIDREF, EDINUMBER , SERVICE, EDISTRING)
  VALUES ( :CIDREF, :EDINUMBER, :SERVICE, :EDISTRING );
  suspend;
END^
SET TERM ; ^

SET TERM ^ ;
CREATE PROCEDURE SPW_UPDATECLIENTEDI (
   EDI_ID integer,
   SERVICE varchar(124),
   EDISTRING varchar(8)
 )
RETURNS (
    EDINUMBER Integer
)
AS
BEGIN
    EDINUMBER = :EDI_ID;
    BEGIN
      UPDATE CLIENTEDI t
      set t.EDINUMBER = :EDINUMBER,
            t.SERVICE = :SERVICE,
            t.EDISTRING = :EDISTRING
      WHERE EDINUMBER = :EDINUMBER;
      suspend;
    END
    When any do
    begin
        EDINUMBER = 0;
        suspend;
        exception;
    end
END^
SET TERM ; ^

SET TERM ^ ;
CREATE PROCEDURE SPW_DELETECLIENTEDI (
    ID Integer )
AS
BEGIN
    delete from CLIENTEDI t
    where t.EDINUMBER = :ID;
END^
SET TERM ; ^

INSERT INTO TL_SOFTWARE (ID, CODE, DESCRIPTION) VALUES ('3', 'OTHER', 'Others');








