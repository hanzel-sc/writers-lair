# Writer's Lair - Songwriter Journal

Writer's Lair is a full-stack web application designed for songwriters, lyricists, and music creators to capture, organize, and manage their creative work.

The platform focuses on idea management rather than full studio production, allowing users to store lyrics, upload voice memos, manage song drafts, and analyze creative patterns.

Conceptually, Songwriter Journal can be viewed as a combination of a structured workspace, a lyric editor, and an audio memo manager.

---

## Project Overview

Songwriter Journal enables creators to:

- Store and edit lyrical ideas
- Upload and manage audio drafts (MP3 / M4A)
- Organize work into projects
- Play back uploaded audio
- Maintain lyric versions
- Receive feedback via comments
- Control visibility (public / private)
- Analyze creative activity
- Govern platform content through an Admin Dashboard

---

## Phase One Features

### Authentication System

- Email and password registration
- Secure login with JWT
- Password hashing using bcrypt
- Protected routes
- Role-based access (User / Admin)

---

### Project Management

- Create, edit, and delete projects
- Project metadata (title, description, genre)
- Visibility controls
- Last-edited tracking

---

### Audio Management and Player

- Upload MP3 / M4A audio files
- Audio stored directly in PostgreSQL using BYTEA
- Waveform visualization (WaveSurfer.js)
- Playback controls:
  - Play / Pause
  - Seek
  - Volume
  - Loop
- Support for multiple audio versions

---

### Lyric Reader and Editor

- Create lyrics directly within the editor
- Upload TXT and PDF lyric files
- Rich text editing (React-Quill / Lexical)
- PDF rendering (pdf.js)
- Autosave system
- Foundation for version history

---

### Comments and Feedback

- Comment on projects
- Timestamped feedback
- User-linked comments

---

### Dashboard and Analytics

- Summary statistics (projects, audio, lyrics)
- Activity tracking
- Genre categorization
- Extensible analytics structure

---

### Admin Dashboard

Administrative users can:

- View all registered users
- Moderate projects and files
- Remove inappropriate content
- Monitor system metrics
- Maintain platform governance

---

### Theming and Dark Mode

- Dark-mode first interface
- Custom blue gradient palette
- Smooth theme transitions

---

## Technology Stack

### Frontend

- React (Vite)
- TailwindCSS
- Shadcn UI
- React Router
- Tanstack Query
- Framer Motion
- WaveSurfer.js
- React-Quill / Lexical
- pdf.js

---

### Backend

- Node.js
- Express.js
- PostgreSQL Driver (pg)
- JWT Authentication
- bcrypt
- Multer (file uploads)
- Winston (logging)
- dotenv (environment management)

---

### Database

- PostgreSQL

---