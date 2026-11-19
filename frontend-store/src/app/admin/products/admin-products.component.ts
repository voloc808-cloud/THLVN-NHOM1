import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminProductsService } from './admin-products.service';
import { Product } from '../../products/product.model';
import { errorMessage } from '../../core/api';
@Component({
  selector: 'app-admin-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css',
})
export class AdminProductsComponent {
  private api = inject(AdminProductsService);
  items = signal<Product[]>([]);
  error = signal('');
  message = signal('');
  busy = signal(false);
  loading = signal(true);
  editId = '';
  specsText = '';
  form: Omit<Product, '_id'> = {
    name: '',
    brand: '',
    price: 0,
    stock: 0,
    image: '',
    description: '',
    specs: [],
    status: 'ACTIVE',
  };
  constructor() {
    this.load();
  }
  load() {
    this.loading.set(true);
    this.api.list().subscribe({
      next: (p) => {
        this.items.set(p);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(errorMessage(e));
        this.loading.set(false);
      },
    });
  }
  edit(p: Product) {
    this.editId = p._id;
    this.form = { ...p, specs: [...p.specs] };
    this.specsText = p.specs.map((s) => s.key + ': ' + s.value).join('\n');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  reset() {
    this.editId = '';
    this.form = {
      name: '',
      brand: '',
      price: 0,
      stock: 0,
      image: '',
      description: '',
      specs: [],
      status: 'ACTIVE',
    };
    this.specsText = '';
  }
  save() {
    this.error.set('');
    const lines = this.specsText.split('\n').filter((l) => l.trim());
    if (lines.some((l) => l.indexOf(':') < 1 || !l.slice(l.indexOf(':') + 1).trim())) {
      this.error.set('Thông số phải có dạng Tên: Giá trị, mỗi dòng một mục.');
      return;
    }
    const data = {
      ...this.form,
      specs: lines.map((l) => ({
        key: l.slice(0, l.indexOf(':')).trim(),
        value: l.slice(l.indexOf(':') + 1).trim(),
      })),
    };
    this.busy.set(true);
    this.api.save(data, this.editId).subscribe({
      next: () => {
        this.busy.set(false);
        this.message.set('Đã lưu sản phẩm.');
        this.reset();
        this.load();
      },
      error: (e) => {
        this.busy.set(false);
        this.error.set(errorMessage(e));
      },
    });
  }
  remove(p: Product) {
    if (!confirm('Xóa sản phẩm ' + p.name + ' khỏi danh mục?')) return;
    this.busy.set(true);
    this.api.remove(p._id).subscribe({
      next: () => {
        this.busy.set(false);
        this.load();
      },
      error: (e) => {
        this.busy.set(false);
        this.error.set(errorMessage(e));
      },
    });
  }
}
