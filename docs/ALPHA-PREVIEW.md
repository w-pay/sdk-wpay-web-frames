# Alpha Preview Builds

Some customers may wish to interact with preview builds before a general release.

GitHub Actions would publish a downloadable ZIP artefact is made available named `npm-pack`.

Within the ZIP artefact, a `npm` tarball is ready to be used with the `npm install` command.

[Refer to the documentation](https://docs.npmjs.com/cli/v8/commands/npm-install) for further documentation. Below may be
used as a quick reference for further research for integrating into the developers workflow.

```shell
# when tarball is on the local file system
npm install local/file/path/to/tarball.tgz

# alternatively, if published to a webhost
npm install https://some/server/tarball.tgz
```
