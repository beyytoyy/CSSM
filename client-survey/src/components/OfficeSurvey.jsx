import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavBarQuest from "../global/NavBarQuest";
import axios from "axios";


const surveyQuestions3Optional = [
    { name: "comment", type: "text", label: "To better improve our service, please state your comments/suggestions and the issues you have encountered below:", placeholder: "Your answer" },
    { name: "email", type: "email", label: "Email address (optional):", placeholder: "Your answer" },
    { name: "contact", type: "text", label: "Mobile Number (optional):", placeholder: "Your answer" }
];


const OfficeSurvey = () => {
    const { surveyId, officeId } = useParams();
    const [office, setOffice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [responses, setResponses] = useState({});
    const [serviceType, setserviceType] = useState([]);
    const [selectedService, setSelectedService] = useState("");
    const [otherServiceType, setOtherServicesType] = useState("");
    const [age, setAge] = useState("");
    const [personnelList, setPersonnelList] = useState([]);
    const [selectedPersonnel, setSelectedPersonnel] = useState([]);
    const [step, setStep] = useState(1); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);
    const [questionByType, setQuestionByType] = useState([]);
    const [questionById, setQuestionById] = useState([]);
    const [roles, setRoles] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [regions, setRegions] = useState([]);
    const [roleType, setRoleType] = useState([]);
    const [clientType, setClientType] = useState("");
    const [sexType, setSexType] = useState("");
    const [collegeType, setCollegeType] = useState("");
    const [residenceType, setResidenceType] = useState("");
    const [comment, setComment] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [selectedSurveyId, setSelectedSurveyId] = useState(null);
    const [selectedOfficeId, setSelectedOfficeId] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState([]);

    useEffect(() => {
        const fetchOffice = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/offices/${officeId}`);
                setOffice(response.data);
            } catch (error) {
                console.error("Error fetching office:", error);
                setOffice(null);
            } finally {
                setLoading(false);
            }
        };

        if (officeId) {
            fetchOffice();
            fetchServices();
            fetchPersonnel();
        } else {
            setLoading(false);
        }
    }, [officeId]);

    useEffect(() => {
        setSelectedSurveyId(surveyId);
        setSelectedOfficeId(officeId);
    }, [surveyId, officeId]);

    const fetchServices = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/offices/${officeId}/services`);
            const data = await response.json();
            setserviceType(data); // Store fetched services
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };
  
    const fetchPersonnel = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/offices/${officeId}/personnel`);
            const data = await response.json();
            setPersonnelList(data); // Store fetched personnel list
        } catch (error) {
            console.error("Error fetching personnel:", error);
        }
    };

    useEffect(() => {
        // Fetch roles
        axios.get("http://localhost:5000/api/infos/roles")
            .then(response => setRoles(response.data))
            .catch(error => console.error("Error fetching roles:", error));

        // Fetch colleges
        axios.get("http://localhost:5000/api/infos/colleges")
            .then(response => setColleges(response.data))
            .catch(error => console.error("Error fetching colleges:", error));

        // Fetch regions
        axios.get("http://localhost:5000/api/infos/regions")
            .then(response => setRegions(response.data))
            .catch(error => console.error("Error fetching regions:", error));
    }, []);


    useEffect(() => {
        const fetchQuestionByType = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/question-options/survey/${surveyId}/type/Rating`);
                console.log("Fetched Data:", response.data);
    
                if (Array.isArray(response.data) && response.data.length > 0) {
                    const extractedQuestions = Object.values(response.data[0]); // Convert object values into an array
                    setQuestionByType(extractedQuestions);
                } else {
                    setQuestionByType([]);
                }
            } catch (error) {
                console.error("Error fetching survey data:", error);
            }
        };
    
        fetchQuestionByType();
    }, [surveyId]);
     

    useEffect(() => {
        const fetchQuestionById = async () => {
          try {
            const questionIds = [22, 23, 24]; // List of question IDs
            
            const responses = await Promise.all(
              questionIds.map((id) => axios.get(`http://localhost:5000/api/question-options/survey/${surveyId}/id/${id}`))
            );
      
            console.log("API Response:", responses.map((res) => res.data)); // ✅ Debugging
      
            setQuestionById(responses.map((res) => res.data)); // Extract data and update state
          } catch (error) {
            console.error("Error fetching survey data:", error);
          }
        };
      
        fetchQuestionById();
      }, [surveyId]);       
   
    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleCheckboxChange = (e) => {
      const { value, checked } = e.target;
  
      setSelectedPersonnel((prevSelected) =>
        checked
          ? [...prevSelected, value] // Add to array if checked
          : prevSelected.filter((person) => person !== value) // Remove if unchecked
      );
    };

    const handleAnswerChange = (questionId, value) => {
        setResponses((prev) => ({ ...prev, [questionId]: value }));
        setSelectedAnswers((prev) => {
            const existingAnswerIndex = prev.findIndex(answer => answer.questionId === questionId);
            if (existingAnswerIndex > -1) {
                // Update existing answer
                const updatedAnswers = [...prev];
                updatedAnswers[existingAnswerIndex] = { questionId, value };
                return updatedAnswers;
            } else {
                // Add new answer
                return [...prev, { questionId, value }];
            }
        });
    };
    

    const handleSubmit = async () => {

        console.log("Submitting with these answers:", {
            survey_id: selectedSurveyId,
            office_id: selectedOfficeId,
            type: clientType,
            role: roleType,
            sex: sexType.toLowerCase(),
            age: age,
            region: residenceType,
            email: email,
            phone: phone,
            comment: comment,
            answers: selectedAnswers.map(answer => ({ questionId: answer.questionId, answer: answer.value })), // Adjust as needed
        });
    
        try {
            const response = await axios.post("http://localhost:5000/api/responses/submit", {
                survey_id: selectedSurveyId,
                office_id: selectedOfficeId,
                type: clientType,
                role: roleType,
                sex: sexType,
                age: age,
                region: residenceType,
                email: email,
                phone: phone,
                comment: comment,
                answers: selectedAnswers || [],  // Ensure it's an array
            });
    
            console.log("Response Data:", response.data);
            alert("Survey response submitted successfully!");
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error submitting survey response:", error.response?.data || error.message);
            alert("Failed to submit survey response.");
        }
    };
        
    

    if (loading) {
        return <h2>Loading office details...</h2>;
    }

    if (!office) {
        return <h2>Office not found!</h2>;
    }

    return (
        <div className="parent-container-questions">
          <NavBarQuest/>
          <div className="headertext">
            <p>{office.name} - Client Satisfaction Measurement Survey</p>
          </div>
           {/* Stepper Header */}
           <div className="stepper-wrapper">
            <div className="stepper-container">
            <div className="step">
                <div className={`step-circle ${step >= 1 ? "active" : ""}`}>1</div>
            </div>
            <div className={`step-line ${step >= 2 ? "active" : ""}`}></div>
            <div className="step">
                <div className={`step-circle ${step >= 2 ? "active" : ""}`}>2</div>
            </div>
            <div className={`step-line ${step >= 3 ? "active" : ""}`}></div>
            <div className="step">
                <div className={`step-circle ${step >= 3 ? "active" : ""}`}>3</div>
            </div>
            </div>
            </div>
                    {step === 1 && (
                <div className="survey-container-questions">
                                {/* Left Side - Client Type with Radio Buttons */}
                        <div className="survey-container-questions-left">
                            <div className="instruction-1">
                                <p className="instructions-header2">Client Type:</p>
                                <div className="radio-group">
                                    <label>
                                        <input 
                                            type="radio" 
                                            name="clientType" 
                                            value="Citizen" 
                                            checked={clientType === "Citizen"}
                                            onChange={(e) => setClientType(e.target.value)}
                                        />
                                        Citizen
                                    </label>
                                    <label>
                                        <input 
                                            type="radio" 
                                            name="clientType" 
                                            value="Business" 
                                            checked={clientType === "Business"}
                                            onChange={(e) => setClientType(e.target.value)}
                                        />
                                        Business
                                    </label>
                                    <label>
                                        <input 
                                            type="radio" 
                                            name="clientType" 
                                            value="Government" 
                                            checked={clientType === "Government"}
                                            onChange={(e) => setClientType(e.target.value)}
                                        />
                                        Government (Employee or another agency)
                                    </label>
                                </div>
                            </div>
                            <div className="instruction-1">
                                <p className="instructions-header2">I am a/an:</p>
                                <select 
                                    className="dropdown-select" 
                                    value={roleType} // Ensure roleType is a scalar value
                                    onChange={(e) => setRoleType(e.target.value)}
                                >
                                    <option value="">-- Select One --</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.name}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="instruction-1">
                                <p className="instructions-header2">Sex at Birth:</p>
                                <div className="radio-group">
                                    <label>
                                        <input 
                                            type="radio" 
                                            name="sexType" 
                                            value="male" 
                                            checked={sexType === "male"}
                                            onChange={(e) => setSexType(e.target.value)}
                                        />
                                        Male
                                    </label>
                                    <label>
                                        <input 
                                            type="radio" 
                                            name="sexType" 
                                            value="female" 
                                            checked={sexType === "female"}
                                            onChange={(e) => setSexType(e.target.value)}
                                        />
                                        Female
                                    </label>
                                </div>
                            </div>
                            <div className="instruction-1">
                            <p className="instructions-header2">Your Office/College:</p>
                            <select 
                                className="dropdown-select" 
                                value={collegeType} 
                                onChange={(e) => setCollegeType(e.target.value)}
                            >
                                <option value="">-- Select One --</option>
                                {colleges.map((college) => (
                                    <option key={college.id} value={college.name}>
                                        {college.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                            <div className="instruction-1">
                                <p className="instructions-header2">Your Age:</p>
                                <input 
                                type="number"  // Enforce numeric input
                                name="age" 
                                className="input-full"  // Add class for styling
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                min="0" // Prevents negative age input
                                placeholder="Enter your age" // Adds a placeholder for better UX
                                />
                            </div>
                        </div>             
                        <div className="survey-container-questions-right">
                        <div className="instruction-1">
                            <p className="instructions-header2">Region of Residence:</p>
                            <select 
                                className="dropdown-select" 
                                value={residenceType} 
                                onChange={(e) => setResidenceType(e.target.value)}
                            >
                                <option value="">-- Select One --</option>
                                {regions.map((region) => (
                                    <option key={region.id} value={region.name}>
                                        {region.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                                    <div className="instruction-1">
                                <p className="instructions-header2">Service Availed:</p>
                                <div className="radio-group">
                                    {serviceType.map((service) => (
                                        <label key={service.id}>
                                            <input
                                                type="radio"
                                                name="serviceType"
                                                value={service.name}
                                                checked={selectedService === service.name}
                                                onChange={(e) => setSelectedService(e.target.value)}
                                            />
                                            {service.name}
                                        </label>
                                    ))}
                                    <label className="radio-option other-option">
                                    <input 
                                        type="radio" 
                                        name="serviceType" 
                                        value="Other" 
                                        checked={selectedService === "Other"}
                                        onChange={(e) => setSelectedService(e.target.value)}
                                    />
                                    Other
                                    {/* The text field is always visible */}
                                    <input 
                                        type="text" 
                                        className="other-textfield"
                                        placeholder="Please specify"
                                        value={otherServiceType}
                                        onChange={(e) => setOtherServicesType(e.target.value)}
                                    />
                                </label>
                                </div>
                            </div>
                            <div className="instruction-1">
                            <p>Personnel you transacted with:</p>
                            <div className="checkbox-group">
                                {personnelList.map((person) => (
                                    <label key={person.id} className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="personnel"
                                            value={person.name}
                                            checked={selectedPersonnel.includes(person.name)}
                                            onChange={handleCheckboxChange}
                                        />
                                        {person.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                        )}

                    {step === 2 && (
                    <div className="survey-container-questions">
                        <div className="survey-container-questions-left">
                        <div className="instruction-1">
                            <p className="instructions-header">INSTRUCTIONS</p>
                            <p className="description-body">
                            Tick your answer to the Citizen’s Charter (CC) questions. 
                            The Citizen’s Charter is an official document that reflects 
                            the services of a government agency/office including its requirements, 
                            fees, and processing times among others.
                            </p>
                        </div>

                        {/* First Two Questions on the Left */}
                        {questionById.slice(0, 2).map((question) => (
                            <div key={question.id} className="instruction-1">
                            <p className="instructions-header2">{question.text}</p>
                            <div className="radio-group two-row">
                                {question.options.map((option) => (
                                <label key={option.id}>
                                    <input 
                                    type="radio" 
                                    name={`question_${question.id}`} 
                                    value={option.id} 
                                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                    />
                                    {option.text}
                                </label>
                                ))}
                            </div>
                            </div>
                        ))}
                        </div>

                        {/* Third Question on the Right */}
                        <div className="survey-container-questions-right">
                        {questionById.length > 2 && (
                            <div key={questionById[2].id} className="instruction-1">
                            <p className="instructions-header2">{questionById[2].text}</p>
                            <div className="radio-group two-row">
                                {questionById[2].options.map((option) => (
                                <label key={option.id}>
                                    <input 
                                    type="radio" 
                                    name={`question_${questionById[2].id}`} 
                                    value={option.id} 
                                    onChange={(e) => handleAnswerChange(questionById[2].id, e.target.value)}
                                    />
                                    {option.text}
                                </label>
                                ))}
                            </div>
                            </div>
                        )}
                        </div>
                    </div>
                    )}

                    {step === 3 && ( 
                        <div className="survey-container-questions">
                            {/* LEFT COLUMN */}
                            <div className="survey-container-questions-left">
                                <div className="instruction-1">
                                    <p className="instructions-header">INSTRUCTIONS</p>
                                    <p className="description-body">
                                        For Service Quality Dimensions 0-9, please tick the option that best corresponds to your answer.
                                    </p>
                                </div>

                                {/* First Half of Questions */}
                                {questionByType.slice(0, Math.ceil(questionByType.length / 2)).map((question, qIndex) => (
                                    <div key={question.question_id || qIndex} className="instruction-1">
                                        <p className="instructions-header2">{question.text}</p>
                                        <div className="radio-container">
                                            <div className="radio-column">
                                                {question.options?.slice(0, Math.ceil(question.options.length / 2)).map((option, oIndex) => (
                                                    <label key={option.option_id || `${qIndex}-${oIndex}`} className="radio-label">
                                                        <input
                                                            type="radio"
                                                            name={`question-${question.id}`}  // Ensuring unique names per question
                                                            value={option.text}
                                                            checked={responses[question.id] === option.text}  // Correct state mapping
                                                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                            className="radio-button"
                                                            />
                                                        {option.text}
                                                    </label>
                                                ))}
                                            </div>
                                            <div className="radio-column">
                                                {question.options?.slice(Math.ceil(question.options.length / 2)).map((option, oIndex) => (
                                                    <label key={option.option_id || `${qIndex}-${oIndex + 10}`} className="radio-label">
                                                        <input
                                                            type="radio"
                                                            name={`question-${question.id}`}  // Ensuring unique names per question
                                                            value={option.text}
                                                            checked={responses[question.id] === option.text}  // Correct state mapping
                                                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                            className="radio-button"
                                                            />
                                                        {option.text}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* RIGHT COLUMN */}
                            <div className="survey-container-questions-right">
                                {/* Second Half of Questions */}
                                {questionByType.slice(Math.ceil(questionByType.length / 2)).map((question, qIndex) => (
                                    <div key={question.question_id || `right-${qIndex}`} className="instruction-1">
                                        <p className="instructions-header2">{question.text}</p>
                                        <div className="radio-container">
                                            <div className="radio-column">
                                                {question.options?.slice(0, Math.ceil(question.options.length / 2)).map((option, oIndex) => (
                                                    <label key={option.option_id || `right-${qIndex}-${oIndex}`} className="radio-label">
                                                        <input
                                                            type="radio"
                                                            name={`question-${question.id}`}  // Ensuring unique names per question
                                                            value={option.text}
                                                            checked={responses[question.id] === option.text}  // Correct state mapping
                                                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                            className="radio-button"
                                                            />
                                                        {option.text}
                                                    </label>
                                                ))}
                                            </div>
                                            <div className="radio-column">
                                                {question.options?.slice(Math.ceil(question.options.length / 2)).map((option, oIndex) => (
                                                    <label key={option.option_id || `right-${qIndex}-${oIndex + 10}`} className="radio-label">
                                                        <input
                                                            type="radio"
                                                            name={`question-${question.id}`}  // Ensuring unique names per question
                                                            value={option.text}
                                                            checked={responses[question.id] === option.text}  // Correct state mapping
                                                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                            className="radio-button"
                                                            />
                                                        {option.text}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {surveyQuestions3Optional.map((field, index) => (
                                    <div key={index} className="instruction-1 additional-field">
                                        <p className="instructions-header2">{field.label}</p>
                                        {field.name === "comment" ? (
                                            <textarea
                                                name="comment"
                                                className="input-full"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder={field.placeholder}
                                                rows="4"
                                            />
                                        ) : field.name === "phone" ? (
                                            <input
                                                type="tel"
                                                name="phone"
                                                className="input-full"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder={field.placeholder}
                                            />
                                        ) : field.name === "email" ? (
                                            <input
                                                type="email"
                                                name="email"
                                                className="input-full"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder={field.placeholder}
                                            />
                                        ) : (
                                            <input
                                                type={field.type}
                                                name={field.name}
                                                className="input-full"
                                                value={responses[field.name] || ""}
                                                onChange={(e) => setResponses({ ...responses, [field.name]: e.target.value })}
                                                placeholder={field.placeholder}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


                     {/* Navigation Buttons */}
                     <div className="button-container">
                    {step > 1 && (
                        <button className="back-button show" onClick={handleBack}>
                        Back
                        </button>
                    )}

                    {step < 3 ? (
                        <button className="next-button" onClick={handleNext}>
                        Next
                    </button>
                    ) : (
                        <button className="next-button" onClick={() => setIsModalOpen(true)}>
                        Submit
                        </button>
                    )}
                    </div>
                    
                    {isModalOpen && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h2 className="modal-title">MSU-IIT Client Satisfaction Survey</h2>

                                <div className="modal-body">
                                    <p className="modal-text">
                                        Dear Students, Faculty Members, and Staff,
                                    </p>
                                    <p className="modal-text">
                                        We highly encourage you to participate in the MSU-IIT Client Satisfaction Survey 
                                        to help us improve our services and better address your needs. Your feedback is 
                                        essential in ensuring that we provide quality support and continuously enhance 
                                        the university's processes.
                                    </p>
                                    <p className="modal-text">
                                        Before proceeding, please confirm your agreement with the Data Privacy Act of 2012:
                                    </p>
                                </div>

                                <label className="modal-checkbox1">
                                    <input type="checkbox" checked={isAgreed} onChange={() => setIsAgreed(!isAgreed)} />
                                    <span>I have read and agree to the terms and conditions in compliance with the Data Privacy Act of 2012.</span>
                                </label>
                                
                                <div className="modal-buttons">
                                    <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                    <button 
                                        className={`confirm-btn ${isAgreed ? "active" : "disabled"}`} 
                                        onClick={handleSubmit} 
                                        disabled={!isAgreed}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

        </div>
      );
};

export default OfficeSurvey;