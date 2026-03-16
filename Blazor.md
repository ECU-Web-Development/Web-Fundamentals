# Blazor Survival Guide (.NET 10) for Absolute Beginners

This guide is for students who are new to:

- Web programming
- C#
- Blazor

Goal: help you build your first modern Blazor app without getting lost.

## 1) What Blazor Is in Plain English

Blazor is a .NET web UI framework where you build interactive pages using C# and Razor components.

In a Blazor app, you write:

- UI markup (HTML-like Razor syntax)
- Behavior in C#
- Styling with CSS

Blazor in .NET 10 supports server rendering and client interactivity in a single app model (Blazor Web App).

## 2) The Web Basics You Need First

Before Blazor details, know these concepts:

- Browser requests pages over HTTP.
- Server returns HTML, CSS, JS, or JSON.
- UI events (click, input, submit) trigger code.
- URL routes decide what page/component to show.

If these feel new, that is normal. You will learn them while building.

## 3) Blazor Render Modes (Very Important)

In modern Blazor Web Apps, each component can have a render mode.

- Static Server: server renders HTML only, no interactivity.
- Interactive Server: interactivity handled on the server over a live connection.
- Interactive WebAssembly: app runs on the client with .NET in WebAssembly.
- Interactive Auto: starts server-interactive, then can use client rendering on later visits.

Beginner recommendation:

- Start with Interactive Server for the easiest learning path.
- Learn WebAssembly and Auto after you are comfortable with components and routing.

## 4) Install and Verify .NET 10

Install .NET SDK 10, then verify:

```bash
dotnet --version
dotnet --list-sdks
```

You want an SDK version starting with `10.`.

## 5) Create Your First Blazor Web App

```bash
dotnet new blazor -n BlazorSurvival
cd BlazorSurvival
dotnet run
```

Open the localhost URL shown in terminal.

## 6) Know the Core Project Files

Key files/folders you will touch often:

- `Program.cs`: app setup, services, endpoints
- `Components/App.razor`: root app component
- `Components/Routes.razor`: routing setup
- `Components/Pages`: routeable pages
- `Components/Layout`: layout and navigation
- `wwwroot`: static files (images, custom JS, CSS)
- `appsettings.json`: config

Do not memorize everything. Just know where to look.

## 7) Component Basics in 90 Seconds

A Blazor component is a `.razor` file.

Example `Counter.razor`:

```razor
@page "/counter"

<h1>Counter</h1>
<p>Current count: @count</p>
<button @onclick="Increment">Click me</button>

@code {
    private int count = 0;

    private void Increment()
    {
        count++;
    }
}
```

What to notice:

- `@page` gives the route
- `@onclick` wires a UI event to C# code
- `@code` holds component state and methods

## 8) Data Binding and Forms

Two-way binding example:

```razor
<input @bind="name" />
<p>Hello, @name</p>

@code {
    private string name = "Student";
}
```

Simple form with validation pattern:

```razor
<EditForm Model="student" OnValidSubmit="HandleSubmit">
    <DataAnnotationsValidator />
    <ValidationSummary />

    <InputText @bind-Value="student.Name" />
    <button type="submit">Save</button>
</EditForm>

@code {
    private StudentInput student = new();

    private void HandleSubmit()
    {
        // save data here
    }

    public class StudentInput
    {
        public string Name { get; set; } = string.Empty;
    }
}
```

## 9) Passing Data Between Components

Parent to child uses parameters.

Child component:

```razor
<h3>@Title</h3>

@code {
    [Parameter]
    public string Title { get; set; } = string.Empty;
}
```

Parent usage:

```razor
<MyCard Title="Welcome" />
```

Child to parent uses `EventCallback`.

## 10) Routing and Navigation

Routing maps URLs to components.

```razor
@page "/students/{id:int}"

<h1>Student @id</h1>

@code {
    [Parameter]
    public int id { get; set; }
}
```

Use `NavLink` in menus so active pages are highlighted.

## 11) Calling an API from Blazor

You will often load data from a backend API.

