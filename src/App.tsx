/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Users,
  CheckSquare,
  Stethoscope,
  Sparkles,
  CreditCard,
  Phone,
  MapPin,
  Clock,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Activity,
  Trash2,
  Edit3,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Heart,
  Award,
  BarChart2,
  Download,
  Bell,
  Filter,
  FileSpreadsheet
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface Appointment {
  id: string;
  patientName: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: 'confirmed' | 'completed' | 'pending' | 'cancelled';
  notes?: string;
}

interface Patient {
  id: string;
  name: string;
  phone: string;
  age: number;
  gender: 'male' | 'female';
  lastVisit: string;
  medicalHistory: string;
  totalVisits: number;
}

interface Task {
  id: string;
  title: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  category: 'sterilization' | 'lab' | 'followup' | 'inventory';
}

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    patientName: 'أحمد محمد الصبري',
    phone: '771234567',
    service: 'سحب عصب وتنزيل تلبيسة (تاج)',
    date: new Date().toISOString().split('T')[0],
    time: '09:00 ص',
    status: 'confirmed',
    notes: 'ألم شديد في الضرس السفلي الأيمن'
  },
  {
    id: '2',
    patientName: 'فاطمة عبدالباري أحمد',
    phone: '735987654',
    service: 'تنظيف الأسنان وإزالة الجير',
    date: new Date().toISOString().split('T')[0],
    time: '10:30 ص',
    status: 'completed',
    notes: 'مراجعة دورية كل 6 أشهر'
  },
  {
    id: '3',
    patientName: 'صادق قائد المخلافي',
    phone: '711223344',
    service: 'تركيبات (جسور)',
    date: new Date().toISOString().split('T')[0],
    time: '01:00 م',
    status: 'pending',
    notes: 'قياسات الجسر العلوي'
  },
  {
    id: '4',
    patientName: 'سارة خالد العديني',
    phone: '779988776',
    service: 'حشوات تجميلية',
    date: new Date().toISOString().split('T')[0],
    time: '03:30 م',
    status: 'confirmed',
    notes: 'حشوة تجميلية للأمامي'
  }
];

const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'p1',
    name: 'أحمد محمد الصبري',
    phone: '771234567',
    age: 34,
    gender: 'male',
    lastVisit: '2026-10-02',
    medicalHistory: 'لا حساسية أدوية، ضغط دم معتدل',
    totalVisits: 3
  },
  {
    id: 'p2',
    name: 'فاطمة عبدالباري أحمد',
    phone: '735987654',
    age: 28,
    gender: 'female',
    lastVisit: '2026-10-02',
    medicalHistory: 'لا توجد أمراض مزمنة',
    totalVisits: 5
  },
  {
    id: 'p3',
    name: 'صادق قائد المخلافي',
    phone: '711223344',
    age: 45,
    gender: 'male',
    lastVisit: '2026-09-28',
    medicalHistory: 'مدخن خفيف',
    totalVisits: 2
  },
  {
    id: 'p4',
    name: 'سارة خالد العديني',
    phone: '779988776',
    age: 22,
    gender: 'female',
    lastVisit: '2026-09-15',
    medicalHistory: 'سليمة',
    totalVisits: 1
  },
  {
    id: 'p5',
    name: 'خالد سعيد العبسي',
    phone: '733112233',
    age: 50,
    gender: 'male',
    lastVisit: '2026-09-10',
    medicalHistory: 'سكري خفيف',
    totalVisits: 4
  },
  {
    id: 'p6',
    name: 'أحلام محمد القاضي',
    phone: '711556677',
    age: 31,
    gender: 'female',
    lastVisit: '2026-09-05',
    medicalHistory: 'لا توجد',
    totalVisits: 2
  }
];

const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'فحص وتعقيم أجهزة التعقيم الأوتوكلاف (Autoclave)',
    time: '08:30 ص',
    priority: 'high',
    completed: false,
    category: 'sterilization'
  },
  {
    id: 't2',
    title: 'استلام التيجان والجسور من معمل الأسنان',
    time: '11:00 ص',
    priority: 'high',
    completed: false,
    category: 'lab'
  },
  {
    id: 't3',
    title: 'الاتصال بالمريضة فاطمة للاطمئنان بعد إزالة الجير',
    time: '02:00 م',
    priority: 'medium',
    completed: false,
    category: 'followup'
  },
  {
    id: 't4',
    title: 'جرد مواد الحشوات التجميلية والبنج',
    time: '04:30 م',
    priority: 'low',
    completed: false,
    category: 'inventory'
  }
];

