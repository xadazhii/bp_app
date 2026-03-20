import React from 'react';
import { TrashIcon, SearchIcon } from './AdminIcons';

export const UserManagement = ({ adminCtx, roles }) => {
    const {
        users, userSearchQuery, adminEmail
    } = adminCtx.state;

    const filteredUsers = users.filter(user =>
                                user.username.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                                user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
                            );

                            return (
                                <div className="space-y-8 animate-fade-in pb-12">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-2xl sm:text-3xl font-bold text-blue-400 truncate">Správa používateľov</h2>
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <SearchIcon className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Hľadať používateľa"
                                            value={userSearchQuery}
                                            onChange={(e) => adminCtx.setState({ userSearchQuery: e.target.value })}
                                            className="block w-full pl-12 pr-4 py-2.5 bg-[#0f172a]/50 border border-white/5 rounded-2xl text-xs md:text-base font-medium text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-inner"
                                        />
                                        {userSearchQuery && (
                                            <button
                                                onClick={() => adminCtx.setState({ userSearchQuery: "" })}
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    {}
                                    <div className="overflow-x-auto rounded-[1.25rem] border border-white/5 shadow-xl bg-[#0f172a]/20 backdrop-blur-md">
                                        <table className="min-w-full">
                                            <thead>
                                                <tr className="bg-[#0f172a]/60 border-b border-white/5">
                                                    <th className="px-3 md:px-6 py-3.5 md:py-4 text-left text-slate-500 font-bold uppercase tracking-widest text-[8px] md:text-[11px]">Používateľ</th>
                                                    <th className="px-2 md:px-6 py-3.5 md:py-4 text-center text-slate-500 font-bold uppercase tracking-widest text-[8px] md:text-[11px]">Rola</th>
                                                    <th className="pl-2 pr-3 md:px-6 py-3.5 md:py-4 text-right text-slate-500 font-bold uppercase tracking-widest text-[8px] md:text-[11px]">Akcie</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-700/30">
                                                {filteredUsers.map((user) => (
                                                    <tr key={user.id} className="hover:bg-[#15203d]/20 transition-all group">
                                                        <td className="px-3 md:px-6 py-2 md:py-3">
                                                            <div className="flex items-center gap-2 md:gap-3">
                                                                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-[#15203d]/60 flex items-center justify-center text-slate-300 font-black text-[10px] md:text-xs relative flex-shrink-0">
                                                                    {user.username.substring(0, 2).toUpperCase()}
                                                                    <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-slate-800 ${user.role === 'admin' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="font-bold text-white text-[11px] md:text-sm group-hover:text-blue-400 transition-colors uppercase tracking-tight leading-none truncate">{user.username}</div>
                                                                    <div className="text-[9px] md:text-xs text-slate-500 truncate italic mt-0.5 md:mt-1 leading-tight">{user.email}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-2 md:px-6 py-2 md:py-3 text-center">
                                                            <select
                                                                value={user.role}
                                                                onChange={(e) => adminCtx.handleRoleChange(user.id, e.target.value)}
                                                                disabled={user.email === adminEmail && adminEmail !== ""}
                                                                className={`inline-block bg-[#0f172a]/40 border border-white/5 rounded-lg px-1.5 md:px-3 py-1 md:py-1.5 focus:ring-1 focus:ring-blue-500/40 transition-all text-[9px] md:text-xs font-black uppercase tracking-wider outline-none ${(user.email === adminEmail && adminEmail !== "") ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[#0f172a]'} ${user.role === 'admin' ? 'text-blue-400' : 'text-emerald-400'}`}
                                                            >
                                                                {roles.map((role) => (
                                                                    <option key={role} value={role}>{role}</option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td className="pl-2 pr-3 md:px-6 py-2 md:py-3 text-right">
                                                            <button
                                                                onClick={() => adminCtx.handleDeleteUser(user.id)}
                                                                disabled={user.email === adminEmail && adminEmail !== ""}
                                                                className={`inline-flex items-center justify-center gap-1.5 p-1.5 md:px-3.5 md:py-2 rounded-lg transition-all duration-300 text-[10px] font-black uppercase tracking-widest border ${(user.email === adminEmail && adminEmail !== "") ? 'bg-slate-800/20 text-slate-500 border-white/5 cursor-not-allowed opacity-50' : 'bg-rose-500/5 hover:bg-rose-600 text-rose-500 hover:text-white border-rose-500/10 hover:border-rose-500 active:scale-95'}`}
                                                                title={(user.email === adminEmail && adminEmail !== "") ? "Hlavného administrátora nie je možné odstrániť" : "Odstrániť"}
                                                            >
                                                                <TrashIcon className="w-3.5 h-3.5" />
                                                                <span className="hidden md:inline">Odstrániť</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {filteredUsers.length === 0 && (
                                        <div className="py-12 text-center bg-[#0f172a]/20 backdrop-blur-sm border-t border-white/5">
                                            <div className="w-12 h-12 bg-[#0f172a]/50 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <SearchIcon className="w-6 h-6 text-slate-600" />
                                            </div>
                                            <h3 className="text-sm font-bold text-slate-300">Žiadne výsledky</h3>
                                            <p className="text-slate-500 text-[11px]">Skúste zmeniť vyhľadávanie.</p>
                                        </div>
                                    )}
                                </div>
                            );
};
