CREATE DATABASE elecciones;

CREATE TABLE candidatos (id SERIAL, nombre VARCHAR(50), foto VARCHAR(200), color VARCHAR(9), votos INT);

CREATE TABLE historial (estado VARCHAR(35) UNIQUE, votos INT, ganador VARCHAR(50));

elecciones=# select * from historial;
 estado | votos | ganador
--------+-------+---------
 AL     |    10 | Trump
 AK     |    30 | Biden
 AZ     |    12 | Biden
 AR     |    25 | Biden
 FL     |    25 | Obama
 WA     |   100 | Biden
 CO     |     5 | Trump
 DE     |    22 | Trump
(8 filas)


elecciones=# select * from candidatos;
 id | nombre |                                           foto                                           |  color  | votos
----+--------+------------------------------------------------------------------------------------------+---------+-------
 19 | Obama  | https://www.biografiasyvidas.com/biografia/o/fotos/obama.jpg                             | #14f0b2 |    25
 18 | Biden  | https://ichef.bbci.co.uk/news/640/cpsprodpb/0BAA/production/_115268920_biden1reuters.jpg | #df2020 |   167
 17 | Trump  | https://api.time.com/wp-content/uploads/2020/10/trump-covid-19-coronavirus-age.jpg       | #000000 |    37
(3 filas)


elecciones=#