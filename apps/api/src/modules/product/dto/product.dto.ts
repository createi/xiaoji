import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

// ==================== 商品 ====================

export class QueryProductDto {
  @ApiPropertyOptional({ description: '页码' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ description: '每页数量' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ description: '商品名称(搜索)' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ description: '商品名称' })
  @IsOptional()
  @IsString()
  store_name?: string;

  @ApiPropertyOptional({ description: '商品类型 0=普通 1=卡密 2=优惠券 3=虚拟' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  product_type?: number;

  @ApiPropertyOptional({ description: '分类 ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cate_id?: number;

  @ApiPropertyOptional({ description: '规格类型 0=单规格 1=多规格' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  spec_type?: number;

  @ApiPropertyOptional({ description: '状态 1=上架 0=下架' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  is_show?: number;

  @ApiPropertyOptional({ description: '状态(前端字段)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  status?: number;

  @ApiPropertyOptional({ description: '开始时间' })
  @IsOptional()
  @IsString()
  start_time?: string;

  @ApiPropertyOptional({ description: '结束时间' })
  @IsOptional()
  @IsString()
  end_time?: string;
}

export class CreateProductDto {
  @ApiProperty({ description: '商品名称' })
  @IsString()
  store_name: string;

  @ApiPropertyOptional({ description: '商品简介' })
  @IsOptional()
  @IsString()
  store_info?: string;

  @ApiProperty({ description: '商品主图' })
  @IsString()
  image: string;

  @ApiPropertyOptional({ description: '轮播图 JSON' })
  @IsOptional()
  @IsString()
  slider_image?: string;

  @ApiPropertyOptional({ description: '商品视频' })
  @IsOptional()
  @IsString()
  video_link?: string;

  @ApiProperty({ description: '分类 ID JSON' })
  @IsString()
  cate_id: string;

  @ApiProperty({ description: '销售价格' })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ description: '原价' })
  @IsOptional()
  @IsNumber()
  ot_price?: number;

  @ApiPropertyOptional({ description: '成本价' })
  @IsOptional()
  @IsNumber()
  cost_price?: number;

  @ApiPropertyOptional({ description: '会员价' })
  @IsOptional()
  @IsNumber()
  vip_price?: number;

  @ApiPropertyOptional({ description: '商品类型 0=普通 1=卡密 2=优惠券 3=虚拟' })
  @IsOptional()
  @IsNumber()
  product_type?: number;

  @ApiPropertyOptional({ description: '购买送积分' })
  @IsOptional()
  @IsNumber()
  give_integral?: number;

  @ApiProperty({ description: '库存' })
  @IsNumber()
  stock: number;

  @ApiPropertyOptional({ description: '单位' })
  @IsOptional()
  @IsString()
  unit_name?: string;

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @IsNumber()
  sort?: number;

  @ApiPropertyOptional({ description: '是否上架 1=上架 0=下架' })
  @IsOptional()
  @IsNumber()
  is_show?: number;

  @ApiPropertyOptional({ description: '是否热销' })
  @IsOptional()
  @IsNumber()
  is_hot?: number;

  @ApiPropertyOptional({ description: '是否精选' })
  @IsOptional()
  @IsNumber()
  is_best?: number;

  @ApiPropertyOptional({ description: '是否新品' })
  @IsOptional()
  @IsNumber()
  is_new?: number;

  @ApiPropertyOptional({ description: '规格类型 0=单规格 1=多规格' })
  @IsOptional()
  @IsNumber()
  spec_type?: number;

  @ApiPropertyOptional({ description: '规格属性 JSON' })
  @IsOptional()
  @IsString()
  attr?: string;

  @ApiPropertyOptional({ description: 'SKU 列表 JSON' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({ description: '关键词' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ description: '运费模板 ID' })
  @IsOptional()
  @IsNumber()
  temp_id?: number;

  @ApiPropertyOptional({ description: '邮费' })
  @IsOptional()
  @IsNumber()
  postage?: number;

  @ApiPropertyOptional({ description: '是否包邮 1=包邮' })
  @IsOptional()
  @IsNumber()
  is_postage?: number;

  @ApiPropertyOptional({ description: '物流方式 JSON' })
  @IsOptional()
  @IsString()
  logistics?: string;

  @ApiPropertyOptional({ description: '分销佣金' })
  @IsOptional()
  @IsNumber()
  brokerage?: number;

  @ApiPropertyOptional({ description: '二级分销佣金' })
  @IsOptional()
  @IsNumber()
  brokerage_two?: number;

  @ApiPropertyOptional({ description: '活动标签 JSON' })
  @IsOptional()
  @IsString()
  activity?: string;

  @ApiPropertyOptional({ description: '商品标签 JSON' })
  @IsOptional()
  @IsString()
  label_id?: string;

  @ApiPropertyOptional({ description: '优惠券 IDs JSON' })
  @IsOptional()
  @IsString()
  coupon_ids?: string;

  @ApiPropertyOptional({ description: '限购数量 0=不限' })
  @IsOptional()
  @IsNumber()
  limit_num?: number;

  @ApiPropertyOptional({ description: '虚拟商品内容' })
  @IsOptional()
  @IsString()
  fictitious_content?: string;

  @ApiPropertyOptional({ description: '预售时间 JSON' })
  @IsOptional()
  @IsString()
  presale_time?: string;

  @ApiPropertyOptional({ description: '服务保障 JSON' })
  @IsOptional()
  @IsString()
  protection_list?: string;
}

export class UpdateProductDto extends CreateProductDto {}

// ==================== 商品分类 ====================

export class CreateCategoryDto {
  @ApiPropertyOptional({ description: '父级 ID' })
  @IsOptional()
  @IsNumber()
  pid?: number;

  @ApiProperty({ description: '分类名称' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: '图标' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ description: '图片' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @IsNumber()
  sort?: number;

  @ApiPropertyOptional({ description: '是否显示 1=显示 0=隐藏' })
  @IsOptional()
  @IsNumber()
  is_show?: number;

  @ApiPropertyOptional({ description: '是否首页显示 1=是 0=否' })
  @IsOptional()
  @IsNumber()
  is_home?: number;
}

export class UpdateCategoryDto extends CreateCategoryDto {}

// ==================== 商品评价 ====================

export class ReplyProductDto {
  @ApiProperty({ description: '回复内容' })
  @IsString()
  reply: string;
}

// ==================== 商品标签 ====================

export class CreateProductLabelDto {
  @ApiProperty({ description: '标签名称' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @IsNumber()
  sort?: number;

  @ApiPropertyOptional({ description: '状态 1=正常 0=禁用' })
  @IsOptional()
  @IsNumber()
  status?: number;
}

export class UpdateProductLabelDto extends CreateProductLabelDto {}
