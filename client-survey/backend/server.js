const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const surveyRoutes = require("./route/surveyRoute");
const officeRoutes = require("./route/officeRoute");
const responseRoutes = require("./route/responseRoute");
const questionOptionRoutes = require("./route/questionOptionRoute");
const InfoRoutes = require("./route/infoRoute");

require("dotenv").config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use("/api", InfoRoutes);
app.use("/api", questionOptionRoutes);
app.use("/api", responseRoutes);
app.use("/api", surveyRoutes);
app.use("/api", officeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
