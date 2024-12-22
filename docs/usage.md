### install tailwind

### add to tailind config
```ts
import type { Config } from "tailwindcss";
import { twPlugin  } from "react-date-range-picker";

const config = {
  // ...
  content: [
    // ...
    "./node_modules/react-date-range-picker/**/*.js", 
  ],
  plugins: [
    // ...
    twPlugin
  ],
} satisfies Config;

export default config;
```


### reinstall new pack
```sh
pnpm rm react-date-range-picker && pnpm add ../react-date-range-picker/react-date-range-picker-0.0.0.tgz && pnpm dev
```
