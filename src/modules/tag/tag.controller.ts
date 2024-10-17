import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CorePaginatedResponse } from 'src/common/dto/core.dto';
import { Public } from '../auth/decorators/public.decorator';
import { FindAllTagsMapper, FindAllTagsQueryDto } from './dto/findTag.dto';
import { Tag } from './entities/tag.entity';
import { TagService } from './tag.service';

@ApiBearerAuth()
@ApiTags(`tag`)
@Controller({ path: 'tag', version: '1' })
export class TagController {
    constructor(private readonly tagService: TagService) {}

    @Public()
    @Get()
    async findAll(
        @Query() query: FindAllTagsQueryDto,
    ): Promise<CorePaginatedResponse<Tag[]>> {
        const result = await this.tagService.findAll(query);
        return FindAllTagsMapper(result);
    }
}
