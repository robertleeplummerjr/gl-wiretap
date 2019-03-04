function glWiretap(gl, options) {
  options = options || {};
  const recording = [];
  const proxy = new Proxy(gl, { get: listen });
  const readPixelsFile = options.readPixelsFile;
  proxy.toString = () => {
    return recording.join('\n');
  };
  return proxy;
  function listen(obj, property) {
    if (typeof gl[property] === 'function') {
      return function() { // need arguments from this, fyi
        switch (property) {
          case 'getError':
            recording.push('if (gl.getError() !== gl.NONE) throw new Error("error");');
            break;
          case 'createProgram':
            recording.push('var program = gl.createProgram();');
            break;
          case 'createShader':
            if (arguments[0] === gl.VERTEX_SHADER) {
              recording.push('var vertexShader = gl.createShader(gl.VERTEX_SHADER);');
            } else if (arguments[0] === gl.FRAGMENT_SHADER) {
              recording.push('var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);');
            } else {
              throw new Error('unrecognized shader type');
            }
            break;
          case 'shaderSource':
            if (arguments[0]._type === gl.VERTEX_SHADER) {
              recording.push('gl.shaderSource(vertexShader, `' + arguments[1] + '`);');
            } else if (arguments[0]._type === gl.FRAGMENT_SHADER) {
              recording.push('gl.shaderSource(fragmentShader, `' + arguments[1] + '`);');
            } else {
              throw new Error('unrecognized shader type');
            }
            break;
          case 'compileShader':
            if (arguments[0]._type === gl.VERTEX_SHADER) {
              recording.push('gl.compileShader(vertexShader);');
            } else if (arguments[0]._type === gl.FRAGMENT_SHADER) {
              recording.push('gl.compileShader(fragmentShader);');
            } else {
              throw new Error('unrecognized shader type');
            }
            break;
          case 'getShaderParameter':
            if (arguments[0]._type === gl.VERTEX_SHADER) {
              recording.push('if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) throw new Error("shader did not compile");');
            } else if (arguments[0]._type === gl.FRAGMENT_SHADER) {
              recording.push('if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) throw new Error("shader did not compile");');
            } else {
              throw new Error('unrecognized shader type');
            }
            break;
          case 'attachShader':
            if (arguments[1]._type === gl.VERTEX_SHADER) {
              recording.push('gl.attachShader(program, vertexShader);');
            } else if (arguments[1]._type === gl.FRAGMENT_SHADER) {
              recording.push('gl.attachShader(program, fragmentShader);');
            } else {
              throw new Error('unrecognized shader type');
            }
            break;
          case 'bindAttribLocation':
            recording.push('gl.bindAttribLocation(program, ' + arguments[1] + ', `' + arguments[2] + '`);');
            break;
          case 'linkProgram':
            recording.push('gl.linkProgram(program);');
            break;
          case 'getProgramParameter':
            recording.push('if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));');
            break;
          case 'useProgram':
            recording.push('gl.useProgram(program);');
            break;
          case 'createBuffer':
            recording.push('var buffer = gl.createBuffer();');
            break;
          case 'bindBuffer':
            if (arguments[0] === gl.ARRAY_BUFFER) {
              recording.push('gl.bindBuffer(gl.ARRAY_BUFFER, buffer);');
            } else if (arguments[0] === gl.ELEMENT_ARRAY_BUFFER) {
              recording.push('gl.bindBuffer(gl.ARRAY_BUFFER, buffer);');
            } else {
              throw new Error('unrecognized buffer type');
            }
            break;
          case 'bufferData':
            if (arguments[0] === gl.ARRAY_BUFFER) {
              recording.push('var bufferOutput = new Float32Array([' + Array.from(arguments[1]).join(',') + ']);');
              recording.push('gl.bufferData(gl.ARRAY_BUFFER, bufferOutput, ' + arguments[2] + ');');
            } else if (arguments[0] === gl.ELEMENT_ARRAY_BUFFER) {
              recording.push('var bufferOutput = new Uint16Array([' + Array.from(arguments[1]).join(',') + ']);');
              recording.push('gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, bufferOutput, ' + arguments[2] + ');');
            } else {
              throw new Error('unrecognized buffer type');
            }
            break;
          case 'readPixels':
            recording.push('var pixels = new Uint8Array(' + (arguments[2] * arguments[3] * 4) + ');');
            recording.push('gl.readPixels(' + arguments[0] + ', ' + arguments[1] + ', ' + arguments[2] + ', ' + arguments[3] + ', ' + arguments[4] + ', ' + arguments[5] + ', pixels);');
            recording.push('var src = ["P3\\n# gl.ppm\\n", ' + arguments[2] + ', " ", ' + arguments[3] + ', "\\n255\\n"].join("");');
            recording.push('for (var i = 0; i < pixels.length; i += 4) {');
            recording.push('  src += pixels[i] + " " + pixels[i + 1] + " " + pixels[i + 2] + " ";');
            recording.push('}');
            if (readPixelsFile) {
              recording.push('if (typeof require !== "undefined") {');
              recording.push('  require("fs").writeFileSync("./' + readPixelsFile + '.ppm", src);');
              recording.push('}');
            }
            break;
          case 'deleteProgram':
            recording.push('gl.deleteProgram(program);');
            break;
          case 'getAttribLocation':
            recording.push('var location = gl.getAttribLocation(program, `' + arguments[1] + '`;');
            break;
          case 'vertexAttribPointer':
            recording.push('gl.vertexAttribPointer(location, ' + arguments[1] + ', ' + arguments[2] + ', ' + arguments[3] + ', ' + arguments[4] + ', ' + arguments[5] + ');');
            break;
          case 'enableVertexAttribArray':
            recording.push('gl.enableVertexAttribArray(location);');
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
                  return '?';
              }
            }).join(', ')) + ');');
        }
        return gl[property].apply(gl, arguments);
      }
    }
    return gl[property];
  }
}

if (typeof module !== 'undefined') {
  module.exports = { glWiretap };
}
if (typeof window !== 'undefined') {
  window.glWiretap = glWiretap;
}
