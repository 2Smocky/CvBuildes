import React, { useEffect, useState } from "react";
import { getStats, getLogs, getWeeklyGrowth, getUsers } from "../../services/adminService";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "../style/dashboard_stats.css";

export default function DashboardStats() {
    const [stats, setStats] = useState(null);
    const [recentLogs, setRecentLogs] = useState([]);
    const [growthData, setGrowthData] = useState([]);
    const [usersMap, setUsersMap] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch stats, logs, growth data, and users in parallel
                const [statsData, logsData, chartData, usersData] = await Promise.all([
                    getStats(),
                    getLogs(),
                    getWeeklyGrowth(),
                    getUsers()
                ]);

                setStats(statsData);
                setRecentLogs(logsData.slice(0, 5)); // Get top 5 recent logs
                setGrowthData(chartData);

                // Create a lookup dictionary for users
                const uMap = {};
                usersData.forEach(u => {
                    uMap[u.id] = { name: u.name, email: u.email };
                });
                setUsersMap(uMap);
                
            } catch (err) {
                console.error(err);
                setError("No se pudieron cargar las estadísticas");
            }
        };

        fetchData();
    }, []);

    // Helper function to extract user ID from details and format the text
    const formatLogDetails = (details) => {
        if (!details) return "Acción registrada en el sistema";
        
        // Search for user ID pattern
        const match = details.match(/usuario ([a-zA-Z0-9]+)$/);
        if (match) {
            const userId = match[1];
            const textWithoutId = details.replace(` el usuario ${userId}`, "");
            
            if (usersMap[userId]) {
                const userName = usersMap[userId].name || "Sin Nombre";
                return `${textWithoutId} el usuario ${userName}`;
            }
        }
        
        return details;
    };

    if (error) return <p className="error-text">{error}</p>;
    if (!stats) return <p className="loading-text">Cargando...</p>;

    return (
        <div className="dashboard-container">
            <h2>Dashboard Analytics</h2>

            {/* Top Cards with Trends */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total usuarios</h3>
                    <div className="stat-value">{stats.totalUsers}</div>
                    <div className="stat-trend positive">▲ +12% esta semana</div>
                </div>
                <div className="stat-card">
                    <h3>Total borradores</h3>
                    <div className="stat-value">{stats.totalDrafts}</div>
                    <div className="stat-trend positive">▲ +24% esta semana</div>
                </div>
                <div className="stat-card">
                    <h3>Tasa de retención</h3>
                    <div className="stat-value">68%</div>
                    <div className="stat-trend positive">▲ +3% esta semana</div>
                </div>
                <div className="stat-card">
                    <h3>Créditos consumidos</h3>
                    <div className="stat-value">{stats.totalConsumedCredits || 0}</div>
                    <div className="stat-trend negative">▼ -2% esta semana</div>
                </div>
            </div>

            {/* Bottom Section: Chart + Timeline */}
            <div className="dashboard-bottom-section">
                
                {/* Chart */}
                <div className="chart-container glass-panel">
                    <h3>Nuevos Registros (Últimos 7 días)</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={growthData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorUsuarios" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4dc0b5" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#4dc0b5" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                            <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#111a1f', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                itemStyle={{ color: '#4dc0b5' }}
                            />
                            <Area type="monotone" dataKey="usuarios" stroke="#4dc0b5" strokeWidth={3} fillOpacity={1} fill="url(#colorUsuarios)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Timeline */}
                <div className="timeline-container glass-panel">
                    <h3>Actividad Reciente</h3>
                    <div className="timeline-list">
                        {recentLogs.length > 0 ? recentLogs.map((log) => (
                            <div key={log.id} className="timeline-item">
                                <div className="timeline-dot"></div>
                                <div className="timeline-content">
                                    <p className="timeline-action">{log.action}</p>
                                    <p className="timeline-details">{formatLogDetails(log.details)}</p>
                                    <span className="timeline-date">
                                        {new Date(log.timestamp).toLocaleString([], { 
                                            year: 'numeric', month: 'short', day: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray">No hay actividad reciente</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
