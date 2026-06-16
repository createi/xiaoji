import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryProductDto, CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getList(query: QueryProductDto) {
    const { page = 1, limit = 10, store_name, product_type, cate_id, spec_type, is_show, start_time, end_time } = query;
    const where: any = { isDel: 0 };

    if (store_name) {
      where.storeName = { contains: store_name };
    }
    if (product_type !== undefined) {
      where.productType = product_type;
    }
    if (cate_id !== undefined) {
      where.cateId = { contains: String(cate_id) };
    }
    if (spec_type !== undefined) {
      where.specType = spec_type;
    }
    if (is_show !== undefined) {
      where.isShow = is_show;
    }
    if (start_time || end_time) {
      where.addTime = {};
      if (start_time) where.addTime.gte = BigInt(new Date(start_time).getTime());
      if (end_time) where.addTime.lte = BigInt(new Date(end_time).getTime());
    }

    const [list, total] = await Promise.all([
      this.prisma.storeProduct.findMany({
        where,
        include: {
          attrs: { select: { price: true, stock: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ sort: 'asc' }, { id: 'desc' }],
      }),
      this.prisma.storeProduct.count({ where }),
    ]);

    return {
      data: list.map((item: any) => ({
        id: item.id,
        store_name: item.storeName,
        image: item.image,
        price: item.price,
        sales: item.sales,
        stock: item.stock,
        sort: item.sort,
        is_show: item.isShow,
        product_type: item.productType,
        spec_type: item.specType,
        is_hot: item.isHot,
        is_best: item.isBest,
        is_new: item.isNew,
        add_time: item.addTime,
      })),
      total,
      page,
      limit,
    };
  }

  async getDetail(id: number) {
    const product = await this.prisma.storeProduct.findUnique({
      where: { id },
      include: {
        attrs: true,
        attrResults: true,
      },
    });

    if (!product) {
      throw new NotFoundException('商品不存在');
    }

    return product;
  }

  async create(data: CreateProductDto) {
    return this.prisma.storeProduct.create({
      data: {
        storeName: data.store_name,
        storeInfo: data.store_info || '',
        image: data.image,
        sliderImage: data.slider_image || '[]',
        videoLink: data.video_link || '',
        cateId: data.cate_id || '[]',
        price: data.price,
        otPrice: data.ot_price || 0,
        costPrice: data.cost_price || 0,
        vipPrice: data.vip_price || 0,
        productType: data.product_type || 0,
        giveIntegral: data.give_integral || 0,
        stock: data.stock,
        unitName: data.unit_name || '件',
        sort: data.sort || 0,
        isShow: data.is_show ?? 1,
        isHot: data.is_hot || 0,
        isBest: data.is_best || 0,
        isNew: data.is_new || 0,
        specType: data.spec_type || 0,
        keyword: data.keyword || '',
        tempId: data.temp_id || 0,
        postage: data.postage || 0,
        isPostage: data.is_postage || 0,
        logistics: data.logistics || '[]',
        brokerage: data.brokerage || 0,
        brokerageTwo: data.brokerage_two || 0,
        activity: data.activity || '[]',
        labelId: data.label_id || '[]',
        couponIds: data.coupon_ids || '[]',
        limitNum: data.limit_num || 0,
        fictitiousContent: data.fictitious_content || '',
        presaleTime: data.presale_time || '[]',
        protectionList: data.protection_list || '[]',
        addTime: BigInt(Date.now()),
        status: 1,
      },
    });
  }

  async update(id: number, data: UpdateProductDto) {
    const product = await this.prisma.storeProduct.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('商品不存在');
    }

    return this.prisma.storeProduct.update({
      where: { id },
      data: {
        ...(data.store_name !== undefined && { storeName: data.store_name }),
        ...(data.store_info !== undefined && { storeInfo: data.store_info }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.slider_image !== undefined && { sliderImage: data.slider_image }),
        ...(data.video_link !== undefined && { videoLink: data.video_link }),
        ...(data.cate_id !== undefined && { cateId: data.cate_id }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.ot_price !== undefined && { otPrice: data.ot_price }),
        ...(data.cost_price !== undefined && { costPrice: data.cost_price }),
        ...(data.vip_price !== undefined && { vipPrice: data.vip_price }),
        ...(data.product_type !== undefined && { productType: data.product_type }),
        ...(data.give_integral !== undefined && { giveIntegral: data.give_integral }),
        ...(data.stock !== undefined && { stock: data.stock }),
        ...(data.unit_name !== undefined && { unitName: data.unit_name }),
        ...(data.sort !== undefined && { sort: data.sort }),
        ...(data.is_show !== undefined && { isShow: data.is_show }),
        ...(data.is_hot !== undefined && { isHot: data.is_hot }),
        ...(data.is_best !== undefined && { isBest: data.is_best }),
        ...(data.is_new !== undefined && { isNew: data.is_new }),
        ...(data.spec_type !== undefined && { specType: data.spec_type }),
        ...(data.keyword !== undefined && { keyword: data.keyword }),
        ...(data.temp_id !== undefined && { tempId: data.temp_id }),
        ...(data.postage !== undefined && { postage: data.postage }),
        ...(data.is_postage !== undefined && { isPostage: data.is_postage }),
        ...(data.logistics !== undefined && { logistics: data.logistics }),
        ...(data.brokerage !== undefined && { brokerage: data.brokerage }),
        ...(data.brokerage_two !== undefined && { brokerageTwo: data.brokerage_two }),
        ...(data.activity !== undefined && { activity: data.activity }),
        ...(data.label_id !== undefined && { labelId: data.label_id }),
        ...(data.coupon_ids !== undefined && { couponIds: data.coupon_ids }),
        ...(data.limit_num !== undefined && { limitNum: data.limit_num }),
      },
    });
  }

  async delete(id: number) {
    const product = await this.prisma.storeProduct.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('商品不存在');
    }

    // 软删除
    return this.prisma.storeProduct.update({
      where: { id },
      data: { isDel: 1 },
    });
  }

  async setStatus(id: number, isShow: number) {
    const product = await this.prisma.storeProduct.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('商品不存在');
    }

    return this.prisma.storeProduct.update({
      where: { id },
      data: { isShow },
    });
  }
}
