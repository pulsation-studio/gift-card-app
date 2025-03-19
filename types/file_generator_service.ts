export interface FileGenerationParams {
  data: Record<string, any>
  templatePath: string
  expectedFormat: string
  fileName: string
}

export type FilesGenerationParams = FileGenerationParams[]
export type Files = File[]

export abstract class FileGeneratorService {
  abstract generateFile(generationParams: FileGenerationParams): Promise<File>
  abstract generateFiles(filesGenerationParams: FilesGenerationParams): Promise<Files>
}
