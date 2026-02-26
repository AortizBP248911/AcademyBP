SELECT 
    CAST(DECOMPRESS([XML]) AS NVARCHAR(MAX)) AS JsonTexto
FROM col_Invoice_acepted_Key
WHERE Fe_Invoice_Id = 111639 and fe_str_id= 6