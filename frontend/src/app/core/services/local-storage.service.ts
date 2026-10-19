import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private keyPrefix: string = '@unifit:';
  private createKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }

  public setItem<T>(key: string, data: T): T | null {
    try {
      const dataAsString = JSON.stringify(data);
      localStorage.setItem(this.createKey(key), dataAsString);

      return data;
    } catch (error) {
      console.error('Error while saving item');
      return null;
    }
  }

  public getItem<T>(key: string): T | null {
    try {
      const localStorageData = localStorage.getItem(this.createKey(key));

      if (!localStorageData) return null;

      return JSON.parse(localStorageData);
    } catch (error) {
      console.error('Error while getting item');
      return null;
    }
  }

  public deleteItem(key: string): void {
    try {
      localStorage.removeItem(this.createKey(key));
    } catch (error) {
      console.error('Error while deleting item');
    }
  }

  public clearData(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error while delete all data');
    }
  }
}
