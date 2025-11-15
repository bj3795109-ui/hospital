"use client"

import React, { useEffect, useState } from 'react'
import api from '@/lib/axios'

export default function Reward() {
    const [points, setPoints] = useState<number>(0)
    const [redemptions, setRedemptions] = useState<any[]>([])

    useEffect(() => {
        async function load() {
            try {
                const res = await api.get('/rewards')
                setPoints(res.data.account?.points || 0)
                setRedemptions(res.data.redemptions || [])
            } catch (err) {
                console.warn('Failed to load rewards', err)
            }
        }
        load()
    }, [])

    async function handleRedeem(cost: number) {
        try {
            const res = await api.post('/rewards/redeem', { cost })
            if (res.data?.success) {
                setPoints(res.data.account?.points || 0)
                setRedemptions((r) => [res.data.voucher, ...(r || [])])
                alert(`Redeemed: ${res.data.voucher.code}`)
            }
        } catch (err: any) {
            alert(err?.response?.data?.error || 'Redeem failed')
        }
    }

    const [claimed, setClaimed] = useState<Record<string, boolean>>({})

    async function handleClaim(ach: { key: string; points: number; title: string; unlocked: boolean }) {
        if (!ach.unlocked) return
        if (claimed[ach.key]) return
        try {
            const res = await api.post('/rewards/award', { points: ach.points })
            if (res.data?.success) {
                setPoints(res.data.account?.points || 0)
                setClaimed((c) => ({ ...(c || {}), [ach.key]: true }))
                alert(`Claimed ${ach.points} pts for ${ach.title}`)
            }
        } catch (err: any) {
            alert(err?.response?.data?.error || 'Claim failed')
        }
    }

    const AchievementCard = ({ ach }: { ach: any }) => {
        const isClaimed = !!claimed[ach.key]
        return (
            <div className={`rounded-xl shadow p-4 flex flex-col ${ach.style} dark:bg-zinc-900`}>
                <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                        <span className="bg-gray-300 dark:bg-zinc-700 rounded-full p-1">
                            {/* simple icon */}
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="#888" d="M12 2a1 1 0 0 1 1 1v1h6a1 1 0 0 1 1 1v2a5 5 0 0 1-4 4.9V13a4 4 0 0 1-8 0v-1.1A5 5 0 0 1 4 7V5a1 1 0 0 1 1-1h6V3a1 1 0 0 1 1-1z"/></svg>
                        </span>
                        <span className={`font-medium ${ach.unlocked ? 'text-green-700 dark:text-green-200' : 'text-gray-700 dark:text-gray-200'}`}>{ach.title}</span>
                    </div>
                    <span className={`font-semibold ${ach.unlocked ? 'text-green-700 dark:text-green-200' : 'text-gray-500 dark:text-gray-400'}`}>{ach.points} pts</span>
                </div>
                <div className={`text-sm mb-2 ${ach.unlocked ? 'text-green-700 dark:text-green-200' : 'text-gray-500 dark:text-gray-400'}`}>{ach.description}</div>
                {typeof ach.progress === 'number' && (
                    <>
                        <div className="w-full h-2 bg-gray-200 dark:bg-zinc-800 rounded-full">
                            <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${ach.progress}%` }}></div>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{ach.progress}% complete</div>
                    </>
                )}
                <div className="mt-3 flex items-center gap-2">
                    {ach.unlocked ? (
                        isClaimed ? (
                            <span className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 px-2 py-0.5 rounded text-xs">Claimed</span>
                        ) : (
                            <button onClick={() => handleClaim(ach)} className="bg-black text-white px-3 py-1 rounded-full text-sm">Claim +{ach.points} pts</button>
                        )
                    ) : null}
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans py-10 px-4 flex flex-col items-center">
            {/* Trophy Icon and Points */}
            <div className="flex flex-col items-center mb-8">
                <div className="bg-gradient-to-tr from-orange-400 to-yellow-300 rounded-full p-5 mb-2">
                    <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M12 2a1 1 0 0 1 1 1v1h6a1 1 0 0 1 1 1v2a5 5 0 0 1-4 4.9V13a4 4 0 0 1-8 0v-1.1A5 5 0 0 1 4 7V5a1 1 0 0 1 1-1h6V3a1 1 0 0 1 1-1zm-7 3v2a3 3 0 0 0 2.4 2.96A1 1 0 0 1 8 11v2a2 2 0 0 0 4 0v-2a1 1 0 0 1 .6-.94A3 3 0 0 0 19 7V5H5zm7 14a6 6 0 0 1-6-6h2a4 4 0 0 0 8 0h2a6 6 0 0 1-6 6z"/></svg>
                </div>
                <div className="text-lg font-semibold text-gray-800 dark:text-white">Reward Points</div>
                <div className="text-3xl font-bold text-orange-500 dark:text-yellow-300">{points} Points</div>
            </div>

            {/* Next Milestone */}
            <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-xl shadow p-5 mb-8">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700 dark:text-gray-200">Next Milestone</span>
                    <span className="font-semibold text-gray-500 dark:text-gray-400">500 points</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-zinc-800 rounded-full mb-2">
                    <div className="h-2 bg-orange-500 rounded-full" style={{ width: `${Math.min(100, (points/500)*100)}%` }}></div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{Math.max(0, 500 - points)} points to go • Unlock premium rewards</div>
            </div>

            {/* Achievements (dynamic, claimable) */}
            <div className="w-full max-w-xl mb-8">
                <div className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Achievements</div>
                <div className="space-y-4">
                    {(() => {
                        const achievements = [
                            {
                                key: '7_day_streak',
                                title: '7-Day Streak',
                                points: 100,
                                description: 'Take all medications for 7 days',
                                progress: 71,
                                unlocked: false,
                                style: 'bg-white',
                            },
                            {
                                key: 'perfect_week',
                                title: 'Perfect Week',
                                points: 150,
                                description: '100% compliance this week',
                                progress: 100,
                                unlocked: true,
                                style: 'bg-green-50',
                            },
                            {
                                key: 'health_champion',
                                title: 'Health Champion',
                                points: 200,
                                description: 'Complete 5 check-ups',
                                progress: 60,
                                unlocked: false,
                                style: 'bg-white',
                            },
                        ];

                        return achievements.map((a) => (
                            <AchievementCard key={a.key} ach={a} />
                        ));
                    })()}
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
                        <button className="bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 px-4 py-1 rounded-full text-sm" disabled>{Math.max(0, 500 - points)} more</button>
                    </div>
                    <div className="flex justify-between items-center bg-white dark:bg-zinc-900 rounded-xl shadow p-4">
                        <div>
                            <div className="font-medium text-gray-700 dark:text-gray-200">Free Video Consultation</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">300 points</div>
                        </div>
                        <button onClick={() => handleRedeem(300)} className="bg-black text-white px-4 py-1 rounded-full text-sm">Redeem</button>
                    </div>
                    <div className="flex justify-between items-center bg-white dark:bg-zinc-900 rounded-xl shadow p-4">
                        <div>
                            <div className="font-medium text-gray-700 dark:text-gray-200">Health Monitor Device Discount</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">1000 points</div>
                        </div>
                        <button className="bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 px-4 py-1 rounded-full text-sm" disabled>{Math.max(0, 1000 - points)} more</button>
                    </div>
                    <div className="flex justify-between items-center bg-white dark:bg-zinc-900 rounded-xl shadow p-4">
                        <div>
                            <div className="font-medium text-gray-700 dark:text-gray-200">Pharmacy Discount</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">200 points</div>
                        </div>
                        <button onClick={() => handleRedeem(200)} className="bg-black text-white px-4 py-1 rounded-full text-sm">Redeem</button>
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

            {/* Redemptions list */}
            <div className="w-full max-w-xl mt-6">
                <div className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Your Vouchers</div>
                <div className="space-y-3">
                    {redemptions.length === 0 ? (
                        <div className="text-sm text-gray-500">No vouchers yet</div>
                    ) : (
                        redemptions.map((v: any) => (
                            <div key={v._id} className="flex justify-between items-center bg-white dark:bg-zinc-900 rounded-xl shadow p-4">
                                <div>
                                    <div className="font-medium text-gray-700 dark:text-gray-200">{v.code}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Cost: {v.cost} pts</div>
                                </div>
                                <div className="text-sm text-gray-500">{new Date(v.createdAt).toLocaleString()}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}