export default function Health() {
  const score = 85
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-6">Health Metrics</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Large score + summary */}
          <div className="md:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6l-2 2m6-6l2 2 3-3" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-zinc-600 dark:text-zinc-300">Overall Health Score</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Based on compliance & activity</div>
              </div>
            </div>

            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="text-6xl font-light text-zinc-900 dark:text-white">{score}</div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Good</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
                <div className="text-xs text-zinc-500">Steps</div>
                <div className="text-lg font-semibold">8,420</div>
                <div className="text-xs text-green-600 mt-1">+12% vs yesterday</div>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
                <div className="text-xs text-zinc-500">Sleep</div>
                <div className="text-lg font-semibold">7h 12m</div>
                <div className="text-xs text-amber-600 mt-1">Quality: Fair</div>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
                <div className="text-xs text-zinc-500">Active Minutes</div>
                <div className="text-lg font-semibold">48 min</div>
                <div className="text-xs text-zinc-500 mt-1">Goal: 30 min</div>
              </div>
            </div>
          </div>

          {/* Right: Risk Monitoring */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-medium text-zinc-900 dark:text-white">Risk Monitoring</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">AI-powered health insights</p>

            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500" aria-hidden />
                <span className="text-sm text-zinc-700 dark:text-zinc-200">No concerning patterns detected</span>
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500" aria-hidden />
                <span className="text-sm text-zinc-700 dark:text-zinc-200">Medication compliance on track</span>
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-3 w-3 items-center justify-center rounded-full bg-amber-500" aria-hidden />
                <span className="text-sm text-zinc-700 dark:text-zinc-200">Reminder: Stay hydrated throughout the day</span>
              </li>
            </ul>

            <div className="mt-6">
              <div className="text-xs text-zinc-500">Medication adherence</div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-3 mt-2">
                <div className="h-3 rounded-full bg-emerald-500" style={{ width: '92%' }} />
              </div>
              <div className="text-xs text-zinc-500 mt-2">Hydration</div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-3 mt-2">
                <div className="h-3 rounded-full bg-amber-500" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Vitals row */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg p-4 shadow-sm">
            <div className="text-xs text-zinc-500">Heart Rate</div>
            <div className="text-2xl font-semibold mt-2">72 bpm</div>
            <div className="text-xs text-zinc-500 mt-1">Resting</div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg p-4 shadow-sm">
            <div className="text-xs text-zinc-500">Blood Pressure</div>
            <div className="text-2xl font-semibold mt-2">120/78</div>
            <div className="text-xs text-zinc-500 mt-1">Normal</div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg p-4 shadow-sm">
            <div className="text-xs text-zinc-500">Blood Glucose</div>
            <div className="text-2xl font-semibold mt-2">98 mg/dL</div>
            <div className="text-xs text-zinc-500 mt-1">Fasting</div>
          </div>
        </div>
      </div>
    </div>
  )
}