# Introduction to React

A step-by-step guide to building React applications using **Bun** and **Vite**.

---

## Table of Contents

1. [Project Setup](#1-project-setup)
2. [Project Structure](#2-project-structure)
3. [How React Bootstraps](#3-how-react-bootstraps)
4. [The Root Component](#4-the-root-component)
5. [Components & JSX](#5-components--jsx)
6. [JSX Basics](#6-jsx-basics)
7. [Default vs Named Exports](#7-default-vs-named-exports)
8. [ES Module Import / Export](#8-es-module-import--export)
9. [Nested Components](#9-nested-components)
10. [File & Folder Organization](#10-file--folder-organization)
11. [Destructuring](#11-destructuring)
12. [Spread & Rest Operators](#12-spread--rest-operators)
13. [Map, Filter, Reduce](#13-map-filter-reduce)
14. [Props](#14-props)
15. [Closures](#15-closures)
16. [Component Architecture](#16-component-architecture)
17. [Rendering Lists](#17-rendering-lists)
18. [Conditional Rendering](#18-conditional-rendering)
19. [useState](#19-usestate)
20. [useEffect](#20-useeffect)
21. [Context API](#21-context-api)
22. [Styling Approaches](#22-styling-approaches)
23. [Routing](#23-routing)
24. [useCallback & useMemo](#24-usecallback--usememo)
25. [Zustand](#25-zustand)

---

## 1. Project Setup

### Prerequisites

Install [Bun](https://bun.sh):

```bash
curl -fsSL https://bun.sh/install | bash
```

### Scaffold a new React + Vite project

```bash
bun create vite my-app --template react
cd my-app
bun install
bun run dev
```

Bun replaces Node/npm as the JavaScript runtime and package manager. Vite is the build tool and dev server — it provides near-instant hot module replacement (HMR).

---

## 2. Project Structure

After scaffolding, the project looks like this:

```
my-app/
├── public/               # Static assets served as-is (favicon, images)
│   └── vite.svg
├── src/                  # All application source code lives here
│   ├── assets/           # Imported assets (processed by Vite)
│   │   └── react.svg
│   ├── App.css           # Styles scoped to App component
│   ├── App.jsx           # Root component of the React application
│   ├── index.css         # Global styles applied to the whole page
│   └── main.jsx          # Entry point — mounts React into the HTML page
├── index.html            # The single HTML file Vite serves
├── package.json          # Project metadata, dependencies, and scripts
└── vite.config.js        # Vite configuration
```

### Key files explained

| File | Purpose |
|------|---------|
| `index.html` | The single HTML page. Vite injects the JS bundle here. |
| `src/main.jsx` | JavaScript entry point. Mounts the React app into the DOM. |
| `src/App.jsx` | The top-level React component, rendered by `main.jsx`. |
| `src/index.css` | Global CSS — resets, fonts, body styles. |
| `src/App.css` | Styles specific to the `App` component. |
| `public/` | Files here are copied unchanged to the build output. Reference them with an absolute path like `/vite.svg`. |
| `vite.config.js` | Configure the Vite dev server, plugins, and build options. |
| `package.json` | Lists dependencies (`react`, `react-dom`) and scripts (`dev`, `build`, `preview`). |

---

## 3. How React Bootstraps

React needs a single HTML element to "mount" into. Vite's `index.html` provides it:

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My React App</title>
  </head>
  <body>
    <!-- React mounts the entire application inside this div -->
    <div id="root"></div>

    <!-- Vite injects the compiled JS bundle here at build time -->
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

`src/main.jsx` is the JavaScript entry point. It grabs the `#root` element and hands it to React:

```jsx
// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';       // Global styles loaded once here
import App from './App.jsx'; // The root component

// 1. Find the DOM node to mount into
const rootElement = document.getElementById('root');

// 2. Create a React root (React 18+ API)
const root = createRoot(rootElement);

// 3. Render the top-level component into the root
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

**`StrictMode`** is a development-only wrapper that activates extra warnings and double-invokes certain functions to help you catch bugs early. It has no effect in production.

**Bootstrap flow:**

```
Browser loads index.html
  → Vite serves /src/main.jsx
    → main.jsx calls createRoot(document.getElementById('root'))
      → root.render(<App />) paints the first UI
```

---

## 4. The Root Component

`App.jsx` is the root (top-level) component. Everything rendered on screen is a descendant of `App`.

```jsx
// src/App.jsx
import './App.css';

function App() {
  return (
    <div className="app">
      <h1>Hello, React!</h1>
      <p>This is the root component.</p>
    </div>
  );
}

export default App;
```

> **Why a "root" component?** React builds a **component tree** — a hierarchy of components where each parent renders its children. `App` is the single root of that tree, making it the natural place to put top-level layout, routing, and global providers.

---

## 5. Components & JSX

A **React component** is just a JavaScript function that returns UI described as **JSX**.

```jsx
// A minimal component
function Greeting() {
  return <h1>Hello, world!</h1>;
}
```

Rules for components:
- The function name **must start with a capital letter** (`Greeting`, not `greeting`). This is how React distinguishes components from plain HTML tags.
- The function must **return JSX** (or `null` to render nothing).
- Components can be used like HTML tags: `<Greeting />`.

```jsx
// src/App.jsx
function Greeting() {
  return <h1>Hello, world!</h1>;
}

function App() {
  return (
    <div>
      <Greeting />   {/* Using the component */}
      <Greeting />   {/* Reusable — render as many times as needed */}
    </div>
  );
}

export default App;
```

---

## 6. JSX Basics

**JSX** (JavaScript XML) is a syntax extension that looks like HTML but compiles to JavaScript function calls. Vite + the React plugin transform JSX automatically.

### Rules of JSX

**1. Return a single root element**

Wrap multiple elements in a parent `<div>` or a **Fragment** (`<>...</>`):

```jsx
// ❌ Invalid — two sibling root elements
function Bad() {
  return (
    <h1>Title</h1>
    <p>Paragraph</p>
  );
}

// ✅ Valid — wrapped in a Fragment (no extra DOM node)
function Good() {
  return (
    <>
      <h1>Title</h1>
      <p>Paragraph</p>
    </>
  );
}
```

**2. Use `className` instead of `class`**

```jsx
// HTML uses class="..."
// JSX uses className="..." because class is a reserved word in JavaScript
<div className="container">...</div>
```

**3. Self-close tags with no children**

```jsx
<img src="photo.jpg" alt="A photo" />
<input type="text" />
<br />
```

**4. JavaScript expressions inside `{}`**

```jsx
function Profile() {
  const name = 'Alice';
  const age = 30;

  return (
    <div>
      <p>Name: {name}</p>
      <p>Age: {age}</p>
      <p>Born: {new Date().getFullYear() - age}</p>
      <p>Uppercase: {name.toUpperCase()}</p>
    </div>
  );
}
```

**5. Inline styles use objects with camelCase properties**

```jsx
const style = { backgroundColor: 'steelblue', fontSize: '1.2rem' };

function StyledBox() {
  return <div style={style}>Styled!</div>;
}

// Or inline:
<div style={{ color: 'red', marginTop: '8px' }}>Red text</div>
```

**6. Comments in JSX**

```jsx
function WithComments() {
  return (
    <div>
      {/* This is a JSX comment */}
      <p>Visible content</p>
    </div>
  );
}
```

---

## 7. Default vs Named Exports

JavaScript modules can export values in two ways, and React projects use both.

### Default Export

A file can have **one** default export. It can be imported with any name.

```jsx
// src/Button.jsx
function Button({ label }) {
  return <button>{label}</button>;
}

export default Button; // ← default export
```

```jsx
// Importing — name can be anything
import Button from './Button';
import Btn from './Button';     // also valid
import MyButton from './Button'; // also valid
```

### Named Export

A file can have **many** named exports. They must be imported using the exact exported name (or aliased with `as`).

```jsx
// src/utils.jsx
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }
export const PI = 3.14159;
```

```jsx
// Importing named exports — use exact names in braces
import { add, subtract, PI } from './utils';

// Rename on import
import { add as sum } from './utils';
```

### When to use which?

| Scenario | Use |
|----------|-----|
| One main thing per file (a component) | Default export |
| Multiple utilities from one file | Named exports |
| React hooks, constants, helpers | Named exports |

```jsx
// A file can have both
// src/Card.jsx
export function CardHeader({ title }) {        // named
  return <h2>{title}</h2>;
}

export function CardBody({ children }) {       // named
  return <div className="card-body">{children}</div>;
}

export default function Card({ title, children }) { // default
  return (
    <div className="card">
      <CardHeader title={title} />
      <CardBody>{children}</CardBody>
    </div>
  );
}
```

```jsx
import Card, { CardHeader, CardBody } from './Card';
```

---

## 8. ES Module Import / Export

React projects use **ES Modules** (ESM) — the standard JavaScript module system. Every `.jsx` / `.js` file is its own module with its own scope.

### Exporting

```js
// src/math.js

// Named exports
export const PI = 3.14159;
export function circle(r) { return PI * r * r; }

// You can also export at the bottom:
function square(n) { return n * n; }
export { square };

// Default export
export default function main() { console.log('main'); }
```

### Importing

```js
// Named imports
import { PI, circle } from './math';

// Default import
import main from './math';

// Both at once
import main, { PI, circle } from './math';

// Rename
import { circle as circleArea } from './math';

// Import everything as a namespace object
import * as MathUtils from './math';
MathUtils.circle(5);
```

### Re-exporting (barrel files)

A common pattern is creating an `index.js` that re-exports from several files, making imports cleaner:

```js
// src/components/index.js
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Modal } from './Modal';
```

```jsx
// Instead of:
import Button from './components/Button';
import Card from './components/Card';

// You can write:
import { Button, Card } from './components';
```

---

## 9. Nested Components

Components can render other components, forming a **tree**. Data flows **down** the tree via props (covered in section 14).

```jsx
// src/App.jsx

function Avatar({ src, alt }) {
  return <img src={src} alt={alt} className="avatar" />;
}

function UserInfo({ name, role }) {
  return (
    <div className="user-info">
      <strong>{name}</strong>
      <span>{role}</span>
    </div>
  );
}

function UserCard({ name, role, avatarSrc }) {
  return (
    <div className="user-card">
      {/* Avatar and UserInfo are nested inside UserCard */}
      <Avatar src={avatarSrc} alt={`${name}'s avatar`} />
      <UserInfo name={name} role={role} />
    </div>
  );
}

function App() {
  return (
    <div>
      {/* UserCard contains Avatar and UserInfo */}
      <UserCard name="Alice" role="Engineer" avatarSrc="/alice.jpg" />
      <UserCard name="Bob"   role="Designer" avatarSrc="/bob.jpg" />
    </div>
  );
}

export default App;
```

**Resulting component tree:**

```
App
└── UserCard (×2)
    ├── Avatar
    └── UserInfo
```

> **Define components at the module level** — never define a component function *inside* another component function. Doing so recreates it on every render, destroying and remounting its subtree.

---

## 10. File & Folder Organization

There is no single "correct" structure, but a common, scalable pattern groups files **by feature**:

```
src/
├── assets/                  # Images, fonts, icons
├── components/              # Shared/generic components
│   ├── Button/
│   │   ├── Button.jsx
│   │   ├── Button.module.css
│   │   └── index.js         # Re-exports Button for clean imports
│   └── Modal/
│       ├── Modal.jsx
│       └── index.js
├── features/                # Feature-specific code
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   ├── useAuth.js       # Custom hook for auth logic
│   │   └── authStore.js     # Zustand store
│   └── products/
│       ├── ProductList.jsx
│       ├── ProductCard.jsx
│       └── useProducts.js
├── hooks/                   # Shared custom hooks
│   └── useFetch.js
├── pages/                   # Top-level route components
│   ├── Home.jsx
│   ├── About.jsx
│   └── ProductDetail.jsx
├── store/                   # Global state (Zustand)
│   └── index.js
├── App.jsx
└── main.jsx
```

### Co-location principle

Keep files that change together **near** each other. A component's styles, tests, and sub-components belong in the same folder.

```
components/Button/
├── Button.jsx          # Component
├── Button.test.jsx     # Tests
├── Button.module.css   # Styles
└── index.js            # Public export: export { default } from './Button';
```

```jsx
// Clean import from anywhere in the project
import Button from '@/components/Button';
```

Configure the `@` alias in `vite.config.js`:

```js
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

---

## 11. Destructuring

**Destructuring** is a JavaScript syntax for unpacking values from arrays or objects into variables. It's used constantly in React — most prominently with props and hooks.

### Object Destructuring

```js
const user = { name: 'Alice', age: 30, role: 'admin' };

// Without destructuring
const name = user.name;
const age  = user.age;

// With destructuring
const { name, age, role } = user;
console.log(name); // 'Alice'

// Rename while destructuring
const { name: userName, age: userAge } = user;
console.log(userName); // 'Alice'

// Default values
const { name, theme = 'light' } = user;
console.log(theme); // 'light' (user.theme is undefined)

// Nested destructuring
const { address: { city } } = { address: { city: 'NY' } };
console.log(city); // 'NY'
```

### Array Destructuring

```js
const colors = ['red', 'green', 'blue'];

const [first, second] = colors;
console.log(first);  // 'red'
console.log(second); // 'green'

// Skip elements
const [, , third] = colors;
console.log(third); // 'blue'

// useState returns an array — this is why we destructure it
const [count, setCount] = useState(0);
```

### Destructuring Props in React

```jsx
// Without destructuring — verbose
function UserCard(props) {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>{props.role}</p>
    </div>
  );
}

// With destructuring — clean and readable
function UserCard({ name, role }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{role}</p>
    </div>
  );
}

// With default values
function UserCard({ name, role = 'Member', isAdmin = false }) {
  return (
    <div>
      <h2>{name} {isAdmin && '(Admin)'}</h2>
      <p>{role}</p>
    </div>
  );
}
```

---

## 12. Spread & Rest Operators

Both use `...` syntax but serve opposite purposes.

### Spread — expand an iterable

```js
// Merge objects (last write wins)
const defaults = { theme: 'light', lang: 'en', fontSize: 14 };
const overrides = { lang: 'fr', fontSize: 16 };
const config = { ...defaults, ...overrides };
// { theme: 'light', lang: 'fr', fontSize: 16 }

// Clone an array and add items
const original = [1, 2, 3];
const extended = [...original, 4, 5]; // [1, 2, 3, 4, 5]

// Pass all object properties as props
const buttonProps = { type: 'submit', disabled: false, className: 'btn' };
<button {...buttonProps}>Submit</button>
// Same as: <button type="submit" disabled={false} className="btn">Submit</button>
```

### Rest — collect remaining values

```js
// Collect remaining array items
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first);  // 1
console.log(second); // 2
console.log(rest);   // [3, 4, 5]

// Collect remaining object keys
const { id, name, ...otherProps } = { id: 1, name: 'Alice', role: 'admin', age: 30 };
console.log(id);         // 1
console.log(otherProps); // { role: 'admin', age: 30 }

// Rest in function parameters
function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}
sum(1, 2, 3, 4); // 10
```

### Practical React patterns

```jsx
// Forward extra props to the underlying element (common in component libraries)
function Button({ label, variant = 'primary', ...rest }) {
  return (
    <button className={`btn btn-${variant}`} {...rest}>
      {label}
    </button>
  );
}

// Usage — onClick, disabled, etc. are forwarded via ...rest
<Button label="Save" variant="success" onClick={handleSave} disabled={isSaving} />
```

```jsx
// Immutable state updates using spread
const [user, setUser] = useState({ name: 'Alice', age: 30, role: 'admin' });

// Update one field without mutating
setUser(prev => ({ ...prev, age: 31 }));
```

---

## 13. Map, Filter, Reduce

These three array methods are the workhorses of React data transformation.

### `map` — transform every item

Returns a new array of the same length.

```js
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2); // [2, 4, 6, 8, 10]

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];
const names = users.map(u => u.name); // ['Alice', 'Bob']
```

### `filter` — keep items that pass a test

Returns a new array that may be shorter.

```js
const numbers = [1, 2, 3, 4, 5, 6];
const evens = numbers.filter(n => n % 2 === 0); // [2, 4, 6]

const users = [
  { name: 'Alice', active: true },
  { name: 'Bob',   active: false },
  { name: 'Carol', active: true },
];
const activeUsers = users.filter(u => u.active);
// [{ name: 'Alice', active: true }, { name: 'Carol', active: true }]
```

### `reduce` — accumulate items into a single value

```js
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((accumulator, current) => accumulator + current, 0); // 15

// Build an object from an array
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];
const userMap = users.reduce((acc, user) => {
  acc[user.id] = user;
  return acc;
}, {});
// { 1: { id: 1, name: 'Alice' }, 2: { id: 2, name: 'Bob' } }
```

### Chaining in React

```jsx
const products = [
  { id: 1, name: 'Apple',  price: 1.50, inStock: true  },
  { id: 2, name: 'Banana', price: 0.75, inStock: false },
  { id: 3, name: 'Cherry', price: 3.00, inStock: true  },
];

function ProductSummary({ products }) {
  // Chain: filter in-stock → map to prices → reduce to total
  const total = products
    .filter(p => p.inStock)
    .map(p => p.price)
    .reduce((sum, price) => sum + price, 0);

  return (
    <div>
      <h3>In-Stock Products</h3>
      <ul>
        {products
          .filter(p => p.inStock)
          .map(p => (
            <li key={p.id}>{p.name} — ${p.price.toFixed(2)}</li>
          ))}
      </ul>
      <p>Total: ${total.toFixed(2)}</p>
    </div>
  );
}
```

---

## 14. Props

**Props** (short for properties) are how you pass data **into** a component. They flow one way: **parent → child**.

```jsx
// Define a component that accepts props
function Greeting({ name, age }) {
  return <p>Hello, {name}! You are {age} years old.</p>;
}

// Pass props like HTML attributes
function App() {
  return (
    <div>
      <Greeting name="Alice" age={30} />
      <Greeting name="Bob"   age={25} />
    </div>
  );
}
```

### Props are read-only

A component must **never** modify its props. Props belong to the parent.

```jsx
// ❌ Never do this
function BadComponent({ count }) {
  count = count + 1; // Mutating props!
  return <p>{count}</p>;
}

// ✅ Use local state instead
function GoodComponent({ initialCount }) {
  const [count, setCount] = useState(initialCount);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### The `children` prop

`children` is a special prop containing whatever JSX is placed between a component's opening and closing tags.

```jsx
function Card({ title, children }) {
  return (
    <div className="card">
      <h2 className="card-title">{title}</h2>
      <div className="card-body">
        {children}  {/* Renders whatever is nested inside <Card> */}
      </div>
    </div>
  );
}

function App() {
  return (
    <Card title="Welcome">
      <p>This paragraph is the children prop.</p>
      <button>Click me</button>
    </Card>
  );
}
```

### Passing functions as props (callbacks)

```jsx
function DeleteButton({ onDelete }) {
  return <button onClick={onDelete}>Delete</button>;
}

function App() {
  function handleDelete() {
    console.log('Deleted!');
  }

  return <DeleteButton onDelete={handleDelete} />;
}
```

### Default prop values

```jsx
function Badge({ label, color = 'blue', size = 'medium' }) {
  return <span className={`badge badge-${color} badge-${size}`}>{label}</span>;
}

// color and size will use defaults
<Badge label="New" />

// Override defaults
<Badge label="Sale" color="red" size="large" />
```

---

## 15. Closures

A **closure** is a function that "remembers" the variables from its surrounding scope even after that scope has returned. In React, closures appear constantly — event handlers and effects close over state and props.

### Closure basics

```js
function makeCounter(start) {
  let count = start; // `count` is in the outer scope

  return function increment() {
    // `increment` closes over `count`
    count += 1;
    console.log(count);
  };
}

const counter = makeCounter(10);
counter(); // 11
counter(); // 12
```

### Closures in event handlers

```jsx
function App() {
  const [count, setCount] = useState(0);
  const message = `You clicked ${count} times`;

  // handleClick closes over `message` and `setCount`
  function handleClick() {
    setCount(c => c + 1);
    console.log(message); // always logs the current message
  }

  return <button onClick={handleClick}>{message}</button>;
}
```

### Closure over loop variables (a common gotcha)

```jsx
function ButtonList() {
  const labels = ['A', 'B', 'C'];

  return (
    <div>
      {labels.map((label) => (
        // Each arrow function closes over its own `label`
        // because `const label` is block-scoped per iteration
        <button key={label} onClick={() => console.log(label)}>
          {label}
        </button>
      ))}
    </div>
  );
}
```

### Stale closures (a React-specific pitfall)

When a closure captures a value, it captures the value **at the time the function was created**. If state updates, old closures see the old value.

```jsx
function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      // ❌ Stale closure: always reads the initial `count` (0)
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []); // Empty deps = only runs once, `count` is always 0 here

  // ✅ Fix: use the functional updater form, which receives the latest state
  useEffect(() => {
    const id = setInterval(() => {
      setCount(prev => prev + 1); // No closure over `count` needed
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <p>Count: {count}</p>;
}
```

---

## 16. Component Architecture

Good component architecture makes UIs **predictable, testable, and reusable**. The key patterns:

### Presentational vs Container components

| Presentational | Container |
|----------------|-----------|
| Renders UI | Manages state / fetches data |
| Receives everything via props | Passes data down to presentational components |
| No side effects | Has side effects (fetching, subscriptions) |
| Easy to test and reuse | Logic-heavy |

```jsx
// Presentational — only cares about rendering
function UserList({ users, onSelectUser }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id} onClick={() => onSelectUser(user)}>
          {user.name}
        </li>
      ))}
    </ul>
  );
}

// Container — fetches data, manages state
function UserListContainer() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(setUsers);
  }, []);

  return (
    <>
      <UserList users={users} onSelectUser={setSelected} />
      {selected && <p>Selected: {selected.name}</p>}
    </>
  );
}
```

### Composition over configuration

Build flexible components by composing smaller ones rather than adding many conditional props.

```jsx
// ❌ Rigid — tries to handle every case with props
<Button icon="save" showSpinner={true} badgeCount={3} label="Save" />

// ✅ Composable — caller controls what goes inside
<Button>
  <SaveIcon />
  Save
  <Badge count={3} />
</Button>
```

### Custom Hooks — extract logic, not UI

When multiple components share the same stateful logic, extract it into a **custom hook** (a function whose name starts with `use`).

```jsx
// src/hooks/useLocalStorage.js
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  const setStoredValue = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setStoredValue];
}

// Use in any component
function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}
```

---

## 17. Rendering Lists

To render a list in React, use `.map()` to transform an array into JSX elements.

### The `key` prop

Every element in a list **must** have a unique `key` prop. React uses it to efficiently update the DOM when the list changes.

```jsx
const fruits = ['Apple', 'Banana', 'Cherry'];

function FruitList() {
  return (
    <ul>
      {fruits.map((fruit) => (
        <li key={fruit}>{fruit}</li>
      ))}
    </ul>
  );
}
```

### Keys with objects

Use a stable, unique identifier — typically an `id` from your data.

```jsx
const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob',   email: 'bob@example.com'   },
  { id: 3, name: 'Carol', email: 'carol@example.com' },
];

function UserTable({ users }) {
  return (
    <table>
      <thead>
        <tr><th>Name</th><th>Email</th></tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>            {/* ✅ stable, unique id */}
            <td>{user.name}</td>
            <td>{user.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

> **Avoid index as key** when the list can be reordered, filtered, or have items inserted/deleted — it causes bugs with state and animations. Use index only for static, never-changing lists.

### Rendering nested lists

```jsx
const categories = [
  { id: 1, name: 'Fruits',     items: ['Apple', 'Banana'] },
  { id: 2, name: 'Vegetables', items: ['Carrot', 'Broccoli'] },
];

function CategoryList({ categories }) {
  return (
    <div>
      {categories.map((category) => (
        <section key={category.id}>
          <h3>{category.name}</h3>
          <ul>
            {category.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
```

---

## 18. Conditional Rendering

React lets you conditionally include or exclude parts of the UI using standard JavaScript.

### `if` statement

Best for complex conditions or early returns.

```jsx
function Alert({ type, message }) {
  if (!message) return null; // Render nothing

  if (type === 'error') {
    return <div className="alert alert-error">❌ {message}</div>;
  }

  return <div className="alert alert-info">ℹ️ {message}</div>;
}
```

### Ternary operator `condition ? a : b`

Best for inline toggling between two elements.

```jsx
function AuthButton({ isLoggedIn }) {
  return (
    <button>
      {isLoggedIn ? 'Log Out' : 'Log In'}
    </button>
  );
}

// Ternary with JSX
function Dashboard({ isLoggedIn, user }) {
  return (
    <div>
      {isLoggedIn
        ? <p>Welcome back, {user.name}!</p>
        : <p>Please log in to continue.</p>
      }
    </div>
  );
}
```

### Logical AND `&&`

Renders the right side **only if** the left side is truthy. Good for "show this or nothing".

```jsx
function Notification({ hasNewMessages, count }) {
  return (
    <div>
      <h1>Inbox</h1>
      {hasNewMessages && <span className="badge">{count} new</span>}
    </div>
  );
}
```

> ⚠️ **Gotcha**: `{0 && <Component />}` renders `0`, not nothing, because `0` is falsy but JSX still renders it. Use `{count > 0 && <Component />}` or `{!!count && <Component />}`.

### Nullish / multiple conditions

```jsx
function StatusBadge({ status }) {
  const config = {
    active:  { label: 'Active',  className: 'badge-green'  },
    pending: { label: 'Pending', className: 'badge-yellow' },
    banned:  { label: 'Banned',  className: 'badge-red'    },
  };

  const { label, className } = config[status] ?? { label: 'Unknown', className: 'badge-gray' };

  return <span className={`badge ${className}`}>{label}</span>;
}
```

---

## 19. useState

`useState` is the fundamental hook for adding **local state** to a component. When state changes, React re-renders the component.

```jsx
import { useState } from 'react';

function Counter() {
  // Declare state variable `count` initialized to 0
  // `setCount` is the updater function
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

### Functional updater form

When the new state depends on the previous state, use the **functional form** to avoid stale closures:

```jsx
// ❌ Risky when updates are batched or asynchronous
setCount(count + 1);

// ✅ Always uses the latest state
setCount(prev => prev + 1);
```

### Object state

When state is an object, spread to preserve other fields:

```jsx
function ProfileForm() {
  const [form, setForm] = useState({ name: '', email: '', bio: '' });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value })); // Update only the changed field
  }

  return (
    <form>
      <input name="name"  value={form.name}  onChange={handleChange} placeholder="Name" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
      <textarea name="bio" value={form.bio}  onChange={handleChange} placeholder="Bio" />
    </form>
  );
}
```

### Lazy initialization

If computing the initial state is expensive, pass a **function** to `useState` — it runs only once:

```jsx
// ❌ Runs on every render (wasteful)
const [data, setData] = useState(expensiveComputation());

// ✅ Runs only on first render
const [data, setData] = useState(() => expensiveComputation());
```

---

## 20. useEffect

`useEffect` lets you perform **side effects** — operations that affect something outside of React's rendering (data fetching, subscriptions, DOM manipulation, timers).

```jsx
import { useState, useEffect } from 'react';

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // 1. The effect function — runs after render
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // 2. The cleanup function — runs before the next effect and on unmount
    return () => clearInterval(id);
  }, []); // 3. The dependency array — [] means "run once after mount"

  return <p>Time: {time.toLocaleTimeString()}</p>;
}
```

### Dependency array controls when the effect runs

```jsx
useEffect(() => { /* runs after every render */ });

useEffect(() => { /* runs once after mount */ }, []);

useEffect(() => {
  /* runs after mount AND whenever `userId` changes */
}, [userId]);
```

### Data fetching with useEffect

```jsx
function UserProfile({ userId }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false; // Prevent state updates after unmount

    async function fetchUser() {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        if (!cancelled) setUser(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchUser();
    return () => { cancelled = true; }; // Cleanup
  }, [userId]); // Re-fetch whenever userId changes

  if (loading) return <p>Loading…</p>;
  if (error)   return <p>Error: {error}</p>;
  if (!user)   return null;

  return <div><h2>{user.name}</h2><p>{user.email}</p></div>;
}
```

### Common effect patterns

```jsx
// Sync to document title
useEffect(() => {
  document.title = `${unreadCount} unread messages`;
}, [unreadCount]);

// Subscribe / unsubscribe
useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

// Local storage sync
useEffect(() => {
  localStorage.setItem('theme', theme);
}, [theme]);
```

---

## 21. Context API

The **Context API** solves **prop drilling** — passing data through many layers of components that don't need it themselves.

### Creating and providing context

```jsx
// src/context/ThemeContext.jsx
import { createContext, useContext, useState } from 'react';

// 1. Create the context with a default value
const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

// 2. Create a Provider component that wraps children
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  function toggleTheme() {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Create a custom hook for consuming the context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
}
```

### Wrap your app with the provider

```jsx
// src/main.jsx
import { ThemeProvider } from './context/ThemeContext';

root.render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
```

### Consume context anywhere in the tree

```jsx
// src/components/Header.jsx
import { useTheme } from '../context/ThemeContext';

function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={`header header-${theme}`}>
      <h1>My App</h1>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
    </header>
  );
}
```

### When to use Context vs Zustand

| Context API | Zustand |
|-------------|---------|
| Low-frequency updates (theme, auth, locale) | High-frequency updates (live data, form state) |
| Built-in, no extra dependency | Requires `zustand` package |
| Re-renders all consumers on change | Fine-grained subscriptions |
| Simple setup | Slightly more setup, but more powerful |

---

## 22. Styling Approaches

React supports multiple styling strategies. Here are the most common:

### 1. Global CSS

Plain `.css` files imported in `main.jsx` or `App.jsx`. Styles apply globally.

```css
/* src/index.css */
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; }
h1 { color: #333; }
```

```jsx
import './index.css'; // in main.jsx
```

### 2. CSS Modules (component-scoped — recommended)

CSS Modules scope styles to the component by auto-generating unique class names. No style leakage between components.

```css
/* src/components/Button/Button.module.css */
.button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.primary {
  background-color: #0070f3;
  color: white;
}

.secondary {
  background-color: #eaeaea;
  color: #333;
}
```

```jsx
// src/components/Button/Button.jsx
import styles from './Button.module.css';

function Button({ label, variant = 'primary', onClick }) {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default Button;
```

The generated class names look like `Button_button__aB3xZ` — unique and collision-free.

### 3. Inline Styles

Good for dynamic values (computed at runtime). Not ideal for static styles.

```jsx
function ProgressBar({ percent }) {
  return (
    <div style={{ width: '100%', background: '#eee', borderRadius: 4 }}>
      <div
        style={{
          width: `${percent}%`,
          height: 8,
          background: percent > 75 ? 'green' : 'orange',
          transition: 'width 0.3s ease',
        }}
      />
    </div>
  );
}
```

### 4. Tailwind CSS

Install and configure Tailwind, then use utility classes directly in JSX.

```bash
bun add -D tailwindcss @tailwindcss/vite
```

```js
// vite.config.js
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

```css
/* src/index.css */
@import "tailwindcss";
```

```jsx
function Card({ title, description }) {
  return (
    <div className="rounded-lg shadow-md p-6 bg-white hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
```

### 5. CSS-in-JS (styled-components)

```bash
bun add styled-components
```

```jsx
import styled from 'styled-components';

const Button = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.primary ? '#0070f3' : '#eaeaea'};
  color: ${props => props.primary ? 'white' : '#333'};
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

function App() {
  return (
    <>
      <Button primary>Primary</Button>
      <Button>Secondary</Button>
    </>
  );
}
```

### Choosing a strategy

| Approach | Scoped | Dynamic | Bundle size | Best for |
|----------|--------|---------|-------------|----------|
| Global CSS | ❌ | ❌ | Tiny | Resets, fonts |
| CSS Modules | ✅ | Partial | Small | Most components |
| Inline styles | ✅ | ✅ | None | Runtime values |
| Tailwind | ✅ | Partial | Small | Rapid prototyping |
| styled-components | ✅ | ✅ | Medium | Design systems |

---

## 23. Routing

Install React Router:

```bash
bun add react-router-dom
```

### `BrowserRouter` — the router context

Wrap your app with `BrowserRouter` to enable routing. It uses the HTML5 History API to keep the URL in sync with the UI.

```jsx
// src/main.jsx
import { BrowserRouter } from 'react-router-dom';

root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

### `Routes` and `Route` — declare your routes

```jsx
// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Home          from './pages/Home';
import About         from './pages/About';
import ProductList   from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import NotFound      from './pages/NotFound';

function App() {
  return (
    <div>
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/products">Products</a>
      </nav>

      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/about"       element={<About />} />
        <Route path="/products"    element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="*"            element={<NotFound />} />
      </Routes>
    </div>
  );
}
```

### `useParams` — read URL parameters

```jsx
// src/pages/ProductDetail.jsx
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function ProductDetail() {
  const { id } = useParams(); // Reads `:id` from the URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(setProduct);
  }, [id]);

  if (!product) return <p>Loading…</p>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>${product.price}</p>
    </div>
  );
}

export default ProductDetail;
```

### `useNavigate` — programmatic navigation

```jsx
// src/pages/LoginPage.jsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function LoginPage() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  async function handleSubmit(e) {
    e.preventDefault();
    const success = await login(credentials);

    if (success) {
      navigate('/dashboard');           // Navigate forward
    } else {
      navigate('/login?error=1');       // Navigate with query string
    }
  }

  // Navigate back one page
  function handleCancel() {
    navigate(-1);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={credentials.email}
        onChange={e => setCredentials(p => ({ ...p, email: e.target.value }))}
      />
      <input
        type="password"
        value={credentials.password}
        onChange={e => setCredentials(p => ({ ...p, password: e.target.value }))}
      />
      <button type="submit">Login</button>
      <button type="button" onClick={handleCancel}>Cancel</button>
    </form>
  );
}
```

### `Link` — navigation without page reload

Use `<Link>` instead of `<a>` to navigate without a full page reload:

```jsx
import { Link, NavLink } from 'react-router-dom';

function Nav() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>

      {/* NavLink adds an `active` class automatically when the route matches */}
      <NavLink to="/products" className={({ isActive }) => isActive ? 'active' : ''}>
        Products
      </NavLink>
    </nav>
  );
}
```

### Nested Routes

```jsx
// src/App.jsx
import { Routes, Route, Outlet } from 'react-router-dom';

function DashboardLayout() {
  return (
    <div className="dashboard">
      <aside><nav>Sidebar</nav></aside>
      <main>
        <Outlet /> {/* Child routes render here */}
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index          element={<DashboardHome />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
```

---

## 24. useCallback & useMemo

Both hooks are **performance optimizations** — they memoize (cache) values to avoid redundant work. Use them when you have a measurable performance problem, not preemptively.

### `useMemo` — memoize a computed value

Recalculates only when dependencies change.

```jsx
import { useMemo, useState } from 'react';

const products = [/* thousands of products */];

function ProductCatalog() {
  const [query, setQuery]       = useState('');
  const [minPrice, setMinPrice] = useState(0);

  // ❌ Without useMemo: filters on every render
  // const filtered = products.filter(...);

  // ✅ With useMemo: only recalculates when query or minPrice changes
  const filtered = useMemo(() => {
    return products
      .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
      .filter(p => p.price >= minPrice);
  }, [query, minPrice]);

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search…" />
      <input type="number" value={minPrice} onChange={e => setMinPrice(Number(e.target.value))} />
      <p>{filtered.length} results</p>
      <ul>{filtered.map(p => <li key={p.id}>{p.name}</li>)}</ul>
    </div>
  );
}
```

### `useCallback` — memoize a function reference

Returns a stable function reference. Crucial when passing callbacks to memoized child components (`React.memo`).

```jsx
import { useCallback, useState, memo } from 'react';

// memo: only re-renders if props change
const TaskItem = memo(function TaskItem({ task, onToggle, onDelete }) {
  console.log('TaskItem render:', task.id);
  return (
    <li>
      <input type="checkbox" checked={task.done} onChange={() => onToggle(task.id)} />
      {task.title}
      <button onClick={() => onDelete(task.id)}>×</button>
    </li>
  );
});

function TaskList() {
  const [tasks, setTasks]   = useState([
    { id: 1, title: 'Learn React', done: false },
    { id: 2, title: 'Build a project', done: false },
  ]);
  const [filter, setFilter] = useState('all');

  // ✅ Stable reference — TaskItem won't re-render due to a new function instance
  const handleToggle = useCallback((id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }, []); // No deps — setTasks is always stable

  const handleDelete = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const visibleTasks = useMemo(() => {
    if (filter === 'done')   return tasks.filter(t => t.done);
    if (filter === 'active') return tasks.filter(t => !t.done);
    return tasks;
  }, [tasks, filter]);

  return (
    <div>
      <select value={filter} onChange={e => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="done">Done</option>
      </select>
      <ul>
        {visibleTasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
}
```

### Rules of thumb

- `useMemo` for **expensive calculations** (sorting/filtering large datasets, complex derived data)
- `useCallback` for **functions passed to memoized children** (`React.memo` components)
- Both have a cost (extra memory, complexity) — only use when profiling shows a real problem

---

## 25. Zustand

**Zustand** is a minimal, fast global state manager. It's the preferred alternative to Redux for most React applications.

```bash
bun add zustand
```

### Creating a store

```js
// src/store/useCartStore.js
import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  // State
  items: [],
  isOpen: false,

  // Derived state (computed)
  get totalItems() {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
  get totalPrice() {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  // Actions
  addItem(product) {
    set(state => {
      const existing = state.items.find(i => i.id === product.id);
      if (existing) {
        // Increment quantity if already in cart
        return {
          items: state.items.map(i =>
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...product, quantity: 1 }] };
    });
  },

  removeItem(productId) {
    set(state => ({
      items: state.items.filter(i => i.id !== productId),
    }));
  },

  updateQuantity(productId, quantity) {
    if (quantity < 1) {
      get().removeItem(productId);
      return;
    }
    set(state => ({
      items: state.items.map(i =>
        i.id === productId ? { ...i, quantity } : i
      ),
    }));
  },

  clearCart() {
    set({ items: [] });
  },

  toggleCart() {
    set(state => ({ isOpen: !state.isOpen }));
  },
}));

export default useCartStore;
```

### Using the store in components

```jsx
// src/components/AddToCartButton.jsx
import useCartStore from '../store/useCartStore';

function AddToCartButton({ product }) {
  // Select only what you need — component only re-renders when addItem changes
  const addItem = useCartStore(state => state.addItem);

  return (
    <button onClick={() => addItem(product)}>
      Add to Cart
    </button>
  );
}
```

```jsx
// src/components/CartDrawer.jsx
import useCartStore from '../store/useCartStore';

function CartDrawer() {
  // Select multiple slices
  const items        = useCartStore(state => state.items);
  const totalPrice   = useCartStore(state => state.totalPrice);
  const removeItem   = useCartStore(state => state.removeItem);
  const updateQty    = useCartStore(state => state.updateQuantity);
  const clearCart    = useCartStore(state => state.clearCart);
  const isOpen       = useCartStore(state => state.isOpen);
  const toggleCart   = useCartStore(state => state.toggleCart);

  if (!isOpen) return null;

  return (
    <aside className="cart-drawer">
      <h2>Your Cart</h2>
      {items.length === 0
        ? <p>Your cart is empty.</p>
        : (
          <ul>
            {items.map(item => (
              <li key={item.id}>
                <span>{item.name}</span>
                <input
                  type="number"
                  value={item.quantity}
                  min={1}
                  onChange={e => updateQty(item.id, Number(e.target.value))}
                />
                <span>${(item.price * item.quantity).toFixed(2)}</span>
                <button onClick={() => removeItem(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
        )
      }
      <p><strong>Total: ${totalPrice.toFixed(2)}</strong></p>
      <button onClick={clearCart}>Clear Cart</button>
      <button onClick={toggleCart}>Close</button>
    </aside>
  );
}
```

```jsx
// src/components/CartIcon.jsx — shows badge count
import useCartStore from '../store/useCartStore';

function CartIcon() {
  // Only subscribes to totalItems — won't re-render when other state changes
  const totalItems = useCartStore(state => state.totalItems);
  const toggleCart = useCartStore(state => state.toggleCart);

  return (
    <button onClick={toggleCart} className="cart-icon">
      🛒 {totalItems > 0 && <span className="badge">{totalItems}</span>}
    </button>
  );
}
```

### Persisting state with middleware

Zustand can persist state to `localStorage` automatically:

```js
// src/store/useCartStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem(product) { /* ... */ },
      clearCart() { set({ items: [] }); },
    }),
    {
      name: 'cart-storage', // localStorage key
    }
  )
);

export default useCartStore;
```

### Zustand vs Context API — at a glance

```
Context API:                    Zustand:
─────────────────────────────   ────────────────────────────
Built-in, no extra dep          Requires `bun add zustand`
Provider wrap required          No provider needed
All consumers re-render         Only subscribed components re-render
Good for: theme, auth, locale   Good for: cart, filters, UI state
```

---

## Summary

You've covered the full foundation of a modern React application:

| Concept | Key takeaway |
|---------|-------------|
| Bootstrap | `main.jsx` mounts `<App>` into `index.html#root` via `createRoot` |
| Components | Functions that return JSX — capital name, single root element |
| JSX | HTML-like syntax with `{}` for JS expressions |
| Exports | Default (one per file) vs named (many per file) |
| ES Modules | `import`/`export` are the standard — use barrel files for clean imports |
| Destructuring | Unpack arrays/objects — essential for props and hooks |
| Spread/Rest | `...` expands or collects — key for immutable updates |
| map/filter/reduce | Core data transformation — foundation of list rendering |
| Props | Read-only data flow from parent to child |
| Closures | Functions remember surrounding scope — be wary of stale values |
| Architecture | Presentational/container split, custom hooks for shared logic |
| Lists | Always provide a stable `key` prop |
| Conditional rendering | `if`, ternary, `&&` — render nothing with `null` |
| useState | Local reactive state — use functional updater for derived updates |
| useEffect | Side effects — always clean up, mind the dependency array |
| Context API | Share data without prop drilling — best for low-frequency updates |
| Styling | CSS Modules for scoped styles, Tailwind for utility-first |
| Routing | `BrowserRouter` + `Routes` + `Route`, `useParams`, `useNavigate` |
| useCallback/useMemo | Memoize functions/values — only when you have a real perf issue |
| Zustand | Minimal global state — select slices, persist with middleware |
