# Moubah

Desktop application built with Electron to play YouTube videos without background music

This App use [music-remover](https://github.com/karim-bouchez/music-remover).


## 💻 Tech Stack:
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Electron.js](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)


### Supported OS

| Windows | Mac (Intel) | Mac (Apple silicon) | Linux |
|:-------:|:-----------:|:-------------------:|:-----:|
|    ✅   |      📆     |          ✅         |   ❌  |

> ✅ Supported | 📆 Not tested yet | ❌ Not support plannned yet


### Download the source code

Use the `--recursive` option because of the git submodule:

```bash
git clone git@github.com:karim-bouchez/moubah.git --recursive
```

### Install dependencies

> **_For Windows users:_** use [WSL](https://learn.microsoft.com/en-us/windows/wsl/install)

```bash
npm install
```

### Run

```bash
npm run prod
```

### Create an executable file

```bash
npm run make
```


##  Troubleshooting

`no such file or directory ... protobuf/main.proto` on `npm run dev/prod` -> run: `git submodule update --init`

## 🎯 To-do list

- [ ] 🧼 Use ffmpeg-static for binaries
- [ ] 🆕 Add a "delete" button
- [ ] 🆕 Run "music-remover" automatically from "moubah" (has to be compatible on Windows/Mac/Mac M1)
- [ ] 🆕 Don't allow to download the same video twice
- [ ] 🆕 Add more infos about the video on the search view
- [ ] 🆕 Add a refresh button to the library view 
- [ ] 🆕 Improve UI/UX
- [ ] 🆕 Support multi-languages (at least french and english)
- [ ] 🧼 Use Hexagonal architecture
- [ ] 🧼 Use TS instead of JS
- [ ] 🧼 Use React framework
- [ ] 🆕 Add e2e tests
- [ ] 🆕 Setup CI/CD
- [ ] 🪲 Latency on UI on FFmpeg calls (splitting audio + merge)
- [ ] 🪲 Audio result isn't smooth, find why
- [ ] 🆕 Add an uninstaller
- [ ] 🆕 Notification system on new release
- [ ] 🆕 Preview videos (without sound) on hover
- [ ] 🆕 Be able to see "directly" the video (and don't have to wait until the whole video is processed)
- [ ] 🆕 Be able to open Moubah from YouTube (see [here](https://docs.freetubeapp.io/usage/browser-extension/))
- [ ] 🆕 Add an ML filter on thumbnail that blur women

> 🪲 Fix bug | 🆕 Add new feature | 🧼 Refactoring code 
