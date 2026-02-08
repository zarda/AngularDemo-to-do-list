# Angular To-Do List

A simple, feature-rich to-do list application built with Angular 17 and Angular Material. This project demonstrates frontend development best practices including component architecture, service-based state management, and local storage persistence.

## Features

- **Add tasks** -- Create new to-do items with a single click
- **Edit descriptions** -- Inline editing of task descriptions
- **Mark as complete** -- Toggle task completion with checkboxes
- **Delete tasks** -- Remove tasks you no longer need
- **Sort tasks** -- Cycle through sort orders: default (newest first), done first, done last
- **Search/filter** -- Filter tasks by keyword (case-insensitive)
- **Auto-save** -- Tasks are automatically saved to local storage every 5 seconds
- **Persistent storage** -- Tasks survive page reloads via local storage

## Tech Stack

- **Framework:** Angular 17
- **UI Library:** Angular Material
- **Language:** TypeScript
- **Testing:** Jasmine + Karma
- **Linting:** ESLint (via @angular-eslint)
- **Package Manager:** npm

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (included with Node.js)

## Getting Started

### Install dependencies

```bash
cd client
npm install
```

### Start the development server

```bash
cd client
ng serve
```

Navigate to [http://localhost:4200/](http://localhost:4200/). The application will automatically reload when source files change.

### Build for production

```bash
cd client
ng build
```

Build artifacts are stored in the `client/dist/` directory.

### Run unit tests

```bash
cd client
ng test
```

To run tests in headless mode with code coverage:

```bash
cd client
ng test --no-watch --browsers=ChromeHeadless --code-coverage
```

### Run linter

```bash
cd client
ng lint
```

## Project Structure

```
client/src/app/
  ├── app.module.ts                 # Root module
  ├── app.component.ts              # Root component
  ├── enum.ts                       # Enums (DataOrder, LocalStorageKey)
  ├── interface.ts                  # TypeScript interfaces (ListData, LocalStorageValue)
  ├── title/
  │   ├── title.component.ts        # Header toolbar with add, sort, and search
  │   ├── title.component.html
  │   ├── title.component.css
  │   └── title.component.spec.ts
  ├── to-do-list/
  │   ├── to-do-list.component.ts   # Task list display with edit and delete
  │   ├── to-do-list.component.html
  │   ├── to-do-list.component.css
  │   └── to-do-list.component.spec.ts
  └── service/
      ├── list-data.service.ts      # Task data management (CRUD, sort, filter)
      ├── list-data.service.spec.ts
      ├── local-storage.service.ts  # Local storage with Map serialization
      └── local-storage.service.spec.ts
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
