import departments from '@/data/departments'

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))

const employees = departments.flatMap((department) =>
  department.members.map((member) => ({
    ...member,
    departmentId: department.slug,
    departmentName: department.name,
    email: `${member.id}@example.com`,
  })),
)

const dashboardStats = {
  employees: employees.length,
  departments: departments.length,
  attendanceRate: 92,
  pendingPayroll: 4,
}

const attendance = employees.slice(0, 18).map((employee, index) => ({
  id: `ATT-${index + 1}`,
  employeeId: employee.id,
  name: employee.name,
  image: employee.avatar,
  designation: employee.title,
  type: employee.type || (index % 2 ? 'Remote' : 'Office'),
  checkIn: index % 3 === 0 ? '10:15 AM' : '9:00 AM',
  status: index % 3 === 0 ? 'Late' : 'On Time',
  statusColor: index % 3 === 0 ? '#F45B69' : '#3FC28A',
  date: '2026-07-23',
  correctionStatus: index % 5 === 0 ? 'Requested' : '',
}))

const payroll = employees.slice(0, 18).map((employee, index) => ({
  id: `PAY-${index + 1}`,
  employeeId: employee.id,
  name: employee.name,
  image: employee.avatar,
  ctc: `$${(50000 + index * 3500).toLocaleString()}`,
  salary: `$${Math.round((50000 + index * 3500) / 12).toLocaleString()}`,
  deduction: index % 4 === 0 ? '-' : `$${(100 + index * 25).toLocaleString()}`,
  status: index % 3 === 0 ? 'Pending' : 'Completed',
  statusColor: index % 3 === 0 ? '#EFBE12' : '#3FC28A',
  period: 'July 2026',
}))

const jobs = [
  { id: 1, title: 'UI/UX Designer', description: 'Design', roles: ['Design', 'Full Time', 'Remote'], location: 'California, USA', salary: '$36000', status: 'active' },
  { id: 2, title: 'Software Engineer', description: 'Full Stack', roles: ['Developer', 'Full Time', 'Remote'], location: 'New York, USA', salary: '$48000', status: 'active' },
  { id: 3, title: 'Data Analyst', description: 'Data Science', roles: ['Full Time', 'Remote'], location: 'New York, USA', salary: '$42000', status: 'active' },
  { id: 4, title: 'Product Manager', description: 'Agile', roles: ['Management', 'Full Time'], location: 'London, UK', salary: '$54000', status: 'completed' },
  { id: 5, title: 'HR Executive', description: 'HR', roles: ['HR', 'Full Time', 'Remote'], location: 'Lagos, Nigeria', salary: '$36000', status: 'inactive' },
]

const candidates = employees.slice(0, 12).map((employee, index) => ({
  id: `CAN-${index + 1}`,
  name: employee.name,
  image: employee.avatar,
  appliedFor: jobs[index % jobs.length].title,
  appliedDate: 'July 14, 2026',
  email: employee.email,
  number: '(629) 555-0129',
  status: ['Selected', 'In Progress', 'Rejected'][index % 3],
  statusColor: ['#3FC28A', '#EFBE12', '#F45B69'][index % 3],
}))

const holidays = [
  { id: 1, holiday: 'New Year', name: 'New Year', date: '2026-01-01', day: 'Thursday', type: 'Public' },
  { id: 2, holiday: 'Workers Day', name: 'Workers Day', date: '2026-05-01', day: 'Friday', type: 'Public' },
  { id: 3, holiday: 'Democracy Day', name: 'Democracy Day', date: '2026-06-12', day: 'Friday', type: 'Public' },
]

const notifications = [
  { id: 1, title: 'Leave Request', description: '@Robert Fox has applied for leave', time: 'Just Now', read: false, timestamp: Date.now(), status: 'Pending', actionType: 'leave' },
  { id: 2, title: 'Check In Issue', description: '@Alexa shared a message regarding check in issue', time: '11:16 AM', read: false, timestamp: Date.now() - 3600000, status: 'Pending', actionType: 'attendance' },
  { id: 3, title: 'Applied job for Sales Manager Position', description: '@Shane Watson has applied for job', time: '09:00 AM', read: true, timestamp: Date.now() - 7200000, status: '', actionType: 'candidate' },
]

