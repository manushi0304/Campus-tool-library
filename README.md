# Campus Tool Library — NoSQL (MongoDB) Demo

A medium-complex Node.js + Express + **MongoDB (Document DB)** project that lets students **discover the nearest branch** (geospatial), **search/list tools**, and **create reservations**.  
It demonstrates **MongoDB 2dsphere** geospatial queries, JSON Schema validation, indexes for performance, and a small aggregation pipeline for category stats.

---

## ✨ Features

- **Branches** with GeoJSON points (`location: { type: "Point", coordinates: [lng, lat] }`)
- **Tools** per branch with search, pagination, and indexes
- **Reservations** with validation and status updates
- **Geospatial “near me”** using `$near` + `2dsphere` index
- **Aggregation** report by tool category
- **Validation** (Joi in API, MongoDB JSON Schema in DB)
- **No Postman**: test via **curl**, **PowerShell**, **VS Code REST Client**, and a **minimal HTML form**

---

## 🧱 Tech Stack

- **Runtime**: Node.js (Express)
- **Database**: MongoDB (Local Community or Atlas Free Tier)
- **Validation**: Joi (requests) + MongoDB JSON Schema (collections)
- **Dev tools**: nodemon, ESLint (optional)

---

## 📁 Project Structure (key files)

