# Code First Entity Framework Core Survival Guide (Absolute Beginner Edition)

This guide is for students who are new to:

- C# and .NET
- Databases
- Entity Framework Core (EF Core)

Goal: get you from zero to confidently building and evolving a real database using Code First.

## 1) What "Code First" Means

Code First means you design your data model in C# classes first, then EF Core generates and updates the database schema from that code.

Flow:

1. Write C# entity classes
2. Add DbContext configuration
3. Create migration
4. Apply migration to database
5. Query/update data with LINQ

Think of it as: C# classes are the source of truth, database follows them.

## 2) Core Terms You Must Know

- Entity: C# class mapped to a table
- DbContext: EF Core session object for querying/saving
- DbSet<T>: table-like access for an entity
- Migration: versioned schema change script generated from model changes
- Provider: database-specific package (SQL Server, PostgreSQL, SQLite)
- Change Tracker: EF Core system that knows what changed before SaveChanges

## 3) Prerequisites

You need:

1. .NET SDK 10
2. A database engine (or SQLite file DB)
3. EF Core packages

Verify .NET:

```bash
dotnet --version
```

## 4) Create a Starter Project

```bash
dotnet new console -n EfCodeFirstDemo
cd EfCodeFirstDemo
```

## 5) Install EF Core Packages

### SQL Server setup

```bash
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore.Tools
```

### SQLite setup (simpler for beginners)

```bash
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore.Tools
```

## 6) Create Your First Entity Classes

Example entities:

```csharp
public class Student
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;

    // Navigation property
    public List<Enrollment> Enrollments { get; set; } = new();
}

public class Course
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public int Credits { get; set; }

    public List<Enrollment> Enrollments { get; set; } = new();
}

public class Enrollment
{
    public int StudentId { get; set; }
    public Student Student { get; set; } = null!;

    public int CourseId { get; set; }
    public Course Course { get; set; } = null!;

    public DateTime EnrolledOn { get; set; } = DateTime.UtcNow;
}
```

What EF infers here:

- `Student` and `Course` become tables
- `Enrollment` becomes join table
- `Id` becomes primary key by convention

## 7) Create DbContext

```csharp
using Microsoft.EntityFrameworkCore;

public class SchoolContext : DbContext
{
    public DbSet<Student> Students => Set<Student>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Enrollment> Enrollments => Set<Enrollment>();

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=school.db");
        // For SQL Server:
        // optionsBuilder.UseSqlServer("Server=.;Database=SchoolDb;Trusted_Connection=True;TrustServerCertificate=True");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Composite key for many-to-many bridge table
        modelBuilder.Entity<Enrollment>()
            .HasKey(e => new { e.StudentId, e.CourseId });
    }
}
```

## 8) Install EF CLI Tooling (if needed)

If `dotnet ef` command is missing:

```bash
dotnet tool install --global dotnet-ef
```

Verify:

```bash
dotnet ef
```

## 9) Create Your First Migration

```bash
dotnet ef migrations add InitialCreate
```

What this does:

- Compares model snapshot vs current model
- Generates migration files with Up/Down methods
- Does not update database yet

## 10) Apply Migration to Database

```bash
dotnet ef database update
```

Now your database and tables are created.

## 11) Add and Read Data

```csharp
using var db = new SchoolContext();

var student = new Student { FirstName = "Ava", LastName = "Nguyen" };
var course = new Course { Title = "Intro to C#", Credits = 3 };

db.Students.Add(student);
db.Courses.Add(course);
await db.SaveChangesAsync();

var students = await db.Students
    .OrderBy(s => s.LastName)
    .ToListAsync();
```

## 12) Understand Tracking vs No Tracking

By default, EF tracks query results.

- Tracking query: good when you plan to modify and save
- No-tracking query: faster for read-only data

Example:

```csharp
var readOnlyStudents = await db.Students
    .AsNoTracking()
    .ToListAsync();
```

## 13) Eager Loading Related Data

Use Include to load navigation data in one query.

```csharp
var studentsWithCourses = await db.Students
    .Include(s => s.Enrollments)
    .ThenInclude(e => e.Course)
    .ToListAsync();
```

