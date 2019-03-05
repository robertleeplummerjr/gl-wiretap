# gl-wiretap
listen and replay gl (WebGL, WebGL2, and HeadlessGL) gpu commands

## Example
```js
const { glWiretap } = require('gl-wiretap');
const realGL = canvas.getContext('webgl');
const gl = glWiretap(realGL);

// do a bunch of webgl commands..

// then later, see all commands ran
const commands = gl.toString();

// possibly write commands to file, for unit testing or reproducing bug
require('fs').writeFileSync('./file.js',
    "const canvas = document.createElement('canvas');"
    + "const gl = canvas.getContext('webgl');"
    + commands
);
```

## API
```js
const gl = glWiretap(realGL, options);

// do a bunch of webgl commands..

// then later, see all commands ran
const commands = gl.toString();
```

## glWiretap.toString()
This is where the gl context outputs all values.  The value for context here is `gl`, for simplicity.
Any variables created here (example: `gl.createProgram()`, or `gl.createShader(gl.VERTEX_SHADER)`) are simply constants
that increment on an index to prevent collision.

## glWiretap options
* readPixelsFile: String - Writes a file by this name when on node HeadlessGL using readPixels
* throwGetError: Boolean - Causes `gl.getError()` to throw if there is an error
* throwGetShaderParameter: Boolean - Causes `gl.getShaderParameter()` to throw if there is an error
* throwGetProgramParameter: Boolean - Causes `gl.getProgramParameter()` to throw if there is an error
