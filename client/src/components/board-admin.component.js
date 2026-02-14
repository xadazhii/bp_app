import React, { Component } from "react";
import authHeader from "../services/auth-header";
const UserIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);
const BookOpenIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
);
const UploadIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
);
const PlusCircleIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
);
const TrashIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 5 21 5"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m5 0V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
);
const CalendarIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);
const TestIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);
const GraduationCap = (props) =>
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 12 3 12 0v-5" />
    </svg>;
const UserCircleIcon = (props) =>
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
    </svg>;
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
export default class BoardAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: "",
            currentPage: "user-management",
            message: { text: "", type: "" },
            users: [],
            materials: [],
            newMaterial: { title: "", type: "lecture", file: null },
            selectedStudentFile: null,
            uploadingStudentList: false,
            allowedStudents: [],
            newAllowedStudentEmail: "",
            addingAllowedStudent: false,
            deletingAllowedStudentEmail: null,
            calendarEvents: [],
            newEvent: { date: "", message: "" },
            addingEvent: false,
            deletingEventId: null,
            tests: [],
            newTest: { title: "" },
            creatingTest: false,
            newTestQuestions: [
                { question: "", type: "CLOSED", points: 1, answers: [{ text: "", pointsWeight: 1 }, { text: "", pointsWeight: 0 }] }
            ],
            editingTestId: null,
            editingTest: { title: "" },
            editingTestQuestions: [],
            studentGrades: { tests: [], studentGrades: [] },
            gradesLoading: true,
            gradesViewMode: 'cards',
            isSidebarOpen: false,
        };
        this.handleStudentFileChange = this.handleStudentFileChange.bind(this);
    }
    componentDidMount() {
        this.fetchUsers();
        this.fetchMaterials();
        this.fetchAllowedStudents();
        this.fetchCalendarEvents();
        this.fetchTests();
    }
    showMessage(text, type) {
        this.setState({ message: { text, type } });
        setTimeout(() => this.setState({ message: { text: "", type: "" } }), 5000);
    }
    setCurrentPage(page) {
        this.setState({ currentPage: page });
        if (page === "student-list-upload") this.fetchAllowedStudents();
        if (page === "calendar-management") this.fetchCalendarEvents();
        if (page === "test-management") this.fetchTests();
        if (page === "student-grades") this.fetchStudentGrades();
    }
    async fetchUsers() {
        try {
            const res = await fetch(`${API_URL}/api/users`, { headers: authHeader() });
            if (!res.ok) throw new Error();
            const users = await res.json();
            this.setState({ users });
        } catch {
            this.showMessage("Nepodarilo sa načítať používateľov.", "error");
        }
    }
    async handleRoleChange(userId, newRole) {
        try {
            await fetch(`${API_URL}/api/users/${userId}/role`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...authHeader() },
                body: JSON.stringify({ role: newRole }),
            });
            this.fetchUsers();
            this.showMessage(`Rola používateľa aktualizovaná na ${newRole}.`, "success");
        } catch {
            this.showMessage("Nepodarilo sa aktualizovať rolu používateľa.", "error");
        }
    }
    async handleDeleteUser(userId) {
        try {
            await fetch(`${API_URL}/api/users/${userId}`, {
                method: "DELETE",
                headers: authHeader(),
            });
            this.fetchUsers();
            this.showMessage("Používateľ odstránený.", "success");
        } catch {
            this.showMessage("Nepodarilo sa odstrániť používateľa.", "error");
        }
    }
    async fetchMaterials() {
        try {
            const res = await fetch(`${API_URL}/api/materials`, { headers: authHeader() });
            if (!res.ok) throw new Error();
            const materials = await res.json();
            this.setState({ materials });
        } catch {
            this.showMessage("Nepodarilo sa načítať materiály.", "error");
        }
    }
    handleAddMaterial = async (e) => {
        e.preventDefault();
        const { newMaterial } = this.state;
        if (!newMaterial.title || !newMaterial.file) {
            this.showMessage("Prosím, vyplňte všetky polia a vyberte súbor.", "error");
            return;
        }
        const formData = new FormData();
        formData.append("title", newMaterial.title);
        formData.append("type", newMaterial.type);
        formData.append("file", newMaterial.file);
        try {
            await fetch(`${API_URL}/api/materials`, {
                method: "POST",
                headers: { ...authHeader() },
                body: formData,
            });
            this.fetchMaterials();
            this.setState({ newMaterial: { title: "", type: "lecture", file: null } });
            this.showMessage("Materiál úspešne pridaný!", "success");
            if (e.target.elements.file) e.target.elements.file.value = "";
        } catch {
            this.showMessage("Nepodarilo sa pridať materiál.", "error");
        }
    };
    async handleDeleteMaterial(materialId) {
        try {
            await fetch(`${API_URL}/api/materials/${materialId}`, {
                method: "DELETE",
                headers: authHeader(),
            });
            this.fetchMaterials();
            this.showMessage("Materiál odstránený.", "success");
        } catch {
            this.showMessage("Nepodarilo sa odstrániť materiál.", "error");
        }
    }
    handleStudentFileChange(e) {
        this.setState({ selectedStudentFile: e.target.files[0] });
    }
    handleStudentListUpload = async (e) => {
        e.preventDefault();
        const { selectedStudentFile } = this.state;
        if (!selectedStudentFile) {
            this.showMessage("Prosím, vyberte PDF súbor na nahrávanie.", "error");
            return;
        }
        this.setState({ uploadingStudentList: true });
        this.showMessage("Nahrávanie a spracovanie zoznamu študentov...", "info");
        const formData = new FormData();
        formData.append("file", selectedStudentFile);
        try {
            const res = await fetch(`${API_URL}/api/students/upload`, {
                method: "POST",
                headers: { ...authHeader() },
                body: formData,
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Nepodarilo sa nahrať");
            this.setState({ uploadingStudentList: false, selectedStudentFile: null });
            this.showMessage(result.message, "success");
            e.target.reset();
            this.fetchAllowedStudents();
        } catch (error) {
            this.setState({ uploadingStudentList: false });
            this.showMessage(error.toString(), "error");
        }
    };
    async fetchAllowedStudents() {
        try {
            const res = await fetch(`${API_URL}/api/allowed-students`, { headers: authHeader() });
            if (!res.ok) throw new Error();
            const allowedStudents = await res.json();
            this.setState({ allowedStudents });
        } catch {
            this.showMessage("Nepodarilo sa načítať povolených študentov.", "error");
        }
    }
    handleAllowedStudentEmailChange = (e) => {
        this.setState({ newAllowedStudentEmail: e.target.value });
    };
    handleAddAllowedStudent = async (e) => {
        e.preventDefault();
        const { newAllowedStudentEmail, allowedStudents } = this.state;
        if (!newAllowedStudentEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAllowedStudentEmail)) {
            this.showMessage("Zadajte platný e-mail.", "error");
            return;
        }
        if (allowedStudents.some((s) => s.email.toLowerCase() === newAllowedStudentEmail.toLowerCase())) {
            this.showMessage("Tento e-mail je už v zozname.", "error");
            return;
        }
        this.setState({ addingAllowedStudent: true });
        try {
            const res = await fetch(`${API_URL}/api/allowed-students`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeader() },
                body: JSON.stringify({ email: newAllowedStudentEmail }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Nepodarilo sa pridať povoleného študenta");
            }
            this.setState({ newAllowedStudentEmail: "" });
            this.showMessage("Študent pridaný do zoznamu povolených.", "success");
            this.fetchAllowedStudents();
        } catch (error) {
            this.showMessage(error.message, "error");
        } finally {
            this.setState({ addingAllowedStudent: false });
        }
    };
    async handleDeleteAllowedStudent(email) {
        this.setState({ deletingAllowedStudentEmail: email });
        try {
            const res = await fetch(`${API_URL}/api/allowed-students?email=${encodeURIComponent(email)}`, {
                method: "DELETE",
                headers: authHeader(),
            });
            let message = "Študent odstránený zo zoznamu povolených.";
            if (res.status !== 204) {
                const data = await res.json();
                message = data.message || message;
            }
            if (!res.ok) throw new Error(message);
            this.showMessage(message, "success");
            await this.fetchAllowedStudents();
        } catch (error) {
            this.showMessage(error.message, "error");
        } finally {
            this.setState({ deletingAllowedStudentEmail: null });
        }
    }
    async fetchStudentGrades() {
        this.setState({ gradesLoading: true });
        try {
            const res = await fetch(`${API_URL}/api/grades/summary`, {
                headers: authHeader(),
            });
            if (!res.ok) throw new Error("Nepodarilo sa načítať hodnotenia.");
            const data = await res.json();
            this.setState({ studentGrades: data, gradesLoading: false });
        } catch (error) {
            this.showMessage("Chyba pri načítaní hodnotení študentov.", "error");
            this.setState({ gradesLoading: false });
        }
    }
    async fetchCalendarEvents() {
        try {
            const res = await fetch(`${API_URL}/api/calendar-events`, { headers: authHeader() });
            if (!res.ok) throw new Error();
            const calendarEvents = await res.json();
            this.setState({ calendarEvents });
        } catch {
            this.showMessage("Nepodarilo sa načítať udalosti v kalendári.", "error");
        }
    }
    handleAddEvent = async (e) => {
        e.preventDefault();
        const { newEvent } = this.state;
        if (!newEvent.date || !newEvent.message) {
            this.showMessage("Prosím, vyberte dátum a zadajte správu.", "error");
            return;
        }
        this.setState({ addingEvent: true });
        try {
            await fetch(`${API_URL}/api/calendar-events`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeader() },
                body: JSON.stringify({
                    eventDate: newEvent.date,
                    message: newEvent.message,
                }),
            });
            this.fetchCalendarEvents();
            this.setState({ newEvent: { date: "", message: "" } });
            this.showMessage("Udalosť v kalendári úspešne pridaná!", "success");
        } catch {
            this.showMessage("Nepodarilo sa pridať udalosť v kalendári.", "error");
        } finally {
            this.setState({ addingEvent: false });
        }
    };
    async handleDeleteEvent(eventId) {
        this.setState({ deletingEventId: eventId });
        try {
            await fetch(`${API_URL}/api/calendar-events/${eventId}`, {
                method: "DELETE",
                headers: authHeader(),
            });
            this.fetchCalendarEvents();
            this.showMessage("Udalosť odstránená.", "success");
        } catch {
            this.showMessage("Nepodarilo sa odstrániť udalosť.", "error");
        } finally {
            this.setState({ deletingEventId: null });
        }
    }
    async fetchTests() {
        try {
            const res = await fetch(`${API_URL}/api/tests`, { headers: authHeader() });
            if (!res.ok) throw new Error();
            const tests = await res.json();
            this.setState({ tests });
        } catch {
            this.showMessage("Nepodarilo sa načítať testy.", "error");
        }
    }
    openTestCreation = () => {
        this.setState({
            creatingTest: true,
            newTest: { title: "" },
            newTestQuestions: [
                { question: "", type: "CLOSED", points: 1, answers: [{ text: "", pointsWeight: 1 }, { text: "", pointsWeight: 0 }] }
            ]
        });
    };
    addQuestion = () => {
        this.setState((prev) => ({
            newTestQuestions: [
                ...prev.newTestQuestions,
                { question: "", type: "CLOSED", points: 1, answers: [{ text: "", pointsWeight: 1 }, { text: "", pointsWeight: 0 }] }
            ]
        }));
    };
    updateQuestion = (idx, field, value) => {
        const questions = [...this.state.newTestQuestions];
        questions[idx][field] = value;
        this.setState({ newTestQuestions: questions });
    };
    updateAnswer = (qIdx, aIdx, field, value) => {
        const questions = [...this.state.newTestQuestions];
        questions[qIdx].answers[aIdx][field] = value;
        this.setState({ newTestQuestions: questions });
    };
    addAnswer = (qIdx) => {
        const questions = [...this.state.newTestQuestions];
        questions[qIdx].answers.push({ text: "", pointsWeight: 0 });
        this.setState({ newTestQuestions: questions });
    };
    removeAnswer = (qIdx, aIdx) => {
        const questions = [...this.state.newTestQuestions];
        questions[qIdx].answers.splice(aIdx, 1);
        this.setState({ newTestQuestions: questions });
    };
    saveTest = async (e) => {
        e.preventDefault();
        const { newTest, newTestQuestions } = this.state;
        const payload = {
            title: newTest.title,
            questions: newTestQuestions.map(q => ({
                question: q.question,
                type: q.type,
                points: q.points,
                answers: q.answers.map(a => ({
                    text: a.text,
                    pointsWeight: a.pointsWeight
                }))
            }))
        };
        try {
            await fetch(`${API_URL}/api/tests`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeader() },
                body: JSON.stringify(payload),
            });
            this.setState({ creatingTest: false });
            this.fetchTests();
            this.showMessage("Test bol úspešne vytvorený!", "success");
        } catch {
            this.showMessage("Nepodarilo sa vytvoriť test.", "error");
        }
    };
    async handleDeleteTest(testId) {
        try {
            await fetch(`${API_URL}/api/tests/${testId}`, {
                method: "DELETE",
                headers: authHeader(),
            });
            this.fetchTests();
            this.showMessage("Test odstránený.", "success");
        } catch {
            this.showMessage("Nepodarilo sa odstrániť test.", "error");
        }
    }
    async openEditTest(test) {
        try {
            const response = await fetch(`${API_URL}/api/tests/${test.id}`, {
                headers: authHeader()
            });
            if (!response.ok) {
                throw new Error("Nepodarilo sa načítať detaily testu.");
            }
            const testDetails = await response.json();
            const mappedQuestions = testDetails.questions.map(q => ({
                questionId: q.questionId,
                question: q.question,
                type: q.type || "CLOSED",
                points: q.points || 1,
                answers: q.answers.map(a => ({
                    answerId: a.answerId,
                    text: a.text,
                    pointsWeight: a.pointsWeight || 0
                }))
            }));
            this.setState({
                editingTestId: testDetails.id,
                editingTest: { title: testDetails.title },
                editingTestQuestions: mappedQuestions,
                creatingTest: false,
                message: { text: "", type: "" }
            });
        } catch (error) {
            this.showMessage("Chyba pri načítaní testu: " + error.message, "error");
        }
    }
    updateEditQuestion = (idx, field, value) => {
        const questions = [...this.state.editingTestQuestions];
        questions[idx][field] = value;
        this.setState({ editingTestQuestions: questions });
    };
    updateEditAnswer = (qIdx, aIdx, field, value) => {
        this.setState(prevState => {
            const newQuestions = [...prevState.editingTestQuestions];
            newQuestions[qIdx].answers[aIdx] = {
                ...newQuestions[qIdx].answers[aIdx],
                [field]: value
            };
            return { editingTestQuestions: newQuestions };
        });
    };
    addEditAnswer = (qIdx) => {
        const questions = [...this.state.editingTestQuestions];
        questions[qIdx].answers.push({ text: '', pointsWeight: 0 });
        this.setState({ editingTestQuestions: questions });
    };
    removeEditAnswer = (qIdx, aIdx) => {
        const questions = [...this.state.editingTestQuestions];
        questions[qIdx].answers.splice(aIdx, 1);
        this.setState({ editingTestQuestions: questions });
    };
    saveEditTest = async (e) => {
        e.preventDefault();
        const { editingTestId, editingTest, editingTestQuestions } = this.state;
        const payload = {
            title: editingTest.title,
            questions: editingTestQuestions.map(q => ({
                question: q.question,
                type: q.type,
                points: q.points,
                answers: q.answers.map(a => ({ text: a.text, pointsWeight: a.pointsWeight }))
            }))
        };
        try {
            const response = await fetch(`${API_URL}/api/tests/${editingTestId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeader()
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Nepodarilo sa uložiť zmeny.");
            }
            this.showMessage("Test bol úspešne upravený.", "success");
            this.cancelEditTest();
            this.fetchTests();
        } catch (error) {
            this.showMessage("Chyba pri ukladaní zmien: " + error.message, "error");
        }
    };
    cancelEditTest = () => {
        this.setState({
            editingTestId: null,
            editingTest: { title: '' },
            editingTestQuestions: []
        });
    };
    render() {
        const {
            currentPage,
            message,
            users,
            materials,
            newMaterial,
            uploadingStudentList,
            allowedStudents,
            newAllowedStudentEmail,
            addingAllowedStudent,
            deletingAllowedStudentEmail,
            calendarEvents,
            newEvent,
            addingEvent,
            deletingEventId,
            tests,
            newTest,
            creatingTest,
            newTestQuestions,
            editingTestId,
            editingTest,
            editingTestQuestions,
            studentGrades,
            gradesLoading,
            gradesViewMode,
            isSidebarOpen,
        } = this.state;
        const roles = ["admin", "user"];
        const filteredLectures = materials.filter((m) => m.type === "lecture");
        const filteredSeminars = materials.filter((m) => m.type === "seminar");
        const beigeTextColor = "#F5F5DC";
        return (
            <div className="relative flex min-h-screen bg-slate-900 font-sans text-slate-200">
                <aside
                    className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-800/80 flex flex-col p-4 border-r border-slate-700 shadow-xl
                           transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 
                           ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                >
                    <div className="text-2xl font-bold mb-8 text-center" style={{ color: beigeTextColor }}>
                        Administrácia
                    </div>
                    <nav className="flex-grow space-y-2">
                        <button
                            onClick={() => { this.setCurrentPage("user-management"); this.setState({ isSidebarOpen: false }); }}
                            className={`w-full text-left flex items-center p-3 rounded-lg transition-all duration-200 font-medium ${currentPage === "user-management" ? "bg-blue-600 shadow-lg text-white" : "hover:bg-slate-700/70 text-slate-300"}`}
                        >
                            <UserIcon className="mr-3 text-current" /> Používatelia
                        </button>
                        <button
                            onClick={() => { this.setCurrentPage("material-management"); this.setState({ isSidebarOpen: false }); }}
                            className={`w-full text-left flex items-center p-3 rounded-lg transition-all duration-200 font-medium ${currentPage === "material-management" ? "bg-blue-600 shadow-lg text-white" : "hover:bg-slate-700/70 text-slate-300"}`}
                        >
                            <BookOpenIcon className="mr-3 text-current" /> Materiály
                        </button>
                        <button
                            onClick={() => { this.setCurrentPage("test-management"); this.setState({ isSidebarOpen: false }); }}
                            className={`w-full text-left flex items-center p-3 rounded-lg transition-all duration-200 font-medium ${currentPage === "test-management" ? "bg-blue-600 shadow-lg text-white" : "hover:bg-slate-700/70 text-slate-300"}`}
                        >
                            <TestIcon className="mr-3 text-current" /> Testy
                        </button>
                        <button onClick={() => { this.setCurrentPage("student-grades"); this.setState({ isSidebarOpen: false }); }} className={`w-full text-left flex items-center p-3 rounded-lg transition-all duration-200 font-medium ${currentPage === "student-grades" ? "bg-blue-600 shadow-lg text-white" : "hover:bg-slate-700/70 text-slate-300"}`}>
                            <GraduationCap className="mr-3 text-current" /> Hodnotenie
                        </button>
                        <button
                            onClick={() => { this.setCurrentPage("calendar-management"); this.setState({ isSidebarOpen: false }); }}
                            className={`w-full text-left flex items-center p-3 rounded-lg transition-all duration-200 font-medium ${currentPage === "calendar-management" ? "bg-blue-600 shadow-lg text-white" : "hover:bg-slate-700/70 text-slate-300"}`}
                        >
                            <CalendarIcon className="mr-3 text-current" /> Udalosti
                        </button>
                        <button
                            onClick={() => { this.setCurrentPage("student-list-upload"); this.setState({ isSidebarOpen: false }); }}
                            className={`w-full text-left flex items-center p-3 rounded-lg transition-all duration-200 font-medium ${currentPage === "student-list-upload" ? "bg-blue-600 shadow-lg text-white" : "hover:bg-slate-700/70 text-slate-300"}`}
                        >
                            <UploadIcon className="mr-3 text-current" /> Zoznam študentov
                        </button>
                    </nav>
                    <div className="mt-auto text-sm text-slate-400 mb-2 text-center">Prihlásený ako: Admin</div>
                </aside>
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 z-20 md:hidden"
                        onClick={() => this.setState({ isSidebarOpen: false })}
                    ></div>
                )}
                <div className="flex flex-col flex-1 w-full min-w-0">
                    <header className="sticky top-0 bg-slate-800/50 backdrop-blur-sm p-4 border-b border-slate-700 md:hidden z-10 flex items-center">
                        <button onClick={() => this.setState({ isSidebarOpen: true })} className="text-slate-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="text-xl font-bold ml-4" style={{ color: beigeTextColor }}>
                            Administrácia
                        </h1>
                    </header>
                    <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
                        {message.text && (
                            <div
                                className={`p-4 mb-6 rounded-lg text-sm font-medium shadow-md ${message.type === "success"
                                    ? "bg-green-900 text-green-300"
                                    : message.type === "error"
                                        ? "bg-red-900 text-red-300"
                                        : "bg-blue-900 text-blue-300"
                                }`}
                            >
                                {message.text}
                            </div>
                        )}
                        {}
                        {currentPage === "user-management" && (
                            <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-lg p-8">
                                <h2 className="text-3xl font-bold mb-6 text-blue-400">Správa používateľov</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-slate-800 rounded-lg overflow-hidden">
                                        <thead>
                                        <tr className="border-b border-slate-700">
                                            <th className="px-4 py-2 text-left text-slate-300">Používateľské meno</th>
                                            <th className="px-4 py-2 text-left text-slate-300">E-mail</th>
                                            <th className="px-4 py-2 text-left text-slate-300">Rola</th>
                                            <th className="px-4 py-2 text-left text-slate-300">Akcie</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id} className="border-b border-slate-700">
                                                <td className="px-4 py-2">{user.username}</td>
                                                <td className="px-4 py-2">{user.email}</td>
                                                <td className="px-4 py-2">
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => this.handleRoleChange(user.id, e.target.value)}
                                                        className="bg-slate-700 text-slate-200 rounded-lg px-2 py-1"
                                                    >
                                                        {roles.map((role) => (
                                                            <option key={role} value={role}>
                                                                {role}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <button
                                                        onClick={() => this.handleDeleteUser(user.id)}
                                                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg flex items-center transition-all duration-200 shadow-md hover:shadow-lg"
                                                    >
                                                        <TrashIcon className="w-4 h-4 mr-1" /> Odstrániť
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        )}
                        {currentPage === "student-grades" && (
                            <section className="backdrop-blur-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-3xl font-bold text-blue-400">Výsledky</h2>
                                    <div className="bg-slate-800 p-1 rounded-lg flex space-x-1">
                                        <button onClick={() => this.setState({ gradesViewMode: 'cards' })} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${gradesViewMode === 'cards' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}>Karty</button>
                                        <button onClick={() => this.setState({ gradesViewMode: 'table' })} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${gradesViewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}>Tabuľka</button>
                                    </div>
                                </div>
                                {gradesLoading ? (
                                    <p className="text-slate-400">Načítavam hodnotenia...</p>
                                ) : (
                                    <>
                                        {gradesViewMode === 'cards' && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {studentGrades.studentGrades.map(student => {
                                                    const scoresArray = Object.values(student.scores);
                                                    const totalPoints = scoresArray.reduce((sum, score) => sum + score, 0);
                                                    const averageScore = scoresArray.length > 0 ? (totalPoints / scoresArray.length).toFixed(1) : 'N/A';
                                                    return (
                                                        <div key={student.id} className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-6 transition-all hover:border-blue-500/50">
                                                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-700">
                                                                <div className="flex items-center">
                                                                    <UserCircleIcon className="w-10 h-10 text-slate-400 mr-4" />
                                                                    <div>
                                                                        <p className="font-bold text-white">{student.username}</p>
                                                                        <p className="text-sm text-slate-400">{student.email}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-sm text-blue-400 font-semibold">Priemerné skóre</p>
                                                                    <p className="text-2xl font-bold text-white">{averageScore}</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-bold uppercase text-slate-500 mb-3">Výsledky testov</h4>
                                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                                    {studentGrades.tests.map(test => {
                                                                        const score = student.scores[test.id];
                                                                        const maxScore = test.maxScore;
                                                                        const percentage = maxScore > 0 && score !== undefined ? (score / maxScore) * 100 : 0;
                                                                        const getProgressColor = (percent) => {
                                                                            if (percent >= 90) return 'bg-green-500';
                                                                            if (percent >= 75) return 'bg-lime-500';
                                                                            if (percent >= 50) return 'bg-yellow-500';
                                                                            return 'bg-red-500';
                                                                        }
                                                                        return (
                                                                            <div key={test.id} className="bg-slate-700/50 p-3 rounded-lg text-center">
                                                                                <p className="text-xs text-slate-400 truncate" title={test.title}>{test.title}</p>
                                                                                <p className="text-xl font-bold mt-2 text-white">
                                                                                    {score !== undefined ? (<>{score}<span className="text-sm text-slate-400"> / {maxScore}</span></>) : '—'}
                                                                                </p>
                                                                                <div className="w-full bg-slate-600 rounded-full h-1.5 mt-2">
                                                                                    {score !== undefined && <div className={`${getProgressColor(percentage)} h-1.5 rounded-full`} style={{ width: `${percentage}%` }}></div>}
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                        {gradesViewMode === 'table' && (
                                            <div className="overflow-x-auto bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-1">
                                                <table className="min-w-full">
                                                    <thead>
                                                    <tr className="border-b border-slate-700">
                                                        <th className="px-4 py-3 text-left text-slate-300 font-semibold sticky left-0 bg-slate-800 z-10">Študent</th>
                                                        {studentGrades.tests.map(test => (
                                                            <th key={test.id} className="px-4 py-3 text-center text-slate-300 font-semibold" title={test.title}>{test.title}</th>
                                                        ))}
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {studentGrades.studentGrades.map(student => (
                                                        <tr key={student.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                                            <td className="px-4 py-3 font-medium sticky left-0 bg-slate-800 hover:bg-slate-700/50 z-10">
                                                                <p className="text-white">{student.username}</p>
                                                                <p className="text-xs text-slate-400">{student.email}</p>
                                                            </td>
                                                            {studentGrades.tests.map(test => (
                                                                <td key={test.id} className="px-4 py-3 text-center">
                                                                    {student.scores[test.id] !== undefined ?
                                                                        <span>{student.scores[test.id]} <span className="text-slate-400">/ {test.maxScore}</span></span>
                                                                        : '—'}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </>
                                )}
                            </section>
                        )}
                        {currentPage === "material-management" && (
                            <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-lg p-8">
                                <h2 className="text-3xl font-bold mb-6 text-blue-400">Správa materiálov</h2>
                                <div className="mb-10 p-6 border border-slate-700 rounded-xl bg-slate-900/50">
                                    <h3 className="text-2xl font-semibold mb-4 flex items-center" style={{ color: beigeTextColor }}>
                                        <UploadIcon className="mr-2 text-blue-400" /> Pridať nový materiál
                                    </h3>
                                    <form onSubmit={this.handleAddMaterial} className="space-y-4" encType="multipart/form-data">
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Názov"
                                                value={newMaterial.title}
                                                onChange={(e) =>
                                                    this.setState({ newMaterial: { ...newMaterial, title: e.target.value } })
                                                }
                                                className="w-full px-4 py-2 rounded-lg border bg-slate-700 border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <select
                                                value={newMaterial.type}
                                                onChange={(e) =>
                                                    this.setState({ newMaterial: { ...newMaterial, type: e.target.value } })
                                                }
                                                className="w-full px-4 py-2 rounded-lg border bg-slate-700 border-slate-600 text-slate-100"
                                            >
                                                <option value="lecture">Prednáška</option>
                                                <option value="seminar">Seminár</option>
                                            </select>
                                        </div>
                                        <div>
                                            <input
                                                type="file"
                                                name="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={(e) =>
                                                    this.setState({ newMaterial: { ...newMaterial, file: e.target.files[0] } })
                                                }
                                                className="w-full text-slate-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-200 shadow-md hover:shadow-lg"
                                        >
                                            <PlusCircleIcon className="w-5 h-5 mr-2" /> Pridať materiál
                                        </button>
                                    </form>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-6 border border-slate-700 rounded-xl bg-slate-900/50">
                                        <h4 className="text-lg font-semibold mb-4 text-blue-400">Prednášky</h4>
                                        <ul className="space-y-2">
                                            {filteredLectures.length === 0 ? (
                                                <li className="text-slate-400">Zatiaľ žiadne prednášky.</li>
                                            ) : (
                                                filteredLectures.map((material) => (
                                                    <li key={material.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg shadow-sm border border-slate-700">
                                                        <span className="text-slate-100">{material.title}</span>
                                                        <div className="flex items-center space-x-2">
                                                            <a
                                                                href={material.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="bg-blue-600 text-white font-semibold py-1 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                                            >
                                                                Stiahnuť
                                                            </a>
                                                            <button
                                                                onClick={() => this.handleDeleteMaterial(material.id)}
                                                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg flex items-center transition-all duration-200 shadow-sm hover:shadow-md"
                                                            >
                                                                <TrashIcon className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </li>
                                                ))
                                            )}
                                        </ul>
                                    </div>
                                    <div className="p-6 border border-slate-700 rounded-xl bg-slate-900/50">
                                        <h4 className="text-lg font-semibold mb-4 text-blue-400">Semináre</h4>
                                        <ul className="space-y-2">
                                            {filteredSeminars.length === 0 ? (
                                                <li className="text-slate-400">Zatiaľ žiadne semináre.</li>
                                            ) : (
                                                filteredSeminars.map((material) => (
                                                    <li key={material.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg shadow-sm border border-slate-700">
                                                        <span className="text-slate-100">{material.title}</span>
                                                        <div className="flex items-center space-x-2">
                                                            <a
                                                                href={material.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="bg-blue-600 text-white font-semibold py-1 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                                            >
                                                                Stiahnuť
                                                            </a>
                                                            <button
                                                                onClick={() => this.handleDeleteMaterial(material.id)}
                                                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg flex items-center transition-all duration-200 shadow-sm hover:shadow-md"
                                                            >
                                                                <TrashIcon className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </li>
                                                ))
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </section>
                        )}
                        {currentPage === "calendar-management" && (
                            <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-lg p-8">
                                <h2 className="text-3xl font-bold mb-6 text-blue-400">Správa udalostí</h2>
                                <form onSubmit={this.handleAddEvent} className="flex flex-col sm:flex-row gap-4 mb-8">
                                    <input
                                        type="date"
                                        value={newEvent.date}
                                        onChange={(e) =>
                                            this.setState({ newEvent: { ...newEvent, date: e.target.value } })
                                        }
                                        className="px-4 py-2 rounded-lg border bg-slate-700 border-slate-600 text-slate-100"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Správa udalosti"
                                        value={newEvent.message}
                                        onChange={(e) =>
                                            this.setState({ newEvent: { ...newEvent, message: e.target.value } })
                                        }
                                        className="px-4 py-2 rounded-lg border bg-slate-700 border-slate-600 text-slate-100 flex-1"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={addingEvent}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <PlusCircleIcon className="w-5 h-5 mr-2" />
                                        {addingEvent ? "Pridávanie..." : "Pridať udalosť"}
                                    </button>
                                </form>
                                <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600">
                                    <h3 className="font-bold text-blue-400 mb-2">Nadchádzajúce udalosti:</h3>
                                    <ul className="space-y-2">
                                        {calendarEvents.length === 0 ? (
                                            <li className="text-slate-400">Žiadne udalosti.</li>
                                        ) : (
                                            calendarEvents
                                                .filter(ev => ev.eventDate)
                                                .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
                                                .map(ev => {
                                                    const dateParts = ev.eventDate.split("-");
                                                    const localDate =
                                                        dateParts.length === 3
                                                            ? new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
                                                            : new Date(NaN);
                                                    return (
                                                        <li
                                                            key={ev.id}
                                                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg transition-all duration-200 bg-blue-900/20 border-l-4 border-blue-500"
                                                        >
                                                            <div>
                                <span className="font-bold text-blue-400">
                                  {isNaN(localDate)
                                      ? "Neplatný dátum"
                                      : localDate.toLocaleDateString("sk-SK", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                      })}
                                </span>
                                                                <span className="ml-2 text-sm text-gray-100">{ev.message}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => this.handleDeleteEvent(ev.id)}
                                                                disabled={deletingEventId === ev.id}
                                                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-3 rounded-lg flex items-center text-sm transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 mt-2 sm:mt-0"
                                                            >
                                                                <TrashIcon className="w-4 h-4 mr-1" />
                                                                {deletingEventId === ev.id ? "Odstraňovanie..." : "Odstrániť"}
                                                            </button>
                                                        </li>
                                                    );
                                                })
                                        )}
                                    </ul>
                                </div>
                            </section>
                        )}
                        {currentPage === "student-list-upload" && (
                            <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-lg p-8">
                                <h2 className="text-3xl font-bold mb-6 text-blue-400">Nahrať zoznam študentov</h2>
                                <p className="text-slate-300 mb-6">
                                    Nahrajte PDF súbor obsahujúci zoznam študentov povolených na registráciu, alebo spravujte zoznam manuálne nižšie.
                                </p>
                                <form
                                    onSubmit={this.handleStudentListUpload}
                                    className="space-y-4"
                                    encType="multipart/form-data"
                                >
                                    <div>
                                        <label className="block text-slate-300 text-sm font-semibold mb-2">
                                            Vyberte PDF súbor
                                        </label>
                                        <input
                                            type="file"
                                            name="studentFile"
                                            accept=".pdf"
                                            onChange={this.handleStudentFileChange}
                                            className="w-full text-slate-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!this.state.selectedStudentFile || uploadingStudentList}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {uploadingStudentList ? (
                                            <>
                                                <UploadIcon className="w-5 h-5 mr-2 animate-spin" /> Nahráva sa...
                                            </>
                                        ) : (
                                            <>
                                                <UploadIcon className="w-5 h-5 mr-2" /> Nahrať
                                            </>
                                        )}
                                    </button>
                                </form>
                                <div className="mt-10">
                                    <h3 className="text-2xl font-semibold mb-4 flex items-center" style={{ color: beigeTextColor }}>
                                        <PlusCircleIcon className="mr-2 text-blue-400" /> Manuálne pridať povoleného študenta
                                    </h3>
                                    <form
                                        onSubmit={this.handleAddAllowedStudent}
                                        className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6"
                                    >
                                        <input
                                            type="email"
                                            placeholder="Zadajte e-mail študenta"
                                            value={newAllowedStudentEmail}
                                            onChange={this.handleAllowedStudentEmailChange}
                                            className="px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100 flex-1 bg-slate-700"
                                            required
                                        />
                                        <button
                                            type="submit"
                                            disabled={addingAllowedStudent}
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <PlusCircleIcon className="w-5 h-5 mr-2" />
                                            {addingAllowedStudent ? "Pridávanie..." : "Pridať"}
                                        </button>
                                    </form>
                                    <h4 className="text-lg font-semibold mb-2 text-blue-400">Zoznam povolených študentov</h4>
                                    {allowedStudents.length === 0 ? (
                                        <p className="text-slate-400">Zatiaľ žiadni povolení študenti.</p>
                                    ) : (
                                        <ul className="space-y-2">
                                            {allowedStudents.map((student) => (
                                                <li
                                                    key={student.id}
                                                    className="flex items-center justify-between p-3 bg-slate-800 rounded-lg shadow-sm border border-slate-700"
                                                >
                                                    <span className="text-slate-100">{student.email}</span>
                                                    <button
                                                        onClick={() => this.handleDeleteAllowedStudent(student.email)}
                                                        disabled={deletingAllowedStudentEmail === student.email}
                                                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-3 rounded-lg flex items-center text-sm transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
                                                    >
                                                        <TrashIcon className="w-4 h-4 mr-1" />
                                                        {deletingAllowedStudentEmail === student.email ? "Odstraňovanie..." : "Odstrániť"}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </section>
                        )}
                        {currentPage === "test-management" && (
                            <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-lg p-8">
                                <h2 className="text-3xl font-bold mb-6 text-blue-400">Správa testov</h2>
                                {}
                                <div className="mb-10 p-6 border border-slate-700 rounded-xl bg-slate-900/50">
                                    <h3 className="text-2xl font-semibold mb-4 flex items-center" style={{ color: "#F5F5DC" }}>
                                        <PlusCircleIcon className="mr-2 text-blue-400" /> Pridať nový test
                                    </h3>
                                    {!creatingTest ? (
                                        <button
                                            onClick={this.openTestCreation}
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center mb-6"
                                        >
                                            <PlusCircleIcon className="w-5 h-5 mr-2" /> Pridať nový test
                                        </button>
                                    ) : (
                                        <form onSubmit={this.saveTest} className="space-y-6 bg-slate-900 p-6 rounded-xl border border-slate-700">
                                            <input
                                                type="text"
                                                placeholder="Názov testu"
                                                value={newTest.title}
                                                onChange={(e) => this.setState({ newTest: { ...newTest, title: e.target.value } })}
                                                className="w-full px-4 py-2 rounded-lg border bg-slate-700 border-slate-600 text-slate-100 mb-4 font-bold text-lg"
                                                required
                                            />
                                            {newTestQuestions.map((q, qIdx) => (
                                                <div key={qIdx} className="mb-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
                                                    <div className="flex items-center space-x-4 mb-4">
                                                        <input
                                                            type="text"
                                                            placeholder={`Otázka ${qIdx + 1}`}
                                                            value={q.question}
                                                            onChange={(e) => this.updateQuestion(qIdx, "question", e.target.value)}
                                                            className="flex-grow px-3 py-2 rounded border bg-slate-700 border-slate-600 text-slate-100"
                                                            required
                                                        />
                                                        <select
                                                            value={q.type}
                                                            onChange={(e) => this.updateQuestion(qIdx, "type", e.target.value)}
                                                            className="px-3 py-2 rounded border bg-slate-700 border-slate-600 text-slate-100"
                                                        >
                                                            <option value="CLOSED">Zatvorená (Výber z možností)</option>
                                                            <option value="OPEN">Otvorená (Textová odpoveď)</option>
                                                        </select>
                                                    </div>
                                                    <div className="pl-4 border-l-2 border-blue-500">
                                                        <p className="text-xs text-slate-400 uppercase font-bold mb-2">
                                                            {q.type === 'OPEN' ? 'Kľúčové slová a bodovanie' : 'Možnosti a bodovanie'}
                                                        </p>
                                                        {q.answers.map((ans, aIdx) => (
                                                            <div key={aIdx} className="flex items-center mb-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder={q.type === 'OPEN' ? `Kľúčové slovo ${aIdx + 1}` : `Možnosť ${aIdx + 1}`}
                                                                    value={ans.text}
                                                                    onChange={(e) => this.updateAnswer(qIdx, aIdx, "text", e.target.value)}
                                                                    className="px-2 py-1 rounded border bg-slate-700 border-slate-600 text-slate-100 mr-2 flex-grow"
                                                                    required
                                                                />
                                                                <input
                                                                    type="number"
                                                                    placeholder="Body"
                                                                    value={ans.pointsWeight}
                                                                    onChange={(e) => this.updateAnswer(qIdx, aIdx, "pointsWeight", parseInt(e.target.value, 10) || 0)}
                                                                    className="w-20 px-2 py-1 rounded border bg-slate-700 border-slate-600 text-slate-100 text-center mr-2"
                                                                    required
                                                                />
                                                                <span className="text-slate-300 text-sm w-12">bodov</span>
                                                                {q.answers.length > 1 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => this.removeAnswer(qIdx, aIdx)}
                                                                        className="ml-2 text-red-400 hover:text-red-300"
                                                                    >
                                                                        Odstrániť
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                        <button type="button" onClick={() => this.addAnswer(qIdx)} className="text-blue-400 hover:text-blue-300 mt-2 text-sm font-bold">
                                                            + Pridať {q.type === 'OPEN' ? 'kľúčové slovo' : 'odpoveď'}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            <button type="button" onClick={this.addQuestion} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold">
                                                + Pridať ďalšiu otázku
                                            </button>
                                            <div className="flex space-x-4 mt-6 border-t border-slate-700 pt-6">
                                                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold">
                                                    Uložiť test
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => this.setState({ creatingTest: false })}
                                                    className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-bold"
                                                >
                                                    Zrušiť
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                                {}
                                {editingTestId && (
                                    <div className="mb-10 p-6 border border-slate-700 rounded-xl bg-slate-900/50">
                                        <h3 className="text-2xl font-semibold mb-4 flex items-center" style={{ color: "#F5F5DC" }}>
                                            Upraviť test
                                        </h3>
                                        <form onSubmit={this.saveEditTest} className="space-y-6 bg-slate-900 p-6 rounded-xl border border-slate-700">
                                            <input
                                                type="text"
                                                placeholder="Názov testu"
                                                value={editingTest.title}
                                                onChange={(e) => this.setState({ editingTest: { ...editingTest, title: e.target.value } })}
                                                className="w-full px-4 py-2 rounded-lg border bg-slate-700 border-slate-600 text-slate-100 mb-4 font-bold text-lg"
                                                required
                                            />
                                            {editingTestQuestions.map((q, qIdx) => (
                                                <div key={q.questionId || qIdx} className="mb-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
                                                    <div className="flex items-center space-x-4 mb-4">
                                                        <input
                                                            type="text"
                                                            placeholder={`Otázka ${qIdx + 1}`}
                                                            value={q.question}
                                                            onChange={(e) => this.updateEditQuestion(qIdx, "question", e.target.value)}
                                                            className="flex-grow px-3 py-2 rounded border bg-slate-700 border-slate-600 text-slate-100"
                                                            required
                                                        />
                                                        <select
                                                            value={q.type}
                                                            onChange={(e) => this.updateEditQuestion(qIdx, "type", e.target.value)}
                                                            className="px-3 py-2 rounded border bg-slate-700 border-slate-600 text-slate-100"
                                                        >
                                                            <option value="CLOSED">Zatvorená (Výber z možností)</option>
                                                            <option value="OPEN">Otvorená (Textová odpoveď)</option>
                                                        </select>
                                                    </div>
                                                    <div className="pl-4 border-l-2 border-blue-500">
                                                        <p className="text-xs text-slate-400 uppercase font-bold mb-2">
                                                            {q.type === 'OPEN' ? 'Kľúčové slová a bodovanie' : 'Možnosti a bodovanie'}
                                                        </p>
                                                        {q.answers.map((ans, aIdx) => (
                                                            <div key={ans.answerId || aIdx} className="flex items-center mb-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder={q.type === 'OPEN' ? `Kľúčové slovo ${aIdx + 1}` : `Možnosť ${aIdx + 1}`}
                                                                    value={ans.text}
                                                                    onChange={(e) => this.updateEditAnswer(qIdx, aIdx, "text", e.target.value)}
                                                                    className="px-2 py-1 rounded border bg-slate-700 border-slate-600 text-slate-100 mr-2 flex-grow"
                                                                    required
                                                                />
                                                                <input
                                                                    type="number"
                                                                    placeholder="Body"
                                                                    value={ans.pointsWeight}
                                                                    onChange={(e) => this.updateEditAnswer(qIdx, aIdx, "pointsWeight", parseInt(e.target.value, 10) || 0)}
                                                                    className="w-20 px-2 py-1 rounded border bg-slate-700 border-slate-600 text-slate-100 text-center mr-2"
                                                                    required
                                                                />
                                                                <span className="text-slate-300 text-sm w-12">bodov</span>
                                                                {q.answers.length > 1 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => this.removeEditAnswer(qIdx, aIdx)}
                                                                        className="ml-2 text-red-400 hover:text-red-300"
                                                                    >
                                                                        Odstrániť
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                        <button type="button" onClick={() => this.addEditAnswer(qIdx)} className="text-blue-400 hover:text-blue-300 mt-2 text-sm font-bold">
                                                            + Pridať {q.type === 'OPEN' ? 'kľúčové slovo' : 'odpoveď'}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="flex space-x-4 mt-6 border-t border-slate-700 pt-6">
                                                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold">
                                                    Uložiť zmeny
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={this.cancelEditTest}
                                                    className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-bold"
                                                >
                                                    Zrušiť
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                                {}
                                <div className="p-6 border border-slate-700 rounded-xl bg-slate-900/50">
                                    <h4 className="text-lg font-semibold mb-4 text-blue-400">Existujúce testy</h4>
                                    <ul className="space-y-2">
                                        {tests.length === 0 ? (
                                            <li className="text-slate-400">Zatiaľ žiadne testy.</li>
                                        ) : (
                                            tests.map((test) => (
                                                <li key={test.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg shadow-sm border border-slate-700">
                                                    <span className="text-slate-100">{test.title}</span>
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => this.openEditTest(test)}
                                                            className="bg-green-600 text-white font-semibold py-1 px-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
                                                        >
                                                            Upraviť
                                                        </button>
                                                        <button
                                                            onClick={() => this.handleDeleteTest(test.id)}
                                                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg flex items-center transition-all duration-200 shadow-sm hover:shadow-md"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                </div>
                            </section>
                        )}
                    </main>
                </div>
            </div>
        );
    }
}