import { defineConfig } from 'orval';

// We are using a local instance of the API for development purposes.
// When the application runs, it's base URL is set via auth.interceptor.ts
export default defineConfig({
  api: {
    input: `http://localhost:5248/swagger/v1/swagger.json`,
    output: {
      target: './src/app/api/endpoints',
      schemas: './src/app/api/models',
      client: 'angular',
      mode: 'split',
      clean: true,
      // This needs to be blank because the full URL is set in auth.interceptor.ts
      baseUrl: '',
    },
  },
});
