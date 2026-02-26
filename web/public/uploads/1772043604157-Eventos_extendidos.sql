--1-Crear el evento

CREATE EVENT SESSION [XE_ArithmeticOverflow]
ON SERVER
ADD EVENT sqlserver.error_reported
(
    ACTION
    (
        sqlserver.client_app_name,
        sqlserver.client_hostname,
        sqlserver.database_name,
        sqlserver.sql_text,
        sqlserver.username
    )
    WHERE
    (
        error_number = 8115
    )
)
ADD TARGET package0.event_file
(
    SET filename = 'C:\XE\ArithmeticOverflow.xel',
        max_file_size = 50, 
        max_rollover_files = 5
)
WITH
(
    MAX_MEMORY = 4096 KB,
    EVENT_RETENTION_MODE = ALLOW_SINGLE_EVENT_LOSS,
    MAX_DISPATCH_LATENCY = 5 SECONDS,
    TRACK_CAUSALITY = ON
);
GO


--2- Iniciar el evento  (replicar el error)
ALTER EVENT SESSION [XE_ArithmeticOverflow]
ON SERVER
STATE = START;

--3- Consulta
SELECT
    event_data.value('(event/@timestamp)[1]', 'datetime2') AS Fecha,
    event_data.value('(event/action[@name="database_name"]/value)[1]', 'sysname') AS DB,
    event_data.value('(event/action[@name="username"]/value)[1]', 'sysname') AS Usuario,
    event_data.value('(event/action[@name="client_app_name"]/value)[1]', 'nvarchar(200)') AS App,
    event_data.value('(event/action[@name="client_hostname"]/value)[1]', 'nvarchar(200)') AS Host,
    event_data.value('(event/action[@name="sql_text"]/value)[1]', 'nvarchar(max)') AS SQL_Text,
    event_data.value('(event/data[@name="message"]/value)[1]', 'nvarchar(max)') AS Mensaje
FROM
(
    SELECT CAST(event_data AS XML) AS event_data
    FROM sys.fn_xe_file_target_read_file
    (
        'C:\XE\ArithmeticOverflow*.xel',
        NULL, NULL, NULL
    )
) AS X;


--4- una vez encontrado el evento se puede eliminar

ALTER EVENT SESSION [XE_ArithmeticOverflow]
ON SERVER
STATE = STOP;

DROP EVENT SESSION [XE_ArithmeticOverflow]
ON SERVER;
