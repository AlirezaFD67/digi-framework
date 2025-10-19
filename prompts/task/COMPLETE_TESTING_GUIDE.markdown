# راهنمای جامع تست‌نویسی بعد از اتمام تسک

این سند یک راهنمای گام‌به‌گام کامل برای نوشتن تست‌های جامع بعد از اتمام هر تسک است.

## 🎯 هدف

**بعد از اتمام هر تسک، تست‌های کامل و جامع برای آن تسک نوشته شود که:**
- ✅ تمام functionالیتی‌ها را پوشش دهد
- ✅ Edge cases را بررسی کند
- ✅ Error handling را تست کند
- ✅ User interactions را شبیه‌سازی کند
- ✅ Coverage حداقل 80% داشته باشد

## 📋 چک‌لیست تست‌نویسی (اجباری)

### مرحله 1: شناسایی موارد نیاز به تست
- [ ] تمام کامپوننت‌های جدید یا تغییر یافته را لیست کنید
- [ ] تمام هوک‌های جدید را لیست کنید
- [ ] تمام endpoint‌های API جدید را لیست کنید
- [ ] تمام توابع utility و helper را لیست کنید
- [ ] تمام فرم‌ها و validation logic را لیست کنید

### مرحله 2: تست کامپوننت‌ها
برای هر کامپوننت، تست‌های زیر را بنویسید:

#### 2.1. تست‌های پایه (الزامی)
```typescript
// ✅ رندر صحیح
it('should render component correctly', () => {
  render(<MyComponent />);
  expect(screen.getByRole('main')).toBeInTheDocument();
});

// ✅ نمایش props
it('should display props correctly', () => {
  render(<MyComponent title="Test Title" />);
  expect(screen.getByText('Test Title')).toBeInTheDocument();
});

// ✅ State خالی
it('should handle empty state', () => {
  render(<MyComponent data={[]} />);
  expect(screen.getByText(/no data/i)).toBeInTheDocument();
});

// ✅ Loading state
it('should show loading state', () => {
  render(<MyComponent isLoading={true} />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

// ✅ Error state
it('should show error state', () => {
  render(<MyComponent error="Something went wrong" />);
  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
});
```

#### 2.2. تست‌های Interaction (الزامی)
```typescript
// ✅ کلیک روی دکمه
it('should handle button click', async () => {
  const handleClick = vi.fn();
  render(<MyComponent onClick={handleClick} />);
  
  const button = screen.getByRole('button', { name: /click me/i });
  fireEvent.click(button);
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});

// ✅ تایپ در input
it('should handle input change', async () => {
  const handleChange = vi.fn();
  render(<MyComponent onChange={handleChange} />);
  
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'test' } });
  
  expect(handleChange).toHaveBeenCalledWith('test');
});

// ✅ Submit فرم
it('should handle form submission', async () => {
  const handleSubmit = vi.fn();
  render(<MyForm onSubmit={handleSubmit} />);
  
  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: 'John Doe' },
  });
  
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  
  await waitFor(() => {
    expect(handleSubmit).toHaveBeenCalledWith({ name: 'John Doe' });
  });
});
```

#### 2.3. تست‌های Validation (برای فرم‌ها)
```typescript
// ✅ Required fields
it('should show error for required fields', async () => {
  render(<MyForm />);
  
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  
  await waitFor(() => {
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
  });
});

// ✅ Format validation
it('should validate email format', async () => {
  render(<MyForm />);
  
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'invalid-email' },
  });
  
  fireEvent.blur(screen.getByLabelText(/email/i));
  
  await waitFor(() => {
    expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
  });
});

// ✅ Custom validation
it('should apply custom validation rules', async () => {
  render(<MyForm />);
  
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: '123' }, // Too short
  });
  
  await waitFor(() => {
    expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
  });
});
```

### مرحله 3: تست Hooks

#### 3.1. تست React Query Hooks
```typescript
describe('useMyDataQuery', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  // ✅ Successful fetch
  it('should fetch data successfully', async () => {
    const { result } = renderHook(() => useMyDataQuery(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
  });

  // ✅ Error handling
  it('should handle fetch error', async () => {
    // Mock error
    const { result } = renderHook(() => useMyDataQuery(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  // ✅ Refetch
  it('should refetch data', async () => {
    const { result } = renderHook(() => useMyDataQuery(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    await result.current.refetch();

    expect(result.current.isRefetching).toBe(false);
  });
});
```

