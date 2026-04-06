# .NET 10 + Aspire 13.1.2+ Survival Guide (Absolute Beginner Edition)

This guide is for students who have never built:

- A distributed application
- A .NET app
- An Aspire app

If you follow this once end-to-end, Aspire will stop feeling like a black box.

## 1) What Is a Distributed Application?

A distributed application is one system made of multiple running parts (services), not one single executable.

Typical parts:

- Web frontend
- API service
- Database
- Cache
- Message broker

Why teams do this:

- Scale parts independently
- Separate responsibilities
- Improve reliability and deployability

Tradeoff:

- You get flexibility, but more moving pieces and operational complexity.

## 2) What .NET Aspire Is

Aspire is an opinionated stack for building, running, and observing distributed apps in .NET.

Think of Aspire as three major things:

1. Orchestration model: describes what services/resources exist and how they depend on each other.
2. Shared defaults: consistent logging, tracing, health checks, resilience defaults.
3. Dashboard + telemetry: built-in visibility into logs, traces, metrics, and topology.

In plain words: Aspire helps you run many services together locally like a small cloud environment.

## 3) Core Mental Model (Most Important)

Aspire usually gives you these projects:

- AppHost: orchestrator. Describes and launches all app parts/resources.
- ServiceDefaults: shared cross-cutting setup for app services.
- App projects: the actual API, worker, frontend, etc.

If you only remember one thing:

- AppHost is the conductor.
- Services are musicians.
- Dashboard is the stage monitor.

## 4) Version Baseline for This Guide

This guide targets modern tooling:

- .NET SDK 10
- Aspire 13.1.2 or later

Verify .NET:

```bash
dotnet --version
dotnet --list-sdks
```

You should see a 10.x SDK.

## 5) Prerequisites by OS

You need all of these:

1. .NET 10 SDK
2. A container runtime (Docker Desktop or Podman)
3. An editor (VS Code recommended)

### Windows

```powershell
winget install Microsoft.DotNet.SDK.10
winget install Docker.DockerDesktop
```

### macOS

```bash
brew install --cask dotnet-sdk
brew install --cask docker
```

### Linux (Ubuntu example)

```bash
sudo apt-get update
sudo apt-get install -y dotnet-sdk-10.0 docker.io
```

Then verify:

```bash
dotnet --version
docker --version
```

## 6) Aspire CLI: Install (Windows, macOS, Linux)

Important: Aspire CLI is a .NET tool, so installation command is the same across OS once .NET is installed.

### Install globally

```bash
dotnet tool install -g Aspire.Cli
```

### Upgrade later

```bash
dotnet tool update -g Aspire.Cli
```

### Verify

```bash
aspire --version
```

If `aspire` is not recognized, restart terminal and ensure your global tool path is on PATH.

### Optional: repo-local installation (team-friendly)

Use this when you want everyone in the repo to use the same CLI version.

```bash
dotnet new tool-manifest
dotnet tool install Aspire.Cli
```

Run local tool commands with:

```bash
dotnet tool run aspire --version
```

## 7) Create Your First Aspire App

```bash
aspire new aspire-starter --name AspireStarter
cd AspireStarter
```

Open solution and run the AppHost project.

CLI approach:

```bash
dotnet run --project AspireStarter.AppHost
```

What should happen:

- AppHost starts child services/resources
- Aspire Dashboard opens
- You can click into resources and view logs/metrics/traces

## 8) What Is Actually Happening Under the Hood

When AppHost starts:

1. It reads your orchestration code (`DistributedApplication.CreateBuilder`).
2. It builds a resource graph (services, containers, dependencies).
3. It calculates startup order.
4. It injects config/env vars (service discovery, connection strings, etc.).
5. It launches resources and app projects.
6. It streams telemetry to dashboard.

Nothing magic is hidden. It is an orchestrator + configuration + telemetry pipeline.

## 9) AppHost Program.cs Anatomy

Typical pattern:

```csharp
var builder = DistributedApplication.CreateBuilder(args);

var cache = builder.AddRedis("cache");
var db = builder.AddPostgres("postgres").AddDatabase("appdb");

builder.AddProject<Projects.AspireStarter_ApiService>("apiservice")
       .WithReference(cache)
       .WithReference(db);

builder.AddProject<Projects.AspireStarter_Web>("webfrontend")
       .WithReference(cache)
       .WithReference(db)
       .WithReference(builder.AddProject<Projects.AspireStarter_ApiService>("apiservice"));

builder.Build().Run();
```

Key concepts:

- `AddProject`: register a .NET service/project.
- `AddRedis`, `AddPostgres`, `AddSqlServer`: register infrastructure resources.
- `WithReference`: declare dependency and pass needed connection/config info.
- `Build().Run()`: finalize graph and start orchestration.

## 10) Service Discovery (How Services Find Each Other)

In distributed systems, hardcoding localhost ports is fragile.

Aspire solves this by wiring endpoints/config automatically. Services refer to named resources instead of fixed host:port strings.

Result:

- Fewer manual config errors
- Easier local/cloud parity

## 11) ServiceDefaults Project (Why It Exists)

`ServiceDefaults` centralizes cross-cutting setup for all services.

Usually includes:

- OpenTelemetry setup
- Health checks
- Resilience defaults (retry/timeouts where configured)
- Common endpoint conventions

Why this matters:

- Every service has consistent operational behavior
- You do not copy-paste observability code across projects

## 12) Dashboard: What to Look At First

In Aspire Dashboard, focus on these tabs:

1. Resources/Topology: which parts are running and dependencies
2. Logs: per-resource logs in one place
3. Traces: request flow across services
4. Metrics: latency, throughput, runtime and network signals

This is your primary debugging UI in Aspire workflows.

## 13) Understanding Dependencies and Startup Order

When service A needs DB B, define the reference and wait behavior.

Typical relationship tools:

- `WithReference(...)`: inject configuration and dependency link
- `WaitFor(...)` or `WaitForCompletion(...)`: control startup sequencing when needed

Use these to avoid race conditions at app startup.

## 14) Containers in Aspire (Not Optional for Most Scenarios)

Many Aspire resources (Redis/Postgres/SQL Server) run as containers locally.

That is why Docker/Podman is required.

What AppHost does:

- Pulls image
- Creates/runs container
- Connects app services to that resource
- Exposes endpoints for local development

## 15) Config and Secrets Without Confusion

Distributed apps need many settings.

Where config can come from:

- App settings files
- Environment variables
- User secrets (dev)
- Cloud secret stores (later)

Aspire commonly injects resource connection details as environment values into dependent projects.

Rule for students:

- Never hardcode secrets in source code.

## 16) Day-1 Development Workflow

1. Start AppHost
2. Open dashboard
3. Open web/API resource links
4. Reproduce issue
5. Check logs then traces
6. Fix one service at a time
7. Restart and re-verify

Use `dotnet watch` for rapid iterations where appropriate.

## 17) Local vs Cloud Mental Model

Local Aspire:

- Great for fast development
- Often uses local containers/emulators

Cloud deployment:

- Same distributed model
- Managed resources and infrastructure boundaries
- Often paired with Azure Developer CLI (`azd`) for deployment automation

Aspire helps you design once and run in both contexts with fewer changes.

## 18) Common Beginner Errors and Why They Happen

1. Forgetting Docker is required for containerized resources
2. Starting service project directly instead of AppHost
3. Missing resource references (`WithReference`)
4. Incorrect package/version drift across Aspire packages
5. Assuming one failing service means whole app is broken

Debug sequence:

- Confirm resource state in dashboard
- Check failing service logs
- Check distributed trace for upstream/downstream failure path

## 19) Aspire 13.1.2+ Version Hygiene

Keep Aspire package versions aligned across related projects.

Tips:

- Update Aspire packages together, not one at a time
- Build from solution root after updates
- Run tests and app host after upgrades

Useful commands:

```bash
dotnet list package --outdated
dotnet restore
dotnet build
```

If upgrading from very old Aspire (8 era), remove legacy workload if still present:

```bash
dotnet workload list
# If aspire workload appears from old setup:
dotnet workload uninstall aspire
```

## 20) First Real Exercise (No Black Box)

Build a tiny distributed system:

- `webfrontend` (Blazor or ASP.NET Core web)
- `apiservice` (Minimal API)
- `redis` cache resource

Learning goals:

- Add resources in AppHost
- Add project references
- Watch logs/traces in dashboard
- Simulate failure (stop a service) and observe behavior

## 21) Essential Commands Cheat Sheet

```bash
# .NET checks
dotnet --version
dotnet --list-sdks

# Aspire CLI
dotnet tool install -g Aspire.Cli
dotnet tool update -g Aspire.Cli
aspire --version

# New app
aspire new aspire-starter --name AspireStarter
cd AspireStarter

# Run AppHost
dotnet run --project AspireStarter.AppHost

# Diagnostics
(dotnet list package --outdated)
dotnet build
```

## 22) VS Code Setup for Aspire Students

Recommended extensions:

- C# (`ms-dotnettools.csharp`)
- C# Dev Kit (`ms-dotnettools.csdevkit`)
- Aspire (`microsoft-aspire.aspire-vscode`)
- Container Tools (`ms-azuretools.vscode-containers`)
- Dev Containers (`ms-vscode-remote.remote-containers`)
- REST Client (`humao.rest-client`)

## 23) How to Think Like a Distributed Systems Developer

Instead of asking "Why does my app not run?", ask:

1. Which resource failed?
2. Is it startup, network, config, auth, or data?
3. Is this failure local to one service or cross-service?
4. What do traces/logs prove?

This mindset is the difference between random guessing and professional debugging.

## 24) 7-Day Survival Plan

1. Day 1: Run starter app, inspect dashboard only
2. Day 2: Add one new endpoint and trace it
3. Day 3: Add Redis reference and use it
4. Day 4: Add database resource and basic CRUD
5. Day 5: Break config intentionally and debug from logs
6. Day 6: Add health checks and verify status
7. Day 7: Demo full request path across services

## 25) Final Survival Rules

- Always run AppHost, not just one project
- Treat AppHost as source of truth for topology
- Keep package versions aligned
- Use dashboard before guessing
- Make one change at a time and verify

You are not expected to master distributed systems in a week. If you can explain AppHost, references, resources, and tracing in your own words, you are already ahead of most beginners.
