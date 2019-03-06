export interface IGLWiretapOptions {
  contextName?: string;
  readPixelsFile?: string;
  recording?: string[];
  throwGetError?: Boolean;
  throwGetShaderParameter?: Boolean;
  throwGetProgramParameter?: Boolean;
}

export interface IGLExtensionWiretapOptions {
  variableName: string;
  recording: string[];
}

export interface GLWiretapProxy extends WebGLRenderingContext {
  toString: string;
}

export function glWiretap(gl: WebGLRenderingContext, options?: IGLWiretapOptions): GLWiretapProxy;

export function glExtensionWiretap(extension: any, options: IGLExtensionWiretapOptions);