const rolePermissions = {
  Admin: ['dashboard', 'employees', 'departments', 'attendance', 'payroll', 'jobs', 'candidates', 'notifications', 'holidays', 'settings'],
  'HR Manager': ['dashboard', 'employees', 'departments', 'attendance', 'payroll', 'jobs', 'candidates', 'notifications', 'holidays', 'settings'],
  Recruiter: ['dashboard', 'jobs', 'candidates', 'notifications'],
  Payroll: ['dashboard', 'employees', 'payroll', 'notifications'],
}

const settings = {
  appearance: 'system',
  language: 'en',
  twoFactor: true,
  mobilePush: true,
  desktopNotifications: true,
  emailNotifications: true,
  role: 'HR Manager',
  permissions: rolePermissions['HR Manager'],
}

function paginate(items, query = {}) {
  const page = Number(query.page || 1)
  const limit = Number(query.limit || 10)
  const start = (page - 1) * limit

  return {
    data: items.slice(start, start + limit),
    meta: {
      page,
      limit,
      total: items.length,
      totalPages: Math.max(1, Math.ceil(items.length / limit)),
    },
  }
}

function matchesSearch(employee, search = '') {
  const query = search.trim().toLowerCase()
  if (!query) return true

  return [
    employee.id,
    employee.name,
    employee.title,
    employee.type,
    employee.status,
    employee.departmentName,
  ].some((value) => String(value || '').toLowerCase().includes(query))
}

function findEmployee(id) {
  return employees.find((employee) => employee.id === id)
}

function requireFields(body, fields) {
  const missing = fields.filter((field) => !body[field])
  if (!missing.length) return

  const error = new Error('Please complete all required fields.')
  error.status = 422
  error.details = Object.fromEntries(missing.map((field) => [field, [`${field} is required.`]]))
  throw error
}

function nextId(items) {
  return Math.max(0, ...items.map((item) => Number(item.id) || 0)) + 1
}

function statusColor(status) {
  return {
    Selected: '#3FC28A',
    'In Progress': '#EFBE12',
    Rejected: '#F45B69',
  }[status] || '#7152F3'
}

