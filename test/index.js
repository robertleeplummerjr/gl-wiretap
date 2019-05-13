const { glWiretap } = require('../index');
const sinon = require('sinon');
const { assert } = sinon;
describe('end-to-end', () => {
  it('void fn', () => {
    const aVoid = sinon.spy();
    const gl = {
      aVoid,
    };
    const context = glWiretap(gl);
    context.aVoid();
    assert.calledWith(gl.aVoid);
    assert.match(context.toString(), 'gl.aVoid();');
  });
  it('void fn with 1 boolean argument', () => {
    const aVoid = sinon.spy();
    const gl = {
      aVoid,
    };
    const context = glWiretap(gl);
    context.aVoid(true);
    assert.calledWith(gl.aVoid, true);
    assert.match(context.toString(), 'gl.aVoid(true);');
  });
  it('bool fn', () => {
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
  it('number fn', () => {
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
  it('void fn with 1 number argument', () => {
    const aVoid = sinon.spy();
    const gl = {
      aVoid,
    };
    const context = glWiretap(gl);
    context.aVoid(123);
    assert.calledWith(gl.aVoid, 123);
    assert.match(context.toString(), 'gl.aVoid(123);');
  });
  it('void fn with 1 number argument', () => {
    const aVoid = sinon.spy();
    const gl = {
      aVoid,
    };
    const context = glWiretap(gl);
    context.aVoid(123);
    assert.calledWith(gl.aVoid, 123);
    assert.match(context.toString(), 'gl.aVoid(123);');
  });
  it('void fn with 1 single quote string argument', () => {
    const aVoid = sinon.spy();
    const gl = {
      aVoid,
    };
    const context = glWiretap(gl);
    context.aVoid('123');
    assert.calledWith(gl.aVoid, '123');
    assert.match(context.toString(), 'gl.aVoid(\'123\');');
  });
  it('void fn with 1 single quote inside string argument', () => {
    const aVoid = sinon.spy();
    const gl = {
      aVoid,
    };
    const context = glWiretap(gl);
    context.aVoid("1'23");
    assert.calledWith(gl.aVoid, "1'23");
    assert.match(context.toString(), 'gl.aVoid("1\'23");');
  });
  it('void fn with 1 double quote inside string argument', () => {
    const aVoid = sinon.spy();
    const gl = {
      aVoid,
    };
    const context = glWiretap(gl);
    context.aVoid('1"23');
    assert.calledWith(gl.aVoid, '1"23');
    assert.match(context.toString(), 'gl.aVoid(\'1"23\');');
  });
  it('void fn with 1 multi-line string argument', () => {
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
  it('void fn with 1 object argument', () => {
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
});
