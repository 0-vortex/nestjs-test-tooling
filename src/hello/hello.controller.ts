import { Controller, Get } from '@nestjs/common';
import { HelloService } from './hello.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('hello')
@ApiTags('Demo service')
export class HelloController {
  constructor(private readonly appService: HelloService) {}

  @Get('/')
  @ApiOperation({
    operationId: 'helloWorldService',
    summary: 'Check the hello of the world example',
  })
  @ApiOkResponse()
  getHello(): string {
    return this.appService.getHello();
  }
}
