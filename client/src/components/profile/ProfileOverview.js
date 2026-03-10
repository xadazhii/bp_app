import React from "react";
import { FriendsIcon, ChartBarIcon, StarIcon, AwardIcon } from '../common/ProfileIcons';

const ProfileOverview = ({ currentUser, stats, statsLoading, beigeTextColor, onViewClassmates, classmatesLoading, profileImage, setCurrentPage }) => {

    const calculateOverallProgress = () => {
        if (!stats || statsLoading) return 0;
        const totalMaterials = (stats?.lectureStats?.total ?? 0) + (stats?.seminarStats?.total ?? 0);
        const completedMaterials = (stats?.lectureStats?.completed ?? 0) + (stats?.seminarStats?.completed ?? 0);
        if (totalMaterials === 0) return 0;
        return Math.round((completedMaterials / totalMaterials) * 100);
    };

    return (
        <div className="space-y-8">
            <header className="bg-[#0f172a]/40 backdrop-blur-sm border border-white/5 rounded-2xl shadow-lg p-5 sm:p-8">
                <h2 className="text-3xl font-bold tracking-wide mb-6 pb-6 border-b border-white/5" style={{ color: beigeTextColor }}>
                    Môj profil
                </h2>
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-6 sm:gap-10">
                    {/* Photo Container */}
                    <div className="relative shrink-0 transition-transform duration-300 hover:scale-105">
                        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-blue-600/30 shadow-2xl">
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
                    </div>

                    {/* Content Container: Name -> Email -> Blue Button -> Yellow Button */}
                    <div className="flex-1 w-full flex flex-col items-center sm:items-start text-center sm:text-left">
                        <div className="inline-flex flex-col items-center sm:items-center">
                            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-1" style={{ color: beigeTextColor }}>
                                {currentUser.username}
                            </h1>
                            <p className="text-base sm:text-lg text-slate-400 font-medium break-all mb-6">
                                {currentUser.email}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                <button
                                    onClick={onViewClassmates}
                                    className="w-full sm:w-auto sm:min-w-[180px] px-6 py-2 bg-blue-600 text-white text-sm sm:text-base font-bold rounded-xl shadow-lg shadow-blue-900/40 hover:bg-blue-700 hover:shadow-blue-500/30 transition-all duration-200 active:scale-95 flex items-center justify-center gap-3"
                                    disabled={classmatesLoading}
                                >
                                    <FriendsIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-100" />
                                    {classmatesLoading ? 'Načítava sa...' : 'Moji spolužiaci'}
                                </button>

                                <button
                                    onClick={() => setCurrentPage('achievements')}
                                    className="w-full sm:w-auto sm:min-w-[180px] px-6 py-2 bg-white/5 border border-white/10 text-slate-200 text-sm sm:text-base font-bold rounded-xl shadow-sm hover:bg-white/10 hover:text-white transition-all duration-200 active:scale-95 flex items-center justify-center gap-3 backdrop-blur-sm"
                                >
                                    <AwardIcon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
                                    Moje úspechy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#0f172a]/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6 shadow-lg transition hover:border-blue-500/50">
                    <h2 className="text-lg sm:text-xl font-bold flex items-center mb-4" style={{ color: beigeTextColor }}>
                        <ChartBarIcon className="mr-3 text-blue-400" />Môj progres
                    </h2>
                    <p className="text-5xl sm:text-6xl font-bold text-center" style={{ color: beigeTextColor }}>
                        {statsLoading ? '...' : calculateOverallProgress()}<span className="text-3xl sm:text-4xl text-slate-400">%</span>
                    </p>
                </div>
                <div className="bg-[#0f172a]/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6 shadow-lg transition hover:border-blue-500/50">
                    <h2 className="text-lg sm:text-xl font-bold flex items-center mb-4" style={{ color: beigeTextColor }}>
                        <StarIcon className="mr-3 text-blue-400" />Počet bodov
                    </h2>
                    <p className="text-5xl sm:text-6xl font-bold text-center" style={{ color: beigeTextColor }}>
                        {statsLoading ? '...' : (stats?.testStats?.totalPoints ?? 0)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProfileOverview;
