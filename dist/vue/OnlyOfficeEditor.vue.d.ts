import { OfficeTheme, User } from '../core/types';
interface Props {
    assetsPath: string;
    x2tPath?: string;
    file?: File;
    fileUrl?: string;
    newDocument?: 'docx' | 'xlsx' | 'pptx' | 'pdf';
    language?: string;
    theme?: OfficeTheme;
    user?: User;
}
declare const _default: import('vue').DefineComponent<Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    ready: () => any;
    error: (error: Error) => any;
    save: (blob: Blob, filename: string) => any;
    documentStateChange: (isDirty: boolean) => any;
}, string, import('vue').PublicProps, Readonly<Props> & Readonly<{
    onReady?: (() => any) | undefined;
    onError?: ((error: Error) => any) | undefined;
    onSave?: ((blob: Blob, filename: string) => any) | undefined;
    onDocumentStateChange?: ((isDirty: boolean) => any) | undefined;
}>, {
    x2tPath: string;
    user: User;
    language: string;
    theme: OfficeTheme;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
export default _default;
//# sourceMappingURL=OnlyOfficeEditor.vue.d.ts.map