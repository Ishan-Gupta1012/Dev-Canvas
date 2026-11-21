export type MammothModule = typeof import('mammoth');

let mammothPromise: Promise<MammothModule> | null = null;

/**
 * Lazily load mammoth (DOCX parsing) once, tolerating a missing install.
 * Keeping it dynamic avoids pulling the DOCX parser into PDF-only requests.
 */
export async function loadMammoth(): Promise<MammothModule | null> {
  try {
    mammothPromise ??= import('mammoth').then(
      (mod) => (mod.default ?? mod) as MammothModule
    );
    return await mammothPromise;
  } catch (error) {
    console.warn('mammoth not available for DOCX parsing', error);
    mammothPromise = null;
    return null;
  }
}