const CLINIC_SERVICES = [
  { id: 's1', title: 'فحص شامل للفم والأسنان - أطقم كاملة وجزئية', desc: 'تقييم دقيق لصحة الفم واللثة والأسنان مع تصميم الأطقم المناسبة.' },
  { id: 's2', title: 'تركيبات (تيجان وجسور) - حشوات فضية وتجميلية', desc: 'إعادة تأهيل الأسنان المتضررة بأحدث المواد الخزفية والتجميلية.' },
  { id: 's3', title: 'خلع الأسنان وبقايا الجذور - معالجة أمراض اللثة', desc: 'خلع جراحي وغير جراحي آمن مع علاج التهابات وأمراض اللثة.' },
  { id: 's4', title: 'تنظيف الأسنان وإزالة الجير - سحب عصب', desc: 'إزالة الترسبات الجيرية وعلاج جذور الأسنان بدقة ومتانة عالية.' }
];

// Recharts datasets
const MONTHLY_VISITS_DATA = [
  { month: 'يناير', visits: 140 },
  { month: 'فبراير', visits: 165 },
  { month: 'مارس', visits: 180 },
  { month: 'أبريل', visits: 210 },
  { month: 'مايو', visits: 235 },
  { month: 'يونيو', visits: 195 },
  { month: 'يوليو', visits: 250 },
  { month: 'أغسطس', visits: 275 },
  { month: 'سبتمبر', visits: 290 },
  { month: 'أكتوبر', visits: 220 },
  { month: 'نوفمبر', visits: 0 },
  { month: 'ديسمبر', visits: 0 },
];

const GENDER_DISTRIBUTION_DATA = [
  { name: 'ذكور', value: 58, color: '#3b82f6' },
  { name: 'إناث', value: 72, color: '#06b6d4' }
];

