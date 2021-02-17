const http = require("http");
const fs = require("fs");
const url = require("url");

// Req.7: Funciones asincronas y logica que utiliza paquete pg en archivo externo
const {
    insertarCandidato,
    consultarCandidatos,
    eliminarCandidato,
    actualizarCandidato,
    insertarVotosHistorial,
    consultarHistorial,
} = require("./consultas");

const server = http.createServer(async(req, res) => {
    if (req.url == "/" && req.method === "GET") {
        res.setHeader("content-type", "text/html");
        const html = fs.readFileSync("index.html", "utf8");
        res.end(html);
    }

    // Req.1: Crear una ruta POST /candidato que reciba y procese un payload desde
    // el cliente con el nombre, foto y color del candidato. Esta ruta debe insertar
    // con una consulta SQL con texto parametrizado un registro a la tabla candidatos
    if (req.url == "/candidato" && req.method === "POST") {
        let body = "";
        req.on("data", (payload) => {
            body += payload;
        });
        req.on("end", async() => {
            const data = JSON.parse(body);
            const datos = Object.values(data);
            const respuestaInsertar = await insertarCandidato(datos);
            res.end(JSON.stringify(respuestaInsertar));
        });
    }

    // Req.2: Crear una ruta GET /candidatos que al ser consultada obtenga todos los
    // registros de la tabla candidatos
    if (req.url == "/candidatos" && req.method === "GET") {
        const respuestaConsulta = await consultarCandidatos();
        res.end(JSON.stringify(respuestaConsulta));
    }

    // Req.3: Crear una ruta DELETE /candidato que reciba como parámetro (query string)
    // el id de un candidato y elimine el registro de ese candidato en la tabla candidatos
    if (req.url.startsWith("/candidato") && req.method === "DELETE") {
        let { id } = url.parse(req.url, true).query;
        const respuestaElimina = await eliminarCandidato(id);
        res.end(JSON.stringify(respuestaElimina));
    }

    // Req.4: Crear una ruta PUT /candidatos que reciba un payload desde el cliente
    // con el nombre, foto y el id de un candidato para actualizar los datos del
    // candidato en la tabla candidatos
    if (req.url == "/candidato" && req.method === "PUT") {
        let body = "";
        req.on("data", (payload) => {
            body += payload;
        });
        req.on("end", async() => {
            const data = JSON.parse(body);
            const datos = Object.values(data);
            const respuestaActualiza = await actualizarCandidato(datos);
            res.end(JSON.stringify(respuestaActualiza));
        });
    }

    // Req.5: Crear una ruta POST /votos que reciba y procese un payload desde el cliente
    // cone el nombre del estado, cantidad de votos, y el nombre del candidato ganador.
    // Además, actualice la cantidad de votos del candidato ganador e inserte los datos
    // recibidos en la tabla historial y en caso de suceder algun conflicto, devolver
    // un error de estado HTTP numero 500 al cliente
    if (req.url == "/votos" && req.method === "POST") {
        let body = "";
        req.on("data", (payload) => {
            body += payload;
        });
        req.on("end", async() => {
            const data = JSON.parse(body);
            const datos = Object.values(data);
            const resInsertarVotos = await insertarVotosHistorial(datos);
            if (resInsertarVotos == true) {
                res.end(JSON.stringify({}));
            } else {
                res.writeHead(
                    500,
                    "Fraude Electoral, ya existe candidato ganador para ese estado"
                );
                res.end();
            }
        });
    }

    // Req.6: Crear una ruta GET /historial para obtener los registros de la tabla
    // historial y se debe devolver al cliente los datos en formato de arreglo
    if (req.url == "/historial" && req.method === "GET") {
        const respuestaConsultaHistorial = await consultarHistorial();
        res.end(JSON.stringify(respuestaConsultaHistorial));
    }
});

server.listen(3000, () => console.log("Server ON en puerto:3000"));