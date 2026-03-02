import { DocumentType } from './types';
export declare function getFileExt(name: string): string;
export declare enum AppType {
    word = 1,
    slide = 3,
    cell = 2,
    draw = 4,
    pdf = 5
}
export declare const docTypeMap: {
    docx: AppType;
    doc: AppType;
    odt: AppType;
    rtf: AppType;
    txt: AppType;
    html: AppType;
    mht: AppType;
    epub: AppType;
    fb2: AppType;
    mobi: AppType;
    docm: AppType;
    dotx: AppType;
    dotm: AppType;
    oform: AppType;
    docxf: AppType;
    pptx: AppType;
    ppt: AppType;
    odp: AppType;
    ppsx: AppType;
    pptm: AppType;
    ppsm: AppType;
    potx: AppType;
    potm: AppType;
    otp: AppType;
    odg: AppType;
    xlsx: AppType;
    xls: AppType;
    ods: AppType;
    csv: AppType;
    xlsm: AppType;
    xltx: AppType;
    xltm: AppType;
    xlsb: AppType;
    ots: AppType;
    vsdx: AppType;
    vssx: AppType;
    vstx: AppType;
    vsdm: AppType;
    vssm: AppType;
    vstm: AppType;
    pdf: AppType;
};
export declare function getDocumentType(ext: string): DocumentType;
//# sourceMappingURL=utils.d.ts.map