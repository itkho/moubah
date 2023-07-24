<h1 align="center">
    <div style="font-size: 300px">
      <img style="vertical-align:middle" src="renderer/assets/icon-mac.png" alt="(logo)" width="100" height="100" >
      <span style="font-size: 300px">Moubah</span>
    </div>
</h1>
</br>

## ℹ️ Descritpion

Desktop application built with Electron to play YouTube videos without background music

<details>
<summary>🔎 Why this? Let's dive in...</summary>

</br>

> Desktop application ...

A web page would have been more convenient for the end user, but the processing of the video requires a high CPU and/or GPU consumption combined with non-javascript dependencies that cannot take place in a browser (client side).
A solution could have been to place this processing on the server side, but this would have had a considerable cost and the primary objective of this service is to be 100% free. This could happen in the future in cha Allah with the financial support of the community, but not now.

"What about a mobile app?"
Here, the problem with doing client-side processing is that the machine learning model trained to separate voice from audio is not currently compatible to run on a phone (as far as I know, this [PR](https://github.com/deezer/spleeter/issues/477) is still opened, this [project](https://github.com/FaceOnLive/Spleeter-Android-iOS) doesn't seem to work, and the processing time would have been to slow anyway).
As for the problem of server-side processing, it's the same as for the web version: not impossible, but it's not free

> ... built with Electron ...

A GUI built with a Python framework would have been technically simpler, but I turned to Electron to deepen my knowledge of the front end stack: JS / TS / React / HTML / CSS and be able to build more complex ui

> ... to play YouTube videos without background music

For the moment, only youtube videos are supported, but in the future, audios/videos can also be imported directly from the computer to have the background music removed, bi idhni Allah.
The app is centred around youtube as there is a lot of useful (e.g. tutorials) and/or entertaining (e.g. documentaries) content available on this platform with music in the background. This being haram in Islam, this app makes it... Moubah

</details>

</br>


<!-- 1: record -->
<!-- 2: ffmpeg -i demo.mov -q:v 0 demo.mp4 -->
<!-- 3: drag & drop from Github -->
https://github.com/itkho/moubah/assets/121198251/e0b6ae86-3973-477b-9452-9c48677f4894


**Download the app** : 🍏 ~~Apple~~ | 🪟 ~~Windows~~ | 🐧 ~~Linux~~

<!-- For mac: xattr -d com.apple.quarantine /Users/karim/Downloads/moubah-1.0.0.app -->

</br>

## 📚 Tech Stack

![Electron.js](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Vite](https://img.shields.io/badge/vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![gRPC](https://img.shields.io/badge/gRPC-244c5a.svg?style=for-the-badge&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/github_actions-2088FF.svg?style=for-the-badge&logo=githubactions&logoColor=white)

</br>

### 🗺 Architecture diagram

<p align="center">
  <img src="moubah-architecture.drawio.svg" alt="Moubah architecture diagram" />
</p>

</br>

### 💻 Supported OS

| Windows | Mac (Intel) |                                 Mac (Apple silicon)                                  | Linux |
| :-----: | :---------: | :----------------------------------------------------------------------------------: | :---: |
|   ✅    |     📆      | ✅ ([Python 3.8.10](https://www.python.org/downloads/release/python-3810/) required) |  ❌   |

> ✅ Supported | 📆 Not tested yet | ❌ Not support plannned yet

</br>

## 🔧 Setup

### 📥 Download the source code

Use the `--recursive` option because of the git submodule:

```bash
git clone git@github.com:karim-bouchez/moubah.git --recursive
```

</br>

### 🔗 Install dependencies

Install npm packages:

```bash
npm install
```

</br>

Install the [music remover](https://github.com/karim-bouchez/music-remover) server:

```bash
cd music-remover
```

... then follow the "🔧 Setup" section [here](https://github.com/karim-bouchez/music-remover#-setup)

</br>

### ☄️ Run

```bash
npm run dev
```

</br>

### 📦 Create an executable file

```bash
npm run dist
```

</br>

## 🛠 Troubleshooting

-   `no such file or directory ... protobuf/main.proto` on `npm run dev` -> run: `git submodule update --init`
-   Blank screen with: `electron: Failed to load URL: http://localhost:3000/ with error: ERR_CONNECTION_REFUSED` on `npm run dev` -> refresh (Cmd + R)

</br>

## 🎯 To-do list

See the [to-do list](todos.md) for more informations on the coming fix/feat

</br>

## 📜 License

This project is licensed under the AGPL-3.0 license - see the [LICENSE](LICENSE) file for details.
