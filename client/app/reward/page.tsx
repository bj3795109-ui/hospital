export default function Reward() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans py-10 px-4 flex flex-col items-center">
            {/* Trophy Icon and Points */}
            <div className="flex flex-col items-center mb-8">
                <div className="bg-gradient-to-tr from-orange-400 to-yellow-300 rounded-full p-5 mb-2">
                    <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M12 2a1 1 0 0 1 1 1v1h6a1 1 0 0 1 1 1v2a5 5 0 0 1-4 4.9V13a4 4 0 0 1-8 0v-1.1A5 5 0 0 1 4 7V5a1 1 0 0 1 1-1h6V3a1 1 0 0 1 1-1zm-7 3v2a3 3 0 0 0 2.4 2.96A1 1 0 0 1 8 11v2a2 2 0 0 0 4 0v-2a1 1 0 0 1 .6-.94A3 3 0 0 0 19 7V5H5zm7 14a6 6 0 0 1-6-6h2a4 4 0 0 0 8 0h2a6 6 0 0 1-6 6z"/></svg>
                </div>
                <div className="text-lg font-semibold text-gray-800 dark:text-white">Reward Points</div>
                <div className="text-3xl font-bold text-orange-500 dark:text-yellow-300">450 Points</div>
            </div>

            {/* Next Milestone */}
            <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-xl shadow p-5 mb-8">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700 dark:text-gray-200">Next Milestone</span>
                    <span className="font-semibold text-gray-500 dark:text-gray-400">500 points</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-zinc-800 rounded-full mb-2">
                    <div className="h-2 bg-orange-500 rounded-full" style={{ width: '90%' }}></div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">50 points to go • Unlock premium rewards</div>
            </div>

            {/* Achievements */}
            <div className="w-full max-w-xl mb-8">
                <div className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Achievements</div>
                <div className="space-y-4">
                    {/* 7-Day Streak */}
                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4 flex flex-col">
                        <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-2">
                                <span className="bg-gray-300 dark:bg-zinc-700 rounded-full p-1">
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="#888" d="M12 2a1 1 0 0 1 1 1v1h6a1 1 0 0 1 1 1v2a5 5 0 0 1-4 4.9V13a4 4 0 0 1-8 0v-1.1A5 5 0 0 1 4 7V5a1 1 0 0 1 1-1h6V3a1 1 0 0 1 1-1z"/></svg>
                                </span>
                                <span className="font-medium text-gray-700 dark:text-gray-200">7-Day Streak</span>
                            </div>
                            <span className="font-semibold text-gray-500 dark:text-gray-400">100 pts</span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Take all medications for 7 days</div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-zinc-800 rounded-full">
                            <div className="h-2 bg-blue-500 rounded-full" style={{ width: '71%' }}></div>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">71% complete</div>
                    </div>
                    {/* Perfect Week */}
                    <div className="bg-green-50 dark:bg-green-900 rounded-xl shadow p-4 flex flex-col border border-green-200 dark:border-green-700">
                        <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-2">
                                <span className="bg-green-500 rounded-full p-1">
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fff"/><path fill="#22c55e" d="M17 9l-5 5-3-3"/></svg>
                                </span>
                                <span className="font-medium text-green-700 dark:text-green-200">Perfect Week</span>
                            </div>
                            <span className="font-semibold text-green-700 dark:text-green-200">150 pts</span>
                        </div>
                        <div className="text-sm text-green-700 dark:text-green-200 mb-2">100% compliance this week</div>
                        <div className="flex items-center gap-2">
                            <span className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 px-2 py-0.5 rounded text-xs">Unlocked</span>
                        </div>
                    </div>
                    {/* Health Champion */}
                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4 flex flex-col">
                        <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-2">
                                <span className="bg-gray-300 dark:bg-zinc-700 rounded-full p-1">
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="#888" d="M12 2a1 1 0 0 1 1 1v1h6a1 1 0 0 1 1 1v2a5 5 0 0 1-4 4.9V13a4 4 0 0 1-8 0v-1.1A5 5 0 0 1 4 7V5a1 1 0 0 1 1-1h6V3a1 1 0 0 1 1-1z"/></svg>
                                </span>
                                <span className="font-medium text-gray-700 dark:text-gray-200">Health Champion</span>
                            </div>
                            <span className="font-semibold text-gray-500 dark:text-gray-400">200 pts</span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Complete 5 check-ups</div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-zinc-800 rounded-full">
                            <div className="h-2 bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">60% complete</div>
                    </div>
                </div>
            </div>

            {/* Available Rewards */}
            <div className="w-full max-w-xl mb-8">
                <div className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Available Rewards</div>
                <div className="space-y-3">
                    <div className="flex justify-between items-center bg-white dark:bg-zinc-900 rounded-xl shadow p-4">
                        <div>
                            <div className="font-medium text-gray-700 dark:text-gray-200">Healthcare Voucher</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">500 points</div>
                        </div>
                        <button className="bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 px-4 py-1 rounded-full text-sm" disabled>50 more</button>
                    </div>
                    <div className="flex justify-between items-center bg-white dark:bg-zinc-900 rounded-xl shadow p-4">
                        <div>
                            <div className="font-medium text-gray-700 dark:text-gray-200">Free Video Consultation</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">300 points</div>
                        </div>
                        <button className="bg-black text-white px-4 py-1 rounded-full text-sm">Redeem</button>
                    </div>
                    <div className="flex justify-between items-center bg-white dark:bg-zinc-900 rounded-xl shadow p-4">
                        <div>
                            <div className="font-medium text-gray-700 dark:text-gray-200">Health Monitor Device Discount</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">1000 points</div>
                        </div>
                        <button className="bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 px-4 py-1 rounded-full text-sm" disabled>550 more</button>
                    </div>
                    <div className="flex justify-between items-center bg-white dark:bg-zinc-900 rounded-xl shadow p-4">
                        <div>
                            <div className="font-medium text-gray-700 dark:text-gray-200">Pharmacy Discount</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">200 points</div>
                        </div>
                        <button className="bg-black text-white px-4 py-1 rounded-full text-sm">Redeem</button>
                    </div>
                </div>
            </div>

            {/* How to earn points */}
            <div className="w-full max-w-xl bg-blue-50 dark:bg-zinc-900 rounded-xl shadow p-5">
                <div className="font-semibold text-gray-700 dark:text-white mb-2 flex items-center gap-2">
                    <span role="img" aria-label="bulb">💡</span> How to earn points:
                </div>
                <ul className="list-disc pl-5 text-gray-700 dark:text-gray-200 text-sm space-y-1">
                    <li>Take medications on time: +10 points</li>
                    <li>Complete daily streak: +20 points</li>
                    <li>Book and attend appointments: +50 points</li>
                    <li>Complete health assessments: +30 points</li>
                    <li>Unlock achievements: Variable points</li>
                </ul>
            </div>
        </div>
    );
}