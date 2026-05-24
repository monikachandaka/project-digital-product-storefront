import { useState, useEffect } from 'react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, LineChart, Line
} from 'recharts'
import { 
  FiUsers, FiShoppingBag, FiBox, FiDollarSign, 
  FiTrendingUp, FiAlertCircle 
} from 'react-icons/fi'
import api from '../../services/api'

const StatCard = ({ title, value, icon: Icon, trend, colorClass }) => (
  <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm relative overflow-hidden group">
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500 ${colorClass}`}></div>
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-stone-900 dark:text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 dark:bg-opacity-20`}>
        <Icon className={`text-xl ${colorClass.replace('bg-', 'text-')}`} />
      </div>
    </div>
    {trend && (
      <div className="flex items-center text-sm">
        <FiTrendingUp className="text-emerald-500 mr-1" />
        <span className="text-emerald-500 font-medium">{trend}%</span>
        <span className="text-stone-400 ml-2">vs last month</span>
      </div>
    )}
  </div>
)

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/admin/analytics')
        setData(res.data)
      } catch (err) {
        console.error('Failed to load analytics', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!data) return <div>Failed to load data.</div>

  const { stats, salesData, userGrowth, topProducts, topCreators } = data

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">Welcome back, here is what is happening today.</p>
        </div>
        <div className="bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-500 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border border-amber-200 dark:border-amber-500/20">
          <FiAlertCircle /> {stats.pendingApprovals} Pending Approvals
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} icon={FiDollarSign} trend="12.5" colorClass="bg-purple-500 text-purple-600 dark:text-purple-400" />
        <StatCard title="Total Orders" value={stats.totalOrders.toLocaleString()} icon={FiShoppingBag} trend="8.2" colorClass="bg-blue-500 text-blue-600 dark:text-blue-400" />
        <StatCard title="Active Buyers" value={stats.totalBuyers.toLocaleString()} icon={FiUsers} trend="15.3" colorClass="bg-emerald-500 text-emerald-600 dark:text-emerald-400" />
        <StatCard title="Total Products" value={stats.totalProducts.toLocaleString()} icon={FiBox} trend="5.4" colorClass="bg-orange-500 text-orange-600 dark:text-orange-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111] p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
          <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-6">Revenue & Sales Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1c1917', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Chart */}
        <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
          <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-6">User Growth</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#333', opacity: 0.1}}
                  contentStyle={{ backgroundColor: '#1c1917', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Bar dataKey="buyers" name="Buyers" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="creators" name="Creators" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
          <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">Top Selling Products</h3>
          <div className="space-y-4">
            {topProducts.map((product, i) => (
              <div key={product.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors border border-transparent hover:border-stone-200 dark:hover:border-stone-800">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
                    #{i + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900 dark:text-white">{product.title}</h4>
                    <p className="text-sm text-stone-500">{product.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-stone-900 dark:text-white">${product.revenue.toLocaleString()}</p>
                  <p className="text-xs text-emerald-500 font-medium">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Creators */}
        <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
          <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">Top Creators</h3>
          <div className="space-y-4">
            {topCreators.map((creator, i) => (
              <div key={creator.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors border border-transparent hover:border-stone-200 dark:hover:border-stone-800">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                    {creator.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900 dark:text-white">{creator.name}</h4>
                    <p className="text-sm text-stone-500">{creator.products} products</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-stone-900 dark:text-white">${creator.earnings.toLocaleString()}</p>
                  <p className="text-xs text-emerald-500 font-medium">Earnings</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