const SERVICE_POPULARITY_DATA = [
  { name: 'تنظيف الجير', count: 84 },
  { name: 'حشوات تجميلية', count: 72 },
  { name: 'فحص وأطقم', count: 55 },
  { name: 'تركيبات وتيجان', count: 48 },
  { name: 'سحب عصب', count: 40 },
  { name: 'خلع أسنان', count: 32 }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'appointments' | 'patients' | 'tasks' | 'services' | 'analytics' | 'ai' | 'card'>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [appointmentFilter, setAppointmentFilter] = useState<'all' | 'confirmed' | 'completed' | 'pending'>('all');

  // Modal states
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // New Appointment Form
  const [newAppt, setNewAppt] = useState({
    patientName: '',
    phone: '',
    service: CLINIC_SERVICES[0].title,
    date: new Date().toISOString().split('T')[0],
    time: '10:00 ص',
    notes: ''
  });

  // New Patient Form
  const [newPatient, setNewPatient] = useState({
    name: '',
    phone: '',
    age: 30,
    gender: 'male' as 'male' | 'female',
    medicalHistory: ''
  });

  // New Task Form
  const [newTask, setNewTask] = useState({
    title: '',
    time: '12:00 م',
    priority: 'medium' as 'high' | 'medium' | 'low',
    category: 'followup' as Task['category']
  });

  // AI Assistant state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiContextType, setAiContextType] = useState<'treatment_plan' | 'patient_advice' | 'clinical_notes'>('treatment_plan');
  const [aiResult, setAiResult] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Notification calculations
  const urgentTasks = tasks.filter(t => !t.completed && t.priority === 'high');
  const pendingAppointments = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
  const totalNotificationCount = urgentTasks.length + pendingAppointments.length;

  // CSV Export Handlers
  const exportAppointmentsCSV = () => {
    const headers = ['ID,اسم المريض,رقم الهاتف,الخدمة,التاريخ,الوقت,الحالة,ملاحظات'];
    const rows = appointments.map(a => 
      `"${a.id}","${a.patientName}","${a.phone}","${a.service}","${a.date}","${a.time}","${a.status}","${a.notes || ''}"`
    );
    const csvContent = '\uFEFF' + [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `appointments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPatientsCSV = () => {
    const headers = ['ID,اسم المريض,رقم الهاتف,العمر,الجنس,آخر زيارة,التاريخ الطبي,عدد الزيارات'];
    const rows = patients.map(p => 
      `"${p.id}","${p.name}","${p.phone}","${p.age}","${p.gender === 'female' ? 'أنثى' : 'ذكر'}","${p.lastVisit}","${p.medicalHistory}","${p.totalVisits}"`
    );
    const csvContent = '\uFEFF' + [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `patients_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Word Report Export Handler
  const exportWordReport = () => {
    const htmlContent = `
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="utf-8">
        <title>تقرير عيادة الدكتورة نسيبة ياسر العريقي</title>
        <style>
          body { font-family: 'Cairo', Tahoma, sans-serif; padding: 20px; color: #1e293b; }
          h1, h2 { color: #0f2b46; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 30px; }
          th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: right; font-size: 13px; }
          th { background-color: #0284c7; color: white; }
          .meta { text-align: center; margin-bottom: 30px; font-size: 13px; color: #64748b; }
        </style>
      </head>
      <body>
        <h1>عيادة الدكتورة نسيبة ياسر العريقي للأسنان</h1>
        <div class="meta">جامعة السعيد · هاتف: 736615256 · تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}</div>
        
        <h2>جدول المواعيد اليومية</h2>
        <table>
          <tr>
            <th>اسم المريض</th>
            <th>رقم الهاتف</th>
            <th>الخدمة الطبية</th>
            <th>الوقت</th>
            <th>الحالة</th>
          </tr>
          ${appointments.map(a => `
            <tr>
              <td>${a.patientName}</td>
              <td>${a.phone}</td>
              <td>${a.service}</td>
              <td>${a.time}</td>
              <td>${a.status === 'completed' ? 'مكتملة' : a.status === 'confirmed' ? 'مؤكد' : 'قيد الانتظار'}</td>
            </tr>
          `).join('')}
        </table>

        <h2>سجلات المرضى المسجلين</h2>
        <table>
          <tr>
            <th>اسم المريض</th>
            <th>رقم الهاتف</th>
            <th>العمر</th>
            <th>الجنس</th>
            <th>التاريخ الطبي</th>
            <th>عدد الزيارات</th>
          </tr>
          ${patients.map(p => `
            <tr>
              <td>${p.name}</td>
              <td>${p.phone}</td>
              <td>${p.age}</td>
              <td>${p.gender === 'female' ? 'أنثى' : 'ذكر'}</td>
              <td>${p.medicalHistory}</td>
              <td>${p.totalVisits}</td>
            </tr>
          `).join('')}
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clinic_report_${new Date().toISOString().split('T')[0]}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handlers
  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppt.patientName || !newAppt.phone) return;
    const item: Appointment = {
      id: Date.now().toString(),
      ...newAppt,
      status: 'confirmed'
    };
    setAppointments([item, ...appointments]);
    setIsAppointmentModalOpen(false);
    setNewAppt({
      patientName: '',
      phone: '',
      service: CLINIC_SERVICES[0].title,
      date: new Date().toISOString().split('T')[0],
      time: '10:00 ص',
      notes: ''
    });
  };

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.name || !newPatient.phone) return;
    const pat: Patient = {
      id: 'p_' + Date.now(),
      ...newPatient,
      lastVisit: new Date().toISOString().split('T')[0],
      totalVisits: 1
    };
    setPatients([pat, ...patients]);
    setIsPatientModalOpen(false);
    setNewPatient({ name: '', phone: '', age: 30, gender: 'male', medicalHistory: '' });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;
    const t: Task = {
      id: 't_' + Date.now(),
      ...newTask,
      completed: false
    };
    setTasks([t, ...tasks]);
    setIsTaskModalOpen(false);
    setNewTask({ title: '', time: '12:00 م', priority: 'medium', category: 'followup' });
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter(a => a.id !== id));
  };

  const runAiAssistant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiResult('');
    try {
      const res = await fetch('/api/ai/dental-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, contextType: aiContextType })
      });
      const data = await res.json();
      if (data.result) {
        setAiResult(data.result);
      } else {
        setAiResult('عذراً، لم أتمكن من توليد الإجابة. يرجى المحاولة مرة أخرى.');
      }
    } catch (err) {
      setAiResult('فشل الاتصال بالخادم. تأكد من إعدادات المفتاح.');
    } finally {
      setAiLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(a => {
    const matchesSearch = a.patientName.includes(searchQuery) || a.phone.includes(searchQuery);
    const matchesStatus = appointmentFilter === 'all' || a.status === appointmentFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-['Cairo']">
      
      {/* Top Header */}
      <header className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 border-b border-slate-800 sticky top-0 z-30 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand & Doctor Info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  الدكتورة نسيبة ياسر العريقي
                </h1>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  جامعة السعيد
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>ابتسامتك ... صحتك</span>
                <span className="text-slate-600">|</span>
                <span className="flex items-center gap-1 text-cyan-300 font-mono">
                  <Phone className="w-3 h-3" /> 736615256
                </span>
              </p>
            </div>
          </div>

          {/* Quick Actions Header & Notifications Bell */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all cursor-pointer"
                title="التنبيهات والإشعارات"
              >
                <Bell className="w-5 h-5 text-cyan-400" />
                {totalNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold font-mono flex items-center justify-center shadow-md animate-pulse">
                    {totalNotificationCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Panel */}
              {showNotifications && (
                <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <Bell className="w-4 h-4 text-cyan-400" /> التنبيهات والإشعارات العاجلة
                    </h4>
                    <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-800 text-xs">
                    {urgentTasks.length > 0 && (
                      <div className="p-3 bg-rose-500/10">
                        <p className="font-bold text-rose-400 mb-2">المهام العاجلة ({urgentTasks.length})</p>
                        {urgentTasks.map(t => (
                          <div key={t.id} className="py-1 flex items-center justify-between text-slate-200">
                            <span>{t.title}</span>
                            <span className="font-mono text-rose-300">{t.time}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {pendingAppointments.length > 0 && (
                      <div className="p-3 bg-blue-500/10">
                        <p className="font-bold text-blue-400 mb-2">مواعيد قادمة ({pendingAppointments.length})</p>
                        {pendingAppointments.map(a => (
                          <div key={a.id} className="py-1 flex items-center justify-between text-slate-200">
                            <span>{a.patientName} ({a.service})</span>
                            <span className="font-mono text-cyan-300">{a.time}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {totalNotificationCount === 0 && (
                      <div className="p-6 text-center text-slate-500">
                        لا توجد تنبيهات جديدة في الوقت الحالي. كل الأمور مستقرة!
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-slate-800/80 border-t border-slate-700 text-center">
                    <button
                      onClick={() => { setShowNotifications(false); setActiveTab('tasks'); }}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                    >
                      عرض جميع المهام والمواعيد
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsAppointmentModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> موعد جديد
            </button>
            <button
              onClick={() => setActiveTab('card')}
              className="hidden md:flex px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium rounded-xl border border-slate-700 transition-all items-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-cyan-400" /> بطاقة العيادة
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto scrollbar-none border-t border-slate-800/60">
          <div className="flex space-x-reverse space-x-1 py-2">
            {[
              { id: 'appointments', label: 'المواعيد اليومية', icon: CalendarIcon, count: appointments.length },
              { id: 'patients', label: 'سجلات المرضى', icon: Users, count: patients.length },
              { id: 'analytics', label: 'إحصائيات العيادة', icon: BarChart2 },
              { id: 'tasks', label: 'المهام والتذكيرات', icon: CheckSquare, count: tasks.filter(t => !t.completed).length },
              { id: 'services', label: 'الخدمات الطبية', icon: Stethoscope },
              { id: 'ai', label: 'المساعد الذكي (AI)', icon: Sparkles, badge: 'جديد' },
              { id: 'card', label: 'بطاقة العيادة', icon: CreditCard },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isActive ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}>
                      {tab.count}
                    </span>
                  )}
                  {tab.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* TAB 1: APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            
            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-5 shadow-lg flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-medium">مواعيد اليوم</p>
                  <h3 className="text-2xl font-bold font-mono text-white mt-1">{appointments.length}</h3>
                  <span className="text-[11px] text-cyan-400 mt-1 inline-block">جدول اليوم مكتمل ومنتظم</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <CalendarIcon className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-5 shadow-lg flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-medium">المكتملة اليوم</p>
                  <h3 className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                    {appointments.filter(a => a.status === 'completed').length}
                  </h3>
                  <span className="text-[11px] text-emerald-400 mt-1 inline-block">حالات تمت بنجاح</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-5 shadow-lg flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-medium">قيد الانتظار</p>
                  <h3 className="text-2xl font-bold font-mono text-amber-400 mt-1">
                    {pendingAppointments.length}
                  </h3>
                  <span className="text-[11px] text-amber-400 mt-1 inline-block">مرضى في الانتظار</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-5 shadow-lg flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-medium">إجمالي المرضى المسجلين</p>
                  <h3 className="text-2xl font-bold font-mono text-cyan-400 mt-1">{patients.length}</h3>
                  <span className="text-[11px] text-slate-400 mt-1 inline-block">قاعدة بيانات العيادة</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Search, Filter & Exports bar */}
            <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="بحث باسم المريض أو رقم الهاتف..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-10 pl-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
                  <button
                    onClick={exportWordReport}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
                    title="تحميل التقرير كملف Word"
                  >
                    <FileText className="w-4 h-4" /> تقرير Word
                  </button>
                  <button
                    onClick={exportAppointmentsCSV}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                    title="تصدير المواعيد كملف CSV"
                  >
                    <Download className="w-4 h-4" /> تصدير CSV
                  </button>
                  <button
                    onClick={() => setIsAppointmentModalOpen(true)}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> موعد جديد
                  </button>
                </div>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800 overflow-x-auto pb-1">
                <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0">
                  <Filter className="w-3.5 h-3.5 text-cyan-400" /> تصفية حسب الحالة:
                </span>
                {[
                  { id: 'all', label: 'جميع المواعيد' },
                  { id: 'confirmed', label: 'المؤكدة' },
                  { id: 'completed', label: 'المكتملة' },
                  { id: 'pending', label: 'قيد الانتظار / معلق' }
                ].map((filterTab) => (
                  <button
                    key={filterTab.id}
                    onClick={() => setAppointmentFilter(filterTab.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                      appointmentFilter === filterTab.id
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'
                    }`}
                  >
                    {filterTab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Appointments Table / List */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-6 py-4 border-b border-slate-700/80 flex items-center justify-between">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-cyan-400" /> جدول مواعيد العيادة اليومية
                </h3>
                <span className="text-xs text-slate-400 font-mono">النتائج: {filteredAppointments.length}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700 text-xs font-semibold text-slate-400 bg-slate-900/50">
                      <th className="py-3.5 px-6">المريض</th>
                      <th className="py-3.5 px-6">رقم الهاتف</th>
                      <th className="py-3.5 px-6">الخدمة الطبية</th>
                      <th className="py-3.5 px-6">الوقت</th>
                      <th className="py-3.5 px-6">الحالة</th>
                      <th className="py-3.5 px-6 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50 text-sm">
                    {filteredAppointments.map((appt) => (
                      <tr key={appt.id} className="hover:bg-slate-750/50 transition-colors">
                        <td className="py-4 px-6 font-medium text-white">
                          {appt.patientName}
                          {appt.notes && <p className="text-xs text-slate-400 mt-0.5">{appt.notes}</p>}
                        </td>
                        <td className="py-4 px-6 font-mono text-slate-300">{appt.phone}</td>
                        <td className="py-4 px-6 text-cyan-300 font-medium">{appt.service}</td>
                        <td className="py-4 px-6 font-mono text-slate-300">{appt.time}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            appt.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            appt.status === 'confirmed' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            appt.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              appt.status === 'completed' ? 'bg-emerald-400' :
                              appt.status === 'confirmed' ? 'bg-blue-400' :
                              appt.status === 'pending' ? 'bg-amber-400' : 'bg-rose-400'
                            }`} />
                            {appt.status === 'completed' ? 'مكتملة' : appt.status === 'confirmed' ? 'مؤكد' : appt.status === 'pending' ? 'قيد الانتظار' : 'ملغي'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {appt.status !== 'completed' && (
                              <button
                                onClick={() => updateAppointmentStatus(appt.id, 'completed')}
                                title="إتمام الموعد"
                                className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors cursor-pointer"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteAppointment(appt.id)}
                              title="حذف الموعد"
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredAppointments.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-500">لا توجد مواعيد مطابقة لفلتر البحث</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PATIENTS */}
        {activeTab === 'patients' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
              <div className="relative w-full sm:w-96">
                <Search className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="بحث في سجلات المرضى..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={exportWordReport}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
                  title="تحميل التقرير كملف Word"
                >
                  <FileText className="w-4 h-4" /> تقرير Word
                </button>
                <button
                  onClick={exportPatientsCSV}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-sm font-medium rounded-xl border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
                  title="تصدير سجلات المرضى كملف CSV"
                >
                  <Download className="w-4 h-4" /> تصدير CSV
                </button>
                <button
                  onClick={() => setIsPatientModalOpen(true)}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> تسجيل مريض جديد
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {patients
                .filter(p => p.name.includes(searchQuery) || p.phone.includes(searchQuery))
                .map((patient) => (
                  <div key={patient.id} className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-cyan-500/40 transition-all">
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                            {patient.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-base">{patient.name}</h4>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">{patient.phone}</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-mono ${patient.gender === 'female' ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                          {patient.gender === 'female' ? 'أنثى' : 'ذكر'} · {patient.age} سنة
                        </span>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-700/60 space-y-2 text-xs text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-400">التاريخ الطبي:</span>
                          <span className="font-medium text-white">{patient.medicalHistory}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">آخر زيارة:</span>
                          <span className="font-mono text-cyan-300">{patient.lastVisit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">عدد الزيارات:</span>
                          <span className="font-mono font-bold text-white">{patient.totalVisits} زيارات</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">ملف طبي معتمد</span>
                      <button
                        onClick={() => {
                          setAiPrompt(`اكتب تقريراً أو ملاحظة علاجية للمريض: ${patient.name}, التاريخ الطبي: ${patient.medicalHistory}`);
                          setActiveTab('ai');
                        }}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> مساعدة الذكاء الاصطناعي
                      </button>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ANALYTICS & CHARTS */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 p-6 rounded-2xl border border-cyan-500/20 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <BarChart2 className="w-6 h-6 text-cyan-400" /> إحصائيات وتقارير عيادة الدكتورة نسيبة
                </h3>
                <p className="text-sm text-slate-300 mt-2">
                  تحليلات بيانات زيارات المرضى الشهرية وتوزيع الجنسين والخدمات الأكثر طلباً بناءً على سجلات العيادة.
                </p>
              </div>
              <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                <button
                  onClick={exportWordReport}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-4 h-4" /> تقرير Word
                </button>
                <button
                  onClick={exportAppointmentsCSV}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> تصدير المواعيد CSV
                </button>
                <button
                  onClick={exportPatientsCSV}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> تصدير المرضى CSV
                </button>
              </div>
            </div>

            {/* Chart 1: Monthly Patient Visits (Bar Chart) */}
            <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="font-bold text-white text-base">إحصائيات زيارات المرضى الشهرية (2026)</h4>
                  <p className="text-xs text-slate-400 mt-0.5">عدد المراجعين والمرضى لكل شهر</p>
                </div>
                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs font-mono border border-cyan-500/20">
                  إجمالي سنوي مرتفع
                </span>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MONTHLY_VISITS_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                      formatter={(value: any) => [`${value} مريض`, 'الزيارات']}
                    />
                    <Bar dataKey="visits" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Grid for Pie Chart & Service Popularity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Chart 2: Gender Distribution (Pie Chart) */}
              <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-white text-base">توزيع المرضى حسب الجنس</h4>
                  <p className="text-xs text-slate-400 mt-0.5">نسبة الذكور والإناث المراجعين للعيادة</p>
                </div>
                <div className="h-64 w-full flex items-center justify-center my-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={GENDER_DISTRIBUTION_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={6}
                        dataKey="value"
                        label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''}: ${((percent || 0) * 100).toFixed(0)}%`}
                      >
                        {GENDER_DISTRIBUTION_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                        formatter={(value: any) => [`${value} مريض`, 'العدد']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 pt-4 border-t border-slate-700/60 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-slate-300">ذكور (45%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-cyan-400" />
                    <span className="text-slate-300">إناث (55%)</span>
                  </div>
                </div>
              </div>

              {/* Chart 3: Services Popularity (Bar Chart) */}
              <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-white text-base">الخدمات الأكثر طلباً</h4>
                  <p className="text-xs text-slate-400 mt-0.5">عدد العمليات والإجراءات حسب نوع الخدمة</p>
                </div>
                <div className="h-64 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={SERVICE_POPULARITY_DATA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                      <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                      <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{ fontSize: 11 }} width={100} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                        formatter={(value: any) => [`${value} حالة`, 'العدد']}
                      />
                      <Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: TASKS */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
              <div>
                <h3 className="font-bold text-base text-white">المهام اليومية وتذكيرات العيادة</h3>
                <p className="text-xs text-slate-400 mt-0.5">إدارة مهام التعقيم، المعمل، وصيانة الأجهزة الطبية</p>
              </div>
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> إضافة مهمة جديدة
              </button>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`bg-slate-800/70 border rounded-2xl p-4 shadow-md flex items-center justify-between transition-all ${
                    task.completed ? 'border-emerald-500/30 opacity-75' : 'border-slate-700/60 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                    />
                    <div>
                      <h4 className={`font-semibold text-sm sm:text-base ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1 font-mono text-cyan-300">
                          <Clock className="w-3 h-3" /> {task.time}
                        </span>
                        <span>·</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          task.priority === 'high' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          task.priority === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {task.priority === 'high' ? 'أولوية عاجلة' : task.priority === 'medium' ? 'أولوية متوسطة' : 'عادية'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}
                    className="p-2 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SERVICES */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 p-6 rounded-2xl border border-cyan-500/20 shadow-xl">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Stethoscope className="w-6 h-6 text-cyan-400" /> الخدمات والعلاجات المقدمة في العيادة
              </h3>
              <p className="text-sm text-slate-300 mt-2">
                تحت إشراف نخبة من الأطباء بقيادة <strong className="text-cyan-300">الدكتورة نسيبة ياسر العريقي</strong> - جامعة السعيد.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CLINIC_SERVICES.map((serv, index) => (
                <div key={serv.id} className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-cyan-500/40 transition-all">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold font-mono mb-4">
                      0{index + 1}
                    </div>
                    <h4 className="font-bold text-white text-lg">{serv.title}</h4>
                    <p className="text-sm text-slate-300 mt-2 leading-relaxed">{serv.desc}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-cyan-400">
                      <ShieldCheck className="w-4 h-4" /> جودة طبية عالية
                    </span>
                    <button
                      onClick={() => {
                        setAiPrompt(`اكتب خطة علاجية تفصيلية وإرشادات مريضة لخدمة: ${serv.title}`);
                        setActiveTab('ai');
                      }}
                      className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> توليد خطة علاج بالذكاء الاصطناعي
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: AI ASSISTANT */}
        {activeTab === 'ai' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 p-6 rounded-2xl border border-cyan-500/20 shadow-xl flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">المساعد الذكي لعيادة الأسنان</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  مدعوم بنماذج Google Gemini المتقدمة لمساعدة الدكتورة نسيبة في صياغة خطط العلاج، الإرشادات، والملاحظات الطبية.
                </p>
              </div>
            </div>

            <form onSubmit={runAiAssistant} className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">نوع الطلب / السياق الطبي</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'treatment_plan', label: 'خطة علاجية' },
                    { id: 'patient_advice', label: 'إرشادات ما بعد العلاج' },
                    { id: 'clinical_notes', label: 'ملاحظات سريرية' }
                  ].map((type) => (
                    <button
                      type="button"
                      key={type.id}
                      onClick={() => setAiContextType(type.id as any)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                        aiContextType === type.id
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">وصف الحالة أو السؤال الطبي</label>
                <textarea
                  rows={4}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="مثال: مريض يعاني من تسوس عميق في الضرس الأول العلوي مع التهاب بسيط في اللثة..."
                  className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={aiLoading || !aiPrompt.trim()}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  {aiLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>جاري التوليد بالذكاء الاصطناعي...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>توليد المحتوى الطبي</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {aiResult && (
              <div className="bg-slate-800 border border-cyan-500/30 rounded-2xl p-6 shadow-xl space-y-3">
                <h4 className="font-bold text-cyan-400 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4" /> نتيجة التوليد الطبي:
                </h4>
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {aiResult}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: BUSINESS CARD */}
        {activeTab === 'card' && (
          <div className="space-y-8 max-w-3xl mx-auto py-4">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white">بطاقة العيادة الرسمية</h3>
              <p className="text-sm text-slate-400">بناءً على الهوية والبيانات المعتمدة للدكتورة نسيبة ياسر العريقي</p>
            </div>

            {/* Front Card replica */}
            <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 border-2 border-cyan-500/40 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="space-y-3 text-center md:text-right">
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs font-semibold border border-cyan-500/30">
                    تحت إشراف نخبة من الأطباء
                  </span>
                  <h4 className="text-xl sm:text-2xl font-extrabold text-white">تقدم لكم خدمات الأسنان المتكاملة</h4>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">
                    <li>🦷 فحص شامل للفم والأسنان - أطقم كاملة وجزئية</li>
                    <li>🦷 تركيبات (تيجان وجسور) - حشوات فضية وتجميلية</li>
                    <li>🦷 خلع الأسنان وبقايا الجذور - معالجة أمراض اللثة</li>
                    <li>🦷 تنظيف الأسنان وإزالة الجير - سحب عصب</li>
                  </ul>
                </div>

                <div className="bg-slate-900/80 border border-slate-700/80 p-6 rounded-2xl text-center space-y-3 min-w-[220px]">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center font-bold text-2xl shadow-inner">
                    N
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">جامعة السعيد</p>
                    <p className="text-sm font-mono text-cyan-300 font-bold mt-1">736615256</p>
                  </div>
                  <p className="text-xs text-cyan-400 italic">"ابتسامتك ... صحتك"</p>
                </div>
              </div>
            </div>

            {/* Back Card replica */}
            <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 border border-slate-700 rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
              <div className="space-y-3 relative z-10">
                <div className="w-20 h-20 rounded-full bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center font-bold text-3xl border border-cyan-500/30 shadow-xl">
                  🦷
                </div>
                <h3 className="text-2xl font-black text-white">الدكتورة نسيبة ياسر العريقي</h3>
                <p className="text-sm font-semibold text-cyan-300">Nosiba Yasser Alareeqi</p>
                <div className="pt-3 border-t border-slate-800 flex items-center justify-center gap-6 text-sm text-slate-300">
                  <span className="flex items-center gap-1.5 font-mono text-cyan-400">
                    <Phone className="w-4 h-4" /> 736615256
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-4 h-4 text-cyan-400" /> جامعة السعيد
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>عيادة الدكتورة نسيبة ياسر العريقي للأسنان © 2026 · جامعة السعيد · جميع الحقوق محفوظة</p>
      </footer>

      {/* MODAL: ADD APPOINTMENT */}
      {isAppointmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-cyan-400" /> إضافة موعد جديد
              </h3>
              <button onClick={() => setIsAppointmentModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAppointment} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">اسم المريض</label>
                <input
                  type="text"
                  required
                  value={newAppt.patientName}
                  onChange={(e) => setNewAppt({ ...newAppt, patientName: e.target.value })}
                  placeholder="الاسم الكامل"
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">رقم الهاتف</label>
                <input
                  type="text"
                  required
                  value={newAppt.phone}
                  onChange={(e) => setNewAppt({ ...newAppt, phone: e.target.value })}
                  placeholder="07xxxxxxxx"
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">الخدمة الطبية المطلوبة</label>
                <select
                  value={newAppt.service}
                  onChange={(e) => setNewAppt({ ...newAppt, service: e.target.value })}
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  {CLINIC_SERVICES.map(s => (
                    <option key={s.id} value={s.title}>{s.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">التاريخ</label>
                  <input
                    type="date"
                    required
                    value={newAppt.date}
                    onChange={(e) => setNewAppt({ ...newAppt, date: e.target.value })}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">الوقت</label>
                  <input
                    type="text"
                    required
                    value={newAppt.time}
                    onChange={(e) => setNewAppt({ ...newAppt, time: e.target.value })}
                    placeholder="10:00 ص"
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">ملاحظات إضافية</label>
                <input
                  type="text"
                  value={newAppt.notes}
                  onChange={(e) => setNewAppt({ ...newAppt, notes: e.target.value })}
                  placeholder="أعراض أو ملاحظات..."
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAppointmentModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-semibold shadow-lg transition-all cursor-pointer"
                >
                  حفظ الموعد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PATIENT */}
      {isPatientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" /> تسجيل مريض جديد
              </h3>
              <button onClick={() => setIsPatientModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPatient} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">اسم المريض</label>
                <input
                  type="text"
                  required
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  placeholder="الاسم الكامل"
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">رقم الهاتف</label>
                <input
                  type="text"
                  required
                  value={newPatient.phone}
                  onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                  placeholder="07xxxxxxxx"
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">العمر</label>
                  <input
                    type="number"
                    required
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({ ...newPatient, age: Number(e.target.value) })}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">الجنس</label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value as any })}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">التاريخ الطبي (الأمراض، الحساسية...)</label>
                <input
                  type="text"
                  value={newPatient.medicalHistory}
                  onChange={(e) => setNewPatient({ ...newPatient, medicalHistory: e.target.value })}
                  placeholder="لا توجد أمراض مزمنة..."
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPatientModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-semibold shadow-lg transition-all cursor-pointer"
                >
                  حفظ المريض
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD TASK */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-cyan-400" /> إضافة مهمة أو تذكير
              </h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">عنوان المهمة</label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="مثال: فحص التعقيم أو استلام المعمل..."
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">الوقت</label>
                  <input
                    type="text"
                    required
                    value={newTask.time}
                    onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                    placeholder="12:00 م"
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">الأولوية</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="high">عالية</option>
                    <option value="medium">متوسطة</option>
                    <option value="low">منخفضة</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-semibold shadow-lg transition-all cursor-pointer"
                >
                  إضافة المهمة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
