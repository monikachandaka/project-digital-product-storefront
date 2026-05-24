import { FiDownload, FiFileText } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function AdminReports() {
  const handleDownload = (reportName) => {
    toast.success(`Generating ${reportName}... Download will start shortly.`)
  }

  const reports = [
    { title: 'Monthly Sales Report', description: 'Comprehensive breakdown of sales and revenue for the current month.' },
    { title: 'Annual Financial Summary', description: 'Year-to-date financial overview including creator payouts.' },
    { title: 'User Growth Analytics', description: 'Export of user registration and activity data.' },
    { title: 'Product Performance', description: 'Sales data, views, and conversion rates per product.' },
    { title: 'Creator Earnings Export', description: 'Detailed list of creator balances and payout history.' },
    { title: 'Tax & Compliance', description: 'Platform fee collection and relevant tax data.' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Reports & Exports</h1>
        <p className="text-sm text-stone-500 mt-1">Generate and download platform data reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, idx) => (
          <div key={idx} className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between h-full hover:border-purple-500/50 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <FiFileText className="text-lg" />
              </div>
              <h3 className="font-bold text-stone-900 dark:text-white mb-2">{report.title}</h3>
              <p className="text-sm text-stone-500 mb-6">{report.description}</p>
            </div>
            <button 
              onClick={() => handleDownload(report.title)}
              className="w-full flex items-center justify-center gap-2 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl transition-colors text-sm font-medium"
            >
              <FiDownload /> Export CSV
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