export async function mockRequest(endpoint, options = {}) {
  await delay()

  const method = (options.method || 'GET').toUpperCase()
  const query = options.query || {}
  const body = options.body || {}

  if (endpoint === '/auth/login' && method === 'POST') {
    if (!body.email || !body.password) {
      const error = new Error('Email and password are required.')
      error.status = 422
      throw error
    }

    return {
      token: 'mock-hrms-token',
      user: {
        id: employees[0]?.id || 'EMP001',
        name: 'Robert Smith',
        email: body.email,
        role: 'HR Manager',
        permissions: rolePermissions['HR Manager'],
      },
    }
  }

  if (endpoint === '/auth/profile' && method === 'PATCH') {
    return {
      user: {
        id: employees[0]?.id || 'EMP001',
        name: body.name || 'Robert Smith',
        email: body.email || 'hr@example.com',
        role: body.role || settings.role,
        permissions: body.permissions || rolePermissions[body.role || settings.role] || settings.permissions,
      },
      message: 'Profile updated successfully.',
    }
  }

  if (endpoint === '/auth/password' && method === 'PUT') {
    requireFields(body, ['currentPassword', 'newPassword'])
    return { message: 'Password updated successfully.' }
  }

  if (endpoint === '/auth/forgot-password' && method === 'POST') {
    return { message: 'A reset code has been sent to your email address.' }
  }

  if (endpoint === '/auth/verify-otp' && method === 'POST') {
    if (!body.code || String(body.code).length < 5) {
      const error = new Error('Enter the complete OTP code.')
      error.status = 422
      throw error
    }

    return { message: 'Password reset verified successfully.' }
  }

  if (endpoint === '/dashboard' && method === 'GET') {
    return dashboardStats
  }

  if (endpoint === '/employees' && method === 'GET') {
    const filtered = employees.filter((employee) => matchesSearch(employee, query.search))
    return paginate(filtered, query)
  }

  if (endpoint === '/employees' && method === 'POST') {
    requireFields(body, ['name', 'title', 'departmentName'])
    const employee = {
      id: body.id || String(Date.now()),
      avatar: body.avatar || 'https://i.pravatar.cc/150?img=12',
      status: 'Active',
      statusColor: '#7152F3',
      type: body.type || 'Full Time',
      ...body,
    }
    employees.unshift(employee)
    return { ...employee, message: 'Employee saved successfully.' }
  }

  if (endpoint.startsWith('/employees/') && method === 'GET') {
    const employee = findEmployee(endpoint.split('/').at(-1))
    if (!employee) {
      const error = new Error('Employee not found.')
      error.status = 404
      throw error
    }

    return employee
  }

  if (endpoint.startsWith('/employees/') && method === 'PUT') {
    requireFields(body, ['name', 'title', 'departmentName'])
    const id = endpoint.split('/').at(-1)
    const index = employees.findIndex((employee) => employee.id === id)
    if (index === -1) {
      const error = new Error('Employee not found.')
      error.status = 404
      throw error
    }

    employees[index] = {
      ...employees[index],
      ...body,
      id,
      status: body.status || employees[index].status || 'Active',
      statusColor: body.statusColor || employees[index].statusColor || '#7152F3',
    }
    return { ...employees[index], message: 'Employee updated successfully.' }
  }

  if (endpoint.startsWith('/employees/') && method === 'DELETE') {
    const id = endpoint.split('/').at(-1)
    const index = employees.findIndex((employee) => employee.id === id)
    if (index === -1) {
      const error = new Error('Employee not found.')
      error.status = 404
      throw error
    }

    employees.splice(index, 1)
    return { message: 'Employee deleted successfully.' }
  }

  if (endpoint === '/departments' && method === 'GET') {
    return {
      data: departments,
      meta: { total: departments.length },
    }
  }

  if (endpoint.startsWith('/departments/') && method === 'GET') {
    const slug = endpoint.split('/').at(-1)
    const department = departments.find((item) => item.slug === slug)
    if (!department) {
      const error = new Error('Department not found.')
      error.status = 404
      throw error
    }

    return department
  }

  if (endpoint === '/attendance' && method === 'GET') {
    const filtered = attendance.filter((record) => {
      const matchesDate = !query.date || record.date === query.date
      const matchesSearch = !query.search
        || record.name.toLowerCase().includes(String(query.search).toLowerCase())
        || record.designation.toLowerCase().includes(String(query.search).toLowerCase())

      return matchesDate && matchesSearch
    })

    return paginate(filtered, query)
  }

  if (endpoint.startsWith('/attendance/') && endpoint.endsWith('/correction') && method === 'POST') {
    const id = endpoint.split('/')[2]
    const record = attendance.find((item) => item.id === id)
    if (!record) {
      const error = new Error('Attendance record not found.')
      error.status = 404
      throw error
    }

    record.correctionStatus = 'Requested'
    record.correctionReason = body.reason || 'Correction requested by HR.'
    return { ...record, message: 'Attendance correction request sent.' }
  }

  if (endpoint === '/payroll' && method === 'GET') {
    const filtered = payroll.filter((record) => !query.period || record.period === query.period)
    return paginate(filtered, query)
  }

  if (endpoint === '/payroll/generate' && method === 'POST') {
    const period = body.period || 'July 2026'
    payroll.forEach((record, index) => {
      record.period = period
      record.status = index % 4 === 0 ? 'Pending' : 'Generated'
      record.statusColor = index % 4 === 0 ? '#EFBE12' : '#3FC28A'
    })
    return { message: `Payroll generated for ${period}.`, period }
  }

  if (endpoint === '/payroll/export' && method === 'POST') {
    return { message: 'Payroll export is ready.', downloadUrl: '/mock-downloads/payroll-july-2026.csv' }
  }

  if (endpoint === '/jobs' && method === 'GET') {
    return {
      data: jobs,
      meta: { total: jobs.length },
    }
  }

  if (endpoint === '/jobs' && method === 'POST') {
    requireFields(body, ['title', 'department', 'location', 'salary'])
    const job = {
      id: nextId(jobs),
      description: body.department,
      roles: body.roles?.length ? body.roles : ['Full Time'],
      status: 'active',
      ...body,
    }
    jobs.unshift(job)
    return { ...job, message: 'Job saved successfully.' }
  }

  if (endpoint.startsWith('/jobs/') && method === 'PUT') {
    requireFields(body, ['title', 'department', 'location', 'salary'])
    const id = Number(endpoint.split('/').at(-1))
    const index = jobs.findIndex((job) => job.id === id)
    if (index === -1) {
      const error = new Error('Job not found.')
      error.status = 404
      throw error
    }

    jobs[index] = {
      ...jobs[index],
      ...body,
      description: body.department,
      roles: body.roles?.length ? body.roles : ['Full Time'],
    }
    return { ...jobs[index], message: 'Job updated successfully.' }
  }

  if (endpoint.startsWith('/jobs/') && method === 'PATCH') {
    const id = Number(endpoint.split('/').at(-1))
    const job = jobs.find((item) => item.id === id)
    if (!job) {
      const error = new Error('Job not found.')
      error.status = 404
      throw error
    }

    job.status = body.status || job.status
    return { ...job, message: `Job moved to ${job.status}.` }
  }

  if (endpoint.startsWith('/jobs/') && method === 'DELETE') {
    const id = Number(endpoint.split('/').at(-1))
    const index = jobs.findIndex((job) => job.id === id)
    if (index === -1) {
      const error = new Error('Job not found.')
      error.status = 404
      throw error
    }

    jobs.splice(index, 1)
    return { message: 'Job deleted successfully.' }
  }

  if (endpoint === '/candidates' && method === 'GET') {
    const filtered = candidates.filter((candidate) => {
      if (!query.search) return true
      const search = String(query.search).toLowerCase()
      return candidate.name.toLowerCase().includes(search)
        || candidate.appliedFor.toLowerCase().includes(search)
        || candidate.email.toLowerCase().includes(search)
        || candidate.status.toLowerCase().includes(search)
    })

    return paginate(filtered, query)
  }

  if (endpoint.startsWith('/candidates/') && method === 'PATCH') {
    const id = endpoint.split('/').at(-1)
    const candidate = candidates.find((item) => item.id === id)
    if (!candidate) {
      const error = new Error('Candidate not found.')
      error.status = 404
      throw error
    }

    candidate.status = body.status || candidate.status
    candidate.statusColor = statusColor(candidate.status)
    return { ...candidate, message: 'Candidate status updated successfully.' }
  }

  if (endpoint === '/holidays' && method === 'GET') {
    return {
      data: holidays,
      meta: { total: holidays.length },
    }
  }

  if (endpoint === '/holidays' && method === 'POST') {
    requireFields(body, ['holiday', 'date'])
    const date = new Date(body.date)
    const holiday = {
      id: nextId(holidays),
      name: body.holiday,
      day: Number.isNaN(date.getTime())
        ? body.day || ''
        : date.toLocaleDateString('en-US', { weekday: 'long' }),
      type: body.type || 'Public',
      ...body,
    }
    holidays.unshift(holiday)
    return { ...holiday, message: 'Holiday added successfully.' }
  }

  if (endpoint.startsWith('/holidays/') && method === 'PUT') {
    requireFields(body, ['holiday', 'date'])
    const id = Number(endpoint.split('/').at(-1))
    const index = holidays.findIndex((holiday) => holiday.id === id)
    if (index === -1) {
      const error = new Error('Holiday not found.')
      error.status = 404
      throw error
    }

    const date = new Date(body.date)
    holidays[index] = {
      ...holidays[index],
      ...body,
      name: body.holiday,
      day: Number.isNaN(date.getTime())
        ? body.day || holidays[index].day
        : date.toLocaleDateString('en-US', { weekday: 'long' }),
    }
    return { ...holidays[index], message: 'Holiday updated successfully.' }
  }

  if (endpoint.startsWith('/holidays/') && method === 'DELETE') {
    const id = Number(endpoint.split('/').at(-1))
    const index = holidays.findIndex((holiday) => holiday.id === id)
    if (index === -1) {
      const error = new Error('Holiday not found.')
      error.status = 404
      throw error
    }

    holidays.splice(index, 1)
    return { message: 'Holiday deleted successfully.' }
  }

  if (endpoint === '/notifications' && method === 'GET') {
    return {
      data: notifications,
      meta: { total: notifications.length, unread: notifications.filter((item) => !item.read).length },
    }
  }

  if (endpoint === '/settings' && method === 'GET') {
    return settings
  }

  if (endpoint === '/settings' && method === 'PUT') {
    Object.assign(settings, body)
    if (body.role) {
      settings.permissions = rolePermissions[body.role] || settings.permissions
    }
    return { ...settings, message: 'Settings saved successfully.' }
  }

  if (endpoint.startsWith('/notifications/') && method === 'PATCH') {
    const id = Number(endpoint.split('/').at(-1))
    const notification = notifications.find((item) => item.id === id)
    if (!notification) {
      const error = new Error('Notification not found.')
      error.status = 404
      throw error
    }

    notification.status = body.status || notification.status
    notification.read = true
    return { ...notification, message: `Request ${notification.status.toLowerCase()}.` }
  }

  return {
    data: [],
    meta: { total: 0, page: 1, limit: 10, totalPages: 1 },
  }
}
