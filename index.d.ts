export interface IGLWiretapOptions {
  contextName?: string;
  readPixelsFile?: string;
  recording?: string[];
  throwGetError?: Boolean;
  throwGetShaderParameter?: Boolean;
  throwGetProgramParameter?: Boolean;
}

export interface IGLExtensionWiretapOptions {
  gl: GLWiretapProxy;
  recording: string[];
  variableName: string;
  variables: any;
}

export interface GLWiretapProxy extends WebGLRenderingContext {
  addComment(comment: string): void;
  checkThrowError(): void;
  toString: string;
}

export function glWiretap(gl: WebGLRenderingContext, options?: IGLWiretapOptions): GLWiretapProxy;

export function glExtensionWiretap(extension: any, options: IGLExtensionWiretapOptions);
