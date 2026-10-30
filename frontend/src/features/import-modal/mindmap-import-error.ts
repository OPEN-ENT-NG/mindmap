export type MindmapImportErrorCode =
  | 'UNSUPPORTED_FORMAT'
  | 'FILE_TOO_LARGE'
  | 'INVALID_CONTENT';

export class MindmapImportError extends Error {
  readonly code: MindmapImportErrorCode;

  constructor(code: MindmapImportErrorCode) {
    super(code);
    this.name = 'MindmapImportError';
    this.code = code;
  }
}
