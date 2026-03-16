# ASP.NET Core (.NET 10) Survival Guide for Absolute Beginners

This guide is for students who are new to:

- Web programming
- REST APIs
- C#

Goal: get you from zero to "I can build and test a real API" quickly.

## 1) Big Picture: What You Are Building

An ASP.NET Core web API is an app that listens for HTTP requests and returns HTTP responses, usually JSON.

Example:

- Request: `GET /api/students/42`
- Response: `200 OK` + JSON data for student 42

Think of it like a waiter system:

- Client (browser, mobile app, React app, Postman) places an order (HTTP request)
- Server (your ASP.NET Core API) processes it
- Server returns a result (HTTP status + JSON)

## 2) Core Vocabulary You Must Know

- HTTP: the protocol used by web apps.
- URL/Route: where the request goes (for example `/api/students`).
- Endpoint: one route + one HTTP method handler.
- JSON: text format used to send data.
- REST: style for organizing API endpoints around resources.
- Resource: a "thing" in your system (`students`, `courses`, `orders`).

## 3) REST in 5 Minutes

For a `students` resource, common endpoints are:

- `GET /api/students` -> list students
- `GET /api/students/{id}` -> get one student
- `POST /api/students` -> create student
- `PUT /api/students/{id}` -> replace/update student
- `PATCH /api/students/{id}` -> partial update
- `DELETE /api/students/{id}` -> delete student

Common status codes:

- `200 OK`: success
- `201 Created`: created successfully
- `204 No Content`: success, nothing to return
- `400 Bad Request`: invalid input
- `404 Not Found`: resource not found
- `500 Internal Server Error`: server crashed or failed

## 4) Install and Verify .NET 10

Install .NET SDK 10, then verify:

```bash
dotnet --version
dotnet --list-sdks
```

You want to see an SDK version starting with `10.`.

## 5) Create Your First ASP.NET Core API

Create project:

```bash
dotnet new webapi -n StudentApi
cd StudentApi
dotnet run
```

You should see logs with a localhost URL (for example `https://localhost:7xxx`).

## 6) Minimal API: The Modern Default

For new projects, Minimal APIs are a great starting point because they are small and fast to understand.

`Program.cs` is the center of your app.

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
	app.MapOpenApi();
}

app.MapGet("/", () => "Student API is running");

app.Run();
```

What this does:

- Creates the app host
- Registers services
- Builds middleware pipeline
- Maps endpoint(s)
- Starts server

## 6.1) `Program.cs` Builder Concept: Two Sections

Modern ASP.NET Core `Program.cs` is easiest to understand as two phases.

### Phase 1: Configure services (before `builder.Build()`)

This is where you describe what your app needs.

- Add framework services (`AddOpenApi`, `AddControllers`, `AddAuthentication`)
- Register your own services (`AddScoped`, `AddSingleton`, `AddTransient`)
- Configure options and settings

Think of this as your app's "shopping list".

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddSingleton<TimeService>();
```

### Phase 2: Configure request pipeline and endpoints (after `builder.Build()`)

After `var app = builder.Build();`, you configure how requests flow through the app.

- Add middleware (`UseHttpsRedirection`, `UseAuthentication`, `UseAuthorization`)
- Map endpoints/routes (`MapGet`, `MapPost`, `MapControllers`, `MapOpenApi`)

Think of this as "how requests are processed".

```csharp
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
	app.MapOpenApi();
}

app.UseHttpsRedirection();
app.MapGet("/", () => "Hello");
app.Run();
```

Quick rule:

- Before `Build()`: register dependencies/services
- After `Build()`: define middleware pipeline and endpoints

If you keep this mental model, `Program.cs` becomes much easier to reason about.

## 7) Build a Tiny Real API (CRUD)

Use this in `Program.cs` to create an in-memory students API:

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
	app.MapOpenApi();
}

var students = new List<Student>
{
	new(1, "Ava", "Math"),
	new(2, "Noah", "Computer Science")
};

app.MapGet("/api/students", () => Results.Ok(students));

app.MapGet("/api/students/{id:int}", (int id) =>
{
	var student = students.FirstOrDefault(s => s.Id == id);
	return student is null ? Results.NotFound() : Results.Ok(student);
});

app.MapPost("/api/students", (StudentCreateRequest request) =>
{
	if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Major))
	{
		return Results.BadRequest("Name and Major are required.");
	}

	var nextId = students.Count == 0 ? 1 : students.Max(s => s.Id) + 1;
	var student = new Student(nextId, request.Name, request.Major);
	students.Add(student);

	return Results.Created($"/api/students/{student.Id}", student);
});

