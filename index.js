/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {IGLWiretapOptions} options?
 * @returns {WebGLRenderingContext}
 */
function glWiretap(gl, options = {}) {
  const {
    contextName = 'gl',
    throwGetError,
    useTrackableNumbers,
    readPixelsFile,
    recording = [],
  } = options;
  const proxy = new Proxy(gl, { get: listen });
  const contextVariables = [];
  const entityNames = {};
  let imageCount = 0;
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
              recording.push(`if (${contextName}.getError() !== ${contextName}.NONE) throw new Error('error');`);
            } else {
              recording.push(`${contextName}.getError();`); // flush out errors
            }
            return gl.getError();
          case 'getExtension':
            const variableName = `${contextName}Variables${contextVariables.length}`;
            recording.push(`const ${variableName} = ${contextName}.getExtension('${arguments[0]}');`);
            const extension = glExtensionWiretap(gl.getExtension(arguments[0]), {
              getEntity,
              useTrackableNumbers,
              recording,
              contextName: variableName,
              contextVariables,
            });
            contextVariables.push(extension);
            return extension;
          case 'readPixels':
            const i = contextVariables.indexOf(arguments[6]);
            let targetVariableName;
            if (i === -1) {
              targetVariableName = `${contextName}Variable${contextVariables.length}`;
              recording.push(`const ${targetVariableName} = new ${arguments[6].constructor.name}(${arguments[6].length});`);
              contextVariables.push(arguments[6]);
            } else {
              targetVariableName = `${contextName}Variable${i}`;
            }
            recording.push(`${contextName}.readPixels(${arguments[0]}, ${arguments[1]}, ${arguments[2]}, ${arguments[3]}, ${getEntity(arguments[4])}, ${getEntity(arguments[5])}, ${targetVariableName});`);
            if (readPixelsFile) {
              writePPM(arguments[2], arguments[3]);
            }
            return gl.readPixels.apply(gl, arguments);
          case 'drawBuffers':
            recording.push(`${contextName}.drawBuffers([${argumentsToString(arguments[0], { contextName, contextVariables, getEntity, addVariable } )}]);`);
            return gl.drawBuffers(arguments[0]);
        }
        let result = gl[property].apply(gl, arguments);
        if (typeof result !== 'undefined' && contextVariables.indexOf(result) === -1) {
          if (typeof result === 'number' && useTrackableNumbers) {
            contextVariables.push(result = trackableNumber(result));
          }
          recording.push(`const ${contextName}Variable${contextVariables.length} = ${methodCallToString(property, arguments)};`);
          contextVariables.push(result);
        } else {
          recording.push(`${methodCallToString(property, arguments)};`);
        }
        return result;
      }
    }
    entityNames[gl[property]] = property;
    return gl[property];
  }
  function toString() {
    return recording.join('\n');
  }
  function getEntity(value) {
    const name = entityNames[value];
    if (name) {
      return contextName + '.' + name;
    }
    return value;
  }
  function addVariable(value, source) {
    const variableName = `${contextName}Variable${contextVariables.length}`;
    recording.push(`const ${variableName} = ${source};`);
    contextVariables.push(value);
    return variableName;
  }
  function writePPM(width, height) {
    const sourceVariable = `${contextName}Variable${contextVariables.length}`;
    const imageVariable = `imageDatum${imageCount}`;
    recording.push(`let ${imageVariable} = ["P3\\n# ${readPixelsFile}.ppm\\n", ${width}, ' ', ${height}, "\\n255\\n"].join("");`);
    recording.push(`for (let i = 0; i < ${imageVariable}.length; i += 4) {`);
    recording.push(`  ${imageVariable} += ${sourceVariable}[i] + ' ' + ${sourceVariable}[i + 1] + ' ' + ${sourceVariable}[i + 2] + ' ';`);
    recording.push('}');
    recording.push('if (typeof require !== "undefined") {');
    recording.push(`  require('fs').writeFileSync('./${readPixelsFile}.ppm', ${imageVariable});`);
    recording.push('}');
    imageCount++;
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
  function methodCallToString(method, args) {
    return `${contextName}.${method}(${argumentsToString(args, { contextName, contextVariables, getEntity, addVariable })})`;
  }
}

