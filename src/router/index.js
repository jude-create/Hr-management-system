
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes = [
  { 
    path: '/',
    meta: { requiresAuth: true, permission: 'dashboard' },
    component: () => import('@/views/HomeView.vue') 
  },

  { 
    path: '/employees',
    meta: { requiresAuth: true, permission: 'employees' },
    component: () => import('@/views/employee/EmployeesView.vue') 
  },

  { 
    path: '/departments', 
    meta: { requiresAuth: true, permission: 'departments' },
    component: () => import('@/views/department/DepartmentView.vue')
  },

  { 
    path: '/departments/:slug',
    meta: { requiresAuth: true, permission: 'departments' },
    component: () => import('@/views/department/DepartmentDetailsView.vue'), 
    props: true
  },

  { 
    path: '/attendance',
    meta: { requiresAuth: true, permission: 'attendance' },
    component: () => import('@/views/AttendanceView.vue') 
  },

  { 
    path: '/payroll',
    meta: { requiresAuth: true, permission: 'payroll' },
    component: () => import('@/views/PayrollView.vue') 
  },

  { 
    path: '/jobs',
    meta: { requiresAuth: true, permission: 'jobs' },
    component: () => import('@/views/JobsView.vue')
  },

  { 
    path: '/candidates', 
    meta: { requiresAuth: true, permission: 'candidates' },
    component: () => import('@/views/CandidateView.vue') 
  },

  { 
    path: '/holidays', 
    meta: { requiresAuth: true, permission: 'holidays' },
    component: () => import('@/views/HolidayView.vue') 
  },

  { 
    path: '/settings', 
    meta: { requiresAuth: true, permission: 'settings' },
    component: () => import('@/views/SettingsView.vue') 
  },

  { 
    path: '/notifications', 
    meta: { requiresAuth: true, permission: 'notifications' },
    component: () => import('@/views/NotificationView.vue') 
  },

  { 
    path: '/login', 
    component: () => import('@/views/authScreen/LoginView.vue') 
  },

  { 
    path: '/forgot-password', 
    component: () => import('@/views/authScreen/ForgotPasswordView.vue') 
  },

  { 
    path: '/forgot-password/enter-otp', 
    component: () => import('@/views/authScreen/EnterOtpView.vue') 
  },

  { 
    path: '/employees/add-new-employee', 
    meta: { requiresAuth: true, permission: 'employees' },
    component: () => import('@/views/employee/AddEmployeeView.vue') 
  },

  {
    path: '/employees/:id/edit',
    name: 'employee-edit',
    meta: { requiresAuth: true, permission: 'employees' },
    component: () => import('@/views/employee/AddEmployeeView.vue'),
    props: true,
  },

 {
  path: '/employees/:id',
  name: 'employee-detail',
  meta: { requiresAuth: true, permission: 'employees' },
  component: () => import('@/views/employee/EmployeeDetail.vue'),
  props: true,
  children: [
    { 
      path: '/employees/:id', // Default child route (profile)
      name: 'employee-profile', 
      component: () => import('@/views/employee/ProfileView.vue'),
      props: true 
    },
    { 
      path: 'attendance', 
      name: 'employee-attendance', 
      component: () => import('@/views/employee/EmployeeAttendance.vue'),
      props: true 
    },
    { 
      path: 'projects', 
      name: 'employee-projects', 
      component: () => import('@/views/employee/EmployeeProjects.vue'),
      props: true 
    },
    { 
      path: 'leaves', 
      name: 'employee-leaves', 
      component: () => import('@/views/employee/EmployeeLeaves.vue'),
      props: true 
    }
  ]
}
  ]


const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return '/login'
  }

  if (to.meta.permission && auth.user?.permissions?.length && !auth.user.permissions.includes(to.meta.permission)) {
    return '/'
  }

  if (to.path === '/login' && auth.isAuthenticated) {
    return '/'
  }
})

export default router
