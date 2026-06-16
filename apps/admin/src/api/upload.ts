import request from '@/utils/request';

export function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return request.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function uploadVideo(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return request.post('/upload/video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return request.post('/upload/file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function deleteFile(url: string) {
  return request.delete('/upload', { data: { url } });
}
