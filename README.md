# 🎵🧹 Crate Cleaner 🧹🎵

The ultimate tool for DJs and music enthusiasts! This Electron-based application is designed with a sleek UI (resembling Serato DJs interface) and is powered by a robust tech stack including React, TypeScript, Vite, Prisma, SQLite, and Tailwind CSS. Perfect for tidying up your audio collection, Crate Cleaner is a must-have in your digital DJ toolbox.

## ✨ Features

Crate Cleaner is not just another file manager; it's tailored for DJ's specific needs. Here's what it can do for you:

- 🎶 Scan and identify duplicate audio and image files.
- 🔍 Compare files by name or content to find matches.
- 📦 Detect audio files that are not in use in Serato crates.
- 💾 Persist and manage data with an integrated SQLite database.
- 🔄 Organize crates by adding or removing files.

## 🚀 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (>= v18 or greater) and [Yarn](https://yarnpkg.com/) installed on your system.

### Install

Clone the repository and install its dependencies.

```bash
git clone https://github.com/yourusername/crate-cleaner.git
cd crate-cleaner
yarn install
```

Before kicking off the development server, let's set up the development database and run the migrations so it matches the schema:

```bash
yarn predev
```

Now, you're all set to start the dev server:

```bash
yarn dev
```

### Build

To build the application for production, use the appropriate command based on your operating system:

```bash
# For Windows
$ yarn build:win

# For macOS
$ yarn build:mac

# For Linux
$ yarn build:linux
```

### 🛠 Tech Stack

Crate Cleaner leverages a robust set of technologies to deliver a seamless experience. Check out more about each component:

- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Vite](https://vitejs.dev/)
- [Prisma](https://www.prisma.io/)
- [SQLite](https://www.sqlite.org/index.html)
- [Tailwind CSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)
- [Tanstack/react-query](https://react-query.tanstack.com/)
- [Tanstack/react-table](https://tanstack.com/table/v8)
- [Zod](https://github.com/colinhacks/zod)
- [TypeScript](https://www.typescriptlang.org/)

### 🌟 Upcoming Features

We are always looking to make Crate Cleaner even better. Here's what's on the horizon:

Support for RekordBox, Traktor, Apple Music, and Lightroom.
Enhanced file management options, such as moving duplicates rather than deleting.
Introduction of an audio player and fuzzy name match capabilities.
And much more!

### 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

### ☕ Buy Me a Coffee

Love Crate Cleaner? Want to support the caffeine-fueled late nights that went into building this tool? Buy me a coffee and fuel further development!

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-1.svg)](https://www.buymeacoffee.com/narinsun)

### 📬 Contact

Got questions, feedback, or want to say hi? I'm just a click away over at [narinsun.com](https://narinsun.com).

## 📜 License

Crate Cleaner is made available under the [Attribution-NonCommercial 4.0 International](http://creativecommons.org/licenses/by-nc/4.0/?ref=chooser-v1) license. This means that you are free to share and adapt the material as long as you follow the license terms which include:

- **Attribution** — You must give appropriate credit to [Narin Rico Sundarabhaya](https://narinsun.com), provide a link to the license, and indicate if changes were made.
- **NonCommercial** — You may not use the material for commercial purposes.

For more information, please see the full license [here](http://creativecommons.org/licenses/by-nc/4.0/?ref=chooser-v1).

![Creative Commons License](https://i.creativecommons.org/l/by-nc/4.0/88x31.png)

This license is applicable for free use of Crate Cleaner but does not allow for commercial use without proper attribution and without express permission from the creator.
