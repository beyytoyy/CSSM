const pool = require("../db");

// Insert response into the response table and return the inserted ID
const insertResponse = async (survey_id, office_id, type, role, sex, age, region, email, phone) => {
    const query = `
        INSERT INTO "CSS".response (survey_id, office_id, type, role, sex, age, region, email, phone)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id;
    `;
    const values = [survey_id, office_id, type, role, sex, age, region, email || null, phone || null];
    const result = await pool.query(query, values);
    return result.rows[0].id;
};

// Insert answers into the answer table
const insertAnswers = async (answers, responseId) => {
    const query = `
        INSERT INTO "CSS".answer (question_id, response_id, text) VALUES ($1, $2, $3);
    `;
    for (const answer of answers) {
        await pool.query(query, [answer.question_id, responseId, answer.text]);
    }
};

module.exports = {
    insertResponse,
    insertAnswers
};