#### 3.2. تست Mutation Hooks
```typescript
describe('useCreateItemMutation', () => {
  // ✅ Successful mutation
  it('should create item successfully', async () => {
    const { result } = renderHook(() => useCreateItemMutation(), { wrapper });

    const newItem = { name: 'New Item', description: 'Test' };

    await result.current.mutateAsync(newItem);

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toMatchObject(newItem);
  });

  // ✅ Error handling
  it('should handle mutation error', async () => {
    const { result } = renderHook(() => useCreateItemMutation(), { wrapper });

    try {
      await result.current.mutateAsync({ name: '' }); // Invalid
    } catch (error) {
      expect(error).toBeDefined();
    }

    expect(result.current.isError).toBe(true);
  });

  // ✅ Cache invalidation
  it('should invalidate cache after mutation', async () => {
    const { result } = renderHook(() => useCreateItemMutation(), { wrapper });

    await result.current.mutateAsync({ name: 'New Item' });

    // Check if related query was invalidated
    expect(queryClient.getQueryState(['items'])?.isInvalidated).toBe(true);
  });
});
```

### مرحله 4: تست API Functions

```typescript
// Setup MSW
const server = setupServer(
  http.get('/api/items', () => {
    return HttpResponse.json({
      entries: [{ id: '1', name: 'Item 1' }],
      metadata: { totalRows: 1 },
    });
  }),
  
  http.post('/api/items', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: '2', ...body });
  }),
  
  http.delete('/api/items/:id', () => {
    return new HttpResponse(null, { status: 204 });
  })
);

beforeEach(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Item API Functions', () => {
  // ✅ GET request
  it('should fetch items', async () => {
    const items = await getItems();
    
    expect(items.entries).toHaveLength(1);
    expect(items.entries[0].name).toBe('Item 1');
  });

  // ✅ POST request
  it('should create item', async () => {
    const newItem = { name: 'New Item' };
    const result = await createItem(newItem);
    
    expect(result.id).toBe('2');
    expect(result.name).toBe('New Item');
  });

  // ✅ DELETE request
  it('should delete item', async () => {
    await expect(deleteItem('1')).resolves.not.toThrow();
  });

  // ✅ Error handling
  it('should handle API error', async () => {
    server.use(
      http.get('/api/items', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    await expect(getItems()).rejects.toThrow();
  });

  // ✅ Network error
  it('should handle network error', async () => {
    server.use(
      http.get('/api/items', () => {
        return HttpResponse.error();
      })
    );

    await expect(getItems()).rejects.toThrow();
  });
});
```

### مرحله 5: تست Integration (Flow کامل)

```typescript
describe('Complete User Management Flow', () => {
  it('should complete full CRUD flow', async () => {
    renderWithProviders(<UserManagementPage />);

    // ========== CREATE ==========
    // 1. Open create dialog
    fireEvent.click(screen.getByRole('button', { name: /add user/i }));
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // 2. Fill form
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    });

    // 3. Submit
    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    // 4. Verify success
    await waitFor(() => {
      expect(screen.getByText(/user created/i)).toBeInTheDocument();
    });

    // 5. Verify in table
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    // ========== UPDATE ==========
    // 6. Open edit dialog
    const editButton = screen.getByRole('button', { name: /edit john doe/i });
    fireEvent.click(editButton);

    // 7. Update name
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Smith' },
    });

    // 8. Submit update
    fireEvent.click(screen.getByRole('button', { name: /update/i }));

    // 9. Verify update
    await waitFor(() => {
      expect(screen.getByText('John Smith')).toBeInTheDocument();
    });

    // ========== DELETE ==========
    // 10. Click delete
    const deleteButton = screen.getByRole('button', { name: /delete john smith/i });
    fireEvent.click(deleteButton);

    // 11. Confirm delete
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

    // 12. Verify deleted
    await waitFor(() => {
      expect(screen.queryByText('John Smith')).not.toBeInTheDocument();
    });
  });
});
```

### مرحله 6: تست Edge Cases

