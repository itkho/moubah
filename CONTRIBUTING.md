## Add translation

Run:

```sh
npm run i18n:extract
```

this will output the number of missing "catalogs" (ie. texts)

Those can be found by searching the `msgstr ""` in the `/renderer/locales/*/*.po`

Once the translations are added, you run:

```sh
npm run i18n:compile
```

In order to generate the TS files
