# Walk-Dir

Walk through a directory, find files and directories.

## API

```typescript
export interface Stat {
  fileName: string
  filePath: string
  dirPath: string
  isDirectory: boolean
}

declare type WalkDir = (dirPath: string) => Promise<Stat[]>

export declare const walkDir: WalkDir
```

## Example

```typescript
import { walkDir } from "@plimeor/walk-dir"

const stats = walkDir(__dirname)
```


