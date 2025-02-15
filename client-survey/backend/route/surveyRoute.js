const express = require('express');
const router = express.Router();
const { getAllSurveys, getSurveyById, getQuestionsBySurvey, getOptionsByQuestion } = require('../controller/surveyController'); // Ensure correct path

router.get('/surveys', getAllSurveys);
router.get('/surveys/:survey_id', getSurveyById);
router.get('/surveys/:survey_id/questions', getQuestionsBySurvey);
router.get('/surveys/:survey_id/questions/:question_id/options', getOptionsByQuestion);

module.exports = router;
