<template>
  <div>
    <PageHeader :title="isEdit ? '编辑标签' : '新建标签'">
      <a-button @click="router.back()">
        <template #icon><arrow-left-outlined /></template>
        返回
      </a-button>
    </PageHeader>

    <a-card>
      <a-form
        :model="formData"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
        style="max-width: 700px"
        @finish="handleSave"
      >
        <a-form-item label="标签名称" required>
          <a-input v-model:value="formData.name" placeholder="请输入标签名称" />
        </a-form-item>

        <a-form-item label="颜色">
          <a-input v-model:value="formData.color" placeholder="请输入颜色值，如 #FF5722" />
        </a-form-item>

        <a-form-item label="排序">
          <a-input-number v-model:value="formData.sort" :min="0" style="width: 100%" placeholder="请输入排序值" />
        </a-form-item>

        <a-form-item label="状态">
          <a-switch v-model:checked="formData.status" :checked-value="1" :un-checked-value="0" checked-children="启用" un-checked-children="禁用" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
          <a-button type="primary" html-type="submit" :loading="saving">保存</a-button>
          <a-button style="margin-left: 8px" @click="router.back()">取消</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { ArrowLeftOutlined } from '@ant-design/icons-vue';
import PageHeader from '@/components/PageHeader/index.vue';
import {
  getUserLabelDetail,
  createUserLabel,
  updateUserLabel,
} from '@/api/user';

const route = useRoute();
const router = useRouter();
const saving = ref(false);

const labelId = computed(() => {
  const id = route.params.id;
  return id ? Number(id) : 0;
});
const isEdit = computed(() => labelId.value > 0);

const formData = reactive({
  name: '',
  color: '',
  sort: 0,
  status: 1,
});

async function fetchDetail() {
  if (!isEdit.value) return;
  try {
    const res: any = await getUserLabelDetail(labelId.value);
    const detail = res.data || {};
    formData.name = detail.name || '';
    formData.color = detail.color || '';
    formData.sort = detail.sort ?? 0;
    formData.status = detail.status ?? 1;
  } catch {
    message.error('获取详情失败');
  }
}

async function handleSave() {
  saving.value = true;
  try {
    const payload: Record<string, any> = {
      name: formData.name,
      color: formData.color,
      sort: formData.sort,
      status: formData.status,
    };
    if (isEdit.value) {
      await updateUserLabel(labelId.value, payload);
      message.success('更新成功');
    } else {
      await createUserLabel(payload);
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
  fetchDetail();
});
</script>
