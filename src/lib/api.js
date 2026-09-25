// Frontend API client for the Cloudflare Pages Functions backend.
// All requests are same-origin, cookies included for auth.

async function req(path, { method = 'GET', body } = {}) {
  const res = await fetch(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'same-origin',
  })
  let data = null
  try {
    data = await res.json()
  } catch {
    data = null
  }
  if (!res.ok || (data && data.ok === false)) {
    const msg = (data && data.error) || `Request failed (${res.status})`
    const err = new Error(msg)
    err.status = res.status
    throw err
  }
  return data
}

export const api = {
  // Auth
  checkAuth: () => req('/api/auth'),
  login: (password) => req('/api/auth', { method: 'POST', body: { action: 'login', password } }),
  logout: () => req('/api/auth', { method: 'POST', body: { action: 'logout' } }),

  // Public
  createEnquiry: (payload) => req('/api/enquiries', { method: 'POST', body: payload }),

  // Admin
  stats: () => req('/api/stats'),
  enquiries: (status) => req(`/api/enquiries${status ? `?status=${status}` : ''}`),
  updateEnquiry: (id, status) => req('/api/enquiries', { method: 'PATCH', body: { id, status } }),

  customers: (q) => req(`/api/customers${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  addCustomer: (payload) => req('/api/customers', { method: 'POST', body: payload }),

  bills: () => req('/api/bills'),
  createBill: (payload) => req('/api/bills', { method: 'POST', body: payload }),

  workorders: (status) => req(`/api/workorders${status ? `?status=${status}` : ''}`),
  createWorkOrder: (payload) => req('/api/workorders', { method: 'POST', body: payload }),
  updateWorkOrder: (id, status) => req('/api/workorders', { method: 'PATCH', body: { id, status } }),

  expenses: () => req('/api/expenses'),
  addExpense: (payload) => req('/api/expenses', { method: 'POST', body: payload }),
}
