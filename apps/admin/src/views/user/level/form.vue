<template>
  <div>
    <PageHeader :title="isEdit ? '编辑等级' : '新建等级'">
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
        <a-form-item label="等级名称" required>
          <a-input v-model:value="formData.name" placeholder="请输入等级名称" />
        </a-form-item>

        <a-form-item label="等级图标URL">
          <a-input v-model:value="formData.image" placeholder="请输入等级图标URL" />
        </a-form-item>

        <a-form-item label="等级值" required>
          <a-input-number v-model:value="formData.grade" :min="0" style="width: 100%" placeholder="请输入等级值" />
        </a-form-item>

        <a-form-item label="一级佣金比例%">
          <a-input-number v-model:value="formData.one_brokerage_percent" :min="0" :max="100" style="width: 100%" placeholder="请输入一级佣金比例" />
        </a-form-item>

        <a-form-item label="二级佣金比例%">
          <a-input-number v-model:value="formData.two_brokerage_percent" :min="0" :max="100" style="width: 100%" placeholder="请输入二级佣金比例" />
        </a-form-item>

        <a-form-item label="任务总数">
          <a-input-number v-model:value="formData.task_total_num" :min="0" style="width: 100%" placeholder="请输入任务总数" />
        </a-form-item>

        <a-form-item label="已完成任务数">
          <a-input-number v-model:value="formData.task_num" :min="0" style="width: 100%" placeholder="请输入已完成任务数" />
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
  getUserLevelDetail,
  createUserLevel,
  updateUserLevel,
} from '@/api/user';

const route = useRoute();
const router = useRouter();
const saving = ref(false);

const levelId = computed(() => {
  const id = route.params.id;
  return id ? Number(id) : 0;
});
const isEdit = computed(() => levelId.value > 0);

const formData = reactive({
  name: '',
  image: '',
  grade: undefined as number | undefined,
  one_brokerage_percent: undefined as number | undefined,
  two_brokerage_percent: undefined as number | undefined,
  task_total_num: undefined as number | undefined,
  task_num: undefined as number | undefined,
  status: 1,
});

async function fetchDetail() {
  if (!isEdit.value) return;
  try {
    const res: any = await getUserLevelDetail(levelId.value);
    const detail = res.data || {};
    formData.name = detail.name || '';
    formData.image = detail.image || '';
    formData.grade = detail.grade;
    formData.one_brokerage_percent = detail.one_brokerage_percent;
    formData.two_brokerage_percent = detail.two_brokerage_percent;
    formData.task_total_num = detail.task_total_num;
    formData.task_num = detail.task_num;
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
      image: formData.image,
      grade: formData.grade,
      one_brokerage_percent: formData.one_brokerage_percent,
      two_brokerage_percent: formData.two_brokerage_percent,
      task_total_num: formData.task_total_num,
      task_num: formData.task_num,
      status: formData.status,
    };
    if (isEdit.value) {
      await updateUserLevel(levelId.value, payload);
      message.success('更新成功');
    } else {
      await createUserLevel(payload);
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
