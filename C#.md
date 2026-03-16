# C# Survival Guide for Absolute Beginners

If you have never used C# before, this is your quick-start map. Keep this open while you practice.

## 1) What C# Is

C# (pronounced "C sharp") is a strongly typed, object-oriented language used for:

- Web APIs and backend apps (ASP.NET Core)
- Desktop apps
- Cloud services
- Games (Unity)

Think of C# as: readable like JavaScript/Python in structure, but stricter and safer with types.

## 2) The Minimum You Need to Run C#

1. Install the .NET SDK
2. Create a project
3. Run it

### Install .NET SDK 10 (Windows, macOS, Linux)

Use one of the options below, then verify with `dotnet --version`.

#### Windows

Option A (recommended): install with `winget`:

```powershell
winget install Microsoft.DotNet.SDK.10
```

Option B: download and run the installer from the official .NET download page:

- Go to https://dotnet.microsoft.com/download
- Select `.NET 10` -> `SDK` -> Windows x64 (or Arm64)
- Run the installer, then restart your terminal

#### macOS

Option A (recommended): install with Homebrew:

```bash
brew update
brew install --cask dotnet-sdk
```

If `dotnet --version` does not show 10.x yet, upgrade and re-check:

```bash
brew upgrade --cask dotnet-sdk
dotnet --list-sdks
```

Option B: use the official installer package from the .NET download page for your chip (Apple Silicon or Intel).

#### Linux

Install from Microsoft packages for your distro.

Ubuntu/Debian (example flow):

```bash
sudo apt-get update
sudo apt-get install -y dotnet-sdk-10.0
```

Fedora/RHEL-based (example):

```bash
sudo dnf install -y dotnet-sdk-10.0
```

If your distro repo is not configured yet, first follow Microsoft's distro setup steps on the .NET Linux install docs, then run the install command above.

#### Verify Installation

```bash
dotnet --version
dotnet --list-sdks
```

You should see an SDK version starting with `10.`.

```bash
dotnet new console -n FirstApp
cd FirstApp
dotnet run
```

You should see: `Hello, World!`


## 3) Your First C# Program

```csharp
using System;

class Program
{
	static void Main()
	{
		Console.WriteLine("Hello, C#");
	}
}
```

### Read this once:

- `using System;` gives access to core classes like `Console`
- `Main()` is the program entry point
- `;` ends statements
- `{}` defines code blocks

## 4) Core Syntax You Must Know

### Variables and types

```csharp
int age = 20;
double price = 19.99;
bool isStudent = true;
string name = "Ava";
char grade = 'A';
```

### Type safety (important)

This will fail:

```csharp
int age = "20"; // error
```

This works:

```csharp
int age = int.Parse("20");
```

## 5) Input and Output

```csharp
Console.Write("Enter your name: ");
string? name = Console.ReadLine();
Console.WriteLine($"Hi, {name}!");
```

Use `$"..."` for string interpolation.

## 6) Decision Making

```csharp
if (age >= 18)
{
	Console.WriteLine("Adult");
}
else if (age >= 13)
{
	Console.WriteLine("Teen");
}
else
{
	Console.WriteLine("Child");
}
```

## 7) Loops

```csharp
for (int i = 0; i < 5; i++)
{
	Console.WriteLine(i);
}

foreach (var item in items)
{
    Console.WriteLine(item);
}

int count = 0;
while (count < 3)
{
	Console.WriteLine("Looping");
	count++;
}
```

## 8) Methods (Functions)

```csharp
static int Add(int a, int b)
{
	return a + b;
}

int result = Add(2, 3); // 5
```

Why methods matter: reuse, readability, easier debugging.

## 9) Arrays and Lists

```csharp
int[] scores = [ 80, 90, 75 ];
Console.WriteLine(scores[0]); // 80
```

```csharp
using System.Collections.Generic;

List<string> names = new List<string>();
names.Add("Ava");
names.Add("Noah");
Console.WriteLine(names.Count); // 2
```

Use arrays for fixed size, `List<T>` for dynamic collections.

## 10) Beginner OOP in 60 Seconds

```csharp
class Student
{
	public string Name { get; set; }
	public int Age { get; set; }

	public Student(string name, int age)
	{
		Name = name;
		Age = age;
	}

	public void Introduce()
	{
		Console.WriteLine($"Hi, I'm {Name} and I'm {Age}.");
	}
}

Student s = new("Ava", 20);
s.Introduce();
```

