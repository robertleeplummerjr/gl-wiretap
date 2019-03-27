export interface IGLWiretapOptions {
  contextName?: string;
  readPixelsFile?: string;
  recording?: string[];
  throwGetError?: Boolean;
  throwGetShaderParameter?: Boolean;
  throwGetProgramParameter?: Boolean;
  useTrackableNumbers?: Boolean;
}

export interface IGLExtensionWiretapOptions {
  contextName: string;
  contextVariables: any[];
  getEntity: (value: number) => string | number;
  useTrackableNumbers?: Boolean;
  recording: string[];
}

export interface GLWiretapProxy extends WebGLRenderingContext {
  addComment(comment: string): void;
  checkThrowError(): void;
  toString: string;
}

export function glWiretap(gl: WebGLRenderingContext, options?: IGLWiretapOptions): GLWiretapProxy;

export function glExtensionWiretap(extension: any, options: IGLExtensionWiretapOptions);
