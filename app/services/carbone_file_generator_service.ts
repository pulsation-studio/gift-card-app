import {
  FileGeneratorService,
  FileGenerationParams,
  Files,
  FilesGenerationParams,
} from '#types/file_generator_service'
import { inject } from '@adonisjs/core'
import logger from '@adonisjs/core/services/logger'
import carbone from 'carbone'
import { isStringDateTime } from '#helpers/is_string_date_time'
import { DateTime } from 'luxon'

@inject()
export class CarboneFileGeneratorService implements FileGeneratorService {
  generateFile(generationParams: FileGenerationParams): Promise<File> {
    const formatedData = this.formatForCarboneTemplate(generationParams.data)

    return new Promise((resolve, reject) => {
      const afterFileGeneration: carbone.RenderCallback = (err, result) => {
        if (err !== null) {
          logger.error(`Error during ${generationParams.fileName} generation`)
          logger.error(err)
          return reject(err)
        }
        const generatedFile = new File([result], generationParams.fileName, {
          type: `application.${generationParams.expectedFormat}`,
        })
        resolve(generatedFile)
      }

      carbone.render(
        generationParams.templatePath,
        formatedData,
        { convertTo: generationParams.expectedFormat },
        afterFileGeneration
      )
    })
  }

  async generateFiles(filesGenerationParams: FilesGenerationParams): Promise<Files> {
    logger.info('Files generating...')
    const renderedFiles = await Promise.all(
      filesGenerationParams.map((params: FileGenerationParams) => this.generateFile(params))
    )
    logger.info('Files successfully generated!')
    return renderedFiles
  }

  private formatForCarboneTemplate<T>(value: T): T {
    switch (true) {
      case isStringDateTime(value):
        return DateTime.fromISO(value).toFormat('dd/MM/yyyy') as T
      case Array.isArray(value):
        return value.map((item) => this.formatForCarboneTemplate(item)) as T
      case value instanceof Object:
        const obj: { [key: string]: any } = {}
        Object.entries(value).forEach(([key, val]) => {
          obj[key] = this.formatForCarboneTemplate(val)
        })
        return obj as T
      default:
        return value
    }
  }
}