Concepts:

- Class = blueprint
- Object = instance of class
- Property = object's data - property name should be a noun or adjective
- Method = objects's behavior/actions - method name should be or start with a verb

## 11) Null and Safety (very important)

C# helps you avoid null crashes.

```csharp
string? maybeName = Console.ReadLine();

if (!string.IsNullOrWhiteSpace(maybeName))
{
	Console.WriteLine(maybeName.ToUpper());
}
```

`?` means variable may be null.

## 12) Common First-Week Errors

1. Forgetting `;`
2. Using `=` when you meant `==`
3. Mismatched types (`int` vs `string`)
4. Accessing array index out of range
5. Not checking for null after `ReadLine()`

When stuck, read the error line and one line above it.

## 13) Debugging Survival Tips

- Use `Console.WriteLine()` to inspect variable values
- Set break points and use the debugger
- Reduce problem size: comment out code until the error disappears
- Test one change at a time
- Trust compiler errors: they are usually specific and useful

## 14) Quick C# vs JavaScript Mental Map

- `let x = 5` in JS is often `int x = 5;` in C#
- Functions look similar, but C# requires return types
- C# classes are stricter and typed
- C# compiler catches many mistakes before runtime

## 15) 7-Day Survival Practice Plan

1. Day 1: Variables, types, and `Console.WriteLine`
2. Day 2: `if/else` and comparison operators
3. Day 3: `for` and `while` loops
4. Day 4: Methods with parameters and return values
5. Day 5: Arrays and `List<T>`
6. Day 6: Build one mini app (calculator or grade checker)
7. Day 7: Refactor mini app into a class

## 16) One Mini Project Idea

Build a "Student Grade Calculator":

- Input: student name + 3 scores
- Compute average
- Output pass/fail
- Stretch: store multiple students in a `List<Student>`

## 17) Final Survival Rules

- Write small code blocks and run often
- Prefer clarity over clever tricks
- Keep names descriptive (`totalScore`, not `x`)
- Learn from each compile error
- Consistency beats intensity: 30 minutes daily is enough

## 18) Common C# Project Templates (and When to Use Them)

You can scaffold starter projects with `dotnet new <template-name>`.

- `console`: A command-line app. Best first template for learning core syntax, loops, methods, and classes.
- `classlib`: A reusable class library (no executable). Use this when building shared business logic used by other apps.
- `web`: A minimal ASP.NET Core web app with basic routing. Good for simple websites and learning HTTP endpoints.
- `webapi`: A REST API template with controllers/minimal APIs and OpenAPI support. Use for backend services consumed by frontend/mobile apps.
- `mvc`: ASP.NET Core Model-View-Controller web app. Use when rendering server-side HTML pages with structured UI logic.
- `razor`: Razor Pages web app. Simpler than MVC for page-focused web sites with forms.
- `blazor`: Interactive web UI with C#. Use when you want to build frontend components in C# instead of JavaScript.
- `xunit`, `nunit`, `mstest`: Unit test project templates. Choose one test framework and use it to validate your code automatically.
- `worker`: Long-running background service template. Useful for scheduled jobs, queue processing, or daemon-style tasks.
- `gitignore` and `sln`: Supporting templates for repository setup and solution organization.

Quick examples:

```bash
dotnet new console -n HelloCSharp
dotnet new webapi -n StudentApi
dotnet new xunit -n StudentApi.Tests
```

## 19) How C# Uses Solutions and Projects

In .NET, a project is one app or library, and a solution is a container that groups related projects.

- Project (`.csproj`): build settings, target framework, package references, source files.
- Solution (`.sln`): a top-level organizer for multiple projects that belong to the same system.

Think of it like this:

- One house = one project
- One neighborhood = one solution

Common example structure:

- `StudentApp.sln`
- `StudentApp.Api/StudentApp.Api.csproj`
- `StudentApp.Core/StudentApp.Core.csproj`
- `StudentApp.Tests/StudentApp.Tests.csproj`

Why this matters:

- You can separate concerns (API, business logic, tests)
- Teams can work on different projects in one solution
- Builds and tests are easier to run together

