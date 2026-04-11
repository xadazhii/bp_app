import { UserManagement } from './admin/UserManagement';
import { TestManagement } from './admin/TestManagement';
import { MaterialManagement } from './admin/MaterialManagement';
import { StudentListUpload } from './admin/StudentListUpload';
import { CalendarManagement } from './admin/CalendarManagement';
import { StudentGrades } from './admin/StudentGrades';
import { SemesterSettings } from './admin/SemesterSettings';
import React, { Component } from "react";
import authHeader from "../services/auth-header";
import axios from "axios";
import { UserIcon, BookOpenIcon, UploadIcon, CalendarIcon, TestIcon, GraduationCap, LogoutIcon, ExclamationTriangleIcon, CheckCircleIcon, SearchIcon, TrendingUpIcon, SettingsIcon, TrashIcon } from './admin/AdminIcons';
import { TestResultDetailsModal } from './admin/TestResultDetailsModal';
import { ProgressAnalysis } from './admin/ProgressAnalysis';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export default class BoardAdmin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPage: "user-management",
            content: "",
            messages: [],
            message: { text: "", type: "" },
            users: [],
            materials: [],
            semesterStartDate: "",
            adminEmail: "",
            newMaterial: { title: "", type: "lecture", weekNumber: 1, file: null },
            isUploadingMaterial: false,
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
            newTest: { title: "", weekNumber: 0, examDateTime: "", timeLimit: "" },
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
            viewedResultId: null,
            isSidebarOpen: false,
            studentSearchQuery: "",
            userSearchQuery: "",
            importTestType: "-1",
            adminModal: { show: false, title: '', message: '', onConfirm: null, type: 'danger' },
        };
        this.handleStudentFileChange = this.handleStudentFileChange.bind(this);
        this.handleTestExcelUpload = this.handleTestExcelUpload.bind(this);
    }
    componentDidMount() {
        this.fetchUsers();
        this.fetchMaterials();
        this.fetchAllowedStudents();
        this.fetchCalendarEvents();
        this.fetchTests();
        this.fetchSettings();
    }
    showMessage(text, type) {

        if (this.messageTimeout) {
            clearTimeout(this.messageTimeout);
        }

        const id = Date.now() + Math.random();
        const newMessage = { id, text, type };

        this.setState({
            messages: [newMessage]
        });

        this.messageTimeout = setTimeout(() => {
            this.setState(prevState => ({
                messages: prevState.messages.filter(m => m.id !== id)
            }));
        }, 4000);
    }
    removeMessage = (id) => {
        this.setState(prevState => ({
            messages: prevState.messages.filter(m => m.id !== id)
        }));
    }

    getCurrentWeek() {
        const { semesterStartDate } = this.state;
        if (!semesterStartDate) return 0;

        const start = new Date(semesterStartDate);
        const now = new Date();

        const diffInMs = now.getTime() - start.getTime();
        if (diffInMs < 0) return 0;

        const week = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7)) + 1;
        return Math.min(week, 14);
    }
    setAdminModal = (modalState) => {
        this.setState(prevState => ({
            adminModal: typeof modalState === 'function' ? modalState(prevState.adminModal) : { ...prevState.adminModal, ...modalState }
        }));
    };
    setCurrentPage(page) {
        this.setState({ currentPage: page });
        if (page === "student-list-upload") this.fetchAllowedStudents();
        if (page === "calendar-management") this.fetchCalendarEvents();
        if (page === "test-management") this.fetchTests();
        if (page === "student-grades") this.fetchStudentGrades();
        if (page === "material-management") this.fetchSettings();
    }
    fetchSettings = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/settings/semester-start`, { headers: authHeader() });
            this.setState({
                semesterStartDate: res.data.semesterStartDate || "",
                adminEmail: res.data.adminEmail || ""
            });
        } catch (e) {
            console.error("Failed to load settings");
        }
    };

    handleDateSave = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/settings/semester-start`, { semesterStartDate: this.state.semesterStartDate }, { headers: authHeader() });
            this.showMessage("Dátum začiatku semestra bol aktualizovaný!", "success");
            this.fetchSettings();
        } catch {
            this.showMessage("Nepodarilo sa aktualizovať dátum.", "error");
        }
    };
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
        this.setAdminModal({
            show: true,
            title: 'Odstrániť používateľa?',
            message: 'Naozaj chcete vymazať tohto používateľa? Táto akcia je nevratná.',
            type: 'danger',
            onConfirm: async () => {
                this.setAdminModal({ show: false });
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
        });
    }
    async fetchMaterials() {
        try {
            const res = await fetch(`${API_URL}/api/materials?all=true`, { headers: authHeader() });
            if (!res.ok) throw new Error();
            const materials = await res.json();
            this.setState({ materials });
        } catch {
            this.showMessage("Nepodarilo sa načítať materiály.", "error");
        }
    }
    handleAddMaterial = async (e) => {
        e.preventDefault();
        const { newMaterial, isUploadingMaterial } = this.state;
        if (isUploadingMaterial) return;

        if (!newMaterial.title || !newMaterial.file) {
            this.showMessage("Prosím, vyplňte všetky polia a vyberte súbor.", "error");
            return;
        }
        this.setState({ isUploadingMaterial: true });
        this.showMessage("Nahrávam materiál, prosím čakajte...", "info");

        const formData = new FormData();
        formData.append("title", newMaterial.title);
        formData.append("type", newMaterial.type);
        formData.append("weekNumber", newMaterial.weekNumber);
        formData.append("file", newMaterial.file);
        try {
            const res = await fetch(`${API_URL}/api/materials`, {
                method: "POST",
                headers: { ...authHeader() },
                body: formData,
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || `Chyba servera: ${res.status}`);
            }
            this.fetchMaterials();
            this.setState({ newMaterial: { title: "", type: "lecture", weekNumber: 1, file: null } });
            this.showMessage("Materiál úspešne pridaný!", "success");
            if (e.target.elements.file) e.target.elements.file.value = "";
        } catch (error) {
            this.showMessage("Nepodarilo sa pridať materiál: " + error.message, "error");
        } finally {
            this.setState({ isUploadingMaterial: false });
        }
    };
    async handleDeleteMaterial(materialId) {
        this.setAdminModal({
            show: true,
            title: 'Odstrániť materiál?',
            message: 'Naozaj chcete vymazať tento študijný materiál? Táto akcia je nevratná.',
            type: 'danger',
            onConfirm: async () => {
                this.setAdminModal({ show: false });
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
        });
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
        this.setAdminModal({
            show: true,
            title: 'Odstrániť študenta?',
            message: `Naozaj chcete vymazať študenta ${email}? Táto akcia je nevratná.`,
            type: 'danger',
            onConfirm: async () => {
                this.setAdminModal({ show: false });
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
        });
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

    handleExportGrades = async () => {
        try {
            this.showMessage("Pripravujem dáta na export...", "info");

            const response = await axios({
                url: `${API_URL}/api/export/students`,
                method: 'GET',
                headers: authHeader(),
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv;charset=utf-8' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'results.csv');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

            this.showMessage("Export bol úspešne dokončený.", "success");
        } catch (error) {
            console.error("Export error:", error);
            this.showMessage("Nepodarilo sa exportovať dáta. Skontrolujte oprávnenia.", "error");
        }
    };
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
        this.setAdminModal({
            show: true,
            title: 'Odstrániť udalosť?',
            message: 'Naozaj chcete vymazať túto udalosť v kalendári? Táto akcia je nevratná.',
            type: 'danger',
            onConfirm: async () => {
                this.setAdminModal({ show: false });
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
        });
    }

    async fetchTests() {
        try {
            const res = await fetch(`${API_URL}/api/tests?all=true`, { headers: authHeader() });
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
            newTest: { title: "", weekNumber: 0, examDateTime: "", timeLimit: "" },
            newTestQuestions: [
                { question: "", type: "OPEN", points: 1, answers: [{ text: "", pointsWeight: 1 }] }
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
    removeQuestion = (idx) => {
        this.setAdminModal({
            show: true,
            title: 'Odstrániť otázku?',
            message: 'Naozaj chcete vymazať túto otázku? Táto akcia je nevratná.',
            type: 'danger',
            onConfirm: () => {
                this.setAdminModal({ show: false });
                const questions = [...this.state.newTestQuestions];
                if (questions.length > 1) {
                    questions.splice(idx, 1);
                    this.setState({ newTestQuestions: questions });
                } else {
                    this.showMessage("Test musí obsahovať aspoň jednu otázku.", "error");
                }
            }
        });
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
        const qType = questions[qIdx].type;
        questions[qIdx].answers.push({ text: "", pointsWeight: qType === 'OPEN' ? 1 : 0 });
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
            weekNumber: newTest.weekNumber,
            examDateTime: newTest.examDateTime || null,
            timeLimit: newTest.timeLimit ? parseInt(newTest.timeLimit, 10) : null,
            questions: newTestQuestions.map(q => ({
                question: q.question,
                type: q.type,
                points: q.points,
                answers: q.answers.map(a => ({
                    text: a.text,
                    pointsWeight: parseInt(a.pointsWeight, 10) || 0
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
    handleTestExcelUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        this.showMessage("Importujem test...", "info");
        const formData = new FormData();
        formData.append("file", file);

        const wNum = parseInt(this.state.importTestType, 10);
        formData.append("weekNumber", wNum);

        let typeLabel = "WEEKLY";
        if (wNum === 0) typeLabel = "ENTRY";
        else if (wNum === 13) typeLabel = "FINAL";
        else if (wNum === 14) typeLabel = "EXAM";
        else if (wNum === -1) typeLabel = "WEEKLY";

        formData.append("type", typeLabel);

        try {
            const res = await axios.post(`${API_URL}/api/tests/import`, formData, {
                headers: { ...authHeader(), "Content-Type": "multipart/form-data" }
            });
            this.fetchTests();
            this.showMessage(res.data.message || "Test úspešne importovaný", "success");
        } catch (error) {
            console.error("Import error:", error);
            const msg = error.response?.data?.message || error.response?.data || "Nepodarilo sa importovať test.";
            this.showMessage(msg, "error");
        }
        e.target.value = "";
    };
    async handleDeleteTest(testId) {
        this.setAdminModal({
            show: true,
            title: 'Odstrániť test?',
            message: 'Naozaj chcete vymazať tento test? Táto akcia je nevratná.',
            type: 'danger',
            onConfirm: async () => {
                this.setAdminModal({ show: false });
                try {
                    const res = await fetch(`${API_URL}/api/tests/${testId}`, {
                        method: "DELETE",
                        headers: authHeader(),
                    });
                    if (!res.ok) {
                        const errorData = await res.text();
                        throw new Error(errorData || "Nepodarilo sa odstrániť test.");
                    }
                    this.fetchTests();
                    this.showMessage("Test odstránený.", "success");
                } catch (error) {
                    this.showMessage(error.message, "error");
                }
            }
        });
    }
    async openEditTest(test) {
        try {
            const response = await fetch(`${API_URL}/api/tests/${test.id}?full=true`, {
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
                editingTest: {
                    title: testDetails.title,
                    weekNumber: testDetails.weekNumber || 0,
                    examDateTime: testDetails.examDateTime || "",
                    timeLimit: testDetails.timeLimit || ""
                },
                editingTestQuestions: mappedQuestions,
                creatingTest: false,
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
    removeEditQuestion = (idx) => {
        this.setAdminModal({
            show: true,
            title: 'Odstrániť otázku?',
            message: 'Naozaj chcete vymazať túto otázku? Táto akcia je nevratná.',
            type: 'danger',
            onConfirm: () => {
                this.setAdminModal({ show: false });
                const questions = [...this.state.editingTestQuestions];
                if (questions.length > 1) {
                    questions.splice(idx, 1);
                    this.setState({ editingTestQuestions: questions });
                } else {
                    this.showMessage("Test musí obsahovať aspoň jednu otázku.", "error");
                }
            }
        });
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
        const qType = questions[qIdx].type;
        questions[qIdx].answers.push({ text: '', pointsWeight: qType === 'OPEN' ? 1 : 0 });
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
            weekNumber: editingTest.weekNumber || 0,
            examDateTime: editingTest.examDateTime || null,
            timeLimit: editingTest.timeLimit ? parseInt(editingTest.timeLimit, 10) : null,
            questions: editingTestQuestions.map(q => ({
                question: q.question,
                type: q.type,
                points: q.points,
                answers: q.answers.map(a => ({ text: a.text, pointsWeight: parseInt(a.pointsWeight, 10) || 0 }))
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
            editingTest: { title: '', weekNumber: 0, examDateTime: "", timeLimit: "" },
            editingTestQuestions: []
        });
    };
    addEditQuestion = () => {
        this.setState((prev) => ({
            editingTestQuestions: [
                ...prev.editingTestQuestions,
                { questionId: null, question: "", type: "CLOSED", points: 1, answers: [{ text: "", pointsWeight: 1 }, { text: "", pointsWeight: 0 }] }
            ]
        }));
    };
    render() {
        const {
            currentPage,
            messages,
            materials,
            studentGrades,
            viewedResultId,
            isSidebarOpen,
        } = this.state;
        const roles = ["admin", "user"];
        const filteredLectures = materials.filter((m) => m.type === "lecture");
        const filteredSeminars = materials.filter((m) => m.type === "seminar");
        const beigeTextColor = "#F5F5DC";
        return (
            <div className="relative flex min-h-screen bg-[#0f172a] font-sans text-slate-200 overflow-x-hidden w-full max-w-[100vw]">
                {}
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 w-[90%] max-w-md pointer-events-none">
                    {(messages || []).map((msg) => (
                        <div
                            key={msg.id}
                            className={`p-4 rounded-2xl shadow-2xl border flex items-center justify-between backdrop-blur-md pointer-events-auto animate-fade-in-down transition-all transform hover:scale-[1.02] ${msg.type === "success"
                                ? "bg-emerald-500/90 border-emerald-400/30 text-white shadow-emerald-900/40"
                                : msg.type === "error"
                                    ? "bg-rose-500/90 border-rose-400/30 text-white shadow-rose-900/40"
                                    : "bg-blue-500/90 border-blue-400/30 text-white shadow-blue-900/40"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-white/20 rounded-lg">
                                    {msg.type === "success" && <CheckCircleIcon className="w-5 h-5 text-white" />}
                                    {msg.type === "error" && <ExclamationTriangleIcon className="w-5 h-5 text-white" />}
                                    {msg.type !== "success" && msg.type !== "error" && <SearchIcon className="w-5 h-5 text-white" />}
                                </div>
                                <span className="font-bold text-sm tracking-tight">{msg.text}</span>
                            </div>
                            <button
                                onClick={() => this.removeMessage(msg.id)}
                                className="ml-4 p-1.5 hover:bg-white/20 rounded-2xl transition-colors shrink-0"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
                <aside
                    className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0f172a] flex flex-col p-4 border-r border-white/5 shadow-xl
                           transform transition-transform duration-300 ease-in-out md:static md:translate-x-0
                           ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                >
                    <div className="text-2xl font-bold mb-8 text-center mt-2 tracking-wide" style={{ color: beigeTextColor }}>
                        Administrácia
                    </div>
                    <nav className="flex-grow space-y-1 mt-2 overflow-y-auto pr-2" style={{ scrollbarWidth: 'none' }}>
                        <div className="pt-2 pb-1 px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500">Správa systému</div>
                        <button
                            onClick={() => { this.setCurrentPage("user-management"); this.setState({ isSidebarOpen: false }); }}
                            className={`w-full text-left flex items-center py-2.5 px-3 rounded-lg transition-colors border-none duration-200 font-medium text-[15.5px] ${currentPage === "user-management" ? "bg-blue-600 text-white shadow-md" : "text-slate-300 hover:bg-[#1e293b]/70 hover:text-white"}`}
                        >
                            <UserIcon className="mr-3 w-5 h-5 text-current" /> Používatelia
                        </button>
                        <button
                            onClick={() => { this.setCurrentPage("calendar-management"); this.setState({ isSidebarOpen: false }); }}
                            className={`w-full text-left flex items-center py-2.5 px-3 rounded-lg transition-colors border-none duration-200 font-medium text-[15.5px] ${currentPage === "calendar-management" ? "bg-blue-600 text-white shadow-md" : "text-slate-300 hover:bg-[#1e293b]/70 hover:text-white"}`}
                        >
                            <CalendarIcon className="mr-3 w-5 h-5 text-current" /> Udalosti
                        </button>
                        <button
                            onClick={() => { this.setCurrentPage("semester-settings"); this.setState({ isSidebarOpen: false }); }}
                            className={`w-full text-left flex items-center py-2.5 px-3 rounded-lg transition-colors border-none duration-200 font-medium text-[15.5px] ${currentPage === "semester-settings" ? "bg-blue-600 text-white shadow-md" : "text-slate-300 hover:bg-[#1e293b]/70 hover:text-white"}`}
                        >
                            <SettingsIcon className="mr-3 w-5 h-5 text-current" /> Nastavenia semestra
                        </button>

                        <div className="pt-6 pb-1 px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500">Vzdelávanie</div>
                        <button
                            onClick={() => { this.setCurrentPage("material-management"); this.setState({ isSidebarOpen: false }); }}
                            className={`w-full text-left flex items-center py-2.5 px-3 rounded-lg transition-colors border-none duration-200 font-medium text-[15.5px] ${currentPage === "material-management" ? "bg-blue-600 text-white shadow-md" : "text-slate-300 hover:bg-[#1e293b]/70 hover:text-white"}`}
                        >
                            <BookOpenIcon className="mr-3 w-5 h-5 text-current" /> Materiály
                        </button>
                        <button
                            onClick={() => { this.setCurrentPage("test-management"); this.setState({ isSidebarOpen: false }); }}
                            className={`w-full text-left flex items-center py-2.5 px-3 rounded-lg transition-colors border-none duration-200 font-medium text-[15.5px] ${currentPage === "test-management" ? "bg-blue-600 text-white shadow-md" : "text-slate-300 hover:bg-[#1e293b]/70 hover:text-white"}`}
                        >
                            <TestIcon className="mr-3 w-5 h-5 text-current" /> Testy
                        </button>

                        <div className="pt-6 pb-1 px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500">Študenti</div>
                        <button
                            onClick={() => { this.setCurrentPage("student-list-upload"); this.setState({ isSidebarOpen: false }); }}
                            className={`w-full text-left flex items-center py-2.5 px-3 rounded-lg transition-colors border-none duration-200 font-medium text-[15.5px] ${currentPage === "student-list-upload" ? "bg-blue-600 text-white shadow-md" : "text-slate-300 hover:bg-[#1e293b]/70 hover:text-white"}`}
                        >
                            <UploadIcon className="mr-3 w-5 h-5 text-current" /> Registrácia
                        </button>
                        <button
                            onClick={() => { this.setCurrentPage("student-grades"); this.fetchStudentGrades(); this.setState({ isSidebarOpen: false }); }}
                            className={`w-full text-left flex items-center py-2.5 px-3 rounded-lg transition-colors border-none duration-200 font-medium text-[15.5px] ${currentPage === "student-grades" ? "bg-blue-600 text-white shadow-md" : "text-slate-300 hover:bg-[#1e293b]/70 hover:text-white"}`}
                        >
                            <GraduationCap className="mr-3 w-5 h-5 text-current" /> Hodnotenie
                        </button>
                        <button
                            onClick={() => { this.setCurrentPage("progress-analysis"); this.fetchStudentGrades(); this.setState({ isSidebarOpen: false }); }}
                            className={`w-full text-left flex items-center py-2.5 px-3 rounded-lg transition-colors border-none duration-200 font-medium text-[15.5px] ${currentPage === "progress-analysis" ? "bg-blue-600 text-white shadow-md" : "text-slate-300 hover:bg-[#1e293b]/70 hover:text-white"}`}
                        >
                            <TrendingUpIcon className="mr-3 w-5 h-5 text-current" /> Analýza progresu
                        </button>

                        <div className="my-6 border-t border-white/5 mx-3"></div>
                        <button
                            onClick={() => {
                                localStorage.removeItem("user");
                                window.location.href = "/login";
                            }}
                            className="w-full text-left flex items-center py-2.5 px-3 rounded-lg transition-colors border-none duration-200 font-medium text-[15.5px] text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        >
                            <LogoutIcon className="mr-3 w-5 h-5 text-current" /> Odhlásiť sa
                        </button>
                    </nav>
                </aside>
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 z-40 md:hidden"
                        onClick={() => this.setState({ isSidebarOpen: false })}
                    ></div>
                )}
                <div className="flex flex-col flex-1 w-full min-w-0">
                    <header className="sticky top-0 bg-[#0f172a]/50 backdrop-blur-sm p-4 border-b border-white/5 md:hidden z-10 flex items-center">
                        <button onClick={() => this.setState({ isSidebarOpen: true })} className="text-slate-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="text-lg sm:text-xl font-bold ml-4" style={{ color: beigeTextColor }}>
                            Administrácia
                        </h1>
                    </header>
                    <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
                        { }
                        {currentPage === "user-management" && <UserManagement adminCtx={this} roles={roles} />}
                        {currentPage === "student-grades" && <StudentGrades adminCtx={this} />}
                        {currentPage === "progress-analysis" && (
                            <ProgressAnalysis summaryData={studentGrades} currentWeek={this.getCurrentWeek()} />
                        )}
                        {currentPage === "material-management" && <MaterialManagement adminCtx={this} filteredLectures={filteredLectures} filteredSeminars={filteredSeminars} beigeTextColor={beigeTextColor} />}
                        {currentPage === "calendar-management" && <CalendarManagement adminCtx={this} />}
                        {currentPage === "semester-settings" && <SemesterSettings adminCtx={this} />}
                        {currentPage === "student-list-upload" && <StudentListUpload adminCtx={this} />}
                        {currentPage === "test-management" && <TestManagement adminCtx={this} />}
                    </main>
                </div >
                {viewedResultId && (
                    <TestResultDetailsModal
                        resultId={viewedResultId}
                        onClose={() => this.setState({ viewedResultId: null })}
                        onUpdate={() => this.fetchStudentGrades()}
                        beigeTextColor={beigeTextColor}
                    />
                )
                }
                {
                    this.state.adminModal && this.state.adminModal.show && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
                            <div className="bg-slate-900 border border-slate-700 rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-slide-in">
                                <div className={`h-2 w-full ${this.state.adminModal.type === 'danger' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                <div className="p-8 text-center">
                                    <div className={`w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center ${this.state.adminModal.type === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                        {this.state.adminModal.type === 'danger' ? <TrashIcon className="w-8 h-8" /> : <ExclamationTriangleIcon className="w-8 h-8" />}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{this.state.adminModal.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                        {this.state.adminModal.message}
                                    </p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => this.setAdminModal({ show: false })}
                                            className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all active:scale-95"
                                        >
                                            Zrušiť
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (this.state.adminModal.onConfirm) this.state.adminModal.onConfirm();
                                            }}
                                            className={`flex-1 px-4 py-3 ${this.state.adminModal.type === 'danger' ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'} text-white font-bold rounded-xl transition-all shadow-lg active:scale-95`}
                                        >
                                            {this.state.adminModal.type === 'danger' ? 'Odstrániť' : 'Potvrdiť'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        );
    }
}