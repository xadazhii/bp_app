import React, { useState, useRef } from "react";
import authHeader from "../../services/auth-header";
import heic2any from "heic2any";
import { UserCircleIcon, KeyIcon, CameraIcon, ExclamationTriangleIcon, CheckCircleIcon } from '../common/ProfileIcons';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const SettingsContent = ({ currentUser, beigeTextColor, profileImage, onImageChange }) => {
    const fileInputRef = useRef(null);
    const [newUsername, setNewUsername] = useState(currentUser?.username || "");
    const [pseudonym, setPseudonym] = useState(currentUser?.pseudonym || "");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
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
                };
                img.onerror = () => {
                    alert("Tento obrázok nie je podporovaný alebo je poškodený.");
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Vyskytla sa chyba pri spracovaní obrázka:", error);
            alert("Chyba spracovania: " + (error.message || error.toString()));
        } finally {
            event.target.value = '';
        }
    };

    const handleUsernameUpdate = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsError(false);
        setUserLoading(true);

        if (!newUsername || newUsername.trim() === "") {
            setMessage("Chyba: Používateľské meno nemôže byť prázdne.");
            setIsError(true);
            setUserLoading(false);
            return;
        }

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
                setMessage(data.message || "Meno bolo úspešne zmenené!");

                const user = JSON.parse(localStorage.getItem("user"));
                user.username = newUsername;
                if (data.accessToken) {
                    user.accessToken = data.accessToken;
                }
                localStorage.setItem("user", JSON.stringify(user));

                // Notify other components if they're listening
                setTimeout(() => window.location.reload(), 1500);
            } else {
                setMessage(data.message || "Nepodarilo sa zmeniť meno.");
                setIsError(true);
            }
        } catch (error) {
            setMessage(`Chyba: ${error.message}`);
            setIsError(true);
        } finally {
            setUserLoading(false);
        }
    };

    const handlePseudonymUpdate = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsError(false);
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
                setMessage(data.message || "Pseudonym bol úspešne zmenený!");

                const user = JSON.parse(localStorage.getItem("user"));
                user.pseudonym = pseudonym;
                localStorage.setItem("user", JSON.stringify(user));

                setTimeout(() => window.location.reload(), 1500);
            } else {
                setMessage(data.message || "Nepodarilo sa zmeniť pseudonym.");
                setIsError(true);
            }
        } catch (error) {
            setMessage(`Chyba: ${error.message}`);
            setIsError(true);
        } finally {
            setUserLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsError(false);
        setLoading(true);

        if (!oldPassword || !newPassword || !confirmPassword) {
            setMessage("Chyba: Vyplňte všetky polia.");
            setIsError(true);
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage("Chyba: Nové heslá sa nezhodujú!");
            setIsError(true);
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setMessage("Chyba: Heslo musí mať aspoň 6 znakov.");
            setIsError(true);
            setLoading(false);
            return;
        }

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
                setMessage(data.message || "Heslo bolo úspešne aktualizované!");
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
            setMessage(`Chyba: ${error.message}`);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10 w-full">
            <header>
                <h2 className="text-3xl font-bold tracking-tight" style={{ color: beigeTextColor }}>Nastavenia a profil</h2>
            </header>

            {}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {}
                <div className="space-y-6">
                    {}
                    <div className="bg-[#0f172a]/40 border border-white/5 rounded-3xl p-6 shadow-xl backdrop-blur-sm">
                        {message && !isError && (
                            <div className="p-3 mb-4 rounded-xl text-xs font-medium bg-green-900/20 text-green-300 border border-green-500/30 flex items-center gap-2">
                                <CheckCircleIcon className="w-4 h-4" />
                                {message}
                            </div>
                        )}
                        <div className="flex items-center gap-6">
                            <div className="relative group shrink-0">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-blue-600/30 shadow-2xl relative transition-transform duration-300 group-hover:scale-105">
                                    {profileImage ? (
                                        <img
                                            src={profileImage}
                                            alt=""
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = '/images/default-avatar.svg'; }}
                                        />
                                    ) : (
                                        <img src="/images/default-avatar.svg" alt="" className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <button
                                    onClick={handlePhotoClick}
                                    className="absolute -bottom-1 -right-1 bg-blue-600 p-2 rounded-full shadow-lg border-2 border-slate-800 hover:bg-blue-500 transition-all duration-200 active:scale-90"
                                >
                                    <CameraIcon className="w-4 h-4 text-white" />
                                </button>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold mb-3 flex items-center text-blue-400">
                                    <CameraIcon className="w-5 h-5 mr-2" />
                                    Foto profilu
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={handlePhotoClick}
                                        className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all active:scale-95"
                                    >
                                        Zmeniť
                                    </button>
                                    {profileImage && (
                                        <button
                                            onClick={() => onImageChange(null)}
                                            className="px-4 py-2 bg-slate-700 text-slate-300 text-sm font-bold rounded-xl border border-slate-600 hover:bg-slate-600 transition-all active:scale-95"
                                        >
                                            Odstrániť
                                        </button>
                                    )}
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".jpg,.jpeg,.png,.gif,.webp" className="hidden" />
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="bg-[#0f172a]/40 border border-white/5 rounded-3xl p-6 shadow-xl backdrop-blur-sm">
                        <h3 className="text-lg font-bold mb-4 flex items-center text-blue-400">
                            <UserCircleIcon className="w-5 h-5 mr-2" />
                            Meno používateľa
                        </h3>
                        {message && isError && (
                            <div className="p-3 mb-4 rounded-xl text-xs font-medium bg-red-900/20 text-red-300 border border-red-500/30 flex items-center gap-2">
                                <ExclamationTriangleIcon className="w-4 h-4" />
                                {message}
                            </div>
                        )}
                        <form onSubmit={handleUsernameUpdate} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Nové meno</label>
                                <input
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-900/50 border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100 text-sm transition-all"
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

                    {}
                    <div className="bg-[#0f172a]/40 border border-white/5 rounded-3xl p-6 shadow-xl backdrop-blur-sm">
                        <h3 className="text-lg font-bold mb-4 flex items-center text-emerald-400">
                            <UserCircleIcon className="w-5 h-5 mr-2" />
                            Plynulosť (Pseudonym)
                        </h3>
                        <form onSubmit={handlePseudonymUpdate} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Váš pseudonym (v rebríčku)</label>
                                <input
                                    type="text"
                                    value={pseudonym}
                                    onChange={(e) => setPseudonym(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-900/50 border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-100 text-sm transition-all"
                                    placeholder="Zadajte pseudonym"
                                />
                                <p className="text-[10px] text-slate-500 mt-1 italic">
                                    Tento pseudonym bude viditeľný pre ostatných študentov v rebríčku namiesto vášho mena.
                                </p>
                            </div>
                            <button
                                type="submit"
                                disabled={userLoading}
                                className={`w-full bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/20 active:scale-95 flex items-center justify-center gap-2 ${userLoading ? 'opacity-50' : 'hover:bg-emerald-700'}`}
                            >
                                {userLoading ? "Ukladá sa..." : "Uložiť pseudonym"}
                            </button>
                        </form>
                    </div>
                </div>

                {}
                <div className="bg-[#0f172a]/40 border border-white/5 rounded-3xl p-6 shadow-xl backdrop-blur-sm flex flex-col">
                    <h3 className="text-lg font-bold mb-4 flex items-center text-blue-400">
                        <KeyIcon className="w-5 h-5 mr-3" />
                        Zmeniť heslo
                    </h3>

                    {message && (
                        <div className={`p-3 mb-4 rounded-xl text-xs font-medium flex items-center gap-2 border ${isError ? 'bg-red-900/20 text-red-300 border-red-500/30' : 'bg-green-900/20 text-green-300 border-green-500/30'}`}>
                            {isError ? <ExclamationTriangleIcon className="w-4 h-4" /> : <CheckCircleIcon className="w-4 h-4" />}
                            {message}
                        </div>
                    )}

                    <form onSubmit={handlePasswordUpdate} className="grid grid-cols-1 gap-4 flex-1">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Aktuálne heslo</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Aktuálne heslo"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="w-full pl-4 pr-10 py-2.5 rounded-xl border bg-slate-900/50 border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100 text-sm transition-all"
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
                                className="w-full px-4 py-2.5 rounded-xl border bg-slate-900/50 border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100 text-sm transition-all"
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
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-blue-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${loading ? 'opacity-50' : 'hover:bg-blue-700'}`}
                            >
                                {loading ? "Aktualizuje sa..." : "Zmeniť heslo"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SettingsContent;
