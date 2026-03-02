import { CSSProperties } from 'react';
import { OfficeTheme, User } from '../core/types';
export interface OnlyOfficeEditorProps {
    /** URL prefix for OnlyOffice web-apps assets, e.g. "/v9.3.0.24-1" */
    assetsPath: string;
    /** URL prefix for x2t WASM files, e.g. "/x2t-1". Defaults to "/x2t-1" */
    x2tPath?: string;
    /** Open an existing File object */
    file?: File;
    /** Open a document from a remote URL */
    fileUrl?: string;
    /** Create a new blank document of the given type */
    newDocument?: 'docx' | 'xlsx' | 'pptx' | 'pdf';
    language?: string;
    theme?: OfficeTheme;
    user?: User;
    onReady?: () => void;
    onDocumentStateChange?: (isDirty: boolean) => void;
    /** Called when the user triggers Save As / Download */
    onSave?: (blob: Blob, filename: string) => void;
    onError?: (error: Error) => void;
    style?: CSSProperties;
    className?: string;
}
export declare function OnlyOfficeEditor({ assetsPath, x2tPath, file, fileUrl, newDocument, language, theme, user, onReady, onDocumentStateChange, onSave, onError, style, className, }: OnlyOfficeEditorProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=OnlyOfficeEditor.d.ts.map