import { useMemo, useState } from 'react';
import { Users, Calendar, Shield, FileText, Plus, Filter, Check, X, Download, ChevronLeft, ChevronRight } from 'lucide-react';

const statuses = [
  { key: 'present', label: 'Present', color: 'bg-green-500' },
  { key: 'absent', label: 'Absent', color: 'bg-red-500' },
  { key: 'late', label: 'Late', color: 'bg-yellow-400' },
  { key: 'excused', label: 'Excused', color: 'bg-gray-400' },
];

function classNames(...s) { return s.filter(Boolean).join(' '); }

export default function AttendanceSuite({ theme, auth }) {
  const [tab, setTab] = useState('employees');

  // Mock data with roles and permissions
  const initialEmployees = useMemo(() => ([
    { id: 'e1', name: 'Jamie Rivera', role: 'Engineer', contact: 'jamie@corp.com' },
    { id: 'e2', name: 'Taylor Smith', role: 'Designer', contact: 'taylor@corp.com' },
    { id: 'e3', name: 'Priya Patel', role: 'Product Manager', contact: 'priya@corp.com' },
    { id: 'e4', name: 'Jordan Lee', role: 'QA', contact: 'jordan@corp.com' },
  ]), []);

  const [employees, setEmployees] = useState(initialEmployees);
  const [roles, setRoles] = useState([
    { name: 'Manager', permissions: ['attendance:write', 'roles:write', 'reports:read'] },
    { name: 'Employee', permissions: ['attendance:read', 'reports:read'] },
  ]);

  // Attendance state: { [empId]: { 'YYYY-MM-DD': statusKey } }
  const [attendance, setAttendance] = useState({});

  // Selection state for bulk actions
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);

  const canEdit = auth.isAuthenticated && auth.role === 'manager';

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden" id="attendance" aria-labelledby="attendance-suite-heading">
      <div className="border-b border-gray-200 bg-white/70">
        <h3 id="attendance-suite-heading" className="sr-only">Attendance and Roles</h3>
        <nav className="flex flex-wrap items-center gap-1 p-1" aria-label="Attendance and role tabs">
          <TabButton label="Employees" icon={Users} active={tab==='employees'} onClick={() => setTab('employees')} />
          <TabButton label="Attendance" icon={Calendar} active={tab==='attendance'} onClick={() => setTab('attendance')} />
          <TabButton label="Roles" icon={Shield} active={tab==='roles'} onClick={() => setTab('roles')} />
          <TabButton label="Reports" icon={FileText} active={tab==='reports'} onClick={() => setTab('reports')} />
        </nav>
      </div>

      {tab === 'employees' && (
        <EmployeeList
          theme={theme}
          employees={employees}
          onAdd={(emp) => setEmployees((prev) => [...prev, emp])}
          onSelect={(ids) => setSelectedEmployeeIds(ids)}
          selectedEmployeeIds={selectedEmployeeIds}
          canEdit={canEdit}
        />
      )}

      {tab === 'attendance' && (
        <AttendanceCalendar
          theme={theme}
          employees={employees}
          attendance={attendance}
          setAttendance={setAttendance}
          selectedEmployeeIds={selectedEmployeeIds}
          onSelectEmployees={(ids) => setSelectedEmployeeIds(ids)}
          canEdit={canEdit}
        />
      )}

      {tab === 'roles' && (
        <RoleManagement
          theme={theme}
          roles={roles}
          setRoles={setRoles}
          employees={employees}
          setEmployees={setEmployees}
          canEdit={canEdit}
        />
      )}

      {tab === 'reports' && (
        <Reporting
          theme={theme}
          employees={employees}
          attendance={attendance}
        />
      )}
    </div>
  );
}

function TabButton({ label, icon: Icon, active, onClick }) {
  return (
    <button
      type="button"
      className={classNames(
        'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
        active ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'
      )}
      aria-pressed={active}
      onClick={onClick}
    >
      <Icon size={16} aria-hidden="true" />
      {label}
    </button>
  );
}

function EmployeeList({ theme, employees, onAdd, onSelect, selectedEmployeeIds, canEdit }) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const list = employees.filter((e) => [e.name, e.role, e.contact].some((v) => v.toLowerCase().includes(q)));
    return [...list].sort((a, b) => {
      const av = a[sortKey].toLowerCase();
      const bv = b[sortKey].toLowerCase();
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [employees, query, sortKey, sortDir]);

  const toggleSelectAll = (checked) => {
    onSelect(checked ? filtered.map((e) => e.id) : []);
  };

  const toggleSelect = (id, checked) => {
    if (checked) onSelect([...new Set([...selectedEmployeeIds, id])]);
    else onSelect(selectedEmployeeIds.filter((x) => x !== id));
  };

  const [name, setName] = useState('');
  const [role, setRole] = useState('Engineer');
  const [contact, setContact] = useState('');

  const submitNew = (e) => {
    e.preventDefault();
    if (!name || !contact) return;
    onAdd({ id: `e${Date.now()}`, name, role, contact });
    setName('');
    setRole('Engineer');
    setContact('');
  };

  return (
    <section id="employees" className="p-4 sm:p-6" aria-labelledby="employees-heading">
      <div className="flex items-center justify-between mb-4">
        <h4 id="employees-heading" className="text-lg font-semibold" style={{ color: theme.colors.primary }}>Employee List</h4>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 text-gray-400" size={16} aria-hidden="true" />
            <input
              aria-label="Filter employees"
              className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Filter by name, role, contact"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1 text-sm">
            <label className="sr-only" htmlFor="sortKey">Sort by</label>
            <select id="sortKey" className="border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
              <option value="name">Name</option>
              <option value="role">Role</option>
              <option value="contact">Contact</option>
            </select>
            <select aria-label="Sort direction" className="border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" value={sortDir} onChange={(e) => setSortDir(e.target.value)}>
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-auto rounded-lg border border-gray-200" role="region" aria-label="Employees table">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-3 py-2 text-left">
                <input aria-label="Select all" type="checkbox" checked={selectedEmployeeIds.length === filtered.length && filtered.length>0} onChange={(e) => toggleSelectAll(e.target.checked)} />
              </th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Role</th>
              <th className="px-3 py-2 text-left">Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50 focus-within:bg-gray-50">
                <td className="px-3 py-2">
                  <input aria-label={`Select ${e.name}`} type="checkbox" checked={selectedEmployeeIds.includes(e.id)} onChange={(ev) => toggleSelect(e.id, ev.target.checked)} />
                </td>
                <td className="px-3 py-2 font-medium">{e.name}</td>
                <td className="px-3 py-2">{e.role}</td>
                <td className="px-3 py-2 text-gray-600">{e.contact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={submitNew} className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-3" aria-label="Add new employee">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="newName">Name</label>
          <input id="newName" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Full name" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="newRole">Role</label>
          <select id="newRole" value={role} onChange={(e) => setRole(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>Engineer</option>
            <option>Designer</option>
            <option>Product Manager</option>
            <option>QA</option>
            <option>Support</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="newContact">Contact</label>
          <input id="newContact" required value={contact} onChange={(e) => setContact(e.target.value)} type="email" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="email@company.com" />
        </div>
        <div className="flex items-end">
          <button disabled={!canEdit} title={!canEdit ? 'Only managers can add employees' : 'Add employee'} className={classNames('inline-flex items-center gap-2 w-full justify-center rounded-md px-3 py-2 text-sm font-medium', canEdit ? 'bg-indigo-600 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' : 'bg-gray-200 text-gray-500 cursor-not-allowed')}>
            <Plus size={16} /> Add employee
          </button>
        </div>
      </form>
    </section>
  );
}

function AttendanceCalendar({ theme, employees, attendance, setAttendance, selectedEmployeeIds, onSelectEmployees, canEdit }) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [statusForBulk, setStatusForBulk] = useState('present');

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = firstDay.getDay();

  const days = Array.from({ length: startWeekday }).map(() => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1))
  );

  const monthLabel = new Date(year, month, 1).toLocaleString(undefined, { month: 'long', year: 'numeric' });

  const setStatus = (empId, dateStr, statusKey) => {
    setAttendance((prev) => ({
      ...prev,
      [empId]: { ...(prev[empId] || {}), [dateStr]: statusKey },
    }));
  };

  const bulkMark = (range) => {
    if (!canEdit) return;
    const empIds = selectedEmployeeIds.length ? selectedEmployeeIds : employees.map((e) => e.id);

    let targetDates = [];
    if (range === 'week') {
      // Current week of the selected month based on today or first week if different month
      const baseDate = new Date(year, month, Math.min(today.getDate(), daysInMonth));
      const weekDay = baseDate.getDay();
      const start = new Date(baseDate);
      start.setDate(baseDate.getDate() - weekDay);
      targetDates = Array.from({ length: 7 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
    } else if (range === 'month') {
      targetDates = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
    }

    const validDates = targetDates.filter((d) => d.getMonth() === month && d.getFullYear() === year);
    const dateStrs = validDates.map((d) => d.toISOString().slice(0, 10));

    setAttendance((prev) => {
      const next = { ...prev };
      for (const empId of empIds) {
        next[empId] = { ...(next[empId] || {}) };
        for (const ds of dateStrs) next[empId][ds] = statusForBulk;
      }
      return next;
    });
  };

  const changeMonth = (delta) => {
    const newDate = new Date(year, month + delta, 1);
    setYear(newDate.getFullYear());
    setMonth(newDate.getMonth());
  };

  const toggleSelect = (id, checked) => {
    if (checked) onSelectEmployees([...new Set([...selectedEmployeeIds, id])]);
    else onSelectEmployees(selectedEmployeeIds.filter((x) => x !== id));
  };

  return (
    <section className="p-4 sm:p-6" aria-labelledby="attendance-heading">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h4 id="attendance-heading" className="text-lg font-semibold" style={{ color: theme.colors.primary }}>Attendance Marking</h4>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 text-sm">
            <label htmlFor="bulkStatus" className="text-gray-700">Bulk status</label>
            <select id="bulkStatus" value={statusForBulk} onChange={(e) => setStatusForBulk(e.target.value)} className="border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {statuses.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
            <button disabled={!canEdit} onClick={() => bulkMark('week')} className={classNames('rounded-md px-3 py-2 text-sm font-medium inline-flex items-center gap-2', canEdit ? 'bg-indigo-600 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' : 'bg-gray-200 text-gray-500 cursor-not-allowed')}>
              <Check size={16} /> Mark week
            </button>
            <button disabled={!canEdit} onClick={() => bulkMark('month')} className={classNames('rounded-md px-3 py-2 text-sm font-medium inline-flex items-center gap-2', canEdit ? 'bg-indigo-600 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' : 'bg-gray-200 text-gray-500 cursor-not-allowed')}>
              <Check size={16} /> Mark month
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 overflow-hidden" role="region" aria-label="Employee selection list">
            <div className="bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">Select employees</div>
            <ul className="max-h-80 overflow-auto divide-y divide-gray-100">
              {employees.map((e) => (
                <li key={e.id} className="flex items-center gap-2 px-3 py-2">
                  <input id={`sel-${e.id}`} type="checkbox" checked={selectedEmployeeIds.includes(e.id)} onChange={(ev) => toggleSelect(e.id, ev.target.checked)} />
                  <label htmlFor={`sel-${e.id}`} className="text-sm cursor-pointer">{e.name} <span className="text-gray-500">· {e.role}</span></label>
                </li>
              ))}
            </ul>
            <div className="px-3 py-2 text-xs text-gray-600">{selectedEmployeeIds.length || 0} selected</div>
          </div>

          <Legend />
        </div>

        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-2">
            <div className="inline-flex items-center gap-2">
              <button className="rounded-md border border-gray-300 p-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" aria-label="Previous month" onClick={() => changeMonth(-1)}>
                <ChevronLeft size={18} />
              </button>
              <div aria-live="polite" className="text-sm font-medium" style={{ color: theme.colors.primary }}>{monthLabel}</div>
              <button className="rounded-md border border-gray-300 p-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" aria-label="Next month" onClick={() => changeMonth(1)}>
                <ChevronRight size={18} />
              </button>
            </div>
            <a href="#employees" className="text-sm text-indigo-700 hover:underline">Manage employees</a>
          </div>

          <div className="grid grid-cols-7 gap-2" role="grid" aria-label="Calendar">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
              <div key={d} className="text-xs text-gray-500 text-center" role="columnheader">{d}</div>
            ))}
            {days.map((d, idx) => (
              <div key={idx} role="gridcell" className={classNames('min-h-[84px] rounded-md border', d ? 'border-gray-200' : 'border-transparent bg-transparent')}>
                {d && (
                  <DayCell date={d} employees={employees} attendance={attendance} setStatus={setStatus} canEdit={canEdit} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DayCell({ date, employees, attendance, setStatus, canEdit }) {
  const ds = date.toISOString().slice(0, 10);
  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-medium">{date.getDate()}</div>
      </div>
      <ul className="space-y-1">
        {employees.slice(0, 4).map((e) => {
          const statusKey = attendance[e.id]?.[ds];
          const sDef = statuses.find((s) => s.key === statusKey);
          return (
            <li key={e.id} className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-gray-600 truncate" title={e.name}>{e.name}</span>
              <div className="flex items-center gap-1">
                {statuses.map((s) => (
                  <button key={s.key} disabled={!canEdit} onClick={() => setStatus(e.id, ds, s.key)} className={classNames('h-4 w-4 rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500', s.key === statusKey ? s.color : 'bg-gray-100', !canEdit && 'opacity-60 cursor-not-allowed')} aria-label={`${e.name} ${s.label}`}></button>
                ))}
                {statusKey && (
                  <button disabled={!canEdit} onClick={() => setStatus(e.id, ds, undefined)} className="h-4 w-4 rounded-full border border-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center" aria-label={`Clear status for ${e.name}`}>
                    <X size={10} />
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Legend() {
  return (
    <div className="mt-4 rounded-lg border border-gray-200 p-3" aria-label="Legend">
      <div className="text-sm font-medium mb-2">Legend</div>
      <ul className="grid grid-cols-2 gap-2 text-xs text-gray-700">
        {statuses.map((s) => (
          <li key={s.key} className="flex items-center gap-2">
            <span className={classNames('inline-block h-3 w-3 rounded-full', s.color)} aria-hidden="true"></span>
            {s.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RoleManagement({ theme, roles, setRoles, employees, setEmployees, canEdit }) {
  const [roleName, setRoleName] = useState('');
  const [perms, setPerms] = useState({ 'attendance:read': true, 'attendance:write': false, 'roles:write': false, 'reports:read': true });
  const allPerms = ['attendance:read', 'attendance:write', 'roles:write', 'reports:read'];

  const addRole = (e) => {
    e.preventDefault();
    if (!roleName) return;
    const selected = Object.keys(perms).filter((k) => perms[k]);
    setRoles((prev) => [...prev, { name: roleName, permissions: selected }]);
    setRoleName('');
    setPerms({ 'attendance:read': true, 'attendance:write': false, 'roles:write': false, 'reports:read': true });
  };

  const updateEmployeeRole = (empId, name) => {
    setEmployees((prev) => prev.map((e) => e.id === empId ? { ...e, role: name } : e));
  };

  return (
    <section className="p-4 sm:p-6" aria-labelledby="roles-heading">
      <h4 id="roles-heading" className="text-lg font-semibold mb-4" style={{ color: theme.colors.primary }}>Role Management</h4>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="text-sm font-medium mb-3">Defined roles</div>
          <ul className="space-y-2">
            {roles.map((r) => (
              <li key={r.name} className="rounded border border-gray-200 p-3">
                <div className="font-medium text-sm">{r.name}</div>
                <div className="mt-1 text-xs text-gray-600">{r.permissions.join(', ')}</div>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={addRole} className="rounded-lg border border-gray-200 p-4" aria-label="Add role">
          <div className="text-sm font-medium mb-3">Add new role</div>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label htmlFor="roleName" className="block text-xs font-medium text-gray-700 mb-1">Role name</label>
              <input id="roleName" value={roleName} onChange={(e) => setRoleName(e.target.value)} required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Supervisor" />
            </div>
            <fieldset className="border border-gray-200 rounded-md p-3">
              <legend className="text-xs font-medium text-gray-700">Permissions</legend>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {allPerms.map((p) => (
                  <label key={p} className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={!!perms[p]} onChange={(e) => setPerms((prev) => ({ ...prev, [p]: e.target.checked }))} />
                    {p}
                  </label>
                ))}
              </div>
            </fieldset>
            <div>
              <button disabled={!canEdit} className={classNames('rounded-md px-3 py-2 text-sm font-medium inline-flex items-center gap-2', canEdit ? 'bg-indigo-600 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' : 'bg-gray-200 text-gray-500 cursor-not-allowed')}>
                <Shield size={16} /> Create role
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 p-4" role="region" aria-label="Assign roles">
        <div className="text-sm font-medium mb-3">Assign roles to employees</div>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Employee</th>
                <th className="px-3 py-2 text-left">Current role</th>
                <th className="px-3 py-2 text-left">Assign role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.map((e) => (
                <tr key={e.id}>
                  <td className="px-3 py-2 font-medium">{e.name}</td>
                  <td className="px-3 py-2">{e.role}</td>
                  <td className="px-3 py-2">
                    <select disabled={!canEdit} value={e.role} onChange={(ev) => updateEmployeeRole(e.id, ev.target.value)} className="border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      {[...new Set(['Engineer','Designer','Product Manager','QA','Support', ...roles.map((r) => r.name)])].map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Reporting({ theme, employees, attendance }) {
  const [empId, setEmpId] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [from, setFrom] = useState(() => new Date().toISOString().slice(0, 10));
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));

  const rows = useMemo(() => {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const emps = employees.filter((e) => (empId === 'all' || e.id === empId) && (roleFilter === 'all' || e.role === roleFilter));

    const out = [];
    for (const e of emps) {
      const map = attendance[e.id] || {};
      let present = 0, absent = 0, late = 0, excused = 0;
      Object.entries(map).forEach(([ds, statusKey]) => {
        const d = new Date(ds);
        if (d >= fromDate && d <= toDate) {
          if (statusKey === 'present') present++;
          if (statusKey === 'absent') absent++;
          if (statusKey === 'late') late++;
          if (statusKey === 'excused') excused++;
        }
      });
      out.push({ id: e.id, name: e.name, role: e.role, present, absent, late, excused });
    }
    return out;
  }, [employees, attendance, empId, roleFilter, from, to]);

  const toCSV = () => {
    const header = ['Employee', 'Role', 'Present', 'Absent', 'Late', 'Excused'];
    const body = rows.map((r) => [r.name, r.role, r.present, r.absent, r.late, r.excused]);
    const csv = [header, ...body].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance-report-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="reports" className="p-4 sm:p-6" aria-labelledby="reports-heading">
      <h4 id="reports-heading" className="text-lg font-semibold mb-4" style={{ color: theme.colors.primary }}>Reporting</h4>
      <div className="rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="emp">Employee</label>
            <select id="emp" className="w-full border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" value={empId} onChange={(e) => setEmpId(e.target.value)}>
              <option value="all">All</option>
              {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="role">Role</label>
            <select id="role" className="w-full border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="all">All</option>
              {[...new Set(employees.map((e) => e.role))].map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="from">From</label>
            <input id="from" type="date" className="w-full border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="to">To</label>
            <input id="to" type="date" className="w-full border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="flex items-end">
            <button onClick={toCSV} className="inline-flex items-center gap-2 rounded-md bg-indigo-600 text-white px-3 py-2 text-sm font-medium hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Employee</th>
                <th className="px-3 py-2 text-left">Role</th>
                <th className="px-3 py-2 text-left text-green-700">Present</th>
                <th className="px-3 py-2 text-left text-red-700">Absent</th>
                <th className="px-3 py-2 text-left text-yellow-700">Late</th>
                <th className="px-3 py-2 text-left text-gray-700">Excused</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-3 py-2 font-medium">{r.name}</td>
                  <td className="px-3 py-2">{r.role}</td>
                  <td className="px-3 py-2">{r.present}</td>
                  <td className="px-3 py-2">{r.absent}</td>
                  <td className="px-3 py-2">{r.late}</td>
                  <td className="px-3 py-2">{r.excused}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="px-3 py-4 text-center text-gray-500" colSpan={6}>No data for selected filters</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