Useful commands:

```bash
dotnet new sln -n StudentApp
dotnet sln StudentApp.sln add StudentApp.Api/StudentApp.Api.csproj
dotnet sln StudentApp.sln add StudentApp.Core/StudentApp.Core.csproj
dotnet sln StudentApp.sln add StudentApp.Tests/StudentApp.Tests.csproj
```

Beginner rule of thumb:

- Small assignment: one project, no solution needed (or optional)
- Real app with API + library + tests: use one solution with multiple projects

## 20) Adding Packages (NuGet) Without Stress

Packages are reusable libraries from NuGet (the .NET package ecosystem).

Add a package to your current project:

```bash
dotnet add package Newtonsoft.Json
```

Add a specific version:

```bash
dotnet add package Serilog --version 3.1.1
```

Remove a package:

```bash
dotnet remove package Newtonsoft.Json
```

Restore packages (downloads dependencies listed in your project file):

```bash
dotnet restore
```

See outdated packages:

```bash
dotnet list package --outdated
```

Quick tips:

- Run package commands from the folder that contains your `.csproj`.
- After adding packages, run `dotnet build` to confirm everything resolves.
- Prefer stable versions unless your class/instructor asks for prerelease builds.

## 21) Common `dotnet` Commands You Will Use Often

These are the daily-driver commands for most students:

- `dotnet --version`: Check installed SDK version.
- `dotnet new <template>`: Create a new project from a template.
- `dotnet sln add <project.csproj>`: Add a project to a solution.
- `dotnet restore`: Download dependencies.
- `dotnet build`: Compile without running.
- `dotnet run`: Build and run app.
- `dotnet test`: Run tests.
- `dotnet watch run`: Run and auto-restart when files change.
- `dotnet clean`: Remove build output.
- `dotnet publish -c Release`: Create deployment-ready output.

Typical beginner workflow:

```bash
dotnet new console -n PracticeApp
cd PracticeApp
dotnet add package Humanizer
dotnet restore
dotnet build
dotnet run
```

## 22) Create a .NET VS Code Profile + Recommended Extensions

A dedicated VS Code profile keeps your .NET setup clean and separate from other stacks.

### Create a .NET profile

Option A (UI):

1. Open VS Code.
2. Select the gear icon in the lower-left corner.
3. Choose Profiles -> Create Profile.
4. Name it: DotNet.
5. Create from Empty profile.

Option B (terminal):

```bash
code --profile DotNet
```

If the profile does not exist yet, VS Code creates it.

### Install recommended extensions for the DotNet profile

Run these commands while using the DotNet profile:

```bash
code --profile DotNet --install-extension ms-dotnettools.csharp
code --profile DotNet --install-extension ms-dotnettools.csdevkit
code --profile DotNet --install-extension microsoft-aspire.aspire-vscode
code --profile DotNet --install-extension humao.rest-client
code --profile DotNet --install-extension ms-azuretools.vscode-containers
code --profile DotNet --install-extension ms-vscode-remote.remote-containers
code --profile DotNet --install-extension ms-mssql.mssql
code --profile DotNet --install-extension davidanson.vscode-markdownlint
code --profile DotNet --install-extension ms-vscode.remote-server
```

What each extension is for:

- `ms-dotnettools.csharp`: C# language support and debugging.
- `ms-dotnettools.csdevkit`: richer .NET project tooling.
- `microsoft-aspire.aspire-vscode`: .NET Aspire app orchestration experience.
- `humao.rest-client`: test APIs directly from `.http` files.
- `ms-azuretools.vscode-containers`: container tooling (build/manage/debug).
- `ms-vscode-remote.remote-containers`: Dev Containers workflow.
- `ms-mssql.mssql`: SQL Server and Azure SQL development.
- `davidanson.vscode-markdownlint`: markdown linting for clean notes/docs.
- `ms-vscode.remote-server`: VS Code Tunnels/Dev Tunnel remote access workflow.

### Optional profile checks

```bash
code --profile DotNet --list-extensions
```

Recommended first-run settings in the DotNet profile:

- Turn on format-on-save.
- Enable C# analyzers.
- Set terminal default profile to PowerShell (Windows) or your preferred shell.
You do not need to know everything in C# to start building useful programs. Start small, run code often, and improve one concept per day.

