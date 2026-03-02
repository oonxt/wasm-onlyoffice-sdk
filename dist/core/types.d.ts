export interface DocEditor {
    attachMouseEvents: () => void;
    blurFocus: (data: unknown) => void;
    denyEditingRights: (message: unknown) => void;
    destroyEditor: (cmd?: string) => void;
    detachMouseEvents: () => void;
    downloadAs: (data: unknown) => void;
    grabFocus: (data: unknown) => void;
    openDocument: (doc: unknown) => void;
    processMailMerge: (enabled: unknown, message: unknown) => void;
    refreshFile: (data: unknown) => void;
    refreshHistory: (data: unknown, message: unknown) => void;
    requestClose: (data: unknown) => void;
    requestRoles: (data: unknown) => void;
    serviceCommand: (command: string, data: unknown) => void;
    setActionLink: (data: unknown) => void;
    setEmailAddresses: (data: unknown) => void;
    setFavorite: (data: unknown) => void;
    setHistoryData: (data: unknown, message: unknown) => void;
    setMailMergeRecipients: (data: unknown) => void;
    setReferenceData: (data: unknown) => void;
    setReferenceSource: (data: unknown) => void;
    setRequestedDocument: (data: unknown) => void;
    setRequestedSpreadsheet: (data: unknown) => void;
    setRevisedFile: (data: unknown) => void;
    setSharingSettings: (data: unknown) => void;
    setUsers: (data: unknown) => void;
    showMessage: (title: string, msg: string) => void;
    showSharingSettings: (data: unknown) => void;
    startFilling: (data: unknown) => void;
}
export type User = {
    id: string;
    name: string;
};
export type Participant = {
    connectionId: string;
    encrypted: boolean;
    id: string;
    idOriginal: string;
    indexUser: number;
    isCloseCoAuthoring: boolean;
    isLiveViewer: boolean;
    username: string;
    view: boolean;
};
export declare const enum AscSaveTypes {
    PartStart = 0,
    Part = 1,
    Complete = 2,
    CompleteAll = 3
}
export declare const enum DocumentType {
    Word = "word",
    Cell = "cell",
    Slide = "slide",
    Draw = "draw",
    Pdf = "pdf"
}
export declare const enum AvsFileType {
    AVS_FILE_UNKNOWN = 0,
    AVS_FILE_DOCUMENT = 64,
    AVS_FILE_DOCUMENT_DOCX = 65,
    AVS_FILE_DOCUMENT_DOC = 66,
    AVS_FILE_DOCUMENT_ODT = 67,
    AVS_FILE_DOCUMENT_RTF = 68,
    AVS_FILE_DOCUMENT_TXT = 69,
    AVS_FILE_DOCUMENT_HTML = 70,
    AVS_FILE_DOCUMENT_MHT = 71,
    AVS_FILE_DOCUMENT_EPUB = 72,
    AVS_FILE_DOCUMENT_FB2 = 73,
    AVS_FILE_DOCUMENT_MOBI = 74,
    AVS_FILE_DOCUMENT_DOCM = 75,
    AVS_FILE_DOCUMENT_DOTX = 76,
    AVS_FILE_DOCUMENT_DOTM = 77,
    AVS_FILE_DOCUMENT_ODT_FLAT = 78,
    AVS_FILE_DOCUMENT_OTT = 79,
    AVS_FILE_DOCUMENT_DOC_FLAT = 80,
    AVS_FILE_DOCUMENT_DOCX_FLAT = 81,
    AVS_FILE_DOCUMENT_HTML_IN_CONTAINER = 82,
    AVS_FILE_DOCUMENT_DOCX_PACKAGE = 84,
    AVS_FILE_DOCUMENT_OFORM = 85,
    AVS_FILE_DOCUMENT_DOCXF = 86,
    AVS_FILE_DOCUMENT_OFORM_PDF = 87,
    AVS_FILE_PRESENTATION = 128,
    AVS_FILE_PRESENTATION_PPTX = 129,
    AVS_FILE_PRESENTATION_PPT = 130,
    AVS_FILE_PRESENTATION_ODP = 131,
    AVS_FILE_PRESENTATION_PPSX = 132,
    AVS_FILE_PRESENTATION_PPTM = 133,
    AVS_FILE_PRESENTATION_PPSM = 134,
    AVS_FILE_PRESENTATION_POTX = 135,
    AVS_FILE_PRESENTATION_POTM = 136,
    AVS_FILE_PRESENTATION_ODP_FLAT = 137,
    AVS_FILE_PRESENTATION_OTP = 138,
    AVS_FILE_PRESENTATION_PPTX_PACKAGE = 139,
    AVS_FILE_PRESENTATION_ODG = 140,
    AVS_FILE_SPREADSHEET = 256,
    AVS_FILE_SPREADSHEET_XLSX = 257,
    AVS_FILE_SPREADSHEET_XLS = 258,
    AVS_FILE_SPREADSHEET_ODS = 259,
    AVS_FILE_SPREADSHEET_CSV = 260,
    AVS_FILE_SPREADSHEET_XLSM = 261,
    AVS_FILE_SPREADSHEET_XLTX = 262,
    AVS_FILE_SPREADSHEET_XLTM = 263,
    AVS_FILE_SPREADSHEET_XLSB = 264,
    AVS_FILE_SPREADSHEET_ODS_FLAT = 265,
    AVS_FILE_SPREADSHEET_OTS = 266,
    AVS_FILE_SPREADSHEET_XLSX_FLAT = 267,
    AVS_FILE_SPREADSHEET_XLSX_PACKAGE = 268,
    AVS_FILE_CROSSPLATFORM = 512,
    AVS_FILE_CROSSPLATFORM_PDF = 513,
    AVS_FILE_CROSSPLATFORM_SWF = 514,
    AVS_FILE_CROSSPLATFORM_DJVU = 515,
    AVS_FILE_CROSSPLATFORM_XPS = 516,
    AVS_FILE_CROSSPLATFORM_SVG = 517,
    AVS_FILE_CROSSPLATFORM_HTMLR = 518,
    AVS_FILE_CROSSPLATFORM_HTMLR_MENU = 519,
    AVS_FILE_CROSSPLATFORM_HTMLR_CANVAS = 520,
    AVS_FILE_CROSSPLATFORM_PDFA = 521,
    AVS_FILE_IMAGE = 1024,
    AVS_FILE_IMAGE_JPG = 1025,
    AVS_FILE_IMAGE_TIFF = 1026,
    AVS_FILE_IMAGE_TGA = 1027,
    AVS_FILE_IMAGE_GIF = 1028,
    AVS_FILE_IMAGE_PNG = 1029,
    AVS_FILE_IMAGE_EMF = 1030,
    AVS_FILE_IMAGE_WMF = 1031,
    AVS_FILE_IMAGE_BMP = 1032,
    AVS_FILE_IMAGE_CR2 = 1033,
    AVS_FILE_IMAGE_PCX = 1034,
    AVS_FILE_IMAGE_RAS = 1035,
    AVS_FILE_IMAGE_PSD = 1036,
    AVS_FILE_IMAGE_ICO = 1037,
    AVS_FILE_OTHER = 2048,
    AVS_FILE_OTHER_EXTRACT_IMAGE = 2049,
    AVS_FILE_OTHER_MS_OFFCRYPTO = 2050,
    AVS_FILE_OTHER_HTMLZIP = 2051,
    AVS_FILE_OTHER_OLD_DOCUMENT = 2052,
    AVS_FILE_OTHER_OLD_PRESENTATION = 2053,
    AVS_FILE_OTHER_OLD_DRAWING = 2054,
    AVS_FILE_OTHER_OOXML = 2055,
    AVS_FILE_OTHER_JSON = 2056,// 对于 mail-merge
    AVS_FILE_OTHER_ODF = 2058,
    AVS_FILE_OTHER_MS_MITCRYPTO = 2059,
    AVS_FILE_OTHER_MS_VBAPROJECT = 2060,
    AVS_FILE_OTHER_PACKAGE_IN_OLE = 2061,
    AVS_FILE_TEAMLAB = 4096,
    AVS_FILE_TEAMLAB_DOCY = 4097,
    AVS_FILE_TEAMLAB_XLSY = 4098,
    AVS_FILE_TEAMLAB_PPTY = 4099,
    AVS_FILE_CANVAS = 8192,
    AVS_FILE_CANVAS_WORD = 8193,
    AVS_FILE_CANVAS_SPREADSHEET = 8194,
    AVS_FILE_CANVAS_PRESENTATION = 8195,
    AVS_FILE_CANVAS_PDF = 8196,
    AVS_FILE_DRAW = 16384,
    AVS_FILE_DRAW_VSDX = 16385,
    AVS_FILE_DRAW_VSSX = 16386,
    AVS_FILE_DRAW_VSTX = 16387,
    AVS_FILE_DRAW_VSDM = 16388,
    AVS_FILE_DRAW_VSSM = 16389,
    AVS_FILE_DRAW_VSTM = 16390
}
export interface X2tConvertParams {
    data: ArrayBuffer;
    fileFrom: string;
    fileTo: string;
    formatFrom?: number;
    formatTo?: number;
    media?: {
        [key: string]: Uint8Array;
    };
    fonts?: {
        [key: string]: Uint8Array;
    };
    themes?: {
        [key: string]: Uint8Array;
    };
}
export interface X2tConvertResult {
    output: Uint8Array<ArrayBuffer> | null;
    media: {
        [key: string]: Uint8Array<ArrayBuffer>;
    };
}
export type OfficeTheme = "theme-light" | "theme-classic-light" | "theme-white" | "theme-dark" | "theme-night" | "theme-contrast-dark";
//# sourceMappingURL=types.d.ts.map