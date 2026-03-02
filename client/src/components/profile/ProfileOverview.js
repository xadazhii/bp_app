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
            <header className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold tracking-wide mb-6 pb-6 border-b border-slate-700" style={{ color: beigeTextColor }}>
                    Môj profil
                </h2>
                <div className="flex items-start justify-start gap-8">
                    {/* Profile picture */}
                    <div className="relative shrink-0 transition-transform duration-300 hover:scale-105">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-blue-600/30 shadow-2xl">
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
                    {/* User details */}
                    <div className="flex-1 min-w-0">
                        <div className="inline-flex flex-col items-center">
                            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-center w-full" style={{ color: beigeTextColor }}>
                                {currentUser.username}
                            </h1>
                            <p className="mt-1 text-lg text-slate-400 font-medium text-center w-full">
                                {currentUser.email}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-6">
                                <button
                                    onClick={onViewClassmates}
                                    className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-900/40 hover:bg-blue-700 hover:shadow-blue-500/30 transition-all duration-200 active:scale-95 flex items-center gap-2"
                                    disabled={classmatesLoading}
                                >
                                    <FriendsIcon className="w-5 h-5 text-blue-100" />
                                    {classmatesLoading ? 'Načítava sa...' : 'Moji spolužiaci'}
                                </button>
                                <button
                                    onClick={() => setCurrentPage('achievements')}
                                    className="px-6 py-2.5 bg-amber-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-amber-900/40 hover:bg-amber-700 hover:shadow-amber-500/30 transition-all duration-200 active:scale-95 flex items-center gap-2"
                                >
                                    <AwardIcon className="w-5 h-5 text-amber-100" />
                                    Moje úspechy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-lg transition hover:border-blue-500/50">
                    <h2 className="text-xl font-bold flex items-center mb-4" style={{ color: beigeTextColor }}>
                        <ChartBarIcon className="mr-3 text-blue-400" />Môj progres
                    </h2>
                    <p className="text-6xl font-bold text-center" style={{ color: beigeTextColor }}>
                        {statsLoading ? '...' : calculateOverallProgress()}<span className="text-4xl text-slate-400">%</span>
                    </p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-lg transition hover:border-blue-500/50">
                    <h2 className="text-xl font-bold flex items-center mb-4" style={{ color: beigeTextColor }}>
                        <StarIcon className="mr-3 text-blue-400" />Počet bodov
                    </h2>
                    <p className="text-6xl font-bold text-center" style={{ color: beigeTextColor }}>
                        {statsLoading ? '...' : (stats?.testStats?.totalPoints ?? 0)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProfileOverview;
