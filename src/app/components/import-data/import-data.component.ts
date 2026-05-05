import { Component, inject } from '@angular/core';
import { FileService } from '../../core/services/file.service';
import { FileType } from '../../core/enums/file..enum';
import { parseJMdictEntry, parseJMdictTagBank } from '../../core/helpers/jmdict.helper';

@Component({
  selector: 'app-import-data',
  standalone: true,
  imports: [],
  templateUrl: './import-data.component.html',
  styleUrl: './import-data.component.less',
})
export class ImportDataComponent {
  private fileService = inject(FileService);

  async onFileChange(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    for (const file of fileArray) {
      try {
        const rawJson = await this.fileService.readFile(file, FileType.JSON);

        if (file.name.includes('tag_bank')) {
          const parsedTagMap = parseJMdictTagBank(rawJson);

          this.fileService.createFile(file.name, parsedTagMap, FileType.JSON);
        } else if (file.name.includes('term_bank')) {
          const parsedTerms = rawJson.map(parseJMdictEntry);

          this.fileService.createFile(file.name, parsedTerms, FileType.JSON);
        }

        console.log(` Đã xử lý xong file: ${file.name}`);
      } catch (error) {
        console.error(` Thất bại khi xử lý file ${file.name}:`, error);
      }
    }

    console.log('--- ĐÃ HOÀN THÀNH TOÀN BỘ DANH SÁCH ---');
  }
}
