# Advanced Frontend with React.js

## The tasks of the topic "HOCs"

The application has two components, `EntitiesList` and `EntityDetails`.
Both load external data with a function passed in the `fetchMethod` prop, and both show the text `Loading...` while that data is not available yet.

Extract the shared logic into a higher-order component.

- Name it `withLoading`.
- Put it in `src/components/withLoading.js` and export it as the default export.
- `withLoading` takes a component and returns a new component.
- The returned component calls `fetchMethod(params)`. `params` is optional: `EntityDetails` passes it, `EntitiesList` does not.
- `fetchMethod` returns a promise. Until that promise resolves, render the text `Loading...`.
- When the data has loaded, render the wrapped component and pass the loaded value in a prop named `data`. Pass the other props through (`propsToDisplay`, `onEntityDetailsClick`, and so on). Do not pass `fetchMethod` or `params` to the wrapped component.
- When `params` changes, load the data again and show `Loading...` until the new request finishes.

Update `EntitiesList` and `EntityDetails` so each file imports `withLoading` from `./withLoading` and calls it. Keep the text they show after the refactor:

- `EntitiesList`: while loading, `Loading...`. After loading, one list item per entity. Each item has a button with the text `👀` and, for every entry of `propsToDisplay`, the text `{label}: {value}` (for example, `Name: John`). Clicking the button calls `onEntityDetailsClick` with that entity's `id`.
- `EntityDetails`: while loading, `Loading...`. After loading, a heading `{name} Details:` (for example, `John Details:`) and, for every entry of `propsToDisplay`, the text `{label}: {value}`.

## Scripts

```bash
npm install
npm start
npm test
```

`npm test` starts Jest in watch mode. To run the suite once, use:

```bash
npx react-scripts test --watchAll=false
```

GitHub Actions sets `CI=true`, so `npm test` there also runs the suite once. That step starts on pushes to `main` after the repository is created. On Windows PowerShell the same one-off run is:

```powershell
$env:CI="true"; npm test
```
