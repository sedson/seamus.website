# Personal site

[seamus.website](https://seamus.website)


## Local development

To work on the site locally, run `sh dev.sh` from the root. This watches `/source`, `/assets`, `/templates`, and `/scripts` for changes and runs `build.sh`. The output directory is `/www`, so open up another process and run a local server from there.

Html templates (here called `xyz.template.html`) and use a `{{ variableName }}` syntax for template insertion.

Static assets like css, images, and front-end js all live in the `/assets` directory. These just get plain-old copied over to the `/www` folder.

## Deploy

Deploys to Cloudflare pages on push to main.