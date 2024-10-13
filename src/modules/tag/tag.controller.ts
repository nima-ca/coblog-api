import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller({ path: 'tag', version: '1' })
export class TagController {
    constructor(private readonly tagService: TagService) {}

    @Get()
    findAll() {
        return this.tagService.findAll();
    }
}