/**
 *
 * @param extension
 * @param {IGLExtensionWiretapOptions} options
 * @returns {*}
 */
function glExtensionWiretap(extension, options) {
  const proxy = new Proxy(extension, { get: listen });
  const extensionEntityNames = {};
  const {
    contextName,
    contextVariables,
    getEntity,
    useTrackableNumbers,
    recording
  } = options;
  return proxy;
  function listen(obj, property) {
    if (typeof obj[property] === 'function') {
      return function() {
        switch (property) {
          case 'drawBuffersWEBGL':
            recording.push(`${contextName}.drawBuffersWEBGL([${argumentsToString(arguments[0], { contextName, contextVariables, getEntity: getExtensionEntity, addVariable })}]);`);
            return extension.drawBuffersWEBGL(arguments[0]);
        }
        let result = extension[property].apply(extension, arguments);
        if (typeof result !== 'undefined' && contextVariables.indexOf(result) === -1) {
          if (useTrackableNumbers && typeof result === 'number') {
            contextVariables.push(result = trackableNumber(result));
          }
          recording.push(`const ${contextName}Variable${contextVariables.length} = ${methodCallToString(property, arguments)};`);
          contextVariables.push(result);
        } else {
          recording.push(`${methodCallToString(property, arguments)};`);
        }
        return result;
      };
    }
    extensionEntityNames[extension[property]] = property;
    return extension[property];
  }

  function getExtensionEntity(value) {
    return extensionEntityNames[value] || getEntity(value);
  }

  function methodCallToString(method, args) {
    return `${contextName}.${method}(${argumentsToString(args, { contextName, contextVariables, getEntity: getExtensionEntity, addVariable })})`;
  }

  function addVariable(value, source) {
    const variableName = `${contextName}Variable${contextVariables.length}`;
    recording.push(`const ${variableName} = ${source};`);
    contextVariables.push(value);
    return variableName;
  }
}

function argumentsToString(args, options) {
  return (Array.from(args).map((arg) => {
    return argumentToString(arg, options);
  }).join(', '))
}

function argumentToString(arg, options) {
  const { contextName, contextVariables, getEntity, addVariable } = options;
  if (typeof arg === 'undefined') {
    return 'undefined';
  }
  if (arg === null) {
    return 'null';
  }
  const i = contextVariables.indexOf(arg);
  if (i > -1) {
    return `${contextName}Variable${i}`;
  }
  switch (arg.constructor.name) {
    case 'String':
      const hasLines = /\n/.test(arg);
      const hasSingleQuotes = /'/.test(arg);
      const hasDoubleQuotes = /"/.test(arg);
      if (hasLines) {
        return '`' + arg + '`';
      } else if (hasSingleQuotes && !hasDoubleQuotes) {
        return '"' + arg + '"';
      } else if (!hasSingleQuotes && hasDoubleQuotes) {
        return "'" + arg + "'";
      } else {
        return '\'' + arg + '\'';
      }
    case 'Number':
      const name = getEntity(arg);
      return name || arg;
    case 'Boolean':
      return arg ? 'true' : 'false';
    case 'Array':
      return JSON.stringify(Array.from(arg));
    case 'Float32Array':
    case 'Uint8Array':
    case 'Uint16Array':
    case 'Int32Array':
      return addVariable(arg, `new ${arg.constructor.name}(${JSON.stringify(Array.from(arg))})`);
    default:
      debugger;
      throw new Error('unrecognized argument');
  }
}

function trackableNumber(number) {
  // wrapped in object, so track-able
  return new Number(number);
}

if (typeof module !== 'undefined') {
  module.exports = { glWiretap, glExtensionWiretap };
}

if (typeof window !== 'undefined') {
  glWiretap.glExtensionWiretap = glExtensionWiretap;
  window.glWiretap = glWiretap;
}