```typescript
describe('Edge Cases', () => {
  // ✅ Empty data
  it('should handle empty data gracefully', () => {
    render(<MyList items={[]} />);
    expect(screen.getByText(/no items/i)).toBeInTheDocument();
  });

  // ✅ Very long text
  it('should handle very long text', () => {
    const longText = 'A'.repeat(10000);
    render(<MyComponent text={longText} />);
    expect(screen.getByText(longText.substring(0, 100))).toBeInTheDocument();
  });

  // ✅ Special characters
  it('should handle special characters', () => {
    const specialText = '<script>alert("xss")</script>';
    render(<MyComponent text={specialText} />);
    expect(screen.queryByRole('script')).not.toBeInTheDocument();
  });

  // ✅ Null/undefined
  it('should handle null values', () => {
    render(<MyComponent data={null} />);
    expect(screen.getByText(/no data/i)).toBeInTheDocument();
  });

  // ✅ Network timeout
  it('should handle timeout', async () => {
    server.use(
      http.get('/api/items', async () => {
        await delay(10000); // 10 second delay
        return HttpResponse.json({ items: [] });
      })
    );

    renderWithProviders(<MyComponent />);

    await waitFor(() => {
      expect(screen.getByText(/timeout/i)).toBeInTheDocument();
    }, { timeout: 15000 });
  });
});
```

## 📊 بررسی Coverage

### اجرای Coverage
```bash
# برای کل workspace
pnpm test --coverage

# برای یک package خاص
pnpm test --coverage --filter @workspace/custom-ui

# برای یک اپ خاص
pnpm test --coverage --filter admin-panel
```

### اهداف Coverage (الزامی)
- **Packages** (custom-ui, framework): حداقل **80%**
- **Applications**: حداقل **70%**
- **Utility functions**: **100%**
- **API functions**: **100%**

### تفسیر گزارش Coverage
```
File      | % Stmts | % Branch | % Funcs | % Lines
----------|---------|----------|---------|--------
All files |   85.2  |   82.1   |   88.5  |   85.0
```

- **Statements**: درصد خطوط کد که اجرا شده
- **Branches**: درصد شرط‌های if/else که تست شده
- **Functions**: درصد توابع که فراخوانی شده
- **Lines**: درصد خطوط کد که پوشش داده شده

## ✅ چک‌لیست نهایی

قبل از کامیت، مطمئن شوید:

- [ ] تمام تست‌ها pass می‌شوند (`pnpm test`)
- [ ] Coverage حداقل 80% است (`pnpm test --coverage`)
- [ ] هیچ console.log یا debugger در کد نیست
- [ ] تست‌ها مستقل و قابل تکرار هستند
- [ ] MSW handlers درست تنظیم شده‌اند
- [ ] Test utils و wrappers به‌روز هستند
- [ ] تمام edge cases تست شده‌اند
- [ ] Error handling کامل است
- [ ] توضیحات تست‌ها واضح هستند

## 🚨 خطاهای رایج

### ❌ اشتباه 1: تست‌های وابسته به هم
```typescript
// اشتباه
let userId;

it('should create user', () => {
  userId = createUser().id;
});

it('should fetch user', () => {
  const user = getUser(userId); // وابسته به تست قبلی
});
```

### ✅ درست
```typescript
it('should create user', () => {
  const userId = createUser().id;
  expect(userId).toBeDefined();
});

it('should fetch user', () => {
  const userId = 'test-id'; // مستقل
  const user = getUser(userId);
  expect(user).toBeDefined();
});
```

### ❌ اشتباه 2: Hardcoded delays
```typescript
// اشتباه
it('should load data', async () => {
  render(<MyComponent />);
  await new Promise(resolve => setTimeout(resolve, 1000));
  expect(screen.getByText('Data')).toBeInTheDocument();
});
```

### ✅ درست
```typescript
it('should load data', async () => {
  render(<MyComponent />);
  await waitFor(() => {
    expect(screen.getByText('Data')).toBeInTheDocument();
  });
});
```

## 📚 منابع

- **[TESTING_GUIDELINES.markdown](TESTING_GUIDELINES.markdown)**: راهنمای تکنیکال تست‌نویسی
- **[after_task.markdown](after_task.markdown)**: چک‌لیست بعد از تسک
- **[React Testing Library Docs](https://testing-library.com/react)**: مستندات رسمی
- **[Vitest Docs](https://vitest.dev/)**: مستندات Vitest
- **[MSW Docs](https://mswjs.io/)**: مستندات Mock Service Worker

---

**آخرین به‌روزرسانی**: 2024  
**نگهداری توسط**: digi-framework Team

