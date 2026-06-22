<template>
  <div>
    <PageHeader title="签到管理" />

    <a-tabs v-model:activeKey="activeTab">
      <a-tab-pane key="config" tab="签到配置">
        <a-card>
          <a-form layout="vertical" style="max-width: 600px">
            <a-form-item label="签到类型">
              <a-radio-group v-model:value="signConfig.type">
                <a-radio :value="1">连续签到</a-radio>
                <a-radio :value="2">累计签到</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="签到奖励规则">
              <a-table
                :columns="rewardColumns"
                :data-source="signConfig.rewards"
                :pagination="false"
                row-key="day"
                size="small"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'number'">
                    <a-input-number v-model:value="record.number" :min="0" size="small" />
                  </template>
                  <template v-if="column.key === 'status'">
                    <a-switch v-model:checked="record.status" size="small" />
                  </template>
                </template>
              </a-table>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="handleSaveConfig">保存配置</a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-tab-pane>

      <a-tab-pane key="record" tab="签到记录">
        <SearchForm>
          <a-form layout="inline" :model="recordParams" @finish="handleSearchRecord">
            <a-form-item label="用户">
              <a-input v-model:value="recordParams.nickname" placeholder="昵称/UID" allow-clear style="width: 180px" />
            </a-form-item>
            <a-form-item label="时间范围">
              <a-range-picker v-model:value="dateRange" style="width: 240px" />
            </a-form-item>
            <a-form-item>
              <a-space>
                <a-button type="primary" html-type="submit">搜索</a-button>
                <a-button @click="resetRecordSearch">重置</a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </SearchForm>

        <a-card>
          <a-table
            :columns="recordColumns"
            :data-source="recordData"
            :loading="recordLoading"
            :pagination="recordPagination"
            row-key="id"
            @change="handleRecordTableChange"
          />
        </a-card>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import PageHeader from '@/components/PageHeader/index.vue';
import SearchForm from '@/components/SearchForm/index.vue';

const activeTab = ref('config');
const dateRange = ref<any>(null);
const recordLoading = ref(false);

const signConfig = reactive({
  type: 1,
  rewards: [
    { day: 1, number: 1, status: true },
    { day: 2, number: 2, status: true },
    { day: 3, number: 3, status: true },
    { day: 4, number: 5, status: true },
    { day: 5, number: 8, status: true },
    { day: 6, number: 10, status: true },
    { day: 7, number: 15, status: true },
  ],
});

const rewardColumns = [
  { title: '连续天数', dataIndex: 'day', key: 'day', width: 100 },
  { title: '获得积分', key: 'number', width: 150 },
  { title: '状态', key: 'status', width: 80 },
];

const recordParams = reactive({
  nickname: '',
  start_time: '',
  end_time: '',
  page: 1,
  limit: 15,
});

const recordPagination = reactive({
  current: 1,
  pageSize: 15,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
});

const recordData = ref<any[]>([]);

const recordColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
  { title: '用户', dataIndex: 'nickname', key: 'nickname', width: 120 },
  { title: '连续签到', dataIndex: 'sign_num', key: 'sign_num', width: 100 },
  { title: '获得积分', dataIndex: 'integral', key: 'integral', width: 100 },
  { title: '签到时间', dataIndex: 'add_time', key: 'add_time', width: 170 },
];

function handleSaveConfig() {
  message.success('签到配置保存成功');
}

function handleSearchRecord() {
  recordParams.page = 1;
  recordPagination.current = 1;
}

function resetRecordSearch() {
  recordParams.nickname = '';
  recordParams.start_time = '';
  recordParams.end_time = '';
  dateRange.value = null;
  handleSearchRecord();
}

function handleRecordTableChange(pag: any) {
  recordParams.page = pag.current;
  recordParams.limit = pag.pageSize;
  recordPagination.current = pag.current;
  recordPagination.pageSize = pag.pageSize;
}

onMounted(() => {
  recordLoading.value = false;
});
</script>
