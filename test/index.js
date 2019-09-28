const { glWiretap } = require('../index');
const sinon = require('sinon');
const { assert } = sinon;
describe('end-to-end', () => {
  it('void function', () => {
    const aVoid = sinon.spy();
    const gl = {
      aVoid,
    };
    const context = glWiretap(gl);
    context.aVoid();
    assert.calledWith(gl.aVoid);
    assert.match(context.toString(), 'gl.aVoid();');
  });
  it('void function with 1 boolean argument', () => {
    const aVoid = sinon.spy();
    const gl = {
      aVoid,
    };
    const context = glWiretap(gl);
    context.aVoid(true);
    assert.calledWith(gl.aVoid, true);
    assert.match(context.toString(), 'gl.aVoid(true);');
  });
  it('undefined function with useTrackablePrimitives = true', () => {
    const anUndefined = sinon.spy(() => undefined);
    const aVoid = sinon.spy();
    const gl = {
      anUndefined,
      aVoid,
    };
    const context = glWiretap(gl, {
      useTrackablePrimitives: true,
    });
    const result = context.anUndefined();
    context.aVoid(result);
    assert.calledWith(gl.aVoid, result);
    assert.match(context.toString(), 'gl.anUndefined();'
      + '\ngl.aVoid(undefined);');
  });
  it('null function with useTrackablePrimitives = true', () => {
    const aNull = sinon.spy(() => null);
    const aVoid = sinon.spy();
    const gl = {
      aNull,
      aVoid,
    };
    const context = glWiretap(gl, {
      useTrackablePrimitives: true,
    });
    const result = context.aNull();
    context.aVoid(result);
    assert.calledWith(gl.aVoid, result);
    assert.match(context.toString(), 'gl.aNull();'
      + '\ngl.aVoid(null);');
  });
  it('bool function with useTrackablePrimitives = true', () => {
    const aBool = sinon.spy(() => true);
    const aVoid = sinon.spy();
    const gl = {
      aBool,
      aVoid,
    };
    const context = glWiretap(gl, {
      useTrackablePrimitives: true,
    });
    const result = context.aBool();
    context.aVoid(result);
    assert.calledWith(gl.aVoid, result);
    assert.match(context.toString(), 'const glVariable0 = gl.aBool();'
      + '\ngl.aVoid(glVariable0);');
  });
  it('number function with useTrackablePrimitives = true', () => {
    const aNumber = sinon.spy(() => 123);
    const aVoid = sinon.spy();
    const gl = {
      aNumber,
      aVoid,
    };
    const context = glWiretap(gl, {
      useTrackablePrimitives: true,
    });
    const result = context.aNumber();
    context.aVoid(result);
    assert.calledWith(gl.aVoid, result);
    assert.match(context.toString(), 'const glVariable0 = gl.aNumber();'
      + '\ngl.aVoid(glVariable0);');
  });
  it('void function with 1 number argument', () => {
    const aVoid = sinon.spy();
    const gl = {
      aVoid,
    };
    const context = glWiretap(gl);
    context.aVoid(123);
    assert.calledWith(gl.aVoid, 123);
    assert.match(context.toString(), 'gl.aVoid(123);');
  });
  it('void function with 1 number argument', () => {
    const aVoid = sinon.spy();
    const gl = {
      aVoid,
    };
    const context = glWiretap(gl);
    context.aVoid(123);
    assert.calledWith(gl.aVoid, 123);
    assert.match(context.toString(), 'gl.aVoid(123);');
  });
  it('void function with 1 single quote string argument', () => {
    const aVoid = sinon.spy();
    const gl = {
      aVoid,
    };
    const context = glWiretap(gl);
    context.aVoid('123');
    assert.calledWith(gl.aVoid, '123');
    assert.match(context.toString(), 'gl.aVoid(\'123\');');
  });
  it('void function with 1 single quote inside string argument', () => {
    const aVoid = sinon.spy();
    const gl = {
      aVoid,
    };
    const context = glWiretap(gl);
    context.aVoid("1'23");
    assert.calledWith(gl.aVoid, "1'23");
    assert.match(context.toString(), 'gl.aVoid("1\'23");');
  });
  it('void function with 1 double quote inside string argument', () => {
    const aVoid = sinon.spy();
    const gl = {
      aVoid,
    };
    const context = glWiretap(gl);
    context.aVoid('1"23');
    assert.calledWith(gl.aVoid, '1"23');
    assert.match(context.toString(), 'gl.aVoid(\'1"23\');');
  });
  it('void function with 1 multi-line string argument', () => {
    const aVoid = sinon.spy();
    const gl = {
      aVoid,
    };
    const context = glWiretap(gl);
    context.aVoid(`1
2
3`);
    assert.calledWith(gl.aVoid, `1
2
3`);
    assert.match(context.toString(), `gl.aVoid(\`1
2
3\`);`);
  });
  it('void function with 1 Array argument', () => {
    const aVoid = sinon.spy();
    const gl = {
      aVoid
    };
    const context = glWiretap(gl);
    const array = [1,2,3,4];
    context.aVoid(array);
    assert.calledWith(gl.aVoid);
    assert.match(context.toString(), 'const glVariable0 = new Array([1,2,3,4]);'
      + '\ngl.aVoid(glVariable0);');
  });
  it('void function with 1 Float32Array argument', () => {
    const aVoid = sinon.spy();
    const gl = {
      aVoid
    };
    const context = glWiretap(gl);
    context.aVoid(new Float32Array(1));
    assert.calledWith(gl.aVoid);
    assert.match(context.toString(), 'const glVariable0 = new Float32Array([0]);'
      + '\ngl.aVoid(glVariable0);');
  });
  it('void function with 1 number argument', () => {
    const aVoid = sinon.spy();
    const gl = {
      aVoid
    };
    const context = glWiretap(gl);
    context.aVoid(1);
    assert.calledWith(gl.aVoid);
    assert.match(context.toString(), 'gl.aVoid(1);');
  });
  it('void function with 1 boolean argument', () => {
    const aVoid = sinon.spy();
    const gl = {
      aVoid
    };
    const context = glWiretap(gl);
    context.aVoid(true);
    assert.calledWith(gl.aVoid);
    assert.match(context.toString(), 'gl.aVoid(true);');
  });
  it('getParameter', () => {
    const getParameter = sinon.spy(() => true);
    const gl = {
      RENDERER: 123,
      getParameter,
    };
    const context = glWiretap(gl);
    context.getParameter(context.RENDERER);
    assert.calledWith(gl.getParameter, gl.RENDERER);
    assert.match(context.toString(), 'const glVariable0 = gl.getParameter(gl.RENDERER);');
  });
  it('getExtension falsey', () => {
    const getExtension = sinon.spy();
    const gl = {
      getExtension,
    };
    const context = glWiretap(gl);
    const extension = context.getExtension('any');
    assert.match(extension, undefined);
    assert.match(context.toString(), 'const glVariables0 = gl.getExtension(\'any\');');
  });
  it('getExtension returns', () => {
    const extensionMethod = sinon.spy(() => true);
    const getExtension = sinon.spy(() => {
      return ({
        extensionMethod
      });
    });
    const gl = {
      getExtension,
    };
    const context = glWiretap(gl);
    const extension = context.getExtension('any');
    const result = extension.extensionMethod(true);
    assert.match(result, true);
    assert.calledWith(extensionMethod, true);
    assert.match(context.toString(), 'const glVariables0 = gl.getExtension(\'any\');'
    + '\nconst glVariables0Variable1 = glVariables0.extensionMethod(true);');
  });
  it('readPixels', () => {
    const readPixels = sinon.spy();
    const gl = {
      readPixels,
      RGBA: 123,
      FLOAT: 124,
    };
    const context = glWiretap(gl);
    context.readPixels(0, 0, 2, 3, context.RGBA, context.FLOAT, new Array(3));
    assert.calledWith(gl.readPixels);
    assert.match(context.toString(), 'const glVariable0 = new Array(3);'
      + '\ngl.readPixels(0, 0, 2, 3, gl.RGBA, gl.FLOAT, glVariable0);');
  });
  it('readPixels with use of readPixelsFile', () => {
    const readPixels = sinon.spy();
    const gl = {
      readPixels,
      RGBA: 123,
      FLOAT: 124,
    };
    const context = glWiretap(gl, {
      readPixelsFile: './test/index'
    });
    context.readPixels(0, 0, 2, 3, context.RGBA, context.FLOAT, new Array(3));
    assert.calledWith(gl.readPixels);
    assert.match(context.toString(), 'const glVariable0 = new Array(3);'
      + '\ngl.readPixels(0, 0, 2, 3, gl.RGBA, gl.FLOAT, glVariable0);'
      + '\nlet imageDatum0 = ["P3\\n# ./test/index.ppm\\n", 2, \' \', 3, "\\n255\\n"].join("");\n' +
      'for (let i = 0; i < imageDatum0.length; i += 4) {\n' +
      '  imageDatum0 += glVariable1[i] + \' \' + glVariable1[i + 1] + \' \' + glVariable1[i + 2] + \' \';\n' +
      '}\n' +
      'if (typeof require !== "undefined") {\n' +
      '  require(\'fs\').writeFileSync(\'././test/index.ppm\', imageDatum0);\n' +
      '}');
  });
  it('readPixels reuse of context variable', () => {
    const readPixels = sinon.spy();
    const gl = {
      readPixels,
      RGBA: 123,
      FLOAT: 124,
    };
    const context = glWiretap(gl);
    const contextVariable = new Array(3);
    context.readPixels(0, 0, 2, 3, context.RGBA, context.FLOAT, contextVariable);
    context.readPixels(0, 0, 2, 3, context.RGBA, context.FLOAT, contextVariable);
    assert.calledWith(gl.readPixels);
    assert.match(context.toString(), 'const glVariable0 = new Array(3);'
      + '\ngl.readPixels(0, 0, 2, 3, gl.RGBA, gl.FLOAT, glVariable0);'
      + '\ngl.readPixels(0, 0, 2, 3, gl.RGBA, gl.FLOAT, glVariable0);');
  });
  it('readPixels with variableName', () => {
    const readPixels = sinon.spy();
    const gl = {
      readPixels,
      RGBA: 123,
      FLOAT: 124,
    };
    const context = glWiretap(gl);
    const v = new Array(3);
    context.insertVariable('inserted_v', v);
    context.readPixels(0, 0, 2, 3, context.RGBA, context.FLOAT, v);
    assert.calledWith(gl.readPixels);
    assert.match(context.toString(), 'gl.readPixels(0, 0, 2, 3, gl.RGBA, gl.FLOAT, inserted_v);');
  });
  it('getReadPixelsVariableName', () => {
    const readPixels = sinon.spy();
    const gl = {
      readPixels,
      RGBA: 123,
      FLOAT: 124,
    };
    const context = glWiretap(gl);
    context.readPixels(0, 0, 2, 3, context.RGBA, context.FLOAT, new Array(3));
    assert.calledWith(gl.readPixels);
    assert.match(context.toString(), 'const glVariable0 = new Array(3);'
      + '\ngl.readPixels(0, 0, 2, 3, gl.RGBA, gl.FLOAT, glVariable0);');
    assert.match(context.getReadPixelsVariableName, 'glVariable0');
  });
  it('onReadPixels', () => {
    const readPixels = sinon.spy();
    const gl = {
      readPixels,
      RGBA: 123,
      FLOAT: 124,
    };
    const onReadPixels = sinon.spy();
    const context = glWiretap(gl, {
      onReadPixels,
    });
    context.readPixels(0, 0, 2, 3, context.RGBA, context.FLOAT, new Array(3));
    assert.calledWith(gl.readPixels);
    assert.match(context.toString(), 'const glVariable0 = new Array(3);'
      + '\ngl.readPixels(0, 0, 2, 3, gl.RGBA, gl.FLOAT, glVariable0);');
    assert.calledWith(onReadPixels, 'glVariable0', [0, 0, 2, 3, 'gl.RGBA', 'gl.FLOAT', 'glVariable0']);
  });
  it('onUnrecognizedArgumentLookup', () => {
    class Widget {}
    const bindTexture = sinon.spy();
    const gl = {
      bindTexture,
      TEXTURE_2D: 123,
    };
    const context = glWiretap(gl, {
      bindTexture,
      useTrackablePrimitives: true,
      onUnrecognizedArgumentLookup: (arg) => {
        if (arg.constructor === Widget) {
          return 'new Widget()';
        }
      }
    });
    const widget = new Widget();
    context.bindTexture(context.TEXTURE_2D, widget);
    assert.calledWith(gl.bindTexture);
    assert.match(context.toString(), 'gl.bindTexture(gl.TEXTURE_2D, new Widget());');
    assert.calledWith(bindTexture, context.TEXTURE_2D, widget);
  });
  it('extension.onUnrecognizedArgumentLookup', () => {
    class Widget {}
    const doSomething = sinon.spy();
    const extension = {
      doSomething,
      A_THING: 432,
    };
    const gl = {
      getExtension: () => extension
    };
    const context = glWiretap(gl, {
      useTrackablePrimitives: true,
      onUnrecognizedArgumentLookup: (arg) => {
        if (arg.constructor === Widget) {
          return 'new Widget()';
        }
      }
    });
    const widget = new Widget();
    const wireTappedExtension = context.getExtension('an extension');
    wireTappedExtension.doSomething(wireTappedExtension.A_THING, widget);
    assert.match(context.toString(), 'const glVariables0 = gl.getExtension(\'an extension\');\n' +
      'glVariables0.doSomething(glVariables0.A_THING, new Widget());');
    assert.calledWith(doSomething, extension.A_THING, widget);
  });
  it('addComment', () => {
    const gl = {};
    const context = glWiretap(gl);
    context.addComment('test');
    assert.match(context.toString(), '// test');
  });
  it('checkThrowError', () => {
    const gl = {};
    const context = glWiretap(gl);
    context.checkThrowError();
    assert.match(context.toString(), '(() => {\n' +
      'const error = gl.getError();\n' +
      'if (error !== gl.NONE) {\n' +
      '  const names = Object.getOwnPropertyNames(gl);\n' +
      '  for (let i = 0; i < names.length; i++) {\n' +
      '    const name = names[i];\n' +
      '    if (gl[name] === error) {\n' +
      '      throw new Error(\'gl threw \' + name);\n' +
      '    }\n' +
      '  }\n' +
      '}\n' +
      '})();');
  });
  it('reset', () => {
    const gl = {};
    const context = glWiretap(gl);
    context.addComment('test 1');
    context.reset();
    context.addComment('test 2');
    assert.match(context.toString(), '// test 2');
  });
  it('insertVariable', () => {
    const aVoid = sinon.spy();
    const gl = {
      aVoid
    };
    const context = glWiretap(gl);
    const v = {};
    context.insertVariable('inserted_v', v);
    context.aVoid(v);
    assert.match(context.toString(), 'gl.aVoid(inserted_v);');
  });
  it('setIndent', () => {
    const aVoid = sinon.spy();
    const gl = {
      aVoid,
    };
    const context = glWiretap(gl);
    context.setIndent(2);
    context.aVoid();
    assert.calledWith(gl.aVoid);
    assert.match(context.toString(), '  gl.aVoid();');
  });
  it('getContextVariableName when contextVariables has value', () => {
    const texture = {};
    const createTexture = () => {
      return texture;
    };
    const gl = {
      createTexture,
    };
    const context = glWiretap(gl);
    context.createTexture();
    const name = context.getContextVariableName(texture);
    assert.match(name, 'glVariable0');
  });
  it('getContextVariableName when contextVariables does not have value', () => {
    const gl = {};
    const context = glWiretap(gl);
    const name = context.getContextVariableName({});
    assert.match(name, null);
  });
  it('getError returns 0, throwGetError = false', () => {
    const getError = sinon.spy(() => 0);
    const gl = {
      getError,
    };
    const context = glWiretap(gl);
    context.getError();
    assert.calledWith(gl.getError);
    assert.match(context.toString(), 'gl.getError();');
  });
  it('getError returns 123, throwGetError = false', () => {
    const getError = sinon.spy(() => 123);
    const gl = {
      getError,
    };
    const context = glWiretap(gl);
    context.getError();
    assert.calledWith(gl.getError);
    assert.match(context.toString(), 'gl.getError();');
  });
  it('getError throwGetError = true', () => {
    const getError = sinon.spy(() => 123);
    const gl = {
      getError,
    };
    const context = glWiretap(gl, { throwGetError: true });
    context.getError();
    assert.match(context.toString(), 'if (gl.getError() !== gl.NONE) throw new Error(\'error\');');
    assert.calledWith(gl.getError);
  });
  it('drawBuffersWEBGL', () => {
    const drawBuffersWEBGL = sinon.spy();
    const WEBGL_draw_buffers = {
      drawBuffersWEBGL,
      COLOR_ATTACHMENT0_WEBGL: 0,
      COLOR_ATTACHMENT1_WEBGL: 1,
      COLOR_ATTACHMENT2_WEBGL: 2,
      COLOR_ATTACHMENT3_WEBGL: 3,
    };

    const gl = {
      getExtension: () => WEBGL_draw_buffers,
    };
    const context = glWiretap(gl);
    const extension = context.getExtension('WEBGL_draw_buffers');
    const buffers = [
      extension.COLOR_ATTACHMENT0_WEBGL,
      extension.COLOR_ATTACHMENT1_WEBGL,
      extension.COLOR_ATTACHMENT2_WEBGL,
      extension.COLOR_ATTACHMENT3_WEBGL
    ];
    extension.drawBuffersWEBGL(buffers);
    assert.match(context.toString(), 'const glVariables0 = gl.getExtension(\'WEBGL_draw_buffers\');'
      + '\nglVariables0.drawBuffersWEBGL([glVariables0.COLOR_ATTACHMENT0_WEBGL, glVariables0.COLOR_ATTACHMENT1_WEBGL, glVariables0.COLOR_ATTACHMENT2_WEBGL, glVariables0.COLOR_ATTACHMENT3_WEBGL]);');
  });
  it('drawBuffers', () => {
    const drawBuffers = sinon.spy();
    const gl = {
      drawBuffers,
      COLOR_ATTACHMENT0_WEBGL: 0,
      COLOR_ATTACHMENT1_WEBGL: 1,
      COLOR_ATTACHMENT2_WEBGL: 2,
      COLOR_ATTACHMENT3_WEBGL: 3,
    };
    const context = glWiretap(gl);
    const buffers = [
      context.COLOR_ATTACHMENT0_WEBGL,
      context.COLOR_ATTACHMENT1_WEBGL,
      context.COLOR_ATTACHMENT2_WEBGL,
      context.COLOR_ATTACHMENT3_WEBGL
    ];
    context.drawBuffers(buffers);
    assert.match(context.toString(), 'gl.drawBuffers([gl.COLOR_ATTACHMENT0_WEBGL, gl.COLOR_ATTACHMENT1_WEBGL, gl.COLOR_ATTACHMENT2_WEBGL, gl.COLOR_ATTACHMENT3_WEBGL]);');
  });
  it('undefined extension function', () => {
    const anUndefined = sinon.spy(() => {});
    const anExtension = {
      anUndefined
    };
    const gl = {
      getExtension: () => anExtension
    };
    const context = glWiretap(gl);
    const extension = context.getExtension('an-extension');
    extension.anUndefined();
    assert.match(context.toString(), 'const glVariables0 = gl.getExtension(\'an-extension\');' +
      '\nglVariables0.anUndefined();');
  });
  it('null extension function', () => {
    const aNull = sinon.spy(() => null);
    const anExtension = {
      aNull
    };
    const gl = {
      getExtension: () => anExtension
    };
    const context = glWiretap(gl);
    const extension = context.getExtension('an-extension');
    extension.aNull();
    assert.match(context.toString(), 'const glVariables0 = gl.getExtension(\'an-extension\');' +
      '\nglVariables0.aNull();');
  });
  it('boolean extension function', () => {
    const aBoolean = sinon.spy(() => true);
    const anExtension = {
      aBoolean
    };
    const gl = {
      getExtension: () => anExtension
    };
    const context = glWiretap(gl);
    const extension = context.getExtension('an-extension');
    extension.aBoolean();
    assert.match(context.toString(), 'const glVariables0 = gl.getExtension(\'an-extension\');' +
      '\nconst glVariables0Variable1 = glVariables0.aBoolean();');
  });
  it('boolean extension function with useTrackablePrimitives = true', () => {
    const aBoolean = sinon.spy(() => true);
    const anExtension = {
      aBoolean
    };
    const gl = {
      getExtension: () => anExtension
    };
    const context = glWiretap(gl, {
      useTrackablePrimitives: true,
    });
    const extension = context.getExtension('an-extension');
    extension.aBoolean();
    assert.match(context.toString(), 'const glVariables0 = gl.getExtension(\'an-extension\');' +
      '\nconst glVariables0Variable1 = glVariables0.aBoolean();');
  });
  it('number extension function', () => {
    const aNumber = sinon.spy(() => 1);
    const anExtension = {
      aNumber
    };
    const gl = {
      getExtension: () => anExtension
    };
    const context = glWiretap(gl);
    const extension = context.getExtension('an-extension');
    extension.aNumber();
    assert.match(context.toString(), 'const glVariables0 = gl.getExtension(\'an-extension\');' +
      '\nconst glVariables0Variable1 = glVariables0.aNumber();');
  });
  it('number extension function with ', () => {
    const aNumber = sinon.spy(() => 1);
    const anExtension = {
      aNumber
    };
    const gl = {
      getExtension: () => anExtension
    };
    const context = glWiretap(gl, {
      useTrackablePrimitives: true,
    });
    const extension = context.getExtension('an-extension');
    extension.aNumber();
    assert.match(context.toString(), 'const glVariables0 = gl.getExtension(\'an-extension\');' +
      '\nconst glVariables0Variable1 = glVariables0.aNumber();');
  });
  it('object extension function', () => {
    const anObject = sinon.spy(() => {
      return {};
    });
    const anExtension = {
      anObject
    };
    const gl = {
      getExtension: () => anExtension
    };
    const context = glWiretap(gl);
    const extension = context.getExtension('an-extension');
    extension.anObject();
    assert.match(context.toString(), 'const glVariables0 = gl.getExtension(\'an-extension\');' +
      '\nconst glVariables0Variable1 = glVariables0.anObject();');
  });
});
