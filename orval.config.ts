import { defineConfig } from 'orval';
import { environment } from './src/environments/environment';

export default defineConfig({
  api: {
    input: 'http://localhost:5248/swagger/v1/swagger.json',
    output: {
      target: './src/app/api/endpoints',
      schemas: './src/app/api/models',
      client: 'angular',
      mode: 'split',
      clean: true,
      baseUrl: environment.apiUrl,
      override: {
        requestOptions: {
          credentials: 'include',
        },
      },
    },
  },
});
