export interface IGLWiretapOptions {
  readPixelsFile?: string;
}

export interface GLWiretapProxy extends WebGLRenderingContext {
  toString: string;
}

export function glWiretap(gl: WebGLRenderingContext, options?: IGLWiretapOptions): GLWiretapProxy;
