<template>
  <div>
    <PageHeader :title="isEdit ? '编辑分组' : '新建分组'">
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
        <a-form-item label="分组名称" required>
          <a-input v-model:value="formData.name" placeholder="请输入分组名称" />
        </a-form-item>

        <a-form-item label="分组图标URL">
          <a-input v-model:value="formData.image" placeholder="请输入分组图标URL" />
        </a-form-item>

        <a-form-item label="排序">
          <a-input-number v-model:value="formData.sort" :min="0" style="width: 100%" placeholder="请输入排序值" />
        </a-form-item>

        <a-form-item label="状态">
          <a-switch v-model:checked="formData.status" :checked-value="1" :un-checked-value="0" checked-children="启用" un-checked-children="禁用" />
        </a-form-item>

        <a-form-item label="是否显示">
          <a-switch v-model:checked="formData.is_show" :checked-value="1" :un-checked-value="0" checked-children="显示" un-checked-children="隐藏" />
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
  getUserGroupDetail,
  createUserGroup,
  updateUserGroup,
} from '@/api/user';

const route = useRoute();
const router = useRouter();
const saving = ref(false);

const groupId = computed(() => {
  const id = route.params.id;
  return id ? Number(id) : 0;
});
const isEdit = computed(() => groupId.value > 0);

const formData = reactive({
  name: '',
  image: '',
  sort: 0,
  status: 1,
  is_show: 1,
});

async function fetchDetail() {
  if (!isEdit.value) return;
  try {
    const res: any = await getUserGroupDetail(groupId.value);
    const detail = res.data || {};
    formData.name = detail.name || '';
    formData.image = detail.image || '';
    formData.sort = detail.sort ?? 0;
    formData.status = detail.status ?? 1;
    formData.is_show = detail.is_show ?? 1;
  } catch {
    message.error('获取详情失败');
  }
}

async function handleSave() {
  saving.value = true;
  try {
    const payload: Record<string, any> = {
      name: formData.name,
      image: formData.image,
      sort: formData.sort,
      status: formData.status,
      is_show: formData.is_show,
    };
    if (isEdit.value) {
      await updateUserGroup(groupId.value, payload);
      message.success('更新成功');
    } else {
      await createUserGroup(payload);
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
