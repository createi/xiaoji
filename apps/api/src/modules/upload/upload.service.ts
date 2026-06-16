import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private uploadDir: string;

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get<string>('storage.localPath', 'uploads');
    this.ensureDir(this.uploadDir);
  }

  private ensureDir(dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private getSubDir(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }

  private getFileExt(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    return ext || '.bin';
  }

  async uploadImage(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('请选择文件');
    }

    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('只支持 jpg/png/gif/webp/svg 格式图片');
    }

    return this.saveFile(file, 'images');
  }

  async uploadVideo(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('请选择文件');
    }

    const allowedMimes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('只支持 mp4/webm/ogg 格式视频');
    }

    return this.saveFile(file, 'videos');
  }

  async uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('请选择文件');
    }

    return this.saveFile(file, 'files');
  }

  private async saveFile(file: Express.Multer.File, subDir: string) {
    const dateDir = this.getSubDir();
    const savePath = path.join(this.uploadDir, subDir, dateDir);
    this.ensureDir(savePath);

    const ext = this.getFileExt(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    const filePath = path.join(savePath, filename);

    fs.writeFileSync(filePath, file.buffer);

    const relativePath = `${subDir}/${dateDir}/${filename}`;
    return {
      url: `/uploads/${relativePath}`,
      name: file.originalname,
      size: file.size,
      type: file.mimetype,
    };
  }

  async deleteFile(filePath: string) {
    // 从 URL 中提取文件路径
    const relativePath = filePath.replace('/uploads/', '');
    const fullPath = path.join(this.uploadDir, relativePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
    return false;
  }
}
