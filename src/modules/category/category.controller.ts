import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { CorePaginatedResponse, CoreResponse } from 'src/common/dto/core.dto';
import { OPERATION_SUCCESSFUL_MESSAGE } from 'src/common/messages/general.mesages';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/role.decorator';
import { UserRole } from '../user/entities/user.entity';
import { CategoryService } from './category.service';
import {
    CreateCategoryDto,
    CreateCategoryMapper,
    CreateCategoryResponseDto,
} from './dto/createCategory.dto';
import {
    FindAllCategoriesMapper,
    FindAllCategoriesQueryDto,
    FindOneCategoryMapper,
} from './dto/findCategory.dto';
import {
    UpdateCategoryDto,
    UpdateCategoryMapper,
    UpdateCategoryResponseDto,
} from './dto/updateCategory.dto';
import { Category } from './entities/category.entity';

@Controller({ path: 'category', version: '1' })
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Roles(UserRole.Admin)
    @Post()
    async create(
        @Body() createCategoryDto: CreateCategoryDto,
    ): Promise<CoreResponse<CreateCategoryResponseDto>> {
        const result = await this.categoryService.create(createCategoryDto);
        return CreateCategoryMapper(result);
    }

    @Public()
    @Get()
    async findAll(
        @Query() query: FindAllCategoriesQueryDto,
    ): Promise<CorePaginatedResponse<Category[]>> {
        const result = await this.categoryService.findAll(query);
        return FindAllCategoriesMapper(result);
    }

    @Public()
    @Get(':id')
    async findOne(@Param('id') id: string) {
        const result = await this.categoryService.findOne(+id);
        return FindOneCategoryMapper(result);
    }

    @Roles(UserRole.Admin)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ): Promise<CoreResponse<UpdateCategoryResponseDto>> {
        const result = await this.categoryService.update(
            +id,
            updateCategoryDto,
        );

        return UpdateCategoryMapper(result);
    }

    @Roles(UserRole.Admin)
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<CoreResponse> {
        await this.categoryService.remove(+id);
        return { message: OPERATION_SUCCESSFUL_MESSAGE };
    }
}
