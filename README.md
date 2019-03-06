# gl-wiretap
A gl debugger that listens and replays gl (WebGL, WebGL2, and HeadlessGL) gpu commands

## Example
```js
const gl = glWiretap(realGL);

// do a bunch of webgl commands..

// then later, get all commands as a string of runnable javascript
const commands = gl.toString();

// possibly write commands to file, for unit testing or reproducing bug
require('fs').writeFileSync('./file.js',
    // create a `gl` variable for the script to use
    "const canvas = document.createElement('canvas');"
    + "const gl = canvas.getContext('webgl');"
    + commands
);
```

## WebGL Usage
```js
const canvas = document.createElement('canvas');
const realGL = canvas.getContext('webgl');
const gl = glWiretap(realGL);
```

## WebGL2 Usage
```js
const canvas = document.createElement('canvas');
const realGL = canvas.getContext('webgl2');
const gl = glWiretap(realGL);
```

## HeadlessGL Usage
```js
const { glWiretap } = require('gl-wiretap');
const realGL = require('gl')(1, 1);
const gl = glWiretap(realGL);
```

See [the HeadlessGL project](https://github.com/stackgl/headless-gl) for more information on using it.

## API
```js
const gl = glWiretap(realGL, options);

// do a bunch of webgl commands..

// then later, see all commands ran
const commands = gl.toString();
```

## glWiretap.toString()
This is where the gl context outputs all values as runnable javascript. 
The value for context here is `gl` by default, for simplicity.
But can be changed to the value of with `options.contextName`.
Any variables created here (example: `gl.createProgram()`, or `gl.createShader(gl.VERTEX_SHADER)`) are simply constants that increment on an index to prevent collision.

## glWiretap options
* contextName: String - A string that refers to the gl context for `glWiretap().toString()`
* recording: String[] - A array of strings that 
* readPixelsFile: String - When set, writes a file by this name to the current directory when on node HeadlessGL using readPixels
* throwGetError: Boolean - Causes `gl.getError()` to throw if there is an error
* throwGetShaderParameter: Boolean - Causes `gl.getShaderParameter()` to throw if there is an error
* throwGetProgramParameter: Boolean - Causes `gl.getProgramParameter()` to throw if there is an error

## Typescript support
By default, typescript is supported
