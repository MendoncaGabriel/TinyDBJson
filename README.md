# TinyDBJson

A simple and lightweight NoSQL database for Node.js based on **JSON files** and the native **`fs` module**.
Perfect for small projects, prototypes, testing, local storage, or proof of concept (POC) applications.

It provides basic **CRUD operations** (Create, Read, Update, Delete) by reading and writing JSON files directly from your file system.

---

## 🚀 Features

* ⚡ Zero dependencies (uses only Node.js `fs` and `path` modules).
* 🧠 Simple and easy-to-use API.
* 🗂️ Stores data in local JSON files.
* 🔧 Automatic file creation if it doesn't exist.
* ✅ Fully asynchronous (Promise-based).
* 🏗️ Perfect for small projects, quick demos, and local development.

---

## 📦 Installation

```bash
npm install tinydbjson
```

---

## 📄 How It Works

TinyDBJson uses Node.js's native `fs` module to manage a JSON file as a simple NoSQL database.
Every record is stored as an object inside an array within the JSON file.
Each object has an auto-incremented `id` field to uniquely identify it.

---

## 🛠️ Usage

### 1. Import the library

```javascript
const Database = require('tinydbjson');
```

### 2. Create or connect to a database file

```javascript
const db = new Database('./data.json');
```

> ⚠️ If the file doesn't exist, it will be created automatically.

---

### 3. API Methods

---

### ➕ Create

```javascript
const user = await db.create({ name: "John Doe", age: 30 });
console.log(user);
// Output: { id: 1, name: 'John Doe', age: 30 }
```

---

### 📥 Get All

```javascript
const users = await db.getAll();
console.log(users);
```

---

### 🔍 Get By ID

```javascript
const user = await db.getById(1);
console.log(user);
// Output: { id: 1, name: 'John Doe', age: 30 }
```

---

### ✏️ Update

```javascript
const updatedUser = await db.update(1, { age: 31 });
console.log(updatedUser);
// Output: { id: 1, name: 'John Doe', age: 31 }
```

---

### ❌ Remove

```javascript
const removedUser = await db.remove(1);
console.log(removedUser);
// Output: { id: 1, name: 'John Doe', age: 31 }
```

---

## 🔥 Error Handling

* If the JSON file has invalid content, an error will be thrown.
* If you try to update, fetch, or remove a non-existent ID, an error will be thrown.
* Only accepts objects with valid keys and values for creation and updates.

---

## 📁 Example File Structure

After adding a few items, your JSON file (`data.json`) will look like this:

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "age": 30
  },
  {
    "id": 2,
    "name": "Jane Doe",
    "age": 28
  }
]
```

---

## ⚙️ Requirements

* Node.js >= 14

---

## 🚫 Limitations

* Not designed for high-concurrency production systems.
* No query system (searches are based on IDs only).
* All data is stored in memory while processing and written back entirely to the file.

---

## ⭐ When to Use

✅ Ideal for:

* Small CLI tools
* Prototypes
* Local storage
* Proof of concept (POC)
* Learning or educational purposes

❌ Not recommended for:

* Large-scale production systems
* Applications requiring complex queries or relationships

---

## 📜 License

ISC License

---

## 💻 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 📫 Contact

* GitHub: [MendoncaGabriel](https://github.com/MendoncaGabriel)
