export interface IGLWiretapOptions {
  readPixelsFile?: string;
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
