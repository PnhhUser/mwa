import { Injectable } from '@angular/core';
import { FileType } from '../enums/file..enum';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  // ĐỌC FILE
  async readFile(file: File, type: FileType): Promise<any> {
    const content = await this.readAsText(file);
    switch (type) {
      case FileType.JSON:
        return this.parseJson(content);
      case FileType.TEXT:
        return this.parseText(content);
      case FileType.XML:
        return this.parseXml(content);
      default:
        throw new Error('Unsupported file type');
    }
  }

  private readAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }

  private parseJson(content: string): any {
    try {
      return JSON.parse(content);
    } catch (err) {
      throw new Error('Invalid JSON file');
    }
  }

  private parseText(content: string): string {
    return content;
  }

  private parseXml(content: string): Document {
    const parser = new DOMParser();
    return parser.parseFromString(content, 'text/xml');
  }

  // TẠO FILE
  createFile(fileName: string, data: any, type: FileType): void {
    let fileContent: string;
    let mimeType: string;

    switch (type) {
      case FileType.JSON:
        fileContent = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
        mimeType = 'application/json';
        break;
      case FileType.XML:
        fileContent = typeof data === 'string' ? data : new XMLSerializer().serializeToString(data);
        mimeType = 'application/xml';
        break;
      case FileType.TEXT:
      default:
        fileContent = String(data);
        mimeType = 'text/plain';
        break;
    }

    const blob = new Blob([fileContent], { type: `${mimeType};charset=utf-8;` });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;

    link.setAttribute('download', fileName);

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
