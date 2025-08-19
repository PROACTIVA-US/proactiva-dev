# Dagger Quick Reference

## Essential Dagger Documentation Links

### Official Resources
- **Main Docs**: https://docs.dagger.io/
- **TypeScript SDK**: https://docs.dagger.io/sdk/typescript
- **API Reference**: https://docs.dagger.io/api/reference
- **Module Development**: https://docs.dagger.io/manuals/developer/modules
- **Troubleshooting**: https://docs.dagger.io/troubleshooting

### Community Resources
- **Discord**: https://discord.gg/dagger-io
- **GitHub Examples**: https://github.com/dagger/dagger/tree/main/sdk/typescript/examples
- **Daggerverse Modules**: https://daggerverse.dev/

## Dagger Core Concepts

### 1. Container Operations
```typescript
// Basic container
const container = dag.container()
  .from("alpine:latest")
  .withExec(["echo", "hello"])

// With environment variables
container.withEnvVariable("KEY", "value")

// With secret variables (never logged)
container.withSecretVariable("API_KEY", secret)

// With mounted directory
container.withDirectory("/app", directory)

// With mounted cache (persistent)
const cache = dag.cacheVolume("my-cache")
container.withMountedCache("/cache", cache)

// With new file
container.withNewFile("/config.json", JSON.stringify(config))

// Execute and get stdout
const result = await container.stdout()
```

### 2. Directory Operations
```typescript
// Get directory from host
const dir = dag.host().directory("./src")

// Get directory from container
const outputDir = container.directory("/output")

// Create new directory
const newDir = dag.directory()

// Add file to directory
dir.withNewFile("test.txt", "content")

// List directory contents
const entries = await dir.entries()
```

### 3. Service Operations
```typescript
// Create service from container
const service = container
  .withExposedPort(8080)
  .asService()

// Use service in another container
container.withServiceBinding("db", service)

// Get service endpoint
const endpoint = await service.endpoint()
```

### 4. Cache Volumes
```typescript
// Create named cache
const cache = dag.cacheVolume("build-cache")

// Mount cache in container
container.withMountedCache("/cache", cache)

// Cache persists across runs
// Cleared only when engine resets
```

### 5. Secrets
```typescript
// Create secret from string
const secret = dag.setSecret("my-secret", "secret-value")

// Use in container (value never logged)
container.withSecretVariable("TOKEN", secret)

// Mount secret as file
container.withMountedSecret("/run/secrets/token", secret)
```

## Module Development Patterns

### 1. Function Decorators
```typescript
@object()
export class MyModule {
  @func()
  simpleFunction(): string {
    return "hello"
  }

  @func()
  async asyncFunction(): Promise<Container> {
    return dag.container().from("alpine")
  }

  @func()
  withParams(
    name: string,
    optional?: string  // Optional parameter
  ): Container {
    // Implementation
  }
}
```

### 2. Return Types
```typescript
// ✅ Valid return types
@func() returnContainer(): Container
@func() returnDirectory(): Directory
@func() returnFile(): File
@func() returnService(): Service
@func() returnString(): string
@func() returnCacheVolume(): CacheVolume

// ❌ Invalid return types
@func() returnObject(): MyClass  // Custom classes not supported
@func() returnArray(): string[]  // Arrays not directly supported
```

### 3. Parameter Types
```typescript
// ✅ Valid parameters
@func() withString(text: string): Container
@func() withNumber(count: number): Container
@func() withBoolean(flag: boolean): Container
@func() withSecret(secret: Secret): Container
@func() withDirectory(dir: Directory): Container

// ❌ Invalid parameters
@func() withObject(obj: CustomObject): Container  // Use JSON string instead
@func() withArray(items: string[]): Container     // Use comma-separated string
```

## Common Dagger CLI Commands

### Development Commands
```bash
# Initialize new module
dagger init --sdk=typescript

# Develop module (watch mode)
dagger develop

# List available functions
dagger functions

# Get function help
dagger call <function> --help

# Call function
dagger call <function> --param="value"

# Call with secret from stdin
echo "secret" | dagger call <function> --secret=env:STDIN

# Call with directory
dagger call <function> --dir=.
```

### Debugging Commands
```bash
# Show detailed logs
dagger call <function> --debug

# Interactive terminal in container
dagger call <function> terminal

# Export container as tarball
dagger call <function> export --path=container.tar

# Get container logs
dagger call <function> stdout
dagger call <function> stderr
```

