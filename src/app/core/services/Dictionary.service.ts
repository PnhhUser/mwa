import { Injectable, inject } from '@angular/core';
import { WanakanaService } from './wanakana.service';

@Injectable({
  providedIn: 'root',
})
export class DictionaryService {
  private wanakanaService = inject(WanakanaService);

  private masterDictionary: Record<string, string[]> = {};

  private prefixIndex: Map<string, string[]> = new Map();

  public isLoaded = false;
  public loadingProgress = 0;

  constructor() {
    this.importEvenMaps();
  }

  private async importEvenMaps() {
    try {
      const configRes = await fetch('assets/data/dict_config.json');
      const config = await configRes.json();
      const totalChunks = config.totalChunks;

      for (let i = 0; i < totalChunks; i++) {
        const res = await fetch(`assets/data/dict_chunk_${i}.json`);
        const dataMap = await res.json();
        this.masterDictionary = { ...this.masterDictionary, ...dataMap };
        this.loadingProgress = Math.round(((i + 1) / totalChunks) * 100);
      }

      this.buildPrefixIndex();
      this.isLoaded = true;
      // console.log(`🚀 Đã nạp xong ${totalChunks} chunks từ điển`);
    } catch (error) {
      console.error('Lỗi khi khởi tạo từ điển:', error);
      const cached = localStorage.getItem('dictionary_cache');
      if (cached) {
        try {
          this.masterDictionary = JSON.parse(cached);
          this.buildPrefixIndex();
          this.isLoaded = true;
          this.loadingProgress = 100;
          console.log('✅ Load từ điển từ cache thành công');
        } catch (e) {
          console.error('Không thể load cache:', e);
        }
      }
    }
  }

  private buildPrefixIndex() {
    this.prefixIndex.clear();

    for (const [reading, kanjiList] of Object.entries(this.masterDictionary)) {
      // Index từng prefix của reading (1-5 ký tự)
      for (let i = 1; i <= Math.min(reading.length, 5); i++) {
        const prefix = reading.substring(0, i);
        if (!this.prefixIndex.has(prefix)) {
          this.prefixIndex.set(prefix, []);
        }
        this.prefixIndex.get(prefix)!.push(...kanjiList);
      }
    }

    for (const [key, values] of this.prefixIndex.entries()) {
      this.prefixIndex.set(key, [...new Set(values)].slice(0, 20));
    }

    // console.log(`📚 Đã xây dựng prefix index với ${this.prefixIndex.size} keys`);
  }

  public searchExact(input: string): string[] {
    const cleanInput = input.trim();
    if (!cleanInput || !this.isLoaded) return [];

    const searchKey = this.wanakanaService.convertToSearchBase(cleanInput);
    const exactMatch = this.masterDictionary[searchKey];

    return exactMatch ? [...exactMatch] : [];
  }

  public searchSuggestions(input: string): string[] {
    const cleanInput = input.trim();
    if (!cleanInput || !this.isLoaded) return [];

    const searchKey = this.wanakanaService.convertToSearchBase(cleanInput);
    const results = new Set<string>();

    // 1. Exact match - ưu tiên cao nhất
    const exactMatch = this.masterDictionary[searchKey];
    if (exactMatch) {
      for (const item of exactMatch) {
        results.add(item);
      }
    }

    if (results.size < 10 && searchKey.length >= 1) {
      const prefixMatches = this.prefixIndex.get(searchKey) || [];
      for (const item of prefixMatches) {
        results.add(item);
        if (results.size >= 20) break;
      }
    }

    return Array.from(results);
  }

  public cacheToLocalStorage() {
    try {
      localStorage.setItem('dictionary_cache', JSON.stringify(this.masterDictionary));
      console.log('💾 Đã cache từ điển');
    } catch (e) {
      console.warn('Không thể cache:', e);
    }
  }
}
