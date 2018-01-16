# VTEX Emails
VTEX Emails is an email framework based on [bojler](https://github.com/Slicejack/bojler) for developing transactional email templates for VTEX E-commerces.

## Features
VTEX Emails inherited [Bojler's features](https://github.com/Slicejack/bojler#features) like:

*   SASS support
*   Automatic CSS inlining
*   Embedded CSS
*   Webserver with Live Reload
*   Reset styles
*   Responsive design

And it has other important features:

*   Handlebars compiling
*   Tachyons integration
*   Partials for code reuse
*   VTEX transactional JSONs examples for preview
*   i18n for internationalization

## Folders and structure
-   `public` compiled files for preview
-   `dist` compiled files for exporting
-   `source` working folder
    - `data` JSON files containing Orders data
    - `helpers` VTEX's Helpers functions
    - `locales` i18n files
    - `sass` styles
    - `templates` e-mails templates
        - `partials` e-mails parts

### You must NOT add, change or modify:
- `helpers` you can use only Handlebars and VTEX's Helpers

### You can add, change or modify:
- `data` you can create folders with different JSON examples as well. They must have a real VTEX JSON structure
- `locales` use your own communication
- `sass` use your own style
- `templates` name your templates your own way. **Each template must have a JSON file with the same name.**
- `partials` use the partials that make sense for you

## Hands on

### Installation
1.  Download or clone VTEX Emails
2.  Install npm dependencies: run `npm install`

### Developing
1.  Run `npm run gulp dev`
2.  Go to [http://localhost:8000/](http://localhost:8000/)
3.  Choose the language folder and open the template that you want to preview

### Generating an exportable VTEX template
1.  Run `npm run gulp dist`
2.  Go to `dist` folder, copy the template content and paste it in VTEX Message Center

### Generating a light preview version for testing
1.  Run `npm run gulp preview`
2.  Go to `public` folder, copy the template content and test it using services like MailChimp

### Changing JSON data set
1.  Stop npm service
2.  Create a new folder in `source/data`
3.  Change `orderJsonToRead` variable in `gulpfile.js` to the new folder name
4.  Start npm service

## To do
- Live reload is not working very well. Sometimes you need to refresh the page manually
- Recompiling doesn't work for JSON changes. You'll need to stop npm service and start it again
- Improve Outlook compatibility
- Improve VTEX inStore scenarios

## Bugs and feature requests
If you find a bug or need new feature please open a new issue and we will discuss about it.


**Thank you! :)**
