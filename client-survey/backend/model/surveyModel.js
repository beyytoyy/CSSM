const pool = require('../db');

const Survey = {
    // Get all surveys
    getAllSurveys: async () => {
        const result = await pool.query('SELECT * FROM "CSS".survey');
        return result.rows;
    },

    // Get a specific survey by ID
    getSurveyById: async (survey_id) => {
        const result = await pool.query('SELECT * FROM "CSS".survey WHERE id = $1', [survey_id]);
        return result.rows[0];
    },

    // Get questions linked to a survey
    getQuestionsBySurvey: async (survey_id) => {
        const result = await pool.query('SELECT * FROM "CSS".question WHERE survey_id = $1', [survey_id]);
        return result.rows;
    },

    // Get options linked to a question
    getOptionsByQuestion: async (question_id) => {
        const result = await pool.query('SELECT * FROM "CSS".option WHERE question_id = $1', [question_id]);
        return result.rows;
    }
}

module.exports = Survey;