```razor
@inject HttpClient Http

@if (students is null)
{
    <p>Loading...</p>
}
else
{
    <ul>
        @foreach (var s in students)
        {
            <li>@s.Name (@s.Major)</li>
        }
    </ul>
}

@code {
    private List<Student>? students;

    protected override async Task OnInitializedAsync()
    {
        students = await Http.GetFromJsonAsync<List<Student>>("/api/students");
    }

    private record Student(int Id, string Name, string Major);
}
```

## 12) Program.cs Mental Model

Just like other ASP.NET Core apps, `Program.cs` has two phases:

1. Configure services before build
2. Configure pipeline/endpoints after build

Example shape:

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorComponents();

var app = builder.Build();

app.UseHttpsRedirection();
app.MapRazorComponents<App>();

app.Run();
```

## 13) State Management (Beginner Level)

Start with local component state (`private` fields in `@code`).

When multiple components need shared data:

- Create a small state service class
- Register it in DI
- Inject it where needed

Do not over-engineer state in week one.

## 14) JavaScript Interop

Blazor covers most UI cases, but sometimes you need browser APIs or an existing JS library.

Use JS interop only when needed.

- Prefer native Blazor first
- Keep JS calls small and isolated

## 15) Common Beginner Mistakes

1. Trying to learn all render modes at once
2. Mixing too much logic directly in markup
3. Not using reusable components early
4. Forgetting `StateHasChanged` in advanced async/manual scenarios
5. Ignoring null checks on async-loaded data
6. Not separating display models from API/domain models later on

## 16) Debugging Survival Tips

- Read terminal output first
- Check browser dev tools console and network tab
- Verify routes match `@page` directives exactly
- Add temporary UI output to inspect state values
- Reproduce one bug with the smallest possible component

## 17) Daily Command Cheat Sheet

```bash
dotnet new blazor -n MyBlazorApp
cd MyBlazorApp
dotnet run
dotnet watch run
dotnet build
dotnet test
dotnet add package <PackageName>
dotnet restore
```

## 18) 7-Day Blazor Learning Plan

1. Day 1: Project structure, routing, and basic components
2. Day 2: Events and data binding
3. Day 3: Forms and validation
4. Day 4: Reusable components and parameters
5. Day 5: API calls with `HttpClient`
6. Day 6: Shared state with DI services
7. Day 7: Build and polish a mini app

## 19) Mini Project Idea

Build a Student Tracker app:

- Page 1: list students
- Page 2: add student form
- Page 3: student details
- Optional: connect to ASP.NET Core API for persistence

## 20) Getting Started with MudBlazor

MudBlazor is a popular Material Design component library for Blazor.

Install package:

```bash
dotnet add package MudBlazor
```

Register services in Program.cs:

```csharp
builder.Services.AddMudServices();
```

Add MudBlazor using to your global imports (usually in `_Imports.razor`):

```razor
@using MudBlazor
```

Use a first component on any page:

```razor
<MudButton Variant="Variant.Filled" Color="Color.Primary">Save</MudButton>
```

Common first components to try:

- `MudButton`
- `MudTextField`
- `MudTable`
- `MudDialog`

Beginner tip: start by replacing basic HTML controls one by one instead of redesigning your whole app at once.

## 21) Getting Started with FluentBlazor

FluentBlazor (Microsoft Fluent UI for Blazor) provides Microsoft Fluent-styled components.

Install package:

```bash
dotnet add package Microsoft.FluentUI.AspNetCore.Components
```

Register services in Program.cs:

```csharp
builder.Services.AddFluentUIComponents();
```

Add using to your global imports (usually in `_Imports.razor`):

```razor
@using Microsoft.FluentUI.AspNetCore.Components
```

Use a first component on any page:

```razor
<FluentButton Appearance="Appearance.Accent">Submit</FluentButton>
```

Common first components to try:

- `FluentButton`
- `FluentTextField`
- `FluentDataGrid`
- `FluentDialog`

Beginner tip: use FluentBlazor if you want a Microsoft 365/Windows-style visual language and accessible default controls.
## 22) Final Survival Rules

- Keep components small and focused
- Build one feature at a time
- Use clear naming for components and parameters
- Test each route after every major change
- Consistency beats intensity: 30-45 minutes daily works

You do not need to master all of Blazor in one week. Learn components, routing, forms, and API calls first. That foundation is enough to start shipping useful apps.

