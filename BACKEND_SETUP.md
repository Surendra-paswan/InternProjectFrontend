# Backend API Integration Guide

## Current Issue: 405 Method Not Allowed

This error means the backend endpoint is not accepting POST requests or the endpoint path is incorrect.

## Possible Solutions:

### 1. Check Your Backend Controller

Your .NET backend endpoint should look like this:

```csharp
[ApiController]
[Route("api/[controller]")]
public class StudentController : ControllerBase
{
    [HttpPost("create")]
    public IActionResult Create([FromBody] StudentDto studentDto)
    {
        // Your logic here
        return Ok(new { message = "Student created successfully", id = newId });
    }
}
```

### 2. Common Endpoint Patterns

Try one of these endpoint configurations in your backend:

**Option A:** `/api/Student/create` (currently using)
**Option B:** `/api/Student` (without /create)
**Option C:** `/api/Students/create`
**Option D:** `/api/student/register`

### 3. Enable CORS in .NET Backend

Add this to your `Program.cs` or `Startup.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

// Before app.Run()
app.UseCors("AllowAll");
```

### 4. Change Endpoint in Frontend

Edit `.env.local` file:

```
VITE_API_URL=https://localhost:7257/api
```

Or modify `src/services/api.ts` line 169:

```typescript
const response = await fetch(`${API_BASE_URL}/Student`, { // Remove /create
```

### 5. Test Backend Endpoint

Use Postman or curl:

```bash
curl -X POST https://localhost:7257/api/Student/create \
  -H "Content-Type: application/json" \
  -d '{"studentDto": {"firstName": "Test"}}'
```

## Next Steps:

1. Check your backend StudentController
2. Verify the route and HTTP method
3. Make sure CORS is enabled
4. Test the endpoint with Postman
5. Update the frontend endpoint if needed
