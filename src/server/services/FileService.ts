import { docker } from '../config/docker';
import { Readable } from 'stream';
import { Buffer } from 'buffer';

export class FileService {
  async listFiles(containerId: string, path: string = '/') {
    const container = docker.getContainer(containerId);
    if (!path.startsWith('/')) path = `/${path}`;
    const exec = await container.exec({
      Cmd: ['ls', '-lA', path],
      AttachStdout: true,
      AttachStderr: true,
    });

    const stream = await exec.start();
    const output = await this.streamToString(stream);

    return this.parseFileList(output);
  }

  async readFile(containerId: string, path: string) {
    const container = docker.getContainer(containerId);
    if (!path.startsWith('/')) path = `/${path}`;

    try {
      const catCmd = ['sh', '-c', `cat ${path}`];

      const exec = await container.exec({
        Cmd: catCmd,
        AttachStdout: true,
        AttachStderr: true,
      });

      const stream = await exec.start();
      const rawContent = await this.streamToString(stream);

      const content = this.cleanContent(rawContent);

      return { content };
    } catch (error: any) {
      if (error.message === 'BINARY_DOSYA') {
        throw new Error('Binary dosya okunamaz');
      }
      if (error.message === 'DOSYA_BOYUTU_LIMIT') {
        throw new Error('Dosya boyutu çok büyük');
      }
      throw new Error('Dosya okunamadı ' + error.message);
    }
  }

  async writeFile(containerId: string, path: string, content: string) {
    const container = docker.getContainer(containerId);
    if (!path.startsWith('/')) path = `/${path}`;

    try {
      // Dosya içeriğini Base64'e çevir
      const base64Content = Buffer.from(content).toString('base64');

      // Base64 içeriği geçici bir dosyaya yaz
      const tempPath = `${path}.tmp`;
      const writeExec = await container.exec({
        Cmd: ['sh', '-c', `echo '${base64Content}' | base64 -d > ${tempPath}`],
        AttachStdout: true,
        AttachStderr: true,
      });
      await writeExec.start();

      // Geçici dosyayı hedef dosyaya taşı
      const moveExec = await container.exec({
        Cmd: ['mv', tempPath, path],
        AttachStdout: true,
        AttachStderr: true,
      });
      await moveExec.start();
    } catch (error) {
      throw new Error('Dosya yazılamadı');
    }
  }

  async deleteFile(containerId: string, path: string) {
    const container = docker.getContainer(containerId);
    if (!path.startsWith('/')) path = `/${path}`;

    try {
      // Önce dosyanın var olduğunu kontrol et
      const checkExec = await container.exec({
        Cmd: ['test', '-f', path],
        AttachStdout: true,
        AttachStderr: true,
      });
      await checkExec.start();

      const exec = await container.exec({
        Cmd: ['rm', path],
        AttachStdout: true,
        AttachStderr: true,
      });
      await exec.start();
    } catch (error) {
      throw new Error('Dosya silinemedi');
    }
  }

  private async streamToString(stream: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk: Buffer) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
      stream.on('error', reject);
    });
  }

  private cleanContent(content: string): string {
    return content.replace(/[\u0000-\u001F\u007F-\u009F]/g, '').trim().substring(1);
  }

  private parseFileList(output: string) {
    const lines = output.split('\n').filter(line => line.trim());
    return lines.slice(1).map(line => {
      const parts = line.split(/\s+/);
      const name = parts.slice(8).join(' ');

      // . ve .. dizinlerini filtrele
      if (name === '.' || name === '..') {
        return null;
      }

      return {
        permissions: parts[0],
        size: parts[4],
        modifiedAt: `${parts[5]} ${parts[6]} ${parts[7]}`,
        name,
        isDirectory: parts[0].startsWith('d'),
      };
    }).filter(Boolean).filter((file: any) => file.name !== "");
  }
}
