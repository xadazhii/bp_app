import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import authHeader from "../../services/auth-header";
import { TrashIcon, NoteIcon, PencilIcon, CheckCircleIcon, ExclamationTriangleIcon } from "../common/ProfileIcons";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const CanvasDrawing = ({ initialValue, onSave, onCancel, standalone = false }) => {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState("pencil");
    const [color, setColor] = useState("#3b82f6");
    const [brushSize, setBrushSize] = useState(4);
    const [isEraser, setIsEraser] = useState(false);
    const [shapes, setShapes] = useState([]);
    const [currentShape, setCurrentShape] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * 2;
        canvas.height = rect.height * 2;
        const ctx = canvas.getContext("2d");
        ctx.scale(2, 2);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctxRef.current = ctx;

        if (initialValue && initialValue.startsWith("data:image")) {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, rect.width, rect.height);
            };
            img.src = initialValue;
        }
    }, [initialValue]);

    const getPos = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDrawing = (e) => {
        const { x, y } = getPos(e);
        if (tool === "pencil" || isEraser) {
            ctxRef.current.beginPath();
            ctxRef.current.moveTo(x, y);
        } else {
            setCurrentShape({ type: tool, startX: x, startY: y, x, y, color, size: brushSize });
        }
        setIsDrawing(true);
        e.preventDefault();
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const { x, y } = getPos(e);

        if (tool === "pencil" || isEraser) {
            ctxRef.current.strokeStyle = isEraser ? "#0f172a" : color;
            ctxRef.current.lineWidth = brushSize;
            ctxRef.current.globalCompositeOperation = isEraser ? "destination-out" : "source-over";
            ctxRef.current.lineTo(x, y);
            ctxRef.current.stroke();
        } else if (currentShape) {
            setCurrentShape(prev => ({ ...prev, x, y }));
        }
        e.preventDefault();
    };

    const redrawAll = () => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        shapes.forEach(shape => {
            ctx.beginPath();
            ctx.strokeStyle = shape.color;
            ctx.lineWidth = shape.size;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            const sx = shape.startX + offset.x;
            const sy = shape.startY + offset.y;
            const ex = shape.x + offset.x;
            const ey = shape.y + offset.y;

            if (shape.type === "rectangle") {
                ctx.strokeRect(sx, sy, ex - sx, ey - sy);
            } else if (shape.type === "circle") {
                const radius = Math.sqrt(Math.pow(ex - sx, 2) + Math.pow(ey - sy, 2));
                ctx.arc(sx, sy, radius, 0, 2 * Math.PI);
                ctx.stroke();
            } else if (shape.type === "line") {
                ctx.moveTo(sx, sy);
                ctx.lineTo(ex, ey);
                ctx.stroke();
            } else if (shape.type === "arrow") {
                ctx.moveTo(sx, sy);
                ctx.lineTo(ex, ey);
                const headlen = 15;
                const angle = Math.atan2(ey - sy, ex - sx);
                ctx.lineTo(ex - headlen * Math.cos(angle - Math.PI / 6), ey - headlen * Math.sin(angle - Math.PI / 6));
                ctx.moveTo(ex, ey);
                ctx.lineTo(ex - headlen * Math.cos(angle + Math.PI / 6), ey - headlen * Math.sin(angle + Math.PI / 6));
                ctx.stroke();
            }
        });
    };

    const stopDrawing = () => {
        if (currentShape) {
            setShapes([...shapes, currentShape]);
            setCurrentShape(null);
        }
        ctxRef.current.closePath();
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    };

    const handleConfirm = () => {
        const dataUrl = canvasRef.current.toDataURL("image/png");
        onSave(dataUrl);
    };

    return (
        <div className={`flex flex-col gap-4 animate-scale-up ${isFullscreen ? 'fixed inset-0 z-[10000] bg-slate-950 p-6' : ''}`}>
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/5 shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="flex gap-1 bg-black/30 p-1 rounded-xl">
                        <button type="button" onClick={() => { setTool("pencil"); setIsEraser(false); }} className={`p-2 rounded-lg transition-all ${tool === "pencil" && !isEraser ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`} title="Ceruzka">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button type="button" onClick={() => { setTool("line"); setIsEraser(false); }} className={`p-2 rounded-lg transition-all ${tool === "line" ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`} title="Čiara">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5l14 14" /></svg>
                        </button>
                        <button type="button" onClick={() => { setTool("arrow"); setIsEraser(false); }} className={`p-2 rounded-lg transition-all ${tool === "arrow" ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`} title="Šípka">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M13 5l7 7-7 7" /></svg>
                        </button>
                        <button type="button" onClick={() => { setTool("rectangle"); setIsEraser(false); }} className={`p-2 rounded-lg transition-all ${tool === "rectangle" ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`} title="Obdĺžnik">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5h16v14H4z" /></svg>
                        </button>
                        <button type="button" onClick={() => { setTool("circle"); setIsEraser(false); }} className={`p-2 rounded-lg transition-all ${tool === "circle" ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`} title="Kruh">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" strokeWidth="2" /></svg>
                        </button>
                        <button type="button" onClick={() => { setTool("pan"); setIsEraser(false); }} className={`p-2 rounded-lg transition-all ${tool === "pan" ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`} title="Posun (Pan)">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </button>
                        <button type="button" onClick={() => setIsEraser(true)} className={`p-2 rounded-lg transition-all ${isEraser ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`} title="Guma">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 19l7-7 3 3-7 7-3-3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                    </div>

                    <div className="flex gap-1 bg-black/20 p-1 rounded-xl">
                        {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ffffff', '#000000'].map(c => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setColor(c)}
                                className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 active:scale-90 ${color === c ? 'border-white scale-125 shadow-lg shadow-white/20' : 'border-transparent opacity-70'}`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>

                    <div className="flex gap-1 bg-black/20 p-1 rounded-xl">
                        {[2, 6, 12].map(size => (
                            <button
                                key={size}
                                type="button"
                                onClick={() => setBrushSize(size)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${brushSize === size ? 'bg-white/20 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                {size === 2 ? 'Tenučká' : size === 6 ? 'Stredná' : 'Hrubá'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-2">
                    <button type="button" onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 text-slate-400 hover:text-white transition-all bg-black/20 rounded-xl" title="Celá obrazovka">
                        {isFullscreen ? (
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5 5" /></svg>
                        ) : (
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5 5" /></svg>
                        )}
                    </button>
                    <button type="button" onClick={clearCanvas} className="px-3 py-1.5 text-[10px] font-bold text-red-400 hover:bg-red-500/10 rounded-lg border border-red-500/20 transition-all uppercase">Vymazať</button>
                    <button type="button" onClick={handleConfirm} className="px-4 py-1.5 text-[10px] font-bold bg-blue-600 text-white hover:bg-blue-500 rounded-lg shadow-lg shadow-blue-500/20 transition-all uppercase">Uložiť</button>
                </div>
            </div>

            <div className={`relative rounded-3xl overflow-hidden border-2 border-white/5 bg-[#0a0f18] shadow-inner group/canvas ${isFullscreen ? 'flex-grow' : ''}`}>
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-full cursor-crosshair touch-none"
                    style={{
                        height: isFullscreen ? 'calc(100vh - 160px)' : '600px',
                        backgroundImage: 'radial-gradient(circle, #ffffff08 1.5px, transparent 1.5px)',
                        backgroundSize: '30px 30px'
                    }}
                />

                {currentShape && (
                    <div className="absolute pointer-events-none border-2 border-blue-500 border-dashed"
                         style={{
                             left: Math.min(currentShape.startX, currentShape.x),
                             top: Math.min(currentShape.startY, currentShape.y),
                             width: Math.abs(currentShape.x - currentShape.startX),
                             height: Math.abs(currentShape.y - currentShape.startY),
                             borderRadius: currentShape.type === 'circle' ? '50%' : '0'
                         }}
                    />
                )}

                <div className="absolute bottom-4 left-4 pointer-events-none text-slate-700 text-[10px] font-bold uppercase tracking-widest opacity-30 group-hover/canvas:opacity-100 transition-opacity">
                    Miro Canvas Mode • Space to Pan
                </div>
            </div>
        </div>
    );
};

const NotesContent = ({ beigeTextColor, setModal }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Všeobecné");
    const [selectedNote, setSelectedNote] = useState(null);
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [notesActiveTab, setNotesActiveTab] = useState('write');

    const [blocks, setBlocks] = useState([{ id: Date.now(), type: 'text', value: '' }]);
    const [activeDrawingId, setActiveDrawingId] = useState(null);

    const historyRef = useRef([]);
    const [canUndo, setCanUndo] = useState(false);

    const saveHistory = useCallback(() => {
        historyRef.current.push(JSON.stringify(blocks));
        if (historyRef.current.length > 50) historyRef.current.shift();
        setCanUndo(true);
    }, [blocks]);

    const performUndo = useCallback(() => {
        if (historyRef.current.length === 0) return;
        const lastState = historyRef.current.pop();
        setBlocks(JSON.parse(lastState));
        setCanUndo(historyRef.current.length > 0);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                performUndo();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [performUndo]);

    const categories = ["Všeobecné"];
    for (let i = 1; i <= 12; i++) categories.push(`Prednáška ${i}`);
    for (let i = 1; i <= 12; i++) categories.push(`Cvičenie ${i}`);

    const fetchNotes = () => {
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
        saveHistory();
        const newId = Date.now();
        let defaultValue = '';
        if (type === 'table') defaultValue = { rows: [['', ''], ['', '']] };
        if (type === 'drawing') {
            defaultValue = '';
            setActiveDrawingId(newId);
        }
        setBlocks([...blocks, { id: newId, type, value: defaultValue, preview: null, file: null }]);
    };

    const removeBlock = (id) => {
        saveHistory();
        if (blocks.length === 1) {
            setBlocks([{ id: Date.now(), type: 'text', value: '' }]);
            return;
        }
        setBlocks(blocks.filter(b => b.id !== id));
    };

    const updateBlock = (id, field, value) => {
        setBlocks(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
    };

    const toggleSelectBlock = (id) => {
        setBlocks(prev => prev.map(b => b.id === id ? { ...b, selected: !b.selected } : b));
    };

    const removeSelectedBlocks = () => {
        const count = blocks.filter(b => b.selected).length;
        if (count === 0) return;
        saveHistory();
        const remaining = blocks.filter(b => !b.selected);
        setBlocks(remaining.length > 0 ? remaining : [{ id: Date.now(), type: 'text', value: '' }]);
    };

    const handleBlockFileChange = (id, e) => {
        if (e.target.files && e.target.files[0]) {
            saveHistory();
            const file = e.target.files[0];
            setBlocks(prev => prev.map(b =>
                b.id === id ? { ...b, file: file, preview: URL.createObjectURL(file) } : b
            ));
        }
    };

    const handleSubmitNote = (e) => {
        if (e) e.preventDefault();

        const activeBlocks = blocks.filter(b =>
            (b.type === 'text' && b.value.trim()) ||
            (b.type === 'image' && (b.file || b.value)) ||
            (b.type === 'table') ||
            (b.type === 'drawing' && b.value)
        );

        if (activeBlocks.length === 0) {
            setModal({
                show: true,
                title: 'Prázdna poznámka',
                message: 'Poznámka nesmie byť prázdna. Napíšte niečo, pridajte obrázok, tabuľku alebo kresbu.',
                type: 'info',
                onConfirm: () => setModal(prev => ({ ...prev, show: false }))
            });
            return;
        }

        setSubmitting(true);

        const formData = new FormData();
        const files = [];
        const structure = activeBlocks.map(b => {
            if (b.type === 'text') return { type: 'text', value: b.value };
            if (b.type === 'table') return { type: 'table', value: b.value };
            if (b.type === 'drawing') return { type: 'drawing', value: b.value };
            if (b.type === 'image') {
                if (b.file) {
                    const fileIndex = files.length;
                    files.push(b.file);
                    return { type: 'image', value: `[[FILE_${fileIndex}]]` };
                }
                return { type: 'image', value: b.value };
            }
            return null;
        }).filter(b => b);

        formData.append("content", JSON.stringify(structure));
        formData.append("category", selectedCategory);
        files.forEach(file => formData.append("files", file));

        const request = editingNoteId
            ? axios.put(`${API_URL}/api/notes/${editingNoteId}`, formData, { headers: authHeader() })
            : axios.post(`${API_URL}/api/notes`, formData, { headers: authHeader() });

        request
            .then(() => {
                setBlocks([{ id: Date.now(), type: 'text', value: '' }]);
                setEditingNoteId(null);
                setSubmitting(false);
                fetchNotes();
                setNotesActiveTab('browse');
                historyRef.current = [];
                setCanUndo(false);
                setModal({
                    show: true,
                    title: 'Úspešne uložené',
                    message: editingNoteId ? 'Poznámka bola úspešne aktualizovaná!' : 'Poznámka bola úspešne uložená!',
                    type: 'info',
                    onConfirm: () => setModal(prev => ({ ...prev, show: false }))
                });
            })
            .catch((error) => {
                console.error("Error saving note:", error);
                setSubmitting(false);
                setModal({
                    show: true,
                    title: 'Chyba',
                    message: 'Chyba pri ukladaní poznámky. Skontrolujte pripojenie k serveru.',
                    type: 'danger',
                    onConfirm: () => setModal(prev => ({ ...prev, show: false }))
                });
            });
    };

    const startEditNote = (e, note) => {
        e.stopPropagation();
        try {
            const parsed = JSON.parse(note.content);
            setBlocks(parsed.map(b => ({
                id: Date.now() + Math.random(),
                type: b.type,
                value: b.value,
                preview: b.type === 'image' ? getFileUrl(b.value) : null,
                file: null
            })));
            setSelectedCategory(note.category || "Všeobecné");
            setEditingNoteId(note.id);
            setNotesActiveTab('write');
            historyRef.current = [];
            setCanUndo(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error("Parse error:", err);
        }
    };

    const renderNotePreview = (content) => {
        try {
            const blocks = JSON.parse(content);
            if (Array.isArray(blocks)) {
                let text = "";
                let firstImage = null;
                blocks.forEach(b => {
                    if (b.type === 'text') text += b.value + " ";
                    if (b.type === 'table') text += "[Tabuľka] ";
                    if (b.type === 'drawing') text += "[Kresba] ";
                    if (b.type === 'image' && !firstImage) firstImage = b.value;
                });
                return { text: text.trim(), image: firstImage };
            }
        } catch (e) { }
        return { text: content, image: null };
    };

    const getFileUrl = (value) => {
        if (!value) return "";
        if (value.startsWith('data:image') || value.startsWith('http')) return value;
        return `${API_URL}/uploads/${value}`;
    };

    const renderFullContent = (content) => {
        try {
            const blocksArr = JSON.parse(content);
            if (Array.isArray(blocksArr)) {
                return (
                    <div className="space-y-6">
                        {blocksArr.map((b, i) => (
                            <div key={i}>
                                {b.type === 'text' && (
                                    <div className="whitespace-pre-wrap leading-relaxed text-slate-300">{b.value}</div>
                                )}
                                {b.type === 'table' && b.value && b.value.rows && (
                                    <div className="my-4 overflow-x-auto rounded-xl border border-white/10 bg-black/20">
                                        <table className="w-full border-collapse">
                                            <tbody>
                                                {b.value.rows.map((row, rIdx) => (
                                                    <tr key={rIdx} className="border-b border-white/5 last:border-0">
                                                        {row.map((cell, cIdx) => (
                                                            <td key={cIdx} className="p-3 text-sm text-slate-300 border-r border-white/5 last:border-0 min-w-[100px]">
                                                                {cell}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                {b.type === 'drawing' && (
                                    <div className="my-4 rounded-2xl overflow-hidden border border-white/5 bg-black/5 shadow-inner">
                                        <img
                                            src={getFileUrl(b.value)}
                                            alt="Kresba"
                                            className="max-w-full h-auto mx-auto"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    </div>
                                )}
                                {b.type === 'image' && (
                                    <div className="my-4 rounded-2xl overflow-hidden border border-white/5 bg-black/20 text-center relative group/img">
                                        <img
                                            src={getFileUrl(b.value)}
                                            alt=""
                                            className="max-w-full h-auto inline-block"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                );
            }
        } catch (e) { }
        return <div className="whitespace-pre-wrap text-slate-300">{content}</div>;
    };

    const handleDownloadPDF = (note) => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return alert("Please allow popups for PDF download");

        let contentHtml = "";
        try {
            const blocksArr = JSON.parse(note.content);
            if (Array.isArray(blocksArr)) {
                blocksArr.forEach(b => {
                    if (b.type === 'text') {
                        contentHtml += `<div class="text-block">${b.value}</div>`;
                    } else if (b.type === 'table' && b.value.rows) {
                        contentHtml += `<div class="table-container"><table><tbody>`;
                        b.value.rows.forEach(row => {
                            contentHtml += `<tr>`;
                            row.forEach(cell => { contentHtml += `<td>${cell}</td>`; });
                            contentHtml += `</tr>`;
                        });
                        contentHtml += `</tbody></table></div>`;
                    } else if (b.type === 'drawing') {
                        contentHtml += `<div class="drawing-container"><img src="${getFileUrl(b.value)}" /></div>`;
                    } else if (b.type === 'image') {
                        contentHtml += `<div class="image-container"><img src="${getFileUrl(b.value)}" /></div>`;
                    }
                });
            } else {
                contentHtml = `<div class="text-block">${note.content}</div>`;
            }
        } catch (e) {
            contentHtml = `<div class="text-block">${note.content}</div>`;
        }

        printWindow.document.write(`
            <html>
                <head>
                    <title>${note.category || 'Poznámka'}</title>
                    <style>
                        body { font-family: 'Helvetica', 'Arial', sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; }
                        h1 { color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 10px; font-size: 24px; }
                        .meta { color: #64748b; font-size: 12px; margin-bottom: 30px; }
                        .text-block { line-height: 1.6; white-space: pre-wrap; font-size: 14px; margin-bottom: 20px; color: #334155; }
                        .table-container { margin: 20px 0; width: 100%; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; }
                        table { width: 100%; border-collapse: collapse; background: #fff; }
                        td { border: 1px solid #e2e8f0; padding: 12px; font-size: 13px; color: #475569; }
                        .image-container, .drawing-container { margin: 25px 0; max-width: 100%; text-align: center; }
                        img { max-width: 100%; height: auto; border-radius: 8px; }
                        @media print {
                            body { -webkit-print-color-adjust: exact; }
                            .table-container, .image-container, .drawing-container { break-inside: avoid; }
                        }
                    </style>
                </head>
                <body>
                    <h1>${note.category || 'Všeobecné'}</h1>
                    <div class="meta">Vytvorené: ${new Date(note.createdAt).toLocaleDateString('sk-SK')}</div>
                    ${contentHtml}
                    <script>
                        window.onload = function() {
                           setTimeout(() => {
                                window.print();
                                window.close();
                           }, 1000);
                        }
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    const handleDeleteNote = (id) => {
        setSelectedNote(null);
        setModal({
            show: true,
            title: 'Odstrániť poznámku?',
            message: 'Naozaj chcete vymazať túto poznámku? Táto akcia je nevratná.',
            type: 'danger',
            onConfirm: () => {
                axios.delete(`${API_URL}/api/notes/${id}`, { headers: authHeader() })
                    .then(() => {
                        fetchNotes();
                        setSelectedNote(null);
                        setModal(prev => ({ ...prev, show: false }));
                    });
            }
        });
    };

    const updateTableCell = (blockId, rIdx, cIdx, val) => {
        setBlocks(prev => prev.map(b => {
            if (b.id === blockId) {
                const newRows = [...b.value.rows];
                newRows[rIdx] = [...newRows[rIdx]];
                newRows[rIdx][cIdx] = val;
                return { ...b, value: { ...b.value, rows: newRows } };
            }
            return b;
        }));
    };

    const addTableRow = (blockId) => {
        saveHistory();
        setBlocks(prev => prev.map(b => {
            if (b.id === blockId) {
                const colCount = b.value.rows[0].length;
                const newRow = Array(colCount).fill('');
                return { ...b, value: { ...b.value, rows: [...b.value.rows, newRow] } };
            }
            return b;
        }));
    };

    const addTableCol = (blockId) => {
        saveHistory();
        setBlocks(prev => prev.map(b => {
            if (b.id === blockId) {
                const newRows = b.value.rows.map(row => [...row, '']);
                return { ...b, value: { ...b.value, rows: newRows } };
            }
            return b;
        }));
    };

    const removeTableRow = (e, blockId, rIdx) => {
        e.stopPropagation();
        saveHistory();
        setBlocks(prev => prev.map(b => {
            if (b.id === blockId && b.value.rows.length > 1) {
                const newRows = b.value.rows.filter((_, idx) => idx !== rIdx);
                return { ...b, value: { ...b.value, rows: newRows } };
            }
            return b;
        }));
    };

    const removeTableCol = (e, blockId, cIdx) => {
        e.stopPropagation();
        saveHistory();
        setBlocks(prev => prev.map(b => {
            if (b.id === blockId && b.value.rows[0].length > 1) {
                const newRows = b.value.rows.map(row => row.filter((_, idx) => idx !== cIdx));
                return { ...b, value: { ...b.value, rows: newRows } };
            }
            return b;
        }));
    };

    if (loading) return (
        <div className="flex justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="animate-fade-in relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-2">
                <div>
                    <h2 className="text-3xl font-bold" style={{ color: beigeTextColor }}>
                        Moje poznámky
                    </h2>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap gap-1 bg-[#1e293b]/50 p-1 rounded-xl border border-white/5 self-start sm:self-center w-full sm:w-auto mt-2 sm:mt-0 shadow-inner">
                    <button
                        onClick={() => { setNotesActiveTab('write'); setActiveDrawingId(null); }}
                        className={`flex-1 text-center sm:flex-none sm:min-w-[160px] px-5 py-1.5 rounded-xl text-sm font-semibold transition-all ${notesActiveTab === 'write'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                            }`}
                    >
                        Nová poznámka
                    </button>
                    <button
                        onClick={() => setNotesActiveTab('browse')}
                        className={`flex-1 text-center sm:flex-none sm:min-w-[160px] px-5 py-1.5 rounded-xl text-sm font-semibold transition-all ${notesActiveTab === 'browse'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                            }`}
                    >
                        Moje archívy
                    </button>
                </div>
            </div>

            <div className="mt-4">
                {notesActiveTab === 'write' ? (
                    <form onSubmit={handleSubmitNote} className="w-full space-y-4 animate-fade-in group/form h-full">
                        <div className={`sticky top-[0px] z-[30] flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2 justify-between p-2 sm:p-3 bg-[#0f172a]/95 backdrop-blur-md border ${editingNoteId ? 'border-blue-500 shadow-blue-500/20' : 'border-white/5'} rounded-2xl shadow-2xl transition-all`}>
                            <div className="flex items-center gap-1">
                                <h3 className="text-xs font-bold text-slate-400 px-3 uppercase tracking-wider border-r border-white/5 mr-2">
                                    {editingNoteId ? 'Editor' : 'Nový dokument'}
                                </h3>
                                <button type="button" onClick={() => addBlock('text')} className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#15203d] text-slate-300 hover:text-blue-400 rounded-xl transition-all" title="Vložiť text">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                                    <span className="text-[10px] font-bold uppercase tracking-wider hidden lg:inline">Text</span>
                                </button>
                                <button type="button" onClick={() => addBlock('table')} className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#15203d] text-slate-300 hover:text-blue-400 rounded-xl transition-all" title="Vložiť tabuľku">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    <span className="text-[10px] font-bold uppercase tracking-wider hidden lg:inline">Tabuľka</span>
                                </button>
                                <button type="button" onClick={() => addBlock('drawing')} className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#15203d] text-slate-300 hover:text-blue-400 rounded-xl transition-all" title="Vložiť Board">
                                    <PencilIcon className="w-5 h-5" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider hidden lg:inline">Board</span>
                                </button>
                                <button type="button" onClick={() => addBlock('image')} className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#15203d] text-slate-300 hover:text-blue-400 rounded-xl transition-all" title="Vložiť obrázok">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    <span className="text-[10px] font-bold uppercase tracking-wider hidden lg:inline">Obrázok</span>
                                </button>

                                {canUndo && (
                                    <>
                                        <div className="hidden sm:block h-6 w-[1px] bg-slate-700 mx-1"></div>
                                        <button type="button" onClick={performUndo} className="p-2 hover:bg-[#15203d] text-blue-400 hover:text-blue-300 rounded-lg transition-all" title="Späť (Cmd+Z)">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                                        </button>
                                    </>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-between sm:justify-start mt-2 sm:mt-0">
                                <button
                                    type="button"
                                    onClick={removeSelectedBlocks}
                                    disabled={!blocks.some(b => b.selected)}
                                    className={`p-2 rounded-lg transition-all flex items-center gap-2 flex-shrink-0 ${blocks.some(b => b.selected)
                                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30 shadow-lg shadow-red-500/20'
                                        : 'bg-slate-700/30 text-slate-600 border border-white/5 cursor-not-allowed opacity-50'
                                        }`}
                                    title={blocks.some(b => b.selected) ? "Vymazať vybraté" : "Najprv vyberte položky kliknutím na ne"}
                                >
                                    <TrashIcon className="w-4 h-4" />
                                    {blocks.some(b => b.selected) && <span className="text-xs font-bold animate-pulse">{blocks.filter(b => b.selected).length}</span>}
                                </button>

                                <div className="hidden sm:block h-6 w-[1px] bg-slate-700 mx-1"></div>
                                <div className="relative flex-grow sm:flex-grow-0">
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="appearance-none bg-slate-900/50 border border-white/5 rounded-lg py-1.5 px-3 pr-8 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all cursor-pointer"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat} className="bg-[#0f172a]">{cat}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                        <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>

                                <div className="hidden sm:block h-6 w-[1px] bg-slate-700 mx-1"></div>

                                {editingNoteId && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingNoteId(null);
                                            setBlocks([{ id: Date.now(), type: 'text', value: '' }]);
                                            historyRef.current = [];
                                            setCanUndo(false);
                                            setActiveDrawingId(null);
                                        }}
                                        className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                                    >
                                        Zrušiť
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`px-4 py-1.5 ${editingNoteId ? 'bg-blue-600' : 'bg-emerald-600'} hover:opacity-90 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-lg active:scale-95 transition-all flex items-center gap-2`}
                                >
                                    {submitting ? (
                                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        editingNoteId ? <CheckCircleIcon className="w-3 h-3" /> : <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                                    )}
                                    {editingNoteId ? 'Aktualizovať' : 'Uložiť súbor'}
                                </button>
                            </div>
                        </div>

                        <div className="bg-[#0f172a]/40 backdrop-blur-sm rounded-2xl shadow-2xl min-h-[700px] border border-white/5 flex flex-col transition-all">
                            <div className="h-12 border-b border-white/5 bg-slate-900/60 flex items-center px-8 shrink-0">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                                </div>
                            </div>

                            <div className="p-6 md:p-12 lg:p-20 space-y-6 flex-grow overflow-y-auto">
                                {blocks.map((block, idx) => (
                                    <div key={block.id} className={`relative group/block animate-slide-in transition-all pl-12 pr-2 rounded-2xl mb-2 ${block.selected ? 'bg-blue-600/[0.04] ring-1 ring-blue-500/30 shadow-lg shadow-blue-500/5' : 'hover:bg-white/[0.01]'}`}>
                                        <div
                                            className={`absolute left-3 top-4 w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer z-[40] ${block.selected ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-500/40 scale-110' : 'bg-black/40 border-white/20 opacity-0 group-hover/block:opacity-100 hover:border-blue-500 hover:scale-110'}`}
                                            onClick={() => toggleSelectBlock(block.id)}
                                            title="Kliknite pre výber"
                                        >
                                            {block.selected ? (
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                            ) : (
                                                <div className="w-2 h-2 rounded-full bg-blue-500/40" />
                                            )}
                                        </div>

                                        {block.type === 'text' && (
                                            <textarea
                                                className={`w-full bg-transparent border-none p-0 text-slate-200 text-lg leading-relaxed focus:outline-none placeholder:text-slate-600 resize-none overflow-hidden mt-1 transition-opacity ${block.selected ? 'opacity-80' : ''}`}
                                                placeholder={idx === 0 ? "Začnite písať vašu poznámku..." : "Pokračujte v texte..."}
                                                rows={Math.max(1, block.value.split('\n').length)}
                                                value={block.value}
                                                onChange={(e) => updateBlock(block.id, 'value', e.target.value)}
                                                onInput={(e) => {
                                                    e.target.style.height = 'auto';
                                                    e.target.style.height = e.target.scrollHeight + 'px';
                                                }}
                                                style={{ height: 'auto' }}
                                            />
                                        )}

                                        {block.type === 'table' && (
                                            <div className={`my-6 space-y-3 p-4 rounded-3xl border transition-all ${block.selected ? 'bg-blue-600/[0.03] border-blue-500/30' : 'border-white/5 bg-white/[0.02]'} relative group/tablebox`}>
                                                <div className="flex items-center justify-between gap-2 mb-2">
                                                    <div className="flex gap-2">
                                                        <button type="button" onClick={() => addTableRow(block.id)} className="text-[10px] uppercase font-bold text-blue-400 hover:text-white px-3 py-1 border border-blue-500/30 rounded-lg bg-blue-500/10 hover:bg-blue-600 transition-all">+ Riadok</button>
                                                        <button type="button" onClick={() => addTableCol(block.id)} className="text-[10px] uppercase font-bold text-blue-400 hover:text-white px-3 py-1 border border-blue-500/30 rounded-lg bg-blue-500/10 hover:bg-blue-600 transition-all">+ Stĺpec</button>
                                                    </div>
                                                    <button type="button" onClick={() => removeBlock(block.id)} className="text-[10px] uppercase font-bold text-red-400 hover:text-white px-3 py-1 border border-red-500/30 rounded-lg bg-red-500/10 hover:bg-red-600 transition-all">Vymazať tabuľku</button>
                                                </div>
                                                <div className="overflow-x-auto rounded-xl border border-white/10 shadow-lg bg-black/20">
                                                    <table className="w-full border-collapse">
                                                        <tbody>
                                                            {block.value.rows.map((row, rIdx) => (
                                                                <tr key={rIdx} className="group/row">
                                                                    {row.map((cell, cIdx) => (
                                                                        <td key={cIdx} className="border border-white/5 p-0 relative">
                                                                            <input
                                                                                type="text"
                                                                                value={cell}
                                                                                onChange={(e) => updateTableCell(block.id, rIdx, cIdx, e.target.value)}
                                                                                className="w-full bg-transparent p-3 text-sm text-slate-300 focus:bg-blue-500/5 focus:outline-none transition-colors min-w-[120px]"
                                                                                placeholder="Bunka..."
                                                                            />
                                                                            {rIdx === 0 && row.length > 1 && (
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={(e) => removeTableCol(e, block.id, cIdx)}
                                                                                    className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-red-400 bg-red-500/10 hover:bg-red-600 hover:text-white px-1 rounded border border-red-500/30 opacity-0 group-hover/tablebox:opacity-100 transition-opacity whitespace-nowrap"
                                                                                >
                                                                                    VYMAZAŤ
                                                                                </button>
                                                                            )}
                                                                        </td>
                                                                    ))}
                                                                    {row.length > 0 && block.value.rows.length > 1 && (
                                                                        <td className="w-8 border-none opacity-0 group-hover/row:opacity-100 transition-opacity text-center p-1">
                                                                            <button type="button" onClick={(e) => removeTableRow(e, block.id, rIdx)} className="text-red-500/50 hover:text-red-500" title="Vymazať riadok">
                                                                                <TrashIcon className="w-4 h-4" />
                                                                            </button>
                                                                        </td>
                                                                    )}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}

                                        {block.type === 'drawing' && (
                                            <div className="my-8">
                                                {activeDrawingId === block.id ? (
                                                    <CanvasDrawing
                                                        initialValue={block.value}
                                                        onSave={(dataUrl) => {
                                                            saveHistory();
                                                            updateBlock(block.id, 'value', dataUrl);
                                                            setActiveDrawingId(null);
                                                        }}
                                                        onCancel={() => {
                                                            if (!block.value) removeBlock(block.id);
                                                            setActiveDrawingId(null);
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        className={`relative rounded-3xl overflow-hidden border transition-all p-1 group/drawview cursor-pointer ${block.selected ? 'bg-blue-600/[0.05] border-blue-500/40 shadow-xl' : 'bg-slate-900/40 border-white/5'}`}
                                                        onClick={(e) => {
                                                            if (e.altKey || block.selected) {
                                                                e.stopPropagation();
                                                                toggleSelectBlock(block.id);
                                                            } else {
                                                                setActiveDrawingId(block.id);
                                                            }
                                                        }}
                                                    >
                                                        {block.value ? (
                                                            <div className="relative">
                                                                <img src={block.value} alt="Kresba" className="max-w-full h-auto mx-auto border-none" />
                                                                <div className="absolute inset-0 bg-blue-600/0 group-hover/drawview:bg-blue-600/10 transition-all flex items-center justify-center">
                                                                    <div className="opacity-0 group-hover/drawview:opacity-100 bg-[#0f172a] p-3 rounded-full shadow-2xl border border-blue-500/50 scale-75 group-hover/drawview:scale-100 transition-all">
                                                                        <PencilIcon className="w-6 h-6 text-blue-400" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="py-20 text-center flex flex-col items-center gap-3">
                                                                <PencilIcon className="w-12 h-12 text-slate-700" />
                                                                <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Kliknite sem pre kreslenie</span>
                                                            </div>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
                                                            className="absolute top-4 right-4 text-red-400 hover:text-red-300 opacity-0 group-hover/drawview:opacity-100 transition-opacity p-2 hover:bg-red-500/10 rounded-xl border border-red-500/20"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {block.type === 'image' && (
                                            <div className="my-6">
                                                {block.preview ? (
                                                    <div
                                                        className={`relative inline-block group/imgbox max-w-full cursor-pointer transition-all ${block.selected ? 'scale-[0.98]' : ''}`}
                                                        onClick={() => toggleSelectBlock(block.id)}
                                                    >
                                                        <div className={`rounded-2xl overflow-hidden shadow-lg border-2 transition-all ${block.selected ? 'border-blue-500 shadow-blue-500/20' : 'border-white/5'}`}>
                                                            <img src={block.preview} alt="Upload" className={`max-w-full max-h-[500px] object-contain transition-all ${block.selected ? 'opacity-80' : 'group-hover/imgbox:scale-[1.01]'}`} />
                                                            <div className={`absolute top-4 left-4 w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${block.selected ? 'bg-blue-600 border-blue-600 scale-110' : 'bg-slate-900/40 border-white/20 opacity-0 group-hover/imgbox:opacity-100'}`}>
                                                                {block.selected && (
                                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
                                                            className="absolute -top-2 -right-2 bg-red-600/90 hover:bg-red-600 shadow-lg text-white p-1.5 rounded-full opacity-0 group-hover/imgbox:opacity-100 transition-all z-30 hover:scale-110"
                                                        >
                                                            <TrashIcon className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <label className="w-full py-16 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-700/30 hover:border-blue-500/50 transition-all group/up">
                                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleBlockFileChange(block.id, e)} />
                                                            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 group-hover/up:scale-110 transition-transform">
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                                                </svg>
                                                            </div>
                                                            <span className="text-slate-300 font-bold text-lg">Kliknite sem pre výber obrázka</span>
                                                            <span className="text-slate-500 text-sm mt-2">Maximálna veľkosť súboru: 1GB</span>
                                                        </label>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {blocks.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeBlock(block.id)}
                                                className="absolute right-0 top-0 opacity-0 group-hover/block:opacity-100 transition-all p-2 text-red-400/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg z-20"
                                                title="Odstrániť túto časť"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="h-10 bg-slate-900/50 mt-auto border-t border-white/5 flex items-center px-8 justify-end text-[10px] text-slate-500 font-medium uppercase tracking-widest shrink-0">
                                <span>Strana 1 z 1</span>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        {notes.length > 0 ? notes.map(note => {
                            const preview = renderNotePreview(note.content);
                            return (
                                <div
                                    key={note.id}
                                    onClick={() => setSelectedNote(note)}
                                    className="group bg-[#0f172a]/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:border-blue-500/50 transition-all cursor-pointer hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col h-full active:scale-[0.98]"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${note.category && note.category.startsWith("Prednáška") ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" :
                                            note.category && note.category.startsWith("Cvičenie") ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                                                "bg-slate-700 text-slate-300 border border-slate-600"
                                            }`}>
                                            {note.category || "Všeobecné"}
                                        </span>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="min-h-[100px] text-slate-200 leading-relaxed flex-grow relative overflow-hidden max-h-[200px]">
                                        {preview.image && (
                                            <div className="mb-4 rounded-2xl overflow-hidden shadow-md h-32 w-full relative group/cardimg">
                                                <img
                                                    src={getFileUrl(preview.image)}
                                                    alt=""
                                                    className="w-full h-full object-cover opacity-80 transition-transform group-hover/cardimg:scale-110"
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                                            </div>
                                        )}
                                        <div className="line-clamp-4 relative text-sm">
                                            {preview.text.substring(0, 120)}{preview.text.length > 120 ? '...' : ''}
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-800/50 to-transparent"></div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                                        <span className="text-slate-500 text-[10px] italic">
                                            {new Date(note.createdAt).toLocaleDateString('sk-SK')}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={(e) => startEditNote(e, note)}
                                                className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                                                title="Upraviť"
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}
                                                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                title="Vymazať"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                            <span className="text-blue-400 text-[10px] font-bold ml-1 uppercase tracking-wider">Detail</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="col-span-full py-20 text-center bg-[#0f172a]/20 rounded-2xl border border-dashed border-white/5">
                                <NoteIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-500 font-medium">Zatiaľ nemáte žiadne poznámky.</p>
                                <button
                                    onClick={() => setNotesActiveTab('write')}
                                    className="mt-4 text-blue-400 hover:text-blue-300 font-bold transition-colors"
                                >
                                    Vytvoriť prvú poznámku
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {selectedNote && (
                <div className="fixed inset-0 z-[1002] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedNote(null)}>
                    <div className="bg-[#0f172a] border border-white/5 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col relative" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedNote(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-700/50 hover:bg-[#15203d] p-2 rounded-full transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md ${selectedNote.category && selectedNote.category.startsWith("Prednáška") ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" :
                                    selectedNote.category && selectedNote.category.startsWith("Cvičenie") ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                                        "bg-slate-700 text-slate-300 border border-slate-600"
                                    }`}>
                                    {selectedNote.category || "Všeobecné"}
                                </span>
                                <span className="text-slate-500 text-sm">
                                    {new Date(selectedNote.createdAt).toLocaleDateString('sk-SK')}
                                </span>
                            </div>

                            <div className="text-slate-200 text-lg mb-8 outline-none pb-12">
                                {renderFullContent(selectedNote.content)}
                            </div>

                            <div className="flex justify-between items-center pt-6 border-t border-white/5 bg-[#0f172a] sticky bottom-0 z-[10]">
                                <button
                                    onClick={() => handleDownloadPDF(selectedNote)}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium text-sm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>
                                    Stiahnuť PDF
                                </button>

                                <button
                                    onClick={() => handleDeleteNote(selectedNote.id)}
                                    className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors font-medium text-sm"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                    Vymazať poznámku
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotesContent;
