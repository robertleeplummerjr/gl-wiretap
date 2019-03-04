/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {{ readPixelsFile: String }} options?
 * @returns {WebGLRenderingContext}
 */
function glWiretap(gl, options) {
  options = options || {};
  const recording = [];
  const proxy = new Proxy(gl, { get: listen });
  const variables = {
    programs: [],
    vertexShaders: [],
    fragmentShaders: [],
    pixels: [],
    bufferOutputs: [],
    buffers: [],
    imageData: [],
    locations: [],
  };

  const readPixelsFile = options.readPixelsFile;
  return proxy;
  function listen(obj, property) {
    if (property === 'toString') return toString;
    if (typeof gl[property] === 'function') {
      return function() { // need arguments from this, fyi
        switch (property) {
          case 'getError':
            recording.push('if (gl.getError() !== gl.NONE) throw new Error("error");');
            break;
          case 'createProgram':
            recording.push(`const program${ variables.programs.length } = gl.createProgram();`);
            const program = gl.createProgram();
            variables.programs.push(program);
            return program;
          case 'createShader':
            if (arguments[0] === gl.VERTEX_SHADER) {
              recording.push(`const vertexShader${ variables.vertexShaders.length } = gl.createShader(gl.VERTEX_SHADER);`);
              const vertexShader = gl.createShader(gl.VERTEX_SHADER);
              variables.vertexShaders.push(vertexShader);
              return vertexShader;
            } else if (arguments[0] === gl.FRAGMENT_SHADER) {
              recording.push(`const fragmentShader${ variables.fragmentShaders.length } = gl.createShader(gl.FRAGMENT_SHADER);`);
              const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
              variables.fragmentShaders.push(fragmentShader);
              return fragmentShader
            } else {
              throw new Error('unrecognized shader type');
            }
          case 'shaderSource':
            if (variables.vertexShaders.indexOf(arguments[0]) > -1) {
              recording.push('gl.shaderSource(vertexShader' + variables.vertexShaders.indexOf(arguments[0]) + ', `' + arguments[1] + '`);');
            } else if (variables.fragmentShaders.indexOf(arguments[0]) > -1) {
              recording.push('gl.shaderSource(fragmentShader' + variables.fragmentShaders.indexOf(arguments[0]) + ', `' + arguments[1] + '`);');
            } else {
              throw new Error('unrecognized shader type');
            }
            break;
          case 'compileShader':
            if (variables.vertexShaders.indexOf(arguments[0]) > -1) {
              recording.push(`gl.compileShader(vertexShader${variables.vertexShaders.indexOf(arguments[0])});`);
            } else if (variables.fragmentShaders.indexOf(arguments[0]) > -1) {
              recording.push(`gl.compileShader(fragmentShader${variables.fragmentShaders.indexOf(arguments[0])});`);
            } else {
              throw new Error('unrecognized shader type');
            }
            break;
          case 'getShaderParameter':
            if (variables.vertexShaders.indexOf(arguments[0]) > -1) {
              recording.push(`if (!gl.getShaderParameter(vertexShader${variables.vertexShaders.indexOf(arguments[0])}, gl.COMPILE_STATUS)) throw new Error("shader did not compile");`);
            } else if (variables.fragmentShaders.indexOf(arguments[0]) > -1) {
              recording.push(`if (!gl.getShaderParameter(fragmentShader${variables.fragmentShaders.indexOf(arguments[0])}, gl.COMPILE_STATUS)) throw new Error("shader did not compile");`);
            } else {
              throw new Error('unrecognized shader type');
            }
            break;
          case 'attachShader':
            if (variables.vertexShaders.indexOf(arguments[1]) > -1) {
              recording.push(`gl.attachShader(program${variables.programs.indexOf(arguments[0])}, vertexShader${variables.vertexShaders.indexOf(arguments[1])});`);
            } else if (variables.fragmentShaders.indexOf(arguments[1]) > -1) {
              recording.push(`gl.attachShader(program${variables.programs.indexOf(arguments[0])}, fragmentShader${variables.fragmentShaders.indexOf(arguments[1])});`);
            } else {
              throw new Error('unrecognized shader type');
            }
            break;
          case 'bindAttribLocation':
            recording.push('gl.bindAttribLocation(program' + variables.programs.indexOf(arguments[0]) + ', ' + arguments[1] + ', `' + arguments[2] + '`);');
            break;
          case 'linkProgram':
            recording.push(`gl.linkProgram(program${variables.programs.indexOf(arguments[0])});`);
            break;
          case 'getProgramParameter':
            recording.push(`if (!gl.getProgramParameter(program${variables.programs.indexOf(arguments[0])}, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program${variables.programs.indexOf(arguments[0])}));`);
            break;
          case 'useProgram':
            recording.push(`gl.useProgram(program${variables.programs.indexOf(arguments[0])});`);
            break;
          case 'createBuffer':
            recording.push(`const buffer${variables.buffers.length} = gl.createBuffer();`);
            const buffer = gl.createBuffer();
            variables.buffers.push(buffer);
            return buffer;
          case 'bindBuffer':
            if (arguments[0] === gl.ARRAY_BUFFER) {
              recording.push(`gl.bindBuffer(gl.ARRAY_BUFFER, buffer${variables.buffers.indexOf(arguments[1])});`);
            } else if (arguments[0] === gl.ELEMENT_ARRAY_BUFFER) {
              recording.push(`gl.bindBuffer(gl.ARRAY_BUFFER, buffer${variables.buffers.indexOf(arguments[1])});`);
            } else {
              throw new Error('unrecognized buffer type');
            }
            break;
          case 'bufferData':
            if (arguments[0] === gl.ARRAY_BUFFER) {
              recording.push(`const bufferOutput${variables.bufferOutputs.length} = new Float32Array([${ Array.from(arguments[1]).join(',') }]);`);
              recording.push(`gl.bufferData(gl.ARRAY_BUFFER, bufferOutput${variables.bufferOutputs.length}, ${ arguments[2] });`);
              variables.bufferOutputs.push(null);
            } else if (arguments[0] === gl.ELEMENT_ARRAY_BUFFER) {
              recording.push(`const bufferOutput${variables.bufferOutputs.length} = new Uint16Array([${ Array.from(arguments[1]).join(',') }]);`);
              recording.push(`gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, bufferOutput${variables.bufferOutputs.length}, ${ arguments[2] });`);
              variables.bufferOutputs.push(null);
            } else {
              throw new Error('unrecognized buffer type');
            }
            break;
          case 'readPixels':
            recording.push(`const pixels${ variables.pixels.length } = new Uint8Array(${ arguments[2] * arguments[3] * 4 });`);
            recording.push(`gl.readPixels(${ arguments[0] }, ${ arguments[1] }, ${ arguments[2] }, ${ arguments[3] }, ${ arguments[4] }, ${ arguments[5] }, pixels${ variables.pixels.length});`);
            if (readPixelsFile) {
              recording.push(`let imageDatum${variables.imageData.length} = ["P3\\n# gl.ppm\\n", ${ arguments[2] }, " ", ${ arguments[3] }, "\\n255\\n"].join("");`);
              recording.push(`for (let i = 0; i < pixels${variables.pixels.length}.length; i += 4) {`);
              recording.push(`  imageDatum${variables.imageData.length} += pixels${ variables.pixels.length }[i] + " " + pixels${ variables.pixels.length }[i + 1] + " " + pixels${ variables.pixels.length }[i + 2] + " ";`);
              recording.push('}');
              recording.push('if (typeof require !== "undefined") {');
              recording.push(`  require("fs").writeFileSync("./${ readPixelsFile }.ppm", imageDatum${variables.imageData.length});`);
              recording.push('}');
              variables.imageData.push(null);
            }
            variables.pixels.push(null);
            break;
          case 'deleteProgram':
            recording.push(`gl.deleteProgram(program${variables.programs.indexOf(arguments[0])});`);
            break;
          case 'getAttribLocation':
            recording.push('const location' + variables.locations.length + ' = gl.getAttribLocation(program' + variables.programs.indexOf(arguments[0]) + ', `' + arguments[1] + '`;');
            const location = gl.getAttribLocation(arguments[0], arguments[1]);
            variables.locations.push(location);
            return location;
          case 'vertexAttribPointer':
            if (variables.locations.indexOf(arguments[0]) > -1) {
              recording.push(`gl.vertexAttribPointer(location${variables.locations.indexOf(arguments[0])}, ${arguments[1]}, ${arguments[2]}, ${arguments[3]}, ${arguments[4]}, ${arguments[5]});`);
            } else {
              recording.push(`gl.vertexAttribPointer(${arguments[0]}, ${arguments[1]}, ${arguments[2]}, ${arguments[3]}, ${arguments[4]}, ${arguments[5]});`);
            }
            break;
          case 'enableVertexAttribArray':
            if (variables.locations.indexOf(arguments[0]) > -1) {
              recording.push(`gl.enableVertexAttribArray(location${variables.locations.indexOf(arguments[0])});`);
            } else {
              recording.push(`gl.enableVertexAttribArray(${arguments[0]});`);
            }
            break;
          default:
            recording.push('gl.' + property + '(' + (Array.from(arguments).map(function (argument) {
              switch (typeof argument) {
                case 'string':
                  return '`' + argument + '`';
                case 'number':
                  return argument;
                case 'boolean':
                  return argument ? 'true' : 'false';
                default:
                  throw new Error('unrecognized argument');
              }
            }).join(', ')) + ');');
        }
        return gl[property].apply(gl, arguments);
      }
    }
    return gl[property];
  }
  function toString() {
    return recording.join('\n');
  }
}

if (typeof module !== 'undefined') {
  module.exports = { glWiretap };
}

if (typeof window !== 'undefined') {
  window.glWiretap = glWiretap;
}
