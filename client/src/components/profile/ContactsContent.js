import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { EnvelopeIcon, PhoneIcon, OfficeIcon } from '../common/ProfileIcons';

const ContactsContent = ({ beigeTextColor, currentUser }) => {
    const [message, setMessage] = useState({
        name: currentUser?.username || "",
        email: currentUser?.email || "",
        text: ""
    });
    const [showAlert, setShowAlert] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMessage((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        emailjs.send(
            "service_mks4h7q",
            "template_kq6h9vk",
            {
                from_name: message.name,
                reply_to: message.email,
                message: message.text,
            },
            "66HOGV_BzxfI4lLwh"
        )
            .then(() => {
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 5000);
                setMessage((prev) => ({ ...prev, text: "" }));
            })
            .catch((err) => {
                console.error("EmailJS error:", err);
            });
    };

    return (
        <div className="space-y-10">
            {showAlert && (
                <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4
              bg-[#0f172a]/90 backdrop-blur-md text-slate-100 rounded-2xl shadow-xl
              border border-white/5 animate-slide-in">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-blue-400"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="font-medium text-base">Správa bola úspešne odoslaná</p>
                </div>
            )}

            <h2 className="text-3xl font-bold mb-6" style={{ color: beigeTextColor }}>Kontakty</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#0f172a]/50 p-6 rounded-2xl shadow-xl border border-white/5 flex flex-col items-center justify-center text-center">
                    <div className="mb-6">
                        <h4 className="text-2xl font-bold mb-1" style={{ color: beigeTextColor }}>Učiteľ</h4>
                        <p className="text-lg text-slate-300">doc. Ing. Miloš Orgoň, PhD.</p>
                    </div>

                    <div className="space-y-5 text-left w-full">
                        <div className="flex items-center">
                            <PhoneIcon className="w-6 h-6 text-blue-400 flex-shrink-0 mr-4" />
                            <div>
                                <h5 className="text-md font-medium text-slate-200">Telefón</h5>
                                <p className="text-md text-slate-400">+421 2 60291 414</p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <EnvelopeIcon className="w-6 h-6 text-blue-400 flex-shrink-0 mr-4" />
                            <div>
                                <h5 className="text-md font-medium text-slate-200">E-mail</h5>
                                <p className="text-md text-slate-400">kristina.adazhii58@gmail.com</p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <OfficeIcon className="w-6 h-6 text-blue-400 flex-shrink-0 mr-4" />
                            <div>
                                <h5 className="text-md font-medium text-slate-200">Kabinet</h5>
                                <p className="text-md text-slate-400">D113</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0f172a]/50 p-6 rounded-2xl shadow-xl border border-white/5">
                    <h4 className="text-2xl font-bold text-beige mb-4 text-center" style={{ color: beigeTextColor }}>Odoslať správu</h4>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Vaše meno</label>
                            <input
                                type="text"
                                name="name"
                                value={message.name}
                                onChange={handleChange}
                                required
                                className="block w-full rounded-lg border-white/10 bg-[#15203d] text-slate-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="Zadajte vaše meno"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Váš e-mail</label>
                            <input
                                type="email"
                                name="email"
                                value={message.email}
                                readOnly
                                className="block w-full rounded-lg border-white/5 bg-[#15203d]/50 text-slate-400 cursor-not-allowed"
                                placeholder="Zadajte váš e-mail"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Správa</label>
                            <textarea
                                name="text"
                                value={message.text}
                                onChange={handleChange}
                                rows="4"
                                required
                                className="block w-full rounded-lg border-white/10 bg-[#15203d] text-slate-100 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Napíšte vašu správu"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 rounded-lg text-base font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                            Odoslať
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactsContent;
