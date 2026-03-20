import React from 'react';
import { PlusCircleIcon, TrashIcon } from './AdminIcons';
import { CustomSelect } from './CustomSelect';

export const TestManagement = ({ adminCtx }) => {
    const {
        tests, newTest, creatingTest, newTestQuestions, editingTestId, editingTest, editingTestQuestions
    } = adminCtx.state;

    return (<div className="space-y-8">
                                <h2 className="text-3xl font-bold mb-6 text-blue-400">Správa testov</h2>

                                <div className="mb-10 p-3 sm:p-6 border border-white/5 rounded-2xl bg-[#0f172a]/50">
                                    <h3 className="text-2xl font-semibold mb-4 flex items-center" style={{ color: "#F5F5DC" }}>
                                        <PlusCircleIcon className="mr-2 text-blue-400" /> Pridať nový test
                                    </h3>
                                    {!creatingTest ? (
                                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
                                            <div className="bg-[#0f172a]/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl relative group flex flex-col z-10 hover:z-20">
                                                <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500/50 group-hover:bg-blue-500 transition-all duration-500"></div>
                                                </div>
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="p-2.5 bg-blue-500/10 rounded-2xl">
                                                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-black text-white uppercase tracking-tight">Importovať testy</h3>
                                                        <p className="text-xs text-slate-500 mt-0.5">Automatické vytvorenie testov zo súboru</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-4 mt-auto">
                                                    <CustomSelect
                                                        value={adminCtx.state.importTestType}
                                                        onChange={(val) => adminCtx.setState({ importTestType: val })}
                                                        className="w-full"
                                                        options={[
                                                            { value: "-1", label: "Všetky týždenné testy" },
                                                            { value: "0", label: "Vstupný test" },
                                                            ...[...Array(12)].map((_, i) => ({ value: (i + 1).toString(), label: `Týždenný test ${i + 1}` })),
                                                            { value: "13", label: "Záverečný test" },
                                                            { value: "14", label: "Skúška" }
                                                        ]}
                                                    />

                                                    <input
                                                        type="file"
                                                        id="test-excel-upload"
                                                        className="hidden"
                                                        accept=".xlsx, .xls, .csv"
                                                        onChange={adminCtx.handleTestExcelUpload}
                                                    />
                                                    <label
                                                        htmlFor="test-excel-upload"
                                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3.5 px-6 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg shadow-blue-900/20 active:scale-95 cursor-pointer uppercase tracking-widest text-xs"
                                                    >
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                        </svg>
                                                        Nahrať a spracovať
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="bg-[#0f172a]/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl relative group flex flex-col z-10 hover:z-20">
                                                <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500/50 group-hover:bg-emerald-500 transition-all duration-500"></div>
                                                </div>
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="p-2.5 bg-emerald-500/10 rounded-2xl">
                                                        <PlusCircleIcon className="w-6 h-6 text-emerald-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-black text-white uppercase tracking-tight">Manuálne pridanie</h3>
                                                        <p className="text-xs text-slate-500 mt-0.5">Pridať test ručne po otázkach</p>
                                                    </div>
                                                </div>

                                                <div className="mt-auto">
                                                    <button
                                                        onClick={adminCtx.openTestCreation}
                                                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 px-6 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg shadow-emerald-900/20 active:scale-95 uppercase tracking-widest text-xs"
                                                    >
                                                        <PlusCircleIcon className="w-4 h-4 mr-2" /> Vytvoriť test manuálne
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mb-4">
                                            <button
                                                onClick={() => adminCtx.setState({ creatingTest: false })}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-xl text-sm transition-all group font-medium"
                                            >
                                                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                                </svg>
                                                Vrátiť sa späť
                                            </button>
                                        </div>
                                    )}

                                    {creatingTest && (
                                        <form onSubmit={adminCtx.saveTest} className="space-y-6 bg-[#0f172a] p-4 sm:p-6 rounded-2xl border border-white/5">
                                            <div className="flex flex-col md:flex-row gap-4 mb-4 flex-wrap">
                                                <input
                                                    type="text"
                                                    placeholder="Názov testu"
                                                    value={newTest.title}
                                                    onChange={(e) => adminCtx.setState({ newTest: { ...newTest, title: e.target.value } })}
                                                    className="flex-grow w-full min-w-0 px-4 py-2 rounded-lg border bg-[#15203d] border-white/5 text-slate-100 font-bold text-lg break-words"
                                                    required
                                                />
                                                <div className="flex items-center w-full md:w-auto">
                                                    <CustomSelect
                                                        value={newTest.weekNumber}
                                                        onChange={(val) => adminCtx.setState({ newTest: { ...newTest, weekNumber: parseInt(val) } })}
                                                        className="w-full md:w-48"
                                                        options={[
                                                            { value: 0, label: "Vstupný test" },
                                                            ...[...Array(12)].map((_, i) => ({ value: i + 1, label: `Týždeň ${i + 1}` })),
                                                            { value: 13, label: "Záverečný test" },
                                                            { value: 14, label: "Skúška" }
                                                        ]}
                                                    />
                                                </div>
                                                <label className="flex items-center w-full md:w-auto">
                                                    <input
                                                        type="number"
                                                        placeholder="Čas. limit (min)"
                                                        min="1"
                                                        value={newTest.timeLimit === null || newTest.timeLimit === undefined ? "" : newTest.timeLimit}
                                                        onChange={(e) => adminCtx.setState({ newTest: { ...newTest, timeLimit: e.target.value } })}
                                                        title="Limit v minútach (nechajte prázdne pre bez obmedzenia)"
                                                        className="w-full md:w-32 px-4 py-2 rounded-lg border bg-[#15203d] border-white/5 text-slate-100 font-bold break-words"
                                                    />
                                                </label>
                                                {newTest.weekNumber === 14 && (
                                                    <label className="flex items-center space-x-2 w-full md:w-auto animate-fade-in">
                                                        <span className="text-slate-300 whitespace-nowrap">Dátum/čas skúšky:</span>
                                                        <input
                                                            type="datetime-local"
                                                            value={newTest.examDateTime || ""}
                                                            onChange={(e) => adminCtx.setState({ newTest: { ...newTest, examDateTime: e.target.value } })}
                                                            className="w-full md:w-64 px-4 py-2 rounded-lg border bg-[#15203d] border-white/5 text-slate-100 font-bold break-words"
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                            {newTestQuestions.map((q, qIdx) => (
                                                <div key={qIdx} className="mb-6 bg-[#0f172a]/80 rounded-2xl border border-white/5 shadow-md flex flex-col">
                                                    <div className="bg-[#15203d]/30 px-4 sm:px-5 py-3 border-b border-white/5 flex justify-between items-center text-sm font-semibold text-slate-300 rounded-t-2xl">
                                                        <span>Otázka {qIdx + 1}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => adminCtx.removeQuestion(qIdx)}
                                                            className="text-red-400 hover:text-red-300 transition-colors bg-red-400/10 p-1.5 rounded-md flex items-center gap-1.5 shadow-sm"
                                                            title="Odstrániť celú otázku"
                                                        >
                                                            <TrashIcon className="w-4 h-4" /> <span className="hidden sm:inline">Zmazať otázku</span>
                                                        </button>
                                                    </div>

                                                    <div className="p-3 sm:p-5 flex flex-col gap-4 sm:gap-5">
                                                        <div className="flex flex-col gap-2">
                                                            <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Otázka</label>
                                                            <input
                                                                type="text"
                                                                placeholder={`Otázka ${qIdx + 1}`}
                                                                value={q.question}
                                                                onChange={(e) => adminCtx.updateQuestion(qIdx, "question", e.target.value)}
                                                                className="w-full px-4 py-3 rounded-lg border bg-[#0f172a]/50 border-white/5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-100 break-words"
                                                                required
                                                            />
                                                        </div>

                                                        <div className="flex flex-col gap-2">
                                                            <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Typ odpovede</label>
                                                            <div className="flex items-center gap-2 w-full">
                                                                <CustomSelect
                                                                    value={q.type}
                                                                    onChange={(val) => adminCtx.updateQuestion(qIdx, "type", val)}
                                                                    className="flex-1 w-full"
                                                                    options={[
                                                                        { value: "CLOSED", label: "Zatvorená (Výber viacerých možností)" },
                                                                        { value: "MULTIPLE", label: "Viaceré možnosti (Checkbox)" },
                                                                        { value: "OPEN", label: "Otvorená (Textová odpoveď)" }
                                                                    ]}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="pl-2 sm:pl-4 border-l-2 border-blue-500/50 pt-2">
                                                            <p className="text-xs text-slate-400 uppercase font-bold mb-2">
                                                                {q.type === 'OPEN' ? 'Kľúčové slová a bodovanie' : 'Možnosti a bodovanie'}
                                                            </p>
                                                            {q.answers.map((ans, aIdx) => (
                                                                <div key={aIdx} className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                                                                    <div className="flex items-center gap-2 shrink-0">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={ans.pointsWeight > 0}
                                                                            onChange={(e) => adminCtx.updateAnswer(qIdx, aIdx, "pointsWeight", e.target.checked ? 1 : 0)}
                                                                            className="w-5 h-5 rounded border-white/10 bg-[#15203d] text-blue-500 focus:ring-blue-500/50 transition-all cursor-pointer"
                                                                            title="Označiť ako správnu odpoveď"
                                                                        />
                                                                    </div>
                                                                    <input
                                                                        type="text"
                                                                        placeholder={q.type === 'OPEN' ? `Kľúčové slovo ${aIdx + 1}` : `Možnosť ${aIdx + 1}`}
                                                                        value={ans.text}
                                                                        onChange={(e) => adminCtx.updateAnswer(qIdx, aIdx, "text", e.target.value)}
                                                                        className="px-2 py-1 rounded border bg-[#15203d] border-white/5 text-slate-100 mr-2 flex-grow w-full min-w-0 break-words"
                                                                        required
                                                                    />
                                                                    <div className="flex items-center gap-2">
                                                                        <input
                                                                            type="number"
                                                                            placeholder="Body"
                                                                            value={ans.pointsWeight}
                                                                            onChange={(e) => adminCtx.updateAnswer(qIdx, aIdx, "pointsWeight", e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                                                                            className="w-20 min-w-0 px-2 py-1 rounded border bg-[#15203d] border-white/5 text-slate-100 text-center break-words"
                                                                            required
                                                                        />
                                                                        <span className="text-slate-300 text-sm whitespace-nowrap whitespace-nowrap w-auto sm:w-12">bodov</span>
                                                                        {q.answers.length > 1 && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => adminCtx.removeAnswer(qIdx, aIdx)}
                                                                                className="ml-auto text-red-400 hover:text-red-300 font-bold text-sm"
                                                                            >
                                                                                Odstrániť
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <button type="button" onClick={() => adminCtx.addAnswer(qIdx)} className="text-blue-400 hover:text-blue-300 mt-2 text-sm font-bold">
                                                                + Pridať {q.type === 'OPEN' ? 'kľúčové slovo' : 'odpoveď'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button type="button" onClick={adminCtx.addQuestion} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold">
                                                + Pridať ďalšiu otázku
                                            </button>
                                            <div className="flex flex-wrap gap-2 mt-6 border-t border-white/5 pt-6">
                                                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold">
                                                    Uložiť test
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => adminCtx.setState({ creatingTest: false })}
                                                    className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-bold"
                                                >
                                                    Zrušiť
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>

                                {editingTestId && (
                                    <div className="mb-10 p-6 border border-white/5 rounded-2xl bg-[#0f172a]/50">
                                        <div className="mb-4">
                                            <button
                                                onClick={adminCtx.cancelEditTest}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-xl text-sm transition-all group font-medium"
                                            >
                                                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                                </svg>
                                                Vrátiť sa späť
                                            </button>
                                        </div>
                                        <h3 className="text-2xl font-semibold mb-4 flex items-center" style={{ color: "#F5F5DC" }}>
                                            Upraviť test
                                        </h3>
                                        <form onSubmit={adminCtx.saveEditTest} className="space-y-6 bg-[#0f172a] p-4 sm:p-6 rounded-2xl border border-white/5">
                                            <div className="flex flex-col md:flex-row gap-4 mb-4 flex-wrap">
                                                <input
                                                    type="text"
                                                    placeholder="Názov testu"
                                                    value={editingTest.title}
                                                    onChange={(e) => adminCtx.setState({ editingTest: { ...editingTest, title: e.target.value } })}
                                                    className="flex-grow w-full min-w-0 px-4 py-2 rounded-lg border bg-[#15203d] border-white/5 text-slate-100 font-bold text-lg break-words"
                                                    required
                                                />
                                                <div className="flex items-center w-full md:w-auto">
                                                    <CustomSelect
                                                        value={editingTest.weekNumber}
                                                        onChange={(val) => adminCtx.setState({ editingTest: { ...editingTest, weekNumber: parseInt(val) } })}
                                                        className="w-full md:w-48"
                                                        options={[
                                                            { value: 0, label: "Vstupný test" },
                                                            ...[...Array(12)].map((_, i) => ({ value: i + 1, label: `Týždeň ${i + 1}` })),
                                                            { value: 13, label: "Záverečný test" },
                                                            { value: 14, label: "Skúška" }
                                                        ]}
                                                    />
                                                </div>
                                                <label className="flex items-center w-full md:w-auto">
                                                    <input
                                                        type="number"
                                                        placeholder="Čas. limit (min)"
                                                        min="1"
                                                        value={editingTest.timeLimit === null || editingTest.timeLimit === undefined ? "" : editingTest.timeLimit}
                                                        onChange={(e) => adminCtx.setState({ editingTest: { ...editingTest, timeLimit: e.target.value } })}
                                                        title="Limit v minútach (nechajte prázdne pre bez obmedzenia)"
                                                        className="w-full md:w-32 px-4 py-2 rounded-lg border bg-[#15203d] border-white/5 text-slate-100 font-bold break-words"
                                                    />
                                                </label>
                                                {editingTest.weekNumber === 14 && (
                                                    <label className="flex items-center space-x-2 w-full md:w-auto animate-fade-in">
                                                        <span className="text-slate-300 whitespace-nowrap">Dátum/čas skúšky:</span>
                                                        <input
                                                            type="datetime-local"
                                                            value={editingTest.examDateTime || ""}
                                                            onChange={(e) => adminCtx.setState({ editingTest: { ...editingTest, examDateTime: e.target.value } })}
                                                            className="w-full md:w-64 px-4 py-2 rounded-lg border bg-[#15203d] border-white/5 text-slate-100 font-bold break-words"
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                            {editingTestQuestions.map((q, qIdx) => (
                                                <div key={q.questionId || qIdx} className="mb-6 bg-[#0f172a]/80 rounded-2xl border border-white/5 shadow-md flex flex-col">
                                                    <div className="bg-[#15203d]/30 px-5 py-3 border-b border-white/5 flex justify-between items-center text-sm font-semibold text-slate-300 rounded-t-2xl">
                                                        <span>Otázka {qIdx + 1}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => adminCtx.removeEditQuestion(qIdx)}
                                                            className="text-red-400 hover:text-red-300 transition-colors bg-red-400/10 p-1.5 rounded-md flex items-center gap-1.5 shadow-sm"
                                                            title="Odstrániť celú otázku"
                                                        >
                                                            <TrashIcon className="w-4 h-4" /> <span className="hidden sm:inline">Zmazať otázku</span>
                                                        </button>
                                                    </div>

                                                    <div className="p-3 sm:p-5 flex flex-col gap-4 sm:gap-5">
                                                        <div className="flex flex-col gap-2">
                                                            <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Otázka</label>
                                                            <input
                                                                type="text"
                                                                placeholder={`Otázka ${qIdx + 1}`}
                                                                value={q.question}
                                                                onChange={(e) => adminCtx.updateEditQuestion(qIdx, "question", e.target.value)}
                                                                className="w-full px-4 py-3 rounded-lg border bg-[#0f172a]/50 border-white/5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-100 break-words"
                                                                required
                                                            />
                                                        </div>

                                                        <div className="flex flex-col gap-2">
                                                            <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Typ odpovede</label>
                                                            <div className="flex items-center gap-2 w-full">
                                                                <CustomSelect
                                                                    value={q.type}
                                                                    onChange={(val) => adminCtx.updateEditQuestion(qIdx, "type", val)}
                                                                    className="flex-1 w-full"
                                                                    options={[
                                                                        { value: "CLOSED", label: "Zatvorená (Výber viacerých možností)" },
                                                                        { value: "MULTIPLE", label: "Viaceré možnosti (Checkbox)" },
                                                                        { value: "OPEN", label: "Otvorená (Textová odpoveď)" }
                                                                    ]}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="pl-2 sm:pl-4 border-l-2 border-blue-500/50 pt-2">
                                                            <p className="text-xs text-slate-400 uppercase font-bold mb-2">
                                                                {q.type === 'OPEN' ? 'Kľúčové slová a bodovanie' : 'Možnosti a bodovanie'}
                                                            </p>
                                                            {q.answers.map((ans, aIdx) => (
                                                                <div key={ans.answerId || aIdx} className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                                                                    <div className="flex items-center gap-2 shrink-0">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={ans.pointsWeight > 0}
                                                                            onChange={(e) => adminCtx.updateEditAnswer(qIdx, aIdx, "pointsWeight", e.target.checked ? 1 : 0)}
                                                                            className="w-5 h-5 rounded border-white/10 bg-[#15203d] text-blue-500 focus:ring-blue-500/50 transition-all cursor-pointer"
                                                                            title="Označiť ako správnu odpoveď"
                                                                        />
                                                                    </div>
                                                                    <input
                                                                        type="text"
                                                                        placeholder={q.type === 'OPEN' ? `Kľúčové slovo ${aIdx + 1}` : `Možnosť ${aIdx + 1}`}
                                                                        value={ans.text}
                                                                        onChange={(e) => adminCtx.updateEditAnswer(qIdx, aIdx, "text", e.target.value)}
                                                                        className="px-2 py-1 rounded border bg-[#15203d] border-white/5 text-slate-100 mr-2 flex-grow w-full min-w-0 break-words"
                                                                        required
                                                                    />
                                                                    <div className="flex items-center gap-2">
                                                                        <input
                                                                            type="number"
                                                                            placeholder="Body"
                                                                            value={ans.pointsWeight}
                                                                            onChange={(e) => adminCtx.updateEditAnswer(qIdx, aIdx, "pointsWeight", e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                                                                            className="w-20 min-w-0 px-2 py-1 rounded border bg-[#15203d] border-white/5 text-slate-100 text-center break-words"
                                                                            required
                                                                        />
                                                                        <span className="text-slate-300 text-sm whitespace-nowrap w-auto sm:w-12">bodov</span>
                                                                        {q.answers.length > 1 && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => adminCtx.removeEditAnswer(qIdx, aIdx)}
                                                                                className="ml-auto text-red-400 hover:text-red-300 font-bold text-sm"
                                                                            >
                                                                                Odstrániť
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <button type="button" onClick={() => adminCtx.addEditAnswer(qIdx)} className="text-blue-400 hover:text-blue-300 mt-2 text-sm font-bold">
                                                                + Pridať {q.type === 'OPEN' ? 'kľúčové slovo' : 'odpoveď'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button type="button" onClick={adminCtx.addEditQuestion} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold">
                                                + Pridať ďalšiu otázku
                                            </button>
                                            <div className="flex flex-wrap gap-2 mt-6 border-t border-white/5 pt-6">
                                                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold">
                                                    Uložiť zmeny
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={adminCtx.cancelEditTest}
                                                    className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-bold"
                                                >
                                                    Zrušiť
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                <div className="p-6 border border-white/5 rounded-2xl bg-[#0f172a]/50">
                                    <h4 className="text-lg font-semibold mb-4 text-blue-400">Existujúce testy</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {tests.length === 0 ? (
                                            <div className="md:col-span-2 text-center py-10 bg-[#0f172a]/30 rounded-2xl border border-white/5">
                                                <p className="text-slate-400 font-medium italic">Zatiaľ žiadne testy.</p>
                                            </div>
                                        ) : (
                                            tests.map((test) => (
                                                <div key={test.id} className="bg-[#0f172a]/60 backdrop-blur-sm border border-white/5 rounded-2xl p-4 flex items-center justify-between group transition-all duration-300 hover:border-blue-500/30 hover:bg-[#15203d]/40 shadow-lg">
                                                    <div className="flex items-center gap-4 min-w-0">
                                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-110 transition-transform">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h5 className="text-white font-bold truncate group-hover:text-blue-400 transition-colors uppercase tracking-tight text-sm">
                                                                {test.title}
                                                            </h5>
                                                            {![0, 13, 14].includes(test.weekNumber || 0) && (
                                                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">
                                                                    {test.weekNumber}. týždeň
                                                                </p>
                                                            )}
                                                            {test.weekNumber === 14 && (
                                                                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-0.5">
                                                                    Hlavná skúška
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); adminCtx.openEditTest(test); }}
                                                            className="bg-blue-600/10 hover:bg-blue-600 text-blue-300 hover:text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 border border-blue-500/20"
                                                        >
                                                            Upraviť
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); adminCtx.handleDeleteTest(test.id); }}
                                                            className="bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white p-1.5 rounded-xl transition-all duration-200 border border-rose-500/10 shadow-sm"
                                                            title="Zmazať test"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>);
};
