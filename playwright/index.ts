// Mock environment variables
Object.defineProperty(process.env, 'NEXT_PUBLIC_API_URL', {
  value: 'http://localhost:3001/api',
  writable: true,
}) 