const Survey = require('../model/surveyModel');

exports.getAllSurveys = async (req, res) => {
    try {
        const surveys = await Survey.getAllSurveys();
        res.json(surveys);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getSurveyById = async (req, res) => {
    try {
        const { survey_id } = req.params; // Extract survey ID from request URL
        const survey = await Survey.getSurveyById(survey_id); // Call correct model function

        if (!survey) {
            return res.status(404).json({ message: "Survey not found" });
        }

        res.json(survey);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getQuestionsBySurvey = async (req, res) => {
    try {
        const { survey_id } = req.params;
        const questions = await Survey.getQuestionsBySurvey(survey_id);
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOptionsByQuestion = async (req, res) => {
    try {
        const { question_id } = req.params;
        const options = await Survey.getOptionsByQuestion(question_id);
        res.json(options);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
