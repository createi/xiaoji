<template>
  <div>
    <PageHeader :title="isEdit ? '商品编辑' : '商品添加'" />

    <a-card>
      <a-form
        :model="formData"
        layout="vertical"
        style="max-width: 700px"
        @finish="handleSave"
      >
        <a-form-item label="商品名称" required>
          <a-input v-model:value="formData.store_name" placeholder="请输入商品名称" />
        </a-form-item>

        <a-form-item label="商品分类">
          <a-select v-model:value="formData.cate_id" placeholder="请选择分类" allow-clear>
            <a-select-option v-for="item in categoryOptions" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="原价">
          <a-input-number v-model:value="formData.ot_price" :min="0" :precision="2" style="width: 100%" placeholder="请输入原价" />
        </a-form-item>

        <a-form-item label="售价" required>
          <a-input-number v-model:value="formData.price" :min="0" :precision="2" style="width: 100%" placeholder="请输入售价" />
        </a-form-item>

        <a-form-item label="库存" required>
          <a-input-number v-model:value="formData.stock" :min="0" style="width: 100%" placeholder="请输入库存" />
        </a-form-item>

        <a-form-item label="商品图片">
          <a-upload
            v-model:file-list="formData.imageFileList"
            list-type="picture-card"
            :before-upload="beforeUpload"
            :max-count="1"
          >
            <div v-if="!formData.imageFileList.length">
              <div style="font-size: 12px; color: #999">点击上传</div>
            </div>
          </a-upload>
        </a-form-item>

        <a-form-item label="商品简介">
          <a-textarea v-model:value="formData.store_info" placeholder="请输入商品简介" :rows="6" />
        </a-form-item>

        <a-form-item label="状态">
          <a-radio-group v-model:value="formData.status">
            <a-radio :value="1">上架</a-radio>
            <a-radio :value="0">下架</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="排序">
          <a-input-number v-model:value="formData.sort" :min="0" style="width: 200px" placeholder="排序值" />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="saving">保存</a-button>
          <a-button style="margin-left: 8px" @click="router.back()">返回</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import PageHeader from '@/components/PageHeader/index.vue';
import { getProductDetail, createProduct, updateProduct, getCategoryAll } from '@/api/product';

const route = useRoute();
const router = useRouter();
const saving = ref(false);
const categoryOptions = ref<any[]>([]);

const productId = computed(() => {
  const id = route.params.id;
  return id ? Number(id) : 0;
});
const isEdit = computed(() => productId.value > 0);

const formData = reactive({
  store_name: '',
  cate_id: undefined as number | undefined,
  ot_price: undefined as number | undefined,
  price: undefined as number | undefined,
  stock: undefined as number | undefined,
  imageFileList: [] as any[],
  store_info: '',
  status: 1,
  sort: 0,
});

function beforeUpload(_file: File) {
  return false;
}

async function fetchCategories() {
  try {
    const res: any = await getCategoryAll();
    categoryOptions.value = res.data || [];
  } catch {
    // use empty
  }
}

async function fetchDetail() {
  if (!isEdit.value) return;
  try {
    const res: any = await getProductDetail(productId.value);
    const detail = res.data || {};
    formData.store_name = detail.store_name || detail.storeName || '';
    formData.cate_id = detail.cate_id ? JSON.parse(detail.cate_id)[0] : undefined;
    formData.ot_price = detail.ot_price;
    formData.price = detail.price;
    formData.stock = detail.stock;
    formData.store_info = detail.store_info || detail.storeInfo || '';
    formData.status = detail.status ?? 1;
    formData.sort = detail.sort ?? 0;
  } catch {
    // use empty
  }
}

async function handleSave() {
  saving.value = true;
  try {
    const payload: Record<string, any> = {
      store_name: formData.store_name,
      cate_id: formData.cate_id ? JSON.stringify([formData.cate_id]) : '[]',
      ot_price: formData.ot_price || 0,
      price: formData.price,
      stock: formData.stock,
      store_info: formData.store_info,
      image: formData.imageFileList.length > 0 ? formData.imageFileList[0].url || '' : '',
      is_show: formData.status,
      sort: formData.sort,
    };
    if (isEdit.value) {
      await updateProduct(productId.value, payload);
      message.success('更新成功');
    } else {
      await createProduct(payload);
      message.success('创建成功');
    }
    router.back();
  } catch {
    message.error('保存失败');
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  fetchCategories();
  fetchDetail();
});
</script>
