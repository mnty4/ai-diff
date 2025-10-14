## AI Diff

Provide a prompt and generate a model output, then tweak the response text until your hearts content.

### Features
- Create prompt
- Generate/tweak user flow
- Support for different view ports.
- persist draft/versions to local storage & DB
- prompts list screen -> select historical prompts
- TODO: render or prune text formatting artifacts e.g. enclosing ** to render bold is often returned in model outputs.
- TODO: user-defined variables for text reuse across prompts/tweaks.
- TODO: only apply tweak to the selected portion of text.
- TODO: view a diff between tweaks.
- TODO: stream response instead of all at once.

### TODOs

- nav bar doesn't push main content if mobile (no margin in main content)
- create a skeleton for loading the prompts/list page.
- create a skeleton for loading the prompts/id page
- look into preloading /prompts/list
- use pagination for /prompts/list
- logging/metrics