import { http, HttpResponse } from 'msw';
import { mockTodos } from '../data/todos';

export const todoHandlers = [
  http.get('/api/v1/todos', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 5;
    const keyword = url.searchParams.get('keyword') || '';

    let filtered = [...mockTodos];
    if (keyword) {
      filtered = filtered.filter(t => t.appName.includes(keyword) || t.shuttleName.includes(keyword));
    }

    const start = (page - 1) * pageSize;
    const list = filtered.slice(start, start + pageSize);

    return HttpResponse.json({
      code: 0, message: 'success',
      data: { list, total: filtered.length, page, pageSize },
    });
  }),

  http.get('/api/v1/todos/count', () => {
    return HttpResponse.json({ code: 0, message: 'success', data: mockTodos.length });
  }),
];
