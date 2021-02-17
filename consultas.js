const { Pool } = require("pg");
const config = {
    user: "postgres",
    host: "localhost",
    database: "elecciones",
    password: "postgres",
    port: 5432,
};
const pool = new Pool(config);

// Req.1: Consulta SQL con texto parametrizado para insertar un registro a la tabla candidatos
const insertarCandidato = async(datos) => {
    const sqlInsertCandidato = {
        text: "INSERT INTO candidatos (nombre,foto,color,votos) values ($1,$2,$3,0) RETURNING *;",
        values: datos,
    };
    try {
        const resultado = await pool.query(sqlInsertCandidato);
        return resultado.rows;
    } catch (e) {
        console.log("Clase de Error:", e.code);
        console.log("Detalle del error: " + e.detail);
        return e;
    }
};

// Req.2: Consulta SQL para obtener todos los candidatos
const consultarCandidatos = async() => {
    const sqlSelectCandidatos = {
        text: "SELECT * FROM candidatos",
    };
    try {
        const resultado = await pool.query(sqlSelectCandidatos);
        return resultado.rows;
    } catch (e) {
        console.log("Clase de Error:", e.code);
        console.log("Detalle del error: " + e.detail);
        return e;
    }
};

// Req.3: Consulta SQL para eliminar el registro de un candidato por id
const eliminarCandidato = async(id) => {
    const sqlDeleteCandidato = {
        text: "DELETE FROM candidatos WHERE id = $1 RETURNING *;",
        values: [id],
    };
    try {
        const resultado = await pool.query(sqlDeleteCandidato);
        return resultado.rows;
    } catch (e) {
        console.log("Clase de Error:", e.code);
        console.log("Detalle del error: " + e.detail);
        return e;
    }
};

// Req.4: Consulta SQL con texto parametrizado para actualizar los datos de un candidato
const actualizarCandidato = async(datos) => {
    const sqlUpdateCandidato = {
        text: "UPDATE candidatos SET nombre = $1, foto = $2 WHERE id = $3 RETURNING *;",
        values: datos,
    };
    try {
        const resultado = await pool.query(sqlUpdateCandidato);
        return resultado.rows;
    } catch (e) {
        console.log("Clase de Error:", e.code);
        console.log("Detalle del error: " + e.detail);
        return e;
    }
};

// Req.5: Consultas SQL para actualizar la cantidad de votos del candidato e insertar
// los datos recibidos en la tabla historial
const insertarVotosHistorial = async(datos) => {
    console.log(datos);

    const votos = datos[1];
    const ganador = datos[2];

    const sqlInsertHistorial = {
        text: "INSERT INTO historial (estado, votos, ganador) values ($1,$2,$3) RETURNING *;",
        values: datos,
    };
    const sqlUpdateSumarVotos = {
        text: `UPDATE candidatos SET votos = votos + ${votos}
        WHERE nombre = '${ganador}' RETURNING *;`,
    };
    const sqlSelectCandidato = {
        text: `SELECT * FROM candidatos WHERE nombre = '${ganador}'`,
    };

    let validarCandidato = true;
    try {
        let resCandidato = await pool.query(sqlSelectCandidato);
        if (resCandidato.rowCount == 1) {
            validarCandidato = true;
        } else {
            validarCandidato = false;
            console.log(`Candidato ${ganador} no existe en la Base de Datos.`);
        }
    } catch (e) {
        validarCandidato = false;
        console.log("Clase de Error:", e.code);
    }

    try {
        console.log(validarCandidato);

        if (validarCandidato == true) {
            await pool.query("BEGIN");
            const resultadoSumarVotos = await pool.query(sqlUpdateSumarVotos);
            console.log(resultadoSumarVotos.rows);

            const resultadoInsertarH = await pool.query(sqlInsertHistorial);
            console.log(resultadoInsertarH.rows);
            await pool.query("COMMIT");
            return true;
        } else return false;
    } catch (e) {
        await pool.query("ROLLBACK");
        console.log("Registro duplicado: Fraude");
        console.log("Clase de Error:", e.code);
        console.log("Detalle del error: " + e.detail);
        return e;
    }
};

// Req.6: Consulta SQL para obtener todos los registros de la tabla historial
const consultarHistorial = async() => {
    const sqlSelectHistorial = {
        text: "SELECT * FROM historial",
        rowMode: "array",
    };
    try {
        const resultado = await pool.query(sqlSelectHistorial);
        return resultado.rows;
    } catch (e) {
        console.log("Clase de Error:", e.code);
        console.log("Detalle del error: " + e.detail);
        return e;
    }
};

module.exports = {
    insertarCandidato,
    consultarCandidatos,
    eliminarCandidato,
    actualizarCandidato,
    insertarVotosHistorial,
    consultarHistorial,
};