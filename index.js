/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {{
 *  contextName: String,
 *  readPixelsFile: String,
 *  recording: String[],
 *  throwGetError: Boolean,
 *  throwGetShaderParameter: Boolean,
 *  throwGetProgramParameter: Boolean,
 * }} options?
 * @returns {WebGLRenderingContext}
 */
function glWiretap(gl, options) {
  options = options || {};
  const recording = options.recording || [];
  const readPixelsFile = options.readPixelsFile;
  const throwGetError = options.throwGetError;
  const throwGetShaderParameter = options.throwGetShaderParameter;
  const throwGetProgramParameter = options.throwGetProgramParameter;
  const contextName = options.contextName || 'gl';
  const proxy = new Proxy(gl, { get: listen });
  const variables = {
    programs: [],
    vertexShaders: [],
    fragmentShaders: [],
    pixels: [],
    bufferOutputs: [],
    buffers: [],
    imageData: [],
    attributeLocations: [],
    uniformLocations: [],
    textures: [],
    framebuffers: [],
    extensions: [],
  };
  const glEntityNames = Object.getOwnPropertyNames(gl).reduce((obj, name) => {
    obj[gl[name]] = name;
    return obj;
  }, {});
  return proxy;
  function listen(obj, property) {
    if (property === 'toString') return toString;
    if (property === 'addComment') return addComment;
    if (property === 'checkThrowError') return checkThrowError;
    if (typeof gl[property] === 'function') {
      return function() { // need arguments from this, fyi
        switch (property) {
          case 'getError':
            if (throwGetError) {
              recording.push(`if (${contextName}.getError() !== ${contextName}.NONE) throw new Error("error");`);
            } else {
              recording.push(`${contextName}.getError();`); // flush out errors
            }
            break;
          case 'createProgram':
            recording.push(`const program${variables.programs.length} = ${contextName}.createProgram();`);
            const program = gl.createProgram();
            variables.programs.push(program);
            return program;
          case 'createShader':
            if (arguments[0] === gl.VERTEX_SHADER) {
              recording.push(`const vertexShader${variables.vertexShaders.length} = ${contextName}.createShader(${contextName}.VERTEX_SHADER);`);
              const vertexShader = gl.createShader(gl.VERTEX_SHADER);
              variables.vertexShaders.push(vertexShader);
              return vertexShader;
            } else if (arguments[0] === gl.FRAGMENT_SHADER) {
              recording.push(`const fragmentShader${variables.fragmentShaders.length} = ${contextName}.createShader(${contextName}.FRAGMENT_SHADER);`);
              const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
              variables.fragmentShaders.push(fragmentShader);
              return fragmentShader
            } else {
              throw new Error('unrecognized shader type');
            }
          case 'createTexture':
            recording.push(`const texture${variables.textures.length} = ${contextName}.createTexture();`);
            const texture = gl.createTexture();
            variables.textures.push(texture);
            return texture;
          case 'createFramebuffer':
            recording.push(`const framebuffer${variables.framebuffers.length} = ${contextName}.createFramebuffer();`);
            const framebuffer = gl.createFramebuffer();
            variables.framebuffers.push(framebuffer);
            return framebuffer;
          case 'getExtension':
            recording.push(`const extension${variables.extensions.length} = ${contextName}.getExtension("${arguments[0]}");`);
            const extension = glExtensionWiretap(gl.getExtension(arguments[0]), {
              gl,
              recording,
              variableName: `extension${variables.extensions.length}`,
              variables,
            });
            variables.extensions.push(extension);
            return extension;
          case 'shaderSource':
            if (variables.vertexShaders.indexOf(arguments[0]) > -1) {
              recording.push(contextName + '.shaderSource(vertexShader' + variables.vertexShaders.indexOf(arguments[0]) + ', `' + arguments[1] + '`);');
            } else if (variables.fragmentShaders.indexOf(arguments[0]) > -1) {
              recording.push(contextName + '.shaderSource(fragmentShader' + variables.fragmentShaders.indexOf(arguments[0]) + ', `' + arguments[1] + '`);');
            } else {
              throw new Error('unrecognized shader type');
            }
            break;
          case 'compileShader':
            if (variables.vertexShaders.indexOf(arguments[0]) > -1) {
              recording.push(`${contextName}.compileShader(vertexShader${variables.vertexShaders.indexOf(arguments[0])});`);
            } else if (variables.fragmentShaders.indexOf(arguments[0]) > -1) {
              recording.push(`${contextName}.compileShader(fragmentShader${variables.fragmentShaders.indexOf(arguments[0])});`);
            } else {
              throw new Error('unrecognized shader type');
            }
            break;
          case 'getShaderParameter':
            if (throwGetShaderParameter) {
              if (variables.vertexShaders.indexOf(arguments[0]) > -1) {
                recording.push(`if (!${contextName}.getShaderParameter(vertexShader${variables.vertexShaders.indexOf(arguments[0])}, ${contextName}.COMPILE_STATUS)) throw new Error("shader did not compile");`);
              } else if (variables.fragmentShaders.indexOf(arguments[0]) > -1) {
                recording.push(`if (!${contextName}.getShaderParameter(fragmentShader${variables.fragmentShaders.indexOf(arguments[0])}, ${contextName}.COMPILE_STATUS)) throw new Error("shader did not compile");`);
              } else {
                throw new Error('unrecognized shader type');
              }
            }
            break;
          case 'attachShader':
            if (variables.vertexShaders.indexOf(arguments[1]) > -1) {
              recording.push(`${contextName}.attachShader(program${variables.programs.indexOf(arguments[0])}, vertexShader${variables.vertexShaders.indexOf(arguments[1])});`);
            } else if (variables.fragmentShaders.indexOf(arguments[1]) > -1) {
              recording.push(`${contextName}.attachShader(program${variables.programs.indexOf(arguments[0])}, fragmentShader${variables.fragmentShaders.indexOf(arguments[1])});`);
            } else if (arguments[1] === null) {
              recording.push(`${contextName}.attachShader(program${variables.programs.indexOf(arguments[0])}, null);`);
            } else {
              throw new Error('unrecognized shader type');
            }
            break;
          case 'bindAttribLocation':
            recording.push(contextName + '.bindAttribLocation(program' + variables.programs.indexOf(arguments[0]) + ', ' + arguments[1] + ', `' + arguments[2] + '`);');
            break;
          case 'linkProgram':
            recording.push(contextName + `.linkProgram(program${variables.programs.indexOf(arguments[0])});`);
            break;
          case 'getProgramParameter':
            if (throwGetProgramParameter) {
              recording.push(`if (!${contextName}.getProgramParameter(program${variables.programs.indexOf(arguments[0])}, ${contextName}.LINK_STATUS)) throw new Error(${contextName}.getProgramInfoLog(program${variables.programs.indexOf(arguments[0])}));`);
            }
            break;
          case 'useProgram':
            recording.push(`${contextName}.useProgram(program${variables.programs.indexOf(arguments[0])});`);
            break;
          case 'createBuffer':
            recording.push(`const buffer${variables.buffers.length} = ${contextName}.createBuffer();`);
            const buffer = gl.createBuffer();
            variables.buffers.push(buffer);
            return buffer;
          case 'bindBuffer':
            if (arguments[0] === gl.ARRAY_BUFFER) {
              recording.push(`${contextName}.bindBuffer(${contextName}.ARRAY_BUFFER, buffer${variables.buffers.indexOf(arguments[1])});`);
            } else if (arguments[0] === gl.ELEMENT_ARRAY_BUFFER) {
              recording.push(`${contextName}.bindBuffer(${contextName}.ARRAY_BUFFER, buffer${variables.buffers.indexOf(arguments[1])});`);
            } else {
              throw new Error('unrecognized buffer type');
            }
            break;
          case 'bufferData':
            if (arguments[0] === gl.ARRAY_BUFFER) {
              recording.push(`const bufferOutput${variables.bufferOutputs.length} = new Float32Array([${Array.from(arguments[1]).join(',')}]);`);
              recording.push(`${contextName}.bufferData(${contextName}.ARRAY_BUFFER, bufferOutput${variables.bufferOutputs.length}, ${arguments[2]});`);
              variables.bufferOutputs.push(arguments[1]);
            } else if (arguments[0] === gl.ELEMENT_ARRAY_BUFFER) {
              recording.push(`const bufferOutput${variables.bufferOutputs.length} = new Uint16Array([${Array.from(arguments[1]).join(',')}]);`);
              recording.push(`${contextName}.bufferData(${contextName}.ELEMENT_ARRAY_BUFFER, bufferOutput${variables.bufferOutputs.length}, ${arguments[2]});`);
              variables.bufferOutputs.push(arguments[1]);
            } else {
              throw new Error('unrecognized buffer type');
            }
            break;
          case 'readPixels':
            recording.push(`const pixels${variables.pixels.length} = new Uint8Array(${arguments[2] * arguments[3] * 4});`);
            recording.push(`${contextName}.readPixels(${arguments[0]}, ${arguments[1]}, ${arguments[2]}, ${arguments[3]}, ${arguments[4]}, ${arguments[5]}, pixels${variables.pixels.length});`);
            if (readPixelsFile) {
              writePPM(arguments[2], arguments[3]);
            }
            variables.pixels.push(null);
            break;
          case 'deleteProgram':
            if (arguments[0] === null) {
              recording.push(`${contextName}.deleteProgram(null);`);
            } else {
              recording.push(`${contextName}.deleteProgram(program${variables.programs.indexOf(arguments[0])});`);
            }
            break;
          case 'getAttribLocation':
            recording.push('const attributeLocation' + variables.attributeLocations.length + ' = ' + contextName + '.getAttribLocation(program' + variables.programs.indexOf(arguments[0]) + ', `' + arguments[1] + '`;');
            const attributeLocation = gl.getAttribLocation(arguments[0], arguments[1]);
            variables.attributeLocations.push(attributeLocation);
            return attributeLocation;
          case 'getUniformLocation':
            recording.push(`const uniformLocation${variables.uniformLocations.length} = ${contextName}.getUniformLocation(program${variables.programs.indexOf(arguments[0])}, '${arguments[1]}');`);
            const uniformLocation = gl.getUniformLocation(arguments[0], arguments[1]);
            variables.uniformLocations.push(uniformLocation);
            return uniformLocation;
          case 'vertexAttribPointer':
            if (variables.attributeLocations.indexOf(arguments[0]) > -1) {
              recording.push(`${contextName}.vertexAttribPointer(attributeLocation${variables.attributeLocations.indexOf(arguments[0])}, ${arguments[1]}, ${arguments[2]}, ${arguments[3]}, ${arguments[4]}, ${arguments[5]});`);
            } else {
              recording.push(`${contextName}.vertexAttribPointer(${arguments[0]}, ${arguments[1]}, ${arguments[2]}, ${arguments[3]}, ${arguments[4]}, ${arguments[5]});`);
            }
            break;
          case 'enableVertexAttribArray':
            if (variables.attributeLocations.indexOf(arguments[0]) > -1) {
              recording.push(`${contextName}.enableVertexAttribArray(attributeLocation${variables.attributeLocations.indexOf(arguments[0])});`);
            } else {
              recording.push(`${contextName}.enableVertexAttribArray(${arguments[0]});`);
            }
            break;
          case 'getShaderInfoLog':
            if (variables.vertexShaders.indexOf(arguments[0]) > -1) {
              recording.push(`${contextName}.getShaderInfoLog(vertexShader${variables.vertexShaders.indexOf(arguments[0])});`);
            } else if (variables.fragmentShaders.indexOf(arguments[0]) > -1) {
              recording.push(`${contextName}.getShaderInfoLog(fragmentShader${variables.fragmentShaders.indexOf(arguments[0])});`);
            } else {
              throw new Error('unrecognized shader type');
            }
            break;
          case 'deleteShader':
            if (variables.vertexShaders.indexOf(arguments[0]) > -1) {
              recording.push(`${contextName}.deleteShader(vertexShader${variables.vertexShaders.indexOf(arguments[0])});`);
            } else if (variables.fragmentShaders.indexOf(arguments[0]) > -1) {
              recording.push(`${contextName}.deleteShader(fragmentShader${variables.fragmentShaders.indexOf(arguments[0])});`);
            } else {
              throw new Error('unrecognized shader type');
            }
            break;
          case 'getProgramInfoLog':
            recording.push(`${contextName}.getProgramInfoLog(program${variables.programs.indexOf(arguments[0])});`);
            break;
          case 'bindTexture':
            recording.push(`${contextName}.bindTexture(${arguments[0]}, texture${variables.textures.indexOf(arguments[1])});`);
            break;
          case 'bindFramebuffer':
            if (arguments[1] === null) {
              recording.push(`${contextName}.bindFramebuffer(${getGLEntity(arguments[0])}, null);`);
            } else {
              recording.push(`${contextName}.bindFramebuffer(${getGLEntity(arguments[0])}, framebuffer${variables.framebuffers.indexOf(arguments[1])});`);
            }
            break;
          case 'framebufferTexture2D':
            recording.push(`${contextName}.framebufferTexture2D(${arguments[0]}, ${arguments[1]}, ${arguments[2]}, texture${variables.textures.indexOf(arguments[3])}, ${arguments[4]});`);
            break;
          case 'deleteFramebuffer':
            recording.push(`${contextName}.deleteFramebuffer(framebuffer${variables.framebuffers.indexOf(arguments[0])});`);
            break;
          case 'deleteTexture':
            recording.push(`${contextName}.deleteTexture(texture${variables.textures.indexOf(arguments[0])});`);
            break;
          case 'uniform1fv':
          case 'uniform1iv':
          case 'uniform2fv':
          case 'uniform2iv':
          case 'uniform3fv':
          case 'uniform3iv':
          case 'uniform4fv':
          case 'uniform4iv':
            recording.push(`${contextName}.${property}(uniformLocation${variables.uniformLocations.indexOf(arguments[0])}, ${JSON.stringify(Array.from(arguments[1]))});`);
            break;
          case 'uniform1f':
          case 'uniform1i':
            recording.push(`${contextName}.${property}(uniformLocation${variables.uniformLocations.indexOf(arguments[0])}, ${arguments[1]});`);
            break;
          case 'uniform2f':
          case 'uniform2i':
            recording.push(`${contextName}.${property}(uniformLocation${variables.uniformLocations.indexOf(arguments[0])}, ${arguments[1]}, ${arguments[2]});`);
            break;
          case 'uniform3f':
          case 'uniform3i':
            recording.push(`${contextName}.${property}(uniformLocation${variables.uniformLocations.indexOf(arguments[0])}, ${arguments[1]}, ${arguments[2]}, ${arguments[3]});`);
            break;
          case 'uniform4f':
          case 'uniform4i':
            recording.push(`${contextName}.${property}(uniformLocation${variables.uniformLocations.indexOf(arguments[0])}, ${arguments[1]}, ${arguments[2]}, ${arguments[3]}, ${arguments[4]});`);
            break;
          case 'getParameter':
            recording.push(`${contextName}.getParameter(${getGLEntity(arguments[0])});`);
            break;
          default:
            recording.push(`${contextName}.${property}(${argumentsToString(arguments)});`);
        }
        return gl[property].apply(gl, arguments);
      }
    }
    return gl[property];
  }
  function toString() {
    return recording.join('\n');
  }
  function getGLEntity(number) {
    const name = glEntityNames[number];
    if (!name) {
      for (let extensionIndex = 0; extensionIndex < variables.extensions.length; extensionIndex++) {
        const extension = variables.extensions[extensionIndex];
        const extensionEntityNames = Object.getOwnPropertyNames(variables.extensions[extensionIndex]);
        for (let extensionEntityNamesIndex = 0; extensionEntityNamesIndex < extensionEntityNames.length; extensionEntityNamesIndex++) {
          const extensionEntityName = extensionEntityNames[extensionEntityNamesIndex];
          if (extension[extensionEntityName] === number) {
            return 'extension' + extensionIndex + '.' + extensionEntityName;
          }
        }
      }
      console.warn('GL entity not found');
      return number;
    }
    return contextName + '.' + name;
  }
  function writePPM(width, height) {
    recording.push(`let imageDatum${variables.imageData.length} = ["P3\\n# ${contextName}.ppm\\n", ${width}, " ", ${height}, "\\n255\\n"].join("");`);
    recording.push(`for (let i = 0; i < pixels${variables.pixels.length}.length; i += 4) {`);
    recording.push(`  imageDatum${variables.imageData.length} += pixels${variables.pixels.length}[i] + " " + pixels${variables.pixels.length}[i + 1] + " " + pixels${variables.pixels.length}[i + 2] + " ";`);
    recording.push('}');
    recording.push('if (typeof require !== "undefined") {');
    recording.push(`  require("fs").writeFileSync("./${readPixelsFile}.ppm", imageDatum${variables.imageData.length});`);
    recording.push('}');
    variables.imageData.push(null);
  }
  function addComment(value) {
    recording.push('// ' + value);
  }
  function checkThrowError() {
    recording.push(`(() => {
const error = ${contextName}.getError();
if (error !== ${contextName}.NONE) {
  const names = Object.getOwnPropertyNames(gl);
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    if (${contextName}[name] === error) {
      throw new Error('${contextName} threw ' + name);
    }
  }
}
})();`);
  }
}

/**
 *
 * @param extension
 * @param {{recording: String, variableName: String}} options
 * @returns {*}
 */
function glExtensionWiretap(extension, options) {
  const proxy = new Proxy(extension, { get: listen });
  const gl = options.gl;
  const recording = options.recording;
  const variableName = options.variableName;
  const variables = options.variables;
  return proxy;
  function listen(obj, property) {
    if (typeof obj[property] === 'function') {
      return function() {
        switch (property) {
          case 'drawBuffersWEBGL':
            extension.drawBuffersWEBGL(arguments[0]);
            recording.push(`${variableName}.drawBuffersWEBGL([${Array.from(arguments).join(', ')}]);`);
            return;
          case 'getTranslatedShaderSource':
            if (variables.vertexShaders.indexOf(arguments[0]) > -1) {
              recording.push(`${variableName}.getTranslatedShaderSource(vertexShader${variables.vertexShaders.indexOf(arguments[0])})`);
            } else if (variables.fragmentShaders.indexOf(arguments[0]) > -1) {
              recording.push(`${variableName}.getTranslatedShaderSource(fragmentShader${variables.fragmentShaders.indexOf(arguments[0])})`);
            } else {
              throw new Error('Cannot find shader');
            }
            return extension.getTranslatedShaderSource(arguments[0]);
        }
        recording.push(`${variableName}.${property}(${argumentsToString(arguments)});`);
      };
    }
    return extension[property];
  }
}

function argumentsToString(args) {
  return (Array.from(args).map(function (arg) {
    switch (typeof arg) {
      case 'string':
        return '`' + arg + '`';
      case 'number':
        return arg;
      case 'boolean':
        return arg ? 'true' : 'false';
      default:
        if (arg === null) {
          return 'null';
        }
        throw new Error('unrecognized argument');
    }
  }).join(', '))
}

if (typeof module !== 'undefined') {
  module.exports = { glWiretap, glExtensionWiretap };
}

if (typeof window !== 'undefined') {
  glWiretap.glExtensionWiretap = glExtensionWiretap;
  window.glWiretap = glWiretap;
}
