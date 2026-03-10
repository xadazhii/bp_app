import React, { useState, useEffect } from "react";
import axios from "axios";
import authHeader from "../../services/auth-header";
import { CheckCircleIcon, ListBulletIcon, PencilIcon, TrashIcon, SparklesIcon, CalendarIcon, AwardIcon } from '../common/ProfileIcons';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const NotesContent = ({ beigeTextColor, setModal }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Všeobecné");
    const [selectedNote, setSelectedNote] = useState(null);
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [notesActiveTab, setNotesActiveTab] = useState('write');

    // Block-based state for new note
    const [blocks, setBlocks] = useState([{ id: Date.now(), type: 'text', value: '' }]);

    const categories = ["Všeobecné"];
    for (let i = 1; i <= 12; i++) categories.push(`Prednáška ${i}`);
    for (let i = 1; i <= 12; i++) categories.push(`Cvičenie ${i}`);

    const fetchNotes = () => {
        setLoading(true);
        axios.get(`${API_URL}/api/notes`, { headers: authHeader() })
            .then(res => {
                setNotes(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const addBlock = (type) => {
        setBlocks([...blocks, { id: Date.now(), type, value: '' }]);
    };

    const removeBlock = (id) => {
        if (blocks.length === 1 && blocks[0].type === 'text') {
            setBlocks([{ id: Date.now(), type: 'text', value: '' }]);
            return;
        }
        setBlocks(blocks.filter(b => b.id !== id));
    };

    const updateBlock = (id, value) => {
        setBlocks(prev => prev.map(b => b.id === id ? { ...b, value } : b));
    };

    const handleSubmitNote = (e) => {
        e.preventDefault();
        if (blocks.every(b => !b.value.trim())) {
            setModal({
                show: true,
                title: 'Prázdna poznámka',
                message: 'Prosím, napíšte aspoň niečo do svojej poznámky.',
                type: 'info'
            });
            return;
        }

        setSubmitting(true);
        const noteData = {
            category: selectedCategory,
            content: JSON.stringify(blocks)
        };

        const request = editingNoteId
            ? axios.put(`${API_URL}/api/notes/${editingNoteId}`, noteData, { headers: authHeader() })
            : axios.post(`${API_URL}/api/notes`, noteData, { headers: authHeader() });

        request
            .then(() => {
                fetchNotes();
                setBlocks([{ id: Date.now(), type: 'text', value: '' }]);
                setEditingNoteId(null);
                setNotesActiveTab('read');
                setSubmitting(false);
            })
            .catch(() => setSubmitting(false));
    };

    const deleteNote = (id) => {
        setModal({
            show: true,
            title: 'Zmazať poznámku?',
            message: 'Tento krok je nevratný.',
            type: 'danger',
            onConfirm: () => {
                axios.delete(`${API_URL}/api/notes/${id}`, { headers: authHeader() })
                    .then(() => {
                        fetchNotes();
                        if (selectedNote?.id === id) setSelectedNote(null);
                        setModal(prev => ({ ...prev, show: false }));
                    });
            }
        });
    };

    const startEditNote = (note) => {
        try {
            const contentBlocks = JSON.parse(note.content);
            setBlocks(contentBlocks);
            setEditingNoteId(note.id);
            setSelectedCategory(note.category);
            setNotesActiveTab('write');
        } catch (e) {
            setBlocks([{ id: Date.now(), type: 'text', value: note.content }]);
            setEditingNoteId(note.id);
            setSelectedCategory(note.category);
            setNotesActiveTab('write');
        }
    };

    const filteredNotes = selectedCategory === "Všetky"
        ? notes
        : notes.filter(n => n.category === selectedCategory);

    const renderNoteContent = (content) => {
        try {
            const parsedBlocks = JSON.parse(content);
            return parsedBlocks.map(block => (
                <div key={block.id} className="mb-4">
                    {block.type === 'text' && <p className="text-slate-300 whitespace-pre-wrap">{block.value}</p>}
                    {block.type === 'code' && (
                        <pre className="bg-slate-900 p-4 rounded-xl border border-white/5 text-blue-300 font-mono text-sm overflow-x-auto">
                            <code>{block.value}</code>
                        </pre>
                    )}
                </div>
            ));
        } catch (e) {
            return <p className="text-slate-300 whitespace-pre-wrap">{content}</p>;
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
                <div>
                    <h2 className="text-4xl font-extrabold text-white tracking-tight mb-2">Moje poznámky</h2>
                    <p className="text-slate-400">Zapisujte si dôležité informácie z prednášok a cvičení.</p>
                </div>
                <div className="flex bg-[#0f172a]/80 p-1 rounded-2xl border border-white/5">
                    <button
                        onClick={() => setNotesActiveTab('write')}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${notesActiveTab === 'write' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        {editingNoteId ? 'Upraviť' : 'Nové'}
                    </button>
                    <button
                        onClick={() => setNotesActiveTab('read')}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${notesActiveTab === 'read' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Prehliadať
                    </button>
                </div>
            </div>

            {notesActiveTab === 'write' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#0f172a]/50 p-8 rounded-[2rem] border border-white/5 shadow-2xl space-y-8">
                            <div className="space-y-4">
                                {blocks.map((block, idx) => (
                                    <div key={block.id} className="group relative">
                                        {block.type === 'text' ? (
                                            <textarea
                                                value={block.value}
                                                onChange={(e) => updateBlock(block.id, e.target.value)}
                                                placeholder={idx === 0 ? "Začnite písať svoju poznámku..." : "Pokračujte v písaní..."}
                                                className="w-full bg-transparent border-none text-xl text-slate-100 placeholder:text-slate-700 focus:ring-0 resize-none min-h-[100px]"
                                                rows={4}
                                            />
                                        ) : (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/5 py-1 px-3 rounded-md w-fit">
                                                    Kódový blok
                                                </div>
                                                <textarea
                                                    value={block.value}
                                                    onChange={(e) => updateBlock(block.id, e.target.value)}
                                                    className="w-full bg-[#15203d] border border-white/5 rounded-xl p-6 font-mono text-sm text-blue-300 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    placeholder="Vložte sem svoj kód..."
                                                    rows={6}
                                                />
                                            </div>
                                        )}
                                        <button
                                            onClick={() => removeBlock(block.id)}
                                            className="absolute -right-2 -top-2 w-8 h-8 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500 hover:text-white border border-rose-500/20"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
                                <button onClick={() => addBlock('text')} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold transition-all border border-white/5">
                                    <ListBulletIcon className="w-4 h-4" /> Pridať text
                                </button>
                                <button onClick={() => addBlock('code')} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold transition-all border border-white/5">
                                    <PencilIcon className="w-4 h-4" /> Pridať kód
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-[#0f172a]/50 p-6 rounded-[2rem] border border-white/5 shadow-xl">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Nastavenia</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Kategória</label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full bg-[#15203d] border border-white/5 rounded-xl p-3 text-slate-100 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                    >
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                                <button
                                    onClick={handleSubmitNote}
                                    disabled={submitting}
                                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/40 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                >
                                    {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
                                        <>
                                            <CheckCircleIcon className="w-5 h-5" />
                                            {editingNoteId ? 'Uložiť zmeny' : 'Uložiť poznámku'}
                                        </>
                                    )}
                                </button>
                                {editingNoteId && (
                                    <button
                                        onClick={() => {
                                            setEditingNoteId(null);
                                            setBlocks([{ id: Date.now(), type: 'text', value: '' }]);
                                        }}
                                        className="w-full py-3 text-slate-500 hover:text-slate-300 font-bold text-xs"
                                    >
                                        Zrušiť úpravu
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="space-y-2">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Kategórie</h3>
                        {["Všetky", ...categories].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium text-sm border ${selectedCategory === cat ? 'bg-blue-600/10 border-blue-500/30 text-blue-400' : 'text-slate-400 border-transparent hover:bg-white/5'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="lg:col-span-3 space-y-6">
                        {loading ? (
                            <div className="flex justify-center p-20"><div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div></div>
                        ) : filteredNotes.length === 0 ? (
                            <div className="p-20 text-center bg-[#0f172a]/30 rounded-[2rem] border border-dashed border-white/10">
                                <SparklesIcon className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                                <p className="text-slate-500">Žiadne poznámky v tejto kategórii.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredNotes.map(note => (
                                    <div
                                        key={note.id}
                                        onClick={() => setSelectedNote(note)}
                                        className="bg-[#0f172a]/50 p-6 rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group shadow-lg"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-lg">
                                                {note.category}
                                            </span>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); startEditNote(note); }}
                                                    className="p-2 text-slate-500 hover:text-white hover:bg-blue-600 rounded-lg transition-all"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                                                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="max-h-32 overflow-hidden relative">
                                            <div className="text-slate-300 text-sm leading-relaxed mb-4">
                                                {renderNoteContent(note.content)}
                                            </div>
                                            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#0f172a] to-transparent"></div>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between text-[10px] text-slate-600 font-bold uppercase tracking-tighter">
                                            <div className="flex items-center gap-1">
                                                <CalendarIcon className="w-3 h-3" />
                                                {new Date(note.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <AwardIcon className="w-3 h-3" />
                                                ID: {note.id}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {selectedNote && (
                <div className="fixed inset-0 z-[1002] flex items-center justify-center p-4 sm:p-6 backdrop-blur-3xl animate-fade-in-up bg-[#0a0f18]/80">
                    <div className="bg-[#121826] border border-white/10 rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                        <div className="p-8 sm:p-12 border-b border-white/5 flex justify-between items-start">
                            <div>
                                <span className="text-[11px] font-black text-blue-500 uppercase tracking-[0.3em] mb-3 block">{selectedNote.category}</span>
                                <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tighter leading-tight">Detail poznámky</h3>
                                <p className="text-slate-500 mt-2 font-medium text-sm flex items-center gap-2">
                                    Vytvorené {new Date(selectedNote.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedNote(null)}
                                className="w-12 h-12 bg-[#15203d] text-slate-400 hover:text-white rounded-2xl flex items-center justify-center transition-all border border-white/5"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-8 sm:p-12 overflow-y-auto custom-scrollbar flex-grow bg-[#0f172a]/30">
                            <div className="prose prose-invert max-w-none text-xl sm:text-2xl text-slate-300 leading-relaxed font-medium">
                                {renderNoteContent(selectedNote.content)}
                            </div>
                        </div>
                        <div className="p-8 border-t border-white/5 bg-[#0a0f18]/50 flex justify-end gap-3">
                            <button
                                onClick={() => { startEditNote(selectedNote); setSelectedNote(null); }}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all text-sm"
                            >
                                Upraviť
                            </button>
                            <button
                                onClick={() => setSelectedNote(null)}
                                className="px-8 py-3 bg-white/5 hover:bg-white/10 text-slate-400 font-bold rounded-xl transition-all text-sm"
                            >
                                Zavrieť
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotesContent;