## 14) Updating and Deleting Data

Update:

```csharp
var s = await db.Students.FirstAsync();
s.LastName = "Patel";
await db.SaveChangesAsync();
```

Delete:

```csharp
var c = await db.Courses.FirstAsync();
db.Courses.Remove(c);
await db.SaveChangesAsync();
```

## 15) Evolving Schema Safely

When model changes:

1. Update C# entity/context
2. Add migration
3. Review migration code
4. Apply update

Commands:

```bash
dotnet ef migrations add AddStudentEmail
dotnet ef database update
```

## 16) Managing Migrations

Useful commands:

```bash
dotnet ef migrations list
dotnet ef migrations remove
dotnet ef database update InitialCreate
```

Notes:

- `migrations remove` only removes last un-applied migration safely
- Database rollback is done via `database update <OlderMigrationName>`

## 17) Fluent API vs Data Annotations

Two ways to configure model:

1. Data annotations in class properties
2. Fluent API in OnModelCreating

Example data annotation:

```csharp
[MaxLength(100)]
public string Title { get; set; } = string.Empty;
```

Example fluent config:

```csharp
modelBuilder.Entity<Course>()
    .Property(c => c.Title)
    .HasMaxLength(100)
    .IsRequired();
```

Rule of thumb:

- Small/simple constraints: annotations
- Complex relationships/indexes/rules: fluent API

## 18) Indexes and Constraints (Performance + Integrity)

Example unique index:

```csharp
modelBuilder.Entity<Course>()
    .HasIndex(c => c.Title)
    .IsUnique();
```

Use indexes for frequent lookups/filtering columns.

## 19) Seeding Starter Data

Simple startup seeding pattern:

```csharp
using var db = new SchoolContext();
await db.Database.MigrateAsync();

if (!await db.Courses.AnyAsync())
{
    db.Courses.AddRange(
        new Course { Title = "Intro to C#", Credits = 3 },
        new Course { Title = "Databases", Credits = 4 });

    await db.SaveChangesAsync();
}
```

## 20) Common Beginner Mistakes

1. Forgetting to create/apply migration after model change
2. Not awaiting async EF calls
3. Loading too much data without filtering
4. Missing Include and then wondering why related data is empty
5. Keeping DbContext alive too long
6. Hardcoding credentials in source code

## 21) Debugging EF Core Quickly

Turn on SQL logging (dev only):

```csharp
optionsBuilder
    .UseSqlite("Data Source=school.db")
    .EnableSensitiveDataLogging()
    .LogTo(Console.WriteLine);
```

Check generated SQL and parameters when results are unexpected.

## 22) Code First Project Structure Suggestion

- `Data/SchoolContext.cs`
- `Models/Student.cs`
- `Models/Course.cs`
- `Models/Enrollment.cs`
- `Migrations/`
- `Program.cs`

This keeps model, data access, and app code readable.

## 23) Production Safety Basics

- Use migrations in CI/CD pipelines
- Back up DB before risky schema changes
- Avoid destructive migration changes without review
- Keep connection strings in config/secrets, not code

## 24) 7-Day EF Core Code First Plan

1. Day 1: Create project, install packages, first model
2. Day 2: DbContext + first migration + update database
3. Day 3: CRUD operations + tracking basics
4. Day 4: Relationships + Include
5. Day 5: Fluent API + constraints/indexes
6. Day 6: Seeding + logging/debugging
7. Day 7: Refactor into clean folders and run full test pass

## 25) Command Cheat Sheet

```bash
# add packages
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore.Tools

# tooling
dotnet tool install --global dotnet-ef

# migrations
dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet ef migrations list
dotnet ef migrations remove

# build/test
dotnet restore
dotnet build
dotnet test
```

## 26) Final Survival Rules

- Treat entity classes as your schema contract
- Every model change must have a migration
- Always review migration code before applying
- Keep DbContext short-lived per unit of work
- Use no-tracking queries for read-heavy scenarios

If you can explain entities, DbContext, migrations, and SaveChanges in your own words, EF Core Code First is no longer a black box.