app.MapDelete("/api/students/{id:int}", (int id) =>
{
	var student = students.FirstOrDefault(s => s.Id == id);
	if (student is null)
	{
		return Results.NotFound();
	}

	students.Remove(student);
	return Results.NoContent();
});

app.Run();

record Student(int Id, string Name, string Major);
record StudentCreateRequest(string Name, string Major);
```

Important note: this example stores data in memory only. Restarting the app resets data.

## 8) How to Test Your API

### Option A: Use a `.http` file (great in VS Code)

```http
@baseUrl = https://localhost:7001

### Get all students
GET {{baseUrl}}/api/students

### Create a student
POST {{baseUrl}}/api/students
Content-Type: application/json

{
  "name": "Liam",
  "major": "Physics"
}

### Get one student
GET {{baseUrl}}/api/students/1

### Delete one student
DELETE {{baseUrl}}/api/students/1
```

Update the port to your running app URL.

### Option B: Use curl

```bash
curl -k https://localhost:7001/api/students
```

## 9) Project Structure: What Files Matter Most

Typical starter structure:

- `Program.cs`: app startup, services, middleware, routes
- `appsettings.json`: configuration values
- `Properties/launchSettings.json`: local launch profiles/URLs
- `StudentApi.csproj`: project settings and package references

As your app grows, you add folders such as:

- `Models` (data shapes)
- `Endpoints` or `Controllers` (HTTP handlers)
- `Services` (business logic)
- `Data` (database code)

## 10) Dependency Injection (DI) Without Fear

DI means: register services once, request them where needed.

Define Service:

```csharp
class TimeService
{
	public string Now() => DateTime.UtcNow.ToString("O");
}
```

Register:

```csharp
builder.Services.AddSingleton<TimeService>();
```

Use in endpoint:

```csharp
app.MapGet("/api/time", (TimeService svc) => svc.Now());

```

This is core to modern ASP.NET Core design.

## 11) Middleware Pipeline (Request Flow)

Middleware runs in order. Think: request passes through a chain.

Common middleware you will see:

- `UseHttpsRedirection()`
- `UseAuthentication()`
- `UseAuthorization()`

Order matters. Wrong order can break auth and routing behavior.

## 12) Model Validation Basics

Never trust client input.

Beginner approach:

- Check required fields manually
- Return `400 Bad Request` for invalid payloads

Later you can add data annotations and automatic validation patterns.

## 13) Moving from In-Memory to a Real Database

Most student projects start in-memory and then move to EF Core.

Typical path:

1. Add EF Core packages
2. Create `DbContext`
3. Register context in DI
4. Use migrations
5. Replace list-based storage with database queries

For learning, start simple. Do not begin with full database complexity on day one.

## 14) Authentication and Authorization (High Level)

- Authentication: "Who are you?"
- Authorization: "What are you allowed to do?"

Do not implement custom auth from scratch in beginner projects. Use ASP.NET Core built-in auth/JWT libraries when your course reaches that topic.

## 15) Common Beginner Mistakes

1. Confusing route parameters and JSON body
2. Returning `200` for everything instead of proper status codes
3. Forgetting to validate input
4. Mixing business logic directly into large route handlers
5. Ignoring logs when debugging
6. Not testing endpoints after every change

## 16) Debugging Survival Tips

- Read server logs first
- Reproduce one endpoint at a time
- Print key values during request handling
- Use breakpoints in `Program.cs` and handler methods
- Check exact request URL, method, headers, and JSON body

## 17) Daily Command Cheat Sheet

```bash
dotnet new webapi -n StudentApi
dotnet run
dotnet watch run
dotnet build
dotnet test
dotnet add package <PackageName>
dotnet restore
```

## 18) A 7-Day Beginner Study Plan

1. Day 1: HTTP basics (methods, routes, status codes)
2. Day 2: Build first Minimal API with GET endpoints
3. Day 3: Add POST/DELETE and return proper status codes
4. Day 4: Practice input validation and error responses
5. Day 5: Learn DI and split code into small services
6. Day 6: Add persistence (EF Core or another data store)
7. Day 7: Clean up, document API, and demo it

## 19) What "Good" Looks Like in a Student API

- Endpoints have clear names and routes
- Correct status codes are used consistently
- Invalid requests return helpful errors
- Logic is split into manageable units
- README includes run/test instructions

## 20) Final Survival Rules

- Build tiny, test often
- Prefer clear code over clever code
- One endpoint at a time beats trying to build everything at once
- If stuck, reduce scope and get one happy path working
- Consistency wins: 30-45 focused minutes daily is enough to make progress

You do not need to master all of ASP.NET Core at once. Learn the request/response loop, build a few clean endpoints, and iterate.
