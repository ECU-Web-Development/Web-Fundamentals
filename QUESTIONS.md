# Multiple Choice Questions - Web Fundamentals

## CSS.md Questions

### Question 1: Box Model

What does the `box-sizing: border-box;` CSS property accomplish?

A) It adds a border to all elements
B) It makes width/height include padding and border in the calculation
C) It removes margins from all elements
D) It centers all content on the page

**Answer: B**

---

### Question 2: Specificity

In CSS, which selector has the strongest specificity?

A) Element selector (`p`)
B) Class selector (`.card`)
C) ID selector (`#urgent`)
D) Descendant selector (`.product .price`)

**Answer: C**

---

### Question 3: Layout Methods

Which CSS property is recommended for laying out items in a single row or column?

A) `display: table;`
B) `display: flex;`
C) `position: absolute;`
D) `float: left;`

**Answer: B**

---

### Question 4: Flexbox Properties

What does `justify-content` control in a Flexbox container?

A) The vertical alignment of items
B) The alignment of items along the main axis
C) The wrapping behavior of items
D) The spacing between flex containers

**Answer: B**

---

## HTML.md Questions

### Question 5: Page Structure

What is the primary purpose of HTML?

A) To control how a page looks
B) To describe the structure and content of a web page
C) To create interactive behaviors
D) To manage server responses

**Answer: B**

---

### Question 6: Semantic HTML

Which of the following is a semantic HTML element?

A) `<div>`
B) `<span>`
C) `<article>`
D) `<generic>`

**Answer: C**

---

### Question 7: Image Element

Which attribute is required for accessibility on an `<img>` element?

A) `width`
B) `height`
C) `alt`
D) `title`

**Answer: C**

---

### Question 8: Script Loading

What does the `defer` attribute do on a `<script>` tag?

A) It prevents the script from running
B) It delays script execution until after HTML is parsed
C) It runs the script in a separate thread
D) It makes the script load asynchronously without blocking

**Answer: B**

---

## HTTP.md Questions

### Question 9: HTTP Methods

Which HTTP method is used to create a new resource on a server?

A) GET
B) PUT
C) POST
D) PATCH

**Answer: C**

---

### Question 10: Status Codes

What does an HTTP 404 status code indicate?

A) Server error
B) Request was unauthorized
C) Resource not found
D) Request was forbidden

**Answer: C**

---

### Question 11: Request Headers

Which HTTP header specifies the format of the request body when sending JSON?

A) `Accept: application/json`
B) `Content-Type: application/json`
C) `Accept-Encoding: json`
D) `Body-Type: application/json`

**Answer: B**

---

### Question 12: HTTP Basics

What is the primary transport protocol used by HTTP/1.1 and HTTP/2?

A) UDP
B) QUIC
C) TCP
D) SMTP

**Answer: C**

---

## NODE.md Questions

### Question 13: npm and packages

What is the primary purpose of `package.json`?

A) To store npm credentials
B) To list installed packages in node_modules/
C) To describe the project and its dependencies
D) To configure the Node.js runtime

**Answer: C**

---

### Question 14: Module Systems

In Node.js, which `package.json` field determines whether `.js` files use CommonJS or ES Modules?

A) `"modules"`
B) `"system"`
C) `"type"`
D) `"import"`

**Answer: C**

---

### Question 15: npm Scripts

How do you run a custom script defined in `package.json`?

A) `node run dev`
B) `npm run dev`
C) `npx dev`
D) `npm dev`

**Answer: B**

---

### Question 16: CommonJS vs ES Modules

Which is the correct CommonJS syntax for exporting a function?

A) `export function add() {}`
B) `module.exports = { add };`
C) `exports function add() {}`
D) `export default add;`

**Answer: B**

---

## JS.md Questions

### Question 17: Variable Declaration

In modern JavaScript, which variable declaration should you prefer?

A) `var`
B) `let` (when reassigning)
C) `const` (when not reassigning)
D) Both B and C

**Answer: D**

---

### Question 18: Arrow Functions

What is the correct syntax for an arrow function that adds two numbers?

A) `const add = (a, b) => { a + b; }`
B) `const add = (a, b) => a + b;`
C) `const add = (a, b) -> a + b;`
D) `const add => (a, b) { return a + b; }`

**Answer: B**

---

### Question 19: Async/Await Error Handling

When using `fetch()`, what should you check to ensure the HTTP response was successful?

A) The return value of `fetch()`
B) The `response.status` property
C) The `response.ok` property
D) Both B and C

**Answer: D**

---

### Question 20: DOM Selection

Which method would you use to select an element by its ID?

A) `document.getElementById('myId')`
B) `document.querySelector('#myId')`
C) `document.querySelectorAll('#myId')`
D) Both A and B

**Answer: D**

---