### Engine Management
```bash
# Check engine version
dagger version

# Stop engine
docker stop $(docker ps -q --filter name=dagger-engine)

# Remove engine
docker rm $(docker ps -aq --filter name=dagger-engine)

# Clear all caches
rm -rf ~/.dagger .dagger
```

## TypeScript/Dagger Integration

### 1. Async/Await Pattern
```typescript
@func()
async processData(): Promise<Container> {
  // Always use async/await with Dagger operations
  const container = dag.container().from("python:3.11")
  
  // Wait for execution
  await container.withExec(["pip", "install", "pandas"])
  
  // Return the container
  return container
}
```

### 2. Error Handling
```typescript
@func()
async safeOperation(): Promise<Container> {
  try {
    const container = dag.container().from("alpine")
    await container.withExec(["some-command"])
    return container
  } catch (error) {
    // Log error and return fallback
    console.error("Operation failed:", error)
    return dag.container().from("alpine")
      .withExec(["echo", "fallback"])
  }
}
```

### 3. Chaining Operations
```typescript
@func()
buildPipeline(): Container {
  return dag.container()
    .from("node:20")
    .withWorkdir("/app")
    .withExec(["npm", "install"])
    .withExec(["npm", "run", "build"])
    .withExec(["npm", "test"])
}
```

## Troubleshooting Patterns

### Problem: Function Not Appearing
```typescript
// ❌ Wrong - missing decorator
myFunction(): Container {
  return dag.container()
}

// ✅ Correct - has decorator
@func()
myFunction(): Container {
  return dag.container()
}
```

### Problem: Invalid Return Type
```typescript
// ❌ Wrong - returning non-Dagger type
@func()
getData(): any {
  return { data: "value" }
}

// ✅ Correct - return as Container output
@func()
getData(): Container {
  return dag.container()
    .from("alpine")
    .withExec(["echo", JSON.stringify({ data: "value" })])
}
```

### Problem: Complex Parameters
```typescript
// ❌ Wrong - complex object parameter
@func()
processConfig(config: ConfigObject): Container

// ✅ Correct - JSON string parameter
@func()
processConfig(configJson: string): Container {
  const config = JSON.parse(configJson)
  // Use config
}
```

## Performance Tips

### 1. Use Cache Volumes
```typescript
@func()
buildWithCache(): Container {
  const cache = dag.cacheVolume("build-cache")
  return dag.container()
    .from("node:20")
    .withMountedCache("/root/.npm", cache)
    .withExec(["npm", "install"])
}
```

### 2. Minimize Layers
```typescript
// ❌ Many layers
container
  .withExec(["apt-get", "update"])
  .withExec(["apt-get", "install", "git"])
  .withExec(["apt-get", "install", "curl"])

// ✅ Single layer
container
  .withExec(["sh", "-c", "apt-get update && apt-get install -y git curl"])
```

### 3. Parallel Operations
```typescript
@func()
async parallelBuild(): Promise<Container> {
  // Run builds in parallel
  const [frontend, backend] = await Promise.all([
    this.buildFrontend(),
    this.buildBackend()
  ])
  
  // Combine results
  return dag.container()
    .from("alpine")
    .withDirectory("/frontend", frontend.directory("/dist"))
    .withDirectory("/backend", backend.directory("/build"))
}
```

## Security Best Practices

### 1. Never Log Secrets
```typescript
// ❌ Wrong - logs secret
container.withEnvVariable("API_KEY", apiKeyValue)

// ✅ Correct - uses Secret type
const secret = dag.setSecret("api-key", apiKeyValue)
container.withSecretVariable("API_KEY", secret)
```

### 2. Use Minimal Base Images
```typescript
// ❌ Heavy image
.from("ubuntu:latest")

// ✅ Minimal image
.from("alpine:latest")
// or
.from("distroless/python3")
```

### 3. Run as Non-Root
```typescript
container
  .withUser("nobody")
  .withExec(["command"])
```

## Quick Debugging Checklist

```bash
# 1. Check module loads
dagger functions

# 2. Check function signature
dagger call <function> --help

# 3. Check for engine issues
docker ps | grep dagger-engine

# 4. Check for file structure issues
ls -la src/
cat dagger.json

# 5. Clean restart if needed
rm -rf .dagger sdk
dagger develop

# 6. Check class/module name match
grep "export class" src/index.ts
grep '"name"' dagger.json

# 7. Enable debug logging
export DAGGER_LOG_LEVEL=debug
dagger call <function>
```