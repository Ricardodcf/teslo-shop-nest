import { BadRequestException, Body, Controller, FileTypeValidator, Get, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { diskStorage } from "multer";
import { fileFilter, fileNamer } from './helpers';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files - Get and upload')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {

    const path = this.filesService.getStaticProductImage(imageName);
    // return path;
    res.sendFile(path);
    
  }


  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }) )
  uploadProductImage( @UploadedFile() file: Express.Multer.File ) {


    console.log(file);

    if (!file) throw new BadRequestException('Make sure that the file is an image');
    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;
    return {secureUrl};
  }

  @Post('product2')
  uploadProductImage2(
    @Body() body,
    @UploadedFile(
      new ParseFilePipe({ // no funciona
        validators: [
          new FileTypeValidator({ fileType: 'png' }), //no funciona
        ]
      })
    ) file: Express.Multer.File ) {


    console.log(file);

    if (!file) throw new BadRequestException('Make sure that the file is an image');
    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;
    return {secureUrl};
  }

}
