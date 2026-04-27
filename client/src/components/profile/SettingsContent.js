import React, { useState, useRef } from "react";
import authHeader from "../../services/auth-header";
import heic2any from "heic2any";
import { UserCircleIcon, KeyIcon, CameraIcon, ExclamationTriangleIcon, CheckCircleIcon, IdentificationIcon } from '../common/ProfileIcons';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const SettingsContent = ({ currentUser, beigeTextColor, profileImage, onImageChange, setModal, showMessage }) => {
    const fileInputRef = useRef(null);
    const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN');
    const isSystemAdmin = currentUser?.isSystemAdmin;
    const [newUsername, setNewUsername] = useState(currentUser?.username || "");
    const [pseudonym, setPseudonym] = useState(currentUser?.pseudonym || "");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [userLoading, setUserLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handlePhotoClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        let file = event.target.files[0];
        if (!file) return;

        try {

            if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
                try {
                    const convertedBlob = await heic2any({
                        blob: file,
                        toType: "image/jpeg",
                        quality: 0.8
                    });
                    const blobToUse = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
                    file = new File([blobToUse], file.name.replace(/\.heic$/i, ".jpg"), { type: "image/jpeg" });
                } catch (heicError) {
                    console.error("heic2any conversion failed:", heicError);
                }
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const MAX_WIDTH = 400;
                    const MAX_HEIGHT = 400;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);
                    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);

                    onImageChange(dataUrl);
                    if (showMessage) showMessage("Profilové foto bolo aktualizované!", "success");
                };
                img.onerror = () => {
                    if (showMessage) showMessage("Tento obrázok nie je podporovaný alebo je poškodený.", "error");
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Vyskytla sa chyba pri spracovaní obrázka:", error);
            if (showMessage) showMessage("Chyba spracovania: " + (error.message || error.toString()), "error");
        } finally {
            event.target.value = '';
        }
    };

    const executeUsernameUpdate = async () => {
        setUserLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/users/${currentUser.id}/username`, {
                method: "PUT",
                headers: {
                    ...authHeader(),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: newUsername }),
            });

            const data = await response.json();
            if (response.ok) {
                if (showMessage) showMessage(data.message || "Meno bolo úspešne zmenené!", "success");

                const user = JSON.parse(localStorage.getItem("user"));
                user.username = newUsername;
                if (data.accessToken || data.token) {
                    user.token = data.accessToken || data.token;
                }
                localStorage.setItem("user", JSON.stringify(user));

                currentUser.username = newUsername;
            } else {
                if (showMessage) showMessage(data.message || "Nepodarilo sa zmeniť meno.", "error");
            }
        } catch (error) {
            if (showMessage) showMessage(`Chyba: ${error.message}`, "error");
        } finally {
            setUserLoading(false);
        }
    };

    const handleUsernameUpdate = (e) => {
        e.preventDefault();
        if (!newUsername || newUsername.trim() === "") {
            if (showMessage) showMessage("Chyba: Používateľské meno nemôže byť prázdne.", "error");
            return;
        }
        if (newUsername.trim() === currentUser?.username) {
            if (showMessage) showMessage("Zadané meno je identické s vaším aktuálnym menom.", "error");
            return;
        }
        setModal({
            show: true,
            type: 'info',
            title: "Potvrdenie zmeny mena",
            message: `Naozaj chcete zmeniť svoje meno používateľa na "${newUsername}"?`,
            onConfirm: () => {
                setModal(prev => ({ ...prev, show: false }));
                executeUsernameUpdate();
            }
        });
    };

    const executePseudonymUpdate = async () => {
        setUserLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/users/${currentUser.id}/pseudonym`, {
                method: "PUT",
                headers: {
                    ...authHeader(),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ pseudonym }),
            });

            const data = await response.json();
            if (response.ok) {
                if (showMessage) showMessage(data.message || "Pseudonym bol úspešne zmenený!", "success");

                const user = JSON.parse(localStorage.getItem("user"));
                user.pseudonym = pseudonym;
                localStorage.setItem("user", JSON.stringify(user));

                currentUser.pseudonym = pseudonym;
            } else {
                if (showMessage) showMessage(data.message || "Nepodarilo sa zmeniť pseudonym.", "error");
            }
        } catch (error) {
            if (showMessage) showMessage(`Chyba: ${error.message}`, "error");
        } finally {
            setUserLoading(false);
        }
    };

    const handlePseudonymUpdate = (e) => {
        e.preventDefault();

        if (pseudonym.trim() === currentUser?.pseudonym) {
            if (showMessage) showMessage("Zadaný pseudonym je identický s vaším aktuálnym pseudonymom.", "error");
            return;
        }

        setModal({
            show: true,
            type: 'info',
            title: "Potvrdenie zmeny pseudonymu",
            message: `Naozaj chcete zmeniť svoj pseudonym na "${pseudonym}"?`,
            onConfirm: () => {
                setModal(prev => ({ ...prev, show: false }));
                executePseudonymUpdate();
            }
        });
    };

    const executePasswordUpdate = async () => {
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/users/${currentUser.id}/password`, {
                method: "PUT",
                headers: {
                    ...authHeader(),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            if (response.ok) {
                const data = await response.json();
                if (showMessage) showMessage(data.message || "Heslo bolo úspešne aktualizované!", "success");
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                const contentType = response.headers.get("content-type");
                let errorText;
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const errorData = await response.json();
                    errorText = errorData.message || `Chyba stavu: ${response.status}. Nepodarilo sa aktualizovať heslo.`;
                } else {
                    errorText = await response.text() || `Chyba stavu: ${response.status}. Neznáma odpoveď servera.`;
                }
                throw new Error(errorText);
            }

        } catch (error) {
            if (showMessage) showMessage(`Chyba: ${error.message}`, "error");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = (e) => {
        e.preventDefault();

        if (!oldPassword || !newPassword || !confirmPassword) {
            if (showMessage) showMessage("Chyba: Vyplňte všetky polia.", "error");
            return;
        }
        if (newPassword !== confirmPassword) {
            if (showMessage) showMessage("Chyba: Nové heslá sa nezhodujú!", "error");
            return;
        }
        if (newPassword.length < 6) {
            if (showMessage) showMessage("Chyba: Heslo musí mať aspoň 6 znakov.", "error");
            return;
        }
        if (oldPassword === newPassword) {
            if (showMessage) showMessage("Chyba: Nové heslo sa nesmie zhodovať s aktuálnym heslom.", "error");
            return;
        }
        setModal({
            show: true,
            type: 'danger',
            iconType: 'warning',
            title: "Potvrdenie zmeny hesla",
            message: "Naozaj chcete zmeniť svoje súčasné heslo? Táto akcia je nevratná.",
            confirmText: "Zmeniť heslo",
            onConfirm: () => {
                setModal(prev => ({ ...prev, show: false }));
                executePasswordUpdate();
            }
        });
    };

    return (
        <div className="space-y-10 w-full text-left">
            <header>
                <h2 className="text-3xl font-bold tracking-tight" style={{ color: beigeTextColor }}>Nastavenia a profil</h2>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {}
                <div className="space-y-8">
                    {}
                    <div className="bg-slate-800/10 border border-white/5 rounded-3xl p-6 shadow-xl backdrop-blur-sm">
                        <div className="flex flex-col sm:flex-row items-center gap-8">
                            <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
                                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-blue-500 to-indigo-500 shadow-2xl transition-transform duration-300 group-hover:scale-105">
                                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-800 border-4 border-[#0f172a] relative">
                                        {profileImage ? (
                                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-75" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-800">
                                                <UserCircleIcon className="w-16 h-16 sm:w-20 sm:h-20 text-slate-600" />
                                            </div>
                                        )}

                                        {}
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <CameraIcon className="w-8 h-8 text-white drop-shadow-md" />
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-blue-600 p-2 rounded-full border-4 border-[#0f172a] shadow-lg group-hover:bg-blue-500 transition-colors">
                                    <CameraIcon className="w-4 h-4 text-white" />
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <h3 className="text-lg font-bold flex items-center gap-2 text-blue-400">
                                        <CameraIcon className="w-5 h-5" />
                                        Foto profilu
                                    </h3>
                                </div>

                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4">
                                    <button
                                        onClick={handlePhotoClick}
                                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2 text-xs"
                                    >
                                        <CameraIcon className="w-4 h-4" />
                                        Nové foto
                                    </button>
                                    <button
                                        onClick={() => setModal({
                                            show: true,
                                            title: "Odstrániť?",
                                            message: "Chcete odstrániť profilové foto?",
                                            onConfirm: () => {
                                                onImageChange(null);
                                                if (showMessage) showMessage("Profilové foto bolo odstránené.", "success");
                                                setModal({ show: false });
                                            },
                                            type: 'danger'
                                        })}
                                        className="px-5 py-2 bg-slate-800/50 hover:bg-slate-700 text-slate-400 font-bold rounded-xl transition-all text-xs border border-white/5"
                                    >
                                        Odstrániť
                                    </button>
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".jpg,.jpeg,.png,.gif,.webp" className="hidden" />
                            </div>
                        </div>
                    </div>

                    {}
                    {isAdmin ? (
                        <div className="bg-slate-800/10 border border-white/5 rounded-3xl p-6 shadow-xl backdrop-blur-sm">
                            <h3 className="text-lg font-bold mb-4 flex items-center text-blue-400">
                                <UserCircleIcon className="w-5 h-5 mr-2" />
                                Meno používateľa
                            </h3>
                            <form onSubmit={handleUsernameUpdate} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Nové meno</label>
                                    <input
                                        type="text"
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        disabled={isSystemAdmin}
                                        className="w-full px-4 py-2.5 rounded-xl border bg-[#0f172a] border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100 text-sm transition-all"
                                        placeholder="Zadajte nové meno"
                                        required
                                    />
                                    {isSystemAdmin && <p className="text-[10px] text-amber-500/70 mt-1 italic">Meno systémového administrátora je možné zmeniť iba v konfigurácii servera.</p>}
                                </div>
                                <button
                                    type="submit"
                                    disabled={userLoading || isSystemAdmin}
                                    className={`w-full bg-blue-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center justify-center gap-2 ${userLoading || isSystemAdmin ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                                >
                                    {userLoading ? "Ukladá sa..." : "Uložiť zmenu mena"}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-slate-800/10 border border-white/5 rounded-3xl p-6 shadow-xl backdrop-blur-sm flex flex-col">
                            <h3 className="text-lg font-bold mb-4 flex items-center text-blue-400">
                                <KeyIcon className="w-5 h-5 mr-3" />
                                Zmeniť heslo
                            </h3>

                            <form onSubmit={handlePasswordUpdate} className="grid grid-cols-1 gap-4 flex-1">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Aktuálne heslo</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Aktuálne heslo"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            className="w-full pl-4 pr-10 py-2.5 rounded-xl border bg-[#0f172a] border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100 text-sm transition-all"
                                            required
                                        />
                                        <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white">
                                            {showPassword ? <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg> : <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zM9.5 6.5a3.5 3.5 0 00-3.5 3.5a.5.5 0 01-1 0a4.5 4.5 0 014.5-4.5a.5.5 0 010 1zM10.928 9.072a.5.5 0 01.527.527l-4.288 4.288a.5.5 0 01-.527-.527l4.288-4.288z" clipRule="evenodd" /></svg>}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Nové heslo</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Min. 6 znakov"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border bg-[#0f172a] border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100 text-sm transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Potvrdenie</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Zopakujte heslo"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border bg-[#0f172a] border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100 text-sm transition-all"
                                        required
                                    />
                                </div>
                                <div className="pt-2">
                                    {isSystemAdmin && <p className="text-[10px] text-amber-500/70 mb-3 italic text-center">Heslo systémového administrátora je možné zmeniť iba v konfigurácii servera.</p>}
                                    <button
                                        type="submit"
                                        disabled={loading || isSystemAdmin}
                                        className={`w-full bg-blue-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${loading || isSystemAdmin ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                                    >
                                        {loading ? "Aktualizuje sa..." : "Zmeniť heslo"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {}
                <div className="space-y-8">
                    {}
                    {isAdmin ? (
                        <div className="bg-slate-800/10 border border-white/5 rounded-3xl p-6 shadow-xl backdrop-blur-sm flex flex-col">
                            <h3 className="text-lg font-bold mb-4 flex items-center text-blue-400">
                                <KeyIcon className="w-5 h-5 mr-3" />
                                Zmeniť heslo
                            </h3>

                            <form onSubmit={handlePasswordUpdate} className="grid grid-cols-1 gap-4 flex-1">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Aktuálne heslo</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Aktuálne heslo"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            className="w-full pl-4 pr-10 py-2.5 rounded-xl border bg-[#0f172a] border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100 text-sm transition-all"
                                            required
                                        />
                                        <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white">
                                            {showPassword ? <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg> : <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zM9.5 6.5a3.5 3.5 0 00-3.5 3.5a.5.5 0 01-1 0a4.5 4.5 0 014.5-4.5a.5.5 0 010 1zM10.928 9.072a.5.5 0 01.527.527l-4.288 4.288a.5.5 0 01-.527-.527l4.288-4.288z" clipRule="evenodd" /></svg>}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Nové heslo</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Min. 6 znakov"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border bg-[#0f172a] border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100 text-sm transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Potvrdenie</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Zopakujte heslo"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border bg-slate-900/50 border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100 text-sm transition-all"
                                        required
                                    />
                                </div>
                                <div className="pt-2">
                                    {isSystemAdmin && <p className="text-[10px] text-amber-500/70 mb-3 italic text-center">Heslo systémového administrátora je možné zmeniť iba v konfigurácii servera.</p>}
                                    <button
                                        type="submit"
                                        disabled={loading || isSystemAdmin}
                                        className={`w-full bg-blue-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${loading || isSystemAdmin ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                                    >
                                        {loading ? "Aktualizuje sa..." : "Zmeniť heslo"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="bg-slate-800/10 border border-white/5 rounded-3xl p-6 shadow-xl backdrop-blur-sm">
                                <h3 className="text-lg font-bold mb-4 flex items-center text-blue-400">
                                    <UserCircleIcon className="w-5 h-5 mr-2" />
                                    Meno používateľa
                                </h3>
                                <form onSubmit={handleUsernameUpdate} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Nové meno</label>
                                        <input
                                            type="text"
                                            value={newUsername}
                                            onChange={(e) => setNewUsername(e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border bg-[#0f172a] border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100 text-sm transition-all"
                                            placeholder="Zadajte nové meno"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={userLoading}
                                        className={`w-full bg-blue-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center justify-center gap-2 ${userLoading ? 'opacity-50' : 'hover:bg-blue-700'}`}
                                    >
                                        {userLoading ? "Ukladá sa..." : "Uložiť zmenu mena"}
                                    </button>
                                </form>
                            </div>

                            <div className="bg-slate-800/10 border border-white/5 rounded-3xl p-6 shadow-xl backdrop-blur-sm">
                                <h3 className="text-lg font-bold mb-4 flex items-center text-blue-400">
                                    <IdentificationIcon className="w-5 h-5 mr-2" />
                                    Plynulosť (Pseudonym)
                                </h3>
                                <form onSubmit={handlePseudonymUpdate} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Váš pseudonym (v rebríčku)</label>
                                        <input
                                            type="text"
                                            value={pseudonym}
                                            onChange={(e) => setPseudonym(e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border bg-[#0f172a] border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100 text-sm transition-all"
                                            placeholder="Zadajte pseudonym"
                                        />
                                        <p className="text-[10px] text-slate-500 mt-1 italic">
                                            Tento pseudonym bude viditeľný pre ostatných študentov v rebríčku namiesto vášho mena.
                                        </p>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={userLoading}
                                        className={`w-full bg-blue-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center justify-center gap-2 ${userLoading ? 'opacity-50' : 'hover:bg-blue-700'}`}
                                    >
                                        {userLoading ? "Ukladá sa..." : "Uložiť pseudonym"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsContent;